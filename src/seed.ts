export type CriterionValue = "yes" | "no" | "unknown";

/** نص بلغتين — أو نص عادي لو نفس القيمة في الاتنين (زي التواريخ) */
export type LocalizedText = string | { ar: string; en: string };

export interface Listing {
  id: string;
  propertyType?: "room" | "studio" | "flat" | "other";
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
  /** مساحة الوحدة/الأوضة بالمتر المربع — null لو مش معروفة */
  areaSqm: number | null;
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

// البيانات دي متجمّعة من إعلانات OLX يوم 12 أغسطس 2026 — عدّل أي حاجة من الموقع نفسه
export const SEED_LISTINGS: Listing[] = 
[
  {
    id: "olx-196k0i",
    propertyType: "studio",
    title: {
      ar: "ستوديو ١٨م² مجدد — أوخوتا (متاح دلوقتي)",
      en: "Renovated 18m² studio — Ochota (available now)"
    },
    district: "Ochota",
    address: "ul. Szczęśliwicka 8, Ochota, Warszawa",
    url: "https://www.olx.pl/d/oferta/do-wynajecia-nowa-kawalera-studio-na-ochocie-od-zaraz-CID3-ID196K0i.html",
    rent: 2400,
    bills: 600,
    garageCost: null,
    areaSqm: 18,
    deposit: 2400,
    commuteMin: 16,
    availableFrom: "Available now",
    contact: {
      ar: "Marcin — OLX",
      en: "Marcin — OLX"
    },
    notes: {
      ar: "قريب من الشغل (~١٦ دقيقة). إيجار ٢٤٠٠ + إدارة ٦٠٠ = ٣٠٠٠. أسانسير، دور ٦/٧. متاح دلوقتي. الديبوزيت = شهر.\n❓ الفرن/الديش واشر مش واضحين.",
      en: "Close to work (~16 min). Rent 2400 + admin 600 = 3000. Elevator, floor 6/7. Available now. Deposit = 1 month.\n❓ Oven/dishwasher not clearly listed."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/13ko0zpbox023-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/bh396u17c70x1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/e24gv9sk9wsj-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/1pbcits16mq11-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/tsxlt8gtpyxw1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/7jn1tba39xxw1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/larvsi7flye33-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 1
  },
  {
    id: "olx-1bijzw",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٢٧م² بديش واشر — Kopalniana، بيموفو",
      en: "27m² studio with dishwasher — Kopalniana, Bemowo"
    },
    district: "Bemowo",
    address: "ul. Kopalniana 14, Bemowo, Warszawa",
    url: "https://www.olx.pl/d/oferta/studio-od-zaraz-ul-kopalniana-14-CID3-ID1bIjzw.html",
    rent: 2900,
    bills: 300,
    garageCost: 300,
    areaSqm: 27,
    deposit: 3200,
    commuteMin: 38,
    availableFrom: "Available now",
    contact: {
      ar: "Homeland Resi Two Sp. z o.o. — OLX",
      en: "Homeland Resi Two Sp. z o.o. — OLX"
    },
    notes: {
      ar: "متاح دلوقتي. ديش واشر + فرن + إندكشن. أسانسير، كمبوند مقفول. جراج اختياري ٣٠٠. مقدم مرافق ~٣٠٠. إيجار مباشر من غير كوميشن.",
      en: "Available now. Dishwasher + oven + induction. Elevator, gated estate. Optional garage 300. Bills advance ~300. Direct rental, no commission."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/8zp32gus3gbc-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/8lms1wk4nfh43-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/pg2e7lm0yuvb-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "no",
      spacious: "yes",
      garage: "no",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 2
  },
  {
    id: "olx-1bsnpa",
    propertyType: "studio",
    title: {
      ar: "ستوديو ~٢٠م² — Zwierzyniecka، موكوتوف (من ٣١ أغسطس)",
      en: "~20m² studio room — Zwierzyniecka, Mokotów (from Aug 31)"
    },
    district: "Mokotów",
    address: "ul. Zwierzyniecka, Mokotów, Warszawa",
    url: "https://www.olx.pl/d/oferta/kawalerka-wolna-od-31-08-mokotow-ul-zwierzyniecka-CID3-ID1bsNpa.html",
    rent: 2469,
    bills: 481,
    garageCost: null,
    areaSqm: 20,
    deposit: 2469,
    commuteMin: 32,
    availableFrom: "31/08/2026",
    contact: {
      ar: "Julia — OLX",
      en: "Julia — OLX"
    },
    notes: {
      ar: "واحدة من ٤ ستوديوهات بتقفل في شقة ٩٣م² مشتركة. من ٣١ أغسطس. ٢٤٦٩ + مرافق ٤٨١. أسانسير. من غير كوميشن.",
      en: "One of 4 lockable studios in a shared 93m² flat. From Aug 31. 2469 + utilities 481. Elevator. No commission. Owner-friendly."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/fya2p8ijavfj-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/4z0yd6wderw83-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/b9hz94oibr4c3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/d17jv9ajvvps1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/c89mcu8uidmg-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/af6pcjx2mp8w-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/56wa1gvkyvox-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/mrl1h0hqi1k93-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "no",
      desk: "unknown",
      modern: "unknown",
      elevator: "yes",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 3
  },
  {
    id: "olx-1bmcts",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٣٣م² بديش واشر — Nowe Włochy",
      en: "33m² studio with dishwasher — Nowe Włochy"
    },
    district: "Włochy",
    address: "ul. Pola Karolińskie, Ogrody Włochy, Warszawa",
    url: "https://www.olx.pl/d/oferta/do-wynajecia-kawalerka-nowe-wlochy-CID3-ID1bMCTs.html",
    rent: 3000,
    bills: 400,
    garageCost: null,
    areaSqm: 33,
    deposit: 3000,
    commuteMin: 20,
    availableFrom: "",
    contact: {
      ar: "Emilia — OLX",
      en: "Emilia — OLX"
    },
    notes: {
      ar: "ديش واشر + تلاجة + بوتاجاز كهربا. أسانسير وكمبوند مودرن. فيه ركنة (شارع/جراج). ميعاد الإتاحة مش واضح — اسأل.",
      en: "Dishwasher + fridge + electric hob. Elevator, modern estate. Parking mentioned (street/garage). Availability not clearly stated — ask."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/p7bzwx7hvphj-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/me5u6y3l2bug1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/xli1ew1x27v23-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/isv63mix8gvt-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/wo6rboaklang3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/e0uklpf75ly52-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/colk9emk2676-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/9l9mql57v6es1-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "yes",
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 4
  },
  {
    id: "olx-1bgjac",
    propertyType: "studio",
    title: {
      ar: "ستوديو جديد ٢٢م² جنب SKM/Blue City — Jutrzenki، ووخي",
      en: "New 22m² studio near SKM/Blue City — Jutrzenki, Włochy"
    },
    district: "Włochy",
    address: "ul. Jutrzenki 182, Włochy, Warszawa",
    url: "https://www.olx.pl/d/oferta/eng-skm-blue-city-bezposrednio-nowa-kawalerka-od-juz-tv-piekarnik-zmywarka-wlochy-CID3-ID1bGJaC.html",
    rent: 2800,
    bills: 350,
    garageCost: null,
    areaSqm: 22,
    deposit: 3500,
    commuteMin: 17,
    availableFrom: "Available now",
    contact: {
      ar: "Konrad — OLX",
      en: "Konrad — OLX"
    },
    notes: {
      ar: "متاح دلوقتي (أول مستأجر). ديش واشر + فرن. سرير كنبة ركنة (مش سرير حقيقي). أسانسير وحراسة. ديبوزيت ٣٥٠٠. جراج تحت الأرض اختياري. من المالك مباشرة.",
      en: "Available now (first rental). Dishwasher + oven. Corner sofa bed (no real bed). Elevator, security. Deposit 3500. Optional underground garage. Direct owner."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/m2yt6gvaln133-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/fldcmqz8wgv43-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/xhl0169qrvqt1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/gkmkasmttdcz-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/4x0nkn9yt5kr2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/7t7mcjt8k6ak2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/nwyn15wm8fwj2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/bj0qcqjd34573-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 5
  },
  {
    id: "olx-19bgdx",
    propertyType: "studio",
    title: {
      ar: "ستوديو ١٨م² ببلكونة جنب Westfield — Wołoska، Mokotów",
      en: "18m² studio with balcony near Westfield — Wołoska, Mokotów"
    },
    district: "Mokotów",
    address: "ul. Wołoska 3, Mokotów, Warszawa",
    url: "https://www.olx.pl/d/oferta/do-wynajecia-kawalerka-studio-z-balkonem-obok-westfield-mokotow-ul-woloska-CID3-ID19BGdx.html",
    rent: 2600,
    bills: 750,
    garageCost: null,
    areaSqm: 18,
    deposit: 3350,
    commuteMin: 28,
    availableFrom: "Available now",
    contact: {
      ar: "Marcin — OLX",
      en: "Marcin — OLX"
    },
    notes: {
      ar: "متاح دلوقتي. إيجار ٢٦٠٠ + إدارة ٧٥٠ (إنترنت وTV). بلكونة، أسانسير، دور ٥. مفروش: كنبة سرير، مكتب، كرسي، غسالة. من غير حيوانات. عقد ١٢ شهر.\n❓ مفيش فرن/ديش واشر مذكور (بوتاجاز فقط).\n❓ نوع العقد مش مذكور (occasional؟).",
      en: "Available now. Rent 2600 + admin 750 (incl. internet & TV). Balcony, elevator, floor 5. Furnished: sofa bed, desk, chair, washer. No pets. 12-month lease.\n❓ No oven/dishwasher listed (cooktop only).\n❓ Contract type not stated (occasional lease?)."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/ogzg8j0db5d2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/r7szresh3mnp-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/iqlnaozeffg21-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/4nxfput9j13i1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/nzmpd5wwxwzk1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/vmpty297nyo73-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "no",
      dishwasher: "unknown",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 6
  },
  {
    id: "olx-1bck0m",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٣٠م² مريح — Bobrowiecka، Mokotów (من غير كوميشن)",
      en: "Comfortable 30m² studio — Bobrowiecka, Mokotów (no commission)"
    },
    district: "Mokotów",
    address: "ul. Bobrowiecka 10, Mokotów, Warszawa",
    url: "https://www.olx.pl/d/oferta/komfortowa-kawalerka-internet-i-tv-w-cenie-ul-bobrowiecka-10-mokotow-brak-prowizji-CID3-ID1bCK0m.html",
    rent: 2270,
    bills: 870,
    garageCost: null,
    areaSqm: 30,
    deposit: null,
    commuteMin: 32,
    availableFrom: {
      ar: "اسأل المعلن",
      en: "Ask landlord"
    },
    contact: {
      ar: "Paweł — OLX",
      en: "Paweł — OLX"
    },
    notes: {
      ar: "من غير كوميشن ✅. إيجار ٢٢٧٠ + إدارة ٧٥٠ + طاقة ١٢٠ ≈ ٣١٤٠ لشخص واحد. إنترنت وTV ضمن السعر. صالة + جزء نوم + مطبخ + حمام. وكالة.\n❓ تاريخ التوافر مش واضح.\n❓ فرن/ديش واشر/سرير مش مذكورين صراحة.\n✅ مفيش ذكر لـ occasional lease.",
      en: "No commission ✅. Rent 2270 + admin 750 + energy 120 ≈ 3140 for 1 person. Internet & TV included. Living + sleeping area + kitchen + bath. Agency listing.\n❓ Availability date unclear.\n❓ Oven/dishwasher/bed not clearly stated.\n✅ No occasional lease mentioned."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/kquc3f48hhtw-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/wsu1y4mbv96k2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/2ns8ef5b4dr91-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/4wfuassla7sx1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/l5ofioe4vkm13-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/y8uwehg6jh0f2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/0hc1yqnsuwxn3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/q5p36n5m2zg72-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
      bed: "unknown",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "yes"
    },
    createdAt: 7
  },
  {
    id: "olx-1bwqsd",
    propertyType: "studio",
    title: {
      ar: "ستوديو مودرن ١٨م² جنب الشغل — Łopuszańska 36a",
      en: "Modern 18m² studio next to work — Łopuszańska 36a"
    },
    district: "Włochy",
    address: "ul. Łopuszańska 36a, Włochy, Warszawa",
    url: "https://www.olx.pl/d/oferta/studio-nowoczesne-lopuszanska-36a-bezposrednio-juz-CID3-ID1bwqSd.html",
    rent: 2699,
    bills: 300,
    garageCost: null,
    areaSqm: 18,
    deposit: 2699,
    commuteMin: 10,
    availableFrom: "07/2026",
    contact: {
      ar: "Izabela — OLX",
      en: "Izabela — OLX"
    },
    notes: {
      ar: "قريب جدًا من الشغل وWKD Raków (~١٠ دقايق) ✅. ديش واشر + بوتاجاز حثي + ميكروويف. كنبة زاوية (مفيش سرير حقيقي). طاولة وكراسي للشغل. من غير كوميشن، مباشر. متاح من يوليو. عقد ٦ شهور (najem prywatny).\n✅ ديش واشر مذكور.\n✅ إيجار خاص — مش occasional.",
      en: "Very close to work & WKD Raków (~10 min) ✅. Dishwasher + induction + microwave. Corner sofa bed (no real bed). Table & chairs for work. Direct, no commission. From July. Min 6-month private lease.\n✅ Dishwasher listed.\n✅ Private lease — not occasional."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/hc0k84rfwgmh3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/iknw5c02eu54-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/1eoju1k03o8e2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/wrla78dfl5lq2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/34xowepz7jwr3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/s5jqg7mazomf3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/isdcm3dl9m702-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/atxycndu2ow91-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "yes",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "yes"
    },
    createdAt: 8
  },
  {
    id: "olx-1bce4c",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٢٤م² لشخص واحد — Aleja Krakowska 291",
      en: "24m² studio for 1 person — Aleja Krakowska 291"
    },
    district: "Włochy",
    address: "Aleja Krakowska 291, Włochy, Warszawa",
    url: "https://www.olx.pl/d/oferta/kawalerka-dla-1-osoby-aleja-krakowska-291-CID3-ID1bce4c.html",
    rent: 2600,
    bills: 600,
    garageCost: null,
    areaSqm: 24,
    deposit: null,
    commuteMin: 16,
    availableFrom: "07/2026",
    contact: {
      ar: "Ewa — OLX",
      en: "Ewa — OLX"
    },
    notes: {
      ar: "عمارة جديدة، دور ١، أسانسير. إيجار ٢٦٠٠ + إدارة ٦٠٠. جراج بفلوس زيادة. حيوانات مسموحة. متاح من يوليو (للتفاوض).\n❓ فرن/ديش واشر/مكتب/سرير مش مذكورين.\n❓ نوع العقد مش مذكور.",
      en: "New building, floor 1, elevator. Rent 2600 + admin 600. Garage for extra fee. Pets OK. Available from July (negotiable).\n❓ Oven/dishwasher/desk/bed not listed.\n❓ Contract type not stated."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/3625qc8u78vr-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/tlteb9cq22e12-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/gag5jlsyv0ye3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/nc5ew1fnb86b2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/yggd4lqfzz4b-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/mq68rcvnmer8-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/zrgj3s1qv1i01-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/d2je8brjwor1-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
      bed: "unknown",
      spacious: "yes",
      garage: "no",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 9
  },
  {
    id: "olx-1bjojz",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٢٧م² بجراج وخلية وبلكونة — Jana Kazimierza، Wola",
      en: "27m² studio with garage, storage & balcony — Jana Kazimierza, Wola"
    },
    district: "Wola",
    address: "ul. Jana Kazimierza 49, Wola, Warszawa",
    url: "https://www.olx.pl/d/oferta/nowoczesna-kawalerka-27-m-wola-jana-kazimierza-49-garaz-komorka-balkon-CID3-ID1bJoJZ.html",
    rent: 2800,
    bills: 600,
    garageCost: 0,
    areaSqm: 27,
    deposit: 3400,
    commuteMin: 38,
    availableFrom: "Available now",
    contact: {
      ar: "Monika — OLX",
      en: "Monika — OLX"
    },
    notes: {
      ar: "متاح دلوقتي. إيجار ٢٨٠٠ + إدارة ٦٠٠ (+ كهربا). جراج تحت الأرض + خلية ضمن السعر ✅. ديش واشر + فرن + بوتاجاز. بلكونة، أسانسير، دور ١.\n⚠️ إيجار مؤقت (najem okazjonalny).",
      en: "Available now. Rent 2800 + admin 600 (+ electricity). Underground garage + storage included ✅. Dishwasher + oven + induction. Balcony, elevator, floor 1.\n⚠️ Occasional lease (najem okazjonalny)."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/ibkv2pgnyhwa3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/82jbkejei60m-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/bsvb8ge4ltsm-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ilcnxdxn46gf1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/s7kpshtxbvl73-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/sknvjebz0ons3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/9fv0xerkey5n3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/h5axrfo51d3r3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "unknown",
      spacious: "yes",
      garage: "yes",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "no"
    },
    createdAt: 10
  },
  {
    id: "olx-1boiie",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٢٧م² بحديقة ٩٧م² — Urbino / Raków، Włochy",
      en: "27m² studio with 97m² garden — Urbino / Raków, Włochy"
    },
    district: "Włochy",
    address: "ul. Równoległa, Urbino, Raków, Włochy, Warszawa",
    url: "https://www.olx.pl/d/oferta/studio-wraz-z-97m2-ogrodkiem-na-strzezonym-osiedlu-wlochy-rakow-CID3-ID1bOiIE.html",
    rent: 2900,
    bills: 450,
    garageCost: null,
    areaSqm: 27,
    deposit: 3500,
    commuteMin: 12,
    availableFrom: "17/08/2026",
    contact: {
      ar: "Maciej — OLX",
      en: "Maciej — OLX"
    },
    notes: {
      ar: "من ١٧ أغسطس. إيجار ٢٩٠٠ (قابل للتفاوض) + إدارة ~٤٥٠ (+ كهربا؛ إنترنت منفصل). حديقة خاصة ٩٧م² + تراس مسقوف. ديش واشر + فرن + سرير حقيقي ✅. مجمع محروس (Urbino 2025). جراج اختياري بفلوس.\n✅ ديش واشر وفرن مذكورين.\n❓ نوع العقد مش مذكور.",
      en: "From Aug 17. Rent 2900 (negotiable) + admin ~450 (+ electricity; internet separate). Private 97m² garden + covered terrace. Dishwasher + oven + real bed ✅. Gated Urbino estate (2025). Optional paid garage.\n✅ Dishwasher & oven listed.\n❓ Contract type not stated."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/z1gjexu2fnw71-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/czotrjmrvb213-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/pw9tr0ozqvlm3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/z3ltsz37v1e5-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/2uv3oblsz21o3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/9b9koxc6hkeg1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/3e9kctizkwna-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "yes",
      spacious: "yes",
      garage: "no",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 11
  }
];
