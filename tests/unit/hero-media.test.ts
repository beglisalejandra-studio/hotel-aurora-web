import { describe, expect, it } from "vitest";
import {
  pickAspect,
  shouldLoadVideo,
  type MediaConditions,
} from "@/components/media/hero-media-logic";

const base: MediaConditions = {
  reducedMotion: false,
  saveData: false,
  inView: true,
  autoplay: true,
  hasSources: true,
};

describe("shouldLoadVideo", () => {
  it("carga cuando todo es favorable", () => expect(shouldLoadVideo(base)).toBe(true));
  it("NO carga con prefers-reduced-motion", () =>
    expect(shouldLoadVideo({ ...base, reducedMotion: true })).toBe(false));
  it("NO carga con ahorro de datos", () =>
    expect(shouldLoadVideo({ ...base, saveData: true })).toBe(false));
  it("NO carga en redes 2G / slow-2g, sí en 3G/4G", () => {
    expect(shouldLoadVideo({ ...base, effectiveType: "2g" })).toBe(false);
    expect(shouldLoadVideo({ ...base, effectiveType: "slow-2g" })).toBe(false);
    expect(shouldLoadVideo({ ...base, effectiveType: "3g" })).toBe(true);
    expect(shouldLoadVideo({ ...base, effectiveType: "4g" })).toBe(true);
  });
  it("NO carga fuera del viewport, sin fuentes o con autoplay desactivado (lazy)", () => {
    expect(shouldLoadVideo({ ...base, inView: false })).toBe(false);
    expect(shouldLoadVideo({ ...base, hasSources: false })).toBe(false);
    expect(shouldLoadVideo({ ...base, autoplay: false })).toBe(false);
  });
});

describe("pickAspect", () => {
  const all = ["16:9", "1:1", "9:16"] as const;
  it("elige por proporción del viewport", () => {
    expect(pickAspect(1920, 1080, all)).toBe("16:9");
    expect(pickAspect(800, 800, all)).toBe("1:1");
    expect(pickAspect(390, 844, all)).toBe("9:16");
  });
  it("respalda a la variante más cercana disponible", () => {
    expect(pickAspect(390, 844, ["16:9"])).toBe("16:9");
    expect(pickAspect(390, 844, ["1:1", "16:9"])).toBe("1:1");
    expect(pickAspect(1920, 1080, ["9:16"])).toBe("9:16");
  });
  it("sin variantes → null", () => expect(pickAspect(1000, 500, [])).toBeNull());
});
