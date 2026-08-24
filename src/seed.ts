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

// البيانات دي متجمّعة من إعلانات Otodom يوم 24 أغسطس 2026 — عدّل أي حاجة من الموقع نفسه
export const SEED_LISTINGS: Listing[] = 
[
  {
    id: "oto-4ckbk",
    propertyType: "flat",
    title: {
      ar: "شقة ٢ أوضة ٤٢م² تكييف+مترو — Sienna، Wola",
      en: "2-room 42m² flat with AC + metro — Sienna, Wola"
    },
    district: "Wola",
    address: "ul. Sienna, Wola, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/2-pok-mieszkanie-wola-42m-metro-rondo-onz-ul-sienna-klima-garaz-ID4CKBK",
    rent: 2500,
    bills: 700,
    garageCost: 300,
    areaSqm: 42,
    deposit: 3200,
    commuteMin: 36,
    availableFrom: "Available now",
    contact: {
      ar: "Biuro Nieruchomości — Otodom",
      en: "Biuro Nieruchomości — Otodom"
    },
    notes: {
      ar: "📌 عمولة وكالة مرة واحدة: ٤٠٠ زلوتي (Real Estate Office).\n✅ تكييف في الصالة. أسانسير دور ٧، بلكونة، مترو Rondo ONZ، خلية، مجمع محروس. ديش واشر+فرن. حيوانات OK.\n💰 إيجار ٢٥٠٠ + إدارة ٧٠٠. الكهرباء حسب العداد (مش ضمن الإدارة).\n🅿️ جراج اختياري +٣٠٠.\n❓ نوع العقد مش مذكور صراحة.",
      en: "📌 One-time agency fee: 400 zł (Real Estate Office).\n✅ AC in living room. Elevator floor 7, balcony, metro Rondo ONZ, storage, gated estate. Dishwasher+oven. Pets OK.\n💰 Rent 2500 + admin 700. Electricity by meter (NOT included in admin).\n🅿️ Optional garage +300.\n❓ Contract type not clearly stated."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjZqcnE2MnlwZHhvcjMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.zbJ3tIl7jNnBP2afc7SJmOGzBrnyte2mj9hQCrMTrPk/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImtoeThtNGVmcHJydTEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.YOlD9cXvi6XyOO16FdmWGh3G1mmZPdV5mN71zD8gqh8/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImUwcHRpM3hucmlmeTEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.lOsULJdbLBvnrLl--pz8JxMqWeVplDImjJFcMUuqTI0/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Im15bndybjJ4b296eDEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.7rU9T0Uxd0ljz0IIhdSsJfYky8t7VrcsbANsXBo2Bwc/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Imx4anExaWc4MmV5azEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.K20caj79k83WPn_vO1CxT1rwohopo7-K5r9z_g9riwQ/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InB5Mjh3NW91bWdqYjItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.Sxvw6cbUZo0gZ70o3PnzncJNYevWBQ9jEC_iEfudZUo/image;s=2048x1536;q=80"
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
      noCommission: "no",
      noOccasional: "unknown"
    },
    createdAt: 1
  },
  {
    id: "oto-4ckbs",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٣٣م² مترو Racławicka — Wiktorska، Mokotów",
      en: "33m² studio near metro Racławicka — Wiktorska, Mokotów"
    },
    district: "Mokotów",
    address: "ul. Wiktorska, Mokotów, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/1-pok-33m-metro-raclawicka-ul-wiktorska-mokotow-sgh-ID4CKBS",
    rent: 2000,
    bills: 600,
    garageCost: 300,
    areaSqm: 33,
    deposit: 2600,
    commuteMin: 28,
    availableFrom: "Available now",
    contact: {
      ar: "Biuro Nieruchomości — Otodom",
      en: "Biuro Nieruchomości — Otodom"
    },
    notes: {
      ar: "⚠️ إيجار مؤقت (najem okazjonalny) — رسوم الموثق على المالك.\n📌 عمولة وكالة مرة واحدة: ٤٠٠ زلوتي.\n💰 إيجار ٢٠٠٠ + إدارة ٦٠٠. الكهرباء والموية حسب العداد (مش ضمن الإدارة).\nكنبة سرير (مفيش سرير حقيقي). ديش واشر+فرن. أسانسير، خلية، حيوانات OK.\n🅿️ جراج اختياري +٣٠٠.",
      en: "⚠️ Occasional lease (najem okazjonalny) — notary paid by landlord.\n📌 One-time agency fee: 400 zł.\n💰 Rent 2000 + admin 600. Electricity & water by meter (NOT included in admin).\nSofa bed (no real bed). Dishwasher+oven. Elevator, storage, pets OK.\n🅿️ Optional garage +300."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImZ5aGhtc2kwbW40MjEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.WciY36P1Wh4a1RcWs2CZU6x9y7zQLETbgiswuccLHaY/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImZmZ25wb20xMjdoeDItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.CpXRF7damU1XP4JQMSix7-FGqJanAB1Ad5HMdrh5MiM/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Im1jd3U3Y3JxaXAydzItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.v81IDQ7teNQrh-iTE-N-ulsF8-7QYeU_-5CeaFqkSLg/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjVmdzF1NDVhNmZvOTMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.tL8N8LiF-w-G2I-LElhRQoXR6Izk1lS1nXiAae2P-Yg/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImFwNWNsZzhqZWI1azItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.ZEWISLNcE-_CYzuKDUOFa_Jx8F-7y4onMQd7Uq8qT8I/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjA1anhhZHdib3Z3ajItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.iTIwP7yDyP_GZJ2TaJvzsIZdPI6YPVEwdcaE17IcrMw/image;s=2048x1536;q=80"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "no",
      spacious: "yes",
      garage: "no",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "no",
      noOccasional: "no"
    },
    createdAt: 2
  },
  {
    id: "oto-4ckn1",
    propertyType: "flat",
    title: {
      ar: "شقة ٢ أوضة ٤٦م² أوض منفصلة — Włodarzewska، Ochota",
      en: "2-room 46m² flat, separate rooms — Włodarzewska, Ochota"
    },
    district: "Ochota",
    address: "ul. Włodarzewska, Ochota, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/2-pok-46m-ochota-ul-wlodarzewska-oddzielne-pokoje-winda-ID4CKN1",
    rent: 2500,
    bills: 700,
    garageCost: null,
    areaSqm: 46,
    deposit: 3500,
    commuteMin: 18,
    availableFrom: "Available now",
    contact: {
      ar: "Biuro Nieruchomości — Otodom",
      en: "Biuro Nieruchomości — Otodom"
    },
    notes: {
      ar: "📌 عمولة وكالة مرة واحدة: ٤٠٠ زلوتي.\n✅ مطبخ منفصل، أوض مش مفتوحة على بعض، سرير ١٦٠×٢٠٠، بلكونة، أسانسير دور ٦، خلية. ديش واشر+فرن. قريب Blue City وPark Szczęśliwicki.\n💰 إيجار ٢٥٠٠ + إدارة ٧٠٠. الكهرباء والموية حسب العداد.\n🅿️ باركنج عام عند العمارة (مش جراج مضمون).\n❓ نوع العقد مش مذكور صراحة.",
      en: "📌 One-time agency fee: 400 zł.\n✅ Separate kitchen, non-walk-through rooms, 160×200 bed, balcony, elevator floor 6, storage. Dishwasher+oven. Near Blue City & Park Szczęśliwicki.\n💰 Rent 2500 + admin 700. Electricity & water by meter.\n🅿️ Street/shared parking at building (not a reserved garage).\n❓ Contract type not clearly stated."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjUxdWE2MmpiNTNzYS1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.6DWtPF2GbehUMV5KeApdkS_CaCw943UGE2wfdMMS-jI/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InY1dHZydTJ5ZHQ4dzItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.8jeCiC49ew-ipU96ZSDMvzla0QVM3JQRC8DrjQuJ_mE/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImhhZ3Z6NTZ6dGx4bDItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.rTw5mI5w0A7msfE9uvyH84dvwrRaTLCJ5461P5QzOzo/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImY5MXR2bnhsam1zMzMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.eqFoub2kPJj3t-2lYI1YTuUf_duOdVMcsI4gwZAzJuk/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InZpMjllODEzanJoZzItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.TZ64wrQrbEkiaAedSvXSy8d4jW5BzAU4TqR8W5j-iB8/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InoyNWo0ajNweGNzNTEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.OiMZLKLlOryW-5xRLWNY0QvVpkKjvssmf9wd-PcM2RA/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InB5dmt2OHNrb2c1aTMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.jIQEm2epymlfgwDbLux9LAttiotpuqvHJhlt4Es6jAg/image;s=2048x1536;q=80"
    ],
    criteria: {
      oven: "yes",
      dishwasher: "yes",
      bed: "yes",
      spacious: "yes",
      garage: "unknown",
      max3: "yes",
      desk: "unknown",
      modern: "yes",
      elevator: "yes",
      availableAug: "yes",
      noCommission: "no",
      noOccasional: "unknown"
    },
    createdAt: 3
  },
  {
    id: "oto-4cfwz",
    propertyType: "flat",
    title: {
      ar: "شقة ٢ أوضة ٤٨م² تكييف+بلكونة — Mokosfera، Mokotów",
      en: "2-room 48m² flat with AC + balcony — Mokosfera, Mokotów"
    },
    district: "Mokotów",
    address: "ul. Racjonalizacji, Mokosfera, Mokotów, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/2-pokoje-48-m-mokotow-mokosfera-klimatyzacja-balkon-garaz-ID4CFWz",
    rent: 2500,
    bills: 700,
    garageCost: 300,
    areaSqm: 48,
    deposit: 3200,
    commuteMin: 16,
    availableFrom: "Available now",
    contact: {
      ar: "Biuro Nieruchomości — Otodom",
      en: "Biuro Nieruchomości — Otodom"
    },
    notes: {
      ar: "📌 عمولة وكالة مرة واحدة: ٤٠٠ زلوتي.\n✅ تكييف في الصالة. بلكونة من الصالة والنوم، مجمع Mokosfera محروس، أسانسير. ديش واشر+فرن. قريب Służewiec / Westfield.\n💰 إيجار ٢٥٠٠ + إدارة ٧٠٠. الكهرباء والموية حسب العداد.\n🅿️ جراج اختياري +٣٠٠.\n❓ نوع العقد مش مذكور صراحة.",
      en: "📌 One-time agency fee: 400 zł.\n✅ AC in living room. Balcony from living + bedroom, gated Mokosfera, elevator. Dishwasher+oven. Near Służewiec / Westfield.\n💰 Rent 2500 + admin 700. Electricity & water by meter.\n🅿️ Optional garage +300.\n❓ Contract type not clearly stated."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjBkbTV1bmJ3cWxqajEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.q2U1JiIp7j0CchXkOdO53amVldeEISK0kAo7xlfaS08/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjkzOWI2aWxsMWhoNDEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.XpMfENmkB9X99DPL0YdwdSaBFhm-D-esLVGLnsfYn8I/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Imw1b2d5NWtwaXl6MS1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.Ufhla1OsMAiPIiczkrUhcNKZrDInXQwyN_e_kyMvCBc/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjRsZHljMjc2bWVkNDEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0._YxlU9NZMmI3dAzShN-iSuqqTxEzn7e5BsRYD6oeVqo/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Ijh6anl1d3VlbzQ5bDItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.jhS8908XLayA4ozTjvFHm5ugx3e0Q9WXo0nC7G-l7sI/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImtqMG1jd2NxdmE2djEtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.Webp-vh6fd1t5Poj9QkXelE4jksLMibrbt5Sub0o3Tk/image;s=2048x1536;q=80"
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
      noCommission: "no",
      noOccasional: "unknown"
    },
    createdAt: 4
  },
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
    createdAt: 5
  },
  {
    id: "oto-4cgq3",
    propertyType: "flat",
    title: {
      ar: "شقة ٢ أوضة ٣٥م² بتراس جنب المترو — Tobruku، Bemowo",
      en: "Cozy 2-room 35m² with terrace near metro — Tobruku, Bemowo"
    },
    district: "Bemowo",
    address: "ul. Obrońców Tobruku, Bemowo, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/przytulne-2-pokojowe-mieszkanie-z-tarasem-blisko-metra-ID4CGq3",
    rent: 2300,
    bills: 900,
    garageCost: 300,
    areaSqm: 35,
    deposit: 3500,
    commuteMin: 42,
    availableFrom: "Available now",
    contact: {
      ar: "Hanna — Otodom",
      en: "Hanna — Otodom"
    },
    notes: {
      ar: "✅ مباشر من المالك، من غير رسوم زيادة. تراس واسع، دور أرضي، مجمع محروس جنب Fort Bema.\n💰 إيجار ٢٣٠٠ + إدارة ٩٠٠ + الكهرباء منفصلة.\n🅿️ جراج تحت الأرض +٣٠٠ (مش ضمن السعر).\n❓ أجهزة المطبخ/التكييف مش مذكورة بالتفصيل.",
      en: "✅ Direct from owner, no extra fees. Large terrace, ground floor, gated estate by Fort Bema.\n💰 Rent 2300 + admin 900 + electricity separate.\n🅿️ Underground garage +300 (not included).\n❓ Kitchen appliances / AC not detailed."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImZ3bXcxNGpzdDBvZS1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.NHllvMzK7jLWrh093A7XBtM5eAjo5qL9IoSrId-QWvk/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Im92eW0wNHVlZzIwcjMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.DOX49_UlGFrzuA9z72THiqpyWmYnzh6uSYD9eK-w-eI/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Iml5bG1yaGwwNDk4NzMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.eVKVuk84eave3za0xRJw1Ll4WV2qPRaVHWx_ze44EKk/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjJ6dGY0djlyOWNsbTMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.gOCfRyO51ti2N2B6CzQnQ9WIpChXin9_6vc8xCITBTg/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjVnYXc5cWZjdnd3dDItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.eYc4A293FgZb7Yw1HmADrIsTFuLfup2QSsI1Ty5X7Ak/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjF5YWIwMXJ6aW5jZTMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.xbSmLuQ9Ww4N8IgiE1ERIuUodXprin1YPJ_pZegyjDM/image;s=2048x1536;q=80"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
      bed: "unknown",
      spacious: "yes",
      garage: "no",
      max3: "yes",
      desk: "unknown",
      modern: "unknown",
      elevator: "unknown",
      availableAug: "yes",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 6
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
      oven: "unknown",
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
    createdAt: 7
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
      elevator: "unknown",
      availableAug: "no",
      noCommission: "yes",
      noOccasional: "unknown"
    },
    createdAt: 8
  },
  {
    id: "oto-4ckfu",
    propertyType: "studio",
    title: {
      ar: "ستوديو ٢٢م² عند Plac Zawiszy — Grójecka / Wola",
      en: "22m² studio at Plac Zawiszy — Grójecka / Wola"
    },
    district: "Wola",
    address: "ul. Grójecka 14A, Plac Zawiszy, Wola, Warszawa",
    url: "https://www.otodom.pl/pl/oferta/kawalerka-plac-zawiszy-metro-tramwaj-ID4CKFU",
    rent: 2485,
    bills: 315,
    garageCost: null,
    areaSqm: 22,
    deposit: 2900,
    commuteMin: 28,
    availableFrom: "01/09/2026",
    contact: {
      ar: "Sebastian — Otodom",
      en: "Sebastian — Otodom"
    },
    notes: {
      ar: "✅ مباشر. بعد ترميم، أسانسير دور ٤، مراقبة. قريب مترو Rondo Daszyńskiego وترام.\n💰 إيجار ٢٤٨٥ + إدارة ٣١٥ (لشخص واحد) + الكهرباء حسب الاستهلاك.\n❓ فرن/ديش واشر مش مذكورين. كنبة.\nمتاح من ١ سبتمبر.",
      en: "✅ Direct. Renovated, elevator floor 4, building CCTV. Near metro Rondo Daszyńskiego & tram.\n💰 Rent 2485 + admin 315 (for 1 person) + electricity by usage.\n❓ Oven/dishwasher not listed. Sofa.\nAvailable from Sept 1."
    },
    photos: [
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjV5YWVmeWY5emhxMTItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.YXt9AODes8A3GIrvfj60923yskb1Ry40Lv2Re-QxkRs/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Ijl6a2hmcnlhbHV0dTItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.gi0wgcyV3-XSd26TlMmnQUSkj-l48hbP0qqmnnZgD4c/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InQ0aTdodmtvbHZvbC1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.pFuy1YQPrFXc0Bkl65jXVS7DdiObjDV5G8lKqgrEU7Y/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Ijc0bmw4OXJuOHZpZDItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.TVEQEkPzjbVrLpPLiozLR2Ea9sqllcarcGUeLRaf6mY/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Ijkyd3JrYXpuZG9kbDItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.TPIApNBUMBe5lqpAoHzYOu8DKHTXf9CvJdR8WkwYQAI/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Ijc0Mm84b3F0d212MDMtQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.rkpfIWzyVMBi5eNStHU21-PYlklUB5MhvpEbfPaDZ-0/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6InA0bWxtd3p1aGlhOTItQVBMIiwidyI6W3siZm4iOiJlbnZmcXFlMWF5NGsxLUFQTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.qlccwNqvIaEhfXoboBqPGYn_674dBUujEGf69Fmx818/image;s=2048x1536;q=80",
      "https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImszN2c0azAyeXlrei1BUEwiLCJ3IjpbeyJmbiI6ImVudmZxcWUxYXk0azEtQVBMIiwicyI6IjE2IiwiYSI6IjAiLCJwIjoiMTAsLTEwIn1dfQ.uioKpWNbINtjpksgvVHFuze7PVGgwY2Y65Jomf1OIho/image;s=2048x1536;q=80"
    ],
    criteria: {
      oven: "unknown",
      dishwasher: "unknown",
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
    createdAt: 9
  }
];
