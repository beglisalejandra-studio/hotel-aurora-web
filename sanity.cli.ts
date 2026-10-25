import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

/** Configuración de la línea de órdenes de Sanity (validar el esquema, exportar copias del contenido). */
export default defineCliConfig({ api: { projectId, dataset } });
