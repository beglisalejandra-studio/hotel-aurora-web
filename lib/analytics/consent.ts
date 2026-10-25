/**
 * Consentimiento de cookies/analítica. Lógica pura (sin DOM) para poder probarla.
 * Cookie `consent` (SameSite=Lax; Secure en HTTPS; 6 meses). Las categorías no esenciales parten SIEMPRE en `false`.
 */
export const CONSENT_COOKIE = "consent";
export const CONSENT_VERSION = 1;
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export interface Consent {
  v: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export const DEFAULT_CONSENT: Consent = {
  v: CONSENT_VERSION,
  necessary: true,
  analytics: false,
  marketing: false,
};

export function serializeConsent(
  c: Pick<Consent, "analytics" | "marketing">,
  secure = true,
): string {
  const value = encodeURIComponent(
    JSON.stringify({
      v: CONSENT_VERSION,
      necessary: true,
      analytics: c.analytics,
      marketing: c.marketing,
    }),
  );
  return `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

/** Devuelve el consentimiento guardado o el DEFAULT (todo denegado) si falta, está corrupto o es de otra versión. */
export function parseConsent(cookieHeader: string | null | undefined): Consent {
  if (!cookieHeader) return DEFAULT_CONSENT;
  const raw = cookieHeader
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1);
  if (!raw) return DEFAULT_CONSENT;
  try {
    const o = JSON.parse(decodeURIComponent(raw)) as Partial<Consent>;
    if (o.v !== CONSENT_VERSION) return DEFAULT_CONSENT; // nueva versión de la política ⇒ volver a preguntar
    return {
      v: CONSENT_VERSION,
      necessary: true,
      analytics: o.analytics === true,
      marketing: o.marketing === true,
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

export function hasDecided(cookieHeader: string | null | undefined): boolean {
  return Boolean(cookieHeader && new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=`).test(cookieHeader));
}
