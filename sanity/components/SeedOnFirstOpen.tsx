import { useEffect, useRef, useState } from "react";
import { useClient, type LayoutProps } from "sanity";
import { syncLists } from "../actions/appendToHomeList";

let listsSync: Promise<void> | null = null;
import { apiVersion } from "../env";

// El contenido de ejemplo (180 KB) solo se descarga cuando hace falta, no en cada apertura del panel.
type Seed = typeof import("../seed/seed.json");
const loadSeed = async (): Promise<Seed> => {
  const m = await import("../seed/seed.json");
  return ("default" in m ? m.default : m) as Seed;
};

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

type Step = { _key: string } & Record<string, unknown>;
type SeedDoc = { _id: string; sections?: { _type: string; steps?: Step[] }[] };

/** Claves de los tres textos del recorrido que se cargaron con la primera versión del contenido. */
const FIRST_WALK = ["k00en", "k00eo", "k00ep"];

/**
 * Migración automática (2026-10-26): el recorrido de la portada pasó de 3 a 9 textos, como en la maqueta aprobada.
 * Solo actúa si la portada conserva exactamente los 3 textos de la primera carga (en el mismo orden); los textos que el
 * cliente haya cambiado se mantienen tal cual y los 6 nuevos se intercalan en su sitio. Si ya hay otra cosa, no toca nada.
 */
async function completeWalk(client: ReturnType<typeof useClient>) {
  const pending: { id: string; hero: { _key: string; steps?: Step[] } }[] = [];
  for (const id of ["page-inicio", "drafts.page-inicio"]) {
    const hero = await client.fetch<{ _key: string; steps?: Step[] } | null>(
      '*[_id == $id][0].sections[_type == "sectionHero"][0]{_key, steps}',
      { id },
    );
    const keys = (hero?.steps ?? []).map((s) => s._key);
    if (hero && keys.join() === FIRST_WALK.join()) pending.push({ id, hero });
  }
  if (!pending.length) return;
  const seed = await loadSeed();
  const home = (seed.documents as unknown as SeedDoc[]).find((d) => d._id === "page-inicio");
  const seeded = home?.sections?.find((s) => s._type === "sectionHero")?.steps ?? [];
  for (const { id, hero } of pending) {
    const current = new Map((hero.steps ?? []).map((s) => [s._key, s]));
    const steps = seeded.map((s) => current.get(s._key) ?? s);
    await client
      .patch(id)
      .set({ [`sections[_key=="${hero._key}"].steps`]: steps })
      .commit();
  }
}

/**
 * Migración automática (2026-10-26): el aviso de cookies se edita en su propia entrada del panel («Aviso de cookies»).
 * Si aún no existe, se crea con los textos de serie; si ya existe (publicado o en borrador), no se toca.
 */
async function completeCookies(client: ReturnType<typeof useClient>) {
  const exists = await client.fetch<number>(
    'count(*[_id in ["cookieNotice", "drafts.cookieNotice"]])',
  );
  if (exists > 0) return;
  const seed = await loadSeed();
  const doc = seed.documents.find((d) => d._id === "cookieNotice");
  if (doc) await client.createIfNotExists(doc as { _id: string; _type: string });
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
        if (exists > 0) {
          await completeWalk(client);
          await completeCookies(client);
          // Una sola vez por página aunque el panel monte este componente más de una vez
          listsSync ??= syncLists(client).finally(() => {
            listsSync = null;
          });
          await listsSync;
          return setStatus({ phase: "idle", done: 0, total: 0 });
        }
        const seed = await loadSeed();
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
