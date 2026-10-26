import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localePath, tr } from "@/lib/i18n/text";
import { ui } from "@/lib/i18n/ui";
import { navHref, telHref } from "@/lib/site-data";
import type { SiteData } from "@/lib/sanity/types";

export const brandName = (name?: string) =>
  (name || "Hotel").replace(/^hotel\s+/i, "") || name || "Hotel";

function Tools({ lang, tel, phone }: { lang: Locale; tel: string | null; phone?: string }) {
  const t = ui(lang);
  return (
    <>
      <div className="seg" role="group" aria-label={t.language}>
        <button
          type="button"
          data-lang="es"
          aria-current={lang === "es" ? "true" : undefined}
          lang="es"
        >
          ES
        </button>
        <button
          type="button"
          data-lang="en"
          aria-current={lang === "en" ? "true" : undefined}
          lang="en"
        >
          EN
        </button>
      </div>
      <button type="button" className="theme-btn" data-theme-toggle aria-pressed="false">
        <span className="tl-d">{t.themeDay}</span>
        <span className="tl-n">{t.themeNight}</span>
      </button>
      {tel && phone && (
        <a className="tel" href={tel}>
          {phone}
        </a>
      )}
    </>
  );
}

export function Header({ lang, data }: { lang: Locale; data: SiteData }) {
  const t = ui(lang);
  const s = data.settings;
  const tel = telHref(s);
  return (
    <header className="hdr" id="hdr">
      <div className="wrap hdr-in">
        <Link className="brand" href={localePath(lang, "/")} aria-label={s?.name || "Hotel"}>
          <span className="brand-name">{brandName(s?.name)}</span>
        </Link>
        <nav className="nav" id="nav" aria-label={t.main}>
          {(data.nav?.header ?? []).map((l) => (
            <Link key={l._key} href={navHref(l, lang, s?.home)}>
              {tr(l.label, lang)}
            </Link>
          ))}
          <div className="nav-tools">
            <Tools lang={lang} tel={tel} phone={s?.phone} />
          </div>
        </nav>
        <div className="hdr-tools">
          <div className="hdr-desk">
            <Tools lang={lang} tel={tel} phone={s?.phone} />
          </div>
          <button type="button" className="btn btn-primary btn-sm" data-open-booking>
            {t.book}
          </button>
          <button
            type="button"
            className="menu-btn"
            id="menuBtn"
            aria-expanded="false"
            aria-controls="nav"
          >
            {t.menu}
          </button>
        </div>
      </div>
    </header>
  );
}
