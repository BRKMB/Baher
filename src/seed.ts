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
  /**
   * عدد أوض الشقة كاملة (مش مساحة الأوضة) — عشان تعرف الزحمة / كام واحد هيشاركك.
   * null لو مش واضح من الإعلان.
   */
  flatRooms: number | null;
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
export const SEED_LISTINGS: Listing[] = [
  {
    id: "olx-1c64ai",
    propertyType: "room",
    title: {
      ar: "أوضة ~١٢–١٥م² لشخصين — Pilchowicka، Okęcie",
      en: "~12–15m² room for 2 people — Pilchowicka, Okęcie"
    },
    district: "Włochy",
    address: "ul. Pilchowicka 25, Okęcie, Włochy, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-2-os-15-m2-w-mieszkaniu-102-m2-wlochy-okecie-CID3-ID1c64Ai.html",
    rent: 1400,
    bills: 600,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: مرافق ثابتة ٦٠٠ لـ ٢ أشخاص (موية+غاز+كهربا+زبالة+نت).\nجراج تحت الأرض بفلوس زيادة (المبلغ مش مكتوب).",
      en: "Per ad: flat media 600 for 2 people (water+gas+power+trash+fiber).\nUnderground garage extra (amount not stated)."
    },
    areaSqm: 12,
    deposit: 1400,
    commuteMin: 18,
    flatRooms: 4,
    availableFrom: {
      ar: "مش مكتوب — اسأل",
      en: "Not stated — ask"
    },
    contact: {
      ar: "Agnieszka — OLX",
      en: "Agnieszka — OLX"
    },
    notes: {
      ar: "📅 تاريخ التوافر مش مذكور في الإعلان — اسأل المعلنة.\n❓ ديش واشر مش مذكور. سرير مزدوج + مكتب + دولاب. أوضة بتقفل. شقة ٤ أوض / ١٠٢م² (أوضة واحدة ليها حمام خاص؛ الباقي بيشتركوا).\nالعنوان في النص: ١٢م² (العنوان ١٥م²).\n💰 ١٤٠٠ + ٦٠٠ مرافق. ديبوزيت ١٤٠٠. مباشر.",
      en: "📅 Availability date not stated in the ad — ask.\n❓ Dishwasher not mentioned. Double bed + desk + wardrobe. Lockable room. 4-room / 102m² flat (one other room has its own bath; rest share).\nBody says ~12m² (title says 15m²).\n💰 1400 + 600 media. Deposit 1400. Direct."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/axe2ip2fca0f-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/mvfshqpxuu1a2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/zoj5cziokw8c-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/n4hs1s4dnbuf1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/v7em5ujidmrp2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/usv4btixz0lm3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      ac: "unknown",
      bed: "yes",
      spacious: "yes",
      garage: "no",
      max3: "no",
      desk: "yes",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 1
  },
  {
    id: "olx-1ajous",
    propertyType: "room",
    title: {
      ar: "أوضة ببلكونة — Borsucza / Raków، Włochy",
      en: "Room with balcony — Borsucza / Raków, Włochy"
    },
    district: "Włochy",
    address: "ul. Borsucza, Raków, Włochy, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-warszawa-rakow-CID3-ID1aJOus.html",
    rent: 1650,
    bills: 350,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: مرافق ثابتة ٣٥٠. الإجمالي الثابت ٢٠٠٠.",
      en: "Per ad: flat media 350. Fixed total 2000."
    },
    areaSqm: null,
    deposit: 2000,
    commuteMin: 14,
    flatRooms: 3,
    availableFrom: "09/2026",
    contact: {
      ar: "Łukasz — OLX",
      en: "Łukasz — OLX"
    },
    notes: {
      ar: "📅 فاضي من سبتمبر ٢٠٢٦ (الإعلان: od września).\n❓ ديش واشر مش مذكور. المطبخ: تلاجة+ميكروويف بس (مفيش ذكر فرن/ديش واشر). بلكونة، أوضة بتقفل، دور ٥ في شقة ٣ أوض.\n💰 ١٦٥٠ + ٣٥٠ = ٢٠٠٠. ديبوزيت ٢٠٠٠. مباشر.\n❓ الأسانسير: unknown من حقل المنصة.",
      en: "📅 Vacant from September 2026 (ad: od września).\n❓ Dishwasher not mentioned. Kitchen: fridge+microwave only (no oven/dishwasher listed). Balcony, lockable room, floor 5 in a 3-room flat.\n💰 1650 + 350 = 2000. Deposit 2000. Direct.\n❓ Elevator: unknown from platform field."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/hp7w12g41bvi1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/icnbb6yn3ag81-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/jo93hq66uait1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/fbatijdv99511-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/zoylrewkrhqk3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      ac: "unknown",
      bed: "unknown",
      spacious: "unknown",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 2
  },
  {
    id: "olx-12behi",
    propertyType: "room",
    title: {
      ar: "أوضة مفروشة بعد ترميم — Turecka، Mokotów",
      en: "Furnished room after remodel — Turecka, Mokotów"
    },
    district: "Mokotów",
    address: "ul. Turecka 3 (Belwederska area), Mokotów, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-w-mieszkaniu-bez-wlasciciela-umeblowany-pierwszy-najemca-mokotow-CID3-ID12behi.html",
    rent: 1600,
    bills: 250,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: الإدارة+نت ضمن الإيجار. عدّادات (موية+كهربا+زبالة) ~٢٥٠.",
      en: "Per ad: admin+internet included in rent. Meters (water+power+trash) ~250."
    },
    areaSqm: null,
    deposit: 2200,
    commuteMin: 32,
    flatRooms: 5,
    availableFrom: {
      ar: "مش مكتوب بوضوح — اسأل (أول مستأجر)",
      en: "Not clearly stated — ask (first tenant)"
    },
    contact: {
      ar: "Iza — OLX",
      en: "Iza — OLX"
    },
    notes: {
      ar: "📅 تاريخ التوافر مش مكتوب صراحة — مكتوب أول مستأجر بعد الترميم. اسأل.\n✅ ديش واشر + فرن مذكورين. مكتب. Tapczan (مش سرير عادي). شقة ٥ أوض من غير مالك، بلكونة، نت مجاني ضمن السعر.\n💰 ١٦٠٠ + عدّادات ~٢٥٠. ديبوزيت ٢٢٠٠. مباشر. من غير تدخين/حيوانات.",
      en: "📅 Availability date not clearly stated — says first tenant after remodel. Ask.\n✅ Dishwasher + oven listed. Desk. Tapczan (not a regular bed). 5-room flat without owner, balcony, internet included in rent.\n💰 1600 + meters ~250. Deposit 2200. Direct. No smoking/pets."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/utwmbvwf28zx-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/eu86tkzzi0wb2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/k4wdfxzitpml-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/1sxj6a76ib6b2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/lng64virytli1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/dcibis20w4kr-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/s2atynw1gsc52-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/9txqk9zmbvqc3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      ac: "unknown",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "no",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "yes"
    },
    createdAt: 3
  },
  {
    id: "olx-15jzvn",
    propertyType: "room",
    title: {
      ar: "أوضة فردية في شقة جديدة ٥٢م² — Wiślany Mokotów",
      en: "Single room in new 52m² flat — Wiślany Mokotów"
    },
    district: "Mokotów",
    address: "ul. Dywizjonu AK Jeleń, Wiślany Mokotów, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-1-osobowy-w-nowym-3-pokojowym-mieszkaniu-52-m2-CID3-ID15jZvn.html",
    rent: 1600,
    bills: 500,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: إدارة ٣٠٠ + مرافق ٢٠٠ (نت لاسلكي ضمن السعر).",
      en: "Per ad: admin 300 + media 200 (Wi‑Fi included)."
    },
    areaSqm: null,
    deposit: 2000,
    commuteMin: 28,
    flatRooms: 3,
    availableFrom: {
      ar: "مش مكتوب — اسأل",
      en: "Not stated — ask"
    },
    contact: {
      ar: "Marek — OLX",
      en: "Marek — OLX"
    },
    notes: {
      ar: "📅 تاريخ التوافر مش مذكور — اسأل.\n❓ ديش واشر مش مذكور بالاسم (مكتوب أجهزة AGD عامة). ✅ سرير ١٠٠×٢٠٠ + مكتب بارتفاع متغير + كرسي مكتب. شقة جديدة ٣ أوض / ٥٢م²، دور ٣، مطبخ منفصل.\nجراج اختياري. شرط: بولندي بطلاقة. من غير تدخين/حيوانات. عقد ٦ شهور أقل حاجة.\n💰 ١٦٠٠ + ٣٠٠ + ٢٠٠ = ٢١٠٠. ديبوزيت ٢٠٠٠.",
      en: "📅 Availability date not stated — ask.\n❓ Dishwasher not named (only general AGD). ✅ Bed 100×200 + height-adjustable desk + office chair. New 3-room / 52m², floor 3, separate kitchen.\nOptional garage. Requires fluent Polish. No smoking/pets. Min 6-month lease.\n💰 1600 + 300 + 200 = 2100. Deposit 2000."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/qx10qdpati7i-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/s200vqdyyz941-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/o7bug0hbek9n3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ed0zxul00u431-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/gi9l3y242x2q3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/tlo5ns7szgjd-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/31e1bq5ktzu6-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      ac: "unknown",
      bed: "yes",
      spacious: "yes",
      garage: "no",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 4
  },
  {
    id: "oto-4d6fz",
    propertyType: "room",
    title: {
      ar: "أوضة مزدوجة ١٨م² بإطلالة على البارك — Szczęśliwice (شقة ٢ أوض)",
      en: "Double room 18m² with park view — Szczęśliwice (2-room flat)"
    },
    district: "Ochota",
    address: "ul. Przy Parku / Szczęśliwice, Ochota, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/duzy-pokoj-dwuosobowy-z-widokiem-na-park-bez-prowizji-ID4D6fz",
    rent: 1195,
    bills: 595,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان لكل شخص: إيجار ١١٩٥ + تشغيل ٥٩٥ (مية+تدفئة+كهربا+زبالة+نت+إدارة).\nالإجمالي ١٧٩٠ للشخص. مفيش إضافي متوقع.",
      en: "Per ad per person: rent 1195 + ops 595 (water+heat+power+trash+net+admin).\nTotal 1790/person. No expected extras."
    },
    areaSqm: 18,
    deposit: 1790,
    commuteMin: 22,
    flatRooms: 2,
    availableFrom: "01/10/2026",
    contact: {
      ar: "Warsaw Villa Park — Otodom",
      en: "Warsaw Villa Park — Otodom"
    },
    notes: {
      ar: "📅 فاضي من ١ أكتوبر ٢٠٢٦.\n⚠️ أوضة مزدوجة لشخصين/زوجين (مش فردية) — سرير مزدوج أو سريرين. الشقة ٢ أوض؛ في الأوضة التانية شخص واحد.\n❓ ديش واشر مش مذكور. ✅ من غير كوميشن. تنظيف مشترك ضمن السعر. عقد ١٢ شهر.\n💰 ١١٩٥ + ٥٩٥ = ١٧٩٠/شخص.",
      en: "📅 Vacant from 1 Oct 2026.\n⚠️ Double room for a couple/two friends (not a solo room) — double bed or twin beds. 2-room flat; one person in the other room.\n❓ Dishwasher not mentioned. ✅ No commission. Shared cleaning included. 12-month lease.\n💰 1195 + 595 = 1790/person."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Ijdmejl4aTJ6YjN0ZS1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.SuP3GPt7uvUFgMicUnu5lv_LpeLS7N4yL4FEyfZUIGU/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InM5dWpidnM5NXloNi1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.lGMSq8Ioje58rZxZU9xopD_JWvm4WHh9yvoXLsrtQdQ/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InZzMmpleGx2MnV2YjMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.CAsoznK0dQK6EbYMVbhEmGiioWE8sn4agdq4qHkjW74/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjJoNTB3bXAzNDVpdy1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.cEv8BPvrgOURnrPTHt6xynsuq0ImTnzbZ0tzTP1oUbM/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImIzYTFvMmRrM2N0MzEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.kd0gcBnjhZF-DT2gA9O1y1huM-jHhG_FOEexXwwwxHQ/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImduOXVhZHUwcWpudTMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.N2I4ZhavZ1DktcKZJ_FmT680SSppP2kf0KZUFfYYT4M/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjNlM3d4aTB5YWYydzEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.7e5ab7G_4iGbOlNa-GTKGoZg12GWlWTrrx2KVl3DVNs/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjVubTMwZm1lNGhrNzItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.5vx_y9Ua2ybsl_0Et_OFf6ziImrdodPlnWv79kHgGS4/image;s=2048x1536;q=80"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
      ac: "unknown",
      bed: "unknown",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 5
  },
  {
    id: "olx-1cheoh",
    propertyType: "room",
    title: {
      ar: "أوضة مفروشة في شقة ٢ أوض — Kasprowicza، Bielany",
      en: "Furnished room in 2-room flat — Kasprowicza, Bielany"
    },
    district: "Bielany",
    address: "ul. Kasprowicza, Bielany, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-do-wynajecia-CID3-ID1cheOh.html",
    rent: 1500,
    bills: null,
    garageCost: null,
    extrasEst: 300,
    extrasNote: {
      ar: "المرافق مش مذكورة في الإعلان — تقدير تقريبي ~٣٠٠ لشخص واحد.",
      en: "Utilities not stated in the ad — rough solo estimate ~300."
    },
    areaSqm: null,
    deposit: null,
    commuteMin: 45,
    flatRooms: 2,
    availableFrom: "01/10/2026",
    contact: {
      ar: "wiolafranc — OLX",
      en: "wiolafranc — OLX"
    },
    notes: {
      ar: "📅 فاضي من ١ أكتوبر ٢٠٢٦.\n❓ ديش واشر مش مذكور. شقة ٢ أوض، أوضة بتقفل، دور ٣ من غير أسانسير.\nيفضّلوا حد حوالي ٢٥ سنة ومرتب.\n~٣ دقايق للمترو. حي Bielany (مش Ochota).\n💰 ١٥٠٠ + مرافق مش مكتوبة.",
      en: "📅 Vacant from 1 Oct 2026.\n❓ Dishwasher not mentioned. 2-room flat, lockable room, floor 3 with no elevator.\nPrefer someone ~25 and tidy.\n~3 min to metro. Bielany (not Ochota).\n💰 1500 + utilities not stated."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/ib14acny8x78-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/szhn6lbcqo0h1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/s130ihm6llpa3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/w9xfebd2jf4d2-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
      ac: "unknown",
      bed: "unknown",
      spacious: "unknown",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "unknown",
      elevator: "no",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 6
  },
  {
    id: "olx-1cniul",
    propertyType: "room",
    title: {
      ar: "أوضة ١٣م² في شقة ٣ أوض ٧٠م² — SGGW، Ursynów",
      en: "13m² room in 3-room 70m² flat — SGGW, Ursynów"
    },
    district: "Ursynów",
    address: "ul. Przybyszewskiego, Ursynów, Warszawa",
    url: "https://www.olx.pl/d/oferta/wynajme-pokoj-13m2-w-mieszk-70m2-sggw-warszawa-ursynow-od-01-10-2026-CID3-ID1cniUl.html",
    rent: 1700,
    bills: 0,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: ١٧٠٠ شامل إدارة+مية+كهربا. مفيش إضافي متوقع.",
      en: "Per ad: 1700 includes admin+water+power. No expected extras."
    },
    areaSqm: 13,
    deposit: 1700,
    commuteMin: 30,
    flatRooms: 3,
    availableFrom: "01/10/2026",
    contact: {
      ar: "Ewa — OLX",
      en: "Ewa — OLX"
    },
    notes: {
      ar: "📅 فاضي من ١ أكتوبر ٢٠٢٦.\n✅ ديش واشر مذكور + غسالة + تلاجة. سرير ١٤٠×٢٠٠ + مكتب + كومودينو. شقة ٣ أوض / ٧٠.٤م²، دور ٢ من غير أسانسير.\nقريب مترو Imielin وSGGW.\n💰 ١٧٠٠ شامل. ديبوزيت ١٧٠٠. مباشر.",
      en: "📅 Vacant from 1 Oct 2026.\n✅ Dishwasher listed + washer + fridge. Bed 140×200 + desk + dresser. 3-room / 70.4m², floor 2 no elevator.\nNear metro Imielin and SGGW.\n💰 1700 all-in. Deposit 1700. Direct."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/m54sguvvfcad-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/27fq3xiwsh271-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ivff069rb1582-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/jg3ipwjsaif6-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/21h1gs9u939z1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/dq4cnsjb3mzh3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/7df11rrs92fc-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "yes",
      ac: "unknown",
      bed: "yes",
      spacious: "no",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "unknown",
      elevator: "no",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 7
  },
  {
    id: "olx-1cf7t7",
    propertyType: "room",
    title: {
      ar: "أوضة بتكييف وبلكونة — Kabaty (شقة ٢ أوض)",
      en: "Room with AC and balcony — Kabaty (2-room flat)"
    },
    district: "Ursynów",
    address: "Kabaty, Ursynów, Warszawa",
    url: "https://www.olx.pl/d/oferta/komfortowy-pokoj-blisko-metra-z-klimatyzacja-i-balkonem-CID3-ID1cf7T7.html",
    rent: 2300,
    bills: 200,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: إيجار ٢٣٠٠ + مرافق ٢٠٠. ديبوزيت ٢٣٠٠.",
      en: "Per ad: rent 2300 + media 200. Deposit 2300."
    },
    areaSqm: null,
    deposit: 2300,
    commuteMin: 35,
    flatRooms: 2,
    availableFrom: "01/10/2026",
    contact: {
      ar: "Eryk — OLX",
      en: "Eryk — OLX"
    },
    notes: {
      ar: "📅 متاح من أكتوبر ٢٠٢٦.\n✅ تكييف في الشقة + بلكونة + روليت تعتيم. المكتب هيتضاف قبل الدخول.\nالشقة ٢ أوض — الزميل Ashton (شاب، شيفتات ليل، إنجليزي).\n٥ دقايق لمترو Kabaty.\n💰 ٢٣٠٠ + ٢٠٠. ديبوزيت ٢٣٠٠.",
      en: "📅 Available from October 2026.\n✅ AC in the flat + balcony + blackout blinds. Desk will be added before move-in.\n2-room flat — flatmate Ashton (guy, night shifts, English).\n5 min to Kabaty metro.\n💰 2300 + 200. Deposit 2300."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/lvp062gwkpj81-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/v2c2m0r9hmcq1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/4rcg2e14rbis3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/3n18fwp7wtxf-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/f34pf9v5jhmp1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ihe432mgj9b53-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/8vq5fv7pfp2b3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/weh59i0qzuph2-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
      ac: "yes",
      bed: "unknown",
      spacious: "unknown",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 8
  },
  {
    id: "olx-1cegmf",
    propertyType: "room",
    title: {
      ar: "أوضة ٢١م² ببلكونة — Stokłosy / SGGW (شقة ٣ أوض)",
      en: "21m² room with balcony — Stokłosy / SGGW (3-room flat)"
    },
    district: "Ursynów",
    address: "Ursynów near metro Stokłosy, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-na-ursynowie-21m2-balkon-wynajme-metro-stoklosy-sggw-CID3-ID1ceGmf.html",
    rent: 1870,
    bills: 300,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: إيجار ١٨٧٠ + سلفة مرافق ٣٠٠ (تتظبط في الآخر). ديبوزيت شهر.",
      en: "Per ad: rent 1870 + media advance 300 (settled later). Deposit = 1 month."
    },
    areaSqm: 21,
    deposit: 1870,
    commuteMin: 28,
    flatRooms: 3,
    availableFrom: {
      ar: "مش مكتوب — اسأل",
      en: "Not stated — ask"
    },
    contact: {
      ar: "Marcin — OLX",
      en: "Marcin — OLX"
    },
    notes: {
      ar: "📅 تاريخ التوافر مش مذكور — اسأل.\n✅ ديش واشر مذكور. سرير واسع + مكتب في ركن شغل + بلكونة. شقة ٣ أوض — زميلين طالبين.\n٣ دقايق لمترو Stokłosy / SGGW.\nعقد ١٢ شهر. مباشر (مش وسطاء).\n💰 ١٨٧٠ + ٣٠٠.",
      en: "📅 Availability date not stated — ask.\n✅ Dishwasher listed. Wide bed + desk in a work corner + balcony. 3-room flat — two student flatmates.\n3 min to metro Stokłosy / SGGW.\n12-month lease. Direct (no agents).\n💰 1870 + 300."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/b3ggul2emvgi3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/fc7a8xigtfd81-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/9s2g5ic25hpm-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/0xptk8y9ue79-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/e3nf1r498ik21-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/9762rbiszaf61-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/3dqpm92q6n7-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/1dh6chkxmjl12-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "yes",
      ac: "unknown",
      bed: "yes",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 9
  },
  {
    id: "olx-1bqsja",
    propertyType: "room",
    title: {
      ar: "أوضة قرب مترو Płocka — Grabowska (شقة ٥ أوض ⚠️)",
      en: "Room near metro Płocka — Grabowska (5-room flat ⚠️)"
    },
    district: "Wola",
    address: "ul. Grabowska 3, Wola, Warszawa",
    url: "https://www.olx.pl/d/oferta/metro-plocka-ladny-pokoj-od-pazdziernika-ul-grabowska-CID3-ID1bQSjA.html",
    rent: 1100,
    bills: 300,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "سلفة إدارة+فواتير ٣٠٠. ⚠️ كوميشن وكالة = شهر إيجار.",
      en: "Admin+bills advance 300. ⚠️ Agency commission = 1 month rent."
    },
    areaSqm: null,
    deposit: null,
    commuteMin: 30,
    flatRooms: 5,
    availableFrom: "01/10/2026",
    contact: {
      ar: "Klaudia — OLX",
      en: "Klaudia — OLX"
    },
    notes: {
      ar: "📅 فاضي من أول أكتوبر ٢٠٢٦.\n✅ ديش واشر + فرن مذكورين. سرير + دولاب. الشقة ١٠٤م² / ٥ أوض + حمامين.\n⚠️ وكالة: كوميشن شهر. زحمة (٥ أوض).\n💰 ١١٠٠ + ٣٠٠ سلفة.",
      en: "📅 Vacant from early October 2026.\n✅ Dishwasher + oven listed. Bed + wardrobe. Flat 104m² / 5 rooms + 2 bathrooms.\n⚠️ Agency: 1-month commission. Crowded (5 rooms).\n💰 1100 + 300 advance."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/6kpnb6zblnqo1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/vr9oofbyadvl-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/bdtau98sikcx1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/hq5pz1fpy1rm-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/i3kdzg24pjjr2-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      ac: "unknown",
      bed: "yes",
      spacious: "yes",
      garage: "unknown",
      max3: "no",
      desk: "unknown",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "no",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 10
  },
  {
    id: "olx-1afmvi",
    propertyType: "room",
    title: {
      ar: "أوضة ستاندرد عالي — Zwierzyniecka، Mokotów (شقة ٥ أوض ⚠️)",
      en: "High-standard room — Zwierzyniecka, Mokotów (5-room flat ⚠️)"
    },
    district: "Mokotów",
    address: "ul. Zwierzyniecka 17, Mokotów, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-mokotow-zwierzyniecka-wysoki-standard-od-10-pazdziernika-CID3-ID1aFMvi.html",
    rent: 1250,
    bills: 350,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: ١٢٥٠ + ٣٥٠ رصيد مرافق (نت ضمن السعر) = ١٦٠٠.",
      en: "Per ad: 1250 + 350 media flat rate (internet included) = 1600."
    },
    areaSqm: null,
    deposit: 1600,
    commuteMin: 25,
    flatRooms: 5,
    availableFrom: "10/10/2026",
    contact: {
      ar: "Mateusz — OLX",
      en: "Mateusz — OLX"
    },
    notes: {
      ar: "📅 فاضي من ١٠ أكتوبر ٢٠٢٦. عقد لحد ٣٠ سبتمبر ٢٠٢٧.\n✅ ديش واشر + فرن + مكتب كبير + سرير بمرتبة. شقة ٥ أوض + حمامين. أوضة بتقفل.\n⚠️ زحمة (٥ أوض). مباشر من غير كوميشن.\n💰 ١٢٥٠ + ٣٥٠ = ١٦٠٠. ديبوزيت شهر.",
      en: "📅 Vacant from 10 Oct 2026. Lease until 30 Sep 2027.\n✅ Dishwasher + oven + big desk + spring mattress bed. 5-room flat + 2 bathrooms. Lockable room.\n⚠️ Crowded (5 rooms). Direct, no commission.\n💰 1250 + 350 = 1600. Deposit = 1 month."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/icy4gh58qegz2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/59efzd99evjz1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/5048c3wqrcp71-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/penue386jfin-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/jg4dhnhrs5wi1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/qcu1f0wqykme-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/um94ohpltks82-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      ac: "unknown",
      bed: "yes",
      spacious: "unknown",
      garage: "unknown",
      max3: "no",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 11
  },
  {
    id: "olx-19ifu5",
    propertyType: "room",
    title: {
      ar: "أوض كبيرة — Stokłosy / SGGW (شقة ٥ أوض ⚠️)",
      en: "Large rooms — Stokłosy / SGGW (5-room flat ⚠️)"
    },
    district: "Ursynów",
    address: "ul. Dunikowskiego, Ursynów, Warszawa",
    url: "https://www.olx.pl/d/oferta/duze-pokoje-na-ursynowie-metro-stoklosy-sggw-vistula-od-pazdziernika-CID3-ID19IFu5.html",
    rent: 1150,
    bills: 350,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "الإيجار ١١٥٠–١٣٠٠ حسب الأوضة + ٣٥٠ مرافق (نت ضمن السعر). حاطين أقل سعر.",
      en: "Rent 1150–1300 depending on room + 350 media (Wi‑Fi included). Using the lowest price."
    },
    areaSqm: 10,
    deposit: 1150,
    commuteMin: 28,
    flatRooms: 5,
    availableFrom: "01/10/2026",
    contact: {
      ar: "Jarek — OLX",
      en: "Jarek — OLX"
    },
    notes: {
      ar: "📅 فاضي من ١ أكتوبر ٢٠٢٦.\n✅ ديش واشر + فرن مذكورين. أوض ~٨–١٢م²، سرير مزدوج ينفرد + مكتب. ٤ أوض فاضية من أصل ٥.\n⚠️ زحمة (٥ أوض فردية). واحد فيهم ببلكونة.\n💰 ١١٥٠–١٣٠٠ + ٣٥٠. ديبوزيت شهر.",
      en: "📅 Vacant from 1 Oct 2026.\n✅ Dishwasher + oven listed. Rooms ~8–12m², fold-out double bed + desk. 4 of 5 rooms free.\n⚠️ Crowded (5 single rooms). One has a balcony.\n💰 1150–1300 + 350. Deposit = 1 month."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/5m5ulzjpqp3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/a9ghq3xxvpbf3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/7tacmblymg6b-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/v9u39a51ca471-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/m2jr6qenk4ke3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/k9rfpunphzd7-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/7e7jmfvypqly-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/wv6bc2u601nf1-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      ac: "unknown",
      bed: "yes",
      spacious: "no",
      garage: "unknown",
      max3: "no",
      desk: "yes",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 12
  },
  {
    id: "olx-1cmndb",
    propertyType: "room",
    title: {
      ar: "أوضة كبيرة بعد ترميم — Al. Krakowska (شقة ٤ أوض)",
      en: "Large renovated room — Al. Krakowska (4-room flat)"
    },
    district: "Włochy",
    address: "Al. Krakowska 274, Włochy, Warszawa",
    url: "https://www.olx.pl/d/oferta/ladny-wygodny-i-duzy-pokoj-bezposrednio-CID3-ID1cmNdb.html",
    rent: 1350,
    bills: 300,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: +٣٠٠ مرافق ثابتة. نت مجاني. ديبوزيت = إجمالي الشهر.",
      en: "Per ad: +300 fixed media. Free Wi‑Fi. Deposit = monthly total."
    },
    areaSqm: null,
    deposit: 1650,
    commuteMin: 18,
    flatRooms: 4,
    availableFrom: "01/10/2026",
    contact: {
      ar: "Henryk — OLX",
      en: "Henryk — OLX"
    },
    notes: {
      ar: "📅 فاضي من ١ أكتوبر ٢٠٢٦.\n❓ ديش واشر مش مذكور. شقة ٤ أوض بعد ترميم — حاليا ٣ شباب مقيمين ومددين عقود.\nمالك مش ساكن في الشقة. أوضة بتقفل. هدوء مطلوب.\n💰 ١٣٥٠ + ٣٠٠. مباشر.",
      en: "📅 Vacant from 1 Oct 2026.\n❓ Dishwasher not mentioned. Renovated 4-room flat — currently 3 guys living there on renewed leases.\nOwner does not live in. Lockable room. Quiet preferred.\n💰 1350 + 300. Direct."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/tqa20km8b2xl2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/edndl485npv11-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ot5boynt5ns12-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/4izb09ro7wsf1-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
      ac: "unknown",
      bed: "unknown",
      spacious: "unknown",
      garage: "unknown",
      max3: "no",
      desk: "unknown",
      modern: "yes",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "yes"
    },
    createdAt: 13
  },
  {
    id: "olx-1bdlfe",
    propertyType: "room",
    title: {
      ar: "أوضة في شقة ٣ أوض — Bełdan، Mokotów",
      en: "Room in 3-room flat — Bełdan, Mokotów"
    },
    district: "Mokotów",
    address: "ul. Bełdan 11, Mokotów, Warszawa",
    url: "https://www.olx.pl/d/oferta/wynajme-pokoj-w-mieszkaniu-trzy-pokojowym-CID3-ID1bDlFE.html",
    rent: 1800,
    bills: 0,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: ١٨٠٠ شامل كل المصاريف + نت.",
      en: "Per ad: 1800 includes all fees + internet."
    },
    areaSqm: null,
    deposit: null,
    commuteMin: 25,
    flatRooms: 3,
    availableFrom: {
      ar: "مش مكتوب — اسأل",
      en: "Not stated — ask"
    },
    contact: {
      ar: "aneta — OLX",
      en: "aneta — OLX"
    },
    notes: {
      ar: "📅 تاريخ التوافر مش مذكور — اسأل.\n❓ ديش واشر/فرن مش مذكورين. شقة ٣ أوض مفروشة بعد ترميم على ul. Bełdan 11.\nالإعلان قصير جدًا — اسأل عن التفاصيل.\n💰 ١٨٠٠ شامل.",
      en: "📅 Availability date not stated — ask.\n❓ Dishwasher/oven not mentioned. Furnished renovated 3-room flat on ul. Bełdan 11.\nVery short ad — ask for details.\n💰 1800 all-in."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/uv0839qwrsqq3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/41xtut1iy9hj-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/h1xkgb31u02k2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/wbtjxi45ixky2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/7jbb1yt84gx1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/g05q6yqosgnv3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
      ac: "unknown",
      bed: "unknown",
      spacious: "unknown",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "unknown",
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 14
  },
  {
    id: "olx-19hzqe",
    propertyType: "room",
    title: {
      ar: "أوضة ١٠م² — ٣ دقايق لمترو Imielin (شقة ٤ أوض)",
      en: "10m² room — 3 min to metro Imielin (4-room flat)"
    },
    district: "Ursynów",
    address: "near metro Imielin, Ursynów, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-10-m2-3-min-do-metra-m1-imielin-CID3-ID19hzQe.html",
    rent: 1400,
    bills: 430,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: ١٤٠٠ إيجار + ~٤٣٠ مرافق (ريتشالت، تتظبط حسب الاستهلاك).",
      en: "Per ad: 1400 rent + ~430 media (lump sum, settled by usage)."
    },
    areaSqm: 10,
    deposit: 1400,
    commuteMin: 32,
    flatRooms: 4,
    availableFrom: "01/10/2026",
    contact: {
      ar: "Zuzanna — OLX",
      en: "Zuzanna — OLX"
    },
    notes: {
      ar: "📅 فاضي من ١ أكتوبر ٢٠٢٦.\n✅ ديش واشر + فرن مذكورين. سرير ١٤٠ + مكتب + دولاب. شقة ٤ أفراد بعد ترميم ٢٠٢٤، دور ٣.\nكل أوضة بتقفل. عقد بفترة إخطار شهر.\n💰 ١٤٠٠ + ~٤٣٠. ديبوزيت ١٤٠٠.",
      en: "📅 Vacant from 1 Oct 2026.\n✅ Dishwasher + oven listed. Bed 140 + desk + wardrobe. 4-person flat renovated 2024, floor 3.\nEach room lockable. Lease with 1-month notice.\n💰 1400 + ~430. Deposit 1400."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/ptx351y8zrxb-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/3t0ilibs5j682-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/1me3i9aju9i11-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ss4jtovvtaef-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/q8x4vlgbhihj2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/vszth9zpm9fb3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ek2w6jg3ms4h1-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      ac: "unknown",
      bed: "yes",
      spacious: "no",
      garage: "unknown",
      max3: "no",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 15
  },
  {
    id: "olx-1boprm",
    propertyType: "room",
    title: {
      ar: "أوضة فردية — Bonifacego 89، Sadyba / Mokotów (شقة ٥ أوض ⚠️)",
      en: "Single room — Bonifacego 89, Sadyba / Mokotów (5-room flat ⚠️)"
    },
    district: "Mokotów",
    address: "ul. Bonifacego 89, Sadyba, Mokotów, Warszawa",
    url: "https://www.olx.pl/d/oferta/pokoj-jednoosobowy-ul-bonifacego-89-mokotow-sadyba-best-mall-CID3-ID1bOPRm.html",
    rent: 1450,
    bills: 490,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: ١٤٥٠ + ٤٩٠ مرافق (نت ٦٠٠Mb ضمن السعر). ديبوزيت ٢٣٠٠.",
      en: "Per ad: 1450 + 490 media (600Mb internet included). Deposit 2300."
    },
    areaSqm: null,
    deposit: 2300,
    commuteMin: 28,
    flatRooms: 5,
    availableFrom: "01/10/2026",
    contact: {
      ar: "Basia — OLX",
      en: "Basia — OLX"
    },
    notes: {
      ar: "📅 فاضي من ١ أكتوبر ٢٠٢٦.\n✅ ديش واشر + فرن مذكورين. سرير بمرتبة + مكتب + دولاب كبير. شقة ٥ أوض دور ١٠ (أسانسيرين) + حمامين.\nمباشر من المالك (مش وكالة) — مش مكتوب إنه ساكن في الشقة.\nجنب Sadyba Best Mall.\n💰 ١٤٥٠ + ٤٩٠. ديبوزيت ٢٣٠٠.",
      en: "📅 Vacant from 1 Oct 2026.\n✅ Dishwasher + oven listed. Bed with mattress + desk + big wardrobe. 5-room flat floor 10 (2 elevators) + 2 bathrooms.\nDirect from owner (not agency) — does not say the owner lives there.\nNext to Sadyba Best Mall.\n💰 1450 + 490. Deposit 2300."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/487adw4m9aox1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/4reaozxzduef2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/rdy8a46v9mg7-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/p5yncfa84whp-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/03299u664mr4-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/oscmvs1thnzq3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/8n1x3u6hwc802-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/lul4rf7acxsb2-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      ac: "unknown",
      bed: "yes",
      spacious: "unknown",
      garage: "unknown",
      max3: "no",
      desk: "yes",
      modern: "unknown",
      elevator: "yes",
      availableAug: "no",
      noOwner: "unknown",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 16
  },
  {
    id: "olx-1asme7",
    propertyType: "room",
    title: {
      ar: "أوضة كبيرة جنب Łazienki — Mokotów ⚠️ نساء فقط",
      en: "Large room by Łazienki — Mokotów ⚠️ women preferred"
    },
    district: "Mokotów",
    address: "Mokotów (near Łazienki Królewskie), Warszawa",
    url: "https://www.olx.pl/d/oferta/piekny-i-duzy-pokoj-w-spokojnej-zielonej-okolicy-przy-lazienkach-krolewskich-CID3-ID1aSmE7.html",
    rent: 1500,
    bills: 350,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: ١٥٠٠ + ٣٥٠ إدارة/مرافق (czynsz).",
      en: "Per ad: 1500 + 350 rent/admin (czynsz)."
    },
    areaSqm: null,
    deposit: null,
    commuteMin: 30,
    flatRooms: 3,
    availableFrom: {
      ar: "مش مكتوب — اسأل",
      en: "Not stated — ask"
    },
    contact: {
      ar: "Marysia — OLX (SMS)",
      en: "Marysia — OLX (SMS)"
    },
    notes: {
      ar: "⚠️ Preferowani: Kobiety — الإعلان للنساء / يفضّل نساء.\n📅 تاريخ التوافر مش مذكور — اسأل.\n❓ ديش واشر/فرن/أسانسير مش مذكورين. شقة ٣ أوض، أوضة كبيرة، مفروشة، منطقة هادية خضرا جنب Łazienki (٨ دقايق مشي).\nعايزين شخص هادي ويفضّل شغال.\n💰 ١٥٠٠ + ٣٥٠. ديبوزيت مش مكتوب. خاص/مباشر.",
      en: "⚠️ Preferowani: Kobiety — women preferred / women-only filter on OLX.\n📅 Availability date not stated — ask.\n❓ Dishwasher/oven/elevator not mentioned. 3-room flat, large furnished room, quiet green area by Łazienki (8 min walk).\nLooking for a quiet person, preferably already working.\n💰 1500 + 350. Deposit not stated. Private/direct."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/7ln1vvwxcsob1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/mn4dwfg86u5n-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ezcx7q3fahiu-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/8qpy2j0xepra1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/w35bpo0m3tsp1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/3cfcc3g91l463-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/jym66ys6poce-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
      ac: "unknown",
      bed: "unknown",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown",
      noOwner: "unknown"
    },
    createdAt: 17
  }
];



