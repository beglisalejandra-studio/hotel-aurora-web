// Contraste WCAG 2.2 de las tres paletas de Hotel Aurora (una paleta = cuatro horas del día).
// Uso: node design/palette-check.mjs   (sale con código 1 si alguna hora falla AA 4.5:1)
// b = campo de fondo, f = texto principal, g = texto secundario. Mantener en sincronía con
// creative/mockup/index.html (variables --b1..4, --f1..4, --g1..4) y con DESIGN.md §2.
const lum = (h) => {
  const c = [1, 3, 5]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

export const PALETTES = {
  luz: {
    b: ["#FFC4DE", "#F2F964", "#FF8D6A", "#150A3C"],
    f: ["#0A0A0A", "#0A0A0A", "#0A0A0A", "#F7F5FF"],
    g: ["#4A2F3B", "#3D3E19", "#4A2216", "#C9C3E6"],
  },
  fachadas: {
    b: ["#C90362", "#F9C230", "#EC672A", "#0E47CA"],
    f: ["#FFF7FA", "#15110E", "#15110E", "#FFFFFF"],
    g: ["#FFE3EF", "#4A3A0A", "#3A1604", "#C7D6FA"],
  },
  anil: {
    b: ["#EEF0FB", "#CDD1F8", "#7C83EC", "#2B2FB8"],
    f: ["#1A1D8C", "#14186E", "#0B0E4A", "#FFFFFF"],
    g: ["#4A4EB0", "#3C40A0", "#12154F", "#D2D5F6"],
  },
};

let fails = 0;
for (const [name, p] of Object.entries(PALETTES)) {
  console.log(`== ${name}`);
  p.b.forEach((b, i) => {
    const main = ratio(p.f[i], b);
    const second = ratio(p.g[i], b);
    const ok = main >= 4.5 && second >= 4.5;
    if (!ok) fails++;
    // El «sol» (color de la hora siguiente) es decorativo y lleva borde del color de texto: solo informativo.
    const next = p.b[Math.min(i + 1, 3)];
    console.log(
      `${ok ? "OK   " : "FALLA"} hora ${i + 1} ${b}  texto ${p.f[i]} ${main.toFixed(2)}:1 | secundario ${p.g[i]} ${second.toFixed(2)}:1 | sol ${next} vs campo ${ratio(next, b).toFixed(2)}:1`,
    );
  });
}
console.log(fails ? `${fails} horas fallan` : "todas las horas cumplen AA (texto y secundario)");
process.exit(fails ? 1 : 0);
