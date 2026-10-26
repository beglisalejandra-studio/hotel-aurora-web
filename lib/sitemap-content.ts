import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/text";
import { sanityFetch } from "@/lib/sanity/client";
import { ROUTES_QUERY } from "@/lib/sanity/queries";
import { site } from "@/lib/site";

type Item = { slug: string; _updatedAt: string; _id?: string };
type Routes = { home?: string; pages: Item[]; rooms: Item[]; legal: Item[]; posts: Item[] };

/** Páginas publicadas en el panel, en los dos idiomas y con sus alternativas (hreflang). */
export async function contentSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const r = await sanityFetch<Routes>(ROUTES_QUERY);
  const base = site.url.replace(/\/$/, "");
  const entry = (
    path: string,
    updated: string | undefined,
    priority: number,
  ): MetadataRoute.Sitemap =>
    locales.map((lang) => ({
      url: `${base}${localePath(lang, path)}`,
      lastModified: updated ? new Date(updated) : undefined,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${base}${localePath(l, path)}`])),
      },
    }));
  const home = r.pages.find((p) => p._id === r.home);
  return [
    ...entry("/", home?._updatedAt, 1),
    ...r.rooms.flatMap((x) => entry(`/habitaciones/${x.slug}`, x._updatedAt, 0.8)),
    ...r.pages
      .filter((p) => p._id !== r.home)
      .flatMap((x) => entry(`/${x.slug}`, x._updatedAt, 0.6)),
    ...(r.posts.length ? entry("/blog", r.posts[0]?._updatedAt, 0.5) : []),
    ...r.posts.flatMap((x) => entry(`/blog/${x.slug}`, x._updatedAt, 0.5)),
    ...r.legal.flatMap((x) => entry(`/${x.slug}`, x._updatedAt, 0.2)),
  ];
}
