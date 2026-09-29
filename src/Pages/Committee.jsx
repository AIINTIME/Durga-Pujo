import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import bg from '../assets/committee/bg.webp'
import patron from '../assets/committee/patron.webp'
import ss from '../assets/committee/ss.webp'
import pd from '../assets/committee/pd.webp'
import team from '../assets/committee/team.webp'
import p1 from '../assets/committee/p1.webp'
import p2 from '../assets/committee/p2.webp'
import p3 from '../assets/committee/p3.webp'
import p4 from '../assets/committee/p4.webp'
import p5 from '../assets/committee/p5.webp'
import './committee/Committee.css'

// flame centres in the 1683 x 935 artwork: x, y, scale
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

// the pill layers sit on the Core Team panel; `cx` is where the name is centred, relative to the pill
const CORE = [
  { img: p1, x: 214, w: 217, cx: 133, name: { bn: 'সায়ন্তন শেঠ', en: 'Sayantan Seth' } },
  { img: p2, x: 434, w: 198, cx: 125, name: { bn: 'অসীম লাহিড়ী', en: 'Asis Lahiri' } },
  { img: p3, x: 637, w: 213, cx: 132, name: { bn: 'মানসী শেঠ', en: 'Manasi Seth' } },
  { img: p4, x: 853, w: 301, cx: 176, name: { bn: 'সুস্মিতা সাহু শেঠ', en: 'Sushmita Sahoo Seth' } },
  { img: p5, x: 1157, w: 312, cx: 183, name: { bn: 'স্পর্শিতা পান্ডা শেঠ', en: 'Sparshita Panda Seth' } },
]

// Pinned, scroll-scrubbed section (same mechanics as Recognition): --p is the scroll progress and each
// .dp-ph element derives its own phase from it in CSS.
export default function Committee() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1683, artH: 935, diyas: DIYAS, band: 0.1 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover', hold: true })

  const ph = (s, l) => ({ '--s': s, '--l': l })

  return (
    <section className="dp-org" ref={trackRef}>
      {/* scroll target for the navbar's "Organization Committee" link: the point where everything has built */}
      <span id="committee" className="dp-org__anchor" aria-hidden="true" />
      <div className="dp-org__pin">
        <img className="dp-org__backdrop" src={bg} alt="" draggable="false" aria-hidden="true" />
        <div className="dp-org__frame" ref={frameRef}>
          <img className="dp-org__bg" src={bg} alt="" draggable="false" />

          <h2 className="dp-org__title dp-ph" style={ph(0.03, 0.2)}>
            {t({ bn: 'সংগঠন কমিটি', en: 'Organising Committee' })}
          </h2>
          <p className="dp-org__sub dp-ph" style={ph(0.14, 0.16)}>
            {t({ bn: 'হলদিয়া দুর্গোৎসব কমিটি', en: 'Haldia Durgotsav Committee' })}
          </p>

          <article className="dp-org__patron dp-ph" style={ph(0.2, 0.22)}>
            <img src={patron} alt="" draggable="false" />
            <h3>{t({ bn: 'ডঃ লক্ষ্মণ চন্দ্র শেঠ', en: 'Dr. Lakshman Chandra Seth' })}</h3>
            <p className="dp-org__role">{t({ bn: 'প্রধান পৃষ্ঠপোষক', en: 'Chief Patron' })}</p>
            <p className="dp-org__desc">
              {t({
                bn: 'হলদিয়া ইনস্টিটিউট অফ টেকনোলজির (এইচআইটি, প্রতিষ্ঠা ১৯৯৬) প্রতিষ্ঠাতা এবং তার বোর্ড অফ গভর্নরসের সদস্য — এইচআইটি ও আইকেয়ারের পেছনের একই প্রাতিষ্ঠানিক নেতৃত্ব।',
                en: 'Founding figure of Haldia Institute of Technology (HIT, est. 1996) and its Board of Governors — the same institutional leadership behind HIT and ICARE.',
              })}
            </p>
          </article>

          <article className="dp-org__person is-ss dp-ph" style={ph(0.34, 0.2)}>
            <img src={ss} alt="" draggable="false" />
            <span className="dp-org__badge" aria-hidden="true" style={{ '--i': 0 }} />
            <h3>{t({ bn: 'সুদীপ্তন শেঠ', en: 'Sudipton Seth' })}</h3>
            <p>{t({ bn: 'সভাপতি', en: 'President' })}</p>
          </article>
          <article className="dp-org__person is-pd dp-ph" style={ph(0.42, 0.2)}>
            <img src={pd} alt="" draggable="false" />
            <span className="dp-org__badge" aria-hidden="true" style={{ '--i': 1 }} />
            <h3>{t({ bn: 'প্রণব দাস', en: 'Pranab Das' })}</h3>
            <p>{t({ bn: 'সম্পাদক', en: 'Secretary' })}</p>
          </article>

          <div className="dp-org__team dp-ph is-wipe" style={ph(0.58, 0.18)}>
            <img src={team} alt="" draggable="false" />
            <h3 className="dp-ph" style={ph(0.68, 0.12)}>
              {t({ bn: 'মূল দল', en: 'Core Team' })}
            </h3>
          </div>
          {CORE.map((c, i) => (
            <div
              key={c.name.en}
              className="dp-org__pill dp-ph"
              style={{ ...ph(0.7 + i * 0.045, 0.12), left: `calc(${c.x} * var(--u))`, width: `calc(${c.w} * var(--u))` }}
            >
              <img src={c.img} alt="" draggable="false" />
              <span style={{ left: `calc(${c.cx} * var(--u))` }}>{t(c.name)}</span>
            </div>
          ))}

          {/* Three.js overlay: petals, dust, flickering diya flames */}
          <div className="dp-org__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
