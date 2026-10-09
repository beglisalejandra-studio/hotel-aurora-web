# Pedido de materiales - Hotel Aurora

Un solo pedido, para que no haya idas y vueltas. Nada de esto bloquea la aprobación de la maqueta: la maqueta usa huecos rotulados (códigos `P01`...). **Sin este material no puedo pasar de la fase 4.**

Proveedor de imagen del proyecto: `manual` (`creative/providers.json`). Yo no he generado ninguna foto. Opciones para producirlas, a tu elección:
- **A.** Las aportas tú (fotografía propia o con derechos). Es la mejor opción para un portfolio que "se sienta real".
- **B.** Las genero como **borradores** con una herramienta que apruebes (Canva o Figma; **Figma consume créditos de pago de tu plan**). Los borradores van a `creative/generated-drafts/` y solo pasan a `public/media/` los que tú apruebes.
- **C.** Banco de imágenes con licencia clara (se registra la licencia en el manifiesto).

## Dónde subirlo
Carpeta `creative/brand/` (marca) y `creative/inbox/` (fotos y vídeo en bruto), subida al repositorio. Registro de procedencia y derechos de uso de cada pieza en `creative/manifest.json`.

## Especificaciones
Fotos: JPG o PNG, **mínimo 2000 px en el lado largo**, ≤ 4 MB por archivo si las subes desde el navegador, sin texto ni logos incrustados, sin personas posando. Vídeo (opcional, solo si la fase 4 lo justifica): MP4, 6 a 8 s en bucle, 1080p, sin audio, ≤ 1,5 MB tras optimizar.

> **Cómo se pide:** una a una, con una ficha por pieza en `creative/requests/` (medidas exactas, prompt ultra realista y carpeta de subida). El orden está en `creative/requests/INDEX.md`. Si una medida de esta tabla difiere de la de la ficha, **manda la ficha**.

## Lista de fotos (por prioridad)
| Código | Dónde se usa | Encuadre | Qué debe verse |
|---|---|---|---|
| **P01** | Héroe de inicio (LCP). **Dos recortes:** horizontal 16:10 y vertical 4:5 | Máster horizontal **2560 x 1600** y vertical 4:5 con la medida exacta de su ficha, con **zona libre en el tercio inferior** (ahí va el texto) | Fachada de una casa encalada restaurada, mirando al este, con el primer sol rozando el muro. Sombras frías de pizarra, borde cálido de luz. Sin personas |
| **P02** | Compartir en redes (OG) | Horizontal 1200 x 630 útil | Variante de P01 con aire a la izquierda |
| **P03** | Recorrido (casa) | Horizontal 3:2 | Patio interior a media mañana |
| **P04 a P06** | Habitación **Alba** (este, sol al amanecer) | 3:2 y detalle | Vista general, luz sobre la pared, baño |
| **P07 a P09** | Habitación **Marea** (vista al mar) | 3:2 y detalle | Vista general, ventana al mar, detalle de ropa de cama |
| **P10 a P12** | Habitación **Terraza** | 3:2 y detalle | Habitación, terraza privada, detalle |
| **P13 a P15** | Suite **Faro** | 3:2 y detalle | Salón, dormitorio, vista |
| **P16 a P18** | Restaurante | 3:2 y detalle | Sala con luz de ventana, un plato en primer plano, desayuno |
| **P19 y P20** | Spa | 3:2 | Sala de tratamientos, zona de agua al amanecer |
| **P21 a P23** | Portadas de paquetes | 4:5 | Escapada de dos noches, cena en la casa, día de spa |
| **P24** | Entorno | 16:9 | Costa por la mañana |

Total: 24 fotos. Para empezar, **P01 (dos recortes), P03, P04, P16 y P19** bastan para afinar el recorrido de la maqueta en la fase 3.

## Vídeo (opcional, lo decide `VIDEO_SCORE` en la fase 4)
| Código | Dónde | Qué debe verse | Especificaciones |
|---|---|---|---|
| **V01** | Ventana del restaurante en el recorrido y en su sección | La luz de la ventana moviéndose sobre la mesa, vapor de un plato | 6 s en bucle, horizontal 3:2, sin audio |
| **V02** | Ventana del spa | Agua en calma y luz sobre la superficie | 6 s en bucle, vertical 4:5, sin audio |
| **V03** | Habitación (ficha de Alba) | La luz recorriendo la pared | 6 s en bucle, horizontal 3:2, sin audio |

Cada clip: MP4 de origen en 1080p. Yo lo optimizo (WebM o AV1 más MP4 H.264 de respaldo, máx. 1,5 MB), saco el póster y registro todo en `creative/manifest.json`. **No hay vídeo en la carga inicial** (ADR-0006).

## Opcional para más impacto (sin coste de carga inicial)
- **Fotos 360 equirrectangulares** de las 4 habitaciones, para un visor "Ver en 360°" que solo se descarga al pulsarlo.
- **Mapas de profundidad** de P01: los genero yo a partir de la foto en la fase 5 si se aprueba el spike de héroe 2,5D (solo escritorio).

## Dirección de arte (para fotografiar o para generar)
Luz natural de mañana, fotografía de arquitectura de tipo documental, aspecto de 35 mm, tonos de pizarra fría y toques de terracota, mucho aire, horizonte limpio. Sin texto, sin logos, sin personas posando, sin filtros HDR.

Bloque base para cualquier prompt (opción B):
> Documentary architecture photograph, restored whitewashed house on the Atlantic coast of southern Spain, first morning light grazing the wall, cool slate shadows with a warm terracotta edge of light, 35mm film look, soft grain, calm, empty of people, no text, no logos, no signage.

Añadir al final de cada prompt el motivo concreto (por ejemplo "arched window, east-facing facade, vertical 4:5").

## Marca
- **Logo:** propongo **solo el nombre en tipografía** (Outfit, sin símbolo), tal como se ve en la maqueta. Si ya tienes un logo, súbelo en SVG a `creative/brand/`.
- **Tipografías:** Outfit y Work Sans (Google Fonts, licencia libre). Nada que aportar.

## Datos del hotel ficticio
Se usan datos de ejemplo claramente falsos: correo en el dominio reservado `.example` y teléfono `+34 000 000 000`. Cuando haya un cliente real, razón social, NIF, domicilio, registro turístico, teléfono, correo, redes y número de WhatsApp van en los ajustes del CMS. `launch:check` avisa si queda alguno de prueba.

## Vídeo tutorial de entrega
Preparo el **guion, el orden de pantallas y las capturas**. La grabación la haces tú (por ejemplo, grabando pantalla con voz). Dime si prefieres otro formato.

## Decisiones que necesito de ti
1. ¿A, B o C para las fotos?
2. ¿Costa de la Luz (Cádiz) como ubicación ficticia?
3. ¿Bonos de experiencia pagados con Stripe en modo test, o solo solicitud?
4. ¿Simulo una migración desde una web antigua (mapa de 301 de ejemplo)?
5. Coste del CMS: plan gratuito para el portfolio (editores como Administradores) o Growth, con rol Editor.
