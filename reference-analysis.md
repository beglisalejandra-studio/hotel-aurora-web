# Análisis de referencias — resumen ejecutivo

> Detalle, tabla de las 18 referencias y vacíos: `creative/references/reference-analysis.md`. Enlaces: `creative/references/urls.md`. Aquí solo los **principios adoptados** (no se clonan textos, código, imágenes, logos ni diseños protegidos). Análisis hecho el 2026-10-05 con un Chromium real; las capturas de terceros no se suben al repositorio.

## Por qué hay una v2
La v1 se rechazó por **genérica** (colores y tipografías corrientes, maquetación de hotel de plantilla). Pedido de la persona: más minimalista y con motion graphic; tomar la maquetación de referencias de Dribbble (`dribbble.com/search/hotel-website`), no mantener la propia; y no descartar buenas referencias por no ser de Colombia.

## Principios adoptados
| # | Principio | Referencias | Dónde se ve en la maqueta |
|---|---|---|---|
| 1 | **Una idea gráfica por pantalla**; el resto es tipografía, filete y vacío | Omah Jati, Ett Hem, PUBLIC | Portada: AURORA a ancho completo con la «o» convertida en sol |
| 2 | **El movimiento explica un cambio de estado**, no decora | Modernist, Capsules, White Desert | El sol inunda la pantalla con la hora siguiente; el cambio de hora cambia el color de toda la página |
| 3 | **La tipografía es el motion graphic** (eje de ancho variable, nombre a escala de pantalla) | Modernist, PUBLIC, Toloza | Anybody con eje `wdth` en los titulares |
| 4 | **Filas con filete en lugar de tarjetas iguales** | Omah Jati, KAAN, TARQ | Habitaciones y lugares como filas «nombre · dato · precio o distancia» |
| 5 | **Reserva como pieza tipográfica alcanzable con el pulgar**, no widget de cuatro cajas en el hero | Corte d'Oro, Capsules, AZULIK, Grand Emily | Línea «Fechas · Huéspedes» y dock inferior; el calendario es una hoja |
| 6 | **Color como identidad** (campo plano, sin degradados, sin beige + dorado + serif) con contraste verificado | Uno II Uno (solo el principio), Hyll | Un campo por hora del día; 3 paletas conmutables |
| 7 | **Ligereza como requisito**: CSS nativo, 0 librerías de animación, estado base = estado final | KAAN (845 KB), Rauno (651 KB) frente a premiados de 4 a 16 MB | Todo el movimiento detrás de `@supports` y `prefers-reduced-motion: no-preference` |

## Qué evitamos (y por qué)
- **La fórmula de lujo**: crema o beige + dorado o burdeos + serif didona o script, glassmorphism, 3D.
- **El cliché postal de Cartagena** (palenqueras, chivas, neón, turquesa + coral, arcos de piedra como adorno): las formas locales solo entran como estructura funcional.
- **Hero de plantilla**: titular centrado con dos botones, widget de reserva de cuatro cajas, carrusel de tarjetas iguales con estrellas.
- **Movimiento pesado u hostil**: video, WebGL, Lottie, GIF en el hero; scroll secuestrado; preloaders; bucles que repintan; animar `width` o `height`.
- **Prueba social sin evidencia** y fotografía de stock o IA uniforme: todo claim requiere evidencia en `PRODUCT.md`.
- **Copiar el aspecto de cualquier referencia**: de cada una se tomó un principio, no un diseño.
