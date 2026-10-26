import { useEffect, useRef, useState } from "react";
import { useClient, type LayoutProps } from "sanity";
import { apiVersion } from "../env";
import seed from "../seed/seed.json";

type SeedImage = {
  _seedImage: string;
  desktop: string;
  mobile: string | null;
  alt: { es: string; en: string };
};
type Status = {
  phase: "checking" | "idle" | "running" | "done" | "error";
  done: number;
  total: number;
  message?: string;
};

const isSeedImage = (v: unknown): v is SeedImage =>
  typeof v === "object" && v !== null && "_seedImage" in v;
const imageRef = (id: string) => ({ _type: "image", asset: { _type: "reference", _ref: id } });

/** Sustituye cada foto de ejemplo por la foto ya subida a Sanity, con su texto alternativo. */
export function resolveImages(value: unknown, assets: Map<string, string>): unknown {
  if (Array.isArray(value)) return value.map((v) => resolveImages(v, assets));
  if (isSeedImage(value)) {
    const desktop = assets.get(value.desktop);
    const mobile = value.mobile ? assets.get(value.mobile) : undefined;
    return {
      _type: "imageWithAlt",
      ...(desktop ? { desktop: imageRef(desktop) } : {}),
      ...(mobile ? { mobile: imageRef(mobile) } : {}),
      alt: { _type: "localeString", ...value.alt },
    };
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveImages(v, assets)]));
  }
  return value;
}

/**
 * Contenido inicial automático (pedido de la persona, 2026-10-25: «a partir de ahora eso no debería ser manual»).
 * La primera vez que un administrador abre el panel y aún no hay «Ajustes del hotel», se cargan solos los textos, las
 * habitaciones, las preguntas, los paquetes, los textos legales y las fotos aprobadas de la maqueta. Usa la sesión del
 * propio administrador (no hay tokens) y nunca pisa lo que ya exista.
 */
export function SeedOnFirstOpen(props: LayoutProps) {
  const client = useClient({ apiVersion });
  const started = useRef(false);
  const [status, setStatus] = useState<Status>({ phase: "checking", done: 0, total: 0 });

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      try {
        const exists = await client.fetch<number>(
          'count(*[_id in ["settings", "drafts.settings"]])',
        );
        if (exists > 0) return setStatus({ phase: "idle", done: 0, total: 0 });
        const files = Object.values(seed.images).flatMap((i) =>
          [i.desktop, i.mobile].filter((p): p is string => Boolean(p)),
        );
        const total = files.length + 1;
        setStatus({ phase: "running", done: 0, total });
        const assets = new Map<string, string>();
        for (const [i, path] of files.entries()) {
          const blob = await (await fetch(path)).blob();
          const asset = await client.assets.upload("image", blob, {
            filename: path.split("/").pop(),
          });
          assets.set(path, asset._id);
          setStatus({ phase: "running", done: i + 1, total });
        }
        const tx = client.transaction();
        for (const doc of seed.documents) {
          tx.createIfNotExists(resolveImages(doc, assets) as { _id: string; _type: string });
        }
        await tx.commit();
        setStatus({ phase: "done", done: total, total });
      } catch (e) {
        const forbidden =
          typeof e === "object" &&
          e !== null &&
          "statusCode" in e &&
          (e as { statusCode: number }).statusCode === 403;
        setStatus({
          phase: "error",
          done: 0,
          total: 0,
          message: forbidden
            ? "Solo un administrador del proyecto puede cargar el contenido inicial."
            : `No se pudo cargar el contenido inicial (${e instanceof Error ? e.message : "error desconocido"}). Recarga la página para reintentarlo.`,
        });
      }
    })();
  }, [client]);

  const visible = status.phase === "running" || status.phase === "done" || status.phase === "error";
  return (
    <>
      {props.renderDefault(props)}
      {visible && (
        <div
          role="status"
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: 1000,
            maxWidth: 360,
            padding: "14px 16px",
            borderRadius: 8,
            background: "#16202A",
            color: "#F3F6F7",
            boxShadow: "0 8px 30px rgba(0,0,0,.35)",
            font: "14px/1.45 system-ui, sans-serif",
          }}
        >
          {status.phase === "running" && (
            <>
              <strong>Cargando el contenido de la web…</strong>
              <div>
                Fotos {Math.min(status.done, status.total - 1)} de {status.total - 1}. No cierres
                esta pestaña.
              </div>
            </>
          )}
          {status.phase === "done" && (
            <>
              <strong>Contenido cargado.</strong>
              <div>
                Ya están las habitaciones, textos, fotos, preguntas, paquetes y textos legales.
                Puedes revisarlos y cambiarlos.
              </div>
              <button
                type="button"
                onClick={() => setStatus({ phase: "idle", done: 0, total: 0 })}
                style={{
                  marginTop: 8,
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid currentColor",
                  background: "transparent",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Entendido
              </button>
            </>
          )}
          {status.phase === "error" && <div>{status.message}</div>}
        </div>
      )}
    </>
  );
}
