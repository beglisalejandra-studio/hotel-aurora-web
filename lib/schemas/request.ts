import "@/lib/zod-config";
import { z } from "zod";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Solicitud de mesa, cita de spa o bono. Esquema único: el servidor manda (la validación del navegador es ayuda). */
export const requestSchema = z
  .object({
    kind: z.enum(["table", "spa", "voucher"]),
    lang: z.enum(["es", "en"]).default("es"),
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().max(254).pipe(z.email()),
    phone: z
      .string()
      .trim()
      .max(30)
      .regex(/^[+\d\s().-]*$/)
      .optional()
      .default(""),
    date: z.string().regex(ISO_DATE).optional(),
    quantity: z.number().int().min(1).max(12).optional(),
    treatment: z.string().trim().max(120).optional(),
    offer: z.string().trim().max(120).optional(),
    note: z.string().trim().max(1000).optional().default(""),
    /** Consentimiento explícito (casilla no premarcada). */
    consent: z.literal(true),
    /** Campo trampa: los humanos no lo ven. */
    website: z.string().max(200).optional().default(""),
    /** Cuándo se abrió el formulario (ms): un envío instantáneo es de un bot. */
    t: z.number().int().nonnegative(),
  })
  .refine((d) => d.kind === "voucher" || Boolean(d.date), {
    path: ["date"],
    message: "Falta la fecha",
  });

export type RequestInput = z.infer<typeof requestSchema>;

/** Hoy en la zona horaria del hotel (Europe/Madrid), como AAAA-MM-DD. */
export function todayInSpain(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(now);
}

const KIND = { table: "Mesa en el restaurante", spa: "Cita en el spa", voucher: "Bono" } as const;

/** Texto de la notificación al hotel (sin HTML: el correo lo escapa al construirse). */
export function requestMessage(d: RequestInput): { source: string; message: string } {
  const lines = [
    `Tipo: ${KIND[d.kind]}`,
    d.offer ? `Paquete: ${d.offer}` : "",
    d.date ? `Fecha: ${d.date}` : "",
    d.quantity ? `${d.kind === "table" ? "Comensales" : "Cantidad"}: ${d.quantity}` : "",
    d.treatment ? `Tratamiento: ${d.treatment}` : "",
    d.phone ? `Teléfono: ${d.phone}` : "",
    `Idioma: ${d.lang === "es" ? "español" : "inglés"}`,
    d.note ? `\nComentarios:\n${d.note}` : "",
  ].filter(Boolean);
  return { source: `solicitud-${d.kind}`, message: lines.join("\n") };
}
