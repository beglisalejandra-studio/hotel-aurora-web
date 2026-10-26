#!/usr/bin/env node
// Generación de imágenes (Gemini «Nano Banana») y videos (Veo) para sitios web, con guardián de coste y privacidad y
// «ficha Plan B»: si el resultado no te gusta, te da el prompt y las medidas exactas para producir y adjuntar el material tú.
//   node scripts/gemini-media.mjs image  --prompt "…" [--name hero] [--page home] [--aspect 16:9] [--size 2K] [--count 1]
//        [--reference foto.png]… [--preserve "logo, forma"] [--feedback "qué no gustó"] [--model id] [--go]
//   node scripts/gemini-media.mjs video  --prompt "…" [--aspect 16:9|9:16] [--duration 4|6|8] [--resolution 720p|1080p|4k]
//        [--image primer-fotograma.png | --reference foto.png…] [--model id] [--go] [--type hero-video]
//   node scripts/gemini-media.mjs plan-b <image|video> --prompt "…" …   (solo escribe la ficha; no llama a ninguna API)
//   node scripts/gemini-media.mjs models
// SIN --go solo se SIMULA: plan, coste estimado y ficha Plan B; cero llamadas, cero coste.
// Con --go: exige GEMINI_TIER=paid (imágenes y videos no existen en el plan gratuito) y un coste estimado ≤ --max-usd.
// Opciones comunes: --out-dir creative/generated-drafts · --register (con --page: añade el borrador a creative/manifest.json)
//   --client-data | --synthetic (privacidad) · --max-usd <n> · --with-audio (solo para la ficha de un video manual)
// Variables: GEMINI_API_KEY (secreto; nunca se imprime) · GEMINI_TIER=paid · GEMINI_API_BASE (tests) · GEMINI_MEDIA_POLL_MS (tests)
// Salida: SOLO borradores en creative/generated-drafts/ (nunca public/): la aprobación es de una persona.
// Códigos de salida: 0 ok · 1 error de API · 2 uso/validación/sin clave · 3 bloqueado (privacidad, coste o secreto)
import fs from 'node:fs';
import path from 'node:path';
import { findSecrets } from './lib/guard-rules.mjs';
import { buildImageBody, buildPlanB, buildPrompt, buildVideoBody, estimateCost, hostAllowed, mimeFor, parseImageResponse, parseOperation, sanitizeName, SYNTH_ID_NOTE, validateImage, validateVideo } from './lib/gemini-media.mjs';
import { readJson, resolveAsset, writeFileEnsured } from './lib/util.mjs';

const argv = process.argv.slice(2);
const cmd = argv[0];
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const all = (n) => argv.flatMap((a, i) => (a === n && argv[i + 1] ? [argv[i + 1]] : []));
const flag = (n) => argv.includes(n);
const die = (code, msg) => {
  console.error(msg);
  process.exit(code);
};

const cfg = readJson(resolveAsset('config', 'gemini-media.json'));
const versions = readJson(resolveAsset('config', 'versions.json'), {});
if (!cfg) die(2, 'Falta config/gemini-media.json (ejecuta npm run bootstrap o npm run sync-template).');
const base = (process.env.GEMINI_API_BASE || versions.gemini?.apiBase || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
const tier = process.env.GEMINI_TIER === 'paid' ? 'paid' : 'free';
const pollMs = Number(process.env.GEMINI_MEDIA_POLL_MS) || cfg.video.pollSeconds * 1000;
const outDir = opt('--out-dir', 'creative/generated-drafts');

function apiKey() {
  const a = process.env.GEMINI_API_KEY;
  const b = process.env.GOOGLE_API_KEY;
  if (a && b) console.error('⚠ GEMINI_API_KEY y GOOGLE_API_KEY definidas: usando GEMINI_API_KEY. Deja solo una.');
  return a || b || null;
}

/** Llamada JSON con reintentos SOLO en 429/5xx (máx. 3). La clave va en cabecera, nunca en la URL ni en el log. */
async function api(method, url, body, key, { retries = 3 } = {}) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: { 'x-goog-api-key': key, ...(body ? { 'Content-Type': 'application/json' } : {}) },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(300000),
      });
    } catch (e) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
        continue;
      }
      throw new Error(`sin conexión con la API (${e?.cause?.code || e.message}). En sesiones cloud, Node necesita NODE_USE_ENV_PROXY=1 para usar el proxy.`);
    }
    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      const ra = Number(res.headers.get('retry-after'));
      await new Promise((r) => setTimeout(r, Number.isFinite(ra) && ra > 0 ? ra * 1000 : 500 * 2 ** attempt));
      continue;
    }
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch { /* no JSON */ }
    if (!res.ok) {
      const msg = json?.error?.message ?? text.slice(0, 200);
      const hint = [400, 401, 403].includes(res.status) ? ' → clave inválida, sin permiso o sin facturación activa (imágenes y videos son de pago)' : res.status === 404 ? ' → modelo inexistente: `node scripts/gemini-media.mjs models`' : res.status === 429 ? ' → cuota/límite alcanzado' : '';
      throw new Error(`HTTP ${res.status}: ${msg}${hint}`);
    }
    return json;
  }
}

/** Descarga con redirecciones manuales: la clave solo viaja a hosts de Google (o al de pruebas). */
async function download(uri, key, maxRedirects = 3) {
  let url = uri;
  for (let i = 0; i <= maxRedirects; i++) {
    const res = await fetch(url, { headers: hostAllowed(url, base) ? { 'x-goog-api-key': key } : {}, redirect: 'manual', signal: AbortSignal.timeout(300000) });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      url = new URL(res.headers.get('location'), url).toString();
      continue;
    }
    if (!res.ok) throw new Error(`descarga fallida (HTTP ${res.status}). Los videos se conservan solo ${cfg.video.serverRetentionDays} días en el servidor.`);
    return Buffer.from(await res.arrayBuffer());
  }
  throw new Error('demasiadas redirecciones al descargar');
}

function readRef(file) {
  if (!fs.existsSync(file)) die(2, `La referencia no existe: ${file}`);
  const bytes = fs.statSync(file).size;
  if (bytes > cfg.image.maxReferenceBytes) die(2, `La referencia ${file} pesa ${Math.round(bytes / 1e6)} MB (máx. ${cfg.image.maxReferenceBytes / 1e6} MB).`);
  return { file, mime: mimeFor(file), data: fs.readFileSync(file).toString('base64') };
}

/** No pisa nada: añade -2, -3… */
function freePath(dir, name, ext) {
  fs.mkdirSync(dir, { recursive: true });
  let p = path.join(dir, `${name}${ext}`);
  for (let i = 2; fs.existsSync(p); i++) p = path.join(dir, `${name}-${i}${ext}`);
  return p;
}

function registerDraft({ kind, file, aspect, duration, bytes, page }) {
  const mp = opt('--manifest', 'creative/manifest.json');
  const m = readJson(mp);
  const pg = m?.pages?.find((p) => p.page === page);
  if (!pg) throw new Error(`--register: la página '${page}' no está en ${mp} (ejecuta antes video-score-cli --write-manifest)`);
  pg.outputs ??= [];
  pg.outputs.push({ id: `o${pg.outputs.length + 1}`, kind, path: file.split(path.sep).join('/'), aspect, ...(duration ? { duration_s: duration } : {}), bytes, state: 'draft', version: 1, generator: 'gemini-media' });
  if (pg.status === 'planned') pg.status = 'generating';
  writeFileEnsured(mp, JSON.stringify(m, null, 2) + '\n');
  return mp;
}

// ---------------------------------------------------------------------------------------------
function collect(kind) {
  const promptFile = opt('--prompt-file');
  const prompt = opt('--prompt') ?? (promptFile && fs.existsSync(promptFile) ? fs.readFileSync(promptFile, 'utf8') : null);
  if (!prompt || !prompt.trim()) die(2, '--prompt "…" (o --prompt-file <archivo>) es obligatorio.');
  const name = sanitizeName(opt('--name', kind === 'image' ? 'imagen' : 'video'));
  const references = all('--reference');
  const preserve = (opt('--preserve', '') || '').split(',').map((s) => s.trim()).filter(Boolean);
  const common = { prompt: prompt.trim(), name, page: opt('--page'), role: opt('--role'), references, preserve, feedback: opt('--feedback'), aspect: opt('--aspect', '16:9') };
  if (kind === 'image') {
    const model = opt('--model', cfg.image.defaultModel);
    const size = opt('--size', cfg.image.models[model]?.sizes.includes('2K') ? '2K' : '1K');
    return { ...common, kind, model, size, count: Number(opt('--count', 1)) };
  }
  return { ...common, kind, model: opt('--model', cfg.video.defaultModel), resolution: opt('--resolution', '720p'), duration: Number(opt('--duration', 8)), image: opt('--image'), lastFrame: opt('--last-frame'), type: opt('--type'), withAudio: flag('--with-audio') };
}

function writePlanB(s, generated) {
  const vs = readJson(fs.existsSync('creative/video-score.config.json') ? 'creative/video-score.config.json' : resolveAsset('config', 'video-score.default.json'), {});
  const md = buildPlanB({ ...s, generated }, cfg, vs.budgets ?? {});
  const p = path.join(outDir, `${s.name}.plan-b.md`);
  writeFileEnsured(p, md);
  return p;
}

async function main() {
  if (!cmd || ['-h', '--help', 'help'].includes(cmd)) {
    console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 19).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    return;
  }

  if (cmd === 'plan-b') {
    const kind = argv[1];
    if (!['image', 'video'].includes(kind)) die(2, 'Uso: gemini-media.mjs plan-b <image|video> --prompt "…" [--aspect …]');
    const s = collect(kind);
    console.log(`✓ ficha Plan B escrita (sin llamar a ninguna API): ${writePlanB(s, null)}`);
    return;
  }

  if (cmd === 'models') {
    const key = apiKey();
    if (!key) die(2, 'BLOQUEADO: sin clave. Crea GEMINI_API_KEY en https://aistudio.google.com/apikey y guárdala como secreto del entorno.');
    const names = new Set();
    let token = '';
    do {
      const j = await api('GET', `${base}/models?pageSize=100${token ? `&pageToken=${encodeURIComponent(token)}` : ''}`, null, key);
      for (const m of j.models ?? []) names.add(m.name.replace(/^models\//, ''));
      token = j.nextPageToken ?? '';
    } while (token);
    for (const [group, list] of [['imagen', cfg.image.models], ['video', cfg.video.models]]) {
      for (const id of Object.keys(list)) console.log(`${group.padEnd(7)} ${id.padEnd(34)} ${names.has(id) ? '✓ disponible' : '✗ NO disponible para tu clave (actualiza config/gemini-media.json)'}`);
    }
    return;
  }

  if (!['image', 'video'].includes(cmd)) die(2, `Comando desconocido '${cmd}'. Usa: image | video | plan-b | models`);
  const s = collect(cmd);
  const errors = cmd === 'image' ? validateImage(s, cfg) : validateVideo({ ...s, references: s.references }, cfg);
  if (errors.length) die(2, `✗ parámetros no válidos:\n  - ${errors.join('\n  - ')}`);
  const est = estimateCost(cmd, s, cfg);
  const finalPrompt = buildPrompt({ prompt: s.prompt, feedback: s.feedback, hasReferences: s.references.length > 0 || Boolean(s.image), preserve: s.preserve });

  // ---- SIMULACIÓN (por defecto) ---------------------------------------------------------------
  if (!flag('--go')) {
    const planB = writePlanB(s, null);
    console.log(`SIMULACIÓN (no se llamó a ninguna API, coste $0). Para generar de verdad añade --go.`);
    console.log(`  ${cmd}: modelo ${s.model} · ${s.aspect}${cmd === 'image' ? ` · ${s.size} · ${s.count} imagen(es)` : ` · ${s.resolution} · ${s.duration}s`}${s.references.length ? ` · ${s.references.length} referencia(s) = contrato visual` : ''}`);
    console.log(`  coste estimado (TOPE, no factura): hasta $${est.usd} — ${est.basis}. Tope por ejecución: $${opt('--max-usd', cfg.guard.maxUsdPerRun)}.`);
    console.log(`  requiere: GEMINI_API_KEY + GEMINI_TIER=paid (no existe plan gratuito para ${cmd === 'image' ? 'imágenes' : 'videos'}).`);
    console.log(`  salida: borrador en ${outDir}/ (nunca public/) · ficha Plan B: ${planB}`);
    return;
  }

  // ---- GENERACIÓN REAL ------------------------------------------------------------------------
  const secrets = findSecrets(finalPrompt);
  if (secrets.length) die(3, `BLOQUEADO: el prompt contiene lo que parece un secreto (${secrets.join(', ')}). No se envía a ninguna API. Quítalo y rota esa credencial.`);
  if (tier !== 'paid') die(3, `BLOQUEADO: ${cmd === 'image' ? 'la generación de imágenes' : 'la generación de video'} no existe en el plan GRATUITO de la API (y ahí Google puede usar el contenido para mejorar sus productos). Activa facturación en Google AI Studio y exporta GEMINI_TIER=paid.`);
  const cap = Number(opt('--max-usd', cfg.guard.maxUsdPerRun));
  if (est.usd > cap) die(3, `BLOQUEADO por coste: estimado hasta $${est.usd} (${est.basis}) > tope $${cap}. Reduce --count/--duration/--resolution o sube --max-usd conscientemente.`);
  const key = apiKey();
  if (!key) die(2, 'BLOQUEADO: sin clave. Crea GEMINI_API_KEY en https://aistudio.google.com/apikey y guárdala como secreto del entorno (nunca en el chat ni en el repo).');
  const refs = s.references.map(readRef);
  const clientData = flag('--client-data') || (fs.existsSync('PROJECT.md') && !flag('--synthetic'));

  const written = [];
  if (cmd === 'image') {
    const body = buildImageBody({ text: finalPrompt, refs, aspect: s.aspect, size: s.size }, cfg.imageParamStyle);
    for (let i = 0; i < s.count; i++) {
      const j = await api('POST', `${base}/models/${encodeURIComponent(s.model)}:generateContent`, body, key);
      const r = parseImageResponse(j);
      if (!r.images.length) die(1, `✗ Gemini no devolvió imagen${r.blocked ? ` (${r.blocked})` : ''}${r.text ? `: ${r.text.slice(0, 200)}` : ''}. Prueba otro prompt o usa el Plan B: ${writePlanB(s, null)}`);
      const img = r.images[0];
      const ext = img.mime === 'image/jpeg' ? '.jpg' : img.mime === 'image/webp' ? '.webp' : '.png';
      const file = freePath(outDir, s.name, ext);
      const bytes = Buffer.from(img.data, 'base64');
      fs.writeFileSync(file, bytes);
      writeFileEnsured(`${file}.json`, JSON.stringify({ kind: 'image', model: s.model, aspect: s.aspect, size: s.size, prompt: finalPrompt, references: s.references, preserve: s.preserve, tier, client_data: clientData, estimated_usd_max: est.usd / s.count, created_at: new Date().toISOString(), state: 'draft', synthid: true }, null, 2) + '\n');
      written.push({ file, bytes: bytes.length });
      if (flag('--register') && s.page) registerDraft({ kind: 'image', file, aspect: s.aspect, bytes: bytes.length, page: s.page });
    }
  } else {
    const first = s.image ? readRef(s.image) : null;
    const last = s.lastFrame ? readRef(s.lastFrame) : null;
    const body = buildVideoBody({ text: finalPrompt, image: first, lastFrame: last, refs, aspect: s.aspect, resolution: s.resolution, duration: s.duration });
    const op = parseOperation(await api('POST', `${base}/models/${encodeURIComponent(s.model)}:predictLongRunning`, body, key));
    if (!op.name) die(1, '✗ la API no devolvió el nombre de la operación.');
    console.error(`⏳ generando video (${s.model}); suele tardar entre 11 s y 6 min…`);
    const deadline = Date.now() + cfg.video.timeoutMinutes * 60000;
    let cur = op;
    while (!cur.done) {
      if (Date.now() > deadline) die(1, `✗ tiempo agotado (${cfg.video.timeoutMinutes} min). La operación sigue en el servidor: ${op.name}. Plan B: ${writePlanB(s, null)}`);
      await new Promise((r) => setTimeout(r, pollMs));
      cur = parseOperation(await api('GET', `${base}/${op.name}`, null, key));
    }
    if (cur.error) die(1, `✗ la generación falló: ${cur.error}. Plan B: ${writePlanB(s, null)}`);
    if (!cur.uri) die(1, `✗ Gemini no devolvió video${cur.filtered.count ? ` (filtro de seguridad: ${cur.filtered.reasons.join('; ') || `${cur.filtered.count} bloqueado(s)`}; no se cobra)` : ''}. Cambia el prompt o usa el Plan B: ${writePlanB(s, null)}`);
    const bytes = await download(cur.uri, key);
    const file = freePath(outDir, s.name, '.mp4');
    fs.writeFileSync(file, bytes);
    writeFileEnsured(`${file}.json`, JSON.stringify({ kind: 'video', model: s.model, aspect: s.aspect, resolution: s.resolution, duration_s: s.duration, prompt: finalPrompt, references: s.references, first_frame: s.image ?? null, preserve: s.preserve, tier, client_data: clientData, estimated_usd_max: est.usd, created_at: new Date().toISOString(), state: 'draft', synthid: true, has_audio: true }, null, 2) + '\n');
    written.push({ file, bytes: bytes.length });
    if (flag('--register') && s.page) registerDraft({ kind: 'video', file, aspect: s.aspect, duration: s.duration, bytes: bytes.length, page: s.page });
  }

  const planB = writePlanB(s, written[0].file);
  for (const w of written) console.log(`✓ borrador: ${w.file} (${Math.round(w.bytes / 1024)} KB)`);
  console.log(`  modelo ${s.model} · tier ${tier}${clientData ? ' · datos de cliente' : ''} · coste estimado (tope) $${est.usd}`);
  console.log(`  ${SYNTH_ID_NOTE}`);
  if (cmd === 'video') console.log(`  Veo genera audio: media-optimize lo quita por defecto (--keep-audio para conservarlo, y entonces añade captions). Siguiente: node scripts/media-optimize.mjs --in ${written[0].file} --out-dir ${outDir} --name ${s.name} --aspects ${s.aspect}${s.type ? ` --type ${s.type}` : ''}`);
  console.log(`  ¿No te gusta? Repite con --feedback "qué cambiar", o usa la ficha Plan B (prompt + medidas exactas para adjuntar tu propio material): ${planB}`);
  console.log('  Es un BORRADOR: la aprobación y el paso a public/media son de una persona.');
}

main().catch((e) => die(1, `✗ ${e.message}`));
