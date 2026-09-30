import { useCallback, useEffect, useRef, useState } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import bg from '../assets/gallery/bg.webp'
import a from '../assets/gallery/a.webp'
import b from '../assets/gallery/b.webp'
import c from '../assets/gallery/c.webp'
import d from '../assets/gallery/d.webp'
import e from '../assets/gallery/e.webp'
import './gallery/Gallery.css'

// flame centres in the 1585 x 935 artwork: x, y, scale
const DIYAS = [
  [30, 700, 0.8],
  [84, 743, 1.0],
  [197, 825, 1.05],
  [1562, 718, 0.85],
  [1420, 823, 1.05],
]

// the five photos, in carousel order
const PHOTOS = [
  { img: a, cap: { bn: 'বিশাল শোভাযাত্রা', en: 'Grand Procession' } },
  { img: c, cap: { bn: 'সংবর্ধনা', en: 'Felicitation' } },
  { img: b, cap: { bn: 'সম্প্রদায়', en: 'Community' } },
  { img: e, cap: { bn: 'সম্মাননা অনুষ্ঠান', en: 'Award Ceremony' } },
  { img: d, cap: { bn: 'বিশেষ অতিথি', en: 'Special Guests' } },
]
const N = PHOTOS.length
const INTRO = 0 // the heading and carousel are in place from the start; scrolling only changes the photo

// Pinned, scroll-scrubbed section (same mechanics as Recognition / Committee).
export default function Gallery() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { t } = useLanguage()
  const [open, setOpen] = useState(null)
  const [idx, setIdx] = useState(0)
  const dotRef = useRef(null)
  const drag = useRef(null)
  const go = useCallback((n) => setIdx((i) => Math.min(N - 1, Math.max(0, i + n))), [])

  // scrolling drives the carousel: further down = next photo, back up = previous photo
  useEffect(() => {
    const track = trackRef.current
    const desktop = () => window.matchMedia('(min-width: 821px)').matches
    // on desktop Home keeps one extra screen for the next section's curtain; on phones the gallery is simply pinned
    const span = () => track.offsetHeight - window.innerHeight * (desktop() && track.closest('.dp-home') ? 2 : 1)
    const pinned = () => span() > 0
    const onScroll = () => {
      if (!pinned()) return
      const prog = Math.min(1, Math.max(0, -track.getBoundingClientRect().top / span()))
      const f = Math.min(1, Math.max(0, (prog - INTRO) / (1 - INTRO)))
      setIdx(Math.min(N - 1, Math.floor(f * N))) // every photo gets an equal stretch of scroll
    }
    const toDot = (i) => {
      if (!pinned()) return setIdx(i)
      const prog = INTRO + ((1 - INTRO) * (i + 0.5)) / N
      window.scrollTo({ top: track.getBoundingClientRect().top + window.scrollY + prog * span(), behavior: 'smooth' })
    }
    dotRef.current = toDot
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1585, artH: 935, diyas: DIYAS, band: 0.12 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover', hold: true })

  const step = useCallback((n) => setOpen((i) => (i === null ? i : (i + n + N) % N)), [])
  useEffect(() => {
    if (open === null) return
    const onKey = (ev) => {
      if (ev.key === 'Escape') setOpen(null)
      else if (ev.key === 'ArrowRight') step(1)
      else if (ev.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step])


  return (
    <section className="dp-gal" ref={trackRef}>
      {/* scroll target for the navbar's "Gallery" link: the point where everything has built */}
      <span id="gallery" className="dp-gal__anchor" aria-hidden="true" />
      <div className="dp-gal__pin">
        <img className="dp-gal__backdrop" src={bg} alt="" draggable="false" aria-hidden="true" />
        <div className="dp-gal__frame" ref={frameRef}>
          <img className="dp-gal__bg" src={bg} alt="" draggable="false" />

          <h2 className="dp-gal__title">
            {t({ bn: 'গ্যালারি', en: 'Gallery' })}
          </h2>
          <p className="dp-gal__tag">
            {t({ bn: 'বিশ্বাস, সংস্কৃতি ও সম্প্রদায়ের মুহূর্ত', en: 'Moments of Faith, Culture and Community' })}
          </p>

          <div
            className="dp-gal__carousel"
            onPointerDown={(ev) => (drag.current = ev.clientX)}
            onPointerUp={(ev) => {
              const dx = ev.clientX - (drag.current ?? ev.clientX)
              drag.current = null
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
            }}
          >
            {PHOTOS.map((ph_, i) => {
              const o = i - idx
              const a = Math.abs(o)
              return (
                <button
                  type="button"
                  key={i}
                  className={`dp-gal__slide ${o === 0 ? 'is-active' : ''}`}
                  style={{ '--o': o, '--a': a, zIndex: 10 - a }}
                  data-far={a > 1}
                  tabIndex={a > 1 ? -1 : 0}
                  onClick={() => (o === 0 ? setOpen(i) : go(o))}
                  aria-label={t(ph_.cap)}
                >
                  <img src={ph_.img} alt="" draggable="false" />
                </button>
              )
            })}
          </div>
          <div className="dp-gal__dots">
            {PHOTOS.map((p_, i) => (
              <button type="button" key={i} className={`dp-gal__dot ${i === idx ? 'is-on' : ''}`} onClick={() => dotRef.current?.(i)} aria-label={`${i + 1} / ${N}`} />
            ))}
          </div>

          {/* Three.js overlay: petals, dust, flickering diya flames */}
          <div className="dp-gal__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>

      {open !== null && (
        <div className="dp-gal__lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <img src={PHOTOS[open].img} alt={t(PHOTOS[open].cap)} onClick={(ev) => ev.stopPropagation()} />
          <button type="button" className="dp-gal__nav is-prev" onClick={(ev) => { ev.stopPropagation(); step(-1) }} aria-label="Previous">‹</button>
          <button type="button" className="dp-gal__nav is-next" onClick={(ev) => { ev.stopPropagation(); step(1) }} aria-label="Next">›</button>
          <button type="button" className="dp-gal__close" onClick={() => setOpen(null)} aria-label="Close">×</button>
        </div>
      )}
    </section>
  )
}
