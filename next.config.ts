import type { NextConfig } from "next";
import { cspExtras } from "./lib/security/csp-extras";
import { cspMode } from "./lib/security/csp-mode";
import { securityHeaders } from "./lib/security/headers";
import { buildAdminCsp } from "./lib/security/admin-csp";
import { buildTarget, canonicalHost, canonicalRedirect } from "./lib/hosting";
import { withModules } from "./lib/next-modules";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
const sanityProject = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "7keq933j";
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const target = buildTarget();
const canonical = canonicalHost();
const isProductionSite = process.env.NEXT_PUBLIC_SITE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Fotos del panel: el optimizador de la propia web las pide a Sanity (solo a este proyecto y conjunto de
    // datos) y las sirve en AVIF/WebP. El visitante no se conecta con Sanity.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${sanityProject}/${sanityDataset}/**`,
      },
    ],
    qualities: [60, 75],
    // Menos anchos que los de serie: cubren móvil, tableta y escritorio y aligeran el HTML de la portada.
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    // Las fotos del panel no cambian de dirección (el nombre es su huella): se pueden guardar mucho tiempo.
    minimumCacheTTL: 2678400,
  },
  ...(target === "standalone" ? { output: "standalone" as const } : {}),
  // Un solo host canónico (SEO): el resto se redirige con 308. No aplica a las comprobaciones de salud.
  async redirects() {
    if (!canonical) return [];
    return [canonicalRedirect(canonical, siteUrl)];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders({
            csp: cspMode,
            https: siteUrl.startsWith("https://"),
            isDev: process.env.NODE_ENV === "development",
            ...cspExtras,
          }),
          // Preview/staging nunca se indexan (además de robots.txt y la metadata).
          ...(isProductionSite ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
      {
        // Panel de administración: CSP propia (va después y sustituye a la general), nunca indexable ni enmarcable fuera.
        source: "/admin/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: buildAdminCsp({
              https: siteUrl.startsWith("https://"),
              isDev: process.env.NODE_ENV === "development",
            }),
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default withModules(nextConfig);
