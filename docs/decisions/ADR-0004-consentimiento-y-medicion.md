# ADR-0004 · Consentimiento (Consent Mode v2) y medición

Estado: **aceptado** el 2026-10-09 (sin objeciones) · Fecha: 2026-10-09

## Contexto
Obligatorio en España/UE: RGPD + LOPDGDD, aviso legal (LSSI), política de cookies, y banner con **Aceptar, Rechazar y Configurar al mismo nivel** (criterio de la AEPD, indicado en el encargo). Medición requerida: GA4 y Pixel de Meta con Consent Mode v2.

## Decisión
1. **Banner propio y autoalojado**, ampliando el módulo `analytics-consent` de la plantilla (que ya hace rechazar = aceptar y carga proveedores solo tras consentir). Sin script de terceros para el consentimiento.
2. **Tres botones idénticos en tamaño, estilo y prominencia**: Aceptar, Rechazar, Configurar. Categorías: necesarias (fijas), analítica, marketing. Enlace permanente "Configurar cookies" en el pie. Se vuelve a preguntar si cambia la versión del esquema.
3. **Consent Mode v2:** antes de cargar nada, estado por defecto **denegado** para `ad_storage`, `analytics_storage`, `ad_user_data` y `ad_personalization`; al decidir el usuario se envía la actualización según categorías.
4. **Modo básico (conservador):** las etiquetas de Google y el Pixel **no se cargan** hasta consentir (no se envían pings sin consentimiento). Se pierde modelado de conversiones; se gana cumplimiento claro. Revisar con asesoría si el hotel quiere el modo avanzado.
5. **GA4 con `gtag` directo, sin GTM** por defecto: el catálogo de eventos vive en código, tipado y sin datos personales; con GTM cualquier persona con permiso de publicación podría inyectar scripts arbitrarios, lo que choca con el objetivo de seguridad. GTM queda como opción si una agencia lo exige, con permisos restringidos y CSP.
6. **Pixel de Meta:** solo con consentimiento de marketing. Conversions API del lado servidor es opcional y requeriría ficha propia, `event_id` para deduplicar y base legal.
7. **Widget de Mews:** `enableTracking()` / `disableTracking()` se ligan al mismo estado de consentimiento.

## Alternativas valoradas
| Opción | Veredicto |
|---|---|
| Complianz | Es un plugin de WordPress: no aplica a este stack |
| CookieYes | Válido como script de terceros; añade proveedor, peso y condiciones de plan que **no verifiqué**. Se mantiene como sustituto detrás de la misma interfaz si hiciera falta |
| CMP certificada por Google | **Por verificar:** si el hotel usara Google Ads con remarketing en el EEE, Google puede exigir una CMP certificada. En ese caso se cambia el proveedor del banner sin tocar el resto |

## Eventos (catálogo versionado, sin PII)
`view_item` (ficha de habitación) · `begin_booking` (apertura del widget) · `generate_lead` (mesa, cita, contacto) · `purchase` (bono, **desde servidor tras el webhook**, deduplicado) · `whatsapp_click` · `chat_open`. **Pendiente:** medir la reserva completada en Mews (ver ADR-0002).

## Pruebas obligatorias en staging
(1) Antes de decidir no sale ninguna petición a Google, Meta ni Mews de seguimiento; (2) tras aceptar, cada conversión llega **una** vez; (3) "Rechazar" mantiene todo apagado; (4) cambiar la decisión en "Configurar cookies" se aplica sin recargar.

## Rendimiento
Los scripts de medición entran después del consentimiento y en reposo del hilo principal, para no penalizar INP ni LCP. Las métricas de campo (`web-vitals`) solo se envían con consentimiento de analítica; sin tráfico, la evidencia es de laboratorio (Lighthouse).

## Estado en la web real (2026-10-26)
- **Aviso visible desde la primera visita** (pedido de la persona: «en España es obligatorio»). Se había dejado oculto mientras no hubiera analítica; se revierte: el aviso de la maqueta (Aceptar, Rechazar y Configurar idénticos; segunda capa con necesarias fijas, analítica y marketing sin marcar; «Configurar cookies» en el pie) va en todas las páginas.
- Lo muestra el script del `<head>` si no hay decisión vigente (cookie `consent` ausente, corrupta o de otra versión): aparece con la página, sin esperar al JavaScript, y no parpadea a quien ya decidió. Cerrar con Escape solo vale al reabrirlo desde el pie (cerrar sin elegir no es consentir).
- Hoy no hay GA4 ni Pixel de Meta. Mews: `enableTracking()` solo con analítica **y** marketing aceptadas; si la reserva ya está abierta, la nueva decisión se aplica sin recargar.
- Textos editables en el panel (documento único «Aviso de cookies»); si se dejan vacíos, se usan los de serie.
- Pruebas: `tests/e2e/site.spec.ts` (mismo tamaño de los tres botones, nada marcado, Rechazar guarda todo apagado y no vuelve a preguntar, el pie lo reabre y guarda el cambio) y `tests/unit/analytics.test.ts` (`readDecision`).
