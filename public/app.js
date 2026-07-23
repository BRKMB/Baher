"use strict";

/* ===== إعدادات ===== */

const WORK_DEST = "Lionbridge Poland, Łopuszańska 95, 02-457 Warszawa";

// الفلاتر بتاعتك — الوزن يعني أهمية الحاجة في السكور
const CRITERIA = [
  { key: "oven", label: "فرن", icon: "🍞", weight: 2 },
  { key: "bed", label: "سرير مريح بمرتبة كويسة", icon: "🛏️", weight: 3 },
  { key: "spacious", label: "أوضة واسعة", icon: "📐", weight: 2 },
  { key: "garage", label: "جراج / ركنة مجانية", icon: "🚗", weight: 1 },
  { key: "max3", label: "٣ أوض أو أقل في الشقة", icon: "👥", weight: 2 },
  { key: "desk", label: "مكتب كبير للشاشات", icon: "🖥️", weight: 3 },
  { key: "modern", label: "شقة مودرن", icon: "✨", weight: 2 },
  { key: "elevator", label: "أسانسير (لو دور عالي)", icon: "🛗", weight: 1 },
  { key: "availableAug", label: "متاحة من ١ أغسطس", icon: "📅", weight: 3 },
  { key: "noCommission", label: "من غير كوميشن", icon: "🧾", weight: 2 }
];

const UNKNOWN_CREDIT = 0.4; // "مش متأكد" بياخد 40% من الوزن
const PRICE_WEIGHT = 4;
const COMMUTE_WEIGHT = 4;
const BILLS_FALLBACK = 300; // لو المصاريف مش معروفة بنفترض 300 زلوتي في الحساب

/* ===== الحالة ===== */

let listings = [];
let sortBy = "score";
const activeFilters = new Set();
let editingId = null;

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
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2200);
}

function fmt(n) {
  return n == null ? "؟" : n.toLocaleString("en-US");
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (res.status === 401) {
    showLock();
    throw new Error("unauthorized");
  }
  if (!res.ok) {
    toast("⚠️ حصلت مشكلة، جرّب تاني");
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

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
      breakdown.push(`${c.icon} ${c.label}: ${v === "yes" ? "✓" : v === "no" ? "✗" : "؟"}`);
    }

    // السعر: الأرخص بياخد الوزن كامل
    total += PRICE_WEIGHT;
    const priceScore = maxCost === minCost ? 1 : (maxCost - totalCost(l)) / (maxCost - minCost);
    earned += priceScore * PRICE_WEIGHT;
    breakdown.push(`💰 السعر: ${Math.round(priceScore * 100)}%`);

    // المواصلات: 20 دقيقة أو أقل = ممتاز، 60+ = صفر
    total += COMMUTE_WEIGHT;
    let commuteScore;
    if (l.commuteMin == null) commuteScore = UNKNOWN_CREDIT;
    else commuteScore = Math.max(0, Math.min(1, (60 - l.commuteMin) / 40));
    earned += commuteScore * COMMUTE_WEIGHT;
    breakdown.push(`🚌 قرب الشغل: ${Math.round(commuteScore * 100)}%`);

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

function render() {
  const scores = computeScores(listings);
  renderStats(scores);
  renderFilterChips();

  // FLIP: نسجّل أماكن الكروت قبل إعادة الترتيب عشان الأنيميشن
  const oldPositions = new Map();
  for (const card of cardsEl.children) {
    oldPositions.set(card.dataset.id, card.getBoundingClientRect().top);
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
        el("p", { text: "مفيش أوضة مطابقة للفلاتر دي — شيل فلتر أو اتنين" })
      ])
    );
  }

  // FLIP: نحرّك الكروت من مكانها القديم للجديد
  for (const card of cardsEl.children) {
    const oldTop = oldPositions.get(card.dataset.id);
    if (oldTop === undefined) continue;
    const delta = oldTop - card.getBoundingClientRect().top;
    if (Math.abs(delta) < 2) continue;
    card.animate(
      [{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }],
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
    stat("🏠 عدد الأوض", String(listings.length)),
    stat("💰 أرخص إجمالي", cheapest ? `${fmt(totalCost(cheapest))} zł` : "—"),
    stat("🚌 أقرب للشغل", closest?.commuteMin != null ? `~${closest.commuteMin} دقيقة` : "—"),
    stat("🏆 الأعلى سكور", best ? `${scores.get(best.id).pct}%` : "—")
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
  wrap.replaceChildren();
  for (const c of CRITERIA) {
    wrap.append(
      el("button", {
        class: `chip-filter${activeFilters.has(c.key) ? " on" : ""}`,
        text: `${c.icon} ${c.label}`,
        title: "اعرض بس اللي فيها الحاجة دي أكيد",
        onclick: () => {
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

function renderCard(l, rank, score) {
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
  const isSortedByScore = sortBy === "score";
  const medal = isSortedByScore ? medals[rank] : null;

  const ring = el("div", {
    class: "score-ring",
    style: `--p:${score.pct}; --c:${scoreColor(score.pct)};`,
    title: `تفاصيل السكور:\n${score.breakdown}`,
    text: `${score.pct}%`
  });

  const chips = [
    el("span", { class: "chip", text: `📍 ${l.district}` }),
    el("a", {
      class: "chip",
      href: mapsUrl(l),
      target: "_blank",
      rel: "noopener",
      text: l.commuteMin != null ? `🚌 ~${l.commuteMin} دقيقة للشغل` : "🚌 المسافة للشغل؟",
      title: "افتح الطريق على جوجل مابس"
    }),
    el("span", { class: "chip", text: `📅 ${l.availableFrom || "؟"}` }),
    el("span", { class: "chip", text: `📞 ${l.contact || "؟"}` })
  ];
  if (score.unknownCount > 0) {
    chips.push(
      el("span", {
        class: "chip warn",
        text: `؟ ${score.unknownCount} حاجات محتاجة تأكيد`,
        title: "اسأل المعلن وحدّث العلامات"
      })
    );
  }

  const critButtons = CRITERIA.map((c) => {
    const v = l.criteria[c.key] || "unknown";
    const stateIcon = v === "yes" ? "✓" : v === "no" ? "✗" : "؟";
    return el(
      "button",
      {
        class: `crit ${v}`,
        title: "دوس عشان تغيّر: أيوه ← لأ ← مش متأكد",
        onclick: async () => {
          const next = v === "yes" ? "no" : v === "no" ? "unknown" : "yes";
          l.criteria[c.key] = next;
          render();
          await saveListing(l);
        }
      },
      [
        el("span", { text: `${c.icon} ${c.label}` }),
        el("span", { class: "crit-state", text: stateIcon })
      ]
    );
  });

  let notesTimer = null;
  const notesArea = el("textarea", {
    placeholder: "ملاحظات… (بتتحفظ لوحدها)",
    oninput: (e) => {
      l.notes = e.target.value;
      clearTimeout(notesTimer);
      notesTimer = setTimeout(async () => {
        await saveListing(l, { silent: true });
        toast("✓ الملاحظات اتحفظت");
      }, 800);
    }
  });
  notesArea.value = l.notes || "";

  return el("div", { class: `card${isSortedByScore && rank === 1 ? " rank-1" : ""}`, "data-id": l.id }, [
    el("div", { class: "card-head" }, [
      el("div", {
        class: `rank-badge${medal ? " medal" : ""}`,
        text: medal || String(rank)
      }),
      el("div", { class: "card-title-wrap" }, [
        el("h2", { class: "card-title", text: l.title }),
        el("div", { class: "card-chips" }, chips)
      ]),
      el("div", { class: "score-wrap" }, [ring, el("span", { class: "score-label", text: "السكور" })])
    ]),
    el("div", { class: "price-row" }, [
      el("span", { class: "price-total", html: `${fmt(totalCost(l))} <small>zł / شهر</small>` }),
      el("span", {
        class: "price-breakdown",
        text: `(إيجار ${fmt(l.rent)} + مصاريف ${fmt(l.bills)})` + (l.deposit != null ? ` • ديبوزيت ${fmt(l.deposit)}` : "")
      })
    ]),
    el("div", { class: "criteria-grid" }, critButtons),
    el("div", { class: "notes-wrap" }, [notesArea]),
    el("div", { class: "card-actions" }, [
      el("a", {
        class: "btn btn-primary",
        href: l.url,
        target: "_blank",
        rel: "noopener",
        text: "افتح الإعلان ↗"
      }),
      el("a", {
        class: "btn",
        href: mapsUrl(l),
        target: "_blank",
        rel: "noopener",
        text: "🗺️ الطريق للشغل"
      }),
      el("button", { class: "btn", text: "✏️ تعديل", onclick: () => openEdit(l) }),
      el("button", {
        class: "btn btn-ghost btn-danger-text",
        text: "🗑 حذف",
        onclick: async () => {
          if (!confirm(`متأكد عايز تحذف "${l.title}"؟`)) return;
          listings = await api(`/api/listings/${encodeURIComponent(l.id)}`, { method: "DELETE" });
          render();
          toast("🗑 اتحذفت");
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
  $("#edit-title").textContent = l ? "تعديل الأوضة" : "ضيف أوضة جديدة";
  const f = editForm.elements;
  f.title.value = l?.title || "";
  f.district.value = l?.district || "";
  f.address.value = l?.address || "";
  f.url.value = l?.url || "";
  f.rent.value = l?.rent ?? "";
  f.bills.value = l?.bills ?? "";
  f.deposit.value = l?.deposit ?? "";
  f.commuteMin.value = l?.commuteMin ?? "";
  f.availableFrom.value = l?.availableFrom || "";
  f.contact.value = l?.contact || "";
  dialog.showModal();
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = editForm.elements;
  const num = (input) => (input.value === "" ? null : Number(input.value));

  const existing = editingId ? listings.find((x) => x.id === editingId) : null;
  const listing = {
    id: editingId || `room-${Date.now()}`,
    title: f.title.value.trim(),
    district: f.district.value.trim(),
    address: f.address.value.trim(),
    url: f.url.value.trim(),
    rent: Number(f.rent.value),
    bills: num(f.bills),
    deposit: num(f.deposit),
    commuteMin: num(f.commuteMin),
    availableFrom: f.availableFrom.value.trim(),
    contact: f.contact.value.trim(),
    notes: existing?.notes || "",
    criteria: existing?.criteria || Object.fromEntries(CRITERIA.map((c) => [c.key, "unknown"])),
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
  render();
  toast(editingId ? "✓ اتعدلت" : "✓ اتضافت — علّم على الفلاتر بتاعتها");
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
  lockScreen.hidden = true;
  appEl.hidden = false;
  render();
}

$("#lock-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = $("#lock-input");
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: input.value })
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
  await fetch("/api/logout", { method: "POST" });
  location.reload();
});

$("#sort-select").addEventListener("change", (e) => {
  sortBy = e.target.value;
  render();
});

$("#reset-btn").addEventListener("click", async () => {
  if (!confirm("دا هيرجّع البيانات الأصلية ويمسح أي تعديلات عملتها. متأكد؟")) return;
  listings = await api("/api/reset", { method: "POST" });
  render();
  toast("↩ رجعنا للبيانات الأصلية");
});

/* ===== البداية ===== */

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
