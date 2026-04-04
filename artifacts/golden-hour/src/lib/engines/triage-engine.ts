export type Severity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface Vitals {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  oxygenSaturation: number;
  temperature: number;
  respiratoryRate: number;
}

export interface TriageInput {
  symptoms: string[];
  vitals: Vitals;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  consciousness: 'ALERT' | 'CONFUSED' | 'UNCONSCIOUS';
  bleeding: 'NONE' | 'MINOR' | 'SEVERE';
}

export interface TriageResult {
  severity: Severity;
  needsICU: boolean;
  needsVentilator: boolean;
  specialistRequired: string[];
  aiConfidence: number;
  score: number;
  reasoning: string[];
}

export function analyzeTriage(input: TriageInput): TriageResult {
  let score = 0;
  const reasoning: string[] = [];
  const specialists = new Set<string>();
  let needsICU = false;
  let needsVentilator = false;

  const { vitals, symptoms, age, consciousness, bleeding } = input;
  const sl = symptoms.map(s => s.toLowerCase());

  if (vitals.oxygenSaturation < 90) {
    score += 50;
    needsICU = true;
    needsVentilator = true;
    reasoning.push(`Critical O2 saturation: ${vitals.oxygenSaturation}% — hypoxia, ICU + ventilator required`);
  } else if (vitals.oxygenSaturation < 95) {
    score += 25;
    needsICU = true;
    reasoning.push(`Low O2 saturation: ${vitals.oxygenSaturation}% — supplemental oxygen needed`);
  }

  const sbp = vitals.bloodPressure.systolic;
  if (sbp < 90 || sbp > 180) {
    score += 45;
    needsICU = true;
    reasoning.push(`Critical blood pressure: ${sbp}/${vitals.bloodPressure.diastolic} mmHg — hemodynamic instability`);
  } else if (sbp < 100 || sbp > 160) {
    score += 20;
    reasoning.push(`Abnormal blood pressure: ${sbp}/${vitals.bloodPressure.diastolic} mmHg`);
  }

  if (vitals.heartRate < 40 || vitals.heartRate > 140) {
    score += 35;
    specialists.add('Cardiologist');
    reasoning.push(`Dangerous heart rate: ${vitals.heartRate} bpm — cardiac monitoring required`);
  } else if (vitals.heartRate < 55 || vitals.heartRate > 110) {
    score += 15;
    specialists.add('Cardiologist');
    reasoning.push(`Abnormal heart rate: ${vitals.heartRate} bpm`);
  }

  if (vitals.respiratoryRate > 30 || vitals.respiratoryRate < 8) {
    score += 30;
    needsVentilator = true;
    reasoning.push(`Critical respiratory rate: ${vitals.respiratoryRate}/min — ventilatory support needed`);
  } else if (vitals.respiratoryRate > 24 || vitals.respiratoryRate < 12) {
    score += 12;
    reasoning.push(`Abnormal respiratory rate: ${vitals.respiratoryRate}/min`);
  }

  if (vitals.temperature > 40 || vitals.temperature < 35) {
    score += 18;
    reasoning.push(`Extreme temperature: ${vitals.temperature}°C`);
  }

  if (consciousness === 'UNCONSCIOUS') {
    score += 50;
    needsICU = true;
    reasoning.push('Unconscious patient — immediate life threat, full resuscitation protocol');
  } else if (consciousness === 'CONFUSED') {
    score += 25;
    reasoning.push('Altered consciousness — neurological assessment required');
    specialists.add('Neurologist');
  }

  if (bleeding === 'SEVERE') {
    score += 35;
    needsICU = true;
    reasoning.push('Severe bleeding — hemorrhagic shock risk, surgical standby needed');
    specialists.add('Trauma Surgeon');
  } else if (bleeding === 'MINOR') {
    score += 8;
    reasoning.push('Minor bleeding — wound management required');
  }

  sl.forEach(s => {
    if (s.includes('chest pain') || s.includes('cardiac arrest') || s.includes('heart attack')) {
      score += 40;
      needsICU = true;
      specialists.add('Cardiologist');
      reasoning.push(`Cardiac emergency: ${s}`);
    } else if (s.includes('stroke')) {
      score += 45;
      needsICU = true;
      specialists.add('Neurologist');
      reasoning.push('Stroke detected — time-critical intervention, CT scan required');
    } else if (s.includes('accident') || s.includes('trauma') || s.includes('collision')) {
      score += 30;
      specialists.add('Trauma Surgeon');
      reasoning.push(`High-energy trauma: ${s} — full trauma assessment`);
    } else if (s.includes('head') || s.includes('brain')) {
      score += 35;
      specialists.add('Neurologist');
      reasoning.push(`Head injury: ${s} — neurosurgery evaluation needed`);
    } else if (s.includes('fracture') || s.includes('bone')) {
      score += 15;
      specialists.add('Orthopedic Surgeon');
      reasoning.push(`Fracture: ${s}`);
    } else if (s.includes('burn')) {
      score += 30;
      specialists.add('Burns Specialist');
      reasoning.push(`Burns: ${s} — specialized burns unit required`);
    } else if (s.includes('seizure')) {
      score += 25;
      needsICU = true;
      specialists.add('Neurologist');
      reasoning.push('Seizure — anti-epileptic management required');
    } else if (s.includes('overdose') || s.includes('poison')) {
      score += 28;
      needsICU = true;
      reasoning.push(`Toxic exposure: ${s} — toxicology consultation needed`);
    }
  });

  if (age < 18) {
    score += 15;
    specialists.add('Pediatrician');
    reasoning.push('Pediatric patient — age-specific protocols and dosing required');
  } else if (age > 70) {
    score += 12;
    reasoning.push('Elderly patient (70+) — elevated complication risk, comorbidity assessment');
  }

  if (score >= 70) {
    needsICU = true;
  }

  let severity: Severity;
  if (score >= 80) {
    severity = 'CRITICAL';
  } else if (score >= 50) {
    severity = 'HIGH';
  } else if (score >= 25) {
    severity = 'MODERATE';
  } else {
    severity = 'LOW';
  }

  if (severity === 'CRITICAL' || severity === 'HIGH') {
    specialists.add('Critical Care Physician');
  }

  const aiConfidence = Math.min(95, 60 + Math.floor(score / 5));

  return {
    severity,
    needsICU,
    needsVentilator,
    specialistRequired: Array.from(specialists),
    aiConfidence,
    score,
    reasoning,
  };
}

export type { TriageInput as TriageInputType };
