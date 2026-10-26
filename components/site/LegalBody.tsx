import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import type { Locale } from "@/lib/i18n/config";
import { ui } from "@/lib/i18n/ui";

const textOf = (b: PortableTextBlock) =>
  ((b.children as { text?: string }[] | undefined) ?? []).map((c) => c.text ?? "").join("");

/**
 * Texto legal del panel con índice: cada titular de nivel 2 se vuelve un apartado enlazable, como en la maqueta.
 * Los enlaces del panel que apuntan a otra web se abren aparte.
 */
export function LegalBody({
  blocks,
  lang,
  prefix,
}: {
  blocks: PortableTextBlock[];
  lang: Locale;
  prefix: string;
}) {
  const t = ui(lang);
  const heads = blocks.filter((b) => b._type === "block" && b.style === "h2");
  const idOf = new Map(heads.map((b, i) => [b._key, `${prefix}-${i}`]));
  const components: PortableTextComponents = {
    block: {
      h2: ({ children, value }) => <h2 id={idOf.get(value._key)}>{children}</h2>,
    },
    marks: {
      link: ({ children, value }) => {
        const href = String((value as { href?: string })?.href ?? "");
        const ext = /^https?:\/\//.test(href);
        return (
          <a href={href} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>
            {children}
          </a>
        );
      },
    },
  };
  return (
    <>
      {heads.length > 2 && (
        <nav className="legal-toc" aria-label={t.onThisPage}>
          <p>{t.onThisPage}</p>
          <ol>
            {heads.map((b) => (
              <li key={b._key}>
                <a href={`#${idOf.get(b._key)}`}>{textOf(b)}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="legal-sec prose">
        <PortableText value={blocks} components={components} />
      </div>
    </>
  );
}
