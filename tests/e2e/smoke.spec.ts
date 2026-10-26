import { expect, test } from "@playwright/test";

test.describe("base del sitio", () => {
  test("la home carga, tiene h1, lang y título", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", /^[a-z]{2}/);
    await expect(page).toHaveTitle(/.+/);
  });

  test("cabeceras de seguridad presentes", async ({ request }) => {
    const h = (await request.get("/")).headers();
    expect(h["x-content-type-options"]).toBe("nosniff");
    // Solo el propio dominio puede enmarcar la web (lo usa el editor visual del panel)
    expect(h["x-frame-options"]).toBe("SAMEORIGIN");
    expect(h["referrer-policy"]).toBeTruthy();
    expect(h["content-security-policy"]).toMatch(/default-src 'self'/);
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("entornos no productivos NO se indexan (cabecera + robots.txt)", async ({ request }) => {
    const env = process.env.NEXT_PUBLIC_SITE_ENV ?? "development";
    test.skip(env === "production", "solo aplica a preview/staging/desarrollo");
    expect((await request.get("/")).headers()["x-robots-tag"]).toMatch(/noindex/);
    expect(await (await request.get("/robots.txt")).text()).toMatch(/Disallow: \//);
  });

  test("sitemap.xml existe", async ({ request }) => {
    const r = await request.get("/sitemap.xml");
    expect(r.status()).toBe(200);
    expect(await r.text()).toContain("<urlset");
  });

  test("404 real con página propia", async ({ page }) => {
    const res = await page.goto("/esta-ruta-no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/no encontrada/i);
  });
});
