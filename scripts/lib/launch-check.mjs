// Comprobaciones de entrega sobre una URL publicada. Solo `node:*`, sin dependencias.
// Cada comprobación devuelve { id, status, msg }: pass | fail | warn | skip | manual.
// Lo que no se puede probar desde fuera (altas en buscadores, backups, avisos de caída…) sale como `manual`.
import tls from 'node:tls';

export const MANUAL = [
  ['search-console', 'Alta y verificación de la propiedad en Google Search Console y envío del sitemap'],
  ['bing', 'Alta en Bing Webmaster Tools (puede importarse desde Search Console) y envío del sitemap'],
  ['ssl-renovacion', 'Confirmar en el proveedor que la renovación del certificado SSL es automática'],
  ['backups', 'Copias de seguridad automáticas activas, con una restauración de prueba hecha y anotada'],
  ['uptime', 'Aviso si la web se cae (monitor externo con alerta a correo o WhatsApp de responsables)'],
  ['intenciones', 'Una página por intención de búsqueda: tabla palabra clave → página, sin canibalización'],
  ['enlaces-internos', 'Jerarquía de enlaces internos: toda página a ≤3 clics del inicio y sin páginas huérfanas'],
  ['redes-reales', 'Los íconos de redes llevan a las cuentas REALES del cliente (confirmadas por él)'],
  ['navegadores', 'Probada en Chrome, Safari (WebKit), Firefox y móviles (npm run e2e:cross + prueba en un teléfono real)'],
  ['conversiones', 'Medición de conversiones verificada con consentimiento (eventos visibles en GA4 DebugView o equivalente)'],
  ['comentarios', 'Existe un canal de comentarios/valoración tras la conversión y alguien responsable de leerlo'],
];

const SOCIAL = /(?:facebook|instagram|twitter|x|linkedin|tiktok|youtube|youtu|pinterest|wa|whatsapp|t)\.(?:com|me|be)/i;
const PLACEHOLDER_TEXT = /lorem ipsum|picsum\.photos|placehold(?:er)?\.(?:co|it|com)|example\.(?:com|org)|your@email|test@test|\bTODO\b|\bPRUEBA\b|texto de ejemplo|aqu[ií] va el texto/i;

const r = (id, status, msg) => ({ id, status, msg });
const attr = (tag, name) => new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i').exec(tag)?.[2] ?? new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i').exec(tag)?.[3];
const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
const meta = (html, key, val) => tags(html, 'meta').find((t) => (attr(t, key) ?? '').toLowerCase() === val.toLowerCase());
const metaContent = (html, key, val) => {
  const t = meta(html, key, val);
  return t ? attr(t, 'content') : undefined;
};

/** Variantes de origen que deben terminar en una sola versión (http/https × con/sin www). */
export function originVariants(url) {
  const u = new URL(url);
  const apex = u.hostname.replace(/^www\./, '');
  const out = [];
  for (const proto of ['http:', 'https:']) for (const host of [apex, `www.${apex}`]) out.push(`${proto}//${host}${u.port ? `:${u.port}` : ''}/`);
  return out;
}

/** Comprobaciones puras sobre el HTML de la portada (y sus cabeceras). */
export function analyzeHtml(html, { url, headers = {} } = {}) {
  const out = [];
  const origin = url ? new URL(url).origin : '';
  const robotsMeta = (metaContent(html, 'name', 'robots') ?? '') + ' ' + (metaContent(html, 'name', 'googlebot') ?? '');
  const xrobots = String(headers['x-robots-tag'] ?? '');
  out.push(/noindex/i.test(robotsMeta + ' ' + xrobots) ? r('noindex', 'fail', 'La portada tiene noindex (meta o X-Robots-Tag): quítalo al publicar') : r('noindex', 'pass', 'Sin noindex'));

  const canon = tags(html, 'link').filter((t) => (attr(t, 'rel') ?? '').toLowerCase() === 'canonical');
  if (canon.length !== 1) out.push(r('canonical', 'fail', `Debe haber 1 URL canónica y hay ${canon.length}`));
  else {
    const href = attr(canon[0], 'href') ?? '';
    if (!/^https?:\/\//i.test(href)) out.push(r('canonical', 'fail', `La canónica no es absoluta: ${href}`));
    else if (origin && new URL(href).origin !== origin) out.push(r('canonical', 'fail', `La canónica apunta a otro origen: ${href}`));
    else out.push(r('canonical', 'pass', href));
  }

  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim() ?? '';
  out.push(!title ? r('title', 'fail', 'Falta <title>') : title.length > 70 ? r('title', 'warn', `Título largo (${title.length} > 70)`) : r('title', 'pass', title));
  const desc = metaContent(html, 'name', 'description') ?? '';
  out.push(!desc ? r('description', 'fail', 'Falta meta description') : desc.length < 50 || desc.length > 170 ? r('description', 'warn', `Descripción de ${desc.length} caracteres (ideal 50–170)`) : r('description', 'pass', `${desc.length} caracteres`));
  const h1 = (html.match(/<h1\b/gi) ?? []).length;
  out.push(h1 === 1 ? r('h1', 'pass', 'Un solo h1') : r('h1', 'fail', `Debe haber un h1 y hay ${h1}`));
  out.push(/<html\b[^>]*\blang\s*=/i.test(html) ? r('lang', 'pass', 'html lang definido') : r('lang', 'fail', 'Falta lang en <html>'));
  out.push(meta(html, 'name', 'viewport') ? r('viewport', 'pass', 'viewport definido') : r('viewport', 'fail', 'Falta meta viewport'));

  const og = ['og:title', 'og:description', 'og:image', 'og:url'].filter((k) => !metaContent(html, 'property', k));
  const ogImg = metaContent(html, 'property', 'og:image') ?? '';
  const twitter = metaContent(html, 'name', 'twitter:card');
  if (og.length) out.push(r('share-preview', 'fail', `Vista previa al compartir incompleta: faltan ${og.join(', ')}`));
  else if (!/^https?:\/\//i.test(ogImg)) out.push(r('share-preview', 'fail', 'og:image debe ser una URL absoluta'));
  else out.push(!twitter ? r('share-preview', 'warn', 'Falta twitter:card') : r('share-preview', 'pass', 'Open Graph y Twitter completos'));

  const hrefs = tags(html, 'a').map((t) => attr(t, 'href') ?? '');
  const tel = hrefs.filter((h) => /^tel:\+?[\d\s().-]{6,}$/i.test(h));
  const mail = hrefs.filter((h) => /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+/i.test(h));
  out.push(tel.length || mail.length ? r('contacto-tocable', 'pass', `${tel.length} teléfono(s) y ${mail.length} correo(s) tocables`) : r('contacto-tocable', 'fail', 'No hay enlaces tel: ni mailto: (teléfono y correo deben ser tocables)'));
  const phoneInText = /(?:\+\d{1,3}[\s-]?)?\(?\d{2,3}\)?[\s-]\d{3}[\s-]\d{3,4}/.test(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/gi, ' ')) && !tel.length;
  if (phoneInText) out.push(r('telefono-en-texto', 'warn', 'Hay un número que parece teléfono sin enlace tel:'));

  const social = hrefs.filter((h) => SOCIAL.test(h));
  const SOCIAL_WORD = /facebook|instagram|twitter|linkedin|tiktok|youtube|whatsapp|pinterest/i;
  const emptySocial = (html.match(/<a\b[^>]*>[\s\S]{0,300}?<\/a>/gi) ?? []).filter((a) => /^(#|javascript:)?$/.test(attr(a.slice(0, a.indexOf('>') + 1), 'href') ?? '') && SOCIAL_WORD.test(a));
  const generic = social.filter((h) => { try { const u = new URL(h); return u.pathname.replace(/\//g, '') === '' || /^\/(?:share|sharer)/i.test(u.pathname); } catch { return true; } });
  if (emptySocial.length || generic.length) out.push(r('redes', 'fail', `Íconos de redes sin cuenta real: ${emptySocial.length} vacío(s)${generic.length ? `, genéricos: ${generic.slice(0, 3).join(', ')}` : ''}`));
  else out.push(social.length ? r('redes', 'pass', `${social.length} enlace(s) a redes con perfil`) : r('redes', 'warn', 'No hay enlaces a redes sociales (confirma si el cliente las tiene)'));

  const bodyText = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ');
  const hit = PLACEHOLDER_TEXT.exec(bodyText)?.[0];
  out.push(hit ? r('contenido-prueba', 'fail', `Contenido de prueba en la portada: «${hit}»`) : r('contenido-prueba', 'pass', 'Sin contenido de prueba evidente en la portada'));

  const internal = hrefs.filter((h) => h.startsWith('/') && !h.startsWith('//'));
  const dirty = internal.filter((h) => /\.(?:html?|php|aspx?)(?:$|[?#])|\?(?:p|page_id|id)=|[A-Z_]/.test(h.split('#')[0]));
  out.push(dirty.length ? r('urls-limpias', 'fail', `URLs no limpias: ${[...new Set(dirty)].slice(0, 4).join(', ')}`) : r('urls-limpias', 'pass', 'Enlaces internos con URL limpia'));

  const sec = [['strict-transport-security', 'HSTS'], ['x-content-type-options', 'X-Content-Type-Options'], ['referrer-policy', 'Referrer-Policy']].filter(([h]) => !headers[h]);
  const csp = headers['content-security-policy'] || headers['content-security-policy-report-only'];
  if (sec.length || !csp) out.push(r('cabeceras', 'warn', `Cabeceras de seguridad ausentes: ${[...sec.map((s) => s[1]), ...(csp ? [] : ['CSP'])].join(', ')}`));
  else out.push(r('cabeceras', 'pass', 'HSTS, nosniff, Referrer-Policy y CSP presentes'));
  return out;
}

export function checkCache(headers, kind) {
  const cc = String(headers['cache-control'] ?? '');
  if (kind === 'html') return cc ? r('cache-html', 'pass', cc) : r('cache-html', 'warn', 'La portada no declara Cache-Control');
  const age = Number(/max-age=(\d+)/i.exec(cc)?.[1] ?? 0);
  return age >= 86400 || /immutable/i.test(cc) ? r('cache-estaticos', 'pass', cc) : r('cache-estaticos', 'fail', `Recursos estáticos sin caché larga (Cache-Control: ${cc || 'ausente'})`);
}

export function parseRedirects(text) {
  return text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => {
    const [from, to] = l.split(/[\s,;]+/);
    return { from, to };
  }).filter((x) => x.from && x.to);
}

export function tlsDaysLeft(host, port = 443) {
  return new Promise((resolve, reject) => {
    const s = tls.connect({ host, port, servername: host, timeout: 8000 }, () => {
      const c = s.getPeerCertificate();
      s.end();
      resolve(Math.floor((new Date(c.valid_to).getTime() - Date.now()) / 86400000));
    });
    s.on('error', reject);
    s.on('timeout', () => { s.destroy(); reject(new Error('timeout')); });
  });
}

/** Ejecuta todo contra una URL. `deps` permite inyectar fetch y tlsDaysLeft en las pruebas. */
export async function runChecks(url, { redirects = [], deps = {} } = {}) {
  const f = deps.fetch ?? fetch;
  const days = deps.tlsDaysLeft ?? tlsDaysLeft;
  const get = (u, o = {}) => f(u, { redirect: 'manual', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'web-os-launch-check/1' }, ...o });
  const base = new URL(url);
  const https = base.protocol === 'https:';
  const out = [];
  const home = await get(base.href, { redirect: 'follow' });
  const html = await home.text();
  const hdr = Object.fromEntries(home.headers.entries());
  out.push(home.status === 200 ? r('portada', 'pass', 'La portada responde 200') : r('portada', 'fail', `La portada responde ${home.status}`));
  out.push(...analyzeHtml(html, { url: home.url || base.href, headers: hdr }));
  out.push(checkCache(hdr, 'html'));

  const asset = tags(html, 'script').map((t) => attr(t, 'src')).concat(tags(html, 'link').map((t) => attr(t, 'href'))).find((s) => s && /\.(?:js|css|woff2?|png|jpe?g|webp|avif|svg)(?:\?|$)/i.test(s));
  if (asset) {
    const au = new URL(asset, home.url || base.href);
    if (au.origin === new URL(home.url || base.href).origin) out.push(checkCache(Object.fromEntries((await get(au.href, { redirect: 'follow' })).headers.entries()), 'static'));
  }

  if (!https) out.push(r('https', 'skip', 'URL sin HTTPS: se omiten HTTPS, SSL y la versión única del dominio (pruébalo con la URL pública)'));
  else {
    const results = [];
    for (const v of originVariants(base.href)) {
      try {
        const res = await get(v);
        const loc = res.headers.get('location');
        const final = res.status >= 300 && res.status < 400 && loc ? new URL(loc, v).href : v;
        const ok = (res.status === 200 && new URL(v).origin === base.origin) || ([301, 308].includes(res.status) && new URL(final).origin === base.origin);
        results.push({ v, ok, status: res.status });
      } catch (e) { results.push({ v, ok: false, status: String(e.cause?.code ?? e.message) }); }
    }
    const badV = results.filter((x) => !x.ok);
    out.push(badV.length ? r('version-unica', 'fail', `Debe haber una sola versión del dominio (301 a ${base.origin}). Fallan: ${badV.map((x) => `${x.v} → ${x.status}`).join('; ')}`) : r('version-unica', 'pass', `http/https y con/sin www terminan en ${base.origin}`));
    try {
      const d = await days(base.hostname, Number(base.port) || 443);
      out.push(d < 14 ? r('ssl', 'fail', `El certificado caduca en ${d} días`) : d < 30 ? r('ssl', 'warn', `El certificado caduca en ${d} días: confirma la renovación automática`) : r('ssl', 'pass', `Certificado válido ${d} días más`));
    } catch (e) { out.push(r('ssl', 'fail', `No se pudo validar el certificado: ${e.message}`)); }
  }

  for (const [p, id] of [['/robots.txt', 'robots'], ['/sitemap.xml', 'sitemap']]) {
    const res = await get(new URL(p, base).href, { redirect: 'follow' });
    const body = res.status === 200 ? await res.text() : '';
    if (res.status !== 200) out.push(r(id, 'fail', `${p} responde ${res.status}`));
    else if (id === 'robots') out.push(/^\s*disallow:\s*\/\s*$/im.test(body) ? r(id, 'fail', 'robots.txt bloquea todo el sitio (Disallow: /)') : /sitemap:/i.test(body) ? r(id, 'pass', 'robots.txt correcto y apunta al sitemap') : r(id, 'warn', 'robots.txt no declara la línea Sitemap'));
    else out.push(/<urlset|<sitemapindex/i.test(body) ? r(id, 'pass', `${(body.match(/<loc>/gi) ?? []).length} URL(s) en el sitemap`) : r(id, 'fail', 'sitemap.xml no es un sitemap válido'));
  }

  const nf = await get(new URL(`/no-existe-${Date.now()}`, base).href, { redirect: 'follow' });
  out.push(nf.status === 404 ? r('404', 'pass', 'Las páginas inexistentes responden 404') : r('404', 'fail', `Una URL inexistente responde ${nf.status} (debe ser 404)`));
  const thanks = await Promise.all(['/gracias', '/thank-you', '/gracias/'].map((p) => get(new URL(p, base).href, { redirect: 'follow' }).then((x) => x.status).catch(() => 0)));
  out.push(thanks.includes(200) ? r('gracias', 'pass', 'Existe página de gracias') : r('gracias', 'warn', 'No se encontró /gracias ni /thank-you: confirma la página de agradecimiento tras convertir'));

  for (const { from, to } of redirects) {
    try {
      const res = await get(new URL(from, base).href);
      const loc = res.headers.get('location');
      const okLoc = loc && new URL(loc, base).pathname.replace(/\/$/, '') === new URL(to, base).pathname.replace(/\/$/, '');
      out.push([301, 308].includes(res.status) && okLoc ? r(`301:${from}`, 'pass', `${from} → ${to}`) : r(`301:${from}`, 'fail', `${from} debe redirigir (301) a ${to}; responde ${res.status}${loc ? ` → ${loc}` : ''}`));
    } catch (e) { out.push(r(`301:${from}`, 'fail', `${from}: ${e.message}`)); }
  }
  for (const [id, msg] of MANUAL) out.push(r(id, 'manual', msg));
  return out;
}

export function summarize(results) {
  const c = { pass: 0, fail: 0, warn: 0, skip: 0, manual: 0 };
  for (const x of results) c[x.status]++;
  return c;
}
