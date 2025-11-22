import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaPhone, FaPlus, FaTrash, FaStar, FaEnvelope } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEmergencyData } from './useEmergencyData' // Importar el hook

export default function EmergencyContactsPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { loading, emergencyContacts: contacts, deleteContact, setEmergencyContacts } = useEmergencyData(token)

  const handleDeleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id)
    }
  }

  const handleSetPrimary = (id) => {
    axios.put(`http://localhost:3001/api/contacts/${id}`, 
      { isPrimary: true },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setEmergencyContacts(contacts.map(c => ({
        ...c,
        isPrimary: c._id === id ? true : false
      })));
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
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-t-4 border-green-600">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <FaPhone className="text-green-600" /> Emergency Contacts
              </h1>
              <p className="text-gray-600 mt-1">Manage people who will be notified during emergencies</p>
            </div>
            <button
              onClick={() => navigate('/contacts/add')} // Navega a la nueva página
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition bg-green-600 hover:bg-green-700 text-white"
            >
              <FaPlus /> Add Contact
            </button>
          </div>
        </div>

        {/* Contacts List */}
        {contacts.length > 0 ? (
          <div className="grid gap-6">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  contact.isPrimary ? 'border-l-green-500' : 'border-l-gray-300'
                }`}
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">{contact.name}</h3>
                      {contact.isPrimary && (
                        <FaStar className="text-green-500 text-xl" title="Primary contact" />
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
                        className="bg-gray-200 hover:bg-green-200 text-gray-600 hover:text-green-700 p-2 rounded-lg transition"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                    <FaPhone className="text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <a href={`tel:${contact.phone}`} className="font-bold text-gray-800 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  </div>

                  {contact.email && (
                    <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                      <FaEnvelope className="text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600">Email</p>
                        <a href={`mailto:${contact.email}`} className="font-bold text-gray-800 hover:underline break-all text-sm">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {contact.address && (
                  <div className="bg-gray-100 p-3 rounded-lg mb-4">
                    <p className="text-xs text-gray-600 font-semibold">Address</p>
                    <p className="text-gray-800">{contact.address}</p>
                  </div>
                )}

                {contact.notifyBy && contact.notifyBy.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Notify by:</p>
                    <div className="flex gap-2">
                      {contact.notifyBy.map(method => (
                        <span key={method} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {contact.notes && (
                  <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
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
          </div>
        )}
      </div>
    </div>
  )
}
