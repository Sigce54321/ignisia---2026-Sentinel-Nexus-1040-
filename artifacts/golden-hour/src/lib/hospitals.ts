export interface Hospital {
  id: string;
  name: string;
  city: string;
  distance: number;
  icuBeds: number;
  availableICU: number;
  specialties: string[];
  traumaLevel: 1 | 2 | 3;
  avgResponseTime: number;
  lat: number;
  lng: number;
}

export const hospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'City General Hospital',
    city: 'Mumbai',
    distance: 3.2,
    icuBeds: 40,
    availableICU: 12,
    specialties: ['Trauma', 'Cardiac', 'Neurology'],
    traumaLevel: 1,
    avgResponseTime: 8,
    lat: 19.076,
    lng: 72.877,
  },
  {
    id: 'h2',
    name: 'St. Mary\'s Medical Center',
    city: 'Mumbai',
    distance: 5.8,
    icuBeds: 30,
    availableICU: 8,
    specialties: ['Burns', 'Orthopedics', 'Pediatrics'],
    traumaLevel: 2,
    avgResponseTime: 12,
    lat: 19.082,
    lng: 72.883,
  },
  {
    id: 'h3',
    name: 'Apollo Trauma Center',
    city: 'Mumbai',
    distance: 7.1,
    icuBeds: 60,
    availableICU: 25,
    specialties: ['Trauma', 'Neuro', 'Cardiac', 'Burns'],
    traumaLevel: 1,
    avgResponseTime: 15,
    lat: 19.068,
    lng: 72.862,
  },
  {
    id: 'h4',
    name: 'Rajiv Gandhi Hospital',
    city: 'Mumbai',
    distance: 9.4,
    icuBeds: 50,
    availableICU: 5,
    specialties: ['Oncology', 'Cardiac', 'Neurology'],
    traumaLevel: 2,
    avgResponseTime: 18,
    lat: 19.095,
    lng: 72.851,
  },
  {
    id: 'h5',
    name: 'Lilavati Hospital',
    city: 'Mumbai',
    distance: 4.5,
    icuBeds: 35,
    availableICU: 18,
    specialties: ['Trauma', 'Cardiac', 'Pediatrics'],
    traumaLevel: 1,
    avgResponseTime: 10,
    lat: 19.055,
    lng: 72.836,
  },
];
