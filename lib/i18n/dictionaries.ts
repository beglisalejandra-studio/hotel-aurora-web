import type { Locale } from "@/lib/i18n/config";

/**
 * Diccionarios tipados: el idioma por defecto define la FORMA; los demás deben cumplirla (el compilador avisa de claves
 * que faltan). Los textos viven fuera de los componentes. Sin traducción automática sin revisión humana.
 */
export interface Dictionary {
  nav: { home: string; contact: string };
  cta: { primary: string };
}

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  es: async () => ({
    nav: { home: "Inicio", contact: "Contacto" },
    cta: { primary: "Solicitar información" },
  }),
  en: async () => ({
    nav: { home: "Home", contact: "Contact" },
    cta: { primary: "Request information" },
  }),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> => loaders[locale]();
