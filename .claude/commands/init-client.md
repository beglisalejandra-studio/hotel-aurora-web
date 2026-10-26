---
description: Crea (o adopta) un proyecto web nuevo desde la plantilla del sistema. Uso — /init-client nombre-cliente [--adopt] [--type new|redesign|maintenance] [--duration 1-3d|1-2w|3-6w] [--authority taste-skill|impeccable] [--modules forms,payments-stripe,...] [--no-editor]
argument-hint: <nombre-cliente> [--adopt] [--type ...] [--duration ...] [--authority ...] [--modules ...]
---

Inicia un proyecto web con el sistema web-os. Argumentos: `$ARGUMENTS`

**Esto es el ÚNICO punto de entrada que crea un proyecto. No construyas páginas ni contenido en este comando: solo andamiaje + brief.**

1. **Preflight.** Si el directorio actual ya es un proyecto (`PROJECT.md`) y no hay `--adopt`, detente y avisa. Comprueba el entorno: `node "$HOME/.claude/web-os/scripts/doctor.mjs" --scope global --offline`. Si falta la capa global, dile al usuario que ejecute `npm run bootstrap` en el repo del sistema.
2. **Andamiaje (determinista).** Ejecuta: `node "$HOME/.claude/web-os/scripts/init-client.mjs" $ARGUMENTS --git`. Copia la plantilla, sustituye los datos conocidos, copia la skill de la autoridad visual elegida a `.claude/skills/` (versionada en el proyecto) y hace `git init` + commit inicial LOCAL en `main`. **Todo sitio nuevo incluye el módulo `visual-editor`** (editor visual para el cliente en `/editor`); `--no-editor` lo omite. Tras crearlo, indica las variables que faltan (`EDITOR_SESSION_SECRET`, `EDITOR_ALLOWED_EMAILS`, `EDITOR_MAIL_FROM`, `RESEND_API_KEY`) y que se configuran en el gestor de secretos del proveedor, nunca en el repo. `--adopt` añade documentos y `.claude/` a una web existente **sin sobrescribir nada**.
3. **Dependencias.** Entra en el proyecto y ejecuta `npm install --ignore-scripts` (o `npm ci --ignore-scripts` si hay lockfile). Luego `npm run doctor`.
4. **Brief.** Activa la skill `web-workflow`. Con AskUserQuestion (máx. 3 preguntas por ronda) recoge: negocio y oferta, audiencia y situación, objetivo de conversión y KPI, referencias (URLs), restricciones de marca/legales, duración, integraciones necesarias. Escribe `PRODUCT.md` y completa `PROJECT.md`. Marca lo no confirmado como "pendiente"; **no inventes claims**.
5. **Informe** (formato `status-report.md`): qué se creó, qué falta (`{{PLACEHOLDERS}}`), bloqueos con acción exacta, próximo paso (`/web-refs` o `/web-plan`).

Límites: no crees el repo remoto, no hagas push y no configures dominios/credenciales sin aprobación explícita del usuario.
