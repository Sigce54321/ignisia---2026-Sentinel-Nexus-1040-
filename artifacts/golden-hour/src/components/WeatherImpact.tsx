import { useState, useEffect } from 'react';

const WEATHER_CONDITIONS = [
  { type: 'Clear', icon: '☀️', impact: 0, color: 'bg-blue-50 border-blue-300' },
  { type: 'Rain', icon: '🌧️', impact: 15, color: 'bg-gray-50 border-gray-400' },
  { type: 'Heavy Rain', icon: '⛈️', impact: 30, color: 'bg-gray-100 border-gray-600' },
  { type: 'Fog', icon: '🌫️', impact: 20, color: 'bg-gray-50 border-gray-500' },
];

export function WeatherImpact({ baseETA }: { baseETA: number }) {
  const [weather, setWeather] = useState(WEATHER_CONDITIONS[0]);
  const [adjustedETA, setAdjustedETA] = useState(baseETA);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomWeather = WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];
      setWeather(randomWeather);
      setAdjustedETA(baseETA + Math.round((baseETA * randomWeather.impact) / 100));
    }, 8000);

    return () => clearInterval(interval);
  }, [baseETA]);

  return (
    <div className={`rounded-xl p-6 shadow-lg border-2 ${weather.color}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        🌤️ Weather Impact Analysis
      </h3>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600">Current Condition</p>
          <p className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            {weather.icon} {weather.type}
          </p>
        </div>
        {weather.impact > 0 && (
          <div className="bg-orange-100 border border-orange-400 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-orange-800">Impact</p>
            <p className="text-2xl font-bold text-orange-600">+{weather.impact}%</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-xs text-gray-500">Base ETA</p>
            <p className="text-xl font-bold text-gray-400 line-through">{baseETA} min</p>
          </div>
          <div className="text-4xl text-gray-400">→</div>
          <div>
            <p className="text-xs text-gray-500">Adjusted ETA</p>
            <p className="text-3xl font-bold text-orange-600">{adjustedETA} min</p>
          </div>
        </div>
        {weather.impact > 0 && (
          <p className="text-xs text-orange-700 text-center mt-2">
            ⚠️ Slower response due to {weather.type.toLowerCase()}
          </p>
        )}
      </div>
    </div>
  );
}
