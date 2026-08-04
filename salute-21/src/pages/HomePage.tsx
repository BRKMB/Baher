import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { Highlights } from '../components/Highlights'
import { Testimonials } from '../components/Testimonials'
import { Gallery } from '../components/Gallery'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { Seo } from '../components/Seo'

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Seo
        page="home"
        breadcrumbs={[
          { name: 'Home', path: '/' },
        ]}
      />
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
