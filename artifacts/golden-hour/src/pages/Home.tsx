import { useState } from 'react';
import { useLocation } from 'wouter';
import { runTriage, PatientForm } from '@/lib/triage';

const SYMPTOM_OPTIONS = [
  'Chest Pain',
  'Head Injury',
  'Stroke',
  'Cardiac Arrest',
  'Fracture',
  'Burns',
  'Seizure',
  'Overdose',
  'Abdominal Pain',
  'Respiratory Distress',
];

export default function Home() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<PatientForm>({
    symptoms: [],
    age: 35,
    consciousness: 'ALERT',
    breathing: 'NORMAL',
    bleeding: 'NONE',
    city: 'Mumbai',
  });

  const toggleSymptom = (symptom: string) => {
    setForm(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = runTriage(form);
    sessionStorage.setItem('goldenHourResult', JSON.stringify(result));
    navigate('/result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🏥</div>
          <h1 className="text-4xl font-bold text-white mb-2">Golden Hour System</h1>
          <p className="text-red-200 text-lg">AI-Powered Emergency Routing & Triage</p>
          <div className="mt-2 inline-block bg-red-700 text-red-100 text-xs px-3 py-1 rounded-full">
            ⚡ Every second counts in the golden hour
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-2xl space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Patient Age</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={100}
                value={form.age}
                onChange={e => setForm(prev => ({ ...prev, age: Number(e.target.value) }))}
                className="flex-1 accent-red-600"
              />
              <span className="text-2xl font-bold text-red-600 w-12 text-center">{form.age}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Level of Consciousness</label>
            <div className="grid grid-cols-3 gap-2">
              {(['ALERT', 'CONFUSED', 'UNCONSCIOUS'] as const).map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, consciousness: level }))}
                  className={`py-2 px-3 rounded-lg text-sm font-bold border-2 transition-all ${
                    form.consciousness === level
                      ? level === 'ALERT' ? 'bg-green-100 border-green-500 text-green-700'
                        : level === 'CONFUSED' ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                        : 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {level === 'ALERT' ? '✅' : level === 'CONFUSED' ? '😵' : '🚨'} {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Breathing Status</label>
            <div className="grid grid-cols-3 gap-2">
              {(['NORMAL', 'LABORED', 'ABSENT'] as const).map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, breathing: status }))}
                  className={`py-2 px-3 rounded-lg text-sm font-bold border-2 transition-all ${
                    form.breathing === status
                      ? status === 'NORMAL' ? 'bg-green-100 border-green-500 text-green-700'
                        : status === 'LABORED' ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                        : 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {status === 'NORMAL' ? '🫁' : status === 'LABORED' ? '😮‍💨' : '⛔'} {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Bleeding</label>
            <div className="grid grid-cols-3 gap-2">
              {(['NONE', 'MINOR', 'SEVERE'] as const).map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, bleeding: level }))}
                  className={`py-2 px-3 rounded-lg text-sm font-bold border-2 transition-all ${
                    form.bleeding === level
                      ? level === 'NONE' ? 'bg-green-100 border-green-500 text-green-700'
                        : level === 'MINOR' ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                        : 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {level === 'NONE' ? '🩹' : level === 'MINOR' ? '💉' : '🩸'} {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Symptoms <span className="text-gray-400 font-normal">(select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SYMPTOM_OPTIONS.map(symptom => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`py-2 px-3 rounded-lg text-sm text-left font-medium border-2 transition-all ${
                    form.symptoms.includes(symptom)
                      ? 'bg-red-50 border-red-400 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {form.symptoms.includes(symptom) ? '✓ ' : ''}{symptom}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 rounded-xl text-xl font-bold hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            🚨 ACTIVATE EMERGENCY ROUTING
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/analytics')}
            className="text-red-200 hover:text-white text-sm underline transition-colors"
          >
            📊 View Hospital Analytics Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
