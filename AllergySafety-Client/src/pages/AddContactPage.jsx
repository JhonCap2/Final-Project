import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaSave, FaArrowLeft } from 'react-icons/fa'
import { useEmergencyData } from './useEmergencyData'

export default function AddContactPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { addContact } = useEmergencyData(token)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: 'Other',
    isPrimary: false,
    notifyBy: ['phone'],
    address: '',
    notes: ''
  })

  const handleAddContact = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Name and phone are required')
      return
    }

    const success = await addContact(formData)
    if (success) {
      toast.success('Contact added successfully!')
      navigate('/contacts') // Redirige de vuelta a la lista de contactos
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Add New Emergency Contact</h1>
            <button onClick={() => navigate('/contacts')} className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-semibold">
              <FaArrowLeft /> Back to List
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contact name"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Relationship</label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Spouse">Spouse</option>
                <option value="Friend">Friend</option>
                <option value="Doctor">Doctor</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Puedes agregar los otros campos (Address, Notes, etc.) aquí si lo deseas */}

            <div>
              <button
                onClick={handleAddContact}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FaSave /> Save Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}