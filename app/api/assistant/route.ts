import Anthropic from "@anthropic-ai/sdk";
import {
  askConcierge,
  ConciergeRefusal,
  ConciergeRequestSchema,
  knowledgeText,
} from "@/lib/ai/concierge";
import { serverEnv } from "@/lib/env.server";
import { sanityFetch } from "@/lib/sanity/client";
import { FAQS_QUERY, ROOMS_QUERY } from "@/lib/sanity/queries";
import type { Faq, Offer, RoomCard, Settings } from "@/lib/sanity/types";
import { rateLimit } from "@/lib/security/rate-limit";
import { BodyError, clientIp, json, readJsonLimited } from "@/lib/security/request";

/**
 * POST /api/assistant — preguntas libres al asistente de la web (solo si hay ANTHROPIC_API_KEY en el servidor).
 * Solo lectura: responde con el contenido publicado; no reserva ni guarda la conversación. Límite por IP y tope
 * diario por instancia para acotar el coste.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DAILY_CAP = 400;
let day = "";
let used = 0;

const SETTINGS_OFFERS = `{
  "settings": *[_id == "settings"][0]{ name, address, checkIn, checkOut, maxDogs, phone, email },
  "offers": *[_type == "offer"] | order(order asc){ _id, title, summary }
}`;

export async function POST(req: Request): Promise<Response> {
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return json({ error: "origen no permitido" }, 403);
  const apiKey = serverEnv().ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: "asistente no activado" }, 503);

  const rl = await rateLimit(`assistant:${clientIp(req)}`, { limit: 20, windowMs: 10 * 60_000 });
  if (!rl.ok)
    return json({ error: "demasiadas preguntas" }, 429, {
      "Retry-After": String(rl.retryAfterSeconds),
    });
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    used = 0;
  }
  if (++used > DAILY_CAP) return json({ error: "tope diario alcanzado" }, 429);

  let body: unknown;
  try {
    body = await readJsonLimited(req, 8 * 1024);
  } catch (e) {
    return json({ error: "petición no válida" }, e instanceof BodyError ? e.status : 400);
  }
  const parsed = ConciergeRequestSchema.safeParse(body);
  if (!parsed.success) return json({ error: "petición no válida" }, 422);

  const [rooms, faqs, rest] = await Promise.all([
    sanityFetch<RoomCard[]>(ROOMS_QUERY),
    sanityFetch<Faq[]>(FAQS_QUERY),
    sanityFetch<{ settings: Settings | null; offers: Offer[] }>(SETTINGS_OFFERS),
  ]);
  const knowledge = knowledgeText(
    { settings: rest.settings, rooms, faqs, offers: rest.offers },
    parsed.data.lang,
  );

  try {
    const client = new Anthropic({ apiKey, timeout: 45_000, maxRetries: 1 });
    const answer = await askConcierge(client, knowledge, parsed.data);
    return json({ answer });
  } catch (e) {
    if (e instanceof ConciergeRefusal) return json({ error: "sin respuesta" }, 422);
    if (e instanceof Anthropic.RateLimitError) return json({ error: "servicio ocupado" }, 429);
    if (e instanceof Anthropic.APIError) return json({ error: "servicio no disponible" }, 502);
    return json({ error: "error" }, 500);
  }
}
