#!/usr/bin/env node
// Valida el MAPA de redirecciones 301 antes de implementarlo (no toca ninguna red).
//   node scripts/check-redirect-map.mjs [docs/seo/redirects.txt] [docs/seo/new-urls.txt]
// Reglas: origen único (sin mayúsculas ni barra final) · destino existente en el sitio nuevo · sin bucles (origen igual a destino)
//         · sin cadenas (un destino no puede ser a su vez un origen) · el idioma del origen manda el del destino
//         · destino en minúsculas, sin barra final ni parámetros · cada pareja ES/EN del inventario es coherente.
// Salida: 0 todo correcto · 1 hay errores · 2 uso.
import fs from 'node:fs';

const [redirectsFile = 'docs/seo/redirects.txt', urlsFile = 'docs/seo/new-urls.txt'] = process.argv.slice(2);
const read = (f) => {
  try { return fs.readFileSync(f, 'utf8'); } catch (e) { console.error(`✗ No se puede leer ${f}: ${e.message}`); process.exit(2); }
};
const rows = (t) => t.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => l.split(/\s+/));
const norm = (p) => p.toLowerCase().replace(/\/+$/, '') || '/';
const SYSTEM_TARGETS = new Set(['/sitemap.xml']);

const pairs = rows(read(urlsFile));
const errors = [];
const fresh = new Set();
for (const [es, en, extra] of pairs) {
  if (!es || !en || extra) { errors.push(`inventario: línea mal formada «${[es, en, extra].filter(Boolean).join(' ')}»`); continue; }
  if (!(es === '/es' || es.startsWith('/es/'))) errors.push(`inventario: ${es} debe empezar por /es`);
  if (!(en === '/en' || en.startsWith('/en/'))) errors.push(`inventario: ${en} debe empezar por /en`);
  for (const u of [es, en]) { if (fresh.has(u)) errors.push(`inventario: URL duplicada ${u}`); fresh.add(u); }
}

const list = rows(read(redirectsFile));
const froms = new Map();
for (const cols of list) {
  if (cols.length !== 2) { errors.push(`mapa: línea con ${cols.length} columnas «${cols.join(' ')}» (deben ser 2)`); continue; }
  const [from, to] = cols;
  if (!from.startsWith('/')) errors.push(`origen sin «/» inicial: ${from}`);
  const nf = norm(from);
  if (froms.has(nf)) errors.push(`origen duplicado: ${from} (ya estaba como ${froms.get(nf)})`); else froms.set(nf, from);
  if (nf === norm(to)) errors.push(`bucle: ${from} redirige a sí misma`);
  if (to !== to.toLowerCase()) errors.push(`destino con mayúsculas: ${to}`);
  if (to.length > 1 && to.endsWith('/')) errors.push(`destino con barra final: ${to}`);
  if (/[?#]/.test(to)) errors.push(`destino con parámetros o ancla: ${to}`);
  if (!fresh.has(to) && !SYSTEM_TARGETS.has(to)) errors.push(`el destino no existe en el sitio nuevo: ${from} → ${to}`);
  const fromEn = nf === '/en' || nf.startsWith('/en/');
  if (!SYSTEM_TARGETS.has(to)) {
    if (fromEn && !(to === '/en' || to.startsWith('/en/'))) errors.push(`idioma: ${from} (inglés) apunta a ${to}`);
    if (!fromEn && !(to === '/es' || to.startsWith('/es/'))) errors.push(`idioma: ${from} (español) apunta a ${to}`);
  }
}
for (const cols of list) { const [, to] = cols; if (to && froms.has(norm(to))) errors.push(`cadena: el destino ${to} es también un origen`); }

const covered = new Set(list.map((c) => c[1]));
const noLegacy = [...fresh].filter((u) => !covered.has(u));
console.log(`${list.length} redirecciones, ${fresh.size} URLs nuevas (${pairs.length} parejas ES/EN).`);
console.log(`Páginas nuevas sin URL antigua que las alimente (esperable en páginas nuevas): ${noLegacy.length}`);
if (errors.length) { console.error(`\n✗ ${errors.length} error(es):`); for (const e of errors) console.error('  - ' + e); process.exit(1); }
console.log('✓ El mapa es coherente: sin duplicados, bucles ni cadenas; destinos y idiomas correctos.');
