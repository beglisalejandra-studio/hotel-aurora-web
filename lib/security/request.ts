/** Utilidades para route handlers: IP, verificación de origen y lectura de JSON con límite de tamaño. */

/**
 * IP del cliente. Confía en `x-forwarded-for` SOLO si el despliegue está detrás de un proxy de confianza
 * (Vercel, Cloudflare, etc.). En un servidor expuesto directamente, esta cabecera la controla el atacante.
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || req.headers.get("x-real-ip") || "unknown";
}

/** Defensa CSRF básica para peticiones JSON que modifican estado: el Origin debe coincidir con el sitio. */
export function isSameOrigin(req: Request, siteUrl: string): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false; // los navegadores envían Origin en POST cross/same-origin; su ausencia es sospechosa
  try {
    return new URL(origin).origin === new URL(siteUrl).origin;
  } catch {
    return false;
  }
}

export class BodyError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 413 | 415,
  ) {
    super(message);
  }
}

/** Lee JSON con tope de bytes (defensa contra cuerpos enormes). */
export async function readJsonLimited(req: Request, maxBytes = 16 * 1024): Promise<unknown> {
  const type = req.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json"))
    throw new BodyError("Content-Type debe ser application/json", 415);
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > maxBytes) throw new BodyError("Cuerpo demasiado grande", 413);
  const text = await req.text();
  if (new TextEncoder().encode(text).length > maxBytes)
    throw new BodyError("Cuerpo demasiado grande", 413);
  try {
    return JSON.parse(text);
  } catch {
    throw new BodyError("JSON inválido", 400);
  }
}

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}
