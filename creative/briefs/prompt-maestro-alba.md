# Prompt maestro de Alba: 8 imágenes en un solo prompt

> Para ChatGPT. Completa la habitación Alba: baño (general y detalle) y zona de TV (general y desde la cama), cada toma en versión escritorio y móvil, **8 imágenes separadas**. El dormitorio (P04) ya está aprobado. Alba no tiene terraza.
> Adjunta en este orden: **1) `creative/approved/p01-hero-escritorio.jpg`** (fija el aspecto), **2) `creative/approved/p04-alba-escritorio.jpg`** y **3) `creative/approved/p04-alba-movil.png`** (la misma habitación).

## Archivos que debe devolver (renómbralos así al subirlos)
| # | Archivo | Proporción | Objetivo | Mínimo |
|---|---|---|---|---|
| 1 | `p06-alba-bano-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 2 | `p06-alba-bano-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 3 | `p05-alba-tv-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 4 | `p05-alba-tv-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 5 | `p26-alba-bano-detalle-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 6 | `p26-alba-bano-detalle-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |
| 7 | `p27-alba-tv-vista-cama-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 8 | `p27-alba-tv-vista-cama-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |

## Supuestos de diseño (ficticios; confirmar antes de publicar)
Que el baño tenga una ventana pequeña al este (necesaria para el sol directo), que sea ducha de obra a ras de suelo (no se ha dicho si hay bañera) y que la zona de TV sea una alacena en el muro de los pies de la cama. No se muestra inodoro ni bidé. En la web no se afirma Smart TV, plataformas, ducha de lluvia ni pulgadas.

## Prompt

```text
You are going to create 8 separate photographs for a boutique hotel called Hotel Aurora. They are the missing photographs of one guest room, "Alba": its bathroom (two shots) and its TV corner (two shots), each shot in two versions, a desktop version and a mobile version. The Alba bedroom already exists (attached).

HOW TO DELIVER (important)
- Send each photograph as its own separate image, one after another. Never a collage, grid, diptych, contact sheet or two pictures in one image.
- Before each image, write only its file name on one line (for example: p06-alba-bano-escritorio) and nothing else. No captions, no text, no logos and no watermark inside the images.
- If you cannot send all 8 in one reply, send as many as you can in the order below, then stop. I will write "siguiente" and you continue with the next ones, in the same order, without repeating any.

FORMAT FOR ALL 8 IMAGES
Landscape image, exact aspect ratio 3:2 (width : height = 3 : 2), target 2560 x 1706 px (never smaller than 1500 x 1000 px for the desktop versions and never smaller than 1200 x 800 px for the mobile versions), highest quality available, sRGB colour, JPG or PNG, no frame, no border, no margins.

ATTACHED IMAGES
1) The main image of the hotel (the exterior at sunrise). It defines the exact visual style: reproduce its look to the letter.
2) and 3) The Alba bedroom (desktop and mobile versions). It is the same room: same walls, beams, flagstones, linen, terracotta and rush chair.
Only the look and the materials are copied. The exterior itself and the bedroom composition are not copied.

THE LOOK OF THE HOTEL (copy it to the letter in every image)
Low early-morning sun entering directly from the left, warm golden-amber light on the lit surfaces with a thin warm rim of light on edges, and long, soft, cool blue-lilac shadows (never black, never brown, never grey). Warm off-white cream lime plaster, hand-applied, with trowel marks and fine hairline cracks. Dark chocolate-brown stained timber (beams, plank doors, louvred shutters). Pale limestone surrounds and worn pale limestone flagstone floors. Terracotta clay in warm orange-brown. Grey-green olive foliage. A clean cornflower-blue sky only where it appears through a window. Split-toned grading with warm highlights and cool shadows, moderate saturation, high clarity, crisp deep sharpness, clean fine detail, very little grain, medium-high contrast with deep warm-brown darks and soft cream highlights. A documentary photograph of a real, old, hand-built, carefully restored coastal house: not a new building, not a minimalist designer villa, not a spa, not a catalogue or magazine set.

THE ROOM: ALBA
Classic and warm. Off-white (ecru) linen and a single terracotta accent (a folded terracotta wool blanket, one thin terracotta stripe on towels, a small terracotta clay jar). Dark oak furniture with golden rush seats, a low chest, a plank cupboard, a hand-carved pale limestone basin, aged copper fixtures. Every photograph shows the same signature: a diagonal band of low golden sun with the soft shadow of an olive branch falling on the lime wall. The terracotta covers less than 8% of any frame.

ALWAYS
Rectangular openings only, with flat lintels: no arches, no vaults, no curved niches. Direct sunlight visibly touching surfaces in every image. No people, no animals, no text, no logos, no brand names, no watermark.
NEVER: marble, white tile, glossy or polished surfaces, chrome, freestanding bathtub, glass shower screen, modern or minimalist furniture, upholstered catalogue sofas, cool or hazy or overcast or silver light, volumetric light rays or steam, grey-blue walls, white ceilings, toilets or bidets in the picture, lit or branded screens.

THE 8 IMAGES, in this order

IMAGES 1 and 2: bathroom, general view
Files: p06-alba-bano-escritorio (image 1) and p06-alba-bano-movil (image 2).
Scene: a small bathroom seen from the doorway. Thick cream lime walls with trowel marks, one visible dark beam, the side of a heavy plank door in chocolate-brown timber. A small high rectangular window with a flat lintel in the east wall (left of the frame), its dark louvred shutter open, a strip of cornflower-blue sky. A rectangular basin of pale hand-carved limestone with a thick uneven edge, on a thick dark oak shelf; one simple aged-copper tap fixed to the wall; a rectangular mirror with a thin dark timber frame that reflects only sunlit lime wall. A walk-in shower alcove of lime plaster at floor level with a simple round aged-copper shower head, with no screen and no door. Worn pale limestone flagstone floor with a raw cotton bath mat with one thin terracotta stripe at each end. A dark timber peg rail with three pegs and a raw linen-cotton towel with exactly one thin terracotta stripe on its edge. A small clay jar with an olive twig on the shelf.
Sun: direct and low from the east (left). It enters through the high window and crosses the room as a diagonal amber band that falls on the right wall and the shower alcove, touches the flagstones and puts a thin edge of light on the basin; the soft shadow of the olive branch is drawn on the lime. Shadows long, soft and blue-lilac. Real sunlight touching surfaces, not diffuse light.
Image 1 (desktop): camera about 1.3 m at the doorway, 24 to 28 mm lens, perfectly vertical verticals, the whole bathroom, every important element inside the central 90% of the frame.
Image 2 (mobile): the same bathroom and light, re-composed for a small phone screen: closer, 35 mm lens; the basin, the window and the sun band fill about 70% of the width; the shower is only hinted at the right edge; leave out the small jar and the peg rail; fewer small details; key elements inside the central 85%.

IMAGES 3 and 4: TV corner, general view
Files: p05-alba-tv-escritorio (image 3) and p05-alba-tv-movil (image 4).
Scene: a corner of the Alba bedroom on the wall at the foot of the bed. A deep rectangular cupboard recess in the thick wall, with a flat lintel and a pale limestone surround, and two plank doors in chocolate-brown timber opened wide like shutters. Inside the recess, set back and surrounded by lime plaster, a switched-off television of moderate size (less than half the width of the opening), matte black, with no reflections, no logo, no cables, no soundbar and no remote. Below it, a low dark oak chest as a base with a folded terracotta wool blanket on top. In front, at mid distance, a low dark oak armchair with a golden rush seat and back (the same language as the rush chair in the Alba bedroom image), an ecru linen cushion, and a small round oak side table with a clay jar and an olive twig. A dark beam visible in the ceiling, pale limestone flagstones, an undyed wool rug.
Sun: direct and low from the high east window (outside the frame, on the right). A diagonal amber band crosses the flagstones, climbs the armchair and the chest and brushes the lime wall beside the cupboard, showing the trowel marks. The shadow of an olive branch falls on the lime; one of the open plank doors has a thin amber rim on its edge. The recess with the screen stays in soft blue-lilac shade on purpose: the sun never hits the screen, so there is no glare.
Image 3 (desktop): camera about 1.2 m from the corner, 28 mm lens, two-point perspective, perfectly vertical verticals; the cupboard in the centre-right third and the armchair in the left third; key elements inside the central 90%.
Image 4 (mobile): the same corner and light, re-composed for a small phone screen: 35 mm, closer; the open cupboard and the chest centred and filling about 65% of the width, the armchair cropped by half at the left edge, the side table and the bed out of frame; key elements inside the central 85%.

IMAGES 5 and 6: bathroom, basin detail
Files: p26-alba-bano-detalle-escritorio (image 5) and p26-alba-bano-detalle-movil (image 6).
Scene: a close-up of the rectangular basin of pale limestone with a thick uneven edge, on the thick dark oak shelf, with the cream lime wall behind it. One simple aged-copper tap on the wall (a single spout, no mixer lever, no waterfall spout). A raw linen-cotton towel folded on the shelf with exactly one thin terracotta stripe visible on its edge. A bar of unbranded soap on a small terracotta clay dish and a small clay jar with an olive twig. No mirror in the frame.
Sun: direct and low from the left. A diagonal amber band crosses the lime wall above the basin, puts a thin edge of light on the stone rim and on the neck of the copper tap, and throws the crisp shadow of the olive branch on the wall. The shadows of the shelf and the jar are long, soft and blue-lilac. The raking light shows the trowel marks and the fine cracks.
Image 5 (desktop): camera about 0.9 m, slightly high and square-on, 50 mm lens, medium depth of field; the basin in the lower-left third and the sun band in the upper-right third; key elements inside the central 90%.
Image 6 (mobile): the same detail re-composed for a phone: the basin, the tap and the towel fill about 75% of the width, a clean diagonal sun band, leave out the soap dish; key elements inside the central 85%.

IMAGES 7 and 8: TV corner seen from the bed
Files: p27-alba-tv-vista-cama-escritorio (image 7) and p27-alba-tv-vista-cama-movil (image 8).
Scene: a low, compressed view from the foot of the low linen bed of the Alba bedroom. In the foreground, softly out of focus, the folded terracotta wool blanket on crumpled raw linen. In the background, sharp, the plank cupboard of images 3 and 4 with its doors open and the switched-off screen, discreet, matte black, no logo, set above the dark oak chest; a clay jar with an olive twig on the chest and one corner of the rush armchair at the side; pale limestone floor and a dark beam above.
Sun: direct and low from the east window (right, outside the frame). The diagonal band falls fully on the terracotta blanket and the linen in the foreground, with amber edges on the folds, and continues over the flagstones toward the chest. The cupboard stays in soft blue-lilac shade with the olive-branch shadow on the lime beside it. The sun never touches the screen.
Image 7 (desktop): camera about 0.7 m above the floor at the foot of the bed, 50 mm lens at f/4 so the foreground is softly blurred; the cupboard sharp in the right third; key elements inside the central 90%.
Image 8 (mobile): the same view re-composed: the terracotta blanket fills the lower-left 40%, the cupboard centred in the background, without the armchair or the jar; key elements inside the central 85%.

FINAL CHECK before sending each image: sun visibly touching surfaces; warm cream lime walls; dark timber; no arches; screen switched off; no marble, no white tile, no chrome, no glass; colours and light the same as the attached main image.
```
