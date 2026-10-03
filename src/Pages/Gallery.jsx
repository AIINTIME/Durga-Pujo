import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import { GROUPS, VIDEOS } from './gallery/photos.js'
import board from '../assets/gallery/board.webp'
import './gallery/Gallery.css'

// flame centres in the 1672 x 941 artwork: x, y, scale
const DIYAS = [
  [18, 384, 0.8],
  [76, 640, 0.75],
  [132, 636, 0.8],
  [1653, 372, 0.8],
  [1545, 636, 0.75],
  [1594, 640, 0.75],
  [78, 856, 1.0],
  [1597, 850, 1.0],
]

const toBn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d])
// 5 x 3 on the desktop board, 2 columns on phones
const PAGE = window.matchMedia('(max-width: 820px)').matches ? 12 : 15

const photo = (g, f) => ({ type: 'photo', g, key: `${g}/${f}`, full: `/gallery/${g}/${f}.webp`, thumb: `/gallery/${g}/thumb/${f}.webp` })
const video = (v) => ({ type: 'video', g: 'videos', key: `yt/${v.id}`, id: v.id, thumb: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` })
const PHOTOS = Object.entries(GROUPS).flatMap(([g, files]) => files.map((f) => photo(g, f)))
const CLIPS = VIDEOS.map(video)
const ALL = [...PHOTOS, ...CLIPS]

const FILTERS = [
  { id: 'all', icon: 'grid', label: { bn: 'সব স্মৃতি', en: 'All Memories' } },
  { id: 'highlights', icon: 'star', label: { bn: 'বিশেষ মুহূর্ত', en: 'Highlights' } },
  ...(CLIPS.length ? [{ id: 'videos', icon: 'yt', label: { bn: 'ইউটিউব ভিডিও', en: 'YouTube Videos' } }] : []),
  { id: '2025', icon: 'cal', label: { bn: '২০২৫', en: '2025' } },
  { id: '2024', icon: 'cal', label: { bn: '২০২৪', en: '2024' } },
  { id: '2023', icon: 'cal', label: { bn: '২০২৩', en: '2023' } },
  { id: '2022', icon: 'cal', label: { bn: '২০২২', en: '2022' } },
  { id: '2021', icon: 'cal', label: { bn: '২০২১', en: '2021' } },
  { id: '2020', icon: 'cal', label: { bn: '২০২০', en: '2020' } },
  { id: '2019', icon: 'cal', label: { bn: '২০১৯ সূচনা', en: '2019 Inaugural' } },
]
const COUNT = { all: ALL.length, videos: CLIPS.length, ...Object.fromEntries(Object.entries(GROUPS).map(([g, f]) => [g, f.length])) }

const ICONS = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  star: <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" />,
  cal: <><rect x="3" y="4.5" width="18" height="16.5" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 10h18" /></>,
  camera: <><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" /><circle cx="12" cy="13" r="3" /></>,
  img: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="1.8" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /></>,
  prev: <path d="m15 5-7 7 7 7" />,
  next: <path d="m9 5 7 7-7 7" />,
}
const Ico = ({ n, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[n]}</svg>
)
const YtIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="5" width="21" height="14" rx="4" fill="#ff1a1a" /><path d="M10 9l5.5 3-5.5 3z" fill="#fff" /></svg>
)
const Lotus = () => (
  <svg viewBox="0 0 48 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
    <path d="M24 3c-3.5 4-3.5 10 0 15 3.5-5 3.5-11 0-15z" /><path d="M21 17C16 16 12.5 12.5 12 8c4.5.5 7.5 3 9 7" /><path d="M27 17c5-1 8.5-4.5 9-9-4.5.5-7.5 3-9 7" /><path d="M20 20c-5 .5-9-1.5-11-5 3-.5 6 .5 8 3" /><path d="M28 20c5 .5 9-1.5 11-5-3-.5-6 .5-8 3" />
  </svg>
)

// page buttons: first, last, the current page and its neighbours, with … for the gaps
function pageList(cur, total) {
  const keep = new Set([0, 1, total - 1, cur - 1, cur, cur + 1])
  const out = []
  for (let i = 0; i < total; i++) {
    if (!keep.has(i)) continue
    if (out.length && i - out[out.length - 1] > 1) out.push('…')
    out.push(i)
  }
  return out
}

// Pinned, scroll-scrubbed board (same mechanics as Pushpanjali / Schedule): the heading, filters and photo cards build in
// over the river-ghat artwork as you scroll; after that it is a paged photo grid with a full-size viewer.
export default function Gallery() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { lang, t } = useLanguage()
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(null) // index into the filtered list
  const n = (v) => (lang === 'bn' ? toBn(v) : v)

  const list = useMemo(() => (filter === 'all' ? ALL : ALL.filter((p) => p.g === filter)), [filter])
  const N = list.length
  const pages = Math.ceil(N / PAGE)

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1672, artH: 941, diyas: DIYAS, band: 0.12 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover', hold: true, lead: true })

  const pick = (id) => { setFilter(id); setPage(0); setOpen(null) }
  const step = useCallback((d) => setOpen((i) => (i === null || !N ? i : (i + d + N) % N)), [N])
  const close = useCallback(() => setOpen(null), [])

  useEffect(() => {
    if (open === null) return
    const onKey = (ev) => {
      if (ev.key === 'Escape') close()
      else if (ev.key === 'ArrowRight') step(1)
      else if (ev.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, step, close])

  // the next two full-size photos are fetched ahead of time so the viewer never shows a blank frame
  useEffect(() => {
    if (open === null || !N) return
    ;[1, 2].forEach((d) => { const p = list[(open + d) % N]; if (p.type === 'photo') new Image().src = p.full })
  }, [open, list, N])

  const ph = (s, l) => ({ '--s': s, '--l': l })
  const cur = open !== null ? list[open] : null
  const rows = list.slice(page * PAGE, page * PAGE + PAGE)

  return (
    <section className="dp-gal" ref={trackRef}>
      {/* scroll target for the navbar's "Gallery" link: the point where the board has built */}
      <span id="gallery" className="dp-gal__anchor" aria-hidden="true" />
      <div className="dp-gal__pin">
        <div className="dp-gal__frame" ref={frameRef}>
          <img loading="lazy" decoding="async" className="dp-gal__bg" src={board} alt="" draggable="false" />

          <div className="dp-gal__head">
            <span className="dp-gal__badge dp-ph" style={ph(0.02, 0.08)}><Ico n="camera" />{t({ bn: 'দৃশ্যকাব্য', en: 'Visual Chronicle' })}</span>
            <h2 className="dp-gal__title dp-ph" style={ph(0.05, 0.12)}>{t({ bn: 'শারদ স্মৃতিকথা চিত্রশালা', en: 'Autumn Memories Gallery' })}</h2>
            <p className="dp-gal__sub dp-ph" style={ph(0.1, 0.1)}>
              {t({
                bn: `২০১৯ সালের সূচনা থেকে ২০২৫ সাল পর্যন্ত প্রতিটি উৎসবের ${n(PHOTOS.length)}টি প্রামাণ্য আলোকচিত্র।`,
                en: `${PHOTOS.length} documented photographs of every festival, from the 2019 inception to 2025.`,
              })}
            </p>
            <span className="dp-gal__rule dp-ph" style={ph(0.14, 0.08)} aria-hidden="true"><Lotus /></span>
          </div>

          <div className="dp-gal__filters dp-ph" style={ph(0.18, 0.12)} role="tablist" aria-label={t({ bn: 'বছর অনুযায়ী ছবি', en: 'Photos by year' })}>
            {FILTERS.map((x) => (
              <button type="button" role="tab" aria-selected={filter === x.id} key={x.id} className={filter === x.id ? 'is-on' : ''} onClick={() => pick(x.id)}>
                {x.icon === 'yt' ? <YtIcon /> : <Ico n={x.icon} />}
                {t(x.label)}
                <small>({n(COUNT[x.id])})</small>
              </button>
            ))}
          </div>

          {N > 0 && (
            <ul className="dp-gal__grid" key={`${filter}-${page}`}>
              {rows.map((p, i) => (
                <li key={p.key} className="dp-ph" style={ph(0.26 + i * 0.022, 0.14)}>
                  <button type="button" className="dp-gal__card" onClick={() => setOpen(page * PAGE + i)} aria-label={`${p.type === 'video' ? t({ bn: 'ভিডিও', en: 'Video' }) : t({ bn: 'ছবি', en: 'Photo' })} ${n(page * PAGE + i + 1)} / ${n(N)}`}>
                    <img src={p.thumb} alt="" loading="lazy" decoding="async" draggable="false" />
                    {p.type === 'video' ? (
                      <>
                        <span className="dp-gal__tag is-video"><YtIcon />{t({ bn: 'ভিডিও', en: 'Video' })}</span>
                        <span className="dp-gal__play" aria-hidden="true" />
                      </>
                    ) : (
                      <span className="dp-gal__tag"><Ico n="img" />{t({ bn: 'ছবি', en: 'Photo' })}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {pages > 1 && (
            <nav className="dp-gal__pages dp-ph" style={ph(0.62, 0.12)} aria-label={t({ bn: 'পৃষ্ঠা', en: 'Pages' })}>
              <button type="button" onClick={() => setPage(page - 1)} disabled={page === 0} aria-label={t({ bn: 'আগের পৃষ্ঠা', en: 'Previous page' })}><Ico n="prev" /></button>
              {pageList(page, pages).map((v, i) =>
                v === '…' ? (
                  <span key={`e${i}`} aria-hidden="true">…</span>
                ) : (
                  <button type="button" key={v} className={v === page ? 'is-on' : ''} onClick={() => setPage(v)} aria-current={v === page ? 'page' : undefined}>{n(v + 1)}</button>
                ),
              )}
              <button type="button" onClick={() => setPage(page + 1)} disabled={page === pages - 1} aria-label={t({ bn: 'পরের পৃষ্ঠা', en: 'Next page' })}><Ico n="next" /></button>
            </nav>
          )}

          {/* Three.js overlay: petals, dust, flickering diya flames */}
          <div className="dp-gal__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>

      {cur && createPortal(
        <div className="dp-gal__lightbox" role="dialog" aria-modal="true" aria-label={t({ bn: 'ছবির ভিউয়ার', en: 'Photo viewer' })} onClick={close}>
          {cur.type === 'video' ? (
            <iframe key={cur.id} src={`https://www.youtube-nocookie.com/embed/${cur.id}?autoplay=1&rel=0`} title="YouTube" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen onClick={(ev) => ev.stopPropagation()} />
          ) : (
            <img key={cur.full} src={cur.full} alt="" onClick={(ev) => ev.stopPropagation()} />
          )}
          <span className="dp-gal__count">{n(open + 1)} / {n(N)}</span>
          <button type="button" className="dp-gal__ctl is-prev" onClick={(ev) => { ev.stopPropagation(); step(-1) }} aria-label={t({ bn: 'আগের ছবি', en: 'Previous' })}>‹</button>
          <button type="button" className="dp-gal__ctl is-next" onClick={(ev) => { ev.stopPropagation(); step(1) }} aria-label={t({ bn: 'পরের ছবি', en: 'Next' })}>›</button>
          <button type="button" className="dp-gal__ctl is-close" onClick={(ev) => { ev.stopPropagation(); close() }} aria-label={t({ bn: 'বন্ধ করুন', en: 'Close' })}>×</button>
        </div>,
        document.body,
      )}
    </section>
  )
}
