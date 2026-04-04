export type Severity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface Vitals {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  o2Saturation: number;
  temperature: number;
  respiratoryRate: number;
}

export interface TriageInput {
  symptoms: string[];
  vitals: Vitals;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  consciousness: 'ALERT' | 'CONFUSED' | 'UNCONSCIOUS';
  breathing: 'NORMAL' | 'LABORED' | 'ABSENT';
  bleeding: 'NONE' | 'MINOR' | 'SEVERE';
}

export interface TriageResult {
  severity: Severity;
  needsICU: boolean;
  needsVentilator: boolean;
  specialistRequired: string[];
  score: number;
  reasoning: string[];
}

const CRITICAL_SYMPTOMS = [
  'chest pain', 'cardiac arrest', 'stroke', 'head injury',
  'spinal injury', 'aortic aneurysm', 'pulmonary embolism',
];
const HIGH_SYMPTOMS = [
  'fracture', 'burns', 'seizure', 'overdose', 'trauma',
  'severe allergic reaction', 'internal bleeding',
];
const MODERATE_SYMPTOMS = [
  'laceration', 'abdominal pain', 'high fever', 'dehydration',
  'respiratory infection', 'kidney stones',
];

function scoreVitals(vitals: Vitals): { score: number; issues: string[] } {
  let score = 0;
  const issues: string[] = [];

  if (vitals.o2Saturation < 90) {
    score += 40;
    issues.push(`Critical O2 saturation at ${vitals.o2Saturation}% — hypoxia`);
  } else if (vitals.o2Saturation < 95) {
    score += 20;
    issues.push(`Low O2 saturation: ${vitals.o2Saturation}%`);
  }

  if (vitals.heartRate > 140 || vitals.heartRate < 40) {
    score += 30;
    issues.push(`Dangerous heart rate: ${vitals.heartRate} bpm`);
  } else if (vitals.heartRate > 110 || vitals.heartRate < 55) {
    score += 15;
    issues.push(`Abnormal heart rate: ${vitals.heartRate} bpm`);
  }

  if (vitals.systolicBP < 80) {
    score += 40;
    issues.push(`Critical hypotension: ${vitals.systolicBP}/${vitals.diastolicBP} mmHg`);
  } else if (vitals.systolicBP > 180 || vitals.systolicBP < 90) {
    score += 20;
    issues.push(`Abnormal BP: ${vitals.systolicBP}/${vitals.diastolicBP} mmHg`);
  }

  if (vitals.respiratoryRate > 30 || vitals.respiratoryRate < 8) {
    score += 30;
    issues.push(`Critical respiratory rate: ${vitals.respiratoryRate}/min`);
  } else if (vitals.respiratoryRate > 24 || vitals.respiratoryRate < 12) {
    score += 15;
    issues.push(`Abnormal respiratory rate: ${vitals.respiratoryRate}/min`);
  }

  if (vitals.temperature > 40 || vitals.temperature < 35) {
    score += 20;
    issues.push(`Extreme temperature: ${vitals.temperature}°C`);
  }

  return { score, issues };
}

function getSpecialists(symptoms: string[], severity: Severity): string[] {
  const specialists = new Set<string>();
  const sl = symptoms.map(s => s.toLowerCase());

  if (sl.some(s => s.includes('chest') || s.includes('cardiac') || s.includes('heart'))) {
    specialists.add('Cardiologist');
  }
  if (sl.some(s => s.includes('head') || s.includes('neuro') || s.includes('stroke') || s.includes('seizure'))) {
    specialists.add('Neurologist');
  }
  if (sl.some(s => s.includes('fracture') || s.includes('bone') || s.includes('spinal'))) {
    specialists.add('Orthopedic Surgeon');
  }
  if (sl.some(s => s.includes('burn'))) {
    specialists.add('Burns Specialist');
  }
  if (sl.some(s => s.includes('trauma') || s.includes('accident'))) {
    specialists.add('Trauma Surgeon');
  }
  if (sl.some(s => s.includes('overdose') || s.includes('poison'))) {
    specialists.add('Toxicologist');
  }
  if (severity === 'CRITICAL' || severity === 'HIGH') {
    specialists.add('Critical Care Physician');
  }

  return Array.from(specialists);
}

export function runTriageEngine(input: TriageInput): TriageResult {
  let score = 0;
  const reasoning: string[] = [];

  if (input.consciousness === 'UNCONSCIOUS') {
    score += 50;
    reasoning.push('Patient is unconscious — immediate life threat detected');
  } else if (input.consciousness === 'CONFUSED') {
    score += 25;
    reasoning.push('Altered consciousness — potential neurological compromise');
  }

  if (input.breathing === 'ABSENT') {
    score += 60;
    reasoning.push('Breathing absent — critical airway compromise, resuscitation needed');
  } else if (input.breathing === 'LABORED') {
    score += 30;
    reasoning.push('Labored breathing — respiratory distress present');
  }

  if (input.bleeding === 'SEVERE') {
    score += 35;
    reasoning.push('Severe bleeding — hemorrhagic shock risk');
  } else if (input.bleeding === 'MINOR') {
    score += 10;
    reasoning.push('Minor bleeding present');
  }

  const { score: vitalScore, issues } = scoreVitals(input.vitals);
  score += vitalScore;
  issues.forEach(i => reasoning.push(i));

  if (input.age > 70) {
    score += 15;
    reasoning.push('Advanced age (70+) — elevated complication risk');
  } else if (input.age > 60) {
    score += 8;
    reasoning.push('Senior patient — increased vulnerability');
  } else if (input.age < 5) {
    score += 18;
    reasoning.push('Infant/young child — pediatric critical care required');
  }

  const sl = input.symptoms.map(s => s.toLowerCase());
  sl.forEach(s => {
    if (CRITICAL_SYMPTOMS.some(c => s.includes(c))) {
      score += 25;
      reasoning.push(`Critical symptom: ${s}`);
    } else if (HIGH_SYMPTOMS.some(h => s.includes(h))) {
      score += 12;
      reasoning.push(`High-risk symptom: ${s}`);
    } else if (MODERATE_SYMPTOMS.some(m => s.includes(m))) {
      score += 5;
      reasoning.push(`Moderate symptom: ${s}`);
    }
  });

  let severity: Severity;
  let needsICU: boolean;
  let needsVentilator: boolean;

  if (score >= 80) {
    severity = 'CRITICAL';
    needsICU = true;
    needsVentilator = input.breathing !== 'NORMAL' || input.vitals.o2Saturation < 90;
  } else if (score >= 50) {
    severity = 'HIGH';
    needsICU = score >= 60;
    needsVentilator = input.vitals.o2Saturation < 88;
  } else if (score >= 25) {
    severity = 'MODERATE';
    needsICU = false;
    needsVentilator = false;
  } else {
    severity = 'LOW';
    needsICU = false;
    needsVentilator = false;
  }

  const specialistRequired = getSpecialists(input.symptoms, severity);

  return { severity, needsICU, needsVentilator, specialistRequired, score, reasoning };
}
