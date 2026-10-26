---
description: Incorpora de forma segura un prototipo de Replit (o recupera el repo si Replit tocó archivos fuera del canon).
argument-hint: <carpeta-o-rama>
---

Activa `replit-intake`. Ejecuta `node "$HOME/.claude/web-os/scripts/replit-intake.mjs" $ARGUMENTS --report creative/replit-intake.md`, revisa el informe (artefactos excluidos, secretos, dependencias nuevas), y reimplementa lo útil en una rama normal con tests. Nunca hagas merge del `main` de Replit. Si hay secretos: bloquea y exige rotarlos.
