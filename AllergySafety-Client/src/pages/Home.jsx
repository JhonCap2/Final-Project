import { FaShieldAlt, FaPhone, FaHeartbeat, FaMap, FaBell, FaLock, FaCheckCircle, FaStar, FaArrowRight } from 'react-icons/fa'

export default function Home() {
  const token = localStorage.getItem('token')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="text-center mb-20 relative z-10">
          <div className="inline-block mb-6">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 px-6 py-2 rounded-full text-sm font-bold text-white">🚀 Smart Health Security</span>
          </div>
          
         <h1 className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 mb-10 pb-2">
  AllergySafety
</h1>

          
          <p className="text-2xl md:text-3xl font-bold text-white mb-8">Your Personal Emergency Response System</p>
          
          <p className="text-lg text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            AllergySafety is a comprehensive app designed to keep you safe by storing critical health information and enabling emergency alerts when you need them most.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              className="group bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {token ? 'Go to Dashboard' : 'Get Started'}
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-lg font-bold text-lg transition backdrop-blur-sm border border-white/20">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20 relative z-10">
          {/* Feature 1 */}
          <div className="group relative bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-8 hover:from-green-500/30 hover:to-green-600/30 transition backdrop-blur-sm border border-green-400/30 hover:border-green-400/60">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400 to-transparent opacity-0 group-hover:opacity-10 transition"></div>
            <FaShieldAlt className="text-5xl text-green-400 mb-4 relative z-10" />
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Register Allergies</h3>
            <p className="text-gray-300 relative z-10">
              Keep a detailed record of your allergies with severity levels. Share this critical information during emergencies.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-8 hover:from-blue-500/30 hover:to-blue-600/30 transition backdrop-blur-sm border border-blue-400/30 hover:border-blue-400/60">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-transparent opacity-0 group-hover:opacity-10 transition"></div>
            <FaHeartbeat className="text-5xl text-blue-400 mb-4 relative z-10" />
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Manage Medications</h3>
            <p className="text-gray-300 relative z-10">
              Keep track of all your medications and usage instructions. Never miss a dose again.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl p-8 hover:from-red-500/30 hover:to-red-600/30 transition backdrop-blur-sm border border-red-400/30 hover:border-red-400/60">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-400 to-transparent opacity-0 group-hover:opacity-10 transition"></div>
            <FaPhone className="text-5xl text-red-400 mb-4 relative z-10" />
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Emergency Contacts</h3>
            <p className="text-gray-300 relative z-10">
              Store emergency contact information for quick access when you need it the most.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group relative bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl p-8 hover:from-yellow-500/30 hover:to-yellow-600/30 transition backdrop-blur-sm border border-yellow-400/30 hover:border-yellow-400/60">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400 to-transparent opacity-0 group-hover:opacity-10 transition"></div>
            <FaBell className="text-5xl text-yellow-400 mb-4 relative z-10" />
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Quick SOS Alert</h3>
            <p className="text-gray-300 relative z-10">
              Instantly activate SOS alerts to notify your contacts when immediate help is needed.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-8 hover:from-purple-500/30 hover:to-purple-600/30 transition backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-transparent opacity-0 group-hover:opacity-10 transition"></div>
            <FaMap className="text-5xl text-purple-400 mb-4 relative z-10" />
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Personal Profile</h3>
            <p className="text-gray-300 relative z-10">
              Create and manage your health profile with blood type, name, and medical conditions.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="group relative bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-2xl p-8 hover:from-indigo-500/30 hover:to-indigo-600/30 transition backdrop-blur-sm border border-indigo-400/30 hover:border-indigo-400/60">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-transparent opacity-0 group-hover:opacity-10 transition"></div>
            <FaLock className="text-5xl text-indigo-400 mb-4 relative z-10" />
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Secure & Private</h3>
            <p className="text-gray-300 relative z-10">
              Your health data is securely stored. Your privacy is our top priority.
            </p>
          </div>
        </div>

        {/* Why Choose Section */}
        <section className="bg-gradient-to-r from-green-500/30 via-cyan-500/30 to-green-500/30 rounded-2xl shadow-2xl p-12 text-white mb-20 backdrop-blur-sm border border-green-400/30 relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose AllergySafety?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-start gap-4 mb-8">
                <FaCheckCircle className="text-3xl text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Always Ready</h4>
                  <p className="text-gray-200">Your health information is always accessible, even in emergencies.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-8">
                <FaCheckCircle className="text-3xl text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Easy to Use</h4>
                  <p className="text-gray-200">A simple and intuitive interface that anyone can use within minutes.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaCheckCircle className="text-3xl text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Comprehensive</h4>
                  <p className="text-gray-200">Everything you need to manage your health in one place.</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-4 mb-8">
                <FaCheckCircle className="text-3xl text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Fast Response</h4>
                  <p className="text-gray-200">Activate SOS alerts instantly when immediate help is required.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-8">
                <FaCheckCircle className="text-3xl text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Peace of Mind</h4>
                  <p className="text-gray-200">Know that your contacts and medical info are always available.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaCheckCircle className="text-3xl text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold mb-2">Data Control</h4>
                  <p className="text-gray-200">You control your data with maximum privacy guaranteed.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-20 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Stay Safe?</h2>
          <p className="text-xl text-gray-300 mb-10">Sign in to your account and start managing your health information today.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button
              className="group bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {token ? 'Go to Dashboard' : 'Get Started'}
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-lg font-bold text-lg transition backdrop-blur-sm border border-white/20">
              Learn More
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid md:grid-cols-4 gap-6 relative z-10">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-8 text-center backdrop-blur-sm border border-green-400/30 hover:border-green-400/60 transition">
            <FaStar className="text-5xl text-green-400 mx-auto mb-3" />
            <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">100%</p>
            <p className="text-gray-300 text-lg font-semibold">Secure & Private</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl p-8 text-center backdrop-blur-sm border border-cyan-400/30 hover:border-cyan-400/60 transition">
            <FaBell className="text-5xl text-cyan-400 mx-auto mb-3" />
            <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">24/7</p>
            <p className="text-gray-300 text-lg font-semibold">Available</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl p-8 text-center backdrop-blur-sm border border-yellow-400/30 hover:border-yellow-400/60 transition">
            <FaShieldAlt className="text-5xl text-yellow-400 mx-auto mb-3" />
            <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">⚡</p>
            <p className="text-gray-300 text-lg font-semibold">Instant Alerts</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-8 text-center backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60 transition">
            <FaHeartbeat className="text-5xl text-purple-400 mx-auto mb-3" />
            <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">✓</p>
            <p className="text-gray-300 text-lg font-semibold">Easy to Use</p>
          </div>
        </section>
      </section>
    </div>
  )
}
