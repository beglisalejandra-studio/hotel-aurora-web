# Material que necesito de ti: imágenes (prompts y medidas)

Este es el **índice único** de lo que hay que producir. **Todos los prompts juntos, para copiar y pegar: [`PROMPTS.md`](PROMPTS.md).** Cada imagen tiene su ficha (`<nombre>.md`) con el prompt completo para **ChatGPT o Gemini**, las medidas exactas y qué conservar.

> **Aviso:** las fichas de la primera versión (patio, arcos, buganvilia, verdeazulado y coral) **se descartaron** porque el diseño cambió (v2: color plano por hora, sin fotografía en la portada). **No generes imágenes de la v1.** Siguen en el historial de git por si se quieren recuperar.

## Cómo subirlas
1. Genera la imagen con el prompt de su ficha.
2. Súbela a **`creative/inbox/`** con el nombre exacto de la tabla (`.jpg`, `.png` o `.webp`; **no SVG**).
3. Dime «subí <nombre>» y compruebo medidas, proporción y peso contra la ficha.
4. **Tú apruebas** cada imagen. Hasta entonces es un borrador y no se publica.

> Hasta que lleguen, la maqueta muestra en cada ventana un glifo plano por hora (sol bajo, alto, poniente y creciente). Con el botón «Guía de fotos» (visible en la página de cada habitación) ves el código y la medida de cada hueco.

## Lote único: 4 imágenes (una por habitación)
| Archivo (`creative/inbox/…`) | Hora | Proporción | Medida del máster | Dónde se usa | Texto alternativo sugerido |
|---|---|---|---|---|---|
| `r-alba` | 6 a. m. | 1:1 | 2560 × 2560 px | ventana circular de la habitación Alba | Habitación Alba con cama king de lino blanco frente a una ventana abierta al patio, con luz rosada de las 6 de la mañana |
| `r-mediodia` | 12 m. | 1:1 | 2560 × 2560 px | ventana circular de Mediodía | Habitación Mediodía con balcón abierto sobre el patio y un desayuno servido sobre una mesa pequeña, con luz cenital cálida |
| `r-atardecer` | 6 p. m. | 1:1 | 2560 × 2560 px | ventana circular de Atardecer | Habitación Atardecer con balcón a la calle y luz anaranjada que dibuja un rectángulo coral sobre el muro |
| `r-noche` | 10 p. m. | 1:1 | 2560 × 2560 px | ventana circular de Noche | Habitación Noche con puertas de vidrio a una terraza privada y la ciudad encendida al fondo |

Reglas comunes: mínimo **1600 px en el lado mayor**, **hasta 4 MB** por archivo, color sRGB, **sin texto ni logotipos dentro de la imagen**. Yo las convierto a AVIF y WebP.

## Consejos para que las cuatro se vean como de la misma casa
- Genera **las cuatro en la misma conversación**. Cuando apruebes `r-alba`, adjúntala a las siguientes con la frase: *«Usa la imagen adjunta como referencia de estilo y de nivel de detalle; cambia solo la hora, la luz y el color dominante»*.
- **Recorte circular:** el sujeto va centrado y lo importante en el 80 % central. Si queda muy cerca del borde, pide *«aleja la cámara y deja más aire alrededor»*.
- Rotularemos las imágenes como **ilustrativas** (generadas con IA), porque el hotel es ficticio.
- El color dominante de cada hora sale de la paleta elegida. Los prompts usan «Luz del día»; si eliges Fachadas o Añil, se ajustan los colores.

## Fotos de las atracciones: **reales, no generadas**
Las atracciones (Ciudad Amurallada, Getsemaní, Castillo de San Felipe, Convento de la Popa, Bocagrande, Islas del Rosario) son lugares reales: **no se generan con IA**. En la maqueta v2 no se muestran fotos de ellas (la lista y el esquema bastan); si más adelante se quieren:
- Fotos propias o de alguien que dé permiso por escrito.
- Fotos con licencia abierta (por ejemplo Wikimedia Commons), anotando autor, enlace y licencia en `creative/manifest.json` y dando el crédito que la licencia exija.
- Medida sugerida: **3:2, 1800 × 1200 px**, hasta 4 MB.

## Logotipo e íconos
- **Logotipo:** lo construyo yo como SVG limpio: la palabra **AURORA en mayúsculas gruesas (Anybody 800) con la «O» convertida en el sol** (un círculo con aro), tal como se ve en la portada. Los generadores de imágenes no producen vectores fiables.
- **Si quieres explorar alternativas con ChatGPT o Gemini** (solo ideas, 1:1, **2048 × 2048 px**, PNG con fondo blanco): *«Seis variantes de un logotipo minimalista para un hotel boutique llamado AURORA: la palabra en mayúsculas muy gruesas y compactas, con la letra O sustituida por un círculo-sol relleno con un aro grueso, un solo color negro sobre fondo blanco, vectorial plano, sin degradados, sin sombras, sin texto adicional.»*
- **Íconos de la app (PWA):** los genero yo desde el SVG: 192 × 192, 512 × 512, 512 × 512 «maskable» (zona segura del 80 %), 180 × 180 (iOS) y favicon. No necesitas hacer nada.
- **Imagen para compartir en redes (1200 × 630 px):** la compongo yo con el logotipo sobre el campo de color de la hora.

## Video: no se necesita
El cálculo `VIDEO_SCORE` de la portada dio **28 → imagen**, y la v2 mueve el sol, el color y las secciones solo con CSS (sin video, sin librerías). Si más adelante quieres un microvideo, se evalúa de nuevo con `VIDEO_SCORE` y requiere tu aprobación.

## Antes de publicar cualquier imagen
- [ ] La aprobaste tú.
- [ ] Tiene texto alternativo.
- [ ] Hay constancia de su procedencia en `creative/manifest.json` (generada con IA, propia o con licencia).
- [ ] Si es generada: rotulada como ilustrativa.
