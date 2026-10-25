import { describe, expect, it } from "vitest";
import { BodyError, clientIp, isSameOrigin, readJsonLimited } from "@/lib/security/request";

const req = (body: string, headers: Record<string, string> = {}) =>
  new Request("http://x.test/api", {
    method: "POST",
    body,
    headers: { "content-type": "application/json", ...headers },
  });

describe("isSameOrigin", () => {
  it("acepta el origen del sitio y rechaza otros o la ausencia de Origin", () => {
    const site = "https://ejemplo.com";
    expect(isSameOrigin(req("{}", { origin: "https://ejemplo.com" }), site)).toBe(true);
    expect(isSameOrigin(req("{}", { origin: "https://malo.com" }), site)).toBe(false);
    expect(isSameOrigin(req("{}"), site)).toBe(false);
    expect(isSameOrigin(req("{}", { origin: "no-es-url" }), site)).toBe(false);
  });
});

describe("readJsonLimited", () => {
  it("lee JSON válido", async () => {
    expect(await readJsonLimited(req('{"a":1}'))).toEqual({ a: 1 });
  });
  it("415 si no es application/json", async () => {
    await expect(
      readJsonLimited(req("{}", { "content-type": "text/plain" })),
    ).rejects.toMatchObject({ status: 415 });
  });
  it("413 si supera el tope", async () => {
    await expect(
      readJsonLimited(req(JSON.stringify({ a: "x".repeat(200) })), 50),
    ).rejects.toMatchObject({ status: 413 });
  });
  it("400 si el JSON es inválido", async () => {
    await expect(readJsonLimited(req("{no"))).rejects.toBeInstanceOf(BodyError);
  });
});

describe("clientIp", () => {
  it("usa el primer valor de x-forwarded-for", () => {
    expect(clientIp(req("{}", { "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
    expect(clientIp(req("{}"))).toBe("unknown");
  });
});
