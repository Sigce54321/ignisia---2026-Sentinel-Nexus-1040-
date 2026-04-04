export interface TrafficSignal {
  id: string;
  location: string;
  lat: number;
  lng: number;
  status: 'GREEN' | 'CLEARING' | 'CLEARED';
  clearedAt?: number;
}

export interface GreenCorridorStatus {
  active: boolean;
  corridorId: string;
  signalsTotal: number;
  signalsCleared: number;
  etaReduction: number;
  route: TrafficSignal[];
}

let corridorStore: GreenCorridorStatus | null = null;

function generateRouteSignals(fromLat: number, fromLng: number, toLat: number, toLng: number): TrafficSignal[] {
  const count = Math.floor(Math.random() * 4) + 4;
  const signals: TrafficSignal[] = [];

  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1);
    const lat = fromLat + (toLat - fromLat) * t + (Math.random() - 0.5) * 0.005;
    const lng = fromLng + (toLng - fromLng) * t + (Math.random() - 0.5) * 0.005;
    signals.push({
      id: `sig-${i + 1}`,
      location: `Signal ${i + 1}`,
      lat,
      lng,
      status: 'GREEN',
    });
  }
  return signals;
}

export function activateGreenCorridor(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): GreenCorridorStatus {
  const route = generateRouteSignals(fromLat, fromLng, toLat, toLng);
  const corridorId = `GC-${Date.now().toString(36).toUpperCase()}`;

  corridorStore = {
    active: true,
    corridorId,
    signalsTotal: route.length,
    signalsCleared: 0,
    etaReduction: 0,
    route,
  };

  let cleared = 0;
  route.forEach((signal, i) => {
    setTimeout(() => {
      signal.status = 'CLEARED';
      signal.clearedAt = Date.now();
      cleared++;
      if (corridorStore) {
        corridorStore.signalsCleared = cleared;
        corridorStore.etaReduction = Math.round((cleared / route.length) * 5);
      }
    }, (i + 1) * 1200);
  });

  return corridorStore;
}

export function getCorridorStatus(): GreenCorridorStatus | null {
  return corridorStore;
}

export function deactivateGreenCorridor(): void {
  corridorStore = null;
}
