/**
 * Nombres de las secciones en el editor visual (iguales a los del panel, sanity/schemaTypes/sections). La portada
 * (recorrido) no se añade ni se mueve: va siempre la primera y lleva el titular principal de la página.
 */
export const SECTION_LABELS = {
  sectionHero: "Portada",
  sectionRooms: "Habitaciones",
  sectionFeature: "Foto y texto (restaurante, spa, mascotas…)",
  sectionDirect: "Reserva directa",
  sectionOffers: "Paquetes y experiencias",
  sectionFacts: "El hotel de un vistazo",
  sectionFaq: "Preguntas frecuentes",
  sectionMap: "Cómo llegar (mapa)",
  sectionClosing: "Cierre con llamada a reservar",
  sectionRichText: "Texto libre",
  sectionGallery: "Galería de fotos",
  sectionBlog: "Últimas entradas del blog",
} as const;

export type SectionType = keyof typeof SECTION_LABELS;
export const ADDABLE_SECTIONS = (Object.keys(SECTION_LABELS) as SectionType[]).filter(
  (t) => t !== "sectionHero",
);

/** Listas que se ordenan arrastrando y el tipo de documento que contienen. */
export const ORDERED_LISTS = {
  sectionRooms: { field: "rooms", type: "room", add: "Añadir habitación" },
  sectionOffers: { field: "offers", type: "offer", add: "Añadir paquete" },
  sectionFaq: { field: "faqs", type: "faq", add: "Añadir pregunta" },
} as const;

/** Enlace del panel para crear un documento nuevo (se abre en la ventana del panel, fuera de la vista previa). */
export const createHref = (type: string) => `/admin/intent/create/type=${type}/`;
