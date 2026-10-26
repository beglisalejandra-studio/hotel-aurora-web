# Runbook — Rollback

**Cuándo:** errores 5xx sostenidos, formulario/pago roto, regresión grave de conversión/accesibilidad, fuga de datos (ver también `incident.md`).

1. Decidir (responsable del proyecto) y anotar hora y motivo.
2. Restaurar el despliegue ANTERIOR desde el proveedor (promover el deploy previo) **o** revertir el PR: `git revert <merge-commit>` en una rama → PR → despliegue. Nunca `git push --force` a `main`.
3. Si hubo migraciones/datos: restaurar desde backup (procedimiento del proveedor; probado antes del lanzamiento).
4. Verificar con el smoke test de `release.md`.
5. Post-mortem en `docs/learning/lessons.md` (causa raíz, qué test lo habría detectado → añadirlo).
