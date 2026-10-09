# ADR-0006 · Diseño visual inmersivo (3D) con presupuesto de rendimiento

Estado: **aceptado** el 2026-10-09: la persona aprobó la dirección, el recorrido de unas cuatro pantallas y los **dos extras opcionales** (héroe 2,5D con WebGL y visor 360) · Fecha: 2026-10-09

## Contexto
El hotel vende por sus fotografías y su vídeo, y el cliente pide una web muy visual, interactiva, con botones animados y scroll dinámico, con efectos 3D de alto impacto, **sin penalizar la carga**. Hay además un requisito duro: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.

## Evidencia: lo que cuesta el 3D "de premio" (medido el 2026-10-09)
Medición en Chromium sin cabeza con render por software, 9 s tras `domcontentloaded`. **Los bytes son reales; los tiempos no son representativos de un móvil.**

| Sitio | URL | Transferencia | Peticiones | Notas |
|---|---|---|---|---|
| Explore Primland (resort) | https://explore.ownprimland.com | 16,65 MB | 72 | Vuelo cinematográfico; a los 9 s seguía en pantalla de carga |
| Sleep Well Creatives | https://www.sleep-well-creatives.com | 42,86 MB | 67 | 20 vídeos; pantalla de carga |
| Hubtown | https://hubtown.co.in | 22,71 MB | 97 | Monolito 3D; pantalla "100 % loaded" |
| Oryzo (Lusion) | https://oryzo.ai | 13,92 MB | 130 | 82 imágenes; pantalla de carga |
| Cartier Watches & Wonders | https://www.cartier.com/en-fr/watchesandwonders | n/a | n/a | HTTP 403, no medido |

Lectura: los cuatro **ocultan la primera vista tras un preloader** y pesan entre 14 y 43 MB. Para una web cuyo objetivo es reservar desde el móvil, eso destruye el LCP y la conversión. Se copian sus ideas visuales, no su coste.

## Técnicas valoradas
| Técnica | Impacto visual | Coste | Decisión |
|---|---|---|---|
| **Recorrido por planos con CSS 3D** y `animation-timeline` (cámara que atraviesa las fotos) | Muy alto | Casi nulo: solo `transform` y `opacity`, sin librerías ni WebGL, reutiliza las fotos de la web | **Se adopta** como firma |
| Bruma, luz de horizonte y foco cálido que sigue al cursor (`mix-blend-mode`) | Alto | Muy bajo (degradados CSS y variables) | **Se adopta** |
| Botones con relleno direccional, atracción magnética, tema con revelado circular (View Transitions) | Alto | Muy bajo | **Se adopta** |
| Transición de vista de la tarjeta de habitación a su ficha (View Transitions) | Alto | Nativo | **Se adopta** (con fallback) |
| Vídeo en ventanas (restaurante, spa) | Alto | Medio, controlado por carga diferida | **Se adopta** con presupuesto |
| Héroe WebGL con foto + mapa de profundidad (2,5D) | Muy alto | ~30 a 40 KB de JS (OGL o WebGL a mano) más un mapa de profundidad por foto | **Aprobado como extra**: spike 5.12 en la fase 5, solo escritorio, tras `load` e inactividad y con la puerta de rendimiento |
| Visor 360 de habitaciones (Pannellum o similar) | Alto | Carga bajo demanda al pulsar | **Aprobado como extra**: spike 5.13; necesita fotos equirrectangulares (se piden más adelante, una a una) |
| Escenas Three.js / React Three Fiber completas | Máximo | 14 a 43 MB como los de arriba | **Descartado** |

## Reglas de rendimiento (presupuesto)
1. **El héroe es una imagen** (el LCP). AVIF con `fetchpriority="high"`, dos recortes (escritorio y móvil). **Sin preloader.**
2. **Transferencia crítica de la portada en móvil ≤ 700 KB** (HTML, CSS, JS, fuentes e imagen LCP); **JS crítico ≤ 90 KB gzip**; imagen LCP ≤ 180 KB (≤ 110 KB el recorte móvil).
3. **Todo efecto 3D es progresivo.** Bajo `@supports (animation-timeline: view())` y `prefers-reduced-motion: no-preference`. Si no, **versión estática apilada** (implementada y probada en la maqueta).
4. **Efectos de puntero** solo con `(hover: hover) and (pointer: fine)`, con un único `requestAnimationFrame` y variables CSS; nada de lectura de layout en bucle.
5. **Vídeo:** máx. 1,5 MB por clip (6 s, sin audio, 1080p), AV1/WebM con MP4 H.264 de respaldo, `preload="none"`, póster AVIF, arranca con IntersectionObserver, se pausa fuera de pantalla, no se carga con `saveData` ni conexión lenta. **Cero bytes de vídeo en la carga inicial.**
6. **WebGL opcional:** solo si pasa la puerta: escritorio, `!reduced-motion`, `!saveData`, memoria ≥ 4 GB si el navegador la expone, después de `load` e inactividad, y con fallback a la imagen.
7. **Terceros** (Mews, GA4, Pixel, asistente) después del consentimiento o de la primera interacción.
8. **Imágenes:** AVIF/WebP, `srcset` y `sizes`, `decoding="async"`, ancho y alto fijos para evitar CLS; `loading="lazy"` salvo el héroe.
9. **Capas:** `will-change: transform` solo en el mundo 3D; el número de capas compuestas se revisa con DevTools.
10. **Control en CI:** presupuesto de Lighthouse (`lighthouse.budgets.json` de la plantilla) y prueba en un móvil de gama media real antes de aprobar.

## Estado de soporte (a verificar al implementar)
- `animation-timeline` y `view-timeline`: Chromium desde la versión 115. En Safari y Firefox mis fuentes se contradicen (versiones y banderas), así que **no lo doy por hecho**; el diseño no depende de ello gracias al fallback.
- View Transitions: se usa con comprobación de funcionalidad y sin él la acción es instantánea.

## Accesibilidad del recorrido
- El `h1` y el párrafo permanecen en el árbol de accesibilidad todo el tiempo; solo la barra de fechas se oculta tras el primer tramo.
- Los pies de estación son **paneles sólidos**, así que el contraste no depende de lo que haya detrás.
- Enlace "Saltar el recorrido" al principio. Los mismos contenidos existen en secciones normales debajo (habitaciones, restaurante, spa, paquetes).
- Probado en la maqueta con axe en 7 estados sin violaciones.

## Consecuencias
- Hay que **entregar las fotos en dos recortes** y con zona libre para el texto del héroe.
- El diseño depende de buena fotografía: sin ella, los planos son rectángulos grises. De ahí el pedido de materiales.
- El recorrido ocupa unas cuatro pantallas de scroll; si en pruebas con usuarios resulta largo, se acorta reduciendo `--steps`.
