import { useState } from 'react'
import API from '../../axios' // Use the configured axios instance
import { FaUser, FaPlus, FaTrash, FaCheck } from 'react-icons/fa'

export default function PersonalInfo({ userData, setUserData }) {
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    phone: userData?.phone || '',
    bloodType: userData?.bloodType || '',
    medicalConditions: userData?.medicalConditions || [],
    medications: userData?.medications || []
  })

  const [newAllergy, setNewAllergy] = useState({ name: '', severity: 'mild', reaction: '' })
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', allergyFor: '' })
  const [newCondition, setNewCondition] = useState('')
  const [editingAllergyIndex, setEditingAllergyIndex] = useState(null)
  const [editingMedicationIndex, setEditingMedicationIndex] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addAllergy = () => {
    if (!newAllergy.name.trim()) return

    const token = localStorage.getItem('token')
    if (!token) {
      // Fallback: add locally
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy]
      }))
      setNewAllergy({ name: '', severity: 'mild', reaction: '' })
      import('react-toastify').then(({ toast }) => toast.info('Added allergy locally. Log in to persist.'))
      return
    }

    // Persist to server
    API.post('/allergies', newAllergy).then(res => {
      const allergy = res.data.allergy
      setFormData(prev => ({ ...prev, allergies: [allergy, ...prev.allergies] }))
      setNewAllergy({ name: '', severity: 'mild', reaction: '' })
      import('react-toastify').then(({ toast }) => toast.success('Allergy created'))
    }).catch(err => {
      console.error('Create allergy failed', err)
      import('react-toastify').then(({ toast }) => toast.error('Failed to create allergy'))
    })
  }

  const removeAllergy = (index) => {
    const allergy = formData.allergies[index]
    const token = localStorage.getItem('token')
    if (allergy && allergy._id && token) {
      API.delete(`/allergies/${allergy._id}`).then(() => {
        setFormData(prev => ({ ...prev, allergies: prev.allergies.filter((_, i) => i !== index) }))
        import('react-toastify').then(({ toast }) => toast.success('Allergy deleted'))
      }).catch(err => {
        console.error('Delete allergy failed', err)
        import('react-toastify').then(({ toast }) => toast.error('Failed to delete allergy'))
      })
    } else {
      // local only
      setFormData(prev => ({ ...prev, allergies: prev.allergies.filter((_, i) => i !== index) }))
    }
  }

  const addMedication = () => {
    if (!newMedication.name.trim()) return

    // For now, store medications on user profile
    setFormData(prev => ({ ...prev, medications: [...prev.medications, newMedication] }))
    setNewMedication({ name: '', dosage: '', allergyFor: '' })
    import('react-toastify').then(({ toast }) => toast.info('Medication added locally. Save to sync.'))
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

  const handleSaveBloodType = () => {
    setUserData(prev => ({
      ...prev,
      bloodType: formData.bloodType
    }))

    // Send blood type update to backend if token exists
    const token = localStorage.getItem('token')
    if (!token) {
      import('react-toastify').then(({ toast }) => toast.info('Saved locally. Log in to sync with server.'))
      return
    }

    API.put('/users/profile', { bloodType: formData.bloodType }).then(() => {
      import('react-toastify').then(({ toast }) => toast.success('Blood type updated!'))
    }).catch((err) => {
      console.error('Error updating blood type', err)
      import('react-toastify').then(({ toast }) => toast.error('Failed to update blood type: ' + (err?.response?.data?.message || err.message)))
    })
  }

  const handleSave = () => {
    setUserData(prev => ({
      ...prev,
      ...formData
    }))

    // Send update to backend if token exists
    const token = localStorage.getItem('token')
    if (!token) {
      import('react-toastify').then(({ toast }) => toast.info('Saved locally. Log in to sync with server.'))
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

    API.put('/users/profile', dataToSend).then(() => {
      import('react-toastify').then(({ toast }) => toast.success('Personal information saved and synced with server!'))
    }).catch((err) => {
      console.error('Error updating profile', err)
      import('react-toastify').then(({ toast }) => toast.error('Saved locally but failed to sync: ' + (err?.response?.data?.message || err.message)))
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

    if (allergy._id && token) {
      API.put(`/allergies/${allergy._id}`, allergy)
        .then(res => {
          const updated = res.data.allergy
          setFormData(prev => {
            const arr = [...prev.allergies]
            arr[index] = updated
            return { ...prev, allergies: arr }
          })
          setEditingAllergyIndex(null)
          import('react-toastify').then(({ toast }) => toast.success('Allergy updated'))
        }).catch(err => {
          console.error('Update allergy failed', err)
          import('react-toastify').then(({ toast }) => toast.error('Failed to update allergy'))
        })
    } else {
      // Create new allergy if no _id
      const token = localStorage.getItem('token')
      if (!token) {
        import('react-toastify').then(({ toast }) => toast.info('Login to persist allergy'))
        setEditingAllergyIndex(null)
        return
      }
      API.post('/allergies', allergy)
        .then(res => {
          const created = res.data.allergy
          setFormData(prev => {
            const arr = [...prev.allergies]
            arr[index] = created
            return { ...prev, allergies: arr }
          })
          setEditingAllergyIndex(null)
          import('react-toastify').then(({ toast }) => toast.success('Allergy created'))
        }).catch(err => {
          console.error('Create allergy failed', err)
          import('react-toastify').then(({ toast }) => toast.error('Failed to create allergy'))
        })
    }
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
              <div className="flex gap-2">
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <button
                  onClick={handleSaveBloodType}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2"
                >
                  <FaCheck /> Save
                </button>
              </div>
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
                              onChange={(e) => setFormData(prev => {
                                const arr = [...prev.allergies]
                                arr[idx] = { ...arr[idx], name: e.target.value }
                                return { ...prev, allergies: arr }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                            <div className="grid md:grid-cols-2 gap-2">
                              <select
                                value={allergy.severity}
                                onChange={(e) => setFormData(prev => {
                                  const arr = [...prev.allergies]
                                  arr[idx] = { ...arr[idx], severity: e.target.value }
                                  return { ...prev, allergies: arr }
                                })}
                                className="px-3 py-2 border border-gray-300 rounded"
                              >
                                <option value="mild">Mild</option>
                                <option value="moderate">Moderate</option>
                                <option value="severe">Severe</option>
                              </select>
                              <input
                                type="text"
                                value={allergy.reaction}
                                onChange={(e) => setFormData(prev => {
                                  const arr = [...prev.allergies]
                                  arr[idx] = { ...arr[idx], reaction: e.target.value }
                                  return { ...prev, allergies: arr }
                                })}
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
