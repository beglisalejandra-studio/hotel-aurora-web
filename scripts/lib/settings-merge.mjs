// Fusión NO destructiva de settings.json de Claude Code.
// - Solo toca hooks cuyo comando contiene MARKER (los nuestros) y permisos del fragmento.
// - Conserva todo lo que el usuario ya tenía.
import os from 'node:os';
import path from 'node:path';
import { claudeDir } from './util.mjs';

export const MARKER = '/web-os/hooks/'; // independiente de dónde esté el directorio de configuración

/** Sustituye {{CLAUDE_DIR}}: `$HOME/.claude` si es el directorio por defecto; ruta absoluta si es personalizado. */
export function resolveFragment(fragment, dir = claudeDir()) {
  const def = path.join(os.homedir(), '.claude');
  const token = dir === def ? '$HOME/.claude' : dir;
  return JSON.parse(JSON.stringify(fragment).replaceAll('{{CLAUDE_DIR}}', token.replace(/\\/g, '\\\\')));
}

const isOurs = (h) => typeof h?.command === 'string' && h.command.includes(MARKER);

export function stripOurs(settings) {
  const out = structuredClone(settings ?? {});
  if (out.hooks) {
    for (const ev of Object.keys(out.hooks)) {
      out.hooks[ev] = (out.hooks[ev] || [])
        .map((g) => ({ ...g, hooks: (g.hooks || []).filter((h) => !isOurs(h)) }))
        .filter((g) => g.hooks.length > 0);
      if (out.hooks[ev].length === 0) delete out.hooks[ev];
    }
    if (Object.keys(out.hooks).length === 0) delete out.hooks;
  }
  return out;
}

export function mergeSettings(existing, fragment) {
  const out = stripOurs(existing);
  for (const [ev, groups] of Object.entries(fragment.hooks ?? {})) {
    out.hooks ??= {};
    out.hooks[ev] = [...(out.hooks[ev] ?? []), ...structuredClone(groups)];
  }
  for (const key of ['allow', 'ask', 'deny']) {
    const add = fragment.permissions?.[key];
    if (!add?.length) continue;
    out.permissions ??= {};
    out.permissions[key] = [...new Set([...(out.permissions[key] ?? []), ...add])];
  }
  return out;
}

export function removeFragment(existing, fragment) {
  const out = stripOurs(existing);
  for (const key of ['allow', 'ask', 'deny']) {
    const del = new Set(fragment.permissions?.[key] ?? []);
    if (out.permissions?.[key]) {
      out.permissions[key] = out.permissions[key].filter((r) => !del.has(r));
      if (out.permissions[key].length === 0) delete out.permissions[key];
    }
  }
  if (out.permissions && Object.keys(out.permissions).length === 0) delete out.permissions;
  return out;
}

/** ¿Están registrados todos los eventos del fragmento con nuestro marcador? */
export function hooksRegistered(settings, fragment) {
  const missing = [];
  for (const [ev, groups] of Object.entries(fragment.hooks ?? {})) {
    const have = (settings?.hooks?.[ev] ?? []).flatMap((g) => g.hooks ?? []).filter(isOurs).map((h) => h.command);
    for (const g of groups) {
      for (const h of g.hooks) if (!have.includes(h.command)) missing.push(`${ev}: ${h.command}`);
    }
  }
  return missing;
}
