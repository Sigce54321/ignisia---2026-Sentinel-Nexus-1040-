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
  { id: 'amb-1', callSign: 'AMB-101', lat: 19.076, lng: 72.877, status: 'AVAILABLE', crew: ['Dr. Sharma', 'Paramedic Raj'], equipment: ['Defibrillator', 'Ventilator', 'IV Kit'], fuelLevel: 85 },
  { id: 'amb-2', callSign: 'AMB-102', lat: 19.082, lng: 72.883, status: 'AVAILABLE', crew: ['Dr. Patel', 'Paramedic Meena'], equipment: ['Defibrillator', 'O2 Tank', 'IV Kit'], fuelLevel: 72 },
  { id: 'amb-3', callSign: 'AMB-103', lat: 19.068, lng: 72.862, status: 'DISPATCHED', crew: ['Dr. Singh', 'Paramedic Kumar'], equipment: ['Ventilator', 'O2 Tank'], fuelLevel: 60 },
  { id: 'amb-4', callSign: 'AMB-104', lat: 19.095, lng: 72.851, status: 'AVAILABLE', crew: ['Dr. Nair', 'Paramedic Anita'], equipment: ['Defibrillator', 'Ventilator', 'Spine Board'], fuelLevel: 90 },
  { id: 'amb-5', callSign: 'AMB-201', lat: 28.567, lng: 77.210, status: 'AVAILABLE', crew: ['Dr. Verma', 'Paramedic Ravi'], equipment: ['Defibrillator', 'IV Kit', 'O2 Tank'], fuelLevel: 78 },
  { id: 'amb-6', callSign: 'AMB-202', lat: 28.540, lng: 77.292, status: 'AVAILABLE', crew: ['Dr. Gupta', 'Paramedic Sita'], equipment: ['Ventilator', 'O2 Tank', 'Spine Board'], fuelLevel: 65 },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface AssignmentResult {
  primary: Ambulance;
  backup: Ambulance | null;
  primaryETA: number;
  backupETA: number | null;
}

export function assignAmbulance(patientLat: number, patientLng: number): AssignmentResult {
  const available = AMBULANCES
    .filter(a => a.status === 'AVAILABLE' && a.fuelLevel > 20)
    .map(a => ({
      ...a,
      dist: haversineKm(patientLat, patientLng, a.lat, a.lng),
    }))
    .sort((a, b) => a.dist - b.dist);

  if (available.length === 0) {
    const fallback: Ambulance = {
      id: 'amb-fallback',
      callSign: `AMB-${Math.floor(Math.random() * 900) + 100}`,
      lat: patientLat + 0.01,
      lng: patientLng + 0.01,
      status: 'AVAILABLE',
      crew: ['Paramedic Team'],
      equipment: ['Basic Life Support'],
      fuelLevel: 80,
    };
    return { primary: fallback, backup: null, primaryETA: 8, backupETA: null };
  }

  const primary = available[0];
  const backup = available[1] || null;
  const primaryETA = Math.max(3, Math.round((primary.dist / 50) * 60));
  const backupETA = backup ? Math.max(5, Math.round((backup.dist / 50) * 60)) : null;

  primary.status = 'DISPATCHED';

  return { primary, backup, primaryETA, backupETA };
}
