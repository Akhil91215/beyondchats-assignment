import { getJson } from "serpapi";

const SERP_API_KEY = "f58ab6c066239db9f416b2cc96ead8cd8a7a542cc710c6ccabb8c2295cf7819d";

async function searchGoogle(query) {
  return new Promise((resolve, reject) => {
    getJson(
      {
        engine: "google",
        q: query,
        api_key: SERP_API_KEY,
        num: 5,
      },
      (json) => {
        if (!json.organic_results) {
          return resolve([]);
        }

        const articles = json.organic_results
          .filter(r => r.link && !r.link.includes("beyondchats.com"))
          .slice(0, 2)
          .map(r => ({
            title: r.title,
            link: r.link
          }));

        resolve(articles);
      }
    );
  });
}

(async () => {
  const results = await searchGoogle("Choosing the right AI chatbot");
  console.log("SERP RESULTS:\n", results);
})();
