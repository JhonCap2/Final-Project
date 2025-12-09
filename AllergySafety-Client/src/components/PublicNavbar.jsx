import { useState } from 'react';
import { NavLink } from 'react-router-dom'

export default function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900/80 shadow-md fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img className="h-8 w-auto" src="/logo.jpg" alt="AllergySafety Logo" />
          </NavLink> 
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink 
              to="/login" 
              className="px-5 py-2 text-gray-200 font-semibold hover:bg-white/10 rounded-md transition"
            >
              Login
            </NavLink>
            <NavLink 
              to="/register" 
              className="px-5 py-2 bg-emerald-500 text-white font-bold hover:bg-emerald-600 rounded-md transition"
            >
              Register
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-200 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink 
            to="/login" 
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-white/10"
          >
            Login
          </NavLink>
          <NavLink 
            to="/register" 
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-white/10"
          >
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  )
}