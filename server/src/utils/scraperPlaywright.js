import { chromium } from "playwright";

export const runScraperPlaywright = async (robot) => {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  // 🔒 Evitar detección básica de bot
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
  });

  const page = await context.newPage();

  try {
    await page.goto(robot.url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const scrapedData = {};

    for (const selector of robot.selectors) {
      let { field_name, css_selector } = selector;

      // Normalización automática de clases mal escritas
      if (
        !css_selector.startsWith(".") &&
        !css_selector.startsWith("#") &&
        css_selector.includes("-")
      ) {
        css_selector = `.${css_selector}`;
      }

      try {
        await page.waitForSelector(css_selector, { timeout: 10000 });

        const elements = await page.$$(css_selector);

        scrapedData[field_name] = await Promise.all(
          elements.map(async (el) => {
            const tagName = await el.evaluate((e) =>
              e.tagName.toLowerCase()
            );

            // 🖼️ IMÁGENES
            if (tagName === "img") {
              const imageUrl =
                (await el.getAttribute("data-old-hires")) ||
                (await el.getAttribute("data-src")) ||
                (await el.getAttribute("src"));

              return {
                titulo: "Imagen",
                url: imageUrl,
              };
            }

            // 🔗 ENLACES
            if (tagName === "a") {
              const textContent = await el.innerText();
              const href = await el.getAttribute("href");

              return {
                titulo: textContent
                  ? textContent.trim()
                  : "Sin texto",
                url: href,
              };
            }

            // 📝 TEXTO NORMAL (span, h1, div, etc.)
            const textContent = await el.innerText();

            return {
              titulo: textContent
                ? textContent.trim()
                : "Sin texto",
              url: null,
            };
          })
        );
      } catch (e) {
        console.warn(
          `⚠️ No se encontró o tardó demasiado el selector: "${css_selector}"`
        );
        scrapedData[field_name] = [];
      }
    }

    await browser.close();
    return scrapedData;

  } catch (error) {
    await browser.close();
    console.error("❌ Error crítico en el scraper:", error);
    throw error;
  }
};