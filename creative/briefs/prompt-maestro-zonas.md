# Prompt maestro de zonas del hotel: 8 imágenes en un solo prompt

> Para ChatGPT. Las cuatro fotos que faltan en la maqueta: **restaurante (P16)**, **sala de tratamientos del spa (P19)**, **portada del paquete «Escapada de dos noches» (P21)** y **perro en la terraza de la habitación (P25)**, cada una en versión escritorio y móvil, **8 imágenes separadas**.
> Adjunta en este orden: **1) `creative/approved/p01-hero-escritorio.jpg`** (fija el aspecto y el color de las sombras), **2) `creative/approved/p04-alba-escritorio.jpg`** (materiales de la casa y la habitación Alba de P21) y **3) `creative/approved/p11-terraza-exterior-escritorio.png`** (la terraza de P25).
> El prompt se pega en el chat; este archivo es solo el registro.

## Archivos que debe devolver (renómbralos así al subirlos)
| # | Archivo | Proporción | Objetivo | Mínimo |
|---|---|---|---|---|
| 1 | `p16-restaurante-escritorio` | 16:9 | 2560 × 1440 | 1500 × 844 |
| 2 | `p16-restaurante-movil` | 4:5 | 2048 × 2560 | 1120 × 1400 |
| 3 | `p19-spa-tratamientos-escritorio` | 4:5 | 2048 × 2560 | 1200 × 1500 |
| 4 | `p19-spa-tratamientos-movil` | 4:5 | 2048 × 2560 | 1120 × 1400 |
| 5 | `p21-escapada-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 6 | `p21-escapada-movil` | 4:5 | 2048 × 2560 | 1120 × 1400 |
| 7 | `p25-perro-terraza-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 8 | `p25-perro-terraza-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |

## Huecos medidos en la maqueta (2026-10-16) y zonas seguras
| Pieza | Móvil 390 | Tableta 768 | Escritorio 1440 | Lo que tapa el texto | Zona segura pedida |
|---|---|---|---|---|---|
| P16 / V01 restaurante | 390 × 488 (4:5) | 768 × 420 (1,83) | 1440 × 720 (2:1) | Móvil: el 15 % de abajo. Tableta: x 4–72 %, y 39–100 %. Escritorio: x 1–45 %, y 47–100 % | Escritorio 16:9 (en 2:1 se pierde un 5,6 % arriba y abajo): la mesa al sol en la mitad derecha; abajo a la izquierda, zona tranquila. Móvil 4:5: lo importante entre el 8 y el 80 % de la altura |
| P19 spa | 358 × 421 (0,85) | 420 × 494 (0,85) | 524 × 615 (0,85) | Nada | 4:5 (se pierde un 3 % arriba y abajo) |
| P21 escapada | 358 × 420 (0,85) | 707 × 420 (1,68) | 719 × 560 (1,28) | Móvil: y 47–96 %, todo el ancho. Tableta: x 2–62 %, y 47–96 %. Escritorio: x 2–64 %, y 59–97 % | Escritorio 3:2 (se pierde un 7 % por los lados en escritorio y un 5,5 % arriba y abajo en tableta): bandeja arriba a la derecha. Móvil 4:5: todo lo importante en el 45 % de arriba |
| P25 perro | 358 × 239 (3:2) | 707 × 471 (3:2) | 686 × 457 (3:2) | Nada | 3:2 exacto |

## Supuestos de contenido (ficticios, declarados en `PRODUCT.md` §5)
- Restaurante de cocina de mercado, del desayuno a la cena: una mesa puesta con un plato sencillo de tomates aliñados y pan; sin carta, precios ni marcas. P16 es también el póster del microvídeo V01, que se pedirá después a partir de la foto aprobada.
- Spa abierto también a quien no se aloja: una sala de tratamientos con una sola camilla.
- Escapada de dos noches en Alba o Marea, con desayuno: desayuno para dos en una bandeja sobre la cama de Alba.
- Petfriendly, hasta dos perros por habitación, con cama y cuencos de cortesía: un perro tumbado en su cama en la terraza de Terraza, con sus dos cuencos.

## Prompts (se piden de uno en uno, decisión de la persona del 2026-10-16)
Se pegan en el chat. Adjuntos: 1) `p01-hero-escritorio.jpg`, 2) `p04-alba-escritorio.jpg`. El de móvil se pega en el mismo chat después de recibir el de escritorio.

### p16-restaurante-escritorio

```text
FORMAT: landscape image, exact aspect ratio 16:9, target 2560 x 1440 px (never below 1500 x 844).

Create ONE photograph for the boutique hotel Hotel Aurora, an old restored whitewashed house on the Atlantic coast: the hotel restaurant. One image only, never a collage.
FILE NAME: write the file name as the description of the image, on its own line right above it, exactly: p16-restaurante-escritorio . If you can name the downloadable file, name it p16-restaurante-escritorio.png.

ATTACHED REFERENCES (do not deliver them)
REFERENCE 1: the main image of the hotel. It fixes the look, above all the COLOUR OF THE SHADOWS and the restraint of the colours.
REFERENCE 2: a bedroom of the same house. Copy ONLY its materials (lime plaster, dark oak beams, furniture language), never its bed, layout or colour grade.

THE LOOK (copy it to the letter)
Low golden sun entering directly, warm only on the lit surfaces, and long, soft, COOL BLUE-LILAC shadows like the shaded gravel of reference 1. What the sun does not touch reads pale grey-lilac: shaded plaster about RGB 150,140,165, deepest shadow about 95,100,125. Never brown, tan, amber, orange or ochre shadows. Saturation low, mean about 0.27 to 0.33; sunlit plaster pale cream, never peach or orange. Materials all matte and dry: hand-trowelled lime plaster with rare hairline cracks, heavy dark brown matt oak, golden rush seats, plain linen, small metal parts dark forged iron, never silver or chrome. A documentary photograph of a real, old, restored house, not a catalogue set.

THE FLOOR (important)
Old, worn, DRY, completely MATTE pale limestone: large irregular rectangular slabs (about 60 x 40 to 90 x 50 cm) in loose rows with thin hairline joints and softly chipped edges, like dusty sun-baked stone. NO gloss, shine, wet look or reflections; NO pitted, bubbled or pebbled texture; NO small square tiles, mosaic or terrazzo. Sun patches on the floor are warm, flat and matte.

THE SCENE
The dining room on the ground floor of the house: dark beams, thick lime walls. Four small square dark oak tables, each with two golden-rush chairs. ONE table, the nearest to the right-hand windows, is set for two: a plain undyed linen tablecloth, two cream handmade ceramic plates, two folded linen napkins, two plain thick water tumblers, a small clay water jug, a wooden board with a few slices of country bread, and in the middle ONE shallow cream ceramic dish of sliced ripe tomatoes with olive oil and coarse salt; a small clay jar with an olive twig. The other three tables are bare oak, chairs tucked in. In the far wall two tall narrow rectangular windows with flat lintels and dark plank shutters folded open, showing olive foliage and a flat level band of deep blue sea; they are views, never a source of glare.
Sun: low and golden, from the RIGHT, through windows in the right wall outside the frame; the rays travel right to left. A warm band crosses the set table, lights the dish, tumblers and bread, and lies across the floor towards the left. The left part of the room stays in cool lilac shade.

COMPOSITION (the website shows this photo as a wide 2:1 band and puts a text card over its lower-left part)
Camera at seated eye height (1.2 m), 28 mm, perfectly vertical verticals, looking along the room. The sunlit set table in the right half of the frame, its centre at about 68% from the left and 50% from the top. The lower-left quarter is quiet: shaded floor and the legs of a bare table, nothing important there. Everything important between 8% and 90% of the height.

ALWAYS: rectangular openings with flat lintels only (no arches or vaults); ONLY the objects named here.
NEVER: people, animals, text, menus, logos, brand names, watermark, marble, white tile, glossy or polished surfaces, chrome, candles, flowers, pendant lamps, hazy light, volumetric rays, steam or smoke, white ceilings.

FINAL CHECK before sending: ONE set table, the others bare; sun from the right only; shadows cool blue-lilac, never brown; floor matte, dry limestone slabs with no reflections; lower-left quarter quiet; exact 16:9.

OUTPUT: landscape 16:9, 2560 x 1440 px target (minimum 1500 x 844); if you cannot reach it, your largest exact 16:9 size (for example 1672 x 941), never cropped, stretched or upscaled. Highest quality, sRGB, JPG or PNG, no frame, no border, no margins.
```

### p16-restaurante-movil

```text
FORMAT: portrait image, exact aspect ratio 4:5, target 2048 x 2560 px (never below 1120 x 1400).

In this same chat, create ONE more photograph: the mobile version of the restaurant you just made. One image only, never a collage.
FILE NAME: write the file name as the description of the image, on its own line right above it, exactly: p16-restaurante-movil . If you can name the downloadable file, name it p16-restaurante-movil.png.

REFERENCES: the two images attached before (same look and materials) and the restaurant photo you just generated (p16-restaurante-escritorio): the SAME room, the SAME set table with exactly the same objects, the SAME light from the right, the same colour grade, saturation and shadow tint.

COMPOSITION: a NEW, closer camera position, never a crop of the desktop image. 35 mm, camera at 1.2 m, from the left side of the set table. The set table and its two chairs fill about 75% of the width, centred; the tomato dish at about 45% from the top. One far window with the sea band in the upper third. The bottom 18% is only plain shaded floor and the tablecloth hem (a text card covers it). No other tables in the frame. Perfectly vertical verticals.
Sun: from the right, a warm band across the table, the dish, the tumblers and the bread; the rest in cool lilac shade.

Same rules as before: matte dry limestone floor with no reflections; ONLY the named objects; no people, animals, text, logos, candles, flowers, steam or arches.

FINAL CHECK before sending: same table and objects as the desktop image; new closer viewpoint, not a crop; bottom 18% quiet; exact 4:5.

OUTPUT: portrait 4:5, 2048 x 2560 px target (minimum 1120 x 1400); never below 1120 x 1400, never cropped, stretched or upscaled. Highest quality, sRGB, JPG or PNG, no frame, no border, no margins.
```


### P19 (escritorio y móvil en un solo prompt, regla de la persona del 2026-10-16)
Adjuntos: 1) `p01-hero-escritorio.jpg`, 2) `p16-restaurante-escritorio.png` (aprobada; materiales de la planta baja). P16 se aprobó el 2026-10-16 tal cual.

```text
FORMAT: TWO separate images in ONE reply. Image 1: portrait, exact aspect ratio 4:5, target 2048 x 2560 px (never below 1200 x 1500). Image 2: portrait, exact aspect ratio 4:5, target 2048 x 2560 px (never below 1120 x 1400).

Create TWO photographs of the same scene for the boutique hotel Hotel Aurora, an old restored whitewashed house on the Atlantic coast: the spa treatment room. Deliver BOTH in this single reply, each as its own separate image, never a collage, never side by side. They are two shots taken by the same photographer in the same minute: the SAME room, the SAME objects, the SAME textures and shapes, the SAME light and colour grade in both. Only the camera position changes.

FILE NAME: write each file name as the description of its image, on its own line right above it, exactly: image 1 = p19-spa-tratamientos-escritorio , image 2 = p19-spa-tratamientos-movil . If you can name the downloadable files, use those names with .png.

ATTACHED REFERENCES (do not deliver them)
REFERENCE 1: the main image of the hotel. It fixes the look, above all the COLOUR OF THE SHADOWS and the restraint of the colours.
REFERENCE 2: the hotel restaurant, on the same ground floor. Copy its materials exactly: lime plaster walls, dark oak beams and shutters, matte limestone floor. Never its furniture or layout.

THE LOOK (copy it to the letter, identical in both images)
Low golden sun entering directly, warm only on the lit surfaces, and long, soft, COOL BLUE-LILAC shadows like the shaded gravel of reference 1. What the sun does not touch reads pale grey-lilac: shaded plaster about RGB 150,140,165, deepest shadow about 95,100,125. Never brown, tan, amber, orange or ochre shadows. Saturation low, mean about 0.27 to 0.33 in both images; sunlit plaster pale cream, never peach or orange. Materials all matte and dry: hand-trowelled lime plaster with rare hairline cracks, heavy dark brown matt oak, plain smooth raw linen with soft wrinkles only (no pattern, relief or jacquard), rough-cut pale sandstone, aged matte brass, small metal parts dark forged iron, never silver or chrome. A documentary photograph of a real, old, restored house, not a spa brochure.

THE FLOOR (important, identical in both images)
Old, worn, DRY, completely MATTE pale limestone: large irregular rectangular slabs (about 60 x 40 to 90 x 50 cm) in loose rows with thin hairline joints and softly chipped edges, smooth and flat like dusty sun-baked stone. NO gloss, shine, wet look or reflections; NO hammered, rippled, pitted, bubbled or pebbled texture; NO small square tiles, mosaic or terrazzo. Sun patches on the floor are warm, flat and matte.

THE SCENE
A small, quiet treatment room: thick lime walls, one heavy dark oak beam across the ceiling. ONE treatment table of dark oak with a low flat raw linen pad, set lengthwise. At its head ONE folded raw linen towel with ONE thin terracotta band near its edge. Beside the table ONE low dark oak stool holding ONE small aged-brass bowl of oil. On the floor at the foot of the table ONE wide shallow rectangular pale sandstone basin with still clear water. In the back wall ONE rectangular niche with a flat lintel holding a small clay jar with an olive twig. In the right wall ONE tall narrow rectangular window with deep reveals and dark plank shutters half open.
Sun: low, golden, soft, through that window on the right; the rays travel right to left. A single warm band crosses the floor and the linen pad and touches the edge of the water. The rest of the room is calm, cool lilac shade.

IMAGE 1 (p19-spa-tratamientos-escritorio): camera at 1.4 m in the corner diagonally opposite the window, 28 mm, perfectly vertical verticals. The table across the lower-middle of the frame, the window and the niche visible, the basin whole. Floor at most 25% of the height. Everything important inside the central 90%.

IMAGE 2 (p19-spa-tratamientos-movil): a vertical shot for a phone screen (shown about 358 x 421 px). Act as a professional interior photographer composing a NEW vertical photograph, never a crop of image 1: move closer and lower (0.9 m, 35 mm), along the table from its foot. The table, the towel, the stool and the brass bowl fill about 75% of the width, centred, with breathing room on every side. Nothing important cut by the edges: no half table, stool, bowl or towel sliced by the frame; if something cannot fit whole, leave it out entirely (the niche and the jar stay out). The window is just outside the right edge, where the sun band enters. Verticals perfectly vertical; the top of the table at about 55% from the top. Same light, textures, shapes and objects as image 1.

ALWAYS: rectangular openings with flat lintels only (no arches, vaults or rounded niches); ONLY the objects named here.
NEVER: people, animals, text, logos, brand names, watermark, candles, orchids or flowers, stacked pebbles, bamboo, incense, statues, rose petals, rolled or sculpted towels, marble, white tile, glossy or polished surfaces, chrome, glass, hazy light, volumetric rays, steam or smoke, white ceilings.

FINAL CHECK before sending: two separate images in this reply, each with its file name above it; same room, objects, textures and light in both; ONE treatment table, ONE towel, ONE stool, ONE brass bowl, ONE basin; sun from the right only; shadows cool blue-lilac, never brown; floor matte, dry limestone slabs with no reflections or hammered texture; image 2 recomposed, nothing cut at the edges; both exact 4:5.

OUTPUT: Image 1: portrait 4:5, 2048 x 2560 px target (minimum 1200 x 1500). Image 2: portrait 4:5, 2048 x 2560 px target (minimum 1120 x 1400). Never cropped, stretched or upscaled. Highest quality, sRGB, JPG or PNG, no frame, no border, no margins.
```

### P21 (escritorio 3:2 y móvil 4:5 en un solo prompt)
Adjuntos: 1) `p01-hero-escritorio.jpg`, 2) `p04-alba-escritorio.jpg` (es la habitación). P19 se aprobó el 2026-10-16 (la móvil es la de escritorio reducida).

```text
FORMAT: TWO separate images in ONE reply. Image 1: landscape, exact aspect ratio 3:2, target 2560 x 1706 px (never below 1500 x 1000). Image 2: portrait, exact aspect ratio 4:5, target 2048 x 2560 px (never below 1120 x 1400).

Create TWO photographs of the same scene for the boutique hotel Hotel Aurora, an old restored whitewashed house on the Atlantic coast: breakfast for two on the bed of the Alba bedroom, for the "two-night getaway" package. Deliver BOTH in this single reply, each as its own separate image, never a collage, never side by side. They are two shots taken by the same photographer in the same minute: the SAME room, the SAME tray and food, the SAME textures and shapes, the SAME light and colour grade in both. Only the camera position changes.

FILE NAME: write each file name as the description of its image, on its own line right above it, exactly: image 1 = p21-escapada-escritorio , image 2 = p21-escapada-movil . If you can name the downloadable files, use those names with .png.

ATTACHED REFERENCES (do not deliver them)
REFERENCE 1: the main image of the hotel. It fixes the look, above all the COLOUR OF THE SHADOWS and the restraint of the colours.
REFERENCE 2: the Alba bedroom. It IS the room of these photos: the same double bed, low headboard, white linen, terracotta throw, beams, walls, window with dark shutters on the right and floor. Do not redesign it.

THE LOOK (copy it to the letter, identical in both images)
Low golden morning sun entering directly, warm only on the lit surfaces, and long, soft, COOL BLUE-LILAC shadows like the shaded gravel of reference 1. What the sun does not touch reads pale grey-lilac: shaded plaster about RGB 150,140,165, deepest shadow about 95,100,125. Never brown, tan, amber, orange or ochre shadows. Saturation low, mean about 0.27 to 0.33 in both images; sunlit plaster and linen pale cream, never peach or orange. Materials all matte and dry: hand-trowelled lime plaster, heavy dark brown matt oak, plain smooth white linen with soft natural wrinkles only (no pattern, relief, quilting or jacquard), handmade cream ceramic, small metal parts dark forged iron, never silver or chrome. A documentary photograph of a real, old, restored house, not a catalogue set.

THE FLOOR (important, identical in both images)
Old, worn, DRY, completely MATTE pale limestone: large irregular rectangular slabs (about 60 x 40 to 90 x 50 cm) in loose rows with thin hairline joints and softly chipped edges, smooth and flat like dusty sun-baked stone. NO gloss, shine, wet look or reflections; NO hammered, rippled, pitted or pebbled texture; NO small square tiles.

THE SCENE
The Alba bedroom of reference 2, morning. The double bed is made but slightly crumpled, as if just left, with its two pillows and the terracotta throw folded across the foot. On the bed, between the pillows and the throw, a little to the right of centre, ONE dark oak breakfast tray with low sides holding exactly: two cream ceramic cups of black coffee, two small plain glasses of fresh orange juice, ONE cream plate with two slices of toasted country bread topped with crushed tomato and a thread of olive oil, and ONE small clay jar with an olive twig. Nothing else on the tray or the bed. Nobody in the room.
Sun: low and golden, from the window on the RIGHT; the rays travel right to left. A warm band crosses the tray, the cups and the glasses and lies on the white linen; the headboard wall stays in cool lilac shade.

IMAGE 1 (p21-escapada-escritorio, 3:2): camera at the foot-left corner of the bed, 1.4 m high, 35 mm, perfectly vertical verticals, looking towards the headboard and the window. The tray in the upper-right part of the frame, its centre at about 65% from the left and 38% from the top. The lower-left part of the frame (left 60% of the width, below the middle) is quiet: plain linen, the throw and the floor in soft shade, nothing important there (a text card covers it on the website). Keep everything important more than 10% from the left and right edges.

IMAGE 2 (p21-escapada-movil, 4:5): a vertical shot for a phone screen (shown about 358 x 420 px, with a text card over its lower half). Act as a professional interior photographer composing a NEW vertical photograph, never a crop of image 1: stand at the foot of the bed, camera at 1.6 m, 35 mm, looking down along the bed at about 35 degrees. The tray, whole and uncut, fills about 70% of the width and sits entirely in the TOP 45% of the frame, with the pillows and the top of the headboard above it, all inside the frame with breathing room. The bottom 55% is only plain white linen and the terracotta throw, calm and empty. Nothing important cut by the edges: no cup, glass, plate or jar sliced by the frame; if something cannot fit whole, leave it out entirely. Same light, textures, shapes and objects as image 1.

ALWAYS: rectangular openings with flat lintels only (no arches or vaults); ONLY the objects named here.
NEVER: people or hands, animals, text, logos, brand names, watermark, croissants, pastries, fruit bowls, flowers, candles, books, phones, newspapers, steam, marble, glossy or polished surfaces, chrome, hazy light, volumetric rays, white ceilings.

FINAL CHECK before sending: two separate images in this reply, each with its file name above it; same room as reference 2, same tray and food in both; ONE tray with two coffees, two orange juices, ONE plate of tomato toast and ONE clay jar; sun from the right only; shadows cool blue-lilac, never brown; linen plain, no relief; floor matte with no reflections; image 1 tray upper right and lower-left quiet; image 2 recomposed, tray whole in the top 45%, nothing cut at the edges; exact 3:2 and 4:5.

OUTPUT: Image 1: landscape 3:2, 2560 x 1706 px target (minimum 1500 x 1000; 1536 x 1024 is fine). Image 2: portrait 4:5, 2048 x 2560 px target (minimum 1120 x 1400). Never cropped, stretched or upscaled. Highest quality, sRGB, JPG or PNG, no frame, no border, no margins.
```
