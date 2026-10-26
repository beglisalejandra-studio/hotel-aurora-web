import { describe, expect, it } from "vitest";
import { buildTarget, canonicalHost, canonicalRedirect } from "@/lib/hosting";

describe("perfiles de alojamiento", () => {
  it("por defecto es vercel y solo reconoce standalone", () => {
    expect(buildTarget({})).toBe("vercel");
    expect(buildTarget({ BUILD_TARGET: "standalone" })).toBe("standalone");
    expect(buildTarget({ BUILD_TARGET: "export" })).toBe("vercel"); // no hay perfil de exportación estática
    expect(buildTarget({ BUILD_TARGET: "otra-cosa" })).toBe("vercel");
  });
  it("el host canónico se normaliza y rechaza valores con forma de URL o inyección", () => {
    expect(canonicalHost({ CANONICAL_HOST: " WWW.Ejemplo.com " })).toBe("www.ejemplo.com");
    expect(canonicalHost({ CANONICAL_HOST: "https://x.com/ruta" })).toBeNull();
    expect(canonicalHost({ CANONICAL_HOST: "a.com)(.*" })).toBeNull();
    expect(canonicalHost({})).toBeNull();
  });
  it("la redirección canónica captura cualquier otro host y deja pasar al canónico y a la salud", () => {
    const r = canonicalRedirect("www.ejemplo.com", "https://www.ejemplo.com/");
    expect(r.destination).toBe("https://www.ejemplo.com/:path");
    expect(r.permanent).toBe(true);
    const hostRe = new RegExp(`^${r.has[0]!.value}$`);
    expect(hostRe.test("www.ejemplo.com")).toBe(false);
    for (const other of [
      "ejemplo.com",
      "wwwXejemplo.com",
      "preview-abc.vercel.app",
      "www.ejemplo.com.evil.io",
    ])
      expect(hostRe.test(other), other).toBe(true);
    expect(new RegExp(`^${r.source.replace(":path", "")}$`).test("/api/health")).toBe(false);
  });
});
