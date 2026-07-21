import { chromium } from 'playwright';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const portfolioDir = path.resolve(__dirname, '../public/projects');
const scratchDir = path.resolve(__dirname, '../.demo-screenshots');

const BASE = process.env.DEMO_URL || 'http://localhost:5179';
const chromePath =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const shots = [
  { name: 'ft-orders', route: '/orders', wait: 1400 },
  { name: 'ft-filters', route: '/orders', wait: 900, openFilters: true },
  { name: 'ft-object', route: '/objects/obj-riverside', wait: 1600 },
  { name: 'ft-rooms', route: '/objects/obj-riverside/rooms', wait: 1600 },
  { name: 'ft-tickets', route: '/tickets/tkt-501', wait: 2000 },
  { name: 'ft-reviews', route: '/reviews', wait: 1400 },
];

async function main() {
  await mkdir(scratchDir, { recursive: true });
  await mkdir(portfolioDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  await page.addInitScript(() => {
    localStorage.setItem('access_token', 'demo-access-token');
    localStorage.setItem('refresh_token', 'demo-refresh-token');
    localStorage.setItem('device_fingerprint', 'demo-fingerprint');
  });

  for (const shot of shots) {
    await page.goto(`${BASE}${shot.route}`, {
      waitUntil: 'networkidle',
      timeout: 90000,
    });
    await page.waitForTimeout(shot.wait);

    if (shot.openFilters) {
      const filterBtn = page.getByRole('button', { name: /фильтр/i }).first();
      if ((await filterBtn.count()) > 0) {
        await filterBtn.click();
        await page.waitForTimeout(600);
      }
    }

    const file = path.join(scratchDir, `${shot.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    await copyFile(file, path.join(portfolioDir, `${shot.name}.png`));
    console.log('captured', shot.name);
  }

  await browser.close();
  console.log('done →', portfolioDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
