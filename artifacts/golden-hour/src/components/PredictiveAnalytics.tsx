import { useState, useEffect } from 'react';
import { hospitals } from '@/lib/hospitals';

interface Prediction {
  hospital: typeof hospitals[number];
  currentLoad: number;
  predictedLoad: number;
  trend: 'increasing' | 'stable';
  recommendation: 'Avoid' | 'Monitor' | 'Available';
}

export function PredictiveAnalytics({ city }: { city: string }) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const cityHospitals = hospitals.filter(h => h.city === city);

    const predicted: Prediction[] = cityHospitals.map(h => {
      const currentLoad = ((h.icuBeds - h.availableICU) / h.icuBeds) * 100;
      const trend: 'increasing' | 'stable' = Math.random() > 0.5 ? 'increasing' : 'stable';
      const nextHourLoad = trend === 'increasing'
        ? Math.min(currentLoad + Math.random() * 20, 100)
        : currentLoad;

      const recommendation: 'Avoid' | 'Monitor' | 'Available' =
        nextHourLoad > 80 ? 'Avoid' : nextHourLoad > 60 ? 'Monitor' : 'Available';

      return {
        hospital: h,
        currentLoad,
        predictedLoad: nextHourLoad,
        trend,
        recommendation,
      };
    });

    setPredictions(predicted);
  }, [city]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
        🔮 Predictive Load Forecasting
      </h3>
      <p className="text-sm text-gray-600 mb-4">Next hour capacity prediction for {city}</p>

      <div className="space-y-3">
        {predictions.map((pred, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-gray-900">{pred.hospital.name}</p>
                <p className="text-xs text-gray-500">
                  Trend: {pred.trend === 'increasing' ? '📈 Increasing' : '➡️ Stable'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                pred.recommendation === 'Avoid' ? 'bg-red-100 text-red-700' :
                pred.recommendation === 'Monitor' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {pred.recommendation}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500">Current Load</p>
                <p className="text-lg font-bold text-blue-600">
                  {pred.currentLoad.toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Predicted (1hr)</p>
                <p className="text-lg font-bold text-orange-600">
                  {pred.predictedLoad.toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                className="absolute h-full bg-blue-500 transition-all"
                style={{ width: `${pred.currentLoad}%` }}
              />
              <div
                className="absolute h-full bg-orange-500 opacity-50 transition-all"
                style={{ width: `${pred.predictedLoad}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
