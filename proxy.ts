import { NextResponse, type NextRequest } from "next/server";

/**
 * Idiomas en la dirección: el español va sin prefijo (/habitaciones/alba) y el inglés con /en (/en/habitaciones/alba).
 * Por dentro todo vive en app/[lang]: aquí se reescribe /… a /es/… y se redirige /es/… a /… (una sola dirección por
 * página, buena para buscadores). No se adivina el idioma del navegador: cada visitante elige con el selector.
 */
const INTERNAL = "x-aurora-es";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // Petición que ya viene de nuestra propia reescritura (cuando el servidor arranca con --hostname, Next la repite
  // como petición nueva): se sirve tal cual para no entrar en un bucle de redirecciones.
  if (request.headers.get(INTERNAL) === "1") return NextResponse.next();
  if (pathname === "/es" || pathname.startsWith("/es/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    url.search = search;
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/es${pathname === "/" ? "" : pathname}`;
  const headers = new Headers(request.headers);
  headers.set(INTERNAL, "1");
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  // Fuera: panel, API, archivos internos de Next (también las fotos optimizadas), mapa propio y archivos con extensión.
  matcher: ["/((?!admin|api|_next|seed|map|fonts|.*\\..*).*)"],
};
