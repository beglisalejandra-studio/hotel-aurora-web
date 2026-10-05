# ADR-0005 · App instalable (PWA) con reserva desde la app

- **Estado:** propuesta · **Fecha:** 2026-10-05 · **Decide:** responsable del proyecto
- **Contexto:** el sitio debe poder instalarse en celular y computador y permitir reservar desde la app, sin sacrificar velocidad ni seguridad.
- **Fuente:** guía oficial de PWA de Next.js 16.3.8 (consultada el 2026-10-05): manifiesto con `app/manifest.ts`, HTTPS, instalación en pantalla de inicio; notificaciones push compatibles con iOS 16.4+ **solo para apps instaladas**; recomienda **no depender de `beforeinstallprompt`** (no existe en Safari iOS); para caché sin conexión por service worker menciona Serwist como una opción.

## Decisión
1. **Manifiesto** con `app/manifest.ts`: nombre «Hotel Aurora», `display: standalone`, `start_url: /?source=pwa`, íconos 192, 512 y 512 *maskable*, colores del tema claro, e idioma `es-CO`. **Atajos:** «Reservar» (`/reservar`) y «Mis reservas» (`/cuenta/reservas`).
2. **Service worker mínimo y propio** (o Serwist si el alcance crece), servido desde `/sw.js` con `Cache-Control: no-cache` y CSP propia, como indica la guía oficial.
   - **Precaché:** página `/offline`, íconos y fuentes.
   - **Estrategia:** *stale-while-revalidate* para `/_next/static` y `/media`; *network-first* para páginas públicas.
   - **Nunca se cachean** respuestas autenticadas ni de la reserva: `/api/*`, `/cuenta/*`, `/reservar`. **No se guarda ningún dato personal en la caché.**
   - **Actualización:** aviso «Hay una versión nueva» con botón Recargar (sin recargar a la fuerza durante una reserva).
3. **Instalación:** botón «Instalar la app» que usa `beforeinstallprompt` cuando existe y, si no, muestra instrucciones (Android, iPhone, computador), como en la maqueta. Se oculta si ya corre en `display-mode: standalone`.
4. **Reservar desde la app:** misma ruta `/reservar`. **No se permite reservar sin conexión**: la disponibilidad debe estar en vivo para evitar dobles reservas. Sin conexión se muestra `/offline` con el contacto del hotel.
5. **Push:** opcional y posterior. En portafolio **no se envían notificaciones reales**.

## Verificación
Instalabilidad en Android (Chrome), iPhone (Safari), Windows y macOS (Chrome/Edge) con prueba manual y el panel *Application* de DevTools; prueba de que ninguna ruta autenticada queda en caché (`caches.keys()` revisado en e2e).

## Consecuencias
- (+) Instalable, rápida de abrir y segura: cero datos personales en caché.
- (−) Sin reservas sin conexión, a propósito. En iOS las notificaciones solo existen con la app instalada.
