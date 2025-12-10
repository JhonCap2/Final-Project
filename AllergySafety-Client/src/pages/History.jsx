import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import API from '../../axios'

export default function History() {
  const [historyData, setHistoryData] = useState({
    allergies: [],
    medications: [],
    contacts: [],
    sosAlerts: []
  })
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    // Load data from localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('userMedicalData')) || {}
      const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || []
      
      // Try to fetch SOS history from API if logged in
      if (token) {
        API.get('/sos/history')
          .then(res => {
            setHistoryData({
              allergies: userData.allergies || [],
              medications: userData.medications || [],
              contacts: contacts || [],
              sosAlerts: res.data.history || []
            })
          })
          .catch(err => {
            console.error('Failed to fetch SOS history:', err)
            // Fallback to localStorage
            setHistoryData({
              allergies: userData.allergies || [],
              medications: userData.medications || [],
              contacts: contacts || [],
              sosAlerts: JSON.parse(localStorage.getItem('sosHistory')) || []
            })
          })
      } else {
        // Use localStorage if not logged in
        setHistoryData({
          allergies: userData.allergies || [],
          medications: userData.medications || [],
          contacts: contacts || [],
          sosAlerts: JSON.parse(localStorage.getItem('sosHistory')) || []
        })
      }
    } catch (err) {
      console.log('Error loading history:', err)
    }
  }, [token])

  const recordSOS = async () => {
    if (!token) {
      toast.error('You must be logged in to record an SOS alert')
      return
    }
    
    setLoading(true)
    try {
      const res = await API.post('/sos/')
      toast.success(res.data.message || 'SOS alert recorded and emergency contacts notified!')
      
      // Refresh SOS history from API
      const historyRes = await API.get('/sos/history')
      setHistoryData(prev => ({ ...prev, sosAlerts: historyRes.data.history || [] }))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record SOS alert')
      console.error('SOS error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Medical History</h1>

        {/* SOS Alerts History */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">SOS Alert History</h2>
            <button 
              onClick={recordSOS} 
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white px-4 py-2 rounded font-bold flex items-center gap-2"
            >
              <FaPlus /> {loading ? 'Sending...' : 'Test Alert'}
            </button>
          </div>
          {historyData.sosAlerts.length > 0 ? (
            <div className="space-y-3">
              {historyData.sosAlerts.map(alert => (
                <div key={alert._id} className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                  <p className="font-semibold text-red-700">{new Date(alert.timestamp).toLocaleString()}</p>
                  <p className="text-gray-600">Status: {alert.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No SOS alerts recorded yet</p>
          )}
        </div>

        {/* Allergies History */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Allergies</h2>
          {historyData.allergies.length > 0 ? (
            <div className="grid gap-4">
              {historyData.allergies.map(allergy => (
                <div key={allergy.id} className="bg-red-50 p-4 rounded border-l-4 border-red-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg text-gray-800">{allergy.name}</p>
                      <span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded text-sm mt-2">
                        {allergy.severity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No allergies recorded</p>
          )}
        </div>

        {/* Medications History */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Medications</h2>
          {historyData.medications.length > 0 ? (
            <div className="grid gap-4">
              {historyData.medications.map(medication => (
                <div key={medication.id} className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg text-gray-800">{medication.name}</p>
                      <p className="text-gray-600 mt-2">Usage: {medication.usage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No medications recorded</p>
          )}
        </div>

        {/* Emergency Contacts History */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Emergency Contacts</h2>
          {historyData.contacts.length > 0 ? (
            <div className="grid gap-4">
              {historyData.contacts.map(contact => (
                <div key={contact.id} className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                  <p className="font-bold text-lg text-gray-800">{contact.name}</p>
                  <p className="text-gray-600">Relationship: {contact.relationship}</p>
                  <p className="text-gray-600">Phone: {contact.phone}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No emergency contacts saved</p>
          )}
        </div>
      </div>
    </div>
  )
}
