export type CriterionValue = "yes" | "no" | "unknown";

/** نص بلغتين — أو نص عادي لو نفس القيمة في الاتنين (زي التواريخ) */
export type LocalizedText = string | { ar: string; en: string };

export interface Listing {
  id: string;
  title: LocalizedText;
  district: string;
  address: string;
  url: string;
  /** الإيجار الشهري بالزلوتي */
  rent: number;
  /** المرافق وكل حاجة غير الإيجار (إدارة/غاز/كهربا/مية) — null لو مش معروفة */
  bills: number | null;
  /** الجراج بالشهر لو فيه — null لو مفيش أو مش معروف */
  garageCost: number | null;
  /** الديبوزيت — null لو مش معروف */
  deposit: number | null;
  /** تقدير وقت المواصلات للشغل بالدقايق (Lionbridge, Łopuszańska 95) */
  commuteMin: number | null;
  availableFrom: LocalizedText;
  contact: LocalizedText;
  notes: LocalizedText;
  /** صور الإعلان (من OLX CDN) */
  photos: string[];
  criteria: Record<string, CriterionValue>;
  /** ترتيب الإضافة عشان الثبات */
  createdAt: number;
}

// البيانات دي متجمّعة من إعلانات OLX يوم 23 يوليو 2026 — عدّل أي حاجة من الموقع نفسه
export const SEED_LISTINGS: Listing[] = [
  {
    id: "ochota-korotynskiego",
    title: {
      ar: "أوضة في شقة 3 أوض — أوچوتا القديمة (بتكييف)",
      en: "Room in a 3-room flat — Stara Ochota (A/C)"
    },
    district: "Ochota",
    address: "ul. Korotyńskiego 42, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoje-w-3-osobowym-mieszkaniu-dla-studentow-stara-ochota-korotynskiego-klima-CID3-ID1bkBes.html",
    rent: 1600,
    bills: 450,
    garageCost: null,
    deposit: 2000,
    commuteMin: 25,
    availableFrom: { ar: "متاحة دلوقتي", en: "Available now" },
    contact: { ar: "Igor — شات OLX", en: "Igor — OLX chat" },
    notes: {
      ar: "الأوضة المتاحة 13م² (في أوضة أكبر بـ1800 بس من أكتوبر). من الصور: مكتب ركنة كبير عليه شاشة وكرسي جيمينج 👌. تكييف في كل أوضة + غسالة أطباق + إير فراير. الإعلان موجّه للطلبة وعقد سنة — اسأل لو بيقبلوا موظفين. من أقرب الأماكن للشغل.",
      en: "The available room is 13m² (a bigger one for 1800 only from October). From the photos: big corner desk with a monitor and a gaming chair 👌. A/C in every room + dishwasher + air fryer. Ad targets students with a 1-year contract — ask if they accept working people. One of the closest to work."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/vpshx2jmn9ul1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/f1p0t61y0nbp-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/6uc0howyrprp-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/sbblwxv7t0z43-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/o5jca9pofj7l1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/6x8ak558ojz21-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ji9yxlbjv3gl3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/h5628b5ce05g-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      bed: "unknown",
      spacious: "no",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 1
  },
  {
    id: "wola-redutowa",
    title: {
      ar: "أوضة كبيرة ببلكونة — ڤولا، مترو Księcia Janusza",
      en: "Big room with balcony — Wola, Księcia Janusza metro"
    },
    district: "Wola",
    address: "ul. Redutowa 52, Warszawa",
    url: "https://www.olx.pl/d/oferta/duzy-pokoj-z-balkonem-wola-metro-ksiecia-janusza-wolny-od-01-08-2026-CID3-ID1bq7tt.html",
    rent: 1800,
    bills: 350,
    garageCost: null,
    deposit: 2150,
    commuteMin: 35,
    availableFrom: "01/08/2026",
    contact: {
      ar: "Aleksander — واتساب ‎+41 779 703 705",
      en: "Aleksander — WhatsApp +41 779 703 705"
    },
    notes: {
      ar: "⚠️ الإعلان بيقول \"يفضَّل بنات\" — اتأكد الأول إن مفيش مشكلة. من الصور: الفرن باين في المطبخ ✓ بس المكتب مش باين رغم إن الإعلان ذكره — اسأل عليه. عمارة جديدة في كمبوند مقفول وسرير كبير مريح. 6 دقايق مشي للمترو. عقد سنة على الأقل.",
      en: "⚠️ The ad says \"women preferred\" — double-check first. From the photos: oven visible in the kitchen ✓ but no desk visible even though the ad mentions one — ask about it. New building in a gated estate, big comfy bed. 6 min walk to the metro. Min 1-year contract."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/oljchcebzlzn3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/b0cuxnofhij6-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/d2yz1axoe3dh2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/5n63idvq2y22-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/kgx69l1vge4s1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ocv7mj1sxahu3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      bed: "yes",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 2
  },
  {
    id: "praga-polnoc-wilenska",
    title: {
      ar: "أوضة كبيرة جدًا ببلكونة — پراجا الشمالية، مترو Wileńska",
      en: "Very big room with balcony — Praga Północ, Wileńska metro"
    },
    district: "Praga-Północ",
    address: "Praga-Północ (near Galeria Wileńska), Warszawa",
    url: "https://www.olx.pl/d/oferta/bardzo-duzy-pokoj-z-balkonem-praga-polnoc-metro-wilenska-CID3-ID1bwsVX.html",
    rent: 1790,
    bills: 300,
    garageCost: null,
    deposit: 2090,
    commuteMin: 50,
    availableFrom: "01/08/2026",
    contact: { ar: "Wojciech — واتساب 695 266 951", en: "Wojciech — WhatsApp 695 266 951" },
    notes: {
      ar: "⚠️ بيدوروا على بنت 18-30 سنة — غالبًا مش هتنفع. أوضة 17م² + بلكونة 4م²، سرير 130سم بمرتبة عالية الجودة، مكتب 120سم بكرسي جلد. الشقة 5 أوض (6 سكان). السعر شامل كل حاجة + تنضيف أسبوعي.",
      en: "⚠️ They're looking for a female tenant aged 18-30 — probably won't work. 17m² room + 4m² balcony, 130cm bed with a high-quality mattress, 120cm desk with a leather chair. The flat has 5 rooms (6 tenants). All-inclusive price + weekly cleaning."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/fwpu5gutx0ct-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ycd2o2pjrfn91-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/7jgewp18ofzk3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/fwjmcvepxazl-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/kqynvmmqhnc91-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/igt8pwqicmok-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      bed: "yes",
      spacious: "yes",
      garage: "unknown",
      max3: "no",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 3
  },
  {
    id: "ursynow-hawajska",
    title: {
      ar: "أوضة 18م² ببلكونة — أورسينوف، مترو Imielin على 200 متر",
      en: "18m² room with balcony — Ursynów, 200m to Imielin metro"
    },
    district: "Ursynów",
    address: "ul. Hawajska 2, Warszawa",
    url: "https://www.olx.pl/d/oferta/ursynow-pokoj-dla-jednej-lub-dwoch-osob-18m2-balkon-metro-200m-CID3-ID1bdXM4.html",
    rent: 1600,
    bills: 400,
    garageCost: null,
    deposit: 2000,
    commuteMin: 50,
    availableFrom: "15/09/2026 ⚠️",
    contact: { ar: "Roman — شات OLX", en: "Roman — OLX chat" },
    notes: {
      ar: "⚠️ مش متاحة غير من 15 سبتمبر — مش مناسبة لو محتاج أول أغسطس. من الصور: مكتب أبيض كويس جنب الشباك ✓ والحمام متجدد حلو، بس باقي الشقة كلاسيك. أوضة 18م² بسرير عرض 160سم وبلكونة. الشقة 4 أوض (4-5 سكان). دقيقتين مشي للمترو.",
      en: "⚠️ Only available from Sept 15 — no good if you need Aug 1. From the photos: nice white desk by the window ✓ and a freshly renovated bathroom, but the rest of the flat is classic. 18m² room with a 160cm-wide bed and a balcony. 4-room flat (4-5 tenants). 2 min walk to the metro."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/qvl9zx2e77sj-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/vjzkptxnau6y1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/uz9wmbysvowr3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/badnt0tysnv43-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/2u6xhmscxscs3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/atxoc5h8whh7-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/t13199zx20923-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      bed: "yes",
      spacious: "yes",
      garage: "unknown",
      max3: "no",
      desk: "yes",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes"
    },
    createdAt: 4
  },
  {
    id: "ursynow-warchalowskiego",
    title: {
      ar: "أوضة فردية هادية — أورسينوف، مترو Imielin (الأرخص)",
      en: "Quiet single room — Ursynów, Imielin metro (cheapest)"
    },
    district: "Ursynów",
    address: "ul. Warchałowskiego 3, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-1-os-blisko-metro-imielin-zielen-wi-fi-ul-warchalowskiego-3-CID3-ID1btZbt.html",
    rent: 1250,
    bills: 300,
    garageCost: null,
    deposit: 1500,
    commuteMin: 50,
    availableFrom: { ar: "متاحة دلوقتي", en: "Available now" },
    contact: { ar: "Marek — شات OLX", en: "Marek — OLX chat" },
    notes: {
      ar: "أرخص واحدة (1550 إجمالي). ⚠️ من الصور: الأوضة في العِلّية والسقف مايل، ومفيش فرن باين في المطبخ (بوتاجاز مسطح + ميكروويف بس). المكتب الأبيض حجمه كويس ✓. شقة متجددة بتصميم مصممة ديكور، الأوض بتتقفل بمفتاح، ومفيش صاحب البيت ساكن معاك. فيه بدروم لتخزين العجلة/الشنط. العقد لحد 15/09/2027.",
      en: "Cheapest one (1550 total). ⚠️ From the photos: attic room with sloped ceilings, and no oven visible in the kitchen (just a hob + microwave). The white desk is a decent size ✓. Renovated flat styled by an interior designer, lockable rooms, no live-in landlord. Basement storage for a bike/suitcases. Contract until 15/09/2027."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/g469guvqg3jj1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/q1he2yb31olj2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/8k9h6uzqujcw-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/7j6em5spvais-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/nns2bxf0g70t-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/6vqg84fd7iwv2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/jrt9re694odk1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/p9ak6xlhmqqu2-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "no",
      bed: "unknown",
      spacious: "yes",
      garage: "unknown",
      max3: "unknown",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 5
  },
  {
    id: "praga-szwedzka",
    title: {
      ar: "أوضة واسعة في شقة أوضتين بس — 3 دقايق من مترو Szwedzka",
      en: "Spacious room in a 2-room flat — 3 min to Szwedzka metro"
    },
    district: "Praga-Północ",
    address: "near Szwedzka metro (M2), Warszawa",
    url: "https://www.olx.pl/d/oferta/przestronny-pokoj-w-2-pokojowym-mieszkaniu-3-min-od-metra-szwedzka-m2-CID3-ID1bxCuc.html",
    rent: 1750,
    bills: 75,
    garageCost: null,
    deposit: null,
    commuteMin: 50,
    availableFrom: "02/08/2026",
    contact: { ar: "Maksymilian — شات OLX", en: "Maksymilian — OLX chat" },
    notes: {
      ar: "هتسكن مع شخص واحد بس (اللي معلن) — أهدى اختيار. من الصور: سرير دوبل كبير ✓ ومكتب جيمينج كبير بشاشة وكرسي مريح ✓، بس المطبخ والحمام على الطراز القديم (مش مودرن). السعر شامل الإدارة والمية والتدفئة والنت، وبتدفع بس كهربا وغاز (~150 زلوتي كل شهرين). فيها فرن غاز. متاحة من 2 أغسطس.",
      en: "You'd live with just one flatmate (the poster) — the calmest option. From the photos: big double bed ✓ and a large gaming desk with a monitor and comfy chair ✓, but the kitchen and bathroom are old-style (not modern). Price includes admin fees, water, heating and internet; you only pay electricity + gas (~150 zł every 2 months). Gas oven. Available from Aug 2."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/pz9c08py3xej1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/evmkk2agr9r71-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/mavgztlng1ai-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/x682qmgeuwmn-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/fduwrjxqoytn3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      bed: "yes",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "no",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 6
  },
  {
    id: "praga-poludnie-tatarkiewicza",
    title: {
      ar: "أوضة مريحة — پراجا الجنوبية، 20 دقيقة للسنتر",
      en: "Comfortable room — Praga Południe, 20 min to center"
    },
    district: "Praga-Południe",
    address: "ul. Tatarkiewicza 10, Warszawa",
    url: "https://www.olx.pl/d/oferta/komfortowy-pokoj-praga-poludnie-20min-do-centrum-CID3-ID1bxh6O.html",
    rent: 1590,
    bills: 300,
    garageCost: null,
    deposit: 1890,
    commuteMin: 55,
    availableFrom: "01/08/2026",
    contact: { ar: "Wojciech — واتساب 695 266 951", en: "Wojciech — WhatsApp 695 266 951" },
    notes: {
      ar: "⚠️ نفس شبكة sPokój — بيدوروا على بنت 18-30 سنة، غالبًا مش هتنفع. الأوضة 10م² بس (صغيرة). سرير 130سم بمرتبة كويسة ومكتب 120سم. الشقة 5 أوض و3 حمامات. السعر شامل كل حاجة.",
      en: "⚠️ Same sPokój network — looking for a female tenant aged 18-30, probably won't work. The room is only 10m² (small). 130cm bed with a good mattress and a 120cm desk. The flat has 5 rooms and 3 bathrooms. All-inclusive price."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/1d5pb4ww0dlz1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ax8jpp95y70j1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/0bsgpsqmy7gj1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/9xclpy8n07j61-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/b40e1yw7bd643-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/dlb7uxbfikhf3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      bed: "yes",
      spacious: "no",
      garage: "unknown",
      max3: "no",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 7
  },
  {
    id: "ursynow-puszczyka",
    title: {
      ar: "أوضة حلوة — أورسينوف، جنب مترو Ursynów",
      en: "Nice room — Ursynów, next to Ursynów metro"
    },
    district: "Ursynów",
    address: "ul. Puszczyka, Warszawa",
    url: "https://www.olx.pl/d/oferta/puszczyka-bardzo-ladny-pokoj-ursynow-obok-metra-ursynow-ul-puszczyka-CID3-ID18oGA6.html",
    rent: 1400,
    bills: null,
    garageCost: null,
    deposit: null,
    commuteMin: 45,
    availableFrom: { ar: "متاحة دلوقتي", en: "Available now" },
    contact: { ar: "mmm — شات OLX", en: "mmm — OLX chat" },
    notes: {
      ar: "⚠️ إعلان من شركة (Firmowe) — اسأل لو فيه كوميشن! السعر قابل للتفاوض والمصاريف مش مذكورة. من الصور: التجديد فعلًا فخم — حمام رخام جديد بالبانيو ✓ بس مفيش مكتب باين في الأوض (قالوا ممكن يضيفوا مكتب أبيض). فيه أماكن ركنة جنب العمارة. 5 دقايق مشي للمترو.",
      en: "⚠️ Company listing (Firmowe) — ask about commission! Price negotiable and utilities not stated. From the photos: the renovation really is fancy — brand-new marble bathroom with a tub ✓ but no desk visible in the rooms (they said a white desk can be added). Parking spots next to the building. 5 min walk to the metro."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/wydwitnp9wa42-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/cjk0x2kq4ht73-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/y9hbbqbkoxje3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/nje11h5omedl2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/hag2jo4tid9s1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/lqksi1qisp8y-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/u0rm0n5a76x51-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/hi591cobuhjb2-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      bed: "unknown",
      spacious: "unknown",
      garage: "yes",
      max3: "unknown",
      desk: "unknown",
      modern: "yes",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "unknown"
    },
    createdAt: 8
  },
  {
    id: "mokotow-komputerowa",
    title: {
      ar: "أوضة فردية 15م² — الموردور، شارع Komputerowa",
      en: "Single room 15m² — Mordor, Komputerowa st."
    },
    district: "Mokotów (Służewiec)",
    address: "ul. Komputerowa 7a, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-jednosobowy-mordor-ul-komputerowa-CID3-ID1bxPNp.html",
    rent: 1900,
    bills: 300,
    garageCost: null,
    deposit: 1900,
    commuteMin: 25,
    availableFrom: "01/08/2026",
    contact: { ar: "Michał — شات OLX", en: "Michał — OLX chat" },
    notes: {
      ar: "⚠️ مفيش سرير حقيقي — كنبة ركنة بتتفرش (narożnik). من الصور: مكتب بشاشة وكرسي مكتب مريح ✓، الشقة مودرن وعمارة جديدة ✓، وفيه بلكونة كبيرة بقعدة كاملة 👌. أوضة 15م² في شقة 66م² لـ3 أشخاص بس. فرن + إندكشن + غسالة أطباق + تلاجة كبيرة بكوستكارة. قريبة جدًا من الشغل. السعر قابل للتفاوض، عقد سنة.",
      en: "⚠️ No real bed — a corner sofa bed (narożnik). From the photos: desk with a monitor and comfy office chair ✓, modern flat in a new building ✓, and a big balcony with a full seating set 👌. 15m² room in a 66m² flat with only 3 people. Oven + induction + dishwasher + big fridge with an ice maker. Very close to work. Price negotiable, 1-year contract."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/h9ki4q5788lq1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/dwrnil7gy56w-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/pnvhfyr0w0c9-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/wbaj4g1q00eu-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/6owiwr4q6fe43-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/dsumjbq999rs1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/srlw1vn224rw1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/eigglybp3j1j3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 9
  }
];
