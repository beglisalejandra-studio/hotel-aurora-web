import { defineField, defineType } from "sanity";

/**
 * Foto con sus dos versiones (regla del proyecto: escritorio y móvil se piden por separado) y texto alternativo
 * obligatorio. Si no hay versión móvil, la web usa la de escritorio respetando el punto de interés marcado.
 */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Foto",
  type: "object",
  fields: [
    defineField({
      name: "desktop",
      title: "Foto para escritorio",
      type: "image",
      options: { hotspot: true },
      description: "Marca con el punto de interés lo que nunca debe recortarse.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "mobile",
      title: "Foto para móvil (opcional)",
      type: "image",
      options: { hotspot: true },
      description: "Encuadre propio para móvil. Si la dejas vacía se usa la de escritorio.",
    }),
    defineField({
      name: "alt",
      title: "Qué se ve en la foto",
      type: "localeString",
      description:
        "Una frase para quien no puede ver la foto y para Google. Ejemplo: «Habitación Alba con sol de mañana».",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "alt.es", media: "desktop" } },
});
