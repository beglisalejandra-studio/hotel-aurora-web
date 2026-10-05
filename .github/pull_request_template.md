## Qué y por qué
<!-- Qué cambia y qué problema/objetivo de conversión resuelve. Enlaza la tarea del plan (PROJECT.md). -->

## Cómo probarlo
<!-- Pasos, URL de preview, datos ficticios a usar. -->

## Capturas (si hay UI)
<!-- Desktop y móvil. -->

## QA (con evidencia, no de memoria)
- [ ] `npm run lint` · `npm run typecheck` · `npm run format:check`
- [ ] `npm test` · `npm run build`
- [ ] `npm run e2e` (axe: 0 violaciones serias) · `npm run lighthouse` dentro de presupuesto
- [ ] `npm run doctor` sin MISSING/MISCONFIGURED requeridos
- [ ] `creative/manifest.json` válido (si toca media) — la aprobación de media es humana

## Seguridad y datos
- [ ] Sin secretos en el diff; variables nuevas añadidas a `.env.example` (sin valores)
- [ ] Integraciones nuevas con ficha completa en `PROJECT.md` y `docs/privacy/data-map.md`
- [ ] Sin PII en logs ni en eventos de analítica

## Riesgos / decisiones que requieren a una persona
<!-- Claims, precios, textos legales, credenciales, producción… -->
