import { defineField, defineType } from "sanity";

/** Campos bilingües: el español es obligatorio; si falta el inglés, la web muestra el español y el panel avisa. */
const enWarning = (v: unknown) =>
  v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)
    ? "Falta la traducción al inglés: la web mostrará el texto en español."
    : true;

export const localeString = defineType({
  name: "localeString",
  title: "Texto corto (ES/EN)",
  type: "object",
  fields: [
    defineField({ name: "es", title: "Español", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (r) => r.custom(enWarning).warning(),
    }),
  ],
  options: { columns: 2 },
});

export const localeText = defineType({
  name: "localeText",
  title: "Texto (ES/EN)",
  type: "object",
  fields: [
    defineField({
      name: "es",
      title: "Español",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 3,
      validation: (r) => r.custom(enWarning).warning(),
    }),
  ],
});

const richBlock = {
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Subtítulo", value: "h2" },
    { title: "Apartado", value: "h3" },
  ],
  lists: [
    { title: "Lista", value: "bullet" },
    { title: "Numerada", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Negrita", value: "strong" },
      { title: "Cursiva", value: "em" },
    ],
    annotations: [
      {
        name: "link",
        title: "Enlace",
        type: "object",
        fields: [
          {
            name: "href",
            title: "Dirección",
            type: "url",
            validation: (r: { uri: (o: object) => unknown }) =>
              r.uri({ allowRelative: true, scheme: ["https", "mailto", "tel"] }),
          },
        ],
      },
    ],
  },
};

export const localeBlock = defineType({
  name: "localeBlock",
  title: "Texto con formato (ES/EN)",
  type: "object",
  fields: [
    defineField({
      name: "es",
      title: "Español",
      type: "array",
      of: [richBlock, { type: "imageWithAlt" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [richBlock, { type: "imageWithAlt" }],
      validation: (r) => r.custom(enWarning).warning(),
    }),
  ],
});
