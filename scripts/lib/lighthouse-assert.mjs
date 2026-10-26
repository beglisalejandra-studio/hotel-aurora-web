// Lógica PURA de presupuestos de Lighthouse (sin E/S): mediana entre ejecuciones y evaluación de aserciones.
// Formato de aserción compatible con el de Lighthouse CI: "id": ["error" | "warn" | "off", { minScore | maxNumericValue }].
// Falla CERRADO: una métrica ausente o una configuración inválida nunca cuenta como "pasa".

export function median(nums) {
  const v = nums.filter((n) => typeof n === "number" && Number.isFinite(n)).sort((a, b) => a - b);
  if (v.length === 0) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

const LEVELS = new Set(["error", "warn", "off"]);

/** Valida y normaliza el bloque `assertions` del archivo de presupuestos. Lanza Error si es inválido. */
export function parseAssertions(assertions) {
  if (!assertions || typeof assertions !== "object" || Array.isArray(assertions)) {
    throw new Error("`assertions` debe ser un objeto { id: [nivel, límite] }");
  }
  const out = [];
  for (const [id, spec] of Object.entries(assertions)) {
    const [level, limit = {}] = Array.isArray(spec) ? spec : [spec];
    if (!LEVELS.has(level))
      throw new Error(`${id}: nivel inválido '${level}' (error | warn | off)`);
    if (level === "off") continue;
    const isCategory = id.startsWith("categories:");
    const hasMin = typeof limit.minScore === "number";
    const hasMax = typeof limit.maxNumericValue === "number";
    if (hasMin === hasMax)
      throw new Error(`${id}: define exactamente uno de minScore o maxNumericValue`);
    if (isCategory && !hasMin) throw new Error(`${id}: una categoría usa minScore`);
    if (hasMin && (limit.minScore < 0 || limit.minScore > 1))
      throw new Error(`${id}: minScore debe estar entre 0 y 1`);
    if (hasMax && limit.maxNumericValue < 0)
      throw new Error(`${id}: maxNumericValue no puede ser negativo`);
    out.push({
      id,
      level,
      kind: isCategory ? "category" : "audit",
      key: isCategory ? id.slice("categories:".length) : id,
      ...(hasMin
        ? { op: ">=", limit: limit.minScore }
        : { op: "<=", limit: limit.maxNumericValue }),
    });
  }
  return out;
}

/** Valor de una aserción dentro de UN informe (lhr) de Lighthouse. */
function valueFrom(lhr, a) {
  if (a.kind === "category") return lhr?.categories?.[a.key]?.score ?? null;
  return lhr?.audits?.[a.key]?.numericValue ?? null;
}

/**
 * Evalúa las aserciones sobre varias ejecuciones usando la MEDIANA (reduce el ruido entre corridas).
 * Devuelve filas por aserción y las listas de errores/avisos.
 */
export function evaluate(lhrs, assertions) {
  const rows = [];
  for (const a of assertions) {
    const values = lhrs.map((l) => valueFrom(l, a));
    const value = median(values);
    const missing = value === null;
    const pass = !missing && (a.op === ">=" ? value >= a.limit : value <= a.limit);
    rows.push({
      id: a.id,
      level: a.level,
      op: a.op,
      limit: a.limit,
      value,
      runs: values.length,
      pass,
      missing,
    });
  }
  return {
    rows,
    errors: rows.filter((r) => !r.pass && r.level === "error"),
    warnings: rows.filter((r) => !r.pass && r.level === "warn"),
  };
}

const fmt = (id, n) => {
  if (n === null) return "n/d";
  if (id.startsWith("categories:")) return n.toFixed(2);
  if (id === "cumulative-layout-shift") return n.toFixed(3);
  return `${Math.round(n)}`;
};

export function formatRows(rows) {
  const w = Math.max(...rows.map((r) => r.id.length), 10);
  return rows
    .map((r) => {
      const mark = r.pass ? "✓" : r.level === "error" ? "✗" : "⚠";
      const got = r.missing ? "sin dato (Lighthouse no lo midió)" : fmt(r.id, r.value);
      return `  ${mark} ${r.id.padEnd(w)}  ${got.padStart(8)}  (${r.op} ${fmt(r.id, r.limit)})  [${r.level}]`;
    })
    .join("\n");
}
