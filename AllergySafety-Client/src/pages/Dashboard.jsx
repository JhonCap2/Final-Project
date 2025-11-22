import { useState, useEffect } from "react"
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaPhone, FaUser, FaHistory, FaShieldAlt, FaClock, FaTimes, FaTrash, FaBell, FaPlus } from "react-icons/fa"
// Importa el nuevo hook personalizado. En un proyecto real, la ruta sería `../hooks/useEmergencyData`
import { useEmergencyData } from "./useEmergencyData" 

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
  // Simplifica el manejo de modales con un solo estado
  const [activeModal, setActiveModal] = useState(null); // 'sos', 'rescue', 'personal', 'allergies', 'meds', 'contacts'
  const [sosActive, setSOSActive] = useState(false)
  const token = localStorage.getItem('token')

  // Usar el hook personalizado para manejar la lógica de datos
  const { loading, userData, setUserData, emergencyContacts, addContact, deleteContact, addAllergy, deleteAllergy, addMedication, deleteMedication, recordSOSAlert } = useEmergencyData(token);

  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "", email: "", bloodType: "" })
  const [newAllergy, setNewAllergy] = useState({ name: "", severity: "Moderate" })
  const [newMedication, setNewMedication] = useState({ name: "", usage: "" })

  const handleSOS = async () => {
    setSOSActive(true)
    setActiveModal('rescue')
    await recordSOSAlert(); // Registra el evento SOS
    setTimeout(() => setSOSActive(false), 3000)
  }
  
// --- CRUD Contactos ---
  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      toast.error('Name, Phone, and Relationship are required.');
      return;
    }
    const success = await addContact(newContact);
    if (success) {
      setNewContact({ name: "", phone: "", relationship: "", email: "", bloodType: "" });
    }
  }

// --- CRUD Alergias ---
  const handleAddAllergy = async () => {
    if (!newAllergy.name) {
      toast.error('Allergy name is required.');
      return;
    }
    const success = await addAllergy(newAllergy);
    if (success) {
      setNewAllergy({ name: "", severity: "Moderate" });
    }
  }

  const handleAddMedication = async () => {
    if (!newMedication.name) {
      toast.error('Medication name is required.');
      return;
    }
    const success = await addMedication(newMedication);
    if (success) {
      setNewMedication({ name: "", usage: "" });
    }
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
    setActiveModal(null)
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
          <p className="text-green-100">Your emergency response system is ready.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-green-600">
            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-600 font-semibold text-sm">Emergency Contacts</h3><FaPhone className="text-green-600 text-lg" /></div>
            <p className="text-2xl font-bold text-gray-800">{emergencyContacts.length}</p>
            <button onClick={() => setActiveModal('contacts')} className="text-green-600 text-xs mt-2 font-semibold hover:underline">{emergencyContacts.length === 0 ? "Add Now" : "Manage"}</button>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-blue-600">
            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-600 font-semibold text-sm">Allergies</h3><FaShieldAlt className="text-blue-600 text-lg" /></div>
            <p className="text-2xl font-bold text-gray-800">{userData.allergies.length}</p>
            <button onClick={() => setActiveModal('allergies')} className="text-blue-600 text-xs mt-2 font-semibold hover:underline">{userData.allergies.length === 0 ? "Add Now" : "View/Add"}</button>
            
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-orange-600">
            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-600 font-semibold text-sm">Blood Type</h3><FaClock className="text-orange-600 text-lg" /></div>
            <p className="text-2xl font-bold text-gray-800">{userData.bloodType || "N/A"}</p>
            <button onClick={() => setActiveModal('personal')} className="text-orange-600 text-xs mt-2 font-semibold hover:underline">{userData.bloodType ? "Edit" : "Add Now"}</button>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-t-4 border-red-600">
            <div className="flex justify-between items-center mb-2"><h3 className="text-gray-600 font-semibold text-sm">Medications</h3><FaHistory className="text-red-600 text-lg" /></div>
            <p className="text-2xl font-bold text-gray-800">{userData.medications.length}</p>
            <button onClick={() => setActiveModal('meds')} className="text-red-600 text-xs mt-2 font-semibold hover:underline">{userData.medications.length === 0 ? "Add Now" : "View/Add"}</button>
          </div>
        </div>

        <button onClick={() => setActiveModal('sos')} className={`w-full py-4 text-white font-bold text-2xl rounded-2xl shadow-2xl flex items-center justify-center gap-4 ${sosActive ? "bg-red-600 animate-pulse" : "bg-red-500 hover:bg-red-600"}`}>
          <FaBell className="text-2xl ambulance-blink" />
          {sosActive ? "SOS ACTIVATED!" : "ACTIVATE SOS"}
        </button>

        <div className="bg-white rounded-lg shadow p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <button onClick={() => setActiveModal('personal')} className="bg-white border-2 border-gray-200 text-gray-700 p-8 rounded-lg hover:bg-gray-50 hover:border-green-500 transition group"><FaUser className="text-4xl mb-3 mx-auto text-green-600 group-hover:scale-110 transition" /><h3 className="text-xl font-bold">Personal Info</h3></button>
            <button onClick={() => setActiveModal('contacts')} className="bg-white border-2 border-gray-200 text-gray-700 p-8 rounded-lg hover:bg-gray-50 hover:border-green-500 transition group"><FaPhone className="text-4xl mb-3 mx-auto text-green-600 group-hover:scale-110 transition" /><h3 className="text-xl font-bold">Contacts</h3></button>
            <div className="bg-white border-2 border-gray-200 text-gray-700 p-8 rounded-lg flex items-center justify-center"><div className="text-center"><div className="text-4xl mb-3"></div><h3 className="text-xl font-bold">Ready</h3></div></div>
          </div>
        </div>
      </div>

      {activeModal === 'sos' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-600 mb-4">CONFIRM SOS ALERT</h2>
              <p className="text-gray-700 mb-6">Are you sure you want to activate the emergency signal and send your information to paramedics and contacts?</p>
              <div className="flex gap-4">
                <button onClick={() => setActiveModal(null)} className="flex-1 bg-gray-300 py-3 rounded-lg font-bold hover:bg-gray-400 transition">Cancel</button>
                <button onClick={handleSOS} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">Activate SOS</button>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {activeModal === 'personal' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full my-8 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Personal Info</h2>
              <button onClick={() => setActiveModal(null)}><FaTimes className="text-2xl text-gray-500 hover:text-red-500" /></button>
            </div>
            <p className="text-sm text-red-500 mb-4 font-semibold">
                ⚠️ Use the 'Profile' page to save these changes permanently to the server.
            </p>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input type="text" placeholder="Full Name" value={userData.fullName} onChange={(e) => setUserData({...userData, fullName: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500" />
            <label className="block text-gray-700 font-semibold mb-2">Blood Type</label>
            <select value={userData.bloodType} onChange={(e) => setUserData({...userData, bloodType: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
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
            <button onClick={handlePersonalInfoSave} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">Close & Save Locally</button>
          </div>
        </div>
      )}

      {activeModal === 'allergies' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Allergies Management</h2>
              <button onClick={() => setActiveModal(null)}><FaTimes className="text-2xl text-gray-500 hover:text-red-500" /></button>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Your Allergies ({userData.allergies.length})</h3>
            {userData.allergies.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-6">
                {userData.allergies.map((a, index) => (
                  <div key={a._id || a.id || index} className="bg-red-50 p-4 rounded-lg flex justify-between items-center border-l-4 border-red-500">
                    <div>
                      <p className="font-bold text-lg text-red-800">{a.name}</p>
                      <span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded-full text-xs font-semibold mt-1 capitalize">{a.severity}</span>
                    </div>
                    <button onClick={() => deleteAllergy(a._id || a.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"><FaTrash /></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-6 bg-red-50 p-3 rounded-lg border border-red-200">No allergies added yet. This is critical in an emergency.</p>
            )}
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3">Add New Allergy</h3>
              <input type="text" placeholder="Allergy name (e.g., Penicillin, Peanuts)" value={newAllergy.name} onChange={(e) => setNewAllergy({...newAllergy, name: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <select value={newAllergy.severity} onChange={(e) => setNewAllergy({...newAllergy, severity: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
              <button onClick={handleAddAllergy} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold transition flex items-center justify-center gap-2"><FaPlus /> Add Allergy</button>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-bold mt-4 hover:bg-gray-400 transition">Close</button>
          </div>
          
        </div>
      )}

      {activeModal === 'meds' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Medications</h2>
              <button onClick={() => setActiveModal(null)}><FaTimes className="text-2xl text-gray-500 hover:text-red-500" /></button>
            </div>
            <p className="text-sm text-red-500 mb-4 font-semibold">
                ⚠️ Adding/deleting here is local only. Use the 'Profile' page to save permanently.
            </p>
            <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Your Medications ({userData.medications.length})</h3>
            {userData.medications.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-6">
                {userData.medications.map((m, index) => (
                  <div key={m.id || m._id || index} className="bg-green-50 p-4 rounded-lg flex justify-between items-center border-l-4 border-green-400">
                    <div>
                      <p className="font-bold text-lg text-green-800">{m.name}</p>
                      <p className="text-gray-600 text-sm mt-1">Usage: {m.usage || m.dosage || 'N/A'}</p>
                    </div>
                    <button onClick={() => deleteMedication(m.id || m._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"><FaTrash /></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-6">No medications added yet</p>
            )}
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3">Add New Medication (Local)</h3>
              <input type="text" placeholder="Medication name" value={newMedication.name} onChange={(e) => setNewMedication({...newMedication, name: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="text" placeholder="Usage (e.g., 2 tablets daily)" value={newMedication.usage} onChange={(e) => setNewMedication({...newMedication, usage: e.target.value})} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <button onClick={handleAddMedication} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold transition flex items-center justify-center gap-2"><FaPlus /> Add Medication Locally</button>
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-bold mt-4 hover:bg-gray-400 transition">Close</button>
          </div>
        </div>
      )}

      {activeModal === 'contacts' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full my-8 mx-4">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-3xl font-bold text-gray-800">Emergency Contacts Management</h2>
              <button onClick={() => setActiveModal(null)}><FaTimes className="text-2xl text-gray-500 hover:text-red-500" /></button>
            </div>

            {/* Your Blood Type Info with Compatibility (MODIFICADO: p-3 en lugar de p-4) */}
            {userData.bloodType && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-red-500 rounded-lg p-3 mb-6 shadow-sm">
                <p className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                    <span className="text-lg font-bold text-red-700">{userData.bloodType}</span> is your Blood Type
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
                          ? 'bg-green-50 border-l-4 border-green-500'
                          : 'bg-gray-50 border-l-4 border-gray-300'
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
                                  ? 'bg-green-600 text-white'
                                  : 'bg-red-500 text-white'
                              }`}>
                                {canDonate ? 'Compatible Donor' : 'Not Compatible'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteContact(c._id || c.id)} 
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
              <input type="text" placeholder="Full Name *" value={newContact.name} onChange={(e) => setNewContact({...newContact, name: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition" /> 
              <div className="grid grid-cols-2 gap-4"> 
                <input type="tel" placeholder="Phone Number *" value={newContact.phone} onChange={(e) => setNewContact({...newContact, phone: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
                <select value={newContact.relationship} onChange={(e) => setNewContact({...newContact, relationship: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition">
                  <option value="">Select Relationship *</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Friend">Friend</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <input type="email" placeholder="Email (Optional)" value={newContact.email || ''} onChange={(e) => setNewContact({...newContact, email: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
              
              {/* Blood Type selector for new contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Type (Optional)</label>
                <select value={newContact.bloodType || ''} onChange={(e) => setNewContact({...newContact, bloodType: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition">
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
            <button onClick={() => setActiveModal(null)} className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-bold mt-3 hover:bg-gray-400 transition">Close</button>
          </div>
        </div>
      )}

      {activeModal === 'rescue' && (
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
              onClick={() => setActiveModal(null)} 
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