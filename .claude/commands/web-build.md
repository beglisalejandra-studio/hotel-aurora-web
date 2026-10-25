---
description: Implementa una tarea en rama propia con PR pequeño (TypeScript estricto, tokens, tests).
argument-hint: <tarea>
---

Activa `web-workflow` (fase 5). Tarea: `$ARGUMENTS`. Crea rama `feat/<área>-<resumen>` (nunca trabajes en `main`). Implementa contra `DESIGN.md` y tokens, con componentes pequeños, HTML semántico y validación server-side. Añade/actualiza tests. Ejecuta `npm run lint && npm run typecheck && npm run test && npm run build`. Commit convencional y PR con: qué/por qué/cómo probar + resultado de QA. No mezcles prototipos externos sin `/web-replit-intake`.
