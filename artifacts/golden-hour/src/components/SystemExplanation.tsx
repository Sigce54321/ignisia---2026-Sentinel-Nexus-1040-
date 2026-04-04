import type { TriageResult } from '@/lib/engines/triage-engine';
import type { RoutingStrategy } from '@/lib/engines/optimization-engine';

interface SystemExplanationProps {
  triage: TriageResult;
  strategy: RoutingStrategy;
}

export function SystemExplanation({ triage, strategy }: SystemExplanationProps) {
  const severityColor = {
    CRITICAL: 'bg-red-600 text-white',
    HIGH: 'bg-orange-500 text-white',
    MODERATE: 'bg-yellow-500 text-white',
    LOW: 'bg-green-600 text-white',
  }[triage.severity];

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-indigo-400">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        🧠 AI Decision Explanation
      </h3>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🩺</span> Triage Analysis
          </h4>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${severityColor}`}>
              {triage.severity}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Score: {triage.score}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
              AI Confidence: {triage.aiConfidence}%
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-3 text-sm">
            <div className={`flex items-center gap-1 ${triage.needsICU ? 'text-red-600' : 'text-green-600'}`}>
              {triage.needsICU ? '⚠️' : '✓'} ICU: {triage.needsICU ? 'Required' : 'Not needed'}
            </div>
            <div className={`flex items-center gap-1 ${triage.needsVentilator ? 'text-red-600' : 'text-green-600'}`}>
              {triage.needsVentilator ? '⚠️' : '✓'} Ventilator: {triage.needsVentilator ? 'Required' : 'Not needed'}
            </div>
          </div>

          {triage.specialistRequired.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 mb-1">SPECIALISTS REQUIRED</p>
              <div className="flex flex-wrap gap-1">
                {triage.specialistRequired.map(s => (
                  <span key={s} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                    🩺 {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            {triage.reasoning.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5 shrink-0">→</span>
                <span className="text-sm text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🎯</span> Routing Strategy
          </h4>
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${
              strategy.mode === 'SPLIT'
                ? 'bg-orange-100 text-orange-700 border border-orange-400'
                : 'bg-green-100 text-green-700 border border-green-400'
            }`}>
              {strategy.mode === 'SPLIT' ? '🔥 SPLIT STRATEGY' : '✅ DIRECT ROUTE'}
            </span>
          </div>
          {strategy.constraints.length > 0 && (
            <div className="mb-2">
              {strategy.constraints.map((c, i) => (
                <div key={i} className="flex items-start gap-2 mb-1">
                  <span className="text-yellow-500 shrink-0">⚡</span>
                  <span className="text-xs text-gray-600">{c}</span>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-1">
            {strategy.reasoning.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                <span className="text-sm text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-4">
          <h4 className="font-bold mb-2">💡 Why This Decision?</h4>
          <p className="text-sm opacity-90">
            {strategy.mode === 'SPLIT'
              ? 'Our AI detected that immediate stabilization at the nearest trauma center, followed by specialist transfer, gives this critical patient the highest survival probability. Both hospitals have been pre-alerted.'
              : 'Direct transport to the optimal hospital offers the best combination of proximity, available ICU capacity, specialist availability, and quality score. The facility has all required resources ready immediately.'}
          </p>
        </div>
      </div>
    </div>
  );
}
