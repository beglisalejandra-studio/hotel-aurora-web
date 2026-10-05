# URLs de referencia

Una URL por línea (http/https). Nota opcional tras " — ". Las líneas que empiezan por # se ignoran.
Se procesan con `npm run refs` (capturas desktop/móvil, estructura y snapshot accesible en `extracted/` y `screenshots/`).

Todas las URLs de las rondas 1 y 2 fueron **abiertas el 2026-10-05**: la ronda 1 con el lector web (texto y estructura) y la ronda 2 con un Chromium real (capturas vistas, peso medido en los sitios en vivo). Las que fallaron están en «Descartadas». Las capturas de terceros **no se suben al repositorio** (derechos de autor): viven solo en la sesión de trabajo.

## Ronda 2 (v2): referencias globales, sin límite de país (18)
La persona pidió no descartar referencias que no sean de Colombia si son buenas. Las de origen colombiano o latinoamericano están marcadas.

### Dribbble (conceptos; la persona pidió https://dribbble.com/search/hotel-website)
https://dribbble.com/shots/27621821-Modernist-website — Outer Studio: la «o» del nombre es la ventana que se abre; de aquí sale el sol de AURORA
https://dribbble.com/shots/23650898-Omah-Jati-Private-Villa-Website — Plainthing Studio: nombre a ancho completo, barra de tres microetiquetas, filas con filete; **base de la maquetación**
https://dribbble.com/shots/27754026-Tuscan-Boutique-Hotel-Website-Corte-d-Oro — Liza Naumova: nombre cortado por la base, pildora única, índice en filas
https://dribbble.com/shots/25967623--1-Capsules — Moyra: pildora-menú que muta; de aquí sale el dock inferior
https://dribbble.com/shots/27080236-Editorial-Portfolio-Horizontal-Scroll-Gallery — Mariotti: mecánica de acordeón (no se adopta su tema negro)
https://dribbble.com/shots/10154334-Totec-Boutique-Hotel-Web-Design — Vaicius: calendario como pieza gráfica con numerales
https://dribbble.com/shots/25302563-Uno-Uno-hotel-branding — conquest, **Getsemaní, Cartagena** (Colombia): plano de calles como mapa; el verde y la arena exactos no se usan
https://dribbble.com/shots/20891256-Grand-Emily-Hotel-Website — Afterglow: trazo único hasta el mapa, widget de reserva como línea tipográfica

### Hoteles reales y sitios de interacción
https://www.etthem.se/ — Ett Hem (Suecia): un eje central, ilustración de línea; su GIF de 1,17 MB es lo que se evita
https://www.publichotels.com/ — PUBLIC (EE. UU.): nombre en SVG a 100vw e inversión de plano; su SDK de reservas (1,31 MB) es lo que se evita
https://hyllhotel.com/ — Hyll (Reino Unido): lienzo casi vacío, cabecera de tres zonas
https://azulik.com — Azulik (México, Tulum): reserva como píldora fija inferior; Elementor + Swiper + jQuery es lo que se evita
https://rauno.me/ — Rauno Freiberg: regla de horas; se toma la idea, no el secuestro de la rueda
https://white-desert.com/ — White Desert: nombre que se eleva y se disuelve ligado al scroll (en Aurora, en CSS puro)
https://kaanarchitecten.com/ — KAAN Architecten (Países Bajos): índice tipográfico, 845 KB en total

### Raíces latinoamericanas
https://www.tarqstudio.com/es — TARQ (**Colombia**, Bogotá): capítulos con título partido, habitación como fila-leyenda
https://marfala.com — Marfala (**Colombia** según el directorio de Awwwards; atribución no verificada): nombre gigante como capa de fondo
https://jorgetoloza.co — Jorge Toloza (**Colombia**): tipografía cinética en CSS; se toma solo la técnica (su sitio pesa 8,7 MB)

## Ronda 1 (v1, rechazada por genérica): hoteles y piezas de detalle
https://www.anandahotelboutique.com/ — hotel boutique real en el centro histórico de Cartagena; contraste: qué superar (sin reserva visible, imágenes rotas)
https://www.schlosshotel-kitzbuehel.com/en — «Book» y «Enquire» siempre a mano, habitaciones con precio y página propia
https://vanderhotel.com/ — voz de marca con personalidad
https://www.aman.com/ — fotografía a sangre, mucho aire (la v2 ya no se apoya en fotografía a sangre en la portada)
https://www.velaaprivateisland.com/ — narrativa en lugar de lista de servicios
https://faithibiza.com/ — navegación por intención; su video de portada se descarta por peso móvil
https://www.awwwards.com/websites/hotel/ — listado de hotelería premiada
https://21st.dev/@cnippet-dev/components/v-calendar-15 — calendario con llegada, salida y noches
https://21st.dev/@shadcnspace/components/calendar-range-select — rango con extremos en píldora
https://21st.dev/@kedhareswer/components/hotel-showcase — galería con GSAP (NO se adopta por peso)
https://21st.dev/@jean.duthil13/components/hero-scrub — secuencia en canvas (NO se adopta: costoso en móvil)

## Fuentes técnicas y de datos
https://nextjs.org/docs/app/guides/progressive-web-apps — guía oficial de PWA en Next.js (versión 16.3.8)
https://docs.protomaps.com/ — mapas vectoriales en un solo archivo PMTiles con MapLibre
https://developers.facebook.com/docs/whatsapp/cloud-api/get-started — API de WhatsApp Business: plantillas y ventana de 24 horas
https://supabase.com/docs/guides/auth — autenticación y seguridad por fila
https://colombia.travel/es/cartagena — atractivos y dato UNESCO 1984 (portal oficial de turismo de Colombia)

## Descartadas (no se enviaron al cliente)
# https://www.thehoxton.com/ — respondió 403, no se pudo leer
# https://www.mrandmrssmith.com/ — respondió, pero sin detalle de diseño utilizable
# https://whc.unesco.org/en/list/285 — respondió 403; el dato de la UNESCO se tomó de colombia.travel
# https://www.casasanagustin.com/ — el dominio está a la venta, no es un hotel
# https://www.hotelcapellan.com/ — es un hotel de Asturias (España), no el de Getsemaní
# https://www.casapestana.com/ — el dominio no resuelve
# Awwwards (502), CSS Design Awards (captcha), Siteinspire (429), Lapa Ninja y Land-book (403): las menciones de Awwwards salen de un resumen y no se verificaron en navegador
# Mr & Mrs Smith, Six Senses, Aman (interior), Peninsula, Passalacqua, Hotel San José, Casa del Coliseo, Tcherassi, Casa Canabal, Habitas, Chable: 403 o 502, no se vieron
