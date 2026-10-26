#!/usr/bin/env node
// Genera el contenido inicial del panel (sanity/seed/seed.json) a partir de la maqueta aprobada
// (creative/mockup/index.html) y de las fotos aprobadas (creative/provenance.json). Uso: node scripts/build-seed.mjs
// El panel lo carga solo la primera vez que lo abre un administrador (sanity/components/SeedOnFirstOpen.tsx).
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync("creative/mockup/index.html", "utf8");
const prov = Object.fromEntries(JSON.parse(fs.readFileSync("creative/provenance.json", "utf8")).assets.map((a) => [a.id, a]));
const approved = fs.readdirSync("creative/approved");

// --- datos de la maqueta (literales JS evaluados en un contexto aislado) ---
const between = (start, end) => {
  const a = html.indexOf(start);
  const b = html.indexOf(end, a);
  if (a < 0 || b < 0) throw new Error(`No encuentro ${start}`);
  return html.slice(a, b);
};
const ctx = {};
vm.createContext(ctx);
vm.runInContext(
  `${between("const ROOMS = {", "const FAQ = [")}\n${between("const FAQ = [", "const SPA = [")}\n${between("const SPA = [", "const FEAT = {")}\n` +
    `${between("const MAIL = ", "let legalKey")}\nthis.ROOMS = ROOMS; this.FAQ = FAQ; this.SPA = SPA; this.LEGAL = LEGAL;`,
  ctx,
);
const { ROOMS, FAQ, SPA, LEGAL } = ctx;

// --- utilidades ---
let n = 0;
const key = () => `k${(n++).toString(36).padStart(4, "0")}`;
const ls = (es, en) => ({ _type: "localeString", es, en });
const lt = (es, en) => ({ _type: "localeText", es, en });
const ref = (id) => ({ _type: "reference", _ref: id });
const slug = (s) => ({ _type: "slug", current: s });
const withKeys = (arr) => arr.map((x) => (x && typeof x === "object" ? { _key: key(), ...x } : x));
const img = (base) => {
  const d = approved.find((f) => f.startsWith(`${base}-escritorio.`));
  const m = approved.find((f) => f.startsWith(`${base}-movil.`));
  if (!d) throw new Error(`Falta la foto aprobada ${base}`);
  const alt = prov[`${base}-escritorio`]?.alt_draft;
  if (!alt?.es) throw new Error(`Falta el texto alternativo de ${base}`);
  return { _seedImage: base, desktop: `/seed/${base}-escritorio.webp`, mobile: m ? `/seed/${base}-movil.webp` : null, alt };
};
const kinetic = (s) => s.replace("|", " ");
const cta = (es, en, action, extra = {}) => ({ _type: "cta", label: ls(es, en), action, style: "primary", ...extra });

// HTML sencillo de las páginas legales → Portable Text
const span = (text, marks = []) => ({ _type: "span", _key: key(), text, marks });
function inline(htmlText, markDefs) {
  const out = [];
  const re = /<a href="([^"]+)"[^>]*>(.*?)<\/a>|<b>(.*?)<\/b>|([^<]+)/g;
  for (const m of htmlText.matchAll(re)) {
    if (m[1]) {
      const k = key();
      markDefs.push({ _key: k, _type: "link", href: m[1].replace(/^#\/legal\//, "/") });
      out.push(span(m[2], [k]));
    } else if (m[3]) out.push(span(m[3], ["strong"]));
    else if (m[4]) out.push(span(m[4]));
  }
  return out;
}
const block = (style, htmlText, list) => {
  const markDefs = [];
  const children = inline(htmlText, markDefs);
  return { _type: "block", _key: key(), style, markDefs, children, ...(list ? { listItem: list, level: 1 } : {}) };
};
function toBlocks(sections) {
  const blocks = [];
  for (const [title, body] of sections) {
    blocks.push(block("h2", title));
    for (const m of body.matchAll(/<h3>(.*?)<\/h3>|<p>(.*?)<\/p>|<li>(.*?)<\/li>/g)) {
      if (m[1]) blocks.push(block("h3", m[1]));
      else if (m[2]) blocks.push(block("normal", m[2]));
      else if (m[3]) blocks.push(block("normal", m[3], "bullet"));
    }
  }
  return blocks;
}

// --- documentos ---
const docs = [];
const PAL = {
  light: { background: "#EDF0F1", surface: "#F7F8F8", band: "#E1E7E9", ink: "#16202A", inkSoft: "#46535F", accent: "#B9431A", onAccent: "#FFFFFF" },
  dark: { background: "#11181F", surface: "#1A242D", band: "#162029", ink: "#E8ECEE", inkSoft: "#A9B4BD", accent: "#F0794A", onAccent: "#1A0F09" },
};
const palette = (p) => Object.fromEntries(Object.entries(p).map(([k, hex]) => [k, { _type: "color", hex }]));

docs.push({
  _id: "settings",
  _type: "settings",
  name: "Hotel Aurora",
  homePage: ref("page-inicio"),
  address: ls("El Palmar, Vejer de la Frontera (Cádiz)", "El Palmar, Vejer de la Frontera (Cádiz, Spain)"),
  geo: { lat: 36.22679, lng: -6.06377 },
  checkIn: "15:00",
  checkOut: "12:00",
  maxDogs: 2,
  phone: "+34 000 000 000",
  email: "reservas@hotelaurora.example",
  privacyEmail: "privacidad@hotelaurora.example",
  whatsapp: "+34000000000",
  mews: { environment: "demo" },
  seo: {
    _type: "seo",
    title: ls("Hotel boutique petfriendly en El Palmar, Vejer | Hotel Aurora", "Dog-friendly boutique hotel in El Palmar, Vejer | Hotel Aurora"),
    description: lt(
      "Hotel boutique petfriendly con spa y restaurante en El Palmar, Vejer de la Frontera (Cádiz). 28 habitaciones, hasta dos perros por habitación. Reserva directa.",
      "Dog-friendly boutique hotel with spa and restaurant in El Palmar, Vejer de la Frontera (Cádiz, Spain). 28 rooms, up to two dogs per room. Book direct.",
    ),
    noindex: false,
  },
  footerNote: lt("Proyecto de portfolio. El hotel, sus datos y sus precios son ficticios.", "Portfolio project. The hotel, its details and its prices are fictional."),
});
docs.push({ _id: "theme", _type: "theme", light: palette(PAL.light), dark: palette(PAL.dark), fontDisplay: "outfit", fontText: "work-sans" });

// Habitaciones
const kindOf = (desc) => (/TV/.test(desc) ? "tv" : /baño/i.test(desc) ? "bath" : /terraza/i.test(desc) ? "terrace" : "room");
const BASE = {
  P04: "p04-alba", P05: "p05-alba-tv", P06: "p06-alba-bano", P26: "p26-alba-bano-detalle", P27: "p27-alba-tv-vista-cama",
  P07: "p07-marea", P08: "p08-marea-mirador", P09: "p09-marea-camas", P28: "p28-marea-bano", P29: "p29-marea-tv",
  P10: "p10-terraza", P11: "p11-terraza-exterior", P12: "p12-terraza-camas", P30: "p30-terraza-bano", P31: "p31-terraza-tv",
  P13: "p13-faro-salon", P34: "p34-faro-tv", P14: "p14-faro-dormitorio-doble", P15: "p15-faro-dormitorio-individuales", P32: "p32-faro-bano", P35: "p35-faro-cocina-recibidor",
};
const FEATURES = [
  ["Baño propio", "Private bathroom"],
  ["Zona de TV", "TV corner"],
  ["Cuna de bebé o cama para mascota, sin coste (bajo petición)", "Baby crib or pet bed at no cost (on request)"],
  ["Cama y cuencos de cortesía para tu perro (hasta dos por habitación)", "A bed and bowls for your dog (up to two per room)"],
];
Object.entries(ROOMS).forEach(([k, r], i) => {
  const [main, ...rest] = r.photos.filter(([code]) => BASE[code]);
  docs.push({
    _id: `room-${k}`,
    _type: "room",
    title: ls(r.n, r.n),
    slug: slug(k),
    order: (i + 1) * 10,
    summary: lt(r.blurb.es, r.blurb.en),
    guests: r.guests,
    beds: ls(r.beds.es, r.beds.en),
    area: r.area,
    orientation: ls(r.orient.es, r.orient.en),
    features: withKeys(FEATURES.map(([es, en]) => ls(es, en))),
    petFriendly: true,
    mainImage: img(BASE[main[0]]),
    gallery: withKeys(rest.map(([code, es]) => ({ _type: "roomPhoto", kind: kindOf(es), photo: img(BASE[code]) }))),
    priceFrom: r.price,
  });
});

// Paquetes
docs.push(
  { _id: "offer-escapada", _type: "offer", title: ls("Escapada de dos noches", "Two-night getaway"), slug: slug("escapada-dos-noches"), order: 10,
    summary: lt("Dos noches en Alba o Marea, desayuno y circuito de agua.", "Two nights in Alba or Marea, breakfast and the water circuit."),
    image: img("p21-escapada"), cta: cta("Reservar", "Book", "booking") },
  { _id: "offer-cena", _type: "offer", title: ls("Cena en el hotel", "Dinner at the hotel"), slug: slug("cena-en-el-hotel"), order: 20,
    summary: lt("Menú de temporada para dos, con maridaje.", "Seasonal menu for two, with wine pairing."),
    image: img("p16-restaurante"), cta: { ...cta("Solicitar mesa", "Request a table", "table"), style: "secondary" } },
  { _id: "offer-spa", _type: "offer", title: ls("Día de spa", "Spa day"), slug: slug("dia-de-spa"), order: 30,
    summary: lt("Bono para un circuito de agua y un ritual de 60 minutos.", "A voucher for the water circuit and a 60-minute ritual."),
    image: img("p19-spa-tratamientos"), cta: { ...cta("Comprar bono", "Buy voucher", "voucher"), style: "secondary" } },
);

// Preguntas
FAQ.forEach(([q, a], i) => docs.push({ _id: `faq-${i + 1}`, _type: "faq", question: ls(q.es, q.en), answer: lt(a.es, a.en), order: (i + 1) * 10 }));

// Páginas legales
Object.entries(LEGAL).forEach(([k, L]) =>
  docs.push({
    _id: `legal-${k}`,
    _type: "legalPage",
    title: ls(L.es.n, L.en.n),
    slug: slug(k),
    updatedAt: "2026-10-25",
    body: { _type: "localeBlock", es: toBlocks(L.es.s), en: toBlocks(L.en.s) },
    seo: { _type: "seo", description: lt(L.es.d, L.en.d) },
  }),
);

// Página de inicio (secciones de la maqueta, en su orden)
const anchor = (s) => ({ anchor: slug(s), hidden: false });
const sections = [
  { _type: "sectionHero", heading: ls(kinetic("Hotel boutique|en *El Palmar.*"), kinetic("Boutique hotel|in *El Palmar.*")),
    lead: lt("Hotel Aurora es un hotel boutique petfriendly de 28 habitaciones en El Palmar, Vejer de la Frontera (Cádiz), con spa y restaurante propios. Reserva directa, sin intermediarios.",
      "Hotel Aurora is a dog-friendly boutique hotel with 28 rooms in El Palmar, Vejer de la Frontera (Cádiz, Spain), with its own spa and restaurant. Book direct, no middlemen."),
    facade: img("p01-hero"), reception: img("p36-recepcion-fin"), patio: img("p03-patio"),
    steps: withKeys([
      { _type: "heroStep", kicker: ls("El hotel", "The hotel"), title: ls("28 habitaciones en una casa *restaurada.*", "28 rooms in a *restored* house."),
        text: lt("Cal, madera y piedra. Alba tiene vigas; Terraza, terraza de caña; Marea, un banco en la ventana; Faro, salón y cocina.", "Limewash, timber and stone. Alba has beams; Terraza, a cane-covered terrace; Marea, a window seat; Faro, a living room and a kitchen.") },
      { _type: "heroStep", kicker: ls("Ubicación", "Location"), title: ls("Entre el surf de *El Palmar* y los pueblos blancos.", "Between the surf of *El Palmar* and the white villages."),
        text: lt("El Palmar es una playa de surf de Vejer de la Frontera, en la Costa de la Luz de Cádiz.", "El Palmar is a surf beach in Vejer de la Frontera, on the Costa de la Luz in Cádiz.") },
      { _type: "heroStep", kicker: ls("Admite perros", "Dogs welcome"), title: ls("Tu perro tiene *cama esperándole.*", "Your dog's *bed is waiting.*"),
        text: lt("Hasta dos perros por habitación, con cama y cuencos de cortesía. El suplemento por mascota se ve antes de pagar.", "Up to two dogs per room, with a bed and bowls provided. The pet supplement is shown before you pay.") },
    ]),
    walk: true, bookingBar: true, hidden: false },
  { _type: "sectionRooms", heading: ls("Habitaciones de cal, madera y piedra en El Palmar.", "Rooms of limewash, timber and stone in El Palmar."),
    intro: lt("Todas las habitaciones pueden pedir una cama para mascota o una cuna de bebé en la habitación, sin coste adicional.", "Every room can request a pet bed or a baby crib in the room at no extra cost."),
    ...anchor("habitaciones") },
  { _type: "sectionDirect", kicker: ls("En la web del hotel", "On the hotel's own website"), heading: ls("Reserva directa con el hotel.", "Book direct with the hotel."),
    items: withKeys([
      ls("Sin intermediarios ni su comisión. Hablas con el hotel, no con una plataforma.", "No middlemen and no middleman commission. You deal with the hotel, not a platform."),
      ls("Condiciones claras. Ves la política de cancelación de cada tarifa antes de pagar.", "Clear terms. You see each rate's cancellation policy before you pay."),
      ls("Pago seguro. Lo gestiona el motor de reservas; esta web nunca ve tu tarjeta.", "Secure payment. The booking engine handles it; this website never sees your card."),
      ls("En español o en inglés. Unos pocos pasos, también desde el móvil.", "In Spanish or English. A few steps, from your phone too."),
    ]),
    ctas: withKeys([cta("Reservar directo", "Book direct", "booking"), { ...cta("WhatsApp", "WhatsApp", "whatsapp"), style: "secondary" }]), hidden: false },
  { _type: "sectionFeature", heading: ls("*Restaurante de cocina de mercado,* del desayuno a la cena.", "*A market-cuisine restaurant,* from breakfast to dinner."),
    text: lt("Desayuno hasta media mañana y cena con producto de temporada. Pide mesa y te confirmamos por correo o WhatsApp.", "Breakfast until mid-morning and dinner with seasonal produce. Request a table and we confirm by email or WhatsApp."),
    image: img("p16-restaurante"), ctas: withKeys([{ ...cta("Solicitar mesa", "Request a table", "table"), style: "secondary" }]),
    layout: "fullBleed", background: "page", ...anchor("restaurante") },
  { _type: "sectionFeature", heading: ls("Hotel con *spa de agua y silencio* en la Costa de la Luz.", "A hotel with a *spa of water and silence* on the Costa de la Luz."),
    image: img("p19-spa-tratamientos"),
    groups: withKeys(SPA.map((g) => ({ _type: "featureGroup", title: ls(g.t.es, g.t.en), text: lt(g.p.es, g.p.en),
      items: withKeys(g.items.map(([a, b]) => ({ _type: "labelValue", label: ls(a.es, a.en), value: ls(b.es, b.en) }))) }))),
    ctas: withKeys([{ ...cta("Pedir cita en el spa", "Book a spa appointment", "spa"), style: "secondary" }]),
    layout: "imageLeft", background: "page", ...anchor("spa") },
  { _type: "sectionFeature", heading: ls("*Hotel petfriendly:* tu perro también está invitado.", "*Pet-friendly hotel:* your dog is invited too."),
    image: img("p25-perro-terraza"),
    bullets: withKeys([
      ls("Hotel petfriendly en Vejer de la Frontera: hasta dos perros por habitación.", "Dog-friendly hotel in Vejer de la Frontera: up to two dogs per room."),
      ls("Cama y cuencos de cortesía en la habitación.", "A bed and bowls provided in the room."),
      ls("El suplemento por mascota se ve antes de pagar.", "The pet supplement is shown before you pay."),
    ]),
    ctas: withKeys([{ ...cta("Ver condiciones", "See the conditions", "link"), href: "/condiciones", style: "link" }]),
    layout: "imageRight", background: "page", ...anchor("mascotas") },
  { _type: "sectionOffers", heading: ls("Escapadas, cenas y días de spa", "Getaways, dinners and spa days"),
    intro: lt("Dos noches, una cena o un día de spa: elige tu plan.", "Two nights, a dinner or a spa day: pick your plan."), ...anchor("paquetes") },
  { _type: "sectionFacts", kicker: ls("Hotel Aurora, de un vistazo", "Hotel Aurora at a glance"),
    heading: ls("Disfruta *en familia junto a tu perro,* en la playa de El Palmar.", "Enjoy *family time with your dog* on El Palmar beach."),
    lead: lt("Hotel Aurora es un hotel boutique petfriendly en El Palmar, Vejer de la Frontera (Cádiz): una casa restaurada con spa y restaurante, a un paseo de la arena.",
      "Hotel Aurora is a dog-friendly boutique hotel in El Palmar, Vejer de la Frontera (Cádiz, Spain): a restored house with a spa and a restaurant, a short walk from the sand."),
    image: img("p24-familia-playa"),
    facts: withKeys([
      ["Habitaciones", "Rooms", "28, de 2 a 4 personas", "28, for 2 to 4 guests"],
      ["Perros", "Dogs", "Hasta dos por habitación", "Up to two per room"],
      ["Bebés y mascotas", "Babies and pets", "Cuna o cama, sin coste", "Crib or pet bed, free"],
      ["Entrada y salida", "Check-in and check-out", "15:00 · 12:00", "15:00 · 12:00"],
      ["En la casa", "In the house", "Spa y restaurante", "Spa and restaurant"],
      ["Reserva", "Booking", "Directa, sin intermediarios", "Direct, no middlemen"],
    ].map(([a, b, c, d]) => ({ _type: "labelValue", label: ls(a, b), value: ls(c, d) }))),
    ...anchor("datos") },
  { _type: "sectionFaq", heading: ls("Preguntas frecuentes sobre Hotel Aurora", "Frequently asked questions about Hotel Aurora"), ...anchor("faq") },
  { _type: "sectionMap", heading: ls("Cómo llegar a El Palmar, Vejer de la Frontera", "Getting to El Palmar, Vejer de la Frontera"),
    lead: lt("En El Palmar, Vejer de la Frontera (Cádiz), en la Costa de la Luz, junto a la playa de surf de El Palmar.", "In El Palmar, Vejer de la Frontera (Cádiz, Spain), on the Costa de la Luz, next to El Palmar surf beach."),
    note: ls("Proyecto de portfolio: la ubicación del hotel es ficticia; el mapa muestra la zona real de la Playa de El Palmar.", "Portfolio project: the hotel location is fictional; the map shows the real area of El Palmar beach."),
    ...anchor("llegar") },
  { _type: "sectionClosing", heading: ls("Reserva tu escapada en El Palmar", "Book your El Palmar getaway"), accentLine: ls("y no dejes a tu perro en casa.", "and don’t leave your dog at home."),
    text: lt("Escríbenos si prefieres hablar con una persona.", "Write to us if you prefer to talk to a person."),
    ctas: withKeys([cta("Reservar", "Book", "booking"), { ...cta("Escríbenos por WhatsApp", "Message us on WhatsApp", "whatsapp"), style: "secondary" }]), hidden: false },
];
docs.push({ _id: "page-inicio", _type: "page", title: ls("Inicio", "Home"), slug: slug("inicio"), sections: withKeys(sections) });

// Menú y pie
const nav = (es, en, extra) => ({ _type: "navLink", label: ls(es, en), ...extra });
docs.push({
  _id: "navigation",
  _type: "navigation",
  header: withKeys([
    nav("Habitaciones", "Rooms", { page: ref("page-inicio"), anchor: "habitaciones" }),
    nav("Restaurante", "Restaurant", { page: ref("page-inicio"), anchor: "restaurante" }),
    nav("Spa", "Spa", { page: ref("page-inicio"), anchor: "spa" }),
    nav("Petfriendly", "Pet-friendly", { page: ref("page-inicio"), anchor: "mascotas" }),
    nav("Paquetes", "Packages", { page: ref("page-inicio"), anchor: "paquetes" }),
  ]),
  footer: withKeys([
    { _type: "navColumn", title: ls("El hotel", "The hotel"), links: withKeys([
      nav("Habitaciones", "Rooms", { page: ref("page-inicio"), anchor: "habitaciones" }),
      nav("Restaurante", "Restaurant", { page: ref("page-inicio"), anchor: "restaurante" }),
      nav("Spa", "Spa", { page: ref("page-inicio"), anchor: "spa" }),
      nav("Petfriendly", "Pet-friendly", { page: ref("page-inicio"), anchor: "mascotas" }),
      nav("Cómo llegar", "Getting here", { page: ref("page-inicio"), anchor: "llegar" }),
    ]) },
    { _type: "navColumn", title: ls("Legal", "Legal"), links: withKeys(
      [["aviso-legal", "Aviso legal", "Legal notice"], ["privacidad", "Privacidad", "Privacy"], ["cookies", "Cookies", "Cookies"], ["condiciones", "Condiciones de reserva", "Booking terms"]]
        .map(([k, es, en]) => nav(es, en, { page: ref(`legal-${k}`) })),
    ) },
  ]),
});

// Fotos usadas
const images = {};
JSON.stringify(docs, (k, v) => {
  if (v && typeof v === "object" && v._seedImage) images[v._seedImage] = { desktop: v.desktop, mobile: v.mobile, alt: v.alt };
  return v;
});
const out = { version: 1, generatedFrom: "creative/mockup/index.html", images, documents: docs };
fs.writeFileSync("sanity/seed/seed.json", JSON.stringify(out, null, 2) + "\n");
console.log(`seed.json: ${docs.length} documentos, ${Object.keys(images).length} fotos`);
console.log(Object.keys(images).join(" "));
