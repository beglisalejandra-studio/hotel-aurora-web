# PRODUCT - Hotel Aurora

> Verdad del producto y del mensaje. **No se inventa nada**: lo no confirmado se marca "pendiente". Cada claim necesita evidencia.
> **Naturaleza del proyecto:** pieza de portfolio con aspecto de proyecto real. El hotel, su ubicación, sus cifras, sus tarifas y sus datos de contacto son **ficticios** y se declaran como tales (aviso visible en el pie y en las páginas legales). Cuando exista un cliente real, todo lo marcado como ficticio se sustituye desde el CMS antes de salir (`launch:check` detecta contenido de prueba).

Estado del brief: **borrador para aprobación** (fecha 2026-10-09). Lo marcado `[Decisión mía]` lo elegí yo con criterio porque se me delegó; lo marcado `[Confirmar]` necesita tu respuesta.

## 1. Negocio y oferta
- **Qué ofrece (ficticio):** hotel boutique de 28 habitaciones en la Costa de la Luz (Cádiz), con spa y restaurante propios. `[Decisión mía]` ubicación y tamaño; `[Confirmar]` si prefieres otra zona.
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
| Reseñas, puntuaciones, premios, sellos, "como visto en" | Ninguna | ninguno | **Ninguno publicado** (no se fabrican testimonios) |

> Testimonios, cifras, logos, certificaciones y reseñas: solo con evidencia **y permiso**. Sin ellos no se publican.

## 6. Marca y restricciones
- **Tono y voz:** sereno, concreto, cercano. Frases cortas, verbos concretos, sin superlativos vacíos.
- **Marca:** nombre Hotel Aurora. Marca propuesta: solo el nombre en tipografía, sin símbolo (ver DESIGN.md). Aún no hay manual de marca: se propone y se aprueba.
- **Restricciones legales/sectoriales (España/UE):** RGPD + LOPDGDD; aviso legal (LSSI); política de privacidad y de cookies con Aceptar, Rechazar y Configurar al mismo nivel (criterio AEPD indicado por el cliente); pagos sin que la tarjeta toque nuestro servidor; formularios con datos mínimos y casilla de consentimiento; obligaciones turísticas sectoriales (registro, hojas de reclamaciones) **según comunidad autónoma: verificar con asesoría**. Los textos legales se entregan como **borrador sujeto a revisión de abogado**.
- **Competencia / referencias:** ver `reference-analysis.md`.

## 7. Preguntas abiertas
1. `[Confirmar]` ¿Costa de la Luz (Cádiz) te sirve como ubicación ficticia o prefieres otra?
2. `[Confirmar]` ¿Vendemos experiencias (spa, cena) como **bono de pago online** con Stripe en modo test, o solo como solicitud?
3. `[Confirmar]` ¿Quieres que simule una **migración desde una web antigua** (mapa de 301 con URLs de ejemplo) para mostrarla en el portfolio?
4. Material visual: ver `creative/briefs/pedido-de-materiales.md`.
5. Quién graba el **vídeo tutorial** de la entrega (guion y capturas los preparo yo).
