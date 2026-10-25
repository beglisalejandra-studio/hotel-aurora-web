#!/usr/bin/env node
// Optimiza un máster de video para web: MP4 (H.264) + WebM (VP9) por proporción, poster WebP y resumen.
//   node scripts/media-optimize.mjs --in <máster> --out-dir <dir> --name hero [--aspects 16:9,1:1,9:16]
//        [--max-seconds 12] [--crf 26] [--webm] [--keep-audio] [--poster-at 1] [--type hero-video]
//        [--register --page home]      → añade los outputs a creative/manifest.json como BORRADOR
// Aprobar NO es tarea del agente: los outputs solo se registran como 'draft'. Un humano los aprueba en el manifest.
import fs from 'node:fs';
import path from 'node:path';
import { ASPECTS, checkBudget, ffmpeg, filterFor, probe, requireFfmpeg } from './lib/media.mjs';
import { resolveAsset, readJson, writeFileEnsured } from './lib/util.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const flag = (n) => argv.includes(n);

const input = opt('--in');
const outDir = opt('--out-dir');
const name = opt('--name', 'media');
const aspects = opt('--aspects', '16:9').split(',').map((s) => s.trim());
const maxSeconds = Number(opt('--max-seconds', 12));
const crf = String(opt('--crf', 26));
const type = opt('--type', null);
if (!input || !outDir || !fs.existsSync(input)) {
  console.error('Uso: node scripts/media-optimize.mjs --in <máster> --out-dir <dir> --name <nombre> [--aspects 16:9,1:1,9:16] [--max-seconds 12] [--webm] [--register --page <p>]');
  process.exit(2);
}
for (const a of aspects) if (!ASPECTS[a]) {
  console.error(`Proporción no soportada: ${a} (usa ${Object.keys(ASPECTS).join(', ')})`);
  process.exit(2);
}
if (!/^[\w.-]+$/.test(name)) {
  console.error('--name solo admite letras, números, punto, guion y guion bajo');
  process.exit(2);
}

try {
  requireFfmpeg();
  const cfg = readJson(fs.existsSync('creative/video-score.config.json') ? 'creative/video-score.config.json' : resolveAsset('config', 'video-score.default.json'));
  fs.mkdirSync(outDir, { recursive: true });
  const src = probe(input);
  console.log(`máster: ${src.width}×${src.height} ${src.codec} ${src.duration_s}s ${Math.round(src.bytes / 1024)} KB${src.hasAudio ? ' (con audio)' : ''}`);
  const outputs = [];
  let problems = 0;

  for (const a of aspects) {
    const tag = ASPECTS[a].tag;
    const common = ['-i', input, '-t', String(maxSeconds), ...(flag('--keep-audio') ? ['-c:a', 'aac', '-b:a', '96k'] : ['-an']), '-vf', filterFor(a)];
    const mp4 = path.join(outDir, `${name}-${tag}.mp4`);
    ffmpeg([...common, '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', crf, '-preset', 'slow', '-movflags', '+faststart', mp4]);
    outputs.push({ file: mp4, kind: 'video', aspect: a, ...probe(mp4) });
    if (flag('--webm')) {
      const webm = path.join(outDir, `${name}-${tag}.webm`);
      ffmpeg([...common, '-c:v', 'libvpx-vp9', '-crf', String(Number(crf) + 8), '-b:v', '0', webm]);
      outputs.push({ file: webm, kind: 'video', aspect: a, ...probe(webm) });
    }
  }

  const poster = path.join(outDir, `${name}-poster.webp`);
  ffmpeg(['-ss', String(opt('--poster-at', 1)), '-i', input, '-frames:v', '1', '-vf', `${filterFor(aspects[0]).replace(',fps=30', '')}`, '-quality', '80', poster]);
  outputs.push({ file: poster, kind: 'poster', aspect: aspects[0], bytes: fs.statSync(poster).size });

  for (const o of outputs.filter((x) => x.kind === 'video')) {
    const p = type ? checkBudget(o, type, cfg, { allowAudio: flag('--keep-audio') }) : [];
    const mark = p.length ? '✗' : '✓';
    console.log(`${mark} ${path.relative('.', o.file)}  ${o.width}×${o.height} ${o.codec} ${o.duration_s}s ${Math.round(o.bytes / 1024)} KB${p.length ? `  → ${p.join('; ')}` : ''}`);
    problems += p.length;
  }
  console.log(`✓ ${path.relative('.', poster)}  ${Math.round(outputs.at(-1).bytes / 1024)} KB`);

  writeFileEnsured(path.join(outDir, `${name}.media.json`), JSON.stringify({ generated_at: new Date().toISOString(), source: path.basename(input), outputs }, null, 2) + '\n');

  if (flag('--register')) {
    const page = opt('--page');
    const mp = opt('--manifest', 'creative/manifest.json');
    const m = readJson(mp);
    const pg = m?.pages?.find((p) => p.page === page);
    if (!pg) throw new Error(`--register: la página '${page}' no está en ${mp} (ejecuta antes video-score-cli --write-manifest)`);
    const rel = (f) => path.relative('.', f).split(path.sep).join('/');
    for (const o of outputs) {
      if (o.kind === 'poster') pg.poster = rel(o.file);
      else pg.outputs.push({ id: `o${pg.outputs.length + 1}`, kind: 'video', path: rel(o.file), aspect: o.aspect, duration_s: o.duration_s, bytes: o.bytes, codec: o.codec, state: 'draft', version: 1 });
    }
    pg.status = pg.status === 'planned' ? 'generating' : pg.status;
    writeFileEnsured(mp, JSON.stringify(m, null, 2) + '\n');
    console.log(`✓ registrados ${outputs.filter((o) => o.kind === 'video').length} outputs como BORRADOR en ${mp} (la aprobación es humana)`);
  }
  process.exit(problems ? 1 : 0);
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(e.code === 'NO_FFMPEG' ? 2 : 1);
}
