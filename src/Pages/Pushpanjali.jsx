import { useCallback, useEffect, useRef, useState } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import { playOffering } from './pushpanjali/sounds.js'
import bg from '../assets/pushpanjali/bg.webp'
import lotus from '../assets/pushpanjali/lotus.webp'
import bell from '../assets/pushpanjali/bell.webp'
import conch from '../assets/pushpanjali/conch.webp'
import aarti from '../assets/pushpanjali/aarti.webp'
import './pushpanjali/Pushpanjali.css'

const STORE_KEY = 'dp-offerings'
const START_COUNT = 0 // the counter lives on this device only; set a starting number here if one is wanted

// 24 x 24 stroke icons
const ICONS = {
  lotus: (
    <>
      <path d="M12 3.5c-2.6 3-2.6 8 0 12 2.6-4 2.6-9 0-12z" /><path d="M10.4 14.6C6.8 14 4.5 11.4 4.2 7.8c3.4.4 5.6 2.4 6.4 5.4" /><path d="M13.6 14.6c3.6-.6 5.9-3.2 6.2-6.8-3.4.4-5.6 2.4-6.4 5.4" />
      <path d="M9 17.2C5.8 17.6 3.2 16 2 13c2.6-.2 4.6.8 5.8 2.6" /><path d="M15 17.2c3.2.4 5.8-1.2 7-4.2-2.6-.2-4.6.8-5.8 2.6" /><path d="M8.6 19.4c2 1.4 4.8 1.4 6.8 0" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  conch: (
    <>
      <path d="M3.5 3.2c2.6 1.9 5.4 2.3 8 2.4 5 .2 9 3.4 9 7.7 0 4-3.3 7-7.3 6.6-4-.4-6.2-3.2-6.2-6.2 0-1.9.4-3.6-.6-5.2-1-1.5-2.2-3.3-2.9-5.3z" />
      <path d="M8.4 5.8c.5 2.4.2 4.8-1 7M12 5.8c.6 2.8-.1 5.8-1.7 8.2" /><path d="M20.5 13.3c-3.4-.5-6.2.8-7.2 3.4-.5 1.3-.4 2.3.1 3.1" /><path d="M15.8 6.6c1 1.6 1.4 3.4 1.2 5.2" />
    </>
  ),
  lamp: (
    <>
      <path d="M12 2c1.5 2.5 2.5 4 2.5 6a2.5 2.5 0 0 1-5 0C9.5 6 10.5 4.5 12 2z" /><path d="M3 12h18c0 4-3 7-9 7s-9-3-9-7z" /><path d="M9 21h6" />
    </>
  ),
  heart: <path d="M19 14c1.490-1.460 3-3.210 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.760 0-3 .5-4.5 2-1.5-1.5-2.740-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.050 3 5.5l7 7Z" />,
  star: <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />,
  immersion: (
    <>
      <path d="M12 3c2 3 5 4 5 8a5 5 0 0 1-10 0c0-4 3-5 5-8z" /><path d="M5 20c3-1.5 5.5-1.5 7 0 1.5-1.5 4-1.5 7 0" />
    </>
  ),
}

const Icon = ({ name, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
)

const OFFERINGS = [
  { kind: 'lotus', icon: 'lotus', img: lotus, title: { bn: 'পদ্ম নিবেদন', en: 'Offer Lotus' }, sub: { bn: 'পবিত্র নিবেদন', en: 'Sacred Offering' }, thanks: { bn: 'পদ্ম নিবেদিত হল', en: 'Lotus offered' } },
  { kind: 'bell', icon: 'bell', img: bell, title: { bn: 'ঘণ্টা বাজান', en: 'Ring Bell' }, sub: { bn: 'মন্দিরের ধ্বনি', en: 'Temple Chime' }, thanks: { bn: 'ঘণ্টা বাজানো হল', en: 'Bell rung' } },
  { kind: 'conch', icon: 'conch', img: conch, title: { bn: 'শঙ্খ বাজান', en: 'Blow Conch' }, sub: { bn: 'পবিত্র নিনাদ', en: 'Holy Resonator' }, thanks: { bn: 'শঙ্খ বাজানো হল', en: 'Conch sounded' } },
  { kind: 'aarti', icon: 'lamp', img: aarti, title: { bn: 'আরতি করুন', en: 'Perform Aarti' }, sub: { bn: 'পবিত্র আলো', en: 'Sacred Light' }, thanks: { bn: 'আরতি নিবেদিত হল', en: 'Aarti offered' } },
]

// a blue lotus in bloom: five petals fanned from the base, with a golden heart
const Lotus = () => (
  <svg viewBox="0 0 48 40" aria-hidden="true">
    <defs>
      <linearGradient id="pj-pet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c9d4ff" /><stop offset="0.45" stopColor="#6f7bf0" /><stop offset="1" stopColor="#2c2f9c" />
      </linearGradient>
    </defs>
    {[-72, 72, -38, 38, 0].map((a) => (
      <path key={a} d="M24 35C16.5 28 16.5 14 24 4c7.5 10 7.5 24 0 31z" fill="url(#pj-pet)" stroke="#1f2380" strokeWidth="0.6" transform={`rotate(${a} 24 35)`} />
    ))}
    <ellipse cx="24" cy="31" rx="5.5" ry="3.2" fill="#ffd54a" /><ellipse cx="24" cy="30" rx="2.6" ry="1.4" fill="#fff3b0" />
  </svg>
)

// where the goddess stands in the 1672 x 941 artwork (fractions), mapped onto whichever way the picture is currently drawn
function goddessPoint(img, frame) {
  const r = img.getBoundingClientRect()
  const cs = getComputedStyle(img)
  const fx = 0.68
  const fy = 0.36
  let x
  let y
  if (cs.objectFit === 'cover') {
    const sc = Math.max(r.width / 1672, r.height / 941)
    const pos = cs.objectPosition.split(' ').map((v) => parseFloat(v) / 100)
    x = r.left + (r.width - 1672 * sc) * pos[0] + fx * 1672 * sc
    y = r.top + (r.height - 941 * sc) * (pos[1] ?? 0.5) + fy * 941 * sc
  } else {
    x = r.left + fx * r.width
    y = r.top + fy * r.height
  }
  return { x: x - frame.left, y: y - frame.top }
}

const toBn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d])

function readCount() {
  try {
    const v = parseInt(localStorage.getItem(STORE_KEY), 10)
    return Number.isFinite(v) && v >= 0 ? v : START_COUNT
  } catch {
    return START_COUNT
  }
}

// Pinned, scroll-scrubbed section (same mechanics as Committee / Schedule): the heading builds in over the river-ghat artwork,
// then the four offering cards rise. Each card is a button: it plays a sound, bursts petals / sparks and adds to the counter.
export default function Pushpanjali() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { lang, t } = useLanguage()
  const [count, setCount] = useState(readCount)
  const [bursts, setBursts] = useState([])
  const [note, setNote] = useState('')
  const bgRef = useRef(null)
  const burstId = useRef(0)
  const [flights, setFlights] = useState([])

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1672, artH: 941, diyas: [], band: 0.15 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover9', hold: true })

  // lotuses fly from the card to the goddess in arcs, then a golden glow blooms where they land
  const throwLotuses = useCallback((card) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const frame = frameRef.current.getBoundingClientRect()
    const c = card.getBoundingClientRect()
    const end = goddessPoint(bgRef.current, frame)
    const sx = c.left + c.width / 2 - frame.left
    const sy = c.top + c.height * 0.3 - frame.top
    const jit = Math.max(14, frame.width * 0.025)
    const base = ++burstId.current
    const items = Array.from({ length: 5 }, (_, i) => {
      const dx = end.x - sx + (Math.random() - 0.5) * 2 * jit
      const dy = end.y - sy + (Math.random() - 0.5) * 2 * jit
      return {
        id: `${base}-${i}`,
        sx, sy, dx, dy,
        peak: Math.min(0, dy) - (90 + Math.random() * 70),
        rot: (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 200),
        delay: i * 0.13,
        size: Math.max(34, frame.width * 0.034) * (0.85 + Math.random() * 0.3),
      }
    })
    setFlights((f) => [...f, ...items, { id: `${base}-b`, glow: true, x: end.x, y: end.y, delay: 0.95 }])
    setTimeout(() => setFlights((f) => f.filter((x) => !x.id.startsWith(`${base}-`))), 2800)
  }, [])

  const offer = useCallback((o, card) => {
    playOffering(o.kind)
    if (o.kind === 'lotus') throwLotuses(card)
    setCount((c) => {
      const next = c + 1
      try {
        localStorage.setItem(STORE_KEY, String(next))
      } catch {
        /* storage unavailable: the count still works for this visit */
      }
      return next
    })
    const id = ++burstId.current
    setBursts((b) => [...b, { id, kind: o.kind }])
    setNote(t(o.thanks))
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 2200)
  }, [t, throwLotuses])

  const ph = (s, l) => ({ '--s': s, '--l': l })
  const shown = lang === 'bn' ? toBn(count.toLocaleString('en-IN')) : count.toLocaleString('en-IN')

  return (
    <section className="dp-pj" ref={trackRef}>
      {/* scroll target for the navbar's "Pushpanjali" link: the point where the page has built */}
      <span id="pushpanjali" className="dp-pj__anchor" aria-hidden="true" />
      <div className="dp-pj__pin">
        <img loading="lazy" decoding="async" className="dp-pj__backdrop" src={bg} alt="" draggable="false" aria-hidden="true" />
        <div className="dp-pj__frame" ref={frameRef}>
          <img loading="lazy" decoding="async" className="dp-pj__bg" src={bg} alt="" draggable="false" ref={bgRef} />

          <div className="dp-pj__copy">
            <span className="dp-pj__badge dp-ph" style={ph(0.03, 0.08)}>
              <Icon name="immersion" />
              {t({ bn: 'পবিত্র অভিজ্ঞতা', en: 'Sacred Immersion' })}
            </span>
            <h2 className="dp-pj__title dp-ph" style={ph(0.06, 0.12)}>
              <span>{t({ bn: 'ভার্চুয়াল', en: 'Virtual' })}</span>
              <span>{t({ bn: 'পুষ্পাঞ্জলি ও আরতি', en: 'Pushpanjali & Aarti' })}</span>
            </h2>
            <i className="dp-pj__rule dp-ph" style={ph(0.12, 0.08)} aria-hidden="true" />
            <p className="dp-pj__sub dp-ph" style={ph(0.14, 0.1)}>
              {t({
                bn: 'পবিত্র নীলপদ্ম নিবেদন করুন, শঙ্খ বাজান এবং বিশ্বের যেখানেই থাকুন, দেবীর আশীর্বাদ প্রার্থনা করুন।',
                en: 'Offer consecrated blue lotuses, sound the sacred conch shell, and invoke divine blessings wherever you are in the world.',
              })}
            </p>
            <i className="dp-pj__rule is-small dp-ph" style={ph(0.2, 0.08)} aria-hidden="true" />
            <p className="dp-pj__quote dp-ph" style={ph(0.22, 0.1)}>
              {t({
                bn: '“দেবী দুর্গা আপনাকে ও আপনার প্রিয়জনদের শান্তি, শক্তি ও সমৃদ্ধি দান করুন।”',
                en: '“May Goddess Durga bless you and your loved ones with peace, vigor, and prosperity.”',
              })}
            </p>
            <i className="dp-pj__rule is-small dp-ph" style={ph(0.27, 0.08)} aria-hidden="true" />
          </div>

          <ul className="dp-pj__cards">
            {OFFERINGS.map((o, i) => (
              <li key={o.kind} className="dp-ph" style={ph(0.3 + i * 0.08, 0.16)}>
                <button type="button" className={`dp-pj__card is-${o.kind}`} onClick={(e) => offer(o, e.currentTarget)} aria-label={`${t(o.title)} — ${t(o.sub)}`}>
                  <span className="dp-pj__photo">
                    <img loading="lazy" decoding="async" src={o.img} alt="" draggable="false" />
                    {bursts.filter((b) => b.kind === o.kind).map((b) => (
                      <span className="dp-pj__burst" key={b.id} aria-hidden="true">
                        {Array.from({ length: 12 }, (_, k) => (
                          <i key={k} style={{ '--a': `${(k / 12) * 360 + ((k * 37) % 20)}deg`, '--d': `${70 + ((k * 53) % 50)}px`, '--w': `${0.9 + (k % 4) * 0.15}s` }} />
                        ))}
                      </span>
                    ))}
                  </span>
                  <span className="dp-pj__medal"><Icon name={o.icon} /></span>
                  <strong>{t(o.title)}</strong>
                  <small>{t(o.sub)}</small>
                </button>
              </li>
            ))}
          </ul>

          <div className="dp-pj__total dp-ph" style={ph(0.66, 0.14)}>
            <Icon name="lotus" className="dp-pj__orn" />
            <span className="dp-pj__stat">
              <Icon name="heart" />
              {t({ bn: 'মোট নিবেদন:', en: 'Total Offerings Made:' })}
              <b key={count}>{shown}</b>
            </span>
            <i aria-hidden="true" />
            <span className="dp-pj__stat">
              <Icon name="star" />
              {t({ bn: 'বিশ্বজনীন ভক্তি-নিবেদন', en: 'Universal Devotional Tributes' })}
            </span>
            <Icon name="lotus" className="dp-pj__orn" />
          </div>
          <p className="dp-pj__note" role="status" aria-live="polite">
            {note || t({ bn: 'আপনার এই ডিভাইসে গোনা হচ্ছে', en: 'Counted on this device' })}
          </p>

          {flights.map((f) =>
            f.glow ? (
              <span className="dp-pj__bless" key={f.id} style={{ left: f.x, top: f.y, '--delay': `${f.delay}s` }} aria-hidden="true" />
            ) : (
              <span className="dp-pj__throw" key={f.id} style={{ left: f.sx, top: f.sy, '--dx': `${f.dx}px`, '--dy': `${f.dy}px`, '--peak': `${f.peak}px`, '--rot': `${f.rot}deg`, '--delay': `${f.delay}s`, '--sz': `${f.size}px` }} aria-hidden="true">
                <span className="dp-pj__tx"><span className="dp-pj__ty"><span className="dp-pj__fl"><Lotus /></span></span></span>
              </span>
            ),
          )}

          {/* Three.js overlay: drifting petals and dust */}
          <div className="dp-pj__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
