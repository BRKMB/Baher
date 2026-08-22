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
  /** Number, or a printed dual price like "10 / 13" */
  price: number | string
  /** Optional sub-heading within a category */
  group?: { en: string; pl: string }
  tags?: Array<'vegan' | 'vege' | 'spicy'>
}

export type MenuCategoryId =
  | 'burgers'
  | 'sides'
  | 'turkish'
  | 'pizza'
  | 'breakfast'
  | 'lunch'
  | 'hot_coffee'
  | 'cold_coffee'
  | 'cold_drinks'

export type MenuCategory = {
  id: MenuCategoryId
  image: string
  note?: { en: string; pl: string }
  items: MenuItem[]
}

/** Current Salute 21 printed card — PL front / EN back */
export const menu: MenuCategory[] = [
  {
    id: 'burgers',
    image: '/images/menu-burgers.jpg',
    note: {
      en: 'Burger add-ons: extra patty +10 zł · fries +8 zł',
      pl: 'Dodatki do burgera: dodatkowy kotlet +10 zł · frytki +8 zł',
    },
    items: [
      {
        name: { en: 'Classic 21', pl: 'Classic 21' },
        desc: {
          en: 'Classic burger with a single patty',
          pl: 'Klasyczny burger z pojedynczym kotletem',
        },
        price: 29,
      },
      {
        name: { en: 'Double Trouble', pl: 'Double Trouble' },
        desc: {
          en: 'Classic burger with a double patty',
          pl: 'Klasyczny burger z podwójnym kotletem',
        },
        price: 39,
      },
      {
        name: { en: 'Cheddar Spell', pl: 'Cheddar Spell' },
        desc: {
          en: 'Burger with a single patty and melted cheddar cheese',
          pl: 'Burger z pojedynczym kotletem i roztopionym serem cheddar',
        },
        price: 32,
      },
      {
        name: { en: 'Midas Melt', pl: 'Midas Melt' },
        desc: {
          en: 'Burger with a double patty and extra cheddar cheese',
          pl: 'Burger z podwójnym kotletem i dodatkowym serem cheddar',
        },
        price: 42,
      },
      {
        name: { en: 'Crispy Ritual', pl: 'Crispy Ritual' },
        desc: {
          en: 'Burger with a single crispy chicken patty',
          pl: 'Burger z pojedynczym chrupiącym kotletem z kurczaka',
        },
        price: 27,
      },
      {
        name: { en: 'Crispy Chaos', pl: 'Crispy Chaos' },
        desc: {
          en: 'Burger with a double crispy chicken patty',
          pl: 'Burger z podwójnym chrupiącym kotletem z kurczaka',
        },
        price: 37,
      },
      {
        name: { en: 'Redline', pl: 'Redline' },
        desc: {
          en: 'Burger with a single patty in spicy sauce',
          pl: 'Burger z pojedynczym kotletem w pikantnym sosie',
        },
        price: 33,
        tags: ['spicy'],
      },
      {
        name: { en: 'Smoke Show', pl: 'Smoke Show' },
        desc: {
          en: 'Burger with a single patty in special BBQ sauce',
          pl: 'Burger z pojedynczym kotletem w specjalnym sosie BBQ',
        },
        price: 33,
      },
      {
        name: { en: 'Hallumi Halo', pl: 'Hallumi Halo' },
        desc: {
          en: 'Burger with grilled halloumi cheese',
          pl: 'Burger z grillowanym serem halloumi',
        },
        price: 36,
      },
      {
        name: { en: 'Truffle Maker', pl: 'Truffle Maker' },
        desc: {
          en: 'Burger with a single patty and truffle mayonnaise',
          pl: 'Burger z pojedynczym kotletem i majonezem truflowym',
        },
        price: 35,
      },
    ],
  },
  {
    id: 'sides',
    image: '/images/menu-sides.jpg',
    items: [
      {
        name: { en: 'Fryday', pl: 'Fryday' },
        desc: { en: 'Classic fries', pl: 'Klasyczne frytki' },
        price: 12,
      },
      {
        name: { en: 'Batat Mood', pl: 'Batat Mood' },
        desc: {
          en: 'Crispy sweet potato fries',
          pl: 'Chrupiące frytki z batata',
        },
        price: 22,
      },
      {
        name: { en: 'Truffries', pl: 'Truffries' },
        desc: {
          en: 'Special fries with truffle oil and parmesan',
          pl: 'Specjalne frytki z olejem truflowym i parmezanem',
        },
        price: 18,
      },
      {
        name: { en: 'Onion Orbit', pl: 'Onion Orbit' },
        desc: {
          en: 'Crispy onion rings (6 pcs.)',
          pl: 'Chrupiące krążki cebulowe (6 szt.)',
        },
        price: 15,
      },
      {
        name: { en: 'Mozza Code', pl: 'Mozza Code' },
        desc: {
          en: 'Hot mozzarella sticks (6 pcs.)',
          pl: 'Gorące paluszki mozzarella (6 szt.)',
        },
        price: 18,
      },
      {
        name: { en: 'Fire Bites', pl: 'Fire Bites' },
        desc: {
          en: 'Cheese balls with jalapeño pepper (6 pcs.)',
          pl: 'Serowe kulki z papryczką jalapeño (6 szt.)',
        },
        price: 18,
        tags: ['spicy'],
      },
      {
        name: { en: 'Crispy Theory', pl: 'Crispy Theory' },
        desc: {
          en: 'Crispy chicken with fries',
          pl: 'Chrupiący kurczak z frytkami',
        },
        price: 25,
      },
      {
        name: { en: 'Nacho Drama', pl: 'Nacho Drama' },
        desc: {
          en: 'Nachos, cheese sauce and ground beef',
          pl: 'Nachosy, sos serowy i mielona wołowina',
        },
        price: 22,
      },
    ],
  },
  {
    id: 'turkish',
    image: '/images/menu-turkish.jpg',
    note: {
      en: 'All Turkish specials are served with fries',
      pl: 'Wszystkie specjały tureckie serwowane są z frytkami',
    },
    items: [
      {
        name: { en: 'Cheese Press', pl: 'Cheese Press' },
        desc: {
          en: 'Hot toast with melted kaşar cheese',
          pl: 'Gorący tost z roztopionym serem kaszar',
        },
        price: 18,
      },
      {
        name: { en: 'Sucuk Press', pl: 'Sucuk Press' },
        desc: {
          en: 'Special toast with spicy Turkish sucuk sausage',
          pl: 'Specjalny tost z pikantną turecką kiełbasą sucuk',
        },
        price: 21,
        tags: ['spicy'],
      },
      {
        name: { en: 'Anatolian Taste', pl: 'Anatolian Taste' },
        desc: {
          en: 'Delicious meatball sandwich',
          pl: 'Pyszna kanapka z klopsikami',
        },
        price: 29,
      },
    ],
  },
  {
    id: 'pizza',
    image: '/images/menu-pizza.jpg',
    note: {
      en: 'Pizza service from 12:00 · Made by Easy Pizzy',
      pl: 'Serwis pizzy od godziny 12:00 · Made by Easy Pizzy',
    },
    items: [
      {
        name: { en: 'Marga Magic', pl: 'Marga Magic' },
        desc: { en: 'Margherita', pl: 'Margherita' },
        price: 38,
      },
      {
        name: { en: 'Veggie Meggie', pl: 'Veggie Meggie' },
        desc: { en: 'Vegetarian', pl: 'Wegetariańska' },
        price: 45,
        tags: ['vege'],
      },
      {
        name: { en: 'Sucuk Spicy', pl: 'Sucuk Spicy' },
        desc: { en: 'Sucuk', pl: 'Sucuk' },
        price: 48,
        tags: ['spicy'],
      },
      {
        name: { en: 'Chicky Pizy', pl: 'Chicky Pizy' },
        desc: { en: 'Chicken', pl: 'Kurczak' },
        price: 52,
      },
      {
        name: { en: 'Cheesy Magic', pl: 'Cheesy Magic' },
        desc: { en: '4 cheese', pl: '4 sery' },
        price: 55,
      },
    ],
  },
  {
    id: 'breakfast',
    image: '/images/highlight-brunch.jpg',
    items: [
      {
        name: { en: 'Everything Egg', pl: 'Everything Egg' },
        desc: {
          en: 'Toast or bagel with avocado, scrambled eggs, sun-dried tomatoes, flavored olive oil and parmesan',
          pl: 'Tost lub bajgiel z awokado, jajecznicą, suszonymi pomidorami, aromatyzowaną oliwą i parmezanem',
        },
        price: 29,
      },
      {
        name: { en: 'Freshy', pl: 'Freshy' },
        desc: {
          en: 'Yogurt, granola and seasonal fruit',
          pl: 'Jogurt, granola i sezonowe owoce',
        },
        price: 22,
      },
    ],
  },
  {
    id: 'lunch',
    image: '/images/menu-burgers.jpg',
    items: [
      {
        name: {
          en: 'Classic 21 + fries + drink',
          pl: 'Classic 21 + frytki + napój',
        },
        desc: {
          en: 'Lunch set',
          pl: 'Zestaw lunchowy',
        },
        price: 35,
      },
      {
        name: {
          en: 'Anatolian Taste + drink',
          pl: 'Anatolian Taste + napój',
        },
        desc: {
          en: 'Lunch set',
          pl: 'Zestaw lunchowy',
        },
        price: 35,
      },
    ],
  },
  {
    id: 'hot_coffee',
    image: '/images/menu-hot-coffee.jpg',
    items: [
      {
        name: { en: 'Espresso', pl: 'Espresso' },
        desc: { en: '', pl: '' },
        price: 9,
      },
      {
        name: { en: 'Americano', pl: 'Americano' },
        desc: { en: '', pl: '' },
        price: 14,
      },
      {
        name: { en: 'Latte', pl: 'Latte' },
        desc: { en: '', pl: '' },
        price: 17,
      },
      {
        name: { en: 'Cappuccino', pl: 'Cappuccino' },
        desc: { en: '', pl: '' },
        price: 18,
      },
      {
        name: { en: 'Flat White', pl: 'Flat White' },
        desc: { en: '', pl: '' },
        price: 19,
      },
      {
        name: { en: 'Mocha', pl: 'Mocha' },
        desc: { en: '', pl: '' },
        price: 19,
      },
      {
        name: { en: 'Tea', pl: 'Herbata' },
        desc: { en: '', pl: '' },
        price: 10,
      },
    ],
  },
  {
    id: 'cold_coffee',
    image: '/images/menu-cold-coffee.jpg',
    items: [
      {
        name: { en: 'Iced Americano', pl: 'Iced Americano' },
        desc: { en: '', pl: '' },
        price: 17,
      },
      {
        name: { en: 'Iced Latte / Iced Mocha', pl: 'Iced Latte / Iced Mocha' },
        desc: { en: '', pl: '' },
        price: 20,
      },
    ],
  },
  {
    id: 'cold_drinks',
    image: '/images/menu-cold-drinks.jpg',
    items: [
      {
        name: {
          en: 'Cola / Zero / Fanta / Sprite',
          pl: 'Cola / Zero / Fanta / Sprite',
        },
        desc: { en: '', pl: '' },
        price: '10 / 13',
      },
      {
        name: { en: 'Cappy', pl: 'Cappy' },
        desc: { en: '', pl: '' },
        price: 11,
      },
      {
        name: { en: 'FuseTea', pl: 'FuseTea' },
        desc: { en: '', pl: '' },
        price: 12,
      },
      {
        name: { en: 'Lemonade', pl: 'Lemoniada' },
        desc: { en: '', pl: '' },
        price: 15,
      },
      {
        name: { en: 'Non-alcoholic beer', pl: 'Piwo bezalkoholowe' },
        desc: { en: '', pl: '' },
        price: 15,
      },
    ],
  },
]

/** Gallery-only images — never reused on menu category spreads */
export const gallery = [
  { src: '/images/gallery-food-3.jpg', alt: 'Dessert and wine at the table' },
  { src: '/images/gallery-extra-1.jpg', alt: 'Pasta at Salute 21' },
  { src: '/images/gallery-extra-2.jpg', alt: 'Shared dishes at the table' },
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
  { key: 'spuntini' as const, image: '/images/menu-burgers.jpg' },
  { key: 'bar' as const, image: '/images/menu-hot-coffee.jpg' },
  { key: 'breakfast' as const, image: '/images/highlight-brunch.jpg' },
]
