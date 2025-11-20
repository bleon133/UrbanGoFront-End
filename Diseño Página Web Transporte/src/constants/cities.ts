// Ciudades del Área Metropolitana de Bucaramanga
export const CITIES = [
  { value: 'bucaramanga', label: 'Bucaramanga' },
  { value: 'floridablanca', label: 'Floridablanca' },
  { value: 'piedecuesta', label: 'Piedecuesta' },
  { value: 'giron', label: 'Girón' },
  { value: 'lebrija', label: 'Lebrija' }
] as const;

// Coordenadas por defecto para Bucaramanga
export const DEFAULT_COORDS = {
  lat: 7.1193,
  lng: -73.1227,
  zoom: 13
} as const;
