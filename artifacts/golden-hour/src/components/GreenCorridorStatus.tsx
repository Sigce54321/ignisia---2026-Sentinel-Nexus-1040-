import { useState, useEffect } from 'react';
import { activateGreenCorridor, getCorridorStatus, type GreenCorridorStatus as Status } from '@/lib/engines/green-corridor-engine';

interface Props {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
}

export function GreenCorridorStatus({ fromLat, fromLng, toLat, toLng }: Props) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const corridor = activateGreenCorridor(fromLat, fromLng, toLat, toLng);
    setStatus({ ...corridor });

    const interval = setInterval(() => {
      const current = getCorridorStatus();
      if (current) setStatus({ ...current });
    }, 500);

    return () => clearInterval(interval);
  }, [fromLat, fromLng, toLat, toLng]);

  if (!status) return null;

  const pct = status.signalsTotal > 0
    ? Math.round((status.signalsCleared / status.signalsTotal) * 100)
    : 0;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 shadow-lg border-2 border-green-400">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          🚦 Green Corridor
          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse">
            ACTIVE
          </span>
        </h3>
        <span className="text-sm font-bold text-green-600">
          {status.etaReduction > 0 ? `−${status.etaReduction} min saved` : 'Activating...'}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Signals pre-cleared</span>
          <span className="font-bold text-green-700">{status.signalsCleared}/{status.signalsTotal}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-green-600 mt-1 text-right">{pct}% cleared</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {status.route.map((signal, i) => (
          <div
            key={signal.id}
            className={`rounded-lg p-2 text-center transition-all duration-500 ${
              signal.status === 'CLEARED'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <div className="text-lg">{signal.status === 'CLEARED' ? '🟢' : '🔴'}</div>
            <p className="text-xs font-medium">S{i + 1}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-green-700 mt-3 text-center">
        Corridor ID: <strong>{status.corridorId}</strong> · Traffic management system active
      </p>
    </div>
  );
}
