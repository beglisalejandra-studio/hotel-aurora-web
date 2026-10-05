#!/usr/bin/env node
// PreToolUse (Bash|Write|Edit|MultiEdit): guardián de seguridad del workflow.
// Bloquea: curl|bash, force-push, push directo a main, publicar/producción sin aprobación,
// rm -rf peligrosos, lectura/escritura de .env reales, secretos en contenido, auto-aprobaciones.
import { emit, failOpen, lib, readStdin } from './_load.mjs';

try {
  const input = await readStdin();
  const { evaluate } = await lib('guard-rules.mjs');
  const r = evaluate(input);
  if (r.decision === 'allow') process.exit(0);
  emit({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: r.decision,
      permissionDecisionReason: `[web-os] ${r.reason}`,
    },
  });
} catch (e) {
  failOpen(e);
}
