export const STATIONS = [
  {
    id: 'SABAS_NIEVES',
    name: 'Puesto Sabas Nieves I & II',
    sub: 'Altamira, Caracas',
    altitude: '1,300 m.s.n.m.',
    altitudeNum: 1300,
    rating: '4.9',
    category: 'popular',
    difficulty: 'Moderado',
    avgAscent: '45 - 60 min',
    image: '/assets/images/sabas_nieves.jpg',
    rangers: 'Guardaparques Gómez / Padrón',
    lat: 10.5186,
    lng: -66.8524,
    status: 'Puesto Abierto y Activo',
    descentCurfew: '17:30'
  },
  {
    id: 'LA_JULIA',
    name: 'Puesto La Julia / Mirador',
    sub: 'El Marqués Norte, Caracas',
    altitude: '1,140 m.s.n.m.',
    altitudeNum: 1140,
    rating: '4.8',
    category: 'popular',
    difficulty: 'Moderado',
    avgAscent: '50 - 70 min',
    image: '/assets/images/trails.jpg',
    rangers: 'Guardaparques Velásquez',
    lat: 10.5120,
    lng: -66.8190,
    status: 'Puesto Abierto y Activo',
    descentCurfew: '17:30'
  },
  {
    id: 'LOS_VENADOS',
    name: 'Puesto Los Venados / Hacienda',
    sub: 'Cotiza / Puerta Caracas',
    altitude: '1,550 m.s.n.m.',
    altitudeNum: 1550,
    rating: '4.9',
    category: 'moderate',
    difficulty: 'Familiar / Histórico',
    avgAscent: '1h 30 min (Vehículo o a pie)',
    image: '/assets/images/los_venados.jpg',
    rangers: 'Guardaparques Rivas',
    lat: 10.5367,
    lng: -66.8920,
    status: 'Puesto Abierto con Enfermería',
    descentCurfew: '17:30'
  },
  {
    id: 'QUEBRADA_QUINTERO',
    name: 'Puesto Quebrada Quintero',
    sub: 'Sebucán / Los Chorros',
    altitude: '1,220 m.s.n.m.',
    altitudeNum: 1220,
    rating: '4.7',
    category: 'moderate',
    difficulty: 'Fresco / Sendero Acuático',
    avgAscent: '40 min',
    image: '/assets/images/sabas_nieves.jpg',
    rangers: 'Guardaparques Terán',
    lat: 10.5211,
    lng: -66.8370,
    status: 'Puesto Abierto',
    descentCurfew: '17:30'
  },
  {
    id: 'PICO_NAIGUATA',
    name: 'Pico Naiguatá (Cumbre)',
    sub: 'Waraira Repano - Techo de Caracas',
    altitude: '2,765 m.s.n.m.',
    altitudeNum: 2765,
    rating: '5.0',
    category: 'extreme',
    difficulty: 'Muy Exigente (Alta Montaña)',
    avgAscent: '6 - 8 horas',
    image: '/assets/images/trails.jpg',
    rangers: 'Control en La Julia / Galindo',
    lat: 10.5422,
    lng: -66.7820,
    status: 'Registro Físico Obligatorio',
    descentCurfew: '16:00'
  }
];

export const WEATHER_ELEVATIONS = [
  { alt: '1,300m', temp: '24°', place: 'Sabas Nieves', condition: 'Soleado / Fresco', icon: 'sun' },
  { alt: '1,550m', temp: '20°', place: 'Los Venados', condition: 'Parcialmente Nublado', icon: 'cloud-sun' },
  { alt: '1,600m', temp: '19°', place: 'No Te Apures', condition: 'Neblina Ligera', icon: 'cloud' },
  { alt: '2,140m', temp: '15°', place: 'Hotel Humboldt', condition: 'Viento / Frío', icon: 'wind' },
  { alt: '2,765m', temp: '11°', place: 'Pico Naiguatá', condition: 'Viento Fuerte', icon: 'wind' }
];

export const INITIAL_HIKERS_LOG = [
  {
    id: 'hiker_101',
    name: 'Valeria Ramos Castillo',
    cedula: 'V-24.119.882',
    phone: '+58 412 908 1122',
    station: 'Sabas Nieves',
    destination: 'El Banquito (1,500m)',
    entryTime: '07:15 AM',
    elapsedMins: 75,
    contact: 'Pedro Ramos (Padre) - +58 414 112 3344',
    avatar: '/assets/images/hero.jpg'
  },
  {
    id: 'hiker_102',
    name: 'Carlos Benítez Osorio',
    cedula: 'V-18.441.092',
    phone: '+58 414 887 2390',
    station: 'La Julia',
    destination: 'Pico Oriental (2,640m)',
    entryTime: '06:30 AM',
    elapsedMins: 210,
    contact: 'Ana Osorio (Madre) - +58 424 991 8822',
    avatar: '/assets/images/avatar.jpg'
  },
  {
    id: 'hiker_103',
    name: 'Mariángel Duarte Silva',
    cedula: 'V-27.509.311',
    phone: '+58 416 339 0184',
    station: 'Los Venados',
    destination: 'Museo y Camping',
    entryTime: '08:00 AM',
    elapsedMins: 45,
    contact: 'Roberto Duarte (Esposo) - +58 414 200 9811',
    avatar: '/assets/images/trails.jpg'
  }
];
