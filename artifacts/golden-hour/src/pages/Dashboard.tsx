import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ALL_HOSPITALS, CITIES, type City, type Hospital } from '@/lib/data';
import { haversineKm } from '@/lib/utils/distance';

interface ActiveEmergency {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  hospital: string;
  ambulance: string;
  eta: number;
  city: string;
  status: 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVING';
  createdAt: number;
}

const MOCK_EMERGENCIES: ActiveEmergency[] = [
  { id: 'EM-K2B4X', severity: 'CRITICAL', hospital: 'Lilavati Hospital', ambulance: 'AMB-101', eta: 6, city: 'Mumbai', status: 'EN_ROUTE', createdAt: Date.now() - 120000 },
  { id: 'EM-L9PQR', severity: 'HIGH', hospital: 'AIIMS New Delhi', ambulance: 'AMB-201', eta: 12, city: 'Delhi', status: 'DISPATCHED', createdAt: Date.now() - 60000 },
  { id: 'EM-M3WXY', severity: 'MODERATE', hospital: 'Manipal Hospital', ambulance: 'AMB-301', eta: 3, city: 'Bangalore', status: 'ARRIVING', createdAt: Date.now() - 240000 },
];

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: 'bg-red-100 border-red-400 text-red-800',
  HIGH: 'bg-orange-100 border-orange-400 text-orange-800',
  MODERATE: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  LOW: 'bg-green-100 border-green-400 text-green-800',
};

const STATUS_COLOR: Record<string, string> = {
  DISPATCHED: 'text-blue-600 bg-blue-50',
  EN_ROUTE: 'text-yellow-600 bg-yellow-50',
  ARRIVING: 'text-green-600 bg-green-50',
};

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [selectedCity, setSelectedCity] = useState<City>('Mumbai');
  const [emergencies, setEmergencies] = useState<ActiveEmergency[]>(MOCK_EMERGENCIES);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTick(p => p + 1);
      setEmergencies(prev => prev.map(e => ({
        ...e,
        eta: Math.max(0, e.eta - 1),
        status: e.eta <= 2 ? 'ARRIVING' : e.eta <= 6 ? 'EN_ROUTE' : 'DISPATCHED',
      })));
    }, 30000);
    return () => clearInterval(t);
  }, []);

  const cityHospitals = ALL_HOSPITALS[selectedCity] ?? [];
  const allHospitals = Object.values(ALL_HOSPITALS).flat();

  const totalICU = allHospitals.reduce((a, h) => a + h.capabilities.icuBeds, 0);
  const availableICU = allHospitals.reduce((a, h) => a + h.capabilities.availableICU, 0);
  const totalVents = allHospitals.reduce((a, h) => a + h.capabilities.ventilators, 0);
  const availableVents = allHospitals.reduce((a, h) => a + h.capabilities.availableVentilators, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-slate-800 to-gray-900 text-white px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black">🖥️ Emergency Dashboard</h1>
            <p className="text-gray-300 text-sm">Live system status · {allHospitals.length} hospitals monitored</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => navigate('/emergency')} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500 transition-colors">🚨 New Emergency</button>
            <button onClick={() => navigate('/analytics')} className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors">📊 Analytics</button>
            <button onClick={() => navigate('/')} className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">← Home</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Emergencies', value: emergencies.length, color: 'text-red-600', icon: '🚨' },
            { label: 'Available ICU', value: `${availableICU}/${totalICU}`, color: 'text-green-600', icon: '🛏️' },
            { label: 'Ventilators Free', value: `${availableVents}/${totalVents}`, color: 'text-blue-600', icon: '💨' },
            { label: 'Hospitals Online', value: allHospitals.filter(h => h.status === 'AVAILABLE').length, color: 'text-purple-600', icon: '🏥' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🚑 Active Emergencies</h2>
          {emergencies.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">✅</p>
              <p className="font-medium">No active emergencies</p>
            </div>
          ) : (
            <div className="space-y-3">
              {emergencies.map(em => (
                <div key={em.id} className={`rounded-lg p-4 border-2 ${SEVERITY_COLOR[em.severity]}`}>
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${SEVERITY_COLOR[em.severity]}`}>
                          {em.severity}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{em.id}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[em.status]}`}>
                          {em.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900">→ {em.hospital}</p>
                      <p className="text-sm text-gray-600">{em.city} · Ambulance: <strong>{em.ambulance}</strong></p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-gray-800">{em.eta}<span className="text-base">m</span></p>
                      <p className="text-xs text-gray-500">ETA remaining</p>
                    </div>
                  </div>
                  {em.eta <= 2 && (
                    <div className="mt-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full text-center animate-pulse">
                      🏥 PREPARE FOR ARRIVAL
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate('/emergency')}
            className="mt-4 w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-500 transition-colors"
          >
            + New Emergency Dispatch
          </button>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <h2 className="text-lg font-bold text-gray-900">🏥 Hospital Status</h2>
            <div className="flex gap-2">
              {CITIES.map(c => (
                <button key={c} onClick={() => setSelectedCity(c)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    selectedCity === c ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >{c}</button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-3 font-bold text-gray-700">Hospital</th>
                  <th className="text-center p-3 font-bold text-gray-700">ICU</th>
                  <th className="text-center p-3 font-bold text-gray-700">Vents</th>
                  <th className="text-center p-3 font-bold text-gray-700">Response</th>
                  <th className="text-center p-3 font-bold text-gray-700">Rating</th>
                  <th className="text-center p-3 font-bold text-gray-700">Status</th>
                  <th className="text-center p-3 font-bold text-gray-700">Load</th>
                </tr>
              </thead>
              <tbody>
                {cityHospitals.map((h, i) => {
                  const { icuBeds, availableICU: aICU, ventilators, availableVentilators } = h.capabilities;
                  const load = icuBeds > 0 ? Math.round(((icuBeds - aICU) / icuBeds) * 100) : 0;
                  return (
                    <tr key={h.id} className={`border-b hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="p-3">
                        <p className="font-bold text-gray-900">{h.name}</p>
                        <p className="text-xs text-gray-400">{h.capabilities.trauma ? '🏥 Trauma' : 'Standard'}</p>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`font-bold ${aICU < 5 ? 'text-red-600' : aICU < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {aICU}
                        </span>
                        <span className="text-gray-400">/{icuBeds}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`font-bold ${availableVentilators < 3 ? 'text-red-600' : 'text-green-600'}`}>
                          {availableVentilators}
                        </span>
                        <span className="text-gray-400">/{ventilators}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`font-bold ${h.responseTime < 8 ? 'text-green-600' : h.responseTime < 12 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {h.responseTime}m
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold">⭐ {h.rating}</td>
                      <td className="p-3 text-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          h.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                          h.status === 'BUSY' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>{h.status}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${load > 80 ? 'bg-red-500' : load > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${load}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8 shrink-0">{load}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
