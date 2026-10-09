# Solicitud de material — p01-hero-escritorio (imagen)

> Crea este material con la herramienta que prefieras (Canva, tu cámara, un generador de IA, un diseñador) y súbelo a la carpeta indicada. Con estas medidas y este texto, lo que adjuntes **encaja a la primera** en el sistema. Si el resultado no te convence, se repite la solicitud con la corrección.

- **Página / uso:** home · heroe de portada en escritorio (LCP)
- **Proporción:** 16:10

## Estilo a respetar

**Referencias aprobadas (principios, no clonar):** `creative/references/extracted`, `creative/references/reference-analysis.md`, `creative/references/urls.md`

**Indicaciones de esta pieza:** Foto de arquitectura documental, luz natural de primera hora, sombras frias de pizarra con un borde calido de luz, sin personas, sin arcos. El tercio inferior debe quedar libre y de bajo contraste para superponer el titular. Es la imagen que fija la identidad del edificio para todas las demas fotos.

## Medidas exactas (imagen)

| Qué | Valor |
|---|---|
| Tamaño del máster | **2560 × 1600 px** (16:10) |
| Formato de entrega | JPG, PNG, WebP o AVIF (**no SVG**) |
| Peso máximo de subida | **4 MB** (el editor optimiza solo a WebP en 480/960/1600 px y quita los metadatos) |
| Peso objetivo ya optimizado | ≤ 250 KB (el editor avisa por encima y bloquea por encima de 900 KB) |
| Color | sRGB |
| Texto dentro de la imagen | Evítalo: no es accesible ni traducible. El texto va en el sitio |
| Texto alternativo | **Obligatorio** (descríbela para quien no la ve) o márcala como decorativa |

## Dónde subirla

1. **Para que la revise:** sube el archivo a `creative/inbox/p01-hero-escritorio.jpg` (o .png/.webp) y dime «subí p01-hero-escritorio». Comprobaré medidas, proporción y peso contra esta ficha.
2. **En el sitio:** con el editor visual, botón **Subir imagen** del bloque (Portada, Imagen…). La aprobación final es tuya.

## Prompt (cópialo tal cual en la herramienta que uses)

```text
Ultra-realistic architectural photograph, a real photo and not a render. Exterior of a restored two-storey whitewashed boutique hotel on the Atlantic coast of Cadiz, southern Spain, the main facade facing east, photographed at first light about twenty minutes after sunrise. Hand-applied lime plaster walls in warm off-white with fine hairline cracks, soft trowel marks and gentle weathering. Dark-stained timber shutters and a heavy plank wooden entrance door. Rectangular windows only, no arches and no arched openings. Low-pitched roof of weathered terracotta tiles. A simple raked gravel courtyard with two small olive trees and tufts of dune grass, and a low whitewashed boundary wall. The first low sun grazes the facade from the left, giving a thin warm amber edge light on the plaster and long, soft, cool slate-blue shadows. The sky is pale and clear with a faint coastal haze near the horizon. Calm wide composition: the building sits in the upper two thirds of the frame; the lower third is quiet empty gravel with soft shadow, low contrast and no focal details, leaving clear space for overlaid text. Shot on a full-frame mirrorless camera with a 24mm tilt-shift lens at f/8, ISO 100, on a tripod at eye level about 1.6 metres, perfectly vertical verticals, deep sharpness from front to back, natural colour with restrained saturation, subtle fine film grain, very slight natural vignetting, realistic micro-contrast and true material textures. Colour palette: warm off-white plaster, cool slate-blue shadows, a single accent of terracotta roof tiles. No people, no animals, no vehicles, no text, no logos, no signage, no watermark, no lens flare, no HDR halos, no oversaturated sunset, no plastic or CGI look, no warped geometry.
```

**Evitar (prompt negativo):** texto o marcas de agua dentro de la imagen, logotipos deformados o inventados, manos o rostros distorsionados, producto distinto al de la referencia.

**Debe conservarse sin cambios:** fachada encalada con contraventanas de madera oscura, ventanas rectangulares, tejado de teja terracota, luz de amanecer desde la izquierda, paleta pizarra y terracota.

## Antes de publicar

- [ ] El producto, la forma, los colores y el logotipo coinciden con la referencia aprobada.
- [ ] Tienes derechos de uso del material (propio, con licencia o generado con una herramienta que lo permita).
- [ ] Texto alternativo escrito; video con poster y fallback; con audio, subtítulos.
- [ ] Todo lo generado lleva marca de agua SynthID (Google). Es contenido sintético: valora si debes indicarlo al público.

## Revisión de recepción (2026-10-09)

Archivo recibido: `creative/inbox/p01-hero-escritorio.jpg` · JPG, 2560 × 1600 (16:10), 1,92 MB, sRGB. No lleva metadatos de procedencia (ni EXIF, ni XMP, ni C2PA detectables), así que **no se sabe con qué herramienta se hizo**: hace falta que la persona lo indique para registrarlo en `creative/manifest.json` (`ai_generated`).

**Cumple:** medidas y proporción; sin personas, texto, logos ni arcos (puerta y ventanas rectangulares); luz de amanecer desde la izquierda; teja terracota, contraventanas oscuras y paleta pizarra y terracota; el 43 % inferior es grava lisa, sin objetos.

**Se aparta de la ficha:** cielo azul saturado (la ficha pedía un cielo pálido con calima); muro más crema que encalado; grava muy nítida (pesa).

**Peso optimizado (pruebas en 1600 px de ancho):** WebP calidad 72 = 250 KB; WebP 50 = 189 KB; AVIF 45 = 126 KB; AVIF 55 = 175 KB. En 960 px, AVIF 55 = 73 KB; en 480 px, 17 KB. El presupuesto del ADR-0006 (LCP ≤ 180 KB; ≤ 110 KB en móvil) se cumple con AVIF y WebP de reserva a calidad ~45. Suavizar el suelo ahorraría casi la mitad (133 KB en WebP 72), pero se pide ya desenfocado en la foto móvil.

**Texto sobre la foto (medido en la maqueta con la foto real):** solo con el degradado inferior, en escritorio el 13,8 % de los píxeles de «Amanece» y el 19,9 % de «despacio.» quedan bajo 3:1. Con un degradado lateral añadido, el titular supera 3:1 y el párrafo 4,5:1 (en móvil, el 0,4 % de los píxeles del párrafo queda en 3,8:1). Se aplica en la fase 5 (ver `DESIGN.md`). Capturas: `docs/entregables/capturas/p01-escritorio-con-velo.jpg`.

**Móvil (problema):** el contenedor del héroe en un teléfono mide 390 × 772 (0,51). Con `cover`, esta foto 16:10 muestra solo el **32 % de su ancho**: se pierden los olivos y el mar, y la fachada queda cortada por las ventanas. Capturas: `docs/entregables/capturas/p01-movil-recorte-del-escritorio.jpg`. Por eso se pide una composición nativa 9:16 (`p01-hero-movil.md`).

**Pendiente de la persona:** aprobar o repetir con corrección. Nada pasa a `public/media/` sin esa aprobación.
