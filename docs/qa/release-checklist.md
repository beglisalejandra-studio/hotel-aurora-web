# Checklist final de entrega (marcar con evidencia)

**Conversión y contenido**
- [ ] Objetivo de conversión único y CTA principal visible sin scroll (desktop y móvil)
- [ ] Copy: propuesta clara en 5 s; cada claim con evidencia en `PRODUCT.md`; sin testimonios/cifras inventados
- [ ] Jerarquía: un `h1`; secciones con propósito; prueba social cerca del CTA
- [ ] Responsive: 360, 390, 768, 1024, 1440 px; sin scroll horizontal

**Accesibilidad (WCAG 2.2 AA)**
- [ ] Teclado completo; foco visible; sin trampas; skip link
- [ ] Contraste AA (texto, iconos, estados); objetivos táctiles ≥ 24×24 px (2.5.8)
- [ ] `alt` útil/vacío decorativo; formularios con label y errores asociados
- [ ] `prefers-reduced-motion` respetado (imágenes, videos, animaciones)
- [ ] axe: 0 serias/críticas

**Media**
- [ ] Imágenes optimizadas (AVIF/WebP, tamaños, `sizes`, LCP con prioridad)
- [ ] Videos: poster inmediato, fallback, captions si hay audio, autoplay solo mudo, peso en presupuesto
- [ ] `creative/manifest.json` válido y aprobado por una persona

**Formularios, pagos, integraciones**
- [ ] Validación cliente + servidor; rate limiting y anti-spam; sanitización; sin PII en logs
- [ ] Email/CRM/calendario probados con datos ficticios; fallback si el servicio cae
- [ ] Pagos en modo test: éxito, fallo, cancelación; webhook firmado e idempotente; estados de pago; sin tarjetas en nuestro sistema

**Analítica y privacidad**
- [ ] Eventos versionados; nada dispara antes del consentimiento; sin PII innecesaria; sin conversiones duplicadas
- [ ] Política de privacidad/cookies; subprocesadores documentados (`docs/privacy/data-map.md`)

**SEO y rendimiento**
- [ ] `title`/`description`/canonical/OG; `sitemap.xml`; `robots.txt`; JSON-LD; 404; redirecciones 301 (rediseño)
- [ ] Lighthouse móvil dentro de presupuesto (LCP, CLS, TBT)

**Seguridad**
- [ ] Sin secretos en repo/bundle/logs; `.env.example` al día; secretos en el gestor del proveedor
- [ ] CSP, HSTS, cabeceras; cookies seguras; HTTPS
- [ ] `npm audit` limpio o justificado; Dependabot activo; secret scanning/push protection activos

**Contenido editable / CMS**
- [ ] El cliente edita textos, imágenes, videos, precios, testimonios, FAQs, posts y SEO sin tocar código (si está en alcance)
- [ ] Layout, pagos, seguridad e integraciones sensibles protegidos

**Operación y entrega**
- [ ] Staging revisado y aprobado por escrito; plan de rollback; backups; dominio/DNS/HTTPS verificados
- [ ] Documentación y handover; responsables por integración; `docs/learning/lessons.md` actualizado
- [ ] Producción: aprobación humana registrada
