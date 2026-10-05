# Análisis detallado de referencias

Fuente de cada observación: lectura de la página con el lector web del agente el 2026-10-05 (texto y estructura, no capturas visuales). Donde el lector no devolvió un dato (tipografía exacta, colores), **no se afirma**. Las capturas por lote se harán con `npm run refs` al empezar la implementación.

| Dimensión | Observación | Adoptar / evitar |
|---|---|---|
| **Aman** (aman.com) |  |  |
| Hero | imágenes a todo ancho de destinos, arquitectura dentro del paisaje | adoptar: imagen como protagonista |
| Navegación | 36 propiedades en tres regiones; subtítulos geográficos («Playa Grande, República Dominicana») | adoptar: dar contexto de lugar a cada punto del mapa |
| Jerarquía y densidad | mucho espacio negativo; bloques separados | adoptar: densidad baja (VISUAL_DENSITY 3) |
| Copy | narrativa atmosférica en lugar de listas de comodidades | adoptar con voz propia |
| **Schlosshotel Kitzbühel** |  |  |
| Hero | fotografía grande con poco texto («Some places whisper rather than shout») | adoptar: poco texto sobre la imagen |
| CTA | «Book» y «Enquire» en posiciones constantes | adoptar: CTA persistente; evitar el motor externo |
| Habitaciones | rejilla con miniatura y precio («desde €189 por persona»), cada una con página | adoptar: tarjeta con precio desde y página propia |
| Mapa | solo dirección en el pie, sin mapa interactivo | superar: mapa con puntos y modos de traslado |
| **Vander Urbani Resort** |  |  |
| Tono | copy con personalidad, numeración grande, categorías simples de habitación | adoptar: voz propia; evitar el humor forzado |
| Paleta | cálida y natural (madera, neutros) | evitar copiar: nuestra paleta es verdeazulada y coral |
| **Velaa Private Island** |  |  |
| Narrativa | prosa emocional; alojamientos como refugios personales | adoptar: habitaciones presentadas por cómo se despierta en ellas |
| Navegación | 10 o más secciones principales | evitar: la navegación de Aurora tiene 3 enlaces |
| **Faith Ibiza** |  |  |
| Hero | video de fondo y «Scroll to discover» | evitar: video y señal de scroll |
| Navegación | por ocasiones (intención) | adoptar el principio: ayudar a decidir por intención |
| **Anandá Hotel Boutique** (Cartagena) |  |  |
| Estado del sitio | menciona 23 habitaciones, galería y bodas; imágenes que no cargan en la lectura; sin motor de reservas visible | tomar como punto de partida del sector: oportunidad clara de superar |
| **Awwwards, colección Hotel** |  |  |
| Rasgos comunes | tipografía cuidada (mencionan DM, Futura, Cormorant), microinteracciones, imagen a pantalla completa, parallax | adoptar: tipografía y microinteracción; evitar: parallax con JavaScript pesado |
| **Calendarios de 21st** |  |  |
| Patrón | rango de fechas con extremos en píldora, conteo de noches, días completos atenuados | adoptar el patrón; implementación propia (≈ 4 KB, sin dependencia) |

## Principios accionables (3 a 5) y su impacto
Ver `../../reference-analysis.md` (resumen ejecutivo, seis principios).
