#!/usr/bin/env node
// Convierte tokens de diseño (p. ej. variables de Figma obtenidas con el MCP `get_variable_defs`) en CSS custom properties.
//   node scripts/tokens-to-css.mjs design/tokens.figma.json --out app/tokens.css [--dark design/tokens.dark.json] [--format root|theme]
// Formatos de entrada admitidos:
//   a) mapa plano:  { "color/brand/primary": "#0a0a0a", "space/4": 16, "radius/md": "8px" }
//   b) W3C tokens:  { "color": { "brand": { "primary": { "$value": "#0a0a0a", "$type": "color" } } } }
// SEGURIDAD: el JSON puede venir de una herramienta externa → se sanea (nombres y valores) para impedir inyección de CSS.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const NAME_OK = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VALUE_BAD = /[;{}<>@\\]|url\s*\(|expression\s*\(|\/\*|\*\//i;
const UNITLESS_GROUPS = /^(?:space|spacing|radius|size|gap|width|height|border-width|font-size|text)-/;

export function toKebab(path) {
  return path
    .split(/[\/.\s]+/)
    .map((s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
    .filter(Boolean)
    .join('-');
}

export function flatten(input) {
  const out = {};
  (function rec(node, prefix) {
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      if ('$value' in node || 'value' in node) {
        out[prefix] = node.$value ?? node.value;
        return;
      }
      for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) rec(v, prefix ? `${prefix}/${k}` : k);
    } else out[prefix] = node;
  })(input, '');
  return out;
}

export function buildVars(input) {
  const vars = {};
  const rejected = [];
  for (const [rawName, rawVal] of Object.entries(flatten(input))) {
    const name = toKebab(rawName);
    let val = typeof rawVal === 'number' ? String(rawVal) : String(rawVal ?? '').trim();
    if (!NAME_OK.test(name)) { rejected.push(`${rawName}: nombre inválido`); continue; }
    if (!val || VALUE_BAD.test(val)) { rejected.push(`${rawName}: valor rechazado`); continue; }
    if (/^-?\d+(?:\.\d+)?$/.test(val) && UNITLESS_GROUPS.test(name)) val = `${val}px`; // 16 → 16px
    vars[`--${name}`] = val;
  }
  return { vars, rejected };
}

const block = (sel, vars, indent = '  ') =>
  `${sel} {\n${Object.entries(vars).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${indent}${k}: ${v};`).join('\n')}\n}`;

export function render({ light, dark, format = 'root' }) {
  const head = '/* Generado por scripts/tokens-to-css.mjs — NO editar a mano: edita design/tokens*.json y regenera. */\n';
  const parts = [];
  if (format === 'theme') {
    // Tailwind CSS v4: variables de tema (namespaces color-*, font-*, radius-*, shadow-*, spacing-*, text-*…)
    const themeNs = /^--(?:color|font|text|radius|shadow|spacing|breakpoint|ease|animate|blur|tracking|leading)-/;
    const theme = Object.fromEntries(Object.entries(light).filter(([k]) => themeNs.test(k)));
    const rest = Object.fromEntries(Object.entries(light).filter(([k]) => !themeNs.test(k)));
    parts.push(block('@theme', theme));
    if (Object.keys(rest).length) parts.push(block(':root', rest));
  } else parts.push(block(':root', light));
  if (dark && Object.keys(dark).length) {
    parts.push(block(':root[data-theme="dark"]', dark));
    parts.push(`@media (prefers-color-scheme: dark) {\n${block(':root:not([data-theme="light"])', dark, '    ').replace(/^/gm, '  ')}\n}`);
  }
  return head + parts.join('\n\n') + '\n';
}

function main() {
  const argv = process.argv.slice(2);
  const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
  const src = argv.find((a) => !a.startsWith('--'));
  if (!src) {
    console.error('Uso: node scripts/tokens-to-css.mjs <tokens.json> --out <archivo.css> [--dark <tokens.dark.json>] [--format root|theme]');
    process.exit(2);
  }
  const light = buildVars(JSON.parse(fs.readFileSync(src, 'utf8')));
  const dark = opt('--dark') ? buildVars(JSON.parse(fs.readFileSync(opt('--dark'), 'utf8'))) : null;
  const css = render({ light: light.vars, dark: dark?.vars, format: opt('--format', 'root') });
  const out = opt('--out');
  if (out) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, css);
  } else process.stdout.write(css);
  const rej = [...light.rejected, ...(dark?.rejected ?? [])];
  console.error(`✓ ${Object.keys(light.vars).length} tokens${dark ? ` (+${Object.keys(dark.vars).length} dark)` : ''}${rej.length ? ` · ${rej.length} rechazados: ${rej.slice(0, 3).join('; ')}` : ''}`);
  process.exit(rej.length ? 3 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
