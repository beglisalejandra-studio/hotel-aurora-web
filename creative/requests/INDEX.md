# Cola de material (una pieza cada vez)

Se pide **una pieza por turno**, con su ficha en `creative/requests/<nombre>.md` (medidas exactas, prompt ultra realista y carpeta de subida). Al recibirla se comprueba con `media-intake.mjs`, se anota como **borrador** y la persona la aprueba antes de pasar a `public/media/`. La primera imagen aprobada de cada espacio **fija la identidad** (edificio, luz, paleta): las siguientes se piden como variaciones de ella.

**Dos versiones por pieza (regla permanente):** cada foto se pide siempre en **escritorio y móvil**, cada una como imagen **separada**, con su propia ficha, su prompt y su nombre (`<pieza>-escritorio`, `<pieza>-movil`), las dos en el mismo mensaje. La versión móvil lleva la medida del contenedor móvil real y un encuadre pensado para una pantalla pequeña (sujeto más grande, menos detalles finos).

**Proporción exacta en cada prompt (regla permanente):** el bloque que se copia en la herramienta empieza con una línea `FORMAT:` y termina con una línea `OUTPUT:`, con la orientación, la proporción exacta, el tamaño objetivo y mínimo, la calidad, el color y el formato, porque la persona solo copia ese bloque. Las añade `node scripts/finalize-media-request.mjs <nombre>` (idempotente; `--check` avisa si falta alguna). La tabla de medidas de la ficha sigue siendo la referencia que comprueba `media-intake`. La herramienta decide el tamaño final; lo que no llegue al mínimo se avisa al subirlo.

**Móvil primero (regla permanente):** cada pieza se pide con su composición nativa para el contenedor móvil real, nunca como recorte automático de la de escritorio. Antes de pedirla se mide el contenedor en la maqueta y se calcula cuánto de la foto se ve con `cover`; la ficha fija las zonas seguras. Ninguna pieza se aprueba sin verla en 390 × 844.

**Procedencia (interna):** las imágenes generadas con IA se registran con `ai_generated: true` y la herramienta usada en `creative/provenance.json` (y en `creative/manifest.json` desde la fase 4). Por decisión de la persona **no se muestra ninguna etiqueta visible** en el sitio. Para un cliente real se usan fotografías reales.

| # | Código | Tipo | Qué | Proporción | Estado |
|---|---|---|---|---|---|
| 1 | P01 escritorio | Foto | Fachada al amanecer, héroe de la portada (LCP) | 16:10 | **Aprobada** el 2026-10-09 (`p01-hero-escritorio.md`) |
| 2 | P01 móvil | Foto | La misma fachada recompuesta en vertical para el teléfono (contenedor real 390 × 772) | **9:16** (1440 × 2560) | **Aprobada** el 2026-10-09, tal cual (941 x 1672; `p01-hero-movil.md`) |
| 3 | P03 escritorio y móvil | Foto (2 versiones) | Patio interior a media mañana | 3:2 las dos (la móvil, con encuadre más cerrado) | **Aprobadas** el 2026-10-09: escritorio, y móvil con el recorte B (`p03-patio-escritorio.md` y `p03-patio-movil.md`) |
| 4 | P04 escritorio y móvil | Foto (2 versiones) | Habitación Alba, vista general | 4:5 las dos (la móvil, con encuadre más cerrado) | **Solicitada** (`p04-alba-escritorio.md` y `p04-alba-movil.md`) |
| 5 | P05 | Foto | Alba, la luz sobre la pared | 3:2 | Pendiente |
| 6 | P06 | Foto | Alba, baño | 3:2 | Pendiente |
| 7 | P16 | Foto | Sala del restaurante con luz de ventana (también es el póster de V01) | 3:2 | Pendiente |
| 8 | V01 | Vídeo | Luz de ventana sobre la mesa, 6 s en bucle, sin audio | 3:2 | Pendiente de #7 |
| 9 | P19 | Foto | Sala de tratamientos del spa | 4:5 | Pendiente |
| 10 | P25 | Foto | Perro en la terraza de la habitación (hotel petfriendly) | 3:2 | Pendiente |
| 11 | P21 a P23 | Foto | Portadas de los tres paquetes | 4:5 | Pendiente (ajustar antes de pedir: ver tabla de contenedores) |
| 12 | P07 a P15 | Foto | Resto de habitaciones: Marea, Terraza y suite Faro | 3:2 y 4:5 | Pendiente |
| 13 | P17, P18 | Foto | Plato en primer plano y desayuno | 3:2 | Pendiente |
| 14 | P20 | Foto | Zona de agua del spa al amanecer | 3:2 | Pendiente |
| 15 | P24 | Foto | **Playa de El Palmar** (rasgos reales: arena dorada, pasarela de madera con valla, hierba de duna, oleaje atlántico moderado y viento) | 16:9 | Pendiente |
| 16 | P02 | Foto | Imagen para compartir en redes: se **deriva de P01**, no se pide aparte | 1200 x 630 | Derivada |
| 17 | V02, V03 | Vídeo | Agua del spa y luz sobre la pared de Alba, 6 s en bucle | 4:5 y 3:2 | Pendiente |
| 18 | 360 x 4 | Foto 360 | Panoramas equirrectangulares de las cuatro habitaciones (extra aprobado) | 2:1 | Pendiente |
| 19 | Mapa de profundidad de P01 | Derivado | Lo genera el equipo a partir de P01 aprobada (extra 2,5D) | igual que P01 | Pendiente de #1 |

## Contenedores medidos en la maqueta (2026-10-09)
Tamaño real de cada hueco de foto (`offsetWidth` x `offsetHeight`) a 390, 768 y 1440 px de ancho. La proporción entre paréntesis es ancho/alto.

| Hueco | Móvil 390 | Tableta 768 | Escritorio 1440 | Se pide | Consecuencia |
|---|---|---|---|---|---|
| P01 héroe | 390 x 772 (0,51) | 768 x 952 (0,81) | 1440 x 828 (1,74) | 16:10 y **9:16** | Dos composiciones nativas; la tableta vertical reutiliza la 9:16 anclada arriba. Una foto 4:5 perdería el 37 % del ancho en el móvil; una 16:10, el 68 % |
| P03 patio, V01 | 328 x 218 (1,50) | 338 x 225 | 634 x 422 | 3:2 | Coincide |
| P04 Alba, P19 spa (recorrido) | 234 x 293 (0,80) | 230 x 288 | 420 x 525 | 4:5 | Coincide |
| Carril de habitaciones (P04, P07, P10, P13) | 288 x 360 (0,80) | 288 x 360 | 288 x 360 | 4:5 | Coincide |
| P25 mascotas | 358 x 239 (1,50) | 707 x 471 | 686 x 457 | 3:2 | Coincide |
| Ficha de Alba (P04): foto principal | 358 x 448 (0,80) | 380 x 430 (0,88) | 425 x 480 (0,89) | 4:5 | Recorta algo arriba y abajo en tableta y escritorio: zona segura del 85 % central del alto |
| Ficha de Alba: fotos de detalle (P05, P06) | 358 x 239 (1,50) | 311 x 207 | 348 x 232 | 3:2 | Coincide |
| Miniaturas de otras habitaciones en la ficha | 96 x 128 (0,75) | igual | igual | 4:5 | Casi coincide |
| P21 a P23 paquetes | 358 x 420 (0,85) | 707 x 420 (1,68) | 719 x 560 (1,28) | 4:5 | **No coincide** en tableta y escritorio: al pedirlas, sujeto en la franja central (26 % a 74 % del alto) o igualar el contenedor con CSS |

## Medidas que llevará cada prompt, por proporción
| Proporción | Orientación | Objetivo | Mínimo aceptado | Piezas de la cola |
|---|---|---|---|---|
| 3:2 | Horizontal | 2560 x 1706 px | 1500 x 1000 px | P03, P05, P06, P16, P17, P18, P20, P25 |
| 4:5 | Vertical | 2048 x 2560 px | 1200 x 1500 px | P04, P07 a P15 (según hueco), P19, P21 a P23 |
| 16:9 | Horizontal | 2560 x 1440 px | 1500 x 844 px | P24 (playa) |
| 16:10 | Horizontal | 2560 x 1600 px | 1500 x 938 px | P01 escritorio (ya aprobada) |
| 9:16 | Vertical | 1440 x 2560 px | 844 x 1500 px | P01 móvil (ya aprobada) |
| 2:1 | Horizontal, panorámica 360° | 2560 x 1280 px | 1500 x 750 px | Cuatro panoramas de habitación (extra) |

Cada pieza se confirma contra el hueco medido antes de pedirla; si el hueco pide otra proporción, la ficha manda.
