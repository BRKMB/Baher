"use strict";

/* ===== إعدادات ===== */

const WORK_DEST = "Lionbridge Poland, Łopuszańska 95, 02-457 Warszawa";

// الفلاتر بتاعتك — الوزن يعني أهمية الحاجة في السكور
const CRITERIA = [
  { key: "oven", icon: "🍞", weight: 2, ar: "فرن", en: "Oven" },
  { key: "dishwasher", icon: "🍽️", weight: 2, ar: "ديش واشر", en: "Dishwasher" },
  { key: "bed", icon: "🛏️", weight: 3, ar: "سرير مريح بمرتبة كويسة", en: "Comfy bed, good mattress" },
  { key: "spacious", icon: "📐", weight: 2, ar: "مساحة واسعة", en: "Spacious place" },
  { key: "garage", icon: "🚗", weight: 1, ar: "جراج / ركنة مجانية", en: "Free garage / parking" },
  { key: "max3", icon: "👥", weight: 2, ar: "٣ أوض أو أقل في الشقة", en: "≤ 3 rooms in the flat" },
  { key: "desk", icon: "🖥️", weight: 3, ar: "مكتب كبير للشاشات", en: "Big desk for monitors" },
  { key: "modern", icon: "✨", weight: 2, ar: "شقة مودرن", en: "Modern flat" },
  { key: "elevator", icon: "🛗", weight: 1, ar: "أسانسير (لو دور عالي)", en: "Elevator (if high floor)" },
  { key: "availableAug", icon: "📅", weight: 3, ar: "متاحة من ١ أغسطس", en: "Available from Aug 1" },
  { key: "noCommission", icon: "🧾", weight: 2, ar: "من غير كوميشن", en: "No commission" }
];

const UNKNOWN_CREDIT = 0.4; // "مش متأكد" بياخد 40% من الوزن
const PRICE_WEIGHT = 4;
const COMMUTE_WEIGHT = 4;
const BILLS_FALLBACK = 300; // لو المرافق مش معروفة بنفترض 300 زلوتي في حساب السكور

/* ===== الترجمة ===== */

const I18N = {
  en: {
    docTitle: "Warsaw Home Hunt 🏠",
    appTitle: "Warsaw Home Hunt",
    tagline: "Smart housing comparison — auto-ranked from best to worst",
    lockSubtitle: "This site is private — enter the password to get in",
    lockButton: "Enter 🚪",
    lockError: "Wrong password, try again 🙈",
    addBtn: "✦ Smart Add",
    logout: "Log out ↩",
    sortLabel: "Sort:",
    sortScore: "🏆 Best first (score)",
    sortPrice: "💰 Cheapest first",
    sortCommute: "🚌 Closest to work first",
    filtersLabel: "Filters",
    filtersAll: "All",
    filtersActive: (n) => `${n} active`,
    footerWork: "Work destination:",
    resetBtn: "Restore original data",
    editTitle: "Edit place",
    addTitle: "Add a new place",
    fType: "Place type",
    typeRoom: "Room",
    typeStudio: "Studio",
    typeFlat: "Flat",
    typeOther: "Other",
    fTitle: "Name / description",
    fDistrict: "District",
    fAddress: "Address",
    fUrl: "Listing link (OLX)",
    fRent: "Rent (zł/month)",
    fBills: "Utilities & fees (zł/month)",
    fGarage: "Garage (zł/month, if any)",
    fArea: "Place area (m²)",
    fDeposit: "Deposit (zł)",
    fCommute: "Commute to work (minutes)",
    fAvailable: "Available from",
    fContact: "Contact",
    phUnknown: "unknown",
    phNone: "none",
    phEstimate: "estimate",
    phContact: "Name — phone / OLX",
    cancel: "Cancel",
    save: "Save ✓",
    statCount: "🏠 Places",
    statCheapest: "💰 Cheapest total",
    statClosest: "🚌 Closest to work",
    statBest: "🏆 Top score",
    minutesShort: (m) => `~${m} min`,
    scoreLabel: "Score",
    scoreTooltip: "Score breakdown:",
    critTooltip: "Click to choose: yes / not sure / no",
    yesLabel: "Yes",
    noLabel: "No",
    unknownLabel: "Not sure",
    filterTooltip: "Show only places that definitely have this",
    commuteChip: (m) => `🚌 ~${m} min to work`,
    commuteUnknown: "🚌 Commute?",
    mapsTitle: "Open the route on Google Maps",
    unknownChip: (n) => `? ${n} to confirm`,
    unknownTitle: "Ask the landlord and update the marks",
    priceRent: "Rent",
    priceBills: "Utilities & fees",
    priceGarage: "Garage",
    priceTotal: "Total (excl. garage)",
    priceDeposit: "Deposit (one-time)",
    perMonth: "zł / mo",
    free: "Free",
    dash: "—",
    q: "?",
    notesPlaceholder: "Notes… (saved automatically)",
    notesSaved: "✓ Notes saved",
    fPhotos: "Photo links (one per line)",
    zoomTip: "Click to zoom",
    smartImportTitle: "Smart Auto-fill",
    phListingUrl: "Paste OLX or Otodom link…",
    importBtn: "✦ Auto-fill",
    importHint: "Paste an OLX or Otodom link and everything gets fetched automatically",
    importing: "⏳ Fetching the listing…",
    importOk: "✓ Fetched! Review the marks and fill in the gaps",
    importFail: "⚠️ Couldn't fetch this link — fill it in manually",
    openAd: "Open listing ↗",
    routeBtn: "🗺️ Route to work",
    editBtn: "✏️ Edit",
    deleteBtn: "🗑 Delete",
    confirmDelete: (t) => `Are you sure you want to delete "${t}"?`,
    deleted: "🗑 Deleted",
    edited: "✓ Saved",
    added: "✓ Added — now mark its filters",
    confirmReset: "This will restore the original data and erase all your edits. Sure?",
    resetPasswordPrompt: "Enter the restore password:",
    resetWrongPassword: "Wrong restore password",
    resetDone: "↩ Original data restored",
    apiError: "⚠️ Something went wrong, try again",
    noMatch: "No place matches these filters — remove one or two",
    scorePrice: "💰 Price",
    scoreCommute: "🚌 Near work",
    themeTip: "Switch to light mode",
    themeTipDark: "Switch to dark mode",
    langTip: "التبديل للعربي"
  },
  ar: {
    docTitle: "سكني في وارسو 🏠",
    appTitle: "سكني في وارسو",
    tagline: "مقارنة ذكية للسكن — مترتبة تلقائيًا من الأحسن للأوحش",
    lockSubtitle: "الموقع دا خاص — اكتب الباسورد عشان تدخل",
    lockButton: "ادخل 🚪",
    lockError: "الباسورد غلط، جرّب تاني 🙈",
    addBtn: "✦ إضافة ذكية",
    logout: "خروج ↩",
    sortLabel: "الترتيب:",
    sortScore: "🏆 الأحسن أولًا (السكور)",
    sortPrice: "💰 الأرخص أولًا",
    sortCommute: "🚌 الأقرب للشغل أولًا",
    filtersLabel: "الفلاتر",
    filtersAll: "الكل",
    filtersActive: (n) => `${n} مفعّل`,
    footerWork: "وجهة الشغل:",
    resetBtn: "استرجاع البيانات الأصلية",
    editTitle: "تعديل المكان",
    addTitle: "ضيف مكان جديد",
    fType: "نوع السكن",
    typeRoom: "أوضة",
    typeStudio: "ستوديو",
    typeFlat: "شقة",
    typeOther: "نوع تاني",
    fTitle: "الاسم / الوصف",
    fDistrict: "الحي",
    fAddress: "العنوان",
    fUrl: "لينك الإعلان (OLX)",
    fRent: "الإيجار (زلوتي/شهر)",
    fBills: "المرافق والمصاريف (زلوتي/شهر)",
    fGarage: "الجراج (زلوتي/شهر لو فيه)",
    fArea: "مساحة المكان (م²)",
    fDeposit: "الديبوزيت (زلوتي)",
    fCommute: "وقت المواصلات للشغل (دقايق)",
    fAvailable: "متاحة من",
    fContact: "التواصل",
    phUnknown: "مش معروفة",
    phNone: "مفيش",
    phEstimate: "تقدير",
    phContact: "الاسم — تليفون / OLX",
    cancel: "إلغاء",
    save: "حفظ ✓",
    statCount: "🏠 عدد الأماكن",
    statCheapest: "💰 أرخص إجمالي",
    statClosest: "🚌 أقرب للشغل",
    statBest: "🏆 الأعلى سكور",
    minutesShort: (m) => `~${m} دقيقة`,
    scoreLabel: "السكور",
    scoreTooltip: "تفاصيل السكور:",
    critTooltip: "دوس واختار: أيوه / مش متأكد / لأ",
    yesLabel: "أيوه",
    noLabel: "لأ",
    unknownLabel: "مش متأكد",
    filterTooltip: "اعرض بس اللي فيها الحاجة دي أكيد",
    commuteChip: (m) => `🚌 ~${m} دقيقة للشغل`,
    commuteUnknown: "🚌 المسافة للشغل؟",
    mapsTitle: "افتح الطريق على جوجل مابس",
    unknownChip: (n) => `؟ ${n} محتاجة تأكيد`,
    unknownTitle: "اسأل المعلن وحدّث العلامات",
    priceRent: "الإيجار",
    priceBills: "المرافق والمصاريف",
    priceGarage: "الجراج",
    priceTotal: "الإجمالي (من غير جراج)",
    priceDeposit: "الديبوزيت (مرة واحدة)",
    perMonth: "زلوتي / شهر",
    free: "ببلاش",
    dash: "—",
    q: "؟",
    notesPlaceholder: "ملاحظات… (بتتحفظ لوحدها)",
    notesSaved: "✓ الملاحظات اتحفظت",
    fPhotos: "لينكات الصور (لينك في كل سطر)",
    zoomTip: "دوس عشان تقرّب",
    smartImportTitle: "إضافة ذكية تلقائية",
    phListingUrl: "حط لينك OLX أو Otodom…",
    importBtn: "✦ املا تلقائي",
    importHint: "حط لينك OLX أو Otodom وكل حاجة هتتجاب لوحدها",
    importing: "⏳ بجيب الإعلان…",
    importOk: "✓ اتجاب! راجع العلامات وكمّل الناقص",
    importFail: "⚠️ معرفتش أجيب اللينك دا — كمّله يدوي",
    openAd: "افتح الإعلان ↗",
    routeBtn: "🗺️ الطريق للشغل",
    editBtn: "✏️ تعديل",
    deleteBtn: "🗑 حذف",
    confirmDelete: (t) => `متأكد عايز تحذف "${t}"؟`,
    deleted: "🗑 اتحذفت",
    edited: "✓ اتعدلت",
    added: "✓ اتضافت — علّم على الفلاتر بتاعتها",
    confirmReset: "دا هيرجّع البيانات الأصلية ويمسح أي تعديلات عملتها. متأكد؟",
    resetPasswordPrompt: "اكتب باسورد الاسترجاع:",
    resetWrongPassword: "باسورد الاسترجاع غلط",
    resetDone: "↩ رجعنا للبيانات الأصلية",
    apiError: "⚠️ حصلت مشكلة، جرّب تاني",
    noMatch: "مفيش مكان مطابق للفلاتر دي — شيل فلتر أو اتنين",
    scorePrice: "💰 السعر",
    scoreCommute: "🚌 قرب الشغل",
    themeTip: "بدّل للايت مود",
    themeTipDark: "بدّل للدارك مود",
    langTip: "Switch to English"
  }
};

/* ===== الحالة ===== */

let lang = localStorage.getItem("rooms_lang") || "en";
let theme = localStorage.getItem("rooms_theme") || "dark";
// مرة واحدة بس: ننقل أي متصفح فتح نسخة اللايت الافتراضية القديمة للدارك.
// بعد كدا اختيار المستخدم نفسه هو اللي بيتحفظ ويتحترم.
if (!localStorage.getItem("rooms_theme_default_dark_v2")) {
  theme = "dark";
  localStorage.setItem("rooms_theme", "dark");
  localStorage.setItem("rooms_theme_default_dark_v2", "1");
}
let listings = [];
let sortBy = "score";
const activeFilters = new Set();
let editingId = null;
let appLoaded = false;

const t = (key, ...args) => {
  const v = I18N[lang][key];
  return typeof v === "function" ? v(...args) : v;
};

/** نص محلي: بيدعم النص العادي (زي التواريخ) والنص بلغتين */
function loc(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return v[lang] || v.ar || v.en || "";
}

/** تحديث نص بلغتين: بيغيّر اللغة الحالية بس ويحافظ على التانية */
function setLoc(existing, value) {
  if (existing && typeof existing === "object") return { ...existing, [lang]: value };
  if (typeof existing === "string" && existing !== "") {
    return { ar: lang === "ar" ? value : existing, en: lang === "en" ? value : existing };
  }
  return { ar: value, en: value };
}

/* ===== عناصر ===== */

const $ = (sel) => document.querySelector(sel);
const lockScreen = $("#lock-screen");
const appEl = $("#app");
const cardsEl = $("#cards");
const statsEl = $("#stats");
const dialog = $("#edit-dialog");
const editForm = $("#edit-form");

/* ===== أدوات ===== */

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child) node.append(child);
  }
  return node;
}

let toastTimer = null;
function toast(msg) {
  const box = $("#toast");
  box.textContent = msg;
  box.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (box.hidden = true), 2200);
}

function fmt(n) {
  return n == null ? t("q") : n.toLocaleString("en-US");
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (res.status === 401) {
    showLock();
    throw new Error("unauthorized");
  }
  if (!res.ok) {
    toast(t("apiError"));
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

/* ===== الثيم واللغة ===== */

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  const btn = $("#theme-toggle");
  btn.textContent = theme === "dark" ? "☀️" : "🌙";
  btn.title = theme === "dark" ? t("themeTip") : t("themeTipDark");
}

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = t("docTitle");

  for (const node of document.querySelectorAll("[data-i18n]")) {
    node.textContent = t(node.dataset.i18n);
  }
  for (const node of document.querySelectorAll("[data-i18n-ph]")) {
    node.placeholder = t(node.dataset.i18nPh);
  }

  const langBtn = $("#lang-toggle");
  langBtn.textContent = lang === "ar" ? "EN" : "ع";
  langBtn.title = t("langTip");

  applyTheme(); // عشان تلميحات زرار الثيم تتترجم
  if (appLoaded) render();
}

$("#theme-toggle").addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  localStorage.setItem("rooms_theme", theme);
  applyTheme();
});

$("#lang-toggle").addEventListener("click", () => {
  lang = lang === "ar" ? "en" : "ar";
  localStorage.setItem("rooms_lang", lang);
  applyLang();
});

/* ===== السكور ===== */

function totalCost(l) {
  return l.rent + (l.bills == null ? BILLS_FALLBACK : l.bills);
}

function computeScores(list) {
  const costs = list.map(totalCost);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);
  const result = new Map();

  for (const l of list) {
    let earned = 0;
    let total = 0;
    const breakdown = [];

    for (const c of CRITERIA) {
      total += c.weight;
      const v = l.criteria[c.key] || "unknown";
      const got = v === "yes" ? c.weight : v === "unknown" ? c.weight * UNKNOWN_CREDIT : 0;
      earned += got;
      breakdown.push(`${c.icon} ${c[lang]}: ${v === "yes" ? "✓" : v === "no" ? "✗" : t("q")}`);
    }

    // السعر: الأرخص بياخد الوزن كامل (الإجمالي من غير جراج)
    total += PRICE_WEIGHT;
    const priceScore = maxCost === minCost ? 1 : (maxCost - totalCost(l)) / (maxCost - minCost);
    earned += priceScore * PRICE_WEIGHT;
    breakdown.push(`${t("scorePrice")}: ${Math.round(priceScore * 100)}%`);

    // المواصلات: 20 دقيقة أو أقل = ممتاز، 60+ = صفر
    total += COMMUTE_WEIGHT;
    let commuteScore;
    if (l.commuteMin == null) commuteScore = UNKNOWN_CREDIT;
    else commuteScore = Math.max(0, Math.min(1, (60 - l.commuteMin) / 40));
    earned += commuteScore * COMMUTE_WEIGHT;
    breakdown.push(`${t("scoreCommute")}: ${Math.round(commuteScore * 100)}%`);

    const pct = Math.round((earned / total) * 100);
    const unknownCount = CRITERIA.filter((c) => (l.criteria[c.key] || "unknown") === "unknown").length;
    result.set(l.id, { pct, unknownCount, breakdown: breakdown.join("\n") });
  }
  return result;
}

function scoreColor(pct) {
  if (pct >= 70) return "var(--green)";
  if (pct >= 50) return "var(--amber)";
  return "var(--red)";
}

/* ===== الرندر ===== */

function sortedListings(scores) {
  const arr = [...listings];
  if (sortBy === "price") {
    arr.sort((a, b) => totalCost(a) - totalCost(b));
  } else if (sortBy === "commute") {
    arr.sort((a, b) => (a.commuteMin ?? 999) - (b.commuteMin ?? 999));
  } else {
    arr.sort((a, b) => {
      const d = scores.get(b.id).pct - scores.get(a.id).pct;
      return d !== 0 ? d : totalCost(a) - totalCost(b);
    });
  }
  return arr;
}

function passesFilters(l) {
  for (const key of activeFilters) {
    if ((l.criteria[key] || "unknown") !== "yes") return false;
  }
  return true;
}

function render({ keepVisibleId = null } = {}) {
  const scores = computeScores(listings);
  renderStats(scores);
  renderFilterChips();

  // لما المستخدم يغيّر علامة، نفتكر مكان الكارت على الشاشة قبل الترتيب.
  // بعد الترتيب بنعوّض فرق المكان بالـscroll عشان يفضل قدام عينه.
  const anchorCard = keepVisibleId
    ? [...cardsEl.children].find((card) => card.dataset.id === keepVisibleId)
    : null;
  const anchorTop = anchorCard?.getBoundingClientRect().top ?? null;

  // FLIP: نسجّل أماكن الكروت قبل إعادة الترتيب عشان الأنيميشن
  const oldPositions = new Map();
  for (const card of cardsEl.children) {
    const r = card.getBoundingClientRect();
    oldPositions.set(card.dataset.id, { top: r.top, left: r.left });
  }

  cardsEl.replaceChildren();
  const sorted = sortedListings(scores);
  let rank = 0;

  for (const l of sorted) {
    if (!passesFilters(l)) continue;
    rank += 1;
    cardsEl.append(renderCard(l, rank, scores.get(l.id)));
  }

  if (rank === 0) {
    cardsEl.append(
      el("div", { class: "card", style: "text-align:center; color: var(--muted);" }, [
        el("div", { style: "font-size: 40px;", text: "🔍" }),
        el("p", { text: t("noMatch") })
      ])
    );
  }

  if (keepVisibleId && anchorTop != null) {
    const movedCard = [...cardsEl.children].find((card) => card.dataset.id === keepVisibleId);
    if (movedCard) {
      const distance = movedCard.getBoundingClientRect().top - anchorTop;
      window.scrollBy(0, distance);
      movedCard.animate(
        [
          { boxShadow: "0 0 0 3px var(--accent)" },
          { boxShadow: "var(--shadow)" }
        ],
        { duration: 650, easing: "ease-out" }
      );
    }
  }

  // FLIP: نحرّك الكروت من مكانها القديم للجديد
  if (keepVisibleId) return;
  for (const card of cardsEl.children) {
    const old = oldPositions.get(card.dataset.id);
    if (!old) continue;
    const r = card.getBoundingClientRect();
    const dy = old.top - r.top;
    const dx = old.left - r.left;
    if (Math.abs(dy) < 2 && Math.abs(dx) < 2) continue;
    card.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }],
      { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
  }
}

function renderStats(scores) {
  const cheapest = listings.reduce((a, b) => (totalCost(a) <= totalCost(b) ? a : b), listings[0]);
  const closest = listings.reduce(
    (a, b) => ((a?.commuteMin ?? 999) <= (b?.commuteMin ?? 999) ? a : b),
    listings[0]
  );
  const best = [...listings].sort((a, b) => scores.get(b.id).pct - scores.get(a.id).pct)[0];

  statsEl.replaceChildren(
    stat(t("statCount"), String(listings.length)),
    stat(t("statCheapest"), cheapest ? `${fmt(totalCost(cheapest))} zł` : t("dash")),
    stat(t("statClosest"), closest?.commuteMin != null ? t("minutesShort", closest.commuteMin) : t("dash")),
    stat(t("statBest"), best ? `${scores.get(best.id).pct}%` : t("dash"))
  );
}

function stat(label, value) {
  return el("div", { class: "stat" }, [
    el("div", { class: "stat-label", text: label }),
    el("div", { class: "stat-value", text: value })
  ]);
}

function renderFilterChips() {
  const wrap = $("#filter-chips");
  $("#filters-count").textContent =
    activeFilters.size === 0 ? t("filtersAll") : t("filtersActive", activeFilters.size);
  wrap.replaceChildren();
  for (const c of CRITERIA) {
    wrap.append(
      el("button", {
        class: `chip-filter${activeFilters.has(c.key) ? " on" : ""}`,
        text: `${c.icon} ${c[lang]}`,
        title: t("filterTooltip"),
        onclick: (e) => {
          e.stopPropagation();
          if (activeFilters.has(c.key)) activeFilters.delete(c.key);
          else activeFilters.add(c.key);
          render();
        }
      })
    );
  }
}

function mapsUrl(l) {
  return (
    "https://www.google.com/maps/dir/?api=1" +
    `&origin=${encodeURIComponent(l.address || l.district || "Warszawa")}` +
    `&destination=${encodeURIComponent(WORK_DEST)}&travelmode=transit`
  );
}

function typeLabel(type) {
  const key = {
    room: "typeRoom",
    studio: "typeStudio",
    flat: "typeFlat",
    other: "typeOther"
  }[type || "room"] || "typeOther";
  return t(key);
}

/* ===== معرض الصور واللايت بوكس ===== */

function renderGallery(l) {
  const photos = l.photos || [];
  if (photos.length === 0) return null;
  let idx = 0;

  const img = el("img", {
    class: "gal-img",
    src: photos[0],
    alt: "",
    loading: "lazy",
    title: t("zoomTip"),
    onclick: () => openLightbox(photos, idx)
  });
  const counter = el("span", { class: "gal-count", text: `1 / ${photos.length}` });

  const show = (i) => {
    idx = (i + photos.length) % photos.length;
    img.src = photos[idx];
    counter.textContent = `${idx + 1} / ${photos.length}`;
  };

  const nav = (delta) => (e) => {
    e.stopPropagation();
    show(idx + delta);
  };

  return el("div", { class: "gallery" }, [
    img,
    photos.length > 1 ? el("button", { class: "gal-btn gal-prev", text: "‹", onclick: nav(-1) }) : null,
    photos.length > 1 ? el("button", { class: "gal-btn gal-next", text: "›", onclick: nav(1) }) : null,
    counter
  ]);
}

let lightbox = null;
function openLightbox(photos, startIdx) {
  let idx = startIdx;
  closeLightbox();

  const img = el("img", {
    class: "lb-img",
    src: photos[idx],
    alt: "",
    title: t("zoomTip"),
    onclick: (e) => {
      e.stopPropagation();
      img.classList.toggle("zoomed");
    }
  });
  const counter = el("span", { class: "lb-count", text: `${idx + 1} / ${photos.length}` });

  const show = (i) => {
    idx = (i + photos.length) % photos.length;
    img.classList.remove("zoomed");
    img.src = photos[idx];
    counter.textContent = `${idx + 1} / ${photos.length}`;
  };

  const onKey = (e) => {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") show(idx - 1);
    else if (e.key === "ArrowRight") show(idx + 1);
  };

  lightbox = el("div", { class: "lightbox", onclick: () => closeLightbox() }, [
    img,
    photos.length > 1
      ? el("button", { class: "lb-btn lb-prev", text: "‹", onclick: (e) => { e.stopPropagation(); show(idx - 1); } })
      : null,
    photos.length > 1
      ? el("button", { class: "lb-btn lb-next", text: "›", onclick: (e) => { e.stopPropagation(); show(idx + 1); } })
      : null,
    el("button", { class: "lb-close", text: "✕", onclick: () => closeLightbox() }),
    counter
  ]);
  lightbox._onKey = onKey;
  document.addEventListener("keydown", onKey);
  document.body.append(lightbox);
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  document.removeEventListener("keydown", lightbox._onKey);
  lightbox.remove();
  lightbox = null;
  document.body.style.overflow = "";
}

function priceBox(label, value, extraClass = "") {
  return el("div", { class: `price-box${extraClass ? ` ${extraClass}` : ""}` }, [
    el("span", { class: "pb-label", text: label }),
    el("span", { class: "pb-value", text: value })
  ]);
}

function renderPriceGrid(l) {
  const garage = l.garageCost ?? null;
  const boxes = [
    priceBox(t("priceRent"), `${fmt(l.rent)} zł`),
    priceBox(t("priceBills"), l.bills == null ? t("q") : `${fmt(l.bills)} zł`),
    priceBox(
      t("priceGarage"),
      garage == null ? t("dash") : garage === 0 ? t("free") : `${fmt(garage)} zł`
    ),
    priceBox(
      t("priceTotal"),
      l.bills == null ? `${fmt(l.rent)} + ${t("q")}` : `${fmt(l.rent + l.bills)} ${t("perMonth")}`,
      "total"
    )
  ];
  if (l.deposit != null) {
    boxes.push(priceBox(t("priceDeposit"), `${fmt(l.deposit)} zł`));
  }
  return el("div", { class: "price-grid" }, boxes);
}

function renderCard(l, rank, score) {
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
  const isSortedByScore = sortBy === "score";
  const medal = isSortedByScore ? medals[rank] : null;

  const ring = el("div", {
    class: "score-ring",
    style: `--p:${score.pct}; --c:${scoreColor(score.pct)};`,
    title: `${t("scoreTooltip")}\n${score.breakdown}`,
    text: `${score.pct}%`
  });

  const chips = [
    el("span", { class: "chip type-chip", text: `🏡 ${typeLabel(l.propertyType)}` }),
    el("span", {
      class: `chip area-chip${l.areaSqm == null ? " unknown-area" : ""}`,
      text: `📐 ${l.areaSqm == null ? t("q") : fmt(l.areaSqm)} m²`
    }),
    el("span", { class: "chip", text: `📍 ${l.district}` }),
    el("a", {
      class: "chip",
      href: mapsUrl(l),
      target: "_blank",
      rel: "noopener",
      text: l.commuteMin != null ? t("commuteChip", l.commuteMin) : t("commuteUnknown"),
      title: t("mapsTitle")
    }),
    el("span", { class: "chip", text: `📅 ${loc(l.availableFrom) || t("q")}` }),
    el("span", { class: "chip", text: `📞 ${loc(l.contact) || t("q")}` })
  ];
  if (score.unknownCount > 0) {
    chips.push(
      el("span", {
        class: "chip warn",
        text: t("unknownChip", score.unknownCount),
        title: t("unknownTitle")
      })
    );
  }

  const critButtons = CRITERIA.map((c) => {
    const v = l.criteria[c.key] || "unknown";
    const stateIcon = v === "yes" ? "✓" : v === "no" ? "✗" : t("q");
    const menu = el("div", { class: "crit-menu", hidden: "true" });
    for (const option of [
      { value: "yes", icon: "✓", label: t("yesLabel") },
      { value: "unknown", icon: t("q"), label: t("unknownLabel") },
      { value: "no", icon: "✗", label: t("noLabel") }
    ]) {
      menu.append(
        el("button", {
          class: `crit-option ${option.value}${v === option.value ? " selected" : ""}`,
          type: "button",
          text: option.icon,
          title: option.label,
          "aria-label": option.label,
          onclick: async (e) => {
            e.stopPropagation();
            if (option.value === v) {
              menu.hidden = true;
              return;
            }
            l.criteria[c.key] = option.value;
            render({ keepVisibleId: l.id });
            await saveListing(l, { silent: true });
          }
        })
      );
    }
    const button = el(
      "button",
      {
        class: `crit ${v}`,
        type: "button",
        title: t("critTooltip"),
        onclick: (e) => {
          e.stopPropagation();
          document.querySelectorAll(".crit-menu:not([hidden])").forEach((openMenu) => {
            if (openMenu !== menu) openMenu.hidden = true;
          });
          menu.hidden = !menu.hidden;
        }
      },
      [
        el("span", { text: `${c.icon} ${c[lang]}` }),
        el("span", { class: "crit-state", text: stateIcon })
      ]
    );
    return el("div", { class: "crit-wrap" }, [button, menu]);
  });

  let notesTimer = null;
  const autoGrow = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  };
  const notesArea = el("textarea", {
    placeholder: t("notesPlaceholder"),
    oninput: (e) => {
      autoGrow(e.target);
      l.notes = setLoc(l.notes, e.target.value);
      clearTimeout(notesTimer);
      notesTimer = setTimeout(async () => {
        await saveListing(l, { silent: true });
        toast(t("notesSaved"));
      }, 800);
    }
  });
  notesArea.value = loc(l.notes);
  requestAnimationFrame(() => autoGrow(notesArea));

  return el("div", { class: `card${isSortedByScore && rank === 1 ? " rank-1" : ""}`, "data-id": l.id }, [
    renderGallery(l),
    el("div", { class: "card-head" }, [
      el("div", {
        class: `rank-badge${medal ? " medal" : ""}`,
        text: medal || String(rank)
      }),
      el("div", { class: "card-title-wrap" }, [
        el("h2", { class: "card-title", text: loc(l.title) }),
        el("div", { class: "card-chips" }, chips)
      ]),
      el("div", { class: "score-wrap" }, [ring, el("span", { class: "score-label", text: t("scoreLabel") })])
    ]),
    renderPriceGrid(l),
    el("div", { class: "criteria-grid" }, critButtons),
    el("div", { class: "notes-wrap" }, [notesArea]),
    el("div", { class: "card-actions" }, [
      el("a", {
        class: "btn btn-primary",
        href: l.url,
        target: "_blank",
        rel: "noopener",
        text: t("openAd")
      }),
      el("a", {
        class: "btn",
        href: mapsUrl(l),
        target: "_blank",
        rel: "noopener",
        text: t("routeBtn")
      }),
      el("button", { class: "btn", text: t("editBtn"), onclick: () => openEdit(l) }),
      el("button", {
        class: "btn btn-ghost btn-danger-text",
        text: t("deleteBtn"),
        onclick: async () => {
          if (!confirm(t("confirmDelete", loc(l.title)))) return;
          listings = await api(`/api/listings/${encodeURIComponent(l.id)}`, { method: "DELETE" });
          render();
          toast(t("deleted"));
        }
      })
    ])
  ]);
}

/* ===== الحفظ ===== */

async function saveListing(l, { silent = false } = {}) {
  listings = await api(`/api/listings/${encodeURIComponent(l.id)}`, {
    method: "PUT",
    body: JSON.stringify(l)
  });
  if (!silent) {
    render();
  }
}

/* ===== نافذة التعديل / الإضافة ===== */

function openEdit(l) {
  editingId = l ? l.id : null;
  editForm._importedCriteria = null;
  editForm._importedNotes = null;
  $("#edit-title").textContent = l ? t("editTitle") : t("addTitle");
  const f = editForm.elements;
  f.propertyType.value = l?.propertyType || "room";
  f.title.value = l ? loc(l.title) : "";
  f.district.value = l?.district || "";
  f.address.value = l?.address || "";
  f.url.value = l?.url || "";
  f.rent.value = l?.rent ?? "";
  f.bills.value = l?.bills ?? "";
  f.garageCost.value = l?.garageCost ?? "";
  f.areaSqm.value = l?.areaSqm ?? "";
  f.deposit.value = l?.deposit ?? "";
  f.commuteMin.value = l?.commuteMin ?? "";
  f.availableFrom.value = l ? loc(l.availableFrom) : "";
  f.contact.value = l ? loc(l.contact) : "";
  f.photos.value = (l?.photos || []).join("\n");
  dialog.showModal();
}

$("#import-btn").addEventListener("click", async () => {
  const f = editForm.elements;
  const url = f.url.value.trim();
  if (!url) {
    f.url.focus();
    return;
  }

  const btn = $("#import-btn");
  btn.disabled = true;
  btn.textContent = t("importing");
  try {
    const draft = await api("/api/import", {
      method: "POST",
      body: JSON.stringify({ url })
    });

    f.propertyType.value = draft.propertyType || "other";
    f.title.value = loc(draft.title);
    f.district.value = draft.district || "";
    f.address.value = draft.address || "";
    f.rent.value = draft.rent || "";
    f.bills.value = draft.bills ?? "";
    f.garageCost.value = draft.garageCost ?? "";
    f.areaSqm.value = draft.areaSqm ?? "";
    f.deposit.value = draft.deposit ?? "";
    f.commuteMin.value = draft.commuteMin ?? "";
    f.availableFrom.value = loc(draft.availableFrom);
    f.contact.value = loc(draft.contact);
    f.photos.value = (draft.photos || []).join("\n");

    // نخزّن الاستنتاجات لحد ما المستخدم يدوس حفظ
    editForm._importedCriteria = draft.criteria;
    editForm._importedNotes = draft.notes;
    toast(t("importOk"));
  } catch {
    toast(t("importFail"));
  } finally {
    btn.disabled = false;
    btn.textContent = t("importBtn");
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = editForm.elements;
  const num = (input) => (input.value === "" ? null : Number(input.value));

  const existing = editingId ? listings.find((x) => x.id === editingId) : null;
  const listing = {
    id: editingId || `room-${Date.now()}`,
    propertyType: f.propertyType.value,
    title: setLoc(existing?.title, f.title.value.trim()),
    district: f.district.value.trim(),
    address: f.address.value.trim(),
    url: f.url.value.trim(),
    rent: Number(f.rent.value),
    bills: num(f.bills),
    garageCost: num(f.garageCost),
    areaSqm: num(f.areaSqm),
    deposit: num(f.deposit),
    commuteMin: num(f.commuteMin),
    availableFrom: setLoc(existing?.availableFrom, f.availableFrom.value.trim()),
    contact: setLoc(existing?.contact, f.contact.value.trim()),
    photos: f.photos.value.split("\n").map((s) => s.trim()).filter((s) => s.startsWith("http")),
    notes: existing?.notes || editForm._importedNotes || "",
    criteria:
      existing?.criteria ||
      editForm._importedCriteria ||
      Object.fromEntries(CRITERIA.map((c) => [c.key, "unknown"])),
    createdAt: existing?.createdAt || Date.now()
  };

  if (editingId) {
    listings = await api(`/api/listings/${encodeURIComponent(listing.id)}`, {
      method: "PUT",
      body: JSON.stringify(listing)
    });
  } else {
    listings = await api("/api/listings", { method: "POST", body: JSON.stringify(listing) });
  }
  dialog.close();
  editForm._importedCriteria = null;
  editForm._importedNotes = null;
  render();
  toast(editingId ? t("edited") : t("added"));
});

$("#edit-cancel").addEventListener("click", () => dialog.close());
$("#add-btn").addEventListener("click", () => openEdit(null));

/* ===== الدخول والخروج ===== */

function showLock() {
  appEl.hidden = true;
  lockScreen.hidden = false;
  $("#lock-input").focus();
}

async function showApp() {
  listings = await api("/api/listings");
  appLoaded = true;
  lockScreen.hidden = true;
  appEl.hidden = false;
  render();
}

/** لوحة عربية/فارسية بتبعت ٧٧٧ بدل 777 */
function normalizePassword(password) {
  return password
    .trim()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

$("#lock-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = $("#lock-input");
  const res = await fetch("/api/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: normalizePassword(input.value) })
  });
  if (res.ok) {
    $("#lock-error").hidden = true;
    await showApp();
  } else {
    $("#lock-error").hidden = false;
    input.value = "";
    const card = document.querySelector(".lock-card");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
  }
});

$("#logout-btn").addEventListener("click", async () => {
  window.location.assign("/logout");
});

$("#sort-select").addEventListener("change", (e) => {
  sortBy = e.target.value;
  render();
});

document.addEventListener("click", (e) => {
  const panel = $("#filters-panel");
  if (panel.open && !panel.contains(e.target)) panel.open = false;
  document.querySelectorAll(".crit-menu:not([hidden])").forEach((menu) => {
    if (!menu.parentElement.contains(e.target)) menu.hidden = true;
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $("#filters-panel").open = false;
    document.querySelectorAll(".crit-menu:not([hidden])").forEach((menu) => {
      menu.hidden = true;
    });
  }
});

$("#reset-btn").addEventListener("click", async () => {
  if (!confirm(t("confirmReset"))) return;
  const password = prompt(t("resetPasswordPrompt"));
  if (password == null) return;
  const res = await fetch("/api/reset", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: normalizePassword(password) })
  });
  if (res.status === 403) {
    toast(t("resetWrongPassword"));
    return;
  }
  if (!res.ok) {
    toast(t("apiError"));
    return;
  }
  listings = await res.json();
  render();
  toast(t("resetDone"));
});

/* ===== البداية ===== */

applyLang();

(async function init() {
  try {
    const session = await fetch("/api/session").then((r) => r.json());
    if (session.authed) {
      await showApp();
    } else {
      showLock();
    }
  } catch {
    showLock();
  }
})();
