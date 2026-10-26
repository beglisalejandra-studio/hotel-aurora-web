"use client";

import { at, insert, remove, set } from "@sanity/mutate";
import { useDocuments, useIsPresentationTool } from "@sanity/visual-editing/react";
import { useState } from "react";
import { ADDABLE_SECTIONS, SECTION_LABELS, type SectionType } from "@/lib/edit/labels";
import type { EditToolsProps } from "./EditTools";

type Item = { _key: string; _type: string; [k: string]: unknown };
type PageDoc = { sections?: Item[] };

const newKey = () => crypto.randomUUID().replace(/-/g, "").slice(0, 12);

/**
 * Barra de una sección en «Editar la web»: subir, bajar, añadir otra debajo, ocultar o mostrar y eliminar. Cada botón
 * cambia el borrador de la página con la sesión de quien edita (a través del panel, sin claves en el navegador); la
 * web no cambia hasta pulsar «Publicar».
 */
export default function EditToolsImpl({
  docId,
  sectionKey,
  type,
  label,
  hidden,
  first,
  last,
}: EditToolsProps) {
  const inPanel = useIsPresentationTool();
  const { getDocument } = useDocuments();
  const [open, setOpen] = useState<null | "add" | "delete">(null);
  if (inPanel !== true) return null;

  const page = getDocument<PageDoc>(docId);
  const isHero = type === "sectionHero";

  const move = (dir: -1 | 1) =>
    page.patch(
      async ({ getSnapshot }) => {
        const list = (await getSnapshot())?.sections ?? [];
        const i = list.findIndex((s) => s._key === sectionKey);
        const other = list[i + dir];
        const item = list[i];
        if (!item || !other || other._type === "sectionHero") return [];
        return [
          at(["sections"], remove({ _key: sectionKey })),
          at(["sections"], insert(item, dir < 0 ? "before" : "after", { _key: other._key })),
        ];
      },
      { commit: true },
    );

  const add = (t: SectionType) => {
    setOpen(null);
    page.patch(
      [at(["sections"], insert({ _type: t, _key: newKey() }, "after", { _key: sectionKey }))],
      { commit: true },
    );
  };

  const toggleHidden = () =>
    page.patch([at(["sections", { _key: sectionKey }, "hidden"], set(!hidden))], { commit: true });

  const del = () => {
    setOpen(null);
    page.patch([at(["sections"], remove({ _key: sectionKey }))], { commit: true });
  };

  return (
    <div className="ed-tools" role="toolbar" aria-label={`Sección: ${label}`}>
      <span className="ed-name" title={label}>
        {label}
        {hidden ? " · oculta" : ""}
      </span>
      {!isHero && (
        <>
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={first}
            title="Subir la sección"
            aria-label="Subir la sección"
          >
            ↑<span className="ed-long"> Subir</span>
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={last}
            title="Bajar la sección"
            aria-label="Bajar la sección"
          >
            ↓<span className="ed-long"> Bajar</span>
          </button>
        </>
      )}
      <button
        type="button"
        onClick={() => setOpen(open === "add" ? null : "add")}
        aria-expanded={open === "add"}
        title="Añadir una sección debajo de esta"
        aria-label="Añadir una sección debajo de esta"
      >
        +<span className="ed-long"> Añadir sección debajo</span>
      </button>
      {!isHero && (
        <>
          <button
            type="button"
            onClick={toggleHidden}
            title={
              hidden ? "Volver a mostrar la sección en la web" : "Ocultar la sección sin borrarla"
            }
          >
            {hidden ? "Mostrar" : "Ocultar"}
          </button>
          {open === "delete" ? (
            <span className="ed-confirm">
              ¿Eliminar esta sección?{" "}
              <button type="button" className="ed-danger" onClick={del}>
                Sí, eliminar
              </button>
              <button type="button" onClick={() => setOpen(null)}>
                No
              </button>
            </span>
          ) : (
            <button type="button" className="ed-danger" onClick={() => setOpen("delete")}>
              Eliminar
            </button>
          )}
        </>
      )}
      {open === "add" && (
        <div className="ed-menu" role="menu" aria-label="Tipo de sección">
          {ADDABLE_SECTIONS.map((t) => (
            <button key={t} type="button" role="menuitem" onClick={() => add(t)}>
              {SECTION_LABELS[t]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
