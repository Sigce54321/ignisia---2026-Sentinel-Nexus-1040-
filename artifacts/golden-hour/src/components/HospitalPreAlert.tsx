import { useState } from 'react';
import type { Hospital } from '@/lib/data';

interface HospitalPreAlertProps {
  hospital: Hospital | undefined;
  patient: string;
  eta: number;
}

export function HospitalPreAlert({ hospital, patient, eta }: HospitalPreAlertProps) {
  const [alertSent, setAlertSent] = useState(false);
  const [preparationStatus, setPreparationStatus] = useState([
    { task: 'ICU Bed Reserved', status: 'pending' },
    { task: 'Trauma Team Notified', status: 'pending' },
    { task: 'Equipment Prepared', status: 'pending' },
    { task: 'Blood Bank Alerted', status: 'pending' },
  ]);

  const sendAlert = () => {
    setAlertSent(true);

    preparationStatus.forEach((_, index) => {
      setTimeout(() => {
        setPreparationStatus(prev =>
          prev.map((item, i) =>
            i === index ? { ...item, status: 'completed' } : item
          )
        );
      }, (index + 1) * 1500);
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-lg border-2 border-purple-400">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        📢 Hospital Pre-Alert System
      </h3>

      <div className="bg-white rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600">Alert Destination</p>
        <p className="text-lg font-bold text-gray-900">🏥 {hospital?.name ?? 'Unknown Hospital'}</p>
        <p className="text-sm text-gray-600 mt-1">Patient: {patient}</p>
        <p className="text-sm text-gray-600 mt-1">Arriving in <strong>{eta} minutes</strong></p>
      </div>

      {!alertSent ? (
        <button
          onClick={sendAlert}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-2xl transition-transform hover:scale-105"
        >
          📡 Send Pre-Alert to Hospital
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-100 border border-green-500 rounded-lg p-3 text-center">
            <p className="text-green-800 font-bold">✅ Alert Sent Successfully!</p>
            <p className="text-xs text-green-700">Hospital is preparing for patient arrival</p>
          </div>

          <div className="space-y-2">
            {preparationStatus.map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  item.status === 'completed'
                    ? 'bg-green-100 border border-green-400'
                    : 'bg-gray-100 border border-gray-300'
                }`}
              >
                <span className="text-sm font-medium text-gray-900">{item.task}</span>
                {item.status === 'completed' ? (
                  <span className="text-green-600 font-bold">✓</span>
                ) : (
                  <span className="text-gray-400 animate-pulse">⏳</span>
                )}
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-400 rounded-lg p-3 text-center">
            <p className="text-blue-800 text-sm font-bold">
              🏥 Hospital Ready for Patient Reception
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
