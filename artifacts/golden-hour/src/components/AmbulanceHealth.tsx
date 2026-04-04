import { useState, useEffect } from 'react';

interface HealthStatus {
  fuelLevel: number;
  engineStatus: 'GOOD' | 'WARNING' | 'CRITICAL';
  tirePressure: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  speed: number;
  location: string;
}

export function AmbulanceHealth({ ambulanceId, onFailure }: { ambulanceId: string; onFailure?: (backupId: string) => void }) {
  const [health, setHealth] = useState<HealthStatus>({
    fuelLevel: 75,
    engineStatus: 'GOOD',
    tirePressure: {
      frontLeft: 32,
      frontRight: 32,
      rearLeft: 30,
      rearRight: 30
    },
    speed: 45,
    location: 'En route'
  });
  const [failed, setFailed] = useState(false);
  const [backupAmbulance, setBackupAmbulance] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(prev => {
        const randomTire = Math.random();
        const newTirePressure = { ...prev.tirePressure };

        if (randomTire < 0.02 && !failed) {
          newTirePressure.frontLeft = 10;
          setFailed(true);

          const backupId = `AMB-${Math.floor(Math.random() * 900) + 100}`;
          setBackupAmbulance(backupId);
          onFailure?.(backupId);

          return {
            ...prev,
            tirePressure: newTirePressure,
            engineStatus: 'CRITICAL',
            speed: 0
          };
        }

        return {
          ...prev,
          fuelLevel: Math.max(prev.fuelLevel - 0.5, 20),
          speed: failed ? 0 : Math.floor(Math.random() * 20) + 40
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [failed, onFailure]);

  const getTirePressureColor = (pressure: number) => {
    if (pressure < 20) return 'text-red-600 animate-pulse';
    if (pressure < 28) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`rounded-xl p-6 shadow-lg transition-all ${
      failed
        ? 'bg-red-50 border-4 border-red-500 animate-pulse'
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🚑 Ambulance {ambulanceId}
            {failed && (
              <span className="text-sm bg-red-600 text-white px-2 py-1 rounded-full animate-pulse">
                ⚠️ FAILURE
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600">{health.location}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-600">{health.speed}</p>
          <p className="text-xs text-gray-600">km/h</p>
        </div>
      </div>

      {failed && backupAmbulance && (
        <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 mb-4 animate-slide-in">
          <p className="text-yellow-900 font-bold mb-2">🚨 EMERGENCY RESPONSE</p>
          <p className="text-sm text-yellow-800 mb-2">
            Ambulance {ambulanceId} has tire failure. Backup dispatched!
          </p>
          <div className="bg-green-500 text-white px-3 py-2 rounded font-bold text-center">
            ✅ Backup Ambulance: {backupAmbulance}
          </div>
          <p className="text-xs text-yellow-700 mt-2">ETA: 4 minutes to patient location</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Fuel Level</p>
          <div className="relative h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className={`absolute h-full transition-all ${
                health.fuelLevel > 50 ? 'bg-green-500' :
                health.fuelLevel > 25 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${health.fuelLevel}%` }}
            />
          </div>
          <p className="text-sm font-bold mt-1">{health.fuelLevel.toFixed(0)}%</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Engine Status</p>
          <div className={`text-center py-1 rounded font-bold ${
            health.engineStatus === 'GOOD' ? 'bg-green-100 text-green-700' :
            health.engineStatus === 'WARNING' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {health.engineStatus}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-600 mb-2">Tire Pressure (PSI)</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTirePressureColor(health.tirePressure.frontLeft)}`}>
              {health.tirePressure.frontLeft}
            </div>
            <p className="text-xs text-gray-500">Front L</p>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTirePressureColor(health.tirePressure.frontRight)}`}>
              {health.tirePressure.frontRight}
            </div>
            <p className="text-xs text-gray-500">Front R</p>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTirePressureColor(health.tirePressure.rearLeft)}`}>
              {health.tirePressure.rearLeft}
            </div>
            <p className="text-xs text-gray-500">Rear L</p>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTirePressureColor(health.tirePressure.rearRight)}`}>
              {health.tirePressure.rearRight}
            </div>
            <p className="text-xs text-gray-500">Rear R</p>
          </div>
        </div>
      </div>
    </div>
  );
}
