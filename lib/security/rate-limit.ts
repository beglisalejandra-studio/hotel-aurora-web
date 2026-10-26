/**
 * Rate limiting de ventana deslizante con almacén intercambiable.
 *
 * ⚠ El almacén por defecto es EN MEMORIA: en serverless/multi-instancia cada instancia cuenta por separado,
 * así que solo sirve como última línea de defensa y para desarrollo. En producción con tráfico real, implementa
 * `RateLimitStore` sobre un almacén compartido (Redis/Upstash/KV) y regístralo con `setRateLimitStore`.
 */
export interface RateLimitStore {
  /** Registra un golpe y devuelve las marcas de tiempo vigentes dentro de la ventana. */
  hit(key: string, windowMs: number, now: number): Promise<number[]> | number[];
}

class MemoryStore implements RateLimitStore {
  private hits = new Map<string, number[]>();
  private lastSweep = 0;

  hit(key: string, windowMs: number, now: number): number[] {
    const fresh = (this.hits.get(key) ?? []).filter((t) => now - t < windowMs);
    fresh.push(now);
    this.hits.set(key, fresh);
    if (now - this.lastSweep > windowMs) {
      this.lastSweep = now;
      for (const [k, v] of this.hits) {
        if (v.every((t) => now - t >= windowMs)) this.hits.delete(k);
      }
    }
    return fresh;
  }
}

let store: RateLimitStore = new MemoryStore();

export function setRateLimitStore(s: RateLimitStore): void {
  store = s;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export async function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number; now?: number },
): Promise<RateLimitResult> {
  const now = opts.now ?? Date.now();
  const hits = await store.hit(key, opts.windowMs, now);
  const oldest = hits[0] ?? now;
  const ok = hits.length <= opts.limit;
  return {
    ok,
    remaining: Math.max(0, opts.limit - hits.length),
    retryAfterSeconds: ok ? 0 : Math.max(1, Math.ceil((oldest + opts.windowMs - now) / 1000)),
  };
}
