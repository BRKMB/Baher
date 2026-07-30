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
  /** Optional sub-heading within a category (e.g. Hot Coffee) */
  group?: { en: string; pl: string }
  tags?: Array<'v' | 'w' | 'special'>
}

export type MenuCategoryId =
  | 'burgers'
  | 'pizza'
  | 'sides'
  | 'turkish'
  | 'coffee'
  | 'cold_drinks'

export type MenuCategory = {
  id: MenuCategoryId
  image: string
  note?: { en: string; pl: string }
  items: MenuItem[]
}

/** Current Salute 21 printed card — adapted for the site flip-book */
export const menu: MenuCategory[] = [
  {
    id: 'burgers',
    image: '/images/menu-burgers.jpg',
    note: {
      en: 'All burgers are served with fries · Add a drink to any burger + 8 zł',
      pl: 'Wszystkie burgery serwujemy z frytkami · Dodaj napój do burgera + 8 zł',
    },
    items: [
      {
        name: { en: 'Smash Burger', pl: 'Smash Burger' },
        desc: {
          en: 'Smash patty, soft bun, house sauce, pickles',
          pl: 'Smash burger, miękka bułka, sos domu, pikle',
        },
        price: 39,
      },
      {
        name: { en: 'Cheddar Smash Burger', pl: 'Cheddar Smash Burger' },
        desc: {
          en: 'Double smash, melted cheddar, soft bun, house sauce',
          pl: 'Podwójny smash, cheddar, miękka bułka, sos domu',
        },
        price: 44,
      },
      {
        name: { en: 'Chicken Burger', pl: 'Chicken Burger' },
        desc: {
          en: 'Crispy chicken, soft bun, fresh salad, house sauce',
          pl: 'Chrupiący kurczak, miękka bułka, sałata, sos domu',
        },
        price: 41,
      },
    ],
  },
  {
    id: 'pizza',
    image: '/images/menu-pizza.jpg',
    note: {
      en: 'All pizzas 32 cm',
      pl: 'Wszystkie pizze 32 cm',
    },
    items: [
      {
        name: { en: 'Margherita Pizza', pl: 'Pizza Margherita' },
        desc: {
          en: 'Tomato sauce, mozzarella, fresh basil',
          pl: 'Sos pomidorowy, mozzarella, świeża bazylia',
        },
        price: 39,
        tags: ['w'],
      },
      {
        name: { en: '4 Cheese Pizza', pl: 'Pizza 4 sery' },
        desc: {
          en: 'Mozzarella, gorgonzola, cheddar, Parmesan',
          pl: 'Mozzarella, gorgonzola, cheddar, parmezan',
        },
        price: 46,
        tags: ['w'],
      },
      {
        name: {
          en: 'Burrata & Sun-Dried Tomato Pizza',
          pl: 'Pizza Burrata & suszone pomidory',
        },
        desc: {
          en: 'Tomato base, mozzarella, burrata, sun-dried tomatoes',
          pl: 'Baza pomidorowa, mozzarella, burrata, suszone pomidory',
        },
        price: 52,
        tags: ['w'],
      },
      {
        name: { en: 'Pizza with Sausage', pl: 'Pizza z kiełbasą' },
        desc: {
          en: 'Tomato sauce, mozzarella, sausage',
          pl: 'Sos pomidorowy, mozzarella, kiełbasa',
        },
        price: 45,
      },
    ],
  },
  {
    id: 'sides',
    image: '/images/menu-sides.jpg',
    items: [
      {
        name: { en: 'Crispy Chicken Box', pl: 'Crispy Chicken Box' },
        desc: {
          en: 'Crispy chicken pieces, house dip',
          pl: 'Chrupiące kawałki kurczaka, dip domu',
        },
        price: 32,
      },
      {
        name: { en: 'Fries', pl: 'Frytki' },
        desc: {
          en: 'Golden fries, sea salt',
          pl: 'Złociste frytki, sól morska',
        },
        price: 16,
        tags: ['v'],
      },
      {
        name: { en: 'Onion Rings', pl: 'Krążki cebulowe' },
        desc: {
          en: 'Crispy battered onion rings',
          pl: 'Chrupiące krążki cebulowe w panierce',
        },
        price: 18,
        tags: ['w'],
      },
      {
        name: { en: 'Cheese Jalapeño Bites', pl: 'Cheese Jalapeño Bites' },
        desc: {
          en: 'Melted cheese, jalapeño heat, crisp coating',
          pl: 'Roztopiony ser, jalapeño, chrupiąca panierka',
        },
        price: 22,
        tags: ['w'],
      },
    ],
  },
  {
    id: 'turkish',
    image: '/images/menu-turkish.jpg',
    items: [
      {
        name: {
          en: 'Meatball Sandwich (with Pickles)',
          pl: 'Kanapka z pulpety (z ogórkami)',
        },
        desc: {
          en: 'Warm meatballs, pickles, soft bread',
          pl: 'Ciepłe pulpety, ogórki kiszone, miękki chleb',
        },
        price: 34,
      },
      {
        name: {
          en: 'Toast with Cheese (Kaşarlı Toast)',
          pl: 'Tost z serem (Kaşarlı Toast)',
        },
        desc: {
          en: 'Toasted bread, melted kaşar cheese',
          pl: 'Tostowany chleb, roztopiony ser kaşar',
        },
        price: 24,
        tags: ['w'],
      },
      {
        name: {
          en: 'Toast with Cheese & Sausage',
          pl: 'Tost z serem i kiełbasą',
        },
        desc: {
          en: 'Toasted bread, cheese, sausage',
          pl: 'Tostowany chleb, ser, kiełbasa',
        },
        price: 28,
      },
    ],
  },
  {
    id: 'coffee',
    image: '/images/menu-coffee.jpg',
    note: {
      en: 'Milk alternative + 2 zł',
      pl: 'Alternatywa mleka + 2 zł',
    },
    items: [
      {
        group: { en: 'Hot coffee', pl: 'Kawa gorąca' },
        name: { en: 'Espresso', pl: 'Espresso' },
        desc: { en: 'Single shot', pl: 'Pojedyncze' },
        price: 10,
      },
      {
        group: { en: 'Hot coffee', pl: 'Kawa gorąca' },
        name: { en: 'Doppio', pl: 'Doppio' },
        desc: { en: 'Double espresso', pl: 'Podwójne espresso' },
        price: 12,
      },
      {
        group: { en: 'Hot coffee', pl: 'Kawa gorąca' },
        name: { en: 'Americano', pl: 'Americano' },
        desc: { en: 'Espresso with hot water', pl: 'Espresso z gorącą wodą' },
        price: 13,
      },
      {
        group: { en: 'Hot coffee', pl: 'Kawa gorąca' },
        name: { en: 'Cappuccino', pl: 'Cappuccino' },
        desc: { en: 'Espresso, steamed milk, foam', pl: 'Espresso, spienione mleko' },
        price: 15,
      },
      {
        group: { en: 'Hot coffee', pl: 'Kawa gorąca' },
        name: { en: 'Latte', pl: 'Latte' },
        desc: { en: 'Espresso with silky milk', pl: 'Espresso z aksamitnym mlekiem' },
        price: 16,
      },
      {
        group: { en: 'Hot coffee', pl: 'Kawa gorąca' },
        name: { en: 'Flat White', pl: 'Flat White' },
        desc: { en: 'Double espresso, microfoam', pl: 'Podwójne espresso, mikrofoam' },
        price: 16,
      },
      {
        group: { en: 'Cold coffee', pl: 'Kawa mrożona' },
        name: { en: 'Ice Americano', pl: 'Ice Americano' },
        desc: { en: 'Espresso over ice', pl: 'Espresso na lodzie' },
        price: 14,
      },
      {
        group: { en: 'Cold coffee', pl: 'Kawa mrożona' },
        name: { en: 'Ice Latte', pl: 'Ice Latte' },
        desc: { en: 'Espresso, cold milk, ice', pl: 'Espresso, zimne mleko, lód' },
        price: 17,
      },
      {
        group: { en: 'Cold coffee', pl: 'Kawa mrożona' },
        name: { en: 'Ice Cappuccino', pl: 'Ice Cappuccino' },
        desc: { en: 'Iced cappuccino style', pl: 'Mrożone cappuccino' },
        price: 17,
      },
      {
        group: { en: 'Tea / infusions', pl: 'Herbata / napary' },
        name: { en: 'Black Tea', pl: 'Herbata czarna' },
        desc: { en: 'Classic black tea', pl: 'Klasyczna herbata czarna' },
        price: 12,
        tags: ['v'],
      },
      {
        group: { en: 'Tea / infusions', pl: 'Herbata / napary' },
        name: { en: 'Green Tea', pl: 'Herbata zielona' },
        desc: { en: 'Light green tea', pl: 'Delikatna herbata zielona' },
        price: 12,
        tags: ['v'],
      },
      {
        group: { en: 'Tea / infusions', pl: 'Herbata / napary' },
        name: { en: 'Fresh Mint', pl: 'Świeża mięta' },
        desc: { en: 'Fresh mint infusion', pl: 'Napar ze świeżej mięty' },
        price: 14,
        tags: ['v'],
      },
      {
        group: { en: 'Tea / infusions', pl: 'Herbata / napary' },
        name: { en: 'Fruit Infusion', pl: 'Napar owocowy' },
        desc: { en: 'Seasonal fruit blend', pl: 'Sezonowa mieszanka owocowa' },
        price: 14,
        tags: ['v'],
      },
    ],
  },
  {
    id: 'cold_drinks',
    image: '/images/menu-cold-drinks.jpg',
    items: [
      {
        group: { en: 'Soft drinks (250 ml)', pl: 'Napoje (250 ml)' },
        name: { en: 'Coca-Cola', pl: 'Coca-Cola' },
        desc: { en: 'Classic', pl: 'Klasyczna' },
        price: 10,
      },
      {
        group: { en: 'Soft drinks (250 ml)', pl: 'Napoje (250 ml)' },
        name: { en: 'Coca-Cola Zero', pl: 'Coca-Cola Zero' },
        desc: { en: 'Zero sugar', pl: 'Bez cukru' },
        price: 10,
      },
      {
        group: { en: 'Soft drinks (250 ml)', pl: 'Napoje (250 ml)' },
        name: { en: 'Sprite', pl: 'Sprite' },
        desc: { en: 'Lemon-lime', pl: 'Cytryna-limonka' },
        price: 10,
      },
      {
        group: { en: 'Soft drinks (250 ml)', pl: 'Napoje (250 ml)' },
        name: { en: 'Fanta', pl: 'Fanta' },
        desc: { en: 'Orange', pl: 'Pomarańcza' },
        price: 10,
      },
      {
        group: { en: 'Juices / iced teas / lemonade', pl: 'Soki / iced tea / lemoniada' },
        name: { en: 'Cappy Orange', pl: 'Cappy Orange' },
        desc: { en: 'Orange juice', pl: 'Sok pomarańczowy' },
        price: 12,
      },
      {
        group: { en: 'Juices / iced teas / lemonade', pl: 'Soki / iced tea / lemoniada' },
        name: { en: 'Fuze Tea', pl: 'Fuze Tea' },
        desc: { en: 'Iced tea', pl: 'Mrożona herbata' },
        price: 12,
      },
      {
        group: { en: 'Juices / iced teas / lemonade', pl: 'Soki / iced tea / lemoniada' },
        name: { en: 'Lemonade', pl: 'Lemoniada' },
        desc: { en: 'Fresh lemonade', pl: 'Świeża lemoniada' },
        price: 14,
        tags: ['v'],
      },
      {
        group: { en: 'Non-alcoholic beer', pl: 'Piwo bezalkoholowe' },
        name: { en: 'Stella Artois 0.0', pl: 'Stella Artois 0.0' },
        desc: { en: 'Non-alcoholic lager', pl: 'Lager bezalkoholowy' },
        price: 14,
      },
      {
        group: { en: 'Non-alcoholic beer', pl: 'Piwo bezalkoholowe' },
        name: { en: 'Corona Zero', pl: 'Corona Zero' },
        desc: { en: 'Non-alcoholic', pl: 'Bezalkoholowe' },
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
  { key: 'bar' as const, image: '/images/menu-coffee.jpg' },
  { key: 'breakfast' as const, image: '/images/highlight-brunch.jpg' },
]
