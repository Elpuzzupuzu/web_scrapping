// scraperPlaywright.js
import { chromium } from "playwright";

export const runScraperPlaywright = async (robot) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(robot.url, { waitUntil: "domcontentloaded" });

    const scrapedData = {};

    // Iterar sobre los selectores definidos en el robot
    for (const selector of robot.selectors) {
      const { field_name, css_selector } = selector;

      // Obtener elementos y extraer título y url si existen
      const elements = await page.$$(css_selector);

      scrapedData[field_name] = await Promise.all(
        elements.map(async (el) => {
          const titulo = await el.innerText();
          const url = await el.getAttribute("href"); // puede ser null si no tiene href
          return { titulo, url };
        })
      );
    }

    await browser.close();
    return scrapedData;

  } catch (error) {
    await browser.close();
    throw error;
  }
};