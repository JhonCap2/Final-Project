import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaUser, FaCamera, FaPhone, FaTint, FaEdit, FaTimes, FaSave, FaHeartbeat, FaPills } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [profilePic, setProfilePic] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bloodType: '',
    medicalConditions: [],
    medications: []
  })

  const token = localStorage.getItem('token')

  // Load user profile from server
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    axios.get('http://localhost:3001/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const userData = res.data.user
      setUser(userData)
      setFormData({
        fullName: userData.fullName || '',
        phone: userData.phone || '',
        bloodType: userData.bloodType || '',
        medicalConditions: userData.medicalConditions || [],
        medications: userData.medications || []
      })
      if (userData.profilePicture) {
        setProfilePic(userData.profilePicture)
      }
      setLoading(false)
    }).catch(err => {
      console.error('Failed to load profile:', err)
      toast.error('Failed to load profile')
      setLoading(false)
    })
  }, [token])

  const handleSaveProfile = () => {
    axios.put('http://localhost:3001/api/users/profile', 
      {
        fullName: formData.fullName,
        phone: formData.phone,
        bloodType: formData.bloodType,
        medicalConditions: formData.medicalConditions,
        medications: formData.medications
      },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(res => {
      setUser(res.data.user)
      setEditing(false)
      toast.success('Profile updated successfully!')
    }).catch(err => {
      console.error('Failed to update profile:', err)
      toast.error('Failed to update profile: ' + (err.response?.data?.message || err.message))
    })
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePic(reader.result)
  
        axios.put('http://localhost:3001/api/users/profile', 
          { profilePicture: reader.result },
          { headers: { Authorization: `Bearer ${token}` } }
        ).then(res => {
          setUser(res.data.user)
          toast.success('Foto de perfil actualizada!')
        }).catch(err => {
          console.error('Error al guardar la foto:', err)
          toast.error('No se pudo guardar la foto: ' + (err.response?.data?.message || err.message))
        })
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Please log in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
              <FaUser /> My Profile
            </h1>
            <button
              onClick={() => setEditing(!editing)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
                editing
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {editing ? (
                <>
                  <FaTimes /> Cancel
                </>
              ) : (
                <>
                  <FaEdit /> Edit
                </>
              )}
            </button>
          </div>

          {/* Profile Picture Section */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-gray-200 flex items-center justify-center text-gray-500 text-6xl overflow-hidden border-4 border-white shadow-md">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUser />
                )}
              </div>
              {editing && (
                <label className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full cursor-pointer transition shadow-md">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex-1">
              {editing ? (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 text-sm">Name</p>
                  <p className="text-3xl font-bold text-gray-800">{user.fullName || 'Not set'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Email */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-600 text-sm font-semibold mb-1">Email</p>
              <p className="text-gray-800 font-bold">{user.email}</p>
            </div>

            {/* Phone */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="text-gray-600 text-sm font-semibold mb-2 flex items-center gap-1">
                <FaPhone /> Phone
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-1 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <p className="text-gray-800 font-bold">{formData.phone || 'Not set'}</p>
              )}
            </div>

            {/* Blood Type */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="text-gray-600 text-sm font-semibold mb-2 flex items-center gap-1">
                <FaTint /> Blood Type
              </label>
              {editing ? (
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="w-full px-3 py-1 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              ) : (
                <p className={`text-gray-800 font-bold text-lg ${!formData.bloodType && 'text-red-500'}`}>
                  {formData.bloodType || 'Not set'}
                </p>
              )}
            </div>
          </div>

          {/* Save Button (only when editing) */}
          {editing && (
            <button
              onClick={handleSaveProfile}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <FaSave /> Save Changes
            </button>
          )}
        </div>

        {/* Medical Conditions Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaHeartbeat className="text-red-500" /> Medical Conditions
          </h2>

          {formData.medicalConditions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.medicalConditions.map((condition, idx) => (
                <div key={idx} className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                  <p className="text-gray-800 font-semibold">{condition}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic">No medical conditions recorded</p>
          )}
        </div>

        {/* Medications Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaPills className="text-green-600" /> Medications
          </h2>

          {formData.medications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-50 text-left">
                    <th className="px-4 py-2 font-bold text-gray-800">Medication</th>
                    <th className="px-4 py-2 font-bold text-gray-800">Dosage</th>
                    <th className="px-4 py-2 font-bold text-gray-800">Frequency</th>
                    <th className="px-4 py-2 font-bold text-gray-800">For Allergy</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.medications.map((med, idx) => (
                    <tr key={idx} className="border-b hover:bg-green-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">{med.name}</td>
                      <td className="px-4 py-3 text-gray-700">{med.dosage || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{med.frequency || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{med.allergyFor || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 italic">No medications recorded</p>
          )}
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm font-semibold opacity-90">Account Status</p>
            <p className="text-2xl font-bold">Active</p>
            <p className="text-xs opacity-75 mt-2">✓ Verified</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm font-semibold opacity-90">Member Since</p>
            <p className="text-2xl font-bold">
              {new Date(user.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm font-semibold opacity-90">Last Login</p>
            <p className="text-2xl font-bold">
              {user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
                : 'Today'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-sm font-semibold opacity-90">Account ID</p>
            <p className="text-lg font-bold truncate" title={user._id}>
              {user._id.substring(0, 8)}...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
