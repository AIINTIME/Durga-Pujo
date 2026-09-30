import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import bg from '../assets/recognition/bg.webp'
import banner from '../assets/recognition/banner.webp'
import c1 from '../assets/recognition/c1.webp'
import c2 from '../assets/recognition/c2.webp'
import c3 from '../assets/recognition/c3.webp'
import c4 from '../assets/recognition/c4.webp'
import c5 from '../assets/recognition/c5.webp'
import './recognition/Recognition.css'

// flame centres in the 1683 x 935 artwork: x, y, scale
const DIYAS = [
  [43, 606, 0.9],
  [52, 762, 1.25],
  [1640, 606, 0.9],
  [1624, 766, 1.25],
]

const AWARD = { bn: 'শারদ সম্মান', en: 'Sarad Samman' }
const CARDS = [
  { img: c1, x: 91, w: 297, title: { bn: 'জেলার সেরা পূজা', en: 'District’s Best Puja' }, sub: { bn: 'জেলার সেরা পূজা', en: 'District’s Best Puja' }, small: true },
  { img: c2, x: 394, w: 298, title: { bn: 'এবিপি আনন্দ', en: 'ABP Ananda' }, sub: AWARD },
  { img: c3, x: 698, w: 284, title: { bn: 'নিউজ১৮ বাংলা', en: 'News18 Bangla' }, sub: AWARD },
  { img: c4, x: 989, w: 299, title: { bn: 'টিভি৯ বাংলা', en: 'TV9 Bangla' }, sub: AWARD },
  { img: c5, x: 1291, w: 299, title: { bn: 'স্থানীয় চ্যানেল ও ক্লাব', en: 'Local Channels & Clubs' }, sub: AWARD },
]

// Pinned, scroll-driven section: --p (0 → 1) is the scroll progress through the track and every
// element derives its own 0 → 1 phase from it in CSS (see Recognition.css), so scrolling literally
// plays the reveal forwards and backwards.
export default function Recognition() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1683, artH: 935, diyas: DIYAS, band: 0.3 })
    return () => scene.dispose()
  }, [])

  useScrollPhase(trackRef, frameRef, { coverVar: '--cover4', hold: true })

  const ph = (s, l) => ({ '--s': s, '--l': l })

  return (
    <section id="recognition" className="dp-rec" ref={trackRef}>
      <div className="dp-rec__pin">
        <img className="dp-rec__backdrop" src={bg} alt="" draggable="false" aria-hidden="true" />
        <div className="dp-rec__frame" ref={frameRef}>
          <img className="dp-rec__bg" src={bg} alt="" draggable="false" />

          <h2 className="dp-rec__title dp-ph" style={ph(0.04, 0.2)}>
            <span className="dp-rec__t1">{t({ bn: 'স্বীকৃতি সেখানে', en: 'Recognised' })}</span>{' '}
            <span className="dp-rec__t2">{t({ bn: 'যেখানে গুরুত্ব পায়', en: 'Where It Counts' })}</span>
          </h2>
          <p className="dp-rec__lead dp-ph" style={ph(0.16, 0.16)}>
            {t({
              bn: 'প্রতিটি জেলাতেই একটি পুজো থাকে যা ভিড়ের প্রিয়। কিন্তু প্রতি বছর বাংলার শারদ উৎসবের বিচার করা সংবাদমাধ্যম ও প্রতিষ্ঠানগুলি খুব কম পুজোকেই নাম ধরে ডেকে নেয় — আর এই পুজো বারবার সেই স্বীকৃতি পেয়েছে।',
              en: 'Every district has a pujo the crowd loves. Far fewer get called out by name by the outlets and institutions that judge Bengal’s Sarad Utsav every year — and this one has, again and again.',
            })}
          </p>

          {CARDS.map((c, i) => (
            <div
              key={c.title.en}
              className="dp-rec__card dp-ph is-card"
              style={{ ...ph(0.26 + i * 0.075, 0.2), left: `calc(${c.x} * var(--u))`, width: `calc(${c.w} * var(--u))` }}
            >
              <img src={c.img} alt="" draggable="false" />
              <span className="dp-rec__medal" aria-hidden="true" style={{ '--i': i }} />
              <h3>{t(c.title)}</h3>
              <p className={c.small ? 'is-small' : ''}>{t(c.sub)}</p>
            </div>
          ))}

          <div className="dp-rec__banner dp-ph is-banner" style={ph(0.66, 0.2)}>
            <img src={banner} alt="" draggable="false" />
            <p className="dp-ph" style={ph(0.8, 0.12)}>
              {t({
                bn: 'এই সেই তাক, যার পাশে দাঁড়ানোর সুযোগ পান একজন স্পনসর — নজরে পড়ার আশায় থাকা কোনো প্যান্ডেল নয়, বরং রাজ্যের সবচেয়ে বড় বাংলা সংবাদ ব্র্যান্ডগুলি যাকে একাধিকবার নাম ধরে স্বীকৃতি দিয়েছে।',
                en: 'This is the shelf a sponsor gets to stand next to — not a pandal hoping to be noticed this year, but one the state’s biggest Bengali news brands have already put a name to, more than once.',
              })}
            </p>
          </div>

          {/* Three.js overlay: petals, bokeh, dust, flickering diya flames */}
          <div className="dp-rec__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
