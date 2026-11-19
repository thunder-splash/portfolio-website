/* ------------------------------------------------------------------
   Portfolio demo bridge for the LZT AutoBuyer desktop interface.

   The app normally talks to a Python backend through pywebview. Here the
   same API surface is served by a small in-memory fake, so the real
   interface runs in a browser with invented lots, filters and purchases.
   Nothing here touches a marketplace, a token or a balance.
------------------------------------------------------------------- */
(() => {
  const now = () => Math.floor(Date.now() / 1000);
  const ago = (s) => now() - s;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[rnd(0, arr.length - 1)];

  let version = 1;
  const bump = () => { version += 1; };

  let seq = 200;
  let logSeq = 0;
  const logs = [];
  const log = (msg, level = "info") => {
    logSeq += 1;
    logs.push({ seq: logSeq, ts: now(), level, msg });
    if (logs.length > 400) logs.splice(0, logs.length - 400);
  };

  const filters = [
    { id: "f1", name: "OG-лоты до 4к", enabled: true, auto_buy: true, bought: 3,
      buy_limit: 10, min_price: 900, max_price: 4000 },
    { id: "f2", name: "Редкий набор", enabled: true, auto_buy: true, bought: 1,
      buy_limit: 3, min_price: 0, max_price: 12000 },
    { id: "f3", name: "Валюта от 5000", enabled: true, auto_buy: false, bought: 0,
      buy_limit: 0, min_price: 0, max_price: 2500 },
    { id: "f4", name: "Почта + гарантия", enabled: false, auto_buy: false, bought: 2,
      buy_limit: 0, min_price: 1500, max_price: 9000 },
  ];

  const TITLES = [
    "Лот #%id% · 212 предметов · редкий набор",
    "Лот #%id% · 88 предметов · почта в комплекте",
    "Лот #%id% · 7 400 валюты · уровень 142",
    "Лот #%id% · 164 предмета",
    "Лот #%id% · 51 предмет · почта в комплекте",
    "Лот #%id% · 19 предметов · без почты",
    "Лот #%id% · 133 предмета · гарантия 30 дней",
    "Лот #%id% · 96 предметов · уровень 118",
  ];
  const RARE = ["rare-a", "rare-b", "rare-c", "rare-d", "rare-e"];

  const makeItem = (status, tsAgo) => {
    seq += 1;
    const id = rnd(48210000, 48299999);
    const f = pick(filters.filter((x) => x.enabled)) || filters[0];
    const matched = Math.random() < 0.45 ? [pick(RARE)] : [];
    return {
      seq,
      ts: ago(tsAgo),
      item_id: id,
      title: pick(TITLES).replace("%id%", id),
      price: rnd(600, 8200),
      currency: "RUB",
      filter: f.name,
      status,
      seller: "seller_" + rnd(1000, 9999),
      note: status === "skip" ? "дороже лимита фильтра"
        : status === "fail" ? "лот уже продан" : "",
      fn: { matched, rare: matched.length ? [] : [pick(RARE)] },
      url: "#",
      can_buy: status !== "bought",
    };
  };

  const feed = [];
  const seeds = ["bought", "bought", "skip", "skip", "bought", "fail", "dry", "skip"];
  seeds.forEach((s, i) => feed.push(makeItem(s, 14 + i * 45)));

  const purchases = feed
    .filter((f) => f.status === "bought")
    .map((f) => ({
      item_id: f.item_id, title: f.title, price: f.price, ts: f.ts,
      filter: f.filter, account: "node-main",
      login: "demo-" + rnd(1000, 9999) + "@example.test",
      ms: rnd(480, 820), mail: pick(["ok", "ok", "wait"]), url: "#",
    }));

  const watch = [
    { item_id: 48217455, title: "Лот #48217455 · 301 предмет · редкий набор",
      price: 15900, start_price: 18400, ts: ago(640), url: "#" },
    { item_id: 48216902, title: "Лот #48216902 · 148 предметов · 12 500 валюты",
      price: 9100, start_price: 9100, ts: ago(2300), url: "#" },
  ];

  const accounts = [
    { id: "a1", name: "node-main", username: "node-main", balance: 18450,
      currency: "RUB", enabled: true, ok: true },
    { id: "a2", name: "node-spare", username: "node-spare", balance: 4120,
      currency: "RUB", enabled: true, ok: true },
  ];

  const cfg = {
    api_token: "", tg_token: "", tg_chat_ids: [], search_interval: 1.4,
    dry_run: false, demo: false, spend_limit: 60000, sound: false,
    auto_speed: true, seller_blacklist: [], tray: true, autostart: true,
    autorun: true, low_balance: 3000, api_token_expire: 0,
    oauth_client_id: "", oauth_redirect: "", tg_proxy: "",
    tg_fields: { matched: true, rare: true, skins: true, vbucks: true,
      last_match: true, level: true, platform: true, reg: false },
    rare_skins: RARE.slice(0, 3), tg_template: "", discount_autobuy: false,
    lzt_notify: true, mail_check: true, mail_hours: 48, mail_every: 10,
    imap_hosts: [], mail_manual: [], accounts,
    tg_template_default: "{title}\n{price}\n[[{rare}]]",
    tg_vars: ["title", "price", "rare", "last_match", "level", "skins", "vbucks"],
    oauth_default_id: "autobuyer-desktop",
    oauth_default_redirect: "http://127.0.0.1:47321/callback",
  };

  const stats = {
    found: 1284, bought: purchases.length, spent: 12310, errors: 0,
    started_at: ago(9240), latency: 198, interval: 1.4,
  };

  let running = true;

  log("Демо-режим: данные выдуманные, покупки не настоящие", "warn");
  log("Поиск запущен · 3 фильтра включено", "ok");

  /* a new lot every few seconds, so the feed looks alive */
  setInterval(() => {
    if (!running) return;
    const auto = filters.find((f) => f.enabled && f.auto_buy);
    const willBuy = auto && !cfg.dry_run && Math.random() < 0.35;
    const item = makeItem(willBuy ? "bought" : pick(["skip", "skip", "dry", "fail"]), 0);
    feed.unshift(item);
    if (feed.length > 60) feed.pop();
    stats.found += rnd(1, 4);
    if (item.status === "bought") {
      purchases.unshift({
        item_id: item.item_id, title: item.title, price: item.price, ts: item.ts,
        filter: item.filter, account: "node-main",
        login: "demo-" + rnd(1000, 9999) + "@example.test",
        ms: rnd(480, 820), mail: "wait", url: "#",
      });
      stats.bought += 1;
      stats.spent += item.price;
      log("Куплено: " + item.title + " за " + item.price + " ₽", "ok");
    }
    stats.latency = rnd(150, 320);
    bump();
  }, 7000);

  const state = () => ({
    version,
    running,
    dry_run: !!cfg.dry_run,
    demo: false,
    paused: 0,
    stats: {
      ...stats,
      uptime: running ? now() - stats.started_at : 0,
      interval: cfg.search_interval,
    },
    me: { username: "node-main", balance: 18450, currency: "RUB" },
    rate: { limit: 150, remaining: rnd(90, 148) },
    feed: feed.slice(0, 60),
    logs: [],
    purchases: purchases.slice(0, 300),
    filters,
    demo_bought: {},
    watch,
    accounts,
    mail: [],
  });

  const ok = (v) => Promise.resolve(v);
  const nope = (msg) => ok({ ok: false, error: msg });

  const api = {
    get_state: (v, since) => {
      if (v === version) return ok({ version, same: true });
      const s = state();
      s.logs = logs.filter((l) => l.seq > (since || 0));
      return ok(s);
    },
    get_config: () => ok({ ...cfg }),
    version: () => ok("1.4.2"),
    changelog: () => ok({
      version: "1.4.2",
      unseen: [],
      entries: [
        { version: "1.4.2", date: "2026-11-18",
          items: ["Слежение за ценой по одному лоту", "Свой шаблон карточки в Telegram"] },
        { version: "1.4.0", date: "2026-11-11",
          items: ["Несколько аккаунтов маркета", "Проверка почты купленных аккаунтов по IMAP"] },
        { version: "1.3.0", date: "2026-11-04",
          items: ["Авто-скорость по остатку лимита API", "Выгрузка покупок в CSV"] },
      ],
    }),
    changelog_seen: () => ok(true),

    start: () => { running = true; stats.started_at = now(); log("Поиск запущен", "ok"); bump(); return ok({ ok: true }); },
    stop: () => { running = false; log("Поиск остановлен", "warn"); bump(); return ok({ ok: true }); },

    save_settings: (data) => {
      Object.assign(cfg, data || {});
      if (data && "dry_run" in data) {
        log(data.dry_run ? "Режим «Тест» — покупок не будет" : "Боевой режим", "warn");
      }
      bump();
      return ok({ ok: true });
    },

    patch_filter: (id, key, value) => {
      const f = filters.find((x) => String(x.id) === String(id));
      if (f) { f[key] = value; log(`Фильтр «${f.name}» ${value ? "включён" : "выключен"}`); bump(); }
      return ok({ ok: true });
    },
    save_filter: (d) => {
      const i = filters.findIndex((x) => x.id === d.id);
      if (i >= 0) filters[i] = { ...filters[i], ...d };
      else filters.push({ ...d, id: "f" + (filters.length + 1), bought: 0 });
      bump();
      return ok(filters);
    },
    delete_filter: (id) => {
      const i = filters.findIndex((x) => String(x.id) === String(id));
      if (i >= 0) filters.splice(i, 1);
      bump();
      return ok(filters);
    },
    duplicate_filter: (id) => {
      const f = filters.find((x) => String(x.id) === String(id));
      if (f) filters.push({ ...f, id: "f" + (filters.length + 1), name: f.name + " (копия)", bought: 0 });
      bump();
      return ok(filters);
    },
    reorder_filters: () => ok(filters),
    test_filter: () => ok({ ok: true, count: rnd(4, 26) }),
    parse_url: () => ok({ ok: true, min_price: 900, max_price: 4000 }),
    export_filters: () => nope("В демо выгрузка в файл отключена"),
    import_filters: () => nope("В демо импорт из файла отключён"),

    buy: (itemId, price) => {
      if (cfg.dry_run) return ok({ dry: true });
      const item = feed.find((f) => f.item_id === itemId);
      if (item) { item.status = "bought"; item.can_buy = false; }
      purchases.unshift({
        item_id: itemId, title: item ? item.title : "Лот #" + itemId,
        price, ts: now(), filter: item ? item.filter : "—", account: "node-main",
        login: "demo-" + rnd(1000, 9999) + "@example.test",
        ms: rnd(480, 820), mail: "wait", url: "#",
      });
      stats.bought += 1;
      stats.spent += Number(price) || 0;
      log("Куплено вручную за " + price + " ₽", "ok");
      bump();
      return ok({ ok: true, ms: rnd(480, 820) });
    },

    watch_add: (itemId) => {
      if (watch.some((w) => w.item_id === itemId)) return ok({ ok: false, error: "Уже слежу" });
      const item = feed.find((f) => f.item_id === itemId);
      watch.unshift({
        item_id: itemId, title: item ? item.title : "Лот #" + itemId,
        price: item ? item.price : 0, start_price: item ? item.price : 0,
        ts: now(), url: "#",
      });
      bump();
      return ok({ ok: true });
    },
    watch_remove: (itemId) => {
      const i = watch.findIndex((w) => w.item_id === itemId);
      if (i >= 0) watch.splice(i, 1);
      bump();
      return ok({ ok: true });
    },

    account_toggle: (id) => {
      const a = accounts.find((x) => x.id === id);
      if (a) a.enabled = !a.enabled;
      bump();
      return ok({ ok: true });
    },
    account_remove: (id) => {
      const i = accounts.findIndex((x) => x.id === id);
      if (i >= 0) accounts.splice(i, 1);
      bump();
      return ok({ ok: true });
    },
    account_add: () => nope("В демо второй аккаунт не добавить"),

    lzt_login: () => nope("В демо вход в маркет отключён"),
    lzt_login_cancel: () => ok({ ok: true }),
    lzt_login_available: () => ok(false),
    check_token: () => nope("В демо токен не проверяется"),
    test_tg: () => nope("В демо Telegram не подключён"),
    tg_preview: () => ok({ ok: true, text: "Карточка собирается на стороне приложения" }),

    export_csv: () => nope("В демо выгрузка в файл отключена"),
    open_data_dir: () => nope("В демо доступа к папке нет"),
    create_shortcut: () => nope("В демо ярлык не создать"),
    open_url: () => ok({ ok: true }),
  };

  window.pywebview = {
    api: new Proxy(api, {
      get: (t, k) => (k in t ? t[k] : () => ok({ ok: true })),
    }),
  };

  /* The portfolio playground addresses scenes by hash (#/filters, #/purchases…).
     The app navigates with its own sidebar, so translate one into the other. */
  const PAGES = ["dash", "filters", "purchases", "log", "settings", "help"];
  const gotoScene = () => {
    const want = (location.hash || "").replace(/^#\/?/, "").trim();
    if (!PAGES.includes(want)) return;
    const btn = document.querySelector(`[data-page="${want}"]`);
    if (btn) btn.click();
  };

  // the app boots on this event; fire it once its own script has parsed
  const boot = () => {
    window.dispatchEvent(new Event("pywebviewready"));
    setTimeout(gotoScene, 60);
  };
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
  window.addEventListener("hashchange", gotoScene);
})();
