import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useLanguage } from '../i18n/context.js'
import Lotus from '../components/navbar/Lotus.jsx'
import portrait from '../assets/about/portrait.webp'
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
      <>
        <path d="M32 7c6 7 9 12 9 17a9 9 0 0 1-18 0c0-5 3-10 9-17z" />
        <path d="M32 24c2.5 3 3.5 5 3.5 7a3.5 3.5 0 0 1-7 0c0-2 1-4 3.5-7z" />
        <path d="M8 40h48c0 10-9 17-24 17S8 50 8 40z" />
        <path d="M22 60h20" />
      </>
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
      <>
        <path d="M32 5v6M29 8h6" />
        <path d="M17 28c0-10 6-17 15-17s15 7 15 17z" />
        <path d="M12 28h40" />
        <path d="M19 28v24M45 28v24" />
        <path d="M26 52V41c0-4 2.5-7 6-7s6 3 6 7v11" />
        <path d="M10 52h44M7 58h50" />
      </>
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
      <>
        <path d="M26 19a6 6 0 1 0 12 0a6 6 0 1 0-12 0" />
        <path d="M19 52c0-10 5-17 13-17s13 7 13 17z" />
        <path d="M10 28a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0-9 0" />
        <path d="M45 28a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0-9 0" />
        <path d="M6 50c0-8 3-13 9-14M58 50c0-8-3-13-9-14" />
      </>
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
    if (embedded) return // on Home the page itself decides when About fades in
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
  }, [embedded])

  const page = (
    <section id={embedded ? undefined : 'about'} className={`dp-about ${embedded ? 'is-embedded' : ''}`} ref={rootRef}>
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
        {/* phones only: the portrait from the artwork, shown between the heading and the story */}
        <img className="dp-about__portrait" src={portrait} alt={t(PATRON.name)} draggable="false" />
        <figure className="dp-about__patron dp-at" data-r style={{ '--d': '0.9s' }}>
          <figcaption>
            <strong>{t(PATRON.name)}</strong>
            <span>{t(PATRON.role)}</span>
          </figcaption>
        </figure>

        <p className="dp-about__text dp-at" data-r style={{ '--d': '0.65s' }}>
          {t({
            bn: 'প্রতি শরতে যখন আকাশে সাদা মেঘ ভাসে, বাতাসে উৎসবের গন্ধ আসে, তখনই যেন নতুন করে জেগে ওঠে লক্ষ্মণ শেঠের দুর্গাপূজা। প্রধান পৃষ্ঠপোষক ডঃ লক্ষ্মণ চন্দ্র শেঠের নেতৃত্বে এই পূজা আজ শুধু একটি আয়োজন নয়, হলদিয়ার মানুষের আবেগ, বিশ্বাস ও মিলনের এক আপন ঠিকানা। প্রতি বছর মায়ের আগমনের সঙ্গে বদলে যায় উৎসবের রূপ, কিন্তু থেকে যায় মানুষের ভালোবাসা আর একসঙ্গে আনন্দ করার সেই চিরচেনা অনুভূতি। ২০২৬ সালে, সেই গল্পে যুক্ত হয়েছে গুজরাটের শিল্প, স্থাপত্য ও কারুকার্যের অনুপ্রেরণা—যা বাংলার দুর্গাপূজার ঐতিহ্য ও আবেগের সঙ্গে মিশে তৈরি করেছে এক অনন্য শিল্পভুবন। যেন গুজরাটের রঙে বাংলার মাটির স্পর্শ, আর তার মাঝখানে বিরাজ করছেন মা দুর্গা। এই উৎসব তাই শুধু প্যান্ডেল বা প্রতিমা দেখার নয়; এটি ফিরে আসার, একসঙ্গে দাঁড়ানোর, পরিচিত মুখে আনন্দ খুঁজে পাওয়ার এবং মায়ের আশীর্বাদে নতুন করে হৃদয় ভরে নেওয়ার গল্প। সেই গল্পের ঠিকানা ক্ষুদিরাম নগর, হলদিয়ার দুর্গোৎসব ময়দান—',
            en: 'Organised by the ',
          })}
          <b>{t({ bn: 'হলদিয়া দুর্গোৎসব কমিটির', en: 'Haldia Durgotsav Committee' })}</b>
          {t({
            bn: ' আয়োজনে।',
            en: ' at Durgotsav Maidan, Khudiram Nagar, Haldia, this community Durga Puja brings together people from Haldia and nearby areas in a celebration of faith, culture and community spirit. Known as Lakshman Seth’s Durga Puja, the celebration is led by its Chief Patron, Dr. Lakshman Chandra Seth. For 2026, the pandal draws inspiration from the rich art, architecture and craftsmanship of Gujarat, thoughtfully blended with the timeless traditions of Bengal’s Durga Puja.',
          })}
        </p>
        <p className="dp-about__place dp-at" data-r style={{ '--d': '0.8s' }}>
          {t({ bn: 'হলদিয়া, পশ্চিমবঙ্গ', en: 'Haldia, West Bengal' })}
        </p>

        <div className="dp-about__spirit dp-at" data-r style={{ '--d': '1s' }}>
          <Lotus className="dp-about__spirit-lotus" />
          <h3 className="dp-about__heading">{t({ bn: 'পূজার প্রাণ', en: 'The Spirit of the Puja' })}</h3>
        </div>
        {SPIRIT.map((c, i) => (
          <article key={c.id} className={`dp-about__card is-${i} dp-at`} data-r style={{ '--d': `${1.1 + i * 0.12}s` }}>
            <span className="dp-about__icon">
              <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
                <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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
