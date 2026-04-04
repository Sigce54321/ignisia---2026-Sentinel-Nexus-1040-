export type FailureType = 'TIRE' | 'ENGINE' | 'FUEL' | 'ACCIDENT';

export interface AmbulanceHealthData {
  ambulanceId: string;
  fuelLevel: number;
  engineStatus: 'GOOD' | 'WARNING' | 'CRITICAL';
  tirePressure: { frontLeft: number; frontRight: number; rearLeft: number; rearRight: number };
  speed: number;
  location: string;
  failed: boolean;
  failureType?: FailureType;
}

export interface FailureEvent {
  timestamp: number;
  ambulanceId: string;
  failureType: FailureType;
  backupAssigned: string;
  backupETA: number;
}

const failureLog: FailureEvent[] = [];

export function detectFailure(health: AmbulanceHealthData): FailureType | null {
  if (Object.values(health.tirePressure).some(p => p < 15)) return 'TIRE';
  if (health.engineStatus === 'CRITICAL') return 'ENGINE';
  if (health.fuelLevel < 10) return 'FUEL';
  return null;
}

export function handleFailure(health: AmbulanceHealthData): FailureEvent | null {
  const failureType = detectFailure(health);
  if (!failureType) return null;

  const backupCallSign = `AMB-${Math.floor(Math.random() * 900) + 100}`;
  const backupETA = Math.floor(Math.random() * 3) + 3;

  const event: FailureEvent = {
    timestamp: Date.now(),
    ambulanceId: health.ambulanceId,
    failureType,
    backupAssigned: backupCallSign,
    backupETA,
  };

  failureLog.push(event);
  return event;
}

export function getFailureLog(): FailureEvent[] {
  return [...failureLog];
}

export function initAmbulanceHealth(ambulanceId: string): AmbulanceHealthData {
  return {
    ambulanceId,
    fuelLevel: 70 + Math.random() * 25,
    engineStatus: 'GOOD',
    tirePressure: {
      frontLeft: 30 + Math.random() * 4,
      frontRight: 30 + Math.random() * 4,
      rearLeft: 28 + Math.random() * 4,
      rearRight: 28 + Math.random() * 4,
    },
    speed: 40 + Math.random() * 20,
    location: 'En route to patient',
    failed: false,
  };
}
