import { useState, useEffect } from 'react'
import API from '../../axios' // Use the configured axios instance
import { FaUser, FaPlus, FaTrash, FaCheck } from 'react-icons/fa'

import { toast } from 'react-toastify'
export default function PersonalInfo({ userData, setUserData }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bloodType: '',
    allergies: [],
    medicalConditions: [],
    medications: []
  })

  useEffect(() => {
    setFormData({
    fullName: userData?.fullName || '',
    phone: userData?.phone || '',
    bloodType: userData?.bloodType || '',
    medicalConditions: userData?.medicalConditions || [],
    medications: userData?.medications || []
  })
  }, [userData])

  const [newAllergy, setNewAllergy] = useState({ name: '', severity: 'mild', reaction: '' })
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', allergyFor: '' })
  const [newCondition, setNewCondition] = useState('')
  const [editingAllergyIndex, setEditingAllergyIndex] = useState(null)
  const [editingMedicationIndex, setEditingMedicationIndex] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Helper to update an item in a list immutably
  const handleListChange = (listName, index, field, value) => {
    setFormData(prev => {
      const newList = [...prev[listName]]
      newList[index] = {
        ...newList[index],
        [field]: value
      }
      return { ...prev, [listName]: newList }
    })
  }

  const addAllergy = () => {
    if (!newAllergy.name.trim()) return

    const token = localStorage.getItem('token')
    if (!token) {
      // Fallback: add locally
      setFormData(prev => ({
        ...prev, // This will be saved with the main "Save" button
        allergies: [newAllergy, ...prev.allergies]
      }))
      setNewAllergy({ name: '', severity: 'mild', reaction: '' }) // Reset form
      toast.info('Added allergy locally. Log in to persist.')
      return
    }

    // Persist to server
    API.post('/allergies', newAllergy).then(res => {
      const allergy = res.data.allergy
      setUserData(prev => ({ ...prev, allergies: [allergy, ...prev.allergies] })) // Update parent state directly
      setNewAllergy({ name: '', severity: 'mild', reaction: '' })
      toast.success('Allergy created')
    }).catch(err => {
      console.error('Create allergy failed', err)
      toast.error('Failed to create allergy')
    })
  }

  const removeAllergy = (index) => {
    const allergy = formData.allergies[index]
    const token = localStorage.getItem('token')
    if (allergy && allergy._id && token) {
      API.delete(`/allergies/${allergy._id}`).then(() => {
        setUserData(prev => ({ ...prev, allergies: prev.allergies.filter((_, i) => i !== index) }))
        toast.success('Allergy deleted')
      }).catch(err => {
        console.error('Delete allergy failed', err)
        toast.error('Failed to delete allergy')
      })
    } else { // if no _id or no token, just remove from local state
      // local only
      setFormData(prev => ({ ...prev, allergies: prev.allergies.filter((_, i) => i !== index) }))
    }
  }

  const addMedication = () => {
    if (!newMedication.name.trim()) return

    // For now, store medications on user profile
    setFormData(prev => ({ ...prev, medications: [...prev.medications, newMedication] }))
    setNewMedication({ name: '', dosage: '', allergyFor: '' }) // Reset form
    toast.info('Medication added locally. Save to sync.')
  }

  const removeMedication = (index) => {
    setFormData(prev => ({ ...prev, medications: prev.medications.filter((_, i) => i !== index) }))
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, newCondition]
      }))
      setNewCondition('')
    }
  }

  const removeCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter((_, i) => i !== index)
    }))
  }

  const handleSave = () => {
    // Send update to backend if token exists
    const token = localStorage.getItem('token')
    if (!token) {
      // If not logged in, just update the parent state for local persistence
      setUserData(prev => ({ ...prev, ...formData }))
      toast.info('Saved locally. Log in to sync with server.')
      return
    }

    // Only send fields that MongoDB expects
    const dataToSend = {
      fullName: formData.fullName,
      phone: formData.phone,
      bloodType: formData.bloodType,
      medicalConditions: formData.medicalConditions,
      medications: formData.medications
    }

    API.put('/users/profile', dataToSend).then((res) => {
      toast.success('Personal information saved and synced with server!')
      setUserData(prev => ({ ...prev, ...res.data.user })) // Sync parent state with response from server
    }).catch((err) => {
      console.error('Error updating profile', err)
      toast.error('Saved locally but failed to sync: ' + (err?.response?.data?.message || err.message))
    })
  }

  // Edit / Save a specific allergy
  const toggleEditAllergy = (index) => {
    setEditingAllergyIndex(editingAllergyIndex === index ? null : index)
  }

  const saveAllergy = (index) => {
    const allergy = formData.allergies[index]
    const token = localStorage.getItem('token')
    if (!allergy) return
    if (!token) {
      toast.info('Login to save changes to allergies.')
      setEditingAllergyIndex(null)
      return
    }

    const apiCall = allergy._id
      ? API.put(`/allergies/${allergy._id}`, allergy) // Update existing
      : API.post('/allergies', allergy) // Create new

    apiCall.then(res => {
      const updatedOrCreatedAllergy = res.data.allergy
      // Update the parent state directly for consistency
      setUserData(prev => {
        const newAllergies = [...prev.allergies]
        newAllergies[index] = updatedOrCreatedAllergy
        return { ...prev, allergies: newAllergies }
      })
      setEditingAllergyIndex(null)
      toast.success(`Allergy ${allergy._id ? 'updated' : 'created'} successfully!`)
    }).catch(err => {
      console.error(`Failed to ${allergy._id ? 'update' : 'create'} allergy`, err)
      toast.error(`Failed to ${allergy._id ? 'update' : 'create'} allergy.`)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <FaUser /> Medical Information
          </h1>
          <p className="text-blue-100">Keep your medical information updated for emergency responders</p>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Blood Type</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Blood Type</option>
                {[ "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-" ].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Medical Conditions</h2>
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="e.g., Asthma, Diabetes, Heart Condition"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addCondition()}
              />
              <button
                onClick={addCondition}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2"
              >
                <FaPlus /> Add
              </button>
            </div>
            {formData.medicalConditions.length > 0 && (
              <div className="space-y-2">
                {formData.medicalConditions.map((condition, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-gray-800">{condition}</p>
                    <button
                      onClick={() => removeCondition(idx)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Allergies</h2>
          <div className="mb-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
              <h3 className="font-bold text-gray-800 mb-4">Add New Allergy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Allergen Name</label>
                  <input
                    type="text"
                    value={newAllergy.name}
                    onChange={(e) => setNewAllergy(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Peanuts, Shellfish, Penicillin"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Severity</label>
                    <select
                      value={newAllergy.severity}
                      onChange={(e) => setNewAllergy(prev => ({ ...prev, severity: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Typical Reaction</label>
                    <input
                      type="text"
                      value={newAllergy.reaction}
                      onChange={(e) => setNewAllergy(prev => ({ ...prev, reaction: e.target.value }))}
                      placeholder="e.g., Hives, Anaphylaxis"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={addAllergy}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Allergy
                </button>
              </div>
            </div>

            {formData.allergies.length > 0 && (
              <div className="space-y-3">
                {formData.allergies.map((allergy, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {editingAllergyIndex === idx ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={allergy.name}
                              onChange={(e) => handleListChange('allergies', idx, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                            <div className="grid md:grid-cols-2 gap-2">
                              <select
                                value={allergy.severity}
                                onChange={(e) => handleListChange('allergies', idx, 'severity', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded"
                              >
                                <option value="mild">Mild</option>
                                <option value="moderate">Moderate</option>
                                <option value="severe">Severe</option>
                              </select>
                              <input
                                type="text"
                                value={allergy.reaction}
                                onChange={(e) => handleListChange('allergies', idx, 'reaction', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="font-bold text-gray-800">{allergy.name}</p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                              <p>
                                <span className="font-semibold">Severity:</span>{' '}
                                <span className={`font-bold ${allergy.severity === 'severe' ? 'text-red-600' : allergy.severity === 'moderate' ? 'text-orange-600' : 'text-yellow-600'}`}>
                                  {String(allergy.severity || '').toUpperCase()}
                                </span>
                              </p>
                              <p>
                                <span className="font-semibold">Reaction:</span> {allergy.reaction}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {editingAllergyIndex === idx ? (
                          <>
                            <button
                              onClick={() => saveAllergy(idx)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingAllergyIndex(null)}
                              className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleEditAllergy(idx)}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => removeAllergy(idx)}
                              className="text-red-600 hover:text-red-800 transition ml-2"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Medications</h2>
          <div className="mb-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
              <h3 className="font-bold text-gray-800 mb-4">Add Medication</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Medication Name</label>
                  <input
                    type="text"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Epinephrine Auto-Injector, Benadryl"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Dosage</label>
                    <input
                      type="text"
                      value={newMedication.dosage}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                      placeholder="e.g., 0.3mg, 50mg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Used For Allergy</label>
                    <input
                      type="text"
                      value={newMedication.allergyFor}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, allergyFor: e.target.value }))}
                      placeholder="e.g., Peanut allergy"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={addMedication}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add Medication
                </button>
              </div>
            </div>

            {formData.medications.length > 0 && (
              <div className="space-y-3">
                {formData.medications.map((med, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{med.name}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <p>
                            <span className="font-semibold">Dosage:</span> {med.dosage}
                          </p>
                          <p>
                            <span className="font-semibold">For:</span> {med.allergyFor}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeMedication(idx)}
                        className="text-red-600 hover:text-red-800 transition ml-4"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 text-lg"
          >
            <FaCheck /> Save Information
          </button>
        </div>

        {/* Important Note */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
          <p className="text-blue-900 font-semibold mb-2">💡 Important Note</p>
          <p className="text-blue-800">
            The information you provide here will be shared with emergency responders when you activate the emergency alert. 
            Make sure all information is accurate and up-to-date, especially blood type, severe allergies, and critical medications.
          </p>
        </div>
      </div>
    </div>
  )
}
