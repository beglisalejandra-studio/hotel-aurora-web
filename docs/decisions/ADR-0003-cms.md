# ADR-0003 · CMS: Sanity, con localización por campo y roles de mínimo privilegio

Estado: **propuesto**, con una **decisión de coste pendiente** · Fecha: 2026-10-09

## Contexto
Objetivo: web lo más autogestionable y segura posible, entregada con documentación ordenada para un perfil técnico. En este sitio las tarifas y la disponibilidad **no** están en el CMS (viven en Mews), así que el contenido cambia poco: textos, fotos, habitaciones, paquetes, FAQs, horarios.

## Hechos verificados (página oficial de precios de Sanity, consultada 2026-10-09)
- Plan gratuito: hasta 20 puestos, **2 roles (Administrador y Visor)**, 2 datasets públicos, 10k documentos, 1M peticiones a la CDN al mes, 250k peticiones de API al mes, 100 GB de activos y 100 GB de ancho de banda al mes.
- **No incluye** los roles Editor, Desarrollador ni Colaborador, ni roles personalizados, ni SSO, ni borradores programados.
- La página **no dice** si el plan gratuito permite uso comercial: hay que leer los términos antes de producción.
- Plan Growth: 15 USD por puesto ocupado y mes, 5 roles (dato de resultados de búsqueda sobre la página oficial; confirmar).
- **No verificado:** qué proveedores de acceso admite Studio y si se puede exigir doble verificación (la página de documentación que probé devolvió 404). Mitigación: acceso con cuentas del cliente que ya tengan verificación en dos pasos obligatoria, comprobado antes de entregar.

## Alternativas valoradas
| Opción | Ventajas | Inconvenientes |
|---|---|---|
| **Sanity (alojado)** | Sin servidor ni base de datos que parchear; contenido estructurado y multilingüe; borradores, historial y vista previa; imágenes con recorte y CDN | Rol Editor de pago; datos fuera del repo (copias programadas necesarias); dependencia de un proveedor |
| Módulo `visual-editor` de la plantilla (Puck + contenido JSON en Git) | Sin coste; todo versionado en Git; acceso por enlace mágico; roles por lista de correos | Es un editor a medida (menos probado); publicar implica commits/PR en el repositorio; modela mal contenido estructurado y bilingüe como habitaciones y paquetes |
| Payload (autoalojado) | Control total, roles sin límite | Un servidor y una base de datos que mantener, actualizar y respaldar: contradice "lo más seguro y autogestionable" |
| WordPress headless | Familiar | Mantiene la superficie de ataque de WordPress sin sus ventajas |

## Decisión
Sanity, con **localización por campo** (`{ es, en }` en cada campo traducible) en lugar de documentos duplicados por idioma: para dos idiomas y unas decenas de documentos es más simple y con menos piezas. Validación: no se puede publicar un documento sin ES y EN completos, y `hreflang` solo se emite cuando ambas versiones existen.

## Decisión de coste pendiente (necesito tu respuesta)
- **Portfolio:** plan gratuito. Limitación declarada: los editores serían Administradores, es decir, sin mínimo privilegio.
- **Cliente real:** plan Growth para tener rol Editor (mínimo privilegio), con el coste por puesto que figurará en el plan de soporte.
- Alternativa sin coste recurrente si el cliente lo prefiere: `visual-editor` con almacén Git y modo PR, asumiendo sus límites.

## Copias y recuperación
Exportación programada del dataset (CI) cifrada a un destino del cliente, y **una restauración de prueba documentada** antes de entregar (`docs/runbooks/`).

## Seguridad
Token de lectura solo en servidor; webhook de revalidación con secreto; borradores nunca públicos ni indexables; Studio detrás de login. Revisar ubicación de datos y DPA de Sanity para el registro de tratamientos.
