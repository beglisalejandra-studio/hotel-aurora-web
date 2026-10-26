import { defineDocuments, defineLocations, presentationTool } from "sanity/presentation";

/**
 * «Editar la web»: la web real dentro del panel, editable. Al pulsar un texto se abre su campo; las secciones y las
 * listas (habitaciones, paquetes, preguntas) se arrastran o se mueven con la barra en español de cada sección.
 * La vista previa se abre con un secreto de un solo uso que comprueba /api/draft-mode/enable.
 */
const HOME = `_id == *[_id == "settings"][0].homePage._ref`;

export const editTheWebsite = presentationTool({
  name: "editar",
  title: "Editar la web",
  previewUrl: {
    initial: "/",
    previewMode: { enable: "/api/draft-mode/enable", disable: "/api/draft-mode/disable" },
  },
  resolve: {
    // Qué documento se abre al lado según la página que se ve
    mainDocuments: defineDocuments([
      { route: ["/", "/en"], filter: HOME },
      {
        route: ["/habitaciones/:slug", "/en/habitaciones/:slug"],
        filter: `_type == "room" && slug.current == $slug`,
      },
      {
        route: ["/blog/:slug", "/en/blog/:slug"],
        filter: `_type == "post" && slug.current == $slug`,
      },
      {
        route: ["/:slug", "/en/:slug"],
        filter: `_type in ["page", "legalPage"] && slug.current == $slug`,
      },
    ]),
    // Dónde se ve cada documento (el panel lo enseña encima del formulario, con un clic para ir)
    locations: {
      room: defineLocations({
        select: { title: "title.es", slug: "slug.current" },
        resolve: (doc) => ({
          locations: [
            ...(doc?.slug
              ? [{ title: doc.title || "Habitación", href: `/habitaciones/${doc.slug}` }]
              : []),
            { title: "Portada", href: "/" },
          ],
        }),
      }),
      page: defineLocations({
        select: { title: "title.es", slug: "slug.current" },
        resolve: (doc) => ({
          locations: doc?.slug ? [{ title: doc.title || "Página", href: `/${doc.slug}` }] : [],
        }),
      }),
      post: defineLocations({
        select: { title: "title.es", slug: "slug.current" },
        resolve: (doc) => ({
          locations: doc?.slug
            ? [{ title: doc.title || "Entrada", href: `/blog/${doc.slug}` }]
            : [],
        }),
      }),
      legalPage: defineLocations({
        select: { title: "title.es", slug: "slug.current" },
        resolve: (doc) => ({
          locations: doc?.slug ? [{ title: doc.title || "Texto legal", href: `/${doc.slug}` }] : [],
        }),
      }),
      offer: defineLocations({ locations: [{ title: "Portada", href: "/" }] }),
      faq: defineLocations({ locations: [{ title: "Portada", href: "/" }] }),
      settings: defineLocations({ locations: [{ title: "Toda la web", href: "/" }] }),
      theme: defineLocations({ locations: [{ title: "Toda la web", href: "/" }] }),
      navigation: defineLocations({ locations: [{ title: "Toda la web", href: "/" }] }),
      cookieNotice: defineLocations({ locations: [{ title: "Toda la web", href: "/" }] }),
    },
  },
});
