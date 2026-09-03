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
export const SEED_LISTINGS: Listing[] = [
  {
    id: "olx-17e3so",
    propertyType: "room",
    title: {
      ar: "أوضة كبيرة ببلكونة — Grójecka، Ochota (٣ أوض)",
      en: "Large room with balcony — Grójecka, Ochota (3-room flat)"
    },
    district: "Ochota",
    address: "ul. Grójecka, Ochota, Warszawa",
    url: "https://www.olx.pl/d/oferta/duzy-pokoj-ochota-do-wynajecia-wynajem-wum-uw-z-balkonem-ladny-pokoj-na-wynajem-warszawa-grojecka-mieszkanie-z-balkonem-w-trzyosobowym-przytulny-CID3-ID17E3sO.html",
    rent: 2290,
    bills: 400,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان: مرافق كسلفة ~٤٠٠ (نت فايبر+تدفئة+زبالة+موية+كهربا) وتتظبط في آخر السنة.\nمفيش إضافي متوقع فوق كده.",
      en: "Per ad: media advance ~400 (fiber+heating+trash+water+power), settled at year-end.\nNo expected extras beyond that."
    },
    areaSqm: null,
    deposit: 2290,
    commuteMin: 22,
    availableFrom: "01/10/2026",
    contact: {
      ar: "Mateusz — OLX",
      en: "Mateusz — OLX"
    },
    notes: {
      ar: "📅 فاضي من ١ أكتوبر ٢٠٢٦ (ممكن أيام قبل بالاتفاق).\n✅ ديش واشر مذكور + فرن + مكتب كبير + سرير كبير + بلكونة. أسانسير (حقل المنصة/الوصف). شقة ٥٦.٥م² / ٣ أوض بعد ترميم. مباشر من غير كوميشن.\nالسكان الحاليين: طالبتين — يفضّلوا مستأجرة ست.\n💰 ٢٢٩٠ + مرافق ~٤٠٠. ديبوزيت شهر.",
      en: "📅 Vacant from 1 Oct 2026 (a few days earlier negotiable).\n✅ Dishwasher listed + oven + big desk + large bed + balcony. Elevator (platform/ad). 56.5m² / 3-room renovated flat. Direct, no commission.\nCurrent flatmates: two female students — they prefer a woman.\n💰 2290 + media ~400. Deposit = 1 month."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/qn0vr4k6t8os3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/5kkya9v7dbj23-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/63dknuyb9qh12-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/mavwgpwdrbje1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/en32c1sj36j11-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/zsckgmzirjpa3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/uhsjgi7mj5501-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/q444blo7vgue3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      ac: "unknown",
      bed: "yes",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "yes",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 1
  },
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
      oven: "unknown",
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
      noOccasional: "unknown"
    },
    createdAt: 2
  },
  {
    id: "olx-1btgzy",
    propertyType: "room",
    title: {
      ar: "أوضة ١٧م² ببلكونة — Orzeszkowej، Ochota/Szczęśliwice",
      en: "17m² room with balcony — Orzeszkowej, Ochota/Szczęśliwice"
    },
    district: "Ochota",
    address: "ul. Elizy Orzeszkowej, Ochota / Szczęśliwice, Warszawa",
    url: "https://www.olx.pl/d/oferta/duzy-pokoj-17-m-balkon-ochota-szczesliwice-tylko-2-osoby-w-mieszkaniu-CID3-ID1bTgzY.html",
    rent: 1840,
    bills: 590,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "حسب الإعلان لشخص واحد: نصف إدارة التعاونية + سلفة كهربا = ٥٩٠.\nالإجمالي المعلن ٢٤٣٠.",
      en: "Per ad for 1 person: half coop admin + electricity advance = 590.\nStated total 2430."
    },
    areaSqm: 17,
    deposit: 2430,
    commuteMin: 20,
    availableFrom: "Available now",
    contact: {
      ar: "Lilianna — OLX",
      en: "Lilianna — OLX"
    },
    notes: {
      ar: "📅 فاضي من ٢١ أغسطس ٢٠٢٦ → دلوقتي متاح (لو لسه فاضي). عقد لحد ٣١ أغسطس ٢٠٢٧.\n❓ ديش واشر مش مذكور. ✅ فرن + سرير بمرتبة + مكتب + بلكونة. شقة ٢ أوض / ٥١م² — زميلة واحدة طالبة بتشتغل.\nللستات ١٨–٣٠، من غير تدخين/حيوانات.\n💰 ١٨٤٠ + ٥٩٠ = ٢٤٣٠. ديبوزيت ٢٤٣٠. مباشر.",
      en: "📅 Vacant from 21 Aug 2026 → available now (if still free). Lease until 31 Aug 2027.\n❓ Dishwasher not mentioned. ✅ Oven + bed with mattress + desk + balcony. 2-room / 51m² — one working student flatmate.\nFor women 18–30, no smoking/pets.\n💰 1840 + 590 = 2430. Deposit 2430. Direct."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/zaabhe8ozz5n1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/3frhoiipsy0g3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/f5vu15ev8tw51-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/tjzbd9lsuwvv2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/wy7dhdr8fkhe1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/8hx7sdoxmv2m3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ramzwxbxl31e3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/y468t5zemsgt3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      ac: "unknown",
      bed: "yes",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "yes",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 3
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
      "https://ireland.apollo.olxcdn.com/v1/files/vdej02xhkzal-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/6g3nup1srqaw1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/hsriaje9lzzt-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/q99pa1y6g43y-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/icnbb6yn3ag81-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/jo93hq66uait1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/fbatijdv99511-PL/image;s=1200x900"
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
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 4
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
      noOccasional: "unknown"
    },
    createdAt: 5
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
      oven: "unknown",
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
      noOccasional: "unknown"
    },
    createdAt: 6
  }
];

