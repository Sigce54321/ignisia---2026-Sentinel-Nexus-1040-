import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';

interface Stat {
  label: string;
  value: string;
  icon: string;
}

const STATS: Stat[] = [
  { label: 'Response Time', value: '< 8 min', icon: '⚡' },
  { label: 'Hospitals Networked', value: '40+', icon: '🏥' },
  { label: 'Cities Covered', value: '4', icon: '🌆' },
  { label: 'Lives Impacted', value: '12,400+', icon: '❤️' },
];

const FEATURES = [
  { icon: '🤖', title: 'AI Triage Engine', desc: 'Multi-factor severity scoring with vitals analysis, symptom pattern matching and risk stratification.' },
  { icon: '🔮', title: 'Predictive Routing', desc: 'Real-time hospital capacity optimization across 40+ facilities with specialist matching.' },
  { icon: '🚦', title: 'Green Corridor', desc: 'Automatic traffic signal pre-clearing along the ambulance route for maximum speed.' },
  { icon: '🚑', title: 'Fleet Intelligence', desc: 'Live ambulance health monitoring with automatic backup dispatch on failure detection.' },
  { icon: '🌤️', title: 'Weather Adaptation', desc: 'Real-time ETA adjustment based on weather conditions along the route.' },
  { icon: '📡', title: 'Instant Alerts', desc: 'Simultaneous WhatsApp, SMS and call notifications to family, hospital and crew.' },
];

export default function Landing() {
  const [, navigate] = useLocation();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const pulseColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500'];
  const currentColor = pulseColors[tick % pulseColors.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative">
        <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${currentColor} transition-colors duration-500`} />
            <span className="text-xl font-black tracking-tight">GOLDEN HOUR</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/analytics')}
              className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
            >
              Analytics
            </button>
            <button
              onClick={() => navigate('/emergency')}
              className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
            >
              🚨 Emergency
            </button>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-8 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 px-4 py-2 rounded-full text-sm text-red-300 mb-6">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            AI-Powered Emergency Response System
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
              GOLDEN
            </span>
            <br />
            <span className="text-white">HOUR</span>
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Every second in the golden hour determines survival outcomes. Our AI system activates the fastest, smartest emergency route within seconds — before you even reach the hospital.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/emergency')}
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-10 py-5 rounded-2xl text-xl font-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30"
            >
              🚨 ACTIVATE EMERGENCY
              <span className="block text-sm font-normal opacity-80 mt-1">AI triage + instant routing</span>
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="group bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all hover:scale-105"
            >
              📊 Live Dashboard
              <span className="block text-sm font-normal opacity-70 mt-1">Hospital capacity & analytics</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(stat => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 pb-20">
          <h2 className="text-4xl font-black text-center mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Premium Features
            </span>
          </h2>
          <p className="text-gray-400 text-center mb-12">Six intelligent systems working in perfect coordination</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-8 pb-20 text-center">
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-3xl p-10">
            <p className="text-5xl mb-4">🏥</p>
            <h2 className="text-3xl font-black mb-3">Ready to save a life?</h2>
            <p className="text-gray-300 mb-6">In a real emergency, every second counts. Our AI activates the full response chain instantly.</p>
            <button
              onClick={() => navigate('/emergency')}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-10 py-4 rounded-2xl text-lg font-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-red-500/30 animate-pulse"
            >
              🚨 Start Emergency Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
