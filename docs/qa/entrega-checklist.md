# Lista de entrega

> Antes de pasar el sitio al dominio principal. Cada ítem con evidencia, fecha y responsable. Automático: `npm run launch:check -- https://url`. Detalle: skill `web-workflow` → `reference/checklist-entrega.md`.

| ✓ | Ítem | Cómo | Evidencia · fecha · responsable |
|---|---|---|---|
| ☐ | Quitar noindex | `launch:check` | |
| ☐ | Alta en Google Search Console + sitemap | Manual | |
| ☐ | Alta en Bing Webmaster Tools + sitemap | Manual | |
| ☐ | Una sola versión del dominio (301) | `launch:check` | |
| ☐ | URLs canónicas | `launch:check` | |
| ☐ | URLs limpias | `launch:check` | |
| ☐ | Redirecciones 301 (`docs/seo/redirects.txt`) | `launch:check --redirects` | |
| ☐ | Jerarquía de enlaces internos | Manual | |
| ☐ | Una página por intención de búsqueda | Manual | |
| ☐ | Contenido de prueba borrado | `launch:check` + repaso | |
| ☐ | Teléfono y correo tocables | `launch:check` | |
| ☐ | Íconos de redes a cuentas reales | `launch:check` + cliente | |
| ☐ | Vista previa al compartir | `launch:check` | |
| ☐ | Caché configurada | `launch:check` | |
| ☐ | SSL con renovación automática | `launch:check` + proveedor | |
| ☐ | Copias de seguridad automáticas + restauración de prueba | Manual | |
| ☐ | Aviso si la web se cae | Manual | |
| ☐ | Varios navegadores y móviles | `npm run e2e:cross` + teléfono real | |
| ☐ | Scores Lighthouse (Perf ≥90, A11y ≥95, MP ≥95, SEO ≥95) | `npm run lighthouse` | |
| ☐ | Página de gracias | `launch:check` | |
| ☐ | Canal de comentarios | Manual | |
| ☐ | Medición de conversiones verificada | Manual | |
