import fs from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { schemaTypes } from "@/sanity/schemaTypes";
import { SINGLETONS } from "@/sanity/schemaTypes/documents/singletons";

vi.mock("sanity", async (actual) => ({
  ...(await actual<typeof import("sanity")>()),
  useClient: () => ({ fetch: () => Promise.resolve(null) }),
}));
vi.mock("sanity/router", () => ({
  useRouter: () => ({
    resolveIntentLink: (intent: string, p: Record<string, string>) =>
      `/admin/intent/${intent}/${Object.entries(p)
        .map(([k, v]) => `${k}=${v}`)
        .join(";")}`,
    navigateUrl: () => {},
    navigateIntent: () => {},
  }),
}));

const { homeTool } = await import("@/sanity/tools/home");
const html = renderToStaticMarkup(createElement(homeTool.component, { tool: homeTool }));
const hrefs = [...html.matchAll(/class="ah-task" href="([^"]+)"/g)].map((m) => m[1] as string);
const types = new Set(schemaTypes.map((t) => t.name));

describe("portada del panel", () => {
  it("ofrece las tareas habituales con un enlace directo cada una", () => {
    expect(hrefs.length).toBe(12);
    expect(new Set(hrefs).size).toBe(12);
  });
  it("cada lista enlazada existe en el menú «Contenido» con el mismo id", () => {
    const structure = fs.readFileSync("sanity/structure.ts", "utf8");
    for (const h of hrefs.filter((h) => h.startsWith("/admin/structure/"))) {
      const id = h.split("/").pop() as string;
      expect(
        structure.includes(`documentTypeListItem("${id}")`) || structure.includes(`.id("${id}")`),
        id,
      ).toBe(true);
    }
  });
  it("cada documento que abre o crea es de un tipo que existe; los únicos se abren por su id", () => {
    for (const h of hrefs.filter((h) => h.startsWith("/admin/intent/"))) {
      const params = Object.fromEntries(
        (h.split("/").pop() as string).split(";").map((kv) => kv.split("=")),
      );
      expect(types.has(params.type), h).toBe(true);
      if ((SINGLETONS as readonly string[]).includes(params.type))
        expect(params.id).toBe(params.type);
    }
  });
  it("lleva directamente a «Editar la web»", () => {
    expect(html).toContain('class="ah-edit" href="/admin/editar"');
  });
  it("explica cómo se publica un cambio con las palabras del panel", () => {
    expect(html).toContain("«Publicar»");
    expect(html).toContain("«Descartar cambios»");
  });
});
