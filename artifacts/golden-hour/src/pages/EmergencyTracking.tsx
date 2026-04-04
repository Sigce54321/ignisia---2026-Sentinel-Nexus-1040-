import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import type { TriageResult } from '@/lib/engines/triage-engine';
import type { RoutingStrategy } from '@/lib/engines/optimization-engine';
import type { AssignmentResult } from '@/lib/engines/ambulance-assignment';
import type { Hospital } from '@/lib/data';
import { AmbulanceHealth } from '@/components/AmbulanceHealth';
import { WeatherImpact } from '@/components/WeatherImpact';
import { HospitalPreAlert } from '@/components/HospitalPreAlert';
import { LiveETACountdown } from '@/components/LiveETACountdown';
import { PredictiveAnalytics } from '@/components/PredictiveAnalytics';
import { SystemExplanation } from '@/components/SystemExplanation';
import { LiveHospitalData } from '@/components/LiveHospitalData';
import { NotificationCenter } from '@/components/NotificationCenter';
import { GreenCorridorStatus } from '@/components/GreenCorridorStatus';

interface EmergencyData {
  id: string;
  triage: TriageResult;
  strategy: RoutingStrategy;
  ambulance: AssignmentResult;
  city: string;
  patientLat: number;
  patientLng: number;
  createdAt: number;
}

const SEVERITY_GRADIENT: Record<string, string> = {
  CRITICAL: 'from-red-700 to-red-900',
  HIGH: 'from-orange-600 to-red-800',
  MODERATE: 'from-yellow-600 to-orange-700',
  LOW: 'from-green-600 to-emerald-700',
};

function HospitalCard({ hospital, label, labelColor, eta }: { hospital: Hospital; label: string; labelColor: string; eta: number }) {
  const hasICU = hospital.capabilities.availableICU;
  return (
    <div className={`bg-white rounded-xl p-5 shadow border-l-4 ${labelColor}`}>
      <p className={`text-xs font-bold mb-1 ${labelColor.includes('red') ? 'text-red-600' : 'text-blue-600'}`}>{label}</p>
      <h3 className="text-lg font-bold text-gray-900">{hospital.name}</h3>
      <p className="text-gray-500 text-sm mb-2">{hospital.location.address}</p>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div><p className="text-xs text-gray-400">ETA</p><p className="font-bold text-red-600">{eta}m</p></div>
        <div><p className="text-xs text-gray-400">ICU Free</p><p className="font-bold text-green-600">{hasICU}</p></div>
        <div><p className="text-xs text-gray-400">Rating</p><p className="font-bold">⭐ {hospital.rating}</p></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {Object.entries(hospital.specialists)
          .filter(([, v]) => v)
          .map(([k]) => (
            <span key={k} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full capitalize border">{k}</span>
          ))}
      </div>
    </div>
  );
}

export default function EmergencyTracking() {
  const [data, setData] = useState<EmergencyData | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const stored = sessionStorage.getItem('goldenHourEmergency');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      navigate('/emergency');
    }
  }, [navigate]);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold">Loading emergency data...</p>
        </div>
      </div>
    );
  }

  const { triage, strategy, ambulance, city, patientLat, patientLng } = data;
  const hospital = strategy.mode === 'SPLIT' ? strategy.primaryHospital : strategy.selectedHospital;
  const eta = strategy.mode === 'SPLIT' ? (strategy.etaPrimary ?? strategy.totalETA) : strategy.totalETA;
  const gradientClass = SEVERITY_GRADIENT[triage.severity] ?? 'from-red-700 to-red-900';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className={`bg-gradient-to-r ${gradientClass} text-white`}>
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                <span className="text-sm font-bold opacity-80">EMERGENCY ACTIVE</span>
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{data.id}</span>
              </div>
              <h1 className="text-4xl font-black">{triage.severity}</h1>
              <p className="opacity-80 text-sm mt-1">
                Score: {triage.score} · AI Confidence: {triage.aiConfidence}% · {strategy.mode} routing · {city}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">ETA</p>
              <p className="text-5xl font-black">{eta}<span className="text-xl">m</span></p>
              {triage.needsICU && (
                <div className="mt-1 bg-white/20 text-xs font-bold px-3 py-1 rounded-full animate-pulse">🚨 ICU REQUIRED</div>
              )}
              {triage.needsVentilator && (
                <div className="mt-1 bg-white/20 text-xs font-bold px-3 py-1 rounded-full animate-pulse">💨 VENTILATOR</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        <div className="flex gap-3">
          <button onClick={() => navigate('/emergency')} className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-700 transition-colors">🔄 New Emergency</button>
          <button onClick={() => navigate('/analytics')} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">📊 Dashboard</button>
        </div>

        {strategy.mode === 'SPLIT' && strategy.primaryHospital && strategy.secondaryHospital ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HospitalCard hospital={strategy.primaryHospital} label="STEP 1 — STABILIZE" labelColor="border-red-500" eta={strategy.etaPrimary ?? eta} />
            <HospitalCard hospital={strategy.secondaryHospital} label="STEP 2 — SPECIALIST CARE" labelColor="border-blue-500" eta={strategy.etaSecondary ?? 30} />
          </div>
        ) : hospital ? (
          <HospitalCard hospital={hospital} label="SELECTED HOSPITAL" labelColor="border-green-500" eta={eta} />
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LiveETACountdown initialETA={strategy.totalETA} />
          <WeatherImpact baseETA={strategy.totalETA} />
        </div>

        {hospital && (
          <GreenCorridorStatus
            fromLat={patientLat} fromLng={patientLng}
            toLat={hospital.location.lat} toLng={hospital.location.lng}
          />
        )}

        <AmbulanceHealth ambulanceId={ambulance.primary.callSign} onFailure={id => console.log('Backup dispatched:', id)} />

        {hospital && <LiveHospitalData hospitalId={hospital.id} hospitalName={hospital.name} />}

        <HospitalPreAlert hospital={hospital} patient="Emergency Patient" eta={eta} />

        <NotificationCenter
          hospitalName={hospital?.name ?? 'Hospital'}
          ambulanceId={ambulance.primary.callSign}
          eta={eta}
          severity={triage.severity}
        />

        <SystemExplanation triage={triage} strategy={strategy} />

        <div>
          <h2 className="text-xl font-black text-gray-900 mb-3">🔮 Predictive Analysis</h2>
          <PredictiveAnalytics city={city} />
        </div>

        <div className="text-center pb-6">
          <button onClick={() => navigate('/emergency')} className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors">🔄 Start New Assessment</button>
        </div>
      </div>
    </div>
  );
}
