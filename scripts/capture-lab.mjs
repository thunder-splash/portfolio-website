/**
 * Captures the Lab section screenshots into /public/lab.
 *
 * Two kinds of source:
 *  - "mockup": a local HTML file under scripts/lab-mockups, built to mirror the
 *    real project's layout and palette, filled with synthetic content.
 *  - "live": the project's own UI rendered for real (currently the LZT AutoBuyer
 *    desktop shell, driven by scripts/lzt-stub.mjs).
 *
 * Usage:
 *   node scripts/capture-lab.mjs            # everything
 *   node scripts/capture-lab.mjs tgorg lzt  # only these ids
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { LZT_UI_DIR, lztInitScript } from "./lzt-stub.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mockDir = path.join(__dirname, "lab-mockups");
const outDir = path.join(__dirname, "..", "public", "lab");

const WIDE = { width: 1440, height: 900 };
const PHONE = { width: 420, height: 880 };

/** @type {{id:string, out:string, kind:"mockup"|"live", file?:string, url?:string, viewport:{width:number,height:number}, scale?:number}[]} */
const shots = [
  { id: "tgorg", out: "tgorg", kind: "mockup", file: "tgorg.html", viewport: WIDE },
  { id: "trueprotein", out: "trueprotein", kind: "mockup", file: "trueprotein.html", viewport: WIDE },
  { id: "trueprotein-admin", out: "trueprotein-admin", kind: "mockup", file: "trueprotein-admin.html", viewport: WIDE },
  { id: "keys", out: "keys-reseller", kind: "mockup", file: "keys-reseller.html", viewport: WIDE },
  { id: "otklik", out: "otklikhh", kind: "mockup", file: "otklikhh.html", viewport: WIDE },
  { id: "otklik-app", out: "otklikhh-app", kind: "mockup", file: "otklikhh-app.html", viewport: PHONE },
  { id: "rankevo", out: "rankevo", kind: "mockup", file: "rankevo.html", viewport: WIDE },
  {
    id: "lzt",
    out: "lzt-autobuyer",
    kind: "live",
    url: `file:///${path.join(LZT_UI_DIR, "index.html").replace(/\\/g, "/")}`,
    viewport: { width: 1360, height: 860 },
  },
];

const only = process.argv.slice(2);
const queue = only.length ? shots.filter((s) => only.includes(s.id)) : shots;
if (!queue.length) {
  console.error("nothing to capture; known ids:", shots.map((s) => s.id).join(", "));
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
    deviceScaleFactor: shot.scale ?? 2,
    colorScheme: "dark",
    locale: "ru-RU",
    reducedMotion: "reduce",
  });

  if (shot.kind === "live" && shot.id === "lzt") {
    await context.addInitScript(lztInitScript());
  }

  const page = await context.newPage();
  const url =
    shot.kind === "mockup"
      ? `file:///${path.join(mockDir, shot.file).replace(/\\/g, "/")}`
      : shot.url;

  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(url, { waitUntil: "load" });

  if (shot.kind === "live" && shot.id === "lzt") {
    // the app boots on pywebview's ready event, then polls get_state
    await page.evaluate(() => window.dispatchEvent(new Event("pywebviewready")));
    await page.waitForFunction(
      () => document.querySelectorAll("#feed .fi").length > 0,
      null,
      { timeout: 15000 },
    );
  }

  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const outPath = path.join(outDir, `${shot.out}.png`);
  await page.screenshot({ path: outPath, type: "png" });
  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(
    `captured ${shot.out}.png  ${shot.viewport.width}x${shot.viewport.height}  ${kb}kb` +
      (errors.length ? `  (page errors: ${errors.length})` : ""),
  );
  if (errors.length) console.log("   ", errors.slice(0, 3).join(" | "));

  await context.close();
}

await browser.close();
console.log("done -> public/lab");
