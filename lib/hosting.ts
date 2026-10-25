/**
 * Perfiles de alojamiento (ver docs/architecture/HOSTING.md). Se importa con ruta RELATIVA desde next.config.ts.
 *  - vercel     (por defecto): sin configuración extra (también sirve en plataformas con soporte de Next: Netlify,
 *               Cloudflare, AWS Amplify… con su adaptador).
 *  - standalone (BUILD_TARGET=standalone): servidor Node autocontenido para Docker/VPS (`.next/standalone`).
 * No hay perfil de exportación estática: el sitio usa rutas de servidor (API, editor, sitemap dinámico).
 */
export type BuildTarget = "vercel" | "standalone";

export function buildTarget(env: Record<string, string | undefined> = process.env): BuildTarget {
  const t = env.BUILD_TARGET;
  return t === "standalone" ? t : "vercel";
}

/** Host canónico (p. ej. `www.midominio.com`): cualquier otro host se redirige a él con 308, sin duplicar contenido. */
export function canonicalHost(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const h = env.CANONICAL_HOST?.trim().toLowerCase();
  return h && /^[a-z0-9.-]+(:\d+)?$/.test(h) ? h : null;
}

export interface RedirectRule {
  source: string;
  has: { type: "host"; value: string }[];
  destination: string;
  permanent: true;
}

/**
 * Regla de redirección al host canónico (SEO: una sola dirección por contenido). Cualquier otro host (apex vs www,
 * dominios de preview…) recibe 308 conservando ruta y consulta. `/api/health` queda fuera para no romper los
 * balanceadores. Importación RELATIVA desde next.config.ts.
 */
export function canonicalRedirect(host: string, siteUrl: string): RedirectRule {
  const escaped = host.replace(/\./g, "\\.");
  return {
    source: "/:path((?!api/health).*)",
    has: [{ type: "host", value: `(?!${escaped}$).*` }],
    destination: `${siteUrl.replace(/\/$/, "")}/:path`,
    permanent: true,
  };
}
