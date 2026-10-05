# ADR-0002 — Editor visual para el cliente (módulo `visual-editor`)

- **Estado:** aceptada · **Fecha:** 2026-10-03 · **Decide:** sistema web-os (revisable por proyecto)
- **Contexto:** todos los sitios deben poder ser editados por el cliente sin tocar código (colores, tipografía, imágenes, bloques, cabecera/pie, vista de móvil/tablet/escritorio), con seguridad, velocidad y buen SEO, navegables por agentes de IA y con una arquitectura que escale y no ate a un proveedor.

## Decisión

| Tema | Elección | Alternativas y por qué no |
|---|---|---|
| Motor del editor | **Puck** (`@puckeditor/core` 0.23.0, MIT) solo en `/editor` | Builder.io (SaaS, datos fuera, coste por uso), Plasmic (SaaS), GrapesJS (HTML libre: difícil de proteger y de hacer accesible), Tiptap solo (texto, no maquetación). Puck: código abierto, React, datos propios en JSON. |
| Sitio público | **Renderizador propio de servidor** (`lib/content/render.tsx`), sin Puck | Usar `<Render>` de Puck en público: añade código del editor a todas las visitas. Medido: la página pública no carga nada del editor (prueba e2e). |
| Contenido | **JSON en el repositorio** (`content/`), validado con zod | Base de datos desde el día 1: más piezas, más coste y más superficie; queda como `ContentStore` intercambiable. |
| Guardado | **Git por defecto** (Pull Request) + `file` + interfaz `custom` | Solo BD: pierde historial, revisión y reversión gratuitos. |
| Acceso | **Enlace mágico por correo** propio (HMAC sin estado + cookie de nonce) | Contraseñas (más superficie y soporte), OAuth de terceros (dependencia). Compromiso: autenticación propia → revisión de seguridad independiente recomendada. |
| Tipografías | **Pilas del sistema** (lista cerrada) | Google Fonts: petición de terceros, rastreo, CSP más ancha, peor LCP. Fuente de marca propia: `next/font/local` en un PR. |
| Tema | `content/theme.json` → `/theme.css` (archivo, no `<style>`) con **contraste AA obligatorio** | `<style>` en línea: incompatible con la CSP con nonce. |
| CSP | `/editor` admite estilos en línea (Puck); el resto, no | Relajar toda la CSP: innecesario (medido). |
| Hosting | Perfiles `vercel` y `standalone` (Docker), host canónico, `/api/health` | Exportación estática: descartada (rutas de servidor; el build falla, comprobado). |

## Consecuencias

- Todo proyecto nuevo trae el editor (`--no-editor` lo omite). Añade dependencias de producción: `@puckeditor/core`, `resend`, `sanitize-html`, `sharp` (ya opcional de Next). `npm audit`: 0 avisos en producción. `sharp` incluye libvips con licencia **LGPL-3.0-or-later** (binarios precompilados enlazados dinámicamente; revisar con el área legal del cliente si distribuye el software, no si solo lo aloja).
- La regla «cliente que edita sin equipo técnico → WordPress/CMS» del ADR-0001 queda matizada: con este módulo, la plantilla cubre ese caso para sitios de páginas y bloques; sigue sin cubrir catálogos grandes (Shopify) ni flujos editoriales complejos.
- Puck 0.23 es pre-1.0: se fija la versión exacta y se revisa cada actualización con las pruebas e2e del editor.

## Evidencia (proyectos de prueba aislados generados con `/init-client`, 2026-10-03)

| Proyecto | Resultado |
|---|---|
| **Los 8 módulos + editor** (CSP estricta con nonce) | `format:check` ✓ · `typecheck` ✓ · `lint --max-warnings 0` ✓ · unitarias **151/151** · `build` ✓ · e2e **32 superadas + 8 omitidas a propósito** (las pruebas del editor corren solo en el proyecto de escritorio) · Lighthouse móvil: performance 1,00 · accesibilidad 1,00 · buenas prácticas 1,00 · SEO 1,00 · LCP ≈ 1,7 s · CLS 0 · TBT ≈ 50 ms · `npm audit`: 1 aviso de desarrollo aceptado y con caducidad (`braces`), **0 en producción** |
| **Solo el editor** (CSP estática, la combinación por defecto) | unitarias **108/108** · e2e **32 superadas + 8 omitidas** · Lighthouse: performance 0,99 · accesibilidad/buenas prácticas/SEO 1,00 · LCP ≈ 1,7 s · CLS 0 · TBT ≈ 40 ms |
| **Sin editor** (`--no-editor`) | unitarias 57/57 · e2e 20/20 (la base sigue intacta) |

Las cifras corresponden al contenido de ejemplo: **mide de nuevo con el contenido real**.

**Hallazgos que corrigieron el diseño** (los cazó una prueba real, no la lectura del código):

1. Next solo sirve los archivos de `public/` que existían al arrancar → las imágenes subidas daban 404 con el almacén `file`; se añadió la ruta `/media/[file]`.
2. `generateStaticParams` en `app/[slug]` provocaba un 500 en páginas inexistentes bajo `strict-csp`; ahora solo se declara con CSP estática.
3. El banner de cookies tapaba la interfaz del editor; `analytics-consent` ahora lo omite en `/editor` (y no carga analítica ahí).
4. El ancho del iframe de Puck se mide con `offsetWidth` (Puck lo reduce con `transform` si no cabe).
5. El estado `.web-os/project.json` fallaba `format:check` con un solo módulo (Prettier lo escribe en una línea): ahora `.web-os` está en `.prettierignore`. Era un fallo latente que el editor por defecto dejó al descubierto.
6. `output: "export"` no es viable con rutas de servidor (el build falla en `/sitemap.xml`): se descartó el perfil de exportación estática.
