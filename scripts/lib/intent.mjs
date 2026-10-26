// Análisis del prompt del usuario: intención web, modo (automático / explicativo) y secretos pegados.
import { findSecrets } from './guard-rules.mjs';

const WEB_INTENT =
  /(?:\blanding\b|sitio(?:s)? web|p[aá]gina(?:s)? web|\bwebsite\b|web ?site|rediseñ|redesign|\bfrontend\b|front-end|next\.?js|\bfigma\b|tailwind|\bseo\b|lighthouse|formulario web|\bcheckout\b|meta pixel|\bcms\b|hero (?:video|image|section)|v[ií]deo hero|v[ií]deo (?:de )?fondo|\bcta\b|conversi[oó]n|\/init-client|\/web-)/i;

const EXPLAIN_MODE = /(?:expl[ií]came|\bpaso a paso\b|step[- ]by[- ]step|explain (?:it|this|me|step)|ens[eé]ñame)/i;

export function analyzePrompt(text) {
  const t = String(text ?? '');
  return {
    webIntent: WEB_INTENT.test(t),
    mode: EXPLAIN_MODE.test(t) ? 'explain' : 'auto',
    secrets: findSecrets(t),
  };
}

/** Texto de contexto que se inyecta al modelo (corto: cada token cuesta en todos los turnos). */
export function buildPromptContext(analysis, project) {
  const lines = [];
  if (analysis.secrets.length) {
    lines.push(
      `⚠ SEGURIDAD: el mensaje del usuario parece contener un secreto (${analysis.secrets.join(', ')}). ` +
        'No lo copies a archivos, commits ni logs. Indica al usuario que lo ROTE/REVOQUE y lo guarde en el gestor de secretos del entorno.',
    );
  }
  if (analysis.webIntent) {
    const kind = project?.kind ?? 'none';
    lines.push(
      `[web-os] Intención web detectada. Proyecto: ${kind}. Invoca la skill \`web-workflow\` (router) antes de actuar. ` +
        `Modo: ${analysis.mode === 'explain' ? 'EXPLICATIVO (explica cada decisión paso a paso y espera confirmación en hitos)' : 'AUTOMÁTICO (ejecuta; informa solo bloqueos y próximos pasos)'}.`,
    );
  }
  return lines.join('\n');
}
