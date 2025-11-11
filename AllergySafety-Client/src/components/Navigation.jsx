import { useState } from 'react'
import { FaBars, FaTimes, FaHome, FaChartBar, FaHistory, FaSignOutAlt, FaUser, FaPhone } from 'react-icons/fa'

export default function Navigation({ isLoggedIn, onLogout, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = (page) => {
    onNavigate(page)
    setIsOpen(false)
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <img 
            src="public/Navigation Logo.png" 
            alt="AllergySafety" 
            className="h-14 w-48 cursor-pointer hover:opacity-80 transition"
            onClick={() => handleNavigate('home')}
          />

          {/* Mobile menu button */}
          <button onClick={toggleMenu} className="md:hidden text-2xl text-gray-600">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Navigation Links */}
          <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-6 absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none`}>
            {!isLoggedIn ? (
              // Show Home link when not logged in
              <button onClick={() => handleNavigate('home')} className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-semibold">
                <FaHome /> Home
              </button>
            ) : (
              // Show navigation when logged in
              <>
                <button onClick={() => handleNavigate('home')} className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-semibold">
                  <FaHome /> Home
                </button>
                <button onClick={() => handleNavigate('profile')} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-semibold">
                  <FaUser /> Profile
                </button>
                <button onClick={() => handleNavigate('emergency-contacts')} className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition font-semibold">
                  <FaPhone /> Emergency Contacts
                </button>
                <button onClick={() => handleNavigate('dashboard')} className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-semibold">
                  <FaChartBar /> Dashboard
                </button>
                <button onClick={() => handleNavigate('history')} className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition font-semibold">
                  <FaHistory /> History
                </button>
              </>
            )}

            {isLoggedIn && (
              <button onClick={() => {
                onLogout()
                setIsOpen(false)
              }} className="flex items-center gap-2 text-red-600 hover:text-red-700 transition font-bold ml-4">
                <FaSignOutAlt /> Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
