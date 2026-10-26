"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sin datos personales: solo el identificador para cruzarlo con los registros del servidor.
    console.error("[error-boundary]", error.digest ?? "sin-digest");
  }, [error]);
  return (
    <main id="page-error" className="page" role="alert">
      <div className="wrap nf">
        <h1 className="legal-h1">Algo ha fallado</h1>
        <p className="lead">
          No hemos podido cargar esta página. Prueba de nuevo en unos segundos.
        </p>
        <button type="button" className="btn btn-primary" onClick={reset}>
          Reintentar
        </button>
      </div>
    </main>
  );
}
