# ADR-0001 — Stack base de la plantilla

- **Estado:** aceptada · **Fecha:** 2026-09-30 · **Decide:** sistema web-os (revisable por proyecto)
- **Contexto:** la plantilla debe servir para sitios profesionales de alta conversión (no solo HTML/JS): SEO técnico, rendimiento, accesibilidad, formularios, pagos, CMS y analítica con consentimiento, con despliegue agnóstico (Vercel, VPS, Docker, Cloudflare…).

## Decisión

| Capa | Elección (versión exacta) | Por qué |
|---|---|---|
| Framework | **Next.js 16.3.8** (App Router, Turbopack) + **React 19.2.8** | SSG/ISR/SSR en una base, `next/image`, metadata/sitemap/robots nativos, ecosistema amplio. Next 16: el antiguo *middleware* es `proxy.ts`; `next lint` ya no existe. |
| Lenguaje | **TypeScript 6.0.3** estricto (`noUncheckedIndexedAccess`) | Última versión soportada por `typescript-eslint` (rango `<6.1`). |
| Estilos | **Tailwind 4.3.3** + tokens CSS (`app/globals.css`, `design/tokens.figma.json`) | Tokens como única fuente; sin valores mágicos. |
| Validación | **zod 4.6.5** (servidor manda; el cliente solo ayuda) | Un esquema compartido entre formulario y ruta. |
| Lint / formato | **ESLint 9.39.5** (flat) + `eslint-config-next` · **Prettier 3.9.9** | Ver «Bloqueos aguas arriba». |
| Pruebas | **Vitest 5.0.3** (unitarias) · **Playwright 1.63** + **axe-core** (e2e/a11y) | Cubren lógica, flujos, cabeceras, consola limpia y WCAG 2.2 AA. |
| Rendimiento | **Lighthouse 13.5.0** directo + `scripts/lighthouse-check.mjs` | Presupuestos en `lighthouse.budgets.json` (mediana de 3 corridas, móvil). |
| Runtime | **Node ≥ 22.19** (`.nvmrc` = 22) | Lo exigen Lighthouse 13.5 (≥22.19) y Vitest 5 (≥22.12); Node 20 ya no recibe parches. |

**Cuándo NO usar esta plantilla** (decidir en `/web-brief`, anotar aquí): sitio puramente editorial sin interactividad (Astro), tienda con catálogo grande (Shopify), cliente que edita contenido sin equipo técnico y sin CMS headless viable (WordPress). El sistema detecta esos stacks y **no** fuerza Next.js (`project_kind` en `PROJECT.md`).

## Evidencia y bloqueos aguas arriba (verificados el 2026-09-30)

1. **Vitest 4.x + npm 10.9.7 → `Cannot read properties of null (reading 'edgesOut')`** al resolver el árbol. Se evitó con Vitest 3.2.7 hasta que **Vitest 5.0.3** instaló y pasó todo. Vitest ≤ 4.1.10 tiene el aviso GHSA-82fw-gwwq-j7x9 (lectura arbitraria de archivos vía `@vitest/mocker`); con 5.0.3 desaparece. Vitest 5 pide `@types/node` ≥ 22 → `@types/node` **22.20.4**.
2. **`@lhci/cli` descartado.** Su árbol (`lighthouse` antiguo → `puppeteer-core` → `extract-zip`, `tmp`, `uuid`, `inquirer`) dejaba **7 avisos *high*** sin arreglo y hacía fallar `npm audit --audit-level=high`. Sustituido por `lighthouse` 13.5.0 (limpio) y un runner propio (~200 líneas + ~100 del evaluador puro, sin dependencias), con el evaluador cubierto por tests (`tests/unit/lighthouse-assert.test.ts`) y probado en éxito (exit 0), incumplimiento (exit 1) y corte a mitad (exit 130, sin procesos huérfanos).
3. **ESLint 10 no funciona todavía.** Con ESLint 10.11.0, `eslint-config-next` 16.3.8 falla: `eslint-plugin-react` llama a `context.getFilename` (eliminado en v10). Se queda **ESLint 9.39.5**; npm avisa de que 9.x «ya no tiene soporte»: es un riesgo aceptado y **vigilado** (Dependabot ignora el salto mayor y este ADR se revisa cuando `eslint-config-next` soporte ESLint 10).
4. **TypeScript 7.0.2:** `tsc` y `next build` funcionan, pero `typescript-eslint` aborta («does not support TS 7.0»). **TypeScript 6.0.3** pasa typecheck, lint, tests y build sin overrides de peer. Reevaluar con `typescript-eslint` ≥ soporte de TS 7.1.
5. **zod 4 y CSP:** zod prueba `new Function("")` para su JIT; una CSP sin `'unsafe-eval'` la bloquea y Chrome la registra como violación aunque zod la capture. Solución: `lib/zod-config.ts` desactiva el JIT **solo en el navegador** (`z.config({ jitless: true })`); se importa primero en cada módulo de esquemas que llega al cliente.
6. **CSP por defecto = estática** (sin nonce, compatible con páginas estáticas/CDN); la CSP con nonce es el módulo opt-in `strict-csp` porque fuerza renderizado dinámico y es incompatible con PPR. Con el módulo aplicado: nonce distinto por petición, `strict-dynamic`, sin `unsafe-inline` en scripts, y e2e en verde.
7. **Lighthouse y `noindex`:** fuera de producción el sitio lleva `noindex` a propósito (el SEO puntúa ~0.63). El job de CI mide con `NEXT_PUBLIC_SITE_ENV=production` en un build efímero que solo se sirve en `127.0.0.1` y nunca se despliega.

## Resultado de la verificación de la plantilla (proyecto de prueba aislado, con los 8 módulos)

`format:check` ✓ · `typecheck` ✓ · `lint --max-warnings 0` ✓ · unitarias 89/89 (92/92 con `strict-csp`) · `build` sin avisos · e2e 20/20 (desktop + móvil, axe 0 serias/críticas, consola limpia y sin violaciones de CSP) · Lighthouse móvil: performance 0.99, accesibilidad 1.00, best-practices 1.00, SEO 1.00, LCP ≈ 1.6 s, CLS 0, TBT ≈ 130 ms · `npm audit`: **0 vulnerabilidades** (dev y prod).

Esos números corresponden a la página de arranque **neutra**; cada proyecto debe volver a medirlos con su contenido real.

## Consecuencias

- Las versiones están **fijadas exactas**; las actualizaciones llegan por Dependabot (agrupadas minor/patch) y cada mayor se revisa con QA completo.
- Cualquier cambio de esta tabla se anota aquí con su evidencia (comando + resultado), no solo en el commit.
