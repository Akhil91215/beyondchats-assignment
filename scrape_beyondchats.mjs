// scrape_beyondchats_full.mjs
import puppeteer from 'puppeteer';

const URL = 'https://beyondchats.com/blogs/';

async function scrapeBeyondChats() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Adjust Chrome path if needed
    args: ['--ignore-certificate-errors', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set user-agent to mimic a normal browser
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
  );

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000, ignoreHTTPSErrors: true });

  // Scroll to bottom to load all blog posts (lazy loading)
  let previousHeight;
  try {
    while (true) {
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForTimeout(2000); // wait for loading
      let newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === previousHeight) break;
    }
  } catch (err) {
    console.log('Scrolling finished');
  }

  // Extract articles
  const articles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.blog-post-card')).map(article => {
      const title = article.querySelector('.blog-post-title')?.innerText.trim() || 'No title';
      const number = article.querySelector('.views-count')?.innerText.trim() || 'N/A';
      return { title, number };
    });
  });

  console.log(articles);

  await browser.close();
}

scrapeBeyondChats();
