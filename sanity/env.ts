/**
 * Proyecto de Sanity. El ID del proyecto y el conjunto de datos son PÚBLICOS (no son secretos): se pueden fijar aquí.
 * Los tokens de lectura de borradores y de revalidación son secretos y solo viven en el servidor (lib/env.server.ts).
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "7keq933j";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-10-01";
