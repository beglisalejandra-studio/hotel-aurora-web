# Escalabilidad y crecimiento

La arquitectura separa **contenido**, **presentación** y **servicios** para que crecer no obligue a rehacer. Estas son las costuras previstas y cuándo usarlas.

| Necesidad futura | Dónde se engancha | Qué hacer |
|---|---|---|
| Guardar contenido en **base de datos** (varios editores a la vez, miles de páginas) | `ContentStore` (`lib/content/store-types.ts`) y `lib/content/store-custom.ts` | Implementa `read/list/write/remove` y pon `EDITOR_STORE=custom`. Las rutas llegan ya validadas contra la lista cerrada. Tras escribir, el editor invalida la caché de las páginas. Los medios van a un almacén de objetos con CDN. |
| **Rate limiting compartido** (varias instancias/serverless) | `setRateLimitStore` (`lib/security/rate-limit.ts`) | Implementa `RateLimitStore` sobre Redis/Upstash/KV. Hoy cuenta **en memoria** por instancia: sirve como última defensa y para desarrollo. La lista de enlaces mágicos ya usados también es por instancia (la atadura al navegador y los 15 min siguen protegiendo). |
| Nuevos **bloques** | `lib/blocks/schemas.ts` + `components/blocks/blocks.tsx` + `app/editor/puck-config.tsx` | Un esquema zod, un componente sin hooks y sus campos. Las pruebas de esquemas, de «sin `style`» y de revisión previa los cubren. |
| Nuevas **páginas con datos** (catálogo, eventos) | Módulos `cms-content`, `blog-mdx` o un `ContentStore` propio | Mantén las rutas de primer nivel fuera de `RESERVED_SLUGS` (`lib/content/paths.ts`). |
| **Varios idiomas** | Módulo `i18n` | Decide idiomas antes: afecta a URLs, sitemap y `hreflang`. El editor guarda un documento por página; una página por idioma. |
| **Formularios, pagos, analítica** | Módulos `forms`, `email-resend`, `payments-stripe`, `analytics-consent` | Se aplican con `npm run module:add`. La zona `/editor` queda fuera de la analítica y del banner de cookies. |
| **CDN y caché** | Sitio público estático (con CSP estática) o ISR | Con la CSP estática las páginas se sirven desde caché/CDN; el tema es inmutable por huella. Con `strict-csp` todo se renderiza por petición (sin caché de CDN): mide antes de adoptarlo. |
| **Observabilidad** | `audit()` (`lib/editor/audit.ts`) y `/api/health` | Recoge la salida estándar del proceso; añade un monitor externo sobre `/api/health`. |
| **Más rastreadores de IA** | `config/ai-crawlers.json` | Una línea por rastreador con su propósito y política; `robots.txt` se genera solo. |

## Límites conocidos (decide antes de que duelan)

- `file` exige disco persistente; `git` publica por Pull Request (latencia de revisión y de despliegue); ninguno resuelve la edición simultánea por varias personas: para eso, `custom`.
- Páginas: un solo nivel (`/nombre`). Rutas anidadas requieren cambiar `app/[slug]` y `paths.ts`.
- Medios: hasta 500 imágenes en `content/media.json`; más allá, almacén de objetos.
- El editor no tiene histórico propio: con `git` el historial es el del repositorio.
