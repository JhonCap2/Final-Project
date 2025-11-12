import { useState } from 'react'
import { FaShieldAlt, FaBell, FaMapMarkerAlt, FaPhone, FaUserNurse, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function Welcome({ isLoggedIn, onLogin }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(true)

  const slides = [
    {
      title: "Welcome",
      description: "Every second counts during an allergic emergency. AllergySafety ensures immediate help reaches you.",
      image: "public/Welcome.png",
      color: "from-green-400 to-green-600"
    },
    {
      title: "Emergency Alert",
      description: "One-click emergency activation. Your location is instantly shared with responders and emergency contacts.",
      image: "public/Emergency Alert.png",
      color: "from-orange-400 to-orange-600"
    },
    {
      title: "Medical Info",
      description: "Store your allergies, medications, and medical history for quick access during emergencies.",
      image: "public/Medical Info.png",
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "GPS Tracking",
      description: "Real-time location tracking ensures paramedics and hospitals know exactly where you are.",
      image: "public/GPS Tracking.png",
      color: "from-blue-400 to-blue-600"
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const skipOnboarding = () => {
    setShowOnboarding(false)
  }

  if (showOnboarding && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          {/* Main Carousel Container */}
          <div className="relative overflow-hidden">
            {/* Slides Container */}
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="min-w-full flex justify-center px-4">
                  <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full transform hover:scale-[1.02] transition-transform duration-300">
                    {/* Illustration Image */}
                    <div className="relative mb-8">
                      <div className={`w-80 h-80 mx-auto bg-gradient-to-br ${slide.color} rounded-3xl flex items-center justify-center relative overflow-hidden p-8`}>
                        {/* Background Animation */}
                        <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
                        
                        {/* Illustration */}
                        <img 
                          src={slide.image} 
                          alt={slide.title}
                          className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center mt-8 mb-8">
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <h2 className="text-3xl font-bold text-gray-800">{slide.title}</h2>
                      </div>
                      <p className="text-gray-600 text-lg mb-12 leading-relaxed">
                        {slide.description}
                      </p>
                      {currentSlide === slides.length - 1 ? (
                        <button 
                          onClick={onLogin}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          Get Started
                        </button>
                      ) : (
                        <button 
                          onClick={nextSlide}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
              aria-label="Previous slide"
            >
              <FaChevronLeft className="text-xl" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
              aria-label="Next slide"
            >
              <FaChevronRight className="text-xl" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-orange-500 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Skip/Next Buttons */}
          <div className="flex justify-between mt-8 px-4">
            <button 
              onClick={onLogin}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Skip
            </button>
            <button 
              onClick={currentSlide === slides.length - 1 ? onLogin : nextSlide}
              className="text-orange-500 hover:text-orange-700 font-bold transition-colors flex items-center"
            >
              {currentSlide === slides.length - 1 ? 'Done' : 'Next'}
              <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main Welcome Page (shows after onboarding is skipped or completed)
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-end mb-4">
          <button 
            onClick={onLogin}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition transform hover:scale-105"
          >
            Login
          </button>
        </div>

        <div className="text-center mb-16">
          <img src="/logo.jpg" alt="AllergySafety" className="h-32 w-auto mx-auto mb-6" />
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Every second counts during an allergic emergency. AllergySafety ensures immediate help reaches you and your emergency contacts are notified instantly.
          </p>
          {!isLoggedIn ? (
            <button onClick={onLogin} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition transform hover:scale-105">
              Get Started →
            </button>
          ) : (
            <a href="/dashboard" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition transform hover:scale-105">
              Go to Dashboard →
            </a>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl text-orange-500 mb-4 flex justify-center">
              <FaBell />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">One-Click Emergency</h3>
            <p className="text-gray-600 text-center">
              Activate emergency alert instantly. Your location is tracked and shared with responders in real-time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl text-blue-500 mb-4 flex justify-center">
              <FaMapMarkerAlt />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Real-Time GPS Tracking</h3>
            <p className="text-gray-600 text-center">
              Paramedics, police, and nearby hospitals receive your exact location and critical medical information instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl text-red-500 mb-4 flex justify-center">
              <FaPhone />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Automatic Notifications</h3>
            <p className="text-gray-600 text-center">
              Emergency contacts are notified automatically with your location, allergy information, and medication details.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl text-green-600 mb-4 flex justify-center">
              <FaUserNurse />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Medical Information</h3>
            <p className="text-gray-600 text-center">
              Store your allergies, medications, blood type, and medical conditions for quick access during emergencies.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl text-purple-500 mb-4 flex justify-center">
              <FaCheckCircle />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Emergency Contacts</h3>
            <p className="text-gray-600 text-center">
              Keep a list of trusted emergency contacts who will be notified instantly when you need help.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl text-yellow-500 mb-4 flex justify-center">
              <FaShieldAlt />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Allergy History</h3>
            <p className="text-gray-600 text-center">
              Track allergic reactions, responses to treatment, and build a comprehensive medical history over time.
            </p>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Health?</h2>
          <p className="text-lg mb-8 text-green-100">
            Sign up now to start managing your allergies safely and securely.
          </p>
          {!isLoggedIn ? (
            <button onClick={onLogin} className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition transform hover:scale-105">
              Get Started Now →
            </button>
          ) : (
            <a href="/dashboard" className="inline-block bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition transform hover:scale-105">
              Open Dashboard →
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">&copy; 2024 AllergySafety - Emergency Allergy Management System</p>
          <p className="text-sm text-gray-500">In case of life-threatening emergency, always call 911 first</p>
        </div>
      </footer>
    </div>
  )
}