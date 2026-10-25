import { describe, expect, it } from "vitest";
import { themeProblems } from "@/sanity/actions/contrastConfirm";
import { DEFAULT_PALETTES } from "@/sanity/defaults";
import { contrastRatio, paletteProblems } from "@/sanity/lib/contrast";
import { schemaTypes } from "@/sanity/schemaTypes";
import { SINGLETONS } from "@/sanity/schemaTypes/documents/singletons";
import { SECTION_TYPES } from "@/sanity/schemaTypes/sections";

type Field = { name: string; type: string; fields?: Field[]; of?: { type: string }[] };
type SchemaType = { name: string; type: string; fields?: Field[] };
const types = schemaTypes as unknown as SchemaType[];
const byName = new Map(types.map((t) => [t.name, t]));

describe("contraste del tema", () => {
  it("calcula el contraste WCAG", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBe(21);
    expect(contrastRatio("#fff", "#ffffff")).toBe(1);
    expect(contrastRatio("no-es-color", "#fff")).toBeNull();
  });
  it("los colores aprobados cumplen en Día y Madrugada", () => {
    expect(paletteProblems(DEFAULT_PALETTES.light)).toEqual([]);
    expect(paletteProblems(DEFAULT_PALETTES.dark)).toEqual([]);
  });
  it("avisa en lenguaje claro si un texto no se leería bien", () => {
    const [problem] = paletteProblems({ ...DEFAULT_PALETTES.light, ink: "#C9CED1" });
    expect(problem).toMatch(/Texto principal sobre el fondo: contraste .*necesita al menos 4,5:1/);
  });
});

describe("confirmación al publicar colores", () => {
  const asColor = (p: Record<string, string>) =>
    Object.fromEntries(Object.entries(p).map(([k, hex]) => [k, { hex }]));
  it("sin problemas no pide confirmación", () => {
    expect(
      themeProblems({
        light: asColor(DEFAULT_PALETTES.light),
        dark: asColor(DEFAULT_PALETTES.dark),
      }),
    ).toEqual([]);
  });
  it("indica el modo y el problema para pedir confirmación", () => {
    const problems = themeProblems({
      light: asColor(DEFAULT_PALETTES.light),
      dark: asColor({ ...DEFAULT_PALETTES.dark, ink: "#2A3540" }),
    });
    expect(problems[0]).toMatch(/^Modo Madrugada · Texto principal sobre el fondo/);
  });
});

describe("modelo del panel", () => {
  it("no repite nombres de tipos", () => {
    expect(byName.size).toBe(types.length);
  });
  it("registra cada sección que se puede añadir a una página", () => {
    const sections = byName
      .get("page")
      ?.fields?.find((f) => f.name === "sections")
      ?.of?.map((o) => o.type);
    expect(sections).toEqual([...SECTION_TYPES]);
    for (const s of SECTION_TYPES) expect(byName.has(s), s).toBe(true);
  });
  it("toda sección se puede ocultar y enlazar desde el menú", () => {
    for (const s of SECTION_TYPES) {
      const names = byName.get(s)?.fields?.map((f) => f.name);
      expect(names, s).toEqual(expect.arrayContaining(["anchor", "hidden"]));
    }
  });
  it("los documentos únicos existen", () => {
    for (const s of SINGLETONS) expect(byName.get(s)?.type).toBe("document");
  });
  it("ninguna foto suelta: todas pasan por «Foto» con texto alternativo", () => {
    const loose: string[] = [];
    const walk = (owner: string, fields: Field[] = []) => {
      for (const f of fields) {
        if (f.type === "image" && owner !== "imageWithAlt" && f.name !== "shareImage")
          loose.push(`${owner}.${f.name}`);
        walk(owner, f.fields);
      }
    };
    for (const t of types) walk(t.name, t.fields);
    expect(loose).toEqual([]);
  });
});
