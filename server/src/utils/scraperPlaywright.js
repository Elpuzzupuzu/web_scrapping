import { chromium } from "playwright";

export const runScraperPlaywright = async (robot) => {
  // Añadimos un User-Agent de un navegador real para evitar bloqueos
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  });
  const page = await context.newPage();

  try {
    // Cambiamos a 'domcontentloaded' porque Amazon nunca deja la red inactiva (networkidle)
    await page.goto(robot.url, { 
      waitUntil: "domcontentloaded", 
      timeout: 60000 
    });

    const scrapedData = {};

    for (const selector of robot.selectors) {
      let { field_name, css_selector } = selector;

      // Normalización: si el usuario olvidó el punto en una clase, lo intentamos corregir
      // Ejemplo: "a-offscreen" -> ".a-offscreen"
      if (!css_selector.startsWith('.') && !css_selector.startsWith('#') && css_selector.includes('-')) {
        css_selector = `.${css_selector}`;
      }

      try {
        // Esperamos un máximo de 10 segundos a que el elemento aparezca
        await page.waitForSelector(css_selector, { timeout: 10000 });
        
        const elements = await page.$$(css_selector);

        scrapedData[field_name] = await Promise.all(
          elements.map(async (el) => {
            const textContent = await el.innerText();
            const titulo = textContent ? textContent.trim() : "Sin texto";
            const url = await el.getAttribute("href");
            return { titulo, url };
          })
        );
      } catch (e) {
        console.warn(`⚠️ No se encontró o tardó demasiado el selector: "${css_selector}"`);
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