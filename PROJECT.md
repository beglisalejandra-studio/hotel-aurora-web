---
type: new
status: build
duration: 3-6w
visual_authority: taste-skill
stack: next
hosting: vercel
figma_seat: view
mode: auto
---

# PROJECT - Hotel Aurora

> Alcance, arquitectura, integraciones, secretos y despliegue. El front-matter gobierna al sistema. `status` pasó a `design` el 2026-10-09 al aprobar la persona el brief y la dirección visual (puerta G1).

## 1. Alcance
- **Objetivo de conversión (único):** reserva directa de alojamiento en el motor de reservas.
- **Dentro del alcance:** web bilingüe ES/EN; hotel **petfriendly**; horarios fijos (entrada 15:00, salida 12:00); sección "Cómo llegar" con la Playa de El Palmar en Google Maps (carga bajo demanda); **migración simulada con 301**; extras opcionales (héroe 2,5D con WebGL y visor 360); habitaciones, restaurante, spa, paquetes y experiencias; reserva (widget Mews); solicitudes de mesa y de cita; bonos de experiencia (Stripe, modo test); WhatsApp y asistente de IA; consentimiento (Consent Mode v2), GA4 y Pixel de Meta; SEO técnico y 301; documentación y guion de vídeo tutorial; staging, copias y monitor.
- **Panel de administración (pedido de la persona, 2026-10-25):** el cliente final edita **todo** sin depender de nadie: textos, fotos, habitaciones (añadir, quitar, ordenar; cada una genera su página), paquetes, preguntas, menú, pie, ajustes del hotel, **secciones de cada página** (añadir, quitar y reordenar bloques; añadir páginas nuevas como un **blog** para SEO), **colores y tipografías** (con límites que mantienen el contraste AA y la calidad del diseño). Calendario, disponibilidad, precios y reservas se gestionan en el panel del motor de reservas (Mews), enlazado desde el panel; los datos de los huéspedes no pasan por la web.
- **Fuera del alcance (propuesto; el vídeo tutorial se descartó a petición de la persona y se sustituye por una guía escrita):** motor de reservas propio; channel manager; tarjetas regalo genéricas; área de cliente; pasarela de pago directa para alojamiento (la gestiona Mews).
- **Fechas / hitos:** ritmo 3-6 semanas, con una puerta de aprobación por fase (sección 6). Las fechas se fijan al aprobar el plan.

## 2. Arquitectura
- **Stack:** Next.js (App Router) + TypeScript estricto + Tailwind v4, desde la plantilla del sistema. Decisión y alternativas: `docs/decisions/ADR-0001-stack.md`.
- **Motor de reservas:** Mews (widget oficial). `docs/decisions/ADR-0002-motor-de-reservas.md`.
- **CMS:** Sanity (contenido descriptivo, nunca tarifas). `docs/decisions/ADR-0003-cms.md`.
- **Consentimiento y medición:** `docs/decisions/ADR-0004-consentimiento-y-medicion.md`.
- **Hosting y entrega:** Vercel (staging por preview). `docs/decisions/ADR-0005-hosting-pagos-y-entrega.md`.
- **Visual inmersivo y rendimiento:** `docs/decisions/ADR-0006-visual-inmersivo-y-rendimiento.md`.
- **Idiomas:** español (por defecto) e inglés. Rutas `/es/...` y `/en/...` con slugs traducidos, `hreflang` recíproco y `x-default`. Sin traducción automática sin revisión humana.
- **Sitemap (propuesto):**
  - Inicio · Habitaciones (listado + ficha por habitación) · Restaurante · Spa · Paquetes (listado + ficha) · Experiencias (bonos) · El hotel · Cómo llegar (con la Playa de El Palmar) · **Hotel petfriendly** (página propia para esa intención de búsqueda) · Preguntas frecuentes · Contacto · Gracias (por tipo de conversión) · Aviso legal · Privacidad · Cookies · Condiciones de reserva.
  - Inventario exacto con pareja ES/EN de cada URL: `docs/seo/new-urls.txt` (21 páginas, 42 URLs).
- **Contenido editable por el cliente:** textos, fotos, habitaciones, paquetes, FAQs, ofertas, horarios y datos de contacto, con borrador y vista previa. Layout, tokens, pagos, seguridad e integraciones sensibles quedan protegidos en código.
- **Principio de datos:** tarifas, disponibilidad y datos de reserva **solo** en Mews; precios de bonos **solo** en Stripe (Price IDs); la web no guarda datos de huéspedes.

## 3. Integraciones (una ficha por integración)

### 3.1 Mews Booking Engine (widget)
| Campo | Valor |
|---|---|
| Objetivo | Reserva directa dentro de la web sin redirigir a otro sitio |
| Datos | Fechas, huéspedes y datos de reserva: **los trata Mews**, no la web |
| Dónde se ejecuta | Cliente: script `https://api.mews.com/distributor/distributor.min.js` en `<head>` sin `async` ni iframe, HTTPS obligatorio; `Mews.Distributor({ configurationIds: [...], openElements: '.distributor-open' })` |
| Credenciales | `NEXT_PUBLIC_MEWS_CONFIGURATION_ID` (identificador público, no secreto). Demo: `dataBaseUrl: 'https://api.mews-demo.com'` con el ID de configuración **de demo** publicado en la documentación de Mews |
| Coste | Demo gratuita para pruebas. Producción: contrato del hotel con Mews (fuera del portfolio) |
| Privacidad | Mews es encargado/responsable según su contrato (revisar DPA). Se enlaza su política. `enableTracking()` / `disableTracking()` se ligan a nuestro consentimiento |
| Fallback | Si el script no carga: botón "Reservar" degrada a enlace al motor alojado (Booking Engine Standalone) y a WhatsApp |
| Pruebas | Spike en preview (HTTPS) antes de construir: carga, apertura, idioma (`setLanguageCode`), moneda (`setCurrencyCode`), consentimiento |
| Responsable | (definir) |
| Límites conocidos | El hotel demo de Mews es **uno fijo** con sus propias categorías y tarifas: la demo mostrará esas habitaciones, no las de Aurora. Se declara en la presentación. Medición cruzada de dominio con GA4: **no confirmada** en la documentación revisada, a verificar |

### 3.2 Sanity (CMS)
| Campo | Valor |
|---|---|
| Objetivo | Contenido autogestionable, multilingüe, con borrador y vista previa |
| Datos | Contenido editorial; **sin datos personales de huéspedes**. Cuentas de editores |
| Dónde se ejecuta | Studio alojado por Sanity (o embebido en `/studio` con acceso protegido); lecturas desde servidor |
| Credenciales | `SANITY_PROJECT_ID`, `SANITY_DATASET` (públicos); `SANITY_API_READ_TOKEN` (secreto, solo servidor, para borradores/preview); `SANITY_REVALIDATE_SECRET` (secreto, webhook de revalidación) |
| Coste | Plan gratuito: 20 puestos, solo roles Administrador y Visor, 10k documentos, 1M peticiones CDN/mes, 100 GB de ancho de banda/mes (página oficial de precios, consultada 2026-10-09). **Rol Editor (mínimo privilegio) requiere plan de pago**: Growth, 15 USD por puesto y mes según búsqueda (confirmar en la página oficial). Uso comercial en plan gratuito: **no confirmado**, leer términos |
| Privacidad | Revisar ubicación de datos y DPA de Sanity antes de producción. No se almacenan datos personales de huéspedes |
| Fallback | Contenido ya publicado se sirve desde la caché/CDN y ISR; si Sanity cae, el sitio sigue sirviendo páginas generadas |
| Pruebas | Esquemas con validación (campos ES/EN obligatorios para publicar), prueba de borrador no indexable, prueba de revalidación por webhook |
| Responsable | (definir) |

### 3.3 Stripe Checkout (bonos de experiencia)
| Campo | Valor |
|---|---|
| Objetivo | Vender experiencias de precio fijo sin que la tarjeta pase por nuestro servidor |
| Datos | Importe y producto (Price ID); email del comprador lo gestiona Stripe; nosotros guardamos solo el estado del pedido y el código del bono |
| Dónde se ejecuta | Servidor: creación de sesión con Price ID del catálogo del servidor; webhook firmado sobre cuerpo crudo, idempotente por `event.id` |
| Credenciales | `STRIPE_SECRET_KEY` (secreto; `sk_test_` hasta aprobación), `STRIPE_WEBHOOK_SECRET` (secreto), `STRIPE_PRICE_*` (uno por producto). Cuenta de Stripe **del cliente** |
| Coste | Comisiones de Stripe según su tarifa vigente (a consultar) |
| Privacidad | Stripe como encargado; aviso en el checkout; retención de pedidos a definir con asesoría |
| Fallback | Si Stripe falla: mensaje claro y alternativa "Solicitar por email o WhatsApp" |
| Pruebas | Modo test, `stripe listen`, tarjetas de prueba, reintento de webhook, doble entrega. **Nunca pagos reales** sin aprobación |
| Responsable | (definir) |
| Nota | El módulo de la plantilla guarda pedidos e idempotencia **en memoria**: hay que implementarlo sobre un almacén real antes de producción |

### 3.4 Formularios y correo (Resend)
| Campo | Valor |
|---|---|
| Objetivo | Contacto, solicitud de mesa, solicitud de cita de spa |
| Datos | Nombre, email, teléfono opcional, fecha y comensales/tratamiento, mensaje. **Solo los necesarios** + casilla de consentimiento (no premarcada) |
| Dónde se ejecuta | Servidor: validación `zod`, honeypot, tiempo mínimo, comprobación de `Origin`, límite de tasa |
| Credenciales | `RESEND_API_KEY` (secreto), `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM` (dominio verificado con SPF/DKIM) |
| Coste | Plan de Resend vigente (a consultar) |
| Privacidad | Base legal: consentimiento o ejecución de medidas precontractuales; retención mínima; región de envío UE si el plan lo permite (a verificar); registrado en `docs/privacy/data-map.md` |
| Fallback | Si falla el envío: error visible y alternativa de contacto directo |
| Pruebas | Unitarias de validación, e2e del flujo y de la página de gracias, prueba de bandeja real en staging |
| Responsable | (definir) |

### 3.5 Medición y consentimiento (GA4, Pixel de Meta, Consent Mode v2)
Ver `docs/decisions/ADR-0004-consentimiento-y-medicion.md`. Resumen: banner propio autoalojado con Aceptar, Rechazar y Configurar al mismo nivel; señales de Consent Mode v2 por defecto denegadas; **modo básico** (las etiquetas no se cargan hasta consentir); eventos versionados y sin datos personales; el módulo `analytics-consent` de la plantilla **no trae Consent Mode v2** y se amplía.

### 3.6 WhatsApp
| Campo | Valor |
|---|---|
| Objetivo | Canal de duda rápida y alternativa humana al asistente |
| Datos | Ninguno desde la web (enlace `https://wa.me/<número>?text=...`, sin API ni cookies) |
| Credenciales | Número del hotel en el CMS (ajustes). Ficticio en la demo |
| Privacidad | Al abrir WhatsApp, el usuario sale a un servicio de terceros: aviso breve junto al botón |
| Fallback | Teléfono (`tel:`) y email (`mailto:`) tocables |
| Pruebas | Enlace correcto en móvil y escritorio, mensaje precargado por idioma |

### 3.7 Asistente de IA (concierge)
| Campo | Valor |
|---|---|
| Objetivo | Responder dudas frecuentes con el contenido del hotel y derivar a una persona |
| Datos | Mensaje del usuario (puede contener datos personales sin querer). **No se guarda la conversación** por defecto; sin identificadores |
| Dónde se ejecuta | Servidor (ruta propia con streaming), nunca clave en cliente |
| Alcance | Solo lectura sobre contenido del CMS (habitaciones, políticas, FAQs, horarios). **Sin herramientas que ejecuten acciones** (no reserva, no cobra, no envía correos) en la v1, para limitar el riesgo de inyección de instrucciones |
| Transparencia | Aviso visible de que se habla con una IA y botón para pasar a WhatsApp o teléfono. Obligaciones del Reglamento de IA de la UE: **validar calendario y alcance con asesoría legal** |
| Credenciales | `ANTHROPIC_API_KEY` (secreto, solo servidor) |
| Coste | Por uso; tope mensual y límite de tasa por IP desde el primer día |
| Privacidad | Datos del cliente real no van a planes gratuitos de API; en la demo, contenido ficticio. Modelo y condiciones de datos a verificar con la documentación vigente al implementar |
| Fallback | Si falla o se agota el tope: mensaje y enlace a WhatsApp |
| Pruebas | Batería de preguntas de dominio, preguntas fuera de alcance, intentos de inyección, límites de tasa |
| Responsable | (definir) |

### 3.8 Presupuesto de rendimiento y efectos (resumen de ADR-0006)
- Portada en móvil: transferencia crítica ≤ 700 KB, JS crítico ≤ 90 KB gzip, imagen LCP ≤ 180 KB; **sin preloader**; LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.
- Efectos 3D con CSS nativo y de forma progresiva (con alternativa estática); WebGL y visor 360 solo opcionales y tras `load`; vídeo mudo en bucle ≤ 1,5 MB por clip, carga diferida y **cero bytes en la carga inicial**.
- Control: presupuesto de Lighthouse en CI y prueba en un móvil de gama media real antes de la aprobación.

### 3.9 Google Maps (mapa bajo demanda)
| Campo | Valor |
|---|---|
| Objetivo | Situar la zona con una playa real, no un hotel: **Playa de El Palmar, Vejer de la Frontera, Cádiz** |
| Datos | Ninguno de la web. Al cargar el mapa, **Google recibe la IP y datos del navegador** |
| Dónde se ejecuta | Cliente, **solo tras pulsar "Cargar el mapa"** (cero peticiones a Google antes). Enlace "Abrir en Google Maps": `https://www.google.com/maps/search/?api=1&query=Playa%20de%20El%20Palmar%2C%20Vejer%20de%20la%20Frontera` |
| Credenciales | Demo: ninguna (iframe `maps?output=embed`, verificado). Producción: **API de Maps Embed con clave del cliente**, restringida por referente (`NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY`) |
| Coste | La API de Maps Embed: condiciones de Google a consultar al contratar |
| Privacidad | Carga iniciada por el usuario con aviso visible; declarar en la política de cookies; **validar con asesoría** si requiere además consentimiento |
| Fallback | Enlace a Google Maps |
| Pruebas | Antes del clic no hay iframe; tras el clic carga la playa con título accesible (hecho en la maqueta) |
| Coordenadas verificadas | OpenStreetMap 36,2253032 N, -6,0661621 O; Google Maps resuelve la búsqueda por nombre a "Playa de El Palmar" (P.º Marítimo, 11159 Vejer de la Frontera). 3.300 m de arena dorada y 50 m de ancho según spain.info |

### 3.10 Datos estructurados (JSON-LD), horarios y mascotas
`Hotel` con `checkinTime` 15:00, `checkoutTime` 12:00 y `petsAllowed: true`, leídos de los ajustes del CMS (no escritos a mano en cada página). `geo` y `hasMap` **se omiten** mientras la dirección sea ficticia: no se declara una ubicación falsa a los buscadores.

## 4. Secretos y variables
Los VALORES viven solo en el gestor del proveedor de despliegue. Lista de NOMBRES en `.env.example` (sin valores). Rotación: al cambiar de responsable o ante sospecha, y al menos una vez al año. Las credenciales **se comparten por gestor de contraseñas, nunca por chat**. Si alguien pega una clave en un chat, se rota.

## 5. Despliegue
- **Proveedor / hosting:** Vercel, en una cuenta/equipo **propiedad del cliente**. Hobby es solo para uso personal no comercial; un hotel real requiere plan Pro (ADR-0005).
- **Preview/staging:** URL de preview de Vercel (noindex; Stripe en test; Mews en demo; datos ficticios).
- **Producción:** dominio propio del cliente. **Solo con aprobación humana** (`.web-os/approvals/production.json`, creado por una persona). Para el portfolio la "producción" es un dominio de demostración que decide la persona.
- **Plan de rollback:** `docs/runbooks/rollback.md` (a crear en la fase de staging): despliegues inmutables y vuelta a la versión anterior.
- **Copias:** código en GitHub; contenido de Sanity exportado de forma programada y cifrado a un destino del cliente; **una restauración de prueba documentada** antes de entregar.
- **Monitor externo** con aviso de caída (a configurar y probar en staging).

## 6. Plan por fases (ritmo 3-6 semanas)
Cada fase: entregable, criterio de aceptación, verificación y decisión de avanzar. **Nada se construye sin la aprobación de la puerta anterior.**

| # | Fase | Entregable | Criterio de aceptación | Puerta |
|---|---|---|---|---|
| 1 | Brief | `PRODUCT.md` | Claims con evidencia o marcados pendientes | **G0** aprobado 2026-10-09 |
| 2 | Referencias | `creative/references/`, `reference-analysis.md` | ≥ 6 referencias con URL abierta; principios, no clones | incluida en G1 |
| 2b | Maqueta + propuesta UX/UI | `creative/mockup/index.html`, `docs/entregables/01-propuesta-diseno.md` | Sin señales genéricas; 390/768/1440; autocrítica hecha | **G1** aprobado 2026-10-09 |
| 3 | Dirección + arquitectura | `DESIGN.md` final, ADR aprobados, fichas de integración, tokens | Contraste AA; fichas completas | **G2** |
| 4 | Media | `VIDEO_SCORE` por página, `creative/manifest.json`, material recibido (fotos con dos recortes del héroe, vídeos V01 a V03, opcional 360 y profundidad) | Decisión y razón por página; peso y fallbacks dentro del presupuesto de ADR-0006 | **G3** aprobación de media |
| 5 | Implementación (PRs pequeños) | 5.1 base, i18n y cabeceras · 5.2 Sanity y Studio · 5.3 páginas · 5.4 Mews (spike primero) · 5.5 formularios y correo · 5.6 Stripe test (bonos) · 5.7 consentimiento y medición · 5.8 WhatsApp e IA · 5.9 SEO, JSON-LD, 301 y **migración simulada** · 5.10 legales y mapa de datos · 5.11 mapa bajo demanda · 5.12 **spike héroe 2,5D (WebGL)** · 5.13 **spike visor 360** | TS estricto; lint, tipos, unit y build en verde por PR | revisión por PR |
| 6 | QA | Informe de QA | axe sin graves; Lighthouse en presupuesto; e2e del flujo de reserva y formularios; `npm audit` | sin bloqueantes |
| 7 | Staging | Preview + lista de entrega de 22 puntos + `launch:check` | Checklist completo con evidencia | **G4** aprobación escrita |
| 8 | Producción | Release, dominio, SSL, monitor | Aprobación registrada por una persona | solo con aprobación |
| 9 | Entrega y soporte | Docs técnicas, **guía ilustrada para personas sin conocimientos técnicos** (en lugar de vídeo), plan de soporte (precio al final) | Documentos `01` a `05` completos | cierre |

## 7. Responsables
| Rol | Nombre | Contacto |
|---|---|---|
| Responsable del proyecto | (tú) | |
| Aprobador de producción | (tú) | |
| Contacto del cliente | (ficticio en portfolio) | |
