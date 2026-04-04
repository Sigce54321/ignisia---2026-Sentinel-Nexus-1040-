import { useState, useEffect } from 'react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-yellow-900 px-4 py-2 flex items-center justify-center gap-3 shadow-lg">
      <span className="text-xl">⚠️</span>
      <div>
        <p className="font-bold text-sm">You are offline</p>
        <p className="text-xs">Using cached hospital data. Some features may be limited.</p>
      </div>
      <div className="ml-auto w-4 h-4 border-2 border-yellow-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
