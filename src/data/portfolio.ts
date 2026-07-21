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
    stack: [
      "React 19",
      "TypeScript",
      "MUI",
      "Vite",
      "Axios",
      "React Router",
      "Framer Motion",
    ],
    projects: [
      {
        id: "fasttable-v2",
        impact: "−60% TTM",
        tags: ["React 19", "Orders", "MUI"],
        image: "/projects/ft-orders.png",
      },
      {
        id: "fasttable-filters",
        impact: "Scale filters",
        tags: ["Filters", "Tables", "Vite"],
        image: "/projects/ft-filters.png",
      },
      {
        id: "fasttable-tickets",
        impact: "Support ops",
        tags: ["Tickets", "Realtime chat"],
        image: "/projects/ft-tickets.png",
      },
      {
        id: "fasttable-rooms",
        impact: "Venue ops",
        tags: ["Objects", "Rooms", "Media"],
        image: "/projects/ft-rooms.png",
      },
    ],
  },
  {
    id: "agsoft",
    company: "AG-Soft",
    stack: ["React", "TypeScript", "PostgreSQL", "Node.js", "REST"],
    projects: [
      {
        id: "axioma",
        impact: "+40% queries",
        tags: ["PostgreSQL", "Enterprise", "TypeScript"],
        image: "/projects/axioma.png",
      },
      {
        id: "axioma-admin",
        impact: "Safer cutover",
        tags: ["RBAC", "Migration"],
        image: "/projects/axioma-admin.png",
      },
    ],
  },
  {
    id: "radmate",
    company: "Radmate",
    stack: ["React", "Reatom", "Sass", "Framer Motion", "Web3/API"],
    projects: [
      {
        id: "edu-platform",
        impact: "60fps UX",
        tags: ["Sparkora", "EdTech", "Gamification"],
        image: "/projects/sp-onboarding-202607210244.png",
      },
      {
        id: "sparkora-engine",
        impact: "∞ quests",
        tags: ["Quest Engine", "UI Kit", "Reatom"],
        image: "/projects/sp-engine-202607210244.png",
      },
      {
        id: "web3-bridge",
        impact: "Web3-ready",
        tags: ["API bridge", "Wallet mock"],
        image: "/projects/sp-bridge-202607210244.png",
      },
      {
        id: "sparkora-hub",
        impact: "Retention↑",
        tags: ["Home loop", "Facts", "Status"],
        image: "/projects/sp-hub-202607210244.png",
      },
    ],
  },
  {
    id: "multicode",
    company: "MultiCode",
    stack: ["React", "Next.js", "Node.js", "JWT", "OAuth", "Sass"],
    projects: [
      {
        id: "furniture-shop",
        impact: "99/100 CWV",
        tags: ["Next.js", "E-com", "SEO"],
        image: "/projects/furniture-shop.png",
      },
      {
        id: "hierarchy-dnd",
        impact: "Ops speed↑",
        tags: ["DnD", "Admin", "SaaS"],
        image: "/projects/hierarchy-dnd.png",
      },
    ],
  },
  {
    id: "freelance",
    company: "Freelance",
    stack: ["React", "Node.js", "Express", "PostgreSQL", "Tailwind"],
    projects: [
      {
        id: "mvp-factory",
        impact: "15+ MVPs",
        tags: ["MVPs", "AI tools", "2× speed"],
        image: "/projects/mvp-factory.png",
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
