import fs from "node:fs";
import { expect, test } from "@playwright/test";

/**
 * Editor visual del panel («Editar la web»). La vista previa se abre con el modo borrador de Next; aquí se activa con
 * la cookie de la propia compilación (en el panel la pone /api/draft-mode/enable tras comprobar el secreto). La barra
 * de cada sección solo aparece dentro del panel, así que aquí se comprueba lo que la web pinta para el editor.
 */
const previewId = () =>
  (
    JSON.parse(fs.readFileSync(".next/prerender-manifest.json", "utf8")) as {
      preview: { previewModeId: string };
    }
  ).preview.previewModeId;

test("la web pública no lleva nada del editor", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".ed-sec")).toHaveCount(0);
  await expect(page.locator("[data-sanity]")).toHaveCount(0);
  await expect(page.locator(".ed-add")).toHaveCount(0);
});

test("en la vista previa del panel cada sección es editable y hay «+ Añadir»", async ({
  page,
  context,
  baseURL,
}) => {
  await context.addCookies([{ name: "__prerender_bypass", value: previewId(), url: baseURL }]);
  await page.goto("/");
  const sections = page.locator("main > .ed-sec");
  await expect(sections.first()).toBeAttached();
  const n = await sections.count();
  expect(n).toBeGreaterThan(5);
  // Cada sección conectada con su sitio en la página del panel
  await expect(page.locator("main > .ed-sec > .ed-target[data-sanity]")).toHaveCount(n);
  // Añadir habitación, paquete y pregunta
  for (const type of ["room", "offer", "faq"]) {
    await expect(page.locator(`a.ed-add[href="/admin/intent/create/type=${type}/"]`)).toHaveCount(
      1,
    );
  }
  // Sin aviso de cookies ni contacto flotante tapando la vista
  await expect(page.locator(".cookie")).toBeHidden();
  await expect(page.locator(".dock")).toBeHidden();
  // Nada queda invisible esperando al scroll
  const hiddenReveals = await page.evaluate(
    () =>
      [...document.querySelectorAll(".rv")].filter((e) => getComputedStyle(e).opacity !== "1")
        .length,
  );
  expect(hiddenReveals).toBe(0);
});
