#!/usr/bin/env node
// Valida creative/manifest.json. Uso: node scripts/validate-manifest.mjs [ruta] [--strict]
import path from 'node:path';
import { validateManifest } from './lib/manifest.mjs';
import { resolveAsset, readJson, readJsonStrict } from './lib/util.mjs';

const argv = process.argv.slice(2);
const file = argv.find((a) => !a.startsWith('--')) ?? 'creative/manifest.json';
const strict = argv.includes('--strict');

const m = readJsonStrict(file);
if (!m.ok) {
  console.error(`✗ ${file}: ${m.error}`);
  process.exit(1);
}
const cfg = readJson(path.join(path.dirname(file), 'video-score.config.json')) ?? readJson(resolveAsset('config', 'video-score.default.json'));
const { errors, warnings } = validateManifest(m.value, cfg);
for (const e of errors) console.error(`✗ ${e}`);
for (const w of warnings) console.warn(`⚠ ${w}`);
console.log(errors.length ? `\n✗ ${file}: ${errors.length} error(es), ${warnings.length} aviso(s)` : `✓ ${file} válido (${m.value.pages.length} página(s), ${warnings.length} aviso(s))`);
process.exit(errors.length || (strict && warnings.length) ? 1 : 0);
