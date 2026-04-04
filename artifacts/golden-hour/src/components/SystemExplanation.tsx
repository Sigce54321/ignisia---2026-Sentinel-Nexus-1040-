import type { TriageResult } from '@/lib/engines/triage-engine';
import type { RoutingStrategy } from '@/lib/engines/optimization-engine';

interface SystemExplanationProps {
  triage: TriageResult;
  strategy: RoutingStrategy;
}

export function SystemExplanation({ triage, strategy }: SystemExplanationProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-indigo-400">
      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        🧠 AI Decision Explanation
      </h3>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">🩺</span> Triage Analysis
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                triage.severity === 'CRITICAL' ? 'bg-red-500 animate-pulse' :
                triage.severity === 'HIGH' ? 'bg-orange-500' :
                triage.severity === 'MODERATE' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              <span className="text-sm text-gray-700">
                Severity classified as <strong>{triage.severity}</strong> (Score: {triage.score})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg ${triage.needsICU ? 'text-red-600' : 'text-green-600'}`}>
                {triage.needsICU ? '⚠️' : '✓'}
              </span>
              <span className="text-sm text-gray-700">
                ICU requirement: <strong>{triage.needsICU ? 'Yes' : 'No'}</strong>
              </span>
            </div>
            {triage.needsVentilator && (
              <div className="flex items-center gap-2">
                <span className="text-red-600">⚠️</span>
                <span className="text-sm text-gray-700 font-bold text-red-700">Ventilator required</span>
              </div>
            )}
            {triage.specialistRequired.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-purple-600">🩺</span>
                <span className="text-sm text-gray-700">
                  Specialists needed: <strong>{triage.specialistRequired.join(', ')}</strong>
                </span>
              </div>
            )}
            {triage.reasoning.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">→</span>
                <span className="text-sm text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">🎯</span> Routing Strategy
          </h4>
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded-full font-bold ${
              strategy.mode === 'SPLIT'
                ? 'bg-orange-100 text-orange-700 border border-orange-400'
                : 'bg-green-100 text-green-700 border border-green-400'
            }`}>
              {strategy.mode === 'SPLIT' ? '🔥 SPLIT STRATEGY' : '✓ DIRECT ROUTE'}
            </span>
          </div>
          <div className="space-y-2">
            {strategy.reasoning.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-sm text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-4">
          <h4 className="font-bold mb-2">💡 Why This Decision?</h4>
          <p className="text-sm opacity-90">
            {strategy.mode === 'SPLIT'
              ? 'Our AI detected that immediate stabilization at a nearby facility followed by transfer to a specialized hospital provides the best survival outcome for this critical case.'
              : 'Direct transport to the selected hospital provides optimal care with the fastest route, as the facility has all required resources immediately available.'}
          </p>
        </div>
      </div>
    </div>
  );
}
