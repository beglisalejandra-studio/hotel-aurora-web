#!/usr/bin/env node
// Valida un video contra el presupuesto de su tipo (duración, peso, códec, pix_fmt, audio, proporción).
//   node scripts/media-probe.mjs <archivo> [--type microvideo|hero-video|full-pipeline] [--config creative/video-score.config.json] [--allow-audio]
import fs from 'node:fs';
import path from 'node:path';
import { checkBudget, probe } from './lib/media.mjs';
import { resolveAsset, readJson } from './lib/util.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const file = argv.find((a) => !a.startsWith('--') && a !== opt('--type') && a !== opt('--config'));
if (!file || !fs.existsSync(file)) {
  console.error('Uso: node scripts/media-probe.mjs <archivo> [--type hero-video] [--allow-audio]');
  process.exit(2);
}
const cfg = readJson(opt('--config', fs.existsSync('creative/video-score.config.json') ? 'creative/video-score.config.json' : resolveAsset('config', 'video-score.default.json')));
try {
  const info = probe(file);
  console.log(JSON.stringify(info, null, 2));
  const type = opt('--type');
  const problems = checkBudget(info, type, cfg, { allowAudio: argv.includes('--allow-audio') });
  if (problems.length) {
    problems.forEach((p) => console.error(`✗ ${p}`));
    process.exit(1);
  }
  console.log(`✓ ${file} cumple${type ? ` el presupuesto de ${type}` : ' las reglas generales'}`);
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(e.code === 'NO_FFMPEG' ? 2 : 1);
}
