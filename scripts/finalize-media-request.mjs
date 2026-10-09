#!/usr/bin/env node
// Remata las solicitudes de foto creadas con media-request.mjs para que el bloque que se copia en la herramienta
// lleve SIEMPRE la proporción exacta: una línea "FORMAT:" al inicio y una línea "OUTPUT:" al final (orientación, proporción,
// tamaño objetivo y mínimo, calidad, color y formato).
//   node scripts/finalize-media-request.mjs [nombre …] [--min 1500]   remata las fichas indicadas (por defecto, todas las pendientes)
//   node scripts/finalize-media-request.mjs <nombre> --look "texto"      contrato de estilo: la primera imagen adjunta fija el aspecto (luz, paleta, graduación) al pie de la letra
//   node scripts/finalize-media-request.mjs <nombre> --essence "texto"   sustituye el VISUAL CONTRACT por un contrato de esencia:
//                                                                     la referencia aporta materiales y lenguaje constructivo, no color ni luz
//   node scripts/finalize-media-request.mjs --check                   no escribe nada; sale con 1 si una ficha pendiente no tiene OUTPUT
// Es idempotente: repetirlo no cambia una ficha que ya está rematada. Solo toca fichas de imagen en estado "requested".
// Fija además el tamaño mínimo aceptado (--min, 1500 px en el lado largo por defecto) en el .json y en la tabla de la ficha.
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const val = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const MIN = Number(val('--min', 1500));
const DIR = 'creative/requests';
const ESSENCE = val('--essence', null);
const LOOK = val('--look', null);
const names = argv.filter((a, i) => !a.startsWith('--') && !['--min', '--essence', '--look'].includes(argv[i - 1]));

if (!Number.isFinite(MIN) || MIN < 800) {
  console.error('--min debe ser un número de píxeles razonable (800 o más).');
  process.exit(2);
}

const cards = (names.length ? names : fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')))
  .filter((n) => fs.existsSync(path.join(DIR, `${n}.json`)) && fs.existsSync(path.join(DIR, `${n}.md`)));

function outputLine(req) {
  const [a, b] = req.aspect.split(':').map(Number);
  const orientation = a > b ? 'landscape' : a < b ? 'portrait' : 'square';
  const minW = a >= b ? MIN : Math.round((MIN * a) / b);
  const minH = a >= b ? Math.round((MIN * b) / a) : MIN;
  const shape = orientation === 'square' ? 'square format' : `${orientation} orientation`;
  return {
    // Primera línea del prompt: la proporción exacta, para que la herramienta la lea antes que nada.
    format: `FORMAT: ${orientation} image, exact aspect ratio ${req.aspect} (${req.master.w} x ${req.master.h} px).`,
    // Última línea: tamaño objetivo y mínimo, calidad, color y formato.
    text: `OUTPUT: one single image, ${shape}, aspect ratio exactly ${req.aspect} (width : height = ${a} : ${b}; target ${req.master.w} x ${req.master.h} px; never smaller than ${minW} x ${minH} px), highest quality available, sRGB colour, delivered as JPG or PNG, with no frame, no border, no margins, no text and no watermark.`,
    minW,
    minH,
  };
}

let missing = 0;
let changed = 0;
for (const name of cards) {
  const jp = path.join(DIR, `${name}.json`);
  const mp = path.join(DIR, `${name}.md`);
  const req = JSON.parse(fs.readFileSync(jp, 'utf8'));
  if (req.kind !== 'image' || req.status !== 'requested') continue;
  const { format, text, minW, minH } = outputLine(req);
  let md = fs.readFileSync(mp, 'utf8');
  const block = /```text\n([\s\S]*?)\n```/.exec(md);
  if (!block) {
    console.error(`✗ ${name}: no encuentro el bloque del prompt (\`\`\`text).`);
    missing++;
    continue;
  }
  const hasFormat = /^FORMAT:/m.test(block[1]);
  const hasOutput = /^OUTPUT:/m.test(block[1]);
  if (flag('--check')) {
    if (!hasFormat || !hasOutput) {
      console.error(`✗ ${name}: al prompt le falta ${[!hasFormat && 'la línea FORMAT (inicio)', !hasOutput && 'la línea OUTPUT (final)'].filter(Boolean).join(' y ')}.`);
      missing++;
    } else console.log(`✓ ${name}`);
    continue;
  }
  let body = block[1].replace(/^FORMAT:.*\n*/m, '').replace(/\n*^OUTPUT:.*$/m, '').replace(/^\s+|\s+$/g, '');
  if (LOOK) {
    // Contrato de estilo: la primera imagen adjunta (la imagen principal del hotel) fija el aspecto al pie de la letra;
    // solo cambia el espacio que se muestra.
    body = body.replace(
      /^(VISUAL|ESSENCE|STYLE) CONTRACT:.*$/m,
      `STYLE CONTRACT: the first attached image is the main image of the hotel and defines its exact visual style. Reproduce that look to the letter: ${LOOK}. Only the space shown changes: the room, its furniture and its composition, as described below. Do not copy the exterior itself, only its look.`,
    );
    req.contract = 'style-lock';
  } else if (ESSENCE) {
    // Habitaciones nuevas: la referencia aporta el lenguaje constructivo del hotel, no su color ni su luz.
    body = body.replace(
      /^VISUAL CONTRACT:.*$/m,
      `ESSENCE CONTRACT: the attached reference image(s) show only the construction language and materials of the hotel, not its colour and not its light. Keep: ${ESSENCE}. Deliberately change the wall colour, the time of day, the light, the room layout and the composition, exactly as described below. Do not copy the colour palette or the lighting of the reference image(s).`,
    );
    req.contract = 'essence';
  }
  md = md.replace(block[0], `\`\`\`text\n${format}\n\n${body}\n\n${text}\n\`\`\``);
  const row = `| Tamaño mínimo aceptado | **${MIN} px en el lado largo** (${minW} × ${minH} px para ${req.aspect}); más grande es mejor |`;
  if (/^\| Tamaño mínimo aceptado \|.*$/m.test(md)) md = md.replace(/^\| Tamaño mínimo aceptado \|.*$/m, row);
  else md = md.replace(/^\| Formato de entrega \|/m, `${row}\n| Formato de entrega |`);
  req.min_long_side = MIN;
  const before = fs.readFileSync(mp, 'utf8') + fs.readFileSync(jp, 'utf8');
  fs.writeFileSync(mp, md);
  fs.writeFileSync(jp, JSON.stringify(req, null, 2) + '\n');
  const after = fs.readFileSync(mp, 'utf8') + fs.readFileSync(jp, 'utf8');
  if (before !== after) changed++;
  console.log(`${before !== after ? '✓ rematada' : '= sin cambios'}: ${name} (${req.aspect}, objetivo ${req.master.w} x ${req.master.h}, mínimo ${minW} x ${minH})`);
}
if (flag('--check')) process.exit(missing ? 1 : 0);
console.log(changed ? `\n${changed} ficha(s) actualizada(s).` : '\nNada que cambiar.');
process.exit(missing ? 1 : 0);
