import type { Hospital } from './data';
import { ALL_HOSPITALS } from './data';

const CACHE_KEY = 'golden_hour_hospitals_cache';
const CACHE_TTL = 60 * 60 * 1000;

interface CacheEntry {
  data: Record<string, Hospital[]>;
  cachedAt: number;
}

export class OfflineManager {
  private static instance: OfflineManager;
  private _isOnline = navigator.onLine;
  private listeners: Array<(online: boolean) => void> = [];

  private constructor() {
    window.addEventListener('online', () => {
      this._isOnline = true;
      this.notify(true);
    });
    window.addEventListener('offline', () => {
      this._isOnline = false;
      this.notify(false);
    });
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  get isOnline(): boolean {
    return this._isOnline;
  }

  onStatusChange(listener: (online: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(online: boolean): void {
    this.listeners.forEach(l => l(online));
  }

  cacheHospitalData(): void {
    const entry: CacheEntry = {
      data: ALL_HOSPITALS,
      cachedAt: Date.now(),
    };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch {
    }
  }

  getCachedHospitals(): Record<string, Hospital[]> | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const entry: CacheEntry = JSON.parse(raw);
      if (Date.now() - entry.cachedAt > CACHE_TTL) return null;
      return entry.data;
    } catch {
      return null;
    }
  }

  getHospitals(city: string): Hospital[] {
    if (this._isOnline) return ALL_HOSPITALS[city] ?? [];
    const cached = this.getCachedHospitals();
    if (cached) return cached[city] ?? [];
    return ALL_HOSPITALS[city] ?? [];
  }

  calculateDistanceBasedRoute(
    hospitals: Hospital[],
    patientLat: number,
    patientLng: number
  ): Hospital[] {
    function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    return [...hospitals]
      .map(h => ({ ...h, distance: haversine(patientLat, patientLng, h.lat, h.lng) }))
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }
}

export const offlineManager = OfflineManager.getInstance();
