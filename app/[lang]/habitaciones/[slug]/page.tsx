import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { eur } from "@/components/sections/RoomCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { Photo } from "@/components/site/Photo";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { localePath, tr } from "@/lib/i18n/text";
import { ui } from "@/lib/i18n/ui";
import { sanityFetch } from "@/lib/sanity/client";
import { ROOM_QUERY, ROOMS_QUERY } from "@/lib/sanity/queries";
import type { Img, Room, RoomCard } from "@/lib/sanity/types";
import { pageMeta } from "@/lib/seo/meta";
import { getSite, waHref } from "@/lib/site-data";
import { site } from "@/lib/site";

export const dynamicParams = true;

export async function generateStaticParams() {
  const rooms = await sanityFetch<RoomCard[]>(ROOMS_QUERY);
  return locales.flatMap((lang) => rooms.map((r) => ({ lang, slug: r.slug })));
}

const getRoom = (slug: string) => sanityFetch<Room | null>(ROOM_QUERY, { slug });

const titleOf = (r: Room, lang: Locale) => ui(lang).room(tr(r.title, lang));

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/habitaciones/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const r = await getRoom(slug);
  if (!r) return {};
  const t = ui(lang);
  return pageMeta({
    lang,
    path: `/habitaciones/${slug}`,
    seo: r.seo,
    title: r.guests ? `${titleOf(r, lang)} · ${t.people(r.guests)}` : titleOf(r, lang),
    description: tr(r.summary, lang),
  });
}

export default async function RoomPage({ params }: PageProps<"/[lang]/habitaciones/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const [r, rooms, { settings }] = await Promise.all([
    getRoom(slug),
    sanityFetch<RoomCard[]>(ROOMS_QUERY),
    getSite(),
  ]);
  if (!r) notFound();
  const t = ui(lang);
  const name = tr(r.title, lang);
  const photos: Img[] = [r.mainImage, ...(r.gallery ?? []).map((g) => g.photo)].filter(Boolean);
  const [g1, g2, g3, ...more] = photos;
  const orient = tr(r.orientation, lang).replace(/\.$/, "");
  const facts: [string, string][] = [
    ...(r.area && r.area >= 60 ? [[t.size, `${r.area} m²`] as [string, string]] : []),
    ...(r.guests ? [[t.sleeps, t.guests(r.guests)] as [string, string]] : []),
    ...(tr(r.beds, lang) ? [[t.beds, tr(r.beds, lang)] as [string, string]] : []),
    ...(orient ? [[t.aspect, orient] as [string, string]] : []),
    ...(settings?.checkIn ? [[t.checkIn, settings.checkIn] as [string, string]] : []),
    ...(settings?.checkOut ? [[t.checkOut, settings.checkOut] as [string, string]] : []),
    ...(r.petFriendly !== false && settings?.maxDogs
      ? [[t.dogs, t.dogsValue(settings.maxDogs)] as [string, string]]
      : []),
  ];
  const others = rooms.filter((o) => o.slug !== slug);
  const home = localePath(lang, "/");
  const wa = waHref(settings, t.wa.room);
  const base = site.url.replace(/\/$/, "");
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.home, item: `${base}${home}` },
      { "@type": "ListItem", position: 2, name: t.rooms, item: `${base}${home}#habitaciones` },
      { "@type": "ListItem", position: 3, name },
    ],
  };
  const desc = r.description?.[lang] ?? r.description?.es;
  return (
    <main id="page-room" className="page">
      <JsonLd data={crumbs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HotelRoom",
          name: titleOf(r, lang),
          description: tr(r.summary, lang) || undefined,
          ...(r.guests ? { occupancy: { "@type": "QuantitativeValue", maxValue: r.guests } } : {}),
          ...(r.area && r.area >= 60
            ? { floorSize: { "@type": "QuantitativeValue", value: r.area, unitCode: "MTK" } }
            : {}),
          petsAllowed: r.petFriendly !== false,
        }}
      />
      <div className="wrap">
        <nav className="crumbs" aria-label={t.breadcrumb}>
          <Link href={home}>{t.home}</Link>
          <span aria-hidden="true">/</span>
          <Link href={`${home}#habitaciones`}>{t.rooms}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{name}</span>
        </nav>
        <header className="room-head">
          <h1 className="h-display">{titleOf(r, lang)}</h1>
          <dl className="facts">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </header>
        <div className="room-grid">
          <div className="room-main">
            <div className="gal">
              {g1 && (
                <div className="g1 ph slot" data-foto="">
                  <Photo img={g1} lang={lang} sizes="(min-width: 1024px) 40vw, 100vw" priority />
                </div>
              )}
              {g2 && (
                <div className="g2 slot" data-foto="">
                  <Photo
                    img={g2}
                    lang={lang}
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  />
                </div>
              )}
              {g3 && (
                <div className="g3 slot" data-foto="">
                  <Photo
                    img={g3}
                    lang={lang}
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  />
                </div>
              )}
            </div>
            {more.length > 0 && (
              <div className="gal-more" role="region" tabIndex={0} aria-label={t.morePhotos}>
                {more.map((p, i) => (
                  <div key={i} className="slot ph" data-foto="">
                    <Photo img={p} lang={lang} sizes="(min-width: 768px) 33vw, 86vw" />
                  </div>
                ))}
              </div>
            )}
            <div className="room-text">
              {tr(r.summary, lang) && (
                <p className="lead" style={{ maxWidth: "60ch" }}>
                  {tr(r.summary, lang)}
                </p>
              )}
              {desc && (
                <div className="prose">
                  <PortableText value={desc} />
                </div>
              )}
              {!!r.features?.length && (
                <div>
                  <h2 className="h3" style={{ marginBottom: 20 }}>
                    {t.includes}
                  </h2>
                  <div className="feat">
                    <div className="feat-all">
                      <ul>
                        {r.features.map((f) => (
                          <li key={f._key}>{tr(f, lang)}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <aside className="room-aside" aria-label={t.booking}>
            <div className="aside-card">
              {typeof r.priceFrom === "number" && (
                <p className="aside-price">
                  <span>{t.from}</span> <span id="rPrice">{eur(r.priceFrom, lang)}</span>{" "}
                  <span>{t.perNight}</span>
                </p>
              )}
              <p className="small">{t.priceNote}</p>
              <button
                type="button"
                className="btn btn-primary"
                data-open-booking
                data-mews-room={r.mewsCategoryId || undefined}
              >
                {t.book}
              </button>
              {wa && (
                <a className="link-arrow" href={wa} rel="noopener" target="_blank">
                  WhatsApp
                </a>
              )}
            </div>
          </aside>
        </div>
        {others.length > 0 && (
          <section className="others" aria-labelledby="h-others">
            <h2 className="h2" id="h-others">
              {t.otherRooms}
            </h2>
            <ul>
              {others.map((o) => (
                <li key={o._id}>
                  <Link href={localePath(lang, `/habitaciones/${o.slug}`)}>
                    <div className="ph slot" data-foto="">
                      <Photo img={o.mainImage} lang={lang} sizes="96px" decorative />
                    </div>
                    <span>
                      <strong className="h3" style={{ display: "block" }}>
                        {tr(o.title, lang)}
                      </strong>
                      <span className="small">{tr(o.orientation, lang)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
