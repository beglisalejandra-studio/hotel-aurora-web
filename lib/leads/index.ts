import { serverEnv } from "@/lib/env.server";
import { logSink, type LeadSink } from "@/lib/leads/sink";

/**
 * Selecciona el destino según LEAD_SINK. El módulo `email-resend` REEMPLAZA este archivo para registrar su sink.
 * Mientras no haya un sink real configurado, se usa `log` (sin PII) y el formulario debe avisar al responsable.
 */
export function getLeadSink(): LeadSink {
  const choice = serverEnv().LEAD_SINK;
  if (choice !== "log") {
    console.warn(
      `[lead] LEAD_SINK=${choice} no tiene implementación en este proyecto; usando 'log'`,
    );
  }
  return logSink;
}
