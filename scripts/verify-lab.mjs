/**
 * Renders the running site and checks the Lab section at several breakpoints:
 * the grid, the case dialog and the live-demo playground.
 * Artifacts land in .demo-screenshots/lab-check.
 *
 *   npm start                      # in another shell
 *   node scripts/verify-lab.mjs [baseUrl]
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", ".demo-screenshots", "lab-check");
const base = process.argv[2] || "http://localhost:3000";

const breakpoints = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1180, height: 820 },
  { name: "tablet", width: 834, height: 1112 },
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

for (const bp of breakpoints) {
  const context = await browser.newContext({
    viewport: { width: bp.width, height: bp.height },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  await page.goto(`${base}/#lab`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForSelector("#lab", { timeout: 30000 });

  // walk the section so every scroll-triggered card animates in
  await page.evaluate(async () => {
    const section = document.querySelector("#lab");
    if (!section) return;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const { top, height } = section.getBoundingClientRect();
    const start = window.scrollY + top;
    for (let y = 0; y <= height; y += window.innerHeight / 2) {
      window.scrollTo({ top: start + y, behavior: "instant" });
      await wait(220);
    }
    window.scrollTo({ top: start, behavior: "instant" });
    await wait(400);
  });
  await page.waitForTimeout(900);

  await page
    .locator("#lab")
    .screenshot({ path: path.join(outDir, `lab-${bp.name}.png`) });

  // 1. case dialog
  await page.locator('#lab [data-detail], #lab button:has-text("Подробно")').first()
    .click({ timeout: 5000 })
    .catch(async () => {
      await page.locator("#lab button").nth(1).click({ timeout: 5000 });
    });
  await page.waitForSelector('[role="dialog"]', { timeout: 10000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(outDir, `dialog-${bp.name}.png`) });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // 2. live demo playground, opened from a card cover
  await page.locator("#lab button").first().click({ timeout: 5000 });
  const frame = await page
    .waitForSelector("iframe", { timeout: 15000 })
    .catch(() => null);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: path.join(outDir, `demo-${bp.name}.png`) });

  const overflow = await page.evaluate(() => {
    const el = document.scrollingElement;
    return el ? el.scrollWidth - el.clientWidth : 0;
  });

  console.log(
    `${bp.name.padEnd(8)} ${String(bp.width).padStart(4)}px  ` +
      `h-overflow:${overflow}px  iframe:${frame ? "yes" : "NO"}  errors:${errors.length}`,
  );
  if (errors.length) console.log("   ", errors.slice(0, 2).join(" | "));

  await context.close();
}

await browser.close();
console.log(`done -> ${outDir}`);
