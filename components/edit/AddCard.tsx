import { createHref } from "@/lib/edit/labels";

/**
 * Tarjeta «+ Añadir …» al final de una lista en el editor visual. Abre en el panel la ficha de un documento nuevo; al
 * publicarlo aparece solo al final de la lista y se recoloca arrastrándolo. Solo se pinta en la vista previa.
 */
export function AddCard({
  type,
  label,
  className,
}: {
  type: string;
  label: string;
  className?: string;
}) {
  return (
    <a className={`ed-add ${className ?? ""}`} href={createHref(type)} target="_top">
      <span aria-hidden="true">+</span> {label}
    </a>
  );
}
