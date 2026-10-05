// Detección del tipo de proyecto (nuevo / existente / rediseño / mantenimiento).
// Sin red, rápida (se usa en hooks). Devuelve señales además de la conclusión.
import fs from 'node:fs';
import path from 'node:path';
import { exists, readJson, readText, run } from './util.mjs';

export const REQUIRED_DOCS = ['PRODUCT.md', 'DESIGN.md', 'PROJECT.md', 'CLAUDE.md'];

/** Front-matter mínimo (`---` … `---`, líneas `clave: valor`). */
export function parseFrontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text ?? '');
  const data = {};
  if (!m) return data;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_.-]+):\s*(.*?)\s*$/.exec(line);
    if (kv && !line.trimStart().startsWith('#')) data[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return data;
}

export function hasPlaceholders(text) {
  return /\{\{[A-Z0-9_]+\}\}/.test(text ?? '');
}

export function detectProject(cwd) {
  const s = { cwd, kind: 'none', docs: {}, missingDocs: [], frontMatter: {}, signals: [] };

  // Repo del propio sistema
  if (exists(path.join(cwd, 'global', 'CLAUDE.global.md')) && exists(path.join(cwd, 'scripts', 'bootstrap.mjs'))) {
    s.kind = 'system';
    s.signals.push('repo del sistema (web-os)');
    return s;
  }

  const pkg = readJson(path.join(cwd, 'package.json'), null);
  const deps = { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) };
  const framework = ['next', 'astro', 'vite', 'react', 'vue', 'svelte', '@remix-run/react', 'nuxt'].find((d) => deps[d]);
  const hasHtml = exists(path.join(cwd, 'index.html'));
  const hasApp = ['app', 'src/app', 'pages', 'src/pages'].some((d) => exists(path.join(cwd, d)));
  if (framework) s.signals.push(`framework: ${framework}`);
  if (hasHtml) s.signals.push('index.html');
  if (hasApp) s.signals.push('app/pages');

  // Otros stacks/alojamientos comunes: el sistema NO presupone Next.js.
  const STACK_FILES = [
    ['astro.config.mjs', 'astro'], ['astro.config.ts', 'astro'], ['next.config.js', 'next'], ['next.config.mjs', 'next'], ['next.config.ts', 'next'],
    ['nuxt.config.ts', 'nuxt'], ['svelte.config.js', 'svelte'], ['vite.config.ts', 'vite'], ['vite.config.js', 'vite'],
    ['wp-config.php', 'wordpress'], ['wp-content', 'wordpress'], ['theme.json', 'wordpress/shopify'], ['functions.php', 'wordpress'],
    ['layout/theme.liquid', 'shopify'], ['shopify.theme.toml', 'shopify'], ['hugo.toml', 'hugo'], ['hugo.yaml', 'hugo'], ['config.toml', 'hugo?'],
    ['_config.yml', 'jekyll'], ['.eleventy.js', 'eleventy'], ['eleventy.config.js', 'eleventy'], ['netlify.toml', 'netlify'], ['vercel.json', 'vercel'], ['wrangler.toml', 'cloudflare'], ['firebase.json', 'firebase'],
  ];
  let stackFile = null;
  for (const [f, name] of STACK_FILES) {
    if (exists(path.join(cwd, f))) {
      s.signals.push(`${name} (${f})`);
      if (!/netlify|vercel|cloudflare|firebase|hugo\?/.test(name)) stackFile = stackFile ?? name;
    }
  }

  for (const d of REQUIRED_DOCS) {
    s.docs[d] = exists(path.join(cwd, d));
    if (!s.docs[d]) s.missingDocs.push(d);
  }

  const projectMd = readText(path.join(cwd, 'PROJECT.md'));
  if (projectMd) {
    s.frontMatter = parseFrontMatter(projectMd);
    s.placeholders = hasPlaceholders(projectMd);
  }

  const webSignal = framework || hasHtml || hasApp || stackFile;
  if (!projectMd && !webSignal) return s; // kind: none

  const git = run('git', ['rev-list', '--count', 'HEAD'], { cwd, timeout: 3000 });
  const commits = git.ok ? parseInt(git.stdout, 10) || 0 : 0;
  s.commits = commits;

  const fm = s.frontMatter;
  if (fm.type === 'maintenance' || fm.status === 'maintenance') s.kind = 'maintenance';
  else if (fm.type === 'redesign') s.kind = 'redesign';
  else if (projectMd && (s.placeholders || fm.status === 'discovery' || fm.status === 'new')) s.kind = 'new';
  else if (projectMd) s.kind = 'existing';
  else if (webSignal && commits > 0) s.kind = 'unmanaged'; // web existente sin sistema → proponer /init-client --adopt
  else s.kind = 'new';
  return s;
}

/** Estado "state/last-doctor.json" para mostrar en el banner sin ejecutar el doctor. */
export function lastDoctor(home) {
  try {
    const p = path.join(home, 'state', 'last-doctor.json');
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    return { at: j.at, counts: j.counts, blocked: j.blocked ?? [] };
  } catch {
    return null;
  }
}
