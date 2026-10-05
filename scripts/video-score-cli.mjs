#!/usr/bin/env node
// Calcula VIDEO_SCORE y (opcional) lo registra en creative/manifest.json.
//   node scripts/video-score-cli.mjs --input creative/briefs/home.score.json [--config creative/video-score.config.json]
//        [--write-manifest] [--manifest creative/manifest.json]
import fs from 'node:fs';
import path from 'node:path';
import { emptyManifest } from './lib/manifest.mjs';
import { resolveAsset, readJson, writeFileEnsured } from './lib/util.mjs';
import { computeVideoScore } from './lib/video-score.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const input = opt('--input');
if (!input) {
  console.error('Uso: node scripts/video-score-cli.mjs --input <archivo.score.json> [--write-manifest]');
  process.exit(2);
}
const cfgPath = opt('--config', fs.existsSync('creative/video-score.config.json') ? 'creative/video-score.config.json' : resolveAsset('config', 'video-score.default.json'));
const cfg = readJson(cfgPath);
const inp = readJson(input);
if (!cfg || !inp) {
  console.error(`No se pudo leer ${!cfg ? cfgPath : input} (¿JSON válido?)`);
  process.exit(2);
}

let res;
try {
  res = computeVideoScore(inp, cfg);
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
console.log(JSON.stringify(res, null, 2));

if (argv.includes('--write-manifest')) {
  const mp = opt('--manifest', 'creative/manifest.json');
  const m = readJson(mp) ?? emptyManifest(path.basename(process.cwd()));
  const idx = m.pages.findIndex((p) => p.page === res.page);
  const prev = idx >= 0 ? m.pages[idx] : {};
  const entry = {
    references: [], constraints: { preserve: [], may_change: ['acción', 'encuadre', 'cámara'], forbidden: ['inventar logos', 'cambiar producto/forma/colores'] },
    prompts: [], shots: [], outputs: [], poster: null, fallback: null, captions: [], audio: false, status: 'planned', approval: { by: null, at: null }, versions: [],
    ...prev,
    page: res.page, type: res.tier, score: res.score, reason: res.reason, score_breakdown: res.breakdown, scored_at: new Date().toISOString(),
  };
  if (idx >= 0) m.pages[idx] = entry;
  else m.pages.push(entry);
  writeFileEnsured(mp, JSON.stringify(m, null, 2) + '\n');
  console.error(`✓ registrado en ${mp} (${res.page}: ${res.tier}, score ${res.score})`);
}
