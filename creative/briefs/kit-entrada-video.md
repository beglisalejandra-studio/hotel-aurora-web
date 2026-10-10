# Kit de la entrada en vídeo: de la puerta a la recepción

> Por qué: una transición fluida entre la fachada y el interior no se puede fabricar con fotos fijas (se ve como un recorte). Hace falta un plano continuo de cámara que atraviese la puerta. Yo no genero vídeo; sí lo proceso (ffmpeg) y lo integro en la web con el scroll. **Lo que tú generas:** 4 imágenes clave en ChatGPT y 2 clips en una herramienta de vídeo con imagen inicial y final.

## Paso 1. Cuatro imágenes clave en ChatGPT
**Adjunta en este orden:** 1) `p01-hero-escritorio.jpg`, 2) `p01-hero-movil.png`, 3) `p03-patio-escritorio.jpg`, 4) `p04-alba-escritorio.jpg`.

| # | Archivo | Proporción | Mínimo |
|---|---|---|---|
| 1 | `p01-puerta-abierta-escritorio` | 16:9 | 1500 × 844 |
| 2 | `p01-puerta-abierta-movil` | 9:16 | 844 × 1500 |
| 3 | `p36-recepcion-fin-escritorio` | 16:9 | 1500 × 844 |
| 4 | `p36-recepcion-fin-movil` | 9:16 | 844 × 1500 |

```text
Create 4 separate photographs for Hotel Aurora, a boutique hotel in an old restored whitewashed house on the Atlantic coast. They are key frames of one camera move that goes from the facade through the front door into the reception lobby.

HOW TO DELIVER
Each photograph as its own image, never a collage. Before each, write only its file name on one line: p01-puerta-abierta-escritorio, p01-puerta-abierta-movil, p36-recepcion-fin-escritorio, p36-recepcion-fin-movil. No captions, text, logos or watermark in the images.

FORMAT
Images 1 and 3: landscape, exact ratio 16:9, target 2560 x 1440 px (never below 1500 x 844). Images 2 and 4: portrait, exact ratio 9:16, target 1440 x 2560 px (never below 844 x 1500). If your maximum is smaller, deliver it in the exact ratio, never cropped, stretched or upscaled. Best quality, sRGB, JPG or PNG, no border.

ATTACHED REFERENCES (do not deliver them)
1) The facade at sunrise, desktop framing. 2) The same facade, mobile framing. 3) The interior courtyard. 4) The Alba bedroom: copy only its materials, never its colour grade or layout.

THE LOOK (every image)
Low golden sun, warm gold only on lit surfaces; what the sun misses is lit by the blue sky and reads cool pale lilac-grey (never brown or amber). Saturation moderate (mean about 0.30), sunlit plaster pale cream, never peach or orange. Hand-trowelled cream lime plaster with fine hairline cracks only (no veins or marbling), dark brown matt aged oak, pale limestone surrounds, olive foliage. A documentary photograph of a real, old, restored coastal house, never a catalogue set. No people, animals, text, logos or brand names. Rectangular openings with flat lintels only, no arches.

THE FLOOR (important)
Every floor is old, worn, DRY and completely MATTE pale limestone: large irregular rectangular slabs (about 60 x 40 to 90 x 50 cm) with thin hairline joints and gentle wear. No gloss, no shine, no wet look, no reflections, no pitted, bubbled or pebbled texture, no regular small tiles, no crazed cracks. Sun patches on the floor are warm, flat and matte.

IMAGES 1 and 2: the facade with the front door open
Files: p01-puerta-abierta-escritorio (16:9) and p01-puerta-abierta-movil (9:16).
Reproduce reference 1 (image 1) and reference 2 (image 2) exactly: same building, same framing, same camera height, same light, same olive trees and pots, same gravel. Change ONLY the front door: both leaves of the double plank door are open, swung inward and almost flat against the inner walls, so the doorway shows a dim, cool-lit entrance hall. At the far end of the hall, small and out of focus, a warm daylight glow and the suggestion of a reception area. Nobody visible. Image 1 extends reference 1 slightly at top and bottom to reach 16:9; keep the door at the same position in the frame as in the reference.

IMAGES 3 and 4: the reception lobby, the end of the move
Files: p36-recepcion-fin-escritorio (16:9) and p36-recepcion-fin-movil (9:16).
Scene: the lobby seen from about 2 m inside the entrance, camera at eye height (1.5 m), looking straight along the axis of the door. Thick cream lime walls, heavy dark ceiling beams. On the right a long reception desk of dark aged oak with a pale limestone top, with ONE brass bell and ONE small clay jar with an olive twig, nothing else. On the left an old dark oak bench against the wall. At the far wall, centred, a tall rectangular opening with a flat lintel and a pale limestone surround leading to the sunlit courtyard of reference 3, which glows warm and bright; the olive tree and the pond are glimpsed through it. At the very left edge, the inner face of one open plank door leaf. Soft golden light from the courtyard crosses the floor in a long matte patch; the rest of the lobby is in cool lilac shade. Image 4 is its own vertical composition: closer, the desk and the courtyard opening fill the central 85% of the width, lower 15% quiet floor.

ALWAYS: perfectly vertical verticals; direct low golden sun visibly touching surfaces; ONLY the objects named here. NEVER: marble, white tile, glossy surfaces, chrome, glass, upholstered catalogue furniture, any brand mark, a television, a computer or monitor, a keyboard, signage, plants other than the olive twig.

FINAL CHECK before sending each image: images 1 and 2 identical to the references except the open door; lobby with matte dry limestone floor, cream walls, cool lilac shade, no people, no extra objects, no arches.
```

## Paso 2. Dos clips en una herramienta de vídeo con imagen inicial y final
**Importante (comprobado el 2026-10-10):** según la búsqueda que hice, OpenAI cerró las apps de Sora el 26 de abril de 2026 y su API cierra el 24 de septiembre de 2026; los resultados no son concluyentes, así que **verifica en tu cuenta de ChatGPT si aún ofrece vídeo**. Herramientas que a día de hoy se citan como alternativas y que suelen permitir **imagen inicial e imagen final**: Google Flow (Veo), Runway, Kling y Luma. Comprueba en la tuya que acepta imagen final y que exporta **sin marca de agua** (suele exigir plan de pago).

- **Clip de escritorio:** imagen inicial `p01-puerta-abierta-escritorio`, imagen final `p36-recepcion-fin-escritorio`, 16:9, mínimo 1080p, 6 a 8 s, 24 o 30 fps, sin audio.
- **Clip móvil:** imagen inicial `p01-puerta-abierta-movil`, imagen final `p36-recepcion-fin-movil`, 9:16, mínimo 1080 × 1920, 6 a 8 s.
- Genera 4 a 6 variantes de cada uno y quédate con la que tenga la arquitectura rígida y recta, sin que la fachada se deforme.

```text
One single continuous shot, no cuts. Start exactly on the first image (the facade with the open front door) and end exactly on the last image (the reception lobby). The camera moves straight forward at a slow walking pace, at eye height, through the open doorway into the lobby: a real forward dolly with natural parallax, gentle ease-in at the start and ease-out at the end, no zoom, no pan, no tilt, no camera shake. The architecture stays rigid and perfectly straight: walls, doors, beams and verticals do not warp, melt or morph. The door leaves stay open and do not move. Exposure shifts smoothly from the bright sunlit outdoors to the softer warm interior; colour grade stays constant. Nothing else moves: no people, no animals, no flicker, no floating particles, no text, no logos, no watermark. Photorealistic documentary look, not a render, not CGI.
```
Si la herramienta solo admite imagen inicial, usa el mismo texto sin «end exactly on the last image» y añade al final: *«The shot ends inside the lobby: a long dark oak reception desk on the right, an old bench on the left, and at the far wall a tall rectangular opening that glows with the sunlit courtyard.»*

## Paso 3. Qué me entregas
Los dos MP4 (`entrada-escritorio.mp4`, `entrada-movil.mp4`) y las 4 imágenes clave originales, subidos al repositorio como siempre. Si algún clip sale bueno pero corto o con un salto al final, dímelo: se puede disimular.

## Paso 4. Qué hago yo
1. Compruebo que el primer fotograma coincide con la fachada de la portada y que el último es la recepción.
2. Los recodifico para que el scroll los reproduzca fotograma a fotograma sin tirones (todos los fotogramas clave), en MP4 y WebM, con póster y peso ajustado (objetivo escritorio ≤ 8 MB, móvil ≤ 5 MB).
3. Sustituyo la secuencia provisional por el vídeo controlado por el scroll: la fachada se acerca a la puerta, la atraviesa y llegas a la recepción; el texto aparece sobre la recepción.
4. Respaldo: con movimiento reducido o sin soporte, se muestran el póster y el último fotograma sin animación.
5. Las dos fotos de recepción quedan como piezas del hotel (P36) y se piden después en la sección «El hotel».
