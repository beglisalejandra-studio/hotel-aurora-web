# Análisis detallado de referencias

Hecho el 2026-10-05. **Ronda 1** (v1, rechazada): lectura de texto y estructura con el lector web. **Ronda 2** (v2, vigente): páginas abiertas en un Chromium real, capturas vistas, peso medido en los sitios en vivo y 18 referencias elegidas entre 333 candidatos únicos de 11 búsquedas de Dribbble más premiados, hoteles, motion, tipografía y raíces latinoamericanas.

Lo que **no** se afirma: tipografías o colores que el navegador no devolvió; el país de quien diseñó cada shot de Dribbble (sin sesión no aparece); pesos de los conceptos de Dribbble (son mp4 o imagen: lo que se estima es lo que costaría implementar la técnica). Las puntuaciones de 1 a 5 en Impacto, Movimiento, Motion graphic y Ligereza son de criterio, no mediciones.

## Ronda 2: las 18 referencias y qué se toma de cada una
Clave: **T** = qué se toma (principio, no diseño) · **E** = qué se evita.

| # | Referencia | Origen | T | E |
|---|---|---|---|---|
| 1 | [Modernist website](https://dribbble.com/shots/27621821-Modernist-website), Outer Studio | Dribbble | La «o» del nombre como ventana: en Aurora, la «o» es un sol que inunda la pantalla con la hora siguiente | Miniaturas de mobiliario y panel lavanda; el h1 debe ser texto real |
| 2 | [Omah Jati](https://dribbble.com/shots/23650898-Omah-Jati-Private-Villa-Website), Plainthing Studio | Dribbble | Nombre a ancho completo, barra de tres microetiquetas (Menú · lugar y hora · Reservar), habitaciones como tabla de filas con filete. **Es la base de la maquetación v2** | La hoja-letra, su tipografía y su foto; microetiquetas de 11 a 13 px |
| 3 | [Corte d'Oro](https://dribbble.com/shots/27754026-Tuscan-Boutique-Hotel-Website-Corte-d-Oro), Liza Naumova | Dribbble | Nombre cortado por la base en el pie, píldora única de reserva, índice en filas, calendario como pantalla propia | Foto IA toscana, crema + vino, script en el logo |
| 4 | [#1 Capsules](https://dribbble.com/shots/25967623--1-Capsules), Moyra | Dribbble | Píldora de navegación abajo-centro que alcanza el pulgar: el dock de Aurora | Fotografía IA del desierto; el interruptor debe ser `button` con `aria-expanded` |
| 5 | [Ett Hem](https://www.etthem.se/) | Suecia | Un eje central y mucho vacío | GIF de 1,17 MB sin pausa ni reduced-motion; solape del libro con el logo en móvil |
| 6 | [PUBLIC Hotels](https://www.publichotels.com/) | EE. UU. | Nombre en SVG a 100vw y la inversión de plano como transición: funciona sin foto | SDK de reservas de 1,31 MB (4,51 MB en total); sin texto indexable; hover sin equivalente táctil |
| 7 | [Editorial Portfolio, Horizontal Scroll](https://dribbble.com/shots/27080236-Editorial-Portfolio-Horizontal-Scroll-Gallery), Mariotti | Dribbble | Mecánica de acordeón de habitaciones | Tema negro con fotos saturadas |
| 8 | [Rauno Freiberg](https://rauno.me/) | Estonia | Regla de horas y reloj que cambia: base de «una habitación por hora» | Secuestro de la rueda (overflow-x medido en móvil); sin reduced-motion |
| 9 | [Totec](https://dribbble.com/shots/10154334-Totec-Boutique-Hotel-Web-Design), Vaicius | Dribbble | Calendario como pieza gráfica con numerales | B/N tropical, serif didona |
| 10 | [Hyll Hotel](https://hyllhotel.com/) | Reino Unido | Lienzo cálido casi vacío; cabecera de tres zonas siempre visible | Modales de cookies y newsletter sobre el hero; 3,0 MB; hero sin propuesta de valor |
| 11 | [TARQ](https://www.tarqstudio.com/es) | **Colombia** (Bogotá) | Capítulos con título partido, habitación como fila-leyenda, reserva fuera del hero | Texto de 9 px; el título partido solo funciona en pantallas anchas |
| 12 | [Uno II Uno](https://dribbble.com/shots/25302563-Uno-Uno-hotel-branding), conquest | **Colombia** (Getsemaní) | Plano de calles como fondo de mapa; composición foto / panel de color pleno | El verde #006508 y la arena exactos, el nombre y la marca |
| 13 | [Marfala](https://marfala.com) | **Colombia** (según directorio de Awwwards, no verificado) | Nombre condensado gigante como capa de fondo; glifo propio como botón de menú | Wordmark como único titular accesible; 2,8 MB de imágenes |
| 14 | [White Desert](https://white-desert.com/) | Antártida (operador) | Nombre que se eleva y se disuelve ligado al scroll (CSS puro) | 8,8 MB y 2,3 MB de JS; banner de cookies sobre el hero; intro que bloquea el scroll en móvil |
| 15 | [Grand Emily](https://dribbble.com/shots/20891256-Grand-Emily-Hotel-Website), Afterglow | Dribbble | Widget «Llegada · Salida · Huéspedes» como línea tipográfica que abre el calendario | Verde musgo + serif clara; foto de lobby de cadena |
| 16 | [Jorge Toloza](https://jorgetoloza.co) | **Colombia** | Intro corta de letras que se alinean; las cuatro esquinas como navegación | 8,7 MB de imágenes; 290 elementos con `will-change`; pantalla de carga blanca |
| 17 | [KAAN Architecten](https://kaanarchitecten.com/) | Países Bajos | Índice tipográfico sticky; la misma lista sirve para el mapa; `@view-transition` | Frialdad sin calidez; preloader de ~2 s; leyendas de 12 px sin margen de contraste |
| 18 | [AZULIK](https://azulik.com) | **México** | Reserva como píldora fija inferior que abre el calendario como hoja | Tapa 60 a 80 px de contenido en móvil; 1,55 MB de JS |

Colombia / Latinoamérica: 5 de 18 (TARQ, Uno II Uno, Marfala, Toloza, AZULIK). No se encontró referencia de Cali ni sitio de hotel de Cartagena con motion; las búsquedas de Dribbble «cartagena», «getsemani» y «chiva colombia» devuelven sobre todo ilustración de postal.

### Cinco arquetipos de maquetación que salieron de las referencias
1. **UMBRAL** (Omah Jati, Corte d'Oro, PUBLIC): el nombre a escala de pantalla y la fila como unidad. **Es la estructura de la portada v2.**
2. **FICHA** (KAAN, Totec, TARQ): índice tipográfico sticky y hoja de datos. De aquí salen las filas de habitaciones y el esquema de la ciudad.
3. **VENTANA** (Modernist, Capsules, Ett Hem): la «o» como portal y la píldora que muta. **De aquí salen el sol y el dock.**
4. **RIEL** (Rauno, Mariotti, Grand Emily): un día en Aurora y el trazo que conecta. De aquí sale «una habitación por hora».
5. **BRUMA** (Hyll, White Desert, Toloza): lienzo casi vacío y el nombre que se disuelve. De aquí sale el vacío intencional del hero.

## Qué se descarta de la ronda 1 (y por qué)
La v1 (fotografía a sangre, arcos de piedra, verdeazulado y coral, Bricolage Grotesque) fue **rechazada por genérica**. Sus referencias (Aman, Schlosshotel, Vander, Velaa, Faith, Anandá, Awwwards-Hotel y los calendarios de 21st) quedan solo como contexto del sector: se ve en `urls.md`.

## Vacíos conocidos
- **Calendario con precio:** de los hoteles reales solo se abrieron los calendarios de Locke, Beaumier y Ruby y ninguno mostraba precio ni disponibilidad. El de Aurora (punto y raya por día, precio por noche) no se validó contra un motor de reservas real.
- **Mapa ligero y accesible:** no hay referencia verificada. Se propone esquema SVG en la maqueta y MapLibre con PMTiles en producción.
- **Cuenta, instalación y estado sin conexión:** ninguna referencia lo mostró; el dock inferior es inferencia desde Capsules y AZULIK.
- **Móvil:** casi siempre inferido; los shots de Dribbble no lo muestran.
- **Safari y dispositivos reales:** no se vieron. En WebKit 26 headless los efectos ligados al scroll cambian el valor computado pero no se confirmó el cambio de píxeles; Firefox estable no soporta `animation-timeline`.
- **Tipografías con licencia ITF** (Cabinet Grotesk, Boska) no se pueden recortar ni subir a un repositorio público de portafolio; por eso se usa Anybody y Familjen Grotesk (OFL).
- **Sitios sin abrir** por 403 o 502: ver «Descartadas» en `urls.md`.

## Principios accionables y su impacto
Ver `../../reference-analysis.md`.
