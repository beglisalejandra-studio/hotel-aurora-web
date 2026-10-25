/**
 * CSP propia del panel (/admin): el Studio de Sanity necesita hablar con la API de Sanity (HTTPS y WebSocket), cargar
 * su puente con el panel de Sanity (core.sanity-cdn.com) y mostrar avatares del inicio de sesión. El resto del sitio conserva su política estricta (lib/security/headers.ts).
 */
export function buildAdminCsp(o: { https: boolean; isDev: boolean }): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://core.sanity-cdn.com${o.isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self' data: https://*.sanity.io",
    "media-src 'self' blob: https://cdn.sanity.io",
    "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.api.sanity.io wss://*.api.sanity.io https://core.sanity-cdn.com",
    "frame-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://*.sanity.io",
    "frame-ancestors 'self'",
    ...(o.https ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}
