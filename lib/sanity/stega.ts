/**
 * En el editor visual, los textos llevan unas marcas invisibles («stega») que dicen de qué campo vienen: así, al pulsar
 * un texto en la vista previa, el panel abre ese campo. Solo se marcan los textos que se ven en pantalla (los campos
 * por idioma, `es`/`en`, y el texto de los bloques); nunca direcciones, anclas, colores, tipografías, teléfonos ni
 * identificadores, que se usan como atributos o para comparar y se romperían con las marcas.
 */
export function isVisibleText(
  sourcePath: ReadonlyArray<string | number | { _key: string }>,
): boolean {
  const last = sourcePath.at(-1);
  const localized = sourcePath.some((seg) => seg === "es" || seg === "en");
  return localized && (last === "es" || last === "en" || last === "text");
}
