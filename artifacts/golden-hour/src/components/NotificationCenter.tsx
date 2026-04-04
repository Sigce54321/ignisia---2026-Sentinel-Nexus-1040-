import { useState } from 'react';

interface Notification {
  id: string;
  type: 'WHATSAPP' | 'SMS' | 'CALL';
  recipient: string;
  recipientType: 'FAMILY' | 'HOSPITAL' | 'CREW';
  message: string;
  status: 'PENDING' | 'SENDING' | 'SENT' | 'FAILED';
  sentAt?: Date;
}

interface NotificationCenterProps {
  hospitalName: string;
  ambulanceId: string;
  eta: number;
  severity: string;
}

export function NotificationCenter({ hospitalName, ambulanceId, eta, severity }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'WHATSAPP',
      recipient: '+91 98765 43210',
      recipientType: 'FAMILY',
      message: `EMERGENCY ALERT: Patient has been dispatched to ${hospitalName}. ETA: ${eta} minutes. Ambulance: ${ambulanceId}`,
      status: 'PENDING',
    },
    {
      id: 'n2',
      type: 'SMS',
      recipient: hospitalName,
      recipientType: 'HOSPITAL',
      message: `Pre-alert: ${severity} patient incoming in ${eta} min. Ambulance ${ambulanceId} en route.`,
      status: 'PENDING',
    },
    {
      id: 'n3',
      type: 'CALL',
      recipient: ambulanceId + ' Crew',
      recipientType: 'CREW',
      message: `Route confirmed to ${hospitalName}. Green corridor activated.`,
      status: 'PENDING',
    },
  ]);

  const [allSent, setAllSent] = useState(false);

  const sendAll = () => {
    notifications.forEach((notif, i) => {
      setTimeout(() => {
        setNotifications(prev =>
          prev.map(n => n.id === notif.id ? { ...n, status: 'SENDING' } : n)
        );
        setTimeout(() => {
          setNotifications(prev =>
            prev.map(n => n.id === notif.id ? { ...n, status: 'SENT', sentAt: new Date() } : n)
          );
          if (i === notifications.length - 1) setAllSent(true);
        }, 1200);
      }, i * 800);
    });
  };

  const iconFor = (type: Notification['type']) => {
    if (type === 'WHATSAPP') return '💬';
    if (type === 'SMS') return '📱';
    return '📞';
  };

  const colorFor = (rt: Notification['recipientType']) => {
    if (rt === 'FAMILY') return 'bg-blue-50 border-blue-200';
    if (rt === 'HOSPITAL') return 'bg-purple-50 border-purple-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        📣 Notification Center
      </h3>

      <div className="space-y-3 mb-4">
        {notifications.map(n => (
          <div key={n.id} className={`rounded-lg p-3 border ${colorFor(n.recipientType)}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{iconFor(n.type)}</span>
                  <span className="text-sm font-bold text-gray-800">{n.recipient}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {n.recipientType}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{n.message}</p>
              </div>
              <div className="shrink-0">
                {n.status === 'PENDING' && (
                  <span className="text-xs text-gray-400 font-medium">Pending</span>
                )}
                {n.status === 'SENDING' && (
                  <span className="text-xs text-blue-600 font-medium animate-pulse">Sending...</span>
                )}
                {n.status === 'SENT' && (
                  <div className="text-right">
                    <span className="text-xs text-green-600 font-bold">✓ Sent</span>
                    {n.sentAt && (
                      <p className="text-xs text-gray-400">{n.sentAt.toLocaleTimeString()}</p>
                    )}
                  </div>
                )}
                {n.status === 'FAILED' && (
                  <span className="text-xs text-red-600 font-bold">✗ Failed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!allSent ? (
        <button
          onClick={sendAll}
          disabled={notifications.some(n => n.status === 'SENDING')}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-60 disabled:scale-100"
        >
          📡 Send All Notifications
        </button>
      ) : (
        <div className="bg-green-100 border border-green-400 rounded-xl p-3 text-center">
          <p className="text-green-800 font-bold">✅ All notifications delivered</p>
          <p className="text-xs text-green-600 mt-1">Family, hospital and crew have been informed</p>
        </div>
      )}
    </div>
  );
}
