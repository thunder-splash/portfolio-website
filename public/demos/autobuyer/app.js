"use strict";
/* ================= helpers ================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const fmt = n => Number(n || 0).toLocaleString("ru-RU", {maximumFractionDigits: 2});
const tm = ts => new Date(ts * 1000).toLocaleTimeString("ru-RU");
const tmShort = ts => new Date(ts * 1000).toLocaleTimeString("ru-RU", {hour: "2-digit", minute: "2-digit"});
const dt = ts => new Date(ts * 1000).toLocaleString("ru-RU", {day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"});
const icon = (id, cls = "s") => `<svg class="ic ${cls}"><use href="#i-${id}"/></svg>`;
const upStr = u => { const h = Math.floor(u / 3600), m = Math.floor(u % 3600 / 60), s = u % 60; return (h ? h + ":" : "") + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0"); };
const SITE = "https://lzt.market";
const store = {get(k, d) { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }};

let api = null;
const S = {
  version: -1, logSince: 0, logs: [], running: false, dry: true, demo: false, paused: 0, uptime: 0,
  filters: [], feed: [], purchases: [], me: {}, stats: {}, demoBought: {}, cfg: {},
  seenFeed: new Set(), seenBought: null, firstLoad: true, filtersKey: "", feedKey: "",
  page: "dash", logLevel: "all", logSeen: 0, feedFilter: store.get("feedFilter", "all"),
  // редактор фильтра
  edit: null, orig: null, base: {}, dirty: false, action: "notify", mode: "check", prio: 1, edInit: false,
};
const TITLES = {dash: "Обзор", filters: "Фильтры", purchases: "Покупки", log: "Журнал", settings: "Настройки", help: "Инструкция"};

/* ================= categories ================= */
const CATS = [{id: "fortnite", label: "Fortnite", cat: "epicgames", fix: [["epicgames_game[]", "fortnite"]]}];  // программа только для Fortnite
const MANAGED = new Set(["pmin", "pmax", "smin", "smax", "vbmin", "vbmax", "email_type[]", "change_email", "eg"]);
function catOf(f) {
  const ps = f.params || [];
  return f.category === "epicgames" && ps.some(p => p[0] === "epicgames_game[]" && p[1] === "fortnite") ? CATS[0] : null;
}
function siteUrl(f) {
  const ps = (f.params || []).filter(p => p[0] !== "epicgames_game[]");
  const game = (f.params || []).find(p => p[0] === "epicgames_game[]");
  const q = new URLSearchParams(ps).toString();
  return `${SITE}/${f.category}${game ? "/" + game[1] : ""}/${q ? "?" + q : ""}`;
}
const priceStr = f => {
  const a = Number(f.min_price) || 0, b = Number(f.max_price) || 0;
  if (!a && !b) return "любая цена";
  if (!a) return `до ${fmt(b)} ₽`;
  if (!b) return `от ${fmt(a)} ₽`;
  return `${fmt(a)}–${fmt(b)} ₽`;
};
const doneOf = f => S.demo ? (S.demoBought[f.id] || 0) : (f.bought || 0);

/* ================= small utils ================= */
function toast(msg, kind = "") {
  const t = document.createElement("div");
  t.className = "toast " + kind;
  t.innerHTML = icon({ok: "check", err: "x", warn: "warn"}[kind] || "bolt") + `<span>${esc(msg)}</span>`;
  $("#toasts").appendChild(t);
  setTimeout(() => { t.style.transition = "opacity .3s"; t.style.opacity = 0; setTimeout(() => t.remove(), 300); }, 3600);
}
let actx = null;
function beep(type = "find") {
  if (!S.cfg.sound) return;
  try {
    actx = actx || new AudioContext();
    (type === "buy" ? [880, 1175, 1568] : [988, 1319]).forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "sine"; o.frequency.value = f;
      const t0 = actx.currentTime + i * 0.09;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
      o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + 0.18);
    });
  } catch (e) {}
}
function ask(title, text = "", {ok = "Да", cancel = "Отмена", danger = false} = {}) {
  return new Promise(res => {
    const m = $("#askModal");
    $("#askT").textContent = title;
    $("#askD").textContent = text; $("#askD").hidden = !text;
    $("#askYes").textContent = ok; $("#askNo").textContent = cancel;
    $("#askYes").className = "btn sm " + (danger ? "danger-solid" : "primary");
    m.classList.add("show");
    setTimeout(() => $("#askYes").focus(), 30);
    const done = v => { m.classList.remove("show"); document.removeEventListener("keydown", key, true); res(v); };
    const key = e => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); done(false); }
      else if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); done(document.activeElement !== $("#askNo")); }
    };
    document.addEventListener("keydown", key, true);
    $("#askYes").onclick = () => done(true);
    $("#askNo").onclick = () => done(false);
    m.onmousedown = e => { if (e.target === m) done(false); };
  });
}
const askOpen = () => $("#askModal").classList.contains("show");
const copy = text => navigator.clipboard.writeText(text).then(() => toast("Скопировано", "ok")).catch(() => toast("Не удалось скопировать", "err"));
const openUrl = url => url && api.open_url(url);
function seg(el, val) { $$(`#${el} button`).forEach(b => b.classList.toggle("on", (b.dataset.v ?? b.dataset.mode ?? b.dataset.f ?? b.dataset.lv) === String(val))); }

/* ================= navigation ================= */
function go(page) {
  if (S.page === "filters" && page !== "filters" && S.dirty) toast("В фильтре остались несохранённые изменения", "warn");
  S.page = page;
  $$(".nav button[data-page]").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  $$(".page").forEach(p => p.classList.toggle("active", p.id === "page-" + page));
  $("#pageTitle").textContent = TITLES[page];
  if (page === "settings") loadSettings();
  if (page === "log") { renderLog(true); markLogSeen(); }
  if (page === "filters") renderFList();
}
$$(".nav button[data-page]").forEach(b => b.onclick = () => go(b.dataset.page));
$$("[data-go]").forEach(b => b.onclick = () => go(b.dataset.go));
$("#acct").onclick = () => go("settings");

/* ================= polling ================= */
async function poll() {
  try { const st = await api.get_state(S.version, S.logSince); if (!st.same) apply(st); }
  catch (e) { console.error(e); }
  setTimeout(poll, 350);
}

function apply(st) {
  S.version = st.version;
  S.running = st.running; S.dry = st.dry_run; S.demo = st.demo; S.paused = st.paused;
  S.demoBought = st.demo_bought || {}; S.me = st.me || {}; S.stats = st.stats; S.rate = st.rate; S.uptime = st.stats.uptime;

  const fresh = [];
  for (const it of st.feed) if (!S.seenFeed.has(it.seq)) { S.seenFeed.add(it.seq); fresh.push(it.seq); }
  S.feed = st.feed;
  if (S.seenBought !== null && st.purchases.length > S.seenBought) {
    const p = st.purchases[0];
    beep("buy"); toast(`Куплено: ${p.title || "#" + p.item_id} за ${fmt(p.price)} ₽`, "ok");
    const m = $("#mBought").closest(".metric"); m.classList.remove("flash"); void m.offsetWidth; m.classList.add("flash");
  } else if (fresh.length && !S.firstLoad) beep("find");
  S.seenBought = st.purchases.length;
  const purchChanged = st.purchases.length !== S.purchases.length;
  S.purchases = st.purchases;
  const wk = JSON.stringify(st.watch || []);
  const watchChanged = wk !== S.watchKey; S.watchKey = wk; S.watch = st.watch || [];
  const mk = JSON.stringify(st.mail || []);
  if (mk !== S.mailKey) { S.mailKey = mk; renderMailManual(st.mail); }
  const ak = JSON.stringify(st.accounts || []);
  if (ak !== S.accKey) { S.accKey = ak; S.accounts = st.accounts || []; renderAccounts(); }
  if (st.logs.length) {
    S.logs.push(...st.logs); S.logSince = st.logs[st.logs.length - 1].seq;
    if (S.logs.length > 1500) S.logs.splice(0, S.logs.length - 1500);
  }
  const key = JSON.stringify([st.filters, st.demo_bought, st.demo, st.running]);
  const filtersChanged = key !== S.filtersKey;
  S.filtersKey = key;
  S.filters = st.filters;

  if (!S.edInit) { S.edInit = true; loadEditor(S.filters[0] || null); }
  else if (filtersChanged) syncEditor();

  renderBar();
  renderSetup();
  renderMetrics();
  renderFeed(S.firstLoad ? [] : fresh);
  if (filtersChanged) { renderOvFilters(); renderFList(); }
  if (filtersChanged || purchChanged) { renderOvBuys(); renderPurchases(); }
  if (watchChanged) { renderWatch(); S.feedKey = ""; renderFeed(); }
  if (st.logs.length) { if (S.page === "log") renderLog(false, st.logs); renderLogDot(); }
  S.firstLoad = false;
}

/* ================= top bar ================= */
function renderBar() {
  const on = S.filters.filter(f => f.enabled);
  const st = $("#status");
  let cls = "", txt;
  if (!S.running) txt = on.length ? `Остановлен · готово фильтров: ${on.length}` : "Остановлен";
  else if (!on.length) { cls = "is-warn"; txt = "Нет включённых фильтров — поиск ждёт"; }
  else if (S.paused) { cls = "is-warn"; txt = `Пауза ${S.paused} с — LZT просит подождать`; }
  else {
    cls = "is-run";
    const buy = on.filter(f => f.auto_buy).length;
    txt = `Ищу по ${on.length} ${plural(on.length, "фильтру", "фильтрам", "фильтрам")}` + (buy ? ` · автопокупка в ${buy}` : "") + ` · шаг ${Number(S.stats.interval || 0).toFixed(1)} с`;
  }
  st.className = "status " + cls;
  $("#statusText").textContent = txt;

  const rb = $("#runBtn");
  rb.classList.toggle("on", S.running);
  rb.querySelector("use").setAttribute("href", S.running ? "#i-stop" : "#i-play");
  $("#runText").textContent = S.running ? `Стоп · ${upStr(S.uptime)}` : "Запустить";
  rb.title = (S.running ? "Остановить поиск" : "Запустить поиск") + " (Ctrl+Enter)";

  $("#demoPill").hidden = !S.demo;
  $("#modeSeg").classList.toggle("disabled", S.demo);
  seg("modeSeg", S.dry ? "test" : "live");

  $("#navFilters").textContent = S.filters.length ? `${on.length}/${S.filters.length}` : "";
  $("#navBought").textContent = S.purchases.length || "";

  const me = S.me, a = $("#acct");
  a.classList.toggle("on", !!me.username && !S.demo);
  a.classList.toggle("demo", S.demo);
  $("#acctAva").textContent = S.demo ? "D" : (me.username || "?")[0].toUpperCase();
  $("#acctName").textContent = S.demo ? "Демо-маркет" : me.username || "Не подключено";
  $("#acctSub").textContent = me.balance != null ? `${fmt(me.balance)} ${me.currency || "₽"}` : S.demo ? "ненастоящие деньги" : "Добавь API токен";
}
const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };

/* ================= overview ================= */
function renderSetup() {
  const conn = !!S.me.username || S.demo, hasF = S.filters.length > 0;
  const box = $("#setup");
  box.hidden = conn && hasF;
  if (box.hidden) return;
  const steps = [
    {done: conn, t: "Подключи LZT", d: "Войди через LZT — одна кнопка", run: () => lztLogin()},
    {done: hasF, t: "Создай фильтр", d: "Категория, цена — и что делать с находкой", run: () => newFilter()},
    {done: S.running, t: "Запусти поиск", d: "Кнопка справа вверху или Ctrl+Enter", run: () => start()},
  ];
  const cur = steps.findIndex(s => !s.done);
  $("#steps").innerHTML = steps.map((s, i) => `<button class="step ${s.done ? "done" : i === cur ? "cur" : ""}" data-step="${i}">
    <span class="step-n">${s.done ? icon("check", "") : i + 1}</span><span class="step-b"><b>${s.t}</b><span>${s.d}</span></span></button>`).join("");
  renderSetup.steps = steps;
}
$("#steps").onclick = e => { const b = e.target.closest("[data-step]"); if (b) renderSetup.steps[Number(b.dataset.step)].run(); };
$("#setupDemo").onclick = async () => { await api.save_settings({demo: true}); S.version = -1; toast("Демо-маркет включён — создай фильтр и запусти поиск", "ok"); };

function renderMetrics() {
  const s = S.stats, p = S.purchases;
  const test = S.dry && !S.demo;
  $("#mFound").textContent = fmt(s.found);
  $("#mFoundS").textContent = S.running ? `за ${upStr(S.uptime)}` : "за сессию";
  $("#mBought").textContent = fmt(p.length);
  $("#mBoughtS").textContent = test ? "тест — без покупок" : s.bought ? `за сессию ${fmt(s.bought)}` : "за всё время";
  $("#mSpent").textContent = fmt(p.reduce((a, x) => a + Number(x.price || 0), 0)) + " ₽";
  $("#mSpentS").textContent = s.spent ? `за сессию ${fmt(s.spent)} ₽` : "за всё время";
  $("#mBal").textContent = S.me.balance != null ? `${fmt(S.me.balance)} ${S.me.currency || "₽"}` : "—";
  $("#mBalS").textContent = S.demo ? "демо-баланс" : S.me.username ? S.me.username : "не подключено";
  $("#mSpeed").textContent = S.running && s.latency ? `${s.latency} мс` : "—";
  $("#mSpeedS").textContent = S.running ? (S.rate && S.rate.limit ? `лимит ${S.rate.remaining}/${S.rate.limit}` : `шаг ${Number(s.interval || 0).toFixed(1)} с`) + (s.errors ? ` · ошибок ${s.errors}` : "") : "пинг до LZT";
}

const STATUS = {bought: ["ok", "Куплено"], fail: ["err", "Ошибка"], dry: ["mute", "Тест"], buying: ["warn", "Покупка…"], skip: ["mute", "Пропуск"]};
function renderFeed(fresh = []) {
  const ff = S.feedFilter;
  const items = S.feed.filter(i => ff === "all" || (ff === "bought" ? i.status === "bought" : i.status === "fail"));
  const key = ff + "|" + items.map(i => i.seq + i.status + i.filter).join(",") + "|" + S.running;
  $("#feedCnt").textContent = S.feed.length;
  if (key === S.feedKey && !fresh.length) return;
  S.feedKey = key;
  const box = $("#feed");
  if (!items.length) {
    box.innerHTML = ff !== "all" ? `<div class="empty"><b>Здесь пусто</b><span>${ff === "bought" ? "Покупок за эту сессию ещё не было" : "Ошибок нет"}</span></div>`
      : S.running ? `<div class="empty">${icon("search", "")}<b>Жду новые объявления</b><span>Лоты, которые уже висели до запуска, пропускаются — если не включено «Уже висящие лоты» в фильтре</span></div>`
      : `<div class="empty">${icon("bolt", "")}<b>Лента пуста</b><span>Запусти поиск — здесь появятся новые лоты по включённым фильтрам</span></div>`;
    return;
  }
  const fr = new Set(fresh);
  box.innerHTML = items.map(i => {
    const st = STATUS[i.status] || ["info", "Найден"];
    const canBuy = i.can_buy !== false && (!i.status || ["new", "fail", "skip", "dry"].includes(i.status));
    const fn = i.fn || {}, hint = (fn.matched && fn.matched.length ? fn.matched : fn.rare || []).slice(0, 4).join(", ");
    const sub = [i.seller, i.note].filter(Boolean).join(" · ");
    const watched = (S.watch || []).some(w => w.item_id === i.item_id);
    return `<div class="fi ${fr.has(i.seq) ? "fresh" : ""}">
      <span class="fi-t">${tmShort(i.ts)}</span>
      <div class="fi-n" title="${esc(i.title)}${i.note ? "\n" + esc(i.note) : ""}"><b>${esc(i.title || "#" + i.item_id)}</b>${sub || hint ? `<span>${esc(sub)}${sub && hint ? " · " : ""}${hint ? `<em class="rare">🔥 ${esc(hint)}</em>` : ""}</span>` : ""}</div>
      <span class="fi-f">${esc(i.filter)}</span>
      <span class="fi-p">${fmt(i.price)}<small>${esc(i.currency || "₽")}</small></span>
      <span><span class="badge ${st[0]}">${st[1]}</span></span>
      <div class="fi-a">${canBuy ? `<button class="btn ghost xs" data-buy="${i.item_id}" data-price="${i.price}" title="Купить сейчас">Купить</button>` : ""}<button class="btn ghost xs sq" data-watch="${i.item_id}" title="${watched ? "Уже слежу за ценой" : "Следить за ценой (в избранное LZT)"}" ${watched ? "disabled" : ""}>${icon("eye")}</button><button class="btn ghost xs sq" data-open="${esc(i.url)}" title="Открыть на сайте">${icon("ext")}</button></div>
    </div>`;
  }).join("");
}
$("#feedSeg").onclick = e => { const b = e.target.closest("button"); if (!b) return; S.feedFilter = b.dataset.f; store.set("feedFilter", b.dataset.f); seg("feedSeg", b.dataset.f); renderFeed(); };
$("#feed").onclick = async e => {
  const o = e.target.closest("[data-open]"); if (o) return openUrl(o.dataset.open);
  const w = e.target.closest("[data-watch]");
  if (w) { const r = await api.watch_add(Number(w.dataset.watch)); toast(r.ok ? "Слежу за ценой — лот добавлен в избранное LZT" : (r.error || "Уже слежу"), r.ok ? "ok" : "warn"); return; }
  const b = e.target.closest("[data-buy]"); if (!b) return;
  if (!S.dry && !S.demo && !(await ask(`Купить лот за ${fmt(b.dataset.price)} ₽?`, "Деньги спишутся с баланса LZT.", {ok: "Купить"}))) return;
  b.disabled = true; b.textContent = "…";
  const slow = setTimeout(() => toast("LZT проверяет аккаунт — это бывает долго, жду ответ…"), 4000);
  const r = await api.buy(Number(b.dataset.buy), Number(b.dataset.price));
  clearTimeout(slow);
  if (r.dry) toast("Режим «Тест» — покупка не выполнена", "warn");
  else if (r.ok) toast(`Куплено за ${r.ms} мс`, "ok");
  else toast("Не удалось: " + r.error, "err");
  S.feedKey = "";
};

function renderOvFilters() {
  const box = $("#ovFilters");
  $("#ovFCnt").textContent = S.filters.filter(f => f.enabled).length + "/" + S.filters.length;
  if (!S.filters.length) { box.innerHTML = `<div class="empty"><b>Фильтров нет</b><span>Фильтр говорит программе, что искать и за сколько покупать</span><button class="btn primary sm" data-new>${icon("plus")}Создать фильтр</button></div>`; return; }
  box.innerHTML = S.filters.map(f => {
    const done = doneOf(f), lim = Number(f.buy_limit) || 0;
    return `<div class="of ${f.enabled ? "" : "off"}" data-id="${f.id}">
      <span class="f-dot ${f.enabled ? (S.running ? "live" : "on") : ""}"></span>
      <div class="of-b"><div class="of-n">${esc(f.name)}</div>
        <div class="of-m">${esc(priceStr(f))} · ${f.auto_buy ? `<span class="buy">покупает</span>` : "уведомляет"} · куплено ${done}${lim ? "/" + lim : ""}</div>
        ${lim ? `<div class="bar-p"><i style="width:${Math.min(100, done / lim * 100)}%"></i></div>` : ""}</div>
      <label class="sw" data-stop title="Включить / выключить"><input type="checkbox" data-en="${f.id}" ${f.enabled ? "checked" : ""}><i></i></label>
    </div>`;
  }).join("");
}
$("#ovFilters").onchange = e => { const i = e.target.closest("[data-en]"); if (i) api.patch_filter(i.dataset.en, "enabled", i.checked); };
$("#ovFilters").onclick = e => {
  if (e.target.closest("[data-new]")) return newFilter();
  if (e.target.closest("[data-stop]")) return;
  const r = e.target.closest("[data-id]"); if (r) openFilter(r.dataset.id);
};

function renderOvBuys() {
  const p = S.purchases.slice(0, 12), box = $("#ovBuys");
  if (!p.length) { box.innerHTML = `<div class="empty"><b>Пока ничего</b><span>${S.dry && !S.demo ? "В режиме «Тест» программа только находит лоты" : "Купленные аккаунты появятся здесь"}</span></div>`; return; }
  box.innerHTML = p.map(x => `<div class="ob" data-url="${esc(x.url)}" title="${esc(x.title)}">
    <div class="ob-b"><div class="ob-n">${esc(x.title || "#" + x.item_id)}</div><div class="ob-m">${dt(x.ts)}${x.demo ? " · демо" : ""}</div></div>
    <span class="ob-p">${fmt(x.price)} ₽</span></div>`).join("");
}
$("#ovBuys").onclick = e => { const r = e.target.closest("[data-url]"); if (r) openUrl(r.dataset.url); };

function renderWatch() {
  const w = S.watch || [], box = $("#ovWatch");
  $("#watchCnt").textContent = w.length;
  if (!w.length) { box.innerHTML = `<div class="empty"><b>Ни за чем не слежу</b><span>Нажми 👁 у лота в ленте или в Telegram, либо включи «Следить за ценой» в фильтре</span></div>`; return; }
  // лоты проверяются по одному, ~раз в 2.4 с — честно показываем, как быстро дойдёт очередь
  const cyc = w.length * 2.4, cycTxt = cyc < 90 ? `${Math.max(5, Math.round(cyc / 5) * 5)} с` : `${Math.round(cyc / 60)} мин`;
  box.innerHTML = `<div class="ow-h">Каждый лот проверяется раз в ~${cycTxt}${w.length > 120 ? " — убери лишние, и будет чаще" : ""}</div>` + w.map(x => {
    const d = Number(x.price) - Number(x.start_price || x.price);
    return `<div class="ob" data-url="${esc(x.url)}" title="${esc(x.title)}">
      <div class="ob-b"><div class="ob-n">${esc(x.title || "#" + x.item_id)}</div><div class="ob-m">с ${dt(x.since)} · ${esc(x.filter || "")}</div></div>
      <span class="ow-p">${fmt(x.price)} ₽${d ? `<small class="${d < 0 ? "dn" : "up"}">${d < 0 ? "▼" : "▲"} ${fmt(Math.abs(d))}</small>` : `<small>без изменений</small>`}</span>
      <button class="btn ghost xs sq" data-unwatch="${x.item_id}" title="Не следить">${icon("x")}</button></div>`;
  }).join("");
}
$("#ovWatch").onclick = async e => {
  const u = e.target.closest("[data-unwatch]");
  if (u) { e.stopPropagation(); await api.watch_remove(Number(u.dataset.unwatch)); toast("Больше не слежу"); return; }
  const r = e.target.closest("[data-url]"); if (r) openUrl(r.dataset.url);
};
$("#sideSeg").onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  const watch = b.dataset.f === "watch";
  seg("sideSeg", b.dataset.f);
  $("#ovBuys").hidden = watch; $("#ovWatch").hidden = !watch; $("#allBuysLink").hidden = watch;
};

/* ================= filters: list ================= */
function renderFList() {
  if (fDrag && fDrag.on) return; // не перерисовываем список, пока тащат фильтр
  const q = $("#fSearch").value.trim().toLowerCase();
  const list = S.filters.filter(f => !q || f.name.toLowerCase().includes(q));
  let html = "";
  if (S.edit === null) html += `<div class="fitem sel new"><span class="f-dot new"></span><div class="of-b"><div class="of-n">${esc($("#eName").value.trim() || "Новый фильтр")}</div><div class="of-m">не сохранён</div></div></div>`;
  html += list.map(f => `<div class="fitem ${f.id === S.edit ? "sel" : ""} ${f.enabled ? "" : "off"}" data-id="${f.id}" title="${q ? "" : "Зажми и тяни, чтобы поменять порядок"}">
      <span class="f-dot ${f.enabled ? (S.running ? "live" : "on") : ""}"></span>
      <div class="of-b"><div class="of-n">${esc(f.name)}</div><div class="of-m">${esc(priceStr(f))}${f.auto_buy ? ` · <span class="buy">покупает</span>` : ""}</div></div>
      <label class="sw" data-stop title="Включить / выключить"><input type="checkbox" data-en="${f.id}" ${f.enabled ? "checked" : ""}><i></i></label>
    </div>`).join("");
  if (!html) html = `<div class="empty"><b>Ничего не найдено</b></div>`;
  $("#flist").innerHTML = html;
}
$("#fSearch").oninput = renderFList;
$("#flist").onchange = e => { const i = e.target.closest("[data-en]"); if (i) api.patch_filter(i.dataset.en, "enabled", i.checked); };
/* перетаскивание: зажал фильтр — он «отрывается» плашкой и едет за курсором,
   остальные плавно раздвигаются, на месте вставки — пустая ячейка */
var fDrag = null, fDragUntil = 0; // var: renderFList может вызваться раньше этой строки
$("#flist").addEventListener("pointerdown", e => {
  if (e.button !== 0 || e.target.closest("[data-stop]")) return;
  const el = e.target.closest(".fitem[data-id]");
  if (!el || $("#fSearch").value.trim()) return; // при поиске порядок не меняем — видна только часть списка
  e.preventDefault(); // без выделения текста и родного drag браузера
  fDrag = { el, x0: e.clientX, y0: e.clientY, on: false, pid: e.pointerId };
});
function fFlip(box, fn) {
  // FLIP: запоминаем позиции, меняем порядок, плавно доезжаем
  const els = [...box.querySelectorAll(".fitem[data-id]:not(.ph)")];
  const top0 = new Map(els.map(x => [x, x.getBoundingClientRect().top]));
  fn();
  els.forEach(x => {
    const d = top0.get(x) - x.getBoundingClientRect().top;
    if (!d) return;
    x.style.transition = "none"; x.style.transform = `translateY(${d}px)`;
    requestAnimationFrame(() => { x.style.transition = "transform .16s cubic-bezier(.2,.7,.3,1)"; x.style.transform = ""; });
  });
}
function fDragMove(e) {
  const d = fDrag; if (!d) return;
  const box = $("#flist");
  if (!d.on) {
    if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 5) return;
    d.on = true;
    const r = d.el.getBoundingClientRect();
    d.dy = d.y0 - r.top; d.left = r.left;
    d.ghost = d.el.cloneNode(true);
    d.ghost.classList.add("fghost"); d.ghost.classList.remove("sel");
    d.ghost.removeAttribute("data-id"); d.ghost.removeAttribute("title");
    Object.assign(d.ghost.style, { width: r.width + "px", height: r.height + "px", left: r.left + "px", top: r.top + "px" });
    document.body.appendChild(d.ghost);
    d.el.classList.add("ph"); box.classList.add("sorting");
    document.body.classList.add("grabbing");
    try { box.setPointerCapture(d.pid); } catch (_) {}
  }
  e.preventDefault();
  const b = box.getBoundingClientRect();
  const top = Math.max(b.top - 14, Math.min(b.bottom - d.el.offsetHeight + 14, e.clientY - d.dy));
  d.ghost.style.top = top + "px";
  d.lastY = e.clientY;
  if (e.clientY < b.top + 30) box.scrollTop -= 12; else if (e.clientY > b.bottom - 30) box.scrollTop += 12;
  const mid = top + d.el.offsetHeight / 2;
  const others = [...box.querySelectorAll(".fitem[data-id]:not(.ph)")];
  const next = others.find(x => { const r = x.getBoundingClientRect(); return mid < r.top + r.height / 2; }) || null;
  if (next === d.el.nextElementSibling || (!next && d.el === box.lastElementChild)) return;
  fFlip(box, () => next ? box.insertBefore(d.el, next) : box.appendChild(d.el));
}
async function fDragEnd() {
  const d = fDrag; fDrag = null;
  if (!d || !d.on) return;
  fDragUntil = Date.now() + 300; // клик после отпускания не должен открывать фильтр
  const box = $("#flist");
  try { box.releasePointerCapture(d.pid); } catch (_) {}
  // плашка «ложится» на своё место
  const r = d.el.getBoundingClientRect();
  d.ghost.classList.add("drop");
  d.ghost.style.top = r.top + "px"; d.ghost.style.left = r.left + "px";
  setTimeout(() => { d.ghost.remove(); d.el.classList.remove("ph"); box.classList.remove("sorting"); document.body.classList.remove("grabbing"); }, 150);
  const ids = [...box.querySelectorAll(".fitem[data-id]")].map(x => x.dataset.id);
  if (ids.join() === S.filters.map(f => f.id).join()) return;
  S.filters = ids.map(id => S.filters.find(f => f.id === id)).filter(Boolean);
  try { await api.reorder_filters(ids); } catch (err) { toast("Не удалось сохранить порядок"); }
}
window.addEventListener("pointermove", fDragMove);
window.addEventListener("pointerup", fDragEnd);
window.addEventListener("pointercancel", fDragEnd);
window.addEventListener("blur", fDragEnd);

$("#flist").onclick = async e => {
  if (Date.now() < fDragUntil) return;
  if (e.target.closest("[data-stop]")) return;
  const r = e.target.closest("[data-id]"); if (!r || r.dataset.id === S.edit) return;
  const id = r.dataset.id;
  if (!(await confirmLeave())) return;
  loadEditor(S.filters.find(f => f.id === id));
};
$("#fNew").onclick = () => newFilter();
$("#allOn").onclick = () => S.filters.forEach(f => !f.enabled && api.patch_filter(f.id, "enabled", true));
$("#allOff").onclick = () => S.filters.forEach(f => f.enabled && api.patch_filter(f.id, "enabled", false));

async function confirmLeave() {
  return !S.dirty || await ask("Отбросить изменения?", "В фильтре есть правки, которые ещё не сохранены.", {ok: "Отбросить", danger: true});
}
async function newFilter() {
  if (S.page === "filters" && S.edit === null && !S.dirty) { $("#eName").focus(); return; }
  if (!(await confirmLeave())) return;
  go("filters"); loadEditor(null); setTimeout(() => $("#eName").focus(), 40);
}
async function openFilter(id) {
  const f = S.filters.find(x => x.id === id); if (!f) return;
  if (S.edit !== id && !(await confirmLeave())) return;
  go("filters"); if (S.edit !== id) loadEditor(f);
}

/* ================= filters: editor ================= */
const NEW_FILTER = () => ({name: "", category: "epicgames", params: [["epicgames_game[]", "fortnite"], ["order_by", "pdate_to_down_upload"]], url: "",
  enabled: true, notify: true, auto_buy: false, buy_mode: "check", min_seller_sales: 0, use_blacklist: true, buy_delay: 0, buy_limit: 0,
  min_price: 0, max_price: 0, include: "", exclude: "", priority: 1, buy_existing: false});

const curCat = () => CATS[0];
function updCat() { updSub(); }
function updSub() {
  const c = curCat();
  if (S.edit === null) { $("#eSub").textContent = `${c.label} · новый фильтр`; return; }
  const f = S.filters.find(x => x.id === S.edit) || S.base;
  const done = doneOf(f), lim = Number(f.buy_limit) || 0;
  $("#eSub").innerHTML = `${esc(c.label)} · куплено ${done}${lim ? " из " + lim : ""}${S.demo ? " (демо)" : ""}` + (done ? ` · <button class="link" id="eReset" style="display:inline;margin:0;padding:0 2px">сбросить счётчик</button>` : "");
}
$("#eSub").onclick = async e => { if (e.target.id === "eReset" && S.edit) { await api.patch_filter(S.edit, "bought", 0); toast("Счётчик покупок сброшен", "ok"); } };

function paramRow(k = "", v = "") {
  const d = document.createElement("div");
  d.className = "prow";
  d.innerHTML = `<input class="inp" placeholder="ключ" value="${esc(k)}" spellcheck="false"><input class="inp" placeholder="значение" value="${esc(v)}" spellcheck="false"><button class="btn ghost sm sq danger" title="Убрать">${icon("x")}</button>`;
  d.querySelector("button").onclick = () => { d.remove(); setDirty(true); };
  $("#eParams").appendChild(d);
}
const getParams = () => $$("#eParams .prow").map(r => [...r.querySelectorAll("input")].map(i => i.value.trim())).filter(([k]) => k);

function fill(f) {
  S.base = {...f};
  const c = CATS[0];
  const ps = f.params || [], pm = Object.fromEntries(ps);
  const fixKeys = new Set((c.fix || []).map(p => p[0]));
  const num = v => (v === undefined || v === null || v === "" || Number(v) === 0) ? "" : v;
  $("#eName").value = f.name || "";
  $("#eUrl").value = f.url || "";
  $("#eMin").value = num(f.min_price) || num(pm.pmin);
  $("#eMax").value = num(f.max_price) || num(pm.pmax);
  $("#eInc").value = f.include || ""; $("#eExc").value = f.exclude || "";
  $("#eSmin").value = num(pm.smin); $("#eSmax").value = num(pm.smax);
  $("#eVbmin").value = num(pm.vbmin); $("#eVbmax").value = num(pm.vbmax);
  $("#eEmail").value = pm["email_type[]"] || "";
  $("#eChange").value = pm.change_email || "";
  $("#eEg").value = pm.eg ?? "";
  $("#eLimit").value = num(f.buy_limit);
  $("#eDelay").value = num(f.buy_delay);
  $("#eSales").value = num(f.min_seller_sales);
  $("#eBl").checked = f.use_blacklist !== false;
  $("#eExisting").checked = !!f.buy_existing;
  $("#eNotify").checked = !!f.notify;
  $("#eWatch").checked = !!f.watch_price;
  $("#eEnabled").checked = f.enabled !== false;
  S.action = f.auto_buy ? "buy" : "notify"; seg("eAction", S.action);
  S.mode = f.buy_mode === "instant" ? "instant" : "check"; seg("eMode", S.mode);
  S.prio = Number(f.priority) || 1; seg("ePrio", S.prio);
  $("#eParams").innerHTML = "";
  ps.filter(([k]) => !MANAGED.has(k) && !fixKeys.has(k)).forEach(([k, v]) => paramRow(k, v));
  updCat(); updActionHint();
}
function loadEditor(f) {
  S.edit = f ? f.id : null;
  S.orig = f ? {...f} : null;
  fill(f || NEW_FILTER());
  $("#eTestRes").hidden = true;
  ["eDup", "eDel"].forEach(id => $("#" + id).disabled = !f);
  setDirty(false);
  renderFList();
}
function syncEditor() {
  if (S.edit === null) return;
  const f = S.filters.find(x => x.id === S.edit);
  if (!f) { S.dirty = false; loadEditor(S.filters[0] || null); return; }
  if (!S.dirty) { S.orig = {...f}; fill(f); } else updSub();
  $("#eEnabled").checked = f.enabled !== false;
}
function setDirty(v) {
  S.dirty = v;
  const isNew = S.edit === null;
  const bar = $("#saveBar");
  bar.classList.toggle("show", v || isNew);
  bar.classList.toggle("new", isNew);
  $("#saveText").textContent = isNew ? "Новый фильтр ещё не сохранён" : "Есть несохранённые изменения";
  $("#eSaveText").textContent = isNew ? "Создать фильтр" : "Сохранить";
  $("#eRevert").textContent = isNew ? "Очистить" : "Отменить";
  if (isNew && S.page === "filters") renderFList.lazy ||= setTimeout(() => { renderFList.lazy = 0; renderFList(); }, 150);
}
function updActionHint() {
  const h = $("#eActionHint");
  if (S.action !== "buy") { h.className = "ctl-hint"; h.textContent = "Программа найдёт лот и пришлёт в Telegram — купить можно кнопкой"; return; }
  if (S.demo) { h.className = "ctl-hint"; h.textContent = "Демо-маркет: покупки ненастоящие"; }
  else if (S.dry) { h.className = "ctl-hint"; h.textContent = "Сейчас режим «Тест» — деньги не спишутся, пока не включишь «Боевой»"; }
  else { h.className = "ctl-hint warn"; h.textContent = "Режим «Боевой»: подходящий лот оплатится сразу с баланса LZT"; }
}
$("#editor").addEventListener("input", e => { if (e.target.id !== "eEnabled") setDirty(true); });
$("#editor").addEventListener("change", e => { if (e.target.id !== "eEnabled") setDirty(true); });
$("#eEnabled").onchange = async e => {
  if (S.edit === null) return;
  await api.patch_filter(S.edit, "enabled", e.target.checked);
};
const segPick = (id, key, after) => $("#" + id).onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  const v = b.dataset.v; if (String(S[key]) === v) return;
  S[key] = key === "prio" ? Number(v) : v; seg(id, v); setDirty(true); after && after();
};
segPick("eAction", "action", () => { updActionHint(); if (S.action === "buy" && !$("#eMax").value) $("#eMax").focus(); });
segPick("eMode", "mode");
segPick("ePrio", "prio");
$("#eAddParam").onclick = () => { paramRow(); setDirty(true); $$("#eParams .prow input").slice(-2)[0].focus(); };

function collect() {
  const c = curCat();
  const v = id => $("#" + id).value.trim();
  const fixKeys = new Set((c.fix || []).map(p => p[0]));
  const params = [...(c.fix || []).map(p => [...p]), ...getParams().filter(([k]) => !MANAGED.has(k) && !fixKeys.has(k))];
  const add = (k, val) => { if (val !== "") params.push([k, String(val)]); };
  add("pmin", v("eMin")); add("pmax", v("eMax"));
  add("smin", v("eSmin")); add("smax", v("eSmax")); add("vbmin", v("eVbmin")); add("vbmax", v("eVbmax"));
  add("email_type[]", v("eEmail")); add("change_email", v("eChange")); add("eg", v("eEg"));
  if (!params.some(p => p[0] === "order_by")) params.push(["order_by", "pdate_to_down_upload"]);
  const min = Number(v("eMin")) || 0, max = Number(v("eMax")) || 0;
  const autoName = c.label + (min || max ? ` · ${priceStr({min_price: min, max_price: max})}` : "");
  return {
    ...S.base, id: S.edit || undefined,
    name: v("eName") || autoName,
    category: c.cat, params, url: v("eUrl"),
    min_price: min, max_price: max, include: v("eInc"), exclude: v("eExc"),
    buy_limit: Number(v("eLimit")) || 0, buy_delay: Number(v("eDelay")) || 0, min_seller_sales: Number(v("eSales")) || 0,
    auto_buy: S.action === "buy", buy_mode: S.mode, priority: S.prio,
    notify: $("#eNotify").checked, watch_price: $("#eWatch").checked, buy_existing: $("#eExisting").checked, use_blacklist: $("#eBl").checked,
    enabled: $("#eEnabled").checked,
  };
}

async function applyUrl(url) {
  const r = await api.parse_url(url);
  if (!r || !r.category) return toast("Не похоже на ссылку lzt.market", "err");
  if (!catOf(r)) return toast("Это ссылка не на Fortnite. Открой на lzt.market раздел Fortnite (lzt.market/epicgames/fortnite), настрой фильтры и скопируй адрес", "err");
  const cur = collect();
  const pm = Object.fromEntries(r.params || []);
  const dirtyName = $("#eName").value.trim();
  fill({...cur, name: dirtyName, category: r.category, params: r.params, url,
    min_price: cur.min_price || Number(pm.pmin) || 0, max_price: cur.max_price || Number(pm.pmax) || 0});
  setDirty(true);
  toast(`Параметры из ссылки подтянуты: ${r.params.length}`, "ok");
}
$("#eUrl").addEventListener("paste", () => setTimeout(() => { const u = $("#eUrl").value.trim(); if (u) applyUrl(u); }, 30));
$("#eUrl").addEventListener("change", () => { const u = $("#eUrl").value.trim(); if (u && u !== (S.base.url || "")) applyUrl(u); });

async function saveFilter() {
  const d = collect();
  if (d.auto_buy && !d.max_price) { toast("Для автопокупки укажи «Цена до» — это потолок трат", "err"); $("#eMax").focus(); return; }
  const wasNew = S.edit === null;
  const list = await api.save_filter(d);
  S.filters = list;
  const saved = wasNew ? list[list.length - 1] : list.find(x => x.id === S.edit);
  loadEditor(saved || null);
  renderOvFilters();
  toast(wasNew ? "Фильтр создан" : "Сохранено", "ok");
  if (wasNew && !S.running && S.filters.length === 1) setTimeout(() => toast("Теперь нажми «Запустить» вверху справа", ""), 600);
}
$("#eSave").onclick = saveFilter;
$("#eRevert").onclick = () => loadEditor(S.edit ? S.filters.find(x => x.id === S.edit) : null);

$("#eTest").onclick = async () => {
  const box = $("#eTestRes"), btn = $("#eTest");
  box.hidden = false; box.className = "testres"; box.innerHTML = `<div class="tr-h"><b>Запрашиваю выдачу…</b></div>`;
  btn.disabled = true;
  let r;
  try { r = await api.test_filter(collect()); } finally { btn.disabled = false; }
  if (!r.ok) { box.className = "testres err"; box.innerHTML = `<div class="tr-h"><b>Ошибка</b><span>${esc(r.error)}</span><button class="btn ghost xs sq tr-x" data-x>${icon("x")}</button></div>`; return; }
  if (r.fixed_category) toast(`Раздел исправлен на /${r.fixed_category}`, "ok");
  box.className = "testres ok";
  box.innerHTML = `<div class="tr-h"><b>${r.matched ? "Работает" : "Запрос работает, но подходящих сейчас нет"}</b>
    <span class="kvs"><span>на маркете <em>${r.total ?? "?"}</em></span><span>подходит <em>${r.matched}</em> из ${r.count}</span><span><em>${r.ms}</em> мс</span></span>
    <button class="btn ghost xs sq tr-x" data-x title="Скрыть">${icon("x")}</button></div>` +
    (r.sample.length ? `<div class="tr-l">${r.sample.map(s => `<div class="tr-i" data-url="${SITE}/${esc(s.item_id)}/"><span>${esc(s.title || "#" + s.item_id)}</span><b>${fmt(s.price)} ₽</b></div>`).join("")}</div>` : "");
};
$("#eTestRes").onclick = e => {
  if (e.target.closest("[data-x]")) { $("#eTestRes").hidden = true; return; }
  const i = e.target.closest("[data-url]"); if (i) openUrl(i.dataset.url);
};
$("#eOpen").onclick = () => openUrl(siteUrl(collect()));
$("#eDup").onclick = async () => {
  if (!S.edit) return;
  const list = await api.duplicate_filter(S.edit);
  S.filters = list; S.dirty = false;
  loadEditor(list[list.length - 1]);
  toast("Копия создана — можно править", "ok");
};
$("#eDel").onclick = async () => {
  const f = S.filters.find(x => x.id === S.edit); if (!f) return;
  if (!(await ask(`Удалить фильтр «${f.name}»?`, "Это действие нельзя отменить.", {ok: "Удалить", danger: true}))) return;
  const list = await api.delete_filter(f.id);
  S.filters = list; S.dirty = false;
  loadEditor(list[0] || null);
  toast("Фильтр удалён");
};

/* ================= purchases ================= */
const MAIL_BADGE = {pending: '<span class="badge info">проверяю</span>', ok: '<span class="badge ok">работает</span>',
  fail: '<span class="badge err">не входит</span>', alert: '<span class="badge warn">письмо Epic!</span>',
  unsupported: '<span class="dim">не проверить</span>'};
function renderPurchases() {
  const p = S.purchases;
  $("#pTotal").textContent = p.length;
  $("#pSum").textContent = fmt(p.reduce((a, x) => a + Number(x.price || 0), 0)) + " ₽";
  const ms = p.filter(x => x.ms);
  $("#pMs").textContent = ms.length ? Math.round(ms.reduce((a, x) => a + x.ms, 0) / ms.length) + " мс" : "—";
  $("#pEmpty").hidden = !!p.length;
  $("#ptable").closest("table").hidden = !p.length;
  $("#ptable").innerHTML = p.map((x, i) => `<tr>
    <td class="dim">${dt(x.ts)}</td>
    <td class="t" title="${esc(x.title)}">${x.demo ? '<span class="badge info">демо</span> ' : ""}${esc(x.title || "#" + x.item_id)}</td>
    <td class="r num">${fmt(x.price)} ₽${x.paid_cur && x.paid_cur !== "RUB" ? `<small class="paid">списано ${fmt(x.paid)} ${esc(x.paid_cur)}</small>` : ""}</td>
    <td class="muted">${esc(x.filter)}${x.account ? `<br><small class="dim">${esc(x.account)}</small>` : ""}</td>
    <td>${x.login ? `<span class="login"><code>${esc(x.login)}</code><button class="btn ghost xs sq" data-copy="${i}" title="Копировать">${icon("copy")}</button></span>` : x.note ? `<span class="dim" title="${esc(x.note)}">на сайте → «Мои покупки»</span>` : '<span class="dim">—</span>'}</td>
    <td class="mail-b" title="${esc(x.mail_note || "")}">${MAIL_BADGE[x.mail] || '<span class="dim">—</span>'}</td>
    <td class="r dim">${x.ms ? x.ms + " мс" : "—"}</td>
    <td class="r"><button class="btn ghost xs sq" data-open="${esc(x.url)}" title="Открыть на сайте">${icon("ext")}</button></td>
  </tr>`).join("");
}
$("#ptable").onclick = e => {
  const c = e.target.closest("[data-copy]"); if (c) return copy(S.purchases[Number(c.dataset.copy)].login);
  const o = e.target.closest("[data-open]"); if (o) openUrl(o.dataset.open);
};
$("#openData").onclick = () => api.open_data_dir();
$("#exportCsv").onclick = async () => { const r = await api.export_csv(); r.ok ? toast(`Сохранено покупок: ${r.count} — файл открыт`, "ok") : toast(r.error, "warn"); };

/* ================= log ================= */
const logRow = l => `<div class="ml lv-${l.level}"><time>${tm(l.ts)}</time><span>${esc(l.msg)}</span></div>`;
function renderLog(full, add) {
  const box = $("#logbox"), ok = l => S.logLevel === "all" || l.level === S.logLevel;
  if (full) box.innerHTML = S.logs.filter(ok).map(logRow).join("") || `<div class="empty"><b>Пока тихо</b></div>`;
  else { box.querySelector(".empty")?.remove(); box.insertAdjacentHTML("beforeend", add.filter(ok).map(logRow).join("")); }
  if ($("#logAuto").checked) box.scrollTop = box.scrollHeight;
  markLogSeen();
}
function markLogSeen() { if (S.page === "log" && S.logs.length) S.logSeen = S.logs[S.logs.length - 1].seq; renderLogDot(); }
function renderLogDot() {
  const fresh = S.logs.filter(l => l.seq > S.logSeen && (l.level === "err" || l.level === "warn"));
  $("#navLogDot").className = "nd " + (fresh.some(l => l.level === "err") ? "err" : fresh.length ? "warn" : "");
}
$("#logSeg").onclick = e => { const b = e.target.closest("button"); if (!b) return; S.logLevel = b.dataset.lv; seg("logSeg", b.dataset.lv); renderLog(true); };

/* ================= settings (сохраняются сами) ================= */
async function loadSettings() {
  const c = S.cfg = await api.get_config();
  $("#apiToken").value = c.api_token || ""; $("#tgToken").value = c.tg_token || ""; $("#tgChats").value = c.tg_chat_ids || "";
  $("#tgProxy").value = c.tg_proxy || "";
  S.tplDefault = c.tg_template_default || "";
  $("#tgTpl").value = c.tg_template || S.tplDefault;
  $("#tgVars").innerHTML = Object.entries(c.tg_vars || {}).map(([k, t]) => `<button class="chip-t" data-v="${k}" title="Вставить {${k}}">${esc(t)}</button>`).join("");
  $("#discAuto").checked = c.discount_autobuy !== false; $("#lztNotify").checked = c.lzt_notify !== false;
  $("#mailCheck").checked = c.mail_check !== false; $("#mailHours").value = c.mail_hours || 48; $("#mailEvery").value = c.mail_every || 15;
  $("#imapHosts").value = c.imap_hosts || ""; $("#mailManual").value = c.mail_manual || "";
  S.accounts = c.accounts || []; renderAccounts();
  $("#rareSkins").value = c.rare_skins || "";
  updTgPreview();
  $("#interval").value = c.search_interval; updInterval();
  $("#spendLimit").value = c.spend_limit || ""; $("#lowBal").value = c.low_balance || ""; $("#sellerBl").value = c.seller_blacklist || "";
  $("#sound").checked = !!c.sound; $("#autoSpeed").checked = !!c.auto_speed;
  $("#trayOpt").checked = !!c.tray; $("#autostartOpt").checked = !!c.autostart; $("#autorunOpt").checked = !!c.autorun;
  $("#demoOpt").checked = !!c.demo;
  $("#oauthId").value = c.oauth_client_id || "";
  $("#oauthRedir").value = c.oauth_redirect || "";
  $("#oauthRedir").placeholder = `встроенный: ${c.oauth_default_redirect || ""}`;
  $("#oauthId").placeholder = c.oauth_default_id ? `встроенный: ${c.oauth_default_id}` : "не задан";
  updOauthHint();
  const lr = $("#loginRes"), exp = Number(c.api_token_expire) || 0;
  if (exp && exp * 1000 < Date.now()) { lr.className = "ctl-hint warn"; lr.textContent = "Срок входа истёк — нажми «Войти через LZT» ещё раз"; }
  else if (S.me.username && !S.demo) { lr.className = "ctl-hint ok"; lr.textContent = `Подключено: ${S.me.username}` + (exp ? ` · вход действует до ${dt(exp)}` : ""); }
  $("#lztLogin span").textContent = S.me.username && !S.demo ? "Войти заново" : "Войти через LZT";
}
function updInterval() {
  const v = Number($("#interval").value);
  $("#intervalV").textContent = v.toFixed(1);
  $("#interval").style.setProperty("--p", ((v - 0.5) / 9.5 * 100) + "%");
  const h = $("#intervalHint");
  h.className = "ctl-hint " + (v < 3 ? "warn" : "");
  h.textContent = `≈ ${Math.round(60 / v)} запросов в минуту. ` + (v < 3 ? "Лимит LZT на поиск — около 20 в минуту, будут паузы." : "В пределах лимита LZT.");
}
$("#interval").oninput = updInterval;
$("#interval").onchange = () => saved({search_interval: Number($("#interval").value)});
async function saved(data, msg = "Сохранено") { await api.save_settings(data); Object.assign(S.cfg, data); S.version = -1; if (msg) toast(msg, "ok"); }
$("#spendLimit").onchange = () => saved({spend_limit: Number($("#spendLimit").value) || 0});
$("#lowBal").onchange = () => saved({low_balance: Number($("#lowBal").value) || 0});
$("#sellerBl").onchange = () => saved({seller_blacklist: $("#sellerBl").value.trim()});
$("#tgToken").onchange = () => saved({tg_token: $("#tgToken").value.trim()});
$("#tgChats").onchange = () => saved({tg_chat_ids: $("#tgChats").value.trim()});
const TG_FIELD_NAMES = {matched: "✅ Совпавшие скины", rare: "🔥 Редкие скины", skins: "🎭 Кол-во скинов", vbucks: "💎 V-Bucks",
  last_match: "🕹 Ласт матч", level: "⭐ Уровень и победы", book: "📘 Боевой пропуск", platform: "🖥 Платформа", reg: "📅 Дата регистрации", seller: "👤 Продавец"};
async function updTgPreview() {
  const t = await api.tg_preview($("#tgTpl").value);
  $("#tgPreview").innerHTML = esc(t).replace(/&lt;(\/?)(b|i|u|s|code)&gt;/g, "<$1$2>");
}
let tplTimer = null;
$("#tgTpl").oninput = () => {
  clearTimeout(tplTimer);
  updTgPreview();
  tplTimer = setTimeout(() => { const v = $("#tgTpl").value; saved({tg_template: v.trim() === S.tplDefault.trim() ? "" : v}, ""); }, 700);
};
$("#tgVars").onclick = e => {
  const b = e.target.closest("[data-v]"); if (!b) return;
  const ta = $("#tgTpl"), ins = `{${b.dataset.v}}`, a = ta.selectionStart ?? ta.value.length, z = ta.selectionEnd ?? a;
  ta.value = ta.value.slice(0, a) + ins + ta.value.slice(z); ta.focus(); ta.selectionStart = ta.selectionEnd = a + ins.length;
  ta.oninput();
};
$("#tgTplReset").onclick = async () => { $("#tgTpl").value = S.tplDefault; await saved({tg_template: ""}, "Вернул стандартный текст"); updTgPreview(); };
opt2("#discAuto", "discount_autobuy", v => v ? "Скидка: LZT купит сам, если продавец согласится" : "Скидка: только запрос, без автопокупки");
opt2("#lztNotify", "lzt_notify", v => v ? "Ответы продавцов будут приходить в Telegram" : "Ответы продавцов не пересылаются");
opt2("#mailCheck", "mail_check", v => v ? "Почта купленных аккаунтов проверяется" : "Проверка почты выключена");
$("#mailHours").onchange = () => saved({mail_hours: Math.max(1, Number($("#mailHours").value) || 48)});
$("#mailEvery").onchange = () => saved({mail_every: Math.max(5, Number($("#mailEvery").value) || 15)});
$("#imapHosts").onchange = () => {
  const v = $("#imapHosts").value, lines = v.split("\n"), mails = lines.filter(l => /\S+@\S+\s*[:;|]/.test(l) && !/=/.test(l.split(/[:;|]/)[0]));
  if (mails.length) {  // почты, вписанные не туда, — переносим в «Свои почты»
    $("#imapHosts").value = lines.filter(l => !mails.includes(l)).join("\n").trim();
    const mm = $("#mailManual").value.trim();
    $("#mailManual").value = (mm ? mm + "\n" : "") + mails.map(l => l.trim()).join("\n");
    saved({imap_hosts: $("#imapHosts").value.trim(), mail_manual: $("#mailManual").value.trim()}, `Почты (${mails.length}) перенесены в «Свои почты» — там они проверяются`);
    return;
  }
  saved({imap_hosts: v.trim()}, "IMAP-серверы сохранены");
};
$("#mailManual").onchange = () => saved({mail_manual: $("#mailManual").value.trim()}, "Свои почты сохранены — проверка начнётся через пару секунд");
function renderMailManual(list) {
  const rows = (list || []).filter(x => x.manual);
  $("#mailManualList").innerHTML = rows.map(x => `<div class="mm-row"><span class="mm-a">${esc(x.label)}</span>${MAIL_BADGE[x.status] || ""}<span class="mm-n" title="${esc(x.note || "")}">${esc(x.note || (x.via ? "через " + x.via : ""))}</span></div>`).join("");
}
function opt2(id, key, msg) { $(id).onchange = () => saved({[key]: $(id).checked}, msg($(id).checked)); }

/* ---- доп. аккаунты LZT ---- */
function renderAccounts() {
  $("#accList").innerHTML = (S.accounts || []).map(a => `<div class="acc">
    <label class="sw" title="Использовать"><input type="checkbox" data-acc-en="${a.id}" ${a.enabled ? "checked" : ""}><i></i></label>
    <b>${esc(a.name)}</b>${a.ok === false ? `<span class="err">ошибка: ${esc(a.error || "")}</span>` : a.balance != null ? `<span class="dim">${fmt(a.balance)} ${esc(a.currency || "")}</span>` : ""}
    <span class="grow"></span><button class="btn ghost xs sq" data-acc-del="${a.id}" title="Убрать">${icon("x")}</button></div>`).join("");
}
$("#accList").onchange = e => { const i = e.target.closest("[data-acc-en]"); if (i) api.account_toggle(i.dataset.accEn, i.checked); };
$("#accList").onclick = async e => {
  const d = e.target.closest("[data-acc-del]"); if (!d) return;
  if (!(await ask("Убрать аккаунт?", "Токен удалится из программы. Покупки останутся.", {ok: "Убрать", danger: true}))) return;
  await api.account_remove(d.dataset.accDel); S.version = -1; toast("Аккаунт убран");
};
async function accDone(r) {
  const res = $("#accRes");
  if (r.ok) { res.className = "ctl-hint ok"; res.textContent = `Добавлен: ${r.username} · баланс ${fmt(r.balance)} ${r.currency || ""}`; $("#accToken").value = ""; S.version = -1; }
  else if (r.error !== "cancelled") { res.className = "ctl-hint warn"; res.textContent = r.error || "Не получилось"; }
  else { res.className = "ctl-hint"; res.textContent = "Вход отменён"; }
}
$("#accAdd").onclick = async () => { $("#accRes").className = "ctl-hint"; $("#accRes").textContent = "Проверяю…"; accDone(await api.account_add($("#accToken").value.trim(), "")); };
$("#accLogin").onclick = async () => { $("#accRes").className = "ctl-hint"; $("#accRes").textContent = "Открыл LZT в браузере — войди в ДРУГОЙ аккаунт и нажми «Разрешить»…"; accDone(await api.lzt_login("extra")); };
$("#rareSkins").onchange = async () => { await saved({rare_skins: $("#rareSkins").value.trim()}, "Список редких скинов сохранён"); updTgPreview(); };
$("#tgProxy").onchange = () => {
  const v = $("#tgProxy").value.trim();
  if (v && !/^((socks5h?|https?):\/\/)?[^\s]+:\d{2,5}\/?$/i.test(v)) { toast("Формат: socks5://host:port или http://host:port", "err"); return; }
  saved({tg_proxy: v}, v ? "Прокси для Telegram сохранён — нажми «Проверить»" : "Прокси для Telegram убран");
};
const opt = (id, key, msg) => $(id).onchange = () => saved({[key]: $(id).checked}, msg($(id).checked));
opt("#sound", "sound", v => v ? "Звук включён" : "Звук выключен");
opt("#autoSpeed", "auto_speed", v => v ? "Авто-скорость включена" : "Фиксированный интервал");
opt("#trayOpt", "tray", v => v ? "Крестик сворачивает в трей" : "Крестик закрывает программу");
opt("#autostartOpt", "autostart", v => v ? "Будет запускаться вместе с Windows" : "Автозапуск выключен");
opt("#autorunOpt", "autorun", v => v ? "Поиск будет стартовать сам" : "Запуск вручную");
opt("#demoOpt", "demo", v => v ? "Демо-маркет включён" : "Демо выключено — работа с настоящим LZT");
$$("[data-eye]").forEach(b => b.onclick = () => { const i = $("#" + b.dataset.eye); i.type = i.type === "password" ? "text" : "password"; });
$("#checkToken").onclick = async () => {
  const res = $("#tokenRes");
  res.className = "ctl-hint"; res.textContent = "Проверяю…";
  await api.save_settings({api_token: $("#apiToken").value.trim(), api_token_expire: 0});
  const r = await api.check_token();
  if (r.ok) { res.className = "ctl-hint ok"; res.textContent = `Подключено: ${r.username} · баланс ${fmt(r.balance)} ${r.currency || ""}`; S.version = -1; }
  else { res.className = "ctl-hint err"; res.textContent = "Не получилось: " + r.error; }
};
let loginBusy = false;
async function lztLogin() {
  if (loginBusy) return;
  go("settings");
  const res = $("#loginRes"), btn = $("#lztLogin");
  if (!(await api.lzt_login_available())) {
    res.className = "ctl-hint warn";
    res.textContent = "Вход в один клик ещё не настроен в этой сборке — пока вставь токен вручную ниже";
    setTimeout(() => $("#apiToken").focus(), 60);
    return;
  }
  loginBusy = true;
  const label = btn.querySelector("span").textContent;
  btn.className = "btn ghost"; btn.querySelector("span").textContent = "Отменить вход";
  const browser = /^http:\/\/(127\.0\.0\.1|localhost)/.test((S.cfg.oauth_redirect || S.cfg.oauth_default_redirect || ""));
  res.className = "ctl-hint";
  res.textContent = browser ? "Открыл LZT в браузере — войди, если попросит, и нажми «Разрешить». Жду…" : "Открыто окно LZT — войди и нажми «Разрешить»…";
  let r;
  try { r = await api.lzt_login(); }
  finally { loginBusy = false; btn.className = "btn primary"; btn.querySelector("span").textContent = label; }
  if (r.ok) {
    res.className = "ctl-hint ok";
    res.textContent = `Подключено: ${r.username} · баланс ${fmt(r.balance)} ${r.currency || ""}` + (r.expire ? ` · вход действует до ${dt(r.expire)}` : "");
    $("#tokenRes").textContent = "";
    S.version = -1; loadSettings();
    toast(`Аккаунт ${r.username} подключён`, "ok");
  } else if (r.error === "cancelled") { res.className = "ctl-hint"; res.textContent = "Вход отменён"; }
  else { res.className = "ctl-hint err"; res.textContent = "Не получилось: " + r.error; }
}
$("#lztLogin").onclick = () => loginBusy ? api.lzt_login_cancel() : lztLogin();
$("#testTg").onclick = async () => {
  const res = $("#tgRes");
  res.className = "ctl-hint"; res.textContent = "Отправляю тестовое сообщение…";
  await api.save_settings({tg_token: $("#tgToken").value.trim(), tg_chat_ids: $("#tgChats").value.trim(), tg_proxy: $("#tgProxy").value.trim()});
  const r = await api.test_tg();
  res.className = "ctl-hint " + (r.ok ? "ok" : "err");
  res.textContent = r.ok ? `@${r.bot} — сообщение отправлено` : "Не получилось: " + r.error;
};
function updOauthHint() {
  const own = $("#oauthId").value.trim(), h = $("#oauthRes");
  h.className = "ctl-hint";
  h.textContent = own ? "Используется твоё приложение" : S.cfg.oauth_default_id ? "Используется встроенное приложение" : "Приложение не задано — вход через LZT недоступен";
}
$("#oauthId").onchange = async () => {
  const v = $("#oauthId").value.trim();
  if (v && !/^[A-Za-z0-9_-]{4,64}$/.test(v)) { $("#oauthRes").className = "ctl-hint err"; $("#oauthRes").textContent = "Похоже, это не Client ID — проверь строку"; return; }
  await saved({oauth_client_id: v}, v ? "Client ID сохранён" : "Вернул встроенный Client ID");
  updOauthHint();
};
$("#oauthReset").onclick = async () => { $("#oauthId").value = ""; $("#oauthRedir").value = ""; await saved({oauth_redirect: ""}, ""); $("#oauthId").onchange(); };
$("#oauthRedir").onchange = async () => {
  const v = $("#oauthRedir").value.trim();
  if (v && !/^https?:\/\/\S+$/.test(v)) { toast("Адрес должен начинаться с http:// или https://", "err"); return; }
  await saved({oauth_redirect: v}, v ? "Адрес возврата сохранён" : "Вернул встроенный адрес возврата");
};
$("#openData2").onclick = () => api.open_data_dir();
$("#mkShortcut").onclick = async () => { const r = await api.create_shortcut(); r.ok ? toast("Ярлык создан на рабочем столе", "ok") : toast("Не удалось: " + r.error, "err"); };

/* ================= import / export ================= */
$("#expFilters").onclick = async () => copy(await api.export_filters());
const impShow = v => $("#impModal").classList.toggle("show", v);
$("#impFilters").onclick = () => { $("#impText").value = ""; impShow(true); setTimeout(() => $("#impText").focus(), 50); };
$("#impClose").onclick = $("#impCancel").onclick = () => impShow(false);
$("#impModal").onmousedown = e => { if (e.target.id === "impModal") impShow(false); };
$("#impGo").onclick = async () => {
  const r = await api.import_filters($("#impText").value);
  if (r.ok) { impShow(false); toast(`Импортировано фильтров: ${r.count}`, "ok"); } else toast(r.error, "err");
};

/* ================= run / mode ================= */
async function start() {
  if (S.running) return;
  const c = await api.get_config();
  if (!c.api_token && !c.demo) { toast("Сначала подключи аккаунт LZT — кнопка «Войти через LZT»", "err"); go("settings"); return; }
  if (!S.filters.some(f => f.enabled)) toast("Нет включённых фильтров — поиск будет ждать", "warn");
  else if (S.dirty) toast("В редакторе есть несохранённые правки — поиск идёт по сохранённой версии", "warn");
  await api.start();
}
async function stop() { if (S.running) await api.stop(); }
const toggleRun = () => S.running ? stop() : start();
$("#runBtn").onclick = toggleRun;
async function setMode(live) {
  if (S.demo || live === !S.dry) return;
  if (live) {
    const buy = S.filters.filter(f => f.enabled && f.auto_buy).length;
    const txt = buy
      ? `${buy} ${plural(buy, "фильтр", "фильтра", "фильтров")} с «Покупать сразу» начнут оплачивать подходящие лоты с баланса LZT.`
      : "Сейчас ни в одном включённом фильтре не выбрано «Покупать сразу» — программа будет только искать и присылать уведомления. Покупки станут настоящими, когда включишь автопокупку в фильтре.";
    if (!(await ask("Включить боевой режим?", txt, {ok: "Включить", danger: buy > 0}))) return;
  }
  await api.save_settings({dry_run: !live});
  S.version = -1;
  toast(live ? "Боевой режим: покупки настоящие" : "Тестовый режим: деньги не списываются", live ? "warn" : "ok");
  updActionHint();
}
$("#modeSeg").onclick = e => { const b = e.target.closest("button"); if (b) setMode(b.dataset.mode === "live"); };
$("#demoPill").onclick = async () => {
  if (!(await ask("Выключить демо-маркет?", "Программа начнёт работать с настоящим LZT Market.", {ok: "Выключить"}))) return;
  await saved({demo: false}, "Демо выключено");
};

/* ================= hotkeys ================= */
document.addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  if (e.ctrlKey && (k === "k" || k === "л")) { e.preventDefault(); cmdOpen() ? cmdClose() : cmdShow(); return; }
  if (cmdOpen() || askOpen()) return;
  if ($("#impModal").classList.contains("show")) { if (e.key === "Escape") impShow(false); return; }
  if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); toggleRun(); return; }
  if (e.ctrlKey && (k === "s" || k === "ы")) { e.preventDefault(); if (S.page === "filters") saveFilter(); return; }
  if (e.key === "Escape" && S.page === "filters" && document.activeElement && document.activeElement !== document.body) { document.activeElement.blur(); return; }
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName) || e.ctrlKey || e.altKey) return;
  const pages = ["dash", "filters", "purchases", "log", "settings", "help"];
  if (e.key >= "1" && e.key <= "6") go(pages[Number(e.key) - 1]);
  if (k === "n" || k === "т") { e.preventDefault(); newFilter(); }
});

/* ================= command palette ================= */
const cmdOpen = () => $("#cmdModal").classList.contains("show");
let cmdItems = [], cmdSel = 0;
function cmdCommands() {
  const L = [], add = (g, ic, t, run, hint = "") => L.push({g, ic, t, run, hint});
  add("Действия", S.running ? "stop" : "play", S.running ? "Остановить поиск" : "Запустить поиск", toggleRun, "Ctrl Enter");
  add("Действия", "plus", "Новый фильтр", newFilter, "N");
  if (S.page === "filters" && (S.dirty || S.edit === null)) add("Действия", "check", "Сохранить фильтр", saveFilter, "Ctrl S");
  if (!S.demo) add("Действия", "bolt", S.dry ? "Включить боевой режим" : "Включить тестовый режим", () => setMode(S.dry));
  add("Действия", "flask", S.demo ? "Выключить демо-маркет" : "Включить демо-маркет", () => saved({demo: !S.demo}, S.demo ? "Демо выключено" : "Демо-маркет включён"));
  add("Действия", "download", "Экспорт покупок в Excel", () => $("#exportCsv").click());
  add("Действия", "folder", "Открыть папку данных", () => api.open_data_dir());
  [["dash", "home", "Обзор"], ["filters", "filter", "Фильтры"], ["purchases", "cart", "Покупки"], ["log", "list", "Журнал"], ["settings", "gear", "Настройки"], ["help", "help", "Инструкция"]]
    .forEach(([p, ic, t], i) => add("Перейти", ic, t, () => go(p), String(i + 1)));
  S.filters.forEach(f => {
    add("Фильтры", "filter", `Открыть «${f.name}»`, () => openFilter(f.id));
    add("Фильтры", f.enabled ? "x" : "check", `${f.enabled ? "Выключить" : "Включить"} «${f.name}»`, () => api.patch_filter(f.id, "enabled", !f.enabled));
  });
  return L;
}
function cmdRender() {
  const words = $("#cmdInput").value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  cmdItems = cmdCommands().filter(c => words.every(w => (c.t + " " + c.g).toLowerCase().includes(w)));
  cmdSel = Math.min(cmdSel, Math.max(0, cmdItems.length - 1));
  let g = null, html = "";
  cmdItems.forEach((c, i) => {
    if (c.g !== g) { g = c.g; html += `<div class="cmd-g">${esc(g)}</div>`; }
    html += `<button class="cmd-i ${i === cmdSel ? "on" : ""}" data-i="${i}">${icon(c.ic)}<span>${esc(c.t)}</span>${c.hint ? `<kbd>${esc(c.hint)}</kbd>` : ""}</button>`;
  });
  $("#cmdList").innerHTML = html || `<div class="empty"><b>Ничего не найдено</b></div>`;
  $("#cmdList .cmd-i.on")?.scrollIntoView({block: "nearest"});
}
function cmdShow() { $("#cmdInput").value = ""; cmdSel = 0; $("#cmdModal").classList.add("show"); cmdRender(); setTimeout(() => $("#cmdInput").focus(), 20); }
function cmdClose() { $("#cmdModal").classList.remove("show"); }
function cmdRun(i) { const c = cmdItems[i]; if (!c) return; cmdClose(); c.run(); }
$("#cmdInput").addEventListener("input", () => { cmdSel = 0; cmdRender(); });
$("#cmdInput").addEventListener("keydown", e => {
  if (e.key === "ArrowDown") { e.preventDefault(); cmdSel = Math.min(cmdItems.length - 1, cmdSel + 1); cmdRender(); }
  else if (e.key === "ArrowUp") { e.preventDefault(); cmdSel = Math.max(0, cmdSel - 1); cmdRender(); }
  else if (e.key === "Enter") { e.preventDefault(); cmdRun(cmdSel); }
  else if (e.key === "Escape") { e.preventDefault(); cmdClose(); }
});
$("#cmdList").addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) cmdRun(Number(b.dataset.i)); });
$("#cmdList").addEventListener("mousemove", e => {
  const b = e.target.closest("[data-i]");
  if (b && Number(b.dataset.i) !== cmdSel) { cmdSel = Number(b.dataset.i); $$("#cmdList .cmd-i").forEach(x => x.classList.toggle("on", x === b)); }
});
$("#cmdModal").addEventListener("mousedown", e => { if (e.target.id === "cmdModal") cmdClose(); });
$("#cmdHint").onclick = cmdShow;

/* ================= что нового ================= */
const CL = {data: null, all: false};
const clDate = d => { const [y, m, dd] = String(d || "").split("-"); return dd ? `${dd}.${m}.${y}` : ""; };
function clRender() {
  const d = CL.data; if (!d) return;
  const unseen = new Set(d.unseen || []);
  const list = CL.all || !unseen.size ? d.entries : d.entries.filter(e => unseen.has(e.version));
  $("#clTitle").textContent = !CL.all && unseen.size ? `Что нового в v${d.version}` : "История версий";
  const lead = !CL.all && unseen.size > 1 ? `<p class="cl-lead">С прошлого запуска вышло обновлений: ${unseen.size}.</p>` : "";
  $("#clBody").innerHTML = lead + list.map(e => `
    <section class="cl-v${unseen.has(e.version) ? "" : " old"}">
      <div class="cl-vh"><span class="cl-num">v${esc(e.version)}</span><span class="cl-t">${esc(e.title || "")}</span><span class="cl-d">${clDate(e.date)}</span></div>
      <ul>${e.items.map(([k, t]) => `<li><span class="cl-tag ${k === "fix" ? "fix" : "new"}">${k === "fix" ? "Исправлено" : "Новое"}</span><span>${esc(t)}</span></li>`).join("")}</ul>
    </section>`).join("");
  $("#clAll").hidden = CL.all || !unseen.size || unseen.size === d.entries.length;
  $("#clBody").scrollTop = 0;
}
function clShow(on, all = false) {
  if (on) { CL.all = all; clRender(); }
  $("#clModal").classList.toggle("show", on);
  if (on) setTimeout(() => $("#clOk").focus(), 30);
  else if (CL.data && (CL.data.unseen || []).length) { api.changelog_seen(); CL.data.unseen = []; clLabel(); }
}
// Без всплывающих окон: после обновления у номера версии тихая зелёная метка, по клику — что изменилось.
function clLabel(v) {
  v = v || (CL.data && CL.data.version) || "";
  const fresh = CL.data && (CL.data.unseen || []).length;
  const b = $("#ver");
  b.classList.toggle("fresh", !!fresh);
  b.innerHTML = `v${esc(v)}` + (fresh ? `<span class="ver-new">обновлено</span>` : `<span class="ver-l">история</span>`);
  b.title = fresh ? "Программа обновилась — нажмите, чтобы посмотреть, что изменилось" : "История версий";
}
async function initChangelog() {
  try { CL.data = await api.changelog(); } catch (e) { CL.data = null; }
  clLabel(CL.data ? CL.data.version : await api.version());
}
$("#ver").onclick = () => CL.data && clShow(true, !(CL.data.unseen || []).length);
$("#clOk").onclick = $("#clClose").onclick = () => clShow(false);
$("#clAll").onclick = () => { CL.all = true; clRender(); };
$("#clModal").addEventListener("mousedown", e => { if (e.target.id === "clModal") clShow(false); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && $("#clModal").classList.contains("show")) { e.preventDefault(); e.stopPropagation(); clShow(false); }
}, true);

/* ================= boot ================= */
seg("feedSeg", S.feedFilter);
window.addEventListener("pywebviewready", async () => {
  api = window.pywebview.api;
  S.cfg = await api.get_config();
  initChangelog();
  poll();
});
