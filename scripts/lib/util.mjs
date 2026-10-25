// Utilidades compartidas. Sin dependencias externas (auditable).
// Funciona igual desde el repo fuente (./scripts/lib) y desde la copia instalada
// (~/.claude/web-os/scripts/lib): ROOT siempre es "dos niveles arriba".
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function claudeDir() {
  return process.env.WEB_OS_CLAUDE_DIR || process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}

export function webOsHome() {
  return process.env.WEB_OS_HOME || path.join(claudeDir(), 'web-os');
}

/** Ruta de un recurso del sistema: primero el árbol actual (repo fuente / proyecto), luego la copia instalada. */
export function resolveAsset(...rel) {
  for (const base of [ROOT, webOsHome()]) {
    const p = path.join(base, ...rel);
    try {
      fs.accessSync(p);
      return p;
    } catch {
      /* siguiente */
    }
  }
  return path.join(ROOT, ...rel);
}

/** Ejecuta un binario SIN shell (evita inyección). */
export function run(cmd, args = [], opts = {}) {
  const r = spawnSync(cmd, args, {
    encoding: 'utf8',
    timeout: opts.timeout ?? 15000,
    cwd: opts.cwd,
    env: opts.env ?? process.env,
    input: opts.input,
    maxBuffer: 16 * 1024 * 1024,
  });
  return {
    ok: r.status === 0 && !r.error,
    status: r.status,
    stdout: (r.stdout || '').trim(),
    stderr: (r.stderr || '').trim(),
    error: r.error ? String(r.error.code || r.error.message) : null,
  };
}

export function which(cmd) {
  const exts = process.platform === 'win32' ? (process.env.PATHEXT || '.EXE;.CMD').split(';') : [''];
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    if (!dir) continue;
    for (const ext of exts) {
      const p = path.join(dir, cmd + ext);
      try {
        fs.accessSync(p, fs.constants.X_OK);
        if (fs.statSync(p).isFile()) return p;
      } catch {
        /* siguiente */
      }
    }
  }
  return null;
}

export function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

export function readText(p, fallback = null) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return fallback;
  }
}

export function readJson(p, fallback = null) {
  const t = readText(p);
  if (t == null) return fallback;
  try {
    return JSON.parse(t);
  } catch {
    return fallback;
  }
}

/** Devuelve {ok, value, error} para distinguir "no existe" de "JSON roto". */
export function readJsonStrict(p) {
  const t = readText(p);
  if (t == null) return { ok: false, missing: true, error: 'no existe' };
  try {
    return { ok: true, value: JSON.parse(t) };
  } catch (e) {
    return { ok: false, missing: false, error: e.message };
  }
}

export function writeFileEnsured(p, content, mode) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, mode ? { mode } : undefined);
}

export function sha256File(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

export function sha256Text(t) {
  return crypto.createHash('sha256').update(t).digest('hex');
}

/** Lista recursiva de ficheros (rutas relativas, orden estable). */
export function walk(dir, { ignore = ['node_modules', '.git'] } = {}) {
  const out = [];
  (function rec(d, rel) {
    let ents;
    try {
      ents = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    ents.sort((a, b) => a.name.localeCompare(b.name));
    for (const e of ents) {
      if (ignore.includes(e.name)) continue;
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) rec(path.join(d, e.name), r);
      else if (e.isFile()) out.push(r);
    }
  })(dir, '');
  return out;
}

/** Copia recursiva. Devuelve lista de rutas destino escritas. */
export function copyTree(src, dst, { filter } = {}) {
  const written = [];
  for (const rel of walk(src)) {
    if (filter && !filter(rel)) continue;
    const to = path.join(dst, rel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(src, rel), to);
    try {
      fs.chmodSync(to, fs.statSync(path.join(src, rel)).mode);
    } catch {
      /* ignore */
    }
    written.push(to);
  }
  return written;
}

export function parseVersion(str) {
  const m = String(str ?? '').match(/(\d+)\.(\d+)(?:\.(\d+))?/);
  return m ? `${m[1]}.${m[2]}.${m[3] ?? 0}` : null;
}

/** -1, 0, 1 (ignora sufijos prerelease: comparación conservadora). */
export function cmpVersion(a, b) {
  const pa = String(a).split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return 1;
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return -1;
  }
  return 0;
}

/** Busca un Chromium utilizable (para Lighthouse / Playwright MCP / capturas). */
export function findChrome() {
  const cands = [];
  if (process.env.CHROME_PATH) cands.push(process.env.CHROME_PATH);
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (pw && exists(pw)) {
    cands.push(path.join(pw, 'chromium'));
    try {
      for (const d of fs.readdirSync(pw).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse()) {
        cands.push(path.join(pw, d, 'chrome-linux', 'chrome'));
        cands.push(path.join(pw, d, 'chrome-linux64', 'chrome'));
      }
    } catch {
      /* ignore */
    }
  }
  cands.push('/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable');
  cands.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  for (const c of cands) if (c && exists(c)) return fs.realpathSync(c);
  return null;
}

/** Bloque delimitado en un fichero de texto (CLAUDE.md) sin pisar contenido ajeno. */
export const BLOCK_BEGIN = '<!-- web-os:begin (gestionado por bootstrap; no editar dentro del bloque) -->';
export const BLOCK_END = '<!-- web-os:end -->';

export function upsertBlock(text, body) {
  const block = `${BLOCK_BEGIN}\n${body}\n${BLOCK_END}`;
  const re = new RegExp(`${escapeRe(BLOCK_BEGIN)}[\\s\\S]*?${escapeRe(BLOCK_END)}`);
  if (re.test(text)) return text.replace(re, block);
  const sep = text && !text.endsWith('\n') ? '\n\n' : text ? '\n' : '';
  return `${text}${sep}${block}\n`;
}

export function removeBlock(text) {
  const re = new RegExp(`\\n?${escapeRe(BLOCK_BEGIN)}[\\s\\S]*?${escapeRe(BLOCK_END)}\\n?`);
  return text.replace(re, '\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const STATUS = Object.freeze({
  OK: 'OK',
  MISSING: 'MISSING',
  MISCONFIGURED: 'MISCONFIGURED',
  BLOCKED: 'BLOCKED',
  OPTIONAL: 'OPTIONAL',
  OUTDATED: 'OUTDATED',
});

export function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
