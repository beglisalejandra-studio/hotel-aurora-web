import "@/lib/zod-config";
import { z } from "zod";

/**
 * Variables PÚBLICAS (se incrustan en el bundle del cliente). Nada sensible aquí.
 * Next solo sustituye `process.env.NEXT_PUBLIC_X` si se referencia de forma estática,
 * por eso se enumeran una a una en lugar de pasar `process.env` entero.
 */
const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(emptyToUndefined, z.url().default("http://localhost:3000")),
  NEXT_PUBLIC_SITE_ENV: z.preprocess(
    emptyToUndefined,
    z.enum(["development", "preview", "staging", "production"]).default("development"),
  ),
});

export type PublicEnv = z.infer<typeof publicSchema>;

export function parsePublicEnv(source: Record<string, string | undefined>): PublicEnv {
  const parsed = publicSchema.safeParse(source);
  if (!parsed.success) {
    // No se imprimen los valores (podrían ser incorrectos pero sensibles por error): solo nombres y motivo.
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Variables de entorno públicas inválidas → ${issues}`);
  }
  return parsed.data;
}

export const publicEnv: PublicEnv = parsePublicEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_ENV: process.env.NEXT_PUBLIC_SITE_ENV,
});
