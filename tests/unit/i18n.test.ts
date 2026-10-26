import { describe, expect, it } from "vitest";
import { alternatesFor } from "@/lib/i18n/alternates";
import { defaultLocale, isLocale, locales, negotiateLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

describe("negotiateLocale", () => {
  it("elige el mejor idioma soportado por calidad", () => {
    expect(negotiateLocale("en-US,en;q=0.9,es;q=0.8")).toBe("en");
    expect(negotiateLocale("fr-FR,fr;q=0.9,es;q=0.5")).toBe("es");
  });
  it("cae al idioma por defecto si nada coincide o no hay cabecera", () => {
    expect(negotiateLocale("de,ja;q=0.8")).toBe(defaultLocale);
    expect(negotiateLocale(null)).toBe(defaultLocale);
    expect(negotiateLocale("en;q=0")).toBe(defaultLocale);
  });
  it("isLocale valida", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("xx")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe("alternatesFor", () => {
  it("genera canonical + hreflang de TODOS los idiomas + x-default", () => {
    const a = alternatesFor("/precios/", "es", "https://ejemplo.com/");
    expect(a.canonical).toBe("https://ejemplo.com/es/precios");
    for (const l of locales) expect(a.languages[l]).toBe(`https://ejemplo.com/${l}/precios`);
    expect(a.languages["x-default"]).toBe(`https://ejemplo.com/${defaultLocale}/precios`);
  });
  it("la raíz no deja barras dobles", () => {
    expect(alternatesFor("/", "en", "https://ejemplo.com").canonical).toBe(
      "https://ejemplo.com/en",
    );
  });
});

describe("diccionarios", () => {
  it("todos los idiomas cumplen la misma forma", async () => {
    const keys = async (l: (typeof locales)[number]) =>
      JSON.stringify(Object.entries(await getDictionary(l)).map(([k, v]) => [k, Object.keys(v)]));
    const base = await keys(defaultLocale);
    for (const l of locales) expect(await keys(l)).toBe(base);
  });
});
