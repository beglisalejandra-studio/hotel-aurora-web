import type { ReactNode } from "react";
import { projectId } from "@/sanity/env";

/**
 * El panel (Sanity Studio) tiene su propio documento: no carga los estilos ni los scripts de la web pública. Las
 * conexiones con Sanity se abren mientras se descarga el panel, para que arranque antes.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href={`https://${projectId}.api.sanity.io`} crossOrigin="" />
        <link rel="preconnect" href="https://design-system-static.sanity.io" crossOrigin="" />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
