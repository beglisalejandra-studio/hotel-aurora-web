import type { Locale } from "@/lib/i18n/config";
import { localePath, tr } from "@/lib/i18n/text";
import type { Settings } from "@/lib/sanity/types";
import { site } from "@/lib/site";

/**
 * Datos estructurados del hotel, leídos de los ajustes del panel. Mientras la dirección sea ficticia (proyecto de
 * portfolio) no se declaran `geo` ni `hasMap`: no se da una ubicación falsa a los buscadores (PROJECT.md 3.10).
 */
export function hotelJsonLd(s: Settings | null, lang: Locale, image?: string) {
  const url = `${site.url.replace(/\/$/, "")}${localePath(lang, "/")}`;
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: s?.name || "Hotel",
    url,
    description: tr(s?.seo?.description, lang) || undefined,
    ...(image ? { image } : {}),
    ...(s?.phone ? { telephone: s.phone } : {}),
    ...(s?.email ? { email: s.email } : {}),
    address: tr(s?.address, lang)
      ? { "@type": "PostalAddress", streetAddress: tr(s?.address, lang), addressCountry: "ES" }
      : undefined,
    ...(s?.checkIn ? { checkinTime: s.checkIn } : {}),
    ...(s?.checkOut ? { checkoutTime: s.checkOut } : {}),
    petsAllowed: true,
    sameAs: (s?.social ?? []).map((x) => x.url).filter(Boolean),
  };
}
