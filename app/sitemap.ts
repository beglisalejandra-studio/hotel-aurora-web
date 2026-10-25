import type { MetadataRoute } from "next";
import { contentSitemapEntries } from "@/lib/sitemap-content";
import { extraSitemapEntries } from "@/lib/sitemap-sources";
import { site } from "@/lib/site";

/** Añade aquí cada ruta pública indexable. Los módulos (blog, editor visual, i18n…) aportan entradas por sus costuras. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...(await contentSitemapEntries()),
    ...(await extraSitemapEntries()),
  ];
}
