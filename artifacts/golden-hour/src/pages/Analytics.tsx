import { useLocation } from 'wouter';
import { hospitals } from '@/lib/hospitals';
import { PredictiveAnalytics } from '@/components/PredictiveAnalytics';

export default function Analytics() {
  const [, navigate] = useLocation();

  const totalICU = hospitals.reduce((a, h) => a + h.icuBeds, 0);
  const availableICU = hospitals.reduce((a, h) => a + h.availableICU, 0);
  const occupancy = Math.round(((totalICU - availableICU) / totalICU) * 100);

  const level1Count = hospitals.filter(h => h.traumaLevel === 1).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-indigo-800 to-blue-900 text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">📊 Hospital Analytics</h1>
            <p className="text-blue-200 text-sm">City-wide Emergency Resource Dashboard</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-indigo-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors"
          >
            ← Back to Triage
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-blue-600">{hospitals.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Hospitals</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold text-green-600">{availableICU}</p>
            <p className="text-xs text-gray-500 mt-1">Available ICU Beds</p>
          </div>
          <div className={`bg-white rounded-xl p-4 shadow text-center`}>
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

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 AI-Powered Predictions</h2>
          <PredictiveAnalytics city="Mumbai" />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🏥 Hospital Directory</h3>
          <div className="space-y-3">
            {hospitals.map(h => {
              const load = Math.round(((h.icuBeds - h.availableICU) / h.icuBeds) * 100);
              return (
                <div key={h.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{h.name}</p>
                      <p className="text-xs text-gray-500">{h.distance} km · Trauma Level {h.traumaLevel}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        load > 80 ? 'bg-red-100 text-red-700' :
                        load > 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {load}% occupied
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">ICU: <strong className="text-green-600">{h.availableICU}</strong>/{h.icuBeds}</span>
                    <span className="text-gray-600">Avg Response: <strong>{h.avgResponseTime}min</strong></span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {h.specialties.map(s => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${load > 80 ? 'bg-red-500' : load > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
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
