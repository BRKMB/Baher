export const brand = {
  name: 'Salute 21',
  tagline: 'Na zdrowie — codziennie',
  description:
    'Szczypta włoskich inspiracji, ślad wpływów hiszpańskich i trochę południowego stylu bycia.',
  instagram: 'https://www.instagram.com/salute__21/',
  instagramHandle: '@salute__21',
  email: 'ciao@salute21.pl',
  phone: 'Instagram DM',
  phoneHref: 'https://www.instagram.com/salute__21/',
  address: {
    street: 'ul. Marcina Kasprzaka 24A',
    district: 'Wola',
    city: '01-211 Warszawa',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Marcina+Kasprzaka+24A+Warszawa',
  },
}

export const hours = [
  { day: 'Poniedziałek – Czwartek', time: '12:00 – 22:00', note: 'Lunch 12:00 – 17:00' },
  { day: 'Piątek', time: '12:00 – 24:00', note: 'Lunch 12:00 – 17:00' },
  { day: 'Sobota', time: '10:00 – 24:00', note: 'Śniadanie 10:00 – 12:45' },
  { day: 'Niedziela', time: '10:00 – 22:00', note: 'Śniadanie 10:00 – 12:45' },
]

export type MenuItem = {
  name: string
  desc: string
  price: number
  tags?: Array<'v' | 'w' | 'special'>
}

export type MenuCategory = {
  id: string
  title: string
  subtitle: string
  items: MenuItem[]
}

export const menu: MenuCategory[] = [
  {
    id: 'special',
    title: 'Special',
    subtitle: 'Sezonowe propozycje kuchni',
    items: [
      {
        name: 'Bób z groszkiem',
        desc: 'Vege glaze, balsamico, crunch orzechowy, koperek, fermentowane chilli',
        price: 29,
        tags: ['v', 'special'],
      },
      {
        name: 'Cecina Rubia Gallega',
        desc: 'Wołowina dojrzewająca 7 miesięcy, podwędzana',
        price: 37,
        tags: ['special'],
      },
      {
        name: 'Szpik wołowy z kurkami',
        desc: 'Kurki, vege glaze, kruszonka ziołowa, szczypiorek',
        price: 36,
        tags: ['special'],
      },
      {
        name: 'Galletto',
        desc: 'Kurczak, demi glace z harissą, cytryna, szczypiorek',
        price: 69,
        tags: ['special'],
      },
    ],
  },
  {
    id: 'vege',
    title: 'Wege',
    subtitle: 'Spuntini i talerze warzywne',
    items: [
      {
        name: 'Burrata',
        desc: 'Gazpacho, pomidory lima, rabarbar, oliwa bazyliowa',
        price: 45,
        tags: ['w'],
      },
      {
        name: 'Raviolo',
        desc: 'Ricotta, szpinak, żółtko, palone masło truflowe, świeża trufla',
        price: 49,
        tags: ['w'],
      },
      {
        name: 'Papryczki padrón',
        desc: 'Sos romesco, sól Maldon',
        price: 21,
        tags: ['v'],
      },
      {
        name: 'Patatas bravas',
        desc: 'Pikantne aioli, klasyczne aioli, cebula dymka',
        price: 22,
      },
      {
        name: 'Frytki z polenty',
        desc: 'Parmezan, aioli musztardowo-parmezanowe',
        price: 25,
      },
      {
        name: 'Deska serów',
        desc: 'Selekcja serów, konfitura z figi, orzechy włoskie w karmelu',
        price: 36,
        tags: ['w'],
      },
    ],
  },
  {
    id: 'meat',
    title: 'Mięso',
    subtitle: 'Iberyjskie smaki i klasyka baru',
    items: [
      {
        name: 'Szaszłyk iberico',
        desc: 'Pancetta, demi glace, balsamico, kapary czosnku niedźwiedziego',
        price: 38,
      },
      {
        name: 'Solomillo iberico de bellota',
        desc: 'Polędwica iberyjska, marsala, salsa verde',
        price: 66,
      },
      {
        name: 'Antrykot z kością',
        desc: 'Sezonowany 30 dni, zioła, czosnek — cena za 100 g',
        price: 52,
      },
      {
        name: 'Tatar wołowy',
        desc: 'Szalotka, San Marzano, chipotle, orzechy, salsa verde',
        price: 51,
      },
    ],
  },
  {
    id: 'seafood',
    title: 'Ryby i owoce morza',
    subtitle: 'Świeże, lekkie, śródziemnomorskie',
    items: [
      {
        name: 'Krewetki argentyńskie z chorizo',
        desc: 'Cukinia, czosnek, białe wino, oliwa z czosnku niedźwiedziego',
        price: 49,
      },
      {
        name: 'Przegrzebek',
        desc: 'Krewetki, małże, beszamel porowy, pesto bazyliowe',
        price: 42,
      },
      {
        name: 'Dorsz w tempurze',
        desc: 'Aioli cytrusowo-musztardowe, parmezan 24 msc.',
        price: 31,
      },
      {
        name: 'Łosoś crudo',
        desc: 'Ponzu, dashi, marakuja, cytryna, zioła',
        price: 47,
      },
      {
        name: 'Ostryga Gillardeau',
        desc: 'Cytryna, gazpacho',
        price: 29,
      },
    ],
  },
  {
    id: 'sliders',
    title: 'Slidery',
    subtitle: 'Małe, ale konkretne',
    items: [
      {
        name: 'Boczniak w panko',
        desc: 'Aioli Dijon, sałata rzymska, cheddar, fermentowane chilli',
        price: 27,
        tags: ['w'],
      },
      {
        name: 'Wołowina wagyu',
        desc: 'Klasyczne aioli, piklowany ogórek, jalapeño',
        price: 31,
      },
      {
        name: 'Krewetki w tempurze',
        desc: 'Sos słodko-kwaśny, ogórek, radicchio',
        price: 30,
      },
    ],
  },
  {
    id: 'cocktails',
    title: 'Koktajle',
    subtitle: 'Każdy dostępny w wersji % i 0%',
    items: [
      {
        name: 'Negroni arancia',
        desc: 'Gin, Campari, słodki wermut, piklowana pomarańcza w figach',
        price: 39,
      },
      {
        name: 'Ruby Salute!',
        desc: 'Wódka, Aperol, aperitivo, grejpfrut, białko',
        price: 39,
      },
      {
        name: 'Crema di limone',
        desc: 'Limoncello, pomarańcza, cytryna, pistacje',
        price: 39,
      },
      {
        name: 'Basilicious 2.0',
        desc: 'Gin, bazylia, jabłko',
        price: 39,
      },
      {
        name: 'Flamingo',
        desc: 'Gin, Aperol, truskawka, limonka',
        price: 39,
      },
      {
        name: 'Salute Colada',
        desc: 'Rum infuzowany kokosem, limonka, soda ananasowa',
        price: 35,
      },
    ],
  },
  {
    id: 'desserts',
    title: 'Desery',
    subtitle: 'Słodkie zakończenie wieczoru',
    items: [
      {
        name: 'Sernik Salute brûlée',
        desc: 'Lody różane, biała czekolada',
        price: 29,
      },
      {
        name: 'Pistacjowe lody Salute!',
        desc: 'Pistacje, biała czekolada, prażynka, sól Maldon',
        price: 32,
      },
      {
        name: 'Tres leches',
        desc: 'Ciastko, Earl Grey, nektarynki, biała czekolada',
        price: 29,
      },
    ],
  },
]

export const highlights = [
  {
    title: 'Spuntini',
    text: 'Małe talerzyki do dzielenia — 3–4 na osobę i wieczór nabiera rytmu.',
    image: '/images/spuntini.png',
  },
  {
    title: 'Bar',
    text: 'Autorskie koktajle włoskie, wersje bezalkoholowe i długa karta win musujących.',
    image: '/images/bar.png',
  },
  {
    title: 'Śniadania',
    text: 'W weekendy od 10:00 — powoli, południowo, bez pośpiechu.',
    image: '/images/breakfast.jpg',
  },
]

export const gallery = [
  { src: '/images/gallery-13.jpg', alt: 'Danie Salute 21' },
  { src: '/images/gallery-17.jpg', alt: 'Spuntini na stole' },
  { src: '/images/gallery-24.jpg', alt: 'Owoce morza' },
  { src: '/images/gallery-27.jpg', alt: 'Koktajl autorski' },
  { src: '/images/gallery-30.jpg', alt: 'Talerz mięsny' },
  { src: '/images/gallery-33.jpg', alt: 'Deser' },
  { src: '/images/gallery-36.jpg', alt: 'Wino i przekąski' },
  { src: '/images/gallery-41.jpg', alt: 'Atmosfera baru' },
  { src: '/images/interior.jpg', alt: 'Wnętrze Salute 21' },
  { src: '/images/wine.jpg', alt: 'Selekcja win' },
  { src: '/images/unsplash-dining.jpg', alt: 'Stół dla gości' },
  { src: '/images/unsplash-cocktail.jpg', alt: 'Koktajle przy barze' },
]

export const values = [
  {
    title: 'Codziennie święto',
    text: 'Nie potrzeba okazji. Najważniejsze święto jest na co dzień — przy stole, przy barze, wśród znajomych.',
  },
  {
    title: 'Południowy charakter',
    text: 'Włoskie inspiracje, hiszpańskie tapas i swoboda bycia. Jedzenie łączy się z piciem — bez sztucznych podziałów.',
  },
  {
    title: 'Sezon i rzemiosło',
    text: 'Świeże składniki, zmieniające się menu i precyzyjna technika. Każdy talerz opowiada o smaku, nie o efekciarstwie.',
  },
]
