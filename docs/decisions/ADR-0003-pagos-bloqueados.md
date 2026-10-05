# ADR-0003 · Pagos bloqueados en la versión de portafolio

- **Estado:** propuesta · **Fecha:** 2026-10-05 · **Decide:** responsable del proyecto (beglisalejandra-studio)
- **Contexto:** Hotel Aurora es un proyecto de portafolio con un hotel ficticio. El requisito es que **ninguna transacción pueda proceder**, y a la vez la experiencia de reserva y pago debe poder verse completa. No debe existir ningún camino, ni accidental, por el que se cobre dinero real o se reciban datos de tarjeta.

## Decisión
1. **Interfaz de pagos.** Todo el código de cobro va detrás de una interfaz `PaymentProvider` (`createCheckout`, `getStatus`, `handleWebhook`).
2. **Un solo proveedor en esta versión: `DemoPaymentProvider`.** `createCheckout()` **siempre** lanza `PaymentsDisabledError`. La interfaz muestra el estado bloqueado (aviso fijo, botón Pagar con `aria-disabled`, confirmación marcada «Simulación»).
3. **Sin campos de tarjeta, nunca.** El sitio no tiene `<input>` de número de tarjeta, vencimiento ni CVV, ni siquiera de adorno.
4. **El módulo `payments-stripe` de la plantilla NO se aplica.**
5. **Guardas en capas (defensa en profundidad):**
   - `DEMO_MODE=1` en todos los entornos de portafolio. Al arrancar, `lib/env.ts` **falla** si `DEMO_MODE=1` y existe cualquier variable de pasarela (`STRIPE_*`, `WOMPI_*`, `PAYPAL_*`, etc.) o un valor con prefijo `sk_live` o `pk_live`.
   - Prueba unitaria: en modo demostración no existe ninguna ruta de API que cree un cobro ni un webhook de pago.
   - CSP: `form-action 'self'`, `frame-src 'none'`, `connect-src` sin dominios de pasarelas.
   - CI y repositorio: el escaneo de secretos de GitHub (*secret scanning* con protección de empujes) y una comprobación propia en CI que falla si aparece `sk_live` o `pk_live` en el código.
6. **Notificaciones en el mismo modo:** en demostración, correo y WhatsApp **no se envían**; se muestran como vista previa dentro del sitio (ver `PROJECT.md` §3).

## Si algún día fuera un hotel real (fuera del alcance actual)
- Pasarela con **pago alojado** (redirección o checkout alojado) para que los datos de tarjeta nunca toquen nuestro servidor (alcance PCI mínimo).
- El **webhook firmado** es la fuente de verdad del estado de pago (no la redirección del navegador), con idempotencia y reintentos.
- La pasarela se elige para el mercado colombiano (**decisión pendiente**; no se integra ninguna hoy). Los costes y métodos se verifican en la página oficial vigente.
- Requiere aprobación humana explícita (producción, pagos reales, credenciales).

## Alternativas descartadas
- *Stripe en modo de pruebas:* aunque no mueve dinero, introduce claves, un camino de cobro y una superficie de ataque que el requisito prohíbe. Se descarta para el portafolio.
- *Formulario de pago de adorno:* confunde al usuario y arriesga que alguien escriba una tarjeta real.

## Consecuencias
- (+) Imposible cobrar por accidente; el requisito queda verificable con pruebas.
- (+) La interfaz permite cambiar de proveedor sin tocar la reserva.
- (−) El recorrido termina en una simulación; el portafolio debe explicarlo (ya lo hace).
