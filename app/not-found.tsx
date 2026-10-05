import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-3xl font-semibold">Página no encontrada</h1>
      <p className="mt-4 opacity-80">Esta dirección no existe o se ha movido.</p>
      <p className="mt-6">
        <Link href="/" className="font-medium underline underline-offset-4">
          Volver al inicio
        </Link>
      </p>
    </main>
  );
}
