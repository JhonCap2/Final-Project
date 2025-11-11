import { useState } from 'react'
import axios from 'axios'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSuccess = (credentialResponse) => {
    // credentialResponse.credential is the JWT token from Google
    const googleToken = credentialResponse.credential
    console.log('Google token received:', googleToken.substring(0, 20) + '...')
    
    // Verify token with backend and login user
    axios.post('http://localhost:3001/api/auth/google', { token: googleToken }, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      const { token } = res.data
      if (token) localStorage.setItem('token', token)
      toast.success('✓ Logged in with Google!')
      onLoginSuccess()
    }).catch(err => {
      const msg = err?.response?.data?.message || 'Google login failed'
      setError(msg)
      toast.error(msg)
      console.error('Google login error:', err)
    })
  }

  const handleGoogleError = () => {
    const msg = 'Google login failed'
    setError(msg)
    toast.error(msg)
  }

  const handleFacebookLogin = () => {
    // Facebook login via Facebook SDK (will be loaded via HTML)
    if (window.FB) {
      window.FB.login(function(response) {
        if (response.authResponse) {
          const facebookToken = response.authResponse.accessToken
          console.log('Facebook token received:', facebookToken.substring(0, 20) + '...')
          
          // Send to backend for verification and login
          axios.post('http://localhost:3001/api/auth/facebook', { token: facebookToken }, {
            headers: { 'Content-Type': 'application/json' }
          }).then(res => {
            const { token } = res.data
            if (token) localStorage.setItem('token', token)
            toast.success('✓ Logged in with Facebook!')
            onLoginSuccess()
          }).catch(err => {
            const msg = err?.response?.data?.message || 'Facebook login failed'
            setError(msg)
            toast.error(msg)
            console.error('Facebook login error:', err)
          })
        } else {
          toast.error('Facebook login cancelled')
        }
      }, {scope: 'public_profile,email'})
    } else {
      toast.error('Facebook SDK not loaded. Please refresh and try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // Call API
    try {
      const res = await axios.post(
        'http://localhost:3001/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      )

      const { token } = res.data
      // Save token for authenticated requests
      if (token) localStorage.setItem('token', token)

      setLoading(false)
      toast.success('✓ Logged in successfully!')
      onLoginSuccess()
    } catch (err) {
      setLoading(false)
      const msg = err?.response?.data?.message || 'Login failed'
      setError(msg)
      toast.error(msg)
    }
  }

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your AllergySafety account</p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t-2 border-gray-200"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t-2 border-gray-200"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="large"
                  theme="outline"
                  text="signin_with"
                />
              </div>

              {/* Facebook Login */}
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 hover:border-blue-500 hover:bg-blue-50 transition font-semibold text-gray-700 flex items-center justify-center gap-2"
              >
                <FaFacebook className="text-blue-600" />
                <span>Login with Facebook</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-700">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-green-600 hover:text-green-700 font-bold cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-800">
              🔒 Your data is encrypted and secure. We never share your medical information.
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}
