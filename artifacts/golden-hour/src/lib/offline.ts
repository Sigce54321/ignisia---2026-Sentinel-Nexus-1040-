import type { Hospital } from './data';
import { ALL_HOSPITALS } from './data';
import { haversineKm } from './utils/distance';

const CACHE_KEY = 'golden_hour_hospitals_v2';
const CACHE_TTL = 60 * 60 * 1000;

interface CacheEntry {
  data: Record<string, Hospital[]>;
  cachedAt: number;
}

export class OfflineManager {
  private static instance: OfflineManager;
  private _isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Array<(online: boolean) => void> = [];

  private constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', () => { this._isOnline = true; this.notify(true); });
    window.addEventListener('offline', () => { this._isOnline = false; this.notify(false); });
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  isOnline(): boolean {
    return this._isOnline;
  }

  onStatusChange(listener: (online: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  private notify(online: boolean): void {
    this.listeners.forEach(l => l(online));
  }

  cacheHospitalData(hospitals: Record<string, Hospital[]>): void {
    try {
      const entry: CacheEntry = { data: hospitals, cachedAt: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch { }
  }

  getCachedHospitals(): Record<string, Hospital[]> | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const entry: CacheEntry = JSON.parse(raw);
      if (Date.now() - entry.cachedAt > CACHE_TTL) return null;
      return entry.data;
    } catch { return null; }
  }

  getHospitals(city: string): Hospital[] {
    if (this._isOnline) {
      const hospitals = ALL_HOSPITALS[city] ?? [];
      this.cacheHospitalData(ALL_HOSPITALS);
      return hospitals;
    }
    const cached = this.getCachedHospitals();
    return cached?.[city] ?? ALL_HOSPITALS[city] ?? [];
  }

  calculateDistanceBasedRoute(
    lat: number,
    lng: number,
    hospitals: Hospital[]
  ): Hospital[] {
    return [...hospitals]
      .map(h => ({ ...h, _dist: haversineKm(lat, lng, h.location.lat, h.location.lng) }))
      .sort((a, b) => (a._dist ?? 0) - (b._dist ?? 0));
  }
}
