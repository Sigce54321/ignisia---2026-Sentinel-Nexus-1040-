import { useState, useEffect } from 'react';

interface LiveData {
  icuBeds: number;
  availableICU: number;
  ventilators: number;
  availableVentilators: number;
  waitTime: number;
  traumaTeamReady: boolean;
  bloodBank: { aPos: number; bPos: number; oPos: number; abPos: number };
}

interface LiveHospitalDataProps {
  hospitalId: string;
  hospitalName: string;
}

export function LiveHospitalData({ hospitalId, hospitalName }: LiveHospitalDataProps) {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setData({
        icuBeds: 60,
        availableICU: Math.floor(Math.random() * 20) + 5,
        ventilators: 30,
        availableVentilators: Math.floor(Math.random() * 12) + 2,
        waitTime: Math.floor(Math.random() * 20) + 5,
        traumaTeamReady: Math.random() > 0.3,
        bloodBank: {
          aPos: Math.floor(Math.random() * 20) + 5,
          bPos: Math.floor(Math.random() * 15) + 3,
          oPos: Math.floor(Math.random() * 25) + 8,
          abPos: Math.floor(Math.random() * 8) + 2,
        },
      });
      setLastUpdated(new Date());
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [hospitalId]);

  return (
    <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          🏥 Live Data: {hospitalName}
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-500">
            {loading ? 'Updating...' : `${lastUpdated.toLocaleTimeString()}`}
          </span>
        </div>
      </div>

      {!data ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-semibold mb-1">ICU Beds</p>
              <p className="text-2xl font-bold text-blue-700">
                {data.availableICU}<span className="text-sm text-blue-400">/{data.icuBeds}</span>
              </p>
              <p className="text-xs text-blue-500">available</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-purple-600 font-semibold mb-1">Ventilators</p>
              <p className="text-2xl font-bold text-purple-700">
                {data.availableVentilators}<span className="text-sm text-purple-400">/{data.ventilators}</span>
              </p>
              <p className="text-xs text-purple-500">available</p>
            </div>

            <div className={`rounded-lg p-3 ${data.waitTime < 10 ? 'bg-green-50' : data.waitTime < 20 ? 'bg-yellow-50' : 'bg-red-50'}`}>
              <p className={`text-xs font-semibold mb-1 ${data.waitTime < 10 ? 'text-green-600' : data.waitTime < 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                Wait Time
              </p>
              <p className={`text-2xl font-bold ${data.waitTime < 10 ? 'text-green-700' : data.waitTime < 20 ? 'text-yellow-700' : 'text-red-700'}`}>
                {data.waitTime}m
              </p>
              <p className="text-xs text-gray-500">estimate</p>
            </div>

            <div className={`rounded-lg p-3 ${data.traumaTeamReady ? 'bg-green-50' : 'bg-orange-50'}`}>
              <p className={`text-xs font-semibold mb-1 ${data.traumaTeamReady ? 'text-green-600' : 'text-orange-600'}`}>
                Trauma Team
              </p>
              <p className={`text-lg font-bold ${data.traumaTeamReady ? 'text-green-700' : 'text-orange-700'}`}>
                {data.traumaTeamReady ? '✅ Ready' : '⏳ Assembling'}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-600 mb-2">🩸 Blood Bank Inventory</p>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(data.bloodBank).map(([type, count]) => {
                const label = type.replace('Pos', '+').replace('Neg', '-');
                const low = count < 5;
                return (
                  <div key={type} className={`text-center p-2 rounded ${low ? 'bg-red-100' : 'bg-white'}`}>
                    <p className={`text-lg font-bold ${low ? 'text-red-600' : 'text-gray-800'}`}>{count}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
