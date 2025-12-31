import axios from 'axios';
import fs from 'fs';

const API_URL = 'http://localhost:8000/api/articles';

// Load scraped articles (change filename if yours differs)
const articles = JSON.parse(fs.readFileSync('./oldest_articles.json', 'utf-8'));

async function seed() {
  for (const article of articles) {
    await axios.post(API_URL, {
      title: article.title,
      content: article.content
    });
    console.log('Inserted:', article.title);
  }
}

seed();
