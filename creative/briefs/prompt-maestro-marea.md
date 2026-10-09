# Prompt maestro de Marea: 10 imágenes en un solo prompt

> Para ChatGPT. Marea completa: dormitorio (general y camas), el mirador, el baño y la zona de TV, cada toma en versión escritorio y móvil, **10 imágenes separadas**. Marea no tiene terraza (su gancho es el banco-mirador de la ventana).
> Adjunta en este orden: **1) `creative/approved/p01-hero-escritorio.jpg`** (fija el aspecto), **2) `creative/approved/p04-alba-escritorio.jpg`** y **3) `creative/approved/p04-alba-movil.png`** (otra habitación de la misma casa: mismos muros, vigas, suelo y lino).

## Habitación (decisión de la persona, 2026-10-09)
**Tres personas: una cama doble y una cama individual.** Cuesta más que Alba. Todas las habitaciones pueden pedir cama para mascota o cuna de bebé sin coste adicional (se dice en la web, no se dibuja aquí).

## Archivos que debe devolver (renómbralos así al subirlos)
| # | Archivo | Proporción | Objetivo | Mínimo |
|---|---|---|---|---|
| 1 | `p07-marea-escritorio` | 4:5 | 2048 × 2560 | 1200 × 1500 |
| 2 | `p07-marea-movil` | 4:5 | 2048 × 2560 | 1120 × 1400 |
| 3 | `p08-marea-mirador-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 4 | `p08-marea-mirador-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 5 | `p09-marea-camas-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 6 | `p09-marea-camas-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 7 | `p28-marea-bano-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 8 | `p28-marea-bano-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 9 | `p29-marea-tv-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 10 | `p29-marea-tv-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |

## Supuestos de diseño (ficticios; confirmar antes de publicar)
Que la ventana del mirador mire al suroeste (el sol entra por la tarde, desde la derecha), que el baño tenga una ventana pequeña con vistas al mar y ducha de obra a ras de suelo, y que la tele esté empotrada en un hueco del muro sin puertas. En la web no se afirma Smart TV, plataformas, ducha de lluvia ni pulgadas. Las dos camas (doble e individual) son un dato ficticio de portfolio, declarado en `PRODUCT.md`.

## Lo que se corrige respecto a Alba (lecciones de las 8 fotos recibidas)
Las fotos de Alba salieron más naranjas y saturadas que la imagen principal, con sombras ámbar. Aquí se pide que **las sombras sean visiblemente azul lila** y que la saturación se parezca a la del dormitorio adjunto (P04), no más. Tres teles de Alba llevaban una marca de fabricante diminuta bajo la pantalla: aquí se prohíbe expresamente.

## Prompt

```text
You are going to create 10 separate photographs for a boutique hotel called Hotel Aurora. They are the photographs of one guest room, "Marea": the bedroom (two shots), the window bench (two shots), the beds (two shots), the bathroom (two shots) and the TV corner (two shots), each shot in two versions, a desktop version and a mobile version. Marea sleeps three people: one double bed and one single bed.

HOW TO DELIVER (important)
- Send each photograph as its own separate image, one after another. Never a collage, grid, diptych, contact sheet or two pictures in one image.
- Before each image, write only its file name on one line (for example: p07-marea-escritorio) and nothing else. No captions, no text, no logos and no watermark inside the images.
- If you cannot send all 10 in one reply, send as many as you can in the order below, then stop. I will write "siguiente" and you continue with the next ones, in the same order, without repeating any.

FORMAT
Images 1 and 2: portrait image, exact aspect ratio 4:5 (width : height = 4 : 5), target 2048 x 2560 px (never smaller than 1200 x 1500 px for image 1 and never smaller than 1120 x 1400 px for image 2).
Images 3 to 10: landscape image, exact aspect ratio 3:2 (width : height = 3 : 2), target 2560 x 1706 px (never smaller than 1500 x 1000 px for the desktop versions and never smaller than 1200 x 800 px for the mobile versions).
All images: highest quality available, sRGB colour, JPG or PNG, no frame, no border, no margins.

ATTACHED IMAGES
1) The main image of the hotel (the exterior at sunrise). It defines the exact visual style: reproduce its look to the letter.
2) and 3) The Alba bedroom (desktop and mobile versions): ANOTHER room of the same hotel. Same walls, beams, flagstones, linen and rush chair language. Do NOT copy its layout, its bed, its position of the window or its furniture. Marea is a different room.
Only the look and the materials are copied. The exterior itself and the Alba composition are not copied.

THE LOOK OF THE HOTEL (copy it to the letter in every image)
Low golden sun entering directly through a window, warm golden-amber light on the lit surfaces with a thin warm rim of light on edges, and long, soft, COOL BLUE-LILAC shadows. The shadows must read visibly cool, blue-lilac slate (similar to the cool shadows of the exterior image), never black, never brown, never amber, never orange, never grey. Warm off-white cream lime plaster, hand-applied, with trowel marks and fine hairline cracks. Dark chocolate-brown stained timber (beams, plank doors, shutters). Pale limestone surrounds and worn pale limestone flagstone floors. Terracotta clay in warm orange-brown. Grey-green olive foliage. A clean cornflower-blue sky and a deep calm blue sea only where they appear through a window. Split-toned grading with warm highlights and cool shadows. Moderate saturation: do not push the orange; the overall saturation must match the attached Alba bedroom, not exceed it. High clarity, crisp deep sharpness, clean fine detail, very little grain, medium-high contrast with deep warm-brown darks and soft cream highlights. A documentary photograph of a real, old, hand-built, carefully restored coastal house: not a new building, not a minimalist designer villa, not a spa, not a catalogue or magazine set.

THE ROOM: MAREA
The room of the window bench. Same house, different vibe. Its accent colour is deep indigo blue, in the linen and in the sea: an indigo linen throw, indigo cushions, one thin indigo stripe on the towels and the blanket. Its furniture is dark matte hand-forged iron (the two beds) and dark oak. Exactly two beds in the room, always the same: ONE low DOUBLE bed (about 160 cm wide) and ONE low SINGLE bed (about 90 cm wide), both with a simple low dark forged-iron frame and a low headboard of thin iron bars, never an upholstered headboard, both dressed in crumpled natural raw linen. The double bed carries a folded indigo linen throw across its foot; the single bed carries one thin indigo stripe on its blanket. Never two double beds, never a third bed, never bunk beds.
The room's signature: a masonry window bench. The south-west window sits in a one-metre-thick whitewashed lime wall; its deep rectangular recess has a flat lintel and a pale limestone surround, and holds a low whitewashed masonry bench (a built-in seat) with an indigo linen cushion, looking out to a flat, level band of deep blue sea. Dark plank shutters folded open against the thick jambs. In the afternoon the sun comes through this window from the right, low and golden, and crosses the room.
Small terracotta accent in every photograph (a clay jar, a folded wool blanket or a clay dish), less than 8% of any frame. A small clay or glass jar with a twig of olive in every photograph where it fits naturally.

ALWAYS
Rectangular openings only, with flat lintels: no arches, no vaults, no curved niches. Direct low golden sunlight visibly touching surfaces in every image. No people, no animals, no text, no logos, no brand names, no watermark.
NEVER: marble, white tile, glossy or polished surfaces, chrome, freestanding bathtub, glass shower screen, modern or minimalist furniture, upholstered catalogue sofas, upholstered headboards, cool or hazy or overcast or silver light, volumetric light rays or steam, grey-blue walls, white ceilings, panoramic windows, floating beds, toilets or bidets in the picture, lit screens, and any brand mark or badge on a television (frame, bezel and stand completely plain and unbranded).

THE 10 IMAGES, in this order

IMAGES 1 and 2: the bedroom, general view
Files: p07-marea-escritorio (image 1) and p07-marea-movil (image 2). Both 4:5 portrait.
Scene: the whole Marea bedroom from near the door. In the back wall, right third, the thick window recess with the masonry bench, the indigo cushion, the clay jar with an olive twig and the sea band. The low iron DOUBLE bed has its head against the back wall, centre-left, with raw linen, two pillows and the folded indigo throw at its foot. The low iron SINGLE bed lies along the left wall, parallel to it, head toward the back wall, seen from its foot in foreshortening, with raw linen and one thin indigo stripe on its blanket. A narrow gap of about 70 cm between the two beds with a small dark oak bedside block. Dark ceiling beams, worn pale limestone flagstones, an undyed wool rug under the double bed. A low dark oak chest at the foot of the single bed.
Sun: direct, low and golden, from the right through the window recess (south-west afternoon). A diagonal amber band crosses the bench, climbs the foot of the double bed and the indigo throw, and lays across the flagstones toward the single bed; the shadow of the window frame and of an olive branch is drawn on the lime wall. Shadows long, soft and visibly blue-lilac.
Image 1 (desktop): camera about 1.2 m, 28 mm lens, perfectly vertical verticals; both beds and the window bench clearly inside the frame, every important element inside the central 90% of the frame.
Image 2 (mobile): the same room and light, re-composed for a small vertical phone screen: closer, 35 mm; the window bench and the double bed fill the frame, the single bed is shown only as a corner at the left edge, the chest is left out; key elements inside the central 85% and the lower 40% of the frame quiet.

IMAGES 3 and 4: the window bench (the mirador)
Files: p08-marea-mirador-escritorio (image 3) and p08-marea-mirador-movil (image 4). Both 3:2 landscape.
Scene: the masonry window bench in its one-metre-thick wall, seen almost square-on. The deep rectangular recess with a flat lintel and a pale limestone surround; the thick lime jambs showing the trowel marks; the dark plank shutters folded open; the low masonry bench with an indigo linen cushion and a small second cushion in natural linen; a clay jar with an olive twig on the sill; through the window a flat, level band of deep blue sea under a clean cornflower sky. A corner of the iron double bed at the left edge, out of focus.
Sun: direct, low and golden from the right through the window: it lights the bench, the cushion and the inner jamb with a thin warm rim, and throws the long soft blue-lilac shadow of the shutter across the flagstones and the lime wall.
Image 3 (desktop): camera about 1.1 m, 35 mm lens, square-on; the window recess in the centre-right third; key elements inside the central 90%.
Image 4 (mobile): the same view closer: the bench and the window fill about 75% of the width, leave out the corner of the bed and the jar if needed; key elements inside the central 85%.

IMAGES 5 and 6: the two beds
Files: p09-marea-camas-escritorio (image 5) and p09-marea-camas-movil (image 6). Both 3:2 landscape.
Scene: a low view from the foot of the two beds, showing BOTH beds completely in the frame: the low iron DOUBLE bed on the right with crumpled raw linen, two pillows and the folded indigo throw, and the low iron SINGLE bed on the left, parallel to it, with raw linen, one pillow and one thin indigo stripe on its blanket. Between them, a narrow gap with a small dark oak bedside block and a clay jar with an olive twig. The forged-iron low headboards of thin bars against the lime wall. Pale limestone floor, a corner of an undyed wool rug.
Sun: direct, low and golden from the right: an amber band falls across the indigo throw and the linen of the double bed and reaches the single bed, with amber edges on the folds; the soft shadows are blue-lilac; the iron bars throw thin shadows on the lime wall.
Image 5 (desktop): camera about 0.8 m above the floor at the foot of the beds, 35 mm lens; both beds clearly readable as one double and one single.
Image 6 (mobile): the same view closer: both beds still completely inside the frame (the double bed about 60% of the width, the single bed about 35%), fewer small details, leave out the jar; key elements inside the central 85%.

IMAGES 7 and 8: the bathroom
Files: p28-marea-bano-escritorio (image 7) and p28-marea-bano-movil (image 8). Both 3:2 landscape.
Scene: a small bathroom seen from the doorway, with the same lime plaster walls, a dark beam and limestone flagstones. A round shallow vessel basin of pale hand-carved limestone, resting on a thick dark oak slab fixed to the wall, with one tall, simple aged-copper tap rising from the slab; a rectangular mirror with a thin dark forged-iron frame that reflects only sunlit lime wall. A small rectangular window with a flat lintel in the right wall, its dark plank shutter open, showing a flat band of deep blue sea. A walk-in shower alcove in lime plaster at floor level with a simple round aged-copper shower head, no screen and no door. Dark forged-iron hooks with a raw linen towel with exactly one thin indigo stripe on its edge. A raw cotton bath mat with one thin indigo stripe at each end. A small terracotta clay jar with an olive twig.
Sun: direct, low and golden from the right through the small window: a diagonal amber band crosses the wall behind the basin, edges the limestone bowl and the copper tap with a thin warm rim, and touches the flagstones; the shadow of an olive branch is on the lime. Shadows long, soft and visibly blue-lilac.
Image 7 (desktop): camera about 1.3 m at the doorway, 28 mm lens, perfectly vertical verticals; the whole bathroom; key elements inside the central 90%.
Image 8 (mobile): the same bathroom and light, re-composed for a phone: closer, 35 mm; the basin, the window and the sun band fill about 70% of the width; the shower only hinted at the edge; leave out the towel hooks and the jar; key elements inside the central 85%.

IMAGES 9 and 10: the TV corner
Files: p29-marea-tv-escritorio (image 9) and p29-marea-tv-movil (image 10). Both 3:2 landscape.
Scene: the wall facing the beds. A deep rectangular recess in the thick lime wall, with a flat lintel and a pale limestone surround and NO doors, holding a switched-off television of moderate size (less than half the width of the opening), matte black, no reflections, no cables, no soundbar, no remote, and above all NO logo, NO brand name, NO badge and no stand: the frame and the bottom edge of the screen completely plain. Below the recess a low whitewashed masonry bench with two indigo linen cushions and a small dark oak shelf with a clay jar and an olive twig. In the foreground, at the bottom-left corner, only the foot end of the low iron single bed with its raw linen. A dark beam above and worn pale limestone flagstones.
Sun: direct, low and golden from the right (the window is outside the frame): an amber band crosses the flagstones and climbs the bench and the cushions, and brushes the lime wall beside the recess with the shadow of an olive branch. The recess with the screen stays in soft blue-lilac shade on purpose: the sun never touches the screen, so there is no glare.
Image 9 (desktop): camera about 1.2 m, 28 mm lens, two-point perspective, perfectly vertical verticals; the recess in the centre-left third; key elements inside the central 90%.
Image 10 (mobile): the same corner re-composed for a phone: 35 mm, closer; the recess and the bench centred and filling about 65% of the width, the foot of the bed left out; key elements inside the central 85%.

FINAL CHECK before sending each image: exactly one double bed and one single bed wherever beds appear; indigo accents; sun visibly touching surfaces; shadows visibly cool blue-lilac; warm cream lime walls; dark timber; no arches; the television, if present, switched off and without any brand mark; no marble, no white tile, no chrome, no glass; saturation equal to the attached Alba bedroom, colours and light consistent with the attached main image.
```
