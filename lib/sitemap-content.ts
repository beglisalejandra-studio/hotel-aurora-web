import type { MetadataRoute } from "next";

/**
 * Seam: páginas de contenido editable que aporta el módulo `visual-editor` (distinto de `sitemap-sources.ts` para que
 * puedan convivir con `blog-mdx`, que reemplaza aquel). Por defecto, ninguna.
 */
export async function contentSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  return [];
}
