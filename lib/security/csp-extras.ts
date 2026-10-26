import type { SecurityHeaderOptions } from "./headers";

/**
 * Orígenes adicionales permitidos por la CSP. Solo el motor de reservas (Mews), que se carga al pulsar «Reservar»
 * y nunca antes: la página no conecta con terceros mientras se navega. Lista de dominios de la guía oficial de Mews
 * (docs.mews.com → Booking Engine Widget → Getting started): *.mews.com, reCAPTCHA y los campos seguros de pago (PCI).
 * La demo usa además api.mews-demo.com.
 */
const MEWS = ["https://*.mews.com", "https://*.mews-demo.com"];
const RECAPTCHA = [
  "https://www.recaptcha.net",
  "https://www.google.com/recaptcha/",
  "https://recaptcha.google.com/recaptcha/",
  "https://www.gstatic.com/recaptcha/",
];
const PCI = ["https://pay.datatrans.com"];

export const cspExtras: Pick<
  SecurityHeaderOptions,
  | "extraScriptSrc"
  | "extraConnectSrc"
  | "extraImgSrc"
  | "extraFrameSrc"
  | "extraStyleSrc"
  | "extraFontSrc"
> = {
  extraScriptSrc: [...MEWS, ...RECAPTCHA, ...PCI],
  extraConnectSrc: [...MEWS, ...RECAPTCHA, ...PCI],
  extraImgSrc: [...MEWS, "https://www.gstatic.com/recaptcha/"],
  extraFrameSrc: [...MEWS, ...RECAPTCHA, ...PCI],
  extraStyleSrc: MEWS,
  extraFontSrc: MEWS,
};
