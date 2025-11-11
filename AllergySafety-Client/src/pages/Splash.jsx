import { useEffect } from 'react'

export default function Splash({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000) // 3 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <img 
          src="/Home.png" 
          alt="AllergySafety" 
          className="w-96 h-auto mx-auto mb-8 rounded-lg shadow-2xl"
        />
        <div className="mt-8">
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-gray-700 text-lg mt-6 font-semibold">Welcome to AllergySafety</p>
        </div>
      </div>
    </div>
  )
}
