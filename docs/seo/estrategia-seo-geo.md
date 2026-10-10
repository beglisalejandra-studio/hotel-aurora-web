# Estrategia SEO y GEO de Hotel Aurora (portfolio)

> Decisión 17 de `PRODUCT.md` (2026-10-10). SEO = aparecer en buscadores; GEO = que los asistentes de IA puedan citar el hotel con datos correctos. Todos los hechos usados están en `PRODUCT.md` §5 (ficticios, declarados). Sin cifras, premios ni reseñas inventados.

## 1. Entidad (lo que un buscador o un asistente debe poder extraer)
| Dato | Valor en la web | Dónde aparece |
|---|---|---|
| Nombre y tipo | Hotel Aurora, hotel boutique petfriendly | título, H1, lead, JSON-LD `Hotel`, bloque «de un vistazo» |
| Lugar | El Palmar, Vejer de la Frontera (Cádiz), Costa de la Luz | título, descripción, H1, H2 «Cómo llegar», `address` (marcada ficticia) |
| Tamaño | 28 habitaciones (`numberOfRooms`) | lead, lámina R1, JSON-LD |
| Habitaciones | Alba y Terraza (2), Marea (3), Faro (4, con salón y cocina) | tarjetas, fichas, JSON-LD `containsPlace` (`HotelRoom` con ocupación y camas) |
| Mascotas | hasta dos perros por habitación, cama y cuencos de cortesía (`petsAllowed`) | H2 petfriendly, FAQ, lámina D1/R3 |
| Horarios | entrada desde las 15:00, salida hasta las 12:00 (`checkinTime`, `checkoutTime`) | bloque de datos, FAQ, lámina P3 |
| Servicios | spa abierto también a quien no se aloja, restaurante de cocina de mercado, reserva directa sin comisión | H2, FAQ, JSON-LD `amenityFeature` |

## 2. Mapa de palabras (ES; EN en paralelo con `data-en`)
| Intención | Búsqueda objetivo | Dónde |
|---|---|---|
| Principal | hotel boutique El Palmar · hotel boutique Vejer de la Frontera | `<title>`, meta descripción, H1 «Hotel boutique en El Palmar.» |
| Nicho | hotel petfriendly El Palmar · hotel que admite perros Vejer · hotel con perro Cádiz | lead, H2 «Hotel petfriendly: tu perro también está invitado.», FAQ |
| Alojamiento | habitaciones hotel El Palmar (Alba, Terraza, Marea, Faro) | H2 «Habitaciones de cal, madera y piedra en El Palmar.», `Habitación Alba` (H1 de ficha) |
| Reserva | reservar hotel directo sin comisión | H2 «Reserva directa con el hotel.» |
| Comida | restaurante cocina de mercado El Palmar | H2 «Restaurante de cocina de mercado, del desayuno a la cena.» |
| Bienestar | hotel con spa Costa de la Luz · spa abierto a no huéspedes | H2 «Hotel con spa de agua y silencio en la Costa de la Luz.» |
| Local | cómo llegar a El Palmar · hotel cerca playa El Palmar | H2 «Cómo llegar a El Palmar, Vejer de la Frontera» |
| Preguntas | check-in/out, perros, spa, reserva directa… | H2 «Preguntas frecuentes sobre Hotel Aurora» (9 preguntas) |

## 3. Reglas de redacción
1. Un `h1` por página; H2 con palabras de búsqueda y un tema cada uno.
2. Cada respuesta de las preguntas frecuentes **nombra la entidad** («Hotel Aurora admite…») para que se pueda citar suelta.
3. Datos concretos antes que adjetivos. Sin «mejor», «único», «garantizado», cifras de precio, reseñas ni premios.
4. «Luz» solo en «Costa de la Luz»; sin insistir en el sol.
5. Título ≤ 60 caracteres, descripción ≤ 160, por idioma (`setTitle()` los cambia con el idioma y en las fichas de habitación: «Habitación Alba para 2 personas | Hotel Aurora, El Palmar»).
6. Las láminas animadas de la entrada son `aria-hidden` y repiten datos que ya están en texto indexable.

## 4. Datos estructurados
- `Hotel` con `numberOfRooms`, `petsAllowed`, `checkinTime`, `checkoutTime`, `amenityFeature` y `containsPlace` (`HotelRoom` con `occupancy` y `bed`).
- `FAQPage` **construido desde el mismo array** que pinta las preguntas (se verificó 9 preguntas en el JSON-LD y 9 en pantalla).
- Pendiente de producción: dirección real, teléfono real, `sameAs` con perfiles reales, imágenes definitivas, `priceRange` (solo con tarifas reales de Mews).

## 5. Verificación realizada (2026-10-10)
`zoom/seo-check.mjs` (scratchpad de la sesión): un `h1`, 11 encabezados esperados, JSON-LD `Hotel` + `FAQPage` válidos, 9 preguntas renderizadas. No se ha medido posicionamiento (es una maqueta sin dominio ni indexación).

## 6. Límites
- Es un portfolio con datos ficticios: nada de esto se debe indexar tal cual; en producción hay que quitar `noindex` solo con datos reales (lista de entrega).
- GEO no se puede garantizar: se facilita la extracción (datos, preguntas, entidad); no hay forma de medir citas sin un dominio real.
