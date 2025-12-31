import axios from "axios";
import simpleRewrite from "./phase2_rewrite_fallback.mjs";

const API = "http://localhost:8000/api/articles";

async function run() {
  const { data: articles } = await axios.get(API);

  const article = articles[0]; // take 1 article for demo

  const references = [
    {
      title: "Best AI Chatbots in 2026",
      link: "https://zapier.com/blog/best-ai-chatbot/"
    }
  ];

  const updatedContent = simpleRewrite(article.content, references);

  await axios.put(`${API}/${article.id}`, {
    title: article.title + " (Updated)",
    content: updatedContent,
    is_updated: 1
  });

  console.log("✅ Article updated and published");
}

run();
