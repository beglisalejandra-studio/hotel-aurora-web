#!/usr/bin/env node
// Verificación de entrega sobre una URL publicada (preview o producción).
//   node scripts/launch-check.mjs https://sitio.com [--redirects docs/seo/redirects.txt] [--json]
// redirects.txt: una línea por redirección «/ruta-antigua /ruta-nueva». Salida: 0 sin fallos · 1 con fallos · 2 uso/red.
import fs from 'node:fs';
import { parseRedirects, runChecks, summarize } from './lib/launch-check.mjs';

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:\/\//i.test(a));
const ri = args.indexOf('--redirects');
if (!url) {
  console.error('Uso: node scripts/launch-check.mjs <https://url> [--redirects archivo.txt] [--json]');
  process.exit(2);
}
let redirects = [];
if (ri >= 0) {
  try { redirects = parseRedirects(fs.readFileSync(args[ri + 1], 'utf8')); } catch (e) { console.error(`✗ No se pudo leer el archivo de redirecciones: ${e.message}`); process.exit(2); }
}
let results;
try { results = await runChecks(url, { redirects }); } catch (e) { console.error(`✗ No se pudo comprobar ${url}: ${e.message}`); process.exit(2); }
const sum = summarize(results);
if (args.includes('--json')) console.log(JSON.stringify({ url, summary: sum, results }, null, 2));
else {
  const icon = { pass: '✓', fail: '✗', warn: '!', skip: '–', manual: '☐' };
  for (const x of results) console.log(`${icon[x.status]} ${x.id.padEnd(18)} ${x.msg}`);
  console.log(`\n${sum.pass} ok · ${sum.fail} fallo(s) · ${sum.warn} aviso(s) · ${sum.skip} omitida(s) · ${sum.manual} manual(es) por confirmar`);
}
process.exit(sum.fail ? 1 : 0);
