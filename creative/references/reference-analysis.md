# Análisis detallado de referencias

Fuente: `extracted/<slug>.json` y `screenshots/<slug>-{desktop,mobile}.png` (capturas del 2026-10-09). Las capturas de página completa de Park Lane y Røros salen con huecos porque cargan imágenes en diferido: de ellas se usa la estructura (JSON), no el aspecto visual. Las lecturas visuales se hicieron sobre Sir Albert, Hospes, Kinfolk, Apartamento y The Hoxton.

| Dimensión | Observación | Adoptar / evitar |
|---|---|---|
| **Hero** | Sir Albert: imagen enmarcada y titular enorme (Didot) que se solapa con la foto; botón BOOK circular fijo. Hospes: foto a pantalla completa con lema y barra de reserva (Dónde, Cuándo, Quién, Código, Buscar). Park Lane: vídeo en portada con selector de fechas. Røros: vídeo y panel de reserva | Adoptar: titular que se solapa con la imagen y barra de reserva integrada. Evitar: vídeo de portada sin póster |
| **Navegación** | Sir Albert: anclas dentro de una sola página (HOTELS, ROOMS & SUITES, SPECIALS...). Hospes: menú hamburguesa, idioma, acceso, teléfono y "Benefits of booking". Røros: conmutador de idioma y teléfono/correo tocables. Park Lane: Rooms, Apartments, Experiences, Neighbourhood, Restaurants | Adoptar: idioma, teléfono y "Reservar" siempre visibles. Evitar: navegación solo por anclas |
| **Jerarquía y densidad** | Hospes y Hoxton alternan texto breve con carruseles de tarjetas. Park Lane apila habitaciones a pantalla completa. Sir Albert: página de unos 12.500 px | Adoptar: ritmo con secciones de familias distintas. Evitar: página única interminable |
| **CTA** | Hospes: "Search" oscuro y "Benefits of booking" en cabecera. Hoxton: "Find a room" en bloque coral. Park Lane: "Book room" en bloque final. Sir Albert: BOOK circular | Adoptar: una sola etiqueta para la reserva ("Reservar"). Evitar: varias etiquetas para la misma intención |
| **Formularios** | Barras de reserva con 4 campos (Hospes); alta de newsletter con descuento del 5% (Hospes) y con nombre y correo (Hoxton) | Adoptar: pedir solo lo necesario. Evitar: descuentos como gancho sin política escrita |
| **Prueba social / evidencia** | Insignias de sostenibilidad y calidad (Hospes), sello Michelin (Park Lane) | Adoptar: solo con evidencia real. Aurora no publica sellos ni reseñas inventados |
| **Color · tipografía · spacing** | Cuerpo: Gotham 16/24 (Park Lane), APK Protocol 16/22 (Røros), Didot 06 con Helvetica (Sir Albert), Figtree 17,4/26 (Hospes), serif 20/30 (Kinfolk), Futura PT 18/26 (Apartamento). Fondos cálidos en los cinco hoteles | Adoptar: cuerpo de 16 a 18 px con interlínea ≥ 1,5. Evitar: la paleta cálida común |
| **Motion** | Park Lane: 0 animaciones en curso y reglas de movimiento reducido. Sir Albert: ninguna regla de movimiento reducido. Kinfolk: 37 reglas de movimiento reducido | Adoptar: respetar `prefers-reduced-motion`. Evitar: movimiento sin motivo |
| **Responsive** | Capturas móviles en `screenshots/*-mobile.png` | Adoptar: carruseles con `scroll-snap` y botón de reserva fijo en móvil |
| **Consentimiento** | Hospes: "Reject" y "Accept" del mismo estilo más "Settings" en texto. Sir Albert: "Permitir todos" relleno, "Rechazar" con contorno. Hoxton: "Aceptar todas" relleno frente a "Configuración" con contorno | Adoptar el modelo de Hospes pero con **Configurar al mismo nivel** que los otros dos |

**Principios accionables y su impacto esperado:** ver `../../reference-analysis.md`.

## 3D e inmersivo: lo medido y lo aprendido (2026-10-09)
Capturas en `refs3d/` (no versionadas) con Chromium sin cabeza y render por software. **Bytes reales; tiempos no representativos.**

| Sitio | Transferencia | Qué se ve al cargar | Idea que se toma | Qué NO se toma |
|---|---|---|---|---|
| Explore Primland | 16,65 MB, 72 peticiones | Pantalla de carga con logo y, mucho después, vista aérea fotográfica con nubes que se desplazan, titular que se revela y botón "Explore the map" | **Capas de atmósfera sobre una base fotográfica** (aquí, bruma CSS) | Preloader, audio, peso |
| Oryzo | 13,92 MB, 130 peticiones | Pantalla de carga y luego foto del producto con tipografía enorme parcialmente transparente | **Tipografía y foto a distintas profundidades** | 82 imágenes en la carga |
| Hubtown | 22,71 MB, 97 peticiones | Pantalla "100 % loaded, ready to explore" | Revelado bajo el cursor (aquí, foco cálido en CSS) | Preloader |
| Sleep Well Creatives | 42,86 MB, 67 peticiones, 20 vídeos | Pantalla "Loading" | Narrativa que avanza con el scroll | 43 MB |

**Conclusión de diseño:** los cuatro anteponen un preloader a la primera vista. Aurora hace lo contrario: la portada es la foto y se ve de inmediato; la profundidad se añade con CSS nativo y es progresiva.
