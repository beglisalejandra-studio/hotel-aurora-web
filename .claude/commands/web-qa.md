---
description: Ejecuta la batería de QA (lint, tipos, tests, e2e, axe, Lighthouse, audit, manifest) y entrega informe con evidencias.
---

Activa `web-qa`. Ejecuta en orden: `npm run doctor`, `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm run test`, `npm run build`, `npm run e2e`, `npm run lighthouse`, `npm audit --audit-level=high`, `node "$HOME/.claude/web-os/scripts/validate-manifest.mjs"`. Reporta resultados reales (puntuaciones, conteos), el checklist de `reference/checklist.md` con evidencia y los pendientes. Un rojo no se marca hecho ni se silencia.
