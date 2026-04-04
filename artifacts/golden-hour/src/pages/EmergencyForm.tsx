import { useState } from 'react';
import { useLocation } from 'wouter';
import { runTriageEngine, type TriageInput, type Vitals } from '@/lib/engines/triage-engine';
import { runOptimizationEngine } from '@/lib/engines/optimization-engine';
import { ALL_HOSPITALS, CITIES, type City } from '@/lib/data';
import { assignAmbulance } from '@/lib/engines/ambulance-assignment';

const SYMPTOM_OPTIONS = [
  'Chest Pain', 'Head Injury', 'Stroke', 'Cardiac Arrest', 'Fracture',
  'Burns', 'Seizure', 'Overdose', 'Trauma', 'Spinal Injury',
  'Internal Bleeding', 'Severe Allergic Reaction', 'Respiratory Distress', 'Abdominal Pain',
];

const CITY_COORDS: Record<City, { lat: number; lng: number }> = {
  Mumbai: { lat: 19.076, lng: 72.877 },
  Delhi: { lat: 28.613, lng: 77.209 },
  Bangalore: { lat: 12.972, lng: 77.594 },
  Pune: { lat: 18.520, lng: 73.856 },
};

const DEFAULT_VITALS: Vitals = {
  heartRate: 80,
  systolicBP: 120,
  diastolicBP: 80,
  o2Saturation: 98,
  temperature: 37.0,
  respiratoryRate: 16,
};

export default function EmergencyForm() {
  const [, navigate] = useLocation();
  const [city, setCity] = useState<City>('Mumbai');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [consciousness, setConsciousness] = useState<'ALERT' | 'CONFUSED' | 'UNCONSCIOUS'>('ALERT');
  const [breathing, setBreathing] = useState<'NORMAL' | 'LABORED' | 'ABSENT'>('NORMAL');
  const [bleeding, setBleeding] = useState<'NONE' | 'MINOR' | 'SEVERE'>('NONE');
  const [vitals, setVitals] = useState<Vitals>(DEFAULT_VITALS);
  const [loading, setLoading] = useState(false);
  const [customSymptom, setCustomSymptom] = useState('');

  const toggleSymptom = (s: string) => {
    setSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim())) {
      setSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const input: TriageInput = {
        symptoms,
        vitals,
        age,
        gender,
        consciousness,
        breathing,
        bleeding,
      };

      const triage = runTriageEngine(input);
      const coords = CITY_COORDS[city];
      const hospitals = ALL_HOSPITALS[city] ?? [];
      const strategy = runOptimizationEngine(hospitals, coords.lat, coords.lng, triage);
      const ambulance = assignAmbulance(coords.lat, coords.lng);

      const emergencyId = `EM-${Date.now().toString(36).toUpperCase()}`;

      sessionStorage.setItem('goldenHourEmergency', JSON.stringify({
        id: emergencyId,
        triage,
        strategy,
        ambulance,
        city,
        patientLat: coords.lat,
        patientLng: coords.lng,
        createdAt: Date.now(),
      }));

      navigate(`/track/${emergencyId}`);
    }, 1800);
  };

  const updateVital = (key: keyof Vitals, value: number) => {
    setVitals(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-red-300 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors"
        >
          ← Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🚨</div>
          <h1 className="text-3xl font-black text-white mb-1">Emergency Assessment</h1>
          <p className="text-red-200 text-sm">Fill out patient details for AI-powered triage & routing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10">
            <h2 className="text-white font-bold mb-4">📍 Location & Patient Info</h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">City</label>
              <div className="grid grid-cols-4 gap-2">
                {CITIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`py-2 px-3 rounded-lg text-sm font-bold border-2 transition-all ${
                      city === c
                        ? 'bg-red-600 border-red-500 text-white'
                        : 'bg-white/10 border-white/20 text-gray-300 hover:border-white/40'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Age: {age}</label>
                <input
                  type="range" min={1} max={100} value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['MALE', 'FEMALE', 'OTHER'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        gender === g ? 'bg-red-600 border-red-500 text-white' : 'bg-white/10 border-white/20 text-gray-300'
                      }`}
                    >
                      {g[0] + g.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10">
            <h2 className="text-white font-bold mb-4">🩺 Clinical Status</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Consciousness</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ALERT', 'CONFUSED', 'UNCONSCIOUS'] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setConsciousness(l)}
                      className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                        consciousness === l
                          ? l === 'ALERT' ? 'bg-green-600 border-green-500 text-white'
                            : l === 'CONFUSED' ? 'bg-yellow-600 border-yellow-500 text-white'
                            : 'bg-red-700 border-red-600 text-white'
                          : 'bg-white/10 border-white/20 text-gray-300'
                      }`}
                    >
                      {l === 'ALERT' ? '✅' : l === 'CONFUSED' ? '😵' : '🚨'} {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Breathing</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['NORMAL', 'LABORED', 'ABSENT'] as const).map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBreathing(b)}
                      className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                        breathing === b
                          ? b === 'NORMAL' ? 'bg-green-600 border-green-500 text-white'
                            : b === 'LABORED' ? 'bg-yellow-600 border-yellow-500 text-white'
                            : 'bg-red-700 border-red-600 text-white'
                          : 'bg-white/10 border-white/20 text-gray-300'
                      }`}
                    >
                      {b === 'NORMAL' ? '🫁' : b === 'LABORED' ? '😮‍💨' : '⛔'} {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Bleeding</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['NONE', 'MINOR', 'SEVERE'] as const).map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBleeding(b)}
                      className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                        bleeding === b
                          ? b === 'NONE' ? 'bg-green-600 border-green-500 text-white'
                            : b === 'MINOR' ? 'bg-yellow-600 border-yellow-500 text-white'
                            : 'bg-red-700 border-red-600 text-white'
                          : 'bg-white/10 border-white/20 text-gray-300'
                      }`}
                    >
                      {b === 'NONE' ? '🩹' : b === 'MINOR' ? '💉' : '🩸'} {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10">
            <h2 className="text-white font-bold mb-4">📊 Vital Signs</h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Heart Rate (bpm)', key: 'heartRate', min: 20, max: 250, unit: 'bpm', danger: (v: number) => v < 40 || v > 140 },
                { label: 'Systolic BP (mmHg)', key: 'systolicBP', min: 50, max: 250, unit: 'mmHg', danger: (v: number) => v < 80 || v > 180 },
                { label: 'O2 Saturation (%)', key: 'o2Saturation', min: 50, max: 100, unit: '%', danger: (v: number) => v < 90 },
                { label: 'Temperature (°C)', key: 'temperature', min: 32, max: 42, unit: '°C', danger: (v: number) => v > 40 || v < 35, step: 0.1 },
                { label: 'Respiratory Rate', key: 'respiratoryRate', min: 4, max: 60, unit: '/min', danger: (v: number) => v < 8 || v > 30 },
                { label: 'Diastolic BP (mmHg)', key: 'diastolicBP', min: 30, max: 150, unit: 'mmHg', danger: (v: number) => v < 50 },
              ].map(({ label, key, min, max, unit, danger, step }) => {
                const val = vitals[key as keyof Vitals];
                const isDanger = danger(val);
                return (
                  <div key={key} className={`rounded-lg p-3 ${isDanger ? 'bg-red-900/50 border border-red-500/50' : 'bg-white/5'}`}>
                    <label className="block text-xs text-gray-300 mb-1">{label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={min}
                        max={max}
                        step={step ?? 1}
                        value={val}
                        onChange={e => updateVital(key as keyof Vitals, Number(e.target.value))}
                        className={`w-full bg-white/10 rounded px-2 py-1.5 text-sm font-bold text-white border ${
                          isDanger ? 'border-red-400' : 'border-white/20'
                        } focus:outline-none focus:border-red-400`}
                      />
                      <span className="text-xs text-gray-400 whitespace-nowrap">{unit}</span>
                    </div>
                    {isDanger && <p className="text-xs text-red-400 mt-1">⚠️ Abnormal</p>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10">
            <h2 className="text-white font-bold mb-4">🔍 Symptoms</h2>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {SYMPTOM_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSymptom(s)}
                  className={`py-2 px-3 rounded-lg text-sm text-left font-medium border-2 transition-all ${
                    symptoms.includes(s)
                      ? 'bg-red-600/80 border-red-500 text-white'
                      : 'bg-white/10 border-white/20 text-gray-300 hover:border-white/40'
                  }`}
                >
                  {symptoms.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSymptom}
                onChange={e => setCustomSymptom(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSymptom())}
                placeholder="Add custom symptom..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-400"
              />
              <button
                type="button"
                onClick={addCustomSymptom}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500 transition-colors"
              >
                + Add
              </button>
            </div>
            {symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {symptoms.map(s => (
                  <span
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className="bg-red-600/70 text-white text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-red-700 transition-colors"
                  >
                    {s} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-5 rounded-2xl text-xl font-black hover:shadow-2xl hover:shadow-red-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI Processing Emergency...
              </span>
            ) : (
              '🚨 ACTIVATE EMERGENCY ROUTING'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
