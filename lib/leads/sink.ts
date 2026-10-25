/**
 * Destino de los leads (formulario de contacto). Interfaz estable: los módulos (email-resend, CRM…) aportan implementaciones.
 * PII mínima: el sink por defecto NO escribe datos personales en los logs.
 */
export interface Lead {
  name: string;
  email: string;
  message: string;
  /** Origen de la captación (formulario, página) para medir conversión, sin datos personales. */
  source: string;
}

export interface LeadSink {
  readonly name: string;
  deliver(lead: Lead): Promise<void>;
}

/** Sink por defecto: registra SOLO que llegó un lead (sin PII). Sirve para desarrollo y como fallback explícito. */
export const logSink: LeadSink = {
  name: "log",
  async deliver(lead) {
    console.info(`[lead] recibido (source=${lead.source}, chars=${lead.message.length})`);
  },
};
