#!/usr/bin/env node
// Aplica un módulo opcional de la plantilla a un proyecto.  node apply-module.mjs <módulo> [--dir .] [--dry-run] | --list
import path from 'node:path';
import { applyModule, listModules } from './lib/modules.mjs';
import { resolveAsset } from './lib/util.mjs';

const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : d);
const templateDir = resolveAsset('template');
const name = argv.find((a) => !a.startsWith('--') && a !== opt('--dir'));

if (argv.includes('--list') || !name) {
  console.log(`Módulos disponibles: ${listModules(templateDir).join(', ') || '(ninguno: falta la plantilla del sistema)'}\nUso: node apply-module.mjs <módulo> [--dir .] [--dry-run]`);
  process.exit(name || argv.includes('--list') ? 0 : 2);
}
try {
  const r = applyModule({ projectDir: path.resolve(opt('--dir', '.')), name, templateDir, dryRun: argv.includes('--dry-run') });
  console.log(`${argv.includes('--dry-run') ? '(dry-run) ' : '✓ '}módulo ${r.module}`);
  console.log(`  archivos nuevos: ${r.written.length}${r.written.length ? ` (${r.written.join(', ')})` : ''}`);
  if (r.replaced.length) console.log(`  archivos reemplazados: ${r.replaced.join(', ')}`);
  if (r.depsAdded.length) console.log(`  dependencias añadidas a package.json: ${r.depsAdded.join(', ')}  → ejecuta: npm install --ignore-scripts`);
  if (r.envAdded.length) console.log(`  variables añadidas a .env.example: ${r.envAdded.join(', ')}  → configura los VALORES como secretos del proveedor de despliegue, no en el repo`);
  for (const n of r.notes) console.log(`  ⚠ ${n}`);
  console.log(`  documentación: docs/modules/${r.module}.md`);
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
