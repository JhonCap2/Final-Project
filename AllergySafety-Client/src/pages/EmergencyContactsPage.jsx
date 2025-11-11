import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaPhone, FaPlus, FaTrash, FaStar, FaTimes, FaEnvelope } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
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

  const token = localStorage.getItem('token')

  console.log('EmergencyContactsPage: Mounting, token:', !!token)

  // Load contacts from server
  useEffect(() => {
    console.log('EmergencyContactsPage: useEffect running, token:', !!token)
    if (!token) {
      console.log('No token, setting loading to false')
      setLoading(false)
      return
    }

    console.log('Calling loadContacts')
    loadContacts()
  }, [token])

  const loadContacts = () => {
    axios.get('http://localhost:3001/api/contacts', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setContacts(res.data.contacts || [])
      setLoading(false)
    }).catch(err => {
      console.error('Failed to load contacts:', err)
      toast.error('Failed to load contacts')
      setLoading(false)
    })
  }

  const handleAddContact = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Name and phone are required')
      return
    }

    const dataToSend = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email || undefined,
      relationship: formData.relationship,
      isPrimary: formData.isPrimary,
      notifyBy: formData.notifyBy,
      address: formData.address || undefined,
      notes: formData.notes || undefined
    }

    axios.post('http://localhost:3001/api/contacts', dataToSend, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setContacts([...contacts, res.data.contact])
      setFormData({
        name: '',
        phone: '',
        email: '',
        relationship: 'Other',
        isPrimary: false,
        notifyBy: ['phone'],
        address: '',
        notes: ''
      })
      setShowForm(false)
      toast.success('Contact added successfully!')
    }).catch(err => {
      console.error('Failed to add contact:', err)
      toast.error('Failed to add contact: ' + (err.response?.data?.message || err.message))
    })
  }

  const handleDeleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      axios.delete(`http://localhost:3001/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        setContacts(contacts.filter(c => c._id !== id))
        toast.success('Contact deleted')
      }).catch(err => {
        console.error('Failed to delete contact:', err)
        toast.error('Failed to delete contact')
      })
    }
  }

  const handleSetPrimary = (id) => {
    axios.put(`http://localhost:3001/api/contacts/${id}`, 
      { isPrimary: true },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setContacts(contacts.map(c => ({
        ...c,
        isPrimary: c._id === id ? true : false
      })))
      toast.success('Primary contact updated')
    }).catch(err => {
      console.error('Failed to update contact:', err)
      toast.error('Failed to update contact')
    })
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Please log in to manage emergency contacts</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg p-8 text-white mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                <FaPhone /> Emergency Contacts
              </h1>
              <p className="text-red-100">Manage people who will be notified during emergencies</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
                showForm
                  ? 'bg-red-700 hover:bg-red-800 text-white'
                  : 'bg-white hover:bg-gray-100 text-red-600'
              }`}
            >
              {showForm ? (
                <>
                  <FaTimes /> Cancel
                </>
              ) : (
                <>
                  <FaPlus /> Add Contact
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add Contact Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Emergency Contact</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contact name"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Relationship</label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                >
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Friend">Friend</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Notify By</label>
                <div className="flex gap-4">
                  {['phone', 'email', 'sms'].map(method => (
                    <label key={method} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.notifyBy.includes(method)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, notifyBy: [...formData.notifyBy, method] })
                          } else {
                            setFormData({ ...formData, notifyBy: formData.notifyBy.filter(m => m !== method) })
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="capitalize text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes (e.g., prefers morning calls)"
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <input
                  type="checkbox"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-gray-700 font-semibold">Set as primary contact</label>
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={handleAddContact}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contacts List */}
        {contacts.length > 0 ? (
          <div className="grid gap-6">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${
                  contact.isPrimary ? 'border-l-yellow-500' : 'border-l-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">{contact.name}</h3>
                      {contact.isPrimary && (
                        <FaStar className="text-yellow-500 text-xl" title="Primary contact" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm font-semibold">
                      {contact.relationship}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!contact.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(contact._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition"
                        title="Set as primary"
                      >
                        <FaStar />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteContact(contact._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                      title="Delete contact"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2">
                    <FaPhone className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <a href={`tel:${contact.phone}`} className="font-bold text-blue-600 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  </div>

                  {contact.email && (
                    <div className="bg-purple-50 p-3 rounded-lg flex items-center gap-2">
                      <FaEnvelope className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Email</p>
                        <a href={`mailto:${contact.email}`} className="font-bold text-purple-600 hover:underline break-all text-sm">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {contact.address && (
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <p className="text-xs text-gray-600 font-semibold">Address</p>
                    <p className="text-gray-800">{contact.address}</p>
                  </div>
                )}

                {contact.notifyBy && contact.notifyBy.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Notify by:</p>
                    <div className="flex gap-2">
                      {contact.notifyBy.map(method => (
                        <span key={method} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {contact.notes && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-xs text-gray-600 font-semibold mb-1">Notes</p>
                    <p className="text-gray-800 text-sm">{contact.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FaPhone className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No emergency contacts yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition inline-flex items-center gap-2"
            >
              <FaPlus /> Add your first contact
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
