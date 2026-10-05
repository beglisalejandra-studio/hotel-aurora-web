/**
 * Datos estructurados (schema.org) como <script type="application/ld+json">.
 * Se escapa "<" para que un valor con "</script>" no pueda cerrar la etiqueta (inyección XSS), y los separadores de línea
 * Unicode (U+2028/U+2029), que en JSON son válidos pero en JavaScript terminan una línea. Se construyen desde puntos de
 * código para no depender de escapes \\uXXXX en el código fuente.
 */
const LINE_SEPARATOR = new RegExp(String.fromCharCode(0x2028), "g");
const PARAGRAPH_SEPARATOR = new RegExp(String.fromCharCode(0x2029), "g");

export function jsonLdString(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(LINE_SEPARATOR, "\\u2028")
    .replace(PARAGRAPH_SEPARATOR, "\\u2029");
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />
  );
}
