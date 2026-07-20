export const profile = {
  name: "Alexey Shuganov",
  stackLine: "React / TypeScript / Node.js",
  location: "Minsk, Belarus",
  email: "shtepadip@mail.ru",
  telegram: "@pantsoffortune",
  phone: "+375 (99) 989-58-57",
  socials: {
    github: "https://github.com/thunder-splash",
    telegram: "https://t.me/pantsoffortune",
    email: "mailto:shtepadip@mail.ru",
  },
} as const;

export const techCategories = [
  {
    id: "ai",
    accent: "cyan" as const,
    span: "md:col-span-2 md:row-span-2",
    skills: [
      "OpenAI API",
      "Bolt.new",
      "Lovable",
      "Cursor",
      "Copilot",
      "Prompt Eng.",
      "Agent Pipelines",
    ],
  },
  {
    id: "frontend",
    accent: "emerald" as const,
    span: "md:col-span-2",
    skills: [
      "React 19",
      "Next.js",
      "React Native",
      "TypeScript",
      "Redux",
      "MobX",
      "Zustand",
      "Reatom",
    ],
  },
  {
    id: "backend",
    accent: "blue" as const,
    span: "md:col-span-1",
    skills: ["Node.js", "REST", "GraphQL", "PostgreSQL"],
  },
  {
    id: "uiux",
    accent: "violet" as const,
    span: "md:col-span-1",
    skills: ["MUI", "Framer Motion", "Tailwind", "Responsive"],
  },
  {
    id: "devops",
    accent: "slate" as const,
    span: "md:col-span-2",
    skills: ["Vite", "Webpack", "Docker", "Git", "CI/CD", "Linux"],
  },
] as const;

export const metrics = [
  { id: "years", value: "5+" },
  { id: "speed", value: "300%" },
  { id: "mvps", value: "15+" },
  { id: "vitals", value: "99/100" },
] as const;

export const experience = [
  {
    id: "2trade",
    company: "2Trade",
    periodKey: "2trade" as const,
    stack: ["React 19", "TypeScript", "MUI", "Vite", "Framer Motion"],
    projects: [
      {
        id: "fasttable-v2",
        impact: "−60% TTM",
        tags: ["React 19", "MUI", "AI Agents"],
      },
      {
        id: "design-system",
        impact: "Shared DS",
        tags: ["Design System", "Motion"],
      },
    ],
  },
  {
    id: "agsoft",
    company: "AG-Soft",
    periodKey: "agsoft" as const,
    stack: ["TypeScript", "PostgreSQL", "Node.js", "React"],
    projects: [
      {
        id: "axioma",
        impact: "+40% queries",
        tags: ["PostgreSQL", "Enterprise"],
      },
      {
        id: "axioma-admin",
        impact: "Safer cutover",
        tags: ["RBAC", "Admin"],
      },
    ],
  },
  {
    id: "radmate",
    company: "Radmate",
    periodKey: "radmate" as const,
    stack: ["React", "Reatom", "Web3/API", "Sass"],
    projects: [
      {
        id: "edu-platform",
        impact: "60fps UX",
        tags: ["EdTech", "Motion"],
      },
      {
        id: "web3-bridge",
        impact: "Web3-ready",
        tags: ["Web3", "API"],
      },
    ],
  },
  {
    id: "multicode",
    company: "MultiCode",
    periodKey: "multicode" as const,
    stack: ["React", "Node.js", "JWT", "OAuth", "PostgreSQL"],
    projects: [
      {
        id: "furniture-shop",
        impact: "High-traffic",
        tags: ["E-com", "Auth"],
      },
      {
        id: "hierarchy-dnd",
        impact: "Ops speed↑",
        tags: ["DnD", "SaaS"],
      },
    ],
  },
] as const;

export const educationMeta = {
  school: "Southern Federal University",
  graduation: "2026",
} as const;

export type Locale = "en" | "ru" | "es";

export const locales: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "es", label: "ES" },
];
