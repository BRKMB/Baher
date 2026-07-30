import { motion } from 'framer-motion'
import { Leaf, Sparkles, Users } from 'lucide-react'
import { values } from '../data/content'

const icons = [Sparkles, Leaf, Users]

export function About() {
  return (
    <section id="o-nas" className="relative px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-amber uppercase">
            O Salute 21
          </p>
          <h2 className="font-display text-4xl leading-tight tracking-[-0.02em] text-ink md:text-5xl text-balance">
            Słowo na dziś: BAR
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted md:text-lg">
            <p>
              Chcemy odczarować słowo bar i nadać mu na nowo znaczenie miejsca, w którym picie
              nierozerwalnie łączy się z jedzeniem.
            </p>
            <p>
              Mamy słabość do dobrego jedzenia, włoskich koktajli i wina. Codziennie. To ucieczka,
              drugi dom i klub dla sąsiedzkiej integracji — przestrzeń wspólnoty i ciekawych
              spotkań.
            </p>
            <p className="font-medium text-ink">
              Salute! Na zdrowie. Szczypta Italii, ślad Hiszpanii i południowy styl bycia.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[1.5rem]">
            <img
              src="/images/interior.jpg"
              alt="Wnętrze Salute 21"
              className="aspect-[4/5] w-full object-cover md:aspect-[5/6]"
            />
          </div>
          <div className="absolute -bottom-5 -left-3 max-w-[240px] rounded-2xl bg-ink px-5 py-4 text-paper shadow-xl md:-left-6">
            <p className="font-display text-2xl leading-none">Salute!</p>
            <p className="mt-2 text-sm text-paper/75">Na zdrowie — codziennie na Woli.</p>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-20 grid max-w-7xl gap-6 md:grid-cols-3">
        {values.map((item, index) => {
          const Icon = icons[index]
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="border-t border-line pt-6"
            >
              <Icon className="mb-4 size-5 text-amber" strokeWidth={1.75} />
              <h3 className="font-display text-2xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{item.text}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
