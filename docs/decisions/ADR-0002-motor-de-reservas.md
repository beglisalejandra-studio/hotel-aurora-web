# ADR-0002 · Motor de reservas: Mews (widget oficial) tras una interfaz intercambiable

Estado: **propuesto** · Fecha: 2026-10-09

## Contexto
Se me delegó la elección del PMS/motor de reservas porque es un proyecto de portfolio que debe sentirse real. Para un hotel real, **gana el PMS que el hotel ya usa**; esta decisión es la mejor para demostrar una integración auténtica y verificable sin contrato.

## Hechos verificados (documentación oficial de Mews, consultada 2026-10-09)
- Widget JavaScript: script `https://api.mews.com/distributor/distributor.min.js` en `<head>`, sin `async`, sin iframe. El sitio debe servirse por HTTPS o el widget redirige al Booking Engine alojado.
- Inicialización: `Mews.Distributor({ configurationIds: [...], openElements: '.distributor-open' })`. Cualquier elemento con esa clase abre el widget.
- Idioma y moneda por API: `setLanguageCode('es-ES')`, `setCurrencyCode('EUR')`.
- Consentimiento: `enableTracking()` y `disableTracking()` activan o desactivan todos los consentimientos de seguimiento del widget.
- **Entorno demo:** `dataBaseUrl: 'https://api.mews-demo.com'` como tercer argumento; un hotel demo donde consultar disponibilidad y crear reservas de prueba; los ID de configuración de demo y producción **no son intercambiables**. El ID de demo está en la guía "Environments" de Mews.
- El script responde desde la red de este entorno (HTTP 302 a su fichero versionado) y el host demo responde 200.

## Alternativas valoradas
| Opción | Estado de verificación | Motivo |
|---|---|---|
| **Mews** | Verificada arriba | Widget oficial, demo pública con reservas de prueba, API de idioma/moneda/consentimiento |
| Cloudbeds | Ayuda oficial revisada | Su experiencia embebida premium depende del plan contratado y exige whitelist de dominio; sin cuenta no se puede demostrar. Útil si el hotel real ya lo usa |
| SiteMinder | Sin documentación pública de embed localizada en mis búsquedas | Muy extendido en España, pero no pude verificar el widget; no lo asumo |
| Beds24, otros | No evaluados | Fuera del alcance de esta fase |

## Decisión
Mews como motor de reservas. La web habla con él **solo** a través de una interfaz propia (`BookingProvider`: `open()`, `setLocale()`, `setConsent()`), de modo que cambiar de motor es una tarea de un adaptador, no un rediseño.

## Consecuencias
- **Pagos de alojamiento:** los gestiona Mews; la web no ve tarjetas. Stripe queda para experiencias sin alojamiento (ADR-0005).
- **Limitación de la demo:** el hotel demo de Mews tiene sus propias habitaciones y tarifas. El widget mostrará esas, no "Alba" o "Marea". Se declara en la presentación; en producción cada habitación del CMS lleva el identificador de su categoría en Mews para enlazar directo.
- **Paquetes con noche:** se resuelven con tarifas o códigos en Mews. En la demo no se puede garantizar que existan; el botón abre el widget genérico.
- **Spike obligatorio** al inicio de la fase 5 (en HTTPS, preview): carga, apertura, idioma, moneda y consentimiento. Si falla, plan B: enlace al motor alojado y WhatsApp.
- **Por verificar:** cómo medir la reserva completada en GA4 (la documentación revisada remite a una sección de integraciones que no leí).
