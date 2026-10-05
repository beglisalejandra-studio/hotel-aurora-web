# 01 · Propuesta de diseño UX/UI y plan técnico (v2)

> **Estado: en revisión (2026-10-05). Pendiente de aprobación** de la persona responsable antes de escribir código de producción.
> **Hotel Aurora es un proyecto de portafolio de beglisalejandra-studio. Hotel ficticio: no se procesa ninguna reserva ni transacción.**
> Esta es la **v2**. La v1 se rechazó por genérica («colores y tipografías muy genéricos, no innovador»); se rehízo con la maquetación tomada de referencias de Dribbble y color y movimiento nuevos. La v1 queda en el historial de git.

## Resumen en 30 segundos
- **Idea:** «Una habitación por hora». Cuatro habitaciones que son cuatro momentos del día; **el color de toda la página es la hora**. AURORA ocupa el ancho de la pantalla y su «O» es un sol que, al hacer scroll, inunda la pantalla con la hora siguiente.
- **Qué lo hace distinto:** color plano (sin degradados ni fotografía en la portada), una tipografía variable cuyo **ancho** cambia con la luz, y movimiento hecho solo con CSS ligado al scroll. Nada de arcos de piedra ni cliché postal de Cartagena.
- **Cómo cumple tus prioridades:**
  - *Seguridad:* cuentas con Postgres y seguridad por fila, datos mínimos, nada de tarjetas, pagos imposibles en portafolio (ADR-0003 y 0004). La maqueta no envía ni guarda lo que se escribe.
  - *Velocidad:* páginas públicas estáticas, animación solo con CSS, **cero librerías, cero imágenes en la portada**, imagen en vez de video (el cálculo dio 28 → imagen).
  - *Celular, tablet y computador:* sin desbordes de 320 a 2560 px, también con el texto al 200 %.
  - *App instalable con reserva:* PWA sin datos personales en caché (ADR-0005); en la maqueta el botón «Instalar la app» dice con claridad que todavía no se puede instalar.
- **Maqueta para revisar:** `creative/mockup/index.html` (un solo archivo; ábrelo en el navegador). La franja negra de arriba cambia entre **tres paletas**: Luz del día, Fachadas y Añil.

## Concepto
- **Idea central:** cuatro habitaciones = cuatro horas (Alba 6 a. m., Mediodía 12 m., Atardecer 6 p. m., Noche 10 p. m.). Al bajar por la página el campo de color pasa de una hora a la siguiente.
- **Tres adjetivos:** plano, tipográfico, preciso.
- **Elemento firma:** el sol en la «O» de AURORA y el campo de color por hora.
- **Qué evitamos:** hero centrado con dos botones, widget de reserva de cuatro cajas, tarjetas iguales, paleta crema y dorado, serif «de lujo», fotos de stock, animación sin propósito. Detalle en `DESIGN.md`.

## Referencias globales (enlaces verificados el 2026-10-05)
Elegidas entre 333 candidatos únicos de 11 búsquedas, sin límite de país (5 de las 18 son colombianas o latinoamericanas). **Lista completa con qué se toma y qué no: `creative/references/urls.md` y `creative/references/reference-analysis.md`.**

| Referencia | Qué se toma (principio, no diseño) | Dónde se ve |
|---|---|---|
| [Omah Jati](https://dribbble.com/shots/23650898-Omah-Jati-Private-Villa-Website) (Dribbble) | nombre a ancho completo, barra de tres microetiquetas, habitaciones como filas con filete | **base de la maquetación** |
| [Modernist website](https://dribbble.com/shots/27621821-Modernist-website) (Dribbble) | la «o» del nombre como protagonista | el sol de AURORA |
| [Corte d'Oro](https://dribbble.com/shots/27754026-Tuscan-Boutique-Hotel-Website-Corte-d-Oro) (Dribbble) | nombre cortado por la base, pildora única, calendario como pantalla propia | pie y reserva |
| [#1 Capsules](https://dribbble.com/shots/25967623--1-Capsules) (Dribbble) | pildora de navegación alcanzable con el pulgar | dock móvil |
| [PUBLIC Hotels](https://www.publichotels.com/) (EE. UU.) | nombre a 100vw y cambio de plano como transición | iris entre pantallas |
| [TARQ](https://www.tarqstudio.com/es) (**Colombia**) | habitación como fila-leyenda, reserva fuera del hero | filas de habitaciones |
| [Uno II Uno](https://dribbble.com/shots/25302563-Uno-Uno-hotel-branding) (**Getsemaní**) | plano de calles como fondo de mapa | mapa de líneas |
| [AZULIK](https://azulik.com) (**México**) | reserva como píldora inferior que abre el calendario | dock y hoja de fechas |
| [KAAN Architecten](https://kaanarchitecten.com/) (Países Bajos) | índice tipográfico, la misma lista sirve para el mapa | lista de la ciudad |
| [Rauno Freiberg](https://rauno.me/) (Estonia) | la hora como eje | «una habitación por hora» |

Referencias que fallaron o no correspondían están en `creative/references/urls.md` como registro.

## Cómo se verá, plataforma por plataforma
| Plataforma | Qué cambia en el diseño | Captura |
|---|---|---|
| Móvil (390 px) | el nombre se parte en AU / R(sol) / RA y llena la pantalla; Reservar arriba y en un dock inferior que se aparta del pie; fechas en hoja de pantalla completa; filas apiladas | `creative/mockup/screenshots/` |
| Tableta (768 px) | el mismo nombre en tres líneas limitado por la altura; calendario de un mes alineado con L M M J V S D | `creative/mockup/screenshots/` |
| Escritorio (1440 px) | nombre en una línea a ancho completo; filas de cinco columnas con el nombre que se ensancha; calendario de 2 meses; lista y mapa lado a lado | `creative/mockup/screenshots/` |
| App instalada (PWA) | misma interfaz a pantalla completa; atajos «Reservar» y «Mis reservas»; sin conexión, pantalla con el contacto del hotel | se diseña en la fase 4 |

## Experiencia de usuario
**Perfiles:**
1. *Viajero que compara desde el celular.* Quiere ver qué está libre y cuánto cuesta, sin registrarse todavía.
2. *Huésped con reserva.* Quiere saber el estado y llegar bien (mapa).
3. *Quien revisa el portafolio.* Quiere ver calidad, criterio y seguridad.

**Recorrido de conversión** (cuatro pasos, un solo botón primario «Reservar» en todo el sitio):
1. **Fechas:** desde la portada o la barra, calendario de rango con precio por noche, noches contadas y días completos tachados. Si las fechas dejan fuera una habitación, se explica por qué (no disponible o capacidad máxima) y se propone una libre.
2. **Tus datos:** crear cuenta o entrar con enlace; consentimientos separados y **sin premarcar**; el aviso «escribe datos inventados» va arriba, en tamaño normal.
3. **Pago:** **bloqueado en portafolio**, con un aviso inconfundible; el botón Pagar queda desactivado a propósito.
4. **Confirmación de ejemplo:** rotulada «Simulación» desde el título, con vistas previas de WhatsApp y correo en condicional.

**Mapa del sitio:** `/` · `/habitaciones/[slug]` · `/reservar` · `/cuenta` · `/cuenta/reservas` · privacidad, términos y cookies · `/offline` · 404.

**Estados:** *éxito, vacío por capacidad, ruta inexistente y bloqueado* están en la maqueta. *Carga*, *error de red* y *sesión caducada* se construyen en la fase 1 a 3 (listados en `DESIGN.md` §3).

**Accesibilidad (medida):** contraste AA en las 12 combinaciones de color (`node design/palette-check.mjs`); calendario con flechas, Inicio, Fin, AvPág y RePág; anillo de foco de 3 px visible en cada hora; foco, título y anuncio al cambiar de pantalla; texto ampliado al 200 % sin recortes; `prefers-reduced-motion` anula todo el movimiento. Reglas en `DESIGN.md` §8.

## Cómo lo hacemos (plan técnico, resumen)
| Tema | Propuesta | Detalle |
|---|---|---|
| Base | Next.js 16 + TypeScript estricto + Tailwind 4; páginas públicas estáticas, solo cuenta y reserva dinámicas; sin editor visual | ADR-0001 y 0002 |
| Seguridad de datos | Postgres con seguridad por fila (prueba negativa obligatoria), datos mínimos, sin tarjetas, CAPTCHA y límite de tasa, cookies `HttpOnly`, **CSP con nonce** (la maqueta ya evita `style=""` y `onsubmit` inline), exportar y eliminar desde la cuenta, secretos solo en el gestor | ADR-0004, `docs/privacy/data-map.md` |
| Sin dobles reservas | Transacción que bloquea las noches, retención corta con vencimiento, clave de idempotencia, prueba de carrera | ADR-0004 |
| Pagos | Interfaz de pagos con un único proveedor que **siempre rechaza**; guardas en el arranque, CSP y CI | ADR-0003 |
| Estado por WhatsApp o correo | Cola de eventos de reserva; correo transaccional y API de WhatsApp Business (plantillas aprobadas; solo con consentimiento). **En portafolio: vista previa, no se envía nada** | `PROJECT.md` §3 |
| Mapa | Esquema de líneas en la maqueta; MapLibre y PMTiles propios cargados bajo demanda en producción; sin claves ni rastreadores | ADR-0006 |
| App instalable | Manifiesto, atajos, service worker mínimo que nunca guarda datos personales; reservar siempre en línea | ADR-0005 |
| Tipografía | Anybody (ancho 100 a 125, pesos 700 y 800) y Familjen Grotesk, ambas SIL OFL, autoalojadas con `next/font`; presupuesto de fuentes ≤ 60 KB | `DESIGN.md` §2 |
| Velocidad | Presupuestos en `DESIGN.md` §7 medidos con Lighthouse y datos de campo | `DESIGN.md` §7 |
| Imágenes | **4 imágenes** (una por habitación, ventana circular 1:1) con prompts para ChatGPT o Gemini y medidas exactas | `creative/requests/LEEME.md` |
| Hosting | **Por decidir** (Vercel, Cloudflare o contenedor propio); no se impone ninguno | `PROJECT.md` §5 |
| Fases | 0 maqueta (hecha) → 1 base → 2 habitaciones y calendario → 3 cuentas y reserva → 4 PWA y SEO → 5 QA → 6 preview y entrega | `PROJECT.md` §6 |

## Maqueta
`creative/mockup/index.html`. Un solo archivo; las fuentes se piden a Google solo en la maqueta (en producción se autoalojan). Contiene: portada, página de habitación (`#/habitacion/noche`, también `alba`, `mediodia`, `atardecer`), flujo de reserva de 4 pasos (`#/reservar`) y tres paletas (`?paleta=luz|fachadas|anil`). El botón **Guía de fotos** aparece en la página de cada habitación y muestra el código y la medida del hueco de imagen.

### Revisión adversarial y qué se corrigió
Seis revisores independientes (genericidad, accesibilidad, movimiento y rendimiento, responsive, texto y veracidad, seguridad) probaron la primera versión de esta maqueta con navegador real, y un escéptico intentó refutar cada hallazgo alto o medio. Resultado: **90 hallazgos confirmados y ninguno refutado** (12 altos, 50 medios, 28 bajos) tras 72 agentes en total. Se atendieron los 12 altos y los 50 medios (los 28 bajos quedan para la fase de construcción, salvo los que se resolvieron de paso). Cuatro quedaron **parcialmente** resueltos a propósito: el hueco del hero en escritorio (se deja como aire minimalista), el contraste de los anillos y diagonales del calendario (el texto sí cumple, los trazos decorativos van sobre `opacity .7`), el botón Pagar desactivado (exento de AA por ser inactivo, pero ya usa `--fg2` y borde discontinuo) y la CSP estricta (quedan dos `<script>` inline y las fuentes de Google; se resuelve con nonce y autoalojado en producción). Los más importantes:
- **Diseño:** el nombre de la habitación se partía a mitad de palabra en dos de cuatro páginas; la portada en celular era casi todo campo vacío; la paleta Añil era una rampa de un solo tono.
- **Accesibilidad:** el anillo de foco era invisible en todos los botones sólidos; «Saltar al contenido» cambiaba de pantalla; al cambiar de ruta el foco se perdía; el calendario no se podía recorrer con teclado y tenía 49 paradas de Tab; en Fachadas el texto del hero quedaba casi blanco sobre amarillo (1.4:1).
- **Veracidad:** se podía reservar una habitación no disponible; la confirmación decía «Todo listo» y marcaba el pago como hecho; «Instalar la app» prometía funciones inexistentes; había una nota interna visible («Dato por verificar»).
- **Seguridad y privacidad:** campo de contraseña y casilla de consentimiento premarcada en una maqueta que no guarda nada; formularios sin envío real.

### Qué verifiqué
Todo con Playwright sobre la última compilación de la maqueta (Chromium 141, Firefox 142 y WebKit 26 en modo sin pantalla). Los guiones están en el trabajo de la sesión, no en el repositorio.
- **Verificación por hallazgo, en las tres engines (33 comprobaciones en cada una, todas OK):** anillo de foco con contraste ≥ 3:1 en botones sólidos y en la franja negra; «Saltar al contenido» mueve el foco a `main` sin cambiar de pantalla; foco, título y anuncio al cambiar de ruta; la vista nueva empieza arriba tras reservar con scroll (en Firefox y WebKit se quedaba en el pie); rutas inexistentes vuelven a la portada; calendario con un solo tabstop, flechas que cruzan días completos, Inicio, Fin, AvPág, etiquetas con fecha larga y año; un día completo no se puede fijar como llegada; contador de huéspedes con tope comunicado; dock oculto y no enfocable, apagado en el pie y en la habitación; el sol y el flood nacen en el mismo punto tras girar el celular; con `prefers-reduced-motion: reduce`, `document.getAnimations().length` es 0 al cargar, pasar el cursor, elegir un lugar, abrir el menú y hacer scroll.
- **Recorrido completo con clics y teclado reales, 1440 y 390 px (38 comprobaciones cada uno, todas OK, consola limpia):** hoja de fechas, rango, habitación, reserva, validación del paso 2 (no avanza vacío y el foco va al primer campo inválido), sin campo de contraseña ni consentimientos premarcados, pago que **no puede avanzar**, confirmación rotulada «Simulación» sin nombre inventado, motivo de cada habitación no disponible, tope de 4 huéspedes, cuenta de ejemplo, instalar (próximamente), cambio de paleta, cero peticiones de red salvo las fuentes, cero scripts externos y cero rayas largas.
- **Sin desbordamiento horizontal** a 320, 360, 390, 430, 600, 768, 820, 1024, 1280, 1440, 1920 y 2560 px en las seis rutas, los pasos 2 y 4 y las cuatro hojas; filas de habitaciones sin solapes ni precios partidos de 700 a 1920 px, en reposo y con el cursor encima; títulos de sección sin desborde; calendario alineado con L M M J V S D de 320 a 1920 px (desvío 0.0 px); texto ampliado al 150 % y 200 % sin recortes a 320 y 390 px.
- **Contraste:** 12 combinaciones de paleta y hora en AA (`node design/palette-check.mjs`) y la tinta del hero medida **después** de la inundación: 17.5:1 en Luz, 11.4:1 en Fachadas (antes 1.6:1) y 10.5:1 en Añil.
- **Rendimiento (Chromium):** LCP 0.56 s y CLS 0.002 sin limitación; LCP 0.99 s con CPU 4x y fuentes lentas. HTML 87.0 KB (25.3 KB gzip).
- **Repositorio:** `npm run lint`, `typecheck`, `format:check`, `test` (57 pruebas), `build`, `validate:manifest`, `audit` (0 en producción; un aviso de desarrollo ya aceptado) y `doctor` (35 OK, 8 opcionales, ninguno faltante).

### Qué NO verifiqué (honestidad)
- **Fotos reales:** la maqueta usa un glifo plano por hora como sustituto en la ventana de la habitación; el diseño final depende de cuatro imágenes que aún no existen.
- **Celulares muy bajos:** a 320 × 568 el contador de huéspedes del hero queda 10 px por debajo del pliegue (se ve con un poco de scroll); a 360 × 640 y mayores cabe. Es el único caso de maquetación que no cierra.
- **Lighthouse y e2e de la plantilla:** no los ejecuté sobre la maqueta; sin imágenes ni servidor desplegado la cifra engañaría. Se mide en la fase 5.
- **Lectores de pantalla (NVDA, VoiceOver, TalkBack), Safari real y dispositivos físicos:** solo probé con Chromium, Firefox y WebKit de Playwright (emulados). El anuncio de las regiones en vivo y el comportamiento táctil real no están comprobados.
- **El mapa es un esquema ilustrativo**, no a escala; las coordenadas y los tiempos reales dependen de una dirección que aún no existe.
- **El peso de las fuentes recortadas (≈ 53 KB)** es una estimación con `fontTools`, no una medición con la API de Google.
- **Nada de producción:** no hay código de aplicación, base de datos, autenticación, pagos, correo ni WhatsApp; es una maqueta.

## Decisiones pendientes para la persona
1. **Aprobar o corregir** el concepto («Una habitación por hora», el sol en la «O») y **elegir paleta**: Luz del día (rosa, limón, coral y noche; la que muestra la maqueta por defecto), Fachadas (magenta, amarillo, naranja y azul eléctrico) o Añil (lavanda, amarillo sol, periwinkle e índigo).
2. **Tipografía:** Anybody + Familjen Grotesk, ambas libres (SIL OFL). Si prefieres fuentes con licencia comercial (por ejemplo Cabinet Grotesk), no se pueden subir a un repositorio público de portafolio.
3. **Ubicación:** ¿Centro histórico, Getsemaní u otra zona? Hoy el mapa dice «ubicación de ejemplo».
4. **Registro en el portafolio:** ¿funciona de verdad contra un proyecto de pruebas con purga a las 24 h (recomendado) o es simulado? (ADR-0004)
5. **Idiomas:** ¿solo español o también inglés?
6. **Hosting y dominio:** ¿preferencia? El dominio aún no existe.
7. **Imágenes:** ¿generamos las 4 imágenes con ChatGPT o Gemini? Subir a `creative/inbox/`. Aún **no** generes las de la v1.
8. **Logotipo:** ¿aprobamos AURORA con el sol en la «O», construido en SVG?
9. **Cuentas de servicios** (base de datos, correo, WhatsApp): las crea una persona; yo no recibo claves por el chat.
