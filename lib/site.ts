import { publicEnv } from "@/lib/env";

/** Datos globales del sitio. Edita name/description/lang; la URL y el entorno vienen de variables. */
export const site = {
  name: "Hotel Aurora",
  description: "Describe aquí la propuesta de valor del sitio (máx. ~155 caracteres).",
  lang: "es",
  locale: "es_ES",
  url: publicEnv.NEXT_PUBLIC_SITE_URL,
  env: publicEnv.NEXT_PUBLIC_SITE_ENV,
  /** Solo producción es indexable: preview/staging llevan noindex (cabecera, metadata y robots.txt). */
  indexable: publicEnv.NEXT_PUBLIC_SITE_ENV === "production",
} as const;
