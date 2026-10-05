# Hotel Aurora

> **Proyecto de portafolio de beglisalejandra-studio.** Hotel ficticio en Cartagena de Indias. **No se procesa ninguna reserva ni transacción**: el pago está bloqueado por diseño (ver `docs/decisions/ADR-0003-pagos-bloqueados.md`).

Sitio de un hotel boutique, muy visual: portada, habitaciones, alrededores con mapa, calendario de disponibilidad, cuentas de huésped, reserva con estado por WhatsApp o correo, e instalable como app (PWA). Prioridades: **seguridad de los datos**, **velocidad** y **diseño impecable en celular, tablet y computador**.

## Estado
**Fase 0 entregada, esperando aprobación** (2026-10-05): brief, referencias, maqueta, decisiones de arquitectura y fichas de imágenes. El código de la aplicación (base Next.js de la plantilla) aún no tiene funcionalidad del hotel.

## Dónde mirar primero
| Quiero… | Abre |
|---|---|
| **Ver la maqueta** | `creative/mockup/index.html` en el navegador (rutas: `#/`, `#/habitacion/terraza`, `#/reservar`). El botón «Guía de fotos» de la franja superior muestra el código y la medida de cada hueco de imagen |
| Leer la propuesta completa y qué falta decidir | `docs/entregables/01-propuesta-diseno.md` |
| Saber qué imágenes hay que generar (prompts para ChatGPT o Gemini, con medidas) | `creative/requests/PROMPTS.md` (prompts) y `LEEME.md` (índice y avisos) |
| Entender el diseño (tokens, tipografía, movimiento, presupuestos) | `DESIGN.md` |
| Entender el producto, los claims y sus evidencias | `PRODUCT.md` |
| Ver arquitectura, integraciones y plan por fases | `PROJECT.md` y `docs/decisions/` |
| Ver los datos que se recogerían | `docs/privacy/data-map.md` |

## Comandos
```bash
npm install --ignore-scripts
npm run lint && npm run typecheck && npm run format:check
npm test
npm run build
node design/contrast-check.mjs     # contraste AA de los tokens de color
```

## Reglas del proyecto
Rama y pull request siempre; nada de claves en el repositorio (solo nombres en `.env.example`); producción, dominio y pagos reales solo con aprobación humana. Detalle en `CLAUDE.md`.
