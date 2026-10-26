import { defineArrayMember, defineField, defineType } from "sanity";
import { DEFAULT_PALETTES } from "../../defaults";
import { paletteProblems, type PaletteKey } from "../../lib/contrast";

/** Documentos únicos: solo existe uno de cada (el panel no deja crear otro ni borrarlo). */
export const SINGLETONS = ["settings", "theme", "navigation", "cookieNotice"] as const;

export const settings = defineType({
  name: "settings",
  title: "Ajustes del hotel",
  type: "document",
  groups: [
    { name: "hotel", title: "Hotel", default: true },
    { name: "contact", title: "Contacto" },
    { name: "booking", title: "Reservas" },
    { name: "seo", title: "Buscadores" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nombre del hotel",
      type: "string",
      group: "hotel",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "homePage",
      title: "Página de inicio",
      type: "reference",
      to: [{ type: "page" }],
      group: "hotel",
      validation: (r) => r.required(),
    }),
    defineField({ name: "address", title: "Dirección", type: "localeString", group: "hotel" }),
    defineField({
      name: "geo",
      title: "Ubicación en el mapa",
      type: "object",
      group: "hotel",
      description:
        "Coordenadas del hotel. Se usan para el pin del mapa y para abrir la app de mapas del visitante.",
      fields: [
        defineField({
          name: "lat",
          title: "Latitud",
          type: "number",
          validation: (r) => r.min(-90).max(90),
        }),
        defineField({
          name: "lng",
          title: "Longitud",
          type: "number",
          validation: (r) => r.min(-180).max(180),
        }),
      ],
      options: { columns: 2 },
    }),
    defineField({
      name: "checkIn",
      title: "Hora de entrada",
      type: "string",
      initialValue: "15:00",
      group: "hotel",
      validation: (r) => r.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "hora (HH:MM)" }),
    }),
    defineField({
      name: "checkOut",
      title: "Hora de salida",
      type: "string",
      initialValue: "12:00",
      group: "hotel",
      validation: (r) => r.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "hora (HH:MM)" }),
    }),
    defineField({
      name: "maxDogs",
      title: "Perros por habitación",
      type: "number",
      initialValue: 2,
      group: "hotel",
      validation: (r) => r.min(0).max(6),
    }),
    defineField({ name: "phone", title: "Teléfono", type: "string", group: "contact" }),
    defineField({ name: "email", title: "Correo de reservas", type: "email", group: "contact" }),
    defineField({
      name: "privacyEmail",
      title: "Correo para privacidad",
      type: "email",
      group: "contact",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp (con prefijo, sin espacios)",
      type: "string",
      group: "contact",
      validation: (r) => r.regex(/^\+?\d{8,15}$/, { name: "número" }),
    }),
    defineField({
      name: "social",
      title: "Redes sociales",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "network",
              title: "Red",
              type: "string",
              options: {
                list: ["Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn", "Pinterest"],
              },
            }),
            defineField({
              name: "url",
              title: "Dirección",
              type: "url",
              validation: (r) => r.uri({ scheme: ["https"] }),
            }),
          ],
          preview: { select: { title: "network", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "mews",
      title: "Motor de reservas (Mews)",
      type: "object",
      group: "booking",
      description:
        "Calendario, precios y reservas se gestionan en Mews. Aquí solo se conecta la web con tu cuenta.",
      fields: [
        defineField({
          name: "configurationId",
          title: "ID de configuración del motor",
          type: "string",
        }),
        defineField({
          name: "environment",
          title: "Entorno",
          type: "string",
          initialValue: "demo",
          options: {
            list: [
              { title: "Demo (pruebas)", value: "demo" },
              { title: "Real (producción)", value: "production" },
            ],
            layout: "radio",
          },
        }),
      ],
    }),
    defineField({ name: "seo", title: "Buscadores (por defecto)", type: "seo", group: "seo" }),
    defineField({ name: "footerNote", title: "Nota del pie", type: "localeText", group: "hotel" }),
  ],
  preview: { prepare: () => ({ title: "Ajustes del hotel" }) },
});

const paletteInitial = (mode: "light" | "dark") =>
  Object.fromEntries(
    Object.entries(DEFAULT_PALETTES[mode]).map(([k, hex]) => [k, { _type: "color", hex }]),
  );

const paletteFields = () =>
  (
    [
      ["background", "Fondo de la página"],
      ["surface", "Fondo de tarjetas y paneles"],
      ["band", "Franjas de color"],
      ["ink", "Texto principal"],
      ["inkSoft", "Texto secundario"],
      ["accent", "Color de acento (botones y titulares destacados)"],
      ["onAccent", "Texto sobre el color de acento"],
    ] as const
  ).map(([name, title]) =>
    defineField({
      name,
      title,
      type: "color",
      options: { disableAlpha: true },
      validation: (r) => r.required(),
    }),
  );

const paletteValidation = (v: unknown) => {
  const p = (v ?? {}) as Partial<Record<PaletteKey, { hex?: string }>>;
  const hex = Object.fromEntries(Object.entries(p).map(([k, c]) => [k, c?.hex])) as Partial<
    Record<PaletteKey, string>
  >;
  const problems = paletteProblems(hex);
  return problems.length ? `Algunos textos no se leerían bien. ${problems.join(" ")}` : true;
};

export const FONT_OPTIONS = [
  { title: "Outfit (actual, titulares)", value: "outfit" },
  { title: "Work Sans (actual, textos)", value: "work-sans" },
  { title: "Fraunces (con remate, elegante)", value: "fraunces" },
  { title: "Manrope (moderna y clara)", value: "manrope" },
  { title: "DM Sans (sencilla y legible)", value: "dm-sans" },
  { title: "Cormorant Garamond (clásica, solo titulares)", value: "cormorant" },
];

export const theme = defineType({
  name: "theme",
  title: "Colores y tipografías",
  type: "document",
  fields: [
    defineField({
      name: "light",
      title: "Colores del modo Día",
      type: "object",
      initialValue: paletteInitial("light"),
      fields: paletteFields(),
      // Aviso, no bloqueo: al publicar se pide confirmación (sanity/actions/contrastConfirm.tsx).
      validation: (r) => r.custom(paletteValidation).warning(),
    }),
    defineField({
      name: "dark",
      title: "Colores del modo Madrugada",
      type: "object",
      initialValue: paletteInitial("dark"),
      fields: paletteFields(),
      options: { collapsible: true, collapsed: true },
      // Aviso, no bloqueo: al publicar se pide confirmación (sanity/actions/contrastConfirm.tsx).
      validation: (r) => r.custom(paletteValidation).warning(),
    }),
    defineField({
      name: "fontDisplay",
      title: "Tipografía de titulares",
      type: "string",
      initialValue: "outfit",
      options: { list: FONT_OPTIONS },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "fontText",
      title: "Tipografía de textos",
      type: "string",
      initialValue: "work-sans",
      options: { list: FONT_OPTIONS.filter((f) => f.value !== "cormorant") },
      validation: (r) => r.required(),
      description:
        "Todas las tipografías están alojadas en la propia web: cambiarla no conecta a los visitantes con terceros.",
    }),
  ],
  preview: { prepare: () => ({ title: "Colores y tipografías" }) },
});

export const navigation = defineType({
  name: "navigation",
  title: "Menú y pie",
  type: "document",
  fields: [
    defineField({
      name: "header",
      title: "Menú principal",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
      validation: (r) => r.max(7),
    }),
    defineField({
      name: "footer",
      title: "Columnas del pie",
      type: "array",
      of: [defineArrayMember({ type: "navColumn" })],
      validation: (r) => r.max(4),
    }),
  ],
  preview: { prepare: () => ({ title: "Menú y pie" }) },
});

export const cookieNotice = defineType({
  name: "cookieNotice",
  title: "Aviso de cookies",
  type: "document",
  description:
    "El aviso que ve cada visitante la primera vez, con los botones Aceptar, Rechazar y Configurar al mismo nivel (criterio de la AEPD). Si dejas un texto vacío, se usa el de serie. El detalle de cada cookie va en «Textos legales» → «Política de cookies».",
  fields: [
    defineField({ name: "title", title: "Título", type: "localeString" }),
    defineField({
      name: "text",
      title: "Texto",
      type: "localeText",
      description:
        "Di quién usa las cookies, para qué y si hay de terceros. Debe poder leerse en pocos segundos.",
    }),
    defineField({
      name: "analytics",
      title: "Qué hace la analítica",
      type: "localeString",
      description: "Una frase. Aparece al pulsar «Configurar».",
    }),
    defineField({
      name: "marketing",
      title: "Qué hace el marketing",
      type: "localeString",
      description: "Una frase. Aparece al pulsar «Configurar».",
    }),
  ],
  preview: { prepare: () => ({ title: "Aviso de cookies" }) },
});
