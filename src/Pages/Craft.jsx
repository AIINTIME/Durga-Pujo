import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import frame from '../assets/craft/frame.webp'
import bgBn from '../assets/craft/bg_bn.webp'
import art from '../assets/craft/art.webp'
import './craft/Craft.css'

// flame centres in the 1672 x 941 artwork: x, y, scale
const DIYAS = [
  [93, 752, 0.8],
  [206, 822, 0.95],
  [1513, 797, 0.95],
]

// The story keeps the artwork's line breaks on the pinned layout and wraps freely when stacked on phones.
const Lines = ({ lines }) => lines.map((l) => <span className="dp-cr__ln" key={l}>{l} </span>)

// Pinned, scroll-scrubbed section laid out on the 1672 x 941 artwork (the Bengali artwork keeps its own lettering on desktop; English sits on the same frame with the lettering taken out): the committee line,
// the title, the tagline and the story build in over the carved arch of terracotta horses and bamboo work.
export default function Craft() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { lang, t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1672, artH: 941, diyas: DIYAS, band: 0.1 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover10', hold: true, lead: true })

  const ph = (s, l) => ({ '--s': s, '--l': l })
  const ux = (v) => `calc(${v} * var(--ux))`
  const uy = (v) => `calc(${v} * var(--uy))`
  // centre of the element, in artwork pixels
  const at = (x, y, w, s, l) => ({ ...ph(s, l), left: ux(x), top: uy(y), ...(w ? { width: ux(w) } : {}) })

  return (
    <section className="dp-cr" ref={trackRef}>
      {/* scroll target for the navbar's "Theme Archive" link: the point where everything has built */}
      <span id="theme-archive" aria-hidden="true" style={{ position: 'absolute', left: 0, top: '220vh', width: 1, height: 1 }} />
      <div className="dp-cr__pin">
        <div className="dp-cr__frame" ref={frameRef}>
          <img loading="lazy" decoding="async" className={`dp-cr__bg${lang === 'en' ? '' : ' is-off'}`} src={frame} alt="" draggable="false" />
          <img loading="lazy" decoding="async" className={`dp-cr__bg${lang === 'bn' ? '' : ' is-off'}`} src={bgBn} alt="হলদিয়া দুর্গোৎসব কমিটি — ২০২৪ সালের আয়োজন — বাংলার হস্তশিল্প" draggable="false" />

          {lang === 'en' ? (
            <>
              <p className="dp-cr__org dp-ph" style={at(570, 160, 0, 0.02, 0.1)}>Haldia Durgotsav Committee</p>
              <p className="dp-cr__pres dp-ph" style={at(570, 192, 0, 0.06, 0.08)}>Presents</p>
              <p className="dp-cr__ann dp-ph" style={at(460, 222, 0, 0.09, 0.1)}>Annual Celebration</p>
              <p className="dp-cr__year dp-ph" style={at(612, 222, 0, 0.12, 0.1)}>2024</p>
              <h2 className="dp-cr__title">
                <span className="dp-cr__t1 dp-ph" style={at(552, 324, 0, 0.16, 0.14)}>Lakshman Seth’s</span>
                <span className="dp-cr__t2 dp-ph" style={at(545, 406, 0, 0.22, 0.14)}>Durga Puja</span>
              </h2>
              <p className="dp-cr__sub dp-ph" style={at(514, 521, 0, 0.32, 0.12)}>A Legacy of Craft, Culture and Community</p>
              <p className="dp-cr__body dp-ph" style={at(520, 676, 0, 0.42, 0.3)}>
                <Lines lines={[
                  'Rooted in rural craftsmanship and Bengal’s',
                  'rich heritage, our Durga Puja brings together',
                  'art, culture and community spirit. Inspired by',
                  'the timeless legacy of Dr. Lakshman Chandra Seth,',
                  'it celebrates the unity and creative spirit of the people',
                  'of Haldia and surrounding areas.',
                ]} />
              </p>
            </>
          ) : (
            <>
              <p className="dp-cr__org dp-ph" style={at(558, 160, 0, 0.02, 0.1)}>হলদিয়া দুর্গোৎসব কমিটি</p>
              <p className="dp-cr__ann dp-ph" style={at(499, 222, 0, 0.09, 0.1)}>২০২৪ সালের আয়োজন</p>
              <h2 className="dp-cr__title">
                <span className="dp-cr__t1 dp-ph" style={at(462, 298, 0, 0.16, 0.14)}>বাংলার</span>
                <span className="dp-cr__t2 dp-ph" style={at(533, 412, 0, 0.22, 0.14)}>হস্তশিল্প</span>
              </h2>
              <p className="dp-cr__sub dp-ph" style={at(514, 521, 0, 0.32, 0.12)}>মাটি ও বাঁশের শিল্পে বাংলার ঐতিহ্য</p>
              <p className="dp-cr__body dp-ph" style={at(520, 673, 0, 0.42, 0.3)}>
                <Lines lines={[
                  'বাঁকুড়া ও পুরুলিয়ার গ্রামীণ শিল্পের অনুপ্রেরণায়',
                  'তৈরাকাটা, মাটির পুতুল ও বাঁশের কারুকাজে',
                  'সুষ্ঠি উঠেছে মণ্ডপ। সারর্রি প্রতিমার সাঙ্গে',
                  'মিলেছিল লোকশিল্পের সৌন্দর্য।',
                ]} />
              </p>
            </>
          )}

          <img loading="lazy" decoding="async"
            className="dp-cr__pic"
            src={art}
            alt={t({ bn: 'মাটির ঘোড়া, বাঁশ ও বেতের হস্তশিল্প', en: 'Terracotta horses, bamboo and cane handicrafts' })}
            draggable="false"
          />

          {/* Three.js overlay: drifting petals, gold dust and flickering diya flames */}
          <div className="dp-cr__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
