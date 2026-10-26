import type { PaletteKey } from "./lib/contrast";

/** Colores aprobados en la maqueta (DESIGN.md). Son el valor inicial del panel y el respaldo de la web si el panel no responde. */
export const DEFAULT_PALETTES: Record<"light" | "dark", Record<PaletteKey, string>> = {
  light: {
    background: "#EDF0F1",
    surface: "#F7F8F8",
    band: "#E1E7E9",
    ink: "#16202A",
    inkSoft: "#46535F",
    accent: "#B9431A",
    onAccent: "#FFFFFF",
  },
  dark: {
    background: "#11181F",
    surface: "#1A242D",
    band: "#162029",
    ink: "#E8ECEE",
    inkSoft: "#A9B4BD",
    accent: "#F0794A",
    onAccent: "#1A0F09",
  },
};
