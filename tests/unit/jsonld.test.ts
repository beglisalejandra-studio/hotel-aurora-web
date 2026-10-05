import { describe, expect, it } from "vitest";
import { jsonLdString } from "@/components/seo/JsonLd";

describe("jsonLdString", () => {
  it("escapa '<' para que '</script>' no pueda cerrar la etiqueta", () => {
    const s = jsonLdString({ name: "</script><script>alert(1)</script>" });
    expect(s).not.toContain("</script>");
    expect(s).toContain("\\u003c/script>");
    expect(JSON.parse(s).name).toBe("</script><script>alert(1)</script>");
  });

  it("escapa los separadores de línea Unicode (terminan una línea en JavaScript)", () => {
    const sep = String.fromCharCode(0x2028) + String.fromCharCode(0x2029);
    const out = jsonLdString({ name: `a${sep}b` });
    expect(out).not.toContain(String.fromCharCode(0x2028));
    expect(out).not.toContain(String.fromCharCode(0x2029));
    expect(JSON.parse(out).name).toBe(`a${sep}b`);
  });
});
