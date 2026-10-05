---
type: new
status: design
duration: 3-6w
visual_authority: taste-skill
stack: next
hosting: undecided
figma_seat: view
mode: auto
---

# PROJECT — Hotel Aurora

> Alcance, arquitectura, integraciones, secretos y despliegue. **El front-matter gobierna al sistema**: `type` (new | redesign | maintenance), `status` (discovery → design → build → qa → staging → production → maintenance), `duration` (1-3d | 1-2w | 3-6w), `visual_authority` (UNA sola: taste-skill | impeccable), `stack`, `hosting`, `figma_seat` (view | collab | dev | full: define el presupuesto de lecturas de Figma), `mode` (auto | explain).

**Estado actual (2026-10-05):** brief, referencias globales (18, verificadas con navegador real), `VIDEO_SCORE` y **maqueta HTML v2 entregados; esperan aprobación** antes de construir. La v1 se rechazó por genérica y se rehízo (concepto «Una habitación por hora», color plano por hora, movimiento solo con CSS); la v2 pasó una revisión adversarial de seis dimensiones y se corrigieron sus hallazgos altos y medios. No hay código de producción todavía.

## 1. Alcance
- **Objetivo de conversión (único):** reserva directa completada. En la versión de portafolio, el recorrido termina en un pago **bloqueado** y una confirmación de ejemplo.
- **Dentro del alcance:**
  - Sitio muy visual: portada, hotel, habitaciones (página por habitación), alrededores con mapa, disponibilidad.
  - Cuentas de huésped, calendario de disponibilidad, reserva y pago (este último simulado y bloqueado), estado de la reserva por correo y WhatsApp (en portafolio: vista previa, no se envía).
  - App instalable (PWA) en celular y computador, con reserva desde la app.
  - Seguridad de datos, rendimiento y diseño responsive (celular, tablet, computador).
- **Fuera del alcance:**
  - Cualquier cobro, reserva o mensaje reales; datos de clientes reales.
  - Producción, dominio y DNS (requieren aprobación humana).
  - Channel manager / PMS, reseñas, programa de fidelidad, panel de administración completo (se propone solo uno mínimo si se aprueba).
- **Fechas / hitos:** ver §6.

## 2. Arquitectura
- **Stack:** Next.js 16 + React 19 + TypeScript estricto + Tailwind 4 (plantilla). Justificación: `docs/decisions/ADR-0001-stack.md`. Se **omite** el módulo `visual-editor` (ADR-0002) porque el diseño es a medida y no por bloques; se puede añadir después con `npm run module:add -- visual-editor`.
- **Renderizado:** páginas públicas estáticas (SSG/ISR, servidas desde CDN); solo cuenta, disponibilidad y reserva son dinámicas.
- **Sitemap / páginas:** `/` · `/habitaciones/[slug]` · `/reservar` (4 pasos) · `/cuenta` y `/cuenta/reservas` · `/privacidad` · `/terminos` · `/cookies` · `/offline` · 404 y error.
- **Idiomas:** español de Colombia (`es-CO`). Inglés: **pendiente de decisión** (módulo `i18n` de la plantilla).
- **Contenido editable por el cliente:** habitaciones, textos y fotos desde archivos versionados en el repo (sin editor visual); disponibilidad y tarifas desde la base de datos.

### Decisiones de arquitectura propuestas (ADR)
| ADR | Decisión | Estado |
|---|---|---|
| `ADR-0003-pagos-bloqueados.md` | Pagos detrás de una interfaz; en portafolio solo existe `DemoPaymentProvider` que rechaza; guardas contra claves reales | propuesta |
| `ADR-0004-cuentas-y-datos.md` | Auth y base de datos con Postgres y seguridad por fila; mínimo de datos personales | propuesta |
| `ADR-0005-pwa.md` | Manifiesto + service worker propio mínimo; sin caché de datos personales | propuesta |
| `ADR-0006-mapa.md` | Mapa real bajo demanda con MapLibre y PMTiles autoalojado; esquema SVG como póster | propuesta |

## 3. Integraciones (una ficha por integración)
> Sin ficha completa no se integra. «Propuesta» = pendiente de aprobación. Costes: **por verificar en la página oficial vigente** antes de contratar.

| Integración | Objetivo | Datos (PII) | Dónde corre | Credenciales (nombre y custodia) | Privacidad | Fallback | Pruebas |
|---|---|---|---|---|---|---|---|
| **Auth + base de datos** (propuesta: Supabase, Postgres con RLS) | cuentas, reservas, disponibilidad | nombre, correo, teléfono opcional | servidor; el cliente solo usa la clave pública | `SUPABASE_URL`, `SUPABASE_ANON_KEY` (públicas), `SUPABASE_SERVICE_ROLE_KEY` (secreta, solo servidor) en el gestor del proveedor | base legal y retención en `docs/privacy/data-map.md`; subprocesador a registrar | página de mantenimiento; reserva en pausa sin perder datos | unitarias de políticas RLS; e2e del alta y la reserva con datos ficticios |
| **Disponibilidad y tarifas** | calendario y precios por noche | ninguno | servidor | n/a | n/a | si falla, el calendario muestra «no se pudo cargar» y no permite reservar | unitarias del cálculo; carrera de dos reservas simultáneas |
| **Pagos** | cobrar una reserva | ninguno de tarjeta (nunca pasa por el sitio) | servidor | **ninguna en portafolio**. Futuro: clave de la pasarela solo en servidor | no se guardan datos de tarjeta | n/a | prueba que el pago real **no puede** activarse en portafolio |
| **Correo transaccional** (propuesta: Resend) | estado de la reserva | nombre, correo | servidor | `RESEND_API_KEY` | subprocesador a registrar | cola con reintentos | plantillas con datos ficticios; en portafolio solo vista previa |
| **WhatsApp** (propuesta: API de WhatsApp Business de Meta) | estado de la reserva | teléfono (con opt-in) | servidor | token del sistema en el gestor | consentimiento explícito; plantillas aprobadas | si falla, correo | en portafolio solo vista previa; los mensajes iniciados por la empresa exigen plantillas aprobadas |
| **Mapa** (MapLibre + PMTiles autoalojado) | ubicación y atracciones | ninguno | cliente, bajo demanda | ninguna | sin rastreadores de terceros | esquema SVG estático | e2e de carga bajo demanda y teclado |
| **Analítica** (módulo `analytics-consent`) | medir conversión | eventos sin PII | cliente tras consentir | IDs públicos | consentimiento previo; rechazar = aceptar | sin analítica | verificar que no hay peticiones antes de aceptar |
| **CAPTCHA** (Turnstile u otro) | frenar abuso en registro y acceso | ninguno | cliente + verificación en servidor | secreto en servidor | por revisar | límite de tasa | prueba de bots |

## 4. Secretos y variables
Los VALORES viven solo en el gestor del proveedor de despliegue. Lista de NOMBRES en `.env.example`. **Nunca** en el repo, el chat ni el cliente. Rotación: cada 90 días y ante cualquier sospecha. Bandera de seguridad: `DEMO_MODE=1` en todos los entornos de portafolio (ver `ADR-0003`).

## 5. Despliegue
- **Proveedor / hosting:** **undecided.** Opciones a comparar al aprobar (no se impone ninguna):
  - **Vercel:** integración nativa con Next.js, previews por rama; el plan gratuito es para uso no comercial (válido para portafolio).
  - **Cloudflare:** CDN y red global fuertes; requiere adaptar el despliegue de Next.
  - **VPS o contenedor (Dockerfile ya incluido):** más control y más mantenimiento.
- **Preview/staging:** por definir (`noindex`; pagos bloqueados; datos ficticios).
- **Producción:** dominio por definir — **solo con aprobación humana** (`.web-os/approvals/production.json`, creado por una persona).
- **Plan de rollback:** `docs/runbooks/rollback.md`.

## 6. Plan por fases (ritmo: 3-6w)
| Fase | Entregable | Criterio de aceptación | Verificación | Estado |
|---|---|---|---|---|
| 0. Brief, referencias y maqueta | `PRODUCT.md`, `DESIGN.md`, referencias, maqueta HTML, `VIDEO_SCORE` | maqueta sin señales genéricas, sin desbordes 360 a 1440 px, contraste AA | capturas y pruebas de flujo (hechas) | **entregada, espera aprobación** |
| 1. Base técnica | proyecto Next, tokens en CSS, layout, portada estática, pipeline de imágenes, CI | lint, tipos, pruebas y build en verde | `npm run lint typecheck test build` | pendiente |
| 2. Habitaciones y calendario | páginas de habitación, calendario con datos reales de disponibilidad, mapa bajo demanda | sin doble reserva en prueba de carrera; teclado completo | unitarias + e2e | pendiente |
| 3. Cuentas y reserva | auth, políticas RLS, reserva con retención temporal, pago bloqueado, notificaciones en vista previa | un huésped solo ve sus datos (prueba negativa); pago real imposible en portafolio | pruebas de seguridad + e2e | pendiente |
| 4. PWA y SEO | manifiesto, service worker, instalación, atajos, offline, JSON-LD, sitemap | instalable en Android, iOS y escritorio; sin datos personales en caché | panel Application de DevTools + prueba manual en dispositivos | pendiente |
| 5. QA y rendimiento | axe, Lighthouse móvil, e2e, `npm audit`, cabeceras, CSP | presupuestos de `DESIGN.md` §7 cumplidos | `/web-qa` | pendiente |
| 6. Preview y entrega | preview, lista de entrega, guía de gestión, documentación | aprobación humana escrita | `docs/qa/entrega-checklist.md` | pendiente |

## 7. Responsables
| Rol | Nombre | Contacto |
|---|---|---|
| Responsable del proyecto | beglisalejandra-studio | por definir |
| Aprobador de producción | por definir | |
| Contacto del cliente | no aplica (portafolio) | |
