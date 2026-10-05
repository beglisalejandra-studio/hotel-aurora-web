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
    // Sin PII: solo el digest para correlacionar con los logs del servidor.
    console.error("[error-boundary]", error.digest ?? "sin-digest");
  }, [error]);

  return (
    <main id="main" className="mx-auto max-w-xl px-6 py-24" role="alert">
      <h1 className="text-3xl font-semibold">Algo ha salido mal</h1>
      <p className="mt-4 opacity-80">
        Ha ocurrido un error inesperado. Puedes intentarlo de nuevo.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-accent px-4 py-2 font-medium text-accent-foreground"
      >
        Reintentar
      </button>
    </main>
  );
}
