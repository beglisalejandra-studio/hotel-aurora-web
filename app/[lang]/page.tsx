import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sections } from "@/components/sections/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { isLocale } from "@/lib/i18n/config";
import { isEditing, sanityFetch } from "@/lib/sanity/client";
import { HOME_QUERY } from "@/lib/sanity/queries";
import type { Page } from "@/lib/sanity/types";
import { hotelJsonLd } from "@/lib/seo/hotel";
import { pageMeta } from "@/lib/seo/meta";
import { getSite } from "@/lib/site-data";

const getHome = () => sanityFetch<Page | null>(HOME_QUERY);

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const [home, { settings }] = await Promise.all([getHome(), getSite()]);
  return pageMeta({
    lang,
    path: "/",
    seo: home?.seo?.title ? home.seo : settings?.seo,
    absoluteTitle: true,
  });
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const [home, { settings }, editing] = await Promise.all([getHome(), getSite(), isEditing()]);
  if (!home) notFound();
  return (
    <main id="page-home" className="page">
      <JsonLd data={hotelJsonLd(settings, lang)} />
      <Sections
        sections={home.sections ?? []}
        lang={lang}
        settings={settings}
        edit={editing ? { id: home._id, type: "page" } : undefined}
      />
    </main>
  );
}
