import { z } from "zod";

/**
 * En el NAVEGADOR se desactiva el JIT de zod: su sonda `new Function("")` la bloquea la CSP (sin 'unsafe-eval')
 * y Chrome la registra como violación aunque zod la capture. En el servidor el JIT sigue activo (más rápido).
 *
 * Debe ejecutarse ANTES de crear cualquier esquema: importa este módulo PRIMERO en todo archivo que defina
 * esquemas zod y que pueda llegar al bundle del cliente (`import "@/lib/zod-config";`).
 */
if (typeof window !== "undefined") z.config({ jitless: true });
