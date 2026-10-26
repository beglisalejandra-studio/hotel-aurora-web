// Reglas del guardián PreToolUse. Lógica pura y testeable: evaluate(input, ctx) → {decision, reason}.
// decision: 'allow' | 'deny' | 'ask'.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { run } from './util.mjs';

/** Patrones de secretos de alta precisión (evitan falsos positivos con texto normal). */
export const SECRET_PATTERNS = [
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['Stripe live key', /\b(?:sk|rk)_live_[0-9A-Za-z]{16,}\b/],
  ['Stripe webhook secret', /\bwhsec_[0-9A-Za-z]{16,}\b/],
  ['Anthropic API key', /\bsk-ant-[A-Za-z0-9_-]{20,}\b/],
  ['OpenAI-style API key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{40,}\b/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,})\b/],
  ['Slack token', /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
  ['Figma token', /\bfigd_[A-Za-z0-9_-]{20,}\b/],
  ['Private key block', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY/],
];

export function findSecrets(text) {
  if (!text) return [];
  return SECRET_PATTERNS.filter(([, re]) => re.test(text)).map(([name]) => name);
}

const deny = (reason) => ({ decision: 'deny', reason });
const ask = (reason) => ({ decision: 'ask', reason });
const allow = () => ({ decision: 'allow', reason: '' });

const ENV_FILE = /(?:^|\/)\.env(?:\.[A-Za-z0-9_.-]+)?$/;
const ENV_SAFE_SUFFIX = /\.(?:example|sample|template|dist)$/;

export function isSecretEnvFile(p) {
  const base = String(p ?? '').replace(/\\/g, '/');
  return ENV_FILE.test(base) && !ENV_SAFE_SUFFIX.test(base);
}

function productionApproved(cwd) {
  if (process.env.WEB_OS_APPROVED_PROD === '1') return true; // variable del proceso padre, no inline
  try {
    const f = path.join(cwd || process.cwd(), '.web-os', 'approvals', 'production.json');
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    return Boolean(j.approved_by) && Date.parse(j.expires_at) > Date.now();
  } catch {
    return false;
  }
}

function currentBranch(cwd) {
  // symbolic-ref funciona también en repos sin commits (rev-parse --abbrev-ref HEAD falla ahí).
  const r = run('git', ['symbolic-ref', '--short', '-q', 'HEAD'], { cwd, timeout: 2000 });
  return r.ok ? r.stdout : null;
}

const REMOTE_EXEC = [
  /\b(?:curl|wget)\b[^|;&\n]*\|\s*(?:sudo\s+(?:-\S+\s+)*)?(?:ba|z|da|k)?sh\b/,
  /\b(?:curl|wget)\b[^|;&\n]*\|\s*(?:sudo\s+)?(?:python3?|node|perl|ruby)\b/,
  /\b(?:ba|z)?sh\s+<\(\s*(?:curl|wget)\b/,
  /\b(?:ba|z)?sh\s+-c\s+["']?\$\(\s*(?:curl|wget)\b/,
];

const PROD_DEPLOY = [
  /\bvercel\b[^;&|\n]*\s--prod\b/,
  /\bnetlify\s+deploy\b[^;&|\n]*\s--prod\b/,
  /\bgh\s+release\s+create\b/,
  /\bfirebase\s+deploy\b/,
  /\bwrangler\s+(?:pages\s+)?(?:deploy|publish)\b/,
];

// Otros alojamientos/infraestructura (el sistema no presupone un proveedor): no sabemos si es preview o
// producción, así que se ESCALA al usuario (ask). Con aprobación de producción vigente se permite.
const HOST_DEPLOY_ASK = [
  /\bfly(?:ctl)?\s+(?:deploy|launch)\b/,
  /\brailway\s+(?:up|deploy)\b/,
  /\brender\s+deploy\b/,
  /\baws\s+s3\s+(?:sync|cp|mv|rm)\b[^;&|\n]*s3:\/\//,
  /\baws\s+(?:amplify|lambda\s+update-function-code|cloudfront\s+create-invalidation)\b/,
  /\bgcloud\s+(?:app|run|functions)\s+deploy\b/,
  /\baz\s+(?:webapp|staticwebapp|functionapp)\s+(?:deploy|up)\b/,
  /(?:^|[;&|]\s*)(?:npx\s+)?surge\s/,
  /\b(?:rsync|scp)\b[^;&|\n]*\s[\w.-]+@[\w.-]+:/,
  /\bkubectl\s+(?:apply|delete|rollout|scale)\b/,
  /\bterraform\s+(?:apply|destroy)\b/,
  /\bdocker\s+push\b/,
  /\b(?:sls|serverless)\s+deploy\b/,
  /\b(?:sst|cdk)\s+deploy\b/,
];

function tokensAfter(cmd, re) {
  const m = re.exec(cmd);
  if (!m) return null;
  return cmd
    .slice(m.index + m[0].length)
    .split(/[;&|\n]/)[0]
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

const QUOTED = '"(?:[^"\\\\]|\\\\.)*"|\'[^\']*\'';
const INTERPRETER_BEFORE = /(?:^|[;&|(]\s*)(?:sudo\s+(?:-\S+\s+)*)?(?:(?:ba|z|da|k)?sh|python3?|node|perl|ruby)(?:\s+-\S+)*\s*$/;

/**
 * Quita texto INERTE antes de analizar la orden: mensajes de commit/PR y cuerpos de heredoc.
 * Evita falsos positivos (p. ej. un mensaje de commit que menciona "curl|bash") sin abrir un hueco:
 *  - un valor con sustitución de comandos ($(…) o `…`) SE CONSERVA (se ejecutaría);
 *  - un heredoc que alimenta a un intérprete (bash <<EOF …) SE CONSERVA;
 *  - un heredoc SIN comillas en el delimitador con sustitución de comandos SE CONSERVA (con <<'EOF' es inerte).
 */
export function stripInertText(cmd) {
  let out = cmd.replace(/<<-?\s*(['"]?)(\w+)\1[^\n]*\n[\s\S]*?\n[ \t]*\2[ \t]*(?=\n|$)/g, (m, _q, _tag, offset) => {
    const before = cmd.slice(0, offset);
    const lineStart = before.lastIndexOf('\n') + 1;
    const head = cmd.slice(lineStart, offset + m.indexOf('<<'));
    // Delimitador entrecomillado (<<'EOF'): el shell NO expande nada en el cuerpo, así que `…` y $(…) son texto inerte.
    const expands = !_q && /\$\(|`/.test(m);
    return INTERPRETER_BEFORE.test(head.trimEnd()) || expands ? m : '<<HEREDOC';
  });
  out = out.replace(new RegExp(`((?:-[a-zA-Z]*m|--message|--body|--title|--notes|--description)(?:=|\\s+))(${QUOTED})`, 'g'), (m, opt, val) =>
    /\$\(|`/.test(val) ? m : `${opt}"…"`,
  );
  return out;
}

function evalBash(rawCmd, cwd) {
  const cmd = stripInertText(rawCmd);
  for (const re of REMOTE_EXEC) {
    if (re.test(cmd)) return deny('Ejecutar scripts remotos sin auditar (curl|bash y similares) está prohibido. Descarga, revisa y fija checksum primero.');
  }

  // git push --force (se permite --force-with-lease)
  const pushArgs = tokensAfter(cmd, /\bgit\s+push\b/);
  if (pushArgs) {
    if (pushArgs.some((t) => t === '--force' || t === '-f' || /^-[a-zA-Z]*f[a-zA-Z]*$/.test(t))) {
      return deny('git push --force está prohibido. Usa --force-with-lease en tu propia rama si es imprescindible.');
    }
    const positional = pushArgs.filter((t) => !t.startsWith('-'));
    const refspecs = positional.slice(1); // positional[0] = remote
    // Destino de cada refspec: lo que hay tras el último ':' (HEAD:main, <sha>:refs/heads/main, feat:main…).
    const defaults = /^(?:refs\/heads\/)?(?:main|master)$/;
    if (refspecs.some((r) => r.startsWith('+'))) return deny('Un refspec con "+" equivale a force push: prohibido.');
    if (refspecs.some((r) => defaults.test(r.includes(':') ? r.split(':').pop() : r))) {
      return deny('Push directo a la rama por defecto prohibido: trabaja en una rama y abre un PR. (Si es la creación inicial de main, requiere autorización humana explícita y hacerse fuera de este guardián.)');
    }
    if (!refspecs.length) {
      const b = currentBranch(cwd);
      if (b === 'main' || b === 'master') return deny(`Estás en '${b}': crea una rama de trabajo y abre un PR en lugar de hacer push directo.`);
    }
  }

  if (/\b(?:npm|pnpm|yarn)\s+publish\b/.test(cmd)) return deny('Publicar paquetes requiere aprobación humana explícita fuera del agente.');

  if (PROD_DEPLOY.some((re) => re.test(cmd)) && !productionApproved(cwd)) {
    return deny('Despliegue/publicación a PRODUCCIÓN bloqueado: requiere aprobación humana (.web-os/approvals/production.json creado por una persona, o WEB_OS_APPROVED_PROD=1 en el entorno del proceso). Usa preview/staging.');
  }

  if (HOST_DEPLOY_ASK.some((re) => re.test(cmd)) && !productionApproved(cwd)) {
    return ask('Esta orden publica o modifica infraestructura/alojamiento. Confirma que es preview/staging; producción requiere aprobación humana explícita.');
  }

  // rm -rf peligroso
  const rm = tokensAfter(cmd, /\brm\b/);
  if (rm) {
    const recursive = rm.some((t) => /^-[a-zA-Z]*[rR]/.test(t) || t === '--recursive');
    const risky = new Set(['/', '/*', '~', '~/', '$HOME', '${HOME}', '.', '..', '.git', '*', './*']);
    if (recursive && rm.filter((t) => !t.startsWith('-')).some((t) => risky.has(t))) {
      return deny('rm recursivo sobre raíz/home/directorio actual/.git bloqueado.');
    }
  }

  // Lectura de .env reales
  const readVerbs = /^\s*(?:cat|less|more|head|tail|bat|xxd|strings|grep|rg|sed|awk|cp|mv|base64|source|\.)\b/;
  if (readVerbs.test(cmd)) {
    const toks = cmd.split(/\s+/).map((t) => t.replace(/^["'<]+|["';)]+$/g, ''));
    if (toks.some((t) => isSecretEnvFile(t))) return deny('Leer archivos .env reales está bloqueado (secretos). Usa .env.example y la validación de entorno.');
  }
  if (/^\s*(?:env|printenv)\b/.test(cmd) && !/cut\s+-d\s*=|awk\s+-F\s*=|sed\s+["']s\/=\.\*\/|wc\b|grep\s+-c\b/.test(cmd)) {
    return ask('Volcar variables de entorno puede exponer secretos. Si solo necesitas nombres usa: env | cut -d= -f1');
  }

  if (/\bclaude\s+mcp\s+(?:add|add-json)\b/.test(cmd)) return ask('Registrar un servidor MCP amplía los permisos del agente: confirma origen, licencia y alcance.');

  return allow();
}

function targetPath(input) {
  return input.file_path ?? input.path ?? input.notebook_path ?? '';
}

function newContent(input) {
  const parts = [];
  if (typeof input.content === 'string') parts.push(input.content);
  if (typeof input.new_string === 'string') parts.push(input.new_string);
  if (Array.isArray(input.edits)) for (const e of input.edits) if (typeof e?.new_string === 'string') parts.push(e.new_string);
  return parts.join('\n');
}

function evalWrite(input, cwd) {
  const p = targetPath(input);
  const norm = String(p).replace(/\\/g, '/');

  if (isSecretEnvFile(norm)) return deny('El agente no escribe archivos .env reales. Declara la variable en .env.example (sin valor) y configura el secreto en el gestor del proveedor.');
  if (/(?:^|\/)\.web-os\/approvals\//.test(norm)) return deny('Las aprobaciones las crea una persona. El agente no puede auto-aprobarse.');
  if (/(?:^|\/)\.git\/(?!info\/exclude$)/.test(norm)) return deny('No se edita el interior de .git (hooks, config) desde el agente.');

  const claude = path.join(process.env.WEB_OS_CLAUDE_DIR || process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude'));
  const abs = path.resolve(cwd || process.cwd(), norm);
  if (abs === path.join(claude, 'settings.json') || abs === path.join(claude, 'CLAUDE.md')) {
    return ask('Cambiar la configuración GLOBAL de Claude Code afecta a todos los proyectos. Confirma el cambio.');
  }

  const found = findSecrets(newContent(input));
  if (found.length) return deny(`El contenido contiene lo que parece un secreto (${found.join(', ')}). Nunca se escribe en archivos: usa variables de entorno / gestor de secretos.`);
  return allow();
}

/** input = JSON del hook (tool_name, tool_input, cwd). */
export function evaluate(hookInput) {
  const tool = hookInput?.tool_name;
  const ti = hookInput?.tool_input ?? {};
  const cwd = hookInput?.cwd || process.cwd();
  if (tool === 'Bash') return evalBash(String(ti.command ?? ''), cwd);
  if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(tool)) return evalWrite(ti, cwd);
  return allow();
}
