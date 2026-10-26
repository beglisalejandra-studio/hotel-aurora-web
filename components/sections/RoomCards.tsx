import Link from "next/link";
import type { CSSProperties } from "react";
import { Photo } from "@/components/site/Photo";
import type { Locale } from "@/lib/i18n/config";
import { localePath, tr } from "@/lib/i18n/text";
import { ui } from "@/lib/i18n/ui";
import type { RoomCard } from "@/lib/sanity/types";

export const eur = (n: number, lang: Locale) =>
  new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

/** Tarjetas de habitación: todas con su botón de reservar (pedido de la persona). */
export function RoomCards({ rooms, lang }: { rooms: RoomCard[]; lang: Locale }) {
  const t = ui(lang);
  return (
    <>
      {rooms.filter(Boolean).map((r, i) => {
        const name = tr(r.title, lang);
        const href = localePath(lang, `/habitaciones/${r.slug}`);
        return (
          <article key={r._id} className={`room rv${i ? ` d${Math.min(i, 3)}` : ""}`}>
            <Link className="room-media" href={href} aria-label={`${t.seeRoom}: ${name}`}>
              <div
                className="ph slot"
                data-foto=""
                style={
                  { "--gx": `${58 + i * 9}%`, "--gy": `${20 + (i % 2) * 8}%` } as CSSProperties
                }
              >
                <Photo
                  img={r.mainImage}
                  lang={lang}
                  sizes="(min-width: 1200px) 25vw, (min-width: 768px) 50vw, 50vw"
                />
              </div>
            </Link>
            <h3 className="h3">
              <Link className="room-link" href={href}>
                {name}
              </Link>
            </h3>
            {tr(r.orientation, lang) && <p className="room-light">{tr(r.orientation, lang)}</p>}
            {r.guests && (
              <p className="small room-guests">
                {r.area && r.area >= 60 ? `${r.area} m², ` : ""}
                {t.guests(r.guests)}
              </p>
            )}
            {tr(r.beds, lang) && <p className="small room-beds">{tr(r.beds, lang)}</p>}
            {typeof r.priceFrom === "number" && (
              <p className="room-price">
                <span>{t.from}</span> {eur(r.priceFrom, lang)} <span>/ {t.night}</span>
              </p>
            )}
            <div className="room-actions">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                data-open-booking
                data-mews-room={r.mewsCategoryId || undefined}
              >
                {t.book}
              </button>
              <Link className="link-arrow" href={href}>
                {t.seeRoom}
              </Link>
            </div>
          </article>
        );
      })}
    </>
  );
}
