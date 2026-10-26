// Datos DUROS para la revisión del sistema (sin opiniones): versiones, upstream de terceros, acciones de GitHub y auditoría.
// La lógica es pura o recibe el ejecutor (`run`) por parámetro para poder probarla sin red. Nada aquí instala ni cambia pines.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { evaluateAudit } from './audit-gate.mjs';
import { readJson, walk } from './util.mjs';

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/;

/** Compara una versión fijada con la última publicada. */
export function classifyBump(pinned, latest) {
  const a = SEMVER.exec(String(pinned ?? '').replace(/^[v^~=]+/, ''));
  const b = SEMVER.exec(String(latest ?? '').replace(/^[v^~=]+/, ''));
  if (!a || !b) return 'unknown';
  for (const [i, name] of [[1, 'major'], [2, 'minor'], [3, 'patch']]) {
    const x = Number(a[i]);
    const y = Number(b[i]);
    if (y > x) return name;
    if (y < x) return 'ahead';
  }
  return 'same';
}

export function ageDays(iso, now = Date.now()) {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? Math.floor((now - t) / 86400000) : null;
}

/** Extrae {action, sha, tag} de líneas `uses: owner/repo@<sha> # vTAG` de un workflow. */
export function parseActionUses(text) {
  const out = [];
  for (const m of String(text).matchAll(/uses:\s*([\w.-]+\/[\w./-]+)@([0-9a-f]{40})\s*#\s*(v[\w.]+)/g)) {
    out.push({ action: m[1], sha: m[2], tag: m[3] });
  }
  return out;
}

/** Mayor etiqueta `vN` (solo major) presente en la salida de `git ls-remote --tags`. */
export function highestMajorTag(lsRemote) {
  let best = null;
  for (const line of String(lsRemote).split('\n')) {
    const m = /refs\/tags\/v(\d+)$/.exec(line.trim());
    if (m && (best === null || Number(m[1]) > best)) best = Number(m[1]);
  }
  return best;
}

const npmView = (run, pkg) => {
  const r = run('npm', ['view', pkg, '--json', 'dist-tags.latest', 'time.modified', 'license', 'deprecated'], { timeout: 30000 });
  if (!r.ok) return { error: r.error || r.stderr.split('\n')[0] || 'npm view falló' };
  try {
    const j = JSON.parse(r.stdout);
    return { latest: j['dist-tags.latest'] ?? null, modified: j['time.modified'] ?? null, license: j.license ?? null, deprecated: j.deprecated ?? null };
  } catch {
    return { error: 'respuesta no interpretable' };
  }
};

/** Si el salto está bloqueado por una causa documentada, devuelve su entrada. */
export function blockerFor(blockers, name, latest) {
  const major = Number(/^(\d+)\./.exec(String(latest ?? ''))?.[1]);
  return (blockers ?? []).find((b) => b.name === name && Number.isFinite(major) && major >= b.majorAtLeast) ?? null;
}

function depTable(run, deps, now, blockers) {
  return Object.entries(deps ?? {}).map(([name, pinned]) => {
    const v = npmView(run, name);
    if (v.error) return { name, pinned, error: v.error };
    const blocked = blockerFor(blockers, name, v.latest);
    return { name, pinned, latest: v.latest, bump: classifyBump(pinned, v.latest), modifiedDaysAgo: ageDays(v.modified, now), license: v.license, deprecated: v.deprecated, ...(blocked ? { blocked: { reason: blocked.reason, revisitWhen: blocked.revisitWhen } } : {}) };
  });
}

/**
 * Audita las dependencias de la PLANTILLA (no tiene lockfile en el repo: se resuelve en un directorio temporal con
 * `--package-lock-only`, sin instalar nada) y aplica la misma puerta que usarán los proyectos, con sus excepciones.
 */
/**
 * Dependencias que aportan los MÓDULOS de la plantilla (cada module.json de template/modules). No están en template/package.json
 * (solo entran en un proyecto al aplicar el módulo), pero deben vigilarse igual: el editor visual trae Puck, sanitize-html…
 */
export function moduleDeps(root) {
  const dir = path.join(root, 'template', 'modules');
  const out = { dependencies: {}, devDependencies: {} };
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const meta = readJson(path.join(dir, e.name, 'module.json'), {});
    for (const k of ['dependencies', 'devDependencies']) Object.assign(out[k], meta[k] ?? {});
  }
  return out;
}

export function auditTemplate({ root, run, now = Date.now() }) {
  const tpl = path.join(root, 'template', 'package.json');
  if (!fs.existsSync(tpl)) return { error: 'la plantilla no tiene package.json' };
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wos-tpl-audit-'));
  try {
    const base = readJson(tpl, {});
    const mods = moduleDeps(root);
    // La plantilla + TODOS los módulos juntos: el peor caso que puede llegar a un proyecto.
    const merged = { ...base, dependencies: { ...mods.dependencies, ...base.dependencies }, devDependencies: { ...mods.devDependencies, ...base.devDependencies } };
    fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify(merged));
    const lock = run('npm', ['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: tmp, timeout: 180000 });
    if (!lock.ok) return { error: `no se pudo resolver el árbol de la plantilla: ${lock.stderr.split('\n')[0] || lock.error}` };
    const json = (args) => {
      const r = run('npm', ['audit', '--json', ...args], { cwd: tmp, timeout: 120000 });
      try {
        return JSON.parse(r.stdout);
      } catch {
        return null;
      }
    };
    const all = json([]);
    const prod = json(['--omit=dev']);
    if (!all || !prod) return { error: 'npm audit de la plantilla no devolvió JSON interpretable' };
    const ex = readJson(path.join(root, 'template', 'config', 'audit-exceptions.json'), {}).exceptions ?? [];
    const r = evaluateAudit({ all, prod, exceptions: ex, now });
    return { ok: r.ok, failures: r.failures, warnings: r.warnings, accepted: r.accepted, production: r.summary.production, total: r.summary.total };
  } catch (e) {
    return { error: e.message };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

/**
 * Reúne los hechos. `run(cmd, args, opts)` devuelve {ok, stdout, stderr, error}. Con `offline` no toca la red.
 * Los fallos se anotan en `errors`: un dato que no se pudo obtener NUNCA se inventa.
 */
export function collectFacts({ root, run, now = Date.now(), offline = false }) {
  const facts = { generatedAt: new Date(now).toISOString(), offline, tools: [], template: [], vendor: [], actions: [], audit: null, errors: [] };
  if (offline) {
    facts.errors.push('modo --offline: no se consultó npm, git ni GitHub');
    return facts;
  }

  const toolsPkg = readJson(path.join(root, 'tools', 'package.json'), {});
  const tplPkg = readJson(path.join(root, 'template', 'package.json'), {});
  const blockers = readJson(path.join(root, 'config', 'update-blockers.json'), {}).blockers ?? [];
  facts.tools = depTable(run, toolsPkg.dependencies, now, blockers);
  const mods = moduleDeps(root);
  facts.template = depTable(run, { ...mods.dependencies, ...mods.devDependencies, ...tplPkg.dependencies, ...tplPkg.devDependencies }, now, blockers);

  // Terceros vendorizados / opcionales: ¿avanzó el upstream desde el commit fijado?
  const vendor = readJson(path.join(root, 'config', 'vendor.json'), {});
  const versions = readJson(path.join(root, 'config', 'versions.json'), {});
  const pins = [
    ...Object.entries(vendor).filter(([k, v]) => !k.startsWith('_') && v?.repo).map(([name, v]) => ({ name, repo: v.repo, pin: v.commit, license: v.license })),
    ...Object.entries(versions.optionalExternal ?? {}).map(([name, v]) => ({ name, repo: v.repo, pin: v.commit, license: v.license })),
  ];
  for (const p of pins) {
    const r = run('git', ['ls-remote', p.repo, 'HEAD'], { timeout: 30000 });
    if (!r.ok) {
      facts.vendor.push({ ...p, error: r.error || r.stderr.split('\n')[0] || 'ls-remote falló' });
      continue;
    }
    const head = r.stdout.split(/\s+/)[0];
    facts.vendor.push({ ...p, upstreamHead: head, advanced: head !== p.pin });
  }

  // Acciones de GitHub fijadas por SHA: ¿sigue siendo el SHA de su etiqueta y hay una mayor nueva?
  const wf = [];
  for (const dir of ['.github', 'template/.github']) {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of walk(abs)) if (/workflows\/.*\.ya?ml$/.test(f)) wf.push(fs.readFileSync(path.join(abs, f), 'utf8'));
  }
  const seen = new Map();
  for (const t of wf) for (const u of parseActionUses(t)) seen.set(`${u.action}@${u.tag}`, u);
  for (const u of seen.values()) {
    const base = `https://github.com/${u.action.split('/').slice(0, 2).join('/')}`;
    const tagRes = run('git', ['ls-remote', base, `refs/tags/${u.tag}`, `refs/tags/${u.tag}^{}`], { timeout: 30000 });
    const all = run('git', ['ls-remote', '--tags', base, 'refs/tags/v*'], { timeout: 30000 });
    const entry = { ...u };
    if (!tagRes.ok || !all.ok) {
      entry.error = tagRes.error || all.error || 'ls-remote falló';
    } else {
      const shas = tagRes.stdout.split('\n').map((l) => l.split(/\s+/)[0]).filter(Boolean);
      entry.tagSha = shas.at(-1) ?? null; // el último es el commit desreferenciado si la etiqueta es anotada
      entry.shaMatchesTag = shas.includes(u.sha);
      const cur = /^v(\d+)/.exec(u.tag);
      const hi = highestMajorTag(all.stdout);
      entry.newerMajor = cur && hi !== null && hi > Number(cur[1]) ? `v${hi}` : null;
    }
    facts.actions.push(entry);
  }

  // Avisos de seguridad de las herramientas fijadas (npm audit necesita lockfile: tools/ lo tiene).
  const au = run('npm', ['audit', '--json', '--prefix', path.join(root, 'tools')], { timeout: 60000, cwd: path.join(root, 'tools') });
  try {
    const j = JSON.parse(au.stdout || '{}');
    facts.audit = { scope: 'tools/', total: j.metadata?.vulnerabilities?.total ?? null, high: j.metadata?.vulnerabilities?.high ?? null, critical: j.metadata?.vulnerabilities?.critical ?? null };
  } catch {
    facts.errors.push('npm audit de tools/ no devolvió JSON interpretable');
  }
  facts.templateAudit = auditTemplate({ root, run, now });
  if (facts.templateAudit.error) facts.errors.push(`auditoría de la plantilla: ${facts.templateAudit.error}`);
  return facts;
}

/** Saltos bloqueados por causa documentada (se muestran aparte y NO se proponen). */
export function blocked(facts) {
  return [...facts.tools, ...facts.template].filter((t) => t.blocked).map((t) => `${t.name} ${t.pinned} → ${t.latest}: ${t.blocked.reason} Revisar cuando: ${t.blocked.revisitWhen}.`);
}

/** Lo que merece atención, sin adornos. */
export function attention(facts) {
  const out = [];
  for (const t of [...facts.tools.map((x) => ({ ...x, scope: 'tools' })), ...facts.template.map((x) => ({ ...x, scope: 'plantilla' }))]) {
    if (t.error || t.blocked) continue;
    if (t.deprecated) out.push(`${t.scope}: ${t.name} está DEPRECADO (${String(t.deprecated).slice(0, 80)})`);
    else if (t.bump === 'major') out.push(`${t.scope}: ${t.name} ${t.pinned} → ${t.latest} (versión MAYOR: revisar ADR y bloqueos)`);
    else if (t.bump === 'minor' || t.bump === 'patch') out.push(`${t.scope}: ${t.name} ${t.pinned} → ${t.latest} (${t.bump})`);
  }
  for (const v of facts.vendor) if (v.advanced) out.push(`upstream de ${v.name} avanzó (${v.pin.slice(0, 7)} → ${v.upstreamHead.slice(0, 7)}): revisar el diff antes de cambiar el pin`);
  for (const a of facts.actions) {
    if (a.newerMajor) out.push(`acción ${a.action} ${a.tag} → existe ${a.newerMajor}`);
    if (a.shaMatchesTag === false) out.push(`acción ${a.action}: el SHA fijado ya no es el de ${a.tag} (etiqueta movida o actualizada)`);
  }
  for (const f of facts.templateAudit?.failures ?? []) out.push(`auditoría de la PLANTILLA: ${f}`);
  if (facts.audit && (facts.audit.high > 0 || facts.audit.critical > 0)) out.push(`npm audit (${facts.audit.scope}): ${facts.audit.high} high / ${facts.audit.critical} critical`);
  return out;
}

export function renderMarkdown(facts) {
  const L = [`# Hechos verificables — ${facts.generatedAt.slice(0, 10)}`, ''];
  if (facts.offline) return [...L, '_Modo offline: sin datos._', ''].join('\n');
  const rows = (arr) => arr.map((t) => (t.error ? `| ${t.name} | ${t.pinned} | — | — | no se pudo consultar: ${t.error} |` : `| ${t.name} | ${t.pinned} | ${t.latest} | ${t.bump} | ${t.modifiedDaysAgo ?? '?'} d · ${t.license ?? '?'}${t.deprecated ? ' · DEPRECADO' : ''} |`));
  for (const [title, arr] of [['Herramientas fijadas (tools/)', facts.tools], ['Dependencias de la plantilla', facts.template]]) {
    L.push(`## ${title}`, '', '| Paquete | Fijada | Última | Salto | Última publicación · licencia |', '|---|---|---|---|---|', ...rows(arr), '');
  }
  L.push('## Terceros vendorizados / opcionales', '', '| Nombre | Licencia | Pin | Upstream HEAD | ¿Avanzó? |', '|---|---|---|---|---|');
  for (const v of facts.vendor) L.push(v.error ? `| ${v.name} | ${v.license} | ${v.pin.slice(0, 7)} | — | no se pudo consultar: ${v.error} |` : `| ${v.name} | ${v.license} | ${v.pin.slice(0, 7)} | ${v.upstreamHead.slice(0, 7)} | ${v.advanced ? 'SÍ' : 'no'} |`);
  L.push('', '## Acciones de GitHub', '', '| Acción | Etiqueta | SHA = etiqueta | Mayor nueva |', '|---|---|---|---|');
  for (const a of facts.actions) L.push(a.error ? `| ${a.action} | ${a.tag} | — | no se pudo consultar: ${a.error} |` : `| ${a.action} | ${a.tag} | ${a.shaMatchesTag ? 'sí' : 'NO'} | ${a.newerMajor ?? '—'} |`);
  L.push('', '## Seguridad', '', facts.audit ? `- npm audit de \`${facts.audit.scope}\`: ${facts.audit.total} total · ${facts.audit.high} high · ${facts.audit.critical} critical` : '- npm audit: sin datos', '');
  const ta = facts.templateAudit;
  if (ta && !ta.error) L.push(`- npm audit de la **plantilla** (con sus excepciones documentadas): ${ta.total} aviso(s) >= high · ${ta.production} en producción · ${ta.ok ? 'sin avisos nuevos' : 'CON avisos sin excepción'}`, ...ta.accepted.map((x) => `  - aceptado: ${x}`), ...ta.warnings.map((x) => `  - ⚠ ${x}`), '');
  const att = attention(facts);
  const blk = blocked(facts);
  L.push('## Requiere atención', '', ...(att.length ? att.map((x) => `- ${x}`) : ['- nada']), '');
  if (blk.length) L.push('## Bloqueado por causa documentada (no se propone)', '', ...blk.map((x) => `- ${x}`), '');
  if (facts.errors.length) L.push('## No se pudo comprobar', '', ...facts.errors.map((e) => `- ${e}`), '');
  return L.join('\n');
}

// ── Antigüedad de la última revisión (la usa el aviso de inicio de sesión) ──────────────────────────────────────────────

/** Fecha del informe más reciente `docs/research/AAAA-MM[-DD].md` o null. */
export function latestReportDate(dir) {
  if (!fs.existsSync(dir)) return null;
  let best = null;
  for (const f of fs.readdirSync(dir)) {
    const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?\.md$/.exec(f);
    if (!m) continue;
    const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3] ?? 1));
    if (best === null || t > best) best = t;
  }
  return best;
}

/** Mensaje de aviso si la revisión está vencida (o nunca se hizo); null si está al día. */
export function reviewNudge(dir, { cadenceDays = 30, now = Date.now() } = {}) {
  const last = latestReportDate(dir);
  if (last === null) return 'Revisión del sistema: aún no hay ningún informe. Ejecuta /web-system-update para investigar tendencias, skills y herramientas.';
  const days = Math.floor((now - last) / 86400000);
  return days > cadenceDays ? `Revisión del sistema: la última fue hace ${days} días (cadencia ${cadenceDays}). Ejecuta /web-system-update.` : null;
}
