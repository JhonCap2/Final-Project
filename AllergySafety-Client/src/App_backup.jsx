import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Splash from './pages/Splash'
import EmergencyContactsPage from './pages/EmergencyContactsPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('welcome')
  const [showSplash, setShowSplash] = useState(false)

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage('welcome')
    setShowSplash(false)
  }

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setShowSplash(true)
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        {!showSplash && (
          <Navigation 
            isLoggedIn={isLoggedIn} 
            onLogout={handleLogout}
            onNavigate={setCurrentPage}
          />
        )}

        <main>
          {showSplash ? (
            <Splash onComplete={() => {
              setShowSplash(false)
              setCurrentPage('home')
            }} />
          ) : (
            <>
              {currentPage === 'welcome' && !isLoggedIn ? (
                <Welcome 
                  isLoggedIn={isLoggedIn} 
                  onLogin={() => setCurrentPage('login')} 
                />
              ) : currentPage === 'login' && !isLoggedIn ? (
                <Login 
                  onLoginSuccess={handleLoginSuccess}
                  onSwitchToRegister={() => setCurrentPage('register')}
                />
              ) : currentPage === 'register' && !isLoggedIn ? (
                <Register 
                  onRegisterSuccess={handleLoginSuccess}
                  onSwitchToLogin={() => setCurrentPage('login')}
                />
              ) : !isLoggedIn ? (
                <Welcome 
                  isLoggedIn={isLoggedIn} 
                  onLogin={() => setCurrentPage('login')} 
                />
              ) : currentPage === 'home' && isLoggedIn ? (
                <Home />
              ) : currentPage === 'profile' && isLoggedIn ? (
                <Profile />
              ) : currentPage === 'dashboard' && isLoggedIn ? (
                <Dashboard />
              ) : currentPage === 'history' && isLoggedIn ? (
                <History />
              ) : currentPage === 'emergency-contacts' && isLoggedIn ? (
                <EmergencyContactsPage />
              ) : isLoggedIn ? (
                <Home />
              ) : null}
            </>
          )}
        </main>
      </div>
    </Router>
  )
}

export default App
