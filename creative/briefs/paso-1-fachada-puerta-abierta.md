# Paso 1 de 4: la fachada con la puerta abierta (2 imágenes, ChatGPT)

> Es el **primer fotograma** del vídeo de entrada. Solo cambia la puerta: todo lo demás debe ser igual que la imagen principal (P01). Los pasos siguientes (recepción, clip de escritorio, clip de móvil) no se piden hasta que este esté aprobado.
> **Adjunta, en este orden:** 1) `creative/approved/p01-hero-escritorio.jpg` 2) `creative/approved/p01-hero-movil.png`.

## Archivos que debe devolver (renómbralos así al subirlos)
| # | Archivo | Proporción | Objetivo | Mínimo |
|---|---|---|---|---|
| 1 | `p01-puerta-abierta-escritorio` | 16:9 | 2560 × 1440 | 1500 × 844 |
| 2 | `p01-puerta-abierta-movil` | 9:16 | 1440 × 2560 | 844 × 1500 |

## Prompt

```text
FORMAT: Two separate images. Image 1 landscape, exact ratio 16:9, target 2560 x 1440 px (never below 1500 x 844). Image 2 portrait, exact ratio 9:16, target 1440 x 2560 px (never below 844 x 1500).

Edit the two attached photographs of Hotel Aurora (an old restored whitewashed coastal house at sunrise): attachment 1 is the desktop framing, attachment 2 is the mobile framing. Deliver two images: the same photographs with ONE change only, the front door is now open.

HOW TO DELIVER
Each image on its own, never a collage. Before each, write only its file name on one line: p01-puerta-abierta-escritorio, then p01-puerta-abierta-movil. No captions, no text, no logos, no watermark inside the images. Do not deliver anything else.

THE ONE CHANGE
Both leaves of the double plank door (dark chocolate-brown aged oak) are open, swung inward and almost flat against the inner walls, so the doorway is now a dark opening. Through it we see a dim entrance hall in cool pale lilac-grey shade, a thick cream plaster wall on each side, a dark ceiling beam, and a matte pale limestone slab floor. At the far end of the hall, small and slightly out of focus, a warm bright daylight glow in a tall rectangular opening, suggesting a sunlit courtyard beyond. Nobody visible. The door opening keeps exactly the same position and size in the frame as in the attachment.

EVERYTHING ELSE IS IDENTICAL TO THE ATTACHMENTS
Same building, same framing and camera height, same low golden sunrise light, same cool lilac shadows, same sky and sea, same olive trees, same pots, same gravel, same shutters, same windows, same walls and cracks. Do not restyle, regrade, sharpen, add or remove anything outside the doorway. Image 1 extends attachment 1 slightly at the top (sky) and at the bottom (gravel) to reach 16:9; do not change anything else. Image 2 has the same ratio as attachment 2.

ALWAYS: rectangular openings with flat lintels only, no arches; perfectly vertical verticals; no people, no animals, no text, no logos, no brand names.
NEVER: a lit interior with lamps, warm orange interior light, glossy or wet floor, glass doors, a different door design, a different number of leaves.

FINAL CHECK before sending each image: compare with the attachment; only the door changed; both leaves open and flat against the inner walls; the doorway shows a cool dim hall with a warm glow at the far end; same framing; exact ratio.

OUTPUT: Image 1: landscape 16:9, 2560 x 1440 px target (minimum 1500 x 844); image 2: portrait 9:16, 1440 x 2560 px target (minimum 844 x 1500); highest quality, sRGB, JPG or PNG, no frame, no border, no margins.
```

## Si ChatGPT cambia algo más que la puerta
Responde en el mismo chat: «Restore exactly everything outside the doorway from the attachment; change only the door.» Si insiste, súbela igual y la comparo yo con P01 (mido la diferencia fuera de la puerta).

## Qué hago yo cuando la subas
1. Compruebo la proporción y el tamaño de las dos.
2. Comparo con P01 todo lo que queda **fuera de la puerta** (diferencia de píxeles) y reviso la puerta ampliada.
3. Te muestro las dos en la vista real del sitio (móvil 390 × 844 y escritorio) y espero tu aprobación escrita.
4. Solo entonces te pido el **paso 2**: la recepción, que usa esta imagen como referencia para que lo que se ve por la puerta coincida con el interior.

## Corrección v2 (2026-10-10): solo el suelo del vestíbulo
Registro del prompt pegado en el chat. Adjuntos: las dos imágenes de puerta abierta ya generadas (escritorio y móvil). Devuelve `p01-puerta-abierta-escritorio-v2` (16:9) y `p01-puerta-abierta-movil-v2` (9:16). Motivo: el suelo salió gris azulado, en rejilla regular y con franjas que parecen reflejo; la regla del hotel es piedra caliza cálida, mate, de losas grandes e irregulares. Plan B si cambia algo más: trasplantar solo el hueco de la puerta sobre la imagen base.
