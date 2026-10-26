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
  type Op = { id: string; rev: string; ops: unknown[] };
  type Sec = { _key: string; items: { _key: string; _ref?: string }[] };
  const fakeClient = (
    ids: Record<string, string[]>,
    pages: Record<string, { _id: string; _rev: string; secs: Sec[] }[]>,
    fail?: { statusCode: number },
  ) => {
    const commits: Op[] = [];
    const client = {
      fetch: async (_q: string, p: { type: string }) => ({
        ids: ids[p.type] ?? [],
        pages: pages[p.type] ?? [],
      }),
      patch: (id: string) => {
        const ops: unknown[] = [];
        let rev = "";
        const api = {
          ifRevisionId: (r: string) => ((rev = r), api),
          unset: (paths: string[]) => (ops.push({ unset: paths }), api),
          setIfMissing: (v: unknown) => (ops.push({ setIfMissing: v }), api),
          append: (path: string, items: { _ref: string; _weak: boolean }[]) => (
            ops.push({ append: path, refs: items.map((i) => [i._ref, i._weak]) }),
            api
          ),
          commit: async () => {
            if (fail) throw fail;
            commits.push({ id, rev, ops });
          },
        };
        return api;
      },
    };
    return { client, commits };
  };
  it("añade al final, en su orden, solo lo que falta (referencias débiles) y solo sobre la revisión leída", async () => {
    const { client, commits } = fakeClient(
      { room: ["alba", "marea", "faro"] },
      {
        room: [
          {
            _id: "page-inicio",
            _rev: "r1",
            secs: [{ _key: "s1", items: [{ _key: "a", _ref: "marea" }] }],
          },
        ],
      },
    );
    await syncLists(client as never);
    expect(commits).toEqual([
      {
        id: "page-inicio",
        rev: "r1",
        ops: [
          { setIfMissing: { 'sections[_key=="s1"].rooms': [] } },
          {
            append: 'sections[_key=="s1"].rooms',
            refs: [
              ["alba", true],
              ["faro", true],
            ],
          },
        ],
      },
    ]);
  });
  it("quita las repeticiones y deja la primera posición", async () => {
    const { client, commits } = fakeClient(
      { offer: ["o1", "o2"] },
      {
        offer: [
          {
            _id: "page-inicio",
            _rev: "r2",
            secs: [
              {
                _key: "s2",
                items: [
                  { _key: "a", _ref: "o2" },
                  { _key: "b", _ref: "o1" },
                  { _key: "c", _ref: "o2" },
                  { _key: "d", _ref: "o1" },
                ],
              },
            ],
          },
        ],
      },
    );
    await syncLists(client as never);
    expect(commits).toEqual([
      {
        id: "page-inicio",
        rev: "r2",
        ops: [
          { unset: ['sections[_key=="s2"].offers[_key=="c"]'] },
          { unset: ['sections[_key=="s2"].offers[_key=="d"]'] },
        ],
      },
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
