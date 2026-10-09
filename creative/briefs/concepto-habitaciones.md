# Concepto de habitaciones v2: un solo aspecto, cuatro rincones

> **Propuesta del 2026-10-09, pendiente de aprobación de la persona. Segunda versión.** La primera diferenciaba las habitaciones por la luz y el color (Marea fría y plateada, Terraza de mediodía duro, Faro de noche). Al generarla, la persona recibió una villa moderna que **rompía por completo la estética del hotel**, y pidió que la imagen principal se copie al pie de la letra. Esta versión corrige el rumbo: el aspecto queda fijado por la imagen principal (P01) y cada habitación cambia **solo en el espacio y en un detalle propio**.

## Qué falló y qué cambia
1. **Cambié demasiado.** El primer Marea quitaba las vigas oscuras y pedía luz fría, ventana panorámica, cama flotante y suelo pulido. La diferencia no puede estar en la luz, en el color ni en cómo está construida la casa.
2. **Las referencias no fijaban el aspecto.** Mi plantilla pedía "conservar color e iluminación", luego la sustituí por un contrato que decía lo contrario. Ahora cada prompt de habitación lleva un **contrato de estilo**: la primera imagen adjunta (P01) define el aspecto, se copia al pie de la letra y solo cambia el espacio. Se activa con `node scripts/finalize-media-request.mjs <nombre> --look "<aspecto>"`.
3. **Qué hace distinta a cada habitación:** la distribución, la pieza protagonista, la vista y un solo color secundario dentro de la paleta. Nada más.

## El aspecto de la imagen principal (P01), medido
Medido sobre `creative/approved/p01-hero-escritorio.jpg` (2560 x 1600):
- **Luz:** sol bajo de primera hora desde la izquierda, dorado ámbar y cálido en las superficies iluminadas, con un fino borde de luz en los cantos. **Sombras largas, suaves y frías, azul lila** (la grava en sombra mide `#5F687A`), nunca negras ni marrones.
- **Cielo y mar:** cielo azul aciano limpio (`#A3C3E2` arriba) que se vuelve melocotón pálido junto al sol (`#FCF4E0`); mar azul profundo y en calma (`#6584A5`).
- **Materiales:** cal crema cálida, con textura suave de llana; madera marrón chocolate oscura (contraventanas `#462F24`, puerta `#3E271A`); barro y teja anaranjados; marcos de piedra caliza pálida alrededor de puertas y ventanas; olivos verde grisáceo.
- **Graduación:** tono dividido (luces cálidas, sombras frías), saturación moderada (media 0,24), mucha claridad, nitidez profunda, detalle limpio y muy poco grano. Contraste medio alto, con oscuros marrón cálido (`#2E2119`) y luces crema suave (`#E5E6E1`).

## Lo que no cambia (el ADN del hotel)
1. Cal hecha a mano, mate, con marcas de llana y fisuras finas.
2. Solo huecos rectangulares con dintel recto, en muros gruesos. Nunca arcos.
3. El mar en cada foto, como una banda plana y nivelada.
4. Cama baja de lino natural arrugado, sin cabecero tapizado.
5. Un acento terracota pequeño en cada foto.
6. Una rama de olivo pequeña, en barro o vidrio, como firma del hotel.
7. Fotografía documental de 35 mm, luz natural, sin personas, con el aspecto de P01.
8. Casa vieja restaurada: muros gruesos e irregulares, vigas y carpintería de madera oscura, puertas de tablones, marcos de piedra pálida y suelos de piedra o barro gastados. Nada nuevo, liso ni de catálogo.

## Cuatro rincones
Todas con el aspecto de P01. Cambian el espacio y el detalle.

| | **Alba** (hecha) | **Marea** | **Terraza** | **Faro** |
|---|---|---|---|---|
| Idea | El amanecer | El mirador | El cañizo | La torre |
| Espacio | Dormitorio con vigas, cama baja y ventana alta | Un banco de obra en una ventana de un muro de un metro, con el mar enmarcado | Habitación que sale a una terraza privada cubierta de caña partida | Suite de dos estancias con tres huecos alineados y una ventana alta y estrecha |
| Luz (misma familia dorada) | Sol bajo de la mañana desde la izquierda, banda diagonal | Sol bajo de la mañana desde la izquierda sobre el hueco y el banco | Sol bajo de la tarde desde la derecha: sombras largas del cañizo en rayas azul lila | Sol bajo del atardecer desde la derecha sobre la piedra clara del muro |
| Color secundario | Terracota | Azul índigo del lino y del mar | Verde oliva y barro | Latón y piedra arenisca clara |
| Pieza protagonista | La banda de luz y la sombra del olivo | El banco-mirador con el mar azul profundo, el color más fuerte de la foto | El cañizo, que dibuja la luz, y una cama de día de obra encalada | Una lámpara de latón con una pequeña lente de faro y la ventana alta |
| Gancho distinto | La luz que se mueve (vídeo V03) | La cama de forja oscura al lado y el mar como un cuadro dentro del muro | Una ducha de obra al aire libre para quitarse la arena de El Palmar | Es la única con dos estancias en una sola mirada |
| Cama | Baja de lino, con manta terracota | De forja oscura y mate, con lino índigo y crudo | Cama de día de obra con colchoneta de lino crudo | Baja, con lino crudo y manta terracota |
| Foto | 28 mm desde la esquina | 35 mm de frente a la ventana, cámara a 1,1 m | 24 mm, cámara a 1,3 m, mirando del interior a la terraza | 35 mm sobre trípode, perspectiva de un punto |

Prueba de miniatura: se distinguen por la forma, no por el color. Alba, una banda diagonal de luz; Marea, una ventana azul en el centro; Terraza, rayas de sol sobre el suelo; Faro, una ventana alta y estrecha entre huecos alineados.

## Cola de fotos que propongo
- **Alba:** P04 hecha. P05 (luz sobre la pared) en pausa; propongo suprimirla porque repite P04, y el vídeo V03 puede usar P04 móvil como póster. P06 (baño) se mantiene, con un sujeto distinto.
- **Marea:** P07 a P09. Empezar por aquí.
- **Terraza:** P10 a P12. **Faro:** P13 a P15 (salón, dormitorio, vista).
- Cada pieza se pide en dos versiones, con la proporción exacta y el hueco medido.

## Cómo se pide
1. **Contrato de estilo (`--look`)**: la primera imagen adjunta es siempre P01, y el prompt copia su aspecto medido.
2. **Referencias**: P01 primero, y después Alba y el patio, que enseñan el interior de la casa.
3. **Prohibiciones explícitas**: nada de luz fría o neblinosa, muros gris azulado, techo blanco, ventana panorámica, cama flotante, suelo pulido ni muebles modernos.
4. **Móvil primero**: la versión móvil lleva composición propia.

## Riesgos al generar con IA
- **Deriva a villa moderna o a estilo catálogo**: es lo que pasó con el primer Marea. Se frena con el contrato de estilo, las referencias y las prohibiciones. Si vuelve a pasar, se recorta o se repite con la prohibición reforzada.
- **Arcos fantasma** en Terraza y Faro: se repite "flat lintel, rectangular openings only".
- **Términos locales** (cañizo, ostionera): se describen por su aspecto.
- **Terraza**: las rayas del cañizo pueden salir como persiana veneciana.
- **Faro**: puede caer en kitsch náutico (anclas, cuerdas). Se prohíbe en el prompt.
- **Claims**: "lente de faro" y "vista al mar" son referencias de diseño, no promesas de producto.
