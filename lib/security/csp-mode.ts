/**
 * Seam (punto de extensión). "static" = CSP por cabecera en next.config (compatible con páginas estáticas).
 * El módulo `strict-csp` reemplaza este archivo por "none" y añade proxy.ts con nonce por petición.
 * Importación relativa desde next.config.ts (el alias @/ no se resuelve allí).
 */
export const cspMode: "static" | "none" = "static";
