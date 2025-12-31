import puppeteer from 'puppeteer';

const URL = 'https://www.beyondchats.com/blog'; // your target page

const browser = await puppeteer.launch({ headless: true, args: ['--ignore-certificate-errors'] });
const page = await browser.newPage();

// Ignore SSL errors
await page.setBypassCSP(true);
await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 0, ignoreHTTPSErrors: true });

const articles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.article-container')).map(article => {
        const title = article.querySelector('.article-title')?.innerText.trim() || 'No title';
        const number = article.querySelector('.article-number')?.innerText.trim() || '0';
        return { title, number };
    });
});

console.log(articles);

await browser.close();
