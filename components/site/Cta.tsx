import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { tr } from "@/lib/i18n/text";
import { ctaHref, waHref } from "@/lib/site-data";
import type { Cta as CtaData, Settings } from "@/lib/sanity/types";

type Props = {
  cta: CtaData;
  lang: Locale;
  settings: Settings | null;
  /** Botones pequeños (tarjetas) o normales. */
  small?: boolean;
  /** Clase del estilo «secundario» (en la franja oscura de reserva directa es el contorno claro). */
  secondary?: string;
  waText?: string;
  /** Título del paquete, para que la solicitud de bono diga cuál es. */
  offerTitle?: string;
  mewsRoom?: string;
};

/**
 * Botón del panel. Reservar abre el motor de reservas; mesa, cita y bono abren su solicitud; WhatsApp sale a wa.me;
 * Enlace va a una sección, una página del sitio o una web externa.
 */
export function Cta({
  cta,
  lang,
  settings,
  small,
  secondary = "btn-ghost",
  waText,
  offerTitle,
  mewsRoom,
}: Props) {
  const label = tr(cta.label, lang);
  if (!label) return null;
  const style = cta.style ?? (cta.action === "booking" ? "primary" : "secondary");
  const cls =
    style === "link"
      ? "link-arrow"
      : `btn ${style === "primary" ? "btn-primary" : secondary}${small ? " btn-sm" : ""}`;
  const inner =
    style === "link" ? (
      <>
        <span>{label}</span> <span aria-hidden="true">→</span>
      </>
    ) : (
      label
    );
  switch (cta.action) {
    case "booking":
      return (
        <button
          type="button"
          className={cls}
          data-open-booking
          data-mews-room={mewsRoom || undefined}
        >
          {inner}
        </button>
      );
    case "table":
    case "spa":
    case "voucher":
      return (
        <button
          type="button"
          className={cls}
          data-open-request={cta.action}
          data-offer-title={offerTitle || undefined}
        >
          {inner}
        </button>
      );
    case "whatsapp": {
      const href = waHref(settings, waText);
      return href ? (
        <a className={cls} href={href} rel="noopener" target="_blank">
          {inner}
        </a>
      ) : null;
    }
    default: {
      const { href, external } = ctaHref(cta, lang);
      return external ? (
        <a className={cls} href={href} rel="noopener" target="_blank">
          {inner}
        </a>
      ) : (
        <Link className={cls} href={href}>
          {inner}
        </Link>
      );
    }
  }
}
