/** Sanitización de entrada y escape de salida. Validar (zod) + sanear + escapar según el destino. */

// Las clases de caracteres se construyen desde puntos de código (sin escapes \\uXXXX en el código fuente: las herramientas de
// edición pueden convertirlos en caracteres invisibles reales y hacer el código ilegible o inválido).
const chars = (...codes: number[]) => codes.map((c) => String.fromCharCode(c)).join("");
const span = (from: number, to: number) =>
  `${String.fromCharCode(from)}-${String.fromCharCode(to)}`;

/** Caracteres de control (salvo \\t y \\n ya tratados aparte) y DEL. */
const CONTROL_CHARS = new RegExp(
  `[${span(0x00, 0x08)}${chars(0x0b, 0x0c)}${span(0x0e, 0x1f)}${chars(0x7f)}]`,
  "g",
);
/** Ancho cero, marcas direccionales y aislamientos bidireccionales (spoofing de texto). */
const INVISIBLE_FORMAT = new RegExp(
  `[${span(0x200b, 0x200f)}${span(0x202a, 0x202e)}${span(0x2066, 0x2069)}]`,
  "g",
);

/** Texto plano: quita caracteres de control, normaliza espacios y limita longitud. No elimina HTML: escápalo al renderizar. */
export function cleanText(input: unknown, max = 500): string {
  if (typeof input !== "string") return "";
  return input
    .normalize("NFC")
    .replace(CONTROL_CHARS, "")
    .replace(INVISIBLE_FORMAT, "")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, max);
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
};

/** Escapa para insertar en HTML (p. ej. cuerpos de email). React ya escapa el JSX: úsalo SOLO fuera de React. */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"'`]/g, (c) => HTML_ESCAPES[c] ?? c);
}

/** Evita inyección de cabeceras/saltos de línea en asuntos y destinatarios de email. */
export function singleLine(input: string): string {
  return input.replace(/[\r\n]+/g, " ").trim();
}
