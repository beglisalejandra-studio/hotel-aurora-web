import { stegaClean } from "next-sanity";
import type { Metadata } from "next";
import { alternatesFor } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n/config";
import { tr } from "@/lib/i18n/text";
import type { Seo, Settings } from "@/lib/sanity/types";
import { site } from "@/lib/site";

/** Metadatos de una página: los de su ficha SEO del panel o, si faltan, el título y el resumen dados. */
export function pageMeta(opts: {
  lang: Locale;
  path: string;
  seo?: Seo;
  title?: string;
  description?: string;
  absoluteTitle?: boolean;
  settings?: Settings | null;
}): Metadata {
  // stegaClean: sin las marcas invisibles del editor visual en <title> y <meta>
  const title = stegaClean(tr(opts.seo?.title, opts.lang) || opts.title || "");
  const description = stegaClean(
    tr(opts.seo?.description, opts.lang) || opts.description || "",
  ).slice(0, 300);
  const alt = alternatesFor(opts.path, opts.lang, site.url);
  // El español va sin prefijo en la dirección pública
  const fix = (u: string) => u.replace(/\/es(?=\/|$)/, "");
  const languages = Object.fromEntries(Object.entries(alt.languages).map(([k, v]) => [k, fix(v)]));
  return {
    ...(title ? { title: opts.absoluteTitle ? { absolute: title } : title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: fix(alt.canonical), languages },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url: fix(alt.canonical),
    },
    ...(opts.seo?.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
