# 01 · Propuesta de diseño UX/UI y plan técnico

> **Estado: en revisión (2026-10-05). Pendiente de aprobación** de la persona responsable antes de escribir código de producción.
> **Hotel Aurora es un proyecto de portafolio de beglisalejandra-studio. Hotel ficticio: no se procesa ninguna reserva ni transacción.**

## Resumen en 30 segundos
- **Idea:** «El día en la casa». Un hotel pequeño con patio, contado de la primera luz a la noche. El logo (un arco con un punto de sol) recorre el día mientras se hace scroll.
- **Firma visual:** el arco de medio punto de la arquitectura colonial (marco de imágenes, arcada del pie, trazo del logo).
- **Cómo cumple tus prioridades:**
  - *Seguridad:* cuentas con Postgres y seguridad por fila, datos mínimos, nada de tarjetas, pagos imposibles en portafolio (ADR-0003 y 0004).
  - *Velocidad:* páginas públicas estáticas, animación solo con CSS, imagen en vez de video (el cálculo dio 28 → imagen), mapa real solo bajo demanda, presupuestos medibles.
  - *Celular, tablet y computador:* maqueta verificada sin desbordes de 360 a 1440 px.
  - *App instalable con reserva:* PWA sin datos personales en caché (ADR-0005).
- **Maqueta para revisar:** `creative/mockup/index.html` (un solo archivo; ábrelo en el navegador).

## Concepto
- **Idea central:** una casa-hotel contada como un día completo, de la primera luz a la noche.
- **Tres adjetivos:** luminoso, arquitectónico, sereno.
- **Elemento firma:** el arco; el punto de sol del logo recorre el arco con el scroll.
- **Qué evitamos:** hero centrado sobre degradado, tarjetas iguales con ícono, paleta crema y latón, serif «de lujo», fotos de stock, animación sin propósito. Detalle en `DESIGN.md`.

## Referencias (enlaces verificados el 2026-10-05)
| # | URL | Qué se toma (principio) | Qué NO se toma |
|---|---|---|---|
| 1 | [aman.com](https://www.aman.com/) | imagen como protagonista, mucho aire, contexto geográfico en la navegación | su aspecto; su navegación de 36 propiedades |
| 2 | [schlosshotel-kitzbuehel.com](https://www.schlosshotel-kitzbuehel.com/en) | poco texto sobre la foto; «Book» siempre a mano; habitaciones con precio desde y página propia | el motor de reservas externo |
| 3 | [vanderhotel.com](https://vanderhotel.com/) | voz de marca con personalidad, no lenguaje de inventario | el humor forzado y su paleta de madera |
| 4 | [velaaprivateisland.com](https://www.velaaprivateisland.com/) | narrativa en lugar de lista de servicios | menú de 10 o más secciones |
| 5 | [faithibiza.com](https://faithibiza.com/) | navegar por intención | video de portada y «Scroll to discover» |
| 6 | [anandahotelboutique.com](https://www.anandahotelboutique.com/) | punto de partida del sector en Cartagena y lo que hay que superar: sin reserva visible e imágenes rotas | todo su aspecto |
| 7 | [awwwards.com/websites/hotel](https://www.awwwards.com/websites/hotel/) | colección: tipografía cuidada, imagen a pantalla completa | parallax con JavaScript pesado |
| 8 | [21st: calendario de hotel](https://21st.dev/@cnippet-dev/components/v-calendar-15) y [rango con píldoras](https://21st.dev/@shadcnspace/components/calendar-range-select) | patrón de rango con noches y extremos en píldora | su código (implementación propia, ≈ 4 KB) |
| 9 | [21st: Hero Scrub](https://21st.dev/@jean.duthil13/components/hero-scrub) y [Hotel Showcase](https://21st.dev/@kedhareswer/components/hotel-showcase) | nada | descartados por peso (canvas y GSAP) |

Enlaces que fallaron o no correspondían (Hoxton, Mr & Mrs Smith, UNESCO, casasanagustin.com, hotelcapellan.com, casapestana.com) están en `creative/references/urls.md` como registro.

## Cómo se verá, plataforma por plataforma
| Plataforma | Qué cambia en el diseño | Captura |
|---|---|---|
| Móvil (390 px) | arco a sangre con el titular sobre una veladura; CTA «Reservar» arriba y en un dock inferior; fechas en hoja inferior de un mes; mapa con solo la etiqueta del punto activo; carril de habitaciones con la siguiente tarjeta asomando | [portada](../../creative/mockup/screenshots/home-390.png) · [fechas](../../creative/mockup/screenshots/fechas-390-hoja-inferior.png) · [pago bloqueado](../../creative/mockup/screenshots/reserva-390-pago-bloqueado.png) |
| Tablet (768 px) | misma estructura que móvil con más aire; la barra de reserva se organiza en 3 columnas | [portada](../../creative/mockup/screenshots/home-768.png) |
| Escritorio (1440 px) | titular a la izquierda y arco 4:5 a la derecha con un arco de contorno detrás; calendario de 2 meses; mapa y panel lado a lado; mosaico de 4 celdas | [portada](../../creative/mockup/screenshots/home-1440.png) · [reserva](../../creative/mockup/screenshots/reserva-1440-fechas.png) · [pago bloqueado](../../creative/mockup/screenshots/reserva-1440-pago-bloqueado.png) · [modo oscuro](../../creative/mockup/screenshots/home-1440-oscuro.png) |
| App instalada (PWA) | misma interfaz a pantalla completa; atajos «Reservar» y «Mis reservas»; sin conexión, pantalla con el contacto del hotel | se diseña en la fase 4 |

## Experiencia de usuario
**Perfiles:**
1. *Viajero que compara desde el celular.* Quiere ver el lugar, qué está libre y cuánto cuesta, sin registrarse todavía.
2. *Huésped con reserva.* Quiere saber el estado y llegar bien (mapa).
3. *Quien revisa el portafolio.* Quiere ver calidad, criterio y seguridad.

**Recorrido de conversión** (cuatro pasos, un solo botón primario «Reservar» en todo el sitio):
1. **Fechas:** desde la portada o la barra, calendario de rango con precio por noche, noches contadas y días completos tachados. Las fechas viajan con la persona entre pantallas.
2. **Tus datos:** crear cuenta o entrar con enlace. Consentimientos separados (avisos por correo, por WhatsApp, marketing).
3. **Pago:** **bloqueado en portafolio**, con un aviso inconfundible; el botón Pagar queda desactivado a propósito.
4. **Listo:** confirmación marcada «Simulación» y vista previa del aviso por **WhatsApp** y por **correo**, con la línea de estado (recibida, confirmada, check-in).

**Fricciones que quitamos:** ver precios sin cuenta; fechas que no se pierden; resumen siempre visible; sin pedir datos que no se necesitan.

**Mapa del sitio:** `/` · `/habitaciones/[slug]` · `/reservar` · `/cuenta` · `/cuenta/reservas` · privacidad, términos y cookies · `/offline` · 404.

**Estados:** *éxito, vacío y bloqueado* están en la maqueta. *Carga* (esqueletos con la forma final), *error de red* y *sesión caducada* se construyen en la fase 1 a 3 (listados en `DESIGN.md` §3).

**Accesibilidad (medida):** contraste AA en todos los pares de colores, claro y oscuro (`node design/contrast-check.mjs`); calendario operable con flechas; foco visible; objetivos de 44 px; el estado nunca depende solo del color (los días completos van tachados); enlace «Saltar al contenido»; `prefers-reduced-motion` anula todo el movimiento.

## Cómo lo hacemos (plan técnico, resumen)
| Tema | Propuesta | Detalle |
|---|---|---|
| Base | Next.js 16 + TypeScript estricto + Tailwind 4; páginas públicas estáticas, solo cuenta y reserva dinámicas; sin editor visual | ADR-0001 y 0002 |
| Seguridad de datos | Postgres con seguridad por fila (prueba negativa obligatoria), datos mínimos, sin tarjetas, contraseñas de 12 o más caracteres, CAPTCHA y límite de tasa, cookies `HttpOnly`, CSP, exportar y eliminar desde la cuenta, secretos solo en el gestor | ADR-0004, `docs/privacy/data-map.md` |
| Sin dobles reservas | Transacción que bloquea las noches, retención corta con vencimiento, clave de idempotencia, prueba de carrera | ADR-0004 |
| Pagos | Interfaz de pagos con un único proveedor que **siempre rechaza**; guardas en el arranque, CSP y CI | ADR-0003 |
| Estado por WhatsApp o correo | Cola de eventos de reserva; correo transaccional y API de WhatsApp Business (los mensajes que inicia la empresa requieren plantillas aprobadas; solo con consentimiento). **En portafolio: vista previa, no se envía nada** | `PROJECT.md` §3 |
| Mapa | Póster estático + MapLibre y PMTiles propios cargados bajo demanda; sin claves ni rastreadores | ADR-0006 |
| App instalable | Manifiesto, atajos, service worker mínimo que nunca guarda datos personales; reservar siempre en línea | ADR-0005 |
| Velocidad | Presupuestos en `DESIGN.md` §7 (LCP ≤ 2.0 s, JS inicial ≤ 90 KB gzip, hero ≤ 120 KB, portada ≤ 900 KB) medidos con Lighthouse y datos de campo | `DESIGN.md` §7 |
| Imágenes | 12 imágenes del lote A con prompts para ChatGPT o Gemini y medidas exactas | `creative/requests/LEEME.md` |
| Hosting | **Por decidir** (Vercel, Cloudflare o contenedor propio); no se impone ninguno | `PROJECT.md` §5 |
| Fases | 0 maqueta (hecha) → 1 base → 2 habitaciones y calendario → 3 cuentas y reserva → 4 PWA y SEO → 5 QA → 6 preview y entrega | `PROJECT.md` §6 |

## Maqueta
`creative/mockup/index.html`. Un solo archivo; las fuentes se piden a Google solo en la maqueta (en producción se autoalojan). Contiene: portada, página de habitación (`#/habitacion/terraza`), flujo de reserva de 4 pasos (`#/reservar`), modo claro y oscuro. La franja superior tiene el botón **Guía de fotos**, que muestra en cada hueco de imagen su código y su medida.

### Qué verifiqué
- Sin desbordamiento horizontal en 360, 390, 430, 768, 900, 1024, 1280 y 1440 px.
- Recorrido completo con clics reales en 1440 y 390 px (19 a 20 comprobaciones por tamaño: abrir fechas, elegir rango, ir a la habitación, reservar, avanzar los pasos, pago bloqueado que **no avanza**, confirmación «Simulación», vista previa de WhatsApp, teclado en el calendario, menú móvil, diálogo de instalación). La prueba encontró y corrigió tres errores reales (el selector se cerraba al elegir la primera fecha, la vista previa del rango podía perder el clic y la hoja inferior quedaba tapada en móvil).
- Contraste AA en todos los pares, claro y oscuro (un par del tema claro estaba en 4.10:1 y se corrigió).
- Consola del navegador sin errores ni avisos.
- Cero rayas largas en el texto visible (regla tipográfica del proyecto).

### Qué NO verifiqué (honestidad)
- **Fotos reales:** la maqueta usa degradados de color como sustitutos; el diseño depende de las imágenes que aún no existen.
- **Lighthouse:** no lo ejecuté; sin imágenes ni servidor desplegado la cifra engañaría. Se mide en la fase 5.
- **Lectores de pantalla, Safari, Firefox y dispositivos reales:** solo probé con Chromium emulado. Las animaciones con `animation-timeline` están protegidas con `@supports` y degradan a estático, pero no las vi en Safari ni Firefox.
- **El mapa es un esquema ilustrativo**, no a escala; las coordenadas y los tiempos reales dependen de la dirección del hotel.
- **Nada de producción:** no hay código de aplicación, base de datos, autenticación, pagos, correo ni WhatsApp; es una maqueta.

## Decisiones pendientes para la persona
1. **Aprobar o corregir** la maqueta y el concepto («El día en la casa», arco y sol).
2. **Ubicación:** ¿Centro histórico, Getsemaní u otra zona?
3. **Registro en el portafolio:** ¿funciona de verdad contra un proyecto de pruebas con purga a las 24 h (recomendado) o es simulado? (ADR-0004)
4. **Idiomas:** ¿solo español o también inglés?
5. **Hosting y dominio:** ¿preferencia? El dominio aún no existe.
6. **Imágenes:** ¿generamos el lote A con ChatGPT o Gemini? Subir a `creative/inbox/`.
7. **Logotipo:** ¿aprobamos el arco con sol construido en SVG?
8. **Cuentas de servicios** (base de datos, correo, WhatsApp): las crea una persona; yo no recibo claves por el chat.
