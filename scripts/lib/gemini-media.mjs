// Lógica pura (testeable) de la generación de imágenes y videos con Gemini/Veo y de la «ficha Plan B».
// Sin red, sin disco: el CLI (scripts/gemini-media.mjs) hace la E/S. Sin dependencias.
import path from 'node:path';

export const SYNTH_ID_NOTE = 'Todo lo generado lleva marca de agua SynthID (Google). Es contenido sintético: valora si debes indicarlo al público.';

// ---------------------------------------------------------------------------------------------
// Utilidades
export function sanitizeName(n) {
  const s = String(n ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  return s || 'media';
}

/** Tamaño del máster de una proporción a partir del lado mayor (par, para códecs y para que cuadre la proporción). */
export function masterSize(aspect, longSide = 2560) {
  const [a, b] = String(aspect).split(':').map(Number);
  if (!a || !b) throw new Error(`Proporción no válida: ${aspect}`);
  const even = (n) => Math.round(n / 2) * 2;
  return a >= b ? { w: even(longSide), h: even((longSide * b) / a) } : { w: even((longSide * a) / b), h: even(longSide) };
}

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
export function mimeFor(file) {
  const m = MIME[path.extname(file).toLowerCase()];
  if (!m) throw new Error(`Formato de referencia no admitido (${path.extname(file) || 'sin extensión'}). Usa PNG, JPG o WebP.`);
  return m;
}

/** Evita enviar la clave a un host que no sea de Google (o al de pruebas). */
export function hostAllowed(uri, apiBase) {
  try {
    const u = new URL(uri);
    const b = new URL(apiBase);
    if (u.host === b.host && u.protocol === b.protocol) return true; // mismo origen que la API (sin degradar https a http)
    return u.protocol === 'https:' && /(^|\.)(googleapis\.com|googleusercontent\.com)$/.test(u.hostname);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------------------------
// Contrato visual y prompt final
/**
 * La referencia aprobada es un CONTRATO VISUAL: se conserva producto, forma, proporciones, materiales, colores, logotipo,
 * iluminación y composición; puede cambiar acción, encuadre y cámara, no la identidad (reglas globales del sistema).
 */
export function contractText(preserve = []) {
  const extra = preserve.length ? ` Also keep unchanged: ${preserve.join(', ')}.` : '';
  return (
    'VISUAL CONTRACT: the attached reference image(s) define the exact identity of the subject. Keep the product, its shape, ' +
    'proportions, materials, colors, logo, lighting and composition unchanged. Only the action, framing and camera may change. ' +
    `Do not add or alter logos, brand names or text.${extra}`
  );
}

export function buildPrompt({ prompt, feedback, hasReferences, preserve = [] }) {
  const parts = [];
  if (hasReferences) parts.push(contractText(preserve));
  parts.push(String(prompt).trim());
  if (feedback) parts.push(`REVISION (the previous result was not acceptable; fix this): ${String(feedback).trim()}`);
  return parts.join('\n\n');
}

// ---------------------------------------------------------------------------------------------
// Validación y coste
export function validateImage(o, cfg) {
  const errors = [];
  const ic = cfg.image;
  const model = ic.models[o.model];
  if (!model) errors.push(`modelo de imagen desconocido '${o.model}' (configurados: ${Object.keys(ic.models).join(', ')}; actualiza config/gemini-media.json tras \`models\`)`);
  if (!ic.aspects.includes(o.aspect)) errors.push(`proporción ${o.aspect} no admitida (${ic.aspects.join(', ')})`);
  if (model && !model.sizes.includes(o.size)) errors.push(`tamaño ${o.size} no admitido por ${o.model} (${model.sizes.join(', ')})`);
  if (!Number.isInteger(o.count) || o.count < 1 || o.count > 4) errors.push('--count debe ser un entero de 1 a 4');
  if ((o.references ?? []).length > ic.maxReferences) errors.push(`máximo ${ic.maxReferences} imágenes de referencia`);
  return errors;
}

export function validateVideo(o, cfg) {
  const errors = [];
  const vc = cfg.video;
  const model = vc.models[o.model];
  if (!model) errors.push(`modelo de video desconocido '${o.model}' (configurados: ${Object.keys(vc.models).join(', ')})`);
  if (!vc.aspects.includes(o.aspect)) errors.push(`proporción ${o.aspect} no admitida por Veo (${vc.aspects.join(', ')}); para 1:1 genera 16:9 y recorta con media-optimize`);
  if (!vc.durations.includes(o.duration)) errors.push(`duración ${o.duration}s no admitida (${vc.durations.join(', ')})`);
  if (model && !model.resolutions.includes(o.resolution)) errors.push(`resolución ${o.resolution} no admitida por ${o.model} (${model.resolutions.join(', ')})`);
  if (['1080p', '4k'].includes(o.resolution) && o.duration !== vc.highResNeedsSeconds) errors.push(`${o.resolution} exige duración de ${vc.highResNeedsSeconds}s`);
  if ((o.references ?? []).length > vc.maxReferences) errors.push(`máximo ${vc.maxReferences} imágenes de referencia en video`);
  if ((o.references ?? []).length && o.duration !== vc.highResNeedsSeconds) errors.push(`las imágenes de referencia exigen duración de ${vc.highResNeedsSeconds}s`);
  if (o.image && (o.references ?? []).length) errors.push('usa --image (primer fotograma) O --reference, no ambos');
  return errors;
}

/** Tope estimado en USD (nunca una factura): usa el precio máximo documentado. */
export function estimateCost(kind, o, cfg) {
  if (kind === 'image') {
    const per = cfg.image.models[o.model]?.maxUsdPerImage ?? 0;
    return { usd: round(per * o.count), basis: `${o.count} × hasta $${per} por imagen (${o.model})` };
  }
  const per = cfg.video.models[o.model]?.usdPerSecond?.[o.resolution] ?? 0;
  return { usd: round(per * o.duration), basis: `${o.duration} s × $${per}/s (${o.model}, ${o.resolution})` };
}
const round = (n) => Math.round(n * 1000) / 1000;

// ---------------------------------------------------------------------------------------------
// Peticiones y respuestas (formato REST oficial, ver docs/integrations/google-ai-studio.md)
export function buildImageBody({ text, refs = [], aspect, size, imageOnly = true }, style = 'responseFormat') {
  const parts = [{ text }, ...refs.map((r) => ({ inline_data: { mime_type: r.mime, data: r.data } }))];
  const image = { aspectRatio: aspect, imageSize: size };
  return {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: imageOnly ? ['IMAGE'] : ['TEXT', 'IMAGE'],
      ...(style === 'imageConfig' ? { imageConfig: image } : { responseFormat: { image } }),
    },
  };
}

/** Acepta camelCase y snake_case (la documentación usa ambos). */
export function parseImageResponse(json) {
  const out = { images: [], text: '', blocked: null };
  const cand = json?.candidates?.[0];
  if (json?.promptFeedback?.blockReason) out.blocked = `prompt bloqueado: ${json.promptFeedback.blockReason}`;
  for (const p of cand?.content?.parts ?? []) {
    const d = p.inlineData ?? p.inline_data;
    if (d?.data) out.images.push({ mime: d.mimeType ?? d.mime_type ?? 'image/png', data: d.data });
    else if (p.text) out.text += p.text;
  }
  if (!out.images.length && !out.blocked && cand?.finishReason && cand.finishReason !== 'STOP') out.blocked = `sin imagen (finishReason: ${cand.finishReason})`;
  return out;
}

export function buildVideoBody({ text, image, lastFrame, refs = [], aspect, resolution, duration, negativePrompt, personGeneration }) {
  const instance = { prompt: text };
  if (image) instance.image = { inlineData: { mimeType: image.mime, data: image.data } };
  if (lastFrame) instance.lastFrame = { inlineData: { mimeType: lastFrame.mime, data: lastFrame.data } };
  if (refs.length) instance.referenceImages = refs.map((r) => ({ image: { inlineData: { mimeType: r.mime, data: r.data } }, referenceType: 'asset' }));
  const parameters = { aspectRatio: aspect, resolution, durationSeconds: String(duration), numberOfVideos: 1 };
  if (negativePrompt) parameters.negativePrompt = negativePrompt;
  if (personGeneration) parameters.personGeneration = personGeneration;
  return { instances: [instance], parameters };
}

export function parseOperation(json) {
  const gen = json?.response?.generateVideoResponse;
  const sample = gen?.generatedSamples?.[0]?.video;
  return {
    name: json?.name ?? null,
    done: json?.done === true,
    error: json?.error ? `${json.error.code ?? ''} ${json.error.message ?? 'error desconocido'}`.trim() : null,
    uri: sample?.uri ?? null,
    filtered: { count: gen?.raiMediaFilteredCount ?? 0, reasons: gen?.raiMediaFilteredReasons ?? [] },
  };
}

// ---------------------------------------------------------------------------------------------
// Ficha PLAN B: todo lo necesario para producir el material por otra vía y adjuntarlo
/**
 * @param {object} s {kind:'image'|'video', name, page, role, aspect, duration, withAudio, type, prompt, feedback, preserve,
 *                    references, resolution, model, usdEstimate, generated}
 * @param {object} cfg config/gemini-media.json
 * @param {object} budgets video-score config `budgets`
 */
export function buildPlanB(s, cfg, budgets = {}) {
  const name = sanitizeName(s.name);
  const L = [];
  const push = (...x) => L.push(...x);
  const prompt = buildPrompt({ prompt: s.prompt, feedback: s.feedback, hasReferences: (s.references ?? []).length > 0, preserve: s.preserve ?? [] });
  push(`# Solicitud de material — ${name} (${s.kind === 'video' ? 'video' : 'imagen'})`, '');
  push('> Crea este material con la herramienta que prefieras (Canva, tu cámara, un generador de IA, un diseñador) y súbelo a la carpeta indicada. Con estas medidas y este texto, lo que adjuntes **encaja a la primera** en el sistema. Si el resultado no te convence, se repite la solicitud con la corrección.', '');
  push(`- **Página / uso:** ${s.page ?? '(sin asignar)'}${s.role ? ` · ${s.role}` : ''}`);
  push(`- **Proporción:** ${s.aspect}`);
  if (s.style) push('', '## Estilo a respetar', '', s.style);

  if (s.kind === 'image') {
    const m = masterSize(s.aspect, cfg.master.imageLongSidePx);
    push('', '## Medidas exactas (imagen)', '');
    push('| Qué | Valor |', '|---|---|');
    push(`| Tamaño del máster | **${m.w} × ${m.h} px** (${s.aspect}) |`);
    push('| Formato de entrega | JPG, PNG, WebP o AVIF (**no SVG**) |');
    push('| Peso máximo de subida | **4 MB** (el editor optimiza solo a WebP en 480/960/1600 px y quita los metadatos) |');
    push(`| Peso objetivo ya optimizado | ≤ ${Math.round(cfg.master.imageWebTargetBytes / 1000)} KB (el editor avisa por encima y bloquea por encima de 900 KB) |`);
    push('| Color | sRGB |');
    push('| Texto dentro de la imagen | Evítalo: no es accesible ni traducible. El texto va en el sitio |');
    push('| Texto alternativo | **Obligatorio** (descríbela para quien no la ve) o márcala como decorativa |');
    push('', '## Dónde subirla', '');
    push(`1. **Para que la revise:** sube el archivo a \`creative/inbox/${name}.jpg\` (o .png/.webp) y dime «subí ${name}». Comprobaré medidas, proporción y peso contra esta ficha.`);
    push(`2. **En el sitio:** con el editor visual, botón **Subir imagen** del bloque (Portada, Imagen…). La aprobación final es tuya.`);
  } else {
    const m = masterSize(s.aspect, 1920);
    const b = budgets[s.type] ?? null;
    const ver = { w: m.w, h: m.h };
    push('', '## Medidas exactas (video)', '');
    push('| Qué | Valor |', '|---|---|');
    push(`| Tamaño del máster | **${ver.w} × ${ver.h} px** (${s.aspect}) — mínimo 1080 px en el lado corto |`);
    push('| Formato del máster | **MP4 (H.264, yuv420p)**; también vale MOV/ProRes (se recodifica) |');
    push(`| Fotogramas | ${cfg.master.videoFps.join(' o ')} fps |`);
    push(`| Duración | **${s.duration ?? 8} s**${b ? ` (máximo del tipo «${s.type}»: ${b.max_seconds} s)` : ''}; que empiece y termine limpio para poder repetirse en bucle |`);
    push(`| Peso del máster | hasta ${Math.round(cfg.master.videoMasterMaxBytes / 1e6)} MB (límite de subida desde el navegador de GitHub); el sistema lo comprime${b ? ` hasta **≤ ${(b.max_bytes / 1e6).toFixed(1)} MB** por proporción` : ''} |`);
    push(`| Audio | ${s.withAudio ? '**Con audio:** exige archivo de subtítulos `.vtt`' : '**Sin audio** (lo habitual en un fondo de página; el sistema lo quita si lo trae)'} |`);
    push('| Entregables extra | **Poster** (un fotograma representativo, WebP) y **fallback estático** (imagen) |');
    push('', '## Dónde adjuntarlo y qué ejecutar', '');
    push(`1. Sube el máster a \`creative/inbox/${name}.mp4\` (si lleva audio, también \`${name}.vtt\`) y dime «subí ${name}»: comprobaré duración, proporción, resolución y peso contra esta ficha.`);
    push(`2. Con mi visto bueno, se optimiza (genera MP4 por proporción + poster y lo registra **como borrador**):`);
    push('   ```bash');
    push(`   node scripts/media-optimize.mjs --in creative/inbox/${name}.mp4 --out-dir creative/generated-drafts --name ${name} --aspects ${s.aspect}${s.type ? ` --type ${s.type}` : ''}${s.page ? ` --register --page ${s.page}` : ''}`);
    push('   ```');
    push('3. Revisa el resultado; **la aprobación y el paso a `public/media/` son tuyos**.');
  }

  push('', '## Prompt (cópialo tal cual en la herramienta que uses)', '');
  push('```text', prompt, '```', '');
  push('**Evitar (prompt negativo):** texto o marcas de agua dentro de la imagen, logotipos deformados o inventados, manos o rostros distorsionados, producto distinto al de la referencia.');
  if ((s.preserve ?? []).length) push('', `**Debe conservarse sin cambios:** ${s.preserve.join(', ')}.`);
  if ((s.references ?? []).length) push('', '**Imágenes de referencia (adjúntalas en la herramienta):**', ...s.references.map((r) => `- \`${r}\``));
  if (s.feedback) push('', `**Corrección pedida tras el intento anterior:** ${s.feedback}`);
  if (s.generated) push('', `**Intento generado con IA:** \`${s.generated}\` (borrador; no se publica sin tu aprobación).`);
  push('', '## Antes de publicar', '');
  push('- [ ] El producto, la forma, los colores y el logotipo coinciden con la referencia aprobada.');
  push('- [ ] Tienes derechos de uso del material (propio, con licencia o generado con una herramienta que lo permita).');
  push('- [ ] Texto alternativo escrito; video con poster y fallback; con audio, subtítulos.');
  push(`- [ ] ${SYNTH_ID_NOTE}`);
  return `${L.join('\n')}\n`;
}
