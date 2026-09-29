import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import bg from '../assets/contact/bg.webp'
import venue from '../assets/contact/venue.webp'
import info from '../assets/contact/info.webp'
import map from '../assets/contact/map.webp'
import r1 from '../assets/contact/r1.webp'
import r2 from '../assets/contact/r2.webp'
import r3 from '../assets/contact/r3.webp'
import bar from '../assets/contact/bar.webp'
import './contact/Contact.css'

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Haldia+Durga+Utsav+Maidan+Khudiram+Nagar+Haldia'
const TOP = 57 // the mockup's own navbar strip (hidden under the real navbar)

// flame centres in the 1586 x 935 artwork: x, y, scale
const DIYAS = [
  [160, 100, 0.75],
  [212, 82, 0.9],
  [1372, 82, 0.9],
  [1418, 100, 0.75],
  [32, 795, 0.85],
  [62, 858, 1.05],
  [1510, 842, 1.05],
  [1552, 812, 0.85],
]

// Every text sits on the card artwork at the pixel it had in the mockup: `x` = left edge, `y` = vertical
// centre of the (first) line, both in mockup pixels; `w` = wrapping width; `lh` = line pitch.
const CARDS = [
  {
    id: 'venue', img: venue, x: 92, y: 281, w: 438, h: 278, s: 0.16,
    texts: [
      { k: 'title', x: 189, y: 327, fs: 22, c: { bn: 'ভেন্যু ও ঠিকানা', en: 'Venue & Address' } },
      {
        k: 'body', x: 157, y: 384, fs: 16.5, lh: 27, w: 350,
        c: {
          bn: 'হলদিয়া দুর্গা উৎসব ময়দান, ক্ষুদিরাম নগর\nথানা হলদিয়া · ডাকঘর হাতিবেড়িয়া\nপূর্ব মেদিনীপুর, পশ্চিমবঙ্গ — ৭২১৬৫৭',
          en: 'Haldia Durga Utsav Maidan, Khudiram Nagar\nP.S. Haldia  •  P.O. Hatiberia\nPurba Medinipur, West Bengal — 721657',
        },
      },
    ],
  },
  {
    id: 'info', img: info, x: 542, y: 281, w: 413, h: 279, s: 0.22,
    texts: [
      { k: 'title', x: 638, y: 327, fs: 22, c: { bn: 'যোগাযোগের তথ্য', en: 'Contact Information' } },
      { k: 'main', x: 622, y: 368, fs: 17.5, href: 'tel:+919876543210', c: { bn: '+91 98765 43210', en: '+91 98765 43210' } },
      { k: 'sub', x: 622, y: 392, fs: 14.5, c: { bn: '(কমিটি হেল্পলাইন)', en: '(Committee Helpline)' } },
      { k: 'main', x: 622, y: 435, fs: 17.5, href: 'mailto:haldiadurgotsav2026@gmail.com', c: { bn: 'haldiadurgotsav2026@gmail.com', en: 'haldiadurgotsav2026@gmail.com' } },
      { k: 'sub', x: 622, y: 457, fs: 14.5, c: { bn: '(সাধারণ জিজ্ঞাসা)', en: '(General Inquiries)' } },
      { k: 'main', x: 622, y: 499, fs: 17.5, c: { bn: 'www.haldiadurgotsav.in', en: 'www.haldiadurgotsav.in' } },
      { k: 'sub', x: 622, y: 521, fs: 14.5, c: { bn: '(শীঘ্রই আসছে)', en: '(Coming Soon)' } },
    ],
  },
  {
    id: 'map', img: map, x: 967, y: 281, w: 532, h: 279, s: 0.28,
    texts: [{ k: 'maptitle', x: 1034, y: 313, fs: 23, c: { bn: 'অবস্থান মানচিত্র', en: 'Location Map' } }],
  },
  {
    id: 'r1', img: r1, x: 92, y: 615, w: 467, h: 292, s: 0.46,
    texts: [
      { k: 'title', x: 185, y: 652, fs: 21.5, c: { bn: 'গণপরিবহন', en: 'Public Transport' } },
      {
        k: 'body', x: 171, y: 700, fs: 15, lh: 21.5, w: 372,
        c: {
          bn: '<b>বাস:</b> এইচআইটি লিঙ্ক রোড / ক্ষুদিরাম মার্কেট স্টপ থেকে ২–৫ মিনিট (~১৫০–৩০০ মি) হাঁটা। হলদিয়া শহরের বাস ও মেচেদা-কলকাতাগামী দূরপাল্লার বাস চলে।',
          en: '<b>Bus:</b> 2–5 min walk (~150–300m) to HIT Link Road / Khudiram Market stops. Haldia city buses + long-distance services toward Mecheda & Kolkata.',
        },
      },
      {
        k: 'body', x: 171, y: 778, fs: 15, lh: 22, w: 372,
        c: {
          bn: '<b>রেল:</b> হলদিয়া রেলওয়ে স্টেশন (বন্দর এলাকা) ~৪–৫ কিমি দূরে।',
          en: '<b>Rail:</b> Haldia Railway Station (Bandar zone) ~4–5 km away.',
        },
      },
      {
        k: 'body', x: 171, y: 836, fs: 15, lh: 21.5, w: 372,
        c: {
          bn: '<b>শেষ পথ:</b> স্টেশন ও দুর্গাচক মোড় থেকে টোটো, অটো ও সাইকেল-রিকশা নিরন্তর চলে, সরাসরি গেটে নামিয়ে দেয়।',
          en: '<b>Last-mile:</b> Totos, autos & cycle-rickshaws run continuously from the station and Durgachak More, with direct drops to the gate.',
        },
      },
    ],
  },
  {
    id: 'r2', img: r2, x: 567, y: 615, w: 461, h: 292, s: 0.52,
    texts: [
      { k: 'title', x: 664, y: 652, fs: 21.5, c: { bn: 'রাস্তা ও ব্র্যান্ডিং ফ্রন্টেজ', en: 'Road & Branding Frontage' } },
      { k: 'body', x: 652, y: 697, fs: 15, lh: 21, w: 350, c: { bn: 'এইচআইটি লিঙ্ক রোড থেকে বেরোনো একটি সেক্টর রোডের ঠিক পাশে — একটি প্রধান বাণিজ্যিক সড়ক।', en: 'Sits directly on a sector road off HIT Link Road — a main commercial arterial.' } },
      { k: 'body', x: 652, y: 749, fs: 15, lh: 21, w: 350, c: { bn: 'সামনের রাস্তা ~১০–১২ মি (৩০–৪০ ফুট) চওড়া, বাজার মোড়ে আরও প্রশস্ত।', en: 'Frontage road ~10–12m (30–40ft) wide, widening further at the market junction.' } },
      { k: 'body', x: 652, y: 803, fs: 15, lh: 21, w: 350, c: { bn: 'বড় স্বাগত গেট/তোরণ, কাঠামোগত হোর্ডিং ও পতাকাদণ্ডের জায়গা রয়েছে।', en: 'Room for large welcome gates/toran, structural hoardings & flag poles.' } },
      { k: 'body', x: 652, y: 856, fs: 15, lh: 21, w: 350, c: { bn: 'চওড়া প্রান্তরেখা — পথচারী বা জরুরি চলাচল আটকে না দিয়ে দু’পাশে ব্র্যান্ড কিয়স্ক বসানো যায়।', en: 'Wide margins allow double-sided brand kiosks without blocking pedestrian or emergency access.' } },
    ],
  },
  {
    id: 'r3', img: r3, x: 1035, y: 615, w: 466, h: 292, s: 0.58,
    texts: [
      { k: 'title', x: 1132, y: 652, fs: 21.5, c: { bn: 'পার্কিং ও জরুরি প্রবেশপথ', en: 'Parking & Emergency Access' } },
      { k: 'body', x: 1133, y: 710, fs: 16, lh: 24.5, w: 335, c: { bn: 'দু-চাকা ও চার-চাকার নিজস্ব পার্কিং — ব্যস্ততম দিনের ভিড়ের জন্য পর্যাপ্ত বলে নিশ্চিত।', en: 'Dedicated two-wheeler & four-wheeler parking confirmed adequate for peak-day crowds.' } },
      { k: 'body', x: 1133, y: 778, fs: 16, lh: 24.5, w: 335, c: { bn: 'জরুরি প্রবেশপথ — অ্যাম্বুলেন্স, ফায়ার রুট ও পুলিশ পয়েন্ট — নিশ্চিতভাবে রয়েছে।', en: 'Emergency access — ambulance, fire route & police point — confirmed in place.' } },
    ],
  },
  {
    id: 'bar', img: bar, x: 208, y: 915, w: 1175, h: 57, s: 0.7,
    texts: [
      { k: 'acc', x: 318, y: 944, fs: 17.5, c: { bn: 'অ্যাক্সেসিবিলিটি ও সবার জন্য প্রবেশ', en: 'Accessibility & Inclusive Entry' } },
      { k: 'accbody', x: 585, y: 944, fs: 15.5, c: { bn: 'প্রবীণ ও ভিন্নভাবে সক্ষম দর্শনার্থীদের জন্য র‍্যাম্প ও ভিড়-নিয়ন্ত্রণ পরিকল্পনা বাস্তবায়িত হচ্ছে।', en: 'Ramps and crowd-flow plans for elderly and differently-abled visitors are being implemented.' } },
    ],
  },
]

// Pinned, scroll-scrubbed section (same mechanics as the other pages).
export default function Contact() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1586, artH: 935, diyas: DIYAS, band: 0.12 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover3' })

  const ph = (s, l) => ({ '--s': s, '--l': l })
  const ux = (v) => `calc(${v} * var(--ux))`
  const uy = (v) => `calc(${v} * var(--uy))`

  return (
    <section className="dp-ct" ref={trackRef}>
      {/* scroll target for the navbar's "Contact Us" link: the point where everything has built */}
      <span id="contact" className="dp-ct__anchor" aria-hidden="true" />
      <div className="dp-ct__pin">
        <div className="dp-ct__frame" ref={frameRef}>
          <img className="dp-ct__bg" src={bg} alt="" draggable="false" />

          <h2 className="dp-ct__h1 dp-ph" style={ph(0.02, 0.12)}>
            {t({ bn: 'যোগাযোগ', en: 'Contact Us' })}
          </h2>
          <p className="dp-ct__h2 dp-ph" style={ph(0.07, 0.1)}>
            {t({ bn: 'যোগাযোগ করুন ও ঘুরে যান', en: 'Get in Touch & Visit Us' })}
          </p>
          <p className="dp-ct__h3 dp-ph" style={ph(0.11, 0.1)}>
            {t({
              bn: 'হলদিয়া দুর্গোৎসব ২০২৬-এ আমন্ত্রণ — বিশ্বাস, সংস্কৃতি ও সম্প্রদায়ের এক উদযাপন।',
              en: 'Join us at Haldia Durgotsav 2026 — a celebration of faith, culture and community.',
            })}
          </p>

          <h3 className="dp-ct__reach dp-ph" style={ph(0.4, 0.1)}>
            {t({ bn: 'কীভাবে পৌঁছবেন', en: 'How to Reach' })}
          </h3>

          {CARDS.map((c) => (
            <article
              key={c.id}
              className={`dp-ct__card is-${c.id} dp-ph`}
              style={{ ...ph(c.s, 0.16), left: ux(c.x), top: uy(c.y - TOP), width: ux(c.w), height: uy(c.h) }}
            >
              <img src={c.img} alt="" draggable="false" style={{ left: ux(-3), top: uy(-3), width: ux(c.w + 6), height: uy(c.h + 6) }} />
              {c.texts.map((tx, i) => {
                const html = t(tx.c)
                const Tag = tx.href ? 'a' : 'p'
                const style = { left: ux(tx.x - c.x), top: uy(tx.y - c.y), '--fs': tx.fs }
                if (tx.w) style.width = ux(tx.w)
                if (tx.lh) style['--lh'] = tx.lh
                return (
                  <Tag key={i} className={`dp-ct__tx is-${tx.k}`} style={style} href={tx.href}>
                    {html.split('\n').map((line, j) => (
                      <span key={j} className="dp-ct__ln" dangerouslySetInnerHTML={{ __html: line }} />
                    ))}
                  </Tag>
                )
              })}
              {c.id === 'map' && (
                <>
                  <a className="dp-ct__btn" href={MAPS_URL} target="_blank" rel="noreferrer" style={{ left: ux(1285 - c.x), top: uy(294 - c.y), width: ux(198), height: uy(34) }}>
                    <span>{t({ bn: 'গুগল ম্যাপে দেখুন', en: 'View on Google Maps' })}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3h8v8M21 3l-10 10M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                  <a className="dp-ct__mapimg" href={MAPS_URL} target="_blank" rel="noreferrer" aria-label={t({ bn: 'গুগল ম্যাপে দেখুন', en: 'View on Google Maps' })} style={{ left: ux(981 - c.x), top: uy(340 - c.y), width: ux(505), height: uy(211) }} />
                </>
              )}
              {c.id === 'bar' && <span className="dp-ct__divider" style={{ left: ux(567 - c.x), top: uy(934 - c.y) }} />}
            </article>
          ))}

          {/* Three.js overlay: petals, dust, flickering diya flames */}
          <div className="dp-ct__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
