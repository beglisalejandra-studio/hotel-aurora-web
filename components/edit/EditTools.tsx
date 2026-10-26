"use client";

import dynamic from "next/dynamic";
import type { SectionType } from "@/lib/edit/labels";

export type EditToolsProps = {
  docId: string;
  sectionKey: string;
  type: SectionType;
  label: string;
  hidden: boolean;
  first: boolean;
  last: boolean;
};

// La barra (y lo que necesita para hablar con el panel) se descarga solo en la vista previa del editor: la web
// pública nunca la carga.
const Impl = dynamic(() => import("./EditToolsImpl"), { ssr: false });

export function EditTools(props: EditToolsProps) {
  return <Impl {...props} />;
}
