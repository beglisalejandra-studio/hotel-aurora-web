# Cola de material (una pieza cada vez)

Se pide **una pieza por turno**, con su ficha en `creative/requests/<nombre>.md` (medidas exactas, prompt ultra realista y carpeta de subida). Al recibirla se comprueba con `media-intake.mjs`, se anota como **borrador** y la persona la aprueba antes de pasar a `public/media/`. La primera imagen aprobada de cada espacio **fija la identidad** (edificio, luz, paleta): las siguientes se piden como variaciones de ella.

**Aviso sobre contenido sintético:** si las imágenes se generan con IA, se registran con `ai_generated: true` en `creative/manifest.json` y el portfolio debe indicarlo (el hotel y sus fotos son ficticios). Para un cliente real se usan fotografías reales.

| # | Código | Tipo | Qué | Proporción | Estado |
|---|---|---|---|---|---|
| 1 | P01 escritorio | Foto | Fachada al amanecer, héroe de la portada (LCP) | 16:10 | **Solicitada** (`p01-hero-escritorio.md`) |
| 2 | P01 móvil | Foto | La misma escena recortada en vertical (se pide como variación de la aprobada) | 4:5 | Pendiente de #1 |
| 3 | P03 | Foto | Patio interior a media mañana | 3:2 | Pendiente |
| 4 | P04 | Foto | Habitación Alba, vista general | 4:5 | Pendiente |
| 5 | P05 | Foto | Alba, la luz sobre la pared | 3:2 | Pendiente |
| 6 | P06 | Foto | Alba, baño | 3:2 | Pendiente |
| 7 | P16 | Foto | Sala del restaurante con luz de ventana (también es el póster de V01) | 3:2 | Pendiente |
| 8 | V01 | Vídeo | Luz de ventana sobre la mesa, 6 s en bucle, sin audio | 3:2 | Pendiente de #7 |
| 9 | P19 | Foto | Sala de tratamientos del spa | 4:5 | Pendiente |
| 10 | P25 | Foto | Perro en la terraza de la habitación (hotel petfriendly) | 3:2 | Pendiente |
| 11 | P21 a P23 | Foto | Portadas de los tres paquetes | 4:5 | Pendiente |
| 12 | P07 a P15 | Foto | Resto de habitaciones: Marea, Terraza y suite Faro | 3:2 y 4:5 | Pendiente |
| 13 | P17, P18 | Foto | Plato en primer plano y desayuno | 3:2 | Pendiente |
| 14 | P20 | Foto | Zona de agua del spa al amanecer | 3:2 | Pendiente |
| 15 | P24 | Foto | **Playa de El Palmar** (rasgos reales: arena dorada, pasarela de madera con valla, hierba de duna, oleaje atlántico moderado y viento) | 16:9 | Pendiente |
| 16 | P02 | Foto | Imagen para compartir en redes: se **deriva de P01**, no se pide aparte | 1200 x 630 | Derivada |
| 17 | V02, V03 | Vídeo | Agua del spa y luz sobre la pared de Alba, 6 s en bucle | 4:5 y 3:2 | Pendiente |
| 18 | 360 x 4 | Foto 360 | Panoramas equirrectangulares de las cuatro habitaciones (extra aprobado) | 2:1 | Pendiente |
| 19 | Mapa de profundidad de P01 | Derivado | Lo genera el equipo a partir de P01 aprobada (extra 2,5D) | igual que P01 | Pendiente de #1 |
