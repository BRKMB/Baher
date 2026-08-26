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

// البيانات دي متجمّعة من إعلانات Otodom/OLX يوم 26 أغسطس 2026
export const SEED_LISTINGS: Listing[] = 
[
  {
    id: "oto-4cghh",
    propertyType: "studio",
    title: {
      ar: "ستوديو مودرن ٢٣م² pets + من غير كوميشن — Woronicza، Mokotów",
      en: "Modern ~23m² studio, pets, no commission — Woronicza, Mokotów"
    },
    district: "Mokotów",
    address: "ul. Jana Pawła Woronicza 82, Mokotów, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/nowoczesna-kawalerka-pets-friendly-bez-prowizji-od-zaraz-ID4CGhh",
    rent: 2936,
    bills: 264,
    garageCost: null,
    areaSqm: 23,
    deposit: null,
    commuteMin: 22,
    availableFrom: "Available now",
    contact: {
      ar: "Vantage Rent — Otodom",
      en: "Vantage Rent — Otodom"
    },
    notes: {
      ar: "✅ من غير كوميشن/وسطاء. حيوانات مسموحة. فرن+ديش واشر+سرير+كنبة. أسانسير، دور ٥، مبنى ٢٠٢٥.\n⚠️ الإدارة ٢٦٤ رخيصة ظاهرًا — بس الموية (سخنة/باردة) والتدفئة والكهربا والصرف والزبالة حسب العدادات منفصلة (مش ضمن الـ ٢٦٤).\n🅿️ باركنج جراج متاح كخدمة مدفوعة.\nأقصى إقامة ١٢ شهر. الصور نموذجية مش الشقة نفسها.",
      en: "✅ No commission/agents. Pets OK. Oven+dishwasher+bed+sofa. Elevator, floor 5, building 2025.\n⚠️ Admin 264 looks low — hot/cold water, heating, electricity, sewage & trash are billed by submeters separately (NOT included in 264).\n🅿️ Paid underground parking available.\nMax stay 12 months. Gallery photos are show-unit examples."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Im41ZnN2bWl6Yjd3YS1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.9GYANpZ1Gcxmjte1vdtDC1YC3Q2HEClUDszaaSbiBG8/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImQycWRwNnNzN2o2bTItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.yf0HgdMnXc4iKo65O_hNk3T-e-b5ABFgo8v5jaRqE8U/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImxjMTB1Y3lidXpjYTItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.6vdcYmYutxO5PmmO2GwGUTKH0PHMIcT-owJPameQ8xg/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Ims5eHBmbHdndmxrdDEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.38oo5rOhxGnMeYJC7X-LSLmnuNNAuj7Kvra7ycqyBDs/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjNla2lqdDVhc2txMDMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.uMgTS-BjQKuuGUj3xmMLHqBXFZ4zi4Noe8B9b2TsSxI/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImZmZWkwdWg5ZXdwdDEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.Puw8r6AnsPcjp3B21JZyA-HkkPX2eOwKpGL1_CRJxNI/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImwydDE2M2w2eTFkOTItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.jZZNA5YP-RYjMtcaDRMSfgT1NEN99OzXalSmgFhDfhg/image;s=2048x1536;q=80"
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
    createdAt: 1,
    extrasEst: 315,
    extrasNote: {
      ar: "⚠️ الإدارة ٢٦٤ مش شاملة العدادات.\nتقريبي لشخص واحد (متوسط السنة):\n⚡ كهربا ~١٣٠ + 💧 موية سخنة/باردة وصرف ~٥٠ + 🔥 تدفئة ~١١٠ + 🗑️ زبالة ~٢٥ = ~٣١٥.\nده أعلى إضافي لأن كله عدّادات منفصلة.",
      en: "⚠️ Admin 264 does NOT include meters.\nSolo estimate (year avg):\n⚡ Electricity ~130 + 💧 hot/cold water & sewage ~50 + 🔥 heating ~110 + 🗑️ trash ~25 = ~315.\nHighest extras — almost everything is submetered."
    }
  },
  {
    id: "oto-4ckvm",
    propertyType: "flat",
    title: {
      ar: "شقة ٢ أوضة ٣٦.٥م² بمطبخ منفصل — Świętochowskiego، Bemowo",
      en: "2-room 36.5m² with separate kitchen — Świętochowskiego, Bemowo"
    },
    district: "Bemowo",
    address: "ul. Aleksandra Świętochowskiego, Bemowo, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/2-pokojowe-z-oddzielna-kuchnia-bemowo-blisko-metra-ID4CKvM",
    rent: 2700,
    bills: 600,
    garageCost: null,
    areaSqm: 37,
    deposit: 3000,
    commuteMin: 40,
    availableFrom: "01/09/2026",
    contact: {
      ar: "Jacek — Otodom",
      en: "Jacek — Otodom"
    },
    notes: {
      ar: "✅ مباشر من المالك. مطبخ منفصل، لوجيا كبيرة، دور ٨، مفروش بعد طلاء جديد. من غير تدخين/حيوانات.\n💰 إيجار ٢٧٠٠ + تعاونية ~٦٠٠ (فيها مقدم تدفئة+موية+زبالة؛ الغاز حسب الاستهلاك) + الكهرباء منفصلة.\n🅿️ باركنج عند العمارة / محروس قريب.\nمتاح من ١ سبتمبر.",
      en: "✅ Direct from owner. Separate kitchen, large loggia, floor 8, freshly painted & furnished. No smoking/pets.\n💰 Rent 2700 + coop ~600 (includes heating/water/trash advances; gas by usage) + electricity separate.\n🅿️ Parking at building / nearby guarded lot.\nAvailable from Sept 1."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InBwM2RxOTBkY29scTEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.nlwprNMsHndWQxwt__5ah6dgV1WMjPs5SO8rtemFvIs/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Ijg2cXk0aHRvMG15NjMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.KX6ZLJ9a-J2XD9qs065C0xaCKTcALF1FYpHVYqLcyvc/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjRscHV0aWU0MW83MTMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.-8VAs2LQvuRusWT6bQTTGD17HxZ6MnSSgOoC1ukQx4I/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImJxZXRvYnF1azBkNzMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.doIKLoAcSVoGJYlgqS1kHiFJ4tT3A6dG3KYbvCqsR5U/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImVoOGhhaGcxbXZ2MDItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.PUXugNJnB9szCZeCi_GJ2CZ4RWjFEwW0CySAjqLN3k0/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InY2MzBzbXo3YTV2aTItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.B2kNI-bYrJ130av1lUPJP8ZGIK5MPhkQFenQG7FrdAo/image;s=2048x1536;q=80"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      bed: "unknown",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 2,
    extrasEst: 170,
    extrasNote: {
      ar: "تقريبي لشخص واحد (متوسط السنة):\n⚡ كهربا ~١٤٠ + 🔥 غاز حسب الاستهلاك ~٣٠ = ~١٧٠.\nالتعاونية ٦٠٠ فيها مقدم تدفئة+موية+زبالة.",
      en: "Solo estimate (year avg):\n⚡ Electricity ~140 + 🔥 gas by usage ~30 = ~170.\nCoop 600 already includes heating/water/trash advances."
    }
  },
  {
    id: "oto-4ci9q",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٢٧م² بمطبخ منفصل ولوجيا — Człuchowska، Bemowo",
      en: "27m² studio with separate kitchen + loggia — Człuchowska, Bemowo"
    },
    district: "Bemowo",
    address: "ul. Człuchowska 35A, Bemowo, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/bezposrednio-kawalerka-na-nowym-osiedlu-ID4CI9q",
    rent: 2650,
    bills: 510,
    garageCost: null,
    areaSqm: 27,
    deposit: 3000,
    commuteMin: 38,
    availableFrom: "01/09/2026",
    contact: {
      ar: "Owner — Otodom",
      en: "Owner — Otodom"
    },
    notes: {
      ar: "✅ مباشر، من غير وسطاء. مطبخ منفصل، لوجيا مسقوفة، دور ٨ (٢٠٢٠)، ديش واشر+فرن. كنبة سرير. لشخصين، من غير تدخين/حيوانات.\n💰 إيجار ٢٦٥٠ + إدارة ٥١٠ (فيها مقدم مرافق) + الكهرباء منفصلة.\nمتاح من ١ سبتمبر.",
      en: "✅ Direct, no agents. Separate kitchen, covered loggia, floor 8 (2020), dishwasher+oven. Sofa bed. For a couple, no smoking/pets.\n💰 Rent 2650 + admin 510 (includes media advances) + electricity separate.\nAvailable from Sept 1."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjdmdGRtcmRyOTUwbTMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.SxVHzYU7L7iYt5TFytPWliBErE7Lxsn19Oijp57GUbw/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImJiZzJvZzJhdjM3YzMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.xeYCBxxak7t1TvJ6cX1P4lCJg0AbLk_v9VrEsioIqLo/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImliamxqOXE3MGJ0bC1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.zl7q9TUgKtYVwQziMORw9e-XSnmKMzalxJU6LCJCGnE/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Ijk1cndvOHlwbXNkbS1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.iKfahaqUVZowmdipNumoOM0L3fOzdb5meCUGWLvBtgs/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InJweXFlNWRjZTh4dDEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.61o5_TU-r32TtQjvFjSHzE1uWTZwYoUEetN6o5ALE5w/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImN6aXhvOGdib2o4czMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.phK5h_Cbox00JQLuYcHGv7SCOrnOReJ9E5y8OLTuxMY/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImE2Y2gwZnUwaHh1cjEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.6k3uljm1ATPspER5q9EtEE540NEgISRxact4cG8Sh4Q/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjdkbjE5bDRhaWIxaDMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.r0fmfOR51HD6o7zOt9ZgF5rM6hXFADdA7wBkPL1szxg/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InVzODVvbzdzd3lvcy1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.5XN_Cp_eZeg5e3s1UoFfh4mUBamir57VzfRkJc2IMkg/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImJpYTQ2Y3MweWZjMTItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.zHOfqvKjQX9COrJ9q1A5jLmvjXn9EOqaB8s8tKGYPBU/image;s=2048x1536;q=80"
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
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 3,
    extrasEst: 140,
    extrasNote: {
      ar: "تقريبي لشخص واحد (متوسط السنة):\n⚡ كهربا فقط ~١٤٠.\nالإدارة ٥١٠ فيها مقدم مرافق (media) — فالإضافي الأساسي الكهرباء.",
      en: "Solo estimate (year avg):\n⚡ Electricity only ~140.\nAdmin 510 includes media advances — main extra is electricity."
    }
  },
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
      noOccasional: "unknown"
    },
    createdAt: 4
  },
  {
    id: "oto-4cmfc",
    propertyType: "studio",
    title: {
      ar: "شقة/ستوديو ٣٨م² مفروشة — Śródmieście",
      en: "Furnished 38m² flat/studio — Śródmieście"
    },
    district: "Śródmieście",
    address: "Śródmieście, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/mieszkanie-38-m-w-srodmiesciu-w-pelni-wyposazone-ID4CMFC",
    rent: 2490,
    bills: null,
    garageCost: null,
    extrasEst: 250,
    extrasNote: {
      ar: "⚠️ الإعلان مش بيوضح الإدارة/المرافق.\nتقدير تقريبي لشخص واحد فوق الإيجار ~٢٥٠ (إدارة+كهربا/موية) — اسأل Freya عن الفاتورة الحقيقية.",
      en: "⚠️ Ad does not spell out admin/utilities.\nRough solo estimate ~250 on top of rent (admin+power/water) — ask Freya for real bills."
    },
    areaSqm: 38,
    deposit: null,
    commuteMin: 30,
    availableFrom: {
      ar: "اسأل المعلن",
      en: "Ask landlord"
    },
    contact: {
      ar: "Freya — Otodom",
      en: "Freya — Otodom"
    },
    notes: {
      ar: "مباشر/فردي. دور ٣، ديش واشر، غسالة، TV، تدفئة مركزية.\n⚠️ الإيجار ٢٤٩٠ بس — الإدارة والمرافق مش مذكورة (الديبوزيت ١١٠ في Otodom غالبًا غلط).\n❓ عقد/occasional مش مذكور.",
      en: "Private listing. Floor 3, dishwasher, washer, TV, district heating.\n⚠️ Rent 2490 only — admin/utilities not stated (Otodom deposit 110 looks wrong).\n❓ Contract / occasional not stated."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InlqZG03MDdnc2hlZi1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.tTvu0hP_f8RcEu_3INFjTpbcVvR9NuCBC5nTSY3pol0/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImNjMTA5cmVqeGxyYzMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.rmG4WRHBOfCrxbkSsi8E0cISDHv0wxpcXmW1GK4jwzk/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Imw2aDd5MHRlcHE3bTEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.BoC5emyfHFUQFWYcDYgiDiUg17ueYl1NArxH6KCTjoU/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjdocHJramV3b2g5bzItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.MFrVqjh-eSSEouzw0f5DgqNWh04lMNioMjmWZP0EibM/image;s=2048x1536;q=80"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "yes",
      bed: "unknown",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 5
  },
  {
    id: "olx-1bgjac",
    propertyType: "studio",
    title: {
      ar: "ستوديو جديد ديش واشر+فرن — Jutrzenki / Blue City",
      en: "New studio with dishwasher+oven — Jutrzenki / Blue City"
    },
    district: "Włochy",
    address: "ul. Jutrzenki 182, Włochy, Warszawa",
    url: "https://www.olx.pl/d/oferta/eng-skm-blue-city-bezposrednio-nowa-kawalerka-od-31-08-tv-piekarnik-zmywarka-wlochy-CID3-ID1bGJaC.html",
    rent: 2900,
    bills: 550,
    garageCost: null,
    extrasEst: 0,
    extrasNote: {
      ar: "✅ المرافق ٥٥٠ شاملة تقريبًا كل حاجة لشخص واحد (كهربا+موية+زبالة+تدفئة+إنترنت).\nلزوجين ٦٧٠. مفيش إضافي متوقع فوق كده غير لو الاستهلاك عالي.",
      en: "✅ Media 550 for 1 person covers basically everything (power+water+trash+heating+fiber).\nCouple 670. No expected extras beyond that unless heavy usage."
    },
    areaSqm: 22,
    deposit: 3500,
    commuteMin: 17,
    availableFrom: "31/08/2026",
    contact: {
      ar: "Konrad — OLX",
      en: "Konrad — OLX"
    },
    notes: {
      ar: "✅ مباشر. أول إيجار من ٣١ أغسطس. ديش واشر+فرن+TV. كنبة سرير. مجمع محروس. باركنج مجاني في الكمبوند؛ جراج تحت الأرض اختياري.\n💰 ٢٩٠٠ + مرافق ٥٥٠ (شامل). من غير تدخين/حيوانات.",
      en: "✅ Direct. First rental from Aug 31. Dishwasher+oven+TV. Sofa bed. Gated estate. Free on-site parking; optional underground garage.\n💰 2900 + media 550 (all-in). No smoking/pets."
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
      garage: "yes",
      max3: "yes",
      desk: "yes",
      modern: "yes",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 6
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
      modern: "yes",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 7
  },
  {
    id: "olx-1c0xee",
    propertyType: "flat",
    title: {
      ar: "شقة ٢ أوضة ببلكونة — Zdziechowskiego، Mokotów",
      en: "2-room flat with balcony — Zdziechowskiego, Mokotów"
    },
    district: "Mokotów",
    address: "ul. Zdziechowskiego, Mokotów, Warszawa",
    url: "https://www.olx.pl/d/oferta/wynajme-mieszkanie-2-pokojowe-mokotow-ul-zdziechowskiego-CID3-ID1c0XEe.html",
    rent: 2700,
    bills: null,
    garageCost: null,
    extrasEst: 200,
    extrasNote: {
      ar: "⚠️ مبلغ الإدارة (czynsz) مش مكتوب.\nتقدير تقريبي فوق الإيجار: إدارة+مرافق ~٦٠٠–٩٠٠؛ حاطين ~٢٠٠ كحد أدنى للكهربا فقط لحد ما تسأل.",
      en: "⚠️ Admin (czynsz) amount not stated.\nRough add-on: admin+utilities often ~600–900; using ~200 as electricity-only floor until you ask."
    },
    areaSqm: null,
    deposit: 3000,
    commuteMin: 22,
    availableFrom: "Available now",
    contact: {
      ar: "Elżbieta — OLX",
      en: "Elżbieta — OLX"
    },
    notes: {
      ar: "✅ مباشر. عمارة جديدة، دور ٢، أسانسير، بلكونة. مترو Wierzbno ~١٠ دقايق مشي. من غير حيوانات.\n💰 ٢٧٠٠ + إدارة (المبلغ مش مذكور) + ديبوزيت ٣٠٠٠.\n❓ الأجهزة/المساحة مش مفصّلة.",
      en: "✅ Direct. New building, floor 2, elevator, balcony. Metro Wierzbno ~10 min walk. No pets.\n💰 2700 + admin (amount not stated) + deposit 3000.\n❓ Appliances/area not detailed."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/sg9p2vk8tzx1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/6gjlu455oix-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/0pbig9xnyao-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/fndd11n09pp32-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/mgngexw2s69t-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/hmi0rdajvlxk1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/0b2vb1zc15q13-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/cfoldb7agdp13-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
      bed: "unknown",
      spacious: "unknown",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 8
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
      elevator: "unknown",
      availableAug: "unknown",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 9
  },
  {
    id: "olx-1c01d8",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٢٩م² ببلكونة — Jana Kazimierza، Wola",
      en: "29m² studio with balcony — Jana Kazimierza, Wola"
    },
    district: "Wola",
    address: "ul. Jana Kazimierza, Wola, Warszawa",
    url: "https://www.olx.pl/d/oferta/kawalerka-29m2-bezposrednio-przy-jana-kazimierza-CID3-ID1c01d8.html",
    rent: 2700,
    bills: 500,
    garageCost: null,
    extrasEst: 140,
    extrasNote: {
      ar: "تقريبي لشخص واحد:\n⚡ كهربا حسب الاستهلاك ~١٤٠.\nالإدارة ٥٠٠ فيها مقدم موية+تدفئة+صندوق صيانة.",
      en: "Solo estimate:\n⚡ Electricity by usage ~140.\nAdmin 500 includes water/heating/renovation-fund advances."
    },
    areaSqm: 29,
    deposit: 2700,
    commuteMin: 36,
    availableFrom: "Available now",
    contact: {
      ar: "Cezary — OLX",
      en: "Cezary — OLX"
    },
    notes: {
      ar: "✅ مباشر (مفيش وكالات). بلكونة ٨م²، كنبة سرير، بوتاجاز حثي+ميكروويف. من غير فرن/ديش واشر مذكور.\n💰 ٢٧٠٠ + إدارة ٥٠٠ + كهربا عدّاد.",
      en: "✅ Direct (no agencies). 8m² balcony, sofa bed, induction+microwave. No oven/dishwasher listed.\n💰 2700 + admin 500 + electricity by meter."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/84egq8h423ul2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/sfj9a85sdev92-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/5icqfp56yxco-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/xh854tibi5wl2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/t4qp232yhhqz-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/0p2p1cz4279v2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/lzdgzb0jawlb3-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "no",
      dishwasher: "unknown",
      bed: "no",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 10
  },
  {
    id: "olx-1bz5sd",
    propertyType: "studio",
    title: {
      ar: "ستوديو عند Żelazna / Chmielna — Śródmieście",
      en: "Studio at Żelazna / Chmielna — Śródmieście"
    },
    district: "Śródmieście",
    address: "ul. Żelazna 27, Śródmieście, Warszawa",
    url: "https://www.olx.pl/d/oferta/kawalerka-na-ul-zelaznej-studio-flat-to-rent-in-warsaw-center-CID3-ID1bZ5sd.html",
    rent: 2300,
    bills: 550,
    garageCost: null,
    extrasEst: 120,
    extrasNote: {
      ar: "تقريبي لشخص واحد:\n⚡🔥 كهربا+غاز ~١٢٠ (الإعلان قال ١٥٠–٢٠٠ لشخصين).\nالإدارة ٥٥٠ منفصلة. قبو ضمن العرض.",
      en: "Solo estimate:\n⚡🔥 Electricity+gas ~120 (ad says 150–200 for two people).\nAdmin 550 separate. Cellar included."
    },
    areaSqm: null,
    deposit: 2300,
    commuteMin: 28,
    availableFrom: "29/08/2026",
    contact: {
      ar: "Maks — OLX",
      en: "Maks — OLX"
    },
    notes: {
      ar: "✅ مباشر. فرن+بوتاجاز+غسالة+TV. قبو. هادي على فناء داخلي. قريب Rondo ONZ وCentralna. من غير تدخين. عقد سنة + إثبات دخل.\n💰 ٢٣٠٠ + إدارة ٥٥٠ + عدّادات.\nمتاح من ٢٩ أغسطس.",
      en: "✅ Direct. Oven+stove+washer+TV. Cellar. Quiet courtyard. Near Rondo ONZ & Centralna. No smoking. 1-year lease + income proof.\n💰 2300 + admin 550 + meters.\nAvailable from Aug 29."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/oq3hyo3k1ldj-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/4ynsxwivc1ys2-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/rjrgieqrle2e1-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/lwegvwp7qez21-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/yjlhi5p1ez673-PL/image;s=1200x900",
      "https://ireland.apollo.olxcdn.com/v1/files/xfkjq0ao8epd1-PL/image;s=1200x900"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "unknown",
      bed: "unknown",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 11
  }
];
