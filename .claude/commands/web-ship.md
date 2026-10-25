---
description: Checklist de lanzamiento a producción. Requiere aprobación humana explícita; el agente no se auto-aprueba.
---

Activa `web-workflow` (fase 8). Verifica: QA verde, staging aprobado por escrito, rollback documentado, backups, dominio/HTTPS, secretos en el proveedor, monitoreo. **Pide al usuario que cree él mismo** `.web-os/approvals/production.json` con `{"approved_by":"<nombre>","approved_at":"<ISO>","expires_at":"<ISO>"}` (el agente no puede escribirlo: el guardián lo bloquea). Solo entonces ejecuta el despliegue de producción definido en `PROJECT.md`, seguido de smoke test. Documenta el resultado.
