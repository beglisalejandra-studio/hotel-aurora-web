import type { NextConfig } from "next";

/**
 * Seam: envoltorios de la configuración de Next que aportan módulos (p. ej. `blog-mdx` aplica @next/mdx).
 * Por defecto, identidad. Importación relativa desde next.config.ts.
 */
export function withModules(config: NextConfig): NextConfig {
  return config;
}
