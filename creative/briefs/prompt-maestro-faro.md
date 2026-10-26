# Prompt maestro de Faro: 12 imágenes en un solo prompt

> Para ChatGPT. Faro completo: salón (general y zona de TV), dormitorio principal, segundo dormitorio, baño y azotea, cada toma en versión escritorio y móvil, **12 imágenes separadas**.
> Adjunta en este orden: **1) `creative/approved/p01-hero-escritorio.jpg`** (fija el aspecto y el color de las sombras), **2) `creative/approved/p04-alba-escritorio.jpg`** y **3) `creative/approved/p04-alba-movil.png`** (otra habitación de la misma casa: solo materiales y lenguaje del mobiliario).

## Habitación (decisión de la persona, 2026-10-09)
**Faro, "La torre": mini apartamento de 74 m² para 4 personas**, con salón y zona de TV, dormitorio principal con **una cama doble baja**, segundo dormitorio con **dos camas individuales bajas**, baño y una pequeña azotea mirador privada. Es la más cara y la más exclusiva (296 € de ejemplo), con aire VIP pero **dentro de la misma casa vieja restaurada**: más piedra y vigas más gruesas, nunca un ático de lujo moderno. Todas las habitaciones pueden pedir cama para mascota o cuna de bebé sin coste adicional (se dice en la web, no se dibuja aquí).

## Archivos que debe devolver (renómbralos así al subirlos)
| # | Archivo | Proporción | Objetivo | Mínimo |
|---|---|---|---|---|
| 1 | `p13-faro-salon-escritorio` | 4:5 | 2048 × 2560 | 1200 × 1500 |
| 2 | `p13-faro-salon-movil` | 4:5 | 2048 × 2560 | 1120 × 1400 |
| 3 | `p34-faro-tv-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 4 | `p34-faro-tv-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 5 | `p14-faro-dormitorio-doble-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 6 | `p14-faro-dormitorio-doble-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 7 | `p15-faro-dormitorio-individuales-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 8 | `p15-faro-dormitorio-individuales-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 9 | `p32-faro-bano-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 10 | `p32-faro-bano-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 11 | `p33-faro-azotea-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 12 | `p33-faro-azotea-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |

## Supuestos de diseño (ficticios; confirmar antes de publicar)
**Dos datos por confirmar antes de publicar: la azotea mirador privada y el reparto de camas** (una doble en el dormitorio principal y dos individuales en el segundo). Además: el baño con pila de arenisca, un solo grifo y ducha de obra a ras de suelo, tres huecos rectangulares alineados en el muro grueso del salón (puerta al dormitorio, ventana alta y estrecha, hueco de la tele sin puertas), ventanas altas y estrechas con vista al mar, sol del suroeste desde el mediodía hasta la puesta (11:30 a 20:50) entrando por la derecha (los rayos viajan de derecha a izquierda; la ventana queda fuera de plano, salvo la del baño, que se ve al fondo), la mesilla del dormitorio principal a la derecha de la cama (el lado del sol) y una lámpara pequeña de latón con pantalla de cúpula de vidrio acanalado (guiño contenido al faro; se evita pedir «lente de faro» porque la IA la dibuja como kitsch). Nada de kitsch náutico. En la web no se afirma Smart TV, plataformas, ducha de lluvia ni pulgadas; las camas y los 74 m² figuran en `PRODUCT.md` como datos ficticios de portfolio; la azotea y la lámpara también lo son, pero aún no figuran allí (añadirlas al confirmar).

## Lo que se corrige respecto a Alba y Marea (lecciones de las fotos recibidas)
Las fotos anteriores salieron más naranjas y saturadas que la imagen principal (0,4 a 0,6 frente a 0,23), con sombras ámbar o marrón, suelo brillante o picado (se queda así en Marea por decisión de la persona; aquí hay un bloque propio `THE FLOOR`, una prohibición en `NEVER` y una línea en la comprobación final, también para el baño y la azotea), mármol en las paredes, teles de unos 70 % del hueco con una marca diminuta en el marco, dobles rayas y dobles grifos. Aquí se fijan **números y colores** (sombras gris lila de unos RGB 150, 140, 165; saturación media de unos 0,27 a 0,33; tele de un 40 % del hueco con el marco inferior liso), **una sola dirección de luz por imagen** (ventana a la derecha, fuera de plano salvo en el baño; el sol cae hacia la izquierda), lista cerrada de objetos, cuenta exacta de camas, materiales descritos en positivo y una composición móvil propia con porcentajes. ChatGPT suele entregar 1536 × 1024 en 3:2: se acepta, se compone con margen y el reescalado va en el pipeline.

## Prompt

```text
Create 12 separate photographs for the boutique hotel Hotel Aurora: the 74 m2 apartment "Faro" for 4 guests (only a name: no lighthouse anywhere), six shots, each in a desktop and a mobile version.

HOW TO DELIVER
- Each photograph as its own separate image, never a collage, grid or two pictures in one.
- Before each image write only its file name on one line.
- If you cannot send all 12 in one reply, send as many as you can in order; I will write "siguiente" and you continue without repeating.

FORMAT
Images 1-2: portrait, exact ratio 4:5, target 2048 x 2560 px (never below 1200 x 1500 for image 1, 1120 x 1400 for image 2). Images 3-12: landscape, exact ratio 3:2, target 2560 x 1706 px (never below 1500 x 1000 desktop, 1200 x 800 mobile). If you cannot reach the target, deliver your largest exact-ratio size (e.g. 1536 x 1024 for 3:2), never upscaled. Highest quality, sRGB, no frame.
Composition: desktop: 28 mm, vertical verticals, key elements inside the central 90%. Mobile: its OWN closer, simpler composition (35 mm, a new camera position, never a crop of its desktop twin), key elements inside the central 85%, at most 15% bare floor at the bottom, same colour grade, saturation and shadow tint as its desktop twin. What a mobile line leaves out ("no jar", "no rug") is also dropped from its Sun line.

ATTACHED REFERENCES (do not deliver them)
REFERENCE 1: the main image of the hotel: it fixes the look, above all the COLOUR OF THE SHADOWS and the restraint of the colours. REFERENCES 2 and 3: the Alba bedroom, another room of the same hotel: copy ONLY its materials and furniture language, NOT its colour grade, warm shadows, layout, bed, window or door.

THE LOOK OF THE HOTEL (copy it to the letter in every image)
Low golden sun entering directly through windows, warm only on the lit surfaces with a thin warm rim on edges, and long, soft, COOL BLUE-LILAC shadows like the shaded gravel of reference 1. What the sun does not touch is lit only by the blue sky, so it reads pale grey-lilac: shaded plaster about RGB 150,140,165, deepest shadow about 95,100,125, blue never below red. Never brown, tan, amber, orange or ochre: shadows are the coolest thing in the frame, a clear hue jump from golden sun to lilac shade beside every sun patch. Saturation low, mean about 0.27 to 0.33 and below the Alba bedroom: sunlit plaster pale cream (at most RGB 241,219,191), never peach or orange.
Materials, all matte and dry: hand-trowelled lime plaster with shallow trowel ridges and rare hairline cracks (no veins, no marbling); dark brown matt unvarnished oak; floors: see THE FLOOR; thick flat undyed wool rug, no loop weave; plain smooth flat-woven linen, soft wrinkles only (no quilting, emboss, crackle, plaster grain, fringe, pattern or marks like writing); rough-cut pale sandstone (arenisca); aged matte brass; small metal parts dark forged iron, never silver.
A documentary photograph of a real, old, restored coastal house with uneven walls; not a luxury penthouse, spa or catalogue set.

THE FLOOR (important)
Every indoor floor, the bathroom's included, is old, worn, DRY and completely MATTE pale limestone: large irregular rectangular slabs (about 60 x 40 to 90 x 50 cm) laid in loose rows with thin hairline joints, softly chipped edges and gentle wear, like the floor of references 2 and 3 but flatter and drier. The rooftop terrace is paved with the same kind of slabs in pale sandstone, under every rule below. The surface is smooth and flat with only fine grain, a few tiny pores and rare hairline cracks, like dusty, sun-baked stone with a matte sanded finish. Absolutely NO gloss, shine or polish; NO wet look; NO mirror-like highlights or reflections of windows, sky, beds or furniture; no glaze, varnish or epoxy. NO pitted, bubbled, pebbled, hammered, pimpled or dotted texture; NO stamped or cobble relief; NO mosaic, terrazzo or pebble pattern; NO regular grid of small identical square tiles; NO dense crazed network of cracks. Sun patches on the floor are warm, flat and matte with no specular hotspots; the shaded floor is cool pale lilac-grey.

THE APARTMENT: FARO
The most exclusive apartment yet the same old house, with MORE and THICKER stone and beams (walls about 70 cm thick, heavy beams). Hook: a small aged-brass bedside lamp (25 cm, always off) with a small dome shade of fluted glass, an ordinary old lamp, never a lighthouse or ship's lamp. Windows: tall narrow rectangular (50 cm wide, 150 cm tall, flat lintel, shutters open) showing a flat level band of deep blue sea; a window in view is never a source of sun or glare. Nothing else nautical: no anchors, ropes, ship wheels, life rings, sailor stripes or lighthouse models. Bedside block = a small solid dark oak cube table (about 40 cm), no drawer or handle.
Beds: main bedroom ONE low DOUBLE bed (about 160 cm wide); second bedroom TWO identical low SINGLE beds (each about 90 cm wide, one sleeper); dark oak, low frame, low plank headboard (never upholstered), smooth sand raw linen. Never two doubles, a third bed, bunk, daybed or sofa bed, a double in the second bedroom or singles in the main one.
Sun from the south-west, low, golden, from the right, rays travelling right to left; any window not shown is in the right wall, outside the frame. The small clay jar with an olive twig (terracotta, under 8% of any frame) appears only where a scene names it.

ALWAYS
Rectangular square-cornered openings with flat lintels only (no arches, vaults, rounded corners, curved niches). No people, animals, text, logos, brand names or watermark. Any TV: small (about 40% of its opening), off, plain unmarked bezel. ONLY the objects named in a scene (no pictures, books, bowls, soap, bottles, extra vases, plants or lamps).
NEVER: marble, white tile, glossy or polished surfaces (floors above all, bathroom and rooftop too), chrome, a second spout or any valve plate, freestanding bathtub, glass shower screen, upholstered catalogue sofas, floating beds, toilets or bidets, lit screens, hazy or overcast light, volumetric rays, steam, grey-blue walls, white ceilings, any mark on a television.

THE 12 IMAGES, in this order

IMAGES 1 and 2: living room, general view
Files: p13-faro-salon-escritorio (image 1) and p13-faro-salon-movil (image 2), 4:5.
Scene: seen from the entrance, dark beams above. In the thick end wall, three rectangular openings in a row on one flat lintel line, pale sandstone surrounds: left a doorway, its plank door folded back out of sight, glimpsing the foot of the main bedroom's ONE low double bed in sand linen; centre a tall narrow window with the sea band; right a deep square-cornered TV opening with a small switched-off TV. Along the left wall a low L-shaped whitewashed bench with raw linen cushions instead of a sofa; before it a low dark oak table with a clay jar with an olive twig; at right two golden-rush armchairs; undyed wool rug. The sun enters through identical tall windows in the right wall, outside the frame.
Sun: a soft golden band crosses floor and rug, climbs the table and cushions and lands on the left wall with an olive-branch shadow; raking light makes the sandstone glow; the doorway and TV opening stay lilac.
Image 1 (desktop): openings in the upper half; floor at most 20%.
Image 2 (mobile): frontal; the window and doorway lintels at 20% from the top; bench corner at left, low table in the centre and ONE whole armchair at right, all inside the central 70% of the width; no TV opening, second armchair, jar or olive-branch shadow.

IMAGES 3 and 4: living room, TV corner
Files: p34-faro-tv-escritorio (image 3) and p34-faro-tv-movil (image 4), 3:2.
Scene: the right-hand TV opening of the end wall: a deep square-cornered rectangular opening, flat lintel, sandstone surround, NO doors, with a small switched-off TV fixed flat to its back wall: matte black, about 40% of the opening width, at least 25% of bare lime on each side; no stand, cables, soundbar or reflections; the frame and lower bezel are plain uniform matte black with nothing printed, embossed or lit (no wordmark, badge, LED, sensor, notch or centre foot). Right of it two dark oak open shelves on plain square sandstone brackets holding only the small brass lamp and a clay jar with an olive twig. Foreground: the end of the L-shaped bench with one sand linen cushion.
Sun: from the right, raking: band over floor and cushion, grazing the surround and shelves; the opening stays lilac, the sun never touches the screen.
Image 3 (desktop): two-point perspective, the TV opening in the centre-left third.
Image 4 (mobile): frontal; the opening with its TV, and the shelves, fill about 70% of the width; no bench or jar.

IMAGES 5 and 6: main bedroom
Files: p14-faro-dormitorio-doble-escritorio (image 5) and p14-faro-dormitorio-doble-movil (image 6), 3:2.
Scene: ONE low DOUBLE bed (about 160 cm wide), head against the thick end wall, centred, exactly two pillows, a folded sand linen throw across the foot. Beside it on the camera's right (the sun side) ONE dark oak bedside block with the small brass lamp and a small clay jar with an olive twig. Heavy beam above; undyed wool rug under the foot.
Sun: from the right: band over floor and rug, up the foot of the bed to the bedside block and lamp; olive-branch shadow on the end wall above the headboard.
Image 5 (desktop): from the foot of the bed; at least 10% of bare wall each side of the bed-and-block pair.
Image 6 (mobile): frontal; bed and bedside block fill about 75% of the width, headboard top at 30% from the top, heavy beam only across the top edge; no rug.

IMAGES 7 and 8: second bedroom
Files: p15-faro-dormitorio-individuales-escritorio (image 7) and p15-faro-dormitorio-individuales-movil (image 8), 3:2.
Scene: TWO identical low SINGLE beds (each about 90 cm wide, one sleeper), side by side, parallel, heads against the thick end wall, headboards of equal size, exactly ONE pillow each, a plain folded sand blanket at each foot. Between them ONE small dark oak bedside block with a clay jar with an olive twig. Heavy beam above. BOTH beds completely in frame.
Sun: from the right: band across the right bed, block and jar, reaching the left bed's pillow.
Image 7 (desktop): camera at the foot of the beds, 0.9 m above the floor; beds and block fill about 70% of the width.
Image 8 (mobile): both beds, fully in frame, fill about 78% of the width; no jar, no beam.

IMAGES 9 and 10: bathroom
Files: p32-faro-bano-escritorio (image 9) and p32-faro-bano-movil (image 10), 3:2.
Scene: a bathroom seen from inside the doorway (no door leaf or knob). Back wall: at left a walk-in shower alcove flush with the floor (same flagstones, no step, kerb or drain strip), no screen or door, dry, with ONE round flat aged-brass rain head; at right the tall narrow window with the sea band and a clay jar with an olive twig on its sill. Left wall, receding at an angle: a thick planed dark oak slab on two forged-iron brackets, a wide shallow rectangular pale sandstone basin resting on it (about 90 cm long, at most 12 cm deep); above it exactly ONE plain aged-brass spout, centred, and no other tap, spout, valve plate, lever or handle on that wall; no mirror. One raw linen towel on one brass hook beside the basin, with ONE terracotta band 1.5 cm wide near its hem, not a pair.
Sun: through the tall window, low from the right: a band crosses the floor and lands on the left wall, rim-lighting the sandstone and the brass spout, with an olive-branch shadow; the back wall has no sun patch; the alcove stays lilac.
Image 9 (desktop): camera inside the doorway, back wall facing you, the left wall receding at the left edge; whole window in frame.
Image 10 (mobile): facing the left wall squarely: slab, basin, spout and sun band fill about 70% of the width; no shower, window, jar or olive-branch shadow; the window is just outside the right edge, where the sun band enters.

IMAGES 11 and 12: rooftop terrace
Files: p33-faro-azotea-escritorio (image 11) and p33-faro-azotea-movil (image 12), 3:2.
Scene: the small private rooftop terrace: a low thick lime parapet about 90 cm high, flat top (no arches, railing or glass), floor of large matte pale sandstone slabs, a small dark oak table and two golden-rush chairs, a clay jar with an olive twig on the table. Beyond the parapet a flat, level band of deep blue sea under a clean cornflower sky. No parasol, pergola, loungers, cushions or plants.
Sun: soft, mild, golden evening sun, low (15 to 20 degrees), from the right, side-on, never harsh, overhead or hazy: it edge-lights chairs, table and parapet and lays long, soft, visibly cool blue-lilac shadows to the left.
Image 11 (desktop): level horizon at 40% from the top; table and chairs in the left-centre third.
Image 12 (mobile): table and chairs centred, filling about 60% of the width; horizon at 35% from the top; no jar.

FINAL CHECK before sending each image: exact bed count (ONE double in the main bedroom, also the one glimpsed from the living room; TWO identical singles in the second; no other bed); sun visibly touching surfaces from ONE direction; shadows cool blue-lilac, never brown or tan; saturation mean 0.27 to 0.33; every floor, bathroom and rooftop too, worn, matte, dry limestone slabs (sandstone on the rooftop) with no gloss, no reflections and no pitted, pebbled, stamped, small-tile or crazed texture; every TV off, small, plain unmarked bezel; ONE brass spout and no other fitting on its wall; only named objects; nothing nautical; no arches, people or text.
```
