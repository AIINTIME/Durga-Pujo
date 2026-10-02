import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import bg from '../assets/committee/bg.webp'
import torans from '../assets/concept/torans.webp'
import lippan from '../assets/concept/lippan.webp'
import patola from '../assets/concept/patola.webp'
import p1 from '../assets/concept/p1.webp'
import p2 from '../assets/concept/p2.webp'
import p3 from '../assets/concept/p3.webp'
import p4 from '../assets/concept/p4.webp'
import './concept/Concept.css'

// flame centres in the 1683 x 935 artwork (same artwork as Committee): x, y, scale
const DIYAS = [
  [68, 768, 1.0],
  [157, 850, 1.15],
  [1609, 770, 1.0],
  [1519, 852, 1.15],
  [170, 62, 0.55],
  [113, 152, 0.5],
  [1511, 66, 0.55],
  [1568, 152, 0.5],
]

// 24 x 24 stroke icons
const ICONS = {
  sparkles: (
    <>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" />
    </>
  ),
  hammer: (
    <>
      <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0a2.12 2.12 0 0 1 0-3L12 9" /><path d="M17.64 15 22 10.64" />
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  pot: (
    <>
      <path d="M9 3h6" /><path d="M10 3v2.5C6.5 7 5 9.5 5 13c0 4 2.7 7 7 7s7-3 7-7c0-3.5-1.5-6-5-7.5V3" /><path d="M6 12h12" />
    </>
  ),
  landmark: (
    <>
      <path d="M3 22h18" /><path d="M6 18v-7" /><path d="M10 18v-7" /><path d="M14 18v-7" /><path d="M18 18v-7" /><path d="M12 2 20 7H4z" />
    </>
  ),
  lotus: (
    <>
      <path d="M12 21c-3-2-5-5-5-9 2 0 4 1 5 3 1-2 3-3 5-3 0 4-2 7-5 9z" /><path d="M12 15c-1.5-2-1.5-5 0-9 1.5 4 1.5 7 0 9z" />
    </>
  ),
}

const Icon = ({ name, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
)

const CARDS = [
  {
    img: torans,
    title: { bn: 'ঐতিহ্যবাহী স্থাপত্য ও বিশাল তোরণ', en: 'Heritage Architecture & Grand Torans' },
    text: {
      bn: 'মোধেরা ও দ্বারকার মহিমান্বিত পাথরের স্থাপত্য থেকে অনুপ্রাণিত খোদাই-করা স্তম্ভ, বিশাল অলংকৃত তোরণ ও রাজকীয় ঝরোখা মণ্ডপ।',
      en: 'Carved pillars, grand decorative torans, and royal jharokha pavilions inspired by the majestic stone architecture of Modhera and Dwarka.',
    },
  },
  {
    img: lippan,
    title: { bn: 'কচ্ছের লিপ্পন মাটি ও আয়নার কারুকাজ', en: 'Kutch Lippan Mud & Mirror Craftsmanship' },
    text: {
      bn: 'কচ্ছের খাঁটি মাটি ও উত্তল আয়নার শিল্পকর্ম, যা মন্দিরের গর্ভগৃহ জুড়ে পবিত্র দীপ্তি ও শুভ প্রতিফলন ছড়ায়।',
      en: 'Authentic clay and convex mirror artistry from Kutch, radiating sacred glow and auspicious reflections across the temple sanctum.',
    },
  },
  {
    img: patola,
    title: { bn: 'পাটোলা ও বান্ধনি লোকবয়ন', en: 'Patola & Bandhani Folk Tapestries' },
    text: {
      bn: 'সমৃদ্ধ জ্যামিতিক নকশার বয়নশিল্প ও উজ্জ্বল বান্ধনি বস্ত্র, যা প্যান্ডেলের অন্দরসজ্জায় রাজকীয় ও প্রাণবন্ত রঙের ছোঁয়া আনে।',
      en: 'Rich geometric tapestries and vivid Bandhani textiles lending a regal and vibrant palette to the pandal interior.',
    },
  },
]

const SHOTS = [p1, p2, p3, p4]

const STATS = [
  { icon: 'users', big: '100+', label: { bn: 'দক্ষ কারিগর ও ভাস্কর', en: 'Master Artisans & Sculptors' } },
  { icon: 'pot', big: '500+', label: { bn: 'জটিল কাচের কাজ ও ঐতিহ্যবাহী মাটির শিল্প', en: 'Intricate Glasswork & Traditional Clay Art' } },
  { icon: 'landmark', big: { bn: '৮ম বর্ষ', en: '8th Year' }, label: { bn: 'সাংস্কৃতিক ঐতিহ্যের মাইলফলক', en: 'Cultural Heritage Milestone' } },
]

// Pinned, scroll-scrubbed section with two scenes on the same artwork (same mechanics as Committee / Glance):
// first the 2026 concept (heading, intro, three craft cards), then the live preparation glimpses and numbers.
export default function Concept() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1683, artH: 935, diyas: DIYAS, band: 0.1 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover6', hold: true })

  const ph = (s, l) => ({ '--s': s, '--l': l })

  return (
    <section className="dp-cc" ref={trackRef}>
      <div className="dp-cc__pin">
        <img loading="lazy" decoding="async" className="dp-cc__backdrop" src={bg} alt="" draggable="false" aria-hidden="true" />
        <div className="dp-cc__frame" ref={frameRef}>
          <img loading="lazy" decoding="async" className="dp-cc__bg" src={bg} alt="" draggable="false" />

          {/* scene 1: the 2026 concept */}
          <div className="dp-cc__scene is-a">
            <span className="dp-cc__badge dp-ph" style={ph(0.02, 0.08)}>
              <Icon name="sparkles" />
              {t({ bn: '২০২৬-এর বিশেষ থিম ভাবনা', en: '2026 Special Theme Concept' })}
            </span>
            <h2 className="dp-cc__title dp-ph" style={ph(0.05, 0.12)}>
              {t({ bn: 'গুজরাট-অনুপ্রাণিত প্যান্ডেল স্থাপত্য', en: 'Gujarat-Inspired Pandal Architecture' })}
            </h2>
            <p className="dp-cc__intro dp-ph" style={ph(0.1, 0.1)}>
              {t({
                bn: '২০২৬ সালে আমাদের প্যান্ডেল অনুপ্রাণিত হয়েছে গুজরাটের সমৃদ্ধ শিল্প, স্থাপত্য ও কারুশিল্প থেকে — যার সঙ্গে মিশেছে বাংলার দুর্গাপূজার চিরন্তন সুর।',
                en: 'For 2026, our pandal is inspired by the rich art, architecture and craftsmanship of Gujarat, blending it with the timeless essence of Bengal’s Durga Puja.',
              })}
            </p>
            <ul className="dp-cc__cards">
              {CARDS.map((c, i) => (
                <li key={c.title.en} className="dp-cc__card dp-ph" style={ph(0.16 + i * 0.08, 0.14)}>
                  <div className="dp-cc__arch"><img src={c.img} alt="" draggable="false" loading="lazy" decoding="async" /></div>
                  <h3>{t(c.title)}</h3>
                  <p>{t(c.text)}</p>
                  <Icon name="lotus" className="dp-cc__lotus" />
                </li>
              ))}
            </ul>
          </div>

          {/* scene 2: live preparation */}
          <div className="dp-cc__scene is-b">
            <span className="dp-cc__badge dp-ph" style={ph(0.62, 0.06)}>
              <Icon name="hammer" />
              {t({ bn: '২০২৬-এর প্রস্তুতি চলছে', en: '2026 Preparation in Progress' })}
            </span>
            <h2 className="dp-cc__title is-b dp-ph" style={ph(0.64, 0.1)}>
              {t({ bn: 'প্যান্ডেল ও কারুকাজের সরাসরি ঝলক', en: 'Live Glimpses of Pandal & Crafting in Progress' })}
            </h2>
            <p className="dp-cc__intro is-b dp-ph" style={ph(0.7, 0.08)}>
              {t({
                bn: 'হলদিয়ায় গুজরাটি শিল্পকলা ও বাংলার ঐতিহ্যের মহামিলন গড়ে তুলছেন কারিগররা।',
                en: 'Artisans actively shaping the grand confluence of Gujarat artistry and Bengal heritage in Haldia.',
              })}
            </p>
            <ul className="dp-cc__shots">
              {SHOTS.map((s, i) => (
                <li key={i} className="dp-ph" style={ph(0.74 + i * 0.04, 0.1)}><img src={s} alt="" draggable="false" loading="lazy" decoding="async" /></li>
              ))}
            </ul>
            <ul className="dp-cc__stats">
              {STATS.map((s, i) => (
                <li key={s.icon} className="dp-ph" style={ph(0.84 + i * 0.04, 0.1)}>
                  <Icon name={s.icon} />
                  <strong>{typeof s.big === 'string' ? s.big : t(s.big)}</strong>
                  <span>{t(s.label)}</span>
                </li>
              ))}
            </ul>
            <p className="dp-cc__foot dp-ph" style={ph(0.9, 0.1)}>
              {t({
                bn: 'শিল্প, স্থাপত্য ও ভক্তির এক নিরবচ্ছিন্ন মিলন — কচ্ছ থেকে হলদি নদীর পবিত্র তীর পর্যন্ত।',
                en: 'A seamless confluence of art, architecture, and devotion — from Kutch to the sacred banks of the Haldia River.',
              })}
            </p>
          </div>

          {/* Three.js overlay: petals, dust, flickering diya flames */}
          <div className="dp-cc__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
