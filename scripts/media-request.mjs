#!/usr/bin/env node
// SOLICITUD de material audiovisual (flujo manual, el principal del sistema): escribe la ficha con estilo, medidas exactas,
// prompt y carpeta de subida, para que la persona produzca la imagen/video por su cuenta y la suba a creative/inbox/.
//   node scripts/media-request.mjs --name hero --kind image|video --aspect 16:9 --prompt "…" [--page home] [--role portada]
//        [--style "texto extra de estilo"] [--preserve "logo, forma"] [--reference creative/references/x.png]…
//        [--feedback "qué no gustó del intento anterior"] [--duration 6] [--type microvideo|hero-video|full-pipeline] [--with-audio]
// Escribe creative/requests/<name>.md (la ficha, también por stdout) y <name>.json (lo que luego comprueba media-intake.mjs).
// No llama a ninguna API, no cuesta nada y no necesita claves.
import fs from 'node:fs';
import path from 'node:path';
import { buildPlanB, sanitizeName } from './lib/gemini-media.mjs';
import { makeRequest, styleBlock } from './lib/media-intake.mjs';
import { readJson, resolveAsset, writeFileEnsured } from './lib/util.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const all = (n) => argv.flatMap((a, i) => (a === n && argv[i + 1] ? [argv[i + 1]] : []));
const flag = (n) => argv.includes(n);
const die = (code, m) => {
  console.error(m);
  process.exit(code);
};

if (flag('--help') || flag('-h')) {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 9).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(0);
}
const cfg = readJson(resolveAsset('config', 'gemini-media.json'));
if (!cfg) die(2, 'Falta config/gemini-media.json (npm run bootstrap o npm run sync-template).');
const vs = readJson(fs.existsSync('creative/video-score.config.json') ? 'creative/video-score.config.json' : resolveAsset('config', 'video-score.default.json'), {});

const kind = opt('--kind');
if (!['image', 'video'].includes(kind)) die(2, '--kind image|video es obligatorio.');
const promptFile = opt('--prompt-file');
const prompt = opt('--prompt') ?? (promptFile && fs.existsSync(promptFile) ? fs.readFileSync(promptFile, 'utf8') : null);
if (!prompt?.trim()) die(2, '--prompt "…" (o --prompt-file) es obligatorio: el agente lo redacta con el estilo del proyecto.');
const aspect = opt('--aspect', '16:9');
if (!/^\d+:\d+$/.test(aspect)) die(2, `--aspect no válido: ${aspect} (ejemplo 16:9)`);
const name = sanitizeName(opt('--name', kind === 'image' ? 'imagen' : 'video'));
const type = opt('--type');
if (type && !vs.budgets?.[type]) die(2, `--type desconocido '${type}' (${Object.keys(vs.budgets ?? {}).join(', ')})`);
const duration = Number(opt('--duration', type ? Math.min(vs.budgets[type].max_seconds, 8) : 6));
if (kind === 'video' && vs.budgets?.[type] && duration > vs.budgets[type].max_seconds) die(2, `La duración ${duration}s excede el máximo de «${type}» (${vs.budgets[type].max_seconds}s).`);

const style = [styleBlock('.'), opt('--style') ? `**Indicaciones de esta pieza:** ${opt('--style')}` : ''].filter(Boolean).join('\n\n');
const spec = { kind, name, page: opt('--page'), role: opt('--role'), aspect, duration, withAudio: flag('--with-audio'), type, prompt: prompt.trim(), feedback: opt('--feedback'), preserve: (opt('--preserve', '') || '').split(',').map((s) => s.trim()).filter(Boolean), references: all('--reference'), style };
const md = buildPlanB(spec, cfg, vs.budgets ?? {});
const dir = 'creative/requests';
writeFileEnsured(path.join(dir, `${name}.md`), md);
writeFileEnsured(path.join(dir, `${name}.json`), JSON.stringify(makeRequest(spec, cfg, vs.budgets ?? {}), null, 2) + '\n');
fs.mkdirSync('creative/inbox', { recursive: true });
if (!fs.existsSync('creative/inbox/.gitkeep')) fs.writeFileSync('creative/inbox/.gitkeep', '');
console.log(md);
console.error(`✓ solicitud guardada en ${dir}/${name}.md · cuando subas el archivo a creative/inbox/ ejecuta: node scripts/media-intake.mjs --name ${name}`);
