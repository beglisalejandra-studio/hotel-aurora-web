# V01: microvídeo del restaurante (un solo intento, decisión de la persona del 2026-10-25)

> Se pega en Google Flow (modo de imagen inicial). Imagen inicial: `creative/approved/p16-restaurante-escritorio.png`. Si no gusta, se queda la foto fija P16.

| Archivo que se sube | Qué es |
|---|---|
| `v01-restaurante-escritorio.mp4` | El clip de Flow, 16:9, 8 s |

**Lo hace el agente:** quitar el audio, hacer el bucle (fundido del final con el principio), la versión móvil 4:5 como recorte centrado en la mesa del mismo clip (como P16 móvil), comprimir (MP4 H.264 y WebM) y usar P16 como póster. Con movimiento reducido o sin vídeo se ve la foto fija.

## Prompt

```text
FORMAT: video, landscape 16:9, 1920 x 1080 px (1080p), 8 seconds, 24 fps, starting exactly on the attached photograph.

Animate this exact photograph of a hotel restaurant into a calm, almost still 8-second shot.

LOCKED-OFF CAMERA on a tripod: no camera movement at all, no zoom, no pan, no tilt, no dolly, no parallax, no shake.

NOTHING CHANGES: the room, the beams, the walls, the windows, the shutters, the tables, the chairs, the tablecloth and every object on the set table (plates, tumblers, jug, bread, the dish of tomatoes, the clay jar with the olive twig) stay exactly as in the photograph: same size, shape, position and colour. Nothing appears, disappears, multiplies or melts.

ONLY TWO THINGS MOVE, very gently:
1) The warm band of low golden sunlight on the set table and on the floor drifts very slowly a few centimetres to the left, as the sun moves, and its soft edges breathe slightly.
2) Outside the two far windows, the olive leaves sway softly in a light sea breeze. The sea stays a flat, level band.

Same colour grade, exposure and light from the first frame to the last: no flicker, no pulsing, no change of time of day. The cool lilac shadows stay cool lilac.

NEVER: people, hands, animals, steam, smoke, dust particles, light rays or beams, lens flare, text, logos, watermark, music or sound effects.

Photorealistic, natural, real footage of a real place, not CGI, not an animation.

OUTPUT: one MP4 video, 16:9, 1920 x 1080 px, 8 s, 24 fps, highest quality, no text, no watermark.
```
