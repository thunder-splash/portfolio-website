import type { Locale } from "@/data/portfolio";

export type Dictionary = {
  nav: {
    stack: string;
    impact: string;
    work: string;
    education: string;
    contact: string;
    hire: string;
  };
  hero: {
    available: string;
    availability: string;
    role: string;
    headlineBefore: string;
    headlineAccent: string;
    headlineAfter: string;
    sub: string;
    viewWork: string;
    contact: string;
    scroll: string;
  };
  stack: {
    eyebrow: string;
    title: string;
    toolsLabel: string;
    horizonLeft: string;
    horizonRight: string;
    horizonToMetrics: string;
    categories: Record<string, { title: string; blurb: string }>;
  };
  metrics: {
    eyebrow: string;
    title: string;
    horizonTag: string;
    horizonToWork: string;
    items: Record<string, { label: string; hint: string }>;
  };
  work: {
    eyebrow: string;
    title: string;
    horizonTag: string;
    horizonToEdu: string;
    projectsLabel: string;
    projectsCount: string;
    openDetails: string;
    viewing: string;
    jobs: Record<
      string,
      {
        role: string;
        period: string;
        blurb: string;
        projects: Record<
          string,
          { title: string; type: string; summary: string; points: string[] }
        >;
      }
    >;
  };
  education: {
    eyebrow: string;
    title: string;
    horizonTag: string;
    educationLabel: string;
    languagesLabel: string;
    degree: string;
    graduation: string;
    langs: { name: string; level: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    email: string;
    telegram: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      stack: "Stack",
      impact: "Impact",
      work: "Work",
      education: "Edu",
      contact: "Contact",
      hire: "Hire Me",
    },
    hero: {
      available: "Available",
      availability: "Remote · Relocation OK",
      role: "Senior AI-Driven Fullstack Developer",
      headlineBefore: "Web3 & AI apps,",
      headlineAccent: "built faster",
      headlineAfter: "",
      sub: "5+ years fullstack. AI agents in the workflow — up to 300% faster delivery.",
      viewWork: "View Work",
      contact: "Contact",
      scroll: "Scroll",
    },
    stack: {
      eyebrow: "01 — Stack",
      title: "Tools I ship with",
      toolsLabel: "{n} tools",
      horizonLeft: "01 · Systems",
      horizonRight: "Surface",
      horizonToMetrics: "02 · Impact",
      categories: {
        ai: {
          title: "AI & Automation",
          blurb: "LLM workflows, agent pipelines, and AI-assisted delivery in production.",
        },
        frontend: {
          title: "Frontend",
          blurb: "Typed UI systems with React 19 and modern state tooling.",
        },
        backend: {
          title: "Backend & DB",
          blurb: "APIs and data layers built for scale and type-safety.",
        },
        uiux: {
          title: "UI / UX",
          blurb: "Motion-ready interfaces with consistent design systems.",
        },
        devops: {
          title: "DevOps",
          blurb: "Build tooling, containers, and CI/CD for reliable releases.",
        },
      },
    },
    metrics: {
      eyebrow: "02 — Impact",
      title: "Numbers that matter",
      horizonTag: "Metrics",
      horizonToWork: "03 · Experience",
      items: {
        years: { label: "Years", hint: "Production experience" },
        speed: { label: "Faster ship", hint: "Via AI agent workflows" },
        mvps: { label: "MVPs", hint: "2× market pace" },
        vitals: { label: "CWV", hint: "Next.js SEO score" },
      },
    },
    work: {
      eyebrow: "03 — Work",
      title: "Roles & deliverables",
      horizonTag: "Career",
      horizonToEdu: "04 · Background",
      projectsLabel: "Projects",
      projectsCount: "{n} projects",
      openDetails: "Details",
      viewing: "Open",
      jobs: {
        "2trade": {
          role: "Senior Fullstack / Frontend Lead",
          period: "Jul 2025 – Sep 2025",
          blurb: "Svelte → React 19 rewrite of FastTable. −60% time-to-market with AI tooling.",
          projects: {
            "fasttable-v2": {
              title: "FastTable Dashboard v2",
              type: "Case Study",
              summary: "Legacy dashboard → modular React 19 stack.",
              points: [
                "Zero-downtime UI migration",
                "AI-assisted delivery (−60% TTM)",
              ],
            },
            "design-system": {
              title: "Modular UI Kit",
              type: "Internal",
              summary: "Shared tables, filters, motion widgets.",
              points: ["Tokenized UI density", "Strict TS contracts"],
            },
          },
        },
        agsoft: {
          role: "Senior Fullstack Developer",
          period: "Jan 2025 – Apr 2025",
          blurb: "IBM MAXIMO → AXIOMA. Full type-safety + PostgreSQL tuned (+40% queries).",
          projects: {
            axioma: {
              title: "AXIOMA Platform",
              type: "Case Study",
              summary: "Enterprise asset/work system replacing MAXIMO.",
              points: ["E2E TypeScript safety", "+40% query performance"],
            },
            "axioma-admin": {
              title: "Ops Admin Console",
              type: "Module",
              summary: "RBAC + cutover tooling for migration.",
              points: ["Role-based ops views", "Safer data validation"],
            },
          },
        },
        radmate: {
          role: "Fullstack · AI & UI/UX",
          period: "Nov 2023 – Jan 2025",
          blurb: "Gamified edtech at scale. 60fps on weak devices + Web3/API bridges.",
          projects: {
            "edu-platform": {
              title: "Gamified Learning",
              type: "Case Study",
              summary: "Quests, progression, performance-first UI.",
              points: ["60fps on low-spec hardware", "Reatom game-like state"],
            },
            "web3-bridge": {
              title: "Web3 / API Bridge",
              type: "Integration",
              summary: "Rewards & identity wired to Web3 services.",
              points: ["Resilient API orchestration", "Reusable connectors"],
            },
          },
        },
        multicode: {
          role: "Fullstack Developer",
          period: "Mar 2022 – Nov 2023",
          blurb: "High-traffic furniture e-com + SaaS. DnD hierarchies, JWT/OAuth.",
          projects: {
            "furniture-shop": {
              title: "Furniture Store",
              type: "Case Study",
              summary: "Catalog → checkout, auth, high traffic.",
              points: ["Full-cycle ownership", "JWT / OAuth flows"],
            },
            "hierarchy-dnd": {
              title: "Hierarchy DnD Admin",
              type: "SaaS",
              summary: "Nested category sorting with optimistic UI.",
              points: ["Nested drag & drop", "Conflict rollback"],
            },
          },
        },
      },
    },
    education: {
      eyebrow: "04 — Background",
      title: "Edu & languages",
      horizonTag: "Profile",
      educationLabel: "Education",
      languagesLabel: "Languages",
      degree: "BSc · Info-communication Technologies & Special Systems",
      graduation: "Grad. 2026",
      langs: [
        { name: "English", level: "Professional" },
        { name: "Russian", level: "Native" },
      ],
    },
    contact: {
      eyebrow: "05 — Contact",
      title: "Let's build something massive.",
      email: "Email",
      telegram: "Telegram",
    },
  },
  ru: {
    nav: {
      stack: "Стек",
      impact: "Результаты",
      work: "Опыт",
      education: "Образование",
      contact: "Контакты",
      hire: "Связаться",
    },
    hero: {
      available: "Открыт к предложениям",
      availability: "Удалённо · Релокация возможна",
      role: "Senior AI-Driven Fullstack Developer",
      headlineBefore: "Web3 и AI-приложения",
      headlineAccent: "нового поколения",
      headlineAfter: "",
      sub: "Senior Fullstack с опытом 5+ лет. Внедряю AI-агентов в цикл разработки — ускорение поставки до 300%.",
      viewWork: "Смотреть опыт",
      contact: "Написать",
      scroll: "Далее",
    },
    stack: {
      eyebrow: "01 — Стек",
      title: "Технологии",
      toolsLabel: "{n} инструментов",
      horizonLeft: "01 · Системы",
      horizonRight: "Поверхность",
      horizonToMetrics: "02 · Результаты",
      categories: {
        ai: {
          title: "AI и автоматизация",
          blurb: "LLM-воркфлоу, агентные пайплайны и AI-ускоренная поставка.",
        },
        frontend: {
          title: "Frontend",
          blurb: "Типизированные UI-системы на React 19 и современном state.",
        },
        backend: {
          title: "Backend и БД",
          blurb: "API и слой данных с упором на масштабируемость.",
        },
        uiux: {
          title: "UI / UX",
          blurb: "Интерфейсы с motion и согласованным design system.",
        },
        devops: {
          title: "DevOps",
          blurb: "Сборка, контейнеры и CI/CD для стабильных релизов.",
        },
      },
    },
    metrics: {
      eyebrow: "02 — Результаты",
      title: "Ключевые показатели",
      horizonTag: "Метрики",
      horizonToWork: "03 · Опыт",
      items: {
        years: { label: "Лет опыта", hint: "Коммерческая разработка" },
        speed: { label: "Ускорение поставки", hint: "За счёт AI-агентов" },
        mvps: { label: "MVP и проекты", hint: "В 2 раза быстрее рынка" },
        vitals: { label: "Core Web Vitals", hint: "SEO-оценка на Next.js" },
      },
    },
    work: {
      eyebrow: "03 — Опыт",
      title: "Карьера и проекты",
      horizonTag: "Карьера",
      horizonToEdu: "04 · Образование",
      projectsLabel: "Проекты",
      projectsCount: "{n} проекта",
      openDetails: "Подробнее",
      viewing: "Выбрано",
      jobs: {
        "2trade": {
          role: "Senior Fullstack / Frontend Lead",
          period: "Июль 2025 – Сентябрь 2025",
          blurb:
            "Миграция FastTable Dashboard v2 с Svelte на React 19. Сократил time-to-market на 60% за счёт AI-инструментов.",
          projects: {
            "fasttable-v2": {
              title: "FastTable Dashboard v2",
              type: "Кейс",
              summary: "Переписывание legacy-дашборда на модульный React 19.",
              points: [
                "Миграция UI без простоя",
                "AI-ускоренная поставка (−60% TTM)",
              ],
            },
            "design-system": {
              title: "Modular UI Kit",
              type: "Внутренний продукт",
              summary: "Общий слой таблиц, фильтров и motion-компонентов.",
              points: [
                "Токенизированная плотность UI",
                "Строгие TypeScript-контракты",
              ],
            },
          },
        },
        agsoft: {
          role: "Senior Fullstack Developer",
          period: "Январь 2025 – Апрель 2025",
          blurb:
            "Миграция IBM MAXIMO в собственное решение AXIOMA. Полный type-safety и оптимизация PostgreSQL (+40% к запросам).",
          projects: {
            axioma: {
              title: "AXIOMA Platform",
              type: "Кейс",
              summary: "Enterprise-платформа на замену IBM MAXIMO.",
              points: [
                "End-to-end TypeScript",
                "+40% к производительности запросов",
              ],
            },
            "axioma-admin": {
              title: "Ops Admin Console",
              type: "Модуль",
              summary: "RBAC и инструменты сопровождения миграции.",
              points: [
                "Ролевые представления для ops",
                "Валидация данных при cutover",
              ],
            },
          },
        },
        radmate: {
          role: "Fullstack Developer (AI & UI/UX)",
          period: "Ноябрь 2023 – Январь 2025",
          blurb:
            "Геймифицированная образовательная платформа. 60 fps на слабом железе и интеграции Web3/API.",
          projects: {
            "edu-platform": {
              title: "Gamified Learning",
              type: "Кейс",
              summary: "Квесты, прогрессия и UI с упором на производительность.",
              points: [
                "Стабильные 60 fps на weak devices",
                "Архитектура состояния на Reatom",
              ],
            },
            "web3-bridge": {
              title: "Web3 / API Bridge",
              type: "Интеграция",
              summary: "Связка наград и identity с внешними Web3-сервисами.",
              points: [
                "Устойчивая оркестрация API",
                "Переиспользуемые коннекторы",
              ],
            },
          },
        },
        multicode: {
          role: "Fullstack Developer",
          period: "Март 2022 – Ноябрь 2023",
          blurb:
            "E-commerce мебели с высоким трафиком и SaaS-инструменты. DnD-иерархии, JWT/OAuth.",
          projects: {
            "furniture-shop": {
              title: "Furniture Store",
              type: "Кейс",
              summary: "Каталог, checkout и auth для high-traffic витрины.",
              points: [
                "Полный цикл разработки фич",
                "Аутентификация JWT / OAuth",
              ],
            },
            "hierarchy-dnd": {
              title: "Hierarchy DnD Admin",
              type: "SaaS",
              summary: "Вложенная сортировка категорий drag-and-drop.",
              points: [
                "Nested drag-and-drop",
                "Optimistic UI с откатом при конфликтах",
              ],
            },
          },
        },
      },
    },
    education: {
      eyebrow: "04 — Образование",
      title: "Образование и языки",
      horizonTag: "Профиль",
      educationLabel: "Образование",
      languagesLabel: "Языки",
      degree:
        "Бакалавр · Инфокоммуникационные технологии и специальные системы",
      graduation: "Выпуск 2026",
      langs: [
        { name: "English", level: "Professional" },
        { name: "Русский", level: "Родной" },
      ],
    },
    contact: {
      eyebrow: "05 — Контакты",
      title: "Давайте сделаем что-то масштабное.",
      email: "Email",
      telegram: "Telegram",
    },
  },
  es: {
    nav: {
      stack: "Stack",
      impact: "Impacto",
      work: "Trabajo",
      education: "Edu",
      contact: "Contacto",
      hire: "Contrátame",
    },
    hero: {
      available: "Disponible",
      availability: "Remote · Reubicación OK",
      role: "Senior AI-Driven Fullstack Developer",
      headlineBefore: "Apps Web3 & AI,",
      headlineAccent: "más rápido",
      headlineAfter: "",
      sub: "5+ años fullstack. Agentes AI en el flujo — hasta 300% más velocidad.",
      viewWork: "Ver trabajo",
      contact: "Contacto",
      scroll: "Scroll",
    },
    stack: {
      eyebrow: "01 — Stack",
      title: "Con qué construyo",
      toolsLabel: "{n} tools",
      horizonLeft: "01 · Systems",
      horizonRight: "Surface",
      horizonToMetrics: "02 · Impacto",
      categories: {
        ai: {
          title: "AI y automatización",
          blurb: "Flujos LLM, pipelines de agentes y entrega acelerada con AI.",
        },
        frontend: {
          title: "Frontend",
          blurb: "Sistemas UI tipados con React 19 y state moderno.",
        },
        backend: {
          title: "Backend y DB",
          blurb: "APIs y datos pensados para escala y type-safety.",
        },
        uiux: {
          title: "UI / UX",
          blurb: "Interfaces con motion y design systems consistentes.",
        },
        devops: {
          title: "DevOps",
          blurb: "Build, contenedores y CI/CD para releases estables.",
        },
      },
    },
    metrics: {
      eyebrow: "02 — Impacto",
      title: "Números clave",
      horizonTag: "Métricas",
      horizonToWork: "03 · Experiencia",
      items: {
        years: { label: "Años", hint: "Experiencia en prod" },
        speed: { label: "Más rápido", hint: "Con agentes AI" },
        mvps: { label: "MVPs", hint: "2× vs mercado" },
        vitals: { label: "CWV", hint: "SEO en Next.js" },
      },
    },
    work: {
      eyebrow: "03 — Trabajo",
      title: "Roles y entregas",
      horizonTag: "Carrera",
      horizonToEdu: "04 · Background",
      projectsLabel: "Proyectos",
      projectsCount: "{n} proyectos",
      openDetails: "Detalles",
      viewing: "Abierto",
      jobs: {
        "2trade": {
          role: "Senior Fullstack / Frontend Lead",
          period: "Jul 2025 – Sep 2025",
          blurb: "Svelte → React 19 (FastTable). −60% TTM con AI.",
          projects: {
            "fasttable-v2": {
              title: "FastTable Dashboard v2",
              type: "Caso",
              summary: "Dashboard legacy → React 19 modular.",
              points: ["Migración UI sin downtime", "Entrega AI (−60% TTM)"],
            },
            "design-system": {
              title: "Modular UI Kit",
              type: "Interno",
              summary: "Tablas, filtros y widgets compartidos.",
              points: ["UI tokenizada", "Contratos TS estrictos"],
            },
          },
        },
        agsoft: {
          role: "Senior Fullstack Developer",
          period: "Ene 2025 – Abr 2025",
          blurb: "IBM MAXIMO → AXIOMA. Type-safety + PostgreSQL (+40%).",
          projects: {
            axioma: {
              title: "AXIOMA Platform",
              type: "Caso",
              summary: "Sistema enterprise que reemplaza MAXIMO.",
              points: ["TypeScript E2E", "+40% en queries"],
            },
            "axioma-admin": {
              title: "Ops Admin Console",
              type: "Módulo",
              summary: "RBAC y tooling de cutover.",
              points: ["Vistas por rol", "Validación de datos"],
            },
          },
        },
        radmate: {
          role: "Fullstack · AI & UI/UX",
          period: "Nov 2023 – Ene 2025",
          blurb: "Edtech gamificado. 60fps en low-spec + puentes Web3/API.",
          projects: {
            "edu-platform": {
              title: "Gamified Learning",
              type: "Caso",
              summary: "Quests, progreso, UI de alto rendimiento.",
              points: ["60fps en hardware débil", "Estado Reatom"],
            },
            "web3-bridge": {
              title: "Web3 / API Bridge",
              type: "Integración",
              summary: "Rewards e identity hacia Web3.",
              points: ["Orquestación API", "Conectores reutilizables"],
            },
          },
        },
        multicode: {
          role: "Fullstack Developer",
          period: "Mar 2022 – Nov 2023",
          blurb: "E-com de muebles high-traffic + SaaS. DnD, JWT/OAuth.",
          projects: {
            "furniture-shop": {
              title: "Furniture Store",
              type: "Caso",
              summary: "Catálogo → checkout, auth, alto tráfico.",
              points: ["Ownership full-cycle", "Flujos JWT / OAuth"],
            },
            "hierarchy-dnd": {
              title: "Hierarchy DnD Admin",
              type: "SaaS",
              summary: "Orden de categorías anidadas.",
              points: ["Drag & drop anidado", "Rollback en conflictos"],
            },
          },
        },
      },
    },
    education: {
      eyebrow: "04 — Background",
      title: "Edu e idiomas",
      horizonTag: "Perfil",
      educationLabel: "Educación",
      languagesLabel: "Idiomas",
      degree: "Lic. · Tecnologías de Infocomunicación y Sistemas Especiales",
      graduation: "Grad. 2026",
      langs: [
        { name: "English", level: "Professional" },
        { name: "Ruso", level: "Nativo" },
      ],
    },
    contact: {
      eyebrow: "05 — Contacto",
      title: "Construyamos algo grande.",
      email: "Email",
      telegram: "Telegram",
    },
  },
};
