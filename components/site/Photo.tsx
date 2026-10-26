import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n/config";
import { tr } from "@/lib/i18n/text";
import { resolveImage, sanityLoader } from "@/lib/sanity/image";
import type { Img } from "@/lib/sanity/types";

type Props = {
  img: Img;
  lang: Locale;
  /** `sizes` en escritorio y en móvil (la foto móvil se usa por debajo de `breakpoint`). */
  sizes: string;
  mobileSizes?: string;
  breakpoint?: number;
  /** Foto principal de la página (LCP): se pide la primera y sin carga diferida. */
  priority?: boolean;
  /** Duplicado visual (p. ej. las hojas de la puerta): sin texto alternativo para no repetirlo. */
  decorative?: boolean;
  quality?: number;
};

/**
 * Foto con dirección de arte: la versión móvil del panel es otra composición, no un recorte de la de escritorio
 * (regla de la persona). Se pinta a sangre dentro de su hueco (`.slot`), con el punto de interés elegido en el panel.
 */
export function Photo({
  img,
  lang,
  sizes,
  mobileSizes,
  breakpoint = 767,
  priority,
  decorative,
  quality,
}: Props) {
  const d = resolveImage(img?.desktop);
  if (!d) return null;
  const m = resolveImage(img?.mobile);
  const alt = decorative ? "" : tr(img?.alt, lang);
  const common = {
    alt,
    loader: sanityLoader,
    quality,
    ...(priority ? { fetchPriority: "high" as const, loading: "eager" as const } : {}),
  };
  const desk = getImageProps({
    ...common,
    src: d.src,
    width: d.width,
    height: d.height,
    sizes,
  }).props;
  const mob = m
    ? getImageProps({
        ...common,
        src: m.src,
        width: m.width,
        height: m.height,
        sizes: mobileSizes ?? sizes,
      }).props
    : null;
  const pos = (m && d.position) || d.position;
  const style: CSSProperties | undefined = d.position ? { objectPosition: d.position } : undefined;
  return (
    <picture className="fill">
      {mob && (
        <source
          media={`(max-width: ${breakpoint}px)`}
          srcSet={mob.srcSet}
          sizes={mob.sizes}
          width={mob.width}
          height={mob.height}
        />
      )}
      <img
        {...desk}
        alt={alt}
        style={pos ? { ...desk.style, ...style } : desk.style}
        {...(decorative ? { "aria-hidden": true } : {})}
      />
    </picture>
  );
}
