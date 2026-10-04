# Hotel Aurora · Propuesta inicial (descubrimiento)

Fecha: 2026-10-04 · Estado: **propuesta, pendiente de aprobación de la persona** · Repo: `beglisalejandra-studio/hotel-aurora-web`

Resumen de una investigación con 9 temas, cada uno re-verificado por un revisor independiente, más una revisión cruzada final.
Donde un revisor corrigió un dato, aquí aparece el dato corregido. Lo que cambia con frecuencia (precios, tarifas, normas) lleva fecha y debe re-verificarse antes de usarse.

## 1. Alcance y decisiones ya tomadas por la persona

- **Hotel Aurora no existe.** Es una pieza de portafolio de `beglisalejandra-studio`. Habitaciones, planes, precios y textos son ficticios y los crea Claude.
- **Aviso en todas las páginas, en los pasos de reserva y pago, en los correos y en el nombre del manifest de la app:**
  `Proyecto de portafolio · beglisalejandra-studio · No se aceptan reservas reales`
- **Pagos solo en modo prueba (sandbox).** Una nota pequeña en el paso de pago indica la tarjeta de prueba.
- **WhatsApp = enlace `wa.me`** al número `+1 681 544 5229` (formato `16815445229`), con mensaje prellenado ES/EN de interés en un sitio web como Hotel Aurora. No se usa la API de WhatsApp. El visitante inicia el chat; no se guarda su número.
  - Etiqueta del botón: "Escribir al autor por WhatsApp" (no "Reservar por WhatsApp").
  - Texto sin emojis y de 140 caracteres o menos (los emojis llegan corrompidos por `wa.me`), con respaldo visible: número y botón "Copiar mensaje".
  - El estado de la reserva se entrega por correo y en la página "Mi reserva".
- **Imágenes:** las genera la persona con IA a partir de prompts de Claude y las sube a `creative/brand/` (ver `creative/brand/README.md`). Se rotulan como ilustrativas y se registran en `creative/manifest.json`.
- **Ubicación ficticia:** barrio de Getsemaní, sin dirección ni coordenadas reales.

## 2. Referencias y dirección visual

### Qué hacen bien y mal los hoteles de la zona (medido el 2026-10-04)
- Los mejores de Cartagena venden patrimonio y fotografía, pero varios fallan en peso: videos de portada de 8 a 35 MB (Casa Carolina 35,1 MB; Casa San Agustín 20,9 MB; Bastión 7,7 MB) y la reserva delegada a dominios de terceros (SynXis, Mirai, TravelClick, ReservHotel).
- Los más ligeros y premium son Hotel B (66 KB de HTML), Les Roches Rouges (48 KB) y Casa Palopó (video con `preload="none"` de 0,85 MB). **Aurora puede ganar con portada ligera y reserva dentro de su propio dominio y de la app.**
- Limitación: no hay capturas de pantalla (el navegador automatizado falló por el certificado del proxy). Los juicios de color y sensación salen del texto y el código. Repetir con capturas antes de fijar `DESIGN.md`, usando el bundle de CA ya provisto, sin desactivar TLS.
- Dato a actualizar: la selección Michelin Keys 2026 (sep. 2026) cambió el panorama; Casa San Agustín habría subido a 2 Keys y entraron Four Seasons y Cinco Quintas. Verificar.

| Referencia | Qué aprender | Qué evitar |
|---|---|---|
| Casa Pestagua (casapestagua.com) | Narrativa de patrimonio, barra de reserva mínima, Cormorant + IBM Plex Sans, ES/EN | Reserva en dominio externo; WordPress con 51 scripts |
| Casa San Agustín (hotelcasasanagustin.com) | Concepto claro, navegación de 6 ítems | Dos videos 1080p de ~21 MB; sin AVIF/WebP |
| Bastión (bastionluxuryhotel.com) | Sección guía de la ciudad; display + serif | Menú de 12 ítems; video de portada de 7,7 MB; solo español |
| Casa Carolina (casacarolinahotel.com) | Mejor ficha de habitación (m², capacidad, rasgos, CTA propio); JSON-LD | Video de portada de 35 MB |
| Casa Palopó (casapalopo.com) | Video responsable (poster, `preload=none`, 540p); 8 scripts | Densidad de menús |
| Hotel B (hotelb.pe) | Estructura clara, muy ligero, ES/EN/PT | Reservas de extras solo por WhatsApp |
| Les Roches Rouges (lesrochesrouges.com) | Ligereza extrema, AVIF/WebP con `picture` | Sin barra de reserva con fechas |
| El Fenn (el-fenn.com) | Color con carácter; precio "desde" en cada habitación | 86 scripts; cookies intrusivas |

Referencias de UX de reserva: Baymard (precio por noche dentro del calendario, invitado por defecto, sin cargos de último minuto), NN/g (date input), W3C APG (datepicker accesible), WCAG 2.2 AA (objetivos táctiles, foco no tapado, ayuda consistente).

### Dirección propuesta: "casa de patio al amanecer" (con acentos Caribe)
- **Idea:** la luz del amanecer sobre piedra coralina, madera y vegetación; el nombre Aurora lo sostiene sin inventar historia.
- **Paleta (a validar con contraste AA):** marfil `#F5EFE4`, arena `#E4D5BC`, terracota `#B5543A`, verde-azul Caribe `#1F5C63` (marca y CTA), carbón cálido `#2A2622`; un solo acento de bugambilia o amarillo colonial, con mucha moderación.
- **Tipografía:** serif editorial (Cormorant Garamond o Fraunces) + sans humanista (Inter, Manrope o DM Sans); autoalojadas en WOFF2, máximo dos familias.
- **Hero:** foto fija. Video opcional solo en escritorio (6 a 8 s, 1,5 MB o menos, con poster; apagado en móvil, con ahorro de datos y con `prefers-reduced-motion`). Sin carruseles automáticos.
- **Estructura de la home:** hero, barra de reserva persistente, habitaciones como fichas (m², capacidad, vista, precio "desde"), galería editorial, "Cartagena a tu alrededor" (mapa + atractivos), experiencias, FAQ, pie. Navegación de 5 ítems + "Reservar" siempre visible; en móvil, barra inferior con Reservar y WhatsApp.
- **Sin insignias, reseñas, premios, RNT ni garantías de precio:** serían evidencia fabricada.
- **Autoridad visual única:** Taste Skill (ya instalada en el entorno). Se registra en `PROJECT.md`.

## 3. Arquitectura propuesta

Principio de desempate: **seguridad > velocidad > UX**, salvo donde el costo en UX se podía evitar sin perder seguridad.

- **Aplicación:** Next.js 16.3.8 o posterior (o 15.5.27), App Router, TypeScript estricto. Verificar avisos de seguridad de nextjs.org/blog antes de fijar la versión (hubo parches críticos en ago y sep 2026). `pnpm` con retraso mínimo de versiones y scripts de instalación desactivados; acciones de GitHub fijadas por SHA.
- **Hosting:** Vercel Hobby, región `iad1`, **sujeto a confirmar por escrito con Vercel** que un portafolio con pago sandbox es "uso personal" (sus términos mencionan procesar pagos). Plan B: Cloudflare Workers de pago o Netlify.
- **Dominio:** propio, con Cloudflare Registrar y DNS en modo "solo DNS" (nube gris) con DNSSEC. Sin dominio no hay login con correo real (ver riesgos).
- **Datos:** Supabase Postgres en `us-east-1` (junto a `iad1`; São Paulo descartada por latencia). Esquema con tipos de habitación, unidades, reglas de tarifa por noche y temporada, estadía con restricción `EXCLUDE` sobre rango de fechas semiabierto (evita doble reserva), pagos con estado separado, bandeja única de webhooks, claves de idempotencia, bandeja de salida de notificaciones, eventos de reserva y auditoría append-only. Fechas `DATE` en America/Bogota. Acceso solo desde servidor (funciones SQL o cliente `pg`), Data API deshabilitada o con esquema mínimo, RLS con denegación total como respaldo, pruebas pgTAP en CI.
- **Identidad:** Supabase Auth con **OTP numérico por correo escrito dentro de la app** (no enlace mágico, que en iOS abre Safari y no la app instalada); sesión de correo verificado: el huésped escribe su correo, recibe el código y puede pagar, y la cuenta se "guarda" al final. SMTP propio (Resend en subdominio verificado con SPF, DKIM, DMARC). Turnstile validado en servidor, límites por IP, cuenta y presupuesto global. Proveedores sociales desactivados. Passkeys opcionales y diferidas. Cookies host-only (`__Host-`).
- **Calendario e inventario:** el Postgres propio es el maestro (sin PMS: un hotel inexistente no contrata uno), detrás de una interfaz `InventoryProvider` sustituible. Disponibilidad y precio por noche con una función SQL para dos meses, caché corta en servidor, **nunca en CDN ni en el service worker**. Calendario de rango con React Aria, campos escribibles, celdas de 44 px, explicación de días no disponibles, probado con lectores de pantalla. Retención (hold) de 10 a 15 min con expiración perezosa más barrido periódico.
- **Pagos:** interfaz `PaymentProvider` con **Wompi sandbox** (solo COP). Monto, referencia y firma calculados en servidor. Web Checkout con `return_url` dentro del scope de la app y consulta de estado; **nunca se da por pagado desde el cliente, solo por webhook firmado** (checksum comparado en tiempo constante, deduplicación, verificación de referencia, monto y moneda, respuesta rápida y proceso asíncrono, conciliación de pagos PENDING). Widget modal de Wompi como respaldo si el retorno falla en iOS. Stripe no opera con cuenta colombiana (confirmado por dos verificaciones); su modo prueba solo sería segundo adaptador opcional según el país de la persona titular.
- **Notificaciones:** correos ES/EN con prefijo `[DEMO]` y pie de portafolio; bandeja de salida con clave única más `Idempotency-Key` de Resend; ningún dato sensible en mensajes; "Mi reserva" como fuente de verdad. Acceso a "Mi reserva" solo con enlace de un solo uso u OTP (el código de reserva no es factor de acceso).
- **PWA:** `app/manifest.ts` (nombre corto con "demo"), iconos 192, 512 y maskable, Serwist (variante `@serwist/turbopack` o `--webpack`, versión exacta). Precache solo de estáticos versionados; `NetworkOnly` para navegaciones, API, auth, pago y disponibilidad; página offline estática; aviso de actualización sin `skipWaiting` automático; instrucciones de instalación para iOS. Confirmación offline opcional, con consentimiento, en IndexedDB.
- **Seguridad de cabeceras:** CSP partida por rutas: pública sin nonce (CSP estática); reserva, cuenta y admin con nonce y sin PPR (con nonces las páginas son dinámicas). `worker-src 'self' blob:` para el mapa, `connect-src` al host del mapa y a `sandbox.wompi.co`, Turnstile en `challenges.cloudflare.com`.
- **Imágenes:** variantes AVIF/WebP generadas **en build** con `sharp` y servidas como estáticos; sin `/_next/image` en runtime, sin `remotePatterns`, sin `ImageResponse` con entrada de usuario.
- **Mapa:** MapLibre GL JS 6.x con PMTiles de Protomaps autoalojado (Cloudflare R2 con dominio propio), cargado bajo demanda tras una fachada estática con lista accesible por categoría; enlaces profundos a Google Maps, Waze y Apple Maps (sin clave); atribución visible "Protomaps © OpenStreetMap". No usar los mosaicos públicos de OSM ni claves de Google o Mapbox en el cliente. Presupuesto aproximado: 151 KB gzip + 10 KB de CSS (exige WebGL2); lista accesible si falta WebGL2.
- **Indexación:** `noindex` por meta y cabecera `X-Robots-Tag`, sin `Disallow` en robots.txt ni sitemap; una página aparte de "caso de estudio" sí indexable.

## 4. Fases con puertas (se recorta alcance, no calidad)

Cada fase termina con informe de estado, QA (axe, Lighthouse, e2e, auditoría de dependencias) y PR; no se avanza con hallazgos altos abiertos. Los materiales (logos y fotos) se piden desde la fase 1 para no frenar la fase 5.

1. **Base:** dominio y cuentas (aprobados por la persona), esqueleto del proyecto, CI, base de datos con RLS y pgTAP, auth OTP.
2. **Inventario y calendario,** con pruebas de concurrencia (doble reserva, reintentos 40001).
3. **Pago sandbox** con webhooks e idempotencia (duplicados, fuera de orden, pago aprobado tras vencer el hold).
4. **Correo y "Mi reserva".**
5. **Sitio visual y mapa** (home, habitaciones, Cartagena).
6. **PWA instalable,** probada en iPhone, Android y escritorio reales.
7. **Extras opcionales:** panel demo con TOTP, passkeys, confirmación offline.

Pendientes de definir en el brief: backoffice mínimo o decisión explícita de no tenerlo, política de privacidad y borrado del demo (retención ~30 días), estrategia de pruebas de lo difícil, observabilidad y modo degradado, tope de retenciones por sesión y acceso de demostración alternativo, i18n (`/es`, `/en`), README, ADRs y modelo de amenazas publicados como parte del portafolio.

## 5. Decisiones que solo la persona puede tomar

1. **Dominio:** ¿ya existe uno (subdominio gratis) o se compra uno barato (precio a confirmar en el panel; el de `.co` ronda 26 USD/año según un tercero)? Recomendado antes de construir auth y PWA. Alternativa degradada: modo demo con cuenta sembrada y bandeja de correo simulada (sin login real para visitantes).
2. **Cuentas de terceros** (Supabase, Wompi sandbox, Resend, Cloudflare, Upstash, Vercel): las crea la persona o las aprueba explícitamente; nunca claves en el chat ni en el repo.
3. **Plan de Supabase:** Free durante el desarrollo (se pausa tras 7 días sin actividad, sin backups) y Pro (25 USD/mes) solo cuando el portafolio se muestre. Sin PITR.
4. **Consulta a Vercel** sobre uso personal (ver arquitectura).
5. **Wompi sandbox:** comprobar que la persona puede crear la cuenta y obtener llaves de prueba (puede requerir documento de identidad o RUT). Si no, plan alternativo de pasarela de prueba.
6. **Número de WhatsApp público** y nombre de perfil visible en `wa.me` ("Beglisalejandra-studio").
7. **Búsqueda de marca** de "Hotel Aurora" (SIC y OTAs). Una búsqueda preliminar no halló un hotel con ese nombre en Cartagena (solo "Aura Hotel Barú"), pero la herramienta es limitada.
8. **Dispositivos reales** para probar la PWA (iPhone, Android, escritorio) y lectores de pantalla; el agente no puede sustituir esa verificación.
9. **Aprobación escrita** de todo lo que toca producción, DNS, credenciales o fusión de PRs.

## 6. Riesgos principales y mitigaciones

- **Dependencia del dominio:** sin dominio, Resend solo entrega al dueño de la cuenta y el SMTP integrado de Supabase solo envía a miembros del equipo (2 por hora); no hay SPF/DKIM/DMARC en `vercel.app`; cambiar de dominio obliga a reinstalar la PWA.
- **Disponibilidad del demo en planes gratuitos:** Supabase Free se pausa; Resend Free limita a 100 correos/día; Vercel Hobby puede bloquear 30 días al superar límites. Mitigar con mantenimiento anti-pausa, tope diario de correo, acceso de demostración alternativo y página de modo degradado.
- **Parches críticos de Next.js y React** (avisos en dic 2025, may, jul, ago y sep 2026): fijar versión corregida, Dependabot/Renovate con SLA interno de 72 horas, no usar `ImageResponse` ni `/_next/image` en runtime.
- **Integridad de reserva y pago:** doble reserva, pago aprobado sin habitación (PSE y Nequi asíncronos, webhooks hasta 24 h después), duplicados, monto manipulado. Mitigar con `EXCLUDE`, holds con TTL alineado con la expiración de Wompi, idempotencia en cuatro capas, reembolso automático ante aprobación tardía y pruebas de concurrencia en CI.
- **Exposición de datos:** RLS ausente, vistas sin `security_invoker`, funciones `SECURITY DEFINER` sin `search_path` vacío, o un visitante que teclee datos reales. **No se pide ningún documento de identidad;** solo correo y nombre; avisos visibles, retención y purga, logs sin datos personales, `service_role` nunca en el cliente.
- **PWA, CSP y redirección de pago:** nonce obsoleto en HTML cacheado; el retorno del checkout alojado puede abrirse fuera de la app en iOS (sin fuente primaria; probar en dispositivo real).
- **Plataforma y reputación:** un sitio con login y pago en dominio nuevo con nombre de hotel puede ser marcado como phishing. Mitigar con el aviso en cada página, `noindex`, pagos solo sandbox y plan B de hosting probado.
- **Alcance excesivo para una persona:** entregar por fases con puertas verificables.

## 7. Lista "si fuera real" (no se implementa; no es asesoría legal; validar con abogado y contador)

Obligaciones de un hotel real en Colombia que el portafolio **no** cumple ni debe aparentar cumplir:
- **RNT** (Registro Nacional de Turismo): obligatorio antes de prestar servicios y su número debe ir en la publicidad.
- **Protección de datos (Ley 1581 de 2012):** política de tratamiento, autorización previa y registro de bases de datos (RNBD, según umbrales). Proveedores como Resend, Supabase, Vercel y Upstash son encargados: aplica la transmisión internacional con contrato (Decreto 1074), no la autorización del art. 26. Estados Unidos figura entre los países adecuados de la SIC; Brasil no.
- **Estatuto del Consumidor (Ley 1480 de 2011):** precio con impuestos incluidos (art. 26); retracto de 5 días (art. 47) depende de que el servicio no empiece antes de 5 días, sin resolver para hoteles; la Ley 2439 de 2024 fija el reembolso en comercio electrónico en 15 días calendario como máximo; reversión del pago (art. 51).
- **Moneda:** la SIC no ha autorizado al turismo a informar precios en moneda distinta del peso.
- **Reporte de huéspedes:** TRA (Mincit; campos vigentes según Res. 700/2021 modificada por la 409/2022, que no incluyen fecha de nacimiento, género, nacionalidad ni visa) y SIRE de Migración Colombia para extranjeros.
- **Facturación electrónica DIAN:** en pago anticipado se factura al cobrar (Concepto DIAN 106/2022).
- **IVA a no residentes:** el Concepto DIAN 11050 de 2026 mantiene la exención para servicios turísticos y hoteleros, con prestador inscrito en el RNT y prueba de no residencia; si cubre habitación sola debe confirmarlo un contador.
- **Ley 2300 de 2023, art. 5:** alcanza mensajes comerciales de un hotel por correo o WhatsApp (horarios y baja), no los transaccionales.
- **Aviso contra la explotación sexual de niños, niñas y adolescentes** (Ley 679 de 2001 y normas relacionadas): verificar si debe aparecer en el sitio.
- **PCI DSS v4.0.1:** diseñar como SAQ A; los requisitos futuros pasaron a obligatorios el 31-mar-2025.
- Cookies y consentimiento; GDPR para huéspedes de la UE; accesibilidad (WCAG 2.2 AA como objetivo técnico).

## 8. Contenido de destino (con cautelas)

- **Ubicación ficticia: Getsemaní** (recomendada). Alternativas: Centro Histórico amurallado, Bocagrande. Distancias aproximadas, sin tráfico, desde plazas públicas y no desde un edificio: Castillo San Felipe ~15 min a pie, Muelle La Bodeguita ~10 min a pie, centro amurallado ~10 min a pie. Rotular "aproximado".
- Atractivos a destacar: Ciudad Amurallada y centro histórico (UNESCO 1984), Getsemaní, Castillo San Felipe de Barajas, Convento de la Popa, Islas del Rosario y Playa Blanca, Volcán del Totumo, San Basilio de Palenque (patrimonio inmaterial UNESCO 2008), museos, gastronomía.
- **Cautelas:**
  - Los datos de tarifas y horarios cambian y las fuentes se contradicen (p. ej. entrada al Castillo): **no publicar cifras de entrada**; cada dato cambiante lleva campo `verified_at` y enlace oficial.
  - Desde 2026-03-01 el seguro de accidentes es obligatorio para entrar al PNN Corales del Rosario y San Bernardo (Res. 273 de 2024, demandada ante el Consejo de Estado): rotular "verifica antes de viajar".
  - El portal turístico oficial de Cartagena estaba en reconstrucción el 2026-10-04.
  - No usar el emblema de la UNESCO sin revisar sus condiciones.
- Calendario editorial: temporada alta dic-ene; Fiestas de la Independencia (2 oct al 16 nov de 2026); Cartagena Festival de Música (primera quincena de enero); Hay Festival (fechas 2027 por confirmar); Semana Santa (Pascua 2027: 28 de marzo, calculada); FICCI (abril). Temporada baja: abril, mayo, septiembre y octubre; octubre es el mes más lluvioso.
- SEO: un hotel ficticio no puede tener ficha de Google Business Profile. El JSON-LD `Hotel` se mantiene solo como demostración técnica; Google no ofrece un resultado enriquecido específico para hoteles y el de FAQ dejó de mostrarse en 2026.

## 9. Brechas conocidas

- Sin capturas de pantalla de las referencias.
- Wompi: no verificado que la persona pueda abrir cuenta sandbox ni cómo simula los pagos asíncronos de PSE y Nequi.
- `pg_cron` en Supabase Free no verificado (los cron de Vercel Hobby corren una vez al día).
- Webhooks de pasarela contra previews protegidas de Vercel: usar alias de staging público o túnel.
- Mapa sin conexión: tamaño real del recorte PMTiles sin medir; no prometerlo hasta medirlo.
- Estrategia de derechos de las imágenes y licencias de fotos de atractivos reales.
