import Link from "next/link";

/** 404 dentro del diseño del sitio. Bilingüe: no recibe el idioma, así que lo dice en los dos. */
export default function NotFound() {
  return (
    <main id="page-404" className="page">
      <div className="wrap nf">
        <h1 className="legal-h1">Página no encontrada</h1>
        <p className="lead">
          La página que buscas no existe o ha cambiado de dirección.{" "}
          <span lang="en">Page not found.</span>
        </p>
        <Link className="btn btn-primary" href="/">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
