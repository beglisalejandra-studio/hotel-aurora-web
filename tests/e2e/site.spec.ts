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

test("el menú lleva al contenido de cada sección, justo bajo la cabecera", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const gap = (id: string) =>
    page.evaluate((id) => {
      const s = document.getElementById(id)!;
      const top = s.getBoundingClientRect().top + (parseFloat(getComputedStyle(s).paddingTop) || 0);
      return Math.round(top - document.getElementById("hdr")!.getBoundingClientRect().bottom);
    }, id);
  for (const id of ["habitaciones", "paquetes"]) {
    if (isMobile) await page.locator("#menuBtn").click();
    await page.locator(`#nav > a[href$="#${id}"]`).click();
    // Al terminar el desplazamiento, el contenido queda a menos de 48 px de la cabecera (nunca debajo de ella)
    await expect.poll(() => gap(id), { timeout: 5000 }).toBeGreaterThanOrEqual(10);
    await expect.poll(() => gap(id), { timeout: 5000 }).toBeLessThanOrEqual(48);
  }
});

test("aviso de cookies: Aceptar, Rechazar y Configurar al mismo nivel, nada marcado y se puede cambiar", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const banner = page.getByRole("dialog", { name: /cookies/i });
  await expect(banner).toBeVisible();
  // Los tres botones de la primera capa miden lo mismo (criterio de la AEPD)
  const sizes = await Promise.all(
    ["#ckAccept", "#ckReject", "#ckConfig"].map((s) =>
      page.locator(s).evaluate((e) => {
        const r = e.getBoundingClientRect();
        return `${Math.round(r.width)}x${Math.round(r.height)}`;
      }),
    ),
  );
  expect(new Set(sizes).size, sizes.join(" ")).toBe(1);
  await page.locator("#ckConfig").click();
  await expect(page.locator("#ckAn")).not.toBeChecked();
  await expect(page.locator("#ckMk")).not.toBeChecked();
  // Rechazar guarda la decisión con todo apagado y el aviso no vuelve a salir
  await page.locator("#ckReject").click();
  await expect(banner).toBeHidden();
  const cookie = (await context.cookies()).find((c) => c.name === "consent");
  expect(JSON.parse(decodeURIComponent(cookie?.value ?? "{}"))).toMatchObject({
    analytics: false,
    marketing: false,
  });
  await page.reload();
  await expect(banner).toBeHidden();
  // «Configurar cookies», en el pie, lo vuelve a abrir con la elección guardada para cambiarla
  await page.locator("[data-open-cookies]").scrollIntoViewIfNeeded();
  await page.locator("[data-open-cookies]").click();
  await expect(banner).toBeVisible();
  await expect(page.locator("#ckCfg")).toBeVisible();
  await page.locator("#ckAn").check();
  await page.locator("#ckSave").click();
  await expect(banner).toBeHidden();
  const updated = (await context.cookies()).find((c) => c.name === "consent");
  expect(JSON.parse(decodeURIComponent(updated?.value ?? "{}"))).toMatchObject({
    analytics: true,
    marketing: false,
  });
});
