import { useState } from 'react'
import { FaShieldAlt, FaBell, FaMapMarkerAlt, FaPhone, FaUserNurse, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function Welcome({ onWelcomeComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Welcome",
      description: "Every second counts during an allergic emergency. AllergySafety ensures immediate help reaches you.",
      image: "/Welcome.png",
      color: "from-green-400 to-green-600"
    },
    {
      title: "Emergency Alert",
      description: "One-click emergency activation. Your location is instantly shared with responders and emergency contacts.",
      image: "/Emergency Alert.png",
      color: "from-orange-400 to-orange-600"
    },
    {
      title: "Medical Info",
      description: "Store your allergies, medications, and medical history for quick access during emergencies.",
      image: "/Medical Info.png",
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "GPS Tracking",
      description: "Real-time location tracking ensures paramedics and hospitals know exactly where you are.",
      image: "/GPS Tracking.png",
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

  return (
    <section className="py-12">
      <div className="max-w-6xl w-full mx-auto">
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
                        onClick={onWelcomeComplete}
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
      </div>
    </section>
  )
}