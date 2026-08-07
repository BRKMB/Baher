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

// البيانات دي متجمّعة من إعلانات OLX يوم 23 يوليو 2026 — عدّل أي حاجة من الموقع نفسه
export const SEED_LISTINGS: Listing[] = [
  {
    id: "olx-1bf57p",
    propertyType: "studio",
    title: {
      ar: "ستوديو 32م² مفروش — أورسينوف، مترو Stokłosy (دقيقتين)",
      en: "Furnished 32m² studio — Ursynów, 2 min to Stokłosy metro"
    },
    district: "Ursynów",
    address: "ul. Herbsta 4, Warszawa",
    url: "https://www.olx.pl/d/oferta/do-wynajecia-kawalerka-32-3-mkw-w-pelni-umeblowana-i-wyposazona-2-minuty-od-metra-stoklosy-CID3-ID1bF57p.html",
    rent: 2700,
    bills: 350,
    garageCost: null,
    areaSqm: 32.3,
    deposit: 2700,
    commuteMin: 35,
    availableFrom: "od zaraz",
    contact: {
      ar: "Wiolka — OLX",
      en: "Wiolka — OLX"
    },
    notes: {
      ar: "ستوديو كامل التجهيز (ديش واشر بوش + فرن سامسونج). متاح دلوقتي، إيجار مباشر. المصاريف مية وكهربا تقريبًا. قريب من المترو؛ للشغل ~٣٥ دقيقة.",
      en: "Fully equipped (Bosch dishwasher + Samsung oven). Available now, direct rental. Utilities approx water+electricity. Near metro; ~35 min to work."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/v2w3n7qnzsxi-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/na4e0inm5yby2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/u67g3frxlu0k2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/n9s0y26sm5en2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/fq76i00lurud3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/f1i6gkq94fhw1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/jswo74sc2xqf-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/ijir4s3pri0d3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "no",
      spacious: "yes",
      garage: "yes",
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
    id: "olx-19oyyg",
    propertyType: "studio",
    title: {
      ar: "ستوديو 20م² ببلكونة — أورسوس (من سبتمبر)",
      en: "20m² studio with balcony — Ursus (from September)"
    },
    district: "Ursus",
    address: "Ursus, Warszawa",
    url: "https://www.olx.pl/d/oferta/kawalerka-do-wynajecia-CID3-ID19oYYG.html",
    rent: 2500,
    bills: 300,
    garageCost: null,
    areaSqm: 20,
    deposit: 2500,
    commuteMin: 48,
    availableFrom: "09/2026",
    contact: {
      ar: "Anita — OLX",
      en: "Anita — OLX"
    },
    notes: {
      ar: "⚠️ متاح من سبتمبر مش أغسطس. عمارة جديدة ومفروش، بس بعيد عن الشغل (~٤٨ دقيقة).",
      en: "⚠️ Available from September, not August. New building, furnished, but far from work (~48 min)."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/4vod5qm9rqhp-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/h70xxqml01xk1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/wcm4hi29nf701-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/4xpoctgf9sqm1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/gdwcrhjizgcs2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/taow2tj13bnl1-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "no",
      modern: "yes",
      elevator: "yes",
      availableAug: "no",
      noCommission: "yes"
    },
    createdAt: 2
  },
  {
    id: "olx-1brwpe",
    propertyType: "studio",
    title: {
      ar: "ستوديو جديد من ١ أغسطس — Instalatorów (ووخى/أوخوتا)",
      en: "New studio from Aug 1 — Instalatorów (Włochy/Ochota)"
    },
    district: "Włochy",
    address: "ul. Instalatorów 9, Warszawa",
    url: "https://www.olx.pl/d/oferta/bezposr-nowa-kawalerka-studio-od-01-08-CID3-ID1brWpe.html",
    rent: 2600,
    bills: 600,
    garageCost: null,
    areaSqm: null,
    deposit: 2600,
    commuteMin: 18,
    availableFrom: "01/08/2026",
    contact: {
      ar: "Michał — OLX",
      en: "Michał — OLX"
    },
    notes: {
      ar: "قريب من الشغل وPKP Rakowiec (~١٨ دقيقة) ✅ ديش واشر+فرن+مكتب، من غير كوميشن، متاح ١ أغسطس. الإجمالي ٢٦٠٠+٦٠٠=٣٢٠٠.",
      en: "Close to work & PKP Rakowiec (~18 min) ✅ dishwasher+oven+desk, no commission, Aug 1. Total 2600+600=3200."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/4masije2k58u1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/e7ngr5imresy2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/z1y1550f1vui-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "no",
      spacious: "no",
      garage: "yes",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes"
    },
    createdAt: 3
  },
  {
    id: "olx-1bhpyk",
    propertyType: "flat",
    title: {
      ar: "شقة بتكييف وتراس ١٨م² — أورسوس (من ١ سبتمبر)",
      en: "Flat with A/C and 18m² terrace — Ursus (from Sept 1)"
    },
    district: "Ursus",
    address: "Ursus, Warszawa",
    url: "https://www.olx.pl/d/oferta/do-wynajecia-mieszkanie-CID3-ID1bHpyk.html",
    rent: 2300,
    bills: 200,
    garageCost: null,
    areaSqm: 18,
    deposit: 3000,
    commuteMin: 45,
    availableFrom: "01/09/2026",
    contact: {
      ar: "Marzena — OLX",
      en: "Marzena — OLX"
    },
    notes: {
      ar: "⚠️ من سبتمبر. أرخص إيجار (٢٣٠٠) + ديش واشر وفرن وركنة وتراس وتكييف. النوم على ناروجنيك مش سرير؛ بعيد عن الشغل.",
      en: "⚠️ From September. Cheapest rent (2300) + dishwasher, oven, parking, terrace, A/C. Sofa bed not a real bed; far from work."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/9oa6jiuhdtyh3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/pkq58xrihlo03-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/uxyfnjgkrgfd1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/wkqzzacnga262-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/wm1bgyug355c3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/s1ode2qch0061-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/2r4r4dqttj2g1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/xl8gxy27qtnu1-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "no",
      spacious: "yes",
      garage: "yes",
      max3: "yes",
      desk: "no",
      modern: "yes",
      elevator: "yes",
      availableAug: "no",
      noCommission: "yes"
    },
    createdAt: 4
  },
  {
    id: "olx-1bdt8k",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٣٢م² دور ٨ بأسانسير — Pieskowa Skała / Kłobucka",
      en: "32m² studio 8th floor with elevator — Pieskowa Skała / Kłobucka"
    },
    district: "Ursynów",
    address: "ul. Pieskowa Skała / Kłobucka, Warszawa",
    url: "https://www.olx.pl/d/oferta/kawalerka-do-wynajecia-warszawa-ul-klobucka-32-m-m-postojowe-nowy-budynek-idealne-dla-pary-CID3-ID1bDT8K.html",
    rent: 2660,
    bills: 640,
    garageCost: null,
    areaSqm: 32.5,
    deposit: 2660,
    commuteMin: 38,
    availableFrom: "",
    contact: {
      ar: "Jacek — OLX",
      en: "Jacek — OLX"
    },
    notes: {
      ar: "مساحة كويسة وأسانسير ✅ بس غالي: ٢٦٦٠+٦٤٠=٣٣٠٠ + ركنة مدفوعة. تفاصيل المطبخ/السرير ناقصة.",
      en: "Good size + elevator ✅ but pricey: 2660+640=3300 + paid parking. Kitchen/bed details unclear."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/2wabvksedory2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/uc0omz00bjv42-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/lpb6igvz2hak-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/3igadh5g73x1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/zs22spe0kgxf3-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/r9koqcn7loag2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/zchp0f7tm7y61-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      bed: "no",
      spacious: "yes",
      garage: "no",
      max3: "yes",
      desk: "no",
      modern: "yes",
      elevator: "yes",
      availableAug: "unknown",
      noCommission: "yes"
    },
    createdAt: 5
  }
];
