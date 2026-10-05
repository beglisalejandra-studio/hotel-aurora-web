# Análisis de referencias — resumen ejecutivo

> Detalle y fuentes: `creative/references/`. Aquí solo el **contrato visual** y los **principios adoptados** (no se clonan textos, código, imágenes, logos ni diseños protegidos). Análisis hecho el 2026-10-05 sobre páginas abiertas y leídas; las capturas automáticas por lote (`npm run refs`) quedan para la fase de implementación.

## Principios adoptados
| # | Principio | Referencia que lo inspira | Impacto esperado en conversión |
|---|---|---|---|
| 1 | La fotografía manda; el texto es mínimo y hay mucho aire | Aman, Schlosshotel Kitzbühel | percepción premium; menos ruido antes de la acción |
| 2 | La reserva está siempre a mano (barra en el hero, botón en la navegación, dock en móvil) | Schlosshotel Kitzbühel («Book» y «Enquire» constantes); contraste con Anandá, que no muestra reserva | menos clics hasta la intención de reservar |
| 3 | Voz de marca con personalidad, no lenguaje de inventario | Vander, Velaa Private Island | recordación y confianza |
| 4 | Navegar por contexto: dónde queda y cómo se llega a cada lugar | Aman (subtítulos geográficos), Faith Ibiza (por intención) | responde la objeción «¿dónde queda y qué hay cerca?» |
| 5 | Calendario de hotel con noches y precio visibles | calendarios de hotel de 21st | menos abandono al elegir fechas |
| 6 | Interacción con peso casi nulo: CSS nativo en vez de GSAP, canvas o video | descarte consciente de «Hero Scrub» y «Hotel Showcase» | velocidad móvil (prioridad declarada del proyecto) |

## Contrato visual (lo que NO cambia)
Arcos de medio punto en piedra · postigos de madera · baldosa de cemento · buganvilia · paleta verdeazulada, coral y tinta · luz de las 6 de la mañana · sin personas visibles · sin texto ni logotipos dentro de las imágenes. Ver `creative/manifest.json` → `constraints.preserve`.

## Qué evitamos (y por qué)
- **Video o canvas en la portada:** `VIDEO_SCORE` 28 y prioridad de rendimiento móvil máxima; se usa imagen.
- **Reserva en un sitio externo o iframe** (como en Schlosshotel): rompe la experiencia, la marca y el control de datos; la reserva es propia y segura.
- **Imágenes rotas o sin detalle de habitaciones** (Anandá): la maqueta muestra el contenido completo de cada habitación.
- **Slider automático de imágenes:** pesa, es poco accesible y compite con el titular.
- **Lenguaje genérico de hotel** («experiencia inolvidable», «lujo»): sin evidencia y sin voz propia.
- **Copiar el aspecto de cualquier referencia:** de cada una se tomó un principio, no un diseño.
