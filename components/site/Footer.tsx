import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localePath, tr } from "@/lib/i18n/text";
import { ui } from "@/lib/i18n/ui";
import { navHref, telHref, waHref } from "@/lib/site-data";
import type { SiteData } from "@/lib/sanity/types";
import { brandName } from "./Header";

export function Footer({ lang, data }: { lang: Locale; data: SiteData }) {
  const t = ui(lang);
  const s = data.settings;
  const tel = telHref(s);
  const wa = waHref(s);
  const columns = data.nav?.footer ?? [];
  const linksToBlog = columns.some((c) => c.links?.some((l) => l.target?._type === "post"));
  return (
    <footer className="foot" id="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="brand" href={localePath(lang, "/")} aria-label={s?.name || "Hotel"}>
              <span className="brand-name">{brandName(s?.name)}</span>
            </Link>
            {tr(s?.address, lang) && (
              <address style={{ marginTop: 20 }}>{tr(s?.address, lang)}</address>
            )}
          </div>
          <div>
            <h3>{t.contact}</h3>
            <ul>
              {tel && s?.phone && (
                <li>
                  <a href={tel}>{s.phone}</a>
                </li>
              )}
              {s?.email && (
                <li>
                  <a href={`mailto:${s.email}`}>{s.email}</a>
                </li>
              )}
              {wa && (
                <li>
                  <a href={wa} rel="noopener" target="_blank">
                    WhatsApp
                  </a>
                </li>
              )}
              {(s?.social ?? [])
                .filter((x) => x.url)
                .map((x) => (
                  <li key={x._key}>
                    <a href={x.url} rel="noopener me" target="_blank">
                      {x.network}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          {columns.map((c, i) => (
            <div key={c._key}>
              <h3>{tr(c.title, lang)}</h3>
              <ul>
                {(c.links ?? []).map((l) => (
                  <li key={l._key}>
                    <Link href={navHref(l, lang, s?.home)}>{tr(l.label, lang)}</Link>
                  </li>
                ))}
                {i === 0 && data.hasPosts && !linksToBlog && (
                  <li>
                    <Link href={localePath(lang, "/blog")}>{t.blog}</Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        {tr(s?.footerNote, lang) && (
          <div className="foot-note">
            <p className="small">{tr(s?.footerNote, lang)}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
