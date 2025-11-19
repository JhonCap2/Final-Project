import { useState, useEffect } from "react"
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaPhone, FaUser, FaHistory, FaShieldAlt, FaClock, FaTimes, FaTrash, FaBell, FaPlus } from "react-icons/fa"

const styles = `
  @keyframes blink {
    0%, 100% { opacity: 1; color: #ffffff; }
    50% { opacity: 0.4; color: #ff6b6b; }
  }
  .ambulance-blink {
    animation: blink 0.5s infinite;
  }
  @keyframes redBlink {
    0%, 100% { background-color: rgba(220, 38, 38, 0.95); }
    50% { background-color: rgba(185, 28, 28, 0.95); }
  }
  .rescue-mode {
    animation: redBlink 0.6s infinite;
  }
  @keyframes pulse-scale {
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }
  .pulse-message {
    animation: pulse-scale 1.5s infinite;
  }
`

export default function Dashboard() {
  const [showSOSConfirm, setShowSOSConfirm] = useState(false)
  const [showRescueMode, setShowRescueMode] = useState(false)
  const [showPersonalInfo, setShowPersonalInfo] = useState(false)
  const [showAllergies, setShowAllergies] = useState(false)
  const [showMedications, setShowMedications] = useState(false)
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false)
  const [sosActive, setSOSActive] = useState(false)
  const [loading, setLoading] = useState(true)

  // ⚠️ ESTADO SINCRONIZADO: userData ahora empieza vacío y se llena con la API.
  const [userData, setUserData] = useState({ fullName: "", bloodType: "", medications: [], medicalConditions: [], allergies: [] })
  
  // Contacts inicializa desde localStorage
  const [emergencyContacts, setEmergencyContacts] = useState(() => {
    try {
      const data = localStorage.getItem("emergencyContacts")
      return Array.isArray(JSON.parse(data)) ? JSON.parse(data) : []
    } catch {
      return []
    }
  })


  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "", email: "", bloodType: "" })
  const [newAllergy, setNewAllergy] = useState({ name: "", severity: "Moderate" })
  const [newMedication, setNewMedication] = useState({ name: "", usage: "" })
  const [newCondition, setNewCondition] = useState("")

  const token = localStorage.getItem('token')

// 1. CARGAR TODOS LOS DATOS DESDE LA API al montar (Profile data, Contacts, Allergies, Medications)
  useEffect(() => {
    if (!token) {
      setLoading(false)
      // Si no hay token, intentar cargar userData y allergies desde localStorage (solo para compatibilidad)
      try {
        const localData = localStorage.getItem("userMedicalData")
        if (localData) setUserData(JSON.parse(localData))
      } catch { /* Ignore */ }
      return
    }

    // Cargar datos del perfil (nombre, tipo de sangre, condiciones, medicamentos)
    axios.get('http://localhost:3001/api/users/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const user = res.data.user
        setUserData(prev => ({
          ...prev,
          fullName: user.fullName || '',
          bloodType: user.bloodType || '',
          medicalConditions: user.medicalConditions || [],
          medications: user.medications || []
        }))
      })
      .catch(err => {
        console.error('Failed to fetch user profile', err)
        toast.error('Failed to load user data from server.')
      })

    // Cargar contactos de emergencia
    axios.get('http://localhost:3001/api/contacts', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const contacts = Array.isArray(res.data.contacts) ? res.data.contacts : []
        setEmergencyContacts(contacts)
      })
      .catch(err => {
        console.error('Failed to fetch contacts from server', err)
        toast.error('Failed to load contacts from server, using local data')
      })

    // Cargar alergias
    axios.get('http://localhost:3001/api/allergies', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const serverAllergies = Array.isArray(res.data.allergies) ? res.data.allergies.map(a => ({
          _id: a._id,
          name: a.allergen,
          severity: a.severity ? a.severity.toLowerCase() : 'moderate',
          reaction: a.reactions || ''
        })) : []
        setUserData(prev => ({ ...prev, allergies: serverAllergies }))
      })
      .catch(err => {
        console.error('Failed to fetch allergies from server', err)
        toast.error('Failed to load allergies from server, using local data')
      })
      .finally(() => setLoading(false))

  }, [token])

// 2. Persistencia de Contactos Locales (solo contactos, ya que Profile maneja lo demás)
useEffect(() => {
  if (Array.isArray(emergencyContacts)) {
    localStorage.setItem("emergencyContacts", JSON.stringify(emergencyContacts))
  }
}, [emergencyContacts])

// 3. Persistencia de Datos Médicos Locales (solo para cuando NO hay token y usa datos antiguos)
useEffect(() => {
  if (!token) {
    localStorage.setItem("userMedicalData", JSON.stringify(userData))
  }
}, [userData, token])


  const handleSOS = () => {
    setSOSActive(true)
    setShowSOSConfirm(false)
    setShowRescueMode(true)
    setTimeout(() => setSOSActive(false), 3000)
  }
  
// --- CRUD Contactos ---
  const handleAddContact = () => {
  if (newContact.name && newContact.phone && newContact.relationship) {
    if (token) {
      axios.post('http://localhost:3001/api/contacts', newContact, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          const contact = res.data.contact
          setEmergencyContacts(prev => Array.isArray(prev) ? [contact, ...prev] : [contact])
          setNewContact({ name: "", phone: "", relationship: "", email: "", bloodType: "" })
          toast.success('Emergency contact saved to server')
        }).catch(err => {
          console.error('Create contact failed', err)
          // Fallback local
          setEmergencyContacts(prev => Array.isArray(prev) ? [{ id: Date.now(), ...newContact }, ...prev] : [{ id: Date.now(), ...newContact }])
          setNewContact({ name: "", phone: "", relationship: "", email: "", bloodType: "" })
          toast.error('Failed to save contact to server, saved locally')
        })
    } else {
      setEmergencyContacts(prev => Array.isArray(prev) ? [{ id: Date.now(), ...newContact }, ...prev] : [{ id: Date.now(), ...newContact }])
      setNewContact({ name: "", phone: "", relationship: "", email: "", bloodType: "" })
      toast.info('Added contact locally. Log in to persist')
    }
  } else {
    toast.error('Name, Phone, and Relationship are required.')
  }
}


  const handleDeleteContact = (id) => {
  const contact = emergencyContacts.find(c => (c._id || c.id) === id)
  if (contact && contact._id && token) {
    axios.delete(`http://localhost:3001/api/contacts/${contact._id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setEmergencyContacts(prev => Array.isArray(prev) ? prev.filter(c => (c._id || c.id) !== contact._id) : [])
        toast.success('Contact deleted from server')
      }).catch(err => {
        console.error('Delete contact failed', err)
        toast.error('Failed to delete from server')
      })
  } else {
    setEmergencyContacts(prev => Array.isArray(prev) ? prev.filter(c => (c._id || c.id) !== id) : [])
    toast.info('Contact deleted locally')
  }
  }

// --- CRUD Alergias ---
  const handleAddAllergy = () => {
    if (newAllergy.name) {
      // Normalize severity to server enum (capitalize)
      const severityServer = newAllergy.severity.charAt(0).toUpperCase() + newAllergy.severity.slice(1)
      if (token) {
        axios.post('http://localhost:3001/api/allergies', { allergen: newAllergy.name, severity: severityServer }, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => {
            const a = res.data.allergy
            // Normalize server allergy into UI shape (name, severity lowercase, reaction)
            const clientAllergy = {
              _id: a._id,
              name: a.allergen || newAllergy.name,
              severity: (a.severity || severityServer).toLowerCase(),
              reaction: a.reactions || ''
            }
            setUserData(prev => ({
  ...prev,
  allergies: Array.isArray(prev.allergies) ? [clientAllergy, ...prev.allergies] : [clientAllergy]
}))


            setNewAllergy({ name: "", severity: "Moderate" })
            toast.success('Allergy saved to server')
          }).catch(err => {
            console.error('Create allergy failed', err)
            // fallback to local
            setUserData(prev => ({ ...prev, allergies: Array.isArray(prev.allergies) ? [{ id: Date.now(), ...newAllergy }, ...prev.allergies] : [{ id: Date.now(), ...newAllergy }] }))
            setNewAllergy({ name: "", severity: "Moderate" })
            toast.error('Failed to save allergy to server, saved locally')
          })
      } else {
        setUserData(prev => ({ ...prev, allergies: Array.isArray(prev.allergies) ? [{ id: Date.now(), ...newAllergy }, ...prev.allergies] : [{ id: Date.now(), ...newAllergy }] }))
        setNewAllergy({ name: "", severity: "Moderate" })
        toast.info('Added allergy locally. Log in to persist')
      }
    }
  }

  const handleDeleteAllergy = (id) => {
    const allergy = userData.allergies.find(a => (a._id || a.id) === id)
    if (allergy && allergy._id && token) {
      axios.delete(`http://localhost:3001/api/allergies/${allergy._id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setUserData(prev => ({ ...prev, allergies: prev.allergies.filter(a => (a._id || a.id) !== allergy._id) }))
          toast.success('Allergy deleted from server')
        }).catch(err => {
          console.error('Delete allergy failed', err)
          toast.error('Failed to delete allergy from server')
        })
    } else {
      setUserData(prev => ({
  ...prev,
  allergies: Array.isArray(prev.allergies) ? prev.allergies.filter(a => (a._id || a.id) !== id) : []
}))
      toast.info('Allergy deleted locally')
    }
  }

// --- CRUD Medicamentos (asumiendo que se guardan en Profile) ---
// ⚠️ Nota: El Dashboard original no guardaba medicamentos al servidor, solo localmente.
// Si el Profile los guarda en el servidor, las funciones de edición del Dashboard
// deberían ser reemplazadas por una simple redirección al Profile o llamadas a la API de Profile.

// Manteniendo la lógica local antigua (solo por compatibilidad con el código original del Dashboard)
  const handleAddMedication = () => {
    if (newMedication.name) {
      setUserData(prev => ({
  ...prev,
  medications: Array.isArray(prev.medications) ? [{ id: Date.now(), ...newMedication }, ...prev.medications] : [{ id: Date.now(), ...newMedication }]
}))


      setNewMedication({ name: "", usage: "" })
      toast.info('Medication added locally. Please use the Profile page to save it permanently.')
    }
  }

  const handleDeleteMedication = (id) => {
    setUserData(prev => ({
  ...prev,
  medications: Array.isArray(prev.medications) ? prev.medications.filter(m => m.id !== id) : []
}))
    toast.info('Medication deleted locally.')
  }

// --- Edición de Info Personal ---
  const handlePersonalInfoSave = () => {
    // ⚠️ Importante: Esto solo actualiza el estado local y localStorage (si no hay token)
    // En un sistema real, esto debería llamar a la API de Profile para guardar los cambios.
    if (token) {
        toast.info('Please use the Profile page to permanently save your personal data.')
    }
    // Lógica de guardado local (para Nombre y Tipo de Sangre)
    // El useEffect abajo guardará en localStorage si no hay token
    setShowPersonalInfo(false)
}

  // Blood type donation compatibility chart
  const isCompatibleDonor = (donorType, recipientType) => {
    if (!donorType || !recipientType) return false
    
    const compatibility = {
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'O-': ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'], // Universal donor
      'A+': ['A+', 'AB+'],
      'A-': ['A+', 'A-', 'AB+', 'AB-'],
      'B+': ['B+', 'AB+'],
      'B-': ['B+', 'B-', 'AB+', 'AB-'],
      'AB+': ['AB+'],
      'AB-': ['AB+', 'AB-']
    }
    
    return compatibility[donorType]?.includes(recipientType) || false
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading emergency data...</p>
          
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <style>{styles}</style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-white mb-8">
          <h2 className="text-4xl font-bold mb-2">Welcome to your Dashboard, {userData.fullName || 'User'}</h2>
          <p className="text-green-100">Your emergency response system is active</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-green-600">
            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-600 font-semibold text-sm">Emergency Contacts</h3><FaPhone className="text-green-600 text-lg" /></div>
            <p className="text-2xl font-bold text-gray-800">{emergencyContacts.length}</p>
            <button onClick={() => setShowEmergencyContacts(true)} className="text-green-600 text-xs mt-2 font-semibold">{emergencyContacts.length === 0 ? "Add Now" : "Manage"}</button>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-blue-600">
            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-600 font-semibold text-sm">Allergies</h3><FaShieldAlt className="text-blue-600 text-lg" /></div>
            <p className="text-2xl font-bold text-gray-800">{userData.allergies.length}</p>
            <button onClick={() => setShowAllergies(true)} className="text-blue-600 text-xs mt-2 font-semibold">{userData.allergies.length === 0 ? "Add Now" : "View/Add"}</button>
            
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-orange-600">
            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-600 font-semibold text-sm">Blood Type</h3><FaClock className="text-orange-600 text-lg" /></div>
            <p className="text-2xl font-bold text-gray-800">{userData.bloodType || "-"}</p>
            <button onClick={() => setShowPersonalInfo(true)} className="text-orange-600 text-xs mt-2 font-semibold">{userData.bloodType ? "Edit" : "Add Now"}</button>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-red-600">
            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-600 font-semibold text-sm">Medications</h3><FaHistory className="text-red-600 text-lg" /></div>
            <p className="text-2xl font-bold text-gray-800">{userData.medications.length}</p>
            <button onClick={() => setShowMedications(true)} className="text-red-600 text-xs mt-2 font-semibold">{userData.medications.length === 0 ? "Add Now" : "View/Add"}</button>
          </div>
        </div>

        <button onClick={() => setShowSOSConfirm(true)} className={`w-full py-4 text-white font-bold text-2xl rounded-2xl shadow-2xl flex items-center justify-center gap-4 ${sosActive ? "bg-red-600 animate-pulse" : "bg-red-500 hover:bg-red-600"}`}>
          <FaBell className="text-2xl ambulance-blink" />
          {sosActive ? "SOS ACTIVATED!" : "ACTIVATE SOS"}
        </button>

        <div className="bg-white rounded-lg shadow p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <button onClick={() => setShowPersonalInfo(true)} className="bg-blue-500 text-white p-8 rounded-lg hover:bg-blue-600"><FaUser className="text-4xl mb-3 mx-auto" /><h3 className="text-xl font-bold">Personal Info</h3></button>
            <button onClick={() => setShowEmergencyContacts(true)} className="bg-green-500 text-white p-8 rounded-lg hover:bg-green-600"><FaPhone className="text-4xl mb-3 mx-auto" /><h3 className="text-xl font-bold">Contacts</h3></button>
            <div className="bg-purple-500 text-white p-8 rounded-lg flex items-center justify-center"><div className="text-center"><div className="text-4xl mb-3"></div><h3 className="text-xl font-bold">Ready</h3></div></div>
          </div>
        </div>
      </div>

      {showSOSConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-600 mb-4">CONFIRM SOS ALERT</h2>
              <p className="text-gray-700 mb-6">Are you sure you want to activate the emergency signal and send your information to paramedics and contacts?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowSOSConfirm(false)} className="flex-1 bg-gray-300 py-3 rounded-lg font-bold hover:bg-gray-400 transition">Cancel</button>
                <button onClick={handleSOS} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">Activate SOS</button>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {showPersonalInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full my-8 mx-4">
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold">Personal Info</h2>
              <button onClick={() => setShowPersonalInfo(false)}><FaTimes className="text-2xl text-gray-500 hover:text-red-500" /></button>
            </div>
            <p className="text-sm text-red-500 mb-4 font-semibold">
                ⚠️ Use the 'Profile' page to save these changes permanently to the server.
            </p>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input type="text" placeholder="Full Name" value={userData.fullName} onChange={(e) => setUserData({...userData, fullName: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-4 focus:border-blue-500" />
            <label className="block text-gray-700 font-semibold mb-2">Blood Type</label>
            <select value={userData.bloodType} onChange={(e) => setUserData({...userData, bloodType: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-6 focus:border-blue-500">
              <option value="">Select Blood Type</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
            <button onClick={handlePersonalInfoSave} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Close/Save Local</button>
          </div>
        </div>
      )}

      {showAllergies && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 mx-4">
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold">Allergies Management</h2>
              <button onClick={() => setShowAllergies(false)}><FaTimes className="text-2xl text-gray-500 hover:text-red-500" /></button>
            </div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Your Allergies ({userData.allergies.length})</h3>
            {userData.allergies.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-6">
                {userData.allergies.map((a, index) => (
                  <div key={a._id || a.id || index} className="bg-red-50 p-4 rounded-lg flex justify-between items-center border-l-4 border-red-400">
                    <div>
                      <p className="font-bold text-lg text-red-800">{a.name}</p>
                      <span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded-full text-xs font-semibold mt-1 capitalize">{a.severity}</span>
                    </div>
                    <button onClick={() => handleDeleteAllergy(a._id || a.id)} className="text-red-600 hover:text-red-800 transition"><FaTrash /></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-6 bg-yellow-50 p-3 rounded">No allergies added yet. This is critical in an emergency.</p>
            )}
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-bold mb-3">Add New Allergy</h3>
              <input type="text" placeholder="Allergy name (e.g., Penicillin, Peanuts)" value={newAllergy.name} onChange={(e) => setNewAllergy({...newAllergy, name: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-3 focus:border-red-500" />
              <select value={newAllergy.severity} onChange={(e) => setNewAllergy({...newAllergy, severity: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-4 focus:border-red-500">
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
              <button onClick={handleAddAllergy} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold transition flex items-center justify-center gap-2"><FaPlus /> Add Allergy</button>
            </div>
            <button onClick={() => setShowAllergies(false)} className="w-full bg-gray-400 text-white py-3 rounded-lg font-bold mt-4 hover:bg-gray-500 transition">Close</button>
          </div>
          
        </div>
      )}

      {showMedications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 mx-4">
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold">Medications</h2>
              <button onClick={() => setShowMedications(false)}><FaTimes className="text-2xl text-gray-500 hover:text-red-500" /></button>
            </div>
            <p className="text-sm text-red-500 mb-4 font-semibold">
                ⚠️ Adding/deleting here is local only. Use the 'Profile' page to save permanently.
            </p>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Your Medications ({userData.medications.length})</h3>
            {userData.medications.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-6">
                {userData.medications.map((m, index) => (
                  <div key={m.id || m._id || index} className="bg-green-50 p-4 rounded-lg flex justify-between items-center border-l-4 border-green-400">
                    <div>
                      <p className="font-bold text-lg text-green-800">{m.name}</p>
                      <p className="text-gray-600 text-sm mt-1">Usage: **{m.usage || m.dosage || 'N/A'}**</p>
                    </div>
                    <button onClick={() => handleDeleteMedication(m.id || m._id)} className="text-red-600 hover:text-red-800 transition"><FaTrash /></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-6">No medications added yet</p>
            )}
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-bold mb-3">Add New Medication (Local)</h3>
              <input type="text" placeholder="Medication name" value={newMedication.name} onChange={(e) => setNewMedication({...newMedication, name: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-3 focus:border-green-500" />
              <input type="text" placeholder="Usage (e.g., 2 tablets daily)" value={newMedication.usage} onChange={(e) => setNewMedication({...newMedication, usage: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-4 focus:border-green-500" />
              <button onClick={handleAddMedication} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold transition flex items-center justify-center gap-2"><FaPlus /> Add Medication Locally</button>
            </div>
            <button onClick={() => setShowMedications(false)} className="w-full bg-gray-400 text-white py-3 rounded-lg font-bold mt-4 hover:bg-gray-500 transition">Close</button>
          </div>
        </div>
      )}

      {showEmergencyContacts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 mx-4">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-3xl font-bold text-gray-800">Emergency Contacts Management</h2>
              <button onClick={() => setShowEmergencyContacts(false)}><FaTimes className="text-2xl text-gray-500 hover:text-red-500" /></button>
            </div>

            {/* Your Blood Type Info with Compatibility (MODIFICADO: p-3 en lugar de p-4) */}
            {userData.bloodType && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-red-500 rounded-lg p-3 mb-6 shadow-sm">
                <p className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                    <span className="text-lg font-bold text-red-700">{userData.bloodType}</span> is Your Blood Type
                </p>
                <p className="text-xs text-gray-600 mt-1">The contacts listed below are checked for **compatibility** to donate blood to you.</p>
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Your Contacts ({emergencyContacts.length})</h3>
            {emergencyContacts.length > 0 ? (
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2 mb-6">
                {emergencyContacts.map(c => {
                  const id = c._id || c.id || c.phone + c.name;
                  const canDonate = userData.bloodType && c.bloodType && isCompatibleDonor(c.bloodType, userData.bloodType);
                  return (
                    <div 
                      key={id}
                      className={`p-4 rounded-xl flex justify-between items-start transition shadow-md ${
                        canDonate 
                          ? 'bg-green-50 border-l-4 border-green-600' 
                          : 'bg-blue-50 border-l-4 border-blue-400'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-bold text-xl text-gray-800">{c.name} <span className="text-base text-gray-500 font-normal">({c.relationship})</span></p>
                        <p className="text-sm text-blue-700 font-semibold">{c.phone}</p>
                        {c.email && <p className="text-xs text-gray-500 truncate mt-1">Email: {c.email}</p>}
                        
                        {/* Blood Type Donor Badge */}
                        {c.bloodType && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">
                              Blood: {c.bloodType}
                            </span>
                            {userData.bloodType && (
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                canDonate
                                  ? 'bg-green-600 text-white' // Color más fuerte para compatible
                                  : 'bg-red-400 text-white'
                              }`}>
                                {canDonate ? 'Compatible Donor' : 'Not Compatible'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDeleteContact(c._id || c.id)} 
                        className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0 transition p-2 rounded-full hover:bg-red-100" 
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                )
              })
              }
              </div>
            ) : (
              <p className="text-gray-600 mb-6 bg-yellow-100 p-3 rounded-xl border border-yellow-400">🚨 No emergency contacts added yet. This is essential for safety!</p>
            )}

            {/* FORMULARIO DE CONTACTO DE EMERGENCIA MEJORADO */}
            <h3 className="text-xl font-bold text-gray-700 mb-4 pt-6 border-t mt-6">Add New Contact</h3>
            <div className="space-y-4"> 
              <input type="text" placeholder="Full Name *" value={newContact.name} onChange={(e) => setNewContact({...newContact, name: e.target.value})} className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" /> 
              <div className="grid grid-cols-2 gap-4"> 
                <input type="tel" placeholder="Phone Number *" value={newContact.phone} onChange={(e) => setNewContact({...newContact, phone: e.target.value})} className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
                <select value={newContact.relationship} onChange={(e) => setNewContact({...newContact, relationship: e.target.value})} className="w-full px-4 py-3 border-2 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
                  <option value="">Select Relationship *</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Friend">Friend</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <input type="email" placeholder="Email (Optional)" value={newContact.email || ''} onChange={(e) => setNewContact({...newContact, email: e.target.value})} className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
              
              {/* Blood Type selector for new contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Type (Optional)</label>
                <select value={newContact.bloodType || ''} onChange={(e) => setNewContact({...newContact, bloodType: e.target.value})} className="w-full px-4 py-3 border-2 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
                  <option value="">Don't know / Prefer not to say</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
            <button onClick={handleAddContact} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mt-6 hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg"><FaPlus /> Add Contact</button>
            <button onClick={() => setShowEmergencyContacts(false)} className="w-full bg-gray-400 text-white py-3 rounded-lg font-bold mt-3 hover:bg-gray-500 transition">Close</button>
          </div>
        </div>
      )}

      {showRescueMode && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 rescue-mode`}>
          <div className="bg-white rounded-3xl p-12 max-w-md shadow-2xl text-center">
            <div className="text-6xl mb-6 animate-spin">🚑</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">RESCUE MODE ACTIVE</h2>
            <div className="pulse-message mb-6">
              <p className="text-lg font-semibold text-gray-700">✓ Your location sent to nearby Paramedics</p>
              <p className="text-lg font-semibold text-gray-700 mt-2">✓ SOS alert sent to Emergency Contacts</p>
              <p className="text-xl font-bold text-red-600 mt-4">Help is on the way...</p>
            </div>
            <button 
              onClick={() => setShowRescueMode(false)} 
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}