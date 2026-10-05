import { describe, expect, it } from "vitest";
import { rateLimit } from "@/lib/security/rate-limit";

describe("rateLimit", () => {
  it("permite hasta el límite y bloquea después, con Retry-After", async () => {
    const key = `t-${Math.random()}`;
    const opts = { limit: 3, windowMs: 60_000 };
    const t0 = 1_000_000;
    for (let i = 0; i < 3; i++)
      expect((await rateLimit(key, { ...opts, now: t0 + i })).ok).toBe(true);
    const blocked = await rateLimit(key, { ...opts, now: t0 + 10 });
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("libera al salir de la ventana", async () => {
    const key = `t-${Math.random()}`;
    const opts = { limit: 1, windowMs: 1_000 };
    expect((await rateLimit(key, { ...opts, now: 0 })).ok).toBe(true);
    expect((await rateLimit(key, { ...opts, now: 10 })).ok).toBe(false);
    expect((await rateLimit(key, { ...opts, now: 2_000 })).ok).toBe(true);
  });

  it("las claves son independientes", async () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    await rateLimit(a, { limit: 1, windowMs: 1_000, now: 0 });
    expect((await rateLimit(a, { limit: 1, windowMs: 1_000, now: 1 })).ok).toBe(false);
    expect((await rateLimit(b, { limit: 1, windowMs: 1_000, now: 1 })).ok).toBe(true);
  });
});
