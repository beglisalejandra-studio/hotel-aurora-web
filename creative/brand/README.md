# Materiales de marca · Hotel Aurora

> **Hotel Aurora es un proyecto de portafolio: el hotel no existe.**
> Todo el contenido (habitaciones, planes, precios, textos) es ficticio y de demostración.
> Las imágenes pueden ser generadas con IA.

Esta carpeta es el único lugar donde se suben los logos y las fotos.
Todo lo que entre aquí pasa por una revisión antes de publicarse en el sitio.

## Dónde subir cada cosa

| Qué | Carpeta |
|---|---|
| Logos y favicon | `creative/brand/logo/` |
| Fotografías | `creative/brand/photos/` |
| Manual de marca, paleta, tipografías | `creative/brand/` (raíz) |

Rama de trabajo: `claude/laughing-newton-e2apbo`. Sube **directo a esa rama**, nunca a `main`.

Para subir desde GitHub: abre la carpeta → **Add file → Upload files** → arrastra los archivos →
en **Commit changes** deja marcada la opción *Commit directly to the claude/laughing-newton-e2apbo branch*.

## Cómo se piden los materiales

Cada solicitud trae:
1. **Prompt** para generar la imagen.
2. **Nombre exacto del archivo** (respétalo: el sitio lo referencia por ese nombre).
3. **Enlace a la carpeta** donde subirlo.

## Reglas de los archivos

- Nombre en minúsculas, sin tildes ni espacios, separado por guiones: `habitacion-deluxe-cama.jpg`.
- Logo: SVG si es posible; si no, PNG transparente de al menos 1000 px de ancho.
- Fotos: JPG o PNG original, **mínimo 2000 px en el lado largo**, **4 MB o menos** por archivo (límite de la subida desde el navegador).
- Sin marcas de agua, sin texto incrustado en las fotos y sin logos ni marcas de terceros.

## Procedencia (para el registro de media)

Por cada imagen generada con IA, anota en el mensaje del commit o en el chat: la herramienta usada y el prompt.
Revisa que los términos de esa herramienta permitan uso en un portafolio público.
Si aparecen personas, deben ser generadas (no reales ni parecidas a alguien concreto).

## Qué NO subir aquí

Contraseñas, claves de API, datos de personas reales, documentos de identidad ni información bancaria.
