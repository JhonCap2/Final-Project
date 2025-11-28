import { useRef } from 'react'
import { FaShieldAlt, FaPhone, FaHeartbeat, FaMap, FaBell, FaLock, FaCheckCircle, FaStar, FaArrowRight } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Welcome from './Welcome' // Importamos los slides

export default function Home() {
  const token = localStorage.getItem('token')
  const mainContentRef = useRef(null) // Ref para la sección principal

  const handleScrollToContent = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <main className="pt-16">
        <Welcome onWelcomeComplete={handleScrollToContent} />
      <section ref={mainContentRef} className="max-w-7xl mx-auto px-4 py-24 relative scroll-mt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="text-center mb-20 relative z-10">
          <div className="inline-block mb-6">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 px-6 py-2 rounded-full text-sm font-bold text-white">🚀 Smart Health Security</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 via-slate-900 to-black mb-10 pb-2">
            AllergySafety
          </h1>

          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Your Personal Emergency Response System</p>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            AllergySafety is a comprehensive app designed to keep you safe by storing critical health information and enabling emergency alerts when you need them most.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to={token ? "/dashboard" : "/login"}
              className="group bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {token ? 'Go to Dashboard' : 'Get Started'}
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <a href="#why-choose" className="bg-gray-800 hover:bg-black text-white px-10 py-4 rounded-lg font-bold text-lg transition flex items-center justify-center">
              Learn More
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20 relative z-10">
          {/* Feature 1 - Card con fondo blanco */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg transition-transform transform hover:-translate-y-1">
            <FaShieldAlt className="text-5xl text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Register Allergies</h3>
            <p className="text-gray-600">
              Keep a detailed record of your allergies with severity levels. Share this critical information during emergencies.
            </p>
          </div>

          {/* Feature 2 - Card con fondo blanco */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg transition-transform transform hover:-translate-y-1">
            <FaHeartbeat className="text-5xl text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Manage Medications</h3>
            <p className="text-gray-600">
              Keep track of all your medications and usage instructions. Never miss a dose again.
            </p>
          </div>

          {/* Feature 3 - Card con fondo blanco */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg transition-transform transform hover:-translate-y-1">
            <FaPhone className="text-5xl text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Emergency Contacts</h3>
            <p className="text-gray-600">
              Store emergency contact information for quick access when you need it the most.
            </p>
          </div>

          {/* Feature 4 - Card con fondo blanco */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg transition-transform transform hover:-translate-y-1">
            <FaBell className="text-5xl text-yellow-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Quick SOS Alert</h3>
            <p className="text-gray-600">
              Instantly activate SOS alerts to notify your contacts when immediate help is needed.
            </p>
          </div>

          {/* Feature 5 - Card con fondo blanco */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg transition-transform transform hover:-translate-y-1">
            <FaMap className="text-5xl text-purple-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Personal Profile</h3>
            <p className="text-gray-600">
              Create and manage your health profile with blood type, name, and medical conditions.
            </p>
          </div>

          {/* Feature 6 - Card con fondo blanco */}
          <div className="group relative bg-white rounded-2xl p-8 shadow-lg transition-transform transform hover:-translate-y-1">
            <FaLock className="text-5xl text-indigo-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your health data is securely stored. Your privacy is our top priority.
            </p>
          </div>
        </div>

        {/* Why Choose Section */}
        <section id="why-choose" className="bg-gray-800 rounded-2xl shadow-2xl p-12 text-white mb-20 relative z-10 scroll-mt-24">
          <h2 className="text-4xl font-bold mb-12 text-center text-green-400">Why Choose AllergySafety?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-start gap-4 mb-8">
                <FaCheckCircle className="text-3xl text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Always Ready</h4>
                  <p className="text-gray-300">Your health information is always accessible, even in emergencies.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-8">
                <FaCheckCircle className="text-3xl text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Easy to Use</h4>
                  <p className="text-gray-300">A simple and intuitive interface that anyone can use within minutes.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaCheckCircle className="text-3xl text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Comprehensive</h4>
                  <p className="text-gray-300">Everything you need to manage your health in one place.</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-4 mb-8">
                <FaCheckCircle className="text-3xl text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Fast Response</h4>
                  <p className="text-gray-300">Activate SOS alerts instantly when immediate help is required.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-8">
                <FaCheckCircle className="text-3xl text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Peace of Mind</h4>
                  <p className="text-gray-300">Know that your contacts and medical info are always available.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaCheckCircle className="text-3xl text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Data Control</h4>
                  <p className="text-gray-300">You control your data with maximum privacy guaranteed.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-20 relative z-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Ready to Stay Safe?</h2>
          <p className="text-xl text-gray-700 mb-10">Sign in to your account and start managing your health information today.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to={token ? "/dashboard" : "/login"}
              className="group bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {token ? 'Go to Dashboard' : 'Get Started'}
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
            <a href="#why-choose" className="bg-gray-800 hover:bg-black text-white px-10 py-4 rounded-lg font-bold text-lg transition flex items-center justify-center">
              Learn More
            </a>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid md:grid-cols-4 gap-6 relative z-10">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaStar className="text-5xl text-green-500 mx-auto mb-3" />
            <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">100%</p>
            <p className="text-gray-600 text-lg font-semibold">Secure & Private</p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaBell className="text-5xl text-cyan-500 mx-auto mb-3" />
            <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">24/7</p>
            <p className="text-gray-600 text-lg font-semibold">Available</p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaShieldAlt className="text-5xl text-yellow-500 mx-auto mb-3" />
            <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">⚡</p>
            <p className="text-gray-600 text-lg font-semibold">Instant Alerts</p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <FaHeartbeat className="text-5xl text-purple-500 mx-auto mb-3" />
            <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">✓</p>
            <p className="text-gray-600 text-lg font-semibold">Easy to Use</p>
          </div>
        </section>
      </section>
      </main>
    </div>
  )
}
