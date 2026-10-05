/** Enlace "saltar al contenido" (WCAG 2.4.1). Es el primer elemento enfocable; visible solo al recibir foco. */
export function SkipLink({ label = "Saltar al contenido" }: { label?: string }) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
    >
      {label}
    </a>
  );
}
