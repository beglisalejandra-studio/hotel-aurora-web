// Utilidades de media: ffprobe, validación de presupuestos y ejecución de ffmpeg SIN shell.
import fs from 'node:fs';
import { run, which } from './util.mjs';

export const ASPECTS = {
  '16:9': { w: 1920, h: 1080, tag: '16x9' },
  '1:1': { w: 1080, h: 1080, tag: '1x1' },
  '9:16': { w: 1080, h: 1920, tag: '9x16' },
};

export function requireFfmpeg() {
  const miss = ['ffmpeg', 'ffprobe'].filter((b) => !which(b));
  if (miss.length) {
    const e = new Error(`Faltan ${miss.join(' y ')}. Instala con: npm run bootstrap -- --with-video (apt-get install -y ffmpeg)`);
    e.code = 'NO_FFMPEG';
    throw e;
  }
}

/** ffprobe → {duration_s, bytes, width, height, codec, pix_fmt, fps, hasAudio, aspect} */
export function probe(file) {
  requireFfmpeg();
  const r = run('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file], { timeout: 60000 });
  if (!r.ok) throw new Error(`ffprobe falló para ${file}: ${r.stderr.split('\n')[0]}`);
  const j = JSON.parse(r.stdout);
  const v = (j.streams ?? []).find((s) => s.codec_type === 'video');
  if (!v) throw new Error(`${file} no contiene pista de video`);
  const [n, d] = String(v.avg_frame_rate || v.r_frame_rate || '0/1').split('/').map(Number);
  const w = v.width;
  const h = v.height;
  const ratio = w / h;
  const aspect = Math.abs(ratio - 16 / 9) < 0.02 ? '16:9' : Math.abs(ratio - 1) < 0.02 ? '1:1' : Math.abs(ratio - 9 / 16) < 0.02 ? '9:16' : `${w}:${h}`;
  return {
    duration_s: Math.round(Number(j.format?.duration ?? v.duration ?? 0) * 100) / 100,
    bytes: fs.statSync(file).size,
    width: w, height: h, codec: v.codec_name, pix_fmt: v.pix_fmt, fps: d ? Math.round((n / d) * 100) / 100 : null,
    hasAudio: (j.streams ?? []).some((s) => s.codec_type === 'audio'), aspect,
  };
}

/** Compara contra presupuesto del tipo (config.budgets[type]). Devuelve lista de problemas. */
export function checkBudget(info, type, config, { allowAudio = false } = {}) {
  const problems = [];
  const b = config?.budgets?.[type];
  if (b) {
    if (info.duration_s > b.max_seconds) problems.push(`duración ${info.duration_s}s > ${b.max_seconds}s`);
    if (info.bytes > b.max_bytes) problems.push(`peso ${info.bytes} B > ${b.max_bytes} B`);
  }
  if (info.codec !== 'h264' && info.codec !== 'vp9' && info.codec !== 'av1') problems.push(`códec ${info.codec} poco compatible en web (usa h264/vp9/av1)`);
  if (info.codec === 'h264' && info.pix_fmt !== 'yuv420p') problems.push(`pix_fmt ${info.pix_fmt}: usa yuv420p (compatibilidad iOS/Safari)`);
  if (info.hasAudio && !allowAudio) problems.push('tiene audio: el autoplay solo funciona mudo (quita audio o añade captions y control)');
  if (!config?.aspects?.includes(info.aspect)) problems.push(`proporción ${info.aspect} fuera de ${config?.aspects?.join(', ')}`);
  return problems;
}

export function ffmpeg(args) {
  const r = run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { timeout: 600000 });
  if (!r.ok) throw new Error(`ffmpeg falló: ${r.stderr.split('\n').slice(-3).join(' | ')}`);
}

export function filterFor(aspect) {
  const { w, h } = ASPECTS[aspect];
  // Rellena el encuadre y recorta al centro (si el sujeto no está centrado, ajusta el crop a mano).
  return `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},setsar=1,fps=30`;
}
