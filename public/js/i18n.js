(() => {
  const STORAGE_KEY = "cns-lang";
  const attrCache = new WeakMap();

  const TEXT = {
    "Przejdź do treści": "Skip to content",
    Sprzątanie: "Cleaning",
    Angielski: "English",
    "O nas": "About",
    Kontakt: "Contact",
    "Skontaktuj się": "Get in touch",
    Napisz: "Write",
    "Czysty dom.": "A clean home.",
    "Lepszy angielski.": "Better English.",
    "Jedna marka. Dwa konkretne światy. Sprzątamy mieszkania, lokale i placówki — i uczymy angielskiego dzieci, młodzież oraz dorosłych.":
      "One brand. Two clear worlds. We clean homes, workplaces and schools — and we teach English to children, teenagers and adults.",
    "Dwa światy, jedna marka": "Two worlds, one brand",
    "Porządek w domu. Pewność w języku.": "Order at home. Confidence in the language.",
    "Clean & Speak nie jest szkołą językową z dopiskiem o sprzątaniu ani firmą sprzątającą z kursem w tle. To dwa pełnoprawne serwisy, które spotykają się w jednym, spokojnym standardzie pracy.":
      "Clean & Speak is not a language school with cleaning added on, or a cleaning company with a course in the background. These are two full services that share one calm way of working.",
    "Usługi sprzątające": "Cleaning services",
    "Mieszkania, domy, biura, przedszkola i szkoły. Raz, regularnie, po remoncie albo same okna.":
      "Homes, offices, nurseries and schools. Once, regularly, after renovation, or windows only.",
    "Zobacz sprzątanie": "See cleaning",
    "Angielski, który służy do mówienia": "English you can actually speak",
    "Dla dzieci, młodzieży i dorosłych. Korepetycje, egzaminy, konwersacje, online albo na miejscu.":
      "For children, teenagers and adults. Tutoring, exams, conversation, online or in person.",
    "Zobacz zajęcia": "See lessons",
    "Sprzątanie dopasowane do miejsca": "Cleaning shaped around the place",
    "Nie cennik z półki. Najpierw zakres, potem wycena.": "No off-the-shelf price list. First the scope, then the quote.",
    "Mieszkania i domy": "Homes and apartments",
    "Regularne albo jednorazowe sprzątanie przestrzeni, w której naprawdę mieszkasz.":
      "Regular or one-off cleaning for the space you actually live in.",
    "Zapytaj o wycenę": "Ask for a quote",
    "Przedszkola, żłobki i szkoły": "Nurseries, kindergartens and schools",
    "Czystość w placówkach, gdzie liczy się spokój, porządek i zaufanie.":
      "Cleanliness in places where calm, order and trust matter.",
    "Biura i lokale usługowe": "Offices and business premises",
    "Porządek w miejscu pracy — bez rozpraszania ludzi, którzy tam pracują.":
      "Order in the workplace — without getting in the way of the people who work there.",
    "Sprzątanie cykliczne": "Recurring cleaning",
    "Stały rytm, który zdejmuje z Ciebie pilnowanie kolejnego terminu.":
      "A steady rhythm, so you do not have to keep the next date in your head.",
    "Umów sprzątanie": "Book cleaning",
    "Mycie okien": "Window cleaning",
    "Osobna usługa, gdy potrzebujesz światła, a nie całego generalnego porządku.":
      "A separate service when you want the light back, not a full deep clean.",
    "Sprzątanie po remoncie": "Post-renovation cleaning",
    "Dokładne posprzątanie po pracach, zanim przestrzeń wróci do codziennego użytku.":
      "A thorough clean after the work, before the space goes back to everyday use.",
    "Angielski dla konkretnego etapu": "English for a specific stage",
    "Od przedszkola po maturę i rozmowę, której ktoś unika od lat.":
      "From preschool to school-leaving exams, and the conversation someone has been avoiding for years.",
    "Dla dzieci": "For children",
    "Nauka przez zabawę dla przedszkolaków i spokojne wsparcie w materiale szkolnym.":
      "Learning through play for preschoolers, and calm support with school material.",
    "Dla młodzieży": "For teenagers",
    "Korepetycje, nadrabianie zaległości i przygotowanie do egzaminu ósmoklasisty oraz matury.":
      "Tutoring, catching up, and preparation for the eighth-grade exam and Matura.",
    "Dla dorosłych": "For adults",
    "Konwersacje i praca nad barierą mówienia — bez szkolnego recytowania regułek.":
      "Conversation and work on the speaking barrier — without reciting school rules.",
    "Online albo stacjonarnie": "Online or in person",
    "Formę ustalamy przy zapytaniu. Ważne, żeby lekcje dało się utrzymać w kalendarzu.":
      "We agree on the format when you get in touch. What matters is that the lessons can stay in the calendar.",
    "Zobacz ofertę angielskiego": "See the English offer",
    "Dlaczego Clean & Speak": "Why Clean & Speak",
    "Jasny kontakt. Konkretny zakres.": "Clear contact. A concrete scope.",
    "Nie dopisujemy nagród, lat doświadczenia ani obietnic, których nie da się sprawdzić. To, co możemy obiecać, widać w sposobie pracy.":
      "We do not add awards, years of experience or promises that cannot be checked. What we can promise is visible in how we work.",
    "Dopasowanie, nie pakiet": "A fit, not a package",
    "Najpierw rozmawiamy o potrzebie. Potem ustalamy zakres sprzątania albo cel zajęć.":
      "First we talk about the need. Then we set the cleaning scope or the lesson goal.",
    "Dwa serwisy, jeden standard": "Two services, one standard",
    "Porządek i język wymagają uwagi. W obu przypadkach pracujemy z konkretną osobą, nie z szablonem.":
      "Order and language both need attention. In both cases we work with a specific person, not a template.",
    "Do uzupełnienia przez firmę": "To be completed by the business",
    "Miejsce na potwierdzone informacje: obszar działania, sposób pracy, zdjęcie osoby prowadzącej, realne opinie.":
      "Space for confirmed information: service area, way of working, a photo of the person behind the brand, real reviews.",
    Opinie: "Reviews",
    "Głosy klientów": "Client voices",
    "Prawdziwe recenzje pojawią się tutaj, gdy firma je przekaże. Nie tworzymy ich na potrzeby strony.":
      "Real reviews will appear here when the business provides them. We do not invent them for the website.",
    "Opinia — sprzątanie": "Review — cleaning",
    "Miejsce na cytat klienta korzystającego z usług sprzątających.": "A place for a quote from a cleaning client.",
    "— Imię, usługa": "— Name, service",
    "Opinia — angielski": "Review — English",
    "Miejsce na cytat rodzica albo osoby, która uczy się angielskiego.":
      "A place for a quote from a parent or someone learning English.",
    "— Imię, zajęcia": "— Name, lessons",
    Pytania: "Questions",
    "Najpierw to, co zwykle trzeba wiedzieć": "First, what people usually need to know",
    "Czym zajmuje się Clean & Speak?": "What does Clean & Speak do?",
    "Dwiema rzeczami: profesjonalnym sprzątaniem oraz nauką angielskiego. Możesz skorzystać z jednej usługi albo z obu.":
      "Two things: professional cleaning and English lessons. You can use one service or both.",
    "Jak umówić sprzątanie?": "How do I book a cleaning?",
    "Napisz przez formularz. Ustalamy zakres, szczegóły i wycenę — dopiero potem termin realizacji.":
      "Write through the form. We agree the scope, details and quote — and only then the date.",
    "Dla kogo są zajęcia z angielskiego?": "Who are the English lessons for?",
    "Dla przedszkolaków, dzieci szkolnych, młodzieży i dorosłych. W ofercie są m.in. nauka przez zabawę, korepetycje, egzaminy i konwersacje.":
      "For preschoolers, school children, teenagers and adults. The offer includes learning through play, tutoring, exams and conversation.",
    "Czy podajecie ceny na stronie?": "Do you publish prices on the website?",
    "Nie. Cena sprzątania i warunki zajęć zależą od zakresu. Dlatego prosimy o zapytanie — wycena powstaje po rozmowie.":
      "No. Cleaning prices and lesson terms depend on the scope. That is why we ask you to enquire — the quote comes after the conversation.",
    "Następny krok": "Next step",
    "Czysty dom. Lepszy angielski. Zacznijmy.": "A clean home. Better English. Let’s start.",
    "Napisz, czego potrzebujesz. Odpowiemy w sprawie sprzątania albo zajęć.":
      "Tell us what you need. We will reply about cleaning or lessons.",
    "Zapytaj o sprzątanie": "Ask about cleaning",
    "Zapytaj o zajęcia": "Ask about lessons",
    "Zadbamy o Twój dom i Twój angielski. Profesjonalne sprzątanie oraz nauka języka pod jedną marką.":
      "We will take care of your home and your English. Professional cleaning and language lessons under one brand.",
    "Zadbamy o Twój dom i Twój angielski.": "We will take care of your home and your English.",
    Nawigacja: "Navigation",
    "Oferta sprzątania": "Cleaning offer",
    "Oferta zajęć": "Lesson offer",
    "Polityka prywatności": "Privacy policy",
    "Strona używa niezbędnych plików cookies, żeby działać poprawnie. Analityki nie dodajemy bez osobnej zgody.":
      "This site uses only the cookies it needs to work. We do not add analytics without a separate consent.",
    "Strona używa niezbędnych plików cookies, żeby działać poprawnie.":
      "This site uses only the cookies it needs to work.",
    Rozumiem: "Got it",
    "Profesjonalne sprzątanie dopasowane do Twoich potrzeb": "Professional cleaning shaped around your needs",
    "Mieszkanie, dom, biuro albo placówka. Raz albo w stałym rytmie. Najpierw ustalamy zakres — potem wycenę.":
      "An apartment, a house, an office or a school. Once, or on a steady rhythm. First we set the scope — then the quote.",
    "Jak to wygląda": "How it works",
    "Porządek w przestrzeni prywatnej — regularnie albo wtedy, gdy po prostu nie starcza dnia.":
      "Order in a private space — regularly, or when the day simply is not long enough.",
    "Czystość w miejscach, gdzie przebywają dzieci. Zakres ustalamy pod konkretną placówkę.":
      "Cleanliness in places where children spend their time. We set the scope for the specific site.",
    "Porządek w miejscu, które ma wyglądać spokojnie i działać bez chaosu po zamknięciu drzwi.":
      "Order in a place that should look calm and work without chaos after the door closes.",
    Rytm: "Rhythm",
    "Cyklicznie albo jednorazowo": "Recurring or one-off",
    "Stały termin i powtarzalny zakres. Dobry wybór, gdy porządek ma się utrzymywać, a nie wracać od wielkiego dzwonu.":
      "A regular date and a repeating scope. A good choice when order should stay, not come back only after a crisis.",
    "Gdy potrzebujesz jednej, konkretnej interwencji: przed gośćmi, po wyprowadzce, po dłuższej nieobecności.":
      "When you need one specific visit: before guests, after a move-out, or after a longer absence.",
    "Sprzątanie jednorazowe": "One-off cleaning",
    "Możemy umyć okna jako osobną usługę albo dołączyć je do szerszego sprzątania.":
      "We can clean windows as a separate service or add them to a wider clean.",
    "Po pyłach, foliach i śladach ekipy. Żeby dało się wejść i mieszkać, a nie tylko „jakoś odkurzyć”.":
      "After dust, film and traces of the crew. So you can walk in and live there — not just “kind of vacuum”.",
    "Jak to działa": "How it works",
    "Od wiadomości do posprzątanej przestrzeni": "From a message to a cleaned space",
    "Kontaktujesz się z nami": "You get in touch",
    "Formularz wystarczy. Napisz, jaki lokal i jakiego sprzątania potrzebujesz.":
      "The form is enough. Tell us the place and the kind of cleaning you need.",
    "Ustalamy zakres": "We set the scope",
    "Doprecyzowujemy pomieszczenia, częstotliwość i dodatkowe rzeczy, na przykład okna.":
      "We specify the rooms, the frequency and extras such as windows.",
    "Dostajesz wycenę": "You receive a quote",
    "Cena powstaje po rozmowie o zakresie. Nie publikujemy stawek w ciemno.":
      "The price comes after a conversation about the scope. We do not publish rates in the dark.",
    "Realizujemy usługę": "We do the work",
    "W umówionym terminie przychodzimy zrobić to, co zostało ustalone.":
      "On the agreed date we come and do what was agreed.",
    "Sprzątanie — FAQ": "Cleaning — FAQ",
    "Przez formularz kontaktowy. Potem ustalamy zakres, wycenę i termin.":
      "Through the contact form. Then we agree the scope, the quote and the date.",
    "Czy sprzątacie jednorazowo?": "Do you clean one-off?",
    "Tak. Możesz zamówić sprzątanie jednorazowe albo cykliczne.": "Yes. You can book a one-off or a recurring clean.",
    "Czy oferujecie sprzątanie cykliczne?": "Do you offer recurring cleaning?",
    "Tak. Częstotliwość ustalamy indywidualnie.": "Yes. We agree the frequency individually.",
    "Czy myjecie okna?": "Do you clean windows?",
    "Tak. Mycie okien jest osobną pozycją w ofercie.": "Yes. Window cleaning is a separate item in the offer.",
    "Czy sprzątacie po remoncie?": "Do you clean after renovation?",
    "Tak. To osobny rodzaj usługi, bo zakres jest inny niż przy codziennym porządku.":
      "Yes. It is a separate kind of service, because the scope is different from everyday cleaning.",
    "Jak ustalana jest cena?": "How is the price set?",
    "Indywidualnie: na podstawie rodzaju lokalu, przybliżonego metrażu, rodzaju sprzątania i dodatkowych prac.":
      "Individually: based on the type of place, the approximate size, the kind of cleaning and any extra work.",
    "Powiedz, co trzeba posprzątać.": "Tell us what needs cleaning.",
    "Im więcej szczegółów w formularzu, tym szybciej wrócimy z wyceną.":
      "The more detail you put in the form, the faster we can come back with a quote.",
    "Angielski, który da się powiedzieć na głos": "English you can say out loud",
    "Dla przedszkolaków, uczniów, nastolatków i dorosłych. Przez zabawę, przy podręczniku, przy egzaminie albo przy zwykłej rozmowie.":
      "For preschoolers, school pupils, teenagers and adults. Through play, with the textbook, before an exam, or in an ordinary conversation.",
    "Dla kogo": "Who it is for",
    "Inny wiek. Inny cel. Ta sama uwaga.": "A different age. A different goal. The same attention.",
    "Przedszkolaki uczą się przez zabawę. Dzieci szkolne dostają spokojne wsparcie w tym, co sprawia trudność na lekcji.":
      "Preschoolers learn through play. School children get calm support with what is hard in class.",
    "Nastolatki, które chcą nadrobić materiał, zdać egzamin albo wreszcie zacząć mówić, a nie tylko uzupełniać lukę.":
      "Teenagers who want to catch up, pass an exam, or finally start speaking instead of only filling gaps.",
    "Osoby, które wracają do angielskiego po przerwie albo chcą przestać się blokować, gdy przychodzi ich kolej.":
      "People coming back to English after a break, or who want to stop freezing when it is their turn.",
    "Dla rodziców": "For parents",
    "Jeśli szukasz zajęć dla dziecka, napisz o wieku i celu. Dopasujemy formę do etapu, a nie do ogólnego „kursu”.":
      "If you are looking for lessons for a child, tell us the age and the goal. We will match the form to the stage, not to a generic “course”.",
    "Formy pracy": "Ways of working",
    "Co można ćwiczyć": "What you can work on",
    "Nauka przez zabawę": "Learning through play",
    "Dla najmłodszych. Ruch, powtórzenia, krótkie sytuacje — bez szkolnej ławki na siłę.":
      "For the youngest. Movement, repetition, short situations — without forcing a school desk.",
    Korepetycje: "Tutoring",
    "Praca przy materiale szkolnym: zrozumieć, nadrobić, przygotować się do sprawdzianu.":
      "Work with school material: understand it, catch up, get ready for a test.",
    "Nadrabianie szkoły": "Catching up at school",
    "Gdy luka się nawarstwiła. Wracamy do tego, co zostało, i porządkujemy dalej.":
      "When the gap has piled up. We go back to what was left behind and put the rest in order.",
    Konwersacje: "Conversation",
    "Mówienie. Słuchanie. Budowanie zdania, które ktoś naprawdę usłyszy.":
      "Speaking. Listening. Building a sentence that someone will actually hear.",
    Egzaminy: "Exams",
    "Ósma klasa i matura": "Eighth grade and Matura",
    "Przygotowujemy do egzaminu ósmoklasisty oraz do matury. Zakres i tempo ustalamy po rozmowie o poziomie i terminie egzaminu.":
      "We prepare for the eighth-grade exam and for Matura. Scope and pace are set after we talk about the level and the exam date.",
    Bariera: "The barrier",
    "Gdy język jest, a głosu nie ma": "When the language is there, but the voice is not",
    "Część osób zna więcej, niż jest w stanie powiedzieć. Pracujemy wtedy nad mówieniem, a nie nad dokładaniem kolejnych reguł.":
      "Some people know more than they can say. Then we work on speaking, not on adding more rules.",
    "Jak odbywają się zajęcia": "How lessons take place",
    "Obie formy są w ofercie. W formularzu możesz zaznaczyć, co Ci bardziej pasuje.":
      "Both formats are available. In the form you can mark what suits you better.",
    "Lekcja bez dojazdu. Dobrze, gdy kalendarz jest ciasny albo uczeń jest w innym miejscu.":
      "A lesson without the commute. Useful when the calendar is tight or the student is somewhere else.",
    Stacjonarnie: "In person",
    "Zajęcia na miejscu. Szczegóły lokalizacji potwierdzimy przy zapytaniu — nie wymyślamy adresu na stronie.":
      "Lessons on site. We will confirm the place when you enquire — we do not invent an address on the website.",
    "Prowadzimy zajęcia dopasowane do ucznia, w tym korepetycje i pracę indywidualną. Jeśli zależy Ci na konkretnym układzie, opisz to w wiadomości.":
      "We run lessons fitted to the student, including tutoring and individual work. If you need a specific arrangement, describe it in the message.",
    "Dlaczego z nami": "Why learn with us",
    "Uczymy pod cel, nie pod broszurę": "We teach toward a goal, not a brochure",
    "Cel na początku": "The goal comes first",
    "Inaczej wygląda matura, inaczej rozmowa, inaczej pierwsza lekcja pięciolatka. Zaczynamy od tego.":
      "Matura looks different from a conversation, and different from a five-year-old’s first lesson. We start there.",
    "Mówienie ma miejsce": "Speaking has a place",
    "Gramatyka nie znika. Ale nie zastępuje głosu. Szczególnie u osób, które już „umieją, tylko nie mówią”.":
      "Grammar does not disappear. It just does not replace the voice. Especially for people who “already know it, they just don’t speak”.",
    "Miejsce na potwierdzone informacje o prowadzącej osobie, kwalifikacjach i sposobie pracy. Nie dopisujemy ich za Ciebie.":
      "Space for confirmed information about the person who teaches, their qualifications and their way of working. We do not invent that for you.",
    "Głosy uczniów i rodziców": "Voices of students and parents",
    "Opinia — rodzic / uczeń": "Review — parent / student",
    "Miejsce na prawdziwą opinię. Pojawi się tutaj po przekazaniu treści przez firmę.":
      "A place for a real review. It will appear here once the business provides the text.",
    "Opinia — dorosły": "Review — adult",
    "Miejsce na cytat osoby, która wróciła do angielskiego albo przełamała barierę mówienia.":
      "A place for a quote from someone who came back to English or broke the speaking barrier.",
    "Angielski — FAQ": "English — FAQ",
    "Dla kogo są zajęcia?": "Who are the lessons for?",
    "Dla przedszkolaków, dzieci szkolnych, młodzieży i dorosłych.":
      "For preschoolers, school children, teenagers and adults.",
    "Czy zajęcia są online?": "Are lessons online?",
    "Tak. Prowadzimy lekcje online.": "Yes. We run lessons online.",
    "Czy prowadzicie zajęcia stacjonarne?": "Do you run in-person lessons?",
    "Tak. Szczegóły miejsca ustalamy przy zapytaniu.": "Yes. We confirm the place when you enquire.",
    "Czy przygotowujecie do matury?": "Do you prepare for Matura?",
    "Tak. Przygotowujemy do matury oraz do egzaminu ósmoklasisty.":
      "Yes. We prepare for Matura and for the eighth-grade exam.",
    "Czy pomagacie w nauce szkolnej?": "Do you help with school English?",
    "Tak. Korepetycje i nadrabianie materiału szkolnego są częścią oferty.":
      "Yes. Tutoring and catching up on school material are part of the offer.",
    "Czy zajęcia są indywidualne?": "Are lessons individual?",
    "Pracujemy z uczniem w formule dopasowanej do celu, w tym w korepetycjach i pracy indywidualnej. Jeśli potrzebujesz innego układu, napisz o tym w formularzu.":
      "We work with the student in a format fitted to the goal, including tutoring and individual work. If you need another arrangement, write about it in the form.",
    "Umówmy pierwszą rozmowę o zajęciach.": "Let’s have a first conversation about lessons.",
    "Napisz wiek albo poziom, cel i czy wolisz online, czy na miejscu.":
      "Tell us the age or level, the goal, and whether you prefer online or in person.",
    "Dwa światy, które nie udają, że są jednym zajęciem": "Two worlds that do not pretend to be one job",
    "Clean & Speak powstało z prostego przekonania: porządek w domu i pewność w języku to dwa rodzaje codziennego komfortu. Dlatego są obok siebie — a nie schowane w dwóch osobnych firmach.":
      "Clean & Speak comes from a simple belief: order at home and confidence in a language are two kinds of everyday comfort. That is why they sit side by side — not hidden in two separate companies.",
    "Po co ta marka": "Why this brand exists",
    "Żeby było jaśniej — w domu i w rozmowie": "So things are clearer — at home and in conversation",
    "Sprzątanie oddaje przestrzeń. Angielski oddaje głos. Łączy je ta sama postawa: najpierw człowiek i jego konkretna potrzeba, potem zakres pracy.":
      "Cleaning gives space back. English gives a voice back. They share the same stance: first the person and their concrete need, then the scope of work.",
    "Porządek, który da się utrzymać": "Order you can keep",
    "Nie sprzedajemy „magicznego efektu wow”. Ustalamy, co ma być zrobione, i to robimy. W mieszkaniu, w biurze, w placówce.":
      "We do not sell a “magic wow effect”. We agree what should be done, and we do that. In a home, an office, a school.",
    "Język, który da się użyć": "A language you can use",
    "Nie obiecuje się tu biegłości w miesiąc. Obiecuje się zajęcia ustawione pod wiek, egzamin albo barierę mówienia.":
      "Nobody promises fluency in a month. What we offer is lessons set to an age, an exam, or a speaking barrier.",
    "Jak pracujemy": "How we work",
    "Osobiście. Konkretnie. Bez ozdobników.": "Personally. Concretely. Without decoration.",
    "Rozmowa przed usługą": "A conversation before the service",
    "Wycena i plan zajęć powstają po tym, jak opowiesz, czego potrzebujesz. Nie odwrotnie.":
      "The quote and the lesson plan come after you say what you need. Not the other way around.",
    "Jedna marka, dwa rytmy": "One brand, two rhythms",
    "Możesz przyjść tylko po sprzątanie. Albo tylko po angielski. Albo po oba. Nic nie jest „w pakiecie obowiązkowym”.":
      "You can come only for cleaning. Or only for English. Or for both. Nothing is a “mandatory bundle”.",
    "Tu powinno stanąć prawdziwe zdjęcie osoby albo osób prowadzących Clean & Speak oraz kilka zdań o tym, kto stoi za marką. Nie wstawiamy zdjęć stockowych udających zespół i nie dopisujemy biografii.":
      "This is where a real photo of the person or people behind Clean & Speak should stand, with a few sentences about who they are. We do not insert stock photos pretending to be the team, and we do not invent a biography.",
    "Porozmawiajmy o Twoich potrzebach.": "Let’s talk about what you need.",
    "Napisz, czy chodzi o dom, lokal, dziecko, egzamin, czy o własny angielski.":
      "Tell us whether it is a home, a workplace, a child, an exam, or your own English.",
    "Jak możemy Ci pomóc?": "How can we help you?",
    "Wybierz sprzątanie albo angielski. Formularz zmieni pytania, żebyś nie musiał opisywać wszystkiego od zera.":
      "Choose cleaning or English. The form will change its questions, so you do not have to start from scratch.",
    "Imię i nazwisko": "Name",
    "E-mail": "Email",
    Telefon: "Phone",
    "(opcjonalnie)": "(optional)",
    "Rodzaj nieruchomości": "Type of property",
    Wybierz: "Choose",
    Mieszkanie: "Apartment",
    Dom: "House",
    "Przedszkole, żłobek albo szkoła": "Nursery, kindergarten or school",
    "Biuro albo lokal usługowy": "Office or business premises",
    Inne: "Other",
    "Przybliżony metraż albo liczba pomieszczeń": "Approximate size or number of rooms",
    "Rodzaj sprzątania": "Type of cleaning",
    Cykliczne: "Recurring",
    Jednorazowe: "One-off",
    "Po remoncie": "After renovation",
    "Inne / mieszane": "Other / mixed",
    Częstotliwość: "Frequency",
    "(jeśli cykliczne)": "(if recurring)",
    "Preferowany termin": "Preferred date",
    Lokalizacja: "Location",
    "Dodatkowe usługi": "Additional services",
    "Wiek albo poziom ucznia": "Age or student level",
    "Online czy stacjonarnie": "Online or in person",
    "Jeszcze nie wiem": "I don’t know yet",
    Tryb: "Format",
    Indywidualnie: "Individual",
    "Do ustalenia": "To be agreed",
    "Główny cel": "Main goal",
    "Nauka przez zabawę / dziecko": "Learning through play / child",
    "Szkoła i korepetycje": "School and tutoring",
    "Egzamin ósmoklasisty albo matura": "Eighth-grade exam or Matura",
    "Bariera mówienia": "Speaking barrier",
    "Preferowane dni": "Preferred days",
    "Preferowane godziny": "Preferred hours",
    Wiadomość: "Message",
    Firma: "Company",
    "Zgadzam się na kontakt w sprawie tego zapytania. Szczegóły w":
      "I agree to be contacted about this enquiry. Details in the",
    "polityce prywatności": "privacy policy",
    "Wyślij zapytanie": "Send enquiry",
    "Inne sposoby kontaktu": "Other ways to get in touch",
    "Pojawią się tutaj, gdy firma potwierdzi telefon, e-mail albo komunikator.":
      "They will appear here once the business confirms a phone number, email or messenger.",
    "Napisz na WhatsApp": "Write on WhatsApp",
    "Profil na Instagramie": "Instagram profile",
    "Profil na Facebooku": "Facebook profile",
    "Obszar działania": "Service area",
    "Do uzupełnienia: miasto, dzielnice albo zasięg dojazdów.":
      "To be completed: city, districts or travel range.",
    "Tej strony nie ma.": "This page is not here.",
    "Może została przeniesiona. Zostały dwie pewne drogi: sprzątanie albo angielski.":
      "It may have moved. Two sure paths remain: cleaning or English.",
    "Wróć na stronę główną": "Back to the homepage",
    Dokument: "Document",
    "Wersja robocza": "Draft version",
    "To nie jest gotowy dokument prawny. Firma musi uzupełnić administratora danych, dane kontaktowe, podstawy prawne i czas przechowywania z prawnikiem.":
      "This is not a finished legal document. The business needs to complete the data controller, contact details, legal bases and retention time with a lawyer.",
    "Formularz na stronie zbiera tylko te informacje, które osoba sama wpisuje: imię, e-mail, opcjonalny telefon, treść zapytania oraz odpowiedzi związane z wybraną usługą.":
      "The form collects only what a person types in: name, email, an optional phone number, the message, and answers related to the chosen service.",
    "Dane z formularza są zapisywane po to, żeby odpowiedzieć na zapytanie o sprzątanie albo o zajęcia z angielskiego. Nie sprzedajemy ich i nie publikujemy.":
      "Form data is stored so we can reply to a cleaning or English enquiry. We do not sell it or publish it.",
    "Na stronie nie uruchamiamy narzędzi analitycznych ani reklamowych, dopóki firma ich świadomie nie doda i nie uzyska wymaganych zgód.":
      "The site does not run analytics or advertising tools until the business adds them on purpose and collects the required consents.",
    "Osoba, która wysłała zapytanie, może poprosić o wgląd, sprostowanie albo usunięcie swoich danych — gdy tylko firma potwierdzi adres do takiej korespondencji.":
      "The person who sent an enquiry can ask to see, correct or delete their data — once the business confirms an address for that correspondence.",
    "Do uzupełnienia: nazwa administratora, NIP / REGON jeśli dotyczy, adres siedziby, e-mail do spraw prywatności, okres przechowywania zapytań.":
      "To be completed: controller name, tax IDs if they apply, registered address, privacy email, and how long enquiries are kept.",
    "Ta strona zapisuje w przeglądarce tylko informację o tym, że zamknięto pasek z komunikatem o cookies. Służy to temu, żeby komunikat nie wracał przy każdej wizycie.":
      "This site stores only the fact that the cookie notice was closed, so the notice does not return on every visit.",
    "Nie ustawiamy cookies reklamowych ani statystycznych, dopóki firma nie wdroży osobnego narzędzia i nie zbierze odpowiednich zgód.":
      "We do not set advertising or statistics cookies until the business adds a separate tool and collects the right consents.",
    "Przeglądarka pozwala usuwać zapisane dane w ustawieniach prywatności.":
      "The browser can delete stored data in its privacy settings.",
    "Więcej o danych z formularza:": "More about form data:",
    "polityka prywatności": "privacy policy",
    "Aby wysłać zapytanie, potwierdź zgodę na kontakt.": "To send the enquiry, please confirm you agree to be contacted.",
    "Wysyłanie…": "Sending…",
    "Wysyłamy Twoje zapytanie.": "Sending your enquiry.",
    "Dziękujemy. Odezwiemy się tak szybko, jak to możliwe.": "Thank you. We will get back to you as soon as we can.",
    "Nie udało się wysłać zapytania.": "The enquiry could not be sent.",
    "Poczekaj chwilę, zanim wyślesz kolejne zapytanie.": "Please wait a moment before sending another enquiry.",
    Wysłano: "Sent",
    "Podaj imię i nazwisko albo imię.": "Enter a name.",
    "Podaj poprawny adres e-mail.": "Enter a valid email address.",
    "Wybierz usługę: sprzątanie albo angielski.": "Choose a service: cleaning or English.",
    "Podaj poprawny numer telefonu albo zostaw to pole puste.":
      "Enter a valid phone number or leave this field empty.",
    "Popraw zaznaczone pola i wyślij ponownie.": "Fix the highlighted fields and send again.",
    "Odpowiedź na konkret": "An answer to the specifics",
    "Piszesz, czego potrzebujesz. Wracamy z wyceną sprzątania albo propozycją zajęć — bez cennika w ciemno.":
      "You write what you need. We come back with a cleaning quote or a lesson proposal — no blind price list.",
    "Jak zacząć": "How to start",
    "Trzy kroki do pierwszej odpowiedzi": "Three steps to the first reply",
    "Bez rejestracji i bez rozmowy telefonicznej na start. Wystarczy formularz.":
      "No sign-up and no phone call to begin with. The form is enough.",
    "Wybierasz usługę": "You pick the service",
    "Sprzątanie albo angielski. Formularz sam dopasuje pytania do wyboru.":
      "Cleaning or English. The form adjusts its questions to your choice.",
    "Opisujesz potrzebę": "You describe the need",
    "Metraż i rodzaj sprzątania albo wiek ucznia i cel zajęć. Kilka zdań wystarczy.":
      "The size and type of cleaning, or the student’s age and lesson goal. A few sentences are enough.",
    "Dostajesz odpowiedź": "You get a reply",
    "Odpisujemy na podany e-mail z wyceną albo propozycją terminu zajęć.":
      "We reply to the email you gave, with a quote or a proposed lesson time.",
    "Tempo ucznia": "The student’s pace",
    "Materiał dobieramy do poziomu i terminu, a nie do gotowego programu kursu.":
      "We match the material to the level and the deadline, not to a ready-made course programme.",
    "Pierwsze zajęcia": "First lessons",
    "Jak zaczynamy naukę": "How we start learning",
    "Rozmowa o celu": "A conversation about the goal",
    "Wiek albo poziom ucznia, powód nauki i termin, który ma znaczenie — na przykład egzamin.":
      "The student’s age or level, the reason for learning, and any date that matters — an exam, for example.",
    "Ustalenie formy": "Setting the format",
    "Online albo stacjonarnie, częstotliwość i godziny, które da się utrzymać w kalendarzu.":
      "Online or in person, the frequency and the hours that can stay in the calendar.",
    "Start zajęć": "Lessons begin",
    "Pierwsza lekcja pokazuje punkt wyjścia. Po niej doprecyzowujemy plan pracy.":
      "The first lesson shows the starting point. After it we sharpen the plan.",
    "Zakres zamiast obietnic": "Scope instead of promises",
    "Zanim ruszymy, wiadomo, co dokładnie zostanie zrobione i w jakim czasie.":
      "Before we start, it is clear what will be done and in what time.",
    "Kontakt z jedną osobą": "One person to talk to",
    "Odpowiada Ci Daria Thorsen — ta sama osoba, która ustala zakres sprzątania albo prowadzi zajęcia.":
      "Daria Thorsen answers you — the same person who sets the cleaning scope or teaches the lessons.",
    "Prowadzi Daria Thorsen. Czysta przestrzeń. Pewny angielski.":
      "Run by Daria Thorsen. A clean space. Confident English.",
    Prowadzi: "Run by",
    "Bez ukrytych dopłat": "No hidden extras",
    "Wycena obejmuje ustalony zakres. Zmiany omawiamy wcześniej, nie po fakcie.":
      "The quote covers the agreed scope. Changes are discussed beforehand, not afterwards.",
    "Przestrzeń prywatna": "Private space",
    Placówki: "Institutions",
    "Miejsca pracy": "Workplaces",
    "Stały rytm": "Steady rhythm",
    "Jeden termin": "A single date",
    "Osobna usługa": "A separate service",
    "Po pracach": "After the works",
    "Formularz obok jest na razie najszybszą drogą. Telefon i e-mail pojawią się tutaj, gdy tylko zostaną potwierdzone.":
      "For now the form next to this is the fastest route. A phone number and email will appear here once they are confirmed.",
    Adres: "Address",
    "Odpowiadamy e-mailem": "We reply by email",
    "na adres podany w formularzu.": "to the address given in the form.",
    "Zapytania o sprzątanie i o zajęcia trafiają do tej samej skrzynki.":
      "Cleaning and lesson enquiries go to the same inbox.",
    Regulamin: "Terms",
    "Zapytanie wysłane": "Enquiry sent",
    "Dziękujemy. Mamy Twoje zapytanie.": "Thank you. We have your enquiry.",
    "Odpowiadamy e-mailem na adres podany w formularzu. Jeśli zapytanie dotyczyło sprzątania, wracamy z wyceną po ustaleniu zakresu. Przy zajęciach z angielskiego proponujemy termin pierwszej lekcji.":
      "We reply by email to the address given in the form. For cleaning, we come back with a quote once the scope is set. For English, we propose a time for the first lesson.",
    "Co dalej": "What happens next",
    "Czytamy zapytania w kolejności zgłoszeń i odpisujemy na podany adres e-mail.":
      "We read enquiries in the order they arrive and reply to the email address given.",
    "Nie ma odpowiedzi?": "No reply?",
    "Sprawdź folder ze spamem. Możesz też wysłać zapytanie ponownie z innego adresu.":
      "Check your spam folder. You can also send the enquiry again from another address.",
    "Chcesz coś dodać": "Want to add something",
    "Napisz kolejne zapytanie z uzupełnieniem — dopiszemy je do sprawy.":
      "Send another enquiry with the extra details — we will add it to the case.",
    "To nie jest gotowy dokument prawny. Dane firmy, warunki płatności i tryb reklamacji trzeba uzupełnić przed publikacją.":
      "This is not a finished legal document. Company details, payment terms and the complaints procedure must be completed before publication.",
    Zakres: "Scope",
    "Regulamin dotyczy korzystania ze strony Clean & Speak oraz zapytań wysyłanych przez formularz kontaktowy. Nie zastępuje umowy zawieranej na konkretną usługę.":
      "These terms cover the use of the Clean & Speak website and enquiries sent through the contact form. They do not replace the agreement made for a specific service.",
    "Zapytania i wycena": "Enquiries and quotes",
    "Wysłanie formularza nie jest rezerwacją terminu ani zawarciem umowy. Jest zapytaniem, na które odpowiadamy e-mailem.":
      "Sending the form is not a booking or a contract. It is an enquiry that we answer by email.",
    "Cena sprzątania oraz warunki zajęć z angielskiego ustalane są indywidualnie, po określeniu zakresu. Strona nie zawiera cennika.":
      "Cleaning prices and English lesson terms are set individually, once the scope is known. The site has no price list.",
    "Realizacja usługi": "Delivering the service",
    "Zakres pracy, termin i cena są potwierdzane przed rozpoczęciem usługi. Zmiany zakresu wymagają wcześniejszego ustalenia.":
      "The scope, date and price are confirmed before the service starts. Changes to the scope must be agreed in advance.",
    "Termin można odwołać albo przesunąć, kontaktując się tą samą drogą, którą zostało wysłane zapytanie.":
      "A date can be cancelled or moved by getting in touch the same way the enquiry was sent.",
    Reklamacje: "Complaints",
    "Uwagi do wykonanej usługi przyjmujemy e-mailem. Odpowiadamy na nie i ustalamy sposób rozwiązania sprawy.":
      "We accept comments about completed work by email. We answer them and agree how to resolve the matter.",
    "Dane osobowe": "Personal data",
    "Zasady przetwarzania danych z formularza opisuje": "How form data is processed is described in the",
    "Zmiany regulaminu": "Changes to the terms",
    "Regulamin może być aktualizowany. Obowiązuje wersja opublikowana na stronie w chwili wysłania zapytania.":
      "These terms may be updated. The version published on the site when the enquiry is sent applies.",
    "Do uzupełnienia: pełna nazwa firmy, forma prawna, NIP, adres oraz e-mail do korespondencji.":
      "To be completed: full company name, legal form, tax number, address and an email for correspondence.",
    "Strona liczy odsłony i kliknięcia we własnym zakresie, bez cookies i bez identyfikatorów użytkownika. Zapisujemy tylko adres podstrony, nazwę zdarzenia, domenę źródła wejścia i kraj. Nie korzystamy z zewnętrznych narzędzi reklamowych.":
      "The site counts page views and clicks on its own, without cookies and without user identifiers. We store only the page path, the event name, the referring domain and the country. We do not use third-party advertising tools.",
    "Nie ustawiamy cookies reklamowych ani statystycznych. Statystyki odwiedzin zbieramy bez cookies i bez identyfikatorów — liczymy odsłony podstron i kliknięcia, nie pojedyncze osoby.":
      "We set no advertising or statistics cookies. Visit statistics are collected without cookies and without identifiers — we count page views and clicks, not individual people.",
    "Ta strona nie istnieje. Przejdź do oferty sprzątania, zajęć z angielskiego albo do kontaktu.":
      "This page does not exist. Go to the cleaning offer, the English lessons or the contact page.",
    Panel: "Panel",
    Zapytania: "Enquiries",
    "Zapytania z formularza": "Form enquiries",
    "Wejście tylko dla osoby prowadzącej stronę.": "Entry only for the person who runs the site.",
    Hasło: "Password",
    Wejdź: "Sign in",
    Wyloguj: "Log out",
    Wszystkie: "All",
    "Zapytanie zostało usunięte.": "The enquiry has been deleted.",
    "Nie udało się usunąć zapytania. Odśwież stronę i spróbuj ponownie.":
      "The enquiry could not be deleted. Refresh the page and try again.",
    "Brak zapytań o sprzątanie.": "There are no cleaning enquiries.",
    "Brak zapytań o zajęcia angielskiego.": "There are no English lesson enquiries.",
    "Nie ma jeszcze żadnego zapytania. Gdy ktoś wyśle formularz, pojawi się tutaj.":
      "There are no enquiries yet. When someone sends the form, it will show up here.",
    Dzisiaj: "Today",
    Wczoraj: "Yesterday",
    "Bez daty": "No date",
    Nieruchomość: "Property",
    Metraż: "Size",
    "Poziom / wiek": "Level / age",
    "Forma zajęć": "Lesson format",
    Cel: "Goal",
    Dni: "Days",
    Godziny: "Hours",
    Termin: "Date",
    Dodatki: "Extras",
    Placówka: "Institution",
    Biuro: "Office",
    Okna: "Windows",
    Stacjonarnie: "In person",
    "Nie wiem": "I don’t know",
    Dzieci: "Children",
    Szkoła: "School",
    Egzamin: "Exam",
    Konwersacje: "Conversation",
    "Bariera mówienia": "Speaking barrier",
    "Wyślij hasło przez formularz.": "Send the password through the form.",
    "Nieprawidłowe hasło.": "Incorrect password.",
    "Za dużo prób. Poczekaj chwilę i spróbuj ponownie.": "Too many attempts. Wait a moment and try again.",
    "Niedozwolona metoda.": "Method not allowed.",
  };

  const TITLES = {
    "/": "Clean & Speak — cleaning and English",
    "/sprzatanie/": "Cleaning — Clean & Speak",
    "/angielski/": "English — Clean & Speak",
    "/o-nas/": "About — Clean & Speak",
    "/kontakt/": "Contact — Clean & Speak",
    "/polityka-prywatnosci/": "Privacy policy — Clean & Speak",
    "/regulamin/": "Terms — Clean & Speak",
    "/cookies/": "Cookies — Clean & Speak",
    "/dziekujemy/": "Thank you for your enquiry — Clean & Speak",
    "/admin/": "Enquiries — Clean & Speak",
  };

  const TITLE_TEXT = {
    "Clean & Speak — sprzątanie i angielski": "Clean & Speak — cleaning and English",
    "Sprzątanie — Clean & Speak": "Cleaning — Clean & Speak",
    "Angielski — Clean & Speak": "English — Clean & Speak",
    "O nas — Clean & Speak": "About — Clean & Speak",
    "Kontakt — Clean & Speak": "Contact — Clean & Speak",
    "Polityka prywatności — Clean & Speak": "Privacy policy — Clean & Speak",
    "Regulamin — Clean & Speak": "Terms — Clean & Speak",
    "Cookies — Clean & Speak": "Cookies — Clean & Speak",
    "Dziękujemy za zapytanie — Clean & Speak": "Thank you for your enquiry — Clean & Speak",
    "Nie znaleziono strony — Clean & Speak": "Page not found — Clean & Speak",
    "Panel zapytań — Clean & Speak": "Enquiry panel — Clean & Speak",
    "Zapytania — Clean & Speak": "Enquiries — Clean & Speak",
  };

  const ATTR = {
    "Clean & Speak — strona główna": "Clean & Speak — home",
    Główne: "Main",
    "Menu mobilne": "Mobile menu",
    "Otwórz menu": "Open menu",
    "Informacja o cookies": "Cookie information",
    "Jasne wnętrze mieszkania gotowe do codziennego użytku": "A bright apartment interior ready for everyday use",
    "Przestrzeń edukacyjna wymagająca regularnego porządku": "An education space that needs regular cleaning",
    "Jasne biuro z miejscami do pracy": "A bright office with places to work",
    "Duże okna wpuszczające światło do wnętrza": "Large windows letting light into the room",
    "Przestrzeń po pracach wykończeniowych": "A space after finishing work",
    "Notatki i materiały do nauki języka": "Notes and language-learning materials",
    "Rozmowa dwóch osób przy stole": "Two people talking at a table",
    "Spokojne, uporządkowane wnętrze z naturalnym światłem": "A calm, orderly interior with natural light",
    "Uprzątnięty, jasny salon z naturalnym światłem": "A tidy, bright living room with natural light",
    "Uśmiechnięta osoba ucząca się angielskiego przy laptopie":
      "A smiling person learning English at a laptop",
    "np. 48 m² albo 3 pokoje": "e.g. 48 m² or 3 rooms",
    "np. co tydzień, co dwa tygodnie": "e.g. every week, every two weeks",
    "np. przyszły tydzień": "e.g. next week",
    "miasto, dzielnica albo adres do wyceny": "city, district or address for the quote",
    "np. okna, lodówka, po wyprowadzce": "e.g. windows, fridge, after move-out",
    "np. 8 lat, klasa 7, B1, dorosły po przerwie": "e.g. 8 years old, grade 7, B1, adult after a break",
    "np. wtorki i czwartki": "e.g. Tuesdays and Thursdays",
    "np. po 17:00": "e.g. after 17:00",
    "Napisz to, czego nie da się wybrać z listy.": "Write anything that does not fit the list.",
    "Zadzwoń 534 346 436": "Call 534 346 436",
    "Filtr zapytań": "Enquiry filter",
  };

  const normalize = (value) => value.replace(/\s+/g, " ").trim();

  const getLang = () => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "pl";
    } catch {
      return "pl";
    }
  };

  const translate = (value) => {
    if (getLang() !== "en" || typeof value !== "string") return value;
    return TEXT[normalize(value)] || value;
  };

  const collectTextNodes = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const parent = walker.currentNode.parentElement;
      if (!parent) continue;
      if (["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parent.tagName)) continue;
      if (parent.closest("[data-lang-toggle], .footer-credit, [data-no-i18n]")) continue;
      nodes.push(walker.currentNode);
    }
    return nodes;
  };

  const applyText = (lang) => {
    for (const node of collectTextNodes()) {
      if (!node.cnsOriginal) node.cnsOriginal = node.nodeValue;
      const original = node.cnsOriginal;
      const key = normalize(original);
      if (!key) continue;
      if (lang === "en" && TEXT[key]) {
        const lead = original.match(/^\s*/)?.[0] ?? "";
        const trail = original.match(/\s*$/)?.[0] ?? "";
        node.nodeValue = `${lead}${TEXT[key]}${trail}`;
      } else {
        node.nodeValue = original;
      }
    }
  };

  const applyAttributes = (lang) => {
    const targets = document.querySelectorAll("[aria-label], [placeholder], [alt], [title]");
    targets.forEach((element) => {
      if (element.closest("[data-lang-toggle], [data-no-i18n]")) return;
      let cached = attrCache.get(element);
      if (!cached) {
        cached = {};
        ["aria-label", "placeholder", "alt", "title"].forEach((name) => {
          if (element.hasAttribute(name)) cached[name] = element.getAttribute(name) || "";
        });
        attrCache.set(element, cached);
      }
      Object.entries(cached).forEach(([name, original]) => {
        element.setAttribute(name, lang === "en" && ATTR[original] ? ATTR[original] : original);
      });
    });
  };

  const applyTitle = (lang) => {
    if (!document.documentElement.dataset.cnsTitle) {
      document.documentElement.dataset.cnsTitle = document.title;
    }
    const originalTitle = document.documentElement.dataset.cnsTitle;
    if (lang === "en") {
      const raw = window.location.pathname;
      const path = raw === "/" ? "/" : raw.endsWith("/") ? raw : `${raw}/`;
      document.title = TITLE_TEXT[originalTitle] || TITLES[path] || originalTitle;
    } else {
      document.title = originalTitle;
    }
  };

  const updateToggle = (lang) => {
    const button = document.querySelector("[data-lang-toggle]");
    if (!button) return;
    const flag = button.querySelector("[data-lang-flag]");
    if (flag) {
      flag.src = lang === "en" ? "/images/flag-pl.svg" : "/images/flag-gb.svg";
    }
    button.setAttribute(
      "aria-label",
      lang === "en" ? "Switch the website to Polish" : "Switch the website to English",
    );
    button.setAttribute("title", lang === "en" ? "Polski" : "English");
  };

  const applyLang = (lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    try {
      applyText(lang);
      applyAttributes(lang);
      applyTitle(lang);
      updateToggle(lang);
    } finally {
      document.documentElement.classList.add("i18n-ready");
    }
    document.dispatchEvent(new CustomEvent("cns:langchange", { detail: { lang } }));
  };

  const bindToggle = () => {
    const button = document.querySelector("[data-lang-toggle]");
    if (!button || button.dataset.bound === "1") return;
    button.dataset.bound = "1";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = getLang() === "en" ? "pl" : "en";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      applyLang(next);
    });
  };

  window.CNS = window.CNS || {};
  window.CNS.getLang = getLang;
  window.CNS.translate = translate;
  window.CNS.applyLang = applyLang;

  const start = () => {
    bindToggle();
    applyLang(getLang());
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
