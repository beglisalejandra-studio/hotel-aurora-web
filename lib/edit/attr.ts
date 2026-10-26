import { createDataAttribute } from "next-sanity";

/** Documento que se está editando en la vista previa del panel (solo en el editor visual). */
export type EditDoc = { id: string; type: string };

/**
 * Atributo `data-sanity` que conecta un elemento de la vista previa con su sitio en el documento: el editor visual lo
 * usa para resaltarlo, abrir su formulario al pulsarlo y dejar arrastrarlo dentro de su lista. Sin edición, nada.
 */
export function sanityAttr(edit: EditDoc | undefined, path: string): { "data-sanity"?: string } {
  if (!edit) return {};
  return {
    "data-sanity": createDataAttribute({
      baseUrl: "/admin",
      id: edit.id,
      type: edit.type,
      path,
    }).toString(),
  };
}

export const sectionPath = (key: string) => `sections[_key=="${key}"]`;
