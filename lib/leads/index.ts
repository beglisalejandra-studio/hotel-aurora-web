import { serverEnv } from "@/lib/env.server";
import { logSink, type LeadSink } from "@/lib/leads/sink";
import { resendSink } from "@/lib/leads/sinks/resend";

/** Selecciona el destino según LEAD_SINK (módulo email-resend). `log` es el respaldo explícito, sin PII. */
export function getLeadSink(): LeadSink {
  return serverEnv().LEAD_SINK === "resend" ? resendSink : logSink;
}
