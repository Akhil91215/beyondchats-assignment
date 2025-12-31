import axios from 'axios';

const API_URL = 'http://localhost:8000/api/articles';

async function fetchArticles() {
  const res = await axios.get(API_URL);
  console.log(res.data);
}

fetchArticles();
