export const brand = {
  name: 'Salute 21',
  instagram: 'https://www.instagram.com/salute__21/',
  instagramHandle: '@salute__21',
  email: 'contact@salute21.com',
  address: {
    street: 'ul. Marcina Kasprzaka 24A',
    district: 'Wola',
    city: '01-211 Warszawa',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Marcina+Kasprzaka+24A+Warszawa',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=Marcina+Kasprzaka+24A%2C+01-211+Warszawa',
  },
}

/** Capacity per time slot — used by the booking engine */
export const BOOKING_CAPACITY = 28
export const MAX_PARTY_SIZE = 12

export type MenuItem = {
  name: { en: string; pl: string }
  desc: { en: string; pl: string }
  price: number
  tags?: Array<'v' | 'w' | 'special'>
}

export type MenuCategory = {
  id: 'special' | 'vege' | 'meat' | 'seafood' | 'sliders' | 'cocktails' | 'desserts'
  image: string
  items: MenuItem[]
}

/** Original Salute 21 card — Italian-leaning plates for Warsaw */
export const menu: MenuCategory[] = [
  {
    id: 'special',
    image: '/images/gallery-food-1.jpg',
    items: [
      {
        name: { en: 'Burrata with roasted tomatoes', pl: 'Burrata z pieczonymi pomidorami' },
        desc: {
          en: 'Creamy burrata, slow-roasted cherry tomatoes, basil oil, grilled focaccia',
          pl: 'Kremowa burrata, wolno pieczone pomidorki cherry, oliwa bazyliowa, grillowana focaccia',
        },
        price: 42,
        tags: ['w', 'special'],
      },
      {
        name: { en: 'Vitello tonnato', pl: 'Vitello tonnato' },
        desc: {
          en: 'Thinly sliced veal, tuna-caper sauce, lemon, crispy capers',
          pl: 'Cienko krojona cielęcina, sos tuńczykowy z kaparami, cytryna, chrupiące kapary',
        },
        price: 48,
        tags: ['special'],
      },
      {
        name: { en: 'Truffle tagliatelle', pl: 'Tagliatelle z truflą' },
        desc: {
          en: 'Fresh egg pasta, butter, Parmigiano, black truffle',
          pl: 'Świeży makaron jajeczny, masło, Parmigiano, czarna trufla',
        },
        price: 59,
        tags: ['w', 'special'],
      },
      {
        name: { en: 'Ossobuco alla milanese', pl: 'Ossobuco alla milanese' },
        desc: {
          en: 'Braised veal shank, saffron risotto, gremolata',
          pl: 'Duszona golonka cielęca, risotto szafranowe, gremolata',
        },
        price: 78,
        tags: ['special'],
      },
    ],
  },
  {
    id: 'vege',
    image: '/images/gallery-food-2.jpg',
    items: [
      {
        name: { en: 'Caprese 21', pl: 'Caprese 21' },
        desc: {
          en: 'Heirloom tomatoes, fior di latte, basil pesto, aged balsamic',
          pl: 'Pomidory heirloom, fior di latte, pesto bazyliowe, dojrzały balsamico',
        },
        price: 36,
        tags: ['w'],
      },
      {
        name: { en: 'Grilled eggplant', pl: 'Grillowany bakłażan' },
        desc: {
          en: 'Smoky eggplant, stracciatella, pine nuts, mint',
          pl: 'Wędzony bakłażan, stracciatella, orzeszki piniowe, mięta',
        },
        price: 34,
        tags: ['w'],
      },
      {
        name: { en: 'Wild mushroom risotto', pl: 'Risotto z grzybami leśnymi' },
        desc: {
          en: 'Carnaroli rice, porcini, thyme, Parmigiano',
          pl: 'Ryż carnaroli, borowiki, tymianek, Parmigiano',
        },
        price: 46,
        tags: ['w'],
      },
      {
        name: { en: 'Padrón peppers', pl: 'Papryczki padrón' },
        desc: {
          en: 'Blistered peppers, flaky salt, lemon',
          pl: 'Prażone papryczki, sól płatkowana, cytryna',
        },
        price: 24,
        tags: ['v'],
      },
      {
        name: { en: 'Focaccia & dips', pl: 'Focaccia i dipsy' },
        desc: {
          en: 'Warm rosemary focaccia, olive tapenade, white bean purée',
          pl: 'Ciepła focaccia z rozmarynem, tapenada oliwkowa, puree z białej fasoli',
        },
        price: 28,
        tags: ['v'],
      },
      {
        name: { en: 'Cheese selection', pl: 'Selekcja serów' },
        desc: {
          en: 'Three Italian cheeses, honey, walnuts, crackers',
          pl: 'Trzy włoskie sery, miód, orzechy, krakersy',
        },
        price: 44,
        tags: ['w'],
      },
    ],
  },
  {
    id: 'meat',
    image: '/images/gallery-food-4.jpg',
    items: [
      {
        name: { en: 'Beef carpaccio', pl: 'Carpaccio wołowe' },
        desc: {
          en: 'Raw beef, rocket, Parmigiano, lemon, olive oil',
          pl: 'Surowe mięso wołowe, rukola, Parmigiano, cytryna, oliwa',
        },
        price: 49,
      },
      {
        name: { en: 'Chicken al limone', pl: 'Kurczak al limone' },
        desc: {
          en: 'Pan-roasted chicken, lemon butter, herbs, crispy potatoes',
          pl: 'Smażony kurczak, masło cytrynowe, zioła, chrupiące ziemniaki',
        },
        price: 54,
      },
      {
        name: { en: 'Lamb chops', pl: 'Kotleciki jagnięce' },
        desc: {
          en: 'Grilled lamb, rosemary, garlic, salsa verde',
          pl: 'Grillowana jagnięcina, rozmaryn, czosnek, salsa verde',
        },
        price: 72,
      },
      {
        name: { en: 'Florentine steak', pl: 'Stek florencki' },
        desc: {
          en: 'Dry-aged T-bone, sea salt, olive oil — price per 100 g',
          pl: 'Sezonowany T-bone, sól morska, oliwa — cena za 100 g',
        },
        price: 58,
      },
    ],
  },
  {
    id: 'seafood',
    image: '/images/gallery-food-7.jpg',
    items: [
      {
        name: { en: 'Octopus alla griglia', pl: 'Ośmiornica z grilla' },
        desc: {
          en: 'Charred octopus, potato cream, paprika oil',
          pl: 'Ośmiornica z rusztem, krem ziemniaczany, oliwa paprykowa',
        },
        price: 56,
      },
      {
        name: { en: 'Prawns al ajillo', pl: 'Krewetki al ajillo' },
        desc: {
          en: 'Garlic, chilli, white wine, parsley, grilled bread',
          pl: 'Czosnek, chilli, białe wino, pietruszka, grillowany chleb',
        },
        price: 52,
      },
      {
        name: { en: 'Seared scallops', pl: 'Smażone przegrzebki' },
        desc: {
          en: 'Scallops, brown butter, citrus, fennel salad',
          pl: 'Przegrzebki, brązowe masło, cytrusy, sałatka z kopru włoskiego',
        },
        price: 58,
      },
      {
        name: { en: 'Sea bass crudo', pl: 'Crudo z labraksa' },
        desc: {
          en: 'Raw sea bass, blood orange, olive oil, chilli flakes',
          pl: 'Surowy labraks, czerwona pomarańcza, oliwa, płatki chilli',
        },
        price: 47,
      },
      {
        name: { en: 'Oysters', pl: 'Ostrygi' },
        desc: {
          en: 'Fresh oysters, lemon, mignonette',
          pl: 'Świeże ostrygi, cytryna, mignonette',
        },
        price: 32,
      },
    ],
  },
  {
    id: 'sliders',
    image: '/images/gallery-food-8.jpg',
    items: [
      {
        name: { en: 'Porchetta slider', pl: 'Slider porchetta' },
        desc: {
          en: 'Slow-roasted pork, salsa verde, soft bun',
          pl: 'Wolno pieczona wieprzowina, salsa verde, miękka bułka',
        },
        price: 29,
      },
      {
        name: { en: 'Meatball slider', pl: 'Slider z pulpety' },
        desc: {
          en: 'Beef & pork meatballs, tomato sugo, mozzarella',
          pl: 'Pulpety wołowo-wieprzowe, sugo pomidorowe, mozzarella',
        },
        price: 28,
      },
      {
        name: { en: 'Mushroom slider', pl: 'Slider z grzybami' },
        desc: {
          en: 'Roasted mushrooms, taleggio, rocket',
          pl: 'Pieczone grzyby, taleggio, rukola',
        },
        price: 26,
        tags: ['w'],
      },
    ],
  },
  {
    id: 'cocktails',
    image: '/images/gallery-food-6.jpg',
    items: [
      {
        name: { en: 'Negroni 21', pl: 'Negroni 21' },
        desc: {
          en: 'Gin, bitter, sweet vermouth, orange twist',
          pl: 'Gin, bitter, słodki wermut, skórka pomarańczy',
        },
        price: 38,
      },
      {
        name: { en: 'Spritz della casa', pl: 'Spritz della casa' },
        desc: {
          en: 'Aperitivo, prosecco, soda, olive',
          pl: 'Aperitivo, prosecco, soda, oliwka',
        },
        price: 34,
      },
      {
        name: { en: 'Limoncello sour', pl: 'Limoncello sour' },
        desc: {
          en: 'Limoncello, lemon, egg white, sugar',
          pl: 'Limoncello, cytryna, białko, cukier',
        },
        price: 36,
      },
      {
        name: { en: 'Basil smash', pl: 'Basil smash' },
        desc: {
          en: 'Gin, fresh basil, lemon, soda',
          pl: 'Gin, świeża bazylia, cytryna, soda',
        },
        price: 36,
      },
      {
        name: { en: 'Espresso martini', pl: 'Espresso martini' },
        desc: {
          en: 'Vodka, coffee liqueur, fresh espresso',
          pl: 'Wódka, likier kawowy, świeże espresso',
        },
        price: 38,
      },
      {
        name: { en: 'Zero-proof garden', pl: 'Zero-proof garden' },
        desc: {
          en: 'Seedlip, cucumber, elderflower, tonic',
          pl: 'Seedlip, ogórek, kwiat bzu, tonik',
        },
        price: 28,
      },
    ],
  },
  {
    id: 'desserts',
    image: '/images/gallery-food-5.jpg',
    items: [
      {
        name: { en: 'Tiramisu 21', pl: 'Tiramisu 21' },
        desc: {
          en: 'Espresso-soaked ladyfingers, mascarpone, cocoa',
          pl: 'Biszkopty namoczone w espresso, mascarpone, kakao',
        },
        price: 32,
      },
      {
        name: { en: 'Panna cotta', pl: 'Panna cotta' },
        desc: {
          en: 'Vanilla cream, seasonal berries, pistachio crunch',
          pl: 'Krem waniliowy, sezonowe owoce, chrup pistacjowy',
        },
        price: 30,
      },
      {
        name: { en: 'Dark chocolate fondant', pl: 'Fondant z gorzkiej czekolady' },
        desc: {
          en: 'Warm chocolate cake, molten centre, vanilla gelato',
          pl: 'Ciepłe ciasto czekoladowe z płynnym środkiem, lody waniliowe',
        },
        price: 34,
      },
    ],
  },
]

/** Gallery-only images — never reused on menu, hero, about, or reserve */
export const gallery = [
  { src: '/images/gallery-food-3.jpg', alt: 'Dessert and wine at the table' },
  { src: '/images/gallery-extra-1.jpg', alt: 'Pasta at Salute 21' },
  { src: '/images/gallery-extra-2.jpg', alt: 'Shared Italian plates' },
  { src: '/images/gallery-extra-3.jpg', alt: 'Evening dining' },
  { src: '/images/gallery-extra-4.jpg', alt: 'Fresh antipasti' },
  { src: '/images/gallery-extra-5.jpg', alt: 'Seafood course' },
  { src: '/images/gallery-extra-6.jpg', alt: 'Restaurant atmosphere' },
  { src: '/images/interior.jpg', alt: 'Dining room' },
  { src: '/images/unsplash-food.jpg', alt: 'Shared plates' },
  { src: '/images/unsplash-tapas.jpg', alt: 'Small plates' },
  { src: '/images/unsplash-cocktail.jpg', alt: 'Drinks at Salute 21' },
]

export const highlights = [
  { key: 'spuntini' as const, image: '/images/highlight-pasta.jpg' },
  { key: 'bar' as const, image: '/images/highlight-bar.jpg' },
  { key: 'breakfast' as const, image: '/images/highlight-brunch.jpg' },
]
