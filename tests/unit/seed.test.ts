import fs from "node:fs";
import { describe, expect, it } from "vitest";
import seed from "@/sanity/seed/seed.json";
import { resolveImages } from "@/sanity/components/SeedOnFirstOpen";
import { schemaTypes } from "@/sanity/schemaTypes";

type Field = { name?: string; type: string; fields?: Field[]; of?: Field[] };
const types = new Map((schemaTypes as unknown as Field[]).map((t) => [t.name, t]));
const LEAF = new Set([
  "string",
  "text",
  "number",
  "boolean",
  "url",
  "email",
  "date",
  "datetime",
  "slug",
  "reference",
  "image",
  "color",
  "block",
]);

/** Recorre un valor del contenido inicial y anota cada campo que el esquema no conoce. */
function check(value: unknown, field: Field, path: string, problems: string[]) {
  if (value === null || value === undefined) return;
  if (LEAF.has(field.type)) return;
  if (field.type === "array") {
    if (!Array.isArray(value)) return void problems.push(`${path}: no es una lista`);
    value.forEach((item, i) => {
      if (item && typeof item === "object") {
        const o = item as Record<string, unknown>;
        if (!o._key) problems.push(`${path}[${i}]: falta _key`);
        const member = field.of?.find((m) => m.type === o._type || m.name === o._type);
        if (!member)
          return void problems.push(`${path}[${i}]: tipo ${String(o._type)} no admitido`);
        if (member.type !== "block")
          check(
            item,
            member.fields ? { ...member, type: "object" } : member,
            `${path}[${i}]`,
            problems,
          );
      }
    });
    return;
  }
  const def = field.fields ? field : types.get(field.type);
  if (!def?.fields) return void problems.push(`${path}: tipo ${field.type} desconocido`);
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (k.startsWith("_")) continue;
    const sub = def.fields.find((f) => f.name === k);
    if (!sub) problems.push(`${path}.${k}: el esquema no tiene este campo`);
    else check(v, sub, `${path}.${k}`, problems);
  }
}

/** Las fotos del contenido inicial se convierten en el tipo «Foto» al cargarse. */
const asStored = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(asStored)
    : v && typeof v === "object"
      ? "_seedImage" in v
        ? {
            _type: "imageWithAlt",
            alt: { _type: "localeString", ...(v as unknown as { alt: object }).alt },
          }
        : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, asStored(x)]))
      : v;

describe("contenido inicial del panel (sanity/seed/seed.json)", () => {
  const docs = seed.documents as unknown as Record<string, unknown>[];
  const ids = new Set(docs.map((d) => d._id as string));

  it("cada documento y cada campo existen en el esquema", () => {
    const problems: string[] = [];
    for (const d of docs) {
      const t = types.get(d._type as string);
      if (!t) problems.push(`${String(d._id)}: tipo ${String(d._type)} desconocido`);
      else check(asStored(d), t, String(d._id), problems);
    }
    expect(problems).toEqual([]);
  });
  it("las referencias apuntan a documentos del propio contenido", () => {
    const refs = JSON.stringify(docs).match(/"_ref":"([^"]+)"/g) ?? [];
    for (const r of refs) expect(ids.has(r.slice(8, -1)), r).toBe(true);
  });
  it("todas las fotos existen en public/seed y llevan texto alternativo en los dos idiomas", () => {
    for (const [name, img] of Object.entries(seed.images)) {
      for (const p of [img.desktop, img.mobile].filter(Boolean))
        expect(fs.existsSync(`public${p}`), `${name}: ${p}`).toBe(true);
      expect(img.alt.es && img.alt.en, name).toBeTruthy();
    }
  });
  it("trae lo esencial de la maqueta aprobada", () => {
    const count = (t: string) => docs.filter((d) => d._type === t).length;
    expect([
      count("room"),
      count("faq"),
      count("offer"),
      count("legalPage"),
      count("page"),
    ]).toEqual([4, 9, 3, 4, 1]);
    for (const id of ["settings", "theme", "navigation", "page-inicio"])
      expect(ids.has(id), id).toBe(true);
  });
  it("al cargar, cada foto queda como «Foto» con escritorio, móvil y descripción", () => {
    const assets = new Map(
      Object.values(seed.images).flatMap((i) =>
        [i.desktop, i.mobile].filter((p): p is string => !!p).map((p) => [p, `image-${p}`]),
      ),
    );
    const room = resolveImages(
      docs.find((d) => d._id === "room-alba"),
      assets,
    ) as { mainImage: Record<string, { asset?: { _ref: string }; es?: string }> };
    expect(room.mainImage._type).toBe("imageWithAlt");
    expect(room.mainImage.desktop?.asset?._ref).toBe("image-/seed/p04-alba-escritorio.webp");
    expect(room.mainImage.mobile?.asset?._ref).toBe("image-/seed/p04-alba-movil.webp");
    expect(room.mainImage.alt?.es).toBeTruthy();
    expect(JSON.stringify(resolveImages(docs, assets))).not.toContain("_seedImage");
  });
});
