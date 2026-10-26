#!/usr/bin/env node
// RECEPCIÓN de material subido a creative/inbox/: lo comprueba contra la solicitud (creative/requests/<name>.json) y, si cumple,
// lo copia como BORRADOR a creative/generated-drafts/ (y, con --register, lo anota en creative/manifest.json).
//   node scripts/media-intake.mjs [--name hero] [--register] [--inbox creative/inbox]
// Nunca aprueba ni publica nada: la aprobación y el paso a public/media son de una persona.
// Códigos de salida: 0 todo correcto (o nada pendiente) · 1 hay errores que corregir · 2 uso
import fs from 'node:fs';
import path from 'node:path';
import { checkImage, checkVideo, IMAGE_EXTS, VIDEO_EXTS } from './lib/media-intake.mjs';
import { probe } from './lib/media.mjs';
import { readJson, writeFileEnsured } from './lib/util.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const flag = (n) => argv.includes(n);
const inbox = opt('--inbox', 'creative/inbox');
const reqDir = 'creative/requests';
const outDir = 'creative/generated-drafts';

if (!fs.existsSync(reqDir)) {
  console.log('No hay solicitudes (creative/requests/). Pídeme el material con media-request.mjs.');
  process.exit(0);
}
const want = opt('--name');
const reqs = fs.readdirSync(reqDir).filter((f) => f.endsWith('.json')).map((f) => readJson(path.join(reqDir, f))).filter((r) => r && (!want || r.name === want));
if (!reqs.length) {
  console.error(want ? `No hay solicitud '${want}'.` : 'No hay solicitudes.');
  process.exit(want ? 2 : 0);
}

let failed = 0;
let received = 0;
for (const req of reqs) {
  const files = fs.existsSync(inbox) ? fs.readdirSync(inbox).filter((f) => path.basename(f, path.extname(f)) === req.name && [...IMAGE_EXTS, ...VIDEO_EXTS, '.svg'].includes(path.extname(f).toLowerCase())) : [];
  if (!files.length) {
    console.log(`… ${req.name}: pendiente (sube ${inbox}/${req.name}.${req.kind === 'image' ? 'jpg|png|webp' : 'mp4'}).`);
    continue;
  }
  received++;
  const file = files[0];
  const full = path.join(inbox, file);
  let res;
  try {
    if (req.kind === 'image') res = checkImage({ file, buf: fs.readFileSync(full), req });
    else {
      const info = probe(full);
      res = checkVideo({ file, info, req, hasCaptions: fs.existsSync(path.join(inbox, `${req.name}.vtt`)) });
    }
  } catch (e) {
    res = { errors: [e.code === 'NO_FFMPEG' ? `${e.message} (sin ffprobe no se puede comprobar el video: revísalo a mano)` : e.message], warnings: [], info: {} };
  }
  if (files.length > 1) res.warnings.push(`hay varios archivos con ese nombre (${files.join(', ')}); se revisó ${file}.`);
  const ok = res.errors.length === 0;
  console.log(`${ok ? '✓' : '✗'} ${req.name} (${file}) — ${req.kind} ${req.aspect}${res.info.w ? ` · ${res.info.w}×${res.info.h}` : res.info.width ? ` · ${res.info.width}×${res.info.height} · ${res.info.duration_s}s` : ''}${res.info.bytes ? ` · ${(res.info.bytes / 1e6).toFixed(2)} MB` : ''}`);
  for (const e of res.errors) console.log(`    ✗ ${e}`);
  for (const w of res.warnings) console.log(`    ⚠ ${w}`);
  if (!ok) {
    failed++;
    console.log(`    → Corrígelo y vuelve a subirlo con el mismo nombre; o sigue la ficha: ${reqDir}/${req.name}.md`);
    continue;
  }
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, file);
  fs.copyFileSync(full, dest);
  const reqPath = path.join(reqDir, `${req.name}.json`);
  writeFileEnsured(reqPath, JSON.stringify({ ...req, status: 'received', received_at: new Date().toISOString(), file: dest.split(path.sep).join('/') }, null, 2) + '\n');
  if (flag('--register') && req.page) {
    const mp = 'creative/manifest.json';
    const m = readJson(mp);
    const pg = m?.pages?.find((p) => p.page === req.page);
    if (pg) {
      pg.outputs ??= [];
      pg.outputs.push({ id: `o${pg.outputs.length + 1}`, kind: req.kind, path: dest.split(path.sep).join('/'), aspect: req.aspect, ...(res.info.duration_s ? { duration_s: res.info.duration_s } : {}), bytes: res.info.bytes, state: 'draft', version: 1, source: 'manual' });
      if (pg.status === 'planned') pg.status = 'generating';
      writeFileEnsured(mp, JSON.stringify(m, null, 2) + '\n');
      console.log(`    ✓ registrado como BORRADOR en ${mp}`);
    } else console.log(`    ⚠ la página '${req.page}' no está en ${mp}; no se registró.`);
  }
  console.log(`    ✓ copiado como borrador a ${dest}`);
  console.log(req.kind === 'video'
    ? `    Siguiente: node scripts/media-optimize.mjs --in ${dest} --out-dir ${outDir} --name ${req.name} --aspects ${req.aspect}${req.type ? ` --type ${req.type}` : ''}${req.page ? ` --register --page ${req.page}` : ''}`
    : '    Siguiente: súbela en el bloque del editor (Subir imagen) o indícame dónde va; la aprobación es tuya.');
}
if (!received) console.log('Nada recibido todavía.');
process.exit(failed ? 1 : 0);
