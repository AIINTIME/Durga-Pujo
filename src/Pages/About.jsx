import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useLanguage } from '../i18n/context.js'
import Lotus from '../components/navbar/Lotus.jsx'
import './about/About.css'

const PATRON = {
  name: { bn: 'ডঃ লক্ষ্মণ চন্দ্র শেঠ', en: 'Dr. Lakshman Chandra Seth' },
  role: { bn: 'প্রধান পৃষ্ঠপোষক', en: 'Chief Patron' },
}

const SPIRIT = [
  {
    id: 'faith',
    title: { bn: 'বিশ্বাস ও ভক্তি', en: 'Faith & Devotion' },
    text: {
      bn: 'আমাদের গভীর বিশ্বাসের উদযাপন, যা মা দুর্গার প্রতি ভক্তিতে মানুষকে একত্র করে।',
      en: 'A celebration of our deep-rooted faith, bringing people together in the devotion of Maa Durga.',
    },
    icon: (
      <path d="M32 12c-3 7-4 13-4 20 0 6 2 10 4 14 2-4 4-8 4-14 0-7-1-13-4-20zM28 30c-5 3-9 8-11 15l7 3c3-5 6-9 8-12M36 30c5 3 9 8 11 15l-7 3c-3-5-6-9-8-12" />
    ),
  },
  {
    id: 'pandal',
    title: { bn: 'গুজরাট-অনুপ্রাণিত প্যান্ডেল', en: 'Gujarat-Inspired Pandal' },
    text: {
      bn: '২০২৬ সালে আমাদের প্যান্ডেল গুজরাটের সমৃদ্ধ শিল্প, স্থাপত্য ও কারুকৌশল থেকে অনুপ্রাণিত, যা মিশে গেছে বাংলার দুর্গাপূজার চিরন্তন সারমর্মের সঙ্গে।',
      en: 'For 2026, our pandal is inspired by the rich art, architecture and craftsmanship of Gujarat, blending it with the timeless essence of Bengal’s Durga Puja.',
    },
    icon: (
      <path d="M32 9v6M32 15c-8 0-12 6-12 12h24c0-6-4-12-12-12zM18 27h28M22 27v20M42 27v20M27 47V36c0-3 2-5 5-5s5 2 5 5v11M16 47h32M14 52h36" />
    ),
  },
  {
    id: 'community',
    title: { bn: 'সম্প্রদায় ও সংস্কৃতি', en: 'Community & Culture' },
    text: {
      bn: 'একটি উৎসব যা হলদিয়া ও পার্শ্ববর্তী অঞ্চলের মানুষকে একত্র করে, আমাদের সম্মিলিত ঐতিহ্য, সংস্কৃতি ও সম্প্রদায়ের চেতনা উদযাপন করে।',
      en: 'A festival that unites people from Haldia and nearby areas, celebrating our shared heritage, culture and community spirit.',
    },
    icon: (
      <path d="M32 11a5 5 0 1 0 0.01 0M17 21a4 4 0 1 0 0.01 0M47 21a4 4 0 1 0 0.01 0M22 44c0-8 4-13 10-13s10 5 10 13zM9 40c0-6 3-10 8-10M55 40c0-6-3-10-8-10" />
    ),
  },
]

// The full "About" page. Home renders it below the scroll video (embedded), and /about renders it alone.
export default function About({ embedded = false }) {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current)
    return () => scene.dispose()
  }, [])

  // fade/slide the content in the first time the section is on screen
  useEffect(() => {
    const el = rootRef.current
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const page = (
    <section id="about" className={`dp-about ${embedded ? 'is-embedded' : ''}`} ref={rootRef}>
      {/* the artwork (temple, pillars, portrait, diyas) is the background; all text below is live */}
      <div className="dp-about__frame">
        <p className="dp-about__kicker dp-at" data-r style={{ '--d': '0.2s' }}>
          {t({ bn: 'আমাদের গল্প', en: 'Our Story' })}
        </p>
        <h1 className="dp-about__title dp-at" data-r style={{ '--d': '0.3s' }}>
          {t({ bn: 'লক্ষ্মণ শেঠের', en: 'Lakshman Seth’s' })}
          <br />
          {t({ bn: 'দুর্গা পূজা', en: 'Durga Puja' })}
        </h1>
        <p className="dp-about__text dp-at" data-r style={{ '--d': '0.65s' }}>
          {t({ bn: 'খুদিরাম নগর, হলদিয়ার দুর্গোৎসব ময়দানে ', en: 'Organised by the ' })}
          <b>{t({ bn: 'হলদিয়া দুর্গোৎসব কমিটির', en: 'Haldia Durgotsav Committee' })}</b>
          {t({
            bn: ' উদ্যোগে আয়োজিত এই সর্বজনীন দুর্গাপূজা হলদিয়া ও পার্শ্ববর্তী অঞ্চলের মানুষকে বিশ্বাস, সংস্কৃতি ও সম্প্রদায়ের চেতনার উদযাপনে একত্র করে। লক্ষ্মণ শেঠের দুর্গাপূজা নামে পরিচিত এই উৎসবের নেতৃত্বে রয়েছেন প্রধান পৃষ্ঠপোষক ডঃ লক্ষ্মণ চন্দ্র শেঠ। ২০২৬ সালে প্যান্ডেল অনুপ্রেরণা নিয়েছে গুজরাটের সমৃদ্ধ শিল্প, স্থাপত্য ও কারুকৌশল থেকে, যা সযত্নে মিশেছে বাংলার দুর্গাপূজার চিরন্তন ঐতিহ্যের সঙ্গে।',
            en: ' at Durgotsav Maidan, Khudiram Nagar, Haldia, this community Durga Puja brings together people from Haldia and nearby areas in a celebration of faith, culture and community spirit. Known as Lakshman Seth’s Durga Puja, the celebration is led by its Chief Patron, Dr. Lakshman Chandra Seth. For 2026, the pandal draws inspiration from the rich art, architecture and craftsmanship of Gujarat, thoughtfully blended with the timeless traditions of Bengal’s Durga Puja.',
          })}
        </p>
        <p className="dp-about__place dp-at" data-r style={{ '--d': '0.8s' }}>
          {t({ bn: 'হলদিয়া, পশ্চিমবঙ্গ', en: 'Haldia, West Bengal' })}
        </p>

        <figure className="dp-about__patron dp-at" data-r style={{ '--d': '0.9s' }}>
          <figcaption>
            <strong>{t(PATRON.name)}</strong>
            <span>{t(PATRON.role)}</span>
          </figcaption>
        </figure>

        <div className="dp-about__spirit dp-at" data-r style={{ '--d': '1s' }}>
          <Lotus className="dp-about__spirit-lotus" />
          <h3 className="dp-about__heading">{t({ bn: 'পূজার প্রাণ', en: 'The Spirit of the Puja' })}</h3>
        </div>
        {SPIRIT.map((c, i) => (
          <article key={c.id} className={`dp-about__card is-${i} dp-at`} data-r style={{ '--d': `${1.1 + i * 0.12}s` }}>
            <span className="dp-about__icon">
              <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
                <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  {c.icon}
                </g>
              </svg>
            </span>
            <div>
              <h4>{t(c.title)}</h4>
              <p>{t(c.text)}</p>
            </div>
          </article>
        ))}
        {/* Three.js overlay: petals, bokeh, gold dust, flickering diya flames */}
        <div className="dp-about__stage" ref={stageRef} aria-hidden="true" />
      </div>
    </section>
  )

  return embedded ? page : <main className="dp-about-page">{page}</main>
}
