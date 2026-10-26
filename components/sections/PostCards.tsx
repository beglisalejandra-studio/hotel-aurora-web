import Link from "next/link";
import { Photo } from "@/components/site/Photo";
import type { Locale } from "@/lib/i18n/config";
import { localePath, tr } from "@/lib/i18n/text";
import type { PostCard } from "@/lib/sanity/types";

export const longDate = (iso: string | undefined, lang: Locale) =>
  iso
    ? new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-GB", {
        dateStyle: "long",
        timeZone: "Europe/Madrid",
      }).format(new Date(iso))
    : "";

export function PostCards({ posts, lang }: { posts: PostCard[]; lang: Locale }) {
  return (
    <ul className="posts">
      {posts.map((p) => (
        <li key={p._id} className="post-card rv">
          <Link href={localePath(lang, `/blog/${p.slug}`)}>
            {p.cover && (
              <div className="ph slot" data-foto="">
                <Photo
                  img={p.cover}
                  lang={lang}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  decorative
                />
              </div>
            )}
            {p.publishedAt && <time dateTime={p.publishedAt}>{longDate(p.publishedAt, lang)}</time>}
            <h3 className="h3">{tr(p.title, lang)}</h3>
            {tr(p.excerpt, lang) && <p className="muted">{tr(p.excerpt, lang)}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
