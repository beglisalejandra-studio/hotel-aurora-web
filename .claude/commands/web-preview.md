---
description: Prepara un entorno de preview/staging revisable (sin indexar, con datos ficticios) y el checklist de revisión del cliente.
---

Activa `web-workflow` (fase 7). Verifica que `/web-qa` está en verde. Prepara preview con el proveedor definido en `PROJECT.md` (rama/PR → URL de preview), `noindex`, pagos en modo test y pixels solo con datos ficticios. Entrega URL + checklist de revisión (`docs/qa/release-checklist.md`) + cambios desde la última revisión. **No** despliegues a producción ni cambies DNS; si falta un secreto en el proveedor, repórtalo como bloqueo manual.
