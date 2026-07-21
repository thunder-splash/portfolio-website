import { chromium } from "playwright";
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const portfolioDir = path.resolve(__dirname, "../public/projects");
const scratchDir = path.resolve(__dirname, "../.demo-screenshots");

const BASE =
  process.env.SPARKORA_URL || "http://localhost:3456/demos/sparkora";
const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const shots = [
  { name: "sp-onboarding", hash: "/onboarding", wait: 1800 },
  { name: "sp-engine", hash: "/engine", wait: 1400 },
  { name: "sp-bridge", hash: "/bridge", wait: 1400 },
  { name: "sp-hub", hash: "/", wait: 2200, seedHome: true },
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
      viewport: { width: 430, height: 900 },
      deviceScaleFactor: 2,
    });
    await context.addInitScript((seedHome) => {
      localStorage.setItem("sparkora_xp", "420");
      if (seedHome) {
        localStorage.setItem("sparkora_demo_first_entry1", "true");
        localStorage.setItem(
          "sparkora_demo_test_state",
          JSON.stringify({ completed: true }),
        );
        localStorage.setItem("sparkora_demo_test_result", "Суперсейвер");
      }
    }, Boolean(shot.seedHome));

    const page = await context.newPage();
    const url = `${BASE}/index.html#${shot.hash}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
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
