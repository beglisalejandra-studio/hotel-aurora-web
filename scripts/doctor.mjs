#!/usr/bin/env node
// npm run doctor — audita el entorno y el proyecto.
// Estados: OK · MISSING · MISCONFIGURED · BLOCKED · OPTIONAL · OUTDATED
// Códigos de salida: 0 = sin fallos requeridos · 1 = hay MISSING/MISCONFIGURED/OUTDATED requeridos · 2 = solo acciones manuales (BLOCKED) con --strict
import fs from 'node:fs';
import path from 'node:path';
import { selectChecks } from './lib/checks.mjs';
import { detectProject } from './lib/detect.mjs';
import { STATUS as S, webOsHome, writeFileEnsured } from './lib/util.mjs';

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : null;
};

if (flag('--help') || flag('-h')) {
  console.log(`Uso: node scripts/doctor.mjs [opciones]
  --json            salida JSON
  --scope <s>       global | project | all (por defecto: automático según el directorio)
  --offline         no hace llamadas de red
  --only <ids>      ids separados por coma (ver --json)
  --strict          exit 2 si queda alguna acción manual (BLOCKED)
  --no-state        no escribe state/last-doctor.json`);
  process.exit(0);
}

const cwd = process.cwd();
const project = detectProject(cwd);
const autoScope = ['none', 'system'].includes(project.kind) ? 'global' : 'all';
const ctx = {
  cwd,
  scope: opt('--scope') ?? autoScope,
  online: !flag('--offline'),
  only: opt('--only')?.split(',').filter(Boolean) ?? null,
  project,
};

const checks = selectChecks(ctx);
const results = [];
for (const c of checks) {
  let r;
  try {
    r = await c.run(ctx);
  } catch (e) {
    r = { status: S.MISCONFIGURED, detail: `el check falló: ${e.message}` };
  }
  results.push({ id: c.id, component: c.component, scope: c.scope, requirement: c.requirement, phase: c.phase, version: null, detail: '', action: '', ...r });
}

const counts = Object.fromEntries(Object.values(S).map((k) => [k, results.filter((r) => r.status === k).length]));
const failing = results.filter((r) => [S.MISSING, S.MISCONFIGURED, S.OUTDATED].includes(r.status) && r.requirement === 'required');
const blocked = results.filter((r) => r.status === S.BLOCKED);
const summary = { at: new Date().toISOString(), cwd, projectKind: project.kind, scope: ctx.scope, counts, blocked: blocked.map((b) => b.component), failing: failing.map((f) => f.id) };

if (!flag('--no-state')) {
  try {
    const home = webOsHome();
    if (fs.existsSync(home)) writeFileEnsured(path.join(home, 'state', 'last-doctor.json'), JSON.stringify(summary, null, 2));
  } catch { /* el estado es una comodidad, no un requisito */ }
}

if (flag('--json')) {
  console.log(JSON.stringify({ ...summary, results }, null, 2));
} else {
  const tty = process.stdout.isTTY && !process.env.NO_COLOR;
  const col = { OK: '32', MISSING: '31', MISCONFIGURED: '31', BLOCKED: '33', OPTIONAL: '90', OUTDATED: '33' };
  const paint = (s, st) => (tty ? `\x1b[${col[st]}m${s}\x1b[0m` : s);
  const w = { c: 40, s: 14, v: 11, a: 9 };
  console.log(`\nweb-os doctor · proyecto: ${project.kind} · alcance: ${ctx.scope}${ctx.online ? '' : ' · offline'}\n`);
  console.log(['COMPONENTE'.padEnd(w.c), 'ESTADO'.padEnd(w.s), 'VERSIÓN'.padEnd(w.v), 'ALCANCE'.padEnd(w.a), 'DETALLE / ACCIÓN'].join(' '));
  console.log('-'.repeat(118));
  for (const r of results) {
    const extra = [r.detail, r.action && `→ ${r.action}`].filter(Boolean).join('  ');
    console.log([r.component.slice(0, w.c - 1).padEnd(w.c), paint(r.status.padEnd(w.s), r.status), String(r.version ?? '').slice(0, w.v - 1).padEnd(w.v), r.scope.padEnd(w.a), extra].join(' '));
  }
  console.log('\nResumen: ' + Object.entries(counts).filter(([, n]) => n).map(([k, n]) => `${n} ${k}`).join(' · '));
  if (failing.length) console.log(`Fallos requeridos (${failing.length}): ${failing.map((f) => f.id).join(', ')}`);
  if (blocked.length) console.log(`Acciones MANUALES pendientes (${blocked.length}): ${blocked.map((b) => b.component).join(' · ')}`);
  console.log('');
}

process.exit(failing.length ? 1 : flag('--strict') && blocked.length ? 2 : 0);
