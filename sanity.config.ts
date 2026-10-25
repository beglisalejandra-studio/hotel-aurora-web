"use client";
/**
 * Panel de administración (Sanity Studio) servido en /admin. Archivo de cliente: Next lo carga solo en esa ruta.
 * El acceso lo protege el inicio de sesión de Sanity (activa la verificación en dos pasos en la cuenta).
 */
import { colorInput } from "@sanity/color-input";
import { esESLocale } from "@sanity/locale-es-es";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { SINGLETONS } from "./sanity/schemaTypes/documents/singletons";
import { withContrastConfirm } from "./sanity/actions/contrastConfirm";
import { structure } from "./sanity/structure";

const singletons = new Set<string>(SINGLETONS);

export default defineConfig({
  name: "hotel-aurora",
  title: "Hotel Aurora",
  basePath: "/admin",
  projectId,
  dataset,
  apiVersion,
  plugins: [structureTool({ structure, title: "Contenido" }), colorInput(), esESLocale()],
  schema: {
    types: schemaTypes,
    // Los documentos únicos no se crean desde «Nuevo documento».
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },
  // El inicio de sesión se guarda como token en el navegador del editor: así el panel puede pedir a la web que
  // sugiera la descripción de una foto, y la web comprueba con Sanity que quien lo pide es un editor del proyecto.
  auth: { loginMethod: "token" },
  document: {
    actions: (actions, { schemaType }) => {
      // En los documentos únicos solo se puede publicar o descartar cambios (ni duplicar ni borrar).
      const allowed = singletons.has(schemaType)
        ? actions.filter(
            ({ action }) => action && ["publish", "discardChanges", "restore"].includes(action),
          )
        : actions;
      // En «Colores y tipografías», publicar pide confirmación si algún texto no se leería bien.
      return schemaType === "theme"
        ? allowed.map((a) => (a.action === "publish" ? withContrastConfirm(a) : a))
        : allowed;
    },
  },
});
