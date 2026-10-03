/** Real 5★ Google reviews for Salute 21 (Kasprzaka 24A). */
export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/7eyKAU1XQgMeXhKSA'
export const GOOGLE_RATING = 5
export const GOOGLE_REVIEW_COUNT = 112

export type GoogleReview = {
  id: string
  name: string
  rating: 5
  quote: { en: string; pl: string }
  /** Real guest photos from the Google Maps review, when available */
  photos?: string[]
}

/**
 * Curated 5-star reviews with comments from Google Maps.
 * Only real guest text. Photos only when taken from the actual Maps review.
 */
export const googleReviews: GoogleReview[] = [
  {
    id: 'baher-magally',
    name: 'Baher Magally',
    rating: 5,
    quote: {
      en: "I think I wouldn't be exaggerating if I said it was the best exp ever, will definitely come back again.",
      pl: 'Myślę, że nie przesadzę, jeśli powiem, że to było najlepsze doświadczenie ever — na pewno wrócę jeszcze raz.',
    },
    photos: [
      '/images/reviews/baher-1.jpg',
      '/images/reviews/baher-2.jpg',
      '/images/reviews/baher-3.jpg',
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
  },
  {
    id: 'rita-akatsuki',
    name: 'Rita Akatsuki',
    rating: 5,
    quote: {
      en: 'Wonderful place, new restaurant! We are delighted. Great atmosphere, and the Margherita pizza was simply delicious. I will definitely come back. Highly recommend — 10/10!',
      pl: 'Cudowne miejsce, nowa restauracja! Jesteśmy zachwyceni. Atmosfera super, a pizza Margarita była po prostu przepyszna. Na pewno jeszcze tu wrócę. Gorąco polecam! 10/10',
    },
  },
  {
    id: 'baris-ata',
    name: 'Barış Ata',
    rating: 5,
    quote: {
      en: 'The smash burgers and sauces are really great! The sauces add a unique flavour, and the prices are very good. Definitely recommend!',
      pl: 'Smash burgery i sosy są naprawdę świetne! Sosy dodają wyjątkowego smaku, a ceny są bardzo dobre. Zdecydowanie polecam!',
    },
  },
  {
    id: 'szymon-czumaj',
    name: 'Szymon Czumaj',
    rating: 5,
    quote: {
      en: 'Great burgers, great lemonade, great owner.',
      pl: 'Świetne burgery, świetna lemoniada, świetny właściciel.',
    },
  },
  {
    id: 'de',
    name: 'De',
    rating: 5,
    quote: {
      en: 'Very tasty food at a great price. Excellent value. Portions are filling, staff is kind, and the atmosphere is pleasant. Definitely recommend!',
      pl: 'Bardzo smaczne jedzenie w świetnej cenie. Doskonały stosunek jakości do ceny. Porcje są sycące, obsługa miła, a atmosfera przyjemna. Zdecydowanie polecam!',
    },
  },
  {
    id: 'nazerke-zhalgasbay',
    name: 'Nazerke Zhalgasbay',
    rating: 5,
    quote: {
      en: 'Burgers here are very good. Staff is also kind and welcoming. Nice atmosphere overall.',
      pl: 'Burgery są tutaj bardzo dobre. Obsługa też miła i gościnna. Fajna atmosfera.',
    },
  },
  {
    id: 'antonina-u',
    name: 'Antonina U',
    rating: 5,
    quote: {
      en: 'Delicious food and amazing interior.',
      pl: 'Pyszne jedzenie i niesamowity wystrój.',
    },
  },
  {
    id: 'huseyin-burak-imdat',
    name: 'Hüseyin Burak İmdat',
    rating: 5,
    quote: {
      en: 'This smash burger is absolutely divine!',
      pl: 'Ten smash burger jest absolutnie boski!',
    },
  },
  {
    id: 'bekir-karaayvaz',
    name: 'Bekir Karaayvaz',
    rating: 5,
    quote: {
      en: 'Food porn! So great — one of the best smash burgers I ate.',
      pl: 'Food porn! Świetne — jeden z najlepszych smash burgerów, jakie jadłem.',
    },
  },
  {
    id: 'gal-smurf',
    name: 'Gal Smurf',
    rating: 5,
    quote: {
      en: 'Wonderful atmosphere. I just ate one of the best hamburgers I have ever seen in my life.',
      pl: 'Wspaniała atmosfera. Zjadłem właśnie jednego z najlepszych hamburgerów w życiu.',
    },
  },
]
