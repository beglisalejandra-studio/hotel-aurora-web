import type { Lead } from "@/lib/leads/sink";
import { escapeHtml, singleLine } from "@/lib/security/sanitize";

/** Construye el correo de notificación de un lead. Puro y testeable: todo dato de usuario se escapa / aplana. */
export function buildLeadEmail(lead: Lead): {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
} {
  const subject = singleLine(`Nuevo contacto (${lead.source})`).slice(0, 120);
  const text = `Nombre: ${singleLine(lead.name)}\nCorreo: ${singleLine(lead.email)}\nOrigen: ${singleLine(lead.source)}\n\n${lead.message}`;
  const html =
    `<p><strong>Nombre:</strong> ${escapeHtml(lead.name)}<br>` +
    `<strong>Correo:</strong> ${escapeHtml(lead.email)}<br>` +
    `<strong>Origen:</strong> ${escapeHtml(lead.source)}</p>` +
    `<p style="white-space:pre-wrap">${escapeHtml(lead.message)}</p>`;
  return { subject, text, html, replyTo: singleLine(lead.email) };
}
