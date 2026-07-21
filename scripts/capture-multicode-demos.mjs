import { chromium } from "playwright";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const portfolioDir = path.resolve(__dirname, "../public/projects");
const scratchDir = path.resolve(__dirname, "../.demo-screenshots");

const BASE = process.env.DEMO_URL || "http://localhost:3456";
const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const shots = [
  {
    name: "furniture-shop",
    url: `${BASE}/demos/forma/index.html#/`,
    wait: 1600,
  },
  {
    name: "hierarchy-dnd",
    url: `${BASE}/demos/meridian/index.html#/tree`,
    wait: 1600,
  },
  {
    name: "axioma",
    url: `${BASE}/demos/axioma/index.html#/workbench`,
    wait: 1600,
  },
  {
    name: "axioma-admin",
    url: `${BASE}/demos/axioma/index.html#/admin`,
    wait: 1600,
  },
  {
    name: "mochi",
    url: `${BASE}/demos/mochi/index.html#/`,
    wait: 1800,
  },
];

async function main() {
  await mkdir(scratchDir, { recursive: true });
  await mkdir(portfolioDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
  });

  for (const shot of shots) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto(shot.url, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(shot.wait);
    const file = path.join(scratchDir, `${shot.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    await copyFile(file, path.join(portfolioDir, `${shot.name}.png`));
    console.log("captured", shot.name);
    await context.close();
  }

  await browser.close();
  console.log("done →", portfolioDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
