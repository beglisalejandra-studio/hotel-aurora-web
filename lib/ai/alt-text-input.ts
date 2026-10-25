import { z } from "zod";

/**
 * Entrada y salida de la sugerencia de texto alternativo. Sin dependencias de servidor para poder probarlo.
 * El panel envía la REFERENCIA de la foto en Sanity (no una URL): la web construye la dirección de la CDN de su propio
 * proyecto, así nadie puede usar este endpoint para que el servidor descargue direcciones arbitrarias.
 */
export const ASSET_REF = /^image-([a-f0-9]{20,64})-(\d{1,5}x\d{1,5})-(jpg|jpeg|png|webp|gif)$/;

export const AltTextRequestSchema = z.object({
  assetRef: z.string().regex(ASSET_REF),
  context: z.string().trim().max(200).optional(),
});

export const AltTextSchema = z.object({
  es: z.string().min(5).max(180),
  en: z.string().min(5).max(180),
});
export type AltText = z.infer<typeof AltTextSchema>;

/** Dirección de la foto en la CDN de Sanity, reducida y en JPG (formato que el modelo acepta siempre). */
export function sanityImageUrl(
  assetRef: string,
  projectId: string,
  dataset: string,
): string | null {
  const m = ASSET_REF.exec(assetRef);
  if (!m) return null;
  const [, id, dims, ext] = m;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dims}.${ext}?w=1200&fit=max&fm=jpg&q=80`;
}
