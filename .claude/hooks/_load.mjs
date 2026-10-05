// Cargador común de los hooks. Resuelve scripts/lib tanto desde el repo fuente
// (global/hooks → ../../scripts/lib) como desde la instalación (~/.claude/web-os/hooks → ../scripts/lib).
// Regla de oro: un hook NUNCA debe romper la sesión. Ante error interno → salir con 0 (fail-open);
// el doctor comprueba que el guardián realmente deniega (hooks-selftest).
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const libDir = [path.join(here, '..', 'scripts', 'lib'), path.join(here, '..', '..', 'scripts', 'lib')].find((d) =>
  fs.existsSync(path.join(d, 'util.mjs')),
);

export const lib = (name) => {
  if (!libDir) throw new Error('web-os: scripts/lib no encontrado');
  return import(pathToFileURL(path.join(libDir, name)).href);
};

export async function readStdin() {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  const txt = Buffer.concat(chunks).toString('utf8').trim();
  return txt ? JSON.parse(txt) : {};
}

export function emit(obj) {
  process.stdout.write(JSON.stringify(obj));
}

export function failOpen(e) {
  if (process.env.WEB_OS_DEBUG) process.stderr.write(`[web-os hook] ${e?.stack || e}\n`);
  process.exit(0);
}

/**
 * Dedupe entre hooks globales y de proyecto (la misma orden registrada en dos sitios se ejecuta dos veces).
 * Devuelve true solo la PRIMERA vez para esa clave; sin clave (p. ej. entradas de prueba) siempre true.
 */
export function once(key) {
  if (!key) return true;
  try {
    const f = path.join(os.tmpdir(), `web-os-once-${crypto.createHash('sha256').update(String(key)).digest('hex').slice(0, 24)}`);
    fs.closeSync(fs.openSync(f, 'wx'));
    return true;
  } catch (e) {
    return e?.code === 'EEXIST' ? false : true; // ante cualquier otro error, no suprimir
  }
}
