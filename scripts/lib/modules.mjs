// Módulos opcionales de la plantilla (formularios, pagos, CMS, analítica…). Se aplican de forma atómica y reversible:
// primero se valida TODO (conflictos, nombre, ya aplicado) y solo entonces se escribe.
// Estructura de un módulo:  modules/<nombre>/{module.json, MODULE.md, files/**}
//   module.json: { description, dependencies?, devDependencies?, env?: [{name, comment}], replace?: [rutas permitidas a sobrescribir], notes?: [] }
import fs from 'node:fs';
import path from 'node:path';
import { readJson, walk, writeFileEnsured } from './util.mjs';

export function listModules(templateDir) {
  const d = path.join(templateDir, 'modules');
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory() && fs.existsSync(path.join(d, e.name, 'module.json'))).map((e) => e.name);
}

/** Devuelve los módulos pedidos + sus dependencias (`requires`), con cada dependencia ANTES de quien la necesita. */
export function resolveOrder(templateDir, names) {
  const out = [];
  const visiting = new Set();
  const visit = (n) => {
    if (out.includes(n)) return;
    if (visiting.has(n)) throw new Error(`Dependencia circular entre módulos (${n})`);
    visiting.add(n);
    const meta = readJson(path.join(templateDir, 'modules', n, 'module.json'));
    if (!meta) throw new Error(`Módulo '${n}' no existe (disponibles: ${listModules(templateDir).join(', ')})`);
    for (const r of meta.requires ?? []) visit(r);
    visiting.delete(n);
    out.push(n);
  };
  names.forEach(visit);
  return out;
}

export function applyModule({ projectDir, name, templateDir, dryRun = false }) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) throw new Error(`Nombre de módulo no válido: ${name}`);
  const modDir = path.join(templateDir, 'modules', name);
  const meta = readJson(path.join(modDir, 'module.json'));
  if (!meta) throw new Error(`Módulo '${name}' no existe (disponibles: ${listModules(templateDir).join(', ') || 'ninguno'})`);

  const stateFile = path.join(projectDir, '.web-os', 'project.json');
  const state = readJson(stateFile, {});
  if ((state.modules ?? []).includes(name)) throw new Error(`El módulo '${name}' ya está aplicado`);
  const missingReq = (meta.requires ?? []).filter((r) => !(state.modules ?? []).includes(r));
  if (missingReq.length) throw new Error(`El módulo '${name}' requiere aplicar antes: ${missingReq.join(', ')}`);

  const filesDir = path.join(modDir, 'files');
  const rels = fs.existsSync(filesDir) ? walk(filesDir) : [];
  const allowReplace = new Set(meta.replace ?? []);
  const conflicts = rels.filter((r) => fs.existsSync(path.join(projectDir, r)) && !allowReplace.has(r));
  if (conflicts.length) throw new Error(`Conflicto: ya existen ${conflicts.join(', ')} (no se sobrescribe). Revísalos antes de aplicar '${name}'.`);

  const pkgPath = path.join(projectDir, 'package.json');
  const pkg = readJson(pkgPath);
  if ((meta.dependencies || meta.devDependencies) && !pkg) throw new Error('El proyecto no tiene package.json válido');

  const result = { module: name, written: [], replaced: [], depsAdded: [], depsKept: [], envAdded: [], notes: meta.notes ?? [] };
  for (const r of rels) (fs.existsSync(path.join(projectDir, r)) ? result.replaced : result.written).push(r);

  for (const [field, deps] of [['dependencies', meta.dependencies], ['devDependencies', meta.devDependencies]]) {
    for (const [dep, ver] of Object.entries(deps ?? {})) {
      const cur = pkg[field]?.[dep] ?? pkg.dependencies?.[dep] ?? pkg.devDependencies?.[dep];
      if (cur) result.depsKept.push(`${dep}@${cur}`);
      else result.depsAdded.push(`${dep}@${ver}`);
    }
  }

  const envPath = path.join(projectDir, '.env.example');
  const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const envNew = (meta.env ?? []).filter((e) => !new RegExp(`^${e.name}=`, 'm').test(envText));
  result.envAdded = envNew.map((e) => e.name);

  if (dryRun) return result;

  for (const r of rels) {
    const to = path.join(projectDir, r);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(filesDir, r), to);
  }
  for (const [field, deps] of [['dependencies', meta.dependencies], ['devDependencies', meta.devDependencies]]) {
    for (const [dep, ver] of Object.entries(deps ?? {})) {
      if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) continue;
      pkg[field] ??= {};
      pkg[field][dep] = ver;
    }
    if (pkg[field]) pkg[field] = Object.fromEntries(Object.entries(pkg[field]).sort(([a], [b]) => a.localeCompare(b)));
  }
  if (meta.dependencies || meta.devDependencies) fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  if (envNew.length) {
    const block = `\n# --- módulo ${name} ---\n${envNew.map((e) => `${e.comment ? `# ${e.comment}\n` : ''}${e.name}=`).join('\n')}\n`;
    fs.writeFileSync(envPath, envText.replace(/\n*$/, '\n') + block);
  }
  if (fs.existsSync(path.join(modDir, 'MODULE.md'))) {
    const doc = path.join(projectDir, 'docs', 'modules', `${name}.md`);
    fs.mkdirSync(path.dirname(doc), { recursive: true });
    fs.copyFileSync(path.join(modDir, 'MODULE.md'), doc);
  }
  state.modules = [...(state.modules ?? []), name];
  writeFileEnsured(stateFile, JSON.stringify(state, null, 2) + '\n');
  return result;
}
