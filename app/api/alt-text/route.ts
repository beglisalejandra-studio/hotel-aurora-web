import Anthropic from "@anthropic-ai/sdk";
import { AltTextRefusal, suggestAltText } from "@/lib/ai/alt-text";
import { AltTextRequestSchema, sanityImageUrl } from "@/lib/ai/alt-text-input";
import { serverEnv } from "@/lib/env.server";
import { rateLimit } from "@/lib/security/rate-limit";
import { BodyError, json, readJsonLimited } from "@/lib/security/request";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Sugerencia de texto alternativo para el panel (/admin). Solo para editores del proyecto de Sanity: el panel envía
 * su token de sesión y aquí se comprueba contra la API de Sanity. Ningún dato de huéspedes pasa por aquí.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const fail = (status: number, message: string) =>
  json({ message }, status, { "Cache-Control": "no-store" });

async function sanityUser(token: string): Promise<string | null> {
  const res = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const me = (await res.json()) as { id?: string };
  return me.id ?? null;
}

export async function POST(req: Request) {
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return fail(403, "Origen no permitido.");
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const userId = token ? await sanityUser(token) : null;
  if (!userId) return fail(401, "Inicia sesión en el panel para pedir sugerencias.");

  const limit = await rateLimit(`alt-text:${userId}`, { limit: 60, windowMs: 60 * 60 * 1000 });
  if (!limit.ok)
    return fail(429, "Has pedido muchas sugerencias seguidas. Prueba de nuevo en unos minutos.");

  let body: unknown;
  try {
    body = await readJsonLimited(req, 4 * 1024);
  } catch (e) {
    return fail(e instanceof BodyError ? e.status : 400, "Petición no válida.");
  }
  const parsed = AltTextRequestSchema.safeParse(body);
  const imageUrl = parsed.success ? sanityImageUrl(parsed.data.assetRef, projectId, dataset) : null;
  if (!parsed.success || !imageUrl) return fail(400, "Foto no válida.");

  const apiKey = serverEnv().ANTHROPIC_API_KEY;
  if (!apiKey) {
    return fail(
      503,
      "La sugerencia automática aún no está activada (falta la clave de IA en Vercel). Escribe la descripción a mano.",
    );
  }

  try {
    const client = new Anthropic({ apiKey, timeout: 45_000, maxRetries: 1 });
    const alt = await suggestAltText(client, imageUrl, parsed.data.context);
    return json(alt, 200, { "Cache-Control": "no-store" });
  } catch (e) {
    if (e instanceof AltTextRefusal)
      return fail(422, "No se pudo describir esta foto. Escribe la descripción a mano.");
    if (e instanceof Anthropic.RateLimitError)
      return fail(429, "El servicio de IA está ocupado. Prueba de nuevo en un minuto.");
    if (e instanceof Anthropic.APIError)
      return fail(
        502,
        "El servicio de IA no respondió. Prueba de nuevo o escribe la descripción a mano.",
      );
    return fail(500, "No se pudo sugerir la descripción.");
  }
}
