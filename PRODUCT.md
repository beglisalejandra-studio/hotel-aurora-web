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
- **Diferencial (mecanismo, no adjetivos):** el hotel se cuenta desde la **luz**: cada habitación se describe por orientación y hora de sol, y el tema Día / Madrugada de la web acompaña ese enfoque. Es un recurso de contenido y de diseño, no un claim de calidad.

## 2. Audiencia
- **Persona principal (hipótesis a validar, sin datos propios):** parejas y pequeños grupos de 30 a 55 años, de España y Europa, que planifican una escapada de 2 a 4 noches desde el móvil y comparan con las plataformas de reserva.
- **Trabajo que quiere resolver:** decidir con confianza y reservar en pocos pasos, sabiendo qué incluye, qué se cancela y cómo llegar.
- **Objeciones frecuentes (hipótesis):** "¿me sale mejor en la plataforma?", "¿puedo cancelar?", "¿cómo es de verdad la habitación?", "¿hay aparcamiento, se admiten mascotas?", "¿puedo hablar con alguien?".

## 3. Problema y propuesta de valor
- **Problema:** las plataformas muestran el hotel como una tarjeta más; la web propia suele ser lenta, genérica y con un proceso de reserva confuso.
- **Propuesta (una frase):** una web rápida y clara que enseña el hotel con luz real y lleva a reservar directo en pocos pasos, en español e inglés.

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
| Terraza: terraza privada cubierta de caña con banco solárium y ducha exterior, sol suave de mañana. Faro: mini apartamento de 74 m² con salón y dos dormitorios y azotea mirador privada, lámpara de latón con lente tipo faro (referencia de diseño) | Decisiones y supuestos ficticios de portfolio (persona, 2026-10-09 y 2026-10-10); la azotea de Faro y el reparto de camas están **por confirmar** | n/a | ficticio, declarado. No se afirma vista al mar garantizada ni medidas como promesa |
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
12. **Camas, capacidad y precio (2026-10-09):** Terraza pasa a **2 camas individuales** (2 personas) con el mismo precio que Alba; Marea tiene **1 cama doble y 1 individual** (3 personas, cuesta más); Faro es un **mini apartamento** con salón y dos dormitorios (4 personas, el más caro y el más exclusivo). Los importes son de ejemplo: Alba y Terraza 168 €, Marea 189 €, Faro 296 € (la superficie de Faro sube a 74 m²).
13. **Cuna y cama para mascota:** todas las habitaciones pueden pedirlas en la habitación, **sin coste adicional**. La web lo dice en la ficha de cada habitación, bajo el carrusel de habitaciones y en las preguntas frecuentes.
14. **Sol directo en todas las habitaciones (fotografía):** todas reciben sol directo en la foto, y lo que las distingue es la decoración, el color de la ropa de cama y los elementos propios. En la terraza el sol es suave, dorado y bueno para tomar el sol. Cada habitación se muestra con habitación, terraza (si la tiene), baño y zona de TV; el hotel muestra además zonas comunes, restaurante y zona pet friendly.

## 8. Preguntas abiertas
- Para un hotel real: si admitirá perros de cualquier tamaño y cuál será el suplemento (en el portfolio queda ficticio y sin importe, decisión 10).
