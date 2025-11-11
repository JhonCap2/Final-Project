import { useState } from 'react'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('welcome')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e3f2fd', padding: '40px' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#1976d2', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
          ✅ AllergySafety App is WORKING!
        </h1>
        
        <div style={{ fontSize: '18px', color: '#333', marginBottom: '30px' }}>
          <p><strong>Status:</strong> {isLoggedIn ? '✅ LOGGED IN' : '❌ NOT LOGGED IN'}</p>
          <p><strong>Current Page:</strong> {currentPage}</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setCurrentPage('welcome')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Welcome
          </button>
          <button 
            onClick={() => setCurrentPage('login')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#388e3c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Login
          </button>
          <button 
            onClick={() => { setIsLoggedIn(true); setCurrentPage('home'); }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Simulate Login
          </button>
          <button 
            onClick={() => { setIsLoggedIn(false); setCurrentPage('welcome'); }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f57c00',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>Current Page Content:</h2>
          <p style={{ color: '#666' }}>
            {!isLoggedIn && currentPage === 'welcome' && '📱 Welcome Page - Features Overview'}
            {!isLoggedIn && currentPage === 'login' && '🔐 Login Page - Enter your credentials'}
            {isLoggedIn && currentPage === 'home' && '🏠 Home Page - Dashboard'}
            {isLoggedIn && currentPage === 'emergency-contacts' && '📞 Emergency Contacts - Manage your contacts'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
