import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import bg from '../assets/glance/bg.webp'
import th from '../assets/glance/th.webp'
import r0 from '../assets/glance/r0.webp'
import r1 from '../assets/glance/r1.webp'
import r2 from '../assets/glance/r2.webp'
import r3 from '../assets/glance/r3.webp'
import r4 from '../assets/glance/r4.webp'
import r5 from '../assets/glance/r5.webp'
import r6 from '../assets/glance/r6.webp'
import core from '../assets/glance/core.webp'
import './glance/Glance.css'

const TOP = 57 // the mockup's own navbar strip (hidden under the real navbar)
const PX = 127 // left edge of the table / core panel in the mockup
const PW = 1332 // its width

// flame centres in the 1585 x 935 artwork: x, y, scale
const DIYAS = [
  [30, 771, 0.8],
  [95, 855, 1.05],
  [1556, 773, 0.8],
  [1486, 858, 1.05],
]

// label x / vertical centre and the row's image, measured on the mockup
const ROWS = [
  { img: r0, y0: 313, y1: 368, lx: 217, yc: 341.5, label: { bn: 'আঞ্চলিক অবস্থান', en: 'Regional standing' },
    detail: {
      bn: 'পূর্ব ও পশ্চিম মেদিনীপুরের সর্বাধিক দর্শনীয় দুর্গাপূজা; ইউটিউব ও মেটায় ‘লক্ষ্মণ শেঠের দুর্গাপূজা’ নামে পরিচিত',
      en: 'Most-visited Durga Pujo in Purba & Paschim Medinipur; known on YouTube & Meta as ‘Lakshman Seth’s Durga Pujo’',
    } },
  { img: r1, y0: 368, y1: 421, lx: 217, yc: 395, label: { bn: 'পূজার নাম', en: 'Puja name' },
    detail: { bn: 'সর্বজনীন শ্রী শ্রী দুর্গোৎসব ২০২৬ (হলদিয়া দুর্গোৎসব ২০২৬)', en: 'সর্বজনীন শ্রী শ্রী দুর্গোৎসব ২০২৬ (Haldia Durgotsav 2026)' } },
  { img: r2, y0: 421, y1: 474, lx: 218, yc: 447.5, label: { bn: 'আয়োজক কমিটি', en: 'Organising committee' },
    detail: { bn: 'হলদিয়া দুর্গোৎসব কমিটি', en: 'Haldia Durgotsav Committee' } },
  { img: r3, y0: 474, y1: 528, lx: 218, yc: 500, label: { bn: 'প্রধান পৃষ্ঠপোষক', en: 'Chief Patron' },
    detail: { bn: 'ডঃ লক্ষ্মণ চন্দ্র শেঠ (প্রধান পৃষ্ঠপোষক)', en: 'Dr. Lakshman Chandra Seth (প্রধান পৃষ্ঠপোষক)' } },
  { img: r4, y0: 528, y1: 581, lx: 219, yc: 553.5, label: { bn: 'স্থান', en: 'Venue' },
    detail: { bn: 'দুর্গোৎসব ময়দান, ক্ষুদিরাম নগর, হাতিবেড়িয়া, হলদিয়া', en: 'Durgotsav Maidan, Khudiram Nagar, Hatiberia, Haldia' } },
  { img: r5, y0: 581, y1: 636, lx: 220, yc: 608, label: { bn: 'কত বছর ধরে', en: 'Years of operation' },
    detail: { bn: '২০১৮ সালে শুরু — এটি হবে এর ৯ম বছর', en: 'Started 2018 – this will be its 9th year' } },
  { img: r6, y0: 636, y1: 701, lx: 220, yc: 662.5, label: { bn: 'প্রাপ্ত পুরস্কার', en: 'Prizes won' }, wrap: true,
    detail: {
      bn: 'এবিপি আনন্দ, নিউজ১৮ বাংলা ও টিভি৯ বাংলা-সহ একাধিক জেলা ও রাজ্যস্তরের শারদ সম্মান — পূর্ণ তালিকা শীঘ্রই',
      en: 'Multiple district & state-level Sarad Samman honours, including from ABP Ananda, News18 Bangla and TV9 Bangla – full list ahead',
    } },
]

// name x / name centre y / optional role centre y, measured on the mockup
const PILLS = [
  { x: 239, y: 793.5, ry: 813.5, name: { bn: 'ডঃ লক্ষ্মণ চন্দ্র শেঠ', en: 'Dr. Lakshman Chandra Seth' }, role: { bn: 'প্রধান পৃষ্ঠপোষক', en: 'Chief Patron' } },
  { x: 531, y: 793.5, ry: 813.5, name: { bn: 'সুদীপ্তন শেঠ', en: 'Sudipton Seth' }, role: { bn: 'সভাপতি', en: 'President' } },
  { x: 779, y: 793.5, ry: 813.5, name: { bn: 'প্রণব দাস', en: 'Pranab Das' }, role: { bn: 'সম্পাদক', en: 'Secretary' } },
  { x: 1005, y: 805, name: { bn: 'সায়ন্তন শেঠ', en: 'Sayantan Seth' } },
  { x: 1271, y: 803.5, name: { bn: 'অসীম লাহিড়ী', en: 'Asis Lahiri' } },
  { x: 423, y: 873.5, name: { bn: 'মানসী শেঠ', en: 'Manasi Seth' } },
  { x: 680, y: 873.5, name: { bn: 'সুস্মিতা সাহু শেঠ', en: 'Sushmita Sahoo Seth' } },
  { x: 1004, y: 875.5, name: { bn: 'স্পর্শিতা পান্ডা শেঠ', en: 'Sparshita Panda Seth' } },
]

// Pinned, scroll-scrubbed section: the table builds row by row, then the core committee panel.
export default function Glance() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1585, artH: 935, diyas: DIYAS, band: 0.12 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--enter', hold: true })

  const ph = (s, l) => ({ '--s': s, '--l': l })
  const ux = (v) => `calc(${v} * var(--ux))`
  const uy = (v) => `calc(${v} * var(--uy))`

  return (
    <section className="dp-gl" ref={trackRef}>
      {/* scroll target for the navbar's "Puja at a Glance" link: the point where everything has built */}
      <span id="glance" aria-hidden="true" style={{ position: 'absolute', left: 0, top: '220vh', width: 1, height: 1 }} />
      <div className="dp-gl__pin">
        <div className="dp-gl__frame" ref={frameRef}>
          <img className="dp-gl__bg" src={bg} alt="" draggable="false" />

          <h2 className="dp-gl__h1 dp-ph" style={ph(0.02, 0.12)}>
            {t({ bn: 'এক নজরে পূজা', en: 'Puja at a Glance' })}
          </h2>
          <p className="dp-gl__h2 dp-ph" style={ph(0.07, 0.1)}>
            {t({ bn: 'হলদিয়া দুর্গোৎসব ২০২৬-এর সংক্ষিপ্ত পরিচয়', en: 'A Quick Overview of Haldia Durgotsav 2026' })}
          </p>

          <div className="dp-gl__row is-head dp-ph" style={{ ...ph(0.12, 0.1), left: ux(PX), top: uy(263 - TOP), width: ux(PW), height: uy(50) }}>
            <img src={th} alt="" draggable="false" />
            <span className="dp-gl__tx is-th" style={{ left: ux(156 - PX), top: uy(288 - 263) }}>{t({ bn: 'বিষয়', en: 'Field' })}</span>
            <span className="dp-gl__tx is-th" style={{ left: ux(506 - PX), top: uy(288 - 263) }}>{t({ bn: 'বিবরণ', en: 'Detail' })}</span>
          </div>

          {ROWS.map((r, i) => (
            <div
              key={i}
              className="dp-gl__row dp-ph"
              style={{ ...ph(0.18 + i * 0.07, 0.12), left: ux(PX), top: uy(r.y0 - TOP), width: ux(PW), height: uy(r.y1 - r.y0) }}
            >
              <img src={r.img} alt="" draggable="false" />
              <span className="dp-gl__tx is-label" style={{ left: ux(r.lx - PX), top: uy(r.yc - r.y0) }}>{t(r.label)}</span>
              <span
                className={`dp-gl__tx is-detail ${r.wrap ? 'is-wrap' : ''}`}
                style={{ left: ux(505 - PX), top: uy((r.wrap ? 657 : r.yc) - r.y0), ...(r.wrap ? { width: ux(890) } : {}) }}
              >
                {t(r.detail)}
              </span>
            </div>
          ))}

          <div className="dp-gl__core dp-ph" style={{ ...ph(0.72, 0.16), left: ux(PX), top: uy(715 - TOP), width: ux(PW), height: uy(197) }}>
            <img src={core} alt="" draggable="false" />
            <span className="dp-gl__tx is-coretitle" style={{ left: ux(179 - PX), top: uy(743.5 - 715) }}>{t({ bn: 'মূল কমিটি', en: 'Core Committee' })}</span>
            {PILLS.map((p, i) => (
              <span key={i} className="dp-gl__pilltx dp-ph" style={ph(0.8 + i * 0.022, 0.08)}>
                <span className="dp-gl__tx is-name" style={{ left: ux(p.x - PX), top: uy(p.y - 715) }}>{t(p.name)}</span>
                {p.role && <span className="dp-gl__tx is-role" style={{ left: ux(p.x - PX), top: uy(p.ry - 715) }}>{t(p.role)}</span>}
              </span>
            ))}
          </div>

          {/* Three.js overlay: petals, dust, flickering diya flames */}
          <div className="dp-gl__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
