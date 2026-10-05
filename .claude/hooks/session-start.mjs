#!/usr/bin/env node
// SessionStart: detecta el tipo de proyecto y entrega un banner CORTO (cada token cuesta en todos los turnos).
// Silencioso si el directorio no es un proyecto web.
import { emit, failOpen, lib, once, readStdin } from './_load.mjs';

try {
  const input = await readStdin();
  if (!once(input.session_id && `session-start:${input.session_id}`)) process.exit(0);
  const { detectProject, lastDoctor } = await lib('detect.mjs');
  const { webOsHome } = await lib('util.mjs');
  const cwd = input.cwd || process.cwd();
  const p = detectProject(cwd);
  if (p.kind === 'none') process.exit(0);

  const fm = p.frontMatter ?? {};
  const L = [];
  switch (p.kind) {
    case 'system':
      L.push('[web-os] Repo del SISTEMA (configuración). Fase de configuración: NO construir sitios de cliente. Verifica con `npm run verify`.');
      break;
    case 'new':
      L.push(`[web-os] Proyecto NUEVO (status: ${fm.status ?? 'discovery'}). Lee CLAUDE.md y PROJECT.md; completa PRODUCT.md con /web-brief.`);
      break;
    case 'existing':
      L.push(`[web-os] Proyecto EXISTENTE (status: ${fm.status ?? '?'}, stack: ${fm.stack ?? '?'}, hosting: ${fm.hosting ?? '?'}, autoridad visual: ${fm.visual_authority ?? 'sin declarar'}). Lee PRODUCT.md, DESIGN.md, PROJECT.md y CLAUDE.md antes de actuar. Rama + PR.`);
      break;
    case 'redesign':
      L.push('[web-os] REDISEÑO: el sitio vivo NO se toca; construye en paralelo y valida en preview. Identifica el punto de partida (sin sitio, solo dominio/hosting, plataforma como WordPress o Shopify, integraciones), inventario de lo existente primero, conserva pagos y reservas, pide materiales de marca en creative/brand/, rama + PR. Asume todo el proceso sin que te lo pidan (skill web-workflow §3-4).');
      break;
    case 'maintenance':
      L.push('[web-os] MANTENIMIENTO: cambios mínimos, sin rediseño, sin romper eventos de analítica. Rama + PR.');
      break;
    case 'unmanaged':
      L.push('[web-os] Web existente SIN sistema (faltan PROJECT.md/PRODUCT.md/DESIGN.md). Propón `/init-client --adopt` antes de tocar nada.');
      break;
  }
  if (p.kind !== 'system' && p.missingDocs.length) L.push(`Faltan documentos: ${p.missingDocs.join(', ')}.`);
  if (p.placeholders) L.push('PROJECT.md aún tiene {{PLACEHOLDERS}} sin completar.');

  const d = lastDoctor(webOsHome());
  if (!d) L.push('Doctor: nunca ejecutado → `npm run doctor`.');
  else if (d.blocked?.length) L.push(`Doctor: ${d.blocked.length} acción(es) manual(es) pendiente(s): ${d.blocked.slice(0, 3).join(', ')}.`);

  // Aviso de revisión mensual del sistema (se apaga al fusionar el informe del mes). WEB_OS_NO_NUDGE=1 lo desactiva.
  if (!process.env.WEB_OS_NO_NUDGE) {
    const { reviewNudge } = await lib('update-facts.mjs');
    const { resolveAsset, readJson } = await lib('util.mjs');
    const cadence = readJson(resolveAsset('config', 'research-topics.json'), {}).cadenceDays ?? 30;
    const nudge = reviewNudge(resolveAsset('docs', 'research'), { cadenceDays: cadence });
    if (nudge) L.push(nudge);
  }

  emit({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: L.join('\n') } });
} catch (e) {
  failOpen(e);
}
