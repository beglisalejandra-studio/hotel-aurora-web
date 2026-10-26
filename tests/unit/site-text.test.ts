import { describe, expect, it } from "vitest";
import { accentParts, kineticWords, localePath, plain, tr } from "@/lib/i18n/text";
import { resolveImage } from "@/lib/sanity/image";
import { worldPx16 } from "@/lib/map";

describe("textos del panel", () => {
  it("usa el español si falta la traducción", () => {
    expect(tr({ es: "Hola", en: "" }, "en")).toBe("Hola");
    expect(tr(null, "es")).toBe("");
  });
  it("marca en acento lo que va entre asteriscos", () => {
    expect(accentParts("Hotel con *spa de agua* en la costa")).toEqual([
      { text: "Hotel con ", accent: false },
      { text: "spa de agua", accent: true },
      { text: " en la costa", accent: false },
    ]);
  });
  it("parte el texto en movimiento igual que la maqueta (acento y salto de línea)", () => {
    const k = kineticWords("Hotel boutique|en *El Palmar.*");
    expect(k.count).toBe(5);
    expect(k.lines).toHaveLength(2);
    expect(k.lines[1]?.map((w) => [w.w, w.accent])).toEqual([
      ["en", false],
      ["El", true],
      ["Palmar.", true],
    ]);
    expect(plain("Hotel boutique|en *El Palmar.*")).toBe("Hotel boutique en El Palmar.");
  });
  it("el español va sin prefijo y el inglés con /en", () => {
    expect(localePath("es", "/habitaciones/alba")).toBe("/habitaciones/alba");
    expect(localePath("en", "/habitaciones/alba")).toBe("/en/habitaciones/alba");
    expect(localePath("en", "/")).toBe("/en");
  });
});

describe("fotos del panel", () => {
  const ref = "image-0123456789abcdef0123456789abcdef01234567-2000x1000-webp";
  it("salen solo de este proyecto de Sanity, con su tamaño", () => {
    expect(resolveImage({ ref })).toEqual({
      src: "https://cdn.sanity.io/images/7keq933j/production/0123456789abcdef0123456789abcdef01234567-2000x1000.webp",
      width: 2000,
      height: 1000,
      position: undefined,
    });
  });
  it("respetan el recorte y el punto de interés del panel", () => {
    const r = resolveImage({
      ref,
      crop: { left: 0.1, right: 0.1, top: 0, bottom: 0.5 },
      hotspot: { x: 0.5, y: 0.25 },
    });
    expect(r?.src).toMatch(/\?rect=200,0,1600,500$/);
    expect([r?.width, r?.height]).toEqual([1600, 500]);
    expect(r?.position).toBe("50% 50%");
  });
  it("ignora referencias que no son de imagen", () => {
    expect(resolveImage({ ref: "file-abc-pdf" })).toBeNull();
    expect(resolveImage(null)).toBeNull();
  });
});

describe("mapa propio", () => {
  it("sitúa el hotel en la misma posición que la maqueta", () => {
    const p = worldPx16(36.22679, -6.06377);
    expect(p.x).toBeCloseTo(8106015.84, 1);
    expect(p.y).toBeCloseTo(6575090.14, 1);
  });
});
