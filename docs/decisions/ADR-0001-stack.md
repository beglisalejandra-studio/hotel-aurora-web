# ADR-0001 · Stack: Next.js + TypeScript con contenido en un CMS headless

Estado: **propuesto** (pendiente de aprobación en G1/G2) · Fecha: 2026-10-09

## Contexto
Web de un hotel boutique, bilingüe (ES/EN), con tres exigencias que condicionan la tecnología: Core Web Vitals (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1), SEO técnico multilingüe, y consentimiento + medición conforme a RGPD/LOPDGDD. La reserva la resuelve un motor externo (ADR-0002), así que la web es una web de marca que lleva a reservar, no una tienda.

## Decisión
Next.js (App Router) + TypeScript estricto + Tailwind v4, partiendo de la plantilla del sistema. Contenido editable en un CMS headless (ADR-0003). Páginas generadas en servidor/estático con revalidación; interactividad aislada en componentes cliente pequeños.

## Alternativas valoradas
| Opción | Qué da | Por qué no es la base |
|---|---|---|
| **Shopify** | Catálogo, carrito, checkout | Modela productos con stock, no habitaciones con tarifas, restricciones y channel manager. Las apps que lo simulan son frágiles. Solo tendría sentido como pieza aparte para vender productos físicos, que aquí no hay |
| **WordPress** | Edición muy conocida, ecosistema de temas y plugins | Es viable y sería la opción si el equipo del hotel quisiera editarlo todo sin límites. Pero: los temas de hotel empujan a diseño genérico, cada plugin añade superficie de ataque y mantenimiento, y el rendimiento depende de disciplina constante. Se descarta por diseño, rendimiento y seguridad, no por capacidad |
| **Next.js + CMS headless** | Control total de rendimiento, SEO, i18n y seguridad; contenido desacoplado y portable | Más trabajo inicial y cambios estructurales pasan por código. Se compensa con CMS para el día a día y documentación para quien programe |

## Consecuencias y decisiones derivadas
- **Rendimiento:** HTML renderizado en servidor; imagen del hero optimizada y precargada (la maqueta sigue la regla de no usar vídeo en el hero salvo que `VIDEO_SCORE` lo justifique); fuentes autoalojadas con `next/font`; terceros (Mews, GA4, Pixel, IA) **después** del consentimiento o de la primera interacción.
- **CSP:** se usa la CSP estática de la plantilla. El módulo `strict-csp` (nonce por petición) fuerza renderizado dinámico y empeora el LCP, así que no se adopta; se compensa con lista cerrada de orígenes, SRI donde aplique y revisión en cada PR.
- **Módulo `visual-editor` de la plantilla:** no se aplica; razones en ADR-0003.
- **Versiones:** las fijadas por el sistema (`next 16.3.8`, `react 19.2.8`, `typescript 6.0.3`, `tailwindcss 4.3.3`), a revalidar con el doctor antes de empezar.
- **Coste de cambio:** el contenido vive en el CMS y el motor de reservas queda tras una interfaz, de modo que sustituir Sanity o Mews no obliga a rehacer la web.

## Riesgos
- Mayor dependencia de una persona técnica para cambios estructurales: se mitiga con documentación por módulo y fase (`docs/entregables/02-documentacion-tecnica.md`).
