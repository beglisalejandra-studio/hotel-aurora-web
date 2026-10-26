import type { Locale } from "@/lib/i18n/config";
import { defaultLocale } from "@/lib/i18n/config";
import type { L10n } from "@/lib/sanity/types";

/** Texto en el idioma pedido; si falta la traducción, el español (el panel lo avisa al editar). */
export const tr = (v: L10n, lang: Locale): string => (v?.[lang] || v?.[defaultLocale] || "").trim();

/** Ruta pública en un idioma: el español va sin prefijo, el inglés con /en. */
export function localePath(lang: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLocale) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/** Partes de un titular con acento: «Hotel con *spa de agua*» → [texto, acento]. */
export function accentParts(text: string): { text: string; accent: boolean }[] {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((t) =>
      t.startsWith("*") && t.endsWith("*") && t.length > 2
        ? { text: t.slice(1, -1), accent: true }
        : { text: t.replace(/\*/g, ""), accent: false },
    );
}

/** Palabras del texto en movimiento, como el script de la maqueta: *acento* y | para partir línea. */
export function kineticWords(src: string): {
  lines: { w: string; accent: boolean; i: number }[][];
  count: number;
} {
  let i = 0;
  let acc = false;
  const lines = src.split("|").map((line) =>
    line
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((raw) => {
        let w = raw;
        if (w.startsWith("*")) {
          acc = true;
          w = w.slice(1);
        }
        const close = w.endsWith("*");
        if (close) w = w.slice(0, -1);
        const word = { w, accent: acc, i: i++ };
        if (close) acc = false;
        return word;
      }),
  );
  return { lines, count: i };
}

export const plain = (text: string) =>
  text.replace(/\|/g, " ").replace(/\*/g, "").replace(/\s+/g, " ").trim();
