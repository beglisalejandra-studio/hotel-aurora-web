# DESIGN — Hotel Aurora (v2)

> Dirección visual, tokens y reglas de componentes. **Autoridad visual única** (`visual_authority` en PROJECT.md: taste-skill). Los tokens son la fuente; los componentes solo usan `var(--…)`/utilidades, nunca valores mágicos. La maqueta aprobable está en `creative/mockup/index.html` y es la referencia viva de este documento.
> La v1 (fotografía a sangre, arcos, verdeazulado y coral, Bricolage Grotesque) fue **rechazada por genérica** y está solo en el historial de git.

## 1. Dirección
- **Concepto:** «Una habitación por hora». Las cuatro habitaciones son cuatro momentos del día (Alba 6 a. m., Mediodía 12 m., Atardecer 6 p. m., Noche 10 p. m.) y **el color de toda la página es la hora**. El nombre AURORA ocupa el ancho de la pantalla y su «O» es un sol que, al hacer scroll, inunda la pantalla con la hora siguiente.
- **Palabras clave:** minimalista · tipográfico · plano · preciso · motion graphic hecho solo con CSS.
- **Elemento firma:** el sol en la «O» y el campo de color plano por hora (sin degradados, sin sombras, sin fotografía en la portada).
- **Maquetación:** tomada de referencias de Dribbble y reinterpretada (arquetipos UMBRAL y VENTANA, ver `reference-analysis.md`): nombre a ancho completo, filete, barra de tres zonas (Menú · lugar y hora · Reservar), filas con filete en lugar de tarjetas, calendario en círculos, reserva alcanzable con el pulgar.
- **Qué evitar:** fórmula de lujo (crema + dorado + serif), hero de plantilla (titular centrado con dos botones y widget de cuatro cajas), cliché postal de Cartagena, movimiento pesado (video, WebGL, Lottie), scroll secuestrado, prueba social sin evidencia.

## 2. Tokens
Un solo tema (no sigue `prefers-color-scheme`: el color lo da la hora). Tres paletas conmutables con `html[data-palette]` (`luz` por defecto, `fachadas`, `anil`) y la hora activa en `html[data-hour]` (1 a 4). Cada paleta define cuatro horas con tres variables: `--b1..4` campo, `--f1..4` texto, `--g1..4` texto secundario. Contrastes medidos con `node design/palette-check.mjs` (fórmula WCAG 2.2; **todas las horas cumplen AA en texto y texto secundario**).

| Paleta | Hora 1 · Alba | Hora 2 · Mediodía | Hora 3 · Atardecer | Hora 4 · Noche |
|---|---|---|---|---|
| **Luz del día** | `#FFC4DE` · texto `#0A0A0A` 13.39:1 · sec. 8.07:1 | `#F2F964` · `#0A0A0A` 17.45:1 · 9.73:1 | `#FF8D6A` · `#0A0A0A` 8.74:1 · 6.05:1 | `#150A3C` · `#F7F5FF` 17.06:1 · 10.90:1 |
| **Fachadas** | `#C90362` · `#FFF7FA` 5.43:1 · 4.76:1 | `#F9C230` · `#15110E` 11.43:1 · 6.73:1 | `#EC672A` · `#15110E` 5.85:1 · 5.04:1 | `#0E47CA` · `#FFFFFF` 7.57:1 · 5.20:1 |
| **Añil** | `#EEF0FB` · `#1A1D8C` 11.57:1 · 6.15:1 | `#FFD23F` · `#14186E` 10.50:1 · 5.98:1 | `#7C83EC` · `#0B0E4A` 5.37:1 · 5.07:1 | `#2B2FB8` · `#FFFFFF` 9.54:1 · 6.63:1 |

Reglas de color:
- **El sol** (`--next`, el campo de la hora siguiente) es decorativo y lleva siempre un aro del color de texto; su contraste contra el campo no cuenta como texto.
- Una paleta nueva debe tener contraste ≥ 4.5:1 en texto y texto secundario **y** una diferencia clara entre la hora 1 y la 2 (es lo que cubre la inundación del sol). La primera versión de Añil fallaba esto (dos lavandas casi iguales) y se corrigió con el amarillo del sol.
- La tinta del hero cambia junto con la inundación (`--fg` y `--fg2` son propiedades registradas con `@property` y se animan con la misma línea de tiempo del scroll): sin esto, en Fachadas el texto quedaba blanco sobre amarillo (1.4:1).
- Los estados no dependen solo del color: «completo» va tachado, «última habitación» punteado, el anillo de foco mide 3 px y usa `--fg`.

Tipografía (autoalojada con `next/font` en producción, subconjunto latino y ejes recortados):
- **Display:** Anybody (SIL OFL), pesos 700 y 800, ancho `wdth` de 100 a 125 %. El ancho es parte del diseño: las filas de habitaciones se ensanchan al mediodía y al pasar el cursor, y los titulares de sección van a 125 % desde 700 px.
- **Cuerpo:** Familjen Grotesk (SIL OFL), 400 a 700.
- **Escala:** `s-1` .8125 rem · `s0` 1.0625 · `s1` 1.15 a 1.5 · `s2` 1.8 a 5.6 · `s3` 2.4 a 5.4. El nombre usa `min(21.4vw, 36rem)` y **no tiene suelo en `rem`** (con suelo se recortaba al ampliar el texto). El nombre de cada habitación se dimensiona por contenedor (`97cqw / ancho natural del nombre`) para llenar el ancho sin partirse.
- Peso en la maqueta pidiendo `wdth,wght@100..125,700..800`: ver §7.

Forma (una sola regla, no se mezcla): **círculo** (sol, días, botones de icono, ventana de la habitación), **píldora** (botones y chips), **filete de 1.5 px** (listas, tablas, separadores). Sin sombras salvo la del dock.
Espaciado: gutter `clamp(16px, 3.2vw, 44px)`; el contenido respeta `env(safe-area-inset-*)` en barra, hero, hojas y aviso.

## 3. Componentes y estados
| Componente | Variantes y estados cubiertos en la maqueta | Accesibilidad |
|---|---|---|
| Aviso de portafolio | `aside` fijo arriba y en pie; herramientas de la maqueta (paleta, guía de fotos) | landmark propio; botones de 36 px o más |
| Barra de tres zonas | Menú · Cartagena y hora local · Reservar; sticky | anillo de foco visible sobre cualquier hora |
| Hero | nombre con sol, filete, frase, fechas y huéspedes | `h1` con `aria-label`; las letras son decorativas |
| Filas de habitaciones | reposo, hover (el nombre se ensancha), foco | enlace único por fila; el precio no se parte |
| La ciudad | lista alternativa por teclado + esquema de líneas; pin activo; ruta dibujada | `aria-pressed`; el hotel es de ejemplo |
| Calendario en círculos | libre, última habitación, completo (tachado), pasado, hoy, llegada, salida, rango, foco | flechas, Inicio, Fin, AvPág y RePág; un solo tabstop; `aria-disabled` en días completos; etiqueta con fecha larga y estado |
| Huéspedes | contador de 1 a 4 | grupo con nombre; el tope se comunica con `aria-disabled` |
| Hojas (calendario, menú, cuenta, instalar) | iris desde el botón; en celular apaisado el botón Cerrar queda fijo | `dialog` nativo; foco devuelto al cerrar |
| Habitación | nombre a ancho completo, ventana circular con glifo de la hora, hechos en filas | foco al `h1` al entrar, título de página y anuncio |
| Pasos de reserva | 4 pasos; el 4 se llama «Ejemplo» y marca Pago como «omitido» | `aria-current="step"`; validación con `aria-invalid` y mensaje con `role="alert"` |
| Pago bloqueado | solo portafolio: `aria-disabled`, borde discontinuo y explicación visible | el botón sigue enfocable |
| Confirmación de ejemplo | rótulo «Simulación», línea de tiempo en condicional, vistas previas de WhatsApp y correo | etiquetada «[Simulación]» |
| Dock móvil | solo en la portada, se aparta del hero, del botón de disponibilidad y del pie | `visibility: hidden` cuando está apagado (no se enfoca) |

Estados pendientes de construir en la fase de implementación: carga, error de red, sesión caducada y vacío («sin disponibilidad en estas fechas»).

## 4. Responsive
Verificado sin desbordamiento horizontal de 320 a 2560 px en las seis rutas, los pasos de reserva y las cuatro hojas, y con el texto al 150 % y 200 % en 320, 390 y 430 px.

| Elemento | Celular vertical (390) | Tableta vertical (768) | Escritorio (1440) |
|---|---|---|---|
| Nombre del hero | partido en AU / R(sol) / RA, llena la pantalla | igual, limitado por la altura (`26svh`) | una línea a ancho completo; hasta 36 rem de tope |
| Habitaciones | filas apiladas (hora, nombre, descripción y precio) | igual | filas de cinco columnas; el nombre se ensancha al pasar el cursor |
| Calendario | 1 mes, celdas de 41 px mínimo en 320 px | 1 mes alineado con L M M J V S D | 2 meses |
| Dock | sí | sí | no |
| Hoja de fechas | pantalla completa | pantalla completa | pantalla completa |

## 5. Movimiento
Principio: **solo CSS salvo cambios de estado**; el estado base ya es el estado final visible; todo lo ligado al scroll va dentro de `@supports (animation-timeline: …)` y `@media (prefers-reduced-motion: no-preference)`. Con `prefers-reduced-motion: reduce` no corre ninguna animación ni transición de movimiento (verificado: `document.getAnimations().length === 0` tras cargar, pasar el cursor, elegir un lugar, abrir el menú y hacer scroll).

| Movimiento | Qué comunica | Técnica |
|---|---|---|
| Amanecer del hero (campo de noche a campo de día, 1.2 s) y entrada de letras y frase (≤ 0.8 s) | la primera luz | `animation` por tiempo en `transform`, `opacity` y color |
| El sol se eleva en la «O» y su campo inunda el hero | el paso a la hora siguiente | `clip-path: circle()` ligado a `scroll(root)` con centro y radios medidos por JS (`ResizeObserver`) |
| La tinta del hero cambia con la inundación | legibilidad en cualquier paleta | `@property --fg/--fg2` animadas con la misma línea de tiempo |
| Cada sección entra como un iris | el cambio de hora | `clip-path: circle()` ligado a `view()` (`entry 0%` a `cover 28%`) |
| El nombre de una fila se ensancha | foco y hover | `font-stretch` (transición); en reposo cada hora tiene su ancho |
| Pantallas con iris desde el punto del clic | continuidad | View Transitions API si existe; sin ella, cambio directo |
| Hojas con iris desde el botón | origen del gesto | `animation` de `clip-path` |
| Ruta del hotel al lugar elegido | relación espacial | `stroke-dashoffset` |

Duraciones de 0.3 a 1.2 s con `cubic-bezier(.16,1,.3,1)` y `cubic-bezier(.7,0,.2,1)`. Sin cursores personalizados, sin parallax con JS, sin bucles infinitos, **cero librerías de animación**. Los campos de color cambian por `IntersectionObserver`, no por escuchas de scroll.

## 6. Imagen y video
- **Decisión (`VIDEO_SCORE` 28):** imagen, no video. La portada v2 no lleva fotografía: es tipografía y color plano. El registro está en `creative/manifest.json` y `creative/briefs/home.score.json`.
- **Fotografías necesarias: cuatro**, una por habitación, en una ventana circular (`R-<habitación>-01`, **1:1, 2560 × 2560 px**, con el sujeto centrado porque se recorta en círculo). Prompts en `creative/requests/PROMPTS.md`. Hasta que lleguen, la ventana muestra un glifo plano por hora (sol bajo, alto, poniente y creciente), provisional.
- **Dirección de arte de las fotos:** la luz de cada hora (6 a. m., 12 m., 6 p. m., 10 p. m.), composición sobria con pocos objetos, sin personas, sin texto ni logotipos, y la paleta de la hora como único color dominante. Nada de arcos de piedra ni buganvilias como adorno.
- **Atracciones turísticas:** fotografías reales con licencia o propias (no generadas por IA) porque representan lugares reales.
- **Entrega técnica:** AVIF y WebP con `srcset`, dimensiones declaradas (sin CLS), `loading="lazy"`.

## 7. Presupuestos de rendimiento (objetivos a verificar con Lighthouse y datos de campo)
| Métrica | Objetivo | Medido hoy en la maqueta |
|---|---|---|
| LCP (móvil, 4G simulado) | ≤ 2.0 s | 0.56 s sin limitación y **0.99 s con CPU 4x y fuentes con 450 ms de latencia** (Chromium, 390 × 844, `PerformanceObserver`; sin Lighthouse) |
| CLS | ≤ 0.05 | 0.002 a 0.007 en la maqueta (Chromium); en producción se mide con datos de campo |
| INP | ≤ 200 ms | no medido |
| JS inicial de la portada | ≤ 90 KB gzip | JS propio de la maqueta 26.4 KB sin comprimir, **9.4 KB gzip**, 0 librerías |
| Fuentes | ≤ 60 KB | ≈ 53 KB estimado con Anybody recortado a `wdth 100..125` y `wght 700..800` (la versión sin recortar pesaba 75.8 KB) |
| Transferencia total de la portada | ≤ 900 KB | HTML 87.0 KB sin comprimir y **25.3 KB gzip** (CSS 8.7 KB gzip incluido), más 2 fuentes de Google; 0 imágenes, 0 scripts externos |
| Lighthouse móvil | Rendimiento ≥ 95 · Accesibilidad 100 · Mejores prácticas ≥ 95 · SEO ≥ 95 | no ejecutado (se mide en producción) |

## 8. Accesibilidad (reglas que la revisión adversarial dejó como obligatorias)
1. Anillo de foco de 3 px en `var(--fg)` con separación, nunca en `currentColor` (en botones sólidos quedaba del color del fondo).
2. Cada cambio de ruta mueve el foco al encabezado de la vista, actualiza `document.title` y lo anuncia en una región `role="status"`.
3. Los días completos y pasados usan `aria-disabled`, no `disabled`, para seguir siendo alcanzables y anunciarse.
4. Ningún estado depende solo de la opacidad; el texto inactivo usa `--fg2` y una pista no cromática.
5. Ningún `style=""` ni `onsubmit` inline (medido: 0) para que la maqueta pueda servirse con una CSP con nonce; quedan dos `<script>` inline y un `<style>`, que en producción llevan nonce, y las fuentes de Google, que en producción se autoalojan.
6. Probar siempre con el texto al 200 % y con `prefers-reduced-motion: reduce`.

## 9. Desviaciones respecto a Figma
Ninguna. No hay archivo de Figma; la intención visual vive en la maqueta HTML. Si se quiere, se puede crear un archivo de Figma con las variables de §2.
