import "server-only";
import { cache } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/text";
import { sanityFetch } from "@/lib/sanity/client";
import { SITE_QUERY } from "@/lib/sanity/queries";
import type { Cta, LinkTarget, NavLink, Settings, SiteData } from "@/lib/sanity/types";

/** Datos comunes a todas las páginas (ajustes, tema, menú). Una sola consulta por render. */
export const getSite = cache(async (): Promise<SiteData> => {
  const data = await sanityFetch<SiteData | null>(SITE_QUERY);
  return data ?? { settings: null, theme: null, nav: null, hasPosts: false };
});

/** Ruta de una página enlazada desde el panel, en el idioma actual. */
export function targetPath(t: LinkTarget | undefined, lang: Locale, homeId?: string): string {
  if (!t) return localePath(lang, "/");
  if (t._type === "page") return localePath(lang, t._id === homeId || !t.slug ? "/" : `/${t.slug}`);
  if (t._type === "room") return localePath(lang, `/habitaciones/${t.slug}`);
  if (t._type === "post") return localePath(lang, `/blog/${t.slug}`);
  return localePath(lang, `/${t.slug ?? ""}`);
}

export function navHref(link: NavLink, lang: Locale, homeId?: string): string {
  const base = targetPath(link.target, lang, homeId);
  return link.anchor ? `${base}#${link.anchor.replace(/^#/, "")}` : base;
}

/** Dirección de un botón «Enlace» del panel: sección de la portada (#…), página propia (/…) o web externa. */
export function ctaHref(cta: Cta, lang: Locale): { href: string; external: boolean } {
  const raw = (cta.href ?? "").trim();
  if (/^https?:\/\//i.test(raw)) return { href: raw, external: true };
  if (raw.startsWith("#")) return { href: `${localePath(lang, "/")}${raw}`, external: false };
  if (raw.startsWith("/")) {
    const [path = "/", hash] = raw.split("#");
    return { href: `${localePath(lang, path)}${hash ? `#${hash}` : ""}`, external: false };
  }
  return { href: localePath(lang, "/"), external: false };
}

const digits = (v?: string) => (v ?? "").replace(/[^\d+]/g, "");
export const telHref = (s: Settings | null) => (s?.phone ? `tel:${digits(s.phone)}` : null);
export const waHref = (s: Settings | null, text?: string) => {
  const n = digits(s?.whatsapp).replace(/^\+/, "");
  if (!n) return null;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};
