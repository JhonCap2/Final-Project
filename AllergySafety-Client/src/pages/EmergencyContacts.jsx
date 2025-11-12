import { useState } from 'react'
import { FaPhone, FaPlus, FaTrash, FaStar, FaCheck } from 'react-icons/fa'

export default function EmergencyContacts({ userData, setUserData }) {
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false
  })

  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      setUserData(prev => ({
        ...prev,
        emergencyContacts: [...(prev.emergencyContacts || []), newContact]
      }))
      const [newContact, setNewContact] = useState({
  name: '',
  phone: '',
  relationship: '',
  bloodType: '', // nuevo
  isPrimary: false
})

    }
  }

  const removeContact = (index) => {
    setUserData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }))
  }

  const togglePrimary = (index) => {
    setUserData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) => ({
        ...contact,
        isPrimary: i === index ? !contact.isPrimary : false
      }))
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <FaPhone /> Emergency Contacts
          </h1>
          <p className="text-green-100">These people will be notified immediately when you activate emergency alert</p>
        </div>

        {/* Add New Contact */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Emergency Contact</h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Contact Name</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Mom, Brother, Best Friend"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Relationship</label>
                  <select
                    value={newContact.relationship}
                    onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Relationship</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Friend">Friend</option>
                    <option value="Coworker">Coworker</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
  <label className="block text-gray-700 font-semibold mb-2">Blood Type</label>
  <select
    value={newContact.bloodType}
    onChange={(e) => setNewContact(prev => ({ ...prev, bloodType: e.target.value }))}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  >
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
</div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newContact.isPrimary}
                  onChange={(e) => setNewContact(prev => ({ ...prev, isPrimary: e.target.checked }))}
                  id="isPrimary"
                  className="w-4 h-4"
                />
                <label htmlFor="isPrimary" className="text-gray-700 font-semibold cursor-pointer">
                  Mark as Primary Contact
                </label>
              </div>
              <button
                onClick={addContact}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-lg"
              >
                <FaPlus /> Add Contact
              </button>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Emergency Contacts ({userData?.emergencyContacts?.length || 0})
          </h2>

          {(!userData?.emergencyContacts || userData.emergencyContacts.length === 0) ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No emergency contacts added yet</p>
              <p className="text-gray-400">Add at least one emergency contact to ensure someone is notified during an emergency</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userData.emergencyContacts.map((contact, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-lg border-2 transition ${
                    contact.isPrimary
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <p className="text-2xl font-bold text-gray-800">{contact.name}</p>
                        {contact.isPrimary && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                            <FaStar /> Primary
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-semibold">Phone:</span> {contact.phone}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Relationship:</span> {contact.relationship || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => togglePrimary(idx)}
                        className={`p-3 rounded-lg transition ${
                          contact.isPrimary
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                        }`}
                        title={contact.isPrimary ? 'Remove as Primary' : 'Set as Primary'}
                      >
                        <FaStar />
                      </button>
                      <button
                        onClick={() => removeContact(idx)}
                        className="p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                        title="Delete Contact"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="mt-8 space-y-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
            <p className="text-green-900 font-semibold mb-2">✅ How It Works</p>
            <p className="text-green-800 text-sm">
              When you press the emergency button, all your emergency contacts will receive an instant notification with:
            </p>
            <ul className="list-disc list-inside text-green-800 text-sm mt-2 space-y-1">
              <li>Your exact GPS location</li>
              <li>Your medical information (blood type, allergies, medications)</li>
              <li>Emergency status and time activated</li>
              <li>A link to track your location in real-time</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
            <p className="text-blue-900 font-semibold mb-2">📞 Contact Guidelines</p>
            <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
              <li>Add at least 2-3 trusted emergency contacts</li>
              <li>Mark your most reliable contact as "Primary"</li>
              <li>Include contacts who will likely be available (different locations)</li>
              <li>Update phone numbers if they change</li>
              <li>Let your contacts know they're on your emergency list</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <p className="text-yellow-900 font-semibold mb-2">⚠️ Important</p>
            <p className="text-yellow-800 text-sm">
              Your emergency contacts are critical to your safety. Make sure the phone numbers are accurate and that your contacts 
              have agreed to be part of your emergency notification system. Always test the system with a trusted contact first.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
