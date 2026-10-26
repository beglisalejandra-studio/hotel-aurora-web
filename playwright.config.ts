import { defineConfig, devices } from "@playwright/test";

// CHROME_PATH: usa un Chromium ya instalado (p. ej. entornos cloud). En CI se instala con `npx playwright install chromium`.
// CHROME_NO_SANDBOX=1: necesario si se ejecuta como root dentro de un contenedor.
const launchOptions = {
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  ...(process.env.CHROME_NO_SANDBOX === "1" ? { args: ["--no-sandbox"] } : {}),
};

const port = Number(process.env.PORT ?? 3000);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions } },
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions } },
    // Navegadores adicionales (Firefox, Safari/WebKit, iPhone): `npx playwright install firefox webkit` y `npm run e2e:cross`.
    ...(process.env.CROSS_BROWSER
      ? [
          { name: "firefox", use: { ...devices["Desktop Firefox"] } },
          { name: "webkit", use: { ...devices["Desktop Safari"] } },
          { name: "iphone", use: { ...devices["iPhone 14"] } },
        ]
      : []),
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
        url: `http://127.0.0.1:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        // Deja ver la interfaz del editor visual con el contenido publicado (sin token) en tests/e2e/editor.spec.ts
        env: {
          ...(Object.fromEntries(
            Object.entries(process.env).filter(([, v]) => v !== undefined),
          ) as Record<string, string>),
          SANITY_PREVIEW_ALLOW_PUBLISHED: "1",
        },
      },
});
