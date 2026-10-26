import { afterEach, describe, expect, it, vi } from "vitest";
import { requestMessage, requestSchema, todayInSpain } from "@/lib/schemas/request";

const valid = {
  kind: "table",
  lang: "es",
  name: "Ana",
  email: "ana@example.com",
  date: "2099-05-01",
  quantity: 2,
  consent: true,
  website: "",
  t: 1,
};

describe("esquema de solicitudes", () => {
  it("acepta una mesa válida y exige consentimiento y fecha", () => {
    expect(requestSchema.safeParse(valid).success).toBe(true);
    expect(requestSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    expect(requestSchema.safeParse({ ...valid, date: undefined }).success).toBe(false);
    expect(requestSchema.safeParse({ ...valid, kind: "voucher", date: undefined }).success).toBe(
      true,
    );
    expect(requestSchema.safeParse({ ...valid, email: "no" }).success).toBe(false);
  });
  it("redacta el aviso al hotel con lo justo", () => {
    const d = requestSchema.parse({ ...valid, phone: "+34 600 000 000", note: "Terraza" });
    const { source, message } = requestMessage(d);
    expect(source).toBe("solicitud-table");
    expect(message).toContain("Fecha: 2099-05-01");
    expect(message).toContain("Comensales: 2");
    expect(message).toContain("Terraza");
  });
  it("la fecha de hoy es la de España", () => {
    expect(todayInSpain(new Date("2026-10-25T23:30:00Z"))).toBe("2026-10-26");
  });
});

describe("POST /api/request", () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });
  const call = async (body: unknown, origin = "http://localhost") => {
    const { POST } = await import("@/app/api/request/route");
    return POST(
      new Request("http://localhost/api/request", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin,
          "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}`,
        },
        body: JSON.stringify(body),
      }),
    );
  };
  it("rechaza otro origen", async () => {
    expect((await call(valid, "https://otra.example")).status).toBe(403);
  });
  it("devuelve 422 con datos inválidos", async () => {
    expect((await call({ ...valid, email: "x" })).status).toBe(422);
  });
  it("rechaza fechas pasadas", async () => {
    expect((await call({ ...valid, date: "2001-01-01" })).status).toBe(422);
  });
  it("a un bot le responde que sí sin entregar nada", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    expect((await call({ ...valid, website: "spam" })).status).toBe(202);
    expect(log).not.toHaveBeenCalled();
  });
  it("entrega la solicitud válida sin datos personales en el registro", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    expect((await call({ ...valid, t: Date.now() - 10_000 })).status).toBe(202);
    expect(log).toHaveBeenCalledTimes(1);
    expect(String(log.mock.calls[0]?.[0])).not.toContain("ana@example.com");
  });
});
