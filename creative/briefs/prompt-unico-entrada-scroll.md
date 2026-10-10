# Prompt único: la entrada al hotel como vídeo controlado por el scroll

## Cómo se llama y qué hace
**Vídeo controlado por el scroll** (*scroll-driven video*, también *video scrubbing*; la técnica general es *scrollytelling*). No se reproduce solo: su avance va ligado a la posición del scroll. El visitante baja y la cámara camina hacia la puerta, la atraviesa y llega a la recepción; sube y retrocede. En una web real se ve como un plano continuo, sin cortes ni recortes.

## El efecto que queremos
- Plano continuo de unos 8 segundos, a **velocidad constante** (la velocidad la pone el scroll, no el vídeo).
- Cámara a la altura de los ojos (1,5 m), recta hacia delante, con paralaje real. Sin zoom, sin giros, sin sacudidas.
- Primer fotograma = la fachada de la portada con la puerta abierta. Último fotograma = la recepción, con luz dorada entrando desde el patio.
- Reparto del recorrido: 0 a 40 % acercarse a la puerta, 40 a 65 % cruzar el umbral, 65 a 100 % entrar a la recepción hasta quedar mirando al patio.
- Arquitectura rígida y recta (sin deformaciones), puerta abierta e inmóvil, sin personas, sin texto, sin logotipos, sin marca de agua.

## Lo que ya tenemos (referencias, en este orden)
1. `p01-hero-escritorio.jpg` (fachada, escritorio) 2. `p01-hero-movil.png` (fachada, móvil) 3. `p03-patio-escritorio.jpg` (patio) 4. `p04-alba-escritorio.jpg` (materiales de la casa). Van todas en el archivo `referencias-entrada.zip`.

## Lo que falta por crear (4 imágenes clave + 2 clips)
| # | Archivo | Qué es | Dimensiones |
|---|---|---|---|
| 1 | `p01-puerta-abierta-escritorio` | La fachada de P01, idéntica, con la puerta abierta | 16:9, 2560 × 1440 (mínimo 1500 × 844) |
| 2 | `p01-puerta-abierta-movil` | Lo mismo con el encuadre móvil | 9:16, 1440 × 2560 (mínimo 844 × 1500) |
| 3 | `p36-recepcion-fin-escritorio` | La recepción, final del recorrido | 16:9, 2560 × 1440 |
| 4 | `p36-recepcion-fin-movil` | La recepción en composición vertical | 9:16, 1440 × 2560 |
| 5 | `entrada-escritorio.mp4` | Clip de la herramienta de vídeo (1 → 3) | 1920 × 1080, 8 s |
| 6 | `entrada-movil.mp4` | Clip de la herramienta de vídeo (2 → 4) | 1080 × 1920, 8 s |

## Tamaño y formato de los archivos
- **Imágenes:** PNG o JPG, máximo 4 MB cada una (el límite del sistema), proporción exacta.
- **Clips:** MP4 (H.264), **1920 × 1080 y 1080 × 1920**, **24 fps**, **8 s** (192 fotogramas), sin audio, sin marca de agua, **máximo 25 MB cada uno** (es el límite de subida de GitHub desde el navegador; con 8 s y menos de 20 Mbps entra de sobra). Si tu herramienta exporta más pesado, bájale la tasa de bits o dímelo.
- **Lo que pesará en la web** (lo preparo yo): escritorio unos 8 MB y móvil unos 5 MB, recodificados para que el scroll los avance fotograma a fotograma sin tirones, más un póster de la primera imagen.

## Paso 1. Las 4 imágenes clave, en ChatGPT (un solo prompt)
Adjunta el contenido de `referencias-entrada.zip` (4 imágenes) en ese orden.

```text
Create 4 separate photographs for Hotel Aurora, a boutique hotel in an old restored whitewashed house on the Atlantic coast. They are the key frames of ONE continuous camera move that a scroll-driven video will play as the visitor scrolls the website: the camera starts on the facade, walks straight toward the front door, passes through the open doorway and arrives in the reception lobby. The first frame of the video must be image 1 (or 2) and the last frame must be image 3 (or 4), so each pair must be perfectly consistent in architecture, light and colour.

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

## Paso 2. Los 2 clips, en una herramienta de vídeo con imagen inicial e imagen final
Imagen inicial 1 y final 3 para el clip de escritorio; inicial 2 y final 4 para el móvil. Pide 4 a 6 variantes de cada clip y quédate con la que mantenga la arquitectura recta y sin deformarse.

```text
One single continuous shot, no cuts. Start exactly on the first image (the facade with the open front door) and end exactly on the last image (the reception lobby). The camera moves straight forward at a slow walking pace, at eye height, through the open doorway into the lobby: a real forward dolly with natural parallax, CONSTANT speed from the first frame to the last (no ease-in, no ease-out, no slow-down at the ends, because the visitor's scroll will control the speed), no zoom, no pan, no tilt, no camera shake. The architecture stays rigid and perfectly straight: walls, doors, beams and verticals do not warp, melt or morph. The door leaves stay open and do not move. Exposure shifts smoothly from the bright sunlit outdoors to the softer warm interior; colour grade stays constant. Nothing else moves: no people, no animals, no flicker, no floating particles, no text, no logos, no watermark. Photorealistic documentary look, not a render, not CGI.
```
Si la herramienta solo admite imagen inicial, usa el mismo texto sin «end exactly on the last image» y añade: *«The shot ends inside the lobby: a long dark oak reception desk on the right, an old bench on the left, and at the far wall a tall rectangular opening that glows with the sunlit courtyard.»*

## Qué herramienta usar (verifícalo en tu cuenta)
Mi búsqueda del 2026-10-10 indica que OpenAI cerró las apps de Sora el 26 de abril de 2026 (su API cierra el 24 de septiembre de 2026); los resultados no son concluyentes. Suelen citarse como alternativas Google Flow (Veo), Runway, Kling y Luma. Comprueba que tu plan acepte **imagen final** y que exporte **sin marca de agua** (suele exigir plan de pago).

## Siguiente fase (si funciona)
Un segundo tramo continuo de la recepción al patio (imagen final = `p03-patio-escritorio` que ya está aprobada) y después a una habitación, encadenado con el primero. No lo pedimos hasta ver que el primer tramo sale limpio.

## Qué hago yo con los clips
1. Compruebo que el primer fotograma coincide con la fachada de la portada y el último es la recepción.
2. Los recodifico para que el scroll los reproduzca sin tirones (todos los fotogramas clave), en MP4 y WebM, con póster.
3. Sustituyo la secuencia provisional por el vídeo ligado al scroll; el texto aparece sobre la recepción.
4. Respaldo sin animación (movimiento reducido o navegador sin soporte): póster y último fotograma.
