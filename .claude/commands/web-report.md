---
description: Genera el informe de avance para el cliente (borrador en lenguaje claro) desde el estado real del proyecto.
argument-hint: [--since 14]
---

Activa `web-workflow`. Ejecuta `node "$HOME/.claude/web-os/scripts/client-report.mjs" $ARGUMENTS` (o `npm run report`). Genera `docs/reports/AAAA-MM-DD.md` con: fase actual, lo hecho (commits convertidos a frases), imagen/video pendiente de aprobación, **lo que necesitamos del cliente**, calidad técnica y riesgos. Es un BORRADOR: complétalo con "Próximos pasos" concretos y fechas, revisa el tono y **no incluyas** claves, correos de personas, rutas internas ni datos de otros clientes. Envíalo solo tras revisión humana.
