import { describe, expect, it } from "vitest";
import { buildStaticCsp, securityHeaders } from "@/lib/security/headers";

const prod = { csp: "static", https: true, isDev: false } as const;

describe("CSP estática", () => {
  it("es restrictiva por defecto", () => {
    const csp = buildStaticCsp(prod);
    for (const d of [
      "default-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "frame-src 'none'",
    ]) {
      expect(csp).toContain(d);
    }
  });
  it("no permite eval en producción y sí en desarrollo", () => {
    expect(buildStaticCsp(prod)).not.toContain("unsafe-eval");
    expect(buildStaticCsp({ ...prod, isDev: true })).toContain("'unsafe-eval'");
  });
  it("upgrade-insecure-requests solo con HTTPS (no rompe http://localhost)", () => {
    expect(buildStaticCsp(prod)).toContain("upgrade-insecure-requests");
    expect(buildStaticCsp({ ...prod, https: false })).not.toContain("upgrade-insecure-requests");
  });
  it("admite orígenes extra explícitos (analítica tras consentimiento)", () => {
    expect(buildStaticCsp({ ...prod, extraScriptSrc: ["https://plausible.io"] })).toContain(
      "script-src 'self' 'unsafe-inline' https://plausible.io",
    );
  });
});

describe("securityHeaders", () => {
  it("incluye las cabeceras esenciales; HSTS solo con HTTPS", () => {
    const keys = (o: Parameters<typeof securityHeaders>[0]) => securityHeaders(o).map((h) => h.key);
    expect(keys(prod)).toEqual(
      expect.arrayContaining([
        "Content-Security-Policy",
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Referrer-Policy",
        "Permissions-Policy",
        "Strict-Transport-Security",
      ]),
    );
    expect(keys({ ...prod, https: false })).not.toContain("Strict-Transport-Security");
  });
  it("csp: none omite la CSP (la pone el proxy con nonce)", () => {
    expect(securityHeaders({ ...prod, csp: "none" }).map((h) => h.key)).not.toContain(
      "Content-Security-Policy",
    );
  });
});
