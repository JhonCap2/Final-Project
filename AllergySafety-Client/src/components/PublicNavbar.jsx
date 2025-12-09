import { NavLink } from 'react-router-dom'

export default function PublicNavbar() {
  return (
    <nav className="bg-slate-900/80 shadow-md fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="flex items-center">
            <img className="h-8 w-auto" src="/logo.jpg" alt="AllergySafety Logo" />
          </NavLink> 
          
          <div className="flex items-center gap-4">
            <NavLink 
              to="/login" 
              className="px-5 py-2 text-gray-200 font-semibold hover:bg-white/10 rounded-md transition"
            >
              Login
            </NavLink>
            <NavLink 
              to="/register" 
              className="px-5 py-2 bg-green-500 text-white font-bold hover:bg-green-600 rounded-md transition"
            >
              Register
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}