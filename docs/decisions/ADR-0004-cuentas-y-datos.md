# ADR-0004 · Cuentas de huésped y datos (seguridad primero)

- **Estado:** propuesta · **Fecha:** 2026-10-05 · **Decide:** responsable del proyecto
- **Contexto:** los huéspedes deben crear cuenta, ver disponibilidad y reservar. Lo más importante del proyecto es **proteger los datos de los clientes**. Hay que evitar dobles reservas y decidir cómo se comporta el registro en un portafolio público.

## Decisión propuesta
**Postgres con seguridad por fila (RLS) y autenticación gestionada.** Candidato: **Supabase** (Postgres + Auth). Fuente consultada el 2026-10-05: soporta contraseña, enlace mágico, código de un solo uso, inicio con redes sociales y SSO, MFA (TOTP y teléfono) y control de acceso por fila con RLS. *Passkeys:* no confirmado en la documentación consultada; se verifica antes de prometerlo.

### Alternativas
| Opción | A favor | En contra |
|---|---|---|
| **Supabase** (recomendada) | RLS nativo, Auth integrada, un proveedor, SQL estándar | dependencia de proveedor; el plan gratuito puede pausar proyectos inactivos (**verificar vigencia**) |
| Auth.js + Postgres gestionado (Neon u otro) | sin dependencia de Auth propietaria, control total | más código de seguridad que mantener nosotros |
| Clerk u otro IdP | UI de acceso lista, MFA | coste por usuario activo y datos de identidad en un tercero |

### Datos que se guardan (mínimo necesario)
`profiles` (nombre, teléfono opcional, preferencias de aviso), `room_types`, `inventory` (noche × tipo: unidades y precio), `bookings` (usuario, tipo, llegada, salida, huéspedes, estado, vencimiento de retención, total, `demo`), `booking_events` (cola de notificaciones), `consents` (tipo, versión, fecha). **No se guardan:** datos de tarjeta, documento de identidad, fecha de nacimiento ni nada que no sea indispensable.

### Reglas de seguridad
- **RLS en toda tabla con datos personales:** `user_id = auth.uid()`. Prueba **negativa** obligatoria (un usuario no puede leer ni escribir datos de otro).
- La disponibilidad pública sale de una **vista agregada sin datos personales**. Las escrituras de inventario y reservas pasan **solo por el servidor** (rol de servicio, nunca en el navegador).
- **Reserva sin doble venta:** una transacción bloquea las noches (`SELECT … FOR UPDATE`), retiene las unidades por un tiempo corto (10 a 15 minutos) con vencimiento automático, y usa **clave de idempotencia**. Prueba de carrera con dos reservas simultáneas.
- **Acceso:** contraseña de al menos 12 caracteres con comprobación de contraseñas filtradas, o enlace mágico; MFA opcional (obligatoria para quien administre); CAPTCHA en alta y acceso; **límite de tasa** por IP y por cuenta.
- **Sesión:** cookies `HttpOnly`, `Secure`, `SameSite=Lax`; cierre de sesión en todos los dispositivos; sin tokens en `localStorage`.
- **Transporte y navegador:** HTTPS con HSTS; CSP con nonce (módulo `strict-csp`, a decidir con medición de rendimiento); `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors 'none'`.
- **Validación en servidor** con zod en cada ruta; mensajes de error que no revelan si un correo existe.
- **Registros sin datos personales;** auditoría de accesos administrativos; secretos solo en el gestor del proveedor; rotación cada 90 días.
- **Derechos del titular:** desde la cuenta se puede **exportar y eliminar** la información. Base legal, retención y subprocesadores en `docs/privacy/data-map.md` (a confirmar con asesoría legal).
- **Consentimientos separados:** términos y privacidad (obligatorio), avisos por correo (por defecto), por WhatsApp (opt-in explícito), marketing (desmarcado). Se guardan con versión y fecha.

### Comportamiento en el portafolio (pregunta abierta para el responsable)
Un visitante podría escribir sus datos reales en un sitio de demostración. Dos opciones:
- **A (recomendada):** el registro **funciona** contra un proyecto aparte de pruebas, con aviso visible de «no escribas datos reales», **purga automática a las 24 horas**, reservas con `demo=true` y **ninguna notificación real** (vista previa en una bandeja de demostración).
- **B:** todo simulado en el navegador, sin guardar nada (más seguro, pero no demuestra la cuenta real).

## Consecuencias
- (+) Un solo modelo de permisos verificable con pruebas.
- (+) El aviso y la purga reducen el riesgo de custodiar datos de visitantes.
- (−) Requiere proveedor gestionado y disciplina con las políticas RLS (cada tabla nueva nace con su política y su prueba negativa).
