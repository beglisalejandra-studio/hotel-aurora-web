# Runbook — Revisión antes de fusionar un PR

Control manual **obligatorio**, haya o no reglas de rama activas en GitHub (en repos privados con plan Free no se hacen cumplir). Con Claude Code: `/web-merge <número>`. Sin él, estos mismos pasos a mano:

1. **Checks:** todos en verde sobre el último commit del PR. Uno en rojo, pendiente o ausente = no se fusiona.
2. **Conversaciones:** sin hilos abiertos ni preguntas sin responder.
3. **Qué toca (pestaña «Files changed»):** atención especial a `.github/workflows/`, dependencias nuevas (`package.json`, lockfile), variables o claves, CSP/autenticación y permisos. Ningún secreto en el diff.
4. **Qué se verificó y qué no:** el PR lo dice. Si cambia el diseño, abre la vista previa.
5. **Contenido del editor visual:** el PR solo cambia `content/` y `public/media/`; revisa los textos y las imágenes en la vista previa.
6. **Una persona pulsa «Merge»** (squash). Si llega un commit nuevo, se repite desde el paso 1.
7. Tras fusionar: confirmar que el despliegue y el smoke test (`docs/runbooks/release.md`) pasan.
