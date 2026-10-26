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

/**
 * Añade el documento al final de la lista de cada sección que lo muestra (en todas las páginas, publicadas y en
 * borrador), si aún no está. La web ya lo enseña al final aunque no esté en la lista; tenerlo en ella permite
 * arrastrarlo en «Editar la web». Referencia débil: borrar el documento lo quita de la lista sin bloquear el borrado.
 * Como la posición en la web no cambia, se aplica directamente, sin crear un borrador que haya que publicar.
 */
export async function appendToLists(client: SanityClient, type: string, id: string) {
  const list = LIST_OF[type];
  if (!list) return;
  const pages = await client.fetch<{ _id: string; keys: string[] }[]>(
    `*[_type == "page" && count(sections[_type == $section && !($id in coalesce(${list.field}[]._ref, []))]) > 0]{
      _id, "keys": sections[_type == $section && !($id in coalesce(${list.field}[]._ref, []))]._key
    }`,
    { section: list.section, id },
  );
  for (const page of pages) {
    const patch = client.patch(page._id);
    for (const key of page.keys) {
      patch
        .setIfMissing({ [`sections[_key=="${key}"].${list.field}`]: [] })
        .append(`sections[_key=="${key}"].${list.field}`, [
          { _type: "reference", _ref: id, _weak: true, _key: newKey() },
        ]);
    }
    await patch.commit({ autoGenerateArrayKeys: false });
  }
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
 * La web no cambia; solo se vuelven arrastrables en «Editar la web».
 */
export async function syncLists(client: SanityClient) {
  for (const [type, list] of Object.entries(LIST_OF)) {
    const { ids, pages } = await client.fetch<{
      ids: string[];
      pages: { _id: string; secs: { _key: string; have: string[] }[] }[];
    }>(
      `{
        "ids": *[_type == $type && !(_id in path("drafts.**"))] | order(order asc)._id,
        "pages": *[_type == "page" && count(sections[_type == $section]) > 0]{
          _id, "secs": sections[_type == $section]{ _key, "have": coalesce(${list.field}[]._ref, []) }
        }
      }`,
      { type, section: list.section },
    );
    for (const page of pages) {
      const patch = client.patch(page._id);
      let changed = false;
      for (const sec of page.secs) {
        const missing = ids.filter((id) => !sec.have.includes(id));
        if (!missing.length) continue;
        changed = true;
        const path = `sections[_key=="${sec._key}"].${list.field}`;
        patch.setIfMissing({ [path]: [] }).append(
          path,
          missing.map((id) => ({ _type: "reference", _ref: id, _weak: true, _key: newKey() })),
        );
      }
      if (changed) await patch.commit({ autoGenerateArrayKeys: false });
    }
  }
}
