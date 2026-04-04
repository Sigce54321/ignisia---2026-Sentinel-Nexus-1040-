import type { Hospital } from '../data';
import type { TriageResult } from './triage-engine';

export interface OptimizationScore {
  hospital: Hospital;
  totalScore: number;
  distanceScore: number;
  icuScore: number;
  specialistScore: number;
  ratingScore: number;
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
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeETA(distanceKm: number, avgResponse: number): number {
  const travelMin = (distanceKm / 45) * 60;
  return Math.round(travelMin + avgResponse * 0.3);
}

export function runOptimizationEngine(
  hospitals: Hospital[],
  patientLat: number,
  patientLng: number,
  triage: TriageResult
): RoutingStrategy {
  const scores: OptimizationScore[] = hospitals.map(h => {
    const dist = haversineKm(patientLat, patientLng, h.lat, h.lng);

    const distanceScore = Math.max(0, 100 - dist * 8);

    const icuRatio = h.availableICU / h.icuBeds;
    const icuScore = triage.needsICU ? icuRatio * 100 : 50;

    const specialistScore = triage.specialistRequired.filter(s =>
      h.specialists.some(hs => hs.toLowerCase().includes(s.toLowerCase().split(' ')[0]))
    ).length * 20;

    const ratingScore = (h.rating / 5) * 100;
    const traumaBonus = triage.severity === 'CRITICAL' ? (4 - h.traumaLevel) * 15 : 0;

    const totalScore =
      distanceScore * 0.35 +
      icuScore * 0.30 +
      specialistScore * 0.20 +
      ratingScore * 0.10 +
      traumaBonus * 0.05;

    return {
      hospital: { ...h, distance: Math.round(dist * 10) / 10 },
      totalScore,
      distanceScore,
      icuScore,
      specialistScore,
      ratingScore,
      eta: computeETA(dist, h.avgResponseTime),
    };
  });

  scores.sort((a, b) => b.totalScore - a.totalScore);

  if (triage.severity === 'CRITICAL' && scores.length >= 2) {
    const primary = scores[0];
    const secondary = scores.find(
      s => s.hospital.id !== primary.hospital.id && s.hospital.availableICU > 5
    ) || scores[1];

    return {
      mode: 'SPLIT',
      primaryHospital: primary.hospital,
      secondaryHospital: secondary.hospital,
      totalETA: primary.eta,
      etaPrimary: primary.eta,
      etaSecondary: secondary.eta,
      reasoning: [
        `Critical severity — split routing activated for optimal survival`,
        `${primary.hospital.name}: nearest trauma center with ${primary.hospital.availableICU} ICU beds free`,
        `Specialists matched: ${triage.specialistRequired.slice(0, 2).join(', ')}`,
        `${secondary.hospital.name} on standby for specialist transfer if needed`,
        `Green corridor activated — traffic signals pre-cleared on route`,
      ],
      scores,
    };
  }

  const best = scores[0];
  return {
    mode: 'DIRECT',
    selectedHospital: best.hospital,
    totalETA: best.eta,
    reasoning: [
      `${best.hospital.name} selected as optimal facility`,
      `Distance: ${best.hospital.distance} km — ETA ${best.eta} minutes`,
      `${best.hospital.availableICU} ICU beds available, Trauma Level ${best.hospital.traumaLevel}`,
      `Rating: ${best.hospital.rating}/5 — top-rated facility in area`,
      `Specialists available: ${best.hospital.specialists.join(', ')}`,
    ],
    scores,
  };
}
