import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { previewClient } from "@/lib/sanity/client";

/**
 * Abre la vista previa del editor visual («Editar la web» en el panel). El panel crea un secreto de un solo uso con la
 * sesión de quien edita y esta ruta lo comprueba con el token de solo lectura (`SANITY_API_READ_TOKEN`, solo servidor)
 * antes de activar el modo borrador. Sin token, explica qué falta en lugar de fallar en silencio.
 */
const enable = previewClient ? defineEnableDraftMode({ client: previewClient }) : null;

const MISSING_TOKEN = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Falta un paso para editar la web</title>
<body style="font:16px/1.5 system-ui,sans-serif;max-width:40rem;margin:3rem auto;padding:0 1rem;color:#16202a">
<h1 style="font-size:1.4rem">Falta un paso para editar la web aquí</h1>
<p>La vista de edición necesita una clave de solo lectura de Sanity guardada en Vercel con el nombre <code>SANITY_API_READ_TOKEN</code>. Se crea una vez y no se comparte con nadie.</p>
<p>Mientras tanto puedes cambiar todo desde «Contenido».</p></body></html>`;

export async function GET(request: Request) {
  if (!enable) {
    return new Response(MISSING_TOKEN, {
      status: 503,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
    });
  }
  return enable.GET(request);
}
