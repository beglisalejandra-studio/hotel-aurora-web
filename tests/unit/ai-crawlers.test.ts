import { describe, expect, it } from "vitest";
import { aiCrawlerRules, aiCrawlers, type AiCrawler } from "@/lib/seo/ai-crawlers";

describe("rastreadores de IA (robots.txt)", () => {
  it("la configuración declara propósito y política válidos y sin duplicados", () => {
    const names = aiCrawlers.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
    for (const c of aiCrawlers) {
      expect(["training", "search", "user"]).toContain(c.purpose);
      expect(["allow", "block"]).toContain(c.policy);
    }
  });
  it("cada rastreador recibe una regla explícita según su política", () => {
    const list: AiCrawler[] = [
      { name: "A", purpose: "search", policy: "allow" },
      { name: "B", purpose: "training", policy: "block" },
    ];
    const [a, b] = aiCrawlerRules(list);
    expect(a).toMatchObject({ userAgent: "A", allow: "/" });
    expect(a).toMatchObject({ disallow: expect.arrayContaining(["/api/", "/editor"]) });
    expect(b).toEqual({ userAgent: "B", disallow: "/" });
  });
});
