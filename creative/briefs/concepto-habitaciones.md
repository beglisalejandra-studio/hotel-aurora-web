# Concepto de habitaciones: una casa, cuatro horas del día

> **Propuesta del 2026-10-09, pendiente de aprobación de la persona.** Nace de su observación: las fotos de dos habitaciones "se ven iguales". Tres directores creativos independientes (arquitectura y materiales, narrativa de marca y fotografía de interiores) propusieron por separado cómo diferenciar Marea, Terraza y Faro; esto es la síntesis. Alba ya está fotografiada (P04) y es la referencia que no se repite.

## Por qué se veían iguales
1. **Misma luz y mismo color.** Alba, el patio y la portada comparten cal crema, madera oscura y luz dorada. Es bonito, pero cuatro habitaciones así se confunden.
2. **Mi plantilla de prompt.** El bloque `VISUAL CONTRACT` que añade `media-request` pide al generador conservar "colores, iluminación y composición" de la referencia. Eso copia el aspecto de Alba en la habitación siguiente. Para las habitaciones nuevas se sustituye por un **contrato de esencia** (ver "Cómo se pide").
3. **Una sola referencia para todo.** La primera foto aprobada debe fijar la identidad de **cada habitación**, no la del hotel entero.

## Lo que no cambia (el ADN del hotel)
1. **Cal hecha a mano**, mate, con marcas de llana y fisuras finas. Cambia el pigmento, nunca la textura.
2. **Solo vanos rectangulares** con dintel recto, abiertos en muros gruesos. Nunca arcos.
3. **El mar está en cada foto**: una banda plana y nivelada, de al menos el 10 % del cuadro.
4. **Cama baja de lino natural arrugado**, sin cabecero tapizado ni cojines decorativos.
5. **Un acento terracota pequeño** en cada foto (barro, lana o suelo).
6. **Una rama de olivo** pequeña, en una pieza de barro o de vidrio, como firma discreta.
7. **Fotografía documental**: película de 35 mm de grano fino, luz natural dominante, verticales a plomo, sin personas.

## Lo que cambia en cada habitación
La hora y el tipo de luz, el tono de la cal, el suelo y el techo, una pieza protagonista, un gancho que solo tiene esa habitación y la forma de fotografiarla. Prueba de miniatura: las cuatro deben distinguirse por color dominante, luz y silueta aunque se reduzcan a un cuadrito.

| | **Alba** (hecha) | **Marea** | **Terraza** | **Faro** |
|---|---|---|---|---|
| Idea | El amanecer | La línea de marea | La habitación del cañizo | La enfilada |
| Hora y luz | 7:10 a 10:30. Dorada, banda diagonal de sol | 11:30, bruma marina. Difusa, fría y plateada, sin sol directo (6000 a 6500 K) | 14:30, sol casi cenital. Blanca y dura, rayas nítidas de sol y sombra (5600 K) | 21:10, hora azul. Cielo cobalto a índigo y **una sola lámpara ámbar** |
| Cal y color dominante | Crema `#EFE3CF` | Azulete de bruma `#C6D1D0` y zócalo pizarra `#3F4F59` | Almagre `#C47F62` | Añil de pizarra `#34495A` |
| Suelo y techo | Losas claras y vigas oscuras | Baldosa hidráulica lisa gris plomo y humo en damero tono sobre tono; techo encalado | Baldosín de barro cocido de junta ancha; cañizo sobre rollizos grises | Roble oscuro; techo liso en cal; muro grueso de piedra ostionera |
| Pieza protagonista | La banda de luz sobre la pared | Ventana apaisada baja a ras de la cama, con banco de pino gris plata | El cañizo (caña partida sobre rollizos) que dibuja la luz | La lámpara de latón con lente de Fresnel y la ventana de cuatro cristales al fondo |
| Gancho distinto | La luz que se mueve (vídeo V03) | El horizonte, el borde del zócalo y el reflejo del agua en el techo forman líneas paralelas | La ducha de obra al aire libre para quitarse la arena de El Palmar, y la cama de día de obra | Tres vanos rectangulares alineados: salón, dormitorio y ventana. Es la única que se vive de noche |
| Paleta de 5 | `#EFE3CF` `#E9B36A` `#4A2E1F` `#B9431A` `#D9C6A3` | `#C6D1D0` `#3F4F59` `#6F8794` `#B6B4A8` `#A9593A` | `#C47F62` `#8E4A33` `#F4EBDD` `#2F4A3E` `#6F8794` | `#34495A` `#1B2733` `#9FB2C4` `#E3A25B` `#B9431A` |
| Fotografía | 28 mm, f/8, desde la esquina. Cálida | 50 mm, frontal y casi simétrica, cámara a 1,0 m, f/8. Fría y desaturada, bandas horizontales | 24 mm, cámara a 1,3 m, f/11, verticales corregidas. Contraste alto, del interior a la terraza | 35 mm sobre trípode, exposición larga. Contraste alto, grano algo más visible, perspectiva de un punto |

## Cola de fotos que propongo
- **Alba:** P04 hecha. **P05 (luz sobre la pared) en pausa y propongo suprimirla**: repite P04, y el vídeo V03 puede usar P04 móvil como póster. P06 (baño) se mantiene, con un sujeto distinto.
- **Marea:** P07 a P09. **Empezar por aquí**: es el contraste más fuerte con Alba (fría frente a dorada).
- **Terraza:** P10 a P12.
- **Faro:** P13 a P15 (salón, dormitorio, vista). La más difícil de generar; va la última.
- Cada pieza sigue pidiéndose en dos versiones, con la proporción exacta y los huecos medidos.

## Cómo se pide (cambios de proceso)
1. **Contrato de esencia** en lugar de "conservar color e iluminación": la referencia aporta el lenguaje constructivo (cal, madera, vanos rectangulares), no el color ni la luz. Se activa con `node scripts/finalize-media-request.mjs <nombre> --essence "<lo que se conserva>"`.
2. **Color y luz con palabras, no solo con códigos hex**: el generador no respeta los hex. Los hex sirven para comprobar la foto ya generada.
3. **Prohibiciones explícitas** en cada prompt: nada dorado en Marea y Faro; "flat lintel, rectangular openings only, no arches, no vaults" en Terraza y Faro; sin anclas, cuerdas ni timones en Faro.
4. **Móvil primero**: Marea es horizontal y simétrica, así que su versión móvil necesita composición propia y no un recorte automático.

## Riesgos al generar con IA
- **Deriva a lo dorado y rústico**: es el riesgo número uno. Se frena con temperatura de color explícita y prohibiciones.
- **Arcos fantasma** en Terraza y Faro: cal, piedra gruesa y Andalucía los atraen. Se repite "flat lintel" en cada prompt.
- **Términos locales** (azulete, almagre, ostionera, cañizo, baldosa hidráulica): el modelo los confunde con cosas de otros países. En el prompt se describen por su aspecto.
- **Marea**: el reflejo del agua puede salir como piscina o mosaico, y la línea del horizonte puede salir inclinada. Se pide sutil y se corrige en el recorte.
- **Terraza**: las rayas del cañizo pueden salir como persiana veneciana.
- **Faro**: puede encender todas las lámparas, caer en kitsch náutico o parecer una bola de discoteca. La piedra ostionera puede salir como coral.
- **Coherencia**: cuatro habitaciones muy distintas pueden parecer cuatro hoteles. Lo evitan los siete elementos del ADN, que van literales en cada prompt.
- **Claims**: "alberca", "lente de Fresnel" o "vista al mar" son referencias de diseño; ninguna se presenta como promesa de producto sin evidencia en `PRODUCT.md`.
