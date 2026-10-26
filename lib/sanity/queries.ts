/**
 * Consultas GROQ de la web pública. Solo contenido publicado; las referencias se resuelven aquí. Todas reciben
 * `$editing` (lo pone sanityFetch): en el editor visual del panel se ven también las secciones ocultas, para poder
 * volver a mostrarlas.
 */

const IMG = `{ "desktop": desktop{ "ref": asset._ref, crop, hotspot }, "mobile": mobile{ "ref": asset._ref, crop, hotspot }, alt }`;
const CTA = `{ _key, label, action, href, style, "room": room->slug.current, "offer": offer->slug.current }`;
const LINK = `{ _key, label, anchor, "target": page->{ _type, _id, "slug": slug.current } }`;
const ROOM_CARD = `{ _id, title, "slug": slug.current, summary, guests, beds, area, orientation, priceFrom, mewsCategoryId, mainImage${IMG} }`;
const OFFER = `{ _id, title, "slug": slug.current, summary, image${IMG}, cta${CTA} }`;
const POST_CARD = `{ _id, title, "slug": slug.current, publishedAt, excerpt, cover${IMG} }`;
const PUBLIC_ROOMS = `*[_type == "room" && defined(slug.current)] | order(order asc, title.es asc)`;

/**
 * Listas ordenables de una sección (habitaciones, paquetes, preguntas): primero las elegidas en la sección, en su orden
 * (con su `_key`, para arrastrarlas en el editor visual), y después cualquier otra que exista, en su orden propio. Así
 * una habitación nueva sale sola al final y se recoloca arrastrándola. Las referencias rotas (borradas) se ignoran.
 */
const orderedList = (field: string, all: string, projection: string) =>
  `[...coalesce(${field}, [])[defined(@->_id)]{ _key, ...@->${projection} }, ...${all}[!(_id in coalesce(^.${field}[]._ref, []))]${projection}]`;

const SECTIONS = `sections[$editing || hidden != true]{
  ...,
  "anchor": anchor.current,
  ctas[]${CTA},
  _type == "sectionHero" => { facade${IMG}, reception${IMG}, patio${IMG}, steps[]{ ..., link${CTA} } },
  _type in ["sectionFeature", "sectionFacts"] => { image${IMG} },
  _type == "sectionRooms" => { "rooms": ${orderedList("rooms", `(${PUBLIC_ROOMS})`, ROOM_CARD)} },
  _type == "sectionOffers" => { "offers": ${orderedList("offers", `(*[_type == "offer"] | order(order asc))`, OFFER)} },
  _type == "sectionFaq" => { "faqs": ${orderedList("faqs", `(*[_type == "faq"] | order(order asc))`, "{ _id, question, answer }")} },
  _type == "sectionGallery" => { images[]{ _key, ...${IMG} } },
  _type == "sectionBlog" => { "posts": *[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc)${POST_CARD} }
}`;

export const SITE_QUERY = `{
  "settings": *[_id == "settings"][0]{ name, "home": homePage._ref, address, geo, checkIn, checkOut, maxDogs, phone, email, privacyEmail, whatsapp, social, mews, seo, footerNote },
  "theme": *[_id == "theme"][0]{
    "light": light{ "background": background.hex, "surface": surface.hex, "band": band.hex, "ink": ink.hex, "inkSoft": inkSoft.hex, "accent": accent.hex, "onAccent": onAccent.hex },
    "dark": dark{ "background": background.hex, "surface": surface.hex, "band": band.hex, "ink": ink.hex, "inkSoft": inkSoft.hex, "accent": accent.hex, "onAccent": onAccent.hex },
    fontDisplay, fontText
  },
  "nav": *[_id == "navigation"][0]{ header[]${LINK}, footer[]{ _key, title, links[]${LINK} } },
  "hasPosts": count(*[_type == "post" && defined(slug.current) && publishedAt <= now()]) > 0,
  "cookies": *[_id == "cookieNotice"][0]{ title, text, analytics, marketing },
  "faqs": *[_type == "faq"] | order(order asc)[0...12]{ _id, question, answer }
}`;

export const HOME_QUERY = `*[_id == *[_id == "settings"][0].homePage._ref][0]{ _id, title, "slug": slug.current, seo, ${SECTIONS} }`;
export const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{ _id, title, "slug": slug.current, seo, ${SECTIONS} }`;
export const LEGAL_QUERY = `*[_type == "legalPage" && slug.current == $slug][0]{ _id, title, "slug": slug.current, updatedAt, body, seo }`;
export const LEGAL_LIST_QUERY = `*[_type == "legalPage" && defined(slug.current)] | order(title.es asc){ _id, title, "slug": slug.current }`;
export const ROOM_QUERY = `*[_type == "room" && slug.current == $slug][0]{
  ...${ROOM_CARD}, description, features, petFriendly, seo, gallery[]{ _key, kind, photo${IMG} }
}`;
export const ROOMS_QUERY = `${PUBLIC_ROOMS}${ROOM_CARD}`;
export const POSTS_QUERY = `*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc)${POST_CARD}`;
export const POST_QUERY = `*[_type == "post" && slug.current == $slug && publishedAt <= now()][0]{ ...${POST_CARD}, body, seo }`;
export const FAQS_QUERY = `*[_type == "faq"] | order(order asc){ _id, question, answer }`;

/** Rutas para el mapa del sitio y la generación estática. */
export const ROUTES_QUERY = `{
  "home": *[_id == "settings"][0].homePage._ref,
  "pages": *[_type == "page" && defined(slug.current) && seo.noindex != true]{ _id, "slug": slug.current, _updatedAt },
  "rooms": *[_type == "room" && defined(slug.current) && seo.noindex != true]{ "slug": slug.current, _updatedAt },
  "legal": *[_type == "legalPage" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current) && publishedAt <= now() && seo.noindex != true]{ "slug": slug.current, _updatedAt }
}`;
