import { Fragment, type CSSProperties } from "react";
import { accentParts, kineticWords } from "@/lib/i18n/text";

/** Titular con la parte entre asteriscos en color de acento. */
export function Accent({ text }: { text: string }) {
  return (
    <>
      {accentParts(text.replace(/\|/g, " ")).map((p, i) =>
        p.accent ? (
          <span key={i} className="acc">
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

/**
 * Texto que entra palabra a palabra con el scroll (misma salida que el script de la maqueta, pero desde el servidor:
 * se lee sin JavaScript y no salta al cargar).
 */
export function Kinetic({ text }: { text: string }) {
  const { lines } = kineticWords(text);
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && (
            <>
              {" "}
              <br />
            </>
          )}
          {line.map((w, wi) => (
            <Fragment key={w.i}>
              {wi > 0 && " "}
              <span className={w.accent ? "kw acc" : "kw"}>
                <span className="kwi" style={{ "--i": w.i } as CSSProperties}>
                  {w.w}
                </span>
              </span>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
}

export const kineticStyle = (text: string) =>
  ({ "--n": kineticWords(text).count }) as CSSProperties;
