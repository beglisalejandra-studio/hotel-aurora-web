# Cuentas y claves: qué se necesita, cuándo y cómo se comparte

> **Regla de oro: nunca pegues una contraseña, una clave o un token en el chat, en un issue, en un correo ni en el repositorio.** Si ocurre por error, se **rota** esa clave (se genera una nueva y se anula la anterior) y no se usa la que se pegó.
> **Estado hoy (2026-10-09): no existe ninguna cuenta ni clave de Stripe, Sanity, Resend, Vercel ni del asistente en este proyecto.** Se crean en la fase 5, y este documento dice cuándo y qué.

## Cómo se guardan y cómo las uso yo
1. **Las cuentas son de la persona** (o del cliente), con **verificación en dos pasos** y un **gestor de contraseñas** propio. Yo no necesito iniciar sesión en ellas.
2. **Las claves** se guardan donde las lee la aplicación, nunca en el repositorio:
   - En el despliegue (**Vercel**): ajustes del proyecto, *Environment Variables*, solo en los entornos de prueba (*Preview* y *Development*) hasta que haya aprobación expresa de producción.
   - Para que **yo** pueda probar integraciones desde esta sesión: en los **ajustes del entorno de la sesión** (menú del entorno en la barra de título, *Edit*), como secreto de red o variable de entorno. Yo te digo **el nombre exacto de la variable**; tú pegas el valor ahí. Una sesión nueva la recoge. **Yo no veo el valor en el chat.**
3. En el repositorio solo existe `.env.example` con los **nombres** de las variables y ningún valor.
4. Preferimos siempre **claves de prueba y de solo lectura o con permisos mínimos**. Con una clave de pruebas no se puede cobrar de verdad.

## Qué hace falta de cada servicio
| Servicio | Cuándo | Quién crea la cuenta | Qué necesito | Variable | ¿Es secreto? | Nunca compartas |
|---|---|---|---|---|---|---|
| **Sanity** (contenido) | 5.2 | La persona, con su correo (plan gratuito) | El **ID del proyecto** y el nombre del conjunto de datos; un **token de lectura** para borradores | `SANITY_PROJECT_ID`, `SANITY_DATASET` (públicos); `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET` | Los dos primeros no; los otros dos **sí** | Tu inicio de sesión y cualquier token de escritura. La forma exacta de acceso (proveedor de inicio de sesión) se confirma al crear la cuenta |
| **Stripe** (bonos) | 5.6 | La persona (cuenta propia; **solo modo de prueba**) | Una **clave secreta de prueba** (empieza por `sk_test_`), el **secreto del webhook** (`whsec_`) y los **IDs de precio** de cada bono | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` | **Sí** (los IDs de precio no) | Claves `sk_live_` (cobros reales), la contraseña de Stripe y datos de tarjeta. Si se puede, usar una **clave restringida** de prueba. Lo que Stripe exige para activar el modo de prueba se confirma al crear la cuenta |
| **Mews** (reservas) | 5.4 | Nadie: se usa el entorno **demo público** | El **ID de configuración de demo**, que es público y está en su documentación | `NEXT_PUBLIC_MEWS_CONFIGURATION_ID` | No | Cualquier credencial de un hotel real. Las credenciales de la aplicación demo que aparecen en su documentación **no se copian al repositorio ni hacen falta** |
| **Resend** (correo) | 5.5 | La persona | Una **clave de API** y un **dominio verificado** (SPF y DKIM) | `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM` | La clave **sí** | La clave y el acceso al DNS del dominio |
| **Asistente de IA** | 5.8 | La persona | Una **clave de API** con **tope de gasto** | `ANTHROPIC_API_KEY` | **Sí** | La clave. Se pone un límite mensual desde el primer día |
| **Google Maps** (producción) | 5.11 | El cliente | Una clave de **Maps Embed** restringida a su dominio | `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` | Restringida por dominio | Claves sin restricción de dominio |
| **GA4 y Pixel de Meta** | 5.7 | El cliente | Los **IDs de medida** | `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | No (son públicos) | Tokens de la API de conversiones, si algún día se usan |
| **Vercel** (alojamiento) | 5.1 | La persona o el cliente | Que el proyecto esté conectado al repositorio. **No necesito acceso a la cuenta** | n/a | n/a | Tu contraseña y tus claves personales |
| **Dominio y DNS** | Producción | Solo una persona | Nada: lo hace una persona con aprobación expresa | n/a | n/a | Acceso al registrador de dominios |

## Dónde verás cada cosa cuando exista
| Quieres ver... | Dónde |
|---|---|
| Qué datos trata cada proveedor | `docs/privacy/data-map.md` |
| La ficha técnica de cada integración | `PROJECT.md`, secciones 3.1 a 3.10 |
| Por qué se eligió cada servicio | `docs/decisions/ADR-0003-cms.md` (Sanity), `ADR-0005-hosting-pagos-y-entrega.md` (Stripe y hosting) |
| Los **contenidos** guardados en Sanity | En el **panel de contenido** (Sanity Studio), con tu inicio de sesión. No hay un "registro" que yo pueda enseñarte antes de crear la cuenta |
| Los **pagos de prueba** de Stripe | En el **panel de Stripe en modo de prueba**, con tu inicio de sesión |
| Las **claves** | En tu **gestor de contraseñas** y en las variables de entorno del despliegue. **No están en el repositorio** |

## Si una clave se filtra
1. Anula la clave en el servicio y crea una nueva. 2. Cámbiala en las variables de entorno. 3. Comprueba la actividad reciente del servicio. 4. Anota el incidente y la fecha. No hace falta esperar a ver si alguien la usó.
