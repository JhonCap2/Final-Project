import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

// Asumimos que tienes una función para manejar el logout
const handleLogout = () => {
  // Lógica para limpiar el token, estado de autenticación, etc.
  console.log("Cerrando sesión...");
  localStorage.removeItem('token');
  // Redirige al login. Es mejor usar useNavigate() si el componente está dentro del Router.
  window.location.href = '/login';
};

export default function DashboardNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', text: 'Dashboard' },
    { to: '/profile', text: 'Mi Perfil' },
    { to: '/allergies', text: 'Mis Alergias' },
    { to: '/contacts', text: 'Contactos' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="flex items-center space-x-2">
              {/* Asume que tienes un logo en la carpeta public, como logo.jpg */}
              <img className="h-8 w-auto" src="/logo.jpg" alt="AllergySafety Logo" />
              <span className="text-xl font-bold text-gray-800">AllergySafety</span>
            </Link>
          </div>

          {/* Navegación para Escritorio */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  {link.text}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Iconos de Usuario y Logout para Escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/profile" className="text-gray-500 hover:text-orange-500 transition-colors">
              <FaUserCircle className="h-6 w-6" />
            </Link>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors" title="Cerrar Sesión">
              <FaSignOutAlt className="h-6 w-6" />
            </button>
          </div>

          {/* Botón de Menú para Móvil */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-orange-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú para Móvil */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)} // Cierra el menú al hacer clic
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {link.text}
              </NavLink>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 px-2">
            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}