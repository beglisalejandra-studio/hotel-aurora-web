# Prompt maestro de zonas del hotel: 8 imágenes en un solo prompt

> Para ChatGPT. Las cuatro fotos que faltan en la maqueta: **restaurante (P16)**, **sala de tratamientos del spa (P19)**, **portada del paquete «Escapada de dos noches» (P21)** y **perro en la terraza de la habitación (P25)**, cada una en versión escritorio y móvil, **8 imágenes separadas**.
> Adjunta en este orden: **1) `creative/approved/p01-hero-escritorio.jpg`** (fija el aspecto y el color de las sombras), **2) `creative/approved/p04-alba-escritorio.jpg`** (materiales de la casa y la habitación Alba de P21) y **3) `creative/approved/p11-terraza-exterior-escritorio.png`** (la terraza de P25).
> El prompt se pega en el chat; este archivo es solo el registro.

## Archivos que debe devolver (renómbralos así al subirlos)
| # | Archivo | Proporción | Objetivo | Mínimo |
|---|---|---|---|---|
| 1 | `p16-restaurante-escritorio` | 16:9 | 2560 × 1440 | 1500 × 844 |
| 2 | `p16-restaurante-movil` | 4:5 | 2048 × 2560 | 1120 × 1400 |
| 3 | `p19-spa-tratamientos-escritorio` | 4:5 | 2048 × 2560 | 1200 × 1500 |
| 4 | `p19-spa-tratamientos-movil` | 4:5 | 2048 × 2560 | 1120 × 1400 |
| 5 | `p21-escapada-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 6 | `p21-escapada-movil` | 4:5 | 2048 × 2560 | 1120 × 1400 |
| 7 | `p25-perro-terraza-escritorio` | 3:2 | 2560 × 1706 | 1500 × 1000 |
| 8 | `p25-perro-terraza-movil` | 3:2 | 2560 × 1706 | 1200 × 800 |

## Huecos medidos en la maqueta (2026-10-16) y zonas seguras
| Pieza | Móvil 390 | Tableta 768 | Escritorio 1440 | Lo que tapa el texto | Zona segura pedida |
|---|---|---|---|---|---|
| P16 / V01 restaurante | 390 × 488 (4:5) | 768 × 420 (1,83) | 1440 × 720 (2:1) | Móvil: el 15 % de abajo. Tableta: x 4–72 %, y 39–100 %. Escritorio: x 1–45 %, y 47–100 % | Escritorio 16:9 (en 2:1 se pierde un 5,6 % arriba y abajo): la mesa al sol en la mitad derecha; abajo a la izquierda, zona tranquila. Móvil 4:5: lo importante entre el 8 y el 80 % de la altura |
| P19 spa | 358 × 421 (0,85) | 420 × 494 (0,85) | 524 × 615 (0,85) | Nada | 4:5 (se pierde un 3 % arriba y abajo) |
| P21 escapada | 358 × 420 (0,85) | 707 × 420 (1,68) | 719 × 560 (1,28) | Móvil: y 47–96 %, todo el ancho. Tableta: x 2–62 %, y 47–96 %. Escritorio: x 2–64 %, y 59–97 % | Escritorio 3:2 (se pierde un 7 % por los lados en escritorio y un 5,5 % arriba y abajo en tableta): bandeja arriba a la derecha. Móvil 4:5: todo lo importante en el 45 % de arriba |
| P25 perro | 358 × 239 (3:2) | 707 × 471 (3:2) | 686 × 457 (3:2) | Nada | 3:2 exacto |

## Supuestos de contenido (ficticios, declarados en `PRODUCT.md` §5)
- Restaurante de cocina de mercado, del desayuno a la cena: una mesa puesta con un plato sencillo de tomates aliñados y pan; sin carta, precios ni marcas. P16 es también el póster del microvídeo V01, que se pedirá después a partir de la foto aprobada.
- Spa abierto también a quien no se aloja: una sala de tratamientos con una sola camilla.
- Escapada de dos noches en Alba o Marea, con desayuno: desayuno para dos en una bandeja sobre la cama de Alba.
- Petfriendly, hasta dos perros por habitación, con cama y cuencos de cortesía: un perro tumbado en su cama en la terraza de Terraza, con sus dos cuencos.

## Prompt

```text
(se pega aquí la versión final revisada)
```
