/** Contraste WCAG 2.2 entre dos colores en hexadecimal (#RGB o #RRGGBB). Devuelve null si un color no es válido. */
export function hexToRgb(hex: string): [number, number, number] | null {
  const body = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())?.[1];
  if (!body) return null;
  const h = body.length === 3 ? body.replace(/./g, (c) => c + c) : body;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminance([r, g, b]: [number, number, number]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: string, b: string): number | null {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return null;
  const la = luminance(ra);
  const lb = luminance(rb);
  return Math.round(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)) * 100) / 100;
}

/** Parejas que deben leerse bien y su mínimo (texto normal 4,5:1; titulares grandes y bordes de control 3:1). */
export const CONTRAST_RULES = [
  { text: "ink", bg: "background", min: 4.5, label: "Texto principal sobre el fondo" },
  { text: "inkSoft", bg: "background", min: 4.5, label: "Texto secundario sobre el fondo" },
  { text: "ink", bg: "surface", min: 4.5, label: "Texto principal sobre las tarjetas" },
  { text: "ink", bg: "band", min: 4.5, label: "Texto principal sobre las franjas de color" },
  {
    text: "onAccent",
    bg: "accent",
    min: 4.5,
    label: "Texto de los botones sobre el color de acento",
  },
  {
    text: "accent",
    bg: "background",
    min: 3,
    label: "Titulares en color de acento sobre el fondo",
  },
] as const;

export type PaletteKey =
  "background" | "surface" | "band" | "ink" | "inkSoft" | "accent" | "onAccent";

/** Mensajes en lenguaje claro para cada pareja que no llega al mínimo. */
export function paletteProblems(p: Partial<Record<PaletteKey, string>>): string[] {
  const out: string[] = [];
  for (const r of CONTRAST_RULES) {
    const a = p[r.text];
    const b = p[r.bg];
    if (!a || !b) continue;
    const c = contrastRatio(a, b);
    if (c !== null && c < r.min) {
      out.push(
        `${r.label}: contraste ${String(c).replace(".", ",")}:1, necesita al menos ${String(r.min).replace(".", ",")}:1.`,
      );
    }
  }
  return out;
}
