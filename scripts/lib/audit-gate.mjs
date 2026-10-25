// Puerta de auditoría de dependencias: estricta con lo nuevo, transparente con lo que no tiene arreglo.
// Entrada: salidas JSON de `npm audit` (todo y solo producción) y una lista de excepciones DOCUMENTADAS con caducidad.
//   - Un aviso de producción >= umbral SIEMPRE falla salvo excepción vigente.
//   - Un aviso de desarrollo >= umbral falla salvo excepción vigente.
//   - Una excepción caducada falla (obliga a revisarla); una excepción sin aviso asociado solo avisa (retírala).
// Sin dependencias; la E/S la hace el script CLI.

const RANK = { info: 0, low: 1, moderate: 2, high: 3, critical: 4 };

/** Avisos (no paquetes arrastrados) de un `npm audit --json`: [{ghsa, pkg, severity, title, url}]. */
export function advisoriesOf(audit) {
  const out = new Map();
  for (const [pkg, v] of Object.entries(audit?.vulnerabilities ?? {})) {
    for (const via of v.via ?? []) {
      if (typeof via === 'string') continue; // dependencia vulnerable por arrastre: el aviso real está en otro paquete
      const ghsa = /GHSA-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}/i.exec(via.url ?? '')?.[0]?.toUpperCase() ?? `npm:${via.source ?? via.name}`;
      const key = `${ghsa}|${via.name ?? pkg}`;
      out.set(key, { ghsa, pkg: via.name ?? pkg, severity: via.severity, title: via.title, url: via.url, range: via.range });
    }
  }
  return [...out.values()];
}

export function validateExceptions(list) {
  if (!Array.isArray(list)) throw new Error('`exceptions` debe ser una lista');
  for (const e of list) {
    if (!/^GHSA-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}$/i.test(e.ghsa ?? '')) throw new Error(`excepción sin GHSA válido: ${JSON.stringify(e).slice(0, 80)}`);
    if (!e.package || !e.reason || String(e.reason).length < 20) throw new Error(`${e.ghsa}: falta package o una razón útil (mín. 20 caracteres)`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.expires ?? '') || Number.isNaN(Date.parse(e.expires))) throw new Error(`${e.ghsa}: 'expires' debe ser AAAA-MM-DD`);
    if (e.scope && !['dev', 'prod'].includes(e.scope)) throw new Error(`${e.ghsa}: scope debe ser dev o prod`);
  }
  return list;
}

/**
 * @param {{all:object, prod:object, exceptions?:Array, now?:number, threshold?:string}} p
 * @returns {{ok:boolean, failures:string[], warnings:string[], accepted:string[], summary:object}}
 */
export function evaluateAudit({ all, prod, exceptions = [], now = Date.now(), threshold = 'high' }) {
  validateExceptions(exceptions);
  const min = RANK[threshold] ?? RANK.high;
  const prodAdv = advisoriesOf(prod);
  const prodKeys = new Set(prodAdv.map((a) => `${a.ghsa}|${a.pkg}`));
  const allAdv = advisoriesOf(all);
  const failures = [];
  const warnings = [];
  const accepted = [];
  const used = new Set();

  const byGhsa = (a) => exceptions.find((e) => e.ghsa.toUpperCase() === a.ghsa && e.package === a.pkg);

  for (const a of allAdv) {
    if ((RANK[a.severity] ?? 0) < min) continue;
    const isProd = prodKeys.has(`${a.ghsa}|${a.pkg}`);
    const scope = isProd ? 'producción' : 'desarrollo';
    const ex = byGhsa(a);
    const label = `${a.ghsa} · ${a.pkg} (${a.severity}, ${scope}): ${a.title}`;
    if (!ex) {
      failures.push(`SIN excepción: ${label}`);
      continue;
    }
    used.add(ex.ghsa.toUpperCase() + '|' + ex.package);
    if (Date.parse(`${ex.expires}T23:59:59Z`) < now) {
      failures.push(`excepción CADUCADA el ${ex.expires}: ${label} — revísala (¿ya hay versión corregida?) y renueva con motivo o retírala`);
      continue;
    }
    if (isProd && ex.scope !== 'prod') {
      failures.push(`la excepción de ${ex.ghsa} es solo para desarrollo pero el aviso afecta a PRODUCCIÓN: ${label}`);
      continue;
    }
    accepted.push(`${label} — aceptado hasta ${ex.expires}: ${ex.reason}`);
  }
  for (const e of exceptions) {
    if (!used.has(e.ghsa.toUpperCase() + '|' + e.package)) warnings.push(`la excepción ${e.ghsa} (${e.package}) ya no corresponde a ningún aviso: retírala de config/audit-exceptions.json`);
  }
  return {
    ok: failures.length === 0,
    failures,
    warnings,
    accepted,
    summary: { threshold, production: prodAdv.filter((a) => (RANK[a.severity] ?? 0) >= min).length, total: allAdv.filter((a) => (RANK[a.severity] ?? 0) >= min).length },
  };
}
