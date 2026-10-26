import "server-only";
import { draftMode } from "next/headers";
import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { isVisibleText } from "./stega";

/**
 * Lectura del contenido publicado (sin token: el conjunto de datos es público y solo contiene contenido de la web,
 * nunca datos de huéspedes). Las páginas se regeneran como mucho cada `REVALIDATE` segundos tras publicar en el panel.
 *
 * Editor visual (panel → «Editar la web»): el panel activa el modo borrador de Next para su vista previa. Solo en ese
 * modo se leen los borradores con `SANITY_API_READ_TOKEN` (token de solo lectura, solo en el servidor), sin caché y con
 * las marcas que permiten editar al pulsar. Los visitantes siempre reciben las páginas estáticas, sin nada de esto.
 */
export const REVALIDATE = 60;

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

const token = process.env.SANITY_API_READ_TOKEN;
// Solo para las pruebas automáticas: deja ver la interfaz de edición con el contenido publicado, sin token.
const publishedPreview = process.env.SANITY_PREVIEW_ALLOW_PUBLISHED === "1";

/** ¿Se está pintando la vista previa del editor visual? (modo borrador activo y forma de leer los borradores). */
export async function isEditing(): Promise<boolean> {
  if (!token && !publishedPreview) return false;
  try {
    return (await draftMode()).isEnabled;
  } catch {
    // Fuera de una petición (generación estática, mapa del sitio): nunca es la vista previa.
    return false;
  }
}

/** Cliente con permiso de lectura de borradores, para validar el enlace de vista previa del panel. */
export const previewClient = token ? client.withConfig({ token, useCdn: false }) : null;

export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  if (await isEditing()) {
    return client
      .withConfig({
        ...(token ? { token, perspective: "drafts" as const } : {}),
        useCdn: false,
        stega: { enabled: true, studioUrl: "/admin", filter: (p) => isVisibleText(p.sourcePath) },
      })
      .fetch<T>(query, { editing: true, ...params }, { cache: "no-store" });
  }
  return client.fetch<T>(
    query,
    { editing: false, ...params },
    { next: { revalidate: REVALIDATE, tags: ["sanity"] } },
  );
}
