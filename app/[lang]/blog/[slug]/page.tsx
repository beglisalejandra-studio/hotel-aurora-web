import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { longDate } from "@/components/sections/PostCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { Photo } from "@/components/site/Photo";
import { isLocale, locales } from "@/lib/i18n/config";
import { localePath, tr } from "@/lib/i18n/text";
import { ui } from "@/lib/i18n/ui";
import { sanityFetch } from "@/lib/sanity/client";
import { POST_QUERY, POSTS_QUERY } from "@/lib/sanity/queries";
import type { Post, PostCard } from "@/lib/sanity/types";
import { pageMeta } from "@/lib/seo/meta";
import { getSite } from "@/lib/site-data";

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await sanityFetch<PostCard[]>(POSTS_QUERY);
  return locales.flatMap((lang) => posts.map((p) => ({ lang, slug: p.slug })));
}

const getPost = (slug: string) => sanityFetch<Post | null>(POST_QUERY, { slug });

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const p = await getPost(slug);
  if (!p) return {};
  return pageMeta({
    lang,
    path: `/blog/${slug}`,
    seo: p.seo,
    title: tr(p.title, lang),
    description: tr(p.excerpt, lang),
  });
}

export default async function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const [p, { settings }] = await Promise.all([getPost(slug), getSite()]);
  if (!p) notFound();
  const t = ui(lang);
  const body = p.body?.[lang] ?? p.body?.es;
  return (
    <main id="page-post" className="page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: tr(p.title, lang),
          datePublished: p.publishedAt,
          inLanguage: lang,
          publisher: { "@type": "Organization", name: settings?.name || "Hotel" },
        }}
      />
      <div className="wrap legal">
        <nav className="crumbs" aria-label={t.breadcrumb}>
          <Link href={localePath(lang, "/")}>{t.home}</Link>
          <span aria-hidden="true">/</span>
          <Link href={localePath(lang, "/blog")}>{t.blog}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{tr(p.title, lang)}</span>
        </nav>
        <article className="legal-body">
          <h1 className="legal-h1">{tr(p.title, lang)}</h1>
          {p.publishedAt && (
            <p className="legal-meta">
              <time dateTime={p.publishedAt}>{longDate(p.publishedAt, lang)}</time>
            </p>
          )}
          {p.cover && (
            <div className="ph slot" data-foto="" style={{ aspectRatio: "3/2", marginTop: 32 }}>
              <Photo img={p.cover} lang={lang} sizes="(min-width: 1024px) 720px, 100vw" priority />
            </div>
          )}
          {body && (
            <div className="prose legal-sec">
              <PortableText value={body} />
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
