import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

type Range = '7d' | '30d' | '1y';

function generateDailyData(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const label = days <= 7
      ? date.toLocaleDateString('en', { weekday: 'short' })
      : days <= 30
        ? date.toLocaleDateString('en', { day: 'numeric', month: 'short' })
        : date.toLocaleDateString('en', { month: 'short' });
    return {
      label,
      emergencies: Math.floor(Math.random() * 30) + 15,
      avgResponseTime: Math.floor(Math.random() * 5) + 6,
      successRate: Math.floor(Math.random() * 15) + 82,
      criticalCases: Math.floor(Math.random() * 10) + 3,
    };
  });
}

const SEVERITY_DATA = [
  { name: 'CRITICAL', value: 18, color: '#ef4444' },
  { name: 'HIGH', value: 32, color: '#f97316' },
  { name: 'MODERATE', value: 35, color: '#eab308' },
  { name: 'LOW', value: 15, color: '#22c55e' },
];

const HOSPITAL_PERF = [
  { name: 'Lilavati', dispatched: 142, avgETA: 8.2 },
  { name: 'Kokilaben', dispatched: 118, avgETA: 9.5 },
  { name: 'Bombay Hosp', dispatched: 98, avgETA: 7.8 },
  { name: 'Hinduja', dispatched: 87, avgETA: 10.1 },
  { name: 'Nanavati', dispatched: 76, avgETA: 9.8 },
];

const PEAK_HOURS = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h.toString().padStart(2, '0')}:00`,
  cases: h >= 7 && h <= 9 ? Math.floor(Math.random() * 10) + 12
    : h >= 17 && h <= 20 ? Math.floor(Math.random() * 12) + 14
    : Math.floor(Math.random() * 6) + 3,
}));

const CITY_DATA = [
  { city: 'Mumbai', cases: 412, avgETA: 8.6, success: 94.2 },
  { city: 'Delhi', cases: 387, avgETA: 9.1, success: 93.5 },
  { city: 'Bangalore', cases: 298, avgETA: 10.2, success: 92.1 },
  { city: 'Pune', cases: 201, avgETA: 9.8, success: 93.8 },
];

export default function HistoricalAnalytics() {
  const [range, setRange] = useState<Range>('7d');
  const [, navigate] = useLocation();

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 12;
  const data = generateDailyData(days);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-800 to-purple-900 text-white px-4 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">📊 Historical Analytics</h1>
            <p className="text-indigo-200 text-sm">Emergency response trends and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/analytics')}
              className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Live Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-indigo-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors"
            >
              ← Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex gap-2 justify-end">
          {(['7d', '30d', '1y'] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                range === r
                  ? 'bg-indigo-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-400'
              }`}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Last Year'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Emergencies', value: data.reduce((a, d) => a + d.emergencies, 0), icon: '🚨', color: 'text-red-600' },
            { label: 'Avg Response Time', value: `${(data.reduce((a, d) => a + d.avgResponseTime, 0) / data.length).toFixed(1)}m`, icon: '⚡', color: 'text-blue-600' },
            { label: 'Avg Success Rate', value: `${(data.reduce((a, d) => a + d.successRate, 0) / data.length).toFixed(1)}%`, icon: '✅', color: 'text-green-600' },
            { label: 'Critical Cases', value: data.reduce((a, d) => a + d.criticalCases, 0), icon: '🔴', color: 'text-red-700' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow text-center">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-bold text-gray-900 mb-4">📈 Emergency Volume</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="emergencies" stroke="#ef4444" fill="#fee2e2" name="Emergencies" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-bold text-gray-900 mb-4">⚡ Avg Response Time (min)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[4, 16]} />
                <Tooltip />
                <Line type="monotone" dataKey="avgResponseTime" stroke="#6366f1" strokeWidth={2} dot={false} name="Response Time" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-bold text-gray-900 mb-4">✅ Success Rate (%)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[70, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="successRate" stroke="#22c55e" fill="#dcfce7" name="Success Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-bold text-gray-900 mb-4">🔴 Severity Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={SEVERITY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                  {SEVERITY_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="font-bold text-gray-900 mb-4">⏰ Peak Hours Analysis</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PEAK_HOURS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 9 }} interval={1} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="cases" fill="#6366f1" radius={[4, 4, 0, 0]} name="Cases" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-bold text-gray-900 mb-4">🏥 Hospital Performance</h3>
            <div className="space-y-3">
              {HOSPITAL_PERF.map((h, i) => (
                <div key={h.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">{h.name}</span>
                      <span className="text-gray-500">{h.dispatched} cases · {h.avgETA}m avg</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(h.dispatched / 150) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-bold text-gray-900 mb-4">🌆 City Performance</h3>
            <div className="space-y-3">
              {CITY_DATA.map(c => (
                <div key={c.city} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-900">{c.city}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      c.success > 94 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.success}% success
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Cases: </span>
                      <span className="font-bold">{c.cases}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg ETA: </span>
                      <span className="font-bold">{c.avgETA}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
