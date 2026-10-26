import { defineArrayMember, defineField, defineType, type FieldDefinition } from "sanity";

/**
 * Bloques de página: el cliente añade, quita, oculta y reordena secciones sin tocar código. Cada bloque reproduce
 * una sección de la maqueta aprobada; el diseño (espaciados, tipografía, móvil) lo pone la web, no el panel.
 */
const ACCENT_HELP =
  "Escribe entre asteriscos la parte que va en color de acento. Ejemplo: «Restaurante *de cocina de mercado*».";

const common = (): FieldDefinition[] => [
  defineField({
    name: "anchor",
    title: "Nombre para el menú",
    type: "slug",
    description:
      "Permite enlazar esta sección desde el menú (por ejemplo «restaurante»). Sin espacios.",
    group: "options",
  }),
  defineField({
    name: "hidden",
    title: "Ocultar esta sección",
    type: "boolean",
    initialValue: false,
    description: "La sección deja de verse en la web sin borrarla.",
    group: "options",
  }),
];
const groups = [
  { name: "content", title: "Contenido", default: true },
  { name: "options", title: "Opciones" },
];
const heading = (required = true) =>
  defineField({
    name: "heading",
    title: "Titular",
    type: "localeString",
    description: ACCENT_HELP,
    group: "content",
    validation: (r) => (required ? r.required() : r),
  });
const preview = (fallback: string) => ({
  select: { title: "heading.es", hidden: "hidden" },
  prepare: ({ title, hidden }: { title?: string; hidden?: boolean }) => ({
    title: (title ?? fallback).replaceAll("*", ""),
    subtitle: `${fallback}${hidden ? " · oculta" : ""}`,
  }),
});
const ctas = () =>
  defineField({
    name: "ctas",
    title: "Botones",
    type: "array",
    of: [defineArrayMember({ type: "cta" })],
    group: "content",
  });

export const sectionHero = defineType({
  name: "sectionHero",
  title: "Portada",
  type: "object",
  groups,
  fields: [
    heading(),
    defineField({
      name: "lead",
      title: "Frase de presentación",
      type: "localeText",
      group: "content",
    }),
    defineField({
      name: "facade",
      title: "Foto principal",
      type: "imageWithAlt",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "reception",
      title: "Segunda foto del recorrido",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "patio",
      title: "Tercera foto del recorrido",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "steps",
      title: "Textos del recorrido",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "heroStep",
          title: "Texto",
          fields: [
            defineField({ name: "kicker", title: "Rótulo", type: "localeString" }),
            defineField({
              name: "title",
              title: "Titular",
              type: "localeString",
              description: ACCENT_HELP,
            }),
            defineField({ name: "text", title: "Texto", type: "localeText" }),
            defineField({
              name: "ghost",
              title: "Palabra de fondo",
              type: "string",
              description:
                "Opcional. Palabra grande y tenue detrás del texto (por ejemplo «PATIO»). Solo se ve en los textos 3 y 6.",
            }),
            defineField({
              name: "link",
              title: "Enlace",
              type: "cta",
              description: "Opcional. Por ejemplo «Ver habitaciones» con el enlace #habitaciones.",
            }),
          ],
          preview: {
            select: { title: "title.es", subtitle: "kicker.es" },
            prepare: ({ title, subtitle }: { title?: string; subtitle?: string }) => ({
              title: (title ?? "Texto").replaceAll("*", ""),
              subtitle,
            }),
          },
        }),
      ],
      description:
        "Aparecen uno tras otro mientras se baja por la entrada de la casa (en tableta y escritorio), en este orden: 1 y 2 en la fachada (si el titular del 1 empieza por un número, el número se ve en grande), 3 en grande al cruzar la puerta, 4 y 5 en la recepción, 6 en grande camino del patio, y 7, 8 y 9 en el patio. En móvil la portada es solo la foto con el titular, sin estos textos.",
      validation: (r) => r.max(9),
    }),
    defineField({
      name: "walk",
      title: "Recorrido animado al hacer scroll",
      type: "boolean",
      initialValue: true,
      group: "options",
      description:
        "Solo en tableta y escritorio. Si lo desactivas, la portada es la foto principal con el titular encima (sin los textos del recorrido). En móvil la portada es siempre así, compacta.",
    }),
    defineField({
      name: "bookingBar",
      title: "Mostrar el buscador de fechas",
      type: "boolean",
      initialValue: true,
      group: "options",
    }),
    ...common(),
  ],
  preview: preview("Portada"),
});

export const sectionRooms = defineType({
  name: "sectionRooms",
  title: "Habitaciones",
  type: "object",
  groups,
  fields: [
    heading(),
    defineField({ name: "intro", title: "Introducción", type: "localeText", group: "content" }),
    defineField({
      name: "rooms",
      title: "Habitaciones a mostrar",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "room" }] })],
      description: "Déjalo vacío para mostrar todas, en el orden de «Habitaciones».",
    }),
    ...common(),
  ],
  preview: preview("Habitaciones"),
});

export const sectionFeature = defineType({
  name: "sectionFeature",
  title: "Foto y texto (restaurante, spa, mascotas…)",
  type: "object",
  groups,
  fields: [
    defineField({ name: "kicker", title: "Rótulo", type: "localeString", group: "content" }),
    heading(),
    defineField({ name: "text", title: "Texto", type: "localeText", group: "content" }),
    defineField({ name: "image", title: "Foto", type: "imageWithAlt", group: "content" }),
    defineField({
      name: "groups",
      title: "Apartados",
      type: "array",
      group: "content",
      description:
        "Con dos o más apartados se muestran como pestañas (por ejemplo, Rituales · Circuito de agua · Para dos).",
      of: [
        defineArrayMember({
          type: "object",
          name: "featureGroup",
          title: "Apartado",
          fields: [
            defineField({
              name: "title",
              title: "Nombre",
              type: "localeString",
              validation: (r) => r.required(),
            }),
            defineField({ name: "text", title: "Texto", type: "localeText" }),
            defineField({
              name: "items",
              title: "Lista",
              type: "array",
              of: [defineArrayMember({ type: "labelValue" })],
            }),
          ],
          preview: { select: { title: "title.es" } },
        }),
      ],
    }),
    defineField({
      name: "bullets",
      title: "Lista de puntos",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "localeString" })],
      validation: (r) => r.max(8),
    }),
    defineField({ name: "note", title: "Nota destacada", type: "localeString", group: "content" }),
    ctas(),
    defineField({
      name: "layout",
      title: "Composición",
      type: "string",
      group: "options",
      initialValue: "imageRight",
      options: {
        list: [
          { title: "Foto a todo el ancho con el texto encima", value: "fullBleed" },
          { title: "Foto a la izquierda", value: "imageLeft" },
          { title: "Foto a la derecha", value: "imageRight" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "background",
      title: "Fondo",
      type: "string",
      group: "options",
      initialValue: "page",
      options: {
        list: [
          { title: "Normal", value: "page" },
          { title: "Franja de color", value: "band" },
        ],
        layout: "radio",
      },
    }),
    ...common(),
  ],
  preview: preview("Foto y texto"),
});

export const sectionDirect = defineType({
  name: "sectionDirect",
  title: "Reserva directa",
  type: "object",
  groups,
  fields: [
    defineField({ name: "kicker", title: "Rótulo", type: "localeString", group: "content" }),
    heading(),
    defineField({
      name: "items",
      title: "Ventajas",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "localeString" })],
      validation: (r) => r.max(6),
    }),
    ctas(),
    ...common(),
  ],
  preview: preview("Reserva directa"),
});

export const sectionOffers = defineType({
  name: "sectionOffers",
  title: "Paquetes y experiencias",
  type: "object",
  groups,
  fields: [
    heading(),
    defineField({ name: "intro", title: "Introducción", type: "localeText", group: "content" }),
    defineField({
      name: "offers",
      title: "Paquetes a mostrar",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "offer" }] })],
      description: "Déjalo vacío para mostrar todos.",
    }),
    ...common(),
  ],
  preview: preview("Paquetes"),
});

export const sectionFacts = defineType({
  name: "sectionFacts",
  title: "El hotel de un vistazo",
  type: "object",
  groups,
  fields: [
    defineField({ name: "kicker", title: "Rótulo", type: "localeString", group: "content" }),
    heading(),
    defineField({ name: "lead", title: "Texto", type: "localeText", group: "content" }),
    defineField({ name: "image", title: "Foto", type: "imageWithAlt", group: "content" }),
    defineField({
      name: "facts",
      title: "Datos",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "labelValue" })],
      validation: (r) => r.max(8),
    }),
    ...common(),
  ],
  preview: preview("De un vistazo"),
});

export const sectionFaq = defineType({
  name: "sectionFaq",
  title: "Preguntas frecuentes",
  type: "object",
  groups,
  fields: [
    heading(),
    defineField({
      name: "faqs",
      title: "Preguntas a mostrar",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
      description: "Déjalo vacío para mostrar todas.",
    }),
    ...common(),
  ],
  preview: preview("Preguntas frecuentes"),
});

export const sectionMap = defineType({
  name: "sectionMap",
  title: "Cómo llegar (mapa)",
  type: "object",
  groups,
  fields: [
    heading(),
    defineField({ name: "lead", title: "Texto", type: "localeText", group: "content" }),
    defineField({ name: "note", title: "Nota", type: "localeString", group: "content" }),
    ...common(),
  ],
  preview: preview("Mapa"),
});

export const sectionClosing = defineType({
  name: "sectionClosing",
  title: "Cierre con llamada a reservar",
  type: "object",
  groups,
  fields: [
    heading(),
    defineField({
      name: "accentLine",
      title: "Segunda línea (en color de acento)",
      type: "localeString",
      group: "content",
    }),
    defineField({ name: "text", title: "Texto", type: "localeText", group: "content" }),
    ctas(),
    ...common(),
  ],
  preview: preview("Cierre"),
});

export const sectionRichText = defineType({
  name: "sectionRichText",
  title: "Texto libre",
  type: "object",
  groups,
  fields: [
    heading(false),
    defineField({ name: "body", title: "Texto", type: "localeBlock", group: "content" }),
    ...common(),
  ],
  preview: preview("Texto libre"),
});

export const sectionGallery = defineType({
  name: "sectionGallery",
  title: "Galería de fotos",
  type: "object",
  groups,
  fields: [
    heading(false),
    defineField({
      name: "images",
      title: "Fotos",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (r) => r.min(2).max(24),
    }),
    ...common(),
  ],
  preview: preview("Galería"),
});

export const sectionBlog = defineType({
  name: "sectionBlog",
  title: "Últimas entradas del blog",
  type: "object",
  groups,
  fields: [
    heading(),
    defineField({
      name: "count",
      title: "Cuántas mostrar",
      type: "number",
      initialValue: 3,
      group: "content",
      validation: (r) => r.min(1).max(9),
    }),
    ...common(),
  ],
  preview: preview("Blog"),
});

export const SECTION_TYPES = [
  "sectionHero",
  "sectionRooms",
  "sectionFeature",
  "sectionDirect",
  "sectionOffers",
  "sectionFacts",
  "sectionFaq",
  "sectionMap",
  "sectionClosing",
  "sectionRichText",
  "sectionGallery",
  "sectionBlog",
] as const;

export const sections = [
  sectionHero,
  sectionRooms,
  sectionFeature,
  sectionDirect,
  sectionOffers,
  sectionFacts,
  sectionFaq,
  sectionMap,
  sectionClosing,
  sectionRichText,
  sectionGallery,
  sectionBlog,
];
