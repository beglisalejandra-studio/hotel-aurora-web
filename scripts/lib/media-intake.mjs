// Flujo MANUAL de material audiovisual (el principal del sistema): el agente pide la imagen/video con estilo, medidas y prompt;
// la persona lo produce por su cuenta y lo sube a creative/inbox/; aquí se comprueba contra lo pedido. Lógica pura y sin
// dependencias (las cabeceras de imagen se leen a mano). La E/S está en scripts/media-request.mjs y scripts/media-intake.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { masterSize } from './gemini-media.mjs';

export const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
export const VIDEO_EXTS = ['.mp4', '.mov', '.webm'];

/** Ancho y alto leyendo solo la cabecera (PNG, JPEG, WebP). AVIF no se interpreta: devuelve null. */
export function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), type: 'png' };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7), type: 'jpeg' };
      i += 2 + buf.readUInt16BE(i + 2);
    }
    return null;
  }
  if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff, type: 'webp' };
    if (chunk === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1, type: 'webp' };
    }
    if (chunk === 'VP8X') return { w: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)), h: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)), type: 'webp' };
  }
  return null;
}

const ratio = (a) => {
  const [x, y] = String(a).split(':').map(Number);
  return x / y;
};
const near = (r1, r2, tol = 0.02) => Math.abs(r1 - r2) / r2 <= tol;

/** Solicitud estructurada (se guarda junto a la ficha; es lo que se comprueba al recibir el archivo). */
export function makeRequest(s, cfg, budgets = {}) {
  const base = { name: s.name, kind: s.kind, aspect: s.aspect, page: s.page ?? null, role: s.role ?? null, status: 'requested', requested_at: new Date().toISOString() };
  if (s.kind === 'image') {
    const m = masterSize(s.aspect, cfg.master.imageLongSidePx);
    return { ...base, master: m, min_long_side: 1600, max_bytes: cfg.master.imageUploadMaxBytes, exts: IMAGE_EXTS };
  }
  const m = masterSize(s.aspect, 1920);
  const b = budgets[s.type] ?? null;
  return { ...base, type: s.type ?? null, master: m, duration_s: s.duration, max_seconds: b?.max_seconds ?? null, with_audio: Boolean(s.withAudio), max_bytes: cfg.master.videoMasterMaxBytes, exts: VIDEO_EXTS };
}

/** Comprueba una imagen recibida contra la solicitud. Devuelve {errors, warnings, info}. */
export function checkImage({ file, buf, req }) {
  const errors = [];
  const warnings = [];
  const ext = path.extname(file).toLowerCase();
  if (ext === '.svg') errors.push('SVG no se admite (usa JPG, PNG, WebP o AVIF).');
  else if (!req.exts.includes(ext)) errors.push(`formato ${ext || 'desconocido'} no admitido (${req.exts.join(', ')}).`);
  if (buf.length > req.max_bytes) errors.push(`pesa ${(buf.length / 1e6).toFixed(1)} MB y el máximo es ${(req.max_bytes / 1e6).toFixed(0)} MB: expórtala con más compresión.`);
  const dim = imageSize(buf);
  if (!dim) {
    if (ext !== '.avif') errors.push('no se pudo leer la cabecera: ¿el archivo está dañado o es de otro formato con extensión cambiada?');
    else warnings.push('AVIF: no se pudieron comprobar las medidas; verifícalas a mano.');
    return { errors, warnings, info: { bytes: buf.length } };
  }
  const long = Math.max(dim.w, dim.h);
  if (!near(dim.w / dim.h, ratio(req.aspect))) errors.push(`proporción ${dim.w}×${dim.h} (${(dim.w / dim.h).toFixed(2)}) no coincide con ${req.aspect}: recórtala a ${req.master.w}×${req.master.h} px.`);
  if (long < req.min_long_side) errors.push(`muy pequeña (${dim.w}×${dim.h}): el lado mayor debe ser al menos ${req.min_long_side} px; lo pedido era ${req.master.w}×${req.master.h} px.`);
  else if (long < Math.max(req.master.w, req.master.h) * 0.95) warnings.push(`mide ${dim.w}×${dim.h}; lo ideal era ${req.master.w}×${req.master.h} px (sirve, pero con menos margen para pantallas grandes).`);
  return { errors, warnings, info: { w: dim.w, h: dim.h, bytes: buf.length, type: dim.type } };
}

/** Comprueba un video con los datos de ffprobe (`probe` de lib/media.mjs). */
export function checkVideo({ file, info, req, hasCaptions }) {
  const errors = [];
  const warnings = [];
  const ext = path.extname(file).toLowerCase();
  if (!req.exts.includes(ext)) errors.push(`formato ${ext} no admitido (${req.exts.join(', ')}).`);
  if (info.bytes > req.max_bytes) errors.push(`pesa ${(info.bytes / 1e6).toFixed(1)} MB y el máximo del máster es ${(req.max_bytes / 1e6).toFixed(0)} MB (el límite de subida de GitHub desde el navegador es 25 MB): exporta con menos bitrate.`);
  if (req.max_seconds && info.duration_s > req.max_seconds + 0.5) errors.push(`dura ${info.duration_s} s y el máximo del tipo «${req.type}» es ${req.max_seconds} s.`);
  else if (req.duration_s && Math.abs(info.duration_s - req.duration_s) > 1.5) warnings.push(`dura ${info.duration_s} s y se pidieron ${req.duration_s} s.`);
  const r = info.width / info.height;
  if (!near(r, ratio(req.aspect))) errors.push(`proporción ${info.width}×${info.height} no coincide con ${req.aspect}: exporta a ${req.master.w}×${req.master.h} px.`);
  if (Math.min(info.width, info.height) < 720) errors.push(`resolución baja (${info.width}×${info.height}): mínimo 720 px en el lado corto; lo pedido era ${req.master.w}×${req.master.h}.`);
  else if (Math.min(info.width, info.height) < 1080) warnings.push(`${info.width}×${info.height}: sirve, pero lo pedido era ${req.master.w}×${req.master.h} px.`);
  if (info.codec && info.codec !== 'h264') warnings.push(`códec ${info.codec}: se recodificará a H.264 al optimizar.`);
  if (info.hasAudio && !req.with_audio) warnings.push('trae audio y se pidió sin audio: el optimizador lo quitará.');
  if (req.with_audio && !info.hasAudio) errors.push('se pidió CON audio pero el archivo no trae pista de audio.');
  if (req.with_audio && !hasCaptions) errors.push('con audio hacen falta subtítulos: sube también un archivo .vtt con el mismo nombre.');
  return { errors, warnings, info };
}

// ---------------------------------------------------------------------------------------------
/** Bloque «Estilo a respetar»: dirección de DESIGN.md (si ya está rellenada), paleta/tipografías del editor y referencias. */
export function styleBlock(cwd = '.') {
  const L = [];
  const read = (p) => (fs.existsSync(path.join(cwd, p)) ? fs.readFileSync(path.join(cwd, p), 'utf8') : '');
  const design = read('DESIGN.md');
  const dir = /## 1\. Direcci[óo]n([\s\S]*?)(?=\n## )/.exec(design)?.[1]?.split('\n').filter((l) => l.trim().startsWith('-') && !l.includes('{{')) ?? [];
  if (dir.length) L.push('**Dirección visual (DESIGN.md):**', ...dir.map((l) => l.trim()));
  let theme = null;
  try {
    theme = JSON.parse(read('content/theme.json') || 'null');
  } catch { /* sin tema */ }
  if (theme?.colors) {
    const c = theme.colors;
    L.push(`**Paleta del sitio:** fondo ${c.background} · texto ${c.foreground} · color principal ${c.accent} · tarjetas ${c.surface}. **Tipografías:** títulos «${theme.fonts?.heading}», texto «${theme.fonts?.body}».`);
  }
  const refDir = path.join(cwd, 'creative', 'references');
  if (fs.existsSync(refDir)) {
    const files = fs.readdirSync(refDir).filter((f) => !f.startsWith('.') && f !== 'screenshots');
    if (files.length) L.push(`**Referencias aprobadas (principios, no clonar):** ${files.slice(0, 8).map((f) => `\`creative/references/${f}\``).join(', ')}`);
  }
  if (!L.length) L.push('_Aún no hay dirección visual escrita en `DESIGN.md` ni tema del editor: completa `DESIGN.md` §1 (palabras clave y qué evitar) para que las solicitudes salgan con tu estilo._');
  return L.join('\n');
}
