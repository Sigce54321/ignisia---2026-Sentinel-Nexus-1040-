import { useState, useEffect } from 'react';

export function LiveETACountdown({ initialETA }: { initialETA: number }) {
  const [timeLeft, setTimeLeft] = useState(initialETA * 60);
  const [milestone, setMilestone] = useState('Dispatched');

  useEffect(() => {
    setTimeLeft(initialETA * 60);
  }, [initialETA]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = Math.max(prev - 1, 0);

        const minutesLeft = Math.floor(newTime / 60);
        if (minutesLeft <= 2) setMilestone('Arriving Soon');
        else if (minutesLeft <= 5) setMilestone('Final Approach');
        else if (minutesLeft <= 10) setMilestone('En Route');
        else setMilestone('Dispatched');

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-4">
        <p className="text-sm opacity-90 mb-2">Live ETA Countdown</p>
        <div className="text-7xl font-bold mb-2 tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <p className="text-xl opacity-90">minutes remaining</p>
      </div>

      <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Status:</span>
          <span className="bg-white text-blue-600 px-3 py-1 rounded-full font-bold text-sm">
            {milestone}
          </span>
        </div>
      </div>

      {minutes <= 2 && (
        <div className="mt-4 bg-yellow-400 text-yellow-900 p-3 rounded-lg text-center font-bold animate-pulse">
          🚨 PREPARE FOR ARRIVAL
        </div>
      )}
    </div>
  );
}
