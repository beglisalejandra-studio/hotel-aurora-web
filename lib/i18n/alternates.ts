import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

/**
 * `alternates` de Metadata para una ruta SIN prefijo de idioma (p. ej. "/precios"): canonical del idioma actual + hreflang
 * de todos los idiomas + x-default. Cada versión debe enlazar a TODAS las demás (incluida ella misma).
 */
export function alternatesFor(
  path: string,
  current: Locale,
  siteUrl: string,
): { canonical: string; languages: Record<string, string> } {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  const base = siteUrl.replace(/\/$/, "");
  const url = (l: Locale) => `${base}/${l}${clean}`;
  return {
    canonical: url(current),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, url(l)])),
      "x-default": url(defaultLocale),
    },
  };
}
