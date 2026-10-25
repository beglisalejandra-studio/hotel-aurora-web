import { describe, expect, it } from "vitest";
import { parsePublicEnv } from "@/lib/env";

describe("parsePublicEnv", () => {
  it("aplica valores por defecto seguros", () => {
    expect(parsePublicEnv({})).toEqual({
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NEXT_PUBLIC_SITE_ENV: "development",
    });
  });

  it("trata la cadena vacía como no definida", () => {
    expect(
      parsePublicEnv({ NEXT_PUBLIC_SITE_URL: "", NEXT_PUBLIC_SITE_ENV: "" }).NEXT_PUBLIC_SITE_ENV,
    ).toBe("development");
  });

  it("acepta entornos válidos", () => {
    expect(
      parsePublicEnv({
        NEXT_PUBLIC_SITE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://ejemplo.com",
      }).NEXT_PUBLIC_SITE_ENV,
    ).toBe("production");
  });

  it("rechaza valores inválidos SIN repetir el valor en el mensaje", () => {
    const bad = "esto-no-es-una-url-SECRETO123";
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SITE_URL: bad })).toThrowError(
      /NEXT_PUBLIC_SITE_URL/,
    );
    try {
      parsePublicEnv({ NEXT_PUBLIC_SITE_URL: bad });
    } catch (e) {
      expect(String(e)).not.toContain("SECRETO123");
    }
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SITE_ENV: "prod" })).toThrowError(
      /NEXT_PUBLIC_SITE_ENV/,
    );
  });
});
