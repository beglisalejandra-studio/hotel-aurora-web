import { useState } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import { paletteProblems, type PaletteKey } from "../lib/contrast";

type Palette = Partial<Record<PaletteKey, { hex?: string }>>;
type ThemeDoc = { light?: Palette; dark?: Palette };

const hexes = (p?: Palette) =>
  Object.fromEntries(Object.entries(p ?? {}).map(([k, c]) => [k, c?.hex])) as Partial<
    Record<PaletteKey, string>
  >;

/** Problemas de contraste de las dos paletas, con el modo delante para que se entienda dónde está cada uno. */
export function themeProblems(doc: ThemeDoc | null | undefined): string[] {
  if (!doc) return [];
  return [
    ...paletteProblems(hexes(doc.light)).map((m) => `Modo Día · ${m}`),
    ...paletteProblems(hexes(doc.dark)).map((m) => `Modo Madrugada · ${m}`),
  ];
}

/**
 * Publicar con confirmación (pedido de la persona, 2026-10-25): si algún texto no se leería bien, el panel avisa y
 * pide confirmar en lugar de impedir la publicación.
 */
export function withContrastConfirm(Publish: DocumentActionComponent): DocumentActionComponent {
  function PublishWithContrastCheck(props: DocumentActionProps) {
    const base = Publish(props);
    const [asking, setAsking] = useState(false);
    const problems = themeProblems((props.draft ?? props.published) as ThemeDoc | null);
    if (!base || problems.length === 0) return base;
    return {
      ...base,
      onHandle: () => setAsking(true),
      dialog: asking
        ? {
            type: "confirm" as const,
            tone: "caution" as const,
            message: (
              <div>
                <p>Con estos colores algunos textos no se leerán bien en la web:</p>
                <ul>
                  {problems.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p>¿Quieres publicar igualmente?</p>
              </div>
            ),
            confirmButtonText: "Publicar igualmente",
            cancelButtonText: "Revisar los colores",
            onCancel: () => {
              setAsking(false);
              props.onComplete();
            },
            onConfirm: () => {
              setAsking(false);
              base.onHandle?.();
            },
          }
        : base.dialog,
    };
  }
  PublishWithContrastCheck.action = Publish.action;
  return PublishWithContrastCheck;
}
