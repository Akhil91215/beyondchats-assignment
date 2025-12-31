import puppeteer from 'puppeteer';

const URL = 'https://beyondchats.com/blogs/';

// Simple delay function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Adjust your Chrome path
    args: ['--ignore-certificate-errors']
  });

  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait 5 seconds for JavaScript content to load
  await delay(5000);

  const html = await page.content();
  console.log(html.slice(0, 5000)); // print first 5000 chars for inspection

  await browser.close();
}

main();
