/**
 * Smoke-drives a static demo under public/demos and screenshots what it does.
 *   node scripts/probe-demo.mjs autobuyer
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const id = process.argv[2] || "autobuyer";
const demoDir = path.join(__dirname, "..", "public", "demos", id);
const outDir = path.join(__dirname, "..", ".demo-screenshots", "probe");
fs.mkdirSync(outDir, { recursive: true });

const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({
  headless: true,
  executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
  args: ["--allow-file-access-from-files"],
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 820 },
  deviceScaleFactor: 1,
  locale: "ru-RU",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

const url = `file:///${path.join(demoDir, "index.html").replace(/\\/g, "/")}`;
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1500);

const steps = JSON.parse(process.argv[3] || "[]");
await page.screenshot({ path: path.join(outDir, `${id}-0-boot.png`) });

let n = 0;
for (const step of steps) {
  n += 1;
  try {
    if (step.hash) {
      await page.evaluate((h) => { location.hash = h; }, step.hash);
    } else if (step.click) {
      await page.click(step.click, { timeout: 5000 });
    }
    await page.waitForTimeout(step.wait || 900);
    await page.screenshot({
      path: path.join(outDir, `${id}-${n}-${step.name || "step"}.png`),
    });
    console.log(`step ${n} ${step.name || ""} ok`);
  } catch (e) {
    console.log(`step ${n} ${step.name || ""} FAILED: ${String(e).split("\n")[0]}`);
  }
}

console.log(`page errors: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log("  ", e.slice(0, 160)));

await context.close();
await browser.close();
console.log(`done -> ${outDir}`);
