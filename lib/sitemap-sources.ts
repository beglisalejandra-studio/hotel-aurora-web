import type { MetadataRoute } from "next";

/** Seam: entradas adicionales del sitemap (el módulo `blog-mdx` añade los posts). */
export async function extraSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  return [];
}
