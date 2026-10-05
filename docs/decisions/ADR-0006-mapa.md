# ADR-0006 · Mapa de la zona: real, liviano y bajo demanda

- **Estado:** propuesta · **Fecha:** 2026-10-05 · **Decide:** responsable del proyecto
- **Contexto:** hay que mostrar dónde queda el hotel y los atractivos de Cartagena **sin penalizar la carga**. Un mapa interactivo es de los componentes más pesados de una página.
- **Fuente:** documentación de Protomaps (consultada el 2026-10-05): **PMTiles** es un archivo único de teselas accesible por peticiones HTTP *range*; MapLibre GL JS lo lee directamente, de modo que se aloja en almacenamiento estático sin servidor de teselas. Licencias BSD y ODbL (los datos base son de OpenStreetMap).

## Decisión
1. **Estado inicial ligero:** un **póster estático** (el esquema de la maqueta o una imagen WebP del mapa real) con los mismos puntos y chips. La información ya es utilizable sin el mapa interactivo.
2. **Mapa real bajo demanda:** MapLibre GL JS + PMTiles de la región, **cargados solo cuando la persona interactúa** (o en reposo, tras la carga y fuera del camino crítico). Peso de MapLibre: **se mide al implementar** y debe cuadrar con el presupuesto de JS (`DESIGN.md` §7).
3. **Sin clave de API de terceros ni rastreadores:** el archivo PMTiles se aloja con el sitio. Atribución obligatoria de OpenStreetMap.
4. **Contenido:** coordenadas reales verificadas contra OpenStreetMap; modos de traslado y tiempos **calculados al construir** (no consultados en vivo) y guardados en el contenido. Hoy no hay dirección real, por eso la maqueta muestra solo el modo.
5. **«Cómo llegar»:** enlace a la aplicación de mapas del dispositivo.
6. **Accesibilidad:** los chips y el panel de texto son la alternativa completa al mapa; los pines son botones con `aria-pressed`.

## Alternativas descartadas
| Opción | Por qué no |
|---|---|
| Google Maps embebido | clave de API, rastreo de terceros, coste por uso y peso alto |
| Leaflet con teselas raster de un proveedor | más liviano, pero depende de un proveedor externo y de su política de uso (verificar límites antes de elegirlo) |
| Solo imagen estática | no cumple «el mapa de dónde queda» de forma interactiva |

## Consecuencias
- (+) La portada no paga el costo del mapa; el usuario que lo quiere lo obtiene en un toque.
- (−) Hay que alojar y actualizar un archivo PMTiles de la región.
