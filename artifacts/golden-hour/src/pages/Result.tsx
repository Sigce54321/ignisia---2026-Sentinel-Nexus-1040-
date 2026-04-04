import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import type { EmergencyResult } from '@/lib/triage';
import { AmbulanceHealth } from '@/components/AmbulanceHealth';
import { WeatherImpact } from '@/components/WeatherImpact';
import { HospitalPreAlert } from '@/components/HospitalPreAlert';
import { LiveETACountdown } from '@/components/LiveETACountdown';
import { SystemExplanation } from '@/components/SystemExplanation';

export default function Result() {
  const [result, setResult] = useState<EmergencyResult | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const stored = sessionStorage.getItem('goldenHourResult');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!result) return null;

  const { triage, strategy } = result;

  const severityColor = {
    CRITICAL: 'from-red-600 to-red-800',
    HIGH: 'from-orange-500 to-orange-700',
    MEDIUM: 'from-yellow-500 to-yellow-700',
  }[triage.severity];

  const hospital = strategy.mode === 'SPLIT'
    ? strategy.primaryHospital
    : strategy.selectedHospital;

  const eta = strategy.mode === 'SPLIT'
    ? (strategy.etaPrimary ?? strategy.totalETA)
    : strategy.totalETA;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-red-800 to-red-900 text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🏥 Golden Hour System</h1>
            <p className="text-red-200 text-sm">Emergency Routing Active</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-red-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-50 transition-colors"
          >
            ← New Emergency
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className={`bg-gradient-to-r ${severityColor} text-white rounded-2xl p-6 shadow-2xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80 mb-1">Triage Severity</p>
              <h2 className="text-5xl font-black">{triage.severity}</h2>
              {triage.needsICU && (
                <div className="mt-2 inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  ⚠️ ICU REQUIRED
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80 mb-1">Routing Mode</p>
              <div className="text-2xl font-bold">
                {strategy.mode === 'SPLIT' ? '🔀 SPLIT' : '🎯 DIRECT'}
              </div>
              <p className="text-sm opacity-80 mt-1">Score: {triage.score}</p>
            </div>
          </div>
        </div>

        {strategy.mode === 'SPLIT' && strategy.primaryHospital && strategy.secondaryHospital ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow border-l-4 border-red-500">
              <p className="text-xs font-bold text-red-600 mb-1">STEP 1 — STABILIZE</p>
              <h3 className="text-lg font-bold text-gray-900">{strategy.primaryHospital.name}</h3>
              <p className="text-gray-600 text-sm">{strategy.primaryHospital.distance} km away</p>
              <p className="text-sm mt-2">
                <span className="font-bold text-red-600">{strategy.etaPrimary} min</span>{' '}
                <span className="text-gray-500">ETA</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {strategy.primaryHospital.specialties.map(s => (
                  <span key={s} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow border-l-4 border-blue-500">
              <p className="text-xs font-bold text-blue-600 mb-1">STEP 2 — SPECIALIST CARE</p>
              <h3 className="text-lg font-bold text-gray-900">{strategy.secondaryHospital.name}</h3>
              <p className="text-gray-600 text-sm">{strategy.secondaryHospital.distance} km away</p>
              <p className="text-sm mt-2">
                <span className="font-bold text-blue-600">{strategy.etaSecondary} min</span>{' '}
                <span className="text-gray-500">ETA after transfer</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {strategy.secondaryHospital.specialties.map(s => (
                  <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ) : strategy.selectedHospital ? (
          <div className="bg-white rounded-xl p-5 shadow border-l-4 border-green-500">
            <p className="text-xs font-bold text-green-600 mb-1">SELECTED HOSPITAL</p>
            <h3 className="text-xl font-bold text-gray-900">{strategy.selectedHospital.name}</h3>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <p className="text-xs text-gray-500">Distance</p>
                <p className="font-bold text-gray-900">{strategy.selectedHospital.distance} km</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ICU Beds Free</p>
                <p className="font-bold text-green-600">{strategy.selectedHospital.availableICU}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Trauma Level</p>
                <p className="font-bold text-gray-900">Level {strategy.selectedHospital.traumaLevel}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {strategy.selectedHospital.specialties.map(s => (
                <span key={s} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Live Monitoring Dashboard</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <LiveETACountdown initialETA={strategy.totalETA} />
            <WeatherImpact baseETA={strategy.totalETA} />
          </div>
        </div>

        <div>
          <AmbulanceHealth
            ambulanceId="AMB-101"
            onFailure={(backupId: string) => console.log('Backup dispatched:', backupId)}
          />
        </div>

        <div>
          <HospitalPreAlert
            hospital={hospital}
            patient="Emergency Patient"
            eta={eta}
          />
        </div>

        <div>
          <SystemExplanation triage={triage} strategy={strategy} />
        </div>

        <div className="text-center pb-8">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors"
          >
            🔄 Start New Emergency Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
