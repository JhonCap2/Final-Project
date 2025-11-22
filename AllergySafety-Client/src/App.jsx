import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './components/Navbar' // Barra para usuarios logueados
import PublicNavbar from './components/PublicNavbar' // Barra para visitantes
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import EmergencyContactsPage from './pages/EmergencyContactsPage'
import Login from './pages/Login'
import AddContactPage from './pages/AddContactPage' // Importa la nueva página
import AllergyHistory from './pages/AllergyHistory' // Importamos la página de historial
import Welcome from './pages/Welcome' // Importamos la página de bienvenida
import Register from './pages/Register'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // **LA LÓGICA CLAVE ESTÁ AQUÍ**
  // Este useEffect se ejecuta una vez cuando la app carga.
  useEffect(() => {
    // Comprueba si hay un token en el almacenamiento local.
    const token = localStorage.getItem('token')
    if (token) {
      // Si hay un token, consideramos que el usuario está logueado.
      setIsLoggedIn(true)
    }
  }, []) // El array vacío asegura que solo se ejecute una vez.

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  return (
    <Router>
      {/* El ToastContainer puede vivir fuera de la lógica de rutas */}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />

      {/* Lógica para mostrar la barra de navegación correcta */}
      {isLoggedIn ? (
        <Navbar onLogout={handleLogout} />
      ) : (
        <PublicNavbar />
      )}
      <main className="pt-16"> {/* Padding para que el contenido no quede debajo del Navbar */}
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={!isLoggedIn ? <Home /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!isLoggedIn ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isLoggedIn ? <Register onRegisterSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />

          {/* Rutas Privadas (Protegidas) */}
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/contacts" element={isLoggedIn ? <EmergencyContactsPage /> : <Navigate to="/login" />} />
          <Route path="/contacts/add" element={isLoggedIn ? <AddContactPage /> : <Navigate to="/login" />} />
          <Route path="/history" element={isLoggedIn ? <AllergyHistory /> : <Navigate to="/login" />} />
          
          {/* Ruta por defecto si no se encuentra nada */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App