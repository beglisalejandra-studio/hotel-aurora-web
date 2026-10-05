# Mapa de datos y subprocesadores

> Mantenlo al día con cada integración. Lo revisa una persona cualificada (este documento no es asesoría legal). **Estado: borrador propuesto (2026-10-05).** Hoy no existe código que recoja datos: esto describe lo que se recogería al construir, para aprobarlo antes.
>
> **Versión de portafolio:** el hotel es ficticio; no se debe escribir ningún dato real. Las retenciones de la columna «Portafolio» aplican mientras el sitio sea una demostración.

## Datos recogidos
| Dato / categoría | Dónde se recoge | Finalidad | Base legal (a confirmar con asesoría) | Retención real (propuesta) | Portafolio | Quién accede |
|---|---|---|---|---|---|---|
| Nombre completo | alta de cuenta y reserva | identificar al huésped | ejecución del contrato; consentimiento en el alta | mientras exista la cuenta y el plazo legal aplicable | purga automática a las 24 h | el propio titular; personal autorizado del hotel |
| Correo electrónico | alta de cuenta | acceso, confirmaciones y estado de la reserva | ejecución del contrato | ídem | ídem | ídem |
| Teléfono / WhatsApp (opcional) | alta de cuenta | avisos de estado por WhatsApp | **consentimiento explícito** (opt-in) | hasta que retire el consentimiento | ídem | ídem |
| Fechas, tipo de habitación, número de huéspedes | reserva | gestionar la estancia | ejecución del contrato | plazo legal aplicable | purga a las 24 h | ídem |
| Consentimientos (tipo, versión, fecha) | alta y preferencias | prueba del consentimiento | obligación de acreditar el consentimiento | mientras exista la cuenta | purga a las 24 h | titular; responsable |
| Dirección IP y agente de usuario (registros técnicos y límite de tasa) | todas las peticiones | seguridad y prevención de abuso | interés legítimo | **corta** (propuesta: 30 días) | ídem | responsable técnico |
| Datos de tarjeta | **no se recogen en ningún caso** | n/a | n/a | n/a | n/a | n/a |

Minimización: **no** se piden documento de identidad, fecha de nacimiento ni dirección en la reserva en línea.

## Subprocesadores / proveedores (propuestos, sin contratar)
| Proveedor | Para qué | Datos que recibe | Ubicación | Contrato/DPA | Coste |
|---|---|---|---|---|---|
| Hosting (undecided) | servir el sitio | IP, registros de acceso | por definir | por definir | **verificar en su página oficial** |
| Supabase (propuesto) | base de datos y autenticación | nombre, correo, teléfono, reservas | por elegir al crear el proyecto | por revisar | **verificar** |
| Resend (propuesto) | correo transaccional | nombre, correo | por definir | por revisar | **verificar** |
| Meta, API de WhatsApp Business (propuesto) | avisos por WhatsApp | teléfono, contenido de la plantilla | por definir | por revisar | **verificar** |
| Proveedor de CAPTCHA (por elegir) | frenar abuso en registro y acceso | IP, señales del navegador | por definir | por revisar | **verificar** |
| Almacenamiento estático de PMTiles (mismo hosting) | mapa | IP en registros de acceso | igual que el hosting | igual | incluido |
| Google (Gemini, si se usa) | análisis del brief/copy | SOLO material sin datos de clientes salvo plan de pago | n/a | n/a | n/a |

**Fuentes tipográficas:** se autoalojan; el sitio **no** pide fuentes a Google en tiempo de ejecución (evita enviar la IP del visitante a un tercero).

## Cookies y consentimiento
| Cookie / almacenamiento | Categoría | Duración | Se carga tras consentir |
|---|---|---|---|
| `consent` | necesaria (prueba del consentimiento) | 180 días | no aplica |
| Cookie de sesión de autenticación (`HttpOnly`, `Secure`, `SameSite=Lax`) | necesaria | sesión | no aplica |
| Caché del service worker (solo recursos públicos, sin datos personales) | necesaria | hasta nueva versión | no aplica |
| Analítica | analítica | según proveedor | **sí; rechazar = aceptar** |

## Eventos de analítica (versión del esquema: 1)
Catálogo en `lib/analytics/events.ts`. Sin PII. Cada cambio de esquema se anota aquí. Eventos propuestos: `date_range_selected`, `room_viewed`, `booking_started`, `account_created`, `booking_confirmed` (solo en una operación real), `app_installed`.

## Derechos del titular
Acceso, rectificación, supresión y retiro de consentimientos desde la cuenta (exportar y eliminar). Canal de contacto por definir.
