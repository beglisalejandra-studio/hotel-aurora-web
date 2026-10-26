import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { AltTextSchema, type AltText } from "./alt-text-input";

const SYSTEM = `Escribes el texto alternativo de las fotos de la web de un hotel boutique en El Palmar (Cádiz).
Devuelve una frase en español de España y su traducción natural al inglés.
- Entre 8 y 20 palabras; concreta: el espacio, la luz y los objetos principales que se ven.
- No empieces con «Imagen de», «Foto de» ni equivalentes.
- No inventes nombres, marcas, lugares ni datos que no se vean. Usa el contexto solo si encaja con la foto.
- Si hay personas, descríbelas de forma neutral, sin suponer identidad, edad exacta ni origen.`;

export class AltTextRefusal extends Error {}

/** Sugiere el texto alternativo de una foto con un modelo de Claude que la mira. */
export async function suggestAltText(
  client: Anthropic,
  imageUrl: string,
  context?: string,
): Promise<AltText> {
  const response = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM,
    output_config: { effort: "low", format: betaZodOutputFormat(AltTextSchema) },
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "url", url: imageUrl } },
          { type: "text", text: context ? `Contexto del panel: ${context}` : "Describe la foto." },
        ],
      },
    ],
  });
  if (response.stop_reason === "refusal") throw new AltTextRefusal("refusal");
  if (!response.parsed_output) throw new Error("Respuesta sin descripción válida");
  return response.parsed_output;
}
