# Mapa de datos y subprocesadores (registro de proveedores)

> Mantenlo al día con cada integración. Lo revisa una persona cualificada: **este documento no es asesoría legal**. Estado: **web real en preview (2026-10-26)**; ver «Estado en la web real» al final. Donde pone «por verificar» no he podido comprobar el dato en una fuente oficial.

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
| Mapa propio (OpenStreetMap exportado) | Mapa de «Cómo llegar» | **Nada**: imagen alojada en la web; al pulsarlo se abre la app de mapas del visitante, fuera de la web (decisión de la persona, 2026-10-25) | n/a | Licencia ODbL con atribución | Sin coste |
| Google (GA4) | Analítica | Identificadores pseudónimos y eventos sin datos personales, **solo con consentimiento de analítica** | **Por verificar** | Condiciones de Google | Gratuito (límites de uso) |
| Meta (Pixel) | Medición de campañas | Identificadores del navegador y eventos, **solo con consentimiento de marketing** | **Por verificar** | Condiciones de Meta | Gratuito; el coste es la publicidad |
| Proveedor de IA del asistente | Responder dudas | El texto que escriba la persona (puede incluir datos personales sin querer) | **Por verificar** | Condiciones del proveedor, por revisar antes de producción | Por uso, con tope mensual |
| Anthropic (API de Claude) | Sugerir la descripción de las fotos que sube el equipo del hotel en el panel | La foto (contenido del hotel, sin datos de huéspedes) y el título del documento; solo a petición de un editor | **Por verificar** | Condiciones comerciales de la API (sin entrenamiento con los datos por defecto): por revisar antes de producción | Por uso, con la clave del cliente en Vercel |
| Google AI Studio (Gemini) | **No se usa** | n/a | n/a | n/a | n/a |

## Cookies y almacenamiento
| Elemento | Categoría | Duración | Se carga tras consentir |
|---|---|---|---|
| `consent` (decisión del banner) | Necesaria (prueba del consentimiento) | 180 días | No aplica |
| Preferencia de idioma | Necesaria (la elige el usuario) | Hasta que la cambie | No |
| Preferencia de tema Día o Madrugada | Necesaria (la elige el usuario) | Hasta que la cambie | No |
| Cookies de GA4 | Analítica | **Por verificar** | Sí, con consentimiento de analítica |
| Cookies del Pixel de Meta | Marketing | **Por verificar** | Sí, con consentimiento de marketing |

En la maqueta, el idioma, el tema y la decisión de cookies se guardan en el almacenamiento del navegador de la persona. En la web real: la decisión va en la cookie `consent`, el tema en `localStorage` (`aurora-theme`) y el idioma en la dirección (`/en`), sin guardar nada.

## Consent Mode v2 (señales por defecto: denegadas)
`analytics_storage`, `ad_storage`, `ad_user_data` y `ad_personalization` empiezan en «denied» y se actualizan según las categorías que acepte la persona. Modo básico: las etiquetas de Google y el Pixel no se cargan antes del consentimiento (ADR-0004).

## Eventos de analítica (versión del esquema: 1)
Catálogo versionado, sin datos personales: `view_item`, `begin_booking`, `generate_lead`, `purchase` (desde servidor tras el webhook), `whatsapp_click`, `chat_open`. Pendiente: medir la reserva completada en Mews (ADR-0002). Cada cambio de esquema se anota aquí.

## Derechos de las personas
Acceso, rectificación, supresión, oposición, limitación y portabilidad. Procedimiento y plazos: capítulo 11 de `docs/entregables/03-guia-de-gestion.md` (a validar con asesoría).

## Páginas legales publicadas en la maqueta (2026-10-25)
Política de privacidad, política de cookies, aviso legal y condiciones de reserva (`#/legal/…`, ES/EN), redactadas a partir de este mapa de datos. Textos de ejemplo para un hotel ficticio: **un hotel real los revisa con su asesoría** antes de publicarlos. En la web real se editan desde el panel.

## Estado en la web real (2026-10-26)
- **Navegar no conecta con terceros** (comprobado con una prueba automática, `tests/e2e/site.spec.ts`): fotos del panel servidas desde el propio dominio por el optimizador de imágenes (`/_next/image`, que las pide a Sanity desde el servidor), tipografías y mapa alojados en la web.
- **Mews** solo se descarga al pulsar «Reservar». Su widget intenta cargar rastreadores propios (Google Tag Manager `GTM-TTTCZJQ`, Sentry, LaunchDarkly, Azure Application Insights): la política de seguridad de la web los bloquea y la reserva funciona igual. Además se llama a `disableTracking()` salvo que el visitante acepte analítica y marketing (los rastreadores de Mews mezclan las dos cosas).
- **Solicitudes de mesa, spa y bono**: `/api/request` (mismo origen, 5 cada 10 minutos por IP, antispam, validación con zod). Destino: correo del hotel con Resend si `LEAD_SINK=resend`; si no, solo se registra «llegó una solicitud», sin datos personales.
- **Asistente**: sin `ANTHROPIC_API_KEY` responde con las preguntas frecuentes del panel, en el navegador, sin enviar nada. Con la clave, `/api/assistant` manda la pregunta y el contenido publicado del hotel a la API de Claude; no se guarda la conversación; 20 preguntas cada 10 minutos por IP y tope diario.
- **Almacenamiento**: el tema Día o Madrugada se guarda en el navegador (`aurora-theme`); el idioma va en la dirección (`/en`), sin cookie.
- **Editor visual del panel (2026-10-26)**: solo para quien edita, dentro del panel. Su vista previa usa la cookie de modo borrador de Next (`__prerender_bypass`, de sesión) y el panel guarda un secreto de un solo uso en Sanity. Los visitantes nunca reciben estas cookies ni el código del editor.
- **Aviso de cookies (desde 2026-10-26, pedido de la persona)**: sale en la primera visita con Aceptar, Rechazar y Configurar al mismo nivel; nada marcado de antemano; «Configurar cookies» siempre en el pie. La decisión se guarda en la cookie propia `consent` (180 días, `SameSite=Lax`, `Secure` en HTTPS, versión de la política dentro). Hoy no hay GA4 ni Pixel de Meta instalados: el aviso ya gobierna su carga cuando se activen y, desde hoy, los rastreadores de Mews. Textos editables en el panel («Aviso de cookies»).
