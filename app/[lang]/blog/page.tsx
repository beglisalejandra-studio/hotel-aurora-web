import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCards } from "@/components/sections/PostCards";
import { isLocale } from "@/lib/i18n/config";
import { ui } from "@/lib/i18n/ui";
import { sanityFetch } from "@/lib/sanity/client";
import { POSTS_QUERY } from "@/lib/sanity/queries";
import type { PostCard } from "@/lib/sanity/types";
import { pageMeta } from "@/lib/seo/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta({ lang, path: "/blog", title: ui(lang).blog });
}

/** Índice del blog: aparece cuando el cliente publica la primera entrada en el panel. */
export default async function BlogIndex({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const posts = await sanityFetch<PostCard[]>(POSTS_QUERY);
  if (!posts.length) notFound();
  return (
    <main id="page-blog" className="page">
      <div className="wrap legal">
        <h1 className="legal-h1">{ui(lang).blog}</h1>
        <PostCards posts={posts} lang={lang} />
      </div>
    </main>
  );
}
