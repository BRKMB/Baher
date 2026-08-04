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
  tags?: Array<'vegan' | 'vege' | 'spicy'>
}

export type MenuCategoryId =
  | 'burgers'
  | 'pizza'
  | 'sides'
  | 'turkish'
  | 'hot_coffee'
  | 'cold_coffee'
  | 'tea'
  | 'cold_drinks'

export type MenuCategory = {
  id: MenuCategoryId
  image: string
  note?: { en: string; pl: string }
  items: MenuItem[]
}

/** Current Salute 21 printed card — prices & items match the physical menu */
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
        price: 51,
      },
      {
        name: { en: 'Cheddar Smash Burger', pl: 'Cheddar Smash Burger' },
        desc: {
          en: 'Double smash, melted cheddar, soft bun, house sauce',
          pl: 'Podwójny smash, cheddar, miękka bułka, sos domu',
        },
        price: 56,
      },
      {
        name: { en: 'Chicken Burger', pl: 'Chicken Burger' },
        desc: {
          en: 'Crispy chicken, soft bun, fresh salad, house sauce',
          pl: 'Chrupiący kurczak, miękka bułka, sałata, sos domu',
        },
        price: 49,
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
        price: 35,
      },
      {
        name: { en: '4 Cheese Pizza', pl: 'Pizza 4 sery' },
        desc: {
          en: 'Mozzarella, gorgonzola, cheddar, Parmesan',
          pl: 'Mozzarella, gorgonzola, cheddar, parmezan',
        },
        price: 46,
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
        price: 50,
      },
      {
        name: { en: 'Pizza with Sucuk', pl: 'Pizza z kiełbasą sucuk' },
        desc: {
          en: 'Tomato sauce, mozzarella, sucuk sausage',
          pl: 'Sos pomidorowy, mozzarella, kiełbasa sucuk',
        },
        price: 44,
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
          en: 'Chicken pieces + fries + 1 sauce',
          pl: 'Kawałki kurczaka + frytki + 1 sos',
        },
        price: 25,
      },
      {
        name: { en: 'Fries', pl: 'Frytki' },
        desc: {
          en: '200 g — steak/thick or thin',
          pl: '200 g — steak/grube lub cienkie',
        },
        price: 12,
      },
      {
        name: { en: 'Onion Rings', pl: 'Krążki cebulowe' },
        desc: {
          en: '6 pcs, crispy battered',
          pl: '6 szt., chrupiące w panierce',
        },
        price: 15,
      },
      {
        name: { en: 'Jalapeño Cheese Balls', pl: 'Kulki serowe jalapeño' },
        desc: {
          en: '6 pcs, melted cheese, jalapeño heat',
          pl: '6 szt., ser, jalapeño',
        },
        price: 18,
        tags: ['spicy'],
      },
    ],
  },
  {
    id: 'turkish',
    image: '/images/menu-turkish.jpg',
    items: [
      {
        name: {
          en: 'Köfte Ekmek (Meatball Sandwich)',
          pl: 'Köfte Ekmek',
        },
        desc: {
          en: 'Meatball sandwich with pickles',
          pl: 'Kanapka z pulpety z ogórkami',
        },
        price: 24,
      },
      {
        name: {
          en: 'Toast with Cheese (Kaşarlı Tost)',
          pl: 'Tost z serem (Kaşarlı Tost)',
        },
        desc: {
          en: 'Toasted bread, melted kaşar cheese',
          pl: 'Tostowany chleb, roztopiony ser kaşar',
        },
        price: 25,
      },
      {
        name: {
          en: 'Toast with Cheese & Sucuk',
          pl: 'Tost z serem i kiełbasą sucuk',
        },
        desc: {
          en: 'Toasted bread, cheese, sucuk sausage',
          pl: 'Tostowany chleb, ser, kiełbasa sucuk',
        },
        price: 29,
      },
    ],
  },
  {
    id: 'hot_coffee',
    image: '/images/menu-hot-coffee.jpg',
    note: {
      en: 'Lactose-free milk + 2 zł',
      pl: 'Mleko bezlaktozowe + 2 zł',
    },
    items: [
      {
        name: { en: 'Espresso', pl: 'Espresso' },
        desc: { en: 'Single shot', pl: 'Pojedyncze' },
        price: 13,
      },
      {
        name: { en: 'Doppio', pl: 'Doppio' },
        desc: { en: 'Double espresso', pl: 'Podwójne espresso' },
        price: 15,
      },
      {
        name: { en: 'Americano', pl: 'Americano' },
        desc: { en: 'Espresso with hot water', pl: 'Espresso z gorącą wodą' },
        price: 15,
      },
      {
        name: { en: 'Cappuccino', pl: 'Cappuccino' },
        desc: { en: 'Espresso, steamed milk, foam', pl: 'Espresso, spienione mleko' },
        price: 17,
      },
      {
        name: { en: 'Latte', pl: 'Latte' },
        desc: { en: 'Espresso with silky milk', pl: 'Espresso z aksamitnym mlekiem' },
        price: 18,
      },
      {
        name: { en: 'Flat White', pl: 'Flat White' },
        desc: { en: 'Double espresso, microfoam', pl: 'Podwójne espresso, mikrofoam' },
        price: 18,
      },
      {
        name: { en: 'Café Mocha', pl: 'Café Mocha' },
        desc: { en: 'Espresso, chocolate, steamed milk', pl: 'Espresso, czekolada, spienione mleko' },
        price: 19,
      },
      {
        name: { en: 'Macchiato', pl: 'Macchiato' },
        desc: { en: 'Espresso with a dash of foam', pl: 'Espresso z odrobiną pianki' },
        price: 15,
      },
    ],
  },
  {
    id: 'cold_coffee',
    image: '/images/menu-cold-coffee.jpg',
    note: {
      en: 'Lactose-free milk + 2 zł',
      pl: 'Mleko bezlaktozowe + 2 zł',
    },
    items: [
      {
        name: { en: 'Ice Americano', pl: 'Ice Americano' },
        desc: { en: 'Espresso over ice', pl: 'Espresso na lodzie' },
        price: 17,
      },
      {
        name: { en: 'Ice Latte', pl: 'Ice Latte' },
        desc: { en: 'Espresso, cold milk, ice', pl: 'Espresso, zimne mleko, lód' },
        price: 19,
      },
      {
        name: { en: 'Ice Mocha', pl: 'Ice Mocha' },
        desc: { en: 'Iced mocha with chocolate', pl: 'Mrożone mocha z czekoladą' },
        price: 20,
      },
      {
        name: { en: 'Ice Coffee', pl: 'Ice Coffee' },
        desc: { en: 'Chilled coffee over ice', pl: 'Schłodzona kawa na lodzie' },
        price: 19,
      },
    ],
  },
  {
    id: 'tea',
    image: '/images/menu-tea.jpg',
    items: [
      {
        name: { en: 'Black Tea', pl: 'Herbata czarna' },
        desc: { en: 'Classic black tea', pl: 'Klasyczna herbata czarna' },
        price: 10,
      },
      {
        name: { en: 'Green Tea', pl: 'Herbata zielona' },
        desc: { en: 'Light green tea', pl: 'Delikatna herbata zielona' },
        price: 10,
      },
      {
        name: { en: 'Mint', pl: 'Mięta' },
        desc: { en: 'Mint infusion', pl: 'Napar z mięty' },
        price: 10,
      },
      {
        name: { en: 'Chamomile', pl: 'Rumianek' },
        desc: { en: 'Chamomile infusion', pl: 'Napar z rumianku' },
        price: 10,
      },
      {
        name: { en: 'Ginger with Lemon', pl: 'Imbir z cytryną' },
        desc: { en: 'Ginger and lemon infusion', pl: 'Napar z imbiru i cytryny' },
        price: 11,
      },
      {
        name: { en: 'Forest Fruits', pl: 'Owoce leśne' },
        desc: { en: 'Forest fruit blend', pl: 'Mieszanka owoców leśnych' },
        price: 11,
      },
    ],
  },
  {
    id: 'cold_drinks',
    image: '/images/menu-cold-drinks.jpg',
    items: [
      {
        group: { en: 'Soft drinks (250 ml)', pl: 'Napoje gazowane (250 ml)' },
        name: { en: 'Cola', pl: 'Cola' },
        desc: { en: 'Classic cola', pl: 'Klasyczna cola' },
        price: 10,
      },
      {
        group: { en: 'Soft drinks (250 ml)', pl: 'Napoje gazowane (250 ml)' },
        name: { en: 'Cola Zero', pl: 'Cola Zero' },
        desc: { en: 'Zero sugar', pl: 'Bez cukru' },
        price: 10,
      },
      {
        group: { en: 'Soft drinks (250 ml)', pl: 'Napoje gazowane (250 ml)' },
        name: { en: 'Lemon-Lime Soda', pl: 'Napój cytryna-limonka' },
        desc: { en: 'Sparkling lemon-lime', pl: 'Gazowany cytryna-limonka' },
        price: 10,
      },
      {
        group: { en: 'Soft drinks (250 ml)', pl: 'Napoje gazowane (250 ml)' },
        name: { en: 'Orange Soda', pl: 'Napój pomarańczowy' },
        desc: { en: 'Sparkling orange', pl: 'Gazowany pomarańczowy' },
        price: 10,
      },
      {
        group: { en: 'Juices / iced teas / lemonade', pl: 'Soki / iced tea / lemoniada' },
        name: { en: 'Orange Juice', pl: 'Sok pomarańczowy' },
        desc: { en: 'Chilled orange juice', pl: 'Chłodzony sok pomarańczowy' },
        price: 11,
      },
      {
        group: { en: 'Juices / iced teas / lemonade', pl: 'Soki / iced tea / lemoniada' },
        name: { en: 'Iced Tea', pl: 'Mrożona herbata' },
        desc: { en: 'House iced tea', pl: 'Domowa mrożona herbata' },
        price: 12,
      },
      {
        group: { en: 'Juices / iced teas / lemonade', pl: 'Soki / iced tea / lemoniada' },
        name: { en: 'Classic Lemon Lemonade', pl: 'Klasyczna cytrynowa' },
        desc: { en: 'Classic lemon lemonade', pl: 'Klasyczna lemoniada cytrynowa' },
        price: 15,
      },
      {
        group: { en: 'Non-alcoholic beer', pl: 'Piwo bezalkoholowe' },
        name: { en: 'Non-Alcoholic Lager', pl: 'Lager bezalkoholowy' },
        desc: { en: '0.0% lager', pl: 'Lager 0.0%' },
        price: 15,
      },
      {
        group: { en: 'Non-alcoholic beer', pl: 'Piwo bezalkoholowe' },
        name: { en: 'Non-Alcoholic Beer', pl: 'Piwo bezalkoholowe' },
        desc: { en: '0.0% beer', pl: 'Piwo 0.0%' },
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
