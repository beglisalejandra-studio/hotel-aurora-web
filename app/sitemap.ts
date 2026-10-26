import type { MetadataRoute } from "next";
import { contentSitemapEntries } from "@/lib/sitemap-content";
import { extraSitemapEntries } from "@/lib/sitemap-sources";

export const revalidate = 3600;

/** Rutas públicas indexables: todas salen del panel (portada, habitaciones, páginas, blog y legales). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [...(await contentSitemapEntries()), ...(await extraSitemapEntries())];
}
