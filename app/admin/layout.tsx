import type { ReactNode } from "react";

/** El panel (Sanity Studio) tiene su propio documento: no carga los estilos ni los scripts de la web pública. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
