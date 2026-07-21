import type { Locale } from "@/data/portfolio";

/** Case journey: where we started → what shipped */
export const projectArcs: Record<
  string,
  Record<Locale, { from: string; to: string }>
> = {
  "fasttable-v2": {
    en: {
      from: "Legacy Svelte ops console — slow TTM, fragmented order flows",
      to: "React 19 modular shell with live order pipeline · −60% TTM",
    },
    ru: {
      from: "Legacy Svelte-консоль — долгий TTM, рваные флоу заказов",
      to: "Модульный React 19 shell с live-пайплайном заказов · −60% TTM",
    },
    es: {
      from: "Consola Svelte legacy — TTM lento, flujos de pedidos rotos",
      to: "Shell React 19 modular con pipeline de pedidos · −60% TTM",
    },
  },
  "fasttable-filters": {
    en: {
      from: "Dense tables choked on every filter click",
      to: "Status + text filters that stay snappy on large lists",
    },
    ru: {
      from: "Плотные таблицы тормозили на каждом клике фильтра",
      to: "Статус + текстовые фильтры без подвисаний на больших списках",
    },
    es: {
      from: "Tablas densas que se trababan al filtrar",
      to: "Filtros de estado + texto fluidos en listas grandes",
    },
  },
  "fasttable-tickets": {
    en: {
      from: "Support threads scattered outside the venue context",
      to: "Ticket chat with restaurant & order cards in one pane",
    },
    ru: {
      from: "Саппорт-треды вне контекста заведения",
      to: "Чат тикетов с карточками ресторана и заказа в одном экране",
    },
    es: {
      from: "Hilos de soporte fuera del contexto del local",
      to: "Chat de tickets con tarjetas de local y pedido juntas",
    },
  },
  "fasttable-rooms": {
    en: {
      from: "Venue floors lived in spreadsheets and static uploads",
      to: "Object → rooms → tables with media-rich admin cards",
    },
    ru: {
      from: "Залы жили в таблицах и статичных аплоадах",
      to: "Объект → залы → столы с media-rich админ-карточками",
    },
    es: {
      from: "Salas en hojas y uploads estáticos",
      to: "Objeto → salas → mesas con cards admin con media",
    },
  },
  axioma: {
    en: {
      from: "MAXIMO-era EAM screens — heavy queries, slow work orders",
      to: "TypeScript workbench + PG story · +40% query feel",
    },
    ru: {
      from: "EAM-экраны эпохи MAXIMO — тяжёлые запросы, медленные наряды",
      to: "TypeScript workbench + PG · ощущение +40% к запросам",
    },
    es: {
      from: "Pantallas EAM tipo MAXIMO — queries pesadas",
      to: "Workbench TypeScript + PG · +40% en consultas",
    },
  },
  "axioma-admin": {
    en: {
      from: "Cutover risk: unclear roles, no freeze checklist",
      to: "RBAC matrix + wave checklist for a safer switch",
    },
    ru: {
      from: "Риск cutover: роли размыты, нет freeze-чеклиста",
      to: "RBAC-матрица + чеклист волн для более безопасного перехода",
    },
    es: {
      from: "Riesgo de cutover: roles difusos, sin checklist",
      to: "Matriz RBAC + checklist de olas para un corte más seguro",
    },
  },
  "edu-platform": {
    en: {
      from: "Flat onboarding — drop-off before the first quest",
      to: "Game-like Learn loop with sticky XP HUD at 60fps",
    },
    ru: {
      from: "Плоский онбординг — отвал до первого квеста",
      to: "Игровой Learn-loop со sticky XP HUD на 60fps",
    },
    es: {
      from: "Onboarding plano — abandono antes del primer quest",
      to: "Loop Learn gamificado con XP HUD a 60fps",
    },
  },
  "sparkora-engine": {
    en: {
      from: "Hard-coded tasks, no reusable quest authoring",
      to: "Dynamic Quest Engine + UI kit for infinite variants",
    },
    ru: {
      from: "Захардкоженные таски, без authoring квестов",
      to: "Динамический Quest Engine + UI kit для ∞ вариантов",
    },
    es: {
      from: "Tareas hardcodeadas, sin authoring de quests",
      to: "Quest Engine dinámico + UI kit para variantes ∞",
    },
  },
  "web3-bridge": {
    en: {
      from: "Edtech core with no wallet / chain-ready surface",
      to: "API bridge + wallet mock ready for Web3 hooks",
    },
    ru: {
      from: "Edtech-ядро без wallet / chain-ready поверхности",
      to: "API bridge + wallet mock под Web3-хуки",
    },
    es: {
      from: "Core edtech sin superficie wallet / chain",
      to: "API bridge + wallet mock listo para Web3",
    },
  },
  "sparkora-hub": {
    en: {
      from: "Quest ends → dead end, no reason to return daily",
      to: "Retention home: facts, status, post-quest loop",
    },
    ru: {
      from: "Квест кончился → тупик, нет повода вернуться",
      to: "Retention-home: факты, статус, post-quest loop",
    },
    es: {
      from: "Fin del quest → callejón sin retorno diario",
      to: "Home de retención: facts, status, loop post-quest",
    },
  },
  "furniture-shop": {
    en: {
      from: "Static furniture catalog — pick a photo, hope it fits",
      to: "Live sofa configurator: color + fabric before cart",
    },
    ru: {
      from: "Статичный каталог — выбрать фото и надеяться",
      to: "Живой конфигуратор дивана: цвет + ткань до корзины",
    },
    es: {
      from: "Catálogo estático — elegir foto y esperar",
      to: "Configurador de sofá en vivo: color + tela antes del carrito",
    },
  },
  "hierarchy-dnd": {
    en: {
      from: "Category trees edited via slow forms / CSV dumps",
      to: "FORMA Admin: DnD tree, stock ±, colorways, publish",
    },
    ru: {
      from: "Дерево категорий через формы / CSV",
      to: "FORMA Admin: DnD-дерево, сток ±, colorways, publish",
    },
    es: {
      from: "Árboles editados con forms / CSV lentos",
      to: "FORMA Admin: árbol DnD, stock ±, colorways, publish",
    },
  },
  "web3-tamagotchi": {
    en: {
      from: "One-click pet mock with no loop or stakes",
      to: "MOCHI: Berry Catch → MOCH/XP → evolve → NFT sync",
    },
    ru: {
      from: "Клик-клик питомец без цикла и ставок",
      to: "MOCHI: Berry Catch → MOCH/XP → эволюция → NFT sync",
    },
    es: {
      from: "Mascota de un clic sin loop ni stakes",
      to: "MOCHI: Berry Catch → MOCH/XP → evolucionar → NFT sync",
    },
  },
  "gemify-market": {
    en: {
      from: "Thin NFT landing — no buy gate, no ledger, no profile",
      to: "Full market: carousel → collections → chart PDP → balance → profile",
    },
    ru: {
      from: "Тонкий NFT-лендинг — без buy gate, ledger и профиля",
      to: "Полный маркет: карусель → коллекции → PDP → баланс → профиль",
    },
    es: {
      from: "Landing NFT fino — sin buy gate, ledger ni perfil",
      to: "Mercado completo: carrusel → colecciones → PDP → balance → perfil",
    },
  },
};
