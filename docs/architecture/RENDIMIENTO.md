# Rendimiento, seguridad y SEO: cómo se consiguen y cómo se mantienen

## Rendimiento (Core Web Vitals)

| Medida | Cómo |
|---|---|
| HTML listo desde el servidor | App Router con renderizado en servidor/estático; la página pública **no carga el editor** (comprobado por prueba e2e). |
| CSS mínimo | Tailwind 4 (solo las clases usadas) + `/theme.css` (< 1 KB, caché inmutable por huella). |
| Tipografía | Solo **pilas del sistema** (`lib/theme/fonts.ts`): cero descargas, cero parpadeo, sin terceros ni ampliar la CSP. Una fuente de marca propia se añade con `next/font/local` en un PR (autoalojada, `font-display: swap`, subconjunto). |
| Imágenes | WebP con `srcset` (480/960/1600 px), `width`/`height` (sin saltos de maquetación), `decoding="async"`, carga diferida salvo la primera imagen (`fetchPriority="high"`), metadatos eliminados, peso vigilado por la revisión previa (aviso > 250 KB, error > 900 KB). |
| Sin JS innecesario | Menú móvil y preguntas frecuentes con `<details>` nativo (sin JavaScript). |
| Presupuestos | `lighthouse.budgets.json` (móvil, mediana de 3): performance ≥ 0.9, accesibilidad ≥ 0.95, buenas prácticas ≥ 0.95, LCP ≤ 2,5 s, CLS ≤ 0,1, TBT ≤ 200 ms. Falla el CI si no se cumplen. |

Medido en el proyecto de prueba con la página de ejemplo (3 corridas, móvil, build de producción): **performance 0,99–1,00 · accesibilidad 1,00 · buenas prácticas 1,00 · SEO 1,00 · LCP ≈ 1,7 s · CLS 0 · TBT 40–60 ms**, tanto con CSP estática como con `strict-csp`. Es la página neutra: **vuelve a medir con el contenido real** (cada imagen y bloque cuenta).

## Seguridad

Ver `docs/security.md` y `EDITOR-VISUAL.md` («Acceso» y «Medidas»). Resumen del reparto de CSP:

- Sitio público: CSP estática por defecto (`style-src 'unsafe-inline'` es el precio de la caché/CDN) o `strict-csp` (nonce por petición, sin `unsafe-inline` en scripts **ni en estilos**). Los bloques no usan atributos `style`, así que sirven en ambos modos.
- `/editor`: Puck pinta con atributos `style`; bajo `strict-csp` esa ruta (y solo esa, `lib/security/csp-paths.ts`) admite estilos en línea. Los scripts siguen exigiendo nonce.

## SEO técnico y agentes de IA

- **Estructura**: un único `h1` (la Portada), títulos sin saltos, puntos de referencia (`header`, `nav`, `main`, `footer`) — comprobado con axe y con pruebas de roles —, enlaces con texto, imágenes con texto alternativo (la revisión previa lo exige).
- **Metadatos por página** (título, descripción, imagen social, `noindex`), `canonical`, `sitemap.xml` con las páginas publicadas, `robots.txt`, datos estructurados `Organization` + `WebSite` (inicio) y `FAQPage` (una sola vez por página).
- **Agentes de IA**: el contenido está en el HTML, sin depender de JavaScript. `config/ai-crawlers.json` declara, **por rastreador**, si puede leer el sitio (OAI-SearchBot, ChatGPT-User, Claude-SearchBot/Claude-User, PerplexityBot, GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot…): lo decide el responsable del sitio; `robots.txt` es una petición de cortesía, no una barrera de seguridad. No se incluye `llms.txt`: Google ha indicado que no lo utiliza y no hay evidencia verificada de que mejore la visibilidad en asistentes de IA; añádelo solo si un cliente concreto lo pide.
- **Reputación en Google**: la plantilla no gestiona reseñas. Si el cliente tiene ficha de Google Business Profile, enlázala y usa datos estructurados solo para reseñas **reales y visibles** en la página (las políticas de Google penalizan reseñas inventadas o autopromocionales).
- **Posicionamiento**: se aplican los requisitos técnicos y las buenas prácticas; **no se puede garantizar ninguna posición**.

## Cómo no perderlo con el tiempo

1. `npm test` incluye la revisión de **todo** el contenido (`content-integrity.test.ts`): falla el CI si alguien publica una página sin `h1`, con imágenes sin descripción o un tema ilegible. Antes de lanzar: `CONTENT_STRICT=1 npm test` (los textos de ejemplo pasan a error).
2. `npm run lighthouse` en CI con los presupuestos.
3. `npm run audit` (puerta de auditoría con excepciones documentadas y con caducidad).
