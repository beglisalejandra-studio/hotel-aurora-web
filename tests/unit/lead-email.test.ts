import { describe, expect, it } from "vitest";
import { buildLeadEmail } from "@/lib/email/lead-email";

const lead = {
  name: "Ana <b>",
  email: "ana@example.com",
  message: "Hola <script>alert(1)</script>\nlínea 2",
  source: "home",
};

describe("buildLeadEmail", () => {
  it("escapa HTML en el cuerpo (no se ejecuta nada del usuario)", () => {
    const { html } = buildLeadEmail(lead);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("Ana &lt;b&gt;");
  });
  it("el asunto es de una sola línea aunque el origen traiga saltos (inyección de cabeceras)", () => {
    const { subject } = buildLeadEmail({ ...lead, source: "home\r\nBcc: victima@example.com" });
    expect(subject).not.toMatch(/[\r\n]/);
  });
  it("replyTo aplanado y texto plano conserva el mensaje", () => {
    const m = buildLeadEmail({ ...lead, email: "ana@example.com\r\nBcc: x@y.com" });
    expect(m.replyTo).not.toMatch(/[\r\n]/);
    expect(m.text).toContain("línea 2");
  });
});
