#!/usr/bin/env node
// Puerta de auditoría de dependencias con excepciones documentadas y con caducidad (ver lib/audit-gate.mjs).
//   node audit-gate.mjs [--threshold high] [--exceptions config/audit-exceptions.json] [--json]
// Salida: 0 = sin avisos nuevos · 1 = hay avisos sin excepción vigente · 2 = no se pudo auditar (falla cerrado).
import fs from 'node:fs';
import path from 'node:path';
import { evaluateAudit } from './lib/audit-gate.mjs';
import { run } from './lib/util.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const threshold = opt('--threshold', 'high');
const exFile = path.resolve(opt('--exceptions', 'config/audit-exceptions.json'));

const audit = (args) => {
  const r = run('npm', ['audit', '--json', ...args], { timeout: 120000 });
  try {
    const j = JSON.parse(r.stdout);
    if (j.error) throw new Error(j.error.summary || j.error.code);
    return j;
  } catch (e) {
    console.error(`✗ No se pudo ejecutar npm audit (${e.message}). Sin red o sin package-lock.json. La puerta falla cerrado.`);
    process.exit(2);
  }
};

let exceptions = [];
if (fs.existsSync(exFile)) {
  try {
    exceptions = JSON.parse(fs.readFileSync(exFile, 'utf8')).exceptions ?? [];
  } catch (e) {
    console.error(`✗ ${path.relative(process.cwd(), exFile)} no es JSON válido: ${e.message}`);
    process.exit(2);
  }
}

let res;
try {
  res = evaluateAudit({ all: audit([]), prod: audit(['--omit=dev']), exceptions, threshold });
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(2);
}

if (argv.includes('--json')) console.log(JSON.stringify(res, null, 2));
else {
  console.log(`Auditoría (umbral ${threshold}): ${res.summary.total} aviso(s) · ${res.summary.production} en producción`);
  for (const a of res.accepted) console.log(`  ✓ aceptado: ${a}`);
  for (const w of res.warnings) console.log(`  ⚠ ${w}`);
  for (const f of res.failures) console.log(`  ✗ ${f}`);
  console.log(res.ok ? '✓ Sin avisos nuevos.' : `✗ ${res.failures.length} problema(s). Corrige la dependencia o documenta una excepción con motivo y caducidad en config/audit-exceptions.json.`);
}
process.exit(res.ok ? 0 : 1);
