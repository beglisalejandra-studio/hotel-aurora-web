import { NextResponse, type NextRequest } from "next/server";

/**
 * Idiomas en la dirección: el español va sin prefijo (/habitaciones/alba) y el inglés con /en (/en/habitaciones/alba).
 * Por dentro todo vive en app/[lang]: aquí se reescribe /… a /es/… y se redirige /es/… a /… (una sola dirección por
 * página, buena para buscadores). No se adivina el idioma del navegador: cada visitante elige con el selector.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/es" || pathname.startsWith("/es/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    url.search = search;
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/es${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Fuera: panel, API, archivos internos de Next, fotos y mapa propios, y cualquier archivo con extensión.
  matcher: ["/((?!admin|api|_next|cdn|seed|map|fonts|.*\\..*).*)"],
};
