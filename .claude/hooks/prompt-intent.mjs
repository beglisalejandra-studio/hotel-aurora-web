#!/usr/bin/env node
// UserPromptSubmit: detecta intención web, modo (auto/explicativo) y secretos pegados.
// No inyecta nada si el mensaje no es relevante (0 tokens extra).
import { emit, failOpen, lib, once, readStdin } from './_load.mjs';

try {
  const input = await readStdin();
  const text = input.prompt_text ?? input.prompt ?? '';
  if (!once(input.session_id && `prompt:${input.session_id}:${input.prompt_id ?? text.length}`)) process.exit(0);
  const { analyzePrompt, buildPromptContext } = await lib('intent.mjs');
  const { detectProject } = await lib('detect.mjs');
  const a = analyzePrompt(text);
  if (!a.webIntent && !a.secrets.length) process.exit(0);
  const project = a.webIntent ? detectProject(input.cwd || process.cwd()) : null;
  emit({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: buildPromptContext(a, project) } });
} catch (e) {
  failOpen(e);
}
