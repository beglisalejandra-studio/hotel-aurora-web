# Migración desde una web antigua (escenario simulado)

> **Esto es un ejercicio de portfolio.** La "web antigua" de Hotel Aurora es **ficticia** (un WordPress con WPML en `hotelaurora.example`). No hay datos reales de tráfico: donde un hotel real mediría, aquí se explica **cómo** se mide. La parte técnica sí es real y se prueba: el mapa de redirecciones se valida con `node scripts/check-redirect-map.mjs` y, una vez desplegado, con `launch:check --redirects`.

## Por qué importa
Cambiar de plataforma sin cuidar las URLs es la forma más común de perder posiciones en Google. Cada dirección antigua que deja de funcionar (404) o que pasa por varias redirecciones pierde parte de su valor y de los enlaces que recibía. El objetivo es que **cada URL antigua con valor llegue, de una sola vez y con un 301, a la página nueva más equivalente**.

## El escenario
| | Web antigua (ficticia) | Web nueva |
|---|---|---|
| Plataforma | WordPress + WPML | Next.js + Sanity |
| Dominio | `hotelaurora.example` | el mismo (no hay cambio de dominio) |
| URLs | `/habitacion-doble-vista-mar/`, `/?p=123`, `/carta-restaurante.php`, `/index.php/aviso-legal/` | `/es/habitaciones/marea`, `/en/rooms/marea` |
| Idiomas | español sin prefijo e inglés en `/en/` | `/es/...` y `/en/...` con slugs traducidos |
| Blog | sí | fuera del alcance (cada entrada se redirige a su intención más cercana) |

## Fases (y qué se entrega en cada una)
1. **Inventario.** Rastreo del sitio antiguo más exportación de Search Console (clics e impresiones por URL) y de enlaces entrantes. Cada URL se clasifica: *conservar con 301*, *fusionar* en otra página o *retirar (410)*. Prioridad por clics y enlaces, no por intuición. En el ejercicio: `docs/seo/redirects.txt` (45 reglas de ejemplo).
2. **Mapa 1 a 1.** Cada origen a un único destino final. Reglas: destino en minúsculas, sin barra final y existente; **sin cadenas ni bucles**; el idioma del origen manda el del destino. Validado automáticamente.
3. **Reglas generales** (no una línea por URL):
   - Una sola versión del dominio: `http` a `https` y `www` a apex (o al revés), con 301.
   - Barra final y mayúsculas normalizadas (`/en/rooms/` a `/en/rooms`, `/Habitaciones` a `/es/habitaciones`).
   - Prefijo `index.php/` y extensiones `.php` o `.html`.
   - **Conservar los parámetros de campaña** (`utm_*`, `gclid`, `fbclid`) al redirigir.
   - Sitemap antiguo (`/sitemap_index.xml`) a `/sitemap.xml`.
4. **Reglas con parámetros de WordPress** (no caben en `redirects.txt`, que solo mira rutas): `/?p=<id>` y `/?page_id=<id>` se resuelven con una tabla id a destino generada del inventario. En Next.js se implementan con `redirects()` usando `has: [{ type: 'query', key: 'p' }]`; en listas largas, con middleware (comprobar el límite vigente de redirecciones de la plataforma).
5. **Qué se retira con 410 (Gone), no con 301:** `feed/`, `xmlrpc.php`, `wp-login.php`, `wp-json/`, y cualquier página sin equivalente ni valor. Redirigirlo todo a la portada genera *soft 404* y empeora la señal.
6. **Imágenes:** se conservan las URLs de las imágenes que reciben tráfico de Google Imágenes (o se redirigen al recurso nuevo equivalente); el resto de `/wp-content/uploads/` responde 410.
7. **Contenido equivalente.** Un 301 hacia una página que ya no responde a la misma intención se trata como error. Títulos, descripciones y encabezados clave de las páginas con más tráfico se trasladan y se revisan, no se reinventan.
8. **Idiomas.** `hreflang` recíproco entre `/es/...` y `/en/...` (inventario de parejas en `docs/seo/new-urls.txt`), `x-default` y canónicas absolutas. Una URL antigua en inglés nunca redirige a una española.

## Cómo se prueba
- **Antes de implementar:** `node scripts/check-redirect-map.mjs` (duplicados, bucles, cadenas, destinos inexistentes e idiomas cruzados). Probado con un fichero erróneo a propósito: detecta cada tipo de error.
- **En el preview** (con las reglas ya implementadas): `npm run launch:check -- <url-preview> --redirects docs/seo/redirects.txt` comprueba que cada origen responde 301 o 308 y que el destino coincide.
- **Manual:** una muestra de URLs con parámetros de campaña, mayúsculas y barra final; `curl -I` para ver que hay **un solo salto**.

## Día del cambio y después (plan, no se ejecuta sin aprobación)
| Cuándo | Qué | Quién |
|---|---|---|
| Antes | Redirecciones aprobadas y probadas en el preview; copia completa de la web antigua; mapa de rollback | Equipo y persona |
| Día D | Cambio de DNS o de despliegue **solo con aprobación humana expresa**; prueba inmediata de las 20 URLs principales | Persona |
| Día D | Enviar el nuevo sitemap en Search Console y Bing; **no hace falta "cambio de dirección"** porque el dominio no cambia | Persona |
| Semanas 1 a 8 | Vigilar los informes de errores 404 y *soft 404* y los clics por página frente a la línea base; corregir en el mapa | Equipo |
| Mínimo 12 meses | **Mantener** las redirecciones activas | Equipo |

## Riesgos y mitigación
- *Cadenas de redirección por reglas generales mal ordenadas:* se prueban de extremo a extremo con `curl -I`.
- *Páginas retiradas con valor:* la priorización por clics y enlaces las detecta; en caso de duda, 301 a la más cercana.
- *Cambio de textos de páginas con buen posicionamiento:* se revisan antes de publicar.
- *Datos no reales aquí:* el ejercicio no mide tráfico; los criterios sí son los de un proyecto real.
