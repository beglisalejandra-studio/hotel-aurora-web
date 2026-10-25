# ADR-0007 · Panel de administración: Sanity Studio en /admin con secciones, tema y textos legales editables

- **Estado:** aceptada (2026-10-25). Amplía ADR-0003 (CMS) con el pedido de la persona: «absolutamente todas las secciones editables para el cliente final», incluidos habitaciones nuevas, un blog, colores y tipografías.
- **Proyecto de Sanity:** `7keq933j`, conjunto de datos `production` (ID público). Cuenta a nombre de la persona.

## Decisión
1. **Studio dentro de la web, en `/admin`** (`app/admin/[[...tool]]`, `sanity.config.ts` con `"use client"`). Una sola dirección para el cliente. Acceso con la cuenta de Sanity (activar verificación en dos pasos). `/admin` lleva CSP propia (`lib/security/admin-csp.ts`), `noindex`, `X-Frame-Options: SAMEORIGIN` y está fuera de `robots.txt`. El resto del sitio conserva su CSP estricta.
2. **Páginas por bloques:** cada página es una lista de secciones (portada, habitaciones, foto y texto, reserva directa, paquetes, de un vistazo, preguntas, mapa, cierre, texto libre, galería, blog) que se añaden, ocultan y reordenan. El diseño lo pone la web: el panel no permite romper espaciados, tipografía ni la versión móvil.
3. **Habitaciones, paquetes, preguntas, blog y páginas legales** son documentos propios; una habitación nueva genera su página, su tarjeta y su botón «Reservar».
4. **Colores y tipografías editables con límites:** paletas Día y Madrugada con selector de color y **validación de contraste WCAG** (`sanity/lib/contrast.ts`, con pruebas); tipografías de una lista cerrada **alojadas en la web** (ninguna conexión a terceros).
5. **Fotos siempre con texto alternativo** y versión móvil opcional (regla del proyecto); una prueba impide añadir fotos sueltas sin «Qué se ve en la foto».
6. **Calendario, precios, reservas, cobros y correos a huéspedes: en Mews** (ADR-0002), enlazado desde el panel. La web solo guarda el ID del tipo de habitación de Mews y un precio «desde» orientativo.
7. Interfaz del panel en español (`@sanity/locale-es-es`).

## Pendiente
- CORS de Sanity: añadir la dirección de la vista previa de Vercel y la definitiva (con credenciales) en sanity.io/manage → API → CORS origins. Sin eso el panel muestra «Connect this Studio to your project».
- Vista previa en vivo (Presentation tool) y revalidación por webhook en la fase 5.3, con la web ya leyendo del panel.
- Plan: gratuito para el portfolio (roles Administrador y Visor). Un hotel real con varias personas editando necesita el plan de pago para el rol Editor (ADR-0003).
