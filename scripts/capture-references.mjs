#!/usr/bin/env node
// Captura determinista de referencias web (complementa al MCP de Playwright, que es interactivo).
//   node scripts/capture-references.mjs [--urls creative/references/urls.md] [--out creative/references]
//        [--only <slug>] [--timeout-ms 30000] [--delay-ms 1500] [--allow-local]
// Por URL: screenshots desktop (1440×900) y móvil (390×844), snapshot ARIA y JSON con estructura
// (título, meta, nav, h1–h3, CTAs con contraste, formularios, footer, tipografía/color, medios, motion).
// Extrae material de ANÁLISIS interno: no se publica ni se copia contenido protegido.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { ROOT, findChrome, webOsHome, writeFileEnsured } from './lib/util.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const flag = (n) => argv.includes(n);
const urlsFile = opt('--urls', 'creative/references/urls.md');
const outDir = opt('--out', 'creative/references');
const only = opt('--only', null);
const timeout = Number(opt('--timeout-ms', 30000));
const delay = Number(opt('--delay-ms', 1500));
const allowLocal = flag('--allow-local');

function loadPlaywright() {
  const bases = [process.cwd(), path.join(webOsHome(), 'tools'), path.join(ROOT, 'tools'), ROOT];
  for (const b of bases) {
    try {
      return createRequire(path.join(b, 'noop.js'))('playwright-core');
    } catch { /* siguiente */ }
  }
  throw new Error('playwright-core no encontrado. Ejecuta: npm run bootstrap (herramientas globales) o instala @playwright/test en el proyecto.');
}

/** Guarda anti-SSRF: solo http(s); sin metadatos de nube ni redes privadas salvo --allow-local. */
export function checkUrl(u) {
  let url;
  try {
    url = new URL(u);
  } catch {
    return 'URL inválida';
  }
  if (!['http:', 'https:'].includes(url.protocol)) return `protocolo no permitido (${url.protocol})`;
  const h = url.hostname;
  if (/^169\.254\./.test(h) || h === 'metadata.google.internal') return 'host de metadatos bloqueado';
  if (!allowLocal && (h === 'localhost' || /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.)/.test(h) || h === '::1' || h.endsWith('.internal') || h.endsWith('.local'))) {
    return 'host local/privado bloqueado (usa --allow-local solo para tus propias páginas de prueba)';
  }
  return null;
}

export function parseUrls(text) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith('<!--')) continue;
    const m = /(https?:\/\/[^\s)>\]"']+)/.exec(line);
    if (!m) continue;
    const note = line.split(/\s[—–-]\s/).slice(1).join(' — ').trim();
    out.push({ url: m[1], note });
  }
  return out;
}

export function slugify(u) {
  const x = new URL(u);
  return `${x.hostname}${x.pathname}`.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 80) || 'pagina';
}

// Se ejecuta dentro de la página (sin dependencias).
function extractInPage() {
  const txt = (el) => (el?.innerText || el?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 160);
  const parse = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c || '');
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const bgOf = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c && c.a > 0.5) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const contrast = (el) => {
    const fg = parse(getComputedStyle(el).color);
    if (!fg) return null;
    const a = lum(fg);
    const b = lum(bgOf(el));
    return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
  };
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const cs = (el, props) => Object.fromEntries(props.map((p) => [p, getComputedStyle(el)[p]]));
  const body = document.body;
  const h1 = document.querySelector('h1');
  const ctaSel = 'a[class*="btn" i],a[class*="cta" i],a[class*="button" i],button,[role="button"],a[href^="#"][class]';
  const ctas = [...document.querySelectorAll(ctaSel)].filter((e) => txt(e) && e.offsetParent !== null).slice(0, 12).map((e) => ({
    text: txt(e), href: e.getAttribute('href'), contrast: contrast(e), aboveFold: box(e).y < innerHeight,
    ...cs(e, ['backgroundColor', 'color', 'fontSize', 'borderRadius']), box: box(e),
  }));
  const forms = [...document.forms].slice(0, 5).map((f) => ({
    id: f.id || null, action: f.getAttribute('action'), method: f.method,
    fields: [...f.elements].filter((x) => x.name || x.id).slice(0, 25).map((x) => ({
      name: x.name || x.id, type: x.type || x.tagName.toLowerCase(), required: !!x.required,
      label: (x.labels?.[0] && txt(x.labels[0])) || x.getAttribute('aria-label') || x.placeholder || null,
    })),
    submit: txt(f.querySelector('[type=submit],button')) || null,
  }));
  let reducedMotionRules = 0;
  for (const s of document.styleSheets) {
    try { for (const r of s.cssRules) if (r.media && /prefers-reduced-motion/.test(r.media.mediaText)) reducedMotionRules++; } catch { /* CORS */ }
  }
  const footer = document.querySelector('footer');
  const sections = [...document.querySelectorAll('section, header, main > div')].slice(0, 12);
  return {
    title: document.title, lang: document.documentElement.lang || null,
    description: document.querySelector('meta[name=description]')?.content || null,
    canonical: document.querySelector('link[rel=canonical]')?.href || null,
    ogImage: document.querySelector('meta[property="og:image"]')?.content || null,
    headings: { h1: [...document.querySelectorAll('h1')].map(txt), h2: [...document.querySelectorAll('h2')].slice(0, 15).map(txt), h3: [...document.querySelectorAll('h3')].slice(0, 15).map(txt) },
    nav: [...document.querySelectorAll('nav a')].slice(0, 25).map((a) => ({ text: txt(a), href: a.getAttribute('href') })),
    hero: h1 ? { h1: txt(h1), ...cs(h1, ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'color']), box: box(h1), heroHeight: box(h1.closest('header, section, div') || h1).h } : null,
    ctas, forms,
    footer: footer ? { textLength: (footer.innerText || '').length, links: footer.querySelectorAll('a').length } : null,
    typography: { body: cs(body, ['fontFamily', 'fontSize', 'lineHeight', 'color']), backgroundColor: getComputedStyle(body).backgroundColor },
    spacing: sections.map((s) => ({ tag: s.tagName.toLowerCase(), paddingTop: getComputedStyle(s).paddingTop, paddingBottom: getComputedStyle(s).paddingBottom, height: Math.round(s.getBoundingClientRect().height) })),
    media: {
      images: document.images.length, imagesWithoutAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
      videos: [...document.querySelectorAll('video')].map((v) => ({ autoplay: v.autoplay, muted: v.muted, loop: v.loop, poster: !!v.poster, sources: v.querySelectorAll('source').length })),
    },
    motion: { runningAnimations: document.getAnimations().length, reducedMotionRules },
    density: { elements: document.getElementsByTagName('*').length, scripts: document.scripts.length, pageHeight: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
  };
}

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

async function main() {
  if (!fs.existsSync(urlsFile)) {
    console.error(`No existe ${urlsFile}. Crea el archivo con una URL por línea.`);
    process.exit(2);
  }
  const rawText = fs.readFileSync(urlsFile, 'utf8');
  for (const line of rawText.split(/\r?\n/)) {
    const bad = /\b(file|ftp|gopher|data|javascript|chrome|about):[^\s]*/i.exec(line);
    if (bad && !line.trim().startsWith('#')) console.log(`⚠ línea ignorada (protocolo no permitido): ${bad[0].slice(0, 60)}`);
  }
  let targets = parseUrls(rawText);
  if (only) targets = targets.filter((t) => slugify(t.url) === only);
  if (!targets.length) {
    console.error('No hay URLs que procesar.');
    process.exit(2);
  }
  const { chromium } = loadPlaywright();
  const exe = findChrome();
  const browser = await chromium.launch({ headless: true, executablePath: exe ?? undefined, args: process.getuid?.() === 0 ? ['--no-sandbox'] : [] });
  let failed = 0;
  for (const [i, t] of targets.entries()) {
    const slug = slugify(t.url);
    const blocked = checkUrl(t.url);
    const rec = { url: t.url, note: t.note || null, slug, capturedAt: new Date().toISOString() };
    if (blocked) {
      rec.error = blocked;
      failed++;
      console.log(`✗ ${slug}: ${blocked}`);
    } else {
      try {
        for (const [vp, opts] of Object.entries(VIEWPORTS)) {
          const ctx = await browser.newContext({ ...opts, locale: 'es-ES', reducedMotion: 'no-preference' });
          const page = await ctx.newPage();
          const resp = await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: timeout });
          await page.waitForLoadState('load', { timeout: Math.min(timeout, 15000) }).catch(() => {});
          await page.waitForTimeout(800);
          rec.status = resp?.status() ?? null;
          rec.finalUrl = page.url();
          rec[vp] = await page.evaluate(extractInPage);
          const tall = rec[vp].density.pageHeight > 12000;
          await page.screenshot({ path: path.join(outDir, 'screenshots', `${slug}-${vp}.png`), fullPage: !tall });
          if (tall) (rec.warnings ??= []).push(`${vp}: página muy larga (${rec[vp].density.pageHeight}px): captura solo del viewport`);
          if (vp === 'desktop') writeFileEnsured(path.join(outDir, 'extracted', `${slug}.aria.txt`), await page.locator('body').ariaSnapshot().catch(() => '(ariaSnapshot no disponible)'));
          await ctx.close();
        }
        console.log(`✓ ${slug} (HTTP ${rec.status}) → screenshots/${slug}-{desktop,mobile}.png · extracted/${slug}.json`);
      } catch (e) {
        rec.error = String(e.message || e).split('\n')[0];
        failed++;
        console.log(`✗ ${slug}: ${rec.error}`);
      }
    }
    writeFileEnsured(path.join(outDir, 'extracted', `${slug}.json`), JSON.stringify(rec, null, 2) + '\n');
    if (i < targets.length - 1) await new Promise((r) => setTimeout(r, delay)); // cortesía con el sitio
  }
  await browser.close();
  console.log(`\n${targets.length - failed}/${targets.length} capturadas. Siguiente: escribe ${outDir}/reference-analysis.md (principios, no clones).`);
  process.exit(failed === targets.length ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
