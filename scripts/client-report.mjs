#!/usr/bin/env node
// Informe de avance PARA EL CLIENTE, en lenguaje claro, generado desde el estado real del proyecto.
//   node client-report.mjs [--dir .] [--out docs/reports/AAAA-MM-DD.md] [--since 14] [--stdout]
// Fuentes (todas locales, sin red): PROJECT.md, PRODUCT.md, creative/manifest.json, git log, doctor (offline).
// Seguridad: NO lee .env, no incluye correos de autores, rutas absolutas ni valores de variables. Es un BORRADOR:
// una persona lo revisa y redacta "Entregado" y "Próximos pasos" antes de enviarlo.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontMatter } from './lib/detect.mjs';
import { findSecrets } from './lib/guard-rules.mjs';
import { readJson, readText, run, writeFileEnsured } from './lib/util.mjs';

const PHASES = [
  ['discovery', 'Descubrimiento y brief'],
  ['design', 'Dirección visual y arquitectura'],
  ['build', 'Construcción'],
  ['qa', 'Control de calidad'],
  ['staging', 'Revisión en entorno de pruebas'],
  ['production', 'Lanzamiento'],
  ['maintenance', 'Mantenimiento'],
];

/** Convierte un asunto de commit convencional en una frase legible para el cliente. */
export function humanizeCommit(subject) {
  const m = /^(feat|fix|docs|chore|refactor|perf|test|ci|style|build|content|media)(?:\([^)]*\))?!?:\s*(.+)$/i.exec(subject.trim());
  const kind = m?.[1]?.toLowerCase();
  const text = (m?.[2] ?? subject).replace(/\s+/g, ' ').trim();
  const label = { feat: 'Nuevo', fix: 'Corrección', perf: 'Mejora de rendimiento', content: 'Contenido', media: 'Imagen/video', docs: 'Documentación', test: 'Pruebas', ci: 'Automatización', refactor: 'Mejora interna', style: 'Estilo', build: 'Construcción', chore: 'Mantenimiento' }[kind ?? ''] ?? 'Cambio';
  return `${label}: ${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export function buildReport(s) {
  const idx = Math.max(0, PHASES.findIndex(([k]) => k === s.status));
  const bar = PHASES.map(([k, name], i) => `${i < idx ? '✅' : i === idx ? '🔵' : '⬜'} ${name}`).join('\n');
  const L = [];
  L.push(`# Informe de avance — ${s.client}`, '', `**Fecha:** ${s.date} · **Fase actual:** ${PHASES[idx][1]} · **Ritmo del proyecto:** ${s.duration}`, '');
  L.push('> Borrador generado automáticamente a partir del estado del proyecto. Revisar y completar antes de enviar.', '');
  L.push('## Dónde estamos', '', bar, '');
  L.push('## Lo que se ha hecho', '');
  L.push(...(s.commits.length ? s.commits.map((c) => `- ${c}`) : ['- _(sin cambios registrados en este periodo; completar a mano)_']), '');
  if (s.media.length) {
    L.push('## Imagen y video', '', '| Página | Decisión | Estado |', '|---|---|---|', ...s.media.map((m) => `| ${m.page} | ${m.type} | ${m.status === 'approved' ? 'Aprobado' : 'Pendiente de aprobación'} |`), '');
  }
  L.push('## Lo que necesitamos de ti', '');
  const asks = [];
  if (s.pendingClaims) asks.push(`Confirmar ${s.pendingClaims} afirmación(es) o dato(s) del mensaje que aún no tienen evidencia (cifras, testimonios, certificaciones).`);
  if (s.openBrief) asks.push(`Completar ${s.openBrief} campo(s) pendientes del brief.`);
  const pendingMedia = s.media.filter((m) => m.status !== 'approved').length;
  if (pendingMedia) asks.push(`Revisar y aprobar el material de imagen/video de ${pendingMedia} página(s).`);
  if (s.status === 'staging') asks.push('Revisar el sitio en el entorno de pruebas y darnos tu aprobación por escrito.');
  L.push(...(asks.length ? asks.map((a) => `- ${a}`) : ['- Nada pendiente por tu parte en este momento.']), '');
  L.push('## Calidad técnica', '');
  if (s.quality) {
    L.push(`- Comprobaciones automáticas: ${s.quality.ok} correctas${s.quality.failing ? `, **${s.quality.failing} requieren atención**` : ''}${s.quality.blocked ? `, ${s.quality.blocked} esperan una acción manual` : ''}.`);
    for (const n of s.quality.notes) L.push(`  - ${n}`);
  } else L.push('- _(No se pudo ejecutar la comprobación automática; ejecutar `npm run doctor`.)_');
  L.push('');
  L.push('## Próximos pasos', '', '- _(Completar: 1–3 acciones concretas con fecha estimada.)_', '');
  L.push('## Riesgos y decisiones', '', `- Lanzamiento a producción: requiere aprobación humana${s.prodApproval ? ` (vigente hasta ${s.prodApproval})` : ' (aún no concedida)'}.`, '- _(Añadir riesgos de plazo, contenido o dependencias de terceros.)_', '');
  return L.join('\n');
}

export function gather(dir, sinceDays = 14) {
  const pm = readText(path.join(dir, 'PROJECT.md'), '');
  const fm = parseFrontMatter(pm);
  const client = (/^#\s*PROJECT\s*[—-]\s*(.+)$/m.exec(pm)?.[1] ?? path.basename(path.resolve(dir))).trim();
  const log = run('git', ['log', `--since=${sinceDays}.days`, '--no-merges', '--pretty=format:%s'], { cwd: dir, timeout: 15000 });
  const commits = (log.ok ? log.stdout.split('\n') : [])
    .filter((x) => x.trim() && !/^(chore\(deps|Merge |Revert )/.test(x))
    .slice(0, 25)
    .map(humanizeCommit)
    .filter((c) => findSecrets(c).length === 0);
  const manifest = readJson(path.join(dir, 'creative', 'manifest.json'), { pages: [] });
  const product = readText(path.join(dir, 'PRODUCT.md'), '');
  const pendingClaims = (product.match(/\|\s*pendiente\s*\|/gi) ?? []).length;
  const openBrief = ['PRODUCT.md', 'PROJECT.md', 'DESIGN.md'].reduce((n, f) => n + (readText(path.join(dir, f), '').match(/\{\{[A-Z0-9_]+\}\}/g) ?? []).length, 0);

  let quality = null;
  const doctor = path.join(dir, 'scripts', 'doctor.mjs');
  if (fs.existsSync(doctor)) {
    const r = run(process.execPath, [doctor, '--json', '--offline', '--no-state', '--scope', 'project'], { cwd: dir, timeout: 60000 });
    try {
      const j = JSON.parse(r.stdout);
      const failing = j.results.filter((x) => ['MISSING', 'MISCONFIGURED', 'OUTDATED'].includes(x.status) && x.requirement === 'required');
      quality = { ok: j.counts.OK ?? 0, failing: failing.length, blocked: j.counts.BLOCKED ?? 0, notes: failing.slice(0, 4).map((f) => f.component) };
    } catch {
      /* sin doctor utilizable */
    }
  }
  const approval = readJson(path.join(dir, '.web-os', 'approvals', 'production.json'));
  return {
    client, date: new Date().toISOString().slice(0, 10), status: fm.status ?? 'discovery', duration: fm.duration ?? '—',
    commits, media: (manifest.pages ?? []).map((p) => ({ page: p.page, type: p.type, status: p.status })), pendingClaims, openBrief, quality,
    prodApproval: approval?.expires_at && Date.parse(approval.expires_at) > Date.now() ? approval.expires_at.slice(0, 10) : null,
  };
}

function main() {
  const argv = process.argv.slice(2);
  const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
  const dir = path.resolve(opt('--dir', '.'));
  if (!fs.existsSync(path.join(dir, 'PROJECT.md'))) {
    console.error(`✗ ${dir} no es un proyecto web-os (falta PROJECT.md)`);
    process.exit(2);
  }
  const md = buildReport(gather(dir, Number(opt('--since', 14))));
  if (argv.includes('--stdout')) return process.stdout.write(md);
  const out = path.resolve(dir, opt('--out', path.join('docs', 'reports', `${new Date().toISOString().slice(0, 10)}.md`)));
  writeFileEnsured(out, md);
  console.log(`✓ informe (borrador) en ${path.relative(dir, out)} — revísalo y complétalo antes de enviarlo al cliente`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
