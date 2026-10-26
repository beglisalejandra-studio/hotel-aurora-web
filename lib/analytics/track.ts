import type { Consent } from "@/lib/analytics/consent";
import { DEFAULT_CONSENT } from "@/lib/analytics/consent";
import {
  ALWAYS_ALLOWED,
  EVENTS_SCHEMA_VERSION,
  MARKETING_EVENTS,
  eventCatalog,
  type EventName,
  type EventParams,
} from "@/lib/analytics/events";

/** Un adaptador envía el evento a un proveedor (GTM/dataLayer, Plausible, Meta…). El módulo analytics-consent aporta los reales. */
export interface AnalyticsEvent<N extends EventName = EventName> {
  name: N;
  params: EventParams<N>;
  /** Id único por evento: permite DEDUPLICAR cliente/servidor (p. ej. Meta Pixel + Conversions API). */
  event_id: string;
  schema_version: typeof EVENTS_SCHEMA_VERSION;
}
export type Adapter = (e: AnalyticsEvent) => void;

const adapters = new Set<Adapter>();
const seen = new Set<string>();

export function registerAdapter(a: Adapter): () => void {
  adapters.add(a);
  return () => adapters.delete(a);
}

let consentProvider: () => Consent = () => DEFAULT_CONSENT;
export function setConsentProvider(fn: () => Consent): void {
  consentProvider = fn;
}

function newId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  );
}

/**
 * Registra un evento. Devuelve true si se despachó.
 * Se descarta (false) si: los parámetros no cumplen el esquema · no hay consentimiento · el event_id ya se vio.
 */
export function track<N extends EventName>(
  name: N,
  params: EventParams<N>,
  opts: { eventId?: string } = {},
): boolean {
  const parsed = eventCatalog[name].safeParse(params);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production")
      console.warn(`[analytics] ${name}: parámetros inválidos`, parsed.error.issues);
    return false;
  }
  if (!ALWAYS_ALLOWED.has(name)) {
    const c = consentProvider();
    const allowed = MARKETING_EVENTS.has(name) ? c.marketing : c.analytics;
    if (!allowed) return false;
  }
  const event_id = opts.eventId ?? newId();
  if (seen.has(event_id)) return false;
  seen.add(event_id);
  const evt = {
    name,
    params: parsed.data as EventParams<N>,
    event_id,
    schema_version: EVENTS_SCHEMA_VERSION,
  } satisfies AnalyticsEvent<N>;
  for (const a of adapters) {
    try {
      a(evt as AnalyticsEvent);
    } catch {
      /* un proveedor roto no debe romper la página */
    }
  }
  return true;
}

/** Solo para pruebas. */
export function __resetAnalyticsForTests(): void {
  adapters.clear();
  seen.clear();
  consentProvider = () => DEFAULT_CONSENT;
}
