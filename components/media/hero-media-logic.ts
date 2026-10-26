/** Decisiones puras del componente HeroMedia (testeables sin DOM). */

export type Aspect = "16:9" | "1:1" | "9:16";

export interface MediaConditions {
  /** El usuario pidió movimiento reducido (prefers-reduced-motion). */
  reducedMotion: boolean;
  /** Modo ahorro de datos (navigator.connection.saveData). */
  saveData: boolean;
  /** navigator.connection.effectiveType: "slow-2g" | "2g" | "3g" | "4g". */
  effectiveType?: string;
  /** El contenedor ya está en (o cerca de) el viewport. */
  inView: boolean;
  autoplay: boolean;
  hasSources: boolean;
}

/**
 * ¿Se debe CARGAR y reproducir el video? El poster SIEMPRE se muestra; el video es una mejora progresiva.
 * Nunca se carga si: no hay fuentes, el autoplay está desactivado, hay movimiento reducido, ahorro de datos o red lenta.
 */
export function shouldLoadVideo(c: MediaConditions): boolean {
  if (!c.hasSources || !c.autoplay) return false;
  if (c.reducedMotion || c.saveData) return false;
  if (c.effectiveType && /(^|-)2g$/.test(c.effectiveType)) return false;
  return c.inView;
}

/** Elige la variante (16:9, 1:1, 9:16) según la proporción del viewport, con respaldo a la más cercana disponible. */
export function pickAspect(
  width: number,
  height: number,
  available: readonly Aspect[],
): Aspect | null {
  if (available.length === 0 || width <= 0 || height <= 0) return available[0] ?? null;
  const ratio = width / height;
  const want: Aspect = ratio < 0.85 ? "9:16" : ratio <= 1.15 ? "1:1" : "16:9";
  if (available.includes(want)) return want;
  const fallback: Aspect[] =
    want === "9:16" ? ["1:1", "16:9"] : want === "1:1" ? ["16:9", "9:16"] : ["1:1", "9:16"];
  return fallback.find((a) => available.includes(a)) ?? available[0] ?? null;
}
