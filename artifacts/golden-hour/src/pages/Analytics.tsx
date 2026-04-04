import { useState } from 'react';
import { useLocation } from 'wouter';
import { ALL_HOSPITALS, CITIES, type City } from '@/lib/data';
import { PredictiveAnalytics } from '@/components/PredictiveAnalytics';

export default function Analytics() {
  const [, navigate] = useLocation();
  const [selectedCity, setSelectedCity] = useState<City>('Mumbai');

  const allHospitals = Object.values(ALL_HOSPITALS).flat();
  const totalICU = allHospitals.reduce((a, h) => a + h.icuBeds, 0);
  const availableICU = allHospitals.reduce((a, h) => a + h.availableICU, 0);
  const occupancy = Math.round(((totalICU - availableICU) / totalICU) * 100);
  const level1Count = allHospitals.filter(h => h.traumaLevel === 1).length;

  const cityHospitals = ALL_HOSPITALS[selectedCity] ?? [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-indigo-800 to-blue-900 text-white p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">📊 Live Analytics Dashboard</h1>
            <p className="text-blue-200 text-sm">City-wide Emergency Resource Monitor</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate('/historical')}
              className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
            >
              📈 Historical
            </button>
            <button
              onClick={() => navigate('/emergency')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500 transition-colors"
            >
              🚨 New Emergency
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-indigo-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors"
            >
              ← Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-blue-600">{allHospitals.length}</p>
            <p className="text-xs text-gray-500 mt-1">Networked Hospitals</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-green-600">{availableICU}</p>
            <p className="text-xs text-gray-500 mt-1">Available ICU Beds</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className={`text-3xl font-bold ${occupancy > 75 ? 'text-red-600' : occupancy > 50 ? 'text-yellow-600' : 'text-green-600'}`}>
              {occupancy}%
            </p>
            <p className="text-xs text-gray-500 mt-1">System Occupancy</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-purple-600">{level1Count}</p>
            <p className="text-xs text-gray-500 mt-1">Level 1 Trauma Centers</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CITIES.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                selectedCity === c
                  ? 'bg-indigo-700 text-white shadow'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔮 AI-Powered Predictions — {selectedCity}</h2>
          <PredictiveAnalytics city={selectedCity} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🏥 Hospital Directory — {selectedCity}</h3>
          <div className="space-y-3">
            {cityHospitals.map(h => {
              const load = Math.round(((h.icuBeds - h.availableICU) / h.icuBeds) * 100);
              return (
                <div key={h.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{h.name}</p>
                      <p className="text-xs text-gray-500">{h.address}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        load > 80 ? 'bg-red-100 text-red-700' :
                        load > 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {load}% occupied
                      </span>
                      <p className="text-xs text-gray-400 mt-1">Trauma L{h.traumaLevel}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm mb-2">
                    <span className="text-gray-600">ICU: <strong className="text-green-600">{h.availableICU}</strong>/{h.icuBeds}</span>
                    <span className="text-gray-600">Ventilators: <strong>{h.availableVentilators}</strong>/{h.ventilators}</span>
                    <span className="text-gray-600">Response: <strong>{h.avgResponseTime}m</strong></span>
                    <span className="text-gray-600">Rating: <strong>⭐ {h.rating}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {h.specialists.map(s => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${load > 80 ? 'bg-red-500' : load > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${load}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
