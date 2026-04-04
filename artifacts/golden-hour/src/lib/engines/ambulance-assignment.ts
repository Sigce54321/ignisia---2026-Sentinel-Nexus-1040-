import { haversineKm } from '../utils/distance';

export interface Ambulance {
  id: string;
  callSign: string;
  lat: number;
  lng: number;
  status: 'AVAILABLE' | 'DISPATCHED' | 'AT_SCENE' | 'TRANSPORTING' | 'OFFLINE';
  crew: string[];
  equipment: string[];
  fuelLevel: number;
}

const AMBULANCES: Ambulance[] = [
  { id: 'amb-1', callSign: 'AMB-101', lat: 19.076, lng: 72.877, status: 'AVAILABLE', crew: ['Dr. Sharma', 'Paramedic Raj'], equipment: ['Defibrillator', 'Ventilator', 'IV Kit', 'O2 Tank'], fuelLevel: 85 },
  { id: 'amb-2', callSign: 'AMB-102', lat: 19.082, lng: 72.883, status: 'AVAILABLE', crew: ['Dr. Patel', 'Paramedic Meena'], equipment: ['Defibrillator', 'O2 Tank', 'IV Kit', 'Spine Board'], fuelLevel: 72 },
  { id: 'amb-3', callSign: 'AMB-103', lat: 19.068, lng: 72.862, status: 'DISPATCHED', crew: ['Dr. Singh', 'Paramedic Kumar'], equipment: ['Ventilator', 'O2 Tank'], fuelLevel: 60 },
  { id: 'amb-4', callSign: 'AMB-104', lat: 19.095, lng: 72.851, status: 'AVAILABLE', crew: ['Dr. Nair', 'Paramedic Anita'], equipment: ['Defibrillator', 'Ventilator', 'Spine Board', 'IV Kit'], fuelLevel: 90 },
  { id: 'amb-5', callSign: 'AMB-201', lat: 28.567, lng: 77.210, status: 'AVAILABLE', crew: ['Dr. Verma', 'Paramedic Ravi'], equipment: ['Defibrillator', 'IV Kit', 'O2 Tank'], fuelLevel: 78 },
  { id: 'amb-6', callSign: 'AMB-202', lat: 28.540, lng: 77.292, status: 'AVAILABLE', crew: ['Dr. Gupta', 'Paramedic Sita'], equipment: ['Ventilator', 'O2 Tank', 'Spine Board', 'IV Kit'], fuelLevel: 65 },
  { id: 'amb-7', callSign: 'AMB-301', lat: 12.972, lng: 77.594, status: 'AVAILABLE', crew: ['Dr. Menon', 'Paramedic Priya'], equipment: ['Defibrillator', 'Ventilator', 'O2 Tank'], fuelLevel: 80 },
  { id: 'amb-8', callSign: 'AMB-401', lat: 18.520, lng: 73.856, status: 'AVAILABLE', crew: ['Dr. Joshi', 'Paramedic Arun'], equipment: ['Defibrillator', 'O2 Tank', 'IV Kit'], fuelLevel: 75 },
];

export interface AssignmentResult {
  primary: Ambulance & { distanceKm: number };
  backup: (Ambulance & { distanceKm: number }) | null;
  primaryETA: number;
  backupETA: number | null;
}

export function assignAmbulance(patientLat: number, patientLng: number): AssignmentResult {
  const available = AMBULANCES
    .filter(a => a.status === 'AVAILABLE' && a.fuelLevel > 20)
    .map(a => ({
      ...a,
      distanceKm: Math.round(haversineKm(patientLat, patientLng, a.lat, a.lng) * 10) / 10,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  if (available.length === 0) {
    const fallback = {
      id: 'amb-fallback',
      callSign: `AMB-${Math.floor(Math.random() * 900) + 100}`,
      lat: patientLat + 0.01,
      lng: patientLng + 0.01,
      status: 'AVAILABLE' as const,
      crew: ['Emergency Paramedic Team'],
      equipment: ['Basic Life Support Kit'],
      fuelLevel: 80,
      distanceKm: 1.2,
    };
    return { primary: fallback, backup: null, primaryETA: 6, backupETA: null };
  }

  const primary = available[0];
  const backup = available[1] ?? null;
  const primaryETA = Math.max(3, Math.round((primary.distanceKm / 50) * 60));
  const backupETA = backup ? Math.max(5, Math.round((backup.distanceKm / 50) * 60)) : null;

  primary.status = 'DISPATCHED';

  return { primary, backup, primaryETA, backupETA };
}
