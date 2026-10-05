---
description: Revisa y actualiza el sistema: hechos verificables, investigación de tendencias/skills/herramientas con criterios de evidencia y seguridad, e informe con propuestas (nunca instala solo).
---

Es el «botón de actualizar sistema». Funciona en cualquier chat; las propuestas se hacen sobre el repo del sistema (`beglisalejandra-studio/Contexto-web`: si no está en la sesión, añádelo con `add_repo` y trabaja en una rama nueva desde `main`).

1. **Capa al día:** `node "$HOME/.claude/web-os/scripts/doctor.mjs" --only os-installed,vendor:taste-upstream` y, si hace falta, `npm run bootstrap`. Avisa de cualquier `OUTDATED` o `BLOCKED`.
2. **Hechos:** `node "$HOME/.claude/web-os/scripts/system-update-check.mjs" --out docs/research/AAAA-MM.facts.md` (AAAA-MM = mes actual).
3. **Investigación:** invoca la skill `web-research` y sigue su procedimiento con `config/research-topics.json` y `config/update-blockers.json`. Fuentes primarias, fechas, rúbrica y puertas: **solo se recomienda lo que las pase**; «sin recomendaciones este mes» es una respuesta válida.
4. **Informe:** `docs/research/AAAA-MM.md` con la plantilla de la skill.
5. **Verificación:** `npm run verify` en el repo del sistema.
6. **PR del informe** a `main` (rama nueva; nunca push directo a `main`) con el resumen de riesgos y lo no verificado. **No fusiones, no instales y no cambies pines** en este paso: cada recomendación aceptada se implementa después en un PR aparte, con auditoría, y la aprueba una persona.
7. Cierra con el informe de estado fijo (`Fase · Entregable · Verificación · Bloqueos · Próximo paso · Riesgos`).

Nunca actualices a ciegas, ni con `curl | bash`, ni des por buena una cifra que solo sostiene el proveedor.
