#!/usr/bin/env node
// Lighthouse con presupuestos. Sustituye a @lhci/cli (su árbol de dependencias arrastra advisories "high" sin arreglo).
// Usa el paquete oficial `lighthouse` (versión exacta en package.json) y evalúa lighthouse.budgets.json con la mediana de N corridas.
//
//   npm run lighthouse                          arranca `next start` (hace falta `npm run build` antes) y mide
//   LIGHTHOUSE_URL=https://preview.ejemplo.com npm run lighthouse      mide un despliegue existente (sin servidor local)
//   LIGHTHOUSE_CONFIG=otro.json · PORT=3100 · CHROME_PATH=/ruta/chrome · CHROME_NO_SANDBOX=1 (contenedores como root)
//
// Salida: 0 = presupuestos cumplidos (los avisos no fallan) · 1 = incumple alguno en nivel "error" · 2 = no se pudo medir.
import { spawn } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { evaluate, formatRows, parseAssertions } from "./lib/lighthouse-assert.mjs";

const cwd = process.cwd();
const OUT = path.join(cwd, ".lighthouseci");
const CATEGORIES = "performance,accessibility,best-practices,seo";

const infra = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(2);
};

let cfg;
try {
  cfg = JSON.parse(
    fs.readFileSync(
      path.resolve(cwd, process.env.LIGHTHOUSE_CONFIG ?? "lighthouse.budgets.json"),
      "utf8",
    ),
  );
} catch (e) {
  infra(`No se pudo leer lighthouse.budgets.json: ${e.message}`);
}
const runs = Number.isInteger(cfg.runs) && cfg.runs >= 1 && cfg.runs <= 7 ? cfg.runs : 3;
const urls = Array.isArray(cfg.urls) && cfg.urls.length ? cfg.urls : ["/"];
if (!urls.every((u) => typeof u === "string" && u.startsWith("/") && !u.startsWith("//"))) {
  infra(
    "`urls` solo admite rutas relativas que empiecen por '/' (la base se define con LIGHTHOUSE_URL o el servidor local).",
  );
}
let assertions;
try {
  assertions = parseAssertions(cfg.assertions);
} catch (e) {
  infra(`Presupuestos inválidos: ${e.message}`);
}

const binLink = path.join(cwd, "node_modules", ".bin", "lighthouse");
if (!fs.existsSync(binLink)) infra("Falta `lighthouse`. Ejecuta: npm ci --ignore-scripts");
const lighthouseCli = fs.realpathSync(binLink);

const noSandbox = process.env.CHROME_NO_SANDBOX === "1" || process.env.CI === "true";
const chromeFlags = ["--headless=new", ...(noSandbox ? ["--no-sandbox"] : [])].join(" ");

let server = null;
// El servidor va en su propio grupo de procesos: `next start` lanza un hijo (next-server) y matar solo al padre lo deja huérfano.
const stopServer = () => {
  if (!server?.pid) return;
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    /* ya terminó */
  }
  server = null;
};
process.on("exit", stopServer);
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => process.exit(130));

// Lighthouse corre como hijo ASÍNCRONO (con spawnSync el bucle de eventos queda bloqueado y una señal no se atiende hasta terminar).
// SIGINT al hijo: su CLI lo interpreta cerrando el Chrome que lanzó.
let current = null;
process.on("exit", () => current?.kill("SIGINT"));
function runLighthouse(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, {
      cwd,
      env: process.env,
      stdio: ["ignore", "ignore", "pipe"],
    });
    current = child;
    let stderr = "";
    child.stderr.on("data", (d) => (stderr = (stderr + d).slice(-2000)));
    const timer = setTimeout(() => child.kill("SIGINT"), 180_000);
    child.on("error", (e) => {
      clearTimeout(timer);
      current = null;
      resolve({ status: -1, stderr: e.message });
    });
    child.on("close", (status) => {
      clearTimeout(timer);
      current = null;
      resolve({ status, stderr });
    });
  });
}

async function ready(base, ms) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    try {
      const r = await fetch(base, {
        signal: AbortSignal.timeout(3000),
        redirect: "manual",
      });
      if (r.status < 500) return true;
    } catch {
      /* aún arrancando */
    }
    await sleep(500);
  }
  return false;
}

let base = process.env.LIGHTHOUSE_URL?.replace(/\/+$/, "");
if (!base) {
  const port = Number(process.env.PORT ?? 3000);
  let nextBin;
  try {
    nextBin = createRequire(path.join(cwd, "package.json")).resolve("next/dist/bin/next");
  } catch {
    infra("No se encontró `next`. Ejecuta: npm ci --ignore-scripts");
  }
  if (!fs.existsSync(path.join(cwd, ".next")))
    infra("No hay build de producción. Ejecuta primero: npm run build");
  base = `http://127.0.0.1:${port}`;
  server = spawn(
    process.execPath,
    [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    { cwd, stdio: "ignore", detached: true },
  );
  server.on("error", (e) => infra(`No se pudo arrancar el servidor: ${e.message}`));
}
if (!(await ready(base, 60_000)))
  infra(`El sitio no responde en ${base} (60 s). ¿Puerto ocupado o build fallido?`);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const lhrs = [];
for (const [ui, p] of urls.entries()) {
  for (let i = 1; i <= runs; i++) {
    const file = path.join(OUT, `lhr-${ui}-${i}.json`);
    process.stdout.write(`  · ${p} (corrida ${i}/${runs})… `);
    const r = await runLighthouse([
      lighthouseCli,
      base + p,
      "--output=json",
      `--output-path=${file}`,
      `--only-categories=${CATEGORIES}`,
      `--chrome-flags=${chromeFlags}`,
      "--quiet",
    ]);
    if (r.status !== 0 || !fs.existsSync(file)) {
      console.log("falló");
      infra(
        `Lighthouse no pudo medir ${p}: ${(r.stderr || "sin salida").trim().split("\n").slice(-3).join(" | ")}\n  ¿Hay Chrome/Chromium? Define CHROME_PATH (y CHROME_NO_SANDBOX=1 si ejecutas como root en un contenedor).`,
      );
    }
    lhrs.push({ url: p, lhr: JSON.parse(fs.readFileSync(file, "utf8")) });
    console.log("ok");
  }
}

let failed = 0;
const summary = [];
for (const p of urls) {
  const result = evaluate(
    lhrs.filter((x) => x.url === p).map((x) => x.lhr),
    assertions,
  );
  console.log(`\n${p}  (mediana de ${runs})\n${formatRows(result.rows)}`);
  failed += result.errors.length;
  const noindex = lhrs.some((x) => x.url === p && x.lhr?.audits?.["is-crawlable"]?.score === 0);
  if (noindex && result.rows.some((r) => r.id === "categories:seo" && !r.pass)) {
    console.log(
      "  ℹ La página lleva noindex. Es lo correcto fuera de producción; para medir el SEO real construye y sirve con NEXT_PUBLIC_SITE_ENV=production (el CI ya lo hace).",
    );
  }
  summary.push({ url: p, runs, rows: result.rows });
}
fs.writeFileSync(
  path.join(OUT, "summary.json"),
  JSON.stringify({ base, chromeFlags, summary }, null, 2) + "\n",
);

stopServer();
if (failed) {
  console.error(
    `\n✗ ${failed} presupuesto(s) en nivel "error" incumplidos. Informes en .lighthouseci/`,
  );
  process.exit(1);
}
console.log("\n✓ Presupuestos de Lighthouse cumplidos. Informes en .lighthouseci/");
process.exit(0);
