/**
 * Seam: rutas cuya CSP debe permitir estilos en línea (`style-src 'unsafe-inline'`), p. ej. el editor visual, que
 * pinta con atributos `style`. Solo afecta a la CSP con nonce del módulo `strict-csp`: la CSP estática ya los permite.
 * El resto del sitio conserva la política estricta. Por defecto, ninguna.
 */
export const inlineStylePaths: readonly string[] = [];
