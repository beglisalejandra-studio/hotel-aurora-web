# DESIGN — Hotel Aurora

> Dirección visual, tokens y reglas de componentes. **Autoridad visual única** (`visual_authority` en PROJECT.md: taste-skill). Los tokens son la fuente; los componentes solo usan `var(--…)`/utilidades, nunca valores mágicos. La maqueta aprobable está en `creative/mockup/index.html` y es la referencia viva de este documento.

## 1. Dirección
- **Concepto:** «El día en la casa». Un hotel pequeño con patio, contado de la primera luz a la noche. El logo (un arco con un punto de sol) recorre el día con el scroll.
- **Palabras clave:** luminoso · arquitectónico · sereno · cálido · preciso.
- **Elemento firma:** el arco de medio punto. Enmarca las imágenes, forma la arcada del pie (un arco "iluminado" por el amanecer) y es el trazo del logo; el punto de sol se mueve sobre él al hacer scroll.
- **Luz de las 6 de la mañana:** sombras frías verdeazuladas y luces cálidas durazno y coral; piedra, madera, baldosa de cemento y buganvilia; sin personas visibles.
- **Referencias adoptadas (principios, no clones):** ver `reference-analysis.md`.
- **Qué evitar:** hero centrado sobre degradado; tres tarjetas iguales con ícono; paleta crema, latón y espresso; serif «de lujo» por defecto; fotos de stock evidentes; emojis como íconos; animaciones sin propósito; mapas pesados que bloquean la carga; botones de pago que parezcan reales en la versión de portafolio.

## 2. Tokens
Tema claro por defecto y tema oscuro por `prefers-color-scheme`. Un solo acento. Contrastes medidos con `design/contrast-check.mjs` (fórmula WCAG 2.2) el 2026-10-05.

| Token | Claro | Oscuro | Uso | Contraste medido |
|---|---|---|---|---|
| `--bg` | `#EEF3F2` | `#08171F` | fondo de página | n/a |
| `--surface` / `--surface-2` | `#F8FBFA` / `#E2EBEA` | `#0F2530` / `#13303C` | paneles, campos / fichas suaves | n/a |
| `--line` | `#C3D2CF` | `#26434F` | divisores, bordes decorativos | decorativo |
| `--fg` | `#0C1E2B` | `#E8F0EF` | texto principal | 15.16:1 / 15.74:1 |
| `--fg-2` | `#3B5260` | `#A9BDC0` | texto secundario | 7.31:1 / 9.31:1 |
| `--fg-3` | `#4F6672` | `#86A0A6` | notas, etiquetas | 5.39:1 / 6.59:1 (sobre `--bg`) |
| `--accent` / `--on-accent` | `#C73E1D` / `#FFFFFF` | `#FF7A59` / `#08171F` | CTA, selección, marca | 5.08:1 / 7.10:1 |
| `--accent-text` | `#B5351A` | `#FF8E70` | enlaces y etiquetas sobre fondo | 5.37:1 / 8.12:1 |
| `--sea` | `#14464F` | `#0E3A44` | agua del mapa, fotos de referencia | tono neutro frío |

Tipografía (autoalojada con `next/font` en producción, subconjunto latino):
- **Display:** Bricolage Grotesque, peso 600, `letter-spacing: -.025em`, `line-height: 1.02`.
- **Cuerpo:** Instrument Sans, 400 a 700, `line-height: 1.6`.
- **Escala fluida (6 pasos):** `s-1` .8 a .875 rem · `s0` 1 a 1.0625 · `s1` 1.15 a 1.35 · `s2` 1.5 a 2.2 · `s3` 2 a 3.6 · `s4` 2.6 a 5.4 (el titular del hero llega a 6.2 rem en escritorio).
- Peso medido (Google Fonts, woff2 latino, 2026-10-05): Bricolage variable completo 76.9 KB e Instrument Sans 30.1 KB. **Meta de producción: ≤ 60 KB combinados** recortando ejes y glifos (a verificar al construir).

Forma (una sola regla, no se mezcla):
- **Arco:** imágenes de composición (esquinas superiores totalmente redondeadas, base recta).
- **Píldora:** botones, chips y controles.
- **14 px:** paneles, campos, mosaicos, tarjetas.
- **Sombra:** una sola, teñida del fondo (`0 22px 44px -24px` con el tono de `--fg`).

Espaciado: contenedor 1360 px, gutter `clamp(16px, 4vw, 48px)`; el ritmo vertical entre secciones **varía a propósito** (de 64 a 210 px según la sección).

## 3. Componentes y estados
| Componente | Variantes | Estados cubiertos en la maqueta | Notas de accesibilidad |
|---|---|---|---|
| Aviso de portafolio | fijo arriba y en pie | n/a | `role="note"`; no se puede cerrar |
| Barra de reserva | escritorio (3 columnas) / móvil (apilada + hoja inferior) | vacío, con fechas, abierta | popover con `Esc`; el foco vuelve al campo |
| Calendario de disponibilidad | 1 o 2 meses | libre, últimas habitaciones, completo, pasado, hoy, inicio, fin, rango, enfoque | botones ≥ 44 px, flechas del teclado, `aria-label` con precio; tachado además de color |
| Tarjeta de habitación | carril con snap | normal, hover | enlace único; el precio no depende del color |
| Mosaico del día (bento) | imagen / suave / acento / noche | normal | 4 contenidos, 4 celdas |
| Mapa + panel | esquema (maqueta) / MapLibre (producción) | punto activo, ruta animada | pines `button` con `aria-pressed`; etiquetas solo del punto activo en móvil |
| Pasos de reserva | 4 pasos | actual, hecho, pendiente | `aria-current="step"`; el foco va al título al cambiar de paso |
| Pago bloqueado | solo portafolio | desactivado con `aria-disabled` | el botón sigue enfocable y explica por qué |
| Vista previa de notificaciones | WhatsApp / correo | n/a | etiquetada «Vista previa. No se envía nada» |
| Dock móvil | precio + Reservar | oculto / visible | respeta `safe-area-inset-bottom` |

Estados que faltan y se construyen en la fase de implementación: carga (esqueletos con la forma final), vacío («sin disponibilidad en estas fechas»), error de red y de validación (en línea, bajo el campo), sesión caducada.

## 4. Responsive
Breakpoints usados: 360 · 390 · 640 · 768 · 900 · 960 · 1024 · 1100 · 1440 px. Verificado sin desbordamiento horizontal de 360 a 1440 px.

| Elemento | Móvil (390) | Tablet (768) | Escritorio (1440) |
|---|---|---|---|
| Hero | arco a sangre con titular sobre scrim; CTA en la barra superior y dock | arco a sangre | titular a la izquierda, arco 4:5 a la derecha con arco de contorno |
| Barra de reserva | apilada; fechas en hoja inferior | apilada en 3 columnas desde 640 | 3 columnas con popover de 2 meses |
| Habitaciones | carril con la siguiente tarjeta asomando | carril | 4 tarjetas en la retícula, flechas solo si hay desborde |
| Bento | una columna | una columna | rejilla 4 columnas con una celda grande |
| Mapa | 4:3, solo etiqueta del punto activo, chips con scroll | 4:3 | mapa 7/12 + panel 5/12 |
| Calendario | 1 mes | 1 mes | 2 meses |
| Navegación | menú de pantalla completa | menú de pantalla completa | una línea, 64 px |

## 5. Movimiento
Principio: **solo CSS salvo cambios de estado**; todo con `prefers-reduced-motion` (se anula por completo).

| Movimiento | Qué comunica | Técnica |
|---|---|---|
| Punto del logo recorre el arco (0° a 180°) | el paso del día mientras se avanza en la página | `animation-timeline: scroll(root)` dentro de `@supports`; sin soporte queda fijo arriba |
| Arcos de «La casa» se desplazan a ritmos distintos | profundidad y orden de lectura | `animation-timeline: view()` |
| Aparición de titulares de sección | jerarquía | `view()` con rango de entrada |
| Ruta del hotel al lugar elegido en el mapa | relación espacial | `stroke-dashoffset` al seleccionar |
| Transición entre pantallas | continuidad | View Transitions API si existe |
| Botones: pulsación `scale(.97)`; tarjetas: elevación 6 px | retroalimentación | transform y opacity solamente |

Duraciones 250 a 600 ms con `cubic-bezier(.16,1,.3,1)`. Sin cursores personalizados, sin parallax con JS, sin bucles infinitos, sin marquesinas. **Cero librerías de animación** en la maqueta.

## 6. Imagen y video
- **Decisión de la portada (`VIDEO_SCORE` 28):** imagen estática AVIF/WebP, sin video. Registro en `creative/manifest.json` y `creative/briefs/home.score.json`. Un microvideo de ≤ 6 s solo para escritorio queda como mejora opcional que requiere aprobación.
- **Dirección de arte:** luz de las 6 de la mañana, 35 mm, grano fino, sin personas, sin texto, sin logotipos.
- **Recorte en arco:** el borde superior se corta con una semicircunferencia; el sujeto va centrado en el 70 % inferior de la imagen.
- **Contrato visual** (lo que no cambia entre imágenes): arcos de medio punto en piedra, postigos de madera, baldosa de cemento, buganvilia, paleta verdeazulada y coral, hora del día, ausencia de personas. Ver `creative/manifest.json` → `constraints.preserve`.
- **Atracciones turísticas:** fotografías reales con licencia o propias (no generadas por IA) porque representan lugares reales.
- **Entrega técnica:** AVIF y WebP con `srcset`, dimensiones declaradas (sin CLS), primera imagen con `priority`, resto `loading="lazy"`.

## 7. Presupuestos de rendimiento (objetivos a verificar con Lighthouse y medición propia)
| Métrica | Objetivo |
|---|---|
| LCP (móvil, 4G simulado) | ≤ 2.0 s (umbral de Google: 2.5 s) |
| CLS | ≤ 0.05 (umbral: 0.1) |
| INP | ≤ 200 ms |
| JS inicial de la portada | ≤ 90 KB gzip (sin librerías de animación; mapa y calendario cargados bajo demanda) |
| CSS | ≤ 25 KB gzip |
| Imagen del hero en móvil | ≤ 120 KB (AVIF) |
| Transferencia total de la portada | ≤ 900 KB (coincide con `weight_budget_kb` del `VIDEO_SCORE`) |
| Lighthouse móvil | Rendimiento ≥ 95 · Accesibilidad 100 · Mejores prácticas ≥ 95 · SEO ≥ 95 (en entorno de producción) |

Medido hoy en la maqueta (sin imágenes): HTML 92 KB sin comprimir, 27 KB gzip, una sola petición externa (fuentes) y cero JavaScript de terceros.

## 8. Desviaciones respecto a Figma
Ninguna. No hay archivo de Figma; la intención visual vive en la maqueta HTML. Si se quiere, se puede crear un archivo de Figma con las variables de §2 para uso del equipo de diseño.
