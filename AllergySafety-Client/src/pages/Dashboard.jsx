import { useState, useEffect } from "react"
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaPhone, FaUser, FaHistory, FaShieldAlt, FaClock, FaTimes, FaTrash, FaBell } from "react-icons/fa"

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

  const [userData, setUserData] = useState(() => {
    try {
      const data = localStorage.getItem("userMedicalData")
      return data ? JSON.parse(data) : { fullName: "", bloodType: "", medications: [], medicalConditions: [] }
    } catch {
      return { fullName: "", bloodType: "", medications: [], medicalConditions: [] }
    }
  })

  const [emergencyContacts, setEmergencyContacts] = useState(() => {
    try {
      const data = localStorage.getItem("emergencyContacts")
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  })

  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "", email: "", bloodType: "" })
  const [newAllergy, setNewAllergy] = useState({ name: "", severity: "Moderate" })
  const [newMedication, setNewMedication] = useState({ name: "", usage: "" })
  const [newCondition, setNewCondition] = useState("")

  useEffect(() => {
    localStorage.setItem("userMedicalData", JSON.stringify(userData))
  }, [userData])

  useEffect(() => {
    localStorage.setItem("emergencyContacts", JSON.stringify(emergencyContacts))
  }, [emergencyContacts])

  const handleSOS = () => {
    setSOSActive(true)
    setShowSOSConfirm(false)
    setShowRescueMode(true)
    setTimeout(() => setSOSActive(false), 3000)
  }

  const handleAddContact = () => {
    if (newContact.name && newContact.phone && newContact.relationship) {
      const token = localStorage.getItem('token')
      if (token) {
        axios.post('http://localhost:3001/api/contacts', newContact, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => {
            const contact = res.data.contact
            setEmergencyContacts(prev => [contact, ...prev])
            setNewContact({ name: "", phone: "", relationship: "", email: "", bloodType: "" })
            toast.success('Emergency contact saved to server')
          }).catch(err => {
            console.error('Create contact failed', err)
            // fallback to local
            setEmergencyContacts(prev => [...prev, { id: Date.now(), ...newContact }])
            setNewContact({ name: "", phone: "", relationship: "", email: "", bloodType: "" })
            toast.error('Failed to save contact to server, saved locally')
          })
      } else {
        setEmergencyContacts([...emergencyContacts, { id: Date.now(), ...newContact }])
        setNewContact({ name: "", phone: "", relationship: "", email: "", bloodType: "" })
        toast.info('Added contact locally. Log in to persist')
      }
    }
  }

  const handleDeleteContact = (id) => {
    const contact = emergencyContacts.find(c => (c._id || c.id) === id || c.id === id || c._id === id)
    const token = localStorage.getItem('token')
    // If contact comes from server it will have _id
    if (contact && contact._id && token) {
      axios.delete(`http://localhost:3001/api/contacts/${contact._id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setEmergencyContacts(prev => prev.filter(c => (c._id || c.id) !== contact._id))
          toast.success('Contact deleted from server')
        }).catch(err => {
          console.error('Delete contact failed', err)
          toast.error('Failed to delete from server')
        })
    } else {
      setEmergencyContacts(emergencyContacts.filter(c => c.id !== id))
    }
  }

  const handleAddAllergy = () => {
    if (newAllergy.name) {
      const token = localStorage.getItem('token')
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
            setUserData(prev => ({ ...prev, allergies: [clientAllergy, ...prev.allergies] }))
            setNewAllergy({ name: "", severity: "Moderate" })
            toast.success('Allergy saved to server')
          }).catch(err => {
            console.error('Create allergy failed', err)
            // fallback to local
            setUserData(prev => ({ ...prev, allergies: [...prev.allergies, { id: Date.now(), ...newAllergy }] }))
            setNewAllergy({ name: "", severity: "Moderate" })
            toast.error('Failed to save allergy to server, saved locally')
          })
      } else {
        setUserData({ ...userData, allergies: [...userData.allergies, { id: Date.now(), ...newAllergy }] })
        setNewAllergy({ name: "", severity: "Moderate" })
        toast.info('Added allergy locally. Log in to persist')
      }
    }
  }

  const handleDeleteAllergy = (id) => {
    const allergy = userData.allergies.find(a => (a._id || a.id) === id || a.id === id || a._id === id)
    const token = localStorage.getItem('token')
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
      setUserData({ ...userData, allergies: userData.allergies.filter(a => a.id !== id) })
    }
  }

  const handleAddMedication = () => {
    if (newMedication.name) {
      setUserData({ ...userData, medications: [...userData.medications, { id: Date.now(), ...newMedication }] })
      setNewMedication({ name: "", usage: "" })
    }
  }

  const handleDeleteMedication = (id) => {
    setUserData({ ...userData, medications: userData.medications.filter(m => m.id !== id) })
  }

  const handleAddCondition = () => {
    if (newCondition && !userData.medicalConditions.includes(newCondition)) {
      setUserData({ ...userData, medicalConditions: [...userData.medicalConditions, newCondition] })
      setNewCondition("")
    }
  }

  const handleDeleteCondition = (condition) => {
    setUserData({ ...userData, medicalConditions: userData.medicalConditions.filter(c => c !== condition) })
  }

  // Blood type donation compatibility chart
  // Returns true if donor blood type can donate to recipient blood type
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <style>{styles}</style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to your Dashboard</h1>
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
            <button onClick={() => setShowAllergies(true)} className="text-blue-600 text-xs mt-2 font-semibold">{userData.allergies.length === 0 ? "Add Now" : "View"}</button>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-orange-600">
            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-600 font-semibold text-sm">Blood Type</h3><FaClock className="text-orange-600 text-lg" /></div>
            <p className="text-2xl font-bold text-gray-800">{userData.bloodType || "-"}</p>
            <button onClick={() => setShowPersonalInfo(true)} className="text-orange-600 text-xs mt-2 font-semibold">{userData.bloodType ? "Edit" : "Add Now"}</button>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-red-600">
            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-600 font-semibold text-sm">Medications</h3><FaHistory className="text-red-600 text-lg" /></div>
            <p className="text-2xl font-bold text-gray-800">{userData.medications.length}</p>
            <button onClick={() => setShowMedications(true)} className="text-red-600 text-xs mt-2 font-semibold">{userData.medications.length === 0 ? "Add Now" : "View"}</button>
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
          <div className="bg-white rounded-2xl p-8 max-w-md">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">SOS ALERT</h2>
              <div className="flex gap-4">
                <button onClick={() => setShowSOSConfirm(false)} className="flex-1 bg-gray-300 py-2 rounded">Cancel</button>
                <button onClick={handleSOS} className="flex-1 bg-red-600 text-white py-2 rounded font-bold">Activate</button>
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
              <button onClick={() => setShowPersonalInfo(false)}><FaTimes className="text-2xl" /></button>
            </div>
            <input type="text" placeholder="Full Name" value={userData.fullName} onChange={(e) => setUserData({...userData, fullName: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-4" />
            <select value={userData.bloodType} onChange={(e) => setUserData({...userData, bloodType: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-4">
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
            <button onClick={() => setShowPersonalInfo(false)} className="w-full bg-blue-600 text-white py-3 rounded font-bold">Save</button>
          </div>
        </div>
      )}

      {showAllergies && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 mx-4">
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold">Allergies</h2>
              <button onClick={() => setShowAllergies(false)}><FaTimes className="text-2xl" /></button>
            </div>
            <h3 className="text-lg font-bold mb-4">Your Allergies</h3>
            {userData.allergies.length > 0 ? (
              userData.allergies.map(a => (
                <div key={a.id} className="bg-red-50 p-4 rounded mb-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">{a.name}</p>
                    <span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-semibold mt-2">{a.severity}</span>
                  </div>
                  <button onClick={() => handleDeleteAllergy(a.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"><FaTrash /></button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mb-4">No allergies added yet</p>
            )}
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-bold mb-3">Add New Allergy</h3>
              <input type="text" placeholder="Allergy name" value={newAllergy.name} onChange={(e) => setNewAllergy({...newAllergy, name: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-3" />
              <select value={newAllergy.severity} onChange={(e) => setNewAllergy({...newAllergy, severity: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-3">
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
              <button onClick={handleAddAllergy} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-bold">Add Allergy</button>
            </div>
            <button onClick={() => setShowAllergies(false)} className="w-full bg-gray-400 text-white py-3 rounded font-bold mt-4">Close</button>
          </div>
        </div>
      )}

      {showMedications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 mx-4">
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold">Medications</h2>
              <button onClick={() => setShowMedications(false)}><FaTimes className="text-2xl" /></button>
            </div>
            <h3 className="text-lg font-bold mb-4">Your Medications</h3>
            {userData.medications.length > 0 ? (
              userData.medications.map(m => (
                <div key={m.id} className="bg-green-50 p-4 rounded mb-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">{m.name}</p>
                    <p className="text-gray-600 text-sm mt-1">Usage: {m.usage}</p>
                  </div>
                  <button onClick={() => handleDeleteMedication(m.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"><FaTrash /></button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mb-4">No medications added yet</p>
            )}
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-bold mb-3">Add New Medication</h3>
              <input type="text" placeholder="Medication name" value={newMedication.name} onChange={(e) => setNewMedication({...newMedication, name: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-3" />
              <input type="text" placeholder="Usage (e.g., 2 tablets daily)" value={newMedication.usage} onChange={(e) => setNewMedication({...newMedication, usage: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-3" />
              <button onClick={handleAddMedication} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-bold">Add Medication</button>
            </div>
            <button onClick={() => setShowMedications(false)} className="w-full bg-gray-400 text-white py-3 rounded font-bold mt-4">Close</button>
          </div>
        </div>
      )}

      {showEmergencyContacts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 mx-4">
            <div className="flex justify-between mb-6">
              <h2 className="text-3xl font-bold">Emergency Contacts</h2>
              <button onClick={() => setShowEmergencyContacts(false)}><FaTimes className="text-2xl" /></button>
            </div>

            {/* Your Blood Type Info with Compatibility */}
{userData.bloodType && (
  <div className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 rounded-lg p-4 mb-6">
    <p className="text-sm text-gray-600 font-semibold">Your Blood Type</p>
    <p className="text-3xl font-bold text-red-700">{userData.bloodType}</p>
    <p className="text-xs text-gray-600 mt-2">Below shows which contacts can donate to you</p>

    {emergencyContacts.length > 0 ? (
      <div className="mt-4 space-y-3">
        {emergencyContacts.map(c => {
          const canDonate = c.bloodType && isCompatibleDonor(c.bloodType, userData.bloodType)
          return (
            <div key={c._id || c.id} className="p-3 rounded flex justify-between items-center bg-gray-50 border-l-4 border-gray-400">
              <div className="flex-1">
                <p className="font-bold text-lg">{c.name}</p>
                <p className="text-sm text-gray-600">{c.bloodType ? `Blood: ${c.bloodType}` : "Blood type unknown"}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                canDonate ? 'bg-green-500 text-white' : 'bg-red-400 text-white'
              }`}>
                {c.bloodType ? (canDonate ? 'Compatible' : 'Not Compatible') : 'Unknown'}
              </span>
            </div>
          )
        })}
      </div>
    ) : (
      <p className="text-gray-500 mt-3">No emergency contacts added yet.</p>
    )}
  </div>
)}


            <h3 className="text-lg font-bold mb-4">Your Contacts</h3>
            {emergencyContacts.length > 0 ? (
              emergencyContacts.map(c => {
  const canDonate = userData.bloodType && c.bloodType && isCompatibleDonor(c.bloodType, userData.bloodType);
  return (
    <div 
      key={c._id || c.id || c.phone + c.name} // fallback único
      className={`p-4 rounded mb-4 flex justify-between items-start border-l-4 ${
        canDonate 
          ? 'bg-green-50 border-l-green-600' 
          : userData.bloodType && c.bloodType
          ? 'bg-gray-50 border-l-gray-400'
          : 'bg-blue-50 border-l-blue-400'
      }`}
                  >
                    <div className="flex-1">
                      <p className="font-bold text-lg">{c.name}</p>
                      <p className="text-sm text-gray-600">{c.relationship}</p>
                      <p className="text-sm text-gray-600">{c.phone}</p>
                      {c.email && <p className="text-sm text-gray-600">{c.email}</p>}
                      
                      {/* Blood Type Donor Badge */}
                      {c.bloodType && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="inline-block bg-orange-200 text-orange-800 px-3 py-1 rounded text-sm font-semibold">
                            Blood: {c.bloodType}
                          </span>
                          {userData.bloodType && (
                            <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${
                              canDonate
                                ? 'bg-green-500 text-white'
                                : 'bg-red-400 text-white'
                            }`}>
                              {canDonate ? '✓ Can Donate' : '✗ Not Compatible'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDeleteContact(c._id || c.id)} 
                      className="text-red-600 hover:text-red-800 ml-4 flex-shrink-0"
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500 mb-4 bg-yellow-50 p-3 rounded">No emergency contacts added yet. Add at least one contact!</p>
            )}

            <h3 className="text-lg font-bold mb-4 mt-6 pt-6 border-t">Add Contact</h3>
            <input type="text" placeholder="Name" value={newContact.name} onChange={(e) => setNewContact({...newContact, name: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-3" />
            <input type="tel" placeholder="Phone" value={newContact.phone} onChange={(e) => setNewContact({...newContact, phone: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-3" />
            <input type="email" placeholder="Email (optional)" value={newContact.email || ''} onChange={(e) => setNewContact({...newContact, email: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-3" />
            
            {/* Blood Type selector for new contact */}
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Type (optional - helps identify compatible donors)</label>
              <select value={newContact.bloodType || ''} onChange={(e) => setNewContact({...newContact, bloodType: e.target.value})} className="w-full px-4 py-2 border-2 rounded">
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

            <select value={newContact.relationship} onChange={(e) => setNewContact({...newContact, relationship: e.target.value})} className="w-full px-4 py-2 border-2 rounded mb-4">
              <option value="">Select Relationship</option>
              <option value="Parent">Parent</option>
              <option value="Sibling">Sibling</option>
              <option value="Spouse">Spouse</option>
              <option value="Friend">Friend</option>
              <option value="Doctor">Doctor</option>
              <option value="Other">Other</option>
            </select>
            <button onClick={handleAddContact} className="w-full bg-green-600 text-white py-3 rounded font-bold mb-2">Add</button>
            <button onClick={() => setShowEmergencyContacts(false)} className="w-full bg-gray-600 text-white py-3 rounded font-bold">Close</button>
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
