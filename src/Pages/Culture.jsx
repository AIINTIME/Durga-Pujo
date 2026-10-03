import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import bg from '../assets/gallery/bg.webp'
import dhunuchi from '../assets/culture/dhunuchi.webp'
import dhaki from '../assets/culture/dhaki.webp'
import mela from '../assets/culture/mela.webp'
import music from '../assets/culture/music.webp'
import shankha from '../assets/culture/shankha.webp'
import './culture/Culture.css'

// flame centres in the 1585 x 935 artwork (same artwork as the Gallery): x, y, scale
const DIYAS = [
  [30, 700, 0.8],
  [84, 743, 1.0],
  [197, 825, 1.05],
  [1562, 718, 0.85],
  [1420, 823, 1.05],
]

// 24 x 24 stroke icons
const ICONS = {
  flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
  drum: (
    <>
      <path d="m2 2 8 8" /><path d="m22 2-8 8" /><ellipse cx="12" cy="9" rx="10" ry="5" />
      <path d="M7 13.4v7.9" /><path d="M12 14v8" /><path d="M17 13.4v7.9" /><path d="M2 9v8a10 5 0 0 0 20 0V9" />
    </>
  ),
  food: (
    <>
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
      <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
      <path d="m2.1 21.8 6.4-6.3" /><path d="m19 5-7 7" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </>
  ),
  sparkles: (
    <>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" />
    </>
  ),
  calendar: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </>
  ),
  trophy: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </>
  ),
}

const Icon = ({ name, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
)

const EVENTS = [
  {
    img: dhunuchi, icon: 'flame',
    when: { bn: 'মহাষ্টমী · সন্ধ্যা ৭:৩০', en: 'Maha Ashtami · 7:30 PM' },
    title: { bn: 'মহা ধুনুচি নাচ প্রতিযোগিতা', en: 'Grand Dhunuchi Naach Championship' },
    text: {
      bn: 'ঢাকের তালে তালে ধোঁয়া-ওঠা নারকেলের ছোবড়ার মাটির ধুনুচি সামলে মোহময় নৃত্য পরিবেশনা।',
      en: 'Hypnotic dance performances balancing smoking coconut-husk earthen pots amid rolling drum rhythms.',
    },
  },
  {
    img: dhaki, icon: 'drum',
    when: { bn: 'মহানবমী · বিকেল ৫:০০', en: 'Maha Navami · 5:00 PM' },
    title: { bn: 'ওস্তাদ ঢাকি তালের লড়াই', en: 'Master Dhaki Rhythm Duel' },
    text: {
      bn: 'বাংলার নানা প্রান্তের কিংবদন্তি ঢাকিরা মুখোমুখি হবেন শিহরন-জাগানো বহুছন্দের বাজনার লড়াইয়ে।',
      en: 'Legendary drum virtuosos from across Bengal face off in exhilarating polyrhythmic percussion duels.',
    },
  },
  {
    img: mela, icon: 'food',
    when: { bn: 'মহাষষ্ঠী · সন্ধ্যা ৬:০০', en: 'Maha Sasthi · 6:00 PM' },
    title: { bn: 'আনন্দমেলা ও ঐতিহ্যবাহী খাদ্যমেলা', en: 'Ananda Mela & Traditional Culinary Fair' },
    text: {
      bn: 'খাঁটি ঘরোয়া বাঙালি মিষ্টি, পাটিসাপটা, নারকেল নাড়ু ও উপকূলীয় অঞ্চলের নানা সুস্বাদু পদ।',
      en: 'Authentic homemade Bengali sweet delicacies, patishapta, narkel naru, and coastal culinary specialties.',
    },
  },
  {
    img: music, icon: 'music',
    when: { bn: 'মহাসপ্তমী · রাত ৮:০০', en: 'Maha Saptami · 8:00 PM' },
    title: { bn: 'রবীন্দ্র-নজরুল সংগীত সন্ধ্যা', en: 'Rabindra-Nazrul Musical Soiree' },
    text: {
      bn: 'শরতের সৌন্দর্য উদ্যাপনে খ্যাতনামা কণ্ঠশিল্পীদের মনছোঁয়া শাস্ত্রীয় ও লোকসংগীত পরিবেশনা।',
      en: 'Soul-stirring classical and folk performances by renowned vocalists celebrating autumnal beauty.',
    },
  },
  {
    img: shankha, icon: 'sparkles',
    when: { bn: 'বিজয়া দশমী · দুপুর ২:৩০', en: 'Bijoya Dashami · 2:30 PM' },
    title: { bn: 'ঐতিহ্যবাহী শঙ্খ ও উলুধ্বনি প্রতিযোগিতা', en: 'Traditional Shankha & Uludhwani Contest' },
    text: {
      bn: 'শুভ শঙ্খবাদন ও পবিত্র উলুধ্বনির প্রতিযোগিতা — বিজয়ার মঙ্গলময় আবাহনে।',
      en: 'Auspicious conch-blowing and sacred ululation competition welcoming the spirit of Bijoya.',
    },
  },
]

// Pinned, scroll-scrubbed section (same mechanics as Glance / Recognition): the heading builds in, then the five event cards rise one by one.
export default function Culture() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1585, artH: 935, diyas: DIYAS, band: 0.12 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover1', hold: true, lead: true })

  const ph = (s, l) => ({ '--s': s, '--l': l })

  return (
    <section className="dp-cu" ref={trackRef}>
      {/* scroll target for the navbar's "Cultural Events" link: the point where everything has built */}
      <span id="culture" className="dp-cu__anchor" aria-hidden="true" />
      <div className="dp-cu__pin">
        <div className="dp-cu__frame" ref={frameRef}>
          <img loading="lazy" decoding="async" className="dp-cu__bg" src={bg} alt="" draggable="false" />

          <span className="dp-cu__badge dp-ph" style={ph(0.02, 0.1)}>
            <Icon name="trophy" />
            {t({ bn: 'উৎসবের আনন্দ', en: 'Festive Joy' })}
          </span>
          <h2 className="dp-cu__title dp-ph" style={ph(0.06, 0.14)}>
            {t({ bn: 'সাংস্কৃতিক অনুষ্ঠান ও প্রতিযোগিতা', en: 'Cultural Extravaganza & Contests' })}
          </h2>
          <p className="dp-cu__sub dp-ph" style={ph(0.14, 0.12)}>
            {t({
              bn: 'ঢাকের হৃদস্পন্দন-জাগানো তাল, ধুনুচি নাচ আর সুরেলা গানে মুখর প্রাণবন্ত সন্ধ্যা।',
              en: 'Vibrant evenings alive with heart-thumping Dhak rhythms, Dhunuchi Naach, and soulful melodies.',
            })}
          </p>

          <ul className="dp-cu__cards">
            {EVENTS.map((e, i) => (
              <li key={e.title.en} className="dp-cu__card dp-ph" style={ph(0.24 + i * 0.1, 0.22)}>
                <span className="dp-cu__medal"><Icon name={e.icon} /></span>
                <div className="dp-cu__photo">
                  <img src={e.img} alt="" draggable="false" loading="lazy" decoding="async" />
                </div>
                <p className="dp-cu__when">
                  <Icon name="calendar" />
                  {t(e.when)}
                </p>
                <h3 className="dp-cu__name"><span>{t(e.title)}</span></h3>
                <p className="dp-cu__text">{t(e.text)}</p>
                <div className="dp-cu__foot">
                  <span className="dp-cu__where">
                    <Icon name="pin" />
                    {t({ bn: 'অ্যাম্ফিথিয়েটার', en: 'Amphitheatre' })}
                  </span>
                  <span className="dp-cu__free">{t({ bn: 'প্রবেশ বিনামূল্যে', en: 'Free Entry' })}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Three.js overlay: petals, dust, flickering diya flames */}
          <div className="dp-cu__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
