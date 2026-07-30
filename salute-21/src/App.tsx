import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Highlights } from './components/Highlights'
import { MenuSection } from './components/MenuSection'
import { Reservation } from './components/Reservation'

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Highlights />
        <MenuSection />
        <Gallery />
        <Reservation />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
