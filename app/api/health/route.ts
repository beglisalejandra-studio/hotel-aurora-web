/** Comprobación de salud para balanceadores, Docker y monitorización. No toca datos ni secretos. */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { status: "ok", time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
