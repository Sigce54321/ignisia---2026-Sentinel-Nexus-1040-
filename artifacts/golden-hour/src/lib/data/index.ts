export type { Hospital } from './hospitals-mumbai';
export { hospitalsMumbai } from './hospitals-mumbai';
export { hospitalsDelhi } from './hospitals-delhi';
export { hospitalsBangalore } from './hospitals-bangalore';
export { hospitalsPune } from './hospitals-pune';

import { hospitalsMumbai } from './hospitals-mumbai';
import { hospitalsDelhi } from './hospitals-delhi';
import { hospitalsBangalore } from './hospitals-bangalore';
import { hospitalsPune } from './hospitals-pune';
import type { Hospital } from './hospitals-mumbai';

export const ALL_HOSPITALS: Record<string, Hospital[]> = {
  Mumbai: hospitalsMumbai,
  Delhi: hospitalsDelhi,
  Bangalore: hospitalsBangalore,
  Pune: hospitalsPune,
};

export const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune'] as const;
export type City = typeof CITIES[number];
