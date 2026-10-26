import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Sections } from "@/components/sections/Sections";
import { LegalBody } from "@/components/site/LegalBody";
import { isLocale, locales } from "@/lib/i18n/config";
import { localePath, tr } from "@/lib/i18n/text";
import { ui } from "@/lib/i18n/ui";
import { sanityFetch } from "@/lib/sanity/client";
import { LEGAL_LIST_QUERY, LEGAL_QUERY, PAGE_QUERY, ROUTES_QUERY } from "@/lib/sanity/queries";
import type { LegalPage, Page } from "@/lib/sanity/types";
import { pageMeta } from "@/lib/seo/meta";
import { getSite } from "@/lib/site-data";

/** Páginas libres creadas en el panel y textos legales, en la raíz: /privacidad, /quienes-somos… */
export const dynamicParams = true;

type Routes = { home?: string; pages: { _id: string; slug: string }[]; legal: { slug: string }[] };

export async function generateStaticParams() {
  const r = await sanityFetch<Routes>(ROUTES_QUERY);
  const slugs = [
    ...r.pages.filter((p) => p._id !== r.home).map((p) => p.slug),
    ...r.legal.map((l) => l.slug),
  ];
  return locales.flatMap((lang) => slugs.map((s) => ({ lang, slug: [s] })));
}

async function load(slug: string[]) {
  if (slug.length !== 1 || !slug[0]) return null;
  const s = slug[0];
  const page = await sanityFetch<Page | null>(PAGE_QUERY, { slug: s });
  if (page) return { kind: "page" as const, page };
  const legal = await sanityFetch<LegalPage | null>(LEGAL_QUERY, { slug: s });
  return legal ? { kind: "legal" as const, legal } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[...slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const found = await load(slug);
  if (!found) return {};
  const path = `/${slug[0]}`;
  if (found.kind === "page")
    return pageMeta({ lang, path, seo: found.page.seo, title: tr(found.page.title, lang) });
  return pageMeta({ lang, path, seo: found.legal.seo, title: tr(found.legal.title, lang) });
}

export default async function FreePage({ params }: PageProps<"/[lang]/[...slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const [found, { settings }] = await Promise.all([load(slug), getSite()]);
  if (!found) notFound();
  const t = ui(lang);
  if (found.kind === "page") {
    // La portada vive en «/»: su propia dirección (/inicio) redirige allí
    if (found.page._id === settings?.home) permanentRedirect(localePath(lang, "/"));
    const sections = found.page.sections ?? [];
    const hasH1 = sections.some((s) => s._type === "sectionHero");
    return (
      <main id="page-free" className="page">
        {!hasH1 && (
          <div className="wrap legal" style={{ paddingBottom: 0 }}>
            <h1 className="legal-h1">{tr(found.page.title, lang)}</h1>
          </div>
        )}
        <Sections sections={sections} lang={lang} settings={settings} />
      </main>
    );
  }
  const l = found.legal;
  const blocks = l.body?.[lang] ?? l.body?.es ?? [];
  const others = (
    await sanityFetch<{ _id: string; title?: LegalPage["title"]; slug: string }[]>(LEGAL_LIST_QUERY)
  ).filter((o) => o.slug !== l.slug);
  const updated = l.updatedAt
    ? new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-GB", {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(new Date(`${l.updatedAt}T00:00:00Z`))
    : "";
  return (
    <main id="page-legal" className="page">
      <div className="wrap legal">
        <nav className="crumbs" aria-label={t.breadcrumb}>
          <Link href={localePath(lang, "/")}>{t.home}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{tr(l.title, lang)}</span>
        </nav>
        <article className="legal-body">
          <h1 className="legal-h1">{tr(l.title, lang)}</h1>
          {updated && <p className="legal-meta">{t.updated(updated)}</p>}
          {tr(settings?.footerNote, lang) && (
            <p className="legal-note">{tr(settings?.footerNote, lang)}</p>
          )}
          <LegalBody blocks={blocks} lang={lang} prefix={`lg-${l.slug}`} />
          {others.length > 0 && (
            <nav className="legal-more" aria-label={t.otherLegal}>
              {others.map((o) => (
                <Link key={o._id} className="link-arrow" href={localePath(lang, `/${o.slug}`)}>
                  {tr(o.title, lang)}
                </Link>
              ))}
            </nav>
          )}
        </article>
      </div>
    </main>
  );
}
