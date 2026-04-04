export interface Hospital {
  id: string;
  name: string;
  city: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  contact: {
    phone: string;
    emergency: string;
  };
  capabilities: {
    totalBeds: number;
    availableBeds: number;
    icuBeds: number;
    availableICU: number;
    ventilators: number;
    availableVentilators: number;
    oxygenSupply: boolean;
    bloodBank: boolean;
    trauma: boolean;
  };
  specialists: {
    cardiology: boolean;
    neurology: boolean;
    trauma: boolean;
    orthopedic: boolean;
    pediatric: boolean;
    general: boolean;
  };
  status: 'AVAILABLE' | 'BUSY' | 'FULL';
  rating: number;
  responseTime: number;
  successRate: number;
}

export const hospitalsMumbai: Hospital[] = [
  {
    id: 'mum-1',
    name: 'Lilavati Hospital',
    city: 'Mumbai',
    location: { lat: 19.0544, lng: 72.8320, address: 'A-791, Bandra Reclamation, Bandra West, Mumbai' },
    contact: { phone: '022-2675-1000', emergency: '022-2675-1111' },
    capabilities: { totalBeds: 330, availableBeds: 85, icuBeds: 60, availableICU: 18, ventilators: 30, availableVentilators: 10, oxygenSupply: true, bloodBank: true, trauma: true },
    specialists: { cardiology: true, neurology: true, trauma: true, orthopedic: true, pediatric: true, general: true },
    status: 'AVAILABLE',
    rating: 4.7,
    responseTime: 8,
    successRate: 96,
  },
  {
    id: 'mum-2',
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    city: 'Mumbai',
    location: { lat: 19.1825, lng: 72.8343, address: 'Rao Saheb Achutrao Patwardhan Marg, Andheri West, Mumbai' },
    contact: { phone: '022-3066-1000', emergency: '022-3066-1111' },
    capabilities: { totalBeds: 750, availableBeds: 180, icuBeds: 120, availableICU: 28, ventilators: 60, availableVentilators: 15, oxygenSupply: true, bloodBank: true, trauma: true },
    specialists: { cardiology: true, neurology: true, trauma: true, orthopedic: true, pediatric: true, general: true },
    status: 'AVAILABLE',
    rating: 4.8,
    responseTime: 9,
    successRate: 97,
  },
  {
    id: 'mum-3',
    name: 'Hinduja Hospital',
    city: 'Mumbai',
    location: { lat: 19.0367, lng: 72.8264, address: 'Veer Savarkar Marg, Mahim, Mumbai' },
    contact: { phone: '022-2444-9199', emergency: '022-2444-9911' },
    capabilities: { totalBeds: 350, availableBeds: 90, icuBeds: 70, availableICU: 15, ventilators: 35, availableVentilators: 9, oxygenSupply: true, bloodBank: true, trauma: true },
    specialists: { cardiology: true, neurology: true, trauma: true, orthopedic: true, pediatric: false, general: true },
    status: 'AVAILABLE',
    rating: 4.6,
    responseTime: 9,
    successRate: 95,
  },
  {
    id: 'mum-4',
    name: 'Breach Candy Hospital',
    city: 'Mumbai',
    location: { lat: 18.9733, lng: 72.8059, address: '60-A Bhulabhai Desai Road, Breach Candy, Mumbai' },
    contact: { phone: '022-2367-1888', emergency: '022-2367-1999' },
    capabilities: { totalBeds: 200, availableBeds: 50, icuBeds: 50, availableICU: 9, ventilators: 25, availableVentilators: 6, oxygenSupply: true, bloodBank: true, trauma: false },
    specialists: { cardiology: true, neurology: false, trauma: false, orthopedic: true, pediatric: true, general: true },
    status: 'AVAILABLE',
    rating: 4.5,
    responseTime: 11,
    successRate: 93,
  },
  {
    id: 'mum-5',
    name: 'Jaslok Hospital',
    city: 'Mumbai',
    location: { lat: 18.9639, lng: 72.8058, address: '15 Dr Deshmukh Marg, Pedder Road, Mumbai' },
    contact: { phone: '022-6657-3333', emergency: '022-6657-3999' },
    capabilities: { totalBeds: 320, availableBeds: 78, icuBeds: 65, availableICU: 14, ventilators: 32, availableVentilators: 8, oxygenSupply: true, bloodBank: true, trauma: true },
    specialists: { cardiology: true, neurology: true, trauma: false, orthopedic: true, pediatric: false, general: true },
    status: 'AVAILABLE',
    rating: 4.6,
    responseTime: 10,
    successRate: 94,
  },
  {
    id: 'mum-6',
    name: 'Bombay Hospital',
    city: 'Mumbai',
    location: { lat: 18.9420, lng: 72.8258, address: '12, New Marine Lines, Marine Lines, Mumbai' },
    contact: { phone: '022-2206-7676', emergency: '022-2206-7999' },
    capabilities: { totalBeds: 420, availableBeds: 100, icuBeds: 80, availableICU: 20, ventilators: 40, availableVentilators: 11, oxygenSupply: true, bloodBank: true, trauma: true },
    specialists: { cardiology: true, neurology: true, trauma: true, orthopedic: true, pediatric: true, general: true },
    status: 'AVAILABLE',
    rating: 4.7,
    responseTime: 8,
    successRate: 96,
  },
  {
    id: 'mum-7',
    name: 'Nanavati Super Speciality Hospital',
    city: 'Mumbai',
    location: { lat: 19.0431, lng: 72.8347, address: 'S. V. Road, Vile Parle West, Mumbai' },
    contact: { phone: '022-2626-7500', emergency: '022-2626-7999' },
    capabilities: { totalBeds: 355, availableBeds: 85, icuBeds: 70, availableICU: 16, ventilators: 35, availableVentilators: 9, oxygenSupply: true, bloodBank: true, trauma: true },
    specialists: { cardiology: true, neurology: true, trauma: true, orthopedic: false, pediatric: false, general: true },
    status: 'AVAILABLE',
    rating: 4.5,
    responseTime: 10,
    successRate: 94,
  },
  {
    id: 'mum-8',
    name: 'Tata Memorial Hospital',
    city: 'Mumbai',
    location: { lat: 19.0105, lng: 72.8444, address: 'Dr. E Borges Road, Parel, Mumbai' },
    contact: { phone: '022-2417-7000', emergency: '022-2417-7999' },
    capabilities: { totalBeds: 620, availableBeds: 140, icuBeds: 80, availableICU: 12, ventilators: 40, availableVentilators: 7, oxygenSupply: true, bloodBank: true, trauma: false },
    specialists: { cardiology: false, neurology: false, trauma: false, orthopedic: false, pediatric: true, general: true },
    status: 'AVAILABLE',
    rating: 4.9,
    responseTime: 12,
    successRate: 97,
  },
  {
    id: 'mum-9',
    name: 'Seven Hills Hospital',
    city: 'Mumbai',
    location: { lat: 19.2247, lng: 72.8492, address: 'Marol Maroshi Road, Andheri East, Mumbai' },
    contact: { phone: '022-6767-6767', emergency: '022-6767-6999' },
    capabilities: { totalBeds: 500, availableBeds: 120, icuBeds: 90, availableICU: 22, ventilators: 45, availableVentilators: 13, oxygenSupply: true, bloodBank: true, trauma: true },
    specialists: { cardiology: true, neurology: true, trauma: true, orthopedic: true, pediatric: false, general: true },
    status: 'AVAILABLE',
    rating: 4.4,
    responseTime: 9,
    successRate: 92,
  },
  {
    id: 'mum-10',
    name: 'Fortis Mulund',
    city: 'Mumbai',
    location: { lat: 19.1722, lng: 72.9565, address: 'Mulund Goregaon Link Road, Mulund West, Mumbai' },
    contact: { phone: '022-4120-6300', emergency: '022-4120-6999' },
    capabilities: { totalBeds: 315, availableBeds: 80, icuBeds: 65, availableICU: 17, ventilators: 32, availableVentilators: 10, oxygenSupply: true, bloodBank: true, trauma: true },
    specialists: { cardiology: true, neurology: true, trauma: false, orthopedic: true, pediatric: false, general: true },
    status: 'AVAILABLE',
    rating: 4.5,
    responseTime: 10,
    successRate: 93,
  },
];
