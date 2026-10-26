import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const path of ["/", "/en", "/habitaciones/faro", "/privacidad", "/esta-ruta-no-existe"]) {
  test(`axe: ${path} sin violaciones serias o críticas (WCAG 2.2 AA)`, async ({ page }) => {
    await page.goto(path);
    // Se mide el estado final de todo el contenido, no un fotograma a medio fundido: se muestran ya las entradas que
    // aparecen al hacer scroll y se espera a que todo (también el aviso de cookies) esté del todo visible.
    await page.waitForFunction(() => document.documentElement.classList.contains("rv-on"));
    // cv-off: sin content-visibility, para que las secciones de abajo se pinten (y se puedan medir) ya
    await page.evaluate(() => {
      document.documentElement.classList.add("cv-off");
      document.querySelectorAll(".rv").forEach((e) => e.classList.add("in"));
    });
    await expect
      .poll(() =>
        page.evaluate(() =>
          [...document.querySelectorAll(".rv, .cookie")].every((e) => {
            const cs = getComputedStyle(e);
            return cs.display === "none" || cs.opacity === "1";
          }),
        ),
      )
      .toBe(true);
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(
      serious,
      JSON.stringify(
        serious.map((v) => ({ id: v.id, nodes: v.nodes.length })),
        null,
        2,
      ),
    ).toEqual([]);
  });
}

test("teclado: el primer foco es el enlace 'saltar al contenido' y lleva al <main>", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /saltar al contenido/i });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("movimiento reducido: la hoja de estilos apaga animaciones", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const dur = await page.evaluate(() => getComputedStyle(document.body).transitionDuration);
  expect(["0.01ms", "1e-05s", "0s"]).toContain(dur);
});
