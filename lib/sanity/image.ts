import { dataset, projectId } from "@/sanity/env";
import type { ImageRef } from "./types";

/**
 * Fotos del panel. El visitante nunca las pide a Sanity: pasan por el optimizador de imágenes de la propia web
 * (`/_next/image`), que las sirve en AVIF o WebP al tamaño justo. El recorte y el punto de interés del panel se respetan.
 */
export const SANITY_IMAGES = `https://cdn.sanity.io/images/${projectId}/${dataset}/`;

export type ResolvedImage = { src: string; width: number; height: number; position?: string };

const REF = /^image-([a-f0-9]+)-(\d+)x(\d+)-([a-z0-9]+)$/;
const pct = (v: number) => `${Math.round(Math.min(1, Math.max(0, v)) * 1000) / 10}%`;

export function resolveImage(img: ImageRef | undefined): ResolvedImage | null {
  const m = img?.ref ? REF.exec(img.ref) : null;
  if (!img || !m) return null;
  const [, id, w, h, ext] = m;
  let width = Number(w);
  let height = Number(h);
  let src = `${SANITY_IMAGES}${id}-${w}x${h}.${ext}`;
  const c = img.crop;
  let box = { left: 0, top: 0, w: 1, h: 1 };
  if (c && (c.left || c.right || c.top || c.bottom)) {
    box = { left: c.left, top: c.top, w: 1 - c.left - c.right, h: 1 - c.top - c.bottom };
    const rect = [box.left * width, box.top * height, box.w * width, box.h * height].map(
      Math.round,
    );
    src += `?rect=${rect.join(",")}`;
    width = rect[2] ?? width;
    height = rect[3] ?? height;
  }
  const hs = img.hotspot;
  const position =
    hs && (Math.abs(hs.x - 0.5) > 0.01 || Math.abs(hs.y - 0.5) > 0.01)
      ? `${pct((hs.x - box.left) / box.w)} ${pct((hs.y - box.top) / box.h)}`
      : undefined;
  return { src, width, height, position };
}
