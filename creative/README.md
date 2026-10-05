# creative/

| Ruta                      | Contenido                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `manifest.json`           | Decisión y registro de media por página (tipo, score, razón, referencias, prompts, shots, outputs, estado, aprobación). Se valida con `npm run validate:manifest`. |
| `video-score.config.json` | Pesos, umbrales y presupuestos de VIDEO_SCORE (configurables).                                                                                                     |
| `briefs/`                 | Entradas de VIDEO_SCORE por página (`<página>.score.json`).                                                                                                        |
| `references/`             | URLs, capturas, JSON extraído y análisis (`npm run refs`).                                                                                                         |
| `requests/`               | **Solicitudes** de material (`<nombre>.md` = ficha con estilo, medidas exactas y prompt; `.json` = lo que se comprueba). Las crea `npm run media:request`.         |
| `inbox/`                  | **Aquí subes** el material que te pidió el agente (`<nombre>.jpg\|png\|webp\|mp4`). `npm run media:intake` lo comprueba y lo pasa a borrador.                      |
| `generated-drafts/`       | Borradores generados (estado `draft`). **Nada aquí se publica.**                                                                                                   |
| `approved/`               | Másters aprobados **por una persona**.                                                                                                                             |
| `providers.json`          | Proveedor de imagen/video (por defecto `manual`).                                                                                                                  |

Flujo: `briefs/<p>.score.json` → `npm run media:score -- --input creative/briefs/<p>.score.json --write-manifest` → generar en `generated-drafts/` → `npm run media:optimize` → aprobar (humano) → `public/media/`.

## `brand/` — materiales de marca del cliente

Logos (SVG), favicon, paleta, tipografías y fotografías propias. Sube aquí lo que pida Claude; se valida con `npm run media:intake` y se registra su procedencia en `manifest.json`.
