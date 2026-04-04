import { hospitals, Hospital } from './hospitals';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM';

export interface TriageResult {
  severity: Severity;
  needsICU: boolean;
  score: number;
  reasoning: string[];
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
}

export interface EmergencyResult {
  triage: TriageResult;
  strategy: RoutingStrategy;
}

export interface PatientForm {
  symptoms: string[];
  age: number;
  consciousness: 'ALERT' | 'CONFUSED' | 'UNCONSCIOUS';
  breathing: 'NORMAL' | 'LABORED' | 'ABSENT';
  bleeding: 'NONE' | 'MINOR' | 'SEVERE';
  city: string;
}

export function runTriage(form: PatientForm): EmergencyResult {
  let score = 0;
  const reasoning: string[] = [];

  if (form.consciousness === 'UNCONSCIOUS') {
    score += 40;
    reasoning.push('Patient is unconscious — immediate life threat');
  } else if (form.consciousness === 'CONFUSED') {
    score += 20;
    reasoning.push('Altered consciousness detected');
  }

  if (form.breathing === 'ABSENT') {
    score += 50;
    reasoning.push('Breathing absent — critical airway compromise');
  } else if (form.breathing === 'LABORED') {
    score += 25;
    reasoning.push('Labored breathing indicates respiratory distress');
  }

  if (form.bleeding === 'SEVERE') {
    score += 30;
    reasoning.push('Severe bleeding — risk of hemorrhagic shock');
  } else if (form.bleeding === 'MINOR') {
    score += 10;
    reasoning.push('Minor bleeding present');
  }

  if (form.age > 65) {
    score += 10;
    reasoning.push('Advanced age increases risk profile');
  } else if (form.age < 5) {
    score += 15;
    reasoning.push('Pediatric patient — higher vulnerability');
  }

  const criticalSymptoms = ['chest pain', 'stroke', 'head injury', 'cardiac arrest'];
  const highSymptoms = ['fracture', 'burns', 'seizure', 'overdose'];

  form.symptoms.forEach(s => {
    const sl = s.toLowerCase();
    if (criticalSymptoms.some(c => sl.includes(c))) {
      score += 20;
      reasoning.push(`Critical symptom: ${s}`);
    } else if (highSymptoms.some(h => sl.includes(h))) {
      score += 10;
      reasoning.push(`High-risk symptom: ${s}`);
    }
  });

  let severity: Severity;
  let needsICU: boolean;

  if (score >= 60) {
    severity = 'CRITICAL';
    needsICU = true;
  } else if (score >= 30) {
    severity = 'HIGH';
    needsICU = score >= 40;
  } else {
    severity = 'MEDIUM';
    needsICU = false;
  }

  const triage: TriageResult = { severity, needsICU, score, reasoning };

  const cityHospitals = hospitals.filter(h => h.city === form.city);
  const sorted = [...cityHospitals].sort((a, b) => {
    const aLoad = (a.icuBeds - a.availableICU) / a.icuBeds;
    const bLoad = (b.icuBeds - b.availableICU) / b.icuBeds;
    const aScore = a.distance * 0.4 + aLoad * 60 - a.traumaLevel * 5;
    const bScore = b.distance * 0.4 + bLoad * 60 - b.traumaLevel * 5;
    return aScore - bScore;
  });

  let strategy: RoutingStrategy;

  if (severity === 'CRITICAL' && sorted.length >= 2) {
    const primary = sorted[0];
    const secondary = sorted[1];
    const etaPrimary = Math.round(primary.distance * 2.5 + primary.avgResponseTime * 0.3);
    const etaSecondary = Math.round(secondary.distance * 2.5 + secondary.avgResponseTime * 0.3);

    strategy = {
      mode: 'SPLIT',
      primaryHospital: primary,
      secondaryHospital: secondary,
      totalETA: etaPrimary,
      etaPrimary,
      etaSecondary,
      reasoning: [
        `Critical severity requires immediate stabilization at ${primary.name}`,
        `${primary.name} is ${primary.distance}km away with ${primary.availableICU} ICU beds available`,
        `Transfer to ${secondary.name} for specialized care if needed`,
        'Split routing minimizes time to first care while ensuring specialist access',
      ],
    };
  } else {
    const best = sorted[0];
    const eta = Math.round(best.distance * 2.5 + best.avgResponseTime * 0.3);

    strategy = {
      mode: 'DIRECT',
      selectedHospital: best,
      totalETA: eta,
      reasoning: [
        `${best.name} is the optimal facility at ${best.distance}km`,
        `${best.availableICU} ICU beds available, trauma level ${best.traumaLevel}`,
        `Estimated arrival: ${eta} minutes`,
        `Specialties available: ${best.specialties.join(', ')}`,
      ],
    };
  }

  return { triage, strategy };
}
