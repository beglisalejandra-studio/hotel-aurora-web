import localFont from "next/font/local";

/**
 * Tipografías del tema, alojadas en la propia web (licencia SIL Open Font License; subconjunto latino, variable
 * 300–600). Navegar no conecta con Google Fonts. Solo se precargan las dos de la maqueta; las demás se descargan
 * únicamente si el cliente las elige en el panel.
 */
const outfit = localFont({
  src: "../fonts/outfit.woff2",
  weight: "300 600",
  variable: "--font-outfit",
  display: "swap",
});
const workSans = localFont({
  src: "../fonts/work-sans.woff2",
  weight: "300 600",
  variable: "--font-work-sans",
  display: "swap",
});
const fraunces = localFont({
  src: "../fonts/fraunces.woff2",
  weight: "300 600",
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});
const manrope = localFont({
  src: "../fonts/manrope.woff2",
  weight: "300 600",
  variable: "--font-manrope",
  display: "swap",
  preload: false,
});
const dmSans = localFont({
  src: "../fonts/dm-sans.woff2",
  weight: "300 600",
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,
});
const cormorant = localFont({
  src: "../fonts/cormorant.woff2",
  weight: "300 600",
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

export const fontVariables = [outfit, workSans, fraunces, manrope, dmSans, cormorant]
  .map((f) => f.variable)
  .join(" ");

/** Valor del panel → familia CSS. */
export const FONT_STACKS: Record<string, string> = {
  outfit: "var(--font-outfit),system-ui,sans-serif",
  "work-sans": "var(--font-work-sans),system-ui,sans-serif",
  fraunces: "var(--font-fraunces),Georgia,serif",
  manrope: "var(--font-manrope),system-ui,sans-serif",
  "dm-sans": "var(--font-dm-sans),system-ui,sans-serif",
  cormorant: "var(--font-cormorant),Georgia,serif",
};
