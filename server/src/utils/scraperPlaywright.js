import { chromium, errors } from "playwright";

export const runScraperPlaywright = async (robot) => {

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"]
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    viewport: { width: 1280, height: 800 }
  });

  // evitar detección básica
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false
    });
  });

  const page = await context.newPage();

  // bloquear recursos innecesarios
  await page.route("**/*", (route) => {
    const type = route.request().resourceType();

    if (
      type === "image" ||
      type === "media" ||
      type === "font" ||
      route.request().url().includes("ads") ||
      route.request().url().includes("tracking")
    ) {
      return route.abort();
    }

    route.continue();
  });

  page.on("requestfailed", (request) => {
    console.warn("🌐 Request falló:", request.url());
  });

  try {

    let url = robot.url?.trim();

    if (!url) {
      throw new Error("❌ URL vacía");
    }

    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    console.log("🌍 Navegando a:", url);

    let response;

    // 🔁 reintento automático
    for (let i = 1; i <= 3; i++) {
      try {

        response = await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 60000
        });

        if (!response || !response.ok()) {
          throw new Error(`Status ${response?.status()}`);
        }

        console.log(`✅ Página cargada (${response.status()})`);
        break;

      } catch (error) {

        console.warn(`⚠️ Intento ${i} fallido`);

        if (i === 3) throw error;

        await page.waitForTimeout(3000);
      }
    }

    // esperar elemento clave de Amazon
    try {
      await page.waitForSelector("#productTitle", { timeout: 15000 });
      console.log("✅ Página de producto detectada");
    } catch {
      console.warn("⚠️ No se detectó #productTitle");
    }

    const scrapedData = {};

    for (const selector of robot.selectors) {

      let { field_name, css_selector } = selector;

      console.log(`🔎 Buscando selector: ${css_selector}`);

      try {

        const startTime = Date.now();

        await page.waitForSelector(css_selector, {
          timeout: 10000
        });

        const loadTime = Date.now() - startTime;

        console.log(`✅ Selector encontrado en ${loadTime}ms`);

        const elements = await page.$$(css_selector);

        scrapedData[field_name] = await Promise.all(
          elements.map(async (el) => {

            const tagName = await el.evaluate((e) =>
              e.tagName.toLowerCase()
            );

            if (tagName === "img") {

              const imageUrl =
                (await el.getAttribute("data-old-hires")) ||
                (await el.getAttribute("data-src")) ||
                (await el.getAttribute("src"));

              return {
                titulo: "Imagen",
                url: imageUrl
              };
            }

            if (tagName === "a") {

              const text = await el.innerText();
              const href = await el.getAttribute("href");

              return {
                titulo: text ? text.trim() : "Sin texto",
                url: href
              };
            }

            const text = await el.innerText();

            return {
              titulo: text ? text.trim() : "Sin texto",
              url: null
            };
          })
        );

      } catch (error) {

        if (error instanceof errors.TimeoutError) {

          console.warn(`⏱️ Timeout selector: ${css_selector}`);

          const exists = await page.$(css_selector);

          if (!exists) {
            console.warn(`❌ Selector no existe en DOM`);
          } else {
            console.warn(`⚠️ Existe pero no apareció a tiempo`);
          }

        } else {

          console.error(`❌ Error inesperado`, error);

        }

        scrapedData[field_name] = [];
      }
    }

    await browser.close();

    console.log("🏁 Scraping finalizado");

    return scrapedData;

  } catch (error) {

    console.error("❌ Error crítico:", error);

    try {
      await page.screenshot({ path: "scraper_error.png" });
      console.log("📸 Screenshot guardado: scraper_error.png");
    } catch {}

    await browser.close();

    throw error;
  }
};