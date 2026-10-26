import "server-only";
import { z } from "zod";

/**
 * Variables SOLO de servidor. `server-only` hace fallar el build si alguien importa este archivo desde un componente
 * de cliente. Cada módulo (pagos, email…) valida sus propias variables en su propio archivo.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LEAD_SINK: z.enum(["log", "resend"]).default("log"),
  // Opcional: sin ella el panel no sugiere descripciones de fotos (y lo dice).
  ANTHROPIC_API_KEY: z.preprocess((v) => (v === "" ? undefined : v), z.string().min(20).optional()),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | undefined;

export function serverEnv(): ServerEnv {
  if (!cached) {
    const parsed = serverSchema.safeParse(process.env);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      throw new Error(`Variables de entorno de servidor inválidas → ${issues}`);
    }
    cached = parsed.data;
  }
  return cached;
}
