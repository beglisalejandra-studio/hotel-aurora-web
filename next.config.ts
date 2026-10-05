import type { NextConfig } from "next";
import { cspExtras } from "./lib/security/csp-extras";
import { cspMode } from "./lib/security/csp-mode";
import { securityHeaders } from "./lib/security/headers";
import { buildTarget, canonicalHost, canonicalRedirect } from "./lib/hosting";
import { withModules } from "./lib/next-modules";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const target = buildTarget();
const canonical = canonicalHost();
const isProductionSite = process.env.NEXT_PUBLIC_SITE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
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
    ];
  },
};

export default withModules(nextConfig);
