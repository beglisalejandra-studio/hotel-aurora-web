# Alojamiento, dominio y despliegue

Next.js no obliga a un proveedor. La plantilla trae dos perfiles, elegidos con la variable de **build** `BUILD_TARGET` (`lib/hosting.ts`). Registra la decisión en `PROJECT.md` (`hosting`) y en un ADR.

| Perfil | `BUILD_TARGET` | Sirve para | Editor visual | Notas |
|---|---|---|---|---|
| **Vercel / similar** (por defecto) | _(vacío)_ | Despliegue gestionado, CDN global, previews por rama. También plataformas con soporte de Next (Netlify, Cloudflare, AWS Amplify…) con su adaptador **(no probadas aquí)**. | Sí, con `EDITOR_STORE=git` (el disco es efímero). | `NEXT_PUBLIC_SITE_URL` y secretos en el panel del proveedor. |
| **Docker / VPS / Kubernetes** | `standalone` | Servidor Node autocontenido (`Dockerfile` incluido, usuario sin privilegios, `HEALTHCHECK`). | Sí; `file` con **volumen persistente** en `content/` y `public/media/`, o `git`. | `docker build --build-arg NEXT_PUBLIC_SITE_URL=… -t web .` · detrás de un proxy/TLS (Caddy, Nginx, un balanceador). Fija el digest de la imagen base al desplegar. |

## Dominio y DNS

- `NEXT_PUBLIC_SITE_URL` = URL pública definitiva (con `https://`). Activa HSTS, `upgrade-insecure-requests` y las URLs absolutas del sitemap/metadata.
- **Host canónico** (SEO: una sola dirección por contenido): `CANONICAL_HOST=www.midominio.com` en el build; cualquier otro host (apex, previews) recibe **308** a `NEXT_PUBLIC_SITE_URL` conservando ruta y consulta. `/api/health` queda exento. Verificado con peticiones reales (host canónico → 200/404 propio; otro host → 308).
- **Los cambios de DNS, certificados y producción los aprueba una persona** (regla del sistema): el agente prepara la lista de registros, no los aplica.
- `/api/health` responde `{"status":"ok"}` sin tocar datos: úsalo en balanceadores y monitorización externa.

## Variables por entorno

| Entorno | `NEXT_PUBLIC_SITE_ENV` | Efecto |
|---|---|---|
| desarrollo / preview / staging | `development` / `preview` / `staging` | `noindex` en cabecera, metadata y `robots.txt`. |
| producción | `production` | Indexable, `robots.txt` con política por rastreador de IA y sitemap. |

## Hosting de archivos estáticos (sin servidor)

**No hay perfil de exportación estática.** El sitio usa rutas de servidor (editor y su API, `sitemap.xml` y `robots.txt` generados, `/api/health`), y `output: "export"` las rechaza al compilar (se comprobó: el build falla en `/sitemap.xml`). Si un cliente exige hosting de solo archivos, es otro proyecto (p. ej. un generador estático) y se decide en `/web-brief`, no un interruptor de esta plantilla.

## Qué NO está verificado aquí

El perfil `standalone` **se compiló y se ejecutó con `node server.js`** (comprobados `/api/health`, datos estructurados, `robots.txt` y `theme.css`), pero el `Dockerfile` **no se construyó ni se ejecutó con Docker** (el entorno de verificación no tiene Docker). Haz `docker build` y `docker run` antes de depender de él. Las plataformas distintas de Vercel y Docker tampoco se probaron.
