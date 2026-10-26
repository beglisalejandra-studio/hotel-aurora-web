import { defineArrayMember, defineField, defineType } from "sanity";
import { SECTION_TYPES } from "../sections";

const slugField = (source = "title.es") =>
  defineField({
    name: "slug",
    title: "Dirección en la web",
    type: "slug",
    options: { source, maxLength: 80 },
    description: "Se genera desde el título. Cámbiala solo si sabes que nadie la enlaza ya.",
    validation: (r) => r.required(),
  });
const order = () =>
  defineField({
    name: "order",
    title: "Orden",
    type: "number",
    description: "Menor número, antes aparece.",
    initialValue: 10,
  });

export const page = defineType({
  name: "page",
  title: "Página",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "seo", title: "Buscadores" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "localeString",
      group: "content",
      validation: (r) => r.required(),
    }),
    slugField(),
    defineField({
      name: "sections",
      title: "Secciones",
      type: "array",
      group: "content",
      description:
        "Añade, arrastra para reordenar u oculta secciones. Cada una ya trae el diseño del sitio.",
      of: SECTION_TYPES.map((type) => defineArrayMember({ type })),
    }),
    defineField({ name: "seo", title: "Buscadores", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title.es", subtitle: "slug.current" } },
});

export const room = defineType({
  name: "room",
  title: "Habitación",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "photos", title: "Fotos" },
    { name: "booking", title: "Reserva" },
    { name: "seo", title: "Buscadores" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nombre",
      type: "localeString",
      group: "content",
      validation: (r) => r.required(),
    }),
    slugField(),
    order(),
    defineField({
      name: "summary",
      title: "Descripción breve",
      type: "localeText",
      group: "content",
    }),
    defineField({
      name: "description",
      title: "Descripción completa",
      type: "localeBlock",
      group: "content",
    }),
    defineField({
      name: "guests",
      title: "Personas",
      type: "number",
      group: "content",
      validation: (r) => r.required().min(1).max(12),
    }),
    defineField({ name: "beds", title: "Camas", type: "localeString", group: "content" }),
    defineField({
      name: "area",
      title: "Metros cuadrados",
      type: "number",
      group: "content",
      description:
        "Se muestra en la web a partir de 60 m² (apartamentos y suites), como en el diseño aprobado. Escríbelo solo si es un dato confirmado.",
    }),
    defineField({
      name: "orientation",
      title: "Orientación y luz",
      type: "localeString",
      group: "content",
    }),
    defineField({
      name: "features",
      title: "Qué incluye",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({
      name: "petFriendly",
      title: "Admite perros",
      type: "boolean",
      initialValue: true,
      group: "content",
    }),
    defineField({
      name: "mainImage",
      title: "Foto principal",
      type: "imageWithAlt",
      group: "photos",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "Más fotos",
      type: "array",
      group: "photos",
      description:
        "Regla del hotel: cada habitación lleva foto de la habitación, la terraza (si la tiene), el baño y la zona de TV.",
      of: [
        defineArrayMember({
          type: "object",
          name: "roomPhoto",
          fields: [
            defineField({
              name: "kind",
              title: "Qué muestra",
              type: "string",
              options: {
                list: [
                  { title: "Habitación", value: "room" },
                  { title: "Terraza", value: "terrace" },
                  { title: "Baño", value: "bath" },
                  { title: "Zona de TV", value: "tv" },
                  { title: "Otra", value: "other" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "photo",
              title: "Foto",
              type: "imageWithAlt",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "photo.alt.es", subtitle: "kind", media: "photo.desktop" } },
        }),
      ],
    }),
    defineField({
      name: "priceFrom",
      title: "Precio «desde» por noche (€)",
      type: "number",
      group: "booking",
      description:
        "Precio orientativo para las tarjetas. La tarifa real, el calendario y la disponibilidad se fijan en Mews.",
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "mewsCategoryId",
      title: "ID del tipo de habitación en Mews",
      type: "string",
      group: "booking",
      description: "Hace que «Reservar» abra el motor directamente en esta habitación.",
    }),
    defineField({ name: "seo", title: "Buscadores", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title.es", subtitle: "guests", media: "mainImage.desktop" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? `${subtitle} personas` : undefined,
      media,
    }),
  },
});

export const offer = defineType({
  name: "offer",
  title: "Paquete o experiencia",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nombre",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    slugField(),
    order(),
    defineField({
      name: "summary",
      title: "Resumen",
      type: "localeText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Foto",
      type: "imageWithAlt",
      validation: (r) => r.required(),
    }),
    defineField({ name: "details", title: "Detalles", type: "localeBlock" }),
    defineField({ name: "cta", title: "Botón", type: "cta" }),
    defineField({
      name: "stripePriceId",
      title: "ID de precio en Stripe (solo bonos)",
      type: "string",
      description: "Empieza por price_. El importe se fija en Stripe, no aquí.",
    }),
  ],
  orderings: [{ title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title.es", media: "image.desktop" } },
});

export const faq = defineType({
  name: "faq",
  title: "Pregunta frecuente",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Pregunta",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "answer",
      title: "Respuesta",
      type: "localeText",
      validation: (r) => r.required(),
    }),
    order(),
  ],
  orderings: [{ title: "Orden", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question.es", subtitle: "answer.es" } },
});

export const post = defineType({
  name: "post",
  title: "Entrada del blog",
  type: "document",
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "seo", title: "Buscadores" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "localeString",
      group: "content",
      validation: (r) => r.required(),
    }),
    slugField(),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({ name: "author", title: "Autor", type: "string", group: "content" }),
    defineField({
      name: "excerpt",
      title: "Resumen",
      type: "localeText",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cover",
      title: "Foto de portada",
      type: "imageWithAlt",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Texto",
      type: "localeBlock",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({ name: "seo", title: "Buscadores", type: "seo", group: "seo" }),
  ],
  orderings: [
    { title: "Más recientes", name: "date", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: { select: { title: "title.es", subtitle: "publishedAt", media: "cover.desktop" } },
});

export const legalPage = defineType({
  name: "legalPage",
  title: "Página legal",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    slugField(),
    defineField({
      name: "updatedAt",
      title: "Última actualización",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Texto",
      type: "localeBlock",
      validation: (r) => r.required(),
    }),
    defineField({ name: "seo", title: "Buscadores", type: "seo" }),
  ],
  preview: { select: { title: "title.es", subtitle: "updatedAt" } },
});
