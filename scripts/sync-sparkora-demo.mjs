import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const portfolioRoot = path.resolve(__dirname, "..");
const sparkoraRoot =
  process.env.SPARKORA_ROOT ||
  path.resolve("c:/Users/shtep/Downloads/profoodsharing/profoodsharing");
const outDir = path.join(portfolioRoot, "public", "demos", "sparkora");

if (!existsSync(sparkoraRoot)) {
  console.error("Sparkora root not found:", sparkoraRoot);
  process.exit(1);
}

console.log("Building Sparkora demo…");
const build = spawnSync("npm", ["run", "build:demo"], {
  cwd: sparkoraRoot,
  stdio: "inherit",
  shell: true,
  env: { ...process.env },
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const dist = path.join(sparkoraRoot, "dist");
if (!existsSync(dist)) {
  console.error("dist missing after build");
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(path.dirname(outDir), { recursive: true });
cpSync(dist, outDir, { recursive: true });
console.log("Synced demo →", outDir);
