# PRODUCT - Hotel Aurora

> Verdad del producto y del mensaje. **No se inventa nada**: lo no confirmado se marca "pendiente". Cada claim necesita evidencia.
> **Naturaleza del proyecto:** pieza de portfolio con aspecto de proyecto real. El hotel, su ubicación, sus cifras, sus tarifas y sus datos de contacto son **ficticios** y se declaran como tales (aviso visible en el pie y en las páginas legales). Cuando exista un cliente real, todo lo marcado como ficticio se sustituye desde el CMS antes de salir (`launch:check` detecta contenido de prueba).

Estado del brief: **borrador para aprobación** (fecha 2026-10-09). Lo marcado `[Decisión mía]` lo elegí yo con criterio porque se me delegó; lo marcado `[Confirmar]` necesita tu respuesta.

## 1. Negocio y oferta
- **Qué ofrece (ficticio):** hotel boutique **petfriendly** de 28 habitaciones en El Palmar, Vejer de la Frontera (Cádiz), en la Costa de la Luz, con spa y restaurante propios. **Ubicación aprobada** el 2026-10-09: el entorno es real y se referencia con la **Playa de El Palmar** en Google Maps; la dirección del hotel (calle) es ficticia.
- **Líneas de venta online:**
  1. **Alojamiento** (habitaciones y paquetes con noche): motor de reservas **Mews** (ADR-0002). Tarifas y disponibilidad viven en Mews, nunca en la web.
  2. **Paquetes turísticos**: con alojamiento van por Mews (tarifa/código); sin alojamiento se venden como experiencia (ver 3).
  3. **Spa y restaurante**: solicitud de cita y de mesa (formulario con consentimiento) y experiencias de pago fijo como bono (Stripe Checkout alojado, modo test).
- **Precio / modelo:** comisión cero en reserva directa frente a canales intermediarios. Precios reales: pendiente (los de la maqueta son de ejemplo y no se publican).
- **Diferencial (mecanismo, no adjetivos):** el hotel se cuenta con **datos concretos y comprobables**: 28 habitaciones en una casa restaurada, cuatro habitaciones con nombre y capacidad (Alba, Terraza, Marea, Faro), hasta dos perros por habitación con cama y cuencos, reserva directa sin intermediarios, spa y restaurante abiertos también a quien no se aloja, entrada desde las 15:00 y salida hasta las 12:00. Es un recurso de contenido y de posicionamiento (SEO y GEO), no un claim de calidad. El tema Día / Madrugada de la web es una opción de lectura. La palabra «luz» se reserva para el topónimo «Costa de la Luz» y para el sistema de diseño.

## 2. Audiencia
- **Persona principal (hipótesis a validar, sin datos propios):** parejas y pequeños grupos de 30 a 55 años, de España y Europa, que planifican una escapada de 2 a 4 noches desde el móvil y comparan con las plataformas de reserva.
- **Trabajo que quiere resolver:** decidir con confianza y reservar en pocos pasos, sabiendo qué incluye, qué se cancela y cómo llegar.
- **Objeciones frecuentes (hipótesis):** "¿me sale mejor en la plataforma?", "¿puedo cancelar?", "¿cómo es de verdad la habitación?", "¿hay aparcamiento, se admiten mascotas?", "¿puedo hablar con alguien?".

## 3. Problema y propuesta de valor
- **Problema:** las plataformas muestran el hotel como una tarjeta más; la web propia suele ser lenta, genérica y con un proceso de reserva confuso.
- **Propuesta (una frase):** una web rápida y clara que presenta el hotel boutique petfriendly de El Palmar con datos que un buscador o un asistente de IA puedan citar, y lleva a reservar directo en pocos pasos, en español e inglés.

## 4. Objetivo de conversión y KPIs
- **Conversión principal (única):** iniciar y completar una **reserva directa de alojamiento** en el motor de reservas.
- **Conversiones secundarias:** solicitud de mesa, solicitud de cita de spa, compra de bono de experiencia, clic a WhatsApp.
- **KPIs:** inicios de reserva por sesión, reservas completadas, solicitudes por canal, y salud técnica (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 en p75 de campo).
- **Línea base:** ninguna (web nueva). La meta de conversión se fija con el hotel tras 4 semanas de medición; no se inventa un objetivo.

## 5. Claims y evidencia
| Claim | Evidencia (fuente, fecha) | Permiso de uso | Estado |
|---|---|---|---|
| 28 habitaciones, spa y restaurante propios | Dato ficticio de portfolio | n/a | ficticio, declarado |
| Orientación y horas de sol por habitación | Dato ficticio de portfolio | n/a | ficticio, declarado |
| Reserva directa sin comisión de intermediarios | Condición del modelo directo; sin cifras | n/a | publicable sin cifras |
| "Mejor tarifa garantizada" | Requiere política escrita del hotel y revisión | pendiente | **NO publicar** hasta tener política |
| Cancelación flexible | Depende de las tarifas configuradas en Mews | pendiente | **NO publicar** como promesa; mostrar la condición real que devuelva Mews |
| Entrada desde las 15:00 y salida hasta las 12:00 | Política ficticia de portfolio, fijada por la persona el 2026-10-09; en producción se configura en Mews y se lee del CMS | n/a | ficticio, declarado |
| Hotel petfriendly: hasta 2 perros por habitación, cama y cuencos de cortesía, suplemento por mascota visible antes de pagar | Política ficticia de portfolio pedida por la persona; **sin importe publicado** | n/a | ficticio, declarado. **No se promete acceso de perros a la playa** (lo regula el ayuntamiento) |
| Todas las habitaciones pueden pedir una cama para mascota o una cuna de bebé en la habitación, sin coste adicional | Política ficticia de portfolio pedida por la persona el 2026-10-09 | n/a | ficticio, declarado. Se muestra en la ficha de cada habitación, en la sección de habitaciones y en las preguntas frecuentes |
| Camas y capacidad: Alba 2 personas (1 cama doble); Terraza 2 personas (2 camas individuales); Marea 3 personas (1 cama doble y 1 individual); Faro 4 personas (mini apartamento con salón y 2 dormitorios: 1 cama doble y 2 individuales) | Configuración ficticia de portfolio fijada por la persona el 2026-10-09 (la distribución de camas de Faro es un supuesto mío, por confirmar) | n/a | ficticio, declarado |
| Terraza: terraza privada cubierta de caña con banco solárium y ducha exterior, sol suave de mañana. Faro: mini apartamento de 74 m² con salón, cocina y dos dormitorios (sin azotea), lámpara de latón con lente tipo faro (referencia de diseño) | Decisiones y supuestos ficticios de portfolio (persona, 2026-10-09 y 2026-10-10); el reparto de camas de Faro está **por confirmar** | n/a | ficticio, declarado. No se afirma vista al mar garantizada ni medidas como promesa |
| El spa admite también a quien no se aloja; el restaurante sirve cocina de mercado, del desayuno a la cena (desayuno hasta media mañana, cena con producto de temporada) | Decisión de contenido de portfolio, 2026-10-10 (copy SEO/GEO); sin horarios ni carta publicados | n/a | ficticio, declarado Confirmado por la persona el 2026-10-16. |
| Paquetes: «Escapada de dos noches» (dos noches en Alba o Marea, desayuno y circuito de agua), «Cena en el hotel» y «Día de spa» (bono para un circuito de agua y un ritual de 60 minutos) | Contenido de ejemplo de portfolio, 2026-10-10; **sin precios publicados**; el pago es un bono en Stripe modo test | n/a | ficticio, declarado. No es una oferta real Confirmado por la persona el 2026-10-16. |
| Hotel en El Palmar, Vejer de la Frontera (Cádiz), en la Costa de la Luz, junto a la playa de surf de El Palmar | Ubicación elegida para el portfolio (ver §2); el municipio y la playa son reales, el hotel no | n/a | ficticio, declarado. La dirección postal es ficticia y se marca como tal Confirmado por la persona el 2026-10-16. |
| Reseñas, puntuaciones, premios, sellos, "como visto en" | Ninguna | ninguno | **Ninguno publicado** (no se fabrican testimonios) |

> Testimonios, cifras, logos, certificaciones y reseñas: solo con evidencia **y permiso**. Sin ellos no se publican.

## 6. Marca y restricciones
- **Tono y voz:** sereno, concreto, cercano. Frases cortas, verbos concretos, sin superlativos vacíos.
- **Marca:** nombre Hotel Aurora. Marca propuesta: solo el nombre en tipografía, sin símbolo (ver DESIGN.md). Aún no hay manual de marca: se propone y se aprueba.
- **Restricciones legales/sectoriales (España/UE):** RGPD + LOPDGDD; aviso legal (LSSI); política de privacidad y de cookies con Aceptar, Rechazar y Configurar al mismo nivel (criterio AEPD indicado por el cliente); pagos sin que la tarjeta toque nuestro servidor; formularios con datos mínimos y casilla de consentimiento; obligaciones turísticas sectoriales (registro, hojas de reclamaciones) **según comunidad autónoma: verificar con asesoría**. Los textos legales se entregan como **borrador sujeto a revisión de abogado**.
- **Competencia / referencias:** ver `reference-analysis.md`.

## 7. Decisiones tomadas por la persona (2026-10-09)
1. **Ubicación:** real, con una playa (no un hotel) en Google Maps: **Playa de El Palmar**, Vejer de la Frontera.
2. **Experiencias** (spa, cena): **bono de pago online con Stripe en modo test**.
3. **Migración:** **sí**, se simula desde una web antigua ficticia con mapa de 301 (`docs/seo/migracion-web-antigua.md`).
4. **CMS:** plan gratuito de Sanity para el portfolio (limitación de roles declarada en ADR-0003).
5. **Dirección visual:** aprobada (G1). **Extras opcionales:** sí, héroe 2,5D con WebGL y visor 360. **Recorrido de unas cuatro pantallas:** correcto.
6. **Horarios:** entrada desde las 15:00, salida hasta las 12:00. **Petfriendly:** sí.
7. **Material visual:** lo produce la persona con prompts ultra realistas que se le piden **uno a uno** (`creative/requests/`).
8. **Entrega para no técnicos:** en lugar de vídeo, un **documento muy explicado** (`docs/entregables/03-guia-de-gestion.md`).
9. **Formato de la guía final:** **PDF** (más la versión en el repositorio).
10. **Suplemento por mascota:** se deja **sin importe publicado**.
11. **Móvil primero, siempre:** la versión móvil es prioritaria en todo entregable (regla en `CLAUDE.md`).
12. **Camas, capacidad y precio (2026-10-09):** Terraza pasa a **2 camas individuales** (2 personas) con el mismo precio que Alba; Marea tiene **1 cama doble y 1 individual** (3 personas, cuesta más); Faro es un **mini apartamento** con salón, cocina y dos dormitorios (4 personas, el más caro y el más exclusivo). Los importes son de ejemplo: Alba y Terraza 168 €, Marea 189 €, Faro 296 € (la superficie de Faro sube a 74 m²).
13. **Cuna y cama para mascota:** todas las habitaciones pueden pedirlas en la habitación, **sin coste adicional**. La web lo dice en la ficha de cada habitación, bajo el carrusel de habitaciones y en las preguntas frecuentes.
15. **Versión móvil reducida (2026-10-10):** una foto de escritorio reducida sirve como versión móvil si conserva la proporción del hueco móvil, no se recorta y se ve bien en 390 × 844 (se comprobó con las de Terraza). Se pide composición móvil propia solo cuando no se cumple.
16. **Portada: entrada al hotel (2026-10-10):** sin efectos que sigan al cursor. Al desplazarse hay un zoom continuo por tres fotos: la cámara se acerca a la puerta de la fachada (P01), las hojas se abren, aparece la recepción (P36, borrador) y por su abertura del fondo el patio (P03). Se descartó por ahora el vídeo con Google Flow a favor de este efecto con fotos; la persona aprobó P36 tal como está, con su suelo, y decidió que el recorrido termine en el patio sin vista al mar (2026-10-16).
14. **Sol directo en todas las habitaciones (fotografía):** todas reciben sol directo en la foto, y lo que las distingue es la decoración, el color de la ropa de cama y los elementos propios. En la terraza el sol es suave, dorado y bueno para tomar el sol. Cada habitación se muestra con habitación, terraza (si la tiene), baño y zona de TV; el hotel muestra además zonas comunes, restaurante y zona pet friendly.
17. **Textos de la web para SEO y GEO (2026-10-10, pedido de la persona):** «los textos de la web no posicionan y no son creativos, no hables tanto del sol». Se reescribe todo el copy: titular H1 «Hotel boutique en El Palmar.», título y descripción por idioma con «hotel boutique petfriendly en El Palmar, Vejer», un solo H1 y H2 con palabras de búsqueda (habitaciones, reserva directa, restaurante, spa, petfriendly, cómo llegar, preguntas frecuentes), bloque «Hotel Aurora, de un vistazo» con datos citables, nueve preguntas frecuentes con la entidad nombrada en cada respuesta, y datos estructurados JSON-LD `Hotel` + `FAQPage` generados desde los mismos datos que la página. La palabra «luz» queda solo en «Costa de la Luz». Las láminas de la entrada usan frases con datos del hotel («28 habitaciones en una casa restaurada», «Entre el surf de El Palmar y los pueblos blancos», «Pasa. Tu perro también.»). Detalle y mapa de palabras: `docs/seo/estrategia-seo-geo.md`. La persona confirmó los datos nuevos (spa abierto a quien no se aloja, cocina de mercado, desayuno y cena, paquetes) el 2026-10-16.

## 8. Preguntas abiertas
- Para un hotel real: si admitirá perros de cualquier tamaño y cuál será el suplemento (en el portfolio queda ficticio y sin importe, decisión 10).
18. **Mejoras de UI/UX pedidas por la persona (2026-10-25):** se descarta el microvídeo V01 (se queda la foto P16). El mapa se ve desde el principio (vista previa propia, sin conectar con terceros) con un pin «Aurora» en el punto del hotel, y al explorarlo carga OpenStreetMap con el mismo pin y un botón para volver al hotel; la ubicación sigue siendo ficticia y se dice. «Hotel Aurora, de un vistazo» pasa a ser una sección editorial con foto de familia con su perro en la playa (P24, pendiente) y datos compactos. Preguntas frecuentes en dos columnas compactas. Paquetes: la tarjeta elegida cambia la foto (Escapada P21, Cena P16, Día de spa P19). Reserva directa: banda oscura compacta con la acción «Reservar directo» y cuatro garantías en lista.
19. **Ninguna conexión a terceros al navegar (pedido de la persona, 2026-10-25: «ningún usuario del sitio web debe estar conectado a nada»):** el mapa es una imagen propia de OpenStreetMap incrustada (con atribución) que se mueve y amplía sin conectarse a nada, con el pin «Aurora» fijo en el hotel; las tipografías van incrustadas (se quitó Google Fonts). Los enlaces a Google Maps y WhatsApp solo abren al pulsarlos. En producción: tipografías con `next/font` (autoalojadas) y mapa autoalojado o, si se usa un proveedor externo, solo tras consentimiento. Titulares con la idea clave en negrita terracota (restaurante, spa, petfriendly, familia) y cierre «y no dejes a tu perro en casa».
20. **Mapa real que abre la app de mapas, sin botones (2026-10-25):** la persona pidió que al pulsar el mapa se abra Google Maps, Apple Maps o el mapa que tenga el visitante, y que no haya enlaces ni botones en esa sección. Se quitaron «Cómo llegar», los enlaces a Google y Apple Maps y el mapa interactivo propio.
