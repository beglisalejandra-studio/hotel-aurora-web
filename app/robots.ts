import type { MetadataRoute } from "next";
import { aiCrawlerRules, privatePaths } from "@/lib/seo/ai-crawlers";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preview/staging: bloquear todo. Producción: permitir, política explícita por rastreador de IA y sitemap.
  if (!site.indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: privatePaths }, ...aiCrawlerRules()],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
