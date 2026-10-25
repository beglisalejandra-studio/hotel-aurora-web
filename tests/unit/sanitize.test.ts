import { describe, expect, it } from "vitest";
import { cleanText, escapeHtml, singleLine } from "@/lib/security/sanitize";

describe("cleanText", () => {
  it("quita caracteres de control y marcas bidireccionales", () => {
    expect(cleanText("hola\u0000 mundo\u202E!")).toBe("hola mundo!");
  });
  it("normaliza espacios, recorta y limita longitud", () => {
    expect(cleanText("   a    b   ")).toBe("a b");
    expect(cleanText("x".repeat(50), 10)).toHaveLength(10);
  });
  it("elimina ancho cero y aislamientos bidireccionales construidos por código de carácter", () => {
    const evil = `a${String.fromCharCode(0x200b)}b${String.fromCharCode(0x202e)}c${String.fromCharCode(0x2066)}d${String.fromCharCode(0x7f)}e`;
    expect(cleanText(evil)).toBe("abcde");
  });
  it("devuelve cadena vacía si no es texto", () => {
    expect(cleanText(42 as unknown)).toBe("");
    expect(cleanText(undefined)).toBe("");
  });
});

describe("escapeHtml", () => {
  it("escapa los caracteres peligrosos", () => {
    expect(escapeHtml(`<img src=x onerror="alert('1')">&`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;1&#39;)&quot;&gt;&amp;",
    );
  });
});

describe("singleLine", () => {
  it("impide inyección de cabeceras en asuntos de email", () => {
    expect(singleLine("Asunto\r\nBcc: x@y.com")).toBe("Asunto Bcc: x@y.com");
  });
});
