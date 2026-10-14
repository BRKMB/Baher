# Instagram Section (portable)

سكشن إنستاجرام جاهز للنسخ لموقع مطعم تاني — نفس التصميم الحالي في Salute 21 (هيدر + شبكة 5×2 + CTA).

**GitHub folder:**  
https://github.com/BRKMB/Baher/tree/cursor/salute-21-restaurant-site-7c77/instagram-section

**Direct tree (same branch):**  
`instagram-section/`

---

## What’s inside

```
instagram-section/
├── InstagramFeed.tsx      # القسم الرئيسي
├── BrandLogo.tsx
├── EgyptMotif.tsx
├── icons.tsx
├── config.ts              # ← عدّل البراند / الهاندل هنا
├── instagram.ts           # fetch /api/instagram
├── ig-feed.css            # كل الستايل + متغيرات الألوان
├── index.ts               # exports
├── api/hostedGrid.ts      # fallback JSON للـ API
└── assets/instagram/      # grid_01.jpg … grid_10.jpg
```

**Deps:** `react`, `framer-motion`, `lucide-react`

---

## Install (copy into another restaurant site)

### 1) انسخ الفولدر

انسخ `instagram-section/` لمشروعك، مثلاً:

```bash
cp -R instagram-section your-restaurant-site/src/sections/instagram
```

### 2) انسخ الصور لـ public

```bash
mkdir -p public/images/instagram
cp src/sections/instagram/assets/instagram/grid_*.jpg public/images/instagram/
```

### 3) عدّل البراند

افتح `config.ts`:

```ts
brandName: 'YourBrand',
brandNumber: '',
brandAriaLabel: 'Your Brand',
instagramUrl: 'https://www.instagram.com/your_handle/',
instagramHandle: '@your_handle',
kicker: '...',
lede: '...',
followCta: 'Open Instagram',
```

بدّل صور `grid_01.jpg` … `grid_10.jpg` بصور المطعم الجديد، وزوّد `assetVersion`.

### 4) استورد الستايل + الخطوط

في الـ app entry أو الصفحة:

```tsx
import 'src/sections/instagram/ig-feed.css'
```

خطوط Google المقترحة:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Great+Vibes&family=Noto+Sans+Egyptian+Hieroglyphs&family=Outfit:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### 5) حط السكشن في الصفحة

```tsx
import { InstagramFeed } from './sections/instagram'

export default function HomePage() {
  return (
    <main>
      {/* ... */}
      <InstagramFeed />
    </main>
  )
}
```

### 6) API بسيط (اختياري لكن مُفضّل)

السكشن يطلب `GET /api/instagram`. لو مفيش Graph API، رجّع الـ hosted grid:

**Cloudflare Worker / any fetch handler:**

```ts
import { buildHostedInstagramFeed } from './sections/instagram/api/hostedGrid'
import { igSectionConfig } from './sections/instagram/config'

if (url.pathname === '/api/instagram') {
  return Response.json(
    buildHostedInstagramFeed({
      handle: igSectionConfig.instagramHandle,
      profileUrl: igSectionConfig.instagramUrl,
      assetsPath: igSectionConfig.assetsPath,
      assetVersion: igSectionConfig.assetVersion,
    }),
  )
}
```

**Express:**

```js
import { buildHostedInstagramFeed } from './sections/instagram/api/hostedGrid.js'

app.get('/api/instagram', (_req, res) => {
  res.json(buildHostedInstagramFeed())
})
```

بدون الـ API، السكشن لسه بيشتغل من الصور المحلية (fallback).

---

## Notes

- الشبكة: **5 أعمدة × 2 صفوف** على الديسكتوب، بدون فواصل سوداء.
- بادج الـ play/carousel CSS inset جوّا التايل (مش أيقونة إنستا المقطوعة).
- لو عندك Tailwind، الكلاسات زي `size-4` / `text-ink` موجودة كمان جوه `ig-feed.css`.
- الزخرفة المصرية اختيارية — تقدر تشيل `<EgyptMotif />` من `InstagramFeed.tsx`.

---

## Live reference

Salute 21 production: https://salute21.com/#galeria
