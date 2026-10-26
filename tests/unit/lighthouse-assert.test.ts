import { describe, expect, it } from "vitest";
import { evaluate, median, parseAssertions } from "../../scripts/lib/lighthouse-assert.mjs";

const lhr = (perf: number, lcp: number) => ({
  categories: { performance: { score: perf } },
  audits: { "largest-contentful-paint": { numericValue: lcp } },
});

const budgets = parseAssertions({
  "categories:performance": ["error", { minScore: 0.9 }],
  "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
});

describe("median", () => {
  it("usa la mediana y descarta valores no numéricos", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(median([null, undefined, 5])).toBe(5);
    expect(median([])).toBeNull();
  });
});

describe("parseAssertions", () => {
  it("ignora 'off' y rechaza configuraciones ambiguas o inválidas", () => {
    expect(parseAssertions({ "categories:seo": ["off"] })).toEqual([]);
    expect(() => parseAssertions({ x: ["error", {}] })).toThrow(/exactamente uno/);
    expect(() => parseAssertions({ x: ["error", { minScore: 1, maxNumericValue: 2 }] })).toThrow();
    expect(() => parseAssertions({ "categories:seo": ["error", { maxNumericValue: 2 }] })).toThrow(
      /minScore/,
    );
    expect(() => parseAssertions({ x: ["fatal", { minScore: 1 }] })).toThrow(/nivel/);
    expect(() => parseAssertions({ x: ["error", { minScore: 2 }] })).toThrow(/entre 0 y 1/);
    expect(() => parseAssertions(null)).toThrow();
  });
});

describe("evaluate", () => {
  it("pasa cuando la mediana cumple, aunque una corrida sea mala", () => {
    const r = evaluate([lhr(0.95, 2000), lhr(0.4, 9000), lhr(0.93, 2100)], budgets);
    expect(r.errors).toHaveLength(0);
    expect(r.warnings).toHaveLength(0);
  });

  it("separa errores de avisos según el nivel", () => {
    const r = evaluate([lhr(0.5, 4000), lhr(0.6, 4200), lhr(0.55, 3900)], budgets);
    expect(r.errors.map((x) => x.id)).toEqual(["categories:performance"]);
    expect(r.warnings.map((x) => x.id)).toEqual(["largest-contentful-paint"]);
  });

  it("falla CERRADO si la métrica no existe o no se midió", () => {
    const r = evaluate([{ categories: {}, audits: {} }], budgets);
    expect(r.errors[0]?.missing).toBe(true);
    expect(r.errors[0]?.pass).toBe(false);
  });

  it("el límite es inclusivo", () => {
    const r = evaluate([lhr(0.9, 2500)], budgets);
    expect(r.rows.every((x) => x.pass)).toBe(true);
  });
});
