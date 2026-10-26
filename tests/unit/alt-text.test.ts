import { afterEach, describe, expect, it, vi } from "vitest";
import { AltTextRequestSchema, sanityImageUrl } from "@/lib/ai/alt-text-input";

const REF = "image-a1b2c3d4e5f60718293a4b5c6d7e8f9012345678-1536x1024-png";

describe("dirección de la foto para la sugerencia", () => {
  it("construye la URL de la CDN del propio proyecto, reducida y en JPG", () => {
    expect(sanityImageUrl(REF, "7keq933j", "production")).toBe(
      "https://cdn.sanity.io/images/7keq933j/production/a1b2c3d4e5f60718293a4b5c6d7e8f9012345678-1536x1024.png?w=1200&fit=max&fm=jpg&q=80",
    );
  });
  it("no acepta direcciones ni referencias manipuladas", () => {
    for (const assetRef of [
      "https://evil.example/x.png",
      "image-../../x-1x1-png",
      `${REF}?x=1`,
      "file-abc-pdf",
    ]) {
      expect(AltTextRequestSchema.safeParse({ assetRef }).success, assetRef).toBe(false);
      expect(sanityImageUrl(assetRef, "p", "d")).toBeNull();
    }
  });
});

describe("POST /api/alt-text", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.resetModules();
  });
  const call = async (headers: Record<string, string>, body: unknown = { assetRef: REF }) => {
    const { POST } = await import("@/app/api/alt-text/route");
    return POST(
      new Request("https://hotel.example/api/alt-text", {
        method: "POST",
        headers: { "content-type": "application/json", ...headers },
        body: JSON.stringify(body),
      }),
    );
  };

  it("rechaza peticiones de otro origen", async () => {
    expect((await call({ origin: "https://evil.example", authorization: "Bearer t" })).status).toBe(
      403,
    );
  });
  it("exige un editor del proyecto de Sanity", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 401 })),
    );
    expect(
      (await call({ origin: "https://hotel.example", authorization: "Bearer malo" })).status,
    ).toBe(401);
    expect((await call({ origin: "https://hotel.example" })).status).toBe(401);
  });
  it("sin clave de IA lo dice claramente y no llama al modelo", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ id: "editor-1" })),
    );
    const res = await call({ origin: "https://hotel.example", authorization: "Bearer bueno" });
    expect(res.status).toBe(503);
    expect(((await res.json()) as { message: string }).message).toMatch(/clave de IA/);
  });
  it("rechaza una foto no válida aunque el editor sea válido", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ id: "editor-2" })),
    );
    const res = await call(
      { origin: "https://hotel.example", authorization: "Bearer bueno" },
      { assetRef: "https://x" },
    );
    expect(res.status).toBe(400);
  });
});
