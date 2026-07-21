export type DemoScene = {
  id: string;
  path: string;
  label: { en: string; ru: string; es: string };
};

export type InteractiveDemo = {
  id: string;
  /** Static SPA root under /public */
  baseUrl: string;
  /** HashRouter routes (no server rewrites needed) */
  scenes: DemoScene[];
};

/** Lazy-loaded interactive sandboxes. Kept out of the main bundle. */
export const interactiveDemos: Record<string, InteractiveDemo> = {
  fasttable: {
    id: "fasttable",
    baseUrl: "/demos/fasttable/",
    scenes: [
      {
        id: "orders",
        path: "/orders",
        label: { en: "Orders", ru: "Заказы", es: "Pedidos" },
      },
      {
        id: "filters",
        path: "/orders",
        label: { en: "Filters", ru: "Фильтры", es: "Filtros" },
      },
      {
        id: "object",
        path: "/objects/obj-riverside",
        label: { en: "Venue", ru: "Заведение", es: "Local" },
      },
      {
        id: "rooms",
        path: "/objects/obj-riverside/rooms",
        label: { en: "Rooms", ru: "Залы", es: "Salas" },
      },
      {
        id: "tickets",
        path: "/tickets/tkt-501",
        label: { en: "Support", ru: "Поддержка", es: "Soporte" },
      },
      {
        id: "reviews",
        path: "/reviews",
        label: { en: "Reviews", ru: "Отзывы", es: "Reseñas" },
      },
    ],
  },
  sparkora: {
    id: "sparkora",
    baseUrl: "/demos/sparkora/",
    scenes: [
      {
        id: "onboarding",
        path: "/onboarding",
        label: { en: "Onboarding", ru: "Онбординг", es: "Onboarding" },
      },
      {
        id: "quest",
        path: "/test",
        label: { en: "Quest", ru: "Квест", es: "Quest" },
      },
      {
        id: "engine",
        path: "/engine",
        label: { en: "Quest Engine", ru: "Движок", es: "Motor" },
      },
      {
        id: "bridge",
        path: "/bridge",
        label: { en: "API / Web3", ru: "API / Web3", es: "API / Web3" },
      },
      {
        id: "home",
        path: "/",
        label: { en: "Home", ru: "Дом", es: "Inicio" },
      },
    ],
  },
};

/** Map portfolio project ids → demo + default scene */
export const projectDemoMap: Record<
  string,
  { demoId: keyof typeof interactiveDemos; sceneId: string }
> = {
  "fasttable-v2": { demoId: "fasttable", sceneId: "orders" },
  "fasttable-filters": { demoId: "fasttable", sceneId: "filters" },
  "fasttable-tickets": { demoId: "fasttable", sceneId: "tickets" },
  "fasttable-rooms": { demoId: "fasttable", sceneId: "rooms" },
  "edu-platform": { demoId: "sparkora", sceneId: "onboarding" },
  "web3-bridge": { demoId: "sparkora", sceneId: "bridge" },
  "sparkora-engine": { demoId: "sparkora", sceneId: "engine" },
  "sparkora-hub": { demoId: "sparkora", sceneId: "home" },
};

export function getProjectDemo(projectId: string) {
  const link = projectDemoMap[projectId];
  if (!link) return null;
  const demo = interactiveDemos[link.demoId];
  if (!demo) return null;
  const scene =
    demo.scenes.find((s) => s.id === link.sceneId) ?? demo.scenes[0];
  return { demo, scene };
}

export function demoFrameUrl(baseUrl: string, scenePath: string) {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const path = scenePath.startsWith("/") ? scenePath : `/${scenePath}`;
  return `${base}index.html#${path}`;
}
