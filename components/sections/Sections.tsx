import Link from "next/link";
import { PortableText } from "next-sanity";
import { Fragment, type CSSProperties } from "react";
import { AddCard } from "@/components/edit/AddCard";
import { EditSection } from "@/components/edit/EditSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Cta } from "@/components/site/Cta";
import { Photo } from "@/components/site/Photo";
import { Accent } from "@/components/site/Text";
import type { Locale } from "@/lib/i18n/config";
import { localePath, plain, tr } from "@/lib/i18n/text";
import { ui } from "@/lib/i18n/ui";
import { sanityAttr, sectionPath, type EditDoc } from "@/lib/edit/attr";
import { ORDERED_LISTS, type SectionType } from "@/lib/edit/labels";
import { MAP_LEVELS, worldPx16 } from "@/lib/map";
import { waHref } from "@/lib/site-data";
import type { Faq, Section, Settings } from "@/lib/sanity/types";
import { HeroSection } from "./Hero";
import { PostCards } from "./PostCards";
import { RoomCards } from "./RoomCards";

type Ctx = {
  lang: Locale;
  settings: Settings | null;
  prev?: Section;
  first: boolean;
  /** Solo en el editor visual del panel: el documento de la página que se está editando. */
  edit?: EditDoc;
};
type Of<T extends Section["_type"]> = Extract<Section, { _type: T }>;

const hid = (s: Section) => `h-${s._key}`;
const style = (v: Record<string, string>) => v as CSSProperties;

/** Cada documento una sola vez (si la lista de la sección lo repite, vale la primera posición). */
const unique = <T extends { _id: string }>(xs: (T | null | undefined)[] | undefined): T[] =>
  (xs ?? []).filter((x, i, all): x is T => !!x && all.findIndex((y) => y?._id === x._id) === i);

/** Atributos de un elemento de una lista ordenable (habitaciones, paquetes, preguntas) en el editor visual. */
const itemAttr = (edit: EditDoc | undefined, s: Section, field: string, key?: string) =>
  edit && key ? sanityAttr(edit, `${sectionPath(s._key)}.${field}[_key=="${key}"]`) : {};

function Rooms({ s, lang, edit }: { s: Of<"sectionRooms"> } & Ctx) {
  const t = ui(lang);
  return (
    <section
      className="sec"
      id={s.anchor}
      aria-labelledby={hid(s)}
      style={style({ paddingTop: "calc(var(--sec) * .6)" })}
    >
      <div className="wrap">
        <div className="rooms-head">
          <h2 className="h2 rv" id={hid(s)}>
            <Accent text={tr(s.heading, lang)} />
          </h2>
          <div className="rooms-ctl">
            <button type="button" id="rPrev" aria-label={t.roomsPrev}>
              ←
            </button>
            <button type="button" id="rNext" aria-label={t.roomsNext}>
              →
            </button>
          </div>
        </div>
      </div>
      <div className="wrap rooms-wrap" style={{ overflow: "hidden" }}>
        <div className="track" id="track" tabIndex={0} role="region" aria-label={t.rooms}>
          <RoomCards
            rooms={unique(s.rooms)}
            lang={lang}
            edit={edit && { doc: edit, path: `${sectionPath(s._key)}.rooms` }}
          />
        </div>
        <div className="rp" aria-hidden="true">
          <i />
        </div>
        {tr(s.intro, lang) && <p className="small fine">{tr(s.intro, lang)}</p>}
        {edit && (
          <AddCard type={ORDERED_LISTS.sectionRooms.type} label={ORDERED_LISTS.sectionRooms.add} />
        )}
      </div>
    </section>
  );
}

const CHECK = (
  <svg className="ck" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path
      d="M4 10.5l4 4 8-9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Direct({ s, lang, settings }: { s: Of<"sectionDirect"> } & Ctx) {
  const t = ui(lang);
  return (
    <section className="direct-band" id={s.anchor} aria-labelledby={hid(s)}>
      <div className="wrap direct">
        <div className="direct-copy rv">
          {tr(s.kicker, lang) && <p className="direct-k">{tr(s.kicker, lang)}</p>}
          <h2 className="h2" id={hid(s)}>
            <Accent text={tr(s.heading, lang)} />
          </h2>
          <div className="direct-cta">
            {(s.ctas ?? []).map((c, i) => (
              <Cta
                key={c._key ?? i}
                cta={c}
                lang={lang}
                settings={settings}
                secondary="btn-ghost-light"
                waText={t.wa.book}
              />
            ))}
          </div>
        </div>
        <ul className="direct-checks rv d1">
          {(s.items ?? []).map((item) => {
            // «Sin intermediarios. Hablas con el hotel…»: la primera frase en negrita, el resto debajo
            const text = tr(item, lang);
            const cut = text.search(/[.:]\s/);
            const head = cut > 0 ? text.slice(0, cut + 1) : text;
            const rest = cut > 0 ? text.slice(cut + 2) : "";
            return (
              <li key={item._key}>
                {CHECK}
                <div>
                  <strong>{head}</strong>
                  {rest && <span>{rest}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Feature({ s, lang, settings, prev }: { s: Of<"sectionFeature"> } & Ctx) {
  const heading = <Accent text={tr(s.heading, lang)} />;
  const text = tr(s.text, lang);
  const note = tr(s.note, lang);
  const band = s.background === "band" ? " sec-band" : "";
  const ctas = (secondary: string, small?: boolean) =>
    (s.ctas ?? []).map((c, i) => (
      <Cta
        key={c._key ?? i}
        cta={c}
        lang={lang}
        settings={settings}
        secondary={secondary}
        small={small}
      />
    ));
  if (s.layout === "fullBleed")
    return (
      <section
        className={`sec rest-wrap${band}`}
        id={s.anchor}
        aria-labelledby={hid(s)}
        style={style({ paddingBottom: "calc(var(--sec) * .6)" })}
      >
        <div className="rest">
          {s.image && (
            <div
              className="slot full lbl-tr video lit pz rv"
              data-foto=""
              style={style({ "--gx": "78%", "--gy": "40%" })}
            >
              <Photo img={s.image} lang={lang} sizes="100vw" />
            </div>
          )}
          <div className="panel rv d1">
            {tr(s.kicker, lang) && <p className="stay-k">{tr(s.kicker, lang)}</p>}
            <h2 className="h2" id={hid(s)} style={{ fontSize: "clamp(32px,3.4vw,44px)" }}>
              {heading}
            </h2>
            {text && <p className="muted">{text}</p>}
            {note && <p className="small">{note}</p>}
            {ctas("btn-ghost")}
          </div>
        </div>
      </section>
    );
  if (s.groups?.length) {
    const flip = s.layout === "imageRight" ? " img-right" : "";
    return (
      <section className={`sec${band}`} id={s.anchor} aria-labelledby={hid(s)}>
        <div className={`wrap spa${flip}`}>
          {s.image && (
            <div
              className="spa-art ph slot lit pz rv"
              data-foto=""
              style={style({ "--gx": "62%", "--gy": "20%" })}
            >
              <Photo img={s.image} lang={lang} sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          )}
          <div>
            {tr(s.kicker, lang) && <p className="stay-k">{tr(s.kicker, lang)}</p>}
            <h2 className="h2 rv" id={hid(s)}>
              {heading}
            </h2>
            {text && (
              <p className="muted" style={{ marginTop: 20 }}>
                {text}
              </p>
            )}
            <div
              className="tabs rv d1"
              role="tablist"
              aria-label={plain(tr(s.heading, lang))}
              id="spaTabs"
            >
              {s.groups.map((g, i) => (
                <button
                  key={g._key}
                  type="button"
                  className="tab"
                  role="tab"
                  id={`tab-${g._key}`}
                  aria-selected={i === 0}
                  aria-controls={`panel-${g._key}`}
                  tabIndex={i === 0 ? 0 : -1}
                >
                  {tr(g.title, lang)}
                </button>
              ))}
            </div>
            {s.groups.map((g, i) => (
              <div
                key={g._key}
                className="tabpanel"
                id={`panel-${g._key}`}
                role="tabpanel"
                tabIndex={0}
                aria-labelledby={`tab-${g._key}`}
                hidden={i > 0}
              >
                {tr(g.text, lang) && <p className="muted">{tr(g.text, lang)}</p>}
                {!!g.items?.length && (
                  <ul className="spa-items">
                    {g.items.map((it) => (
                      <li key={it._key} data-treatment={tr(it.label, lang)}>
                        {tr(it.label, lang)}
                        <span>{tr(it.value, lang)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {ctas("btn-ghost")}
              </div>
            ))}
            {note && (
              <p className="small" style={{ marginTop: 20 }}>
                {note}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }
  const tight = prev && prev._type !== "sectionDirect" && prev._type !== "sectionOffers" && !band;
  const left = s.layout === "imageLeft" ? " img-left" : "";
  return (
    <section
      className={`sec${band}`}
      id={s.anchor}
      aria-labelledby={hid(s)}
      style={tight ? { paddingTop: 0 } : undefined}
    >
      <div className={`wrap pet-grid${left}`}>
        {s.image && (
          <div
            className="slot ph pet-img lit pz rv"
            data-foto=""
            style={style({ "--gx": "34%", "--gy": "40%" })}
          >
            <Photo img={s.image} lang={lang} sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
        )}
        <div className="pet-copy rv d1">
          {tr(s.kicker, lang) && <p className="stay-k">{tr(s.kicker, lang)}</p>}
          <h2 className="h2" id={hid(s)}>
            {heading}
          </h2>
          {text && <p className="muted">{text}</p>}
          {!!s.bullets?.length && (
            <ul className="pet-list">
              {s.bullets.map((b) => (
                <li key={b._key}>{tr(b, lang)}</li>
              ))}
            </ul>
          )}
          {note && <p className="small">{note}</p>}
          {ctas("btn-ghost")}
        </div>
      </div>
    </section>
  );
}

function Offers({ s, lang, settings, edit }: { s: Of<"sectionOffers"> } & Ctx) {
  const t = ui(lang);
  const offers = unique(s.offers).filter((o) => o?.image);
  if (!offers.length && !edit) return null;
  return (
    <section className="sec sec-band" id={s.anchor} aria-labelledby={hid(s)}>
      <div className="wrap">
        <div className="sec-head">
          <h2 className="h2 rv" id={hid(s)}>
            <Accent text={tr(s.heading, lang)} />
          </h2>
          {tr(s.intro, lang) && <p className="lead rv d1">{tr(s.intro, lang)}</p>}
        </div>
        <div className="pk" id="pk">
          <div className="pk-media rv" id="pkMedia">
            {offers.map((o, i) => (
              <div
                key={o._id}
                className={`slot pk-img${i === 0 ? " is-on" : ""}`}
                data-pk={o.slug ?? o._id}
                data-foto=""
                aria-hidden={i > 0 ? true : undefined}
              >
                <Photo img={o.image} lang={lang} sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
            ))}
          </div>
          <div className="pk-list" role="group" aria-label={t.choosePlan}>
            {offers.map((o, i) => (
              <article
                key={o._id}
                className={`pk-card${i === 0 ? " is-on" : ""} rv${i ? ` d${Math.min(i, 3)}` : ""}`}
                data-pk={o.slug ?? o._id}
                {...itemAttr(edit, s, "offers", o._key)}
              >
                <div className="slot pk-thumb" data-foto="" aria-hidden="true">
                  <Photo img={o.image} lang={lang} sizes="116px" decorative />
                </div>
                <h3 className="h3">
                  <button
                    type="button"
                    className="pk-pick"
                    aria-pressed={i === 0}
                    aria-controls="pkMedia"
                  >
                    {tr(o.title, lang)}
                  </button>
                </h3>
                {tr(o.summary, lang) && <p className="muted">{tr(o.summary, lang)}</p>}
                {o.cta && (
                  <Cta
                    cta={o.cta}
                    lang={lang}
                    settings={settings}
                    small
                    offerTitle={tr(o.title, lang)}
                  />
                )}
              </article>
            ))}
            {edit && (
              <AddCard
                type={ORDERED_LISTS.sectionOffers.type}
                label={ORDERED_LISTS.sectionOffers.add}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Facts({ s, lang }: { s: Of<"sectionFacts"> } & Ctx) {
  return (
    <section className="sec stay" id={s.anchor} aria-labelledby={hid(s)}>
      <div className="wrap stay-grid">
        {s.image && (
          <div className="slot stay-img rv" data-foto="">
            <Photo img={s.image} lang={lang} sizes="(min-width: 1024px) 58vw, 100vw" />
          </div>
        )}
        <div className="stay-copy rv d1">
          {tr(s.kicker, lang) && <p className="stay-k">{tr(s.kicker, lang)}</p>}
          <h2 className="h2" id={hid(s)}>
            <Accent text={tr(s.heading, lang)} />
          </h2>
          {tr(s.lead, lang) && <p className="lead">{tr(s.lead, lang)}</p>}
          {!!s.facts?.length && (
            <dl className="stay-facts">
              {s.facts.map((f) => (
                <div key={f._key}>
                  <dt>{tr(f.label, lang)}</dt>
                  <dd>{tr(f.value, lang)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}

export function faqJsonLd(faqs: Faq[], lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: faqs
      .filter((f) => tr(f.question, lang) && tr(f.answer, lang))
      .map((f) => ({
        "@type": "Question",
        name: tr(f.question, lang),
        acceptedAnswer: { "@type": "Answer", text: tr(f.answer, lang) },
      })),
  };
}

function FaqSection({ s, lang, settings, edit }: { s: Of<"sectionFaq"> } & Ctx) {
  const t = ui(lang);
  const faqs = unique(s.faqs);
  if (!faqs.length && !edit) return null;
  const half = Math.ceil(faqs.length / 2);
  const wa = waHref(settings, t.wa.question);
  const one = (f: Faq) => (
    <details key={f._id} className="q" name="faq" {...itemAttr(edit, s, "faqs", f._key)}>
      <summary>{tr(f.question, lang)}</summary>
      <p>{tr(f.answer, lang)}</p>
    </details>
  );
  return (
    <section className="sec faq-sec" id={s.anchor} aria-labelledby={hid(s)}>
      <JsonLd data={faqJsonLd(faqs, lang)} />
      <div className="wrap faq">
        <div className="faq-head rv">
          <h2 className="h2" id={hid(s)}>
            <Accent text={tr(s.heading, lang)} />
          </h2>
          {wa && (
            <p className="small faq-more">
              <span>{t.faqMore}</span>{" "}
              <a className="link-arrow" href={wa} rel="noopener" target="_blank">
                <span>{t.writeUs}</span> <span aria-hidden="true">→</span>
              </a>
            </p>
          )}
        </div>
        <div className="faq-cols rv d1" id="faqList">
          <div className="faq-col">{faqs.slice(0, half).map(one)}</div>
          <div className="faq-col">{faqs.slice(half).map(one)}</div>
        </div>
        {edit && (
          <AddCard type={ORDERED_LISTS.sectionFaq.type} label={ORDERED_LISTS.sectionFaq.add} />
        )}
      </div>
    </section>
  );
}

function MapSection({ s, lang, settings, prev }: { s: Of<"sectionMap"> } & Ctx) {
  const t = ui(lang);
  const lat = settings?.geo?.lat ?? 36.22679;
  const lng = settings?.geo?.lng ?? -6.06377;
  const { x, y } = worldPx16(lat, lng);
  const ll = `${lat},${lng}`;
  const name = settings?.name || "Hotel";
  const tight = prev && prev._type !== "sectionDirect" && prev._type !== "sectionOffers";
  return (
    <section
      className="sec"
      id={s.anchor}
      aria-labelledby={hid(s)}
      style={tight ? { paddingTop: 0 } : undefined}
    >
      <div className="wrap way">
        <div className="way-copy rv">
          <h2 className="h2" id={hid(s)}>
            <Accent text={tr(s.heading, lang)} />
          </h2>
          {tr(s.lead, lang) && <p className="lead">{tr(s.lead, lang)}</p>}
          {tr(s.note, lang) && <p className="small way-note">{tr(s.note, lang)}</p>}
        </div>
        <div className="map-wrap rv d1">
          <div
            className="map"
            id="map"
            tabIndex={0}
            role="region"
            aria-label={t.map}
            data-hx={x.toFixed(2)}
            data-hy={y.toFixed(2)}
            data-ll={ll}
            data-name={name}
          >
            <div className="map-layers">
              {Object.entries(MAP_LEVELS).map(([z, v]) => (
                // eslint-disable-next-line @next/next/no-img-element -- teselas propias posicionadas a mano, sin optimizar
                <img
                  key={z}
                  className="map-lv"
                  data-z={z}
                  src={`/map/L${z}.webp`}
                  width={v.w}
                  height={v.h}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <a
              className="map-pin"
              id="mapPin"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ll)}`}
              target="_blank"
              rel="noopener"
              aria-label={t.mapOpen}
            >
              <span className="map-pin-tag">{name.replace(/^hotel\s+/i, "")}</span>
            </a>
            <div className="map-zoom">
              <button type="button" className="map-zb" data-zoom="1" aria-label={t.zoomIn}>
                +
              </button>
              <button type="button" className="map-zb" data-zoom="-1" aria-label={t.zoomOut}>
                −
              </button>
            </div>
            <p className="map-hint" id="mapHint" aria-hidden="true" />
            <span className="map-attr">© OpenStreetMap</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing({ s, lang, settings }: { s: Of<"sectionClosing"> } & Ctx) {
  const t = ui(lang);
  return (
    <section className="sec" id={s.anchor} style={{ paddingTop: 0 }} aria-labelledby="h-close">
      <div className="wrap close">
        <h2 className="h-display rv" id="h-close" style={{ fontSize: "clamp(36px,7vw,96px)" }}>
          <span>
            <Accent text={tr(s.heading, lang)} />
          </span>{" "}
          <br />
          {tr(s.accentLine, lang) && <span className="acc">{tr(s.accentLine, lang)}</span>}
        </h2>
        {tr(s.text, lang) && <p className="lead rv d1">{tr(s.text, lang)}</p>}
        <div className="close-actions rv d2">
          {(s.ctas ?? []).map((c, i) => (
            <Cta key={c._key ?? i} cta={c} lang={lang} settings={settings} waText={t.wa.info} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RichText({ s, lang }: { s: Of<"sectionRichText"> } & Ctx) {
  const body = s.body?.[lang] ?? s.body?.es;
  return (
    <section
      className="sec"
      id={s.anchor}
      aria-labelledby={tr(s.heading, lang) ? hid(s) : undefined}
    >
      <div className="wrap">
        {tr(s.heading, lang) && (
          <h2 className="h2 rv" id={hid(s)}>
            <Accent text={tr(s.heading, lang)} />
          </h2>
        )}
        {body && (
          <div className="prose" style={{ marginTop: 32 }}>
            <PortableText value={body} />
          </div>
        )}
      </div>
    </section>
  );
}

function Gallery({ s, lang }: { s: Of<"sectionGallery"> } & Ctx) {
  return (
    <section
      className="sec"
      id={s.anchor}
      aria-labelledby={tr(s.heading, lang) ? hid(s) : undefined}
    >
      <div className="wrap">
        {tr(s.heading, lang) && (
          <h2 className="h2 rv" id={hid(s)}>
            <Accent text={tr(s.heading, lang)} />
          </h2>
        )}
        <div className="gallery">
          {(s.images ?? []).map((img) => (
            <div key={img._key} className="ph slot rv" data-foto="">
              <Photo img={img} lang={lang} sizes="(min-width: 1024px) 33vw, 50vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Blog({ s, lang }: { s: Of<"sectionBlog"> } & Ctx) {
  const t = ui(lang);
  const posts = (s.posts ?? []).slice(0, s.count ?? 3);
  if (!posts.length) return null;
  return (
    <section className="sec" id={s.anchor} aria-labelledby={hid(s)}>
      <div className="wrap">
        <div className="rooms-head">
          <h2 className="h2 rv" id={hid(s)}>
            <Accent text={tr(s.heading, lang)} />
          </h2>
          <Link className="link-arrow" href={localePath(lang, "/blog")}>
            <span>{t.latest}</span> <span aria-hidden="true">→</span>
          </Link>
        </div>
        <PostCards posts={posts} lang={lang} />
      </div>
    </section>
  );
}

/** Pinta las secciones de una página en el orden del panel (las ocultas ya no llegan). */
export function Sections({
  sections,
  lang,
  settings,
  edit,
}: {
  sections: Section[];
  lang: Locale;
  settings: Settings | null;
  /** Solo en el editor visual del panel: cada sección lleva su barra (subir, bajar, añadir, ocultar, eliminar). */
  edit?: EditDoc;
}) {
  const render = (s: Section, i: number) => {
    const ctx: Ctx = { lang, settings, prev: sections[i - 1], first: i === 0, edit };
    switch (s._type) {
      case "sectionHero":
        return (
          <HeroSection
            s={s}
            lang={lang}
            settings={settings}
            next={sections[i + 1]?.anchor ?? undefined}
          />
        );
      case "sectionRooms":
        return <Rooms s={s} {...ctx} />;
      case "sectionDirect":
        return <Direct s={s} {...ctx} />;
      case "sectionFeature":
        return <Feature s={s} {...ctx} />;
      case "sectionOffers":
        return <Offers s={s} {...ctx} />;
      case "sectionFacts":
        return <Facts s={s} {...ctx} />;
      case "sectionFaq":
        return <FaqSection s={s} {...ctx} />;
      case "sectionMap":
        return <MapSection s={s} {...ctx} />;
      case "sectionClosing":
        return <Closing s={s} {...ctx} />;
      case "sectionRichText":
        return <RichText s={s} {...ctx} />;
      case "sectionGallery":
        return <Gallery s={s} {...ctx} />;
      case "sectionBlog":
        return <Blog s={s} {...ctx} />;
      default:
        return null;
    }
  };
  return (
    <>
      {sections.map((s, i) => {
        const el = render(s, i);
        if (!edit) return el && <Fragment key={s._key}>{el}</Fragment>;
        return (
          <EditSection
            key={s._key}
            edit={edit}
            sectionKey={s._key}
            type={s._type as SectionType}
            hidden={s.hidden}
            index={i}
            count={sections.length}
          >
            {el}
          </EditSection>
        );
      })}
    </>
  );
}
