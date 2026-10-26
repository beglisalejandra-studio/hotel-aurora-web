import type { DocumentActionComponent, DocumentActionProps, SanityClient } from "sanity";
import { useClient } from "sanity";
import { apiVersion } from "../env";

/** Listas ordenables de las secciones y el tipo de documento que contienen (igual que lib/edit/labels.ts). */
export const LIST_OF: Record<string, { section: string; field: string }> = {
  room: { section: "sectionRooms", field: "rooms" },
  offer: { section: "sectionOffers", field: "offers" },
  faq: { section: "sectionFaq", field: "faqs" },
};

const newKey = () => crypto.randomUUID().replace(/-/g, "").slice(0, 12);

type Item = { _key: string; _type?: string; _ref?: string; _weak?: boolean };
type PageLists = { _id: string; _rev: string; secs: { _key: string; items: Item[] }[] };

const pagesQuery = (field: string) =>
  `*[_type == "page" && count(sections[_type == $section]) > 0]{
    _id, _rev, "secs": sections[_type == $section]{ _key, "items": coalesce(${field}, [])[]{ _key, _type, _ref, _weak } }
  }`;

/**
 * Lista final de una sección: las que ya tenía, en su orden y sin repetir (ni rotas), y al final las que falten.
 * Se escribe entera con `set` (el cliente de Sanity solo guarda el último `unset`/`insert` de cada cambio).
 */
export function finalList(items: Item[], ids: string[]): Item[] | null {
  const seen = new Set<string>();
  const kept = items.filter((i) => i._ref && !seen.has(i._ref) && seen.add(i._ref));
  const missing = ids.filter((id) => !seen.has(id));
  if (kept.length === items.length && !missing.length) return null;
  // La consulta devuelve null en los campos que no existen: no se escriben
  const clean = (i: Item) =>
    Object.fromEntries(Object.entries(i).filter(([, v]) => v !== null && v !== undefined)) as Item;
  return [
    ...kept.map((i) => ({ _type: "reference", ...clean(i) })),
    ...missing.map((id) => ({ _type: "reference", _ref: id, _weak: true, _key: newKey() })),
  ];
}

/**
 * Cambia cada página solo si sigue en la revisión leída (`ifRevisionId`): si otra apertura del panel se adelantó
 * (409), esa versión manda. Un solo `set` por página con todas las listas que cambian.
 */
async function writeLists(
  client: SanityClient,
  field: string,
  pages: PageLists[],
  ids: (sec: PageLists["secs"][number]) => string[],
) {
  for (const page of pages) {
    const changes: Record<string, Item[]> = {};
    for (const sec of page.secs) {
      const list = finalList(sec.items, ids(sec));
      if (list) changes[`sections[_key=="${sec._key}"].${field}`] = list;
    }
    if (!Object.keys(changes).length) continue;
    try {
      await client
        .patch(page._id)
        .ifRevisionId(page._rev)
        .set(changes)
        .commit({ autoGenerateArrayKeys: false });
    } catch (e) {
      if (!(typeof e === "object" && e && "statusCode" in e && e.statusCode === 409)) throw e;
    }
  }
}

/**
 * Añade el documento al final de la lista de cada sección que lo muestra (en todas las páginas, publicadas y en
 * borrador), si aún no está. La web ya lo enseña al final aunque no esté en la lista; tenerlo en ella permite
 * arrastrarlo en «Editar la web». Referencia débil: borrar el documento lo quita de la lista sin bloquear el borrado.
 * Como la posición en la web no cambia, se aplica directamente, sin crear un borrador que haya que publicar.
 */
export async function appendToLists(client: SanityClient, type: string, id: string) {
  const list = LIST_OF[type];
  if (!list) return;
  const pages = await client.fetch<PageLists[]>(pagesQuery(list.field), { section: list.section });
  await writeLists(client, list.field, pages, (sec) => [
    ...sec.items.flatMap((i) => (i._ref ? [i._ref] : [])),
    id,
  ]);
}

/** Publicar y, después, colocar el documento al final de las listas de la web (habitaciones, paquetes, preguntas). */
export function withAppendToLists(Publish: DocumentActionComponent): DocumentActionComponent {
  function PublishAndList(props: DocumentActionProps) {
    const base = Publish(props);
    const client = useClient({ apiVersion });
    if (!base || !LIST_OF[props.type]) return base;
    return {
      ...base,
      onHandle: () => {
        base.onHandle?.();
        void appendToLists(client, props.type, props.id).catch(() => {
          // No es grave: la web ya lo muestra al final; al abrir el panel se vuelve a intentar.
        });
      },
    };
  }
  PublishAndList.action = Publish.action;
  return PublishAndList;
}

/**
 * Al abrir el panel: cada habitación, paquete y pregunta publicados entra en la lista de las secciones que los
 * muestran, en el mismo orden en que ya salían en la web (primero los de la lista, después los demás por «Orden»).
 * También quita repeticiones. La web no cambia; solo se vuelven arrastrables en «Editar la web».
 *
 * 2026-10-26: dos ejecuciones simultáneas duplicaron las listas, y la limpieza con varios `unset` en un mismo cambio
 * solo aplicó el último. Ahora cada lista se escribe entera y solo sobre la revisión leída.
 */
export async function syncLists(client: SanityClient) {
  for (const [type, list] of Object.entries(LIST_OF)) {
    const { ids, pages } = await client.fetch<{ ids: string[]; pages: PageLists[] }>(
      `{
        "ids": *[_type == $type && !(_id in path("drafts.**"))] | order(order asc)._id,
        "pages": ${pagesQuery(list.field)}
      }`,
      { type, section: list.section },
    );
    await writeLists(client, list.field, pages, () => ids);
  }
}
