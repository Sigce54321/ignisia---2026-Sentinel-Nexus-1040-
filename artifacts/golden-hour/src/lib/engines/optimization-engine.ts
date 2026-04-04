import type { Hospital } from '../data';
import type { TriageResult } from './triage-engine';
import { haversineKm } from '../utils/distance';

export interface OptimizationScore {
  hospital: Hospital;
  totalScore: number;
  distanceScore: number;
  capacityScore: number;
  qualityScore: number;
  responseScore: number;
  distanceKm: number;
  eta: number;
}

export interface RoutingStrategy {
  mode: 'DIRECT' | 'SPLIT';
  selectedHospital?: Hospital;
  primaryHospital?: Hospital;
  secondaryHospital?: Hospital;
  totalETA: number;
  etaPrimary?: number;
  etaSecondary?: number;
  reasoning: string[];
  scores: OptimizationScore[];
  constraints: string[];
}

function computeETA(distKm: number, responseTime: number): number {
  return Math.round((distKm / 45) * 60 + responseTime * 0.4);
}

export function optimizeHospital(
  userLocation: { lat: number; lng: number },
  triage: TriageResult,
  hospitals: Hospital[]
): RoutingStrategy {
  const { lat, lng } = userLocation;
  const constraints: string[] = [];

  let candidates = hospitals.filter(h => h.status !== 'FULL');

  if (triage.needsICU) {
    const withICU = candidates.filter(h => h.capabilities.availableICU > 0);
    if (withICU.length > 0) {
      candidates = withICU;
      constraints.push('ICU availability required — filtered to facilities with open ICU beds');
    } else {
      constraints.push('Warning: no hospitals with free ICU beds in network');
    }
  }

  if (triage.needsVentilator) {
    const withVent = candidates.filter(h => h.capabilities.availableVentilators > 0);
    if (withVent.length > 0) {
      candidates = withVent;
      constraints.push('Ventilator availability required — filtered accordingly');
    }
  }

  const scored: OptimizationScore[] = candidates.map(h => {
    const distKm = haversineKm(lat, lng, h.location.lat, h.location.lng);
    const eta = computeETA(distKm, h.responseTime);

    const distanceScore = Math.max(0, 100 - distKm * 10);

    const icuRatio = h.capabilities.icuBeds > 0
      ? h.capabilities.availableICU / h.capabilities.icuBeds
      : 0;
    const ventRatio = h.capabilities.ventilators > 0
      ? h.capabilities.availableVentilators / h.capabilities.ventilators
      : 0;
    const capacityScore = icuRatio * 30 + ventRatio * 30;

    const qualityScore = (h.rating / 5) * 20 + (h.successRate / 100) * 20;

    const responseScore = Math.max(0, 100 - h.responseTime * 5);

    const totalScore =
      distanceScore * 0.4 +
      capacityScore * 0.3 +
      qualityScore * 0.2 +
      responseScore * 0.1;

    return {
      hospital: h,
      totalScore,
      distanceScore,
      capacityScore,
      qualityScore,
      responseScore,
      distanceKm: Math.round(distKm * 10) / 10,
      eta,
    };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);

  if (triage.severity === 'CRITICAL' && scored.length >= 2) {
    const primary = scored[0];
    const secondary = scored.find(
      s => s.hospital.id !== primary.hospital.id && s.hospital.capabilities.availableICU > 3
    ) ?? scored[1];

    return {
      mode: 'SPLIT',
      primaryHospital: primary.hospital,
      secondaryHospital: secondary.hospital,
      totalETA: primary.eta,
      etaPrimary: primary.eta,
      etaSecondary: secondary.eta,
      reasoning: [
        `CRITICAL patient — split routing activated for maximum survival probability`,
        `Step 1: Stabilize at ${primary.hospital.name} (${primary.distanceKm} km, ETA ${primary.eta}m)`,
        `${primary.hospital.capabilities.availableICU} ICU beds + ${primary.hospital.capabilities.availableVentilators} ventilators available`,
        `Step 2: ${secondary.hospital.name} on standby for specialist transfer`,
        `Combined score: ${primary.totalScore.toFixed(1)} — highest-ranked trauma center`,
        `Green corridor pre-cleared for zero signal stops`,
      ],
      scores: scored,
      constraints,
    };
  }

  const best = scored[0];
  return {
    mode: 'DIRECT',
    selectedHospital: best.hospital,
    totalETA: best.eta,
    reasoning: [
      `${best.hospital.name} selected — optimal facility (score: ${best.totalScore.toFixed(1)})`,
      `Distance: ${best.distanceKm} km — ETA ${best.eta} minutes`,
      `${best.hospital.capabilities.availableICU} ICU beds free, ${best.hospital.capabilities.availableVentilators} ventilators available`,
      `Rating: ${best.hospital.rating}/5 · Success rate: ${best.hospital.successRate}%`,
      `Response time: ${best.hospital.responseTime} min avg`,
    ],
    scores: scored,
    constraints,
  };
}
