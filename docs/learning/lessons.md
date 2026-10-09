# Aprendizajes (retrospectiva)

Formato por entrada: **fecha · fase** — qué funcionó · qué falló · causa raíz · decisión · ¿mejora el sistema? (skill, plantilla, doctor, hook → proponer PR al repo del sistema con `/web-system-update`).

<!-- Añade entradas al cerrar cada fase con /web-retro -->

**2026-10-09 · Fase 3 (material de habitaciones)** — Funcionó: un único prompt maestro por habitación (todas las fotos por separado, escritorio y móvil) y subir las 8 de Alba de una vez; el aspecto de P01/P04 se mantuvo. Falló: `media-intake.mjs` vuelve a procesar **todo** lo que hay en `creative/inbox/` y devuelve a `received` las fichas ya aprobadas (y copia otra vez sus borradores). Causa raíz: el script no distingue piezas aprobadas. Decisión: tras cada intake, revertir con `git checkout` las fichas aprobadas y borrar sus borradores duplicados (o mover los originales aprobados fuera de `inbox/`). ¿Mejora el sistema? Sí: proponer en `/web-system-update` que `media-intake` salte las fichas con `status: approved`.
Funcionó: revisar cada imagen aumentada al 800 % antes de aprobarla; apareció una marca de fabricante diminuta bajo la tele (~10 × 2 px) que se retoca en el borrador y se anota en `creative/provenance.json`. Las tres fotos de tele (P05, P27) llevaban la marca: añadir «sin marca ni logotipo en el marco de la tele» al prompt de las habitaciones siguientes.
