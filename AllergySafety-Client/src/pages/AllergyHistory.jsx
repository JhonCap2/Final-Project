import { useState } from 'react'
import { FaHistory, FaPlus, FaTrash, FaCalendar, FaMapLocationDot, FaCheck } from 'react-icons/fa'

export default function AllergyHistory({ userData, setUserData }) {
  const [newIncident, setNewIncident] = useState({
    date: new Date().toISOString().split('T')[0],
    allergen: '',
    severity: 'mild',
    location: '',
    medication: '',
    notes: ''
  })

  const addIncident = () => {
    if (newIncident.date && newIncident.allergen.trim()) {
      setUserData(prev => ({
        ...prev,
        allergyHistory: [...(prev.allergyHistory || []), newIncident]
      }))
      setNewIncident({
        date: new Date().toISOString().split('T')[0],
        allergen: '',
        severity: 'mild',
        location: '',
        medication: '',
        notes: ''
      })
    }
  }

  const removeIncident = (index) => {
    setUserData(prev => ({
      ...prev,
      allergyHistory: prev.allergyHistory.filter((_, i) => i !== index)
    }))
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'severe': return 'text-red-600 bg-red-50 border-red-200'
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'mild': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const sortedHistory = [...(userData?.allergyHistory || [])].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <FaHistory /> Allergy Reaction History
          </h1>
          <p className="text-purple-100">Track and manage your allergic reactions over time</p>
        </div>

        {/* Add New Incident */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Record Allergic Reaction</h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={newIncident.date}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Allergen</label>
                  <input
                    type="text"
                    value={newIncident.allergen}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, allergen: e.target.value }))}
                    placeholder="e.g., Peanuts"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Severity</label>
                  <select
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, severity: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Home, Work, Restaurant"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Medication Used</label>
                <input
                  type="text"
                  value={newIncident.medication}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, medication: e.target.value }))}
                  placeholder="e.g., Epinephrine, Benadryl"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Notes</label>
                <textarea
                  value={newIncident.notes}
                  onChange={(e) => setNewIncident(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Describe the reaction, symptoms, what triggered it, etc."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={addIncident}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-lg"
              >
                <FaPlus /> Record Incident
              </button>
            </div>
          </div>
        </div>

        {/* History Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Reaction Timeline ({sortedHistory.length} incidents)
          </h2>

          {sortedHistory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No allergic reactions recorded yet</p>
              <p className="text-gray-400">When you experience an allergic reaction, record it here to track patterns and manage your health better</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedHistory.map((incident, idx) => (
                <div key={idx} className={`p-6 rounded-lg border-2 ${getSeverityColor(incident.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Date and Allergen */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 text-sm font-bold">
                          <FaCalendar className="text-lg" />
                          {new Date(incident.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className={`px-3 py-1 rounded-full font-bold text-sm ${
                          incident.severity === 'severe' ? 'bg-red-200 text-red-800' :
                          incident.severity === 'moderate' ? 'bg-orange-200 text-orange-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {incident.severity.toUpperCase()}
                        </div>
                      </div>

                      {/* Allergen */}
                      <p className="text-xl font-bold mb-3">
                        Allergen: <span className="text-purple-600">{incident.allergen}</span>
                      </p>

                      {/* Details Grid */}
                      <div className="grid md:grid-cols-2 gap-4 mb-3">
                        {incident.location && (
                          <div className="flex items-start gap-2">
                            <FaMapLocationDot className="mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold opacity-75">Location</p>
                              <p className="font-semibold">{incident.location}</p>
                            </div>
                          </div>
                        )}
                        {incident.medication && (
                          <div>
                            <p className="text-xs font-semibold opacity-75">Medication Used</p>
                            <p className="font-semibold">{incident.medication}</p>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {incident.notes && (
                        <div className="mt-3 p-3 bg-white bg-opacity-50 rounded">
                          <p className="text-xs font-semibold opacity-75 mb-1">Notes</p>
                          <p className="text-sm">{incident.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeIncident(idx)}
                      className="p-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition ml-4 flex-shrink-0"
                      title="Delete Incident"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics Section */}
        {sortedHistory.length > 0 && (
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-600">
              <p className="text-gray-600 text-sm font-semibold mb-2">SEVERE REACTIONS</p>
              <p className="text-3xl font-bold text-red-600">
                {sortedHistory.filter(i => i.severity === 'severe').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-600">
              <p className="text-gray-600 text-sm font-semibold mb-2">MODERATE REACTIONS</p>
              <p className="text-3xl font-bold text-orange-600">
                {sortedHistory.filter(i => i.severity === 'moderate').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-yellow-600">
              <p className="text-gray-600 text-sm font-semibold mb-2">MILD REACTIONS</p>
              <p className="text-3xl font-bold text-yellow-600">
                {sortedHistory.filter(i => i.severity === 'mild').length}
              </p>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-8 space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
            <p className="text-blue-900 font-semibold mb-2">📊 Why Track Reactions?</p>
            <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
              <li>Identify patterns and triggers for your allergies</li>
              <li>Monitor severity progression or improvement</li>
              <li>Track which medications are most effective</li>
              <li>Share complete history with medical professionals</li>
              <li>Plan better prevention strategies</li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
            <p className="text-green-900 font-semibold mb-2">✅ Best Practices</p>
            <ul className="list-disc list-inside text-green-800 text-sm space-y-1">
              <li>Record reactions as soon as possible after they occur</li>
              <li>Be detailed about symptoms and medication response</li>
              <li>Note environmental or food factors that may have triggered it</li>
              <li>Keep accurate dates for pattern analysis</li>
              <li>Review your history regularly with your doctor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
