import "server-only";
import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Lectura del contenido publicado (sin token: el conjunto de datos es público y solo contiene contenido de la web,
 * nunca datos de huéspedes). Las páginas se regeneran como mucho cada `REVALIDATE` segundos tras publicar en el panel.
 */
export const REVALIDATE = 60;

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

export function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate: REVALIDATE, tags: ["sanity"] } });
}
