import "server-only";
import { Resend } from "resend";
import { z } from "zod";
import { buildLeadEmail } from "@/lib/email/lead-email";
import type { Lead } from "@/lib/leads/sink";

const envSchema = z.object({
  RESEND_API_KEY: z.string().startsWith("re_", "RESEND_API_KEY debe empezar por re_"),
  LEAD_NOTIFY_TO: z.email(),
  LEAD_NOTIFY_FROM: z.string().min(3),
});

let client: Resend | undefined;

function config() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // Solo nombres de variable: nunca valores.
    throw new Error(
      `Configuración de email incompleta → ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`,
    );
  }
  return parsed.data;
}

export async function sendLeadEmail(lead: Lead): Promise<void> {
  const env = config();
  client ??= new Resend(env.RESEND_API_KEY);
  const mail = buildLeadEmail(lead);
  const { error } = await client.emails.send({
    from: env.LEAD_NOTIFY_FROM,
    to: env.LEAD_NOTIFY_TO,
    ...mail,
  });
  if (error) throw new Error(`Resend rechazó el envío (${error.name})`); // sin volcar el contenido del lead
}
