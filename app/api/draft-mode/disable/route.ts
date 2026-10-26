import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

/** Cierra la vista previa del editor visual y vuelve a la web publicada. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url));
}
