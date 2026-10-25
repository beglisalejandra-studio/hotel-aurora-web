---
description: Audita el entorno y el proyecto (npm run doctor) y explica cada faltante con la acción exacta.
argument-hint: [--scope global|project] [--offline]
---

Ejecuta `node "$HOME/.claude/web-os/scripts/doctor.mjs" $ARGUMENTS` (o `npm run doctor` dentro de un proyecto). Resume por estado (OK · MISSING · MISCONFIGURED · BLOCKED · OPTIONAL · OUTDATED). Para cada MISSING/MISCONFIGURED requerido: causa, impacto y comando exacto. Para cada BLOCKED: la **acción manual** exacta (login, API key, permiso) y quién la hace. No instales nada sin decirlo: explica el cambio y usa `npm run bootstrap` (idempotente). Nunca imprimas valores de secretos.
