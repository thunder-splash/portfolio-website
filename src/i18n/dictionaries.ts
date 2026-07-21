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
    mockupNote: string;
    interactiveBadge: string;
    interactiveNote: string;
    tryInteractive: string;
    demoDisclaimer: string;
    playground: {
      liveDemo: string;
      synthetic: string;
      disclaimer: string;
      loading: string;
      close: string;
      openTab: string;
      scenes: string;
    };
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
      mockupNote:
        "Illustrative mock · synthetic UI · not the production product",
      interactiveBadge: "Demo",
      interactiveNote:
        "Portfolio demo · synthetic data · unrelated to live originals",
      tryInteractive: "Open portfolio demo",
      demoDisclaimer:
        "These are illustrative portfolio demos only — rebuilt showcase UIs with synthetic data. They are not production apps, are not affiliated with employers’ live products, and intentionally share little with NDA-covered originals.",
      playground: {
        liveDemo: "Portfolio demo",
        synthetic: "Synthetic showcase · not production",
        disclaimer:
          "Illustrative demo for this portfolio. Synthetic data and UI — not the real product, not production code, and not meant to represent confidential employer systems.",
        loading: "Booting demo",
        close: "Close",
        openTab: "New tab",
        scenes: "Scenes",
      },
      jobs: {
        "2trade": {
          role: "Senior Fullstack / Frontend Lead",
          period: "Jul 2025 – Sep 2025 · Remote",
          blurb:
            "Led FastTable Dashboard v2 modernization: Svelte → React 19 for realtime restaurant ops metrics. −60% TTM with AI tooling.",
          projects: {
            "fasttable-v2": {
              title: "FastTable Dashboard v2",
              type: "Case Study",
              summary:
                "Enterprise ops console: orders pipeline with status chips, managers & venue context.",
              points: [
                "React 19 + TypeScript + MUI modular shell",
                "Orders domain with expandable entity graphs",
                "AI-assisted delivery cut TTM by 60%",
              ],
            },
            "fasttable-filters": {
              title: "Scale Filtering Engine",
              type: "Feature",
              summary:
                "Operational filters over dense order tables without UI stalls.",
              points: [
                "Status + free-text filter panel on large lists",
                "Performance-first table architecture",
              ],
            },
            "fasttable-tickets": {
              title: "Support Ticket Chat",
              type: "Feature",
              summary:
                "Guest↔ops chat with restaurant & order context cards.",
              points: [
                "Ticket detail with threaded messages",
                "Linked object / order side panels",
                "Realtime-ready messaging layer",
              ],
            },
            "fasttable-rooms": {
              title: "Venue Rooms Manager",
              type: "Feature",
              summary:
                "Room cards with media, table counts and venue hierarchy.",
              points: [
                "Object → rooms → tables domain model",
                "Media-rich admin cards for floor plans",
              ],
            },
          },
        },
        agsoft: {
          role: "Senior Fullstack Developer",
          period: "Jan 2025 – Apr 2025 · Contract",
          blurb:
            "IBM MAXIMO → AXIOMA. Fullstack TypeScript + PostgreSQL; query performance +40%.",
          projects: {
            axioma: {
              title: "АКСИОМА Workbench",
              type: "Case Study",
              summary:
                "Illustrative EAM/ТОИР workbench: work orders, assets, PG performance story.",
              points: [
                "Interactive WO board with status changes",
                "Asset hierarchy → linked orders",
                "PostgreSQL query-gain narrative (+40%)",
              ],
            },
            "axioma-admin": {
              title: "АКСИОМА Admin / Cutover",
              type: "Module",
              summary:
                "RBAC toggles and MAXIMO cutover checklist for a safer migration story.",
              points: [
                "Clickable role permissions",
                "Cutover steps with local progress",
              ],
            },
          },
        },
        radmate: {
          role: "Fullstack · AI & UI/UX",
          period: "Nov 2023 – Jan 2025 · Remote",
          blurb:
            "Led Sparkora — gamified edtech with quest loops, XP progression and a dynamic task engine. 60fps on low-spec devices; API/Web3-ready integrations.",
          projects: {
            "edu-platform": {
              title: "Sparkora Learn",
              type: "Case Study",
              summary:
                "Immersive onboarding + quest UX with sticky XP HUD and 60fps motion.",
              points: [
                "Game-like flows tuned for daily retention",
                "Smooth Framer Motion / Reatom state loops",
                "Runs silky on budget hardware",
              ],
            },
            "sparkora-engine": {
              title: "Dynamic Quest Engine",
              type: "Architecture",
              summary:
                "Infinitely extensible blueprint→seed→variants generator + lightweight UI kit.",
              points: [
                "Task generation without UI rewrites",
                "Bespoke primitives → smaller bundle",
                "Skill-tagged learning loops",
              ],
            },
            "web3-bridge": {
              title: "API / Web3 Bridge",
              type: "Integration",
              summary:
                "Content API sandbox + wallet-ready achievement adapter.",
              points: [
                "Versioned quest blueprints over REST",
                "Demo wallet for on-chain style badges",
              ],
            },
            "sparkora-hub": {
              title: "Retention Hub",
              type: "Feature",
              summary:
                "Post-quest home loop: topic gallery, weekly facts, status rewards.",
              points: [
                "Daily-return surfaces after the main quest",
                "Lightweight motion on content cards",
                "Status / reward hooks for engagement",
              ],
            },
          },
        },
        multicode: {
          role: "Fullstack Developer",
          period: "Mar 2022 – Nov 2023 · Remote",
          blurb:
            "Furniture e-com + SaaS admin. JWT/OAuth, DnD hierarchies, Next.js SEO to 99/100 CWV.",
          projects: {
            "furniture-shop": {
              title: "FORMA Furniture Shop",
              type: "Case Study",
              summary:
                "Illustrative Next.js furniture storefront: catalog → PDP → cart with mock OAuth.",
              points: [
                "Interactive catalog, PDP and checkout demo",
                "JWT / multi-provider OAuth mock flow",
                "Performance-minded UI · CWV 99/100 story",
              ],
            },
            "hierarchy-dnd": {
              title: "Meridian Hierarchy Admin",
              type: "SaaS",
              summary:
                "Merchandising tree with live drag-and-drop nesting and batch actions.",
              points: [
                "Real DnD reorder / nest on category trees",
                "Batch move + publish with conflict toast",
              ],
            },
          },
        },
        freelance: {
          role: "Fullstack Web Developer",
          period: "May 2021 – Mar 2022 · Global",
          blurb:
            "Shipped playful MVPs fast — including a Web3 tamagotchi companion with mock wallet flows.",
          projects: {
            "web3-tamagotchi": {
              title: "MOCHI — Web3 Tamagotchi",
              type: "Playable MVP",
              summary:
                "On-chain vibes pet: feed, play, rest, fake NFT sync. Portfolio demo only.",
              points: [
                "Live stats + mood-driven pet UI",
                "Mock wallet, txs and NFT checkpoint",
                "Lightweight SPA — zero real chain risk",
              ],
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
      mockupNote:
        "Показательный мокап · синтетический UI · не продакшен",
      interactiveBadge: "Демо",
      interactiveNote:
        "Демо для портфолио · синтетика · не оригинал продукта",
      tryInteractive: "Открыть демо портфолио",
      demoDisclaimer:
        "Это только показательные демо для портфолио — пересобранные витрины с синтетическими данными. Это не продакшен-продукты, не живые системы работодателей и намеренно почти не совпадают с оригиналами под NDA.",
      playground: {
        liveDemo: "Демо портфолио",
        synthetic: "Синтетическая витрина · не продакшен",
        disclaimer:
          "Показательное демо для портфолио. Синтетические данные и UI — это не реальный продукт, не продакшен-код и не отражение конфиденциальных систем работодателя.",
        loading: "Загрузка демо",
        close: "Закрыть",
        openTab: "Новая вкладка",
        scenes: "Экраны",
      },
      jobs: {
        "2trade": {
          role: "Senior Fullstack / Frontend Lead",
          period: "Июль 2025 – Сентябрь 2025 · Remote",
          blurb:
            "Модернизация FastTable Dashboard v2: Svelte → React 19 для realtime-метрик ресторанного бизнеса. −60% TTM с AI.",
          projects: {
            "fasttable-v2": {
              title: "FastTable Dashboard v2",
              type: "Кейс",
              summary:
                "Ops-консоль: пайплайн заказов, статусы, менеджеры и контекст заведения.",
              points: [
                "React 19 + TypeScript + MUI shell",
                "Домен заказов с expand сущностей",
                "AI-поставка: −60% time-to-market",
              ],
            },
            "fasttable-filters": {
              title: "Scale Filtering Engine",
              type: "Фича",
              summary: "Фильтры по плотным таблицам заказов без тормозов UI.",
              points: [
                "Панель фильтров: статус + свободный текст",
                "Performance-first табличная архитектура",
              ],
            },
            "fasttable-tickets": {
              title: "Support Ticket Chat",
              type: "Фича",
              summary: "Чат гость↔ops с карточками ресторана и заказа.",
              points: [
                "Деталка тикета с тредом сообщений",
                "Боковые панели object / order",
                "Messaging-слой под realtime",
              ],
            },
            "fasttable-rooms": {
              title: "Venue Rooms Manager",
              type: "Фича",
              summary: "Карточки залов с медиа, столами и иерархией объекта.",
              points: [
                "Модель object → rooms → tables",
                "Медиа-карточки для залов",
              ],
            },
          },
        },
        agsoft: {
          role: "Senior Fullstack Developer",
          period: "Январь 2025 – Апрель 2025 · Contract",
          blurb:
            "IBM MAXIMO → AXIOMA. TypeScript fullstack + PostgreSQL; +40% к запросам.",
          projects: {
            axioma: {
              title: "АКСИОМА Workbench",
              type: "Кейс",
              summary:
                "Показательный EAM/ТОиР: наряды, активы, история про +40% к PG.",
              points: [
                "Интерактивная доска WO со сменой статусов",
                "Иерархия активов → связанные наряды",
                "Narrative про ускорение PostgreSQL (+40%)",
              ],
            },
            "axioma-admin": {
              title: "АКСИОМА Admin / Cutover",
              type: "Модуль",
              summary:
                "RBAC-переключатели и чеклист cutover MAXIMO для безопасной миграции.",
              points: [
                "Кликабельные права ролей",
                "Шаги cutover с локальным прогрессом",
              ],
            },
          },
        },
        radmate: {
          role: "Fullstack Developer (AI & UI/UX)",
          period: "Ноябрь 2023 – Январь 2025 · Remote",
          blurb:
            "Sparkora — геймифицированный edtech: квесты, XP и динамический движок заданий. 60 fps на слабом железе; API/Web3-ready слой.",
          projects: {
            "edu-platform": {
              title: "Sparkora Learn",
              type: "Кейс",
              summary:
                "Онбординг + квест-UX с XP HUD и плавной 60fps-анимацией.",
              points: [
                "Игровые флоу под daily retention",
                "Framer Motion + Reatom state loops",
                "Шёлко на budget-устройствах",
              ],
            },
            "sparkora-engine": {
              title: "Dynamic Quest Engine",
              type: "Архитектура",
              summary:
                "Blueprint→seed→variants генератор + лёгкий UI kit.",
              points: [
                "Генерация заданий без переписки UI",
                "Свои примитивы → меньше бандл",
                "Skill-tagged learning loops",
              ],
            },
            "web3-bridge": {
              title: "API / Web3 Bridge",
              type: "Интеграция",
              summary: "Content API sandbox + wallet-ready achievement adapter.",
              points: [
                "Версионированные quest blueprints",
                "Demo wallet для achievement-бейджей",
              ],
            },
            "sparkora-hub": {
              title: "Retention Hub",
              type: "Фича",
              summary:
                "Home после квеста: галерея тем, weekly facts, status-награды.",
              points: [
                "Поверхности для daily return",
                "Лёгкий motion на карточках",
                "Status / reward hooks для вовлечения",
              ],
            },
          },
        },
        multicode: {
          role: "Fullstack Developer",
          period: "Март 2022 – Ноябрь 2023 · Remote",
          blurb:
            "E-com мебели + SaaS-админка. JWT/OAuth, DnD-иерархии, Next.js SEO до 99/100 CWV.",
          projects: {
            "furniture-shop": {
              title: "FORMA — мебельный магазин",
              type: "Кейс",
              summary:
                "Показательная витрина на Next.js: каталог → PDP → корзина и mock OAuth.",
              points: [
                "Интерактивный каталог, карточка товара и checkout",
                "JWT / multi-provider OAuth (имитация)",
                "Лёгкий UI · история про CWV 99/100",
              ],
            },
            "hierarchy-dnd": {
              title: "Meridian — иерархии DnD",
              type: "SaaS",
              summary:
                "Дерево категорий с живым drag-and-drop и batch-операциями.",
              points: [
                "Реальный DnD: порядок и вложенность",
                "Batch move + publish с conflict-тостом",
              ],
            },
          },
        },
        freelance: {
          role: "Fullstack Web Developer",
          period: "Май 2021 – Март 2022 · Global",
          blurb:
            "Быстрые MVP с характером — в том числе Web3-тамагочи с mock-кошельком.",
          projects: {
            "web3-tamagotchi": {
              title: "MOCHI — Web3 Tamagotchi",
              type: "Playable MVP",
              summary:
                "Ончейн-вайб питомец: кормёжка, игра, отдых, fake NFT sync. Только демо.",
              points: [
                "Живые статы и мордашка по настроению",
                "Mock wallet, txs и NFT-чекпоинт",
                "Лёгкая SPA — без реального блокчейна",
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
      mockupNote:
        "Mock ilustrativo · UI sintético · no es producción",
      interactiveBadge: "Demo",
      interactiveNote:
        "Demo de portfolio · datos sintéticos · no es el original",
      tryInteractive: "Abrir demo del portfolio",
      demoDisclaimer:
        "Solo demos ilustrativas del portfolio: UIs reconstruidas con datos sintéticos. No son apps de producción, no están afiliadas a productos reales del empleador y deliberadamente poco tienen en común con originales bajo NDA.",
      playground: {
        liveDemo: "Demo del portfolio",
        synthetic: "Vitrina sintética · no producción",
        disclaimer:
          "Demo ilustrativa de este portfolio. Datos y UI sintéticos: no es el producto real, ni código de producción, ni un reflejo de sistemas confidenciales del empleador.",
        loading: "Cargando demo",
        close: "Cerrar",
        openTab: "Nueva pestaña",
        scenes: "Pantallas",
      },
      jobs: {
        "2trade": {
          role: "Senior Fullstack / Frontend Lead",
          period: "Jul 2025 – Sep 2025 · Remote",
          blurb:
            "Modernización FastTable v2: Svelte → React 19 para métricas realtime de restaurantes. −60% TTM con AI.",
          projects: {
            "fasttable-v2": {
              title: "FastTable Dashboard v2",
              type: "Caso",
              summary:
                "Consola ops: pipeline de pedidos con estados, managers y venue.",
              points: [
                "Shell React 19 + TypeScript + MUI",
                "Dominio de pedidos con expand de entidades",
                "Entrega con AI: −60% TTM",
              ],
            },
            "fasttable-filters": {
              title: "Scale Filtering Engine",
              type: "Feature",
              summary: "Filtros sobre tablas densas de pedidos sin lag.",
              points: [
                "Panel de filtros: estado + texto libre",
                "Arquitectura de tablas performance-first",
              ],
            },
            "fasttable-tickets": {
              title: "Support Ticket Chat",
              type: "Feature",
              summary: "Chat guest↔ops con cards de restaurante y pedido.",
              points: [
                "Detalle de ticket con hilo de mensajes",
                "Paneles laterales object / order",
                "Capa messaging lista para realtime",
              ],
            },
            "fasttable-rooms": {
              title: "Venue Rooms Manager",
              type: "Feature",
              summary: "Cards de salas con media, mesas e jerarquía del venue.",
              points: [
                "Modelo object → rooms → tables",
                "Cards con media para salas",
              ],
            },
          },
        },
        agsoft: {
          role: "Senior Fullstack Developer",
          period: "Ene 2025 – Abr 2025 · Contract",
          blurb:
            "IBM MAXIMO → AXIOMA. TypeScript fullstack + PostgreSQL; +40% queries.",
          projects: {
            axioma: {
              title: "АКСИОМА Workbench",
              type: "Caso",
              summary:
                "EAM/ТОИР ilustrativo: órdenes, activos y +40% PG story.",
              points: [
                "Tablero WO interactivo con estados",
                "Jerarquía de activos → órdenes ligadas",
                "Narrativa de PostgreSQL (+40%)",
              ],
            },
            "axioma-admin": {
              title: "АКСИОМА Admin / Cutover",
              type: "Módulo",
              summary:
                "RBAC y checklist de cutover MAXIMO para una migración más segura.",
              points: [
                "Permisos de rol clicables",
                "Pasos de cutover con progreso local",
              ],
            },
          },
        },
        radmate: {
          role: "Fullstack · AI & UI/UX",
          period: "Nov 2023 – Ene 2025 · Remote",
          blurb:
            "Sparkora — edtech gamificado: quests, XP y motor dinámico. 60fps en low-spec; capa API/Web3-ready.",
          projects: {
            "edu-platform": {
              title: "Sparkora Learn",
              type: "Caso",
              summary:
                "Onboarding + quest UX con XP HUD y motion a 60fps.",
              points: [
                "Flujos game-like para retención diaria",
                "Framer Motion + bucles Reatom",
                "Suave en hardware débil",
              ],
            },
            "sparkora-engine": {
              title: "Dynamic Quest Engine",
              type: "Arquitectura",
              summary:
                "Generador blueprint→seed→variants + UI kit ligero.",
              points: [
                "Tareas nuevas sin reescribir UI",
                "Primitivos propios → bundle menor",
                "Learning loops por skill",
              ],
            },
            "web3-bridge": {
              title: "API / Web3 Bridge",
              type: "Integración",
              summary:
                "Sandbox Content API + adapter wallet-ready.",
              points: [
                "Blueprints versionados vía REST",
                "Demo wallet para badges",
              ],
            },
            "sparkora-hub": {
              title: "Retention Hub",
              type: "Feature",
              summary:
                "Home post-quest: gallery, weekly facts, status rewards.",
              points: [
                "Superficies para daily return",
                "Motion ligero en cards",
                "Hooks de status / reward",
              ],
            },
          },
        },
        multicode: {
          role: "Fullstack Developer",
          period: "Mar 2022 – Nov 2023 · Remote",
          blurb:
            "E-com de muebles + admin SaaS. JWT/OAuth, DnD, Next.js SEO a 99/100 CWV.",
          projects: {
            "furniture-shop": {
              title: "FORMA — tienda de muebles",
              type: "Caso",
              summary:
                "Vitrina ilustrativa Next.js: catálogo → PDP → carrito y OAuth mock.",
              points: [
                "Catálogo, PDP y checkout interactivos",
                "JWT / OAuth multi-provider (mock)",
                "UI ligera · historia CWV 99/100",
              ],
            },
            "hierarchy-dnd": {
              title: "Meridian — jerarquías DnD",
              type: "SaaS",
              summary:
                "Árbol de categorías con drag-and-drop real y acciones batch.",
              points: [
                "DnD real: orden y anidación",
                "Batch move + publish con toast de conflicto",
              ],
            },
          },
        },
        freelance: {
          role: "Fullstack Web Developer",
          period: "May 2021 – Mar 2022 · Global",
          blurb:
            "MVPs con carácter — incluido un tamagotchi Web3 con wallet mock.",
          projects: {
            "web3-tamagotchi": {
              title: "MOCHI — Web3 Tamagotchi",
              type: "Playable MVP",
              summary:
                "Mascota on-chain vibes: feed, play, rest, fake NFT sync. Solo demo.",
              points: [
                "Stats vivas y cara según humor",
                "Mock wallet, txs y checkpoint NFT",
                "SPA ligera — sin cadena real",
              ],
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
