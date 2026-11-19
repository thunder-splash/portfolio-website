/**
 * Captures the Lab card/dialog screenshots straight from the live demos in
 * public/demos, so a preview can never drift from what the demo actually shows.
 *
 *   node scripts/capture-lab.mjs             # everything
 *   node scripts/capture-lab.mjs tgorg lzt   # only these ids
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demosDir = path.join(__dirname, "..", "public", "demos");
const outDir = path.join(__dirname, "..", "public", "lab");

const WIDE = { width: 1440, height: 900 };
const PHONE = { width: 460, height: 900 };

/** @type {{id:string,out:string,demo:string,hash:string,viewport:{width:number,height:number},wait?:number,act?:string}[]} */
const shots = [
  { id: "tgorg", out: "tgorg", demo: "tgorg", hash: "#/catalog", viewport: WIDE },
  { id: "trueprotein", out: "trueprotein", demo: "trueprotein", hash: "#/shop", viewport: WIDE },
  { id: "trueprotein-admin", out: "trueprotein-admin", demo: "trueprotein", hash: "#/admin", viewport: WIDE },
  { id: "keys", out: "keys-reseller", demo: "keys", hash: "#/shop", viewport: WIDE },
  { id: "keys-bot", out: "keys-bot", demo: "keys", hash: "#/bot", viewport: PHONE, wait: 1600 },
  { id: "otklik", out: "otklikhh", demo: "otklik", hash: "#/console", viewport: WIDE },
  { id: "otklik-app", out: "otklikhh-app", demo: "otklik", hash: "#/app", viewport: PHONE },
  { id: "rankevo", out: "rankevo", demo: "rankevo", hash: "#/queue", viewport: WIDE },
  { id: "rankevo-board", out: "rankevo-board", demo: "rankevo", hash: "#/board", viewport: WIDE },
  { id: "lzt", out: "lzt-autobuyer", demo: "autobuyer", hash: "#/dash",
    viewport: { width: 1360, height: 860 }, wait: 2000 },
];

const only = process.argv.slice(2);
const queue = only.length ? shots.filter((s) => only.includes(s.id)) : shots;
if (!queue.length) {
  console.error("nothing to capture; ids:", shots.map((s) => s.id).join(", "));
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await chromium.launch({
  headless: true,
  executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
  args: ["--allow-file-access-from-files", "--font-render-hinting=none"],
});

for (const shot of queue) {
  const context = await browser.newContext({
    viewport: shot.viewport,
    deviceScaleFactor: 2,
    colorScheme: "dark",
    locale: "ru-RU",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  const file = path.join(demosDir, shot.demo, "index.html").replace(/\\/g, "/");
  await page.goto(`file:///${file}${shot.hash}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(shot.wait ?? 900);

  const out = path.join(outDir, `${shot.out}.png`);
  await page.screenshot({ path: out, type: "png" });
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(
    `${shot.out}.png  ${shot.viewport.width}x${shot.viewport.height}  ${kb}kb` +
      (errors.length ? `  (errors: ${errors.length})` : ""),
  );
  if (errors.length) console.log("   ", errors.slice(0, 2).join(" | "));

  await context.close();
}

await browser.close();
console.log("done -> public/lab");
