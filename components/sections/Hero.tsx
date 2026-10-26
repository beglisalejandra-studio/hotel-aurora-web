import type { CSSProperties } from "react";
import { Cta } from "@/components/site/Cta";
import { Photo } from "@/components/site/Photo";
import { Accent, Kinetic, kineticStyle } from "@/components/site/Text";
import type { Locale } from "@/lib/i18n/config";
import { tr } from "@/lib/i18n/text";
import { ui } from "@/lib/i18n/ui";
import type { HeroStep, Section, Settings } from "@/lib/sanity/types";

type Hero = Extract<Section, { _type: "sectionHero" }>;
type Slot = { cls: string; kind: "pan" | "display" | "plain"; title: string; counter?: boolean };

/**
 * Los nueve momentos del recorrido, en el orden de la maqueta: cada texto del panel ocupa el suyo. El estilo
 * (franja oscura, terracota, papel, arena, texto grande con palabra de fondo) va con el momento, no con el texto.
 */
const SLOTS: Slot[] = [
  { cls: "lam lam-R1 st pan slate big", kind: "pan", title: "t", counter: true },
  { cls: "lam lam-L1 pan slate big", kind: "pan", title: "t kin-l" },
  { cls: "lam lam-D lam-D1", kind: "display", title: "d-t" },
  { cls: "lam lam-R2 pan terra vy", kind: "pan", title: "t" },
  { cls: "lam lam-R3 pan paper vy", kind: "pan", title: "t kin-d" },
  { cls: "lam lam-D lam-D2", kind: "display", title: "d-t kin-l" },
  { cls: "lam lam-P1 st stay", kind: "plain", title: "t" },
  { cls: "lam lam-P2 pan sand vy stay", kind: "pan", title: "t" },
  { cls: "lam lam-P3 pan terra stay", kind: "pan", title: "t" },
];

function Kin({
  as: Tag = "p",
  className,
  text,
}: {
  as?: "p" | "span";
  className: string;
  text: string;
}) {
  return (
    <Tag className={className} data-kin="" style={kineticStyle(text)}>
      <Kinetic text={text} />
    </Tag>
  );
}

function Panel({
  step,
  slot,
  lang,
  settings,
}: {
  step: HeroStep;
  slot: Slot;
  lang: Locale;
  settings: Settings | null;
}) {
  const kicker = tr(step.kicker, lang);
  let title = tr(step.title, lang);
  const text = tr(step.text, lang);
  // «28 habitaciones en una casa restaurada»: el número se ve en grande y cuenta hasta su valor
  let count: { n: number; unit: string } | null = null;
  const m = slot.counter ? /^(\d{1,4})\s+(\S+)\s+(.+)$/.exec(title) : null;
  if (m) {
    count = { n: Number(m[1]), unit: m[2] ?? "" };
    title = m[3] ?? "";
  }
  const link = step.link ? (
    <Cta cta={{ ...step.link, style: "link" }} lang={lang} settings={settings} />
  ) : null;
  if (slot.kind === "display")
    return (
      <div className={slot.cls}>
        {step.ghost && (
          <i className="ghost" aria-hidden="true">
            {step.ghost}
          </i>
        )}
        <div className="dwrap">
          {title && <Kin className={slot.title} text={title} />}
          {text && <p className="b">{text}</p>}
          {link}
        </div>
      </div>
    );
  const body = (
    <>
      {kicker && <Kin className="k" text={kicker} />}
      {count && (
        <p className="cnt">
          <b className="num" style={{ "--to": count.n } as CSSProperties}>
            <span className="sr">{count.n}</span>
          </b>{" "}
          <Kin as="span" className="unit" text={count.unit} />
        </p>
      )}
      {title && <Kin className={slot.title} text={title} />}
      {text && <p className="b">{text}</p>}
      {link}
    </>
  );
  if (slot.kind === "plain") return <div className={slot.cls}>{body}</div>;
  return (
    <div className={slot.cls}>
      <i className="pbg" />
      <i className="pbar" />
      <div className="pin">{body}</div>
    </div>
  );
}

function BookingBar({ lang }: { lang: Locale }) {
  const t = ui(lang);
  return (
    <form className="bar" id="heroBar" noValidate aria-label={t.searchDates}>
      <div className="field">
        <label htmlFor="b-in">{t.arrive}</label>
        <input className="input" id="b-in" name="arrive" type="date" />
      </div>
      <div className="field">
        <label htmlFor="b-out">{t.depart}</label>
        <input className="input" id="b-out" name="depart" type="date" />
      </div>
      <div className="field field-wide">
        <label htmlFor="b-g">{t.guestsLabel}</label>
        <select className="input" id="b-g" name="guests" defaultValue="2">
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {t.guests(n)}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        {t.book}
      </button>
    </form>
  );
}

/** Portada sin recorrido (opción del panel): la foto principal con el titular encima, como en móvil. */
function StillHero({ s, lang }: { s: Hero; lang: Locale }) {
  const heading = tr(s.heading, lang);
  const lead = tr(s.lead, lang);
  return (
    <section className="hero-still" id={s.anchor || "portada"} aria-labelledby="h1">
      <div className="hs-photo">
        <div className="ph slot f-img" data-foto="">
          <Photo img={s.facade} lang={lang} breakpoint={900} sizes="100vw" priority quality={70} />
        </div>
        <div className="hs-copy">
          <h1 id="h1">
            <Accent text={heading} />
          </h1>
          {lead && <p className="lead">{lead}</p>}
        </div>
      </div>
      {s.bookingBar !== false && (
        <div className="wrap hs-bar">
          <BookingBar lang={lang} />
        </div>
      )}
    </section>
  );
}

/** Portada: la entrada a la casa con el scroll (tableta y escritorio) o la foto con el titular (móvil). */
export function HeroSection({
  s,
  lang,
  settings,
  next,
}: {
  s: Hero;
  lang: Locale;
  settings: Settings | null;
  next?: string;
}) {
  if (s.walk === false) return <StillHero s={s} lang={lang} />;
  const t = ui(lang);
  const heading = tr(s.heading, lang);
  const lead = tr(s.lead, lang);
  const steps = (s.steps ?? []).slice(0, SLOTS.length);
  const hero = { lang, breakpoint: 900, sizes: "100vw" } as const;
  return (
    <section className="walk" id={s.anchor || "walk"} aria-label={t.walk}>
      {next && (
        <a className="skipwalk" href={`#${next}`}>
          {t.skipWalk}
        </a>
      )}
      <div className="walk-track">
        <div className="walk-stage" id="stage">
          <div className="cam">
            <div className="facade walk-world">
              <div className="ph slot f-img" data-foto="">
                <Photo
                  img={s.facade}
                  {...hero}
                  // Foto principal (LCP) en móvil: densidad ~1,5x en vez de la del dispositivo; ahorra ~40 KB
                  // sin que se note y deja la carga del móvil dentro del presupuesto (ADR-0006: LCP ≤ 2,5 s)
                  mobileSizes="80vw"
                  priority
                  quality={60}
                />
              </div>
              {s.reception && s.patio && (
                <div className="doorway" aria-hidden="true">
                  <div className="sala">
                    <div className="ph slot hall-img" data-foto="">
                      <Photo img={s.reception} {...hero} decorative />
                    </div>
                    <div className="court">
                      <div className="ph slot court-img" data-foto="">
                        <Photo img={s.patio} {...hero} decorative />
                      </div>
                    </div>
                  </div>
                  <div className="leaf lf">
                    <div className="ph slot leaf-img" data-foto="">
                      <Photo img={s.facade} {...hero} decorative quality={60} mobileSizes="80vw" />
                    </div>
                  </div>
                  <div className="leaf rt">
                    <div className="ph slot leaf-img" data-foto="">
                      <Photo img={s.facade} {...hero} decorative quality={60} mobileSizes="80vw" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="dip" aria-hidden="true" />
          {s.reception && (
            <figure className="rec-static">
              <div className="ph slot r-img" data-foto="">
                <Photo img={s.reception} {...hero} />
              </div>
            </figure>
          )}
          {s.patio && (
            <div className="portal">
              <div className="ph slot p-img" data-foto="">
                <Photo img={s.patio} {...hero} />
              </div>
            </div>
          )}
          <div className="shade" aria-hidden="true" />
          <div className="cap cap0">
            <div className="cap-body">
              <h1 id="h1" data-kin="" style={kineticStyle(heading)}>
                <Kinetic text={heading} />
              </h1>
              {lead && <p className="lead">{lead}</p>}
            </div>
            {s.bookingBar !== false && <BookingBar lang={lang} />}
          </div>
          {steps.map((step, i) => {
            const slot = SLOTS[i];
            return slot ? (
              <Panel key={step._key} step={step} slot={slot} lang={lang} settings={settings} />
            ) : null;
          })}
        </div>
      </div>
    </section>
  );
}
