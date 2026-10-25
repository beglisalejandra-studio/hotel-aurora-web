#!/usr/bin/env node
// PostToolUse (Write|Edit|MultiEdit): valida creative/manifest.json y avisa de placeholders en código de producción.
// No bloquea (la edición ya ocurrió): devuelve contexto para que el agente corrija.
import fs from 'node:fs';
import path from 'node:path';
import { emit, failOpen, lib, once, readStdin } from './_load.mjs';

const PLACEHOLDER = /(?:picsum\.photos|placehold\.co|via\.placeholder\.com|lorem ipsum|dummyimage\.com)/i;

try {
  const input = await readStdin();
  if (!once(input.tool_use_id && `post-edit:${input.tool_use_id}`)) process.exit(0);
  const ti = input.tool_input ?? {};
  const file = ti.file_path ?? '';
  if (!file) process.exit(0);
  const cwd = input.cwd || process.cwd();
  const abs = path.resolve(cwd, file);
  const rel = path.relative(cwd, abs).replace(/\\/g, '/');
  const notes = [];

  if (rel === 'creative/manifest.json') {
    const { readJson } = await lib('util.mjs');
    const { validateManifest } = await lib('manifest.mjs');
    const { webOsHome } = await lib('util.mjs');
    const cfg =
      readJson(path.join(cwd, 'creative', 'video-score.config.json')) ??
      readJson(path.join(webOsHome(), 'config', 'video-score.default.json')) ??
      readJson(path.join(cwd, 'config', 'video-score.default.json'));
    const m = readJson(abs);
    if (!m) notes.push('creative/manifest.json no es JSON válido.');
    else {
      const { errors, warnings } = validateManifest(m, cfg);
      if (errors.length) notes.push(`manifest.json inválido:\n- ${errors.join('\n- ')}`);
      else if (warnings.length) notes.push(`manifest.json válido con avisos:\n- ${warnings.slice(0, 5).join('\n- ')}`);
    }
  }

  if (/^(?:app|src|components|content|pages|lib)\//.test(rel)) {
    let text = ti.content ?? ti.new_string ?? '';
    if (!text) {
      try {
        text = fs.readFileSync(abs, 'utf8');
      } catch {
        /* ignore */
      }
    }
    if (PLACEHOLDER.test(text)) {
      notes.push(`Placeholder detectado en ${rel} (picsum/placehold/lorem ipsum). No va a producción: usa media aprobada de creative/manifest.json o márcalo explícitamente como pendiente.`);
    }
  }

  if (!notes.length) process.exit(0);
  emit({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `[web-os] ${notes.join('\n')}` } });
} catch (e) {
  failOpen(e);
}
