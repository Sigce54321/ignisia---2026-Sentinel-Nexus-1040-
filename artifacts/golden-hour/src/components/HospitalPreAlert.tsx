import { useState } from 'react';
import type { Hospital } from '@/lib/data';

interface HospitalPreAlertProps {
  hospital: Hospital | undefined;
  patient: string;
  eta: number;
}

const PREP_STEPS = [
  { task: '🛏️ ICU Bed Reserved', time: 1500 },
  { task: '🏃 Trauma Team Notified', time: 1500 },
  { task: '🔧 Equipment Prepared', time: 1500 },
  { task: '🩸 Blood Bank Alerted', time: 1500 },
];

export function HospitalPreAlert({ hospital, patient, eta }: HospitalPreAlertProps) {
  const [alertSent, setAlertSent] = useState(false);
  const [preparationStatus, setPreparationStatus] = useState(
    PREP_STEPS.map(p => ({ ...p, status: 'pending' as 'pending' | 'completed' }))
  );

  const sendAlert = () => {
    setAlertSent(true);
    PREP_STEPS.forEach((_, index) => {
      setTimeout(() => {
        setPreparationStatus(prev =>
          prev.map((item, i) =>
            i === index ? { ...item, status: 'completed' } : item
          )
        );
      }, PREP_STEPS.slice(0, index + 1).reduce((a, p) => a + p.time, 0));
    });
  };

  const allDone = preparationStatus.every(p => p.status === 'completed');

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-lg border-2 border-purple-400">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        📢 Hospital Pre-Alert System
      </h3>

      <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
        <p className="text-xs text-gray-500 font-semibold mb-1">ALERT DESTINATION</p>
        <p className="text-lg font-bold text-gray-900">🏥 {hospital?.name ?? 'Unknown Hospital'}</p>
        <p className="text-sm text-gray-600 mt-1">{hospital?.location.address}</p>
        <p className="text-sm text-gray-600 mt-1">
          Patient: <strong>{patient}</strong> · Arriving in <strong className="text-red-600">{eta} minutes</strong>
        </p>
        {hospital && (
          <p className="text-xs text-gray-400 mt-1">
            Emergency: {hospital.contact.emergency}
          </p>
        )}
      </div>

      {!alertSent ? (
        <button
          onClick={sendAlert}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          📡 Send Pre-Alert to Hospital
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-100 border border-green-500 rounded-lg p-3 text-center">
            <p className="text-green-800 font-bold">✅ Alert Sent Successfully!</p>
            <p className="text-xs text-green-700 mt-1">Hospital {hospital?.name} is preparing for patient arrival</p>
          </div>

          <div className="space-y-2">
            {preparationStatus.map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  item.status === 'completed'
                    ? 'bg-green-100 border border-green-400'
                    : 'bg-gray-100 border border-gray-300'
                }`}
              >
                <span className="text-sm font-medium text-gray-900">{item.task}</span>
                {item.status === 'completed' ? (
                  <span className="text-green-600 font-bold text-lg">✓</span>
                ) : (
                  <span className="text-gray-400 animate-pulse text-lg">⏳</span>
                )}
              </div>
            ))}
          </div>

          {allDone && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3 text-center">
              <p className="font-bold">🏥 Hospital Fully Prepared for Patient Reception</p>
              <p className="text-xs opacity-80 mt-1">All systems activated · Receiving team standing by</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
