import { DEFAULT_PALETTES } from "@/sanity/defaults";
import type { Palette, Theme } from "@/lib/sanity/types";
import { FONT_STACKS } from "./fonts";

const VARS: Record<keyof Palette, string> = {
  background: "--bg",
  surface: "--surface",
  band: "--band",
  ink: "--ink",
  inkSoft: "--ink-2",
  accent: "--accent",
  onAccent: "--on-accent",
};
const HEX = /^#[0-9a-f]{6}$/i;

function block(p: Palette | undefined, mode: "light" | "dark"): string {
  const def = DEFAULT_PALETTES[mode] as Record<string, string>;
  const merged = Object.fromEntries(
    (Object.keys(VARS) as (keyof Palette)[]).map((k) => {
      const v = p?.[k];
      return [k, v && HEX.test(v) ? v : def[k]];
    }),
  ) as Record<keyof Palette, string>;
  const changed = (Object.keys(VARS) as (keyof Palette)[]).some(
    (k) => merged[k].toLowerCase() !== String(def[k]).toLowerCase(),
  );
  if (!changed) return "";
  const own = (Object.keys(VARS) as (keyof Palette)[]).map((k) => `${VARS[k]}:${merged[k]}`);
  // Tonos derivados de los colores elegidos (en la maqueta se fijaron a mano para la paleta original)
  const mix = mode === "light" ? "#000" : "#fff";
  const derived = [
    "--line:color-mix(in srgb,var(--ink) 45%,var(--bg))",
    "--hair:color-mix(in srgb,var(--ink) 16%,var(--bg))",
    `--accent-hover:color-mix(in srgb,var(--accent) 86%,${mix})`,
    "--accent-soft:color-mix(in srgb,var(--accent) 18%,var(--bg))",
    "--slot-hi:color-mix(in srgb,var(--band) 85%,var(--ink))",
    "--slot-lo:color-mix(in srgb,var(--band) 70%,var(--ink))",
  ];
  return [...own, ...derived].join(";");
}

/**
 * Colores y tipografías del panel como variables CSS. Solo se escriben si difieren de los de la maqueta; los valores
 * se validan (hexadecimal, lista cerrada de tipografías), así que el panel no puede inyectar CSS. `html:root` gana a la
 * hoja de la maqueta sin depender del orden en que se cargan.
 */
export function ThemeStyle({ theme }: { theme: Theme }) {
  const light = block(theme?.light, "light");
  const dark = block(theme?.dark, "dark");
  const display = FONT_STACKS[theme?.fontDisplay ?? ""];
  const text =
    theme?.fontText && theme.fontText !== "cormorant" ? FONT_STACKS[theme.fontText] : undefined;
  const fonts = [
    display && theme?.fontDisplay !== "outfit" ? `--f-display:${display}` : "",
    text && theme?.fontText !== "work-sans" ? `--f-text:${text}` : "",
  ].filter(Boolean);
  const css = [
    light || fonts.length ? `html:root{${[light, ...fonts].filter(Boolean).join(";")}}` : "",
    dark
      ? `@media (prefers-color-scheme:dark){html:root:not([data-theme="light"]){${dark};color-scheme:dark}}html:root[data-theme="dark"]{${dark};color-scheme:dark}`
      : "",
  ].join("");
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
