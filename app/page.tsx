import { site } from "@/lib/site";

/**
 * Página de arranque NEUTRA (no es una landing de cliente). Se reemplaza en el primer PR de implementación,
 * después de PRODUCT.md, DESIGN.md y el plan (/web-plan).
 */
export default function Home() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-semibold">{site.name}</h1>
      <p className="mt-4 opacity-80">
        Proyecto inicializado con web-os. Completa PRODUCT.md, DESIGN.md y PROJECT.md y ejecuta
        /web-plan para empezar.
      </p>
    </main>
  );
}
