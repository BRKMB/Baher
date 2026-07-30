export const brand = {
  name: 'Salute 21',
  instagram: 'https://www.instagram.com/salute__21/',
  instagramHandle: '@salute__21',
  email: 'ciao@salute21.pl',
  address: {
    street: 'ul. Marcina Kasprzaka 24A',
    district: 'Wola',
    city: '01-211 Warszawa',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Marcina+Kasprzaka+24A+Warszawa',
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

export const menu: MenuCategory[] = [
  {
    id: 'special',
    image: '/images/menu-special.jpg',
    items: [
      {
        name: { en: 'Broad beans with peas', pl: 'Bób z groszkiem' },
        desc: {
          en: 'Vege glaze, balsamic, nut crunch, dill, fermented chilli',
          pl: 'Vege glaze, balsamico, crunch orzechowy, koperek, fermentowane chilli',
        },
        price: 29,
        tags: ['v', 'special'],
      },
      {
        name: { en: 'Cecina Rubia Gallega', pl: 'Cecina Rubia Gallega' },
        desc: {
          en: 'Beef aged 7 months, lightly smoked',
          pl: 'Wołowina dojrzewająca 7 miesięcy, podwędzana',
        },
        price: 37,
        tags: ['special'],
      },
      {
        name: { en: 'Bone marrow with chanterelles', pl: 'Szpik wołowy z kurkami' },
        desc: {
          en: 'Chanterelles, vege glaze, herb crumble, chives',
          pl: 'Kurki, vege glaze, kruszonka ziołowa, szczypiorek',
        },
        price: 36,
        tags: ['special'],
      },
      {
        name: { en: 'Galletto', pl: 'Galletto' },
        desc: {
          en: 'Chicken, harissa demi-glace, lemon, chives',
          pl: 'Kurczak, demi glace z harissą, cytryna, szczypiorek',
        },
        price: 69,
        tags: ['special'],
      },
    ],
  },
  {
    id: 'vege',
    image: '/images/menu-vege.jpg',
    items: [
      {
        name: { en: 'Burrata', pl: 'Burrata' },
        desc: {
          en: 'Gazpacho, lima tomatoes, rhubarb, basil oil',
          pl: 'Gazpacho, pomidory lima, rabarbar, oliwa bazyliowa',
        },
        price: 45,
        tags: ['w'],
      },
      {
        name: { en: 'Raviolo', pl: 'Raviolo' },
        desc: {
          en: 'Ricotta, spinach, egg yolk, burnt truffle butter, fresh truffle',
          pl: 'Ricotta, szpinak, żółtko, palone masło truflowe, świeża trufla',
        },
        price: 49,
        tags: ['w'],
      },
      {
        name: { en: 'Padrón peppers', pl: 'Papryczki padrón' },
        desc: {
          en: 'Romesco sauce, Maldon salt',
          pl: 'Sos romesco, sól Maldon',
        },
        price: 21,
        tags: ['v'],
      },
      {
        name: { en: 'Patatas bravas', pl: 'Patatas bravas' },
        desc: {
          en: 'Spicy aioli, classic aioli, spring onion',
          pl: 'Pikantne aioli, klasyczne aioli, cebula dymka',
        },
        price: 22,
      },
      {
        name: { en: 'Polenta fries', pl: 'Frytki z polenty' },
        desc: {
          en: 'Parmesan, mustard-parmesan aioli',
          pl: 'Parmezan, aioli musztardowo-parmezanowe',
        },
        price: 25,
      },
      {
        name: { en: 'Cheese board', pl: 'Deska serów' },
        desc: {
          en: 'Cheese selection, fig confit, caramelised walnuts',
          pl: 'Selekcja serów, konfitura z figi, orzechy włoskie w karmelu',
        },
        price: 36,
        tags: ['w'],
      },
    ],
  },
  {
    id: 'meat',
    image: '/images/menu-steak.jpg',
    items: [
      {
        name: { en: 'Iberico skewer', pl: 'Szaszłyk iberico' },
        desc: {
          en: 'Pancetta, demi-glace, balsamic, wild garlic capers',
          pl: 'Pancetta, demi glace, balsamico, kapary czosnku niedźwiedziego',
        },
        price: 38,
      },
      {
        name: { en: 'Solomillo iberico de bellota', pl: 'Solomillo iberico de bellota' },
        desc: {
          en: 'Iberian pork tenderloin, marsala, salsa verde',
          pl: 'Polędwica iberyjska, marsala, salsa verde',
        },
        price: 66,
      },
      {
        name: { en: 'Bone-in ribeye', pl: 'Antrykot z kością' },
        desc: {
          en: 'Dry-aged 30 days, herbs, garlic — price per 100 g',
          pl: 'Sezonowany 30 dni, zioła, czosnek — cena za 100 g',
        },
        price: 52,
      },
      {
        name: { en: 'Beef tartare', pl: 'Tatar wołowy' },
        desc: {
          en: 'Shallot, San Marzano, chipotle, walnuts, salsa verde',
          pl: 'Szalotka, San Marzano, chipotle, orzechy, salsa verde',
        },
        price: 51,
      },
    ],
  },
  {
    id: 'seafood',
    image: '/images/menu-seafood.jpg',
    items: [
      {
        name: { en: 'Argentine prawns with chorizo', pl: 'Krewetki argentyńskie z chorizo' },
        desc: {
          en: 'Courgette, garlic, white wine, wild garlic oil',
          pl: 'Cukinia, czosnek, białe wino, oliwa z czosnku niedźwiedziego',
        },
        price: 49,
      },
      {
        name: { en: 'Scallop', pl: 'Przegrzebek' },
        desc: {
          en: 'Prawns, mussels, leek béchamel, basil pesto',
          pl: 'Krewetki, małże, beszamel porowy, pesto bazyliowe',
        },
        price: 42,
      },
      {
        name: { en: 'Cod in tempura', pl: 'Dorsz w tempurze' },
        desc: {
          en: 'Citrus-mustard aioli, 24-month parmesan',
          pl: 'Aioli cytrusowo-musztardowe, parmezan 24 msc.',
        },
        price: 31,
      },
      {
        name: { en: 'Salmon crudo', pl: 'Łosoś crudo' },
        desc: {
          en: 'Ponzu, dashi, passion fruit, lemon, herbs',
          pl: 'Ponzu, dashi, marakuja, cytryna, zioła',
        },
        price: 47,
      },
      {
        name: { en: 'Gillardeau oyster', pl: 'Ostryga Gillardeau' },
        desc: {
          en: 'Lemon, gazpacho',
          pl: 'Cytryna, gazpacho',
        },
        price: 29,
      },
    ],
  },
  {
    id: 'sliders',
    image: '/images/menu-sliders.jpg',
    items: [
      {
        name: { en: 'Oyster mushroom in panko', pl: 'Boczniak w panko' },
        desc: {
          en: 'Dijon aioli, romaine, cheddar, fermented chilli',
          pl: 'Aioli Dijon, sałata rzymska, cheddar, fermentowane chilli',
        },
        price: 27,
        tags: ['w'],
      },
      {
        name: { en: 'Wagyu beef', pl: 'Wołowina wagyu' },
        desc: {
          en: 'Classic aioli, pickled cucumber, jalapeño',
          pl: 'Klasyczne aioli, piklowany ogórek, jalapeño',
        },
        price: 31,
      },
      {
        name: { en: 'Tempura prawns', pl: 'Krewetki w tempurze' },
        desc: {
          en: 'Sweet-sour sauce, cucumber, radicchio',
          pl: 'Sos słodko-kwaśny, ogórek, radicchio',
        },
        price: 30,
      },
    ],
  },
  {
    id: 'cocktails',
    image: '/images/menu-cocktail.jpg',
    items: [
      {
        name: { en: 'Negroni arancia', pl: 'Negroni arancia' },
        desc: {
          en: 'Gin, Campari, sweet vermouth, orange pickled in figs',
          pl: 'Gin, Campari, słodki wermut, piklowana pomarańcza w figach',
        },
        price: 39,
      },
      {
        name: { en: 'Ruby Salute!', pl: 'Ruby Salute!' },
        desc: {
          en: 'Vodka, Aperol, aperitivo, grapefruit, egg white',
          pl: 'Wódka, Aperol, aperitivo, grejpfrut, białko',
        },
        price: 39,
      },
      {
        name: { en: 'Crema di limone', pl: 'Crema di limone' },
        desc: {
          en: 'Limoncello, orange, lemon, pistachios',
          pl: 'Limoncello, pomarańcza, cytryna, pistacje',
        },
        price: 39,
      },
      {
        name: { en: 'Basilicious 2.0', pl: 'Basilicious 2.0' },
        desc: {
          en: 'Gin, basil, apple',
          pl: 'Gin, bazylia, jabłko',
        },
        price: 39,
      },
      {
        name: { en: 'Flamingo', pl: 'Flamingo' },
        desc: {
          en: 'Gin, Aperol, strawberry, lime',
          pl: 'Gin, Aperol, truskawka, limonka',
        },
        price: 39,
      },
      {
        name: { en: 'Salute Colada', pl: 'Salute Colada' },
        desc: {
          en: 'Coconut-infused rum, lime, pineapple soda',
          pl: 'Rum infuzowany kokosem, limonka, soda ananasowa',
        },
        price: 35,
      },
    ],
  },
  {
    id: 'desserts',
    image: '/images/menu-dessert.jpg',
    items: [
      {
        name: { en: 'Salute brûlée cheesecake', pl: 'Sernik Salute brûlée' },
        desc: {
          en: 'Rose ice cream, white chocolate',
          pl: 'Lody różane, biała czekolada',
        },
        price: 29,
      },
      {
        name: { en: 'Salute! pistachio ice cream', pl: 'Pistacjowe lody Salute!' },
        desc: {
          en: 'Pistachios, white chocolate, crisp, Maldon salt',
          pl: 'Pistacje, biała czekolada, prażynka, sól Maldon',
        },
        price: 32,
      },
      {
        name: { en: 'Tres leches', pl: 'Tres leches' },
        desc: {
          en: 'Cake, Earl Grey, nectarines, white chocolate',
          pl: 'Ciastko, Earl Grey, nektarynki, biała czekolada',
        },
        price: 29,
      },
    ],
  },
]

export const gallery = [
  { src: '/images/gallery-13.jpg', alt: 'Salute 21 dish' },
  { src: '/images/gallery-17.jpg', alt: 'Spuntini on the table' },
  { src: '/images/gallery-24.jpg', alt: 'Seafood' },
  { src: '/images/gallery-27.jpg', alt: 'Signature cocktail' },
  { src: '/images/gallery-30.jpg', alt: 'Meat plate' },
  { src: '/images/gallery-33.jpg', alt: 'Dessert' },
  { src: '/images/gallery-36.jpg', alt: 'Wine and bites' },
  { src: '/images/gallery-41.jpg', alt: 'Bar atmosphere' },
  { src: '/images/interior.jpg', alt: 'Salute 21 interior' },
  { src: '/images/wine.jpg', alt: 'Wine selection' },
  { src: '/images/unsplash-dining.jpg', alt: 'Dining table' },
  { src: '/images/unsplash-cocktail.jpg', alt: 'Cocktails at the bar' },
]

export const highlights = [
  { key: 'spuntini' as const, image: '/images/spuntini.png' },
  { key: 'bar' as const, image: '/images/bar.png' },
  { key: 'breakfast' as const, image: '/images/breakfast.jpg' },
]
