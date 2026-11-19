export type LabAccent = "cyan" | "emerald" | "violet" | "amber" | "blue";

export type LabShot = {
  src: string;
  /** wide = 16:10 desktop capture, phone = tall mobile capture */
  kind: "wide" | "phone";
};

export type LabProject = {
  id: string;
  name: string;
  year: string;
  accent: LabAccent;
  /** short technology list shown on the card (first 3) and in the modal (all) */
  stack: readonly string[];
  shots: readonly LabShot[];
  /** three compact figures shown in the modal */
  figures: readonly { id: string; value: string }[];
};

/**
 * Personal / client-side projects outside the employment timeline.
 * Copy (title, pitch, bullets) lives in the dictionaries so it stays translated.
 */
export const labProjects: readonly LabProject[] = [
  {
    id: "tgorg",
    name: "tgorg",
    year: "2026",
    accent: "emerald",
    stack: [
      "Next.js",
      "Hono",
      "PostgreSQL",
      "Drizzle",
      "Meilisearch",
      "BullMQ",
      "Turborepo",
      "Docker",
    ],
    shots: [{ src: "/lab/tgorg.png", kind: "wide" }],
    figures: [
      { id: "surface", value: "3 apps" },
      { id: "search", value: "Meili" },
      { id: "deploy", value: "CI/CD" },
    ],
  },
  {
    id: "trueprotein",
    name: "True Protein",
    year: "2026",
    accent: "blue",
    stack: [
      "Next.js 15",
      "Prisma",
      "PostgreSQL",
      "grammY",
      "Tailwind",
      "Zod",
    ],
    shots: [
      { src: "/lab/trueprotein.png", kind: "wide" },
      { src: "/lab/trueprotein-admin.png", kind: "wide" },
    ],
    figures: [
      { id: "catalog", value: "412" },
      { id: "surface", value: "3 in 1" },
      { id: "migration", value: "Tilda →" },
    ],
  },
  {
    id: "keys",
    name: "Keys Reseller",
    year: "2026",
    accent: "emerald",
    stack: [
      "Turborepo",
      "Fastify",
      "Prisma",
      "BullMQ",
      "grammY",
      "Next.js",
      "HMAC SDK",
    ],
    shots: [{ src: "/lab/keys-reseller.png", kind: "wide" }],
    figures: [
      { id: "delivery", value: "~11 s" },
      { id: "packages", value: "6 pkg" },
      { id: "payments", value: "crypto" },
    ],
  },
  {
    id: "otklik",
    name: "OtklikHH",
    year: "2026",
    accent: "cyan",
    stack: [
      "Bun",
      "Hono",
      "grammY",
      "Playwright",
      "Drizzle",
      "SQLite",
      "Docker",
    ],
    shots: [
      { src: "/lab/otklikhh.png", kind: "wide" },
      { src: "/lab/otklikhh-app.png", kind: "phone" },
    ],
    figures: [
      { id: "batch", value: "50 / run" },
      { id: "surface", value: "5 apps" },
      { id: "packages", value: "8 pkg" },
    ],
  },
  {
    id: "rankevo",
    name: "Rankevo",
    year: "2025 — 2026",
    accent: "amber",
    stack: [
      "Python",
      "Flask",
      "APScheduler",
      "Claude API",
      "Playwright",
      "React 19",
      "Vite",
      "pytest",
    ],
    shots: [{ src: "/lab/rankevo.png", kind: "wide" }],
    figures: [
      { id: "sources", value: "20" },
      { id: "scoring", value: "config" },
      { id: "tests", value: "pytest" },
    ],
  },
  {
    id: "autobuyer",
    name: "LZT AutoBuyer",
    year: "2026",
    accent: "violet",
    stack: [
      "Python",
      "pywebview",
      "httpx",
      "OAuth2",
      "Telegram API",
      "IMAP",
      "PyInstaller",
    ],
    shots: [{ src: "/lab/lzt-autobuyer.png", kind: "wide" }],
    figures: [
      { id: "uptime", value: "24/7" },
      { id: "rate", value: "adaptive" },
      { id: "ship", value: ".exe" },
    ],
  },
] as const;

export const labProjectIds = labProjects.map((p) => p.id);
