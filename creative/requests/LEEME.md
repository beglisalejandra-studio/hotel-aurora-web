# Material que necesito de ti: imágenes (prompts y medidas)

Este es el **índice único** de lo que hay que producir. Cada imagen tiene su ficha (`<nombre>.md`) con el prompt completo para copiar y pegar en **ChatGPT o Gemini**, las medidas exactas y qué conservar.

## Cómo subirlas
1. Genera la imagen con el prompt de su ficha.
2. Súbela a **`creative/inbox/`** con el nombre exacto de la tabla (`.jpg`, `.png` o `.webp`; **no SVG**).
3. Dime «subí <nombre>» y compruebo medidas, proporción y peso contra la ficha.
4. **Tú apruebas** cada imagen. Hasta entonces es un borrador y no se publica.

> Hasta que lleguen, la maqueta usa degradados de color en su lugar (con la «Guía de fotos» activable en la franja superior verás el código y la medida de cada hueco).

## Lote A: lo mínimo para ver el sitio terminado (12 imágenes)
| Archivo (`creative/inbox/…`) | Proporción | Medida del máster | Dónde se usa | Texto alternativo sugerido |
|---|---|---|---|---|
| `h-01-patio-amanecer` | 4:5 | 2048 × 2560 px | portada (hero) | Patio del hotel al amanecer, con arcos de piedra, buganvilia y luz cálida |
| `c-01-patio-central` | 3:4 | 1920 × 2560 px | «La casa» | Patio central visto desde un corredor con arcos |
| `c-02-balcones` | 3:5 | 1536 × 2560 px | «La casa» | Fachada con balcones de madera y buganvilias |
| `c-03-terraza` | 5:6 | 2134 × 2560 px | «La casa» | Terraza al amanecer con la ciudad al fondo |
| `d-01-cafe-patio` | 7:8 | 2240 × 2560 px | «Un día en Aurora» | Taza de café sobre una mesa en el patio |
| `r-alba` | 3:4 | 1920 × 2560 px | tarjeta y página de la habitación Alba | Habitación Alba con cama king y ventana al patio |
| `r-patio` | 3:4 | 1920 × 2560 px | habitación Patio | Habitación Patio con balcón sobre el patio |
| `r-buganvilia` | 3:4 | 1920 × 2560 px | habitación Balcón de Buganvilia | Habitación con balcón de madera y buganvilia |
| `r-terraza` | 4:5 | 2048 × 2560 px | habitación Terraza Aurora (portada y vista general) | Suite Terraza Aurora con terraza privada |
| `r4-cama` | 1:1 | 2560 × 2560 px | galería Terraza Aurora | Cama con ropa de lino blanco y luz lateral |
| `r4-bano` | 1:1 | 2560 × 2560 px | galería Terraza Aurora | Baño con piso de baldosa de cemento |
| `r4-detalle` | 1:1 | 2560 × 2560 px | galería Terraza Aurora | Detalle de la terraza con mesa y planta |

Reglas comunes a todas: mínimo **1600 px en el lado mayor**, **hasta 4 MB** por archivo, color sRGB, **sin texto ni logotipos dentro de la imagen**. Yo las convierto a AVIF y WebP.

## Consejos para que las imágenes se vean como de la misma casa
- Genera **todas en la misma conversación**. Cuando apruebes `h-01`, adjúntala a las siguientes con la frase: *«Usa la imagen adjunta como referencia de estilo, paleta y luz»*.
- Pide el formato en la propia frase (ya viene en cada prompt). Si la herramienta no respeta la proporción exacta, recórtala; lo importante es que no quede por debajo de 1600 px.
- **Recorte en arco:** el borde superior se corta con una semicircunferencia. Si el sujeto queda muy arriba, pide *«desplaza el sujeto hacia abajo»*.
- Rotularemos las imágenes como **ilustrativas** (generadas con IA), porque el hotel es ficticio.

## Lote B (después de aprobar el A)
Tres galerías más de cuatro imágenes (Alba, Patio y Balcón de Buganvilia). Las pediré con el mismo formato cuando apruebes el lote A.

## Fotos de las atracciones: **reales, no generadas**
Las atracciones (Ciudad Amurallada, Getsemaní, Castillo de San Felipe, Convento de la Popa, Bocagrande, Islas del Rosario) son lugares reales: **no se generan con IA**. Opciones:
- Fotos propias o de alguien que dé permiso por escrito.
- Fotos con licencia abierta (por ejemplo Wikimedia Commons), anotando autor, enlace y licencia en `creative/manifest.json` y dando el crédito que la licencia exija.
- Medida sugerida: **3:2, 1800 × 1200 px**, hasta 4 MB. Es opcional y va en la fase 2.

## Logotipo y íconos
- **Logotipo:** lo construyo yo como SVG limpio (palabra «Aurora» en Bricolage Grotesque 600 más un arco con un punto de sol, tal como se ve en la maqueta). Los generadores de imágenes no producen vectores fiables.
- **Si quieres explorar alternativas con ChatGPT o Gemini** (solo ideas, 1:1, **2048 × 2048 px**, PNG con fondo blanco): *«Seis variantes de un logotipo minimalista para un hotel boutique llamado Aurora en Cartagena de Indias: un arco de medio punto con un pequeño sol sobre él, trazo único, vectorial plano, sin degradados, un solo color coral sobre fondo blanco, sin texto adicional.»*
- **Íconos de la app (PWA):** los genero yo desde el SVG: 192 × 192, 512 × 512, 512 × 512 «maskable» (zona segura del 80 %), 180 × 180 (iOS) y favicon. No necesitas hacer nada.
- **Imagen para compartir en redes (1200 × 630 px):** la compongo yo con el logotipo y la imagen del hero.

## Video (opcional, hoy NO recomendado)
El cálculo `VIDEO_SCORE` de la portada dio **28 → imagen** (el microvideo empieza en 30) y tu prioridad es la velocidad en el celular. Si más adelante quieres un microvideo **solo para escritorio**, el pedido sería: **1920 × 1080 px (16:9), 6 segundos, en bucle, sin audio, máximo 1,5 MB ya optimizado**, con este prompt para Gemini (Veo) o ChatGPT (Sora):
*«Plano lento hacia adelante por un patio colonial de hotel boutique en Cartagena de Indias a la luz de las 6 de la mañana; el cielo pasa de azul verdoso a coral; arcos de piedra, postigos de madera, buganvilia; sin personas, sin texto, sin logotipos; bucle perfecto de 6 segundos, fotorrealista.»*
Requiere tu aprobación y se carga solo en pantallas ≥ 900 px, sin movimiento reducido y después de pintar la imagen principal.

## Antes de publicar cualquier imagen
- [ ] La aprobaste tú.
- [ ] Tiene texto alternativo.
- [ ] Hay constancia de su procedencia en `creative/manifest.json` (generada con IA, propia o con licencia).
- [ ] Si es generada: rotulada como ilustrativa.
