#!/usr/bin/env node
// Crea las solicitudes (.json) de un LOTE de fotos pedido en un solo prompt, para que `media-intake` compruebe cada archivo
// que suba la persona (proporción, tamaño mínimo, peso) con su nombre exacto.
//   node scripts/make-batch-requests.mjs creative/briefs/lotes/alba.json
// El lote es un JSON: { "lote": "alba", "prompt": "creative/briefs/prompt-maestro-alba.md", "items": [
//   { "name": "p06-alba-bano-escritorio", "aspect": "3:2", "page": "habitaciones", "role": "…", "min_long_side": 1500 } ] }
// Es idempotente. No sobrescribe una solicitud que ya no esté en estado "requested".
import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.error('Uso: node scripts/make-batch-requests.mjs creative/briefs/lotes/<lote>.json');
  process.exit(2);
}
const batch = JSON.parse(fs.readFileSync(file, 'utf8'));
const LONG = 2560;
const DIR = 'creative/requests';
fs.mkdirSync(DIR, { recursive: true });

function master(aspect) {
  const [a, b] = aspect.split(':').map(Number);
  return a >= b ? { w: LONG, h: Math.floor((LONG * b) / a) } : { w: Math.floor((LONG * a) / b), h: LONG };
}

let made = 0;
let kept = 0;
for (const it of batch.items) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(it.name) || !/^\d+:\d+$/.test(it.aspect)) {
    console.error(`✗ ${it.name}: nombre o proporción no válidos.`);
    process.exitCode = 1;
    continue;
  }
  const p = path.join(DIR, `${it.name}.json`);
  if (fs.existsSync(p)) {
    const prev = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (prev.status !== 'requested') {
      kept++;
      continue;
    }
  }
  const req = {
    name: it.name,
    kind: 'image',
    aspect: it.aspect,
    page: it.page ?? null,
    role: it.role ?? null,
    status: 'requested',
    requested_at: new Date().toISOString(),
    master: master(it.aspect),
    min_long_side: it.min_long_side ?? 1500,
    max_bytes: 4000000,
    exts: ['.jpg', '.jpeg', '.png', '.webp', '.avif'],
    batch: batch.lote,
    prompt_file: batch.prompt ?? null,
  };
  fs.writeFileSync(p, JSON.stringify(req, null, 2) + '\n');
  made++;
}
console.log(`Lote "${batch.lote}": ${made} solicitud(es) creada(s) o actualizada(s), ${kept} ya recibida(s) o aprobada(s) (no se tocan).`);
