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

// البيانات دي متجمّعة من إعلانات OLX يوم 10 أغسطس 2026 — عدّل أي حاجة من الموقع نفسه
export const SEED_LISTINGS: Listing[] = 
[
  {
    id: "olx-1bdlos",
    propertyType: "studio",
    title: {
      ar: "ستوديو مودرن ٢٨م² بتراس كبير — Wiktoryn، ووخي",
      en: "Modern 28m² studio with large terrace — Wiktoryn, Włochy"
    },
    district: "Włochy",
    address: "ul. Wiktoryn 6, Warszawa",
    url: "https://www.olx.pl/d/oferta/nowoczesna-kawalerka-z-duzym-tarasem-28-m-wiktoryn-6-1-pietro-w-pelni-wyposazona-CID3-ID1bDLOs.html",
    rent: 2700,
    bills: 860,
    garageCost: null,
    areaSqm: 28,
    deposit: 3550,
    commuteMin: 18,
    availableFrom: "01/09/2026",
    contact: {
      ar: "Jan — OLX",
      en: "Jan — OLX"
    },
    notes: {
      ar: "عمارة جديدة، أسقف ٣٫٢٠م، أسانسير، إدارة ٦٦٠ + كهربا ~٢٠٠. من ١ سبتمبر. حيوانات مسموحة. مفيش ركنة مجانية.\n❓ الديش واشر مش مذكور.",
      en: "New building, 3.20m ceilings, elevator, admin fee 660 + electricity ~200. Available from Sept 1. Pets OK. No free parking.\n❓ Dishwasher not mentioned."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/3xr4uckaaefj1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/lm17suobaiz33-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/m2ltl9kb091r1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/v4b2dh5t0tck-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/r5qe4gyo7p3i3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/qlgbdluihlyz1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/b681yj2yuyl11-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/5nq4knob67y73-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      bed: "unknown",
      spacious: "yes",
      garage: "no",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 1
  },
  {
    id: "olx-196k0i",
    propertyType: "studio",
    title: {
      ar: "ستوديو ١٨م² مجدد — أوخوتا (متاح دلوقتي)",
      en: "Renovated 18m² studio — Ochota (available now)"
    },
    district: "Ochota",
    address: "ul. Szczęśliwicka area, Ochota, Warszawa",
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
      oven: "unknown",
      dishwasher: "unknown",
      bed: "unknown",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 2
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
    createdAt: 3
  },
  {
    id: "olx-1az2r1",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٣٢م² ببلكونة — Bemowo Jelonki",
      en: "32m² studio with balcony — Bemowo Jelonki"
    },
    district: "Bemowo",
    address: "Bemowo Jelonki (near S8), Warszawa",
    url: "https://www.olx.pl/d/oferta/mieszkanie-kawalerka-z-balkonem-bemowo-jelonki-trasa-s8-metro-32m2-okazja-CID3-ID1aZ2r1.html",
    rent: 2800,
    bills: 600,
    garageCost: null,
    areaSqm: 32,
    deposit: 5000,
    commuteMin: 36,
    availableFrom: "01/08/2026",
    contact: {
      ar: "Karolina — OLX",
      en: "Karolina — OLX"
    },
    notes: {
      ar: "⚠️ طالب عقد occasional (عند نوتر). متاح ١ أغسطس. ٢٨٠٠ + عدادات ~٦٠٠. ديبوزيت ٥٠٠٠. أسانسير. ممنوع حيوانات. من المالك مباشرة.",
      en: "⚠️ Requires occasional lease (notary). Available Aug 1. 2800 + meter fees ~600. Deposit 5000. Elevator. No pets. Private owner."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/h0in6k4m86xk1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/4w22in4nv8dd3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ciwyteuhcehd1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/kqy85f8axrtx-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/sc8q7137hqgj3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/8xgjh1sybviw1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/v547wy4xj1e62-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/94jyaexe4ogo1-PL/image;s=1200x900"
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
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "no"
    },
    createdAt: 4
  },
  {
    id: "olx-1bmfeu",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٢٦م² — Bliska Wola (Vis a Vis)",
      en: "26m² studio — Bliska Wola (Vis a Vis)"
    },
    district: "Wola",
    address: "os. Vis a Vis (Prymasa Tysiąclecia / Kasprzaka), Wola, Warszawa",
    url: "https://www.olx.pl/d/oferta/kawalerka-do-wynajecia-bliska-wola-CID3-ID1bMfEu.html",
    rent: 2900,
    bills: 700,
    garageCost: null,
    areaSqm: 26,
    deposit: 3500,
    commuteMin: 26,
    availableFrom: "01/09/2026",
    contact: {
      ar: "Mariusz — OLX",
      en: "Mariusz — OLX"
    },
    notes: {
      ar: "⚠️ طالب عقد occasional. متاح ١ سبتمبر. ٢٩٠٠ + إدارة ٦٠٠ + كهربا ~١٠٠. أسانسير ومجهز. ممنوع حيوانات.",
      en: "⚠️ Requires occasional lease. Available Sept 1. 2900 + admin 600 + electricity ~100. Elevator, fully equipped. No pets."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/4yxpicjr862f-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/v4lhhn3qw4wm1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/elsbk26gowpi-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/uxwgf1q6029t1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/o5tcq19g856b3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/rzsck5lxc33t3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/905gtv6kuuuv3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ydtpqt9spqjw-PL/image;s=1200x900"
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
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "no"
    },
    createdAt: 5
  },
  {
    id: "olx-1bgbgv",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٢٧م² مفروش ببلكونة — وولا",
      en: "27m² furnished studio with balcony — Wola"
    },
    district: "Wola",
    address: "Wola, Warszawa",
    url: "https://www.olx.pl/d/oferta/wynajme-kawalerke-wola-warszawa-CID3-ID1bGBgv.html",
    rent: 2800,
    bills: 700,
    garageCost: null,
    areaSqm: 27,
    deposit: 2800,
    commuteMin: 28,
    availableFrom: "01/09/2026",
    contact: {
      ar: "Waldemar — OLX",
      en: "Waldemar — OLX"
    },
    notes: {
      ar: "متاح ١ سبتمبر. فرن + إندكشن. أسانسير وحراسة وركنة تابعة. إدارة ٧٠٠. ديبوزيت ٢٨٠٠. حد أدنى سنة. ممنوع حيوانات.",
      en: "Available Sept 1. Oven + induction. Elevator, security, parking included. Admin fee 700. Deposit 2800. Min 1 year. No pets."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/uq20rgsvqzgc-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/1xgsc42d1qag2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/nmhw1y1t88j71-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/u8i2x36gj2b93-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/v9pvsx6x3qbs-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/36645y78va5e3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/trevx1o2eujr-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/rn6ti9xbfc1-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      bed: "unknown",
      spacious: "yes",
      garage: "yes",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 6
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
      oven: "unknown",
      dishwasher: "unknown",
      bed: "unknown",
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
    createdAt: 7
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
      oven: "unknown",
      dishwasher: "yes",
      bed: "unknown",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 8
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
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 9
  }
];
