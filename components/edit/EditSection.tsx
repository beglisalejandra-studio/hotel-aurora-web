import type { ReactNode } from "react";
import { sanityAttr, sectionPath, type EditDoc } from "@/lib/edit/attr";
import { SECTION_LABELS, type SectionType } from "@/lib/edit/labels";
import { EditTools } from "./EditTools";

/**
 * Sección en el editor visual: la barra de herramientas va FUERA de la zona editable (hermana, no hija), porque el
 * editor de Sanity se queda los clics de dentro para abrir el formulario. Solo se pinta en la vista previa del panel.
 */
export function EditSection({
  edit,
  sectionKey,
  type,
  hidden,
  index,
  count,
  children,
}: {
  edit: EditDoc;
  sectionKey: string;
  type: SectionType;
  hidden?: boolean;
  index: number;
  count: number;
  children: ReactNode;
}) {
  return (
    <div className={`ed-sec${hidden ? " ed-hidden" : ""}`} data-ed-key={sectionKey}>
      <EditTools
        docId={edit.id}
        sectionKey={sectionKey}
        type={type}
        label={SECTION_LABELS[type] ?? type}
        hidden={Boolean(hidden)}
        first={index === 0}
        last={index === count - 1}
      />
      <div className="ed-target" {...sanityAttr(edit, sectionPath(sectionKey))}>
        {children}
      </div>
    </div>
  );
}
