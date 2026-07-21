import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mockupsDir = path.join(__dirname, "mockups");
const outDir = path.join(__dirname, "..", "public", "projects");

const files = [
  "axioma",
  "axioma-admin",
  "furniture-shop",
  "hierarchy-dnd",
  "mvp-factory",
];

fs.mkdirSync(outDir, { recursive: true });

const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({
  headless: true,
  executablePath: chromePath,
});

const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
});

for (const name of files) {
  const htmlPath = path.join(mockupsDir, `${name}.html`);
  const outPath = path.join(outDir, `${name}.png`);
  const url = `file:///${htmlPath.replace(/\\/g, "/")}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.screenshot({ path: outPath, type: "png" });
  console.log("captured", name);
}

await browser.close();
console.log("done → public/projects");
