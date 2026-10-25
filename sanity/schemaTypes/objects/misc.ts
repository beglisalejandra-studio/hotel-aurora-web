import { defineArrayMember, defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "Buscadores y redes sociales",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Título en Google",
      type: "localeString",
      description: "Hasta 60 caracteres. Si lo dejas vacío se usa el título de la página.",
      validation: (r) =>
        r
          .custom((v?: { es?: string }) =>
            v?.es && v.es.length > 60 ? "Mejor con 60 caracteres o menos." : true,
          )
          .warning(),
    }),
    defineField({
      name: "description",
      title: "Descripción en Google",
      type: "localeText",
      description: "Hasta 160 caracteres.",
      validation: (r) =>
        r
          .custom((v?: { es?: string }) =>
            v?.es && v.es.length > 160 ? "Mejor con 160 caracteres o menos." : true,
          )
          .warning(),
    }),
    defineField({ name: "shareImage", title: "Imagen al compartir", type: "image" }),
    defineField({
      name: "noindex",
      title: "Ocultar en buscadores",
      type: "boolean",
      initialValue: false,
      description:
        "Actívalo solo para páginas que no deben aparecer en Google (por ejemplo, una página de gracias).",
    }),
  ],
});

/** Botón o enlace con una acción concreta; la web decide cómo abrir la reserva, la mesa, el spa o el bono. */
export const cta = defineType({
  name: "cta",
  title: "Botón",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Texto del botón",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "action",
      title: "Qué hace",
      type: "string",
      initialValue: "booking",
      options: {
        list: [
          { title: "Abrir la reserva", value: "booking" },
          { title: "Pedir mesa en el restaurante", value: "table" },
          { title: "Pedir cita en el spa", value: "spa" },
          { title: "Comprar un bono", value: "voucher" },
          { title: "Escribir por WhatsApp", value: "whatsapp" },
          { title: "Ir a una página o dirección", value: "link" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "room",
      title: "Habitación (opcional)",
      type: "reference",
      to: [{ type: "room" }],
      hidden: ({ parent }) => parent?.action !== "booking",
    }),
    defineField({
      name: "offer",
      title: "Bono",
      type: "reference",
      to: [{ type: "offer" }],
      hidden: ({ parent }) => parent?.action !== "voucher",
    }),
    defineField({
      name: "href",
      title: "Dirección",
      type: "string",
      description: "Una página del sitio (/blog) o una dirección completa (https://…).",
      hidden: ({ parent }) => parent?.action !== "link",
    }),
    defineField({
      name: "style",
      title: "Estilo",
      type: "string",
      initialValue: "primary",
      options: {
        list: [
          { title: "Principal (relleno)", value: "primary" },
          { title: "Secundario (contorno)", value: "secondary" },
          { title: "Enlace con flecha", value: "link" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
  ],
  preview: { select: { title: "label.es", subtitle: "action" } },
});

export const labelValue = defineType({
  name: "labelValue",
  title: "Dato",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Nombre",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "value",
      title: "Valor",
      type: "localeString",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "label.es", subtitle: "value.es" } },
});

export const navLink = defineType({
  name: "navLink",
  title: "Enlace del menú",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Texto",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "page",
      title: "Página",
      type: "reference",
      to: [{ type: "page" }, { type: "room" }, { type: "legalPage" }, { type: "post" }],
    }),
    defineField({
      name: "anchor",
      title: "Sección de la página (opcional)",
      type: "string",
      description: "El «nombre para el menú» de una sección, por ejemplo «restaurante».",
    }),
    defineField({ name: "href", title: "O una dirección externa", type: "url" }),
  ],
  preview: { select: { title: "label.es", subtitle: "anchor" } },
});

export const navColumn = defineType({
  name: "navColumn",
  title: "Columna del pie",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "links",
      title: "Enlaces",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
    }),
  ],
  preview: { select: { title: "title.es" } },
});
