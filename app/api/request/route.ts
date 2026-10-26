import { getLeadSink } from "@/lib/leads";
import { requestMessage, requestSchema, todayInSpain } from "@/lib/schemas/request";
import { rateLimit } from "@/lib/security/rate-limit";
import { BodyError, clientIp, json, readJsonLimited } from "@/lib/security/request";
import { cleanText } from "@/lib/security/sanitize";

const MIN_FILL_MS = 3_000;

/**
 * POST /api/request — solicitud de mesa, cita de spa o bono.
 * Defensas: mismo origen → límite por IP (5 cada 10 min) → tipo y tamaño → validación (422) → antispam (éxito
 * silencioso) → entrega. Sin LEAD_SINK=resend solo se registra que llegó una solicitud, sin datos personales.
 */
export async function POST(req: Request): Promise<Response> {
  const origin = req.headers.get("origin");
  if (!origin || origin !== new URL(req.url).origin)
    return json({ ok: false, error: "origen no permitido" }, 403);

  const rl = await rateLimit(`request:${clientIp(req)}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!rl.ok)
    return json({ ok: false, error: "demasiadas solicitudes" }, 429, {
      "Retry-After": String(rl.retryAfterSeconds),
    });

  let body: unknown;
  try {
    body = await readJsonLimited(req, 8 * 1024);
  } catch (e) {
    if (e instanceof BodyError) return json({ ok: false, error: e.message }, e.status);
    throw e;
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0] ?? "")))].filter(
      Boolean,
    );
    return json({ ok: false, error: "datos inválidos", fields }, 422);
  }
  const d = parsed.data;
  if (d.date && d.date < todayInSpain())
    return json({ ok: false, error: "datos inválidos", fields: ["date"] }, 422);
  if (d.website !== "" || Date.now() - d.t < MIN_FILL_MS) return json({ ok: true }, 202); // bot: éxito silencioso

  const { source, message } = requestMessage(d);
  try {
    await getLeadSink().deliver({
      name: cleanText(d.name, 80),
      email: cleanText(d.email, 254).toLowerCase(),
      message: cleanText(message, 2000),
      source,
    });
  } catch (e) {
    console.error("[request] no se pudo entregar", e instanceof Error ? e.message : "error");
    return json({ ok: false, error: "no se pudo enviar" }, 502);
  }
  return json({ ok: true }, 202);
}
