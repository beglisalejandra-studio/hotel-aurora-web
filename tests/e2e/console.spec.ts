import { expect, test } from "@playwright/test";

/**
 * Guardia de "consola limpia": ningún error de consola, excepción de página, recurso fallido ni violación de CSP
 * al cargar la home. Atrapa cosas que un ojo humano no ve (favicon 404, código que exige 'unsafe-eval', etc.).
 * Añade aquí las rutas nuevas importantes del proyecto.
 */
const ROUTES = ["/", "/en", "/habitaciones/alba", "/privacidad"];

for (const route of ROUTES) {
  test(`consola limpia y sin violaciones de CSP: ${route}`, async ({ page }) => {
    const problems: string[] = [];

    await page.addInitScript(() => {
      document.addEventListener("securitypolicyviolation", (e) =>
        console.error(`CSP ${e.violatedDirective} bloqueó ${e.blockedURI} (${e.sourceFile ?? ""})`),
      );
    });
    page.on("console", (m) => {
      if (m.type() === "error") problems.push(`console.error: ${m.text()}`);
    });
    page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
    page.on("response", (r) => {
      if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`);
    });

    await page.goto(route, { waitUntil: "networkidle" });
    expect(problems, problems.join("\n")).toEqual([]);
  });
}
