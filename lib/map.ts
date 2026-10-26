/**
 * Mapa propio de El Palmar (teselas de OpenStreetMap ya montadas en /public/map, © colaboradores de OpenStreetMap,
 * ODbL): cinco niveles de detalle, del 12 al 16. Coordenadas en píxeles del mundo Web Mercator a cada nivel.
 */
export const MAP_LEVELS = {
  12: { x0: 506114, y0: 410559, w: 1024, h: 768 },
  13: { x0: 1012484, y0: 821374, w: 1536, h: 1024 },
  14: { x0: 2025480, y0: 1643133, w: 2048, h: 1280 },
  15: { x0: 4051728, y0: 3286745, w: 2560, h: 1600 },
  16: { x0: 8104416, y0: 6574090, w: 3200, h: 2000 },
} as const;
export type MapLevel = keyof typeof MAP_LEVELS;

/** Posición del hotel en píxeles del nivel 16 (donde va el pin). */
export function worldPx16(lat: number, lng: number) {
  const size = 256 * 2 ** 16;
  const r = (lat * Math.PI) / 180;
  return {
    x: ((lng + 180) / 360) * size,
    y: ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * size,
  };
}
