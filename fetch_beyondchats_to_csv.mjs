import fs from 'fs';
import fetch from 'node-fetch';

const BASE_URL = 'https://beyondchats.com/wp-json/wp/v2/posts';

async function fetchAllPosts() {
  let page = 1;
  const perPage = 100;
  let allPosts = [];

  while (true) {
    const url = `${BASE_URL}?per_page=${perPage}&page=${page}`;
    console.log(`Fetching: ${url}`);
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
    });

    if (!res.ok) break; // Stop if no more pages

    const posts = await res.json();
    if (posts.length === 0) break; // No more posts

    allPosts.push(...posts);
    page++;
  }

  return allPosts;
}

(async () => {
  try {
    const posts = await fetchAllPosts();

    // Prepare CSV content
    const simplified = posts.map(p =>
      `"${p.title.rendered.replace(/"/g, '""')}","${p.link}"`
    );
    const csv = 'Title,URL\n' + simplified.join('\n');

    // Save CSV file
    fs.writeFileSync('beyondchats_blogs.csv', csv);
    console.log('Saved CSV with', posts.length, 'posts.');
  } catch (err) {
    console.error('Error fetching posts:', err);
  }
})();
