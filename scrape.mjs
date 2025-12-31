import axios from "axios";
import { load } from "cheerio";

async function fetchArticleContent(url) {
  const res = await axios.get(url);
  const $ = load(res.data);
  return $("article").text().trim();
}

async function scrapeOldestFive() {
  const url = "https://beyondchats.com/blogs/";
  const response = await axios.get(url);
  const $ = load(response.data);

  const articles = [];

  $("article").slice(0, 5).each((i, el) => {
    const title = $(el).find("h2").text().trim();
    const link = $(el).find("a").attr("href");
    articles.push({ title, link });
  });

  for (let article of articles) {
    article.content = await fetchArticleContent(article.link);
    console.log(article.title, "→", article.content.length);
  }
}

scrapeOldestFive();
