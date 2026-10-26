import { expect, test } from "@playwright/test";

/** Comportamientos de la web real (los de la maqueta aprobada) y la regla de privacidad de la persona. */

test("navegar no conecta con terceros: ninguna petición fuera del propio dominio", async ({
  page,
  baseURL,
}) => {
  const own = new URL(baseURL ?? "http://127.0.0.1").host;
  const outside: string[] = [];
  page.on("request", (r) => {
    const host = new URL(r.url()).host;
    if (host && host !== own && !r.url().startsWith("data:")) outside.push(r.url());
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForLoadState("networkidle");
  expect(outside, outside.join("\n")).toEqual([]);
});

test("cambiar de idioma lleva a la misma página en inglés", async ({ page }) => {
  await page.goto("/habitaciones/alba");
  const en = page.locator("[data-lang=en]:visible").first();
  if (!(await en.isVisible())) await page.locator("#menuBtn").click();
  await page.locator("[data-lang=en]:visible").first().click();
  await expect(page).toHaveURL(/\/en\/habitaciones\/alba$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toContainText(/room/i);
});

test("la solicitud de mesa valida en el navegador antes de enviar", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-open-request=table]").first().click();
  const dialog = page.getByRole("dialog", { name: /solicitar mesa/i });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: /enviar solicitud/i }).click();
  await expect(dialog.locator("#q-name")).toHaveAttribute("aria-invalid", "true");
  await expect(dialog.locator("#q-consent-e")).not.toBeEmpty();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("el mapa propio se acerca y se aleja con + y −", async ({ page }) => {
  await page.goto("/#llegar");
  await page.locator("#map").scrollIntoViewIfNeeded();
  // El pin queda en el centro al acercar sobre el centro: lo que cambia es la escala de las teselas visibles
  const scale = () =>
    page
      .locator("#map .map-lv.on")
      .first()
      .evaluate((e) => /scale\(([\d.]+)\)/.exec(e.style.transform)?.[1] ?? "");
  const before = await scale();
  await page.getByRole("button", { name: /acercar el mapa/i }).click();
  await expect.poll(scale).not.toBe(before);
  await expect(page.getByRole("button", { name: /alejar el mapa/i })).toBeEnabled();
});

test("las páginas legales y de habitación existen en los dos idiomas", async ({ request }) => {
  for (const path of [
    "/privacidad",
    "/en/privacidad",
    "/condiciones",
    "/habitaciones/faro",
    "/en/habitaciones/faro",
  ]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
  const r = await request.get("/es/condiciones", { maxRedirects: 0 });
  expect(r.status()).toBe(308);
  expect(r.headers().location).toMatch(/\/condiciones$/);
});
