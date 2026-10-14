import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useI18n } from '../i18n/LanguageContext'

const SHOW_AFTER_PX = 360

/** Landing-page FAB — smooth scroll back to the top of the page. */
export function BackToTop() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          key="back-to-top"
          className="back-to-top"
          onClick={scrollUp}
          aria-label={t('backToTop')}
          title={t('backToTop')}
          initial={{ opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ duration: 0.22 }}
          whileTap={{ scale: 0.92 }}
        >
          <ArrowUp className="back-to-top__icon" strokeWidth={2.25} aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
