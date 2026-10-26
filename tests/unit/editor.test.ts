import { describe, expect, it } from "vitest";
import { ADDABLE_SECTIONS, ORDERED_LISTS, SECTION_LABELS } from "@/lib/edit/labels";
import { isVisibleText } from "@/lib/sanity/stega";
import { LIST_OF, syncLists } from "@/sanity/actions/appendToHomeList";
import { schemaTypes } from "@/sanity/schemaTypes";
import { SECTION_TYPES } from "@/sanity/schemaTypes/sections";

describe("editor visual: marcas invisibles solo en textos visibles", () => {
  it("marca los textos por idioma y el texto de los bloques", () => {
    expect(isVisibleText(["title", "es"])).toBe(true);
    expect(isVisibleText(["sections", { _key: "a" }, "heading", "en"])).toBe(true);
    expect(isVisibleText(["body", "es", { _key: "b" }, "children", { _key: "c" }, "text"])).toBe(
      true,
    );
  });
  it("nunca marca direcciones, anclas, colores, tipografías ni teléfonos", () => {
    for (const p of [
      ["slug", "current"],
      ["sections", { _key: "a" }, "anchor", "current"],
      ["light", "accent", "hex"],
      ["fontDisplay"],
      ["phone"],
      ["mewsCategoryId"],
      ["sections", { _key: "a" }, "layout"],
    ])
      expect(isVisibleText(p), JSON.stringify(p)).toBe(false);
  });
});

describe("editor visual: secciones y listas", () => {
  const titles = new Map(schemaTypes.map((t) => [t.name, (t as { title?: string }).title]));
  it("cada tipo de sección tiene su nombre, el mismo que en el panel", () => {
    for (const t of SECTION_TYPES) expect(SECTION_LABELS[t], t).toBe(titles.get(t));
  });
  it("se puede añadir cualquier sección menos la portada (va siempre la primera)", () => {
    expect(ADDABLE_SECTIONS).not.toContain("sectionHero");
    expect(ADDABLE_SECTIONS.length).toBe(SECTION_TYPES.length - 1);
  });
  it("las listas ordenables coinciden en la web y en el panel", () => {
    for (const [section, l] of Object.entries(ORDERED_LISTS)) {
      expect(LIST_OF[l.type]).toEqual({ section, field: l.field });
    }
  });
});

describe("al abrir el panel, todo entra en su lista sin cambiar el orden de la web", () => {
  type Item = { _key: string; _ref?: string; _type?: string | null; _weak?: boolean | null };
  type Page = { _id: string; _rev: string; secs: { _key: string; items: Item[] }[] };
  const fakeClient = (
    ids: Record<string, string[]>,
    pages: Record<string, Page[]>,
    fail?: { statusCode: number },
  ) => {
    const commits: { id: string; rev: string; set: Record<string, Item[]> }[] = [];
    const client = {
      fetch: async (_q: string, p: { type: string }) => ({
        ids: ids[p.type] ?? [],
        pages: pages[p.type] ?? [],
      }),
      patch: (id: string) => {
        let rev = "";
        let changes: Record<string, Item[]> = {};
        const api = {
          ifRevisionId: (r: string) => ((rev = r), api),
          set: (c: Record<string, Item[]>) => ((changes = { ...changes, ...c }), api),
          commit: async () => {
            if (fail) throw fail;
            commits.push({ id, rev, set: changes });
          },
        };
        return api;
      },
    };
    return { client, commits };
  };
  const refs = (items: Item[]) => items.map((i) => [i._ref, i._weak ?? false]);

  it("añade al final, en su orden, solo lo que falta (referencias débiles) y solo sobre la revisión leída", async () => {
    const { client, commits } = fakeClient(
      { room: ["alba", "marea", "faro"] },
      {
        room: [
          {
            _id: "page-inicio",
            _rev: "r1",
            secs: [
              {
                _key: "s1",
                items: [{ _key: "a", _ref: "marea", _type: "reference", _weak: null }],
              },
            ],
          },
        ],
      },
    );
    await syncLists(client as never);
    expect(commits.length).toBe(1);
    expect(commits[0]?.rev).toBe("r1");
    const list = commits[0]?.set['sections[_key=="s1"].rooms'] ?? [];
    expect(refs(list)).toEqual([
      ["marea", false],
      ["alba", true],
      ["faro", true],
    ]);
    // Los campos que no existen (null) no se escriben
    expect(list[0]).toEqual({ _key: "a", _ref: "marea", _type: "reference" });
  });
  it("quita TODAS las repeticiones de una vez y deja la primera posición", async () => {
    const dup = ["alba", "marea", "terraza", "faro", "alba", "marea", "terraza", "faro"];
    const { client, commits } = fakeClient(
      { room: ["alba", "marea", "terraza", "faro"] },
      {
        room: [
          {
            _id: "page-inicio",
            _rev: "r2",
            secs: [
              { _key: "s1", items: dup.map((r, i) => ({ _key: `k${i}`, _ref: r, _weak: true })) },
            ],
          },
        ],
      },
    );
    await syncLists(client as never);
    const list = commits[0]?.set['sections[_key=="s1"].rooms'] ?? [];
    expect(list.map((i) => i._key)).toEqual(["k0", "k1", "k2", "k3"]);
  });
  it("varias secciones de la misma página se cambian en un solo paso", async () => {
    const { client, commits } = fakeClient(
      { faq: ["q1", "q2"] },
      {
        faq: [
          {
            _id: "page-x",
            _rev: "r4",
            secs: [
              { _key: "a", items: [] },
              { _key: "b", items: [{ _key: "z", _ref: "q2" }] },
            ],
          },
        ],
      },
    );
    await syncLists(client as never);
    expect(commits.length).toBe(1);
    expect(Object.keys(commits[0]?.set ?? {})).toEqual([
      'sections[_key=="a"].faqs',
      'sections[_key=="b"].faqs',
    ]);
  });
  it("si ya está todo, no toca nada", async () => {
    const { client, commits } = fakeClient(
      { faq: ["q1"] },
      {
        faq: [
          {
            _id: "page-inicio",
            _rev: "r3",
            secs: [{ _key: "s9", items: [{ _key: "a", _ref: "q1" }] }],
          },
        ],
      },
    );
    await syncLists(client as never);
    expect(commits).toEqual([]);
  });
  it("si otra apertura del panel se adelantó (409), no falla ni repite", async () => {
    const { client, commits } = fakeClient(
      { room: ["alba"] },
      { room: [{ _id: "page-inicio", _rev: "viejo", secs: [{ _key: "s1", items: [] }] }] },
      { statusCode: 409 },
    );
    await expect(syncLists(client as never)).resolves.toBeUndefined();
    expect(commits).toEqual([]);
  });
});
