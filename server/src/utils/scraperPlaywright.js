import { chromium } from "playwright";

export const runScraperPlaywright = async (robot) => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Ir a la URL y esperar a que cargue todo el JS
    await page.goto(robot.url, { waitUntil: "networkidle" });

    const results = {};

    for (const selector of robot.selectors) {
      results[selector.field_name] = await page.$$eval(
        selector.css_selector,
        elements => elements.map(el => el.textContent.trim())
      );
    }

    await browser.close();
    return results;

  } catch (error) {
    await browser.close();
    throw new Error("Error scraping Playwright: " + error.message);
  }
};