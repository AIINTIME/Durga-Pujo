import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import frame from '../assets/theme/frame.webp'
import bgBn from '../assets/theme/bg_bn.webp'
import art from '../assets/theme/art.webp'
import './theme/Theme.css'

// flame centres in the 1670 x 941 artwork: x, y, scale
const DIYAS = [
  [20, 722, 0.9],
  [111, 808, 0.95],
  [1472, 836, 0.9],
]

// The story keeps the artwork's line breaks on the pinned layout and wraps freely when stacked on phones.
const Lines = ({ lines }) => lines.map((l) => <span className="dp-th__ln" key={l}>{l} </span>)

// Pinned, scroll-scrubbed section laid out on the 1670 x 941 artwork of the 2025 theme "Uttoron" (the Bengali artwork keeps its own
// lettering on desktop; English sits on the same frame with the lettering taken out): committee line, title, tagline, story and credit
// build in over the goddess tableau.
export default function Theme() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { lang, t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1670, artH: 941, diyas: DIYAS, band: 0.1 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover5', hold: true })

  const ph = (s, l) => ({ '--s': s, '--l': l })
  const ux = (v) => `calc(${v} * var(--ux))`
  const uy = (v) => `calc(${v} * var(--uy))`
  // centre of the element, in artwork pixels
  const at = (x, y, s, l) => ({ ...ph(s, l), left: ux(x), top: uy(y) })

  return (
    <section className="dp-th" ref={trackRef}>
      <div className="dp-th__pin">
        <div className="dp-th__frame" ref={frameRef}>
          <img loading="lazy" decoding="async" className={`dp-th__bg${lang === 'en' ? '' : ' is-off'}`} src={frame} alt="" draggable="false" />
          <img loading="lazy" decoding="async" className={`dp-th__bg${lang === 'bn' ? '' : ' is-off'}`} src={bgBn} alt="হলদিয়া দুর্গোৎসব কমিটি — ২০২৫ সালের থিম — উত্তরণ" draggable="false" />

          <p className="dp-th__org dp-ph" style={at(452, 158, 0.02, 0.1)}>
            {t({ bn: 'হলদিয়া দুর্গোৎসব কমিটি', en: 'Haldia Durgotsav Committee' })}
          </p>
          {lang === 'en' && <p className="dp-th__pres dp-ph" style={at(452, 197, 0.045, 0.1)}>Presents</p>}
          <p className="dp-th__ann dp-ph" style={at(417, 236, 0.07, 0.1)}>
            {t({ bn: '২০২৫ সালের থিম', en: 'Theme of 2025' })}
          </p>
          <h2 className="dp-th__title dp-ph" style={at(397, 352, 0.12, 0.2)}>
            {t({ bn: 'উত্তরণ', en: 'Uttaran' })}
          </h2>
          <p className="dp-th__sub dp-ph" style={at(422, lang === 'en' ? 497 : 498, 0.28, 0.12)}>
            {lang === 'en' ? (
              <Lines lines={['A Journey Forward,', 'Carrying the Legacy']} />
            ) : (
              'এগিয়ে চলার যাত্রা, শিকড়ে ফেরার টান'
            )}
          </p>
          <p className="dp-th__body dp-ph" style={at(428, lang === 'en' ? 633 : 629, 0.4, 0.3)}>
            {lang === 'en' ? (
              <Lines lines={[
                'From a humble village to a metropolitan city,',
                'across borders and oceans, this is the story',
                'of humanity’s journey forward. And at the heart',
                'of this journey lies the timeless heritage of',
                'Bengal’s clay art and Durga Puja.',
              ]} />
            ) : (
              <Lines lines={[
                'গ্রাম থেকে মহানগর, দেশের সীমানা পেরিয়ে',
                'বিদেশ—মানুয়ের এগিয়ে চলার গল্প। আর সেই',
                'যাত্রার অস্তরে বাংলার মাটি ও দুর্গাপুজোর-',
                'অমলিন টান।',
              ]} />
            )}
          </p>
          <p className="dp-th__credit dp-ph" style={at(428, 772, 0.7, 0.12)}>
            {t({ bn: 'ভাবনা ও রূপায়ণে: শিল্পী তপন সেন ও তাঁর দল', en: 'Concept & Execution: Shilpi Tapan Sen & His Team' })}
          </p>

          <img loading="lazy" decoding="async"
            className="dp-th__pic"
            src={art}
            alt={t({ bn: 'দেবী দুর্গার প্রতিমা', en: 'The Durga idol with her children' })}
            draggable="false"
          />

          {/* Three.js overlay: drifting petals, gold dust and flickering diya flames */}
          <div className="dp-th__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
