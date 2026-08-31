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
  /** تقدير المصاريف الإضافية الشهرية (كهربا/موية/تدفئة مش جوه الإدارة) لشخص واحد */
  extrasEst: number | null;
  /** شرح مختصر لتقدير الإضافي */
  extrasNote: LocalizedText;
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

// البيانات دي متجمّعة من إعلانات Otodom/OLX — elevator من حقل المنصة مش الوصف
export const SEED_LISTINGS: Listing[] = 
[
  {
    id: "oto-4cmsc",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٣٠.٦م² جنب المترو — Jana Pawła II / Wola",
      en: "30.6m² studio near metro — Jana Pawła II / Wola"
    },
    district: "Wola",
    address: "Al. Jana Pawła II / Słomińskiego, Wola, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/od-zaraz-do-wynajecia-wola-centrum-metro-tramwaj-ID4CMsc",
    rent: 2300,
    bills: 850,
    garageCost: null,
    extrasEst: 300,
    extrasNote: {
      ar: "تقريبي لشخص واحد:\n💧 مقدم مرافق ~٣٠٠ (حسب الإعلان) + تسوية حسب الاستهلاك.\nالإدارة ٨٥٠ منفصلة. وكالة PROSPER HOUSE — اسأل عن عمولة.",
      en: "Solo estimate:\n💧 Media advance ~300 (per ad) + settlement by usage.\nAdmin 850 separate. PROSPER HOUSE agency — ask about commission."
    },
    areaSqm: 31,
    deposit: 2300,
    commuteMin: 34,
    availableFrom: "Available now",
    contact: {
      ar: "PROSPER HOUSE — Otodom",
      en: "PROSPER HOUSE — Otodom"
    },
    notes: {
      ar: "وكالة PROSPER HOUSE (مش وكالة الـ ٤٠٠ النصابة، بس اسأل عن العمولة).\n✅ أسانسير دور ٨، مجمع محروس، مترو Dworzec Gdański / Rondo Radosława، جنب Arkadia. كنبة. من غير بلكونة.\n💰 ٢٣٠٠ + إدارة ~٨٥٠ + مقدم مرافق ٣٠٠ (+ تسوية).\n❓ فرن/ديش واشر مش مذكورين صراحة.",
      en: "PROSPER HOUSE agency (not the 400zł scam agency, but ask about commission).\n✅ Elevator floor 8, gated, metro Dworzec Gdański / Rondo Radosława, near Arkadia. Sofa. No balcony.\n💰 2300 + admin ~850 + media advance 300 (+ settlement).\n❓ Oven/dishwasher not clearly listed."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImJpbGMzanFlNXMxeDItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.O6ZNXEECtqQRXBm8J_Ff54PXbC3VRgirlcoweD2-peY/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InduZ2N0d2h3aGxuODMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.ldFabqB_vjGKIEW15x3TEFyMRZJHzSHOYQ_2KEnskOY/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Im44aHhzbzltdnpxNDMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.8pSzd1UO9JQyqz8PwRnLm7b0ce9l8WziYLD0VneImyE/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjVsb2J2eGxwNWpncjItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.B_VP8oil23ey0A8qJO8LmqSGC4lJuOshEbIZHm58zxU/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjA1NmNpYjI0OWhlZi1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.PyjkPVf8Kw1X7sXcZ8CK1RotI-ZRaCiFGzPX7QTyAvE/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Im9hcG8zc2V0b2owZjEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.k5soxU4qfV4DeOBoSbXP-N1FXfZjqYa-EVQ0rikHQ-0/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjZjZ2U1c3oxOWdleDEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.LK7pQeLRUYuWqarlE-GzJEAuXqoiy5YLjdHLs1PR-cg/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjV6aGs5OWx5b3ZwNjEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.I1j24sGl-XzLJ241tF8cDeMwFgEwXO6QwS9U1BeG8WI/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Im04MGtqbnQwYjhvdTMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0._WVan0R78dUMLTV-ucEMAN8YXziOD0v1Y9JdCvxFqRk/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjNhNmExYmszNW9vby1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.tj7qrV6a5wHRqy75AWRGhEXzFQDWjJgzofM9BpgQO0Q/image;s=2048x1536;q=80"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "unknown",
      noOccasional: "unknown",
      ac: "unknown"
    },
    createdAt: 1
  },
  {
    id: "olx-1c1p67",
    propertyType: "flat",
    title: {
      ar: "شقة ٢ أوضة ٣٧م² جنب المترو — Rozpylacza، Wola",
      en: "2-room 37m² flat near metro — Rozpylacza, Wola"
    },
    district: "Wola",
    address: "ul. Antka Rozpylacza, Wola, Warszawa",
    url: "https://www.olx.pl/d/oferta/mieszkanie-2-pokojowe-na-woli-blisko-metra-37-m-CID3-ID1c1p67.html",
    rent: 2000,
    bills: 700,
    garageCost: 0,
    extrasEst: 200,
    extrasNote: {
      ar: "تقريبي لشخص واحد:\n📺 مقدم مرافق ~٢٠٠ (TV/إنترنت/موية/كهربا/غاز) حسب الإعلان.\nالإدارة ٧٠٠ منفصلة. الإجمالي المعلن ~٢٩٠٠.",
      en: "Solo estimate:\n📺 Media advance ~200 (TV/internet/water/power/gas) per ad.\nAdmin 700 separate. Ad total ~2900."
    },
    areaSqm: 37,
    deposit: null,
    commuteMin: 35,
    availableFrom: "Available now",
    contact: {
      ar: "Kamil — OLX",
      en: "Kamil — OLX"
    },
    notes: {
      ar: "✅ مباشر من المالك. مطبخ منفصل، سرير مزدوج، بلكونة، قبو، ديش واشر+فرن. باركنج شارع مجاني.\n💰 ٢٠٠٠ + إدارة ٧٠٠ + مرافق ~٢٠٠ ≈ ٢٩٠٠.\nالإعلان بيقول وسطاء ممكن يتعاونوا — بس العرض من المالك.",
      en: "✅ Direct from owner. Separate kitchen, double bed, balcony, cellar, dishwasher+oven. Free street parking.\n💰 2000 + admin 700 + media ~200 ≈ 2900.\nAd allows agent cooperation — listing is from owner."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/r0hotfscqbpk-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/5wcssnxsr7i33-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/m5qje0jv3o9r-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/0bseewuprdjd3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/onc81aun5p3y2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/mkgl4gh6ouwo2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/uv630gewb312-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/lhqpykfw0aq-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "yes",
      spacious: "yes",
      garage: "yes",
      max3: "yes",
      desk: "unknown",
      modern: "no",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown",
      ac: "unknown"
    },
    createdAt: 2
  },
  {
    id: "olx-1c0nae",
    propertyType: "flat",
    title: {
      ar: "شقة ٤١م² تكييف — Elektoralna، Śródmieście",
      en: "Spacious 41m² with AC — Elektoralna, Śródmieście"
    },
    district: "Śródmieście",
    address: "ul. Elektoralna, Śródmieście, Warszawa",
    url: "https://www.olx.pl/d/oferta/przestronne-mieszkanie-41-m-elektoralna-bezposrednio-od-wlasciciela-CID3-ID1c0nAE.html",
    rent: 2000,
    bills: 900,
    garageCost: null,
    extrasEst: 225,
    extrasNote: {
      ar: "تقريبي لشخص واحد:\n🌐 إنترنت ٧٥ + ⚡💧 كهربا/موية حسب العداد ~١٥٠ = ~٢٢٥.\nالإدارة/تشغيل ٨٠٠–٩٠٠ (اخدنا ٩٠٠). تكييف هيزوّد كهربا الصيف.",
      en: "Solo estimate:\n🌐 Internet 75 + ⚡💧 electricity/water by meter ~150 = ~225.\nAdmin/ops 800–900 (using 900). AC will bump summer electricity."
    },
    areaSqm: 41,
    deposit: null,
    commuteMin: 30,
    availableFrom: {
      ar: "اسأل المعلن",
      en: "Ask landlord"
    },
    contact: {
      ar: "Michał — OLX",
      en: "Michał — OLX"
    },
    notes: {
      ar: "✅ مباشر من المالك. ✅ تكييف في الأوضة والمطبخ. مطبخ كبير ١٣م² ببلكونة، ديش واشر+فرن، كنبة بمرتبة طبية، دور ٤، بوابة.\n💰 ٢٠٠٠ + تشغيل ٨٠٠–٩٠٠ + نت ٧٥ + كهربا/موية عدّاد.\nعقد ١٢ شهر.",
      en: "✅ Direct from owner. ✅ AC in room and kitchen. Big 13m² kitchen with balcony, dishwasher+oven, orthopedic sofa bed, floor 4, doorman.\n💰 2000 + ops 800–900 + net 75 + elec/water meters.\n12-month lease."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/z0v33scbem7s2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/8e077w08to791-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/oo384lpraq9e-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/3klt7z1cst023-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/bcvxzpax8xge-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/o2d07cfv5rmz1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/y327q669l1d43-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/puz4hv6yeyr61-PL/image;s=1200x900"
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
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown",
      ac: "yes"
    },
    createdAt: 3
  },
  {
    id: "olx-1ab49t",
    propertyType: "studio",
    title: {
      ar: "ستوديو مجدد — Al. Krakowska، حدود Ochota/Włochy",
      en: "Renovated studio — Al. Krakowska, Ochota/Włochy border"
    },
    district: "Włochy",
    address: "Al. Krakowska, Włochy/Ochota, Warszawa",
    url: "https://www.olx.pl/d/oferta/do-wynajecia-studio-na-granicy-ochoty-wloch-al-krakowska-CID3-ID1aB49T.html",
    rent: 2800,
    bills: 600,
    garageCost: 200,
    extrasEst: 0,
    extrasNote: {
      ar: "✅ الإدارة ٦٠٠ شاملة موية+كهربا+تدفئة+زبالة+نت+TV حسب الإعلان — مفيش إضافي متوقع فوق كده.\n🅿️ جراج اختياري +٢٠٠.",
      en: "✅ Admin 600 covers water+power+heating+trash+net+TV per ad — no expected extras beyond that.\n🅿️ Optional garage +200."
    },
    areaSqm: 18,
    deposit: 2800,
    commuteMin: 16,
    availableFrom: "Available now",
    contact: {
      ar: "Marcin — OLX",
      en: "Marcin — OLX"
    },
    notes: {
      ar: "⚠️ نفس بصمة وكالة الـ ٤٠٠ النصابة (Marcin + نفس تليفون الإعلانات القديمة) — خليك حذر جدًا.\nكنبة سرير، مكتب، أسانسير دور ١، واي فاي ضمن الإدارة.\n💰 ٢٨٠٠ + ٦٠٠ شامل مرافق. عقد سنة.",
      en: "Sofa bed, desk, elevator floor 1, Wi‑Fi in admin.\n💰 2800 + 600 all-in utilities. 1-year lease."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/ebf4wmuwsrw3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/nmqsk42e5xpe1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/zl37m7yw9go8-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/fxz1gx4kpmx43-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/omh1tzcl7wyj3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/sn6am3p2vv7t-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/nbldyer9h8o82-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      bed: "no",
      spacious: "yes",
      garage: "no",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "unknown",
      noOccasional: "unknown",
      ac: "unknown"
    },
    createdAt: 4
  },
  {
    id: "oto-4cqp5",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٢٥م² من غير كوميشن — Żeńców، Bemowo (AFI)",
      en: "25m² studio, no commission — Żeńców, Bemowo (AFI)"
    },
    district: "Bemowo",
    address: "ul. Żeńców 6, Bemowo, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/bez-prowizji-mieszkanie-typu-studio-bemowo-ID4CQP5",
    rent: 2430,
    bills: 670,
    garageCost: 150,
    extrasEst: 0,
    extrasNote: {
      ar: "✅ الإجمالي المعلن ٣١٠٠ = إيجار ٢٤٣٠ + مشترك ٢٨٠ + مرافق ٣٩٠ (كهربا/موية/تدفئة/زبالة).\nواي فاي ضمن السعر. مفيش إضافي متوقع فوق كده.\n🅿️ باركنج اختياري ١٥٠–٤٥٠.",
      en: "✅ Ad total 3100 = rent 2430 + common 280 + media 390 (power/water/heating/trash).\nWi‑Fi included. No expected extras beyond that.\n🅿️ Optional parking 150–450."
    },
    areaSqm: 25,
    deposit: 4650,
    commuteMin: 40,
    availableFrom: {
      ar: "اسأل المعلن",
      en: "Ask landlord"
    },
    contact: {
      ar: "AFI Home — Otodom",
      en: "AFI Home — Otodom"
    },
    notes: {
      ar: "✅ من غير كوميشن. حيوانات مسموحة. ديش واشر+فرن. كنبة سرير. مبنى ٢٠٢٥، مراقبة. صور نموذجية.\n💰 ٢٤٣٠ + ٦٧٠ (مشترك+مرافق) = ٣١٠٠. كاونتر/تأمين مستأجر مطلوب.\nعقد ١٢ شهر.",
      en: "✅ No commission. Pets OK. Dishwasher+oven. Sofa bed. Building 2025, security. Show-unit photos.\n💰 2430 + 670 (common+media) = 3100. Deposit + tenant insurance required.\n12-month stay pricing."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Imp5ZXl3eXM2bzl4dTEtRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.oHoc2GLjrpYgQ8_E_OU9qwJeA_NC8EU6dx0P_IXxNqM/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjZocDI1eGtuODFlZjMtRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.BhnkvtxUbQ2K82oObabwHbZB0fi2yCxnvfVMGpfighQ/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Im9qYXVxa3JiaG00Ni1FQ09TWVNURU0iLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.FnYPC26Qr1RoSa3OPcNfC-Ml1PM7QW4-lk8sGQ8O57E/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InljMGIzYnRqbWkxNzMtRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.Tj3nVVHz1opaE4ODCVuWTQpw1Bw45XCKvmrg7-x1Ehs/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InZ0MHB3ZWJ0OXkyNzItRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.t8Mdwea_OoK3veggAjlzkjDt9a_lD59s6108357ze48/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InBkMmlqdmRlaXR2cjEtRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.cmJmIsFgfqF05j1XuueNqL6yEAImDjpRp7vobP70Kjc/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Ijc5NTAycnl0c25hbDItRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.n8p1g-oD7fH0gDqUCfiXpgt7cSgECmbT7vt_J4HdcqI/image;s=2048x1536;q=80"
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
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown",
      ac: "unknown"
    },
    createdAt: 5
  },
  {
    id: "oto-4cqre",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٢٩م² تكييف+بلكونة كبيرة — Bemowo",
      en: "Spacious 29m² studio with AC + big balcony — Bemowo"
    },
    district: "Bemowo",
    address: "Bemowo, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/przestronna-kawalerka-nowe-osiedle-duzy-balkon-klimatyzacja-ID4CQre",
    rent: 2350,
    bills: 950,
    garageCost: null,
    extrasEst: 140,
    extrasNote: {
      ar: "تقريبي لشخص واحد:\n⚡ كهربا ~١٤٠ (التكييف هيزوّدها صيفًا).\nالإدارة ٩٥٠ عالية — غالبًا فيها تدفئة/موية؛ مش مذكور صراحة.",
      en: "Solo estimate:\n⚡ Electricity ~140 (AC bumps summer).\nAdmin 950 is high — likely includes heating/water; not stated explicitly."
    },
    areaSqm: 29,
    deposit: 3300,
    commuteMin: 40,
    availableFrom: "Available now",
    contact: {
      ar: "FlexyFlow — Otodom",
      en: "FlexyFlow — Otodom"
    },
    notes: {
      ar: "✅ تكييف + بلكونة كبيرة جدًا + ديش واشر + سمارت هوم. مجمع جديد محروس على Bemowo. متاح دلوقتي.\n💰 ٢٣٥٠ + إدارة ٩٥٠. وكالة FlexyFlow — اسأل عن العمولة.\n❓ فرن/سرير مش مذكورين صراحة.",
      en: "✅ AC + huge balcony + dishwasher + smart home. New gated Bemowo estate. Available now.\n💰 2350 + admin 950. FlexyFlow agency — ask about commission.\n❓ Oven/bed not clearly listed."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImdmdmxsMjRiamNpbDEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.zlOumy5gy35QzKBrGeJC6Pxea1gqCPmJcwSzvWJhl9w/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjUwY2E0ZWExbmc4eTItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.x2u9u7o64capu4-UjBknQt7qIor6wS-UmxbZArMsAgE/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjVyYzUzdTk1azh5ODItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.BvhOB2My0ZQr1EOvTPVlX68-Ku7imj5nls3b9TxBgjI/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InN2MzU5ODZzbTl3bC1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.U1bQjL1XNwEn2droA2sPKNiC5klZkQFCTcXdyYaOMo0/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Im9nY3E2eHh5OGFveDEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.f1eCXVebKycA8pxnNUBbZPCATjWkJbsgMwYxXZvF_qw/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Im9lM2ZwaHo1ODN4YjMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.pkf6HVhbbw93aAe_4GanvMo9TSnM2cdk2ZiX5vJOHyA/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImJrZ2I0YTB4OHY1OTMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.K0BJLT08oksnhq-VI224ThrC13FwZZoeEQ6PPSWIIgI/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImlsNTNkaTVjNWttYTMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.8l0Mre9fa2O6z7sNSKKKv3n9mhhQCDtWN5mz6iguQyI/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjFoZzFqaDNvM25neDItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.s2z_N-qwhM7FejhMUPayhIgIObfnW9iUoyP4vL_dAfY/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImYwZnkycWxhcXAxZDItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.-BWRtxlQyuqu2Tz7jbGb5Y0canldyjqhxP5KooJbD5o/image;s=2048x1536;q=80"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "unknown",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "unknown",
      noOccasional: "unknown",
      ac: "yes"
    },
    createdAt: 6
  },
  {
    id: "oto-4cpb7",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٣٧م² pets من غير كوميشن — Żeńców، Bemowo (AFI)",
      en: "37m² pet-friendly studio, no commission — Żeńców, Bemowo (AFI)"
    },
    district: "Bemowo",
    address: "ul. Żeńców 6, Bemowo, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/bemowo-mieszkanie-typu-studio-pet-friendly-ID4CPB7",
    rent: 2530,
    bills: 870,
    garageCost: 150,
    extrasEst: 0,
    extrasNote: {
      ar: "✅ الإجمالي المعلن ٣٤٠٠ = إيجار ٢٥٣٠ + مشترك ٤٠٠ + مرافق ٤٧٠.\nواي فاي ضمن السعر. مفيش إضافي متوقع.\n🅿️ باركنج اختياري ١٥٠–٤٥٠.",
      en: "✅ Ad total 3400 = rent 2530 + common 400 + media 470.\nWi‑Fi included. No expected extras.\n🅿️ Optional parking 150–450."
    },
    areaSqm: 37,
    deposit: null,
    commuteMin: 40,
    availableFrom: {
      ar: "اسأل المعلن",
      en: "Ask landlord"
    },
    contact: {
      ar: "AFI Home — Otodom",
      en: "AFI Home — Otodom"
    },
    notes: {
      ar: "✅ من غير كوميشن. pets friendly. ديش واشر+فرن. كنبة سرير. نفس كمباوند Żeńców 6 (٢٠٢٥). صور نموذجية.\n💰 ٢٥٣٠ + ٨٧٠ = ٣٤٠٠. كاونتر/تأمين مستأجر.",
      en: "✅ No commission. Pets friendly. Dishwasher+oven. Sofa bed. Same Żeńców 6 compound (2025). Show-unit photos.\n💰 2530 + 870 = 3400. Deposit + tenant insurance."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InZueGFkYm90OTNzODEtRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.BhaoO2F0tZ_OGOgtwqBLbIk-MTctFyMp9_VFy45P600/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InF4NmpuMmFhc2lqbTMtRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.Q5bEvqsYCewLNfDXvmN26HIGvPvGdzrDt9FzrpJa9ag/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IndwNXh5bmFqNWxvZS1FQ09TWVNURU0iLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.UI2DqjqGWEwSPFeitD1OoGw3rSBIKfsRV6tBKJThaDI/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InRzajhpbW03OGNiODItRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.QVCFfMrnHEPTmGlYVsADEn45nt4MytwFM8VXQp7URCQ/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImIzMDBxNGpiam9hNzItRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.QWHFMypfy23j46Q12CsTLrIBFHEs_kSMYE7nsZyuWVc/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjV6eXZrNjRxZzU0MzMtRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.aPRbqR_R8P6WAc7dw1to95hGKJJnmK_6Ncl4Q30WBF0/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Inhsa2FrOWVja3UxNTItRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.fX92WVfp0jENNlF6Sdf3HdeulzgYsWaWrElCAgg5ksU/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImJyZjNnc2M3bTJqODEtRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.BdX_-nPLTmxMZ-O29bqp8VOohZDWi9s_RxudkovRFDo/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjhzZGZxa25lOXBpdjEtRUNPU1lTVEVNIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.S5YlJGKSj4P2I6SZ1915RxaNbOnDmNSYVJtMxW6hOVA/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjBscHdyZWpkY2s2di1FQ09TWVNURU0iLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.qkJVa1R3r-KdZe00sGyV3JpYApdj97AWMHVeQUo9pNY/image;s=2048x1536;q=80"
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
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown",
      ac: "unknown"
    },
    createdAt: 7
  }
];
