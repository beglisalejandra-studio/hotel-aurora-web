#!/usr/bin/env node
// Intake de un prototipo de Replit (exportado o checkout de la rama proto/replit-*). Replit NUNCA es fuente de verdad.
//   node replit-intake.mjs <carpeta> [--report creative/replit-intake.md] [--stage <carpeta-cuarentena>]
// Clasifica: EXCLUIDO (artefactos de Replit) · BLOQUEADO (secretos/.env) · REVISAR (scripts de instalación, código de riesgo,
// referencias a hosts de Replit) · ACEPTABLE. Nunca imprime valores de secretos. exit 1 si hay bloqueos.
// --stage copia SOLO lo aceptable a una carpeta de cuarentena (nunca a la raíz del proyecto); reimplementa en una rama normal.
import fs from 'node:fs';
import path from 'node:path';
import { findSecrets } from './lib/guard-rules.mjs';
import { isSecretEnvFile } from './lib/guard-rules.mjs';
import { walk, writeFileEnsured } from './lib/util.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const dir = argv.find((a) => !a.startsWith('--') && a !== opt('--report') && a !== opt('--stage'));
if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
  console.error('Uso: node replit-intake.mjs <carpeta-del-prototipo> [--report archivo.md] [--stage carpeta]');
  process.exit(2);
}

const REPLIT_ARTIFACTS = [
  /^\.replit$/, /^replit\.nix$/, /^replit\.md$/, /^\.replitignore$/, /^\.upm\//, /^\.config\//, /^\.breakpoints$/, /^\.cache\//,
  /^\.local\//, /^\.pythonlibs\//, /^replit_zip_error_log\.txt$/, /^generated-icon\.png$/, /^\.agent\//, /^\.vscode\/replit/,
];
const REVIEW_ASSETS = /^attached_assets\//; // adjuntos de Replit: licencia/origen desconocidos
const REPLIT_HOST = /\b[\w-]+\.(?:repl\.co|replit\.dev|replit\.app|repl\.run)\b/g;
const RISKY_CODE = [
  [/\beval\s*\(/, 'eval()'], [/\bnew Function\s*\(/, 'new Function()'], [/dangerouslySetInnerHTML/, 'dangerouslySetInnerHTML (riesgo XSS)'],
  [/document\.write\s*\(/, 'document.write'], [/\bchild_process\b/, 'child_process'], [/NEXT_PUBLIC_[A-Z_]*(?:SECRET|PRIVATE|TOKEN|KEY)\b/, 'secreto expuesto como NEXT_PUBLIC_*'],
];
const SKIP_DIRS = /(^|\/)(node_modules|\.git|\.next|dist|build|\.venv|__pycache__)(\/|$)/;
const TEXT = /\.(?:[cm]?[jt]sx?|json|md|html?|css|scss|ya?ml|toml|txt|env[\w.-]*|svg|py|sh|vue|svelte|astro|xml)$/i;

const r = { excluded: [], blocked: [], review: [], acceptable: [], deps: null, scripts: [] };
const files = walk(dir, { ignore: ['node_modules', '.git', '.next', 'dist', 'build'] });

for (const rel of files) {
  if (SKIP_DIRS.test(rel)) continue;
  const abs = path.join(dir, rel);
  if (REPLIT_ARTIFACTS.some((re) => re.test(rel))) {
    r.excluded.push(rel);
    continue;
  }
  if (isSecretEnvFile(rel)) {
    r.blocked.push({ file: rel, why: 'archivo .env real (secretos) — no se lee ni se acepta' });
    continue;
  }
  let text = '';
  if (TEXT.test(rel) && fs.statSync(abs).size < 1_500_000) text = fs.readFileSync(abs, 'utf8');
  const secrets = findSecrets(text);
  if (secrets.length) {
    r.blocked.push({ file: rel, why: `posible secreto (${secrets.join(', ')}) — valor NO mostrado; rotar esa credencial` });
    continue;
  }
  const notes = [];
  if (REVIEW_ASSETS.test(rel)) notes.push('adjunto de Replit: confirmar origen y licencia');
  for (const [re, label] of RISKY_CODE) if (re.test(text)) notes.push(label);
  const hosts = [...new Set(text.match(REPLIT_HOST) ?? [])];
  if (hosts.length) notes.push(`referencia a hosts de Replit (${hosts.slice(0, 2).join(', ')}): eliminar`);
  if (rel === 'package.json' || rel.endsWith('/package.json')) {
    try {
      const pkg = JSON.parse(text);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      r.deps = { file: rel, count: Object.keys(deps).length, names: Object.keys(deps).sort() };
      for (const k of ['preinstall', 'install', 'postinstall', 'prepare']) if (pkg.scripts?.[k]) r.scripts.push(`${rel}: scripts.${k} = ${pkg.scripts[k]}`);
      const odd = Object.entries(deps).filter(([, v]) => /^(?:git|https?:|file:|github:)/.test(String(v)));
      for (const [n, v] of odd) notes.push(`dependencia no registrada (${n}: ${String(v).slice(0, 40)})`);
    } catch {
      notes.push('package.json no es JSON válido');
    }
  }
  (notes.length ? r.review : r.acceptable).push(notes.length ? { file: rel, notes } : rel);
}
if (r.scripts.length) r.review.push({ file: '(scripts de instalación)', notes: r.scripts });

const lines = [];
lines.push('# Informe de intake de Replit', '', `Origen: \`${dir}\` · ${new Date().toISOString()}`, '',
  '> Replit NO es fuente de verdad. Esto es un insumo desechable: se reimplementa en una rama normal del repo canónico, con tests y QA.', '');
lines.push(`## Resumen`, '', `- Bloqueados (secretos): **${r.blocked.length}**`, `- Excluidos (artefactos de Replit): ${r.excluded.length}`, `- A revisar: ${r.review.length}`, `- Aceptables: ${r.acceptable.length}`, '');
if (r.blocked.length) lines.push('## ⛔ BLOQUEADOS', '', ...r.blocked.map((b) => `- \`${b.file}\` — ${b.why}`), '', '**Acción:** rotar esas credenciales ANTES de continuar; limpiar el prototipo y repetir el intake.', '');
if (r.review.length) lines.push('## ⚠ A revisar', '', ...r.review.flatMap((x) => [`- \`${x.file}\``, ...x.notes.map((n) => `  - ${n}`)]), '');
if (r.deps) lines.push('## Dependencias declaradas', '', `\`${r.deps.file}\`: ${r.deps.count} — revisar licencia, mantenimiento y scripts de instalación de cada una (proceso de auditoría de terceros).`, '', r.deps.names.map((n) => `\`${n}\``).join(', '), '');
if (r.excluded.length) lines.push('## Excluidos (no entran al repo canónico)', '', ...r.excluded.slice(0, 40).map((f) => `- \`${f}\``), r.excluded.length > 40 ? `- … y ${r.excluded.length - 40} más` : '', '');
lines.push('## Aceptables (tras revisión humana)', '', ...r.acceptable.slice(0, 80).map((f) => `- \`${f}\``), r.acceptable.length > 80 ? `- … y ${r.acceptable.length - 80} más` : '', '');
lines.push('## Siguiente paso', '', '1. Resolver bloqueos. 2. Revisar “A revisar”. 3. `--stage <carpeta>` copia solo lo aceptable a cuarentena. 4. Reimplementar en una rama `feat/…` con tests; **nunca** hacer merge del `main` de Replit.');
const report = lines.join('\n') + '\n';

const out = opt('--report');
if (out) writeFileEnsured(out, report);
else process.stdout.write(report);

const stage = opt('--stage');
if (stage) {
  if (r.blocked.length) {
    console.error(`✗ --stage rechazado: hay ${r.blocked.length} bloqueo(s) de secretos. Resuélvelos primero.`);
    process.exit(1);
  }
  if (fs.existsSync(stage) && fs.readdirSync(stage).length) {
    console.error(`✗ --stage: ${stage} no está vacío (no se sobrescribe nada).`);
    process.exit(2);
  }
  const ok = [...r.acceptable, ...r.review.filter((x) => !x.file.startsWith('('))].map((x) => (typeof x === 'string' ? x : x.file));
  for (const rel of ok) {
    const to = path.join(stage, rel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(dir, rel), to);
  }
  console.error(`✓ ${ok.length} archivo(s) copiados a cuarentena ${stage} (los marcados “a revisar” incluidos: NO integrar sin revisar).`);
}
console.error(`${r.blocked.length ? '✗' : '✓'} bloqueados ${r.blocked.length} · excluidos ${r.excluded.length} · a revisar ${r.review.length} · aceptables ${r.acceptable.length}${out ? ` → ${out}` : ''}`);
process.exit(r.blocked.length ? 1 : 0);
