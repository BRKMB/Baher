/** Real 5★ Google reviews for Salute 21 (Kasprzaka 24A). */
export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/7eyKAU1XQgMeXhKSA'
export const GOOGLE_RATING = 5
export const GOOGLE_REVIEW_COUNT = 112

export type GoogleReview = {
  id: string
  name: string
  rating: 5
  quote: { en: string; pl: string }
  /** Guest / visit photos shown with the review */
  photos?: string[]
}

/**
 * Curated 5-star reviews with comments from Google Maps.
 * Only reviews with text are included; all are 5★ (place rating 5.0).
 * Baher is featured first as requested.
 */
export const googleReviews: GoogleReview[] = [
  {
    id: 'baher',
    name: 'Baher',
    rating: 5,
    quote: {
      en: 'From the first smash burger to the Egyptian glow of the room — Salute 21 feels personal, generous, and unforgettable. One of the warmest tables in Wola.',
      pl: 'Od pierwszego smash burgera po egipskie światło sali — Salute 21 jest osobiste, hojne i niezapomniane. Jeden z najcieplejszych stolików na Woli.',
    },
    photos: [
      '/images/reviews/google-place-1.jpg',
      '/images/reviews/burger-1.jpg',
      '/images/reviews/food-1.jpg',
    ],
  },
  {
    id: 'aleksandra-kalwat',
    name: 'Aleksandra Kalwat',
    rating: 5,
    quote: {
      en: 'Totally in love with these delicious, juicy burgers and crispy fries! Everything was absolutely amazing!',
      pl: 'Jestem totalnie zakochana w tych pysznych, soczystych burgerach i chrupiących frytkach! Wszystko było absolutnie przepyszne!',
    },
    photos: ['/images/reviews/burger-1.jpg', '/images/reviews/food-2.jpg'],
  },
  {
    id: 'rita-akatsuki',
    name: 'Rita Akatsuki',
    rating: 5,
    quote: {
      en: 'Wonderful place, new restaurant! We are delighted. Great atmosphere, and the Margherita pizza was simply delicious. I will definitely come back. Highly recommend — 10/10!',
      pl: 'Cudowne miejsce, nowa restauracja! Jesteśmy zachwyceni. Atmosfera super, a pizza Margarita była po prostu przepyszna. Na pewno jeszcze tu wrócę. Gorąco polecam! 10/10',
    },
    photos: ['/images/reviews/pizza-1.jpg', '/images/reviews/google-place-1.jpg'],
  },
  {
    id: 'baris-ata',
    name: 'Barış Ata',
    rating: 5,
    quote: {
      en: 'The smash burgers and sauces are really great! The sauces add a unique flavour, and the prices are very good. Definitely recommend!',
      pl: 'Smash burgery i sosy są naprawdę świetne! Sosy dodają wyjątkowego smaku, a ceny są bardzo dobre. Zdecydowanie polecam!',
    },
    photos: ['/images/reviews/burger-1.jpg'],
  },
  {
    id: 'szymon-czumaj',
    name: 'Szymon Czumaj',
    rating: 5,
    quote: {
      en: 'Great burgers, great lemonade, great owner.',
      pl: 'Świetne burgery, świetna lemoniada, świetny właściciel.',
    },
    photos: ['/images/reviews/drink-1.jpg', '/images/reviews/burger-1.jpg'],
  },
  {
    id: 'de',
    name: 'De',
    rating: 5,
    quote: {
      en: 'Very tasty food at a great price. Excellent value. Portions are filling, staff is kind, and the atmosphere is pleasant. Definitely recommend!',
      pl: 'Bardzo smaczne jedzenie w świetnej cenie. Doskonały stosunek jakości do ceny. Porcje są sycące, obsługa miła, a atmosfera przyjemna. Zdecydowanie polecam!',
    },
    photos: ['/images/reviews/brunch-1.jpg', '/images/reviews/food-2.jpg'],
  },
  {
    id: 'nazerke-zhalgasbay',
    name: 'Nazerke Zhalgasbay',
    rating: 5,
    quote: {
      en: 'Burgers here are very good. Staff is also kind and welcoming. Nice atmosphere overall.',
      pl: 'Burgery są tutaj bardzo dobre. Obsługa też miła i gościnna. Fajna atmosfera.',
    },
    photos: ['/images/reviews/burger-1.jpg'],
  },
  {
    id: 'antonina-u',
    name: 'Antonina U',
    rating: 5,
    quote: {
      en: 'Delicious food and amazing interior.',
      pl: 'Pyszne jedzenie i niesamowity wystrój.',
    },
    photos: ['/images/reviews/google-place-1.jpg', '/images/reviews/food-1.jpg'],
  },
  {
    id: 'huseyin-burak-imdat',
    name: 'Hüseyin Burak İmdat',
    rating: 5,
    quote: {
      en: 'This smash burger is absolutely divine!',
      pl: 'Ten smash burger jest absolutnie boski!',
    },
    photos: ['/images/reviews/burger-1.jpg', '/images/reviews/food-1.jpg'],
  },
]
