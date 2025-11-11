import { useState, useEffect, useRef } from 'react'
import { FaBell, FaLocationDot, FaAmbulance, FaPhone, FaHospital, FaShieldAlt, FaCheckCircle, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function EmergencyAlert({ userData }) {
  const [isEmergency, setIsEmergency] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [timer, setTimer] = useState(0)

  // Simulate getting GPS location
  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            accuracy: Math.round(position.coords.accuracy),
            address: `Lat ${latitude.toFixed(6)}, Long ${longitude.toFixed(6)}`
          })
          setLocationError(null)
        },
        (error) => {
          setLocationError(error.message)
          // Fallback location for demo
          setLocation({
            latitude: '43.6629',
            longitude: '-79.3957',
            accuracy: 15,
            address: 'Toronto, ON (Demo Location)'
          })
        }
      )
    }
  }

  const activateEmergency = () => {
    // Add a short pre-activation countdown so users can cancel by mistake
    if (pendingEmergency) return
    setPendingEmergency(true)
    setPendingTimer(3)
    toast.info('Emergency will activate in 3 seconds — click Cancel to abort', { autoClose: 3000 })
    // pre-activation countdown handled in effect
  }

  // timersRef stores active timeout IDs so we can clear them on cancel/unmount
  const timersRef = useRef([])

  const startEmergencySequence = () => {
    setIsEmergency(true)
    setTimer(0)
    setNotifications([])
    getLocation()

    // schedule staggered notifications and toast them as they arrive
    const schedule = (fn, delay) => {
      const id = setTimeout(fn, delay)
      timersRef.current.push(id)
    }

    schedule(() => {
      const notif = {
        id: 1,
        service: 'Emergency Contacts',
        message: `Alert sent to ${userData?.emergencyContacts?.length || 0} emergency contacts`,
        icon: <FaPhone className="text-2xl text-green-600" />,
        timestamp: new Date().toLocaleTimeString()
      }
      setNotifications(prev => [...prev, notif])
      toast.success(notif.message)
    }, 500)

    schedule(() => {
      const notif = {
        id: 2,
        service: 'Paramedics (911)',
        message: 'Emergency services notified. ETA: 5-8 minutes',
        icon: <FaAmbulance className="text-2xl text-red-600" />,
        timestamp: new Date().toLocaleTimeString()
      }
      setNotifications(prev => [...prev, notif])
      toast.success(notif.message)
    }, 1500)

    schedule(() => {
      const notif = {
        id: 3,
        service: 'Police Department',
        message: 'Police dispatch notified of emergency',
        icon: <FaShieldAlt className="text-2xl text-blue-600" />,
        timestamp: new Date().toLocaleTimeString()
      }
      setNotifications(prev => [...prev, notif])
      toast.success(notif.message)
    }, 2500)

    schedule(() => {
      const notif = {
        id: 4,
        service: 'Nearby Hospitals',
        message: 'Emergency departments at 3 nearby hospitals alerted',
        icon: <FaHospital className="text-2xl text-orange-600" />,
        timestamp: new Date().toLocaleTimeString()
      }
      setNotifications(prev => [...prev, notif])
      toast.success(notif.message)
    }, 3500)
  }

  const cancelEmergency = () => {
    // Clear any scheduled timers
    timersRef.current.forEach(id => clearTimeout(id))
    timersRef.current = []
    setIsEmergency(false)
    setNotifications([])
    setTimer(0)
    setLocation(null)
    setPendingEmergency(false)
    setPendingTimer(0)
    toast.info('Emergency cancelled')
  }

  // Update timer while emergency is active
  useEffect(() => {
    let interval
    if (isEmergency) {
      interval = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isEmergency])

  // Pre-activation countdown effect
  useEffect(() => {
    let preInterval
    if (pendingEmergency) {
      preInterval = setInterval(() => {
        setPendingTimer(t => t - 1)
      }, 1000)
    }
    return () => clearInterval(preInterval)
  }, [pendingEmergency])

  // When pendingTimer reaches 0, start the emergency sequence
  useEffect(() => {
    if (pendingEmergency && pendingTimer <= 0) {
      setPendingEmergency(false)
      setPendingTimer(0)
      startEmergencySequence()
    }
  }, [pendingEmergency, pendingTimer])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(id => clearTimeout(id))
    }
  }, [])

  // pending emergency UI state
  const [pendingEmergency, setPendingEmergency] = useState(false)
  const [pendingTimer, setPendingTimer] = useState(0)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (isEmergency) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Emergency Active Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-2xl p-8 text-white mb-8 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <FaBell className="text-5xl" />
                <div>
                  <h1 className="text-4xl font-bold">🚨 EMERGENCY ALERT ACTIVE 🚨</h1>
                  <p className="text-red-100 text-lg mt-2">Emergency response system is tracking your location and notifying responders</p>
                </div>
              </div>
              <div className="text-5xl font-bold">{formatTime(timer)}</div>
            </div>
          </div>

          {/* Location Information */}
          {location && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-blue-600">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaLocationDot className="text-blue-600" /> Real-Time Location
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="text-gray-600 text-sm font-semibold mb-2">LATITUDE</p>
                  <p className="text-2xl font-mono font-bold text-gray-800">{location.latitude}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p className="text-gray-600 text-sm font-semibold mb-2">LONGITUDE</p>
                  <p className="text-2xl font-mono font-bold text-gray-800">{location.longitude}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded border border-gray-200 md:col-span-2">
                  <p className="text-gray-600 text-sm font-semibold mb-2">ADDRESS / LOCATION</p>
                  <p className="text-lg font-bold text-gray-800">{location.address}</p>
                  <p className="text-gray-600 text-sm mt-2">Accuracy: ±{location.accuracy}m</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                📍 Your exact location is being shared with emergency responders in real-time
              </div>
            </div>
          )}

          {/* Patient Medical Info Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-purple-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Medical Information Sent to Responders</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-4 rounded">
                <p className="text-gray-600 text-sm font-semibold mb-2">BLOOD TYPE</p>
                <p className="text-xl font-bold text-gray-800">{userData?.bloodType || 'Not Set'}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <p className="text-gray-600 text-sm font-semibold mb-2">KNOWN ALLERGIES</p>
                <p className="text-xl font-bold text-gray-800">{userData?.allergies?.length || 0} allergies</p>
              </div>
              <div className="bg-purple-50 p-4 rounded md:col-span-2">
                <p className="text-gray-600 text-sm font-semibold mb-2">CURRENT MEDICATIONS</p>
                <p className="text-sm text-gray-800">{userData?.medications?.length > 0 ? userData.medications.join(', ') : 'None recorded'}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded md:col-span-2">
                <p className="text-gray-600 text-sm font-semibold mb-2">MEDICAL CONDITIONS</p>
                <p className="text-sm text-gray-800">{userData?.medicalConditions?.length > 0 ? userData.medicalConditions.join(', ') : 'None recorded'}</p>
              </div>
            </div>
          </div>

          {/* Notifications Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaBell className="text-orange-600" /> Response Notifications
            </h2>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Sending notifications to emergency services...</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded border-l-4 border-green-600 animate-in">
                    <div>{notif.icon}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{notif.service}</p>
                      <p className="text-gray-600">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                    </div>
                    <FaCheckCircle className="text-2xl text-green-600 flex-shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Emergency Contacts Being Notified */}
          {userData?.emergencyContacts?.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-green-600">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaPhone className="text-green-600" /> Emergency Contacts Notified
              </h2>
              <div className="space-y-3">
                {userData.emergencyContacts.map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded border border-green-200">
                    <div>
                      <p className="font-bold text-gray-800">{contact.name}</p>
                      <p className="text-gray-600">{contact.phone} • {contact.relationship}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-2xl text-green-600" />
                      <span className="text-sm text-green-700 font-semibold">Notified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Services Status */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Emergency Services Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded border border-red-200">
                <div className="flex items-center gap-3">
                  <FaAmbulance className="text-3xl text-red-600" />
                  <div>
                    <p className="font-bold text-gray-800">Paramedics</p>
                    <p className="text-gray-600">ETA: 5-8 minutes</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-red-600 text-white rounded font-bold text-sm animate-pulse">RESPONDING</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-3xl text-blue-600" />
                  <div>
                    <p className="font-bold text-gray-800">Police Department</p>
                    <p className="text-gray-600">Dispatch notified</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-blue-600 text-white rounded font-bold text-sm animate-pulse">RESPONDING</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded border border-orange-200">
                <div className="flex items-center gap-3">
                  <FaHospital className="text-3xl text-orange-600" />
                  <div>
                    <p className="font-bold text-gray-800">Nearby Hospitals</p>
                    <p className="text-gray-600">3 hospitals alerted</p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-orange-600 text-white rounded font-bold text-sm animate-pulse">STANDING BY</span>
              </div>
            </div>
          </div>

          {/* Cancel Button */}
          <div className="flex justify-center mb-8">
            <button onClick={cancelEmergency} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition transform hover:scale-105">
              <FaTimes /> Cancel Emergency (False Alarm)
            </button>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 text-center">
            <p className="text-yellow-900 font-bold mb-2">⚠️ IMPORTANT NOTICE</p>
            <p className="text-yellow-800">If this is a REAL emergency, always call 911 directly. Do not rely solely on this app.</p>
            <p className="text-yellow-800 text-sm mt-2">This system is designed to supplement emergency services, not replace them.</p>
          </div>
        </div>
      </div>
    )
  }

  // Normal state - Show Emergency Button
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">Emergency Response System</h1>
          <p className="text-green-100">Press the emergency button below if you are experiencing a severe allergic reaction</p>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Use Emergency Alert</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600 text-lg">1</div>
              <div>
                <p className="font-bold text-gray-800">Press the Emergency Button</p>
                <p className="text-gray-600">Click the large red button below to activate emergency response</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600 text-lg">2</div>
              <div>
                <p className="font-bold text-gray-800">Real-Time Location Shared</p>
                <p className="text-gray-600">Your GPS location is immediately shared with emergency responders</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600 text-lg">3</div>
              <div>
                <p className="font-bold text-gray-800">Emergency Contacts Notified</p>
                <p className="text-gray-600">Your emergency contacts receive instant notifications with your location</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600 text-lg">4</div>
              <div>
                <p className="font-bold text-gray-800">Services Respond</p>
                <p className="text-gray-600">Paramedics, police, and hospitals are immediately notified and respond</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={activateEmergency}
            className="w-full md:w-96 h-96 md:h-80 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-full shadow-2xl flex flex-col items-center justify-center text-white transition transform hover:scale-110 active:scale-95 animate-pulse"
          >
            <div className="text-8xl mb-6">🚨</div>
            <p className="text-3xl font-bold text-center">EMERGENCY</p>
            <p className="text-xl text-red-100 mt-4">Press to Activate</p>
          </button>
        </div>

        {/* Important Notes */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Important Information</h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="font-bold text-yellow-900 mb-2">⚠️ Before Using Emergency Alert</p>
              <p className="text-yellow-800">Ensure your emergency contacts are properly configured. They will be notified immediately when you press the emergency button.</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="font-bold text-blue-900 mb-2">📍 Location Sharing</p>
              <p className="text-blue-800">This app requires location permission to share your GPS coordinates with emergency responders. Location will only be shared during an active emergency.</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <p className="font-bold text-green-900 mb-2">✅ Medical Information</p>
              <p className="text-green-800">Make sure your blood type, allergies, and medications are up-to-date in your personal information. This data is shared with emergency services.</p>
            </div>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="font-bold text-red-900 mb-2">🚨 Real Emergency?</p>
              <p className="text-red-800 font-bold">If you are experiencing a real life-threatening emergency, CALL 911 IMMEDIATELY. Do not rely solely on this app.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
