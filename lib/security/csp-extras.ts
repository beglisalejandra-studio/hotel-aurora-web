import type { SecurityHeaderOptions } from "./headers";

/**
 * Seam: orígenes adicionales permitidos por la CSP. El módulo `analytics-consent` lo reemplaza para añadir solo los
 * proveedores realmente activados (según variables NEXT_PUBLIC_*). Por defecto, ninguno.
 */
export const cspExtras: Pick<
  SecurityHeaderOptions,
  "extraScriptSrc" | "extraConnectSrc" | "extraImgSrc" | "extraFrameSrc"
> = {};
