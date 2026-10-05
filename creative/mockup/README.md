# Maqueta de Hotel Aurora (v2)

`index.html` es **un solo archivo autocontenido** (HTML, CSS y JavaScript sin dependencias de compilación). Ábrelo directamente en el navegador.

| Ruta (hash) | Pantalla |
|---|---|
| `#/` | portada: nombre con el sol, habitaciones, la ciudad (esquema de líneas), disponibilidad |
| `#/habitacion/alba` (también `mediodia`, `atardecer`, `noche`) | página de habitación |
| `#/reservar` | flujo de 4 pasos: fechas, datos, pago (bloqueado), confirmación de ejemplo |

- **Paletas:** botones en la franja negra superior, o con `?paleta=luz` (por defecto), `?paleta=fachadas` o `?paleta=anil`. La elección se recuerda en el navegador (`localStorage`, solo el nombre de la paleta).
- **Guía de fotos:** botón en la franja superior, visible en la página de cada habitación; muestra el código y la medida del hueco de imagen (coinciden con `creative/requests/LEEME.md`).
- **Contenido ficticio:** nombres, precios, disponibilidad y servicios son de demostración. El mapa es un **esquema ilustrativo, no a escala** y el hotel no tiene dirección.
- **Avisos de portafolio:** franja superior, paso de pago, confirmación de ejemplo y pie. El pago **no puede** avanzar. Lo que se escribe en los formularios no sale de la página ni se guarda.
- **Movimiento:** solo CSS. Con `prefers-reduced-motion: reduce` no corre ninguna animación. En navegadores sin `animation-timeline` (por ejemplo Firefox estable) el sol no inunda el hero, pero todo el contenido es visible.

## Procedencia y licencias
- **Íconos:** [Phosphor Icons](https://phosphoricons.com/) 2.1.1 (licencia MIT), incrustados como sprite SVG. Solo los usados.
- **Fuentes:** [Anybody](https://fonts.google.com/specimen/Anybody) y [Familjen Grotesk](https://fonts.google.com/specimen/Familjen+Grotesk) (Google Fonts, SIL Open Font License) pedidas a Google **solo en la maqueta**; en producción se autoalojan con `next/font`.
- **Imágenes:** ninguna. La portada no lleva fotografía y la ventana de la habitación muestra un glifo plano hasta que se aprueben las cuatro fotos.

## Capturas
`screenshots/`: portada en 390, 768 y 1440 px con la paleta por defecto, las tres paletas en 1440 px, página de habitación, hoja de fechas y paso de pago bloqueado. Son capturas de **esta** maqueta; no hay capturas de sitios de terceros en el repositorio.

## Cómo se verificó
Ver `docs/entregables/01-propuesta-diseno.md` → «Qué verifiqué» y «Qué NO verifiqué».
