import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// Import pages
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

  // Without Router for now - just conditional rendering
  let pageContent = null

  if (showSplash) {
    pageContent = <Splash onComplete={() => {
      setShowSplash(false)
      setCurrentPage('home')
    }} />
  } else if (!isLoggedIn) {
    if (currentPage === 'login') {
      pageContent = <Login 
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setCurrentPage('register')}
      />
    } else if (currentPage === 'register') {
      pageContent = <Register 
        onRegisterSuccess={handleLoginSuccess}
        onSwitchToLogin={() => setCurrentPage('login')}
      />
    } else {
      pageContent = <Welcome 
        isLoggedIn={isLoggedIn} 
        onLogin={() => setCurrentPage('login')} 
      />
    }
  } else {
    if (currentPage === 'profile') {
      pageContent = <Profile />
    } else if (currentPage === 'dashboard') {
      pageContent = <Dashboard />
    } else if (currentPage === 'history') {
      pageContent = <History />
    } else if (currentPage === 'emergency-contacts') {
      pageContent = <EmergencyContactsPage />
    } else {
      pageContent = <Home />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      {/* Simple Navigation without Router */}
      {!showSplash && (
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <button onClick={() => setCurrentPage('home')} className="text-xl font-bold text-blue-600">
                AllergySafety
              </button>
              
              <div className="flex gap-4">
                {!isLoggedIn ? (
                  <>
                    <button onClick={() => setCurrentPage('login')} className="px-4 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded">
                      Login
                    </button>
                    <button onClick={() => setCurrentPage('register')} className="px-4 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded">
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setCurrentPage('home')} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      Home
                    </button>
                    <button onClick={() => setCurrentPage('profile')} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      Profile
                    </button>
                    <button onClick={() => setCurrentPage('emergency-contacts')} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      Contacts
                    </button>
                    <button onClick={() => setCurrentPage('dashboard')} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      Dashboard
                    </button>
                    <button onClick={() => setCurrentPage('history')} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                      History
                    </button>
                    <button onClick={() => handleLogout()} className="px-4 py-2 bg-red-600 text-white font-bold hover:bg-red-700 rounded">
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <main>
        {pageContent}
      </main>
    </div>
  )
}

export default App
