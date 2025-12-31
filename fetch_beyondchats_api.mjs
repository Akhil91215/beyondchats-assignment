// fetch_beyondchats_api.mjs
import fetch from 'node-fetch';

// Base API endpoint for WordPress posts
const BASE_URL = 'https://beyondchats.com/wp-json/wp/v2/posts';

async function fetchAllPosts() {
  let page = 1;
  const perPage = 100; // maximum allowed per WP REST API
  let allPosts = [];

  while (true) {
    const url = `${BASE_URL}?per_page=${perPage}&page=${page}`;
    
    console.log(`Fetching: ${url}`);
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // some servers require UA
      }
    });

    if (!response.ok) {
      // stop when no more pages
      console.log(`Finished with status: ${response.status}`);
      break;
    }

    const posts = await response.json();
    if (posts.length === 0) break;

    allPosts.push(...posts);
    page++;
  }

  return allPosts;
}

(async () => {
  try {
    const posts = await fetchAllPosts();

    const simplified = posts.map(post => ({
      title: post.title?.rendered || '',
      url: post.link || ''
    }));

    console.log(simplified);
  } catch (err) {
    console.error('Error fetching posts:', err);
  }
})();

