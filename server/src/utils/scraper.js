import axios from "axios";
import cheerio from "cheerio";

export const runScraper = async (robot) => {
  const response = await axios.get(robot.url);
  const $ = cheerio.load(response.data);

  const results = {};

  robot.selectors.forEach(selector => {
    results[selector.field_name] = [];

    $(selector.css_selector).each((i, el) => {
      results[selector.field_name].push($(el).text().trim());
    });
  });

  return results;
};