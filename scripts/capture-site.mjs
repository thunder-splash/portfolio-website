/**
 * Full-page capture of the running site, for reviewing the whole layout.
 *   npm start   (in another shell)
 *   node scripts/capture-site.mjs [baseUrl] [path]
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", ".demo-screenshots", "site");
const base = process.argv[2] || "http://localhost:3000";
const route = process.argv[3] || "/";

const views = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

fs.mkdirSync(outDir, { recursive: true });

const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({
  headless: true,
  executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
});

for (let i = 0; i < 90; i++) {
  try {
    const res = await fetch(base, { signal: AbortSignal.timeout(3000) });
    if (res.ok) break;
  } catch {
    /* booting */
  }
  await new Promise((r) => setTimeout(r, 2000));
}

for (const v of views) {
  const context = await browser.newContext({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(base + route, { waitUntil: "networkidle", timeout: 60000 });

  // walk the page so every scroll-triggered animation has fired
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += window.innerHeight / 2) {
      window.scrollTo({ top: y, behavior: "instant" });
      await wait(160);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await wait(400);
  });
  await page.waitForTimeout(800);

  const file = path.join(
    outDir,
    `${route.replace(/\W+/g, "") || "home"}-${v.name}.png`,
  );
  await page.screenshot({ path: file, fullPage: true });
  const kb = Math.round(fs.statSync(file).size / 1024);
  console.log(`${v.name.padEnd(8)} ${path.basename(file)}  ${kb}kb`);
  await context.close();
}

await browser.close();
console.log(`done -> ${outDir}`);
