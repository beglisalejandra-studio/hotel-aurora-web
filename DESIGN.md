# DESIGN - Hotel Aurora

> Dirección visual, tokens y reglas de componentes. **Autoridad visual única: taste-skill** (`visual_authority` en PROJECT.md). Las skills de UI/UX, 21st, Awwwards y Dribbble son consulta. Estado: **aprobada por la persona el 2026-10-09 (G1)** sobre la maqueta v3. Desde entonces se añadieron horarios fijos, petfriendly y mapa bajo demanda (ver PRODUCT.md).
> Historial de dirección: v1 serena con arco y sol; v2 recorrido 3D con arcos; **v3 actual**: sin arco ni disco, fotografía a sangre y recorrido 3D a través de las fotos (decisión del cliente: el arco no gusta).

## 1. Concepto (10 líneas)
- **Idea central:** el hotel vende por sus fotografías y su vídeo, así que la web es una **inmersión fotográfica**: la foto de la portada ocupa todo el escenario y, al desplazarse, se la atraviesa y emergen las siguientes. El tono sigue la luz de la mañana, que se calienta a medida que se avanza.
- **Lectura del encargo:** web de hotel boutique premium para parejas que reservan desde el móvil, muy visual e interactiva, sin penalizar la carga.
- **Diales (taste-skill):** `DESIGN_VARIANCE 8` · `MOTION_INTENSITY 7` · `VISUAL_DENSITY 3`.
- **3 adjetivos:** luminoso, inmersivo, sereno.
- **Elemento firma:** **el recorrido**: una cámara que atraviesa las fotografías con CSS 3D nativo (solo `transform` y `opacity`), con bruma, luz de horizonte que se intensifica y un foco cálido que sigue al cursor sobre las fotos.
- **Qué evita:** formas geométricas decorativas (el arco y el disco de sol se descartaron), hero centrado de plantilla, tres tarjetas con icono, degradado morado, crema con latón, serif de moda, sellos de hora o numeración como etiquetas, preloader, fotos de stock evidentes, emojis, iconos dibujados a mano.

## 2. Tokens
Familia de color: **terracota + pizarra**, un solo acento. Dos temas con el mismo significado: **Día** (claro) y **Madrugada** (oscuro). Por defecto sigue `prefers-color-scheme`; hay selector manual y el cambio se anima como un amanecer que se extiende desde el botón (View Transitions, con fallback instantáneo).

| Token | Día | Madrugada | Uso | Contraste (calculado) |
|---|---|---|---|---|
| `--bg` | `#EDF0F1` | `#11181F` | fondo | n/a |
| `--surface` | `#F7F8F8` | `#1A242D` | paneles | n/a |
| `--band` | `#E1E7E9` | `#162029` | franjas de ritmo | n/a |
| `--ink` | `#16202A` | `#E8ECEE` | texto principal | 14,39:1 / 15,04:1 |
| `--ink-2` | `#46535F` | `#A9B4BD` | texto secundario | 6,89:1 / 8,47:1 |
| `--line` | `#7C8A95` | `#5B6A76` | bordes de controles | 3,09:1 / 3,21:1 (≥ 3:1) |
| `--accent` | `#B9431A` | `#F0794A` | CTA, enlaces | texto sobre fondo 4,72:1 / 6,42:1 |
| `--on-accent` | `#FFFFFF` | `#1A0F09` | texto sobre acento | 5,41:1 / 6,75:1 |
| `--accent-soft` | `#F3D9CC` | `#3A2418` | celdas tintadas | tinta sobre él 12,25:1 (Día) |
| texto sobre foto | `#F3F6F7` + degradado `rgba(11,17,23,.88→0)` | igual | titular y párrafo del héroe | ≥ 4,5:1 el párrafo y ≥ 3:1 el titular. **Medido con las fotos P01 reales en 7 tamaños (2026-10-09)**; reglas en «Héroe con foto real» |

Sin negro ni blanco puros en superficies de texto. Un solo acento en toda la página.

**Tipografía** (par recomendado por la base de UI/UX y coherente con taste-skill: sin serif de moda, sin Inter):
- **Display:** Outfit 300 y 500 (énfasis por peso y color, no por cursiva sintética).
- **Texto e interfaz:** Work Sans 400 y 500.
- **Escala (≥ 5 tamaños, fluida):** 14 · 16 · 18 · 24 · 36 · 56 · 104 px (`clamp`). Titular del héroe de 2 líneas como máximo.
- Marca: **solo el nombre** "Aurora" en Outfit 300 con tracking 0,04 em; no hay símbolo.
- En producción: `next/font` autoalojado, subconjunto latino, `font-display: swap`, `size-adjust` para evitar saltos. La maqueta usa Google Fonts por CDN.

**Espaciado:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 112 · 160 px. Densidad baja.

**Forma (una sola regla):** **medios y paneles rectos** (radio 0, filete de 1 px); **controles en píldora**. Sin sombras: la elevación se resuelve con tono.

## 3. Componentes y estados
- **Recorrido (héroe + paseo):** 5 planos fotográficos en profundidad. El primero ocupa el escenario completo y lleva titular, párrafo y barra de fechas; los demás (patio, habitación, restaurante en vídeo, spa) emergen del punto de fuga y cada uno trae un pie en panel sólido con su enlace. Base estática apilada si no hay `animation-timeline` o si hay movimiento reducido.
- **Botón primario (motion graphics):** relleno circular que crece desde el punto por donde entra el puntero, flecha que aparece al pasar el ratón, atracción magnética de hasta 10 px (solo puntero fino y sin movimiento reducido), `:active` baja 1 px, foco visible.
- **Botón secundario:** la tinta sube desde abajo e invierte el texto.
- **Enlaces con flecha:** subrayado que se dibuja en el acento.
- **Selector de tema:** disco que se desliza entre sol y luna creciente, y revelado circular de la página.
- **Barra de reserva:** fechas, huéspedes y "Reservar". En móvil se reduce al botón (las fechas se eligen en la ventana de reserva).
- **Tarjeta de habitación:** foto vertical 4:5, inclinación 3D con el puntero, foco de luz cálido, transición de vista a la ficha. Entra escalando desde 0,92 al deslizar el carril, que tiene su barra de progreso.
- **Acordeón (FAQ):** `details` nativo con altura animada (`interpolate-size`) y teclado completo.
- **Ventana de reserva (simulación de Mews):** pasos "Fechas", "Habitación", "Confirmar"; estados vacío, carga, sin disponibilidad, error, éxito; entrada escalonada solo al cambiar de paso.
- **Formularios:** etiqueta encima, error debajo (se borra al corregir), consentimiento no premarcado, contraste AA.
- **Banner de cookies:** tres botones idénticos (Aceptar, Rechazar, Configurar), panel de categorías y mapeo visible a Consent Mode v2.
- **Contacto flotante y asistente:** un botón con anillo que pulsa tres veces y abre WhatsApp, asistente (IA, con aviso) o teléfono.
- **Progreso de scroll:** línea de acento de 3 px en el borde superior.

## 4. Responsive
Breakpoints: 360 · 390 · 768 · 1024 · 1440 px, mobile first. En móvil: el héroe es una foto vertical a sangre con el texto abajo y un único botón "Reservar"; los planos del recorrido se reducen y se desplazan hacia arriba para dejar sitio al pie, que va abajo en panel; el bento pasa a una columna; la navegación se abre en menú con "Reservar" siempre visible. Objetivos táctiles ≥ 44 px (verificado en la maqueta).

## 5. Movimiento (intensidad 7, motivado)
- **Recorrido:** profundidad y narrativa (cada foto se descubre en orden). Cámara por `animation-timeline` sobre un `view-timeline` del contenedor; sin escuchadores de scroll.
- **Bruma y luz de horizonte:** ambiente (bruma con deriva lenta; luz que sube de 20 % a 100 % durante el recorrido).
- **Puntero:** inclinación del escenario, foco cálido sobre fotos, inclinación de tarjetas y atracción de botones, con variables CSS y un único `requestAnimationFrame`.
- **Botones, tema, diálogos y banner:** retroalimentación y transición de estado.
- Easing `cubic-bezier(0.16, 1, 0.3, 1)`; duraciones 200 a 900 ms. Solo `transform` y `opacity` salvo `clip-path` en el revelado del tema.
- **`prefers-reduced-motion`:** todo queda estático y apilado. Sin cursores personalizados, sin bucles infinitos salvo la bruma (que se desactiva con movimiento reducido).
- **Navegadores sin scroll-timeline:** se muestra la versión estática. Estado de soporte: Chromium sí; Safari y Firefox con fuentes contradictorias, **a verificar en caniuse al implementar**.

## 6. Imagen y video
- **Dirección de arte:** luz natural de mañana, arquitectura y horizonte, tonos de pizarra y terracota, sin personas posando. La foto del héroe se entrega en **dos composiciones nativas** (16:10 escritorio y **9:16 móvil**: el contenedor del héroe en un teléfono mide unos 390 x 772, proporción 0,51) con zona libre en la parte inferior para el texto. La tableta vertical (768 x 952) reutiliza la 9:16 anclada arriba.
- **Héroe con foto real (medido el 2026-10-09 en 360 × 740, 375 × 667, 390 × 844, 412 × 915, 430 × 932, 768 × 1024 y 1440 × 900; capturas `docs/entregables/capturas/p01-real-*.jpg`):**
  - **Escritorio (≥ 901 px):** foto 16:10, `background-position: 50% 38%`; degradado lateral (`90deg`, `rgba(11,17,23,.62)` a `.42` al 34 % y `0` al 64 %) más el inferior (`.88` a `.62` al 36 % y `0` al 70 %). Sin el lateral, el 14 % y el 20 % de los píxeles del titular quedaban bajo 3:1.
  - **Móvil y tableta vertical (≤ 900 px):** foto 9:16, `background-position: 50% 80%` (en móviles cortos y tabletas aleja la casa del texto); solo degradado inferior: `rgba(11,17,23,.92)` al 0 %, `.76` al 42 % y `0` al 80 %. **Sin degradado lateral:** oscurecería el brillo del amanecer a la izquierda.
  - **Pantallas de ≤ 720 px de alto:** se oculta el párrafo del héroe y queda titular y botón. En 375 × 667 el párrafo tapaba la casa.
  - **Resultado:** titular ≥ 3:1 y párrafo ≥ 4,5:1 en los 7 tamaños (peor píxel del titular 2,9:1 en escritorio, uno solo); sin desbordamiento horizontal.
- **Móvil primero (regla permanente):** la versión móvil se diseña, se mide y se revisa antes que la de escritorio; ver `CLAUDE.md`. Cada foto se pide con su composición móvil nativa; la tabla de contenedores medidos está en `creative/requests/INDEX.md`.
- **El héroe es imagen** (LCP), AVIF con `fetchpriority="high"`. Sin vídeo en el héroe salvo que `VIDEO_SCORE` lo justifique en la fase 4.
- **Vídeo en ventanas** (restaurante y spa): MP4/WebM mudo en bucle de 6 s, `preload="none"`, póster AVIF, arranca al entrar en pantalla, se pausa al salir, no se carga con `saveData` o conexión lenta. Peso máximo por clip: ver ADR-0006.
- **Estado de la maqueta:** `creative/providers.json` fija el proveedor de imagen en `manual` y la generación de imágenes de Figma consume créditos de pago, así que **no he generado fotos**. La maqueta usa huecos rotulados (`P01`, `V01`...); el material se pide en `creative/briefs/pedido-de-materiales.md`.

## 7. Presupuesto de rendimiento
Resumen; razonado y medido en `docs/decisions/ADR-0006-visual-inmersivo-y-rendimiento.md`.
- Transferencia crítica de la portada en móvil ≤ 700 KB (HTML, CSS, JS, fuentes e imagen LCP); JS crítico ≤ 90 KB gzip; imagen LCP ≤ 180 KB (≤ 110 KB el recorte móvil).
- Sin preloader. Terceros (Mews, GA4, Pixel, asistente) después del consentimiento o de la primera interacción.
- LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 en el p75 de campo y presupuesto de Lighthouse en CI.

## 8. Desviaciones respecto a otras guías
- La búsqueda de UI/UX devolvió "azul marino + dorado" y Playfair Display + Karla para hotelería. **No se adopta**: taste-skill veta la paleta de lujo por defecto y el serif sin justificación. Sí se adopta su pareja Outfit + Work Sans.
- Figma no se usa en esta fase (recurso escaso, `figma_seat: view`); los tokens viven aquí.
