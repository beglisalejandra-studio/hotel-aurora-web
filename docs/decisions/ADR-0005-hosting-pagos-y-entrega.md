# ADR-0005 · Hosting, pagos, seguridad operativa y entrega

Estado: **propuesto** · Fecha: 2026-10-09

## Hosting
- **Vercel**, en equipo/cuenta **del cliente**; despliegue por preview para staging (noindex) y producción solo con aprobación humana.
- **Hecho verificado (documentación de Vercel, búsqueda 2026-10-09):** el plan Hobby se limita a uso personal no comercial; promocionar un servicio o cobrar por crear la web cuenta como comercial. Para un hotel real hace falta plan Pro. Para el portfolio, Hobby es razonable mientras no haya ingresos asociados: lo decides tú.
- **Región:** funciones en una región de la UE (p. ej. París `cdg1`; en Hobby solo hay una región, en Pro hasta 5). Confirmar región disponible al configurar.
- **Alternativa:** Cloudflare, con adaptador de Next.js; sin verificar compatibilidad completa, por eso no es la base.

## Pagos
- **Alojamiento y paquetes con noche:** pago dentro del widget de Mews (la tarjeta nunca toca nuestro servidor).
- **Experiencias sin alojamiento (bonos):** Stripe Checkout **alojado**, importes desde Price IDs en servidor, webhook con firma, idempotencia por `event.id`. Cuenta de Stripe del cliente. Modo test hasta aprobación expresa. SCA/3DS lo gestiona Stripe.
- Fiscalidad (IVA aplicable, facturas): **a definir con la gestoría del hotel**; no se asume.

## Seguridad operativa
- Doble verificación obligatoria en GitHub, Vercel, Sanity (vía cuentas con 2FA), Stripe, registrador de dominio y Mews.
- **Roles con el mínimo de permisos** en cada servicio; cuentas nominales, nada compartido.
- **Gestor de contraseñas del cliente** para compartir credenciales; nunca por chat. Si una clave aparece en un chat: se rota.
- Dependabot, `npm audit` sin altos/críticos sin justificar, actualizaciones documentadas.
- Cabeceras de seguridad y CSP estática; formularios con validación en servidor, honeypot, límite de tasa y comprobación de `Origin`.
- El cliente es **dueño de sus cuentas** (hosting, dominio, Stripe, Sanity, GitHub): se crean a su nombre desde el principio o se transfieren al entregar, con checklist de traspaso.

## Copias, monitor y staging
- Código: GitHub (historial completo). Contenido: exportación programada de Sanity. Mews y Stripe conservan sus propios datos.
- **Una restauración de prueba** documentada antes de entregar.
- Monitor externo con aviso de caída al correo del cliente, probado una vez (proveedor y plan gratuito a verificar al elegirlo).
- Trabajo siempre primero en staging; cierre con tutoriales y plan de mantenimiento.

## Entrega
Documentos `docs/entregables/01` a `05`, guía de gestión para no técnicos, repositorio con historial (PRs), lista de entrega de 22 puntos con `launch:check`, guion y capturas para el vídeo tutorial (la grabación la hace una persona), y plan de soporte con el **precio al final** como propuesta que valida la persona.
