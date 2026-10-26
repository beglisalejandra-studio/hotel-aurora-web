/**
 * Cabeceras de seguridad. Se usan desde next.config.ts (importación RELATIVA: el alias @/ no se resuelve en la config).
 *
 * CSP por defecto = "static": sin nonce, compatible con páginas estáticas/CDN (mejor LCP) pero con 'unsafe-inline' en
 * scripts. Si el proyecto maneja datos sensibles, aplica el módulo `strict-csp` (nonce por petición vía proxy.ts;
 * exige renderizado dinámico). Guía oficial: https://nextjs.org/docs/app/guides/content-security-policy
 */
export interface SecurityHeaderOptions {
  csp: "static" | "none";
  /** Solo si el sitio se sirve por HTTPS (HSTS y upgrade-insecure-requests romperían http://localhost). */
  https: boolean;
  isDev: boolean;
  /** Orígenes extra permitidos (p. ej. analítica/pixels activados tras consentimiento). */
  extraScriptSrc?: string[];
  extraConnectSrc?: string[];
  extraImgSrc?: string[];
  extraFrameSrc?: string[];
  extraStyleSrc?: string[];
  extraFontSrc?: string[];
}

export function buildStaticCsp(o: SecurityHeaderOptions): string {
  const list = (base: string[], extra?: string[]) => [...base, ...(extra ?? [])].join(" ");
  const directives = [
    "default-src 'self'",
    `script-src ${list(["'self'", "'unsafe-inline'", ...(o.isDev ? ["'unsafe-eval'"] : [])], o.extraScriptSrc)}`,
    `style-src ${list(["'self'", "'unsafe-inline'"], o.extraStyleSrc)}`,
    `img-src ${list(["'self'", "blob:", "data:"], o.extraImgSrc)}`,
    `font-src ${list(["'self'"], o.extraFontSrc)}`,
    "media-src 'self'",
    `connect-src ${list(["'self'"], o.extraConnectSrc)}`,
    `frame-src ${o.extraFrameSrc?.length ? o.extraFrameSrc.join(" ") : "'none'"}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(o.https ? ["upgrade-insecure-requests"] : []),
  ];
  return directives.join("; ");
}

export function securityHeaders(o: SecurityHeaderOptions): { key: string; value: string }[] {
  return [
    ...(o.csp === "static" ? [{ key: "Content-Security-Policy", value: buildStaticCsp(o) }] : []),
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(self), interest-cohort=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ...(o.https
      ? [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ]
      : []),
  ];
}
