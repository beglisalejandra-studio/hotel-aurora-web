import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "./site.css";
import { Enhance } from "@/components/site/Enhance";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Overlays } from "@/components/site/Overlays";
import { VisualEditing } from "next-sanity/visual-editing";
import { CONSENT_COOKIE, CONSENT_VERSION } from "@/lib/analytics/consent";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { tr } from "@/lib/i18n/text";
import { ui } from "@/lib/i18n/ui";
import { isEditing } from "@/lib/sanity/client";
import { getSite } from "@/lib/site-data";
import { site } from "@/lib/site";
import { fontVariables } from "./fonts";
import { ThemeStyle } from "./theme-style";

export const revalidate = 60;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const l: Locale = isLocale(lang) ? lang : "es";
  const { settings } = await getSite();
  const name = settings?.name || "Hotel";
  const description = tr(settings?.seo?.description, l);
  return {
    metadataBase: new URL(site.url),
    title: { default: tr(settings?.seo?.title, l) || name, template: `%s | ${name}` },
    description,
    applicationName: name,
    openGraph: {
      type: "website",
      siteName: name,
      locale: l === "es" ? "es_ES" : "en_GB",
      description,
    },
    twitter: { card: "summary_large_image" },
    robots:
      site.indexable && !settings?.seo?.noindex
        ? { index: true, follow: true }
        : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EDF0F1" },
    { media: "(prefers-color-scheme: dark)", color: "#11181F" },
  ],
};

/** Configuración del motor de reservas: la del panel o, en demostración, la configuración pública de la demo de Mews. */
const MEWS_DEMO_CONFIGURATION = "93e27b6f-cba7-4e0b-a24a-819e1b7b388a";
function mewsConfig(m: { configurationId?: string; environment?: string } | null | undefined) {
  const demo = m?.environment !== "production";
  const id = m?.configurationId?.trim() || (demo ? MEWS_DEMO_CONFIGURATION : "");
  return id ? { configurationId: id, demo } : null;
}

/**
 * Antes de pintar: activa las animaciones de entrada, aplica el tema Día / Madrugada que eligió el visitante y, si aún
 * no ha decidido sobre las cookies (o la decisión es de otra versión de la política), muestra el aviso.
 */
const BOOT = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("aurora-theme");if(t==="light"||t==="dark")d.setAttribute("data-theme",t)}catch(e){}var c=null;try{var m=document.cookie.match(/(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)/);c=m&&JSON.parse(decodeURIComponent(m[1]))}catch(e){}if(!c||c.v!==${CONSENT_VERSION})d.classList.add("consent-pending")})()`;

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const [data, editing] = await Promise.all([getSite(), isEditing()]);
  const t = ui(lang);
  return (
    // ed-on: vista previa del editor visual del panel (sin aviso de cookies ni contacto flotante, todo visible)
    <html
      lang={lang}
      className={editing ? `${fontVariables} ed-on cv-off` : fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <ThemeStyle theme={data.theme} />
      </head>
      <body>
        <div className="progress" aria-hidden="true" />
        <a className="skip" href="#main">
          {t.skip}
        </a>
        <Header lang={lang} data={data} />
        <div id="main" tabIndex={-1} />
        {children}
        <Footer lang={lang} data={data} />
        <Overlays lang={lang} data={data} />
        {editing && <VisualEditing />}
        <Enhance
          lang={lang}
          mews={mewsConfig(data.settings?.mews)}
          t={{
            bookingLoading: t.bookingLoading,
            bookingError: t.bookingError,
            mapHintMouse: t.mapHintMouse,
            mapHintTouch: t.mapHintTouch,
          }}
        />
      </body>
    </html>
  );
}
