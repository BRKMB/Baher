import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { Highlights } from '../components/Highlights'
import { Testimonials } from '../components/Testimonials'
import { Gallery } from '../components/Gallery'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { Seo } from '../components/Seo'
import { HalloweenDecor } from '../components/HalloweenDecor'

export function HomePage() {
  return (
    <div className="salute-halloween relative min-h-screen">
      <Seo
        page="home"
        breadcrumbs={[
          { name: 'Home', path: '/' },
        ]}
      />
      <HalloweenDecor />
      <Header variant="landing" />
      <main>
        <Hero />
        <About />
        <Highlights />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
