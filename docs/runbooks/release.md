# Runbook — Lanzamiento

**Prerrequisitos (todos con evidencia):** `/web-qa` en verde · staging aprobado POR ESCRITO · rollback documentado · backups · dominio/HTTPS verificados · secretos en el proveedor · monitoreo.

1. Congelar cambios; confirmar que `main` == lo aprobado en staging (mismo commit).
2. **Aprobación humana de producción:** una persona crea `.web-os/approvals/production.json` con `{"approved_by":"<nombre>","approved_at":"<ISO>","expires_at":"<ISO +24h>"}`. (El agente no puede crearlo: el guardián lo bloquea.)
3. Desplegar con el proveedor definido en `PROJECT.md` (`hosting`). Variables de producción solo en el proveedor: `NEXT_PUBLIC_SITE_ENV=production`, `NEXT_PUBLIC_SITE_URL=https://…`.
4. **Smoke test post-deploy:** home 200 · formulario con dato ficticio · checkout en modo LIVE solo si está aprobado (importe mínimo) o modo test · robots/sitemap correctos · cabeceras de seguridad (`curl -sI`) · consentimiento: nada dispara antes de aceptar.
5. Comprobar analítica (eventos una vez, sin PII) y monitoreo de errores.
6. Registrar el lanzamiento en `docs/maintenance/handover.md` y en `docs/learning/lessons.md`.
