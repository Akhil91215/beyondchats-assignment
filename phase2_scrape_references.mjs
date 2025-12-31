import axios from "axios";
import * as cheerio from "cheerio";

// External links from SerpAPI
const links = [
  "https://zapier.com/blog/best-ai-chatbot/",
  "https://www.pcmag.com/picks/the-best-ai-chatbots"
];

async function scrape(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Try common tags for article content
    let text = "";
    $("article p").each((_, el) => {
      text += $(el).text() + "\n";
    });

    // Fallback if no <article> found
    if (!text.trim()) {
      $("p").each((_, el) => {
        text += $(el).text() + "\n";
      });
    }

    console.log(`\n--- CONTENT FROM: ${url} ---\n`);
    console.log(text.slice(0, 500)); // first 500 chars preview
  } catch (err) {
    console.error("Failed to scrape:", url, err.message);
  }
}

async function main() {
  for (const url of links) {
    await scrape(url);
  }
}

main();
