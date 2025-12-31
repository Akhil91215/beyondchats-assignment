// phase2.mjs
import axios from 'axios';
import * as cheerio from 'cheerio';
import googleIt from 'google-it';
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: 'your_openai_api_key_here'
});



// Replace with your Phase 1 API endpoint
const PHASE1_API = 'http://localhost:8000/api/articles'; 
const UPDATE_API = 'http://localhost:8000/api/articles'; // POST/PUT endpoint

async function fetchArticles() {
  const res = await axios.get(PHASE1_API);
  return res.data;
}

async function searchGoogle(title) {
  const results = await googleIt({ query: title });
  // Filter top 2 links that look like articles/blogs
  const links = results
    .map(r => r.link)
    .filter(link => link.includes('http'))
    .slice(0, 2);
  return links;
}

async function scrapeContent(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Attempt to grab main content
    const article = $('article').text() || $('main').text() || $('body').text();
    return article.replace(/\s+/g, ' ').trim();
  } catch (err) {
    console.error('Scrape failed for:', url);
    return '';
  }
}

async function rewriteArticle(originalTitle, originalContent, refContents, refLinks) {
  const prompt = `
You are an expert content writer.  
Original article title: "${originalTitle}"  
Original content: "${originalContent}"  

Use the content from the following references to rewrite and improve the original article.  
Reference contents: ${refContents.join('\n\n')}  

Write a polished, well-formatted article, and cite references at the bottom like this:
References:
1. URL1
2. URL2
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-5.1-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1500,
  });

  return response.choices[0].message.content;
}

async function updateArticle(articleId, updatedContent) {
  try {
    await axios.put(`${UPDATE_API}/${articleId}`, {
      content: updatedContent,
    });
    console.log(`Updated article ${articleId}`);
  } catch (err) {
    console.error('Failed to update article:', articleId, err.message);
  }
}

async function main() {
  const articles = await fetchArticles();

  for (const article of articles) {
    console.log('Processing:', article.title);

    const links = await searchGoogle(article.title);
    const contents = [];

    for (const link of links) {
      const content = await scrapeContent(link);
      contents.push(content);
    }

    const updated = await rewriteArticle(article.title, article.content || '', contents, links);

    // Add references at the bottom
    const finalContent = `${updated}\n\nReferences:\n${links.map((l, i) => `${i + 1}. ${l}`).join('\n')}`;

    await updateArticle(article.id, finalContent);
  }
}

main().catch(console.error);
