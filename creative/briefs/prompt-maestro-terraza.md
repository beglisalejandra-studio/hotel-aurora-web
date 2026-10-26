# Prompt maestro de Terraza: 10 imágenes en un solo prompt

> Para ChatGPT. Terraza completa ("El cañizo"): dormitorio, terraza, las dos camas, baño y zona de TV, cada toma en versión escritorio y móvil, **10 imágenes separadas**.
> Adjunta en este orden: **1) `creative/approved/p01-hero-escritorio.jpg`** (fija el aspecto), **2) `creative/approved/p04-alba-escritorio.jpg`** (otra habitación de la misma casa: solo sus materiales) y **3) `p03-patio-escritorio.jpg`** (copia en JPG de `creative/approved/p03-patio-escritorio.webp`; el patio al que da la terraza).
> **Aviso sobre la 3:** en el repositorio el patio está guardado como WebP (`p03-patio-escritorio.webp`) y ChatGPT debe recibirlo como **JPG**. Ya está convertido (`p03-patio-escritorio.jpg`, 2560 × 1706) y se envía junto al prompt; el prompt lo llama así.

## Habitación (decisión de la persona, 2026-10-09)
**Dos personas en dos camas individuales idénticas** (camas de obra, bajas, de cal encalada). Mismo precio de ejemplo que Alba (168 €). Color de acento: verde oliva y barro. Se abre al este por una puerta de tablones a una **terraza privada** cubierta de caña partida (cañizo) sobre el patio interior, con un banco de obra para tomar el sol (la «cama de día» del concepto: **no es una cama**, sin almohada ni mantas), ducha de obra al aire libre y **sol suave, bajo y dorado** (regla de la persona: nunca duro, nunca cenital). Todas las habitaciones pueden pedir cama para mascota o cuna sin coste adicional (se dice en la web, no se dibuja aquí).

## Archivos que debe devolver (renómbralos así al subirlos)
| # | Archivo | Proporción | Objetivo | Mínimo |
|---|---|---|---|---|
| 1 | `p10-terraza-escritorio` | 4:5 | 2048 × 2560 | 1200 × 1500 |
| 2 | `p10-terraza-movil` | 4:5 | 2048 × 2560 | 1120 × 1400 |
| 3 | `p11-terraza-exterior-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 4 | `p11-terraza-exterior-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 5 | `p12-terraza-camas-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 6 | `p12-terraza-camas-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 7 | `p30-terraza-bano-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 8 | `p30-terraza-bano-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 9 | `p31-terraza-tv-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 10 | `p31-terraza-tv-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |

ChatGPT suele entregar 1536 × 1024 en 3:2 y unos 1122 × 1402 en 4:5. El prompt acepta ese máximo en proporción exacta y prohíbe recortar, estirar o reescalar; cualquier mejora de tamaño se hace después en el pipeline, no en ChatGPT.

## Supuestos de diseño (ficticios; confirmar antes de publicar)
Que la puerta de la habitación y la terraza miren al este (sol bajo del este-sureste, unos 35° de altura, de 8:00 a 10:30, filtrado por el cañizo; a las 12:00 ya no vendría del este), que la terraza tenga un pretil bajo de obra sobre el patio de la referencia 3 (de ella solo se copian el olivo y la puerta de tablones, no su pavimento de juntas de guijarros y losas picadas), un banco solárium de obra (no es una cama: 45 cm de alto, 60 de fondo, con una esterilla fina de lino y sin almohada), mesa baja de roble con una jarra y un vaso (sin olivo en maceta: se quitó para no sobrecargar la toma) y ducha de obra exterior sin mampara; que el baño tenga, en el muro norte, una encimera de obra con pila excavada y cesta de junco (sin jarrón), la ventana pequeña al patio en el muro este (no al mar, y **sin espejo**, para evitar reflejos imposibles) y la ducha de obra en el muro oeste; que la tele esté empotrada en un hueco del muro sur (el de los pies de las camas; sin cama a la vista en las dos tomas), tapada a medias por un panel rígido de caña colgado de un carril (en la web se sigue llamando «panel corredizo»). «Toalla a rayas oliva» se pide como **una sola raya** oliva. En la web no se afirma Smart TV, plataformas, ducha de lluvia ni pulgadas. Las dos camas individuales y el sol de mañana son datos ficticios de portfolio, declarados en `PRODUCT.md`; la terraza privada, el banco solárium y la ducha exterior son decisiones de la persona que aún no figuran ahí (añadirlas antes de publicar).

## Lo que se corrige respecto a Alba y Marea (lecciones de las 18 fotos recibidas)
- **Color:** salieron con saturación 0,41 a 0,61 frente a 0,24 de la imagen principal, y con sombras ámbar. Aquí se piden **cifras** (saturación media 0,27 a 0,33, sombras lila gris hacia RGB 150,140,165) y se dice que el dormitorio adjunto (referencia 2) es el techo y que solo se copian sus materiales, no su color.
- **Teles:** una marca diminuta bajo la pantalla y un saliente en el marco aparecieron en cinco de seis teles, y eran del 68 al 70 % del hueco. Aquí: tele pequeña (40 % del hueco), marco inferior liso, sin muesca, sin sensor, sin peana.
- **Una dirección de sol por imagen**, con el hueco fuera de encuadre (salvo la puerta y la ventana del baño, que se ven pero cuyo muro no recibe sol), y el sol nunca toca una pantalla.
- **Suelo (regla permanente, 2026-10-09):** el suelo de Marea salió brillante, mojado y con textura picada y la persona decidió dejarlo. Aquí hay un bloque propio `THE FLOOR` (losas grandes de caliza gastada, mate y seca, sin reflejos, sin textura picada ni red de grietas), una prohibición en `NEVER` y una línea en la comprobación final; vale también para el dormitorio, el baño, la terraza y el suelo seco de las dos duchas.
- **Materiales:** nada de mármol, vetas ni grietas naranjas; suelo mate, seco y sin brillo; lino plano sin relieve ni marcas parecidas a letras; grifo único (un solo caño y nada más en su pared); **una sola raya** por toalla y manta; lista cerrada de objetos por imagen.
- **Móvil:** composición propia con porcentajes y listas de lo que se quita (y lo que se quita tampoco aparece en su línea de sol), para que no sea un recorte del escritorio.
- **Geometría (revisión 2026-10-10):** el sol viene del este-sureste para que pueda llegar al muro norte de la habitación y del baño (un sol justo del este sería paralelo a ese muro) y no ilumina el muro sur de la tele; no hay cama en las tomas de la tele (no se ve una cama sin ver la otra); «rayas» queda solo para toalla y manta, y la luz del cañizo se pide como líneas onduladas de luz (para que no salgan persianas); «opening» de esquinas rectas en vez de «recess» (se leería arco) y panel rígido en vez de «sliding panel» (se leería cortina); las medidas de cámara son alturas.

## Prompt

```text
Create 10 separate photographs for Hotel Aurora, a boutique hotel: the guest room "Terraza" (the split-cane room) for two people in TWO SINGLE BEDS; five shots, each in a desktop and a mobile version.

HOW TO DELIVER (important)
- Send each photograph as its own separate image, one after another, never a collage, grid or two pictures in one. Before each, write only its file name on one line, no captions.
- If you cannot send all 10 in one reply, send as many as you can in order; I will write "siguiente" and you continue.

FORMAT
Images 1-2: portrait, exact ratio 4:5, target 2048 x 2560 px (never below 1200 x 1500; image 2: 1120 x 1400).
Images 3-10: landscape, exact ratio 3:2, target 2560 x 1706 px (never below 1500 x 1000 desktop, 1200 x 800 mobile). If your maximum is smaller (e.g. 1536 x 1024), deliver it in the exact ratio, never cropped, stretched or upscaled. Best quality, sRGB, JPG or PNG, no border.

ATTACHED REFERENCES (do not deliver them)
REFERENCE 1: the hotel's main image (exterior at sunrise): copy its light, shadow colour and restraint to the letter.
REFERENCE 2: the Alba bedroom, ANOTHER room: copy ONLY its materials, never its layout, bed, window, door, rug, lamp, chair, shadow colour or saturation.
REFERENCE 3: the hotel courtyard below the terrace: copy ONLY its olive tree and plank door as seen beyond the parapet, never its paving (pebble joints, pitted slabs).

THE LOOK (copy it to the letter in every image)
Low, soft, gentle golden morning sun, never hard: warm gold only on lit surfaces. What the sun misses is lit by the blue sky, so SHADES READ VISIBLY COOL BLUE-LILAC: shaded plaster pale grey-lilac (about RGB 150,140,165), deepest shadows about RGB 95,100,125, blue at least as high as red in every shade, a clear hue jump from gold to lilac beside every sun patch; never brown, tan, beige, amber or orange. Saturation mean about 0.27 to 0.33, below reference 2; sunlit plaster pale cream (RGB 241,219,191 at most), never peach or orange; terracotta is the only orange.
Materials: matte hand-trowelled lime with trowel ridges and 3 or 4 thin grey hairline cracks on the walls only; dark brown matt aged oak, plank doors and shutters; floors: see THE FLOOR; smooth flat-woven undyed linen, soft wrinkles only (no crackle, trowel texture, emboss, quilting, pattern, fringe, pile, sheen or writing-like marks); hinges and hooks dark forged iron; copper fittings dull, dark and aged, never shiny orange; nothing silver or chrome.
A documentary photo of a real, old, restored coastal house, never a catalogue set.

THE FLOOR (important: a previous room went wrong here, do not repeat it)
Every floor (bedroom, bathroom, terrace, and inside both shower alcoves) is old, worn, DRY and completely MATTE pale limestone: large irregular rectangular slabs (about 60 x 40 to 90 x 50 cm) laid in loose rows with thin hairline joints, softly chipped edges and gentle wear, like the floor of reference 2 but flatter and drier. The surface is smooth and flat with only fine grain, a few tiny pores and rare hairline cracks, like honed, dusty, sun-baked stone. Absolutely NO gloss, shine or polish; NO wet look; NO mirror-like highlights or reflections of windows, sky, beds or furniture; no glaze, varnish or epoxy. NO pitted, bubbled, pebbled, hammered or pimpled texture; NO stamped or cobble relief; NO mosaic, terrazzo or pebble pattern; NO regular grid of small identical square tiles; NO dense crazed network of cracks. Sun patches on the floor are warm, flat and matte with no specular hotspots; the shaded floor is cool pale lilac-grey.

THE ROOM: TERRAZA
Accents: olive green and clay. Exactly TWO beds, IDENTICAL narrow one-person SINGLES: each a low whitewashed lime masonry base built into the room (90 x 200 cm, 40 high, square edges, no legs, drawers or headboard), raw linen mattress, crumpled undyed linen, ONE pillow, a folded grey-green linen throw across the foot with ONE thin darker-olive stripe (about 1.5 cm) along its edge, never two. Parallel, 60 cm apart, a small dark oak bedside block (35 x 35 cm, 40 high) between them with a clay jar and an olive twig. Never a double bed, a third bed, a daybed, bunk beds or an upholstered, iron or timber bed; the terrace ledge is a bench, not a bed.
Layout: bed heads on the north wall; the open plank door (two dark plank leaves, flat lintel) is in the EAST wall, onto a private terrace. The sun always comes from the east, a little south of east, about 35 degrees high (facing north: from the right, a little behind you); each image says which side of the frame. Camera figures in metres are heights above the floor.
The terrace: a flat roof of split cane (thin half-round reeds in slightly uneven rows tied with wire) on dark timber rafters, beam and square posts, and a low plastered parapet (90 cm, limestone coping) above the courtyard. CANE LIGHT: the soft golden morning sun, good for sunbathing, is filtered by the cane into thin, wavy, irregular, soft-edged lines of gold about a finger wide with pale lilac shade between them; never hard, overhead, black bars, venetian-blind slats or a regular grid; under the roof the shade stays pale grey-lilac, never brown.

ALWAYS: perfectly vertical verticals; rectangular openings with flat lintels only (no arches, vaults or curved niches); direct low golden sun visibly touching surfaces; a small terracotta accent under 8% of the frame; no people, animals, text, logos, brand names or watermark. Desktop images keep key elements inside the central 90%; each mobile image is its own closer, simpler composition (never a crop of the desktop one) with key elements inside the central 85%, a quiet lower part and at most 15% floor. The ONLY objects are those listed for each image: no pictures, books, lamps, bowls, soap, bottles, rugs or door knobs.
NEVER: marble, white tile, glossy or polished surfaces (above all floors: glossy, wet-looking, reflective, pitted, bubbled, pebbled, stamped, small-tiled or crazed floors), chrome, a second spout or valve plate, curtains, toilets, hazy or overcast light, volumetric rays, lit screens, any mark on a television.

THE 10 IMAGES, in this order

IMAGES 1 and 2: the bedroom (4:5)
Files: p10-terraza-escritorio (image 1), p10-terraza-movil (image 2).
Scene: the TWO identical single beds, heads on the north wall, bedside block and jar between them. In the east wall the open plank door, leaves folded back flat against the wall; through it the terrace: bright soft cane light, the cane roof, a hint of olive foliage. Dark beams.
Sun: from the east through the open door, the RIGHT of the frame: a soft golden patch with a few faint cane-light lines crosses the floor, climbs the linen and olive throw of the EAST bed (the one nearest the door) and touches the lower north wall; the west bed stays mostly in cool lilac shade.
Image 1 (desktop): camera in the south-west corner, 1.2 m, 28 mm, looking north-east: west bed at left, east bed in the centre, both completely inside the frame from 6% to 62% of the width; the door from 66% to 92%.
Image 2 (mobile): camera at the beds' foot, 0.9 m, 35 mm, looking north, east on the right: the beds from 8% to 72% of the width; the east wall seen at a slant along the right edge, the open door a narrow strip at 76% to 92% with soft cane light beyond; leave out beams, jar and twig.

IMAGES 3 and 4: the terrace (3:2)
Files: p11-terraza-exterior-escritorio (image 3), p11-terraza-exterior-movil (image 4).
Scene: the terrace seen from its south end, looking north. Left (west): the room's lime wall with the open door leaves folded back and, along it, the low built-in masonry sunbathing ledge, a bench and not a bed (whitewashed, 45 cm high, 60 cm deep, 190 cm long) with ONE thin raw linen pad, no pillow, no blanket. Right (east): the parapet and, beyond, the courtyard's olive crown and plank door. A low dark oak table just in front of the ledge's near end with ONE unglazed clay jug and ONE plain glass. Desktop only: at the far end of the left wall an outdoor shower, a plastered alcove flush with the floor, ONE round aged-copper rain head, no screen or door, dry.
Sun: from the east, the RIGHT of the frame, over the parapet and through the cane roof: cane light across the floor, ledge, linen and left wall (and the table in image 3).
Image 3 (desktop): camera 1.3 m, 28 mm; ledge along the left wall (left third), table left of centre in front of it, shower small at the far end of the left wall (about 40% of the width), parapet and courtyard at right; roof in the top 20%.
Image 4 (mobile): camera 1.0 m, 35 mm, at the south end close to the ledge, looking north: the ledge along the left from 8% to 68% of the width with the cane light across its linen; parapet and olive crown at right from 72% to 92%; roof in the top 20%; leave out table, jug, glass, shower and door.

IMAGES 5 and 6: the two single beds (3:2)
Files: p12-terraza-camas-escritorio (image 5), p12-terraza-camas-movil (image 6).
Scene: a low view from the beds' foot, looking north, BOTH beds completely in frame: exactly TWO IDENTICAL single beds, left and right, with the oak bedside block, clay jar and olive twig in the 60 cm gap. Heads on the lime wall; limestone floor in front.
Sun: from the east, the RIGHT of the frame (door outside it): it crosses the floor and the right (east) bed's linen and throw and softly reaches the left bed's foot.
Image 5 (desktop): camera 0.8 m, 35 mm; the pair across the central 70% of the width with bare wall each side; both bases the same width.
Image 6 (mobile): camera 0.6 m, 35 mm: the pair from 10% to 90% of the width (each bed 30%, gap 20%); wall in the top 35%, beds in the middle 50%, quiet floor in the bottom 15%; leave out the jar, twig and any cane light.

IMAGES 7 and 8: the bathroom (3:2)
Files: p30-terraza-bano-escritorio (image 7), p30-terraza-bano-movil (image 8).
Scene: a small bathroom seen from inside, facing the back (north) wall (no door in view). On the back wall a built-in plastered masonry counter (150 x 85 cm) with ONE shallow basin hollowed into its top in the same pale lime; under it an open rectangular space with ONE woven rush basket. ONE aged-copper spout above the basin and nothing else on that wall: no second plate, valve, handle or lever. NO mirror. A linen towel with ONE olive stripe on ONE iron hook on the back wall left of the counter. In the east (right) wall a small rectangular window, flat lintel, open dark plank shutter, showing the courtyard olive crown and cornflower sky. In the west (left) wall, seen at a slant, a walk-in shower alcove of rough lime, flush with the floor (no step, kerb or drain strip), ONE round aged-copper rain head, no screen or door, dry.
Sun: from the east through the small window, the RIGHT of the frame: a soft low golden band crosses the floor and the back wall behind the basin, rims the counter and spout, with an olive-branch shadow on the lime.
Image 7 (desktop): camera 1.3 m, 28 mm; counter centre-left, window upper right, shower fully visible at left.
Image 8 (mobile): camera 1.0 m, 35 mm; the counter (with the basin in its middle) about 40% of the width, from 26% to 64%; towel and hook at 12% to 24%; the whole window (lintel, jambs, shutter) inside, upper right, at 66% to 90%; leave out the shower and the basket.

IMAGES 9 and 10: the TV corner (3:2)
Files: p31-terraza-tv-escritorio (image 9), p31-terraza-tv-movil (image 10).
Scene: the south wall (camera facing south, no bed). A deep rectangular opening cut into the thick lime wall: 110 cm wide, 90 cm high, 40 cm deep, square corners, flat lintel, pale limestone surround. Inside, flat on the back plaster, ONE SMALL switched-off television, matte black, about 40% of the opening width, centred, bare plaster each side. In front of it a rigid flat panel of split cane (horizontal reeds) in a slim dark oak frame, hung from a dark iron rail like a shutter: not a curtain, no folds. It covers exactly the RIGHT half of the opening and so the right half of the screen; the left half stays plain matte black. The lower bezel is one uniform matte-black strip with nothing printed, embossed or lit on it: no wordmark, badge, LED, sensor, notch or stand foot; no stand, cables or reflections. Desktop only: a small clay jar with an olive twig on the floor at the right.
Sun: from the east, here the LEFT of the frame (door outside it): it lays warm matte patches on the floor only; the wall, the opening and the screen stay in cool lilac shade, never touched by sun.
Image 9 (desktop): camera 1.2 m, 28 mm, two-point perspective; opening centre-right, from 45% to 80% of the width.
Image 10 (mobile): camera 0.9 m, 35 mm, frontal; opening, surround and cane panel centred, about 65% of the width; leave out the jar.

FINAL CHECK before sending each image: exactly TWO identical single beds, never a double or a third (both in images 1, 2, 5, 6; none in 3, 4, 7, 8, 9, 10), each with ONE pillow; the terrace ledge a bench, never a bed; ONE stripe, never two, on every towel and throw, no crackle on linen; sun from the east on ONE side only, soft, golden, never hard, never on a TV screen; shades visibly cool blue-lilac, never brown, tan or amber; every floor, shower alcoves included, worn, matte, dry limestone slabs: no gloss, wet look, reflections, or pitted, pebbled, small-tiled or crazed texture; ONE copper spout and nothing else on its wall; any television off, small, plain bezel; no arches or extra objects; each mobile image closer and simpler, its lower part quiet.
```
