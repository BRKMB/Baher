export type CriterionValue = "yes" | "no" | "unknown";

export interface Listing {
  id: string;
  title: string;
  district: string;
  address: string;
  url: string;
  /** الإيجار الشهري بالزلوتي */
  rent: number;
  /** المصاريف الشهرية (فواتير/إدارة) — null لو مش معروفة */
  bills: number | null;
  /** الديبوزيت — null لو مش معروف */
  deposit: number | null;
  /** تقدير وقت المواصلات للشغل بالدقايق (Lionbridge, Łopuszańska 95) */
  commuteMin: number | null;
  availableFrom: string;
  contact: string;
  notes: string;
  criteria: Record<string, CriterionValue>;
  /** ترتيب الإضافة عشان الثبات */
  createdAt: number;
}

// البيانات دي متجمّعة من إعلانات OLX يوم 23 يوليو 2026 — عدّل أي حاجة من الموقع نفسه
export const SEED_LISTINGS: Listing[] = [
  {
    id: "ochota-korotynskiego",
    title: "أوضة في شقة 3 أوض — أوچوتا القديمة (بتكييف)",
    district: "Ochota",
    address: "ul. Korotyńskiego 42, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoje-w-3-osobowym-mieszkaniu-dla-studentow-stara-ochota-korotynskiego-klima-CID3-ID1bkBes.html",
    rent: 1600,
    bills: 450,
    deposit: 2000,
    commuteMin: 25,
    availableFrom: "متاحة دلوقتي",
    contact: "Igor — شات OLX",
    notes:
      "الأوضة المتاحة 13م² (في أوضة أكبر بـ1800 بس من أكتوبر). تكييف في كل أوضة + غسالة أطباق + إير فراير. الإعلان موجّه للطلبة وعقد سنة على الأقل — اسأل لو بيقبلوا موظفين. من أقرب الأماكن للشغل.",
    criteria: {
      oven: "yes",
      bed: "unknown",
      spacious: "no",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 1
  },
  {
    id: "wola-redutowa",
    title: "أوضة كبيرة ببلكونة — ڤولا، مترو Księcia Janusza",
    district: "Wola",
    address: "ul. Redutowa 52, Warszawa",
    url: "https://www.olx.pl/d/oferta/duzy-pokoj-z-balkonem-wola-metro-ksiecia-janusza-wolny-od-01-08-2026-CID3-ID1bq7tt.html",
    rent: 1800,
    bills: 350,
    deposit: 2150,
    commuteMin: 35,
    availableFrom: "01/08/2026",
    contact: "Aleksander — واتساب ‎+41 779 703 705",
    notes:
      "⚠️ الإعلان بيقول \"يفضَّل بنات\" — اتأكد الأول إن مفيش مشكلة. عمارة جديدة في كمبوند مقفول، سرير كبير مريح ومكتب. 6 دقايق مشي للمترو. عقد سنة على الأقل.",
    criteria: {
      oven: "unknown",
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
    title: "أوضة كبيرة جدًا ببلكونة — پراجا الشمالية، مترو Wileńska",
    district: "Praga-Północ",
    address: "Praga-Północ (قرب Galeria Wileńska), Warszawa",
    url: "https://www.olx.pl/d/oferta/bardzo-duzy-pokoj-z-balkonem-praga-polnoc-metro-wilenska-CID3-ID1bwsVX.html",
    rent: 1790,
    bills: 300,
    deposit: 2090,
    commuteMin: 50,
    availableFrom: "01/08/2026",
    contact: "Wojciech — واتساب 695 266 951",
    notes:
      "⚠️ بيدوروا على بنت 18-30 سنة — غالبًا مش هتنفع. أوضة 17م² + بلكونة 4م²، سرير 130سم بمرتبة عالية الجودة، مكتب 120سم بكرسي جلد. الشقة 5 أوض (6 سكان). السعر شامل كل حاجة + تنضيف أسبوعي.",
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
    title: "أوضة 18م² ببلكونة — أورسينوف، مترو Imielin على 200 متر",
    district: "Ursynów",
    address: "ul. Hawajska 2, Warszawa",
    url: "https://www.olx.pl/d/oferta/ursynow-pokoj-dla-jednej-lub-dwoch-osob-18m2-balkon-metro-200m-CID3-ID1bdXM4.html",
    rent: 1600,
    bills: 400,
    deposit: 2000,
    commuteMin: 50,
    availableFrom: "15/09/2026 ⚠️",
    contact: "Roman — شات OLX",
    notes:
      "⚠️ مش متاحة غير من 15 سبتمبر — مش مناسبة لو محتاج أول أغسطس. أوضة 18م² بسرير عرض 160سم وبلكونة. الشقة 4 أوض (4-5 سكان). دقيقتين مشي للمترو.",
    criteria: {
      oven: "unknown",
      bed: "yes",
      spacious: "yes",
      garage: "unknown",
      max3: "no",
      desk: "unknown",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes"
    },
    createdAt: 4
  },
  {
    id: "ursynow-warchalowskiego",
    title: "أوضة فردية هادية — أورسينوف، مترو Imielin (الأرخص)",
    district: "Ursynów",
    address: "ul. Warchałowskiego 3, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-1-os-blisko-metro-imielin-zielen-wi-fi-ul-warchalowskiego-3-CID3-ID1btZbt.html",
    rent: 1250,
    bills: 300,
    deposit: 1500,
    commuteMin: 50,
    availableFrom: "متاحة دلوقتي",
    contact: "Marek — شات OLX",
    notes:
      "أرخص واحدة (1550 إجمالي). شقة متجددة بتصميم مصممة ديكور، كل الأثاث جديد، الأوض بتتقفل بمفتاح، ومفيش صاحب البيت ساكن معاك. الفرن مش مذكور في الإعلان (فيه ميكروويف). فيه بدروم لتخزين العجلة/الشنط. العقد لحد 15/09/2027.",
    criteria: {
      oven: "unknown",
      bed: "unknown",
      spacious: "yes",
      garage: "unknown",
      max3: "unknown",
      desk: "unknown",
      modern: "yes",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 5
  },
  {
    id: "praga-szwedzka",
    title: "أوضة واسعة في شقة أوضتين بس — 3 دقايق من مترو Szwedzka",
    district: "Praga-Północ",
    address: "قرب مترو Szwedzka (M2), Warszawa",
    url: "https://www.olx.pl/d/oferta/przestronny-pokoj-w-2-pokojowym-mieszkaniu-3-min-od-metra-szwedzka-m2-CID3-ID1bxCuc.html",
    rent: 1750,
    bills: 75,
    deposit: null,
    commuteMin: 50,
    availableFrom: "02/08/2026",
    contact: "Maksymilian — شات OLX",
    notes:
      "هتسكن مع شخص واحد بس (اللي معلن) — أهدى اختيار. السعر شامل الإدارة والمية والتدفئة والنت، وبتدفع بس كهربا وغاز (~150 زلوتي كل شهرين). فيها فرن وبوتاجاز غاز وغسالة أطباق. متاحة من 2 أغسطس (يوم واحد فرق).",
    criteria: {
      oven: "yes",
      bed: "yes",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 6
  },
  {
    id: "praga-poludnie-tatarkiewicza",
    title: "أوضة مريحة — پراجا الجنوبية، 20 دقيقة للسنتر",
    district: "Praga-Południe",
    address: "ul. Tatarkiewicza 10, Warszawa",
    url: "https://www.olx.pl/d/oferta/komfortowy-pokoj-praga-poludnie-20min-do-centrum-CID3-ID1bxh6O.html",
    rent: 1590,
    bills: 300,
    deposit: 1890,
    commuteMin: 55,
    availableFrom: "01/08/2026",
    contact: "Wojciech — واتساب 695 266 951",
    notes:
      "⚠️ نفس شبكة sPokój — بيدوروا على بنت 18-30 سنة، غالبًا مش هتنفع. الأوضة 10م² بس (صغيرة). سرير 130سم بمرتبة كويسة ومكتب 120سم. الشقة 5 أوض و3 حمامات. السعر شامل كل حاجة.",
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
    title: "أوضة حلوة — أورسينوف، جنب مترو Ursynów",
    district: "Ursynów",
    address: "ul. Puszczyka, Warszawa",
    url: "https://www.olx.pl/d/oferta/puszczyka-bardzo-ladny-pokoj-ursynow-obok-metra-ursynow-ul-puszczyka-CID3-ID18oGA6.html",
    rent: 1400,
    bills: null,
    deposit: null,
    commuteMin: 45,
    availableFrom: "متاحة دلوقتي",
    contact: "mmm — شات OLX",
    notes:
      "⚠️ إعلان من شركة (Firmowe) — اسأل لو فيه كوميشن! السعر قابل للتفاوض والمصاريف مش مذكورة. شقة بعد تجديد كامل: مطبخ وحمام جدد + فرن. فيه أماكن ركنة جنب العمارة. 5 دقايق مشي للمترو.",
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
    title: "أوضة فردية 15م² — الموردور، شارع Komputerowa",
    district: "Mokotów (Służewiec)",
    address: "ul. Komputerowa 7a, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-jednosobowy-mordor-ul-komputerowa-CID3-ID1bxPNp.html",
    rent: 1900,
    bills: 300,
    deposit: 1900,
    commuteMin: 25,
    availableFrom: "01/08/2026",
    contact: "Michał — شات OLX",
    notes:
      "⚠️ مفيش سرير حقيقي — كنبة ركنة بتتفرش (narożnik). أوضة 15م² في شقة 66م² لـ3 أشخاص بس. فرن + إندكشن + غسالة أطباق + تلاجة كبيرة بكوستكارة. قريبة جدًا من الشغل. السعر قابل للتفاوض، عقد سنة.",
    criteria: {
      oven: "yes",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 9
  }
];
