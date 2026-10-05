import "@/lib/zod-config";
import { z } from "zod";

/**
 * Catálogo de eventos VERSIONADO. Cambiar un evento = subir EVENTS_SCHEMA_VERSION y anotarlo en docs/privacy/data-map.md.
 * Reglas: nombres estables · parámetros `.strict()` (un parámetro desconocido se rechaza: así no se cuela PII)
 * · nunca correo, teléfono, nombre, dirección IP ni texto libre del usuario.
 */
export const EVENTS_SCHEMA_VERSION = 1 as const;

const id = z
  .string()
  .min(1)
  .max(60)
  .regex(/^[a-z0-9_.:-]+$/i);

export const eventCatalog = {
  cta_click: z.object({ cta_id: id, location: id.optional() }).strict(),
  form_start: z.object({ form_id: id }).strict(),
  form_submit: z.object({ form_id: id, success: z.boolean() }).strict(),
  checkout_start: z
    .object({ currency: z.string().length(3), value: z.number().nonnegative() })
    .strict(),
  purchase: z
    .object({ currency: z.string().length(3), value: z.number().nonnegative(), transaction_id: id })
    .strict(),
  booking: z.object({ service_id: id }).strict(),
  download: z.object({ file_id: id }).strict(),
  error: z.object({ code: id, where: id.optional() }).strict(),
  consent_update: z.object({ analytics: z.boolean(), marketing: z.boolean() }).strict(),
} as const;

export type EventName = keyof typeof eventCatalog;
export type EventParams<N extends EventName> = z.infer<(typeof eventCatalog)[N]>;

/** Eventos que requieren consentimiento de marketing (los demás, de analítica). `consent_update` se envía siempre. */
export const MARKETING_EVENTS: ReadonlySet<EventName> = new Set(["checkout_start", "purchase"]);
export const ALWAYS_ALLOWED: ReadonlySet<EventName> = new Set(["consent_update"]);
