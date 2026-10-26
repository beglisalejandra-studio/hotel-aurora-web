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
import { LIST_OF, withAppendToLists } from "./sanity/actions/appendToHomeList";
import { withContrastConfirm } from "./sanity/actions/contrastConfirm";
import { SeedOnFirstOpen } from "./sanity/components/SeedOnFirstOpen";
import { structure } from "./sanity/structure";
import { homeTool } from "./sanity/tools/home";
import { editTheWebsite } from "./sanity/presentation";

const singletons = new Set<string>(SINGLETONS);

export default defineConfig({
  name: "hotel-aurora",
  title: "Hotel Aurora",
  basePath: "/admin",
  projectId,
  dataset,
  apiVersion,
  plugins: [
    editTheWebsite,
    structureTool({ structure, title: "Contenido" }),
    colorInput(),
    esESLocale(),
  ],
  // Al abrir el panel se ve la web, editable («Editar la web»); «Inicio» tiene los atajos y «Contenido», todo.
  tools: (prev) => {
    const edit = prev.filter((t) => t.name === "editar");
    return [...edit, homeTool, ...prev.filter((t) => t.name !== "editar")];
  },
  schema: {
    types: schemaTypes,
    // Los documentos únicos no se crean desde «Nuevo documento».
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },
  // El inicio de sesión se guarda como token en el navegador del editor: así el panel puede pedir a la web que
  // sugiera la descripción de una foto, y la web comprueba con Sanity que quien lo pide es un editor del proyecto.
  auth: { loginMethod: "token" },
  // La primera vez que un administrador abre el panel vacío, se carga solo el contenido de la maqueta aprobada.
  studio: { components: { layout: SeedOnFirstOpen } },
  document: {
    actions: (actions, { schemaType }) => {
      // En los documentos únicos solo se puede publicar o descartar cambios (ni duplicar ni borrar).
      const allowed = singletons.has(schemaType)
        ? actions.filter(
            ({ action }) => action && ["publish", "discardChanges", "restore"].includes(action),
          )
        : actions;
      // En «Colores y tipografías», publicar pide confirmación si algún texto no se leería bien.
      if (schemaType === "theme")
        return allowed.map((a) => (a.action === "publish" ? withContrastConfirm(a) : a));
      // Una habitación, un paquete o una pregunta nuevos se colocan solos al final de su lista en la web.
      if (LIST_OF[schemaType])
        return allowed.map((a) => (a.action === "publish" ? withAppendToLists(a) : a));
      return allowed;
    },
  },
});
