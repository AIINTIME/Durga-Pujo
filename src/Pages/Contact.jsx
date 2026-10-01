import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import Lotus from '../components/navbar/Lotus.jsx'
import Icon from './contact/Icon.jsx'
import hero from '../assets/contact2/hero.webp'
import venue from '../assets/contact2/venue.webp'
import map from '../assets/contact2/map.webp'
import banner from '../assets/contact2/banner.webp'
import './contact/Contact.css'

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Haldia+Durga+Utsav+Maidan+Khudiram+Nagar+Haldia'

const FOOT_LINKS = [
  { id: 'about', to: '/about', label: { bn: 'আমাদের সম্পর্কে', en: 'About' } },
  { id: 'glance', to: '/home', label: { bn: 'এক নজরে পূজা', en: 'Puja at a Glance' } },
  { id: 'theme-archive', to: '/home', label: { bn: 'থিম আর্কাইভ', en: 'Theme Archive' } },
  { id: 'artist', to: '/home', label: { bn: 'শিল্পী', en: 'Artist' } },
  { id: 'gallery', to: '/gallery', label: { bn: 'গ্যালারি', en: 'Gallery' } },
  { id: 'contact', to: '/contact', label: { bn: 'যোগাযোগ', en: 'Contact Us' } },
]

const TRANSPORT = [
  {
    icon: 'bus',
    h: { bn: 'বাস', en: 'Bus' },
    c: {
      bn: 'এইচআইটি লিঙ্ক রোড / ক্ষুদিরাম মার্কেট স্টপ থেকে ২–৫ মিনিট (~১৫০–৩০০ মি) হাঁটা। হলদিয়া শহরের বাস ও মেচেদা-কলকাতাগামী দূরপাল্লার বাস চলে।',
      en: '2–5 min walk (~150–300m) to HIT Link Road / Khudiram Market stops. Haldia city buses + long-distance services toward Mecheda & Kolkata.',
    },
  },
  {
    icon: 'train',
    h: { bn: 'রেল', en: 'Rail' },
    c: { bn: 'হলদিয়া রেলওয়ে স্টেশন (বন্দর এলাকা) ~৪–৫ কিমি দূরে।', en: 'Haldia Railway Station (Bandar zone) ~4–5 km away.' },
  },
  {
    icon: 'auto',
    h: { bn: 'শেষ পথ', en: 'Last-mile' },
    c: {
      bn: 'স্টেশন ও দুর্গাচক মোড় থেকে টোটো, অটো ও সাইকেল-রিকশা নিরন্তর চলে, সরাসরি গেটে নামিয়ে দেয়।',
      en: 'Totos, autos & cycle-rickshaws run continuously from the station and Durgachak More, with direct drops to the gate.',
    },
  },
]

const ROAD = [
  { icon: 'pin', c: { bn: 'এইচআইটি লিঙ্ক রোড থেকে বেরোনো একটি সেক্টর রোডের ঠিক পাশে — একটি প্রধান বাণিজ্যিক সড়ক।', en: 'Sits directly on a sector road off HIT Link Road — a main commercial arterial.' } },
  { icon: 'expand', c: { bn: 'সামনের রাস্তা ~১০–১২ মি (৩০–৪০ ফুট) চওড়া, বাজার মোড়ে আরও প্রশস্ত।', en: 'Frontage road ~10–12m (30–40ft) wide, widening further at the market junction.' } },
  { icon: 'gate', c: { bn: 'বড় স্বাগত গেট/তোরণ, কাঠামোগত হোর্ডিং ও পতাকাদণ্ডের জায়গা রয়েছে।', en: 'Room for large welcome gates/toran, structural hoardings & flag poles.' } },
  { icon: 'store', c: { bn: 'চওড়া প্রান্তরেখা — পথচারী বা জরুরি চলাচল আটকে না দিয়ে দু’পাশে ব্র্যান্ড কিয়স্ক বসানো যায়।', en: 'Wide margins allow double-sided brand kiosks without blocking pedestrian or emergency access.' } },
]

const PARKING = [
  { icon: 'bike', c: { bn: 'দু-চাকা ও চার-চাকার নিজস্ব পার্কিং — ব্যস্ততম দিনের ভিড়ের জন্য পর্যাপ্ত বলে নিশ্চিত।', en: 'Dedicated two-wheeler & four-wheeler parking confirmed adequate for peak-day crowds.' } },
  { icon: 'ambulance', c: { bn: 'জরুরি প্রবেশপথ — অ্যাম্বুলেন্স, ফায়ার রুট ও পুলিশ পয়েন্ট — নিশ্চিতভাবে রয়েছে।', en: 'Emergency access — ambulance, fire route & police point — confirmed in place.' } },
]

const SOCIAL = ['facebook', 'instagram', 'youtube']

// Contact page: hero, contact cards, "How to Reach", accessibility note, closing banner and the site footer.
// Everything is sized in `--u` (page width / 842, the mockup's width), so it scales as one piece on desktop
// and stacks on phones.
export default function Contact() {
  const rootRef = useRef(null)
  const pageRef = useRef(null)
  const navigate = useNavigate()
  const { lang, t } = useLanguage()

  useScrollPhase(rootRef, pageRef, { coverVar: '--cover3' })

  // build-in as each block scrolls into view
  useEffect(() => {
    const els = rootRef.current.querySelectorAll('.dp-ct__rv')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const goto = (e, link) => {
    e.preventDefault()
    const target = document.getElementById(link.id)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else navigate(link.to)
  }
  const rv = (i = 0) => ({ className: 'dp-ct__rv', style: { '--d': `${i * 90}ms` } })

  return (
    <section className="dp-ct" ref={rootRef}>
      {/* scroll target for the navbar's "Contact Us" link */}
      <span id="contact" className="dp-ct__anchor" aria-hidden="true" />
      <div className="dp-ct__page" ref={pageRef}>
        {/* ---- hero ---- */}
        <header className="dp-ct__hero">
          {/* the goddess inside an arched frame: three concentric arches (pale fill, thin gold line, the photo) with a lotus finial on top */}
          <div className="dp-ct__heroimg" aria-hidden="true">
            <span className="dp-ct__arch is-back" />
            <span className="dp-ct__arch is-line" />
            <Lotus className="dp-ct__lotus is-top" />
            <img className="dp-ct__archpic" src={hero} alt="" draggable="false" />
          </div>
          <div className="dp-ct__herotx">
            {lang === 'en' && (
              <p className="dp-ct__kicker dp-ct__rv" style={{ '--d': '0ms' }}>VISIT · CONNECT · BE A PART OF</p>
            )}
            <h2 className="dp-ct__h1 dp-ct__rv" style={{ '--d': '80ms' }}>{t({ bn: 'যোগাযোগ', en: 'Contact Us' })}</h2>
            <p className="dp-ct__h2 dp-ct__rv" style={{ '--d': '160ms' }}>{t({ bn: 'আসুন, আমাদের মণ্ডপে এসে\nমা-কে দর্শন করে যান।', en: 'Get in Touch & Visit Us' })}</p>
            <p className="dp-ct__lead dp-ct__rv" style={{ '--d': '240ms' }}>
              {t({
                bn: 'হলদিয়া দুর্গোৎসব ২০২৬-এ আমন্ত্রণ —\nবিশ্বাস, সংস্কৃতি ও সম্প্রদায়ের এক উদযাপন।',
                en: 'Join us at Haldia Durgotsav 2026 —\na celebration of faith, culture and community.',
              })}
            </p>
            <span className="dp-ct__orn dp-ct__rv" style={{ '--d': '320ms' }} aria-hidden="true" />
          </div>
        </header>

        {/* ---- three cards ---- */}
        <div className="dp-ct__cards">
          <article {...rv(0)} className="dp-ct__rv dp-ct__card">
            <span className="dp-ct__badge"><Icon name="pin" /></span>
            <h3 className="dp-ct__ctitle">{t({ bn: 'ভেন্যু ও ঠিকানা', en: 'Venue & Address' })}</h3>
            <p className="dp-ct__addr">
              {t({
                bn: 'হলদিয়া দুর্গা উৎসব ময়দান,\nক্ষুদিরাম নগর\nথানা হলদিয়া · ডাকঘর হাতিবেড়িয়া\nপূর্ব মেদিনীপুর, পশ্চিমবঙ্গ — ৭২১৬৫৭',
                en: 'Haldia Durga Utsav Maidan,\nKhudiram Nagar\nP.S. Haldia  ·  P.O. Hatiberia\nPurba Medinipur, West Bengal — 721657',
              })}
            </p>
            <img className="dp-ct__venue" src={venue} alt={t({ bn: 'উৎসব প্রাঙ্গণের প্রবেশদ্বার', en: 'The festival gate at night' })} draggable="false" />
          </article>

          <article {...rv(1)} className="dp-ct__rv dp-ct__card">
            <span className="dp-ct__badge"><Icon name="phone" /></span>
            <h3 className="dp-ct__ctitle">{t({ bn: 'যোগাযোগের তথ্য', en: 'Contact Information' })}</h3>
            <ul className="dp-ct__info">
              <li>
                <Icon name="phone" />
                <span><a href="tel:+919876543210">+91 98765 43210</a><small>{t({ bn: '(কমিটি হেল্পলাইন)', en: '(Committee Helpline)' })}</small></span>
              </li>
              <li>
                <Icon name="mail" />
                <span><a href="mailto:haldiadurgotsav@gmail.com">haldiadurgotsav@gmail.com</a><small>{t({ bn: '(সাধারণ জিজ্ঞাসা)', en: '(General Inquiries)' })}</small></span>
              </li>
              <li className="dp-ct__info--solo">
                <Icon name="globe" />
                <span><b>www.haldiadurgotsav.com</b></span>
              </li>
            </ul>
            <div className="dp-ct__follow">
              <p>{t({ bn: 'আমাদের অনুসরণ করুন', en: 'Follow Us' })}</p>
              <div>
                {SOCIAL.map((s) => (
                  <a key={s} href="#" onClick={(e) => e.preventDefault()} aria-label={s}><Icon name={s} /></a>
                ))}
              </div>
            </div>
          </article>

          <article {...rv(2)} className="dp-ct__rv dp-ct__card">
            <span className="dp-ct__badge"><Icon name="map" /></span>
            <h3 className="dp-ct__ctitle">{t({ bn: 'অবস্থান মানচিত্র', en: 'Location Map' })}</h3>
            <a className="dp-ct__mapimg" href={MAPS_URL} target="_blank" rel="noreferrer" aria-label={t({ bn: 'গুগল ম্যাপে দেখুন', en: 'View on Google Maps' })}>
              <img src={map} alt="" draggable="false" />
            </a>
            <a className="dp-ct__btn" href={MAPS_URL} target="_blank" rel="noreferrer">
              <span>{t({ bn: 'গুগল ম্যাপে দেখুন', en: 'View on Google Maps' })}</span>
              <Icon name="external" />
            </a>
          </article>
        </div>

        {/* ---- how to reach ---- */}
        <div className="dp-ct__reachwrap">
          <p className="dp-ct__kicker2 dp-ct__rv">{t({ bn: 'ভ্রমণ নির্দেশিকা', en: 'TRAVEL GUIDE' })}</p>
          <h3 className="dp-ct__reach dp-ct__rv" style={{ '--d': '80ms' }}>{t({ bn: 'কীভাবে পৌঁছবেন', en: 'How to Reach' })}</h3>
          <span className="dp-ct__orn dp-ct__rv" style={{ '--d': '160ms' }} aria-hidden="true" />
          <div className="dp-ct__cols">
            <div {...rv(0)} className="dp-ct__rv dp-ct__col">
              <span className="dp-ct__cbadge"><Icon name="bus" /></span>
              <h4>{t({ bn: 'গণপরিবহন', en: 'Public Transport' })}</h4>
              {TRANSPORT.map((r) => (
                <div className="dp-ct__item" key={r.icon}>
                  <Icon name={r.icon} />
                  <p><b>{t(r.h)}</b>{t(r.c)}</p>
                </div>
              ))}
            </div>
            <div {...rv(1)} className="dp-ct__rv dp-ct__col">
              <span className="dp-ct__cbadge"><Icon name="road" /></span>
              <h4>{t({ bn: 'রাস্তা ও ব্র্যান্ডিং ফ্রন্টেজ', en: 'Road & Branding Frontage' })}</h4>
              {ROAD.map((r) => (
                <div className="dp-ct__item is-mid" key={r.icon}>
                  <Icon name={r.icon} />
                  <p>{t(r.c)}</p>
                </div>
              ))}
            </div>
            <div {...rv(2)} className="dp-ct__rv dp-ct__col">
              <span className="dp-ct__cbadge is-p">P</span>
              <h4>{t({ bn: 'পার্কিং ও জরুরি প্রবেশপথ', en: 'Parking & Emergency Access' })}</h4>
              {PARKING.map((r) => (
                <div className="dp-ct__item is-mid" key={r.icon}>
                  <Icon name={r.icon} />
                  <p>{t(r.c)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- accessibility ---- */}
        <div className="dp-ct__access dp-ct__rv">
          <span className="dp-ct__cbadge"><Icon name="wheelchair" /></span>
          <h4>{t({ bn: 'অ্যাক্সেসিবিলিটি ও সবার জন্য প্রবেশ', en: 'Accessibility & Inclusive Entry' })}</h4>
          <p>
            {t({
              bn: 'প্রবীণ ও ভিন্নভাবে সক্ষম দর্শনার্থীদের জন্য র‍্যাম্প ও ভিড়-নিয়ন্ত্রণ পরিকল্পনা বাস্তবায়িত হচ্ছে।',
              en: 'Ramps and crowd-flow plans for elderly and differently-abled visitors are being implemented.',
            })}
          </p>
        </div>

        {/* ---- closing banner ---- */}
        <div className="dp-ct__banner">
          <img src={banner} alt="" draggable="false" />
          <div className="dp-ct__bantx">
            <h3 className="dp-ct__rv">{t({ bn: 'দেখা হবে\nহলদিয়া দুর্গোৎসব ২০২৬-এ', en: 'See You at\nHaldia Durgotsav 2026' })}</h3>
            <p className="dp-ct__rv" style={{ '--d': '90ms' }}>{t({ bn: 'ভক্তি, সংস্কৃতি ও\nসম্প্রদায়ের উদযাপন।', en: 'Celebrating devotion,\nculture and community.' })}</p>
            <span className="dp-ct__orn dp-ct__rv" style={{ '--d': '160ms' }} aria-hidden="true" />
            <a className="dp-ct__join dp-ct__rv" style={{ '--d': '220ms' }} href="/about" onClick={(e) => goto(e, FOOT_LINKS[0])}>
              <span>{t({ bn: 'উৎসবে যোগ দিন', en: 'Join the Celebration' })}</span>
              <Icon name="arrow" />
            </a>
          </div>
        </div>

        {/* ---- footer ---- */}
        <footer className="dp-ct__foot">
          <a className="dp-ct__fbrand" href="/home" onClick={(e) => { e.preventDefault(); navigate('/home') }} aria-label="Haldia Durgotsav 2026">
            <Lotus className="dp-ct__flotus" />
            <span>
              <b>HALDIA DURGOTSAV</b>
              <i>2026</i>
              <small>{t({ bn: 'বিশ্বাস, সংস্কৃতি ও সম্প্রদায়ের উদযাপন', en: 'A Celebration of Faith, Culture and Community' })}</small>
            </span>
          </a>
          <nav className="dp-ct__flinks" aria-label={t({ bn: 'ফুটার মেনু', en: 'Footer menu' })}>
            {FOOT_LINKS.map((l) => (
              <a key={l.id} href={l.to} onClick={(e) => goto(e, l)}>{t(l.label)}</a>
            ))}
          </nav>
          <div className="dp-ct__ffollow">
            <p>{t({ bn: 'অনুসরণ করুন', en: 'Follow Us' })}</p>
            <div>
              {SOCIAL.map((s) => (
                <a key={s} href="#" onClick={(e) => e.preventDefault()} aria-label={s}><Icon name={s} /></a>
              ))}
            </div>
          </div>
          <p className="dp-ct__copy">
            {t({ bn: '© ২০২৬ হলদিয়া দুর্গোৎসব কমিটি।\nসর্বস্বত্ব সংরক্ষিত।', en: '© 2026 Haldia Durgotsav Committee.\nAll rights reserved.' })}
          </p>
        </footer>
      </div>
    </section>
  )
}
