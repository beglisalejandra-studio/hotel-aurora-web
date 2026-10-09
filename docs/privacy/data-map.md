# Mapa de datos y subprocesadores (registro de proveedores)

> Mantenlo al día con cada integración. Lo revisa una persona cualificada: **este documento no es asesoría legal**. Estado: **borrador de diseño (fase 3)**; ninguna integración está implementada todavía. Donde pone «por verificar» no he podido comprobar el dato en una fuente oficial.

## Datos recogidos
| Dato / categoría | Dónde se recoge | Finalidad | Base legal (propuesta) | Retención (propuesta) | Quién accede |
|---|---|---|---|---|---|
| Nombre, correo, teléfono opcional, mensaje | Formulario de contacto | Responder a la consulta | Consentimiento (casilla no premarcada) | Hasta resolver la consulta y el plazo que fije la asesoría | Persona responsable del hotel |
| Nombre, correo, fecha, comensales, comentarios | Solicitud de mesa | Confirmar la mesa | Medidas precontractuales y consentimiento | Hasta la fecha de la reserva más el plazo de la asesoría | Persona responsable del hotel |
| Nombre, correo, fecha, tratamiento, comentarios | Solicitud de cita de spa | Confirmar la cita | Medidas precontractuales y consentimiento | Ídem | Persona responsable del hotel |
| Datos de la reserva (fechas, huéspedes, perros, contacto, pago) | **Widget de Mews** | Gestionar la estancia | Ejecución del contrato | Lo fija el contrato del hotel con Mews | Hotel y Mews. **La web no los recibe ni los guarda** |
| Correo y datos de pago de bonos | **Stripe Checkout alojado** | Cobrar y entregar el bono | Ejecución del contrato | La web guarda solo estado del pedido y código del bono | Hotel y Stripe. **La web nunca ve la tarjeta** |
| Mensajes al asistente de IA | Panel del asistente | Resolver dudas con la información del hotel | Interés legítimo con aviso visible (a validar) | **No se guardan** por defecto | Nadie en la web; el proveedor de IA los procesa al responder |
| Pulsación en WhatsApp | Enlace a `wa.me` | Contacto humano | Acción voluntaria del usuario | La web no guarda nada | Meta (WhatsApp) tras salir de la web |
| Cuentas de editores (nombre, correo) | Panel de contenido (Sanity) | Acceso al panel | Ejecución del encargo / interés legítimo | Mientras sean editores | Administradores de la cuenta |

## Subprocesadores / proveedores
| Proveedor | Para qué | Datos que recibe | Ubicación | Contrato/DPA | Coste |
|---|---|---|---|---|---|
| Vercel | Alojar y servir el sitio | IP y registros de acceso | Región de funciones de la UE a configurar (p. ej. `cdg1`); resto **por verificar** | Pendiente de revisar | Hobby solo para uso personal no comercial; Pro para un hotel real (ADR-0005) |
| Sanity | Gestor de contenido | Contenido editorial y cuentas de editores. **Sin datos de huéspedes** | **Por verificar** | Pendiente de revisar | Plan gratuito para el portfolio (roles Administrador y Visor); términos de uso comercial **por verificar** |
| Stripe | Cobro de bonos con Checkout alojado | Datos de pago y correo del comprador (los trata Stripe) | **Por verificar** | Pendiente de revisar | Comisiones según tarifa vigente (por consultar) |
| Mews | Motor de reservas | Datos de la reserva y del huésped | **Por verificar** | Pendiente de revisar (contrato del hotel con Mews) | Demo gratuita; producción según contrato |
| Resend | Correo de solicitudes y de bonos | Contenido de los mensajes (nombre, correo y texto) | Región UE **por verificar** | Pendiente de revisar | Plan vigente por consultar |
| Google (Maps) | Mapa de la Playa de El Palmar | IP y datos del navegador, **solo tras pulsar «Cargar el mapa»** | **Por verificar** | Condiciones de Google | Embed sin clave en la demo; clave del cliente en producción |
| Google (GA4) | Analítica | Identificadores pseudónimos y eventos sin datos personales, **solo con consentimiento de analítica** | **Por verificar** | Condiciones de Google | Gratuito (límites de uso) |
| Meta (Pixel) | Medición de campañas | Identificadores del navegador y eventos, **solo con consentimiento de marketing** | **Por verificar** | Condiciones de Meta | Gratuito; el coste es la publicidad |
| Proveedor de IA del asistente | Responder dudas | El texto que escriba la persona (puede incluir datos personales sin querer) | **Por verificar** | Condiciones del proveedor, por revisar antes de producción | Por uso, con tope mensual |
| Google AI Studio (Gemini) | **No se usa** | n/a | n/a | n/a | n/a |

## Cookies y almacenamiento
| Elemento | Categoría | Duración | Se carga tras consentir |
|---|---|---|---|
| `consent` (decisión del banner) | Necesaria (prueba del consentimiento) | 180 días | No aplica |
| Preferencia de idioma | Necesaria (la elige el usuario) | Hasta que la cambie | No |
| Preferencia de tema Día o Madrugada | Necesaria (la elige el usuario) | Hasta que la cambie | No |
| Cookies de Google Maps | Terceros, iniciadas por el usuario | **Por verificar** | Solo tras pulsar «Cargar el mapa» |
| Cookies de GA4 | Analítica | **Por verificar** | Sí, con consentimiento de analítica |
| Cookies del Pixel de Meta | Marketing | **Por verificar** | Sí, con consentimiento de marketing |

En la maqueta, el idioma, el tema y la decisión de cookies se guardan en el almacenamiento del navegador de la persona. En la web real se confirmará qué mecanismo se usa y se ajustará esta tabla.

## Consent Mode v2 (señales por defecto: denegadas)
`analytics_storage`, `ad_storage`, `ad_user_data` y `ad_personalization` empiezan en «denied» y se actualizan según las categorías que acepte la persona. Modo básico: las etiquetas de Google y el Pixel no se cargan antes del consentimiento (ADR-0004).

## Eventos de analítica (versión del esquema: 1)
Catálogo versionado, sin datos personales: `view_item`, `begin_booking`, `generate_lead`, `purchase` (desde servidor tras el webhook), `whatsapp_click`, `chat_open`. Pendiente: medir la reserva completada en Mews (ADR-0002). Cada cambio de esquema se anota aquí.

## Derechos de las personas
Acceso, rectificación, supresión, oposición, limitación y portabilidad. Procedimiento y plazos: capítulo 11 de `docs/entregables/03-guia-de-gestion.md` (a validar con asesoría).
