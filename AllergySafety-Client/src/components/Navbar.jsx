import { NavLink } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'

export default function Navbar({ onLogout }) {
  const activeLinkStyle = {
    backgroundColor: '#10B981', // green-500
    color: 'white',
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/dashboard" className="text-xl font-bold text-green-600">
            AllergySafety
          </NavLink>
          
          <div className="flex items-center gap-4">
            <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-4 py-2 text-gray-700 font-semibold hover:bg-green-50 rounded-md transition">
              Dashboard
            </NavLink>
            <NavLink to="/profile" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-4 py-2 text-gray-700 font-semibold hover:bg-green-50 rounded-md transition">
              Profile
            </NavLink>
            <NavLink to="/contacts" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-4 py-2 text-gray-700 font-semibold hover:bg-green-50 rounded-md transition">
              Contacts
            </NavLink>
            <NavLink to="/history" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-4 py-2 text-gray-700 font-semibold hover:bg-green-50 rounded-md transition">
              History
            </NavLink>
            <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold hover:bg-red-600 rounded-md transition">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}