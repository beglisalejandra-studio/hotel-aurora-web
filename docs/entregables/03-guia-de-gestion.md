# 03 · Guía para gestionar tu sitio web

> **Para personas que no programan.** Esta guía sustituye al vídeo tutorial (decisión de la persona, 2026-10-09). Estado: **estructura y reglas aprobables (fase 3)**. Los pasos exactos, con **capturas reales**, se escriben cuando el panel esté construido (fase 5.2) y se cierran en la fase 9. Hasta entonces no se inventan nombres de botones: están marcados *(captura pendiente)*.

## Cómo está escrita (reglas de estilo)
1. **Frases de 20 palabras como máximo.** Un paso por línea. Un solo verbo por paso.
2. Los nombres de botones y menús van en **negrita y tal como se ven en pantalla**, nunca traducidos de memoria.
3. Cada capítulo tiene: *Para qué sirve*, *Antes de empezar*, *Pasos*, *Cómo saber que salió bien* y *¿Algo salió mal?*
4. Cada captura lleva **círculos numerados** que coinciden con los pasos, y un texto alternativo que la describe.
5. **Sin siglas sin explicar.** Si aparece una palabra técnica, se explica en una línea la primera vez y está en el glosario.
6. Se avisa **antes** de cualquier acción que no se puede deshacer, con la palabra **Cuidado**.
7. **Prueba con una persona real** antes de cerrar: alguien que no ha visto el proyecto sigue la guía sola. Cada punto donde se atasca se reescribe. Criterio de aceptación: completa las cinco tareas básicas sin ayuda.

## Al abrir el panel (2026-10-26)
El panel se abre en **Inicio**: una pantalla con un botón por tarea habitual (habitaciones y precios, añadir una habitación, portada, blog, paquetes, preguntas, datos del hotel, colores, menú, aviso de cookies, textos legales, calendario) y los tres pasos para publicar un cambio. Cada botón lleva directamente a la pantalla donde se cambia. El menú **Contenido** tiene las mismas entradas, con los mismos nombres.

## Las 5 cosas que más harás (chuleta de una página)
| Quiero... | Dónde se hace | Capítulo |
|---|---|---|
| Cambiar un texto o una foto de la web | **El panel de contenido** | 2 y 3 |
| Cambiar las horas de entrada y salida o el teléfono | **El panel de contenido**, en **Inicio** → **Teléfono, correo y dirección** (en el menú: **Datos del hotel**) | 7 |
| Cambiar precios y disponibilidad de habitaciones | **Mews** (no en el panel) | 9 |
| Ver una solicitud de mesa o de cita | Tu **correo** (llega ahí) | 8 |
| Cambiar el precio de un bono o ver sus pedidos | **Stripe** (no en el panel) | 10 |

## Capítulos
0. **Qué es tu web y de qué partes se compone.** La web que ven tus clientes, el panel donde editas, el motor de reservas (Mews) y los pagos de los bonos (Stripe). Un dibujo sencillo y una tabla "esto se cambia aquí".
1. **Entrar de forma segura.** Cuentas con **verificación en dos pasos**, un gestor de contraseñas, y por qué las claves **nunca** se mandan por chat ni por correo.
2. **Cambiar un texto.** Abrir, escribir, **vista previa**, **publicar** y **deshacer**.
3. **Cambiar una foto.** Tamaño y peso recomendados, texto alternativo (por qué importa) y cómo comprobar cómo se ve en móvil.
4. **Español e inglés.** Cada cambio se hace en los dos idiomas: no se puede publicar si falta uno.
5. **Habitaciones.** Descripciones y fotos. Los **precios no se tocan aquí**.
6. **Paquetes y ofertas.** Crear, editar y retirar uno.
7. **Datos del hotel.** Horas de **entrada (15:00) y salida (12:00)**, política de **mascotas** (hotel petfriendly), teléfono, WhatsApp y redes.
8. **Restaurante y spa.** Carta y tratamientos. Dónde llegan las solicitudes y cómo responder a tiempo.
9. **Reservas en Mews.** Ver reservas, cambiar tarifas y disponibilidad, y condiciones de cancelación.
10. **Bonos y pagos en Stripe.** Ver pedidos, hacer un reembolso y cambiar un precio. **Cuidado**: en modo de prueba no se cobra nada; el paso a cobros reales lo aprueba una persona.
11. **Cookies y privacidad.** Qué ve el visitante, cómo cambia su decisión y **qué hacer si alguien pide borrar sus datos** (el plazo general es de un mes; **validar con asesoría**).
12. **Si algo se ve mal o la web se cae.** A quién avisar, qué mirar primero y cómo volver a una versión anterior del contenido.
13. **Copias de seguridad.** Qué se copia, cada cuánto y cómo se comprueba que se pueden recuperar.
14. **Glosario.**

## Lo que NO debes tocar
| No toques... | Por qué |
|---|---|
| Las claves y contraseñas de los servicios en el sitio web | Si se cambian mal, la web deja de reservar o de cobrar |
| El panel de **Vercel** (alojamiento) sin avisar a soporte | Un cambio equivocado puede dejar la web fuera de línea |
| Los **registros del dominio** (DNS) | Un error puede cortar la web **y el correo** |
| Los **precios dentro del panel de contenido** | Los precios viven en Mews y Stripe; ahí se cambian |
| Los textos legales sin consultar a tu asesor | Tienen consecuencias legales |

## A quién llamar
Contacto de soporte, horario y cómo reportar un problema: ver `05-plan-de-soporte.md`.

## Glosario
- **Dominio:** la dirección de tu web (por ejemplo, `hotelaurora.example`).
- **Hosting (alojamiento):** el servicio donde "vive" tu web para que se vea en Internet.
- **Panel de contenido (CMS):** la herramienta donde editas textos y fotos sin tocar código.
- **Borrador:** un cambio guardado que todavía no ven tus clientes.
- **Publicar:** hacer visible un cambio para todos.
- **Copia de seguridad:** una copia de tu web y tu contenido para recuperarlos si algo falla.
- **SSL / candado:** lo que protege la conexión; es lo que muestra el candado del navegador.
- **Verificación en dos pasos:** además de la contraseña, un código de tu móvil; protege tus cuentas.
- **Gestor de contraseñas:** una caja fuerte para guardar claves; así no se pasan por chat.
- **Motor de reservas (Mews):** donde se gestionan habitaciones, tarifas, disponibilidad y reservas.
- **Stripe:** el servicio que cobra los bonos con tarjeta; tu web nunca ve los datos de la tarjeta.
- **Redirección 301:** un aviso que lleva de una dirección antigua a la nueva sin perder posiciones en Google.

## Plan de capturas (se cumple en las fases 5 y 9)
| Capítulo | Pantalla a capturar | Cuándo |
|---|---|---|
| 1 | Inicio de sesión del panel y activación de la verificación en dos pasos | 5.2 |
| 2 | Abrir un texto, la vista previa y el botón de publicar | 5.2 |
| 3 | Subir una foto y escribir su texto alternativo | 5.2 |
| 4 | El aviso de "falta el idioma" al intentar publicar | 5.2 |
| 7 | "Datos del hotel" con horas de entrada y salida y mascotas | 5.2 |
| 9 | Vista de reservas y de tarifas en Mews | 5.4 |
| 10 | Lista de pedidos y reembolso en Stripe (modo de prueba) | 5.6 |
| 11 | Banner de cookies y ventana de configuración | 5.7 |

## Formato de entrega
Documento ilustrado para personas sin conocimientos técnicos: **PDF** (formato elegido por la persona el 2026-10-09; ver `PRODUCT.md` §7). Será un PDF etiquetado y accesible: texto seleccionable, marcadores por capítulo y texto alternativo en cada captura, más esta versión en el repositorio.
