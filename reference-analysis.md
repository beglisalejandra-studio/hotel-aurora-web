# Análisis de referencias - resumen ejecutivo

> Detalle, capturas y JSON: `creative/references/`. Aquí solo el **contrato visual** y los **principios adoptados** (no se clonan textos, código, imágenes, logos ni diseños protegidos). Datos extraídos el 2026-10-09.

## Hallazgo principal
Cuatro de los cinco hoteles analizados usan el mismo fondo cálido (crema), y el quinto un melocotón claro: Park Lane `rgb(245,242,238)`, Røros `rgb(249,239,234)`, Sir Albert `rgb(245,245,237)`, Hospes `rgb(241,235,229)`, The Hoxton `rgb(254,242,227)`. El sector converge en esa paleta, y es justo la que la autoridad visual veta por convertir la marca en invisible. Aurora se diferencia con **pizarra fría + un solo acento terracota**.

## Principios adoptados
| # | Principio | Referencia que lo inspira | Impacto esperado en conversión |
|---|---|---|---|
| 1 | La reserva siempre al alcance: barra de fechas en el héroe y botón "Reservar" fijo | Hospes (barra en el héroe), Sir Albert (botón circular fijo) | Menos pasos hasta iniciar la reserva |
| 2 | Navegar por intención y por pilar (dormir, comer, cuidarse, escapadas) | Hospes ("quiero cuidarme / saborear / celebrar"), Røros (pilares) | Cada línea de ingreso tiene entrada propia |
| 3 | Contacto visible y tocable desde la cabecera, más un canal humano | Røros (`tel:` y `mailto:` en cabecera), Hospes (teléfono) | Resuelve la duda sin salir del sitio |
| 4 | Beneficios de reservar directo dichos con llaneza junto a la acción | The Hoxton ("Best Rate? Book Here"), Hospes ("Benefits of booking") | Contrarresta la comparación con intermediarios |
| 5 | Consentimiento con las opciones al mismo nivel | Hospes (Rechazar y Aceptar idénticos) frente a Sir Albert y Hoxton (Aceptar destacado) | Cumplimiento y confianza |
| 6 | Rigor tipográfico y silencio visual (texto cómodo, pocas voces) | Kinfolk, Apartamento | Lectura sin fatiga; sensación editorial |
| 7 | La foto manda: portada a sangre y recorrido en profundidad por las fotografías, con atmósfera sobre una base fotográfica | Explore Primland, Oryzo, 21st Scroll Image Tunnel | Impacto visual sin coste de carga (ver ADR-0006) |
| 8 | Nada de preloader: la primera vista es contenido | Contraejemplo: Primland, Oryzo, Hubtown y Sleep Well (14 a 43 MB tras pantalla de carga) | Protege el LCP y la conversión |

## Contrato visual (lo que NO cambia)
No hay referencia de marca que preservar (proyecto nuevo). El contrato lo fija `DESIGN.md`: recorrido fotográfico a sangre, familia terracota + pizarra, Outfit + Work Sans, medios rectos y controles en píldora. El contrato de `creative/manifest.json` se rellena en la fase 4 con el material aprobado.

## Qué evitamos (y por qué)
- **Cuatro vídeos en bucle sin póster en la portada** (Park Lane): peso y riesgo para LCP.
- **Imágenes sin texto alternativo** (Sir Albert: 9 de 54 sin alt; Park Lane: 2 de 48): accesibilidad y SEO de imagen.
- **Una sola página interminable con navegación de anclas** (Sir Albert, unos 12.500 px): mala orientación; aquí cada línea de ingreso tiene su URL.
- **Botón de aceptar cookies destacado y rechazar atenuado** (Sir Albert, The Hoxton): contrario al criterio de igualdad.
- **Fondo crema como seña de identidad**: es lo que hace todo el sector.
- **Preloader y escenas de 14 a 43 MB** (Primland, Oryzo, Hubtown, Sleep Well): ver ADR-0006.
