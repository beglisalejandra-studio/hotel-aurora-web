# 01 · Propuesta de diseño UX/UI

> Se entrega y se aprueba ANTES de construir. Estado: **borrador en revisión (G1)**. Aprobada: pendiente (fecha y quién aprobó).

## Concepto
**Inmersión fotográfica.** El hotel vende por sus fotos y su vídeo, así que la portada es una foto a sangre y, al desplazarse, se la atraviesa y emergen las siguientes con CSS 3D nativo. Luminoso, inmersivo, sereno. Elemento firma: **el recorrido**. Evitamos formas geométricas decorativas (el arco y el disco de sol se descartaron por decisión del cliente), el hero centrado de plantilla, el preloader y la paleta crema con latón. Detalle en `DESIGN.md`.

## Referencias (enlaces verificados, abiertos el 2026-10-09)
| # | URL | Qué se toma (principio) | Qué NO se toma |
|---|---|---|---|
| 1 | https://www.sirhotels.com/en/albert/ | Titular grande sobre foto y botón de reserva siempre a mano | Cookies con "Aceptar" destacado; página única de 12.500 px |
| 2 | https://parklanecph.com/en/ | Paquetes y experiencias con entrada propia; FAQ | Cuatro vídeos en bucle sin póster en la portada |
| 3 | https://www.roroshotellene.no | Idioma, teléfono y correo tocables en la cabecera | Fondo cálido pastel, común a todo el sector |
| 4 | https://www.hospes.com/en/ | Barra de reserva en el héroe; navegación por intención | Fondo crema |
| 5 | https://www.thehoxton.com | Beneficios de reservar directo junto a la acción | Cookies con "Aceptar" destacado |
| 6 | https://www.kinfolk.com | Rigor tipográfico y silencio | Serif editorial |
| 7 | https://www.apartamentomagazine.com | Bloques de color plano como ritmo | Paleta saturada |
| 8 | https://explore.ownprimland.com | Atmósfera (bruma) sobre base fotográfica | 16,65 MB, preloader, audio |
| 9 | https://oryzo.ai | Tipografía y foto a distintas profundidades | 13,92 MB, 130 peticiones |
| 10 | https://21st.dev/@ruixen.ui/components/scroll-image-tunnel | Fotos que crecen desde el centro al desplazarse | Dependencia de framer-motion: se hace con CSS nativo |
| 11 | https://21st.dev/@hyperiux/components/interactive-blur-reveal | Foto que reacciona al cursor | Shader WebGL2 de pantalla completa |
| 12 | https://docs.mews.com/booking-engine-guide/booking-engine-widget | Reserva en superposición sin salir de la web | n/a |

Análisis completo y capturas: `reference-analysis.md` y `creative/references/`. Pesos medidos de los sitios 3D: ADR-0006.

## Cómo se verá, plataforma por plataforma
| Plataforma | Qué cambia en el diseño | Capturas |
|---|---|---|
| Móvil (390 px) | Foto vertical 4:5 a sangre con texto abajo y un único botón "Reservar"; el recorrido usa planos pequeños con pie en panel inferior; carrusel de habitaciones con `scroll-snap`; objetivos ≥ 44 px | `capturas/walk-m-0.png`, `capturas/walk-m-50.png`, `capturas/reserva-movil.png` |
| Tablet (768 px) | Barra de reserva en cuatro columnas; recorrido con pies laterales | Sin capturar en esta ronda (comprobado: 0 px de desborde y sin errores) |
| Escritorio (1440 px) | Foto horizontal 16:10 a sangre, barra de reserva con cuatro campos, recorrido con pies alternados izquierda y derecha, efectos de puntero | `capturas/walk-d-0.png`, `capturas/walk-d-30.png`, `capturas/walk-d-50.png`, `capturas/reserva-escritorio.png`, `capturas/ficha-habitacion-escritorio-en.png` |
| App instalada (PWA) | No se plantea en esta fase | n/a |

## Experiencia de usuario
- **Perfiles:** parejas y pequeños grupos de 30 a 55 años (hipótesis), de España y Europa, que reservan desde el móvil. Objetivo principal: **reservar directo**. Secundarios: pedir mesa, pedir cita de spa, comprar un bono, escribir por WhatsApp.
- **Recorrido de conversión:** portada con fechas, luego la ventana de reserva (Fechas, Habitación, Confirmar) con pago en el motor de reservas. Fricciones que quitamos: sin cuenta, sin salir de la web, formularios con datos mínimos y consentimiento claro, WhatsApp y teléfono siempre a mano.
- **Mapa del sitio y navegación:** Inicio, Habitaciones (listado y ficha), Restaurante, Spa, Paquetes, Experiencias, El hotel y cómo llegar, Preguntas frecuentes, Contacto, Gracias, Aviso legal, Privacidad, Cookies, Condiciones. Navegación de una línea en escritorio y menú en móvil, con "Reservar" siempre visible.
- **Estados:** carga (esqueleto en la búsqueda de habitaciones), vacío (sin disponibilidad, con salida a WhatsApp), error (bajo cada campo, se borra al corregir), éxito (confirmación y página de gracias).
- **Accesibilidad:** contraste AA calculado, teclado completo con trampa de foco y Escape en diálogos, `h1` siempre disponible, enlace "Saltar el recorrido", movimiento reducido con alternativa estática, axe sin violaciones en 7 estados de la maqueta.
- **Interactividad:** botones con relleno direccional y atracción magnética, tema con revelado circular, tarjetas que se inclinan, foco cálido sobre las fotos, barra de progreso, carril de habitaciones con progreso, todo con CSS nativo y sin librerías.

## Maqueta
`creative/mockup/index.html` (autocontenida, ~105 KB, fuentes por CDN). Incluye inicio, ficha de habitación (4 habitaciones desde una plantilla), simulación de la reserva, solicitudes de mesa, cita y bono, banner de cookies con Consent Mode v2, asistente de IA con aviso, WhatsApp, selector ES/EN y tema Día/Madrugada.

**Autocrítica (5 cosas que parecían genéricas y qué se hizo):**
1. Arco y disco de sol: forma decorativa que no gustó. **Eliminados**; la firma pasó a ser el recorrido fotográfico.
2. Texto del héroe y de las estaciones sobre elementos de fondo con contraste insuficiente. **Pies en panel sólido** y degradado bajo el texto del héroe.
3. Banner de cookies tapando la barra de reserva. **Franja inferior** que no la cubre en escritorio.
4. Botón flotante tapando el CTA en móvil. **Subidos los pies y el héroe** para dejarle sitio.
5. Desbordes horizontales (hasta 139 px en móvil) por un `min-height` con `aspect-ratio`. **Corregidos**: 0 px en 390, 768 y 1440.

**Decisiones pendientes para la persona:**
1. **Fotografía:** sin fotos reales la maqueta usa huecos rotulados; ver `creative/briefs/pedido-de-materiales.md` (opciones A, B o C).
2. Vídeo en el recorrido y el restaurante (V01 a V03): lo decide `VIDEO_SCORE` en la fase 4.
3. Héroe WebGL 2,5D y visor 360: ¿los exploramos como opcionales?
4. Longitud del recorrido (unas cuatro pantallas): ¿se acorta?
5. Las cinco preguntas de negocio de `PRODUCT.md`.
