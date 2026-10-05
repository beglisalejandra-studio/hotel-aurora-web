// Verificador de contraste WCAG 2.2 de los tokens de DESIGN.md. Uso: node design/contrast-check.mjs (sale con error si algun par no cumple AA).
const lum = (h) => {
  const c = [1, 3, 5]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const cr = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const T = {
  claro: {
    bg: "#EEF3F2",
    surface: "#F8FBFA",
    s2: "#E2EBEA",
    line: "#C3D2CF",
    fg: "#0C1E2B",
    fg2: "#3B5260",
    fg3: "#4F6672",
    accent: "#C73E1D",
    onAccent: "#FFFFFF",
    accentText: "#B5351A",
  },
  oscuro: {
    bg: "#08171F",
    surface: "#0F2530",
    s2: "#13303C",
    line: "#26434F",
    fg: "#E8F0EF",
    fg2: "#A9BDC0",
    fg3: "#86A0A6",
    accent: "#FF7A59",
    onAccent: "#08171F",
    accentText: "#FF8E70",
  },
};
const pairs = [
  ["texto fg / bg", "fg", "bg", 4.5],
  ["texto fg-2 / bg", "fg2", "bg", 4.5],
  ["texto fg-3 / bg", "fg3", "bg", 4.5],
  ["texto fg-2 / surface", "fg2", "surface", 4.5],
  ["texto fg-3 / surface", "fg3", "surface", 4.5],
  ["texto fg-2 / surface-2", "fg2", "s2", 4.5],
  ["texto fg / surface-2", "fg", "s2", 4.5],
  ["texto fg-3 / surface-2", "fg3", "s2", 4.5],
  ["botón: on-accent / accent", "onAccent", "accent", 4.5],
  ["enlace: accent-text / bg", "accentText", "bg", 4.5],
  ["accent-text / surface", "accentText", "surface", 4.5],
  ["borde de campo fg-3 / surface (no texto, 3:1)", "fg3", "surface", 3],
  ["foco/acento sobre bg (no texto, 3:1)", "accent", "bg", 3],
  ["borde línea / bg (decorativo)", "line", "bg", 1.0],
];
let fails = 0;
for (const [mode, t] of Object.entries(T)) {
  console.log("== " + mode);
  for (const [n, a, b, min] of pairs) {
    const r = cr(t[a], t[b]);
    const ok = r >= min;
    if (!ok) fails++;
    console.log(
      (ok ? "OK   " : "FALLA") + " " + r.toFixed(2).padStart(5) + ":1 (min " + min + ") " + n,
    );
  }
}
// texto blanco sobre la tarjeta acento y sobre el scrim del hero
console.log("tile accent texto blanco / #C73E1D", cr("#FFFFFF", "#C73E1D").toFixed(2));
console.log(
  "texto blanco sobre scrim (peor caso: #14464F con 70% ink)",
  cr("#FFFFFF", "#0E2833").toFixed(2),
);
console.log(fails ? fails + " pares fallan" : "todos los pares cumplen");
process.exit(fails ? 1 : 0);
