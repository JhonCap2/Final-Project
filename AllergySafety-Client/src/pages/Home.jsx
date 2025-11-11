import { FaShieldAlt, FaPhone, FaHeartbeat, FaMap, FaBell, FaLock } from 'react-icons/fa'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">AllergySafety</h1>
          <p className="text-2xl text-green-600 font-semibold mb-6">Your Personal Emergency Response System</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            AllergySafety is a comprehensive app designed to keep you safe by storing critical health information and enabling emergency alerts when you need it most. Whether it's allergies, medications, or emergency contacts, we've got you covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <FaShieldAlt className="text-5xl text-green-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Track Allergies</h3>
            <p className="text-gray-600">
              Maintain a detailed list of your allergies with severity levels. Share this critical information in emergencies.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <FaHeartbeat className="text-5xl text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Manage Medications</h3>
            <p className="text-gray-600">
              Keep track of all your medications and their usage instructions. Never forget a dose or dosage again.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <FaPhone className="text-5xl text-red-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Emergency Contacts</h3>
            <p className="text-gray-600">
              Store emergency contact information for quick access when you need help the most.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <FaBell className="text-5xl text-yellow-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Quick SOS Alert</h3>
            <p className="text-gray-600">
              Activate SOS alerts instantly to notify emergency contacts when you need immediate assistance.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <FaMap className="text-5xl text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Personal Profile</h3>
            <p className="text-gray-600">
              Create and manage your personal health profile with blood type, name, and medical conditions.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <FaLock className="text-5xl text-indigo-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your health data is stored securely on your device. Your privacy is our priority.
            </p>
          </div>
        </div>

        {/* Why Choose Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose AllergySafety?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-3">✓ Always Ready</h4>
              <p className="mb-6">Your health information is always accessible, even in emergencies when you can't speak.</p>

              <h4 className="text-xl font-bold mb-3">✓ Easy to Use</h4>
              <p className="mb-6">Simple, intuitive interface that anyone can use in minutes. No complicated setup.</p>

              <h4 className="text-xl font-bold mb-3">✓ Comprehensive</h4>
              <p>Everything you need to manage your health and emergency information in one place.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-3">✓ Quick Response</h4>
              <p className="mb-6">Activate SOS alerts instantly to get help when you need it most.</p>

              <h4 className="text-xl font-bold mb-3">✓ Peace of Mind</h4>
              <p className="mb-6">Know that your emergency contacts and medical information are always available.</p>

              <h4 className="text-xl font-bold mb-3">✓ Data Control</h4>
              <p>You control your data. Everything is stored locally on your device for maximum privacy.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Stay Safe?</h2>
          <p className="text-lg text-gray-600 mb-8">Sign in to your account and start managing your health information today.</p>
          <div className="flex justify-center gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition">
              Get Started
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-lg font-bold transition">
              Learn More
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-20 grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">100%</p>
            <p className="text-gray-600 text-lg">Secure & Private</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">24/7</p>
            <p className="text-gray-600 text-lg">Available</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">Instant</p>
            <p className="text-gray-600 text-lg">SOS Alerts</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">Easy</p>
            <p className="text-gray-600 text-lg">to Use</p>
          </div>
        </section>
      </section>
    </div>
  )
}
