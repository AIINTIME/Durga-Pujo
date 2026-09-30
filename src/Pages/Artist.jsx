import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import bg from '../assets/artist/bg.webp'
import photoL from '../assets/artist/photoL.webp'
import photoR from '../assets/artist/photoR.webp'
import box from '../assets/artist/box.webp'
import './artist/Artist.css'

const TOP = 62 // the mockup's own top strip (hidden under the real navbar)

// flame centres in the 1584 x 931 artwork: x, y, scale
const DIYAS = [
  [42, 636, 0.95],
  [1524, 621, 0.95],
]

// Pinned, scroll-scrubbed section: title, both pictures, the story and the sponsor note build up in turn.
export default function Artist() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1584, artH: 931, diyas: DIYAS, band: 0.1 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover1', hold: true })

  const ph = (s, l) => ({ '--s': s, '--l': l })
  const ux = (v) => `calc(${v} * var(--ux))`
  const uy = (v) => `calc(${v} * var(--uy))`
  const at = (x, y, w, extra = {}) => ({ left: ux(x), top: uy(y - TOP), ...(w ? { width: ux(w) } : {}), ...extra })

  return (
    <section className="dp-ar" ref={trackRef}>
      {/* scroll target for the navbar's "Artist" link: the point where everything has built */}
      <span id="artist" aria-hidden="true" style={{ position: 'absolute', left: 0, top: '220vh', width: 1, height: 1 }} />
      <div className="dp-ar__pin">
        <div className="dp-ar__frame" ref={frameRef}>
          <img className="dp-ar__bg" src={bg} alt="" draggable="false" />

          <h2 className="dp-ar__h1 dp-ph" style={{ ...ph(0.02, 0.12), ...at(184, 108, 1216) }}>
            {t({ bn: 'এ বছরের রূপের নেপথ্য শিল্পী', en: 'The Artist Behind This Year’s Look' })}
          </h2>
          <p className="dp-ar__h2 dp-ph" style={{ ...ph(0.07, 0.1), ...at(292, 186.5, 1000) }}>
            {t({
              bn: 'হলদিয়া দুর্গোৎসব ২০২৬-কে রূপ দেওয়া দৃষ্টিভঙ্গি, গল্প ও সৃজনশীল মন',
              en: 'The vision, the stories and the creative mind shaping Haldia Durgotsav 2026',
            })}
          </p>

          {/* plain paper under the pictures / note, so no empty frames show before they build in */}
          <span className="dp-ar__patch" style={{ left: ux(188), top: uy(222 - TOP), width: ux(726), height: uy(448) }} aria-hidden="true" />
          <span className="dp-ar__patch" style={{ left: ux(925), top: uy(222 - TOP), width: ux(415), height: uy(448) }} aria-hidden="true" />
          <span className="dp-ar__patch" style={{ left: ux(836), top: uy(736 - TOP), width: ux(654), height: uy(220) }} aria-hidden="true" />

          <figure className="dp-ar__pic is-l dp-ph" style={{ ...ph(0.12, 0.2), left: ux(190), top: uy(224 - TOP), width: ux(722), height: uy(444) }}>
            <img src={photoL} alt={t({ bn: 'অভিজিৎ ঘটক আলোচনায়', en: 'Avijit Ghatak in concept discussions' })} draggable="false" />
          </figure>
          <figure className="dp-ar__pic is-r dp-ph" style={{ ...ph(0.22, 0.2), left: ux(927), top: uy(224 - TOP), width: ux(411), height: uy(444) }}>
            <img src={photoR} alt={t({ bn: '“শঙ্কর নামা”-র পোস্টার', en: '“শঙ্কর নামা” (Shankar Nama) poster' })} draggable="false" />
          </figure>

          <p className="dp-ar__cap is-l dp-ph" style={{ ...ph(0.34, 0.1), ...at(273, 691, 560) }}>
            {t({ bn: 'এ বছরের কাজের ভাবনা নিয়ে আলোচনায় অভিজিৎ ঘটক', en: 'Avijit Ghatak, in concept discussions for this year’s work' })}
          </p>
          <p className="dp-ar__cap is-r dp-ph" style={{ ...ph(0.4, 0.1), ...at(928, 693.5, 400) }}>
            {t({
              bn: '“শঙ্কর নামা” — জগৎ মুখার্জি পার্কের জন্য তাঁর দুর্গোৎসব ২০২৬-এর ভাবনা',
              en: '“শঙ্কর নামা” (Shankar Nama) — his Durgotsav 2026 concept for Jagat Mukherjee Park',
            })}
          </p>

          <div className="dp-ar__story" style={at(143, 726, 660)}>
          <p className="dp-ar__p dp-ph" style={ph(0.46, 0.12)}>
            {t({
              bn: 'গত দুই পাতার প্রতিটি ছবি — প্যান্ডেল, আলোকিত প্রবেশপথ, যে ভিড় তা টেনে আনে — সবকিছুর পেছনে একটি নাম আছে। অভিজিৎ ঘটক কলকাতার একজন থিম শিল্পী, যাঁর কাজ শহরের পূজা-চক্রে ঠিক এই কারণেই পরিচিত: সাধারণ, এমনকি ফেলে দেওয়া উপকরণকে এমন কিছুতে রূপ দেওয়া যার সামনে মানুষ থমকে দাঁড়ায়। সন্তোষপুর লেক পল্লীর ',
              en: 'Every image on the last two pages — the pandal, the lit approach, the crowd it pulls — has a name behind it. Avijit Ghatak is a Kolkata theme artist whose work is known across the city’s Puja circuit for exactly this: taking ordinary, even discarded, material and turning it into something people stop walking to look at. It’s the same hand behind ',
            })}
            <i>{t({ bn: '“চলচ্চিত্র: অজন্তার প্রতি শ্রদ্ধা”', en: '“Chalchitra: A Tribute to Ajanta”' })}</i>
            {t({ bn: '-র পেছনেও একই হাত।', en: ' at Santoshpur Lake Pally.' })}
          </p>
          <p className="dp-ar__p dp-ph" style={ph(0.54, 0.12)}>
            {t({
              bn: 'এই মরসুমে তিনি একসঙ্গে দুটি বড় প্রকল্প সামলাচ্ছেন — জগৎ মুখার্জি পার্কে ১ নং ওয়ার্ডের সাধারণ দুর্গোৎসবের জন্য “শঙ্কর নামা”, এবং অহিরীটোলা সার্বজনীন শারদোৎসবের ৫৬তম বর্ষের ঐতিহাসিক আয়োজনে শিল্প নির্দেশক হিসেবে “শেষ বেলায়”।',
              en: 'This season he’s running two large productions at once — “শঙ্কর নামা” (Shankar Nama) for Ward No. 1’s Sadharan Durgotsav at Jagat Mukherjee Park, and “শেষ বেলায়” (Shesh Belay) as art director for Ahiritola Sarbojanin Sharodotsav’s landmark 56th year.',
            })}
          </p>
          </div>

          <div className="dp-ar__box dp-ph" style={{ ...ph(0.62, 0.2), left: ux(838), top: uy(738 - TOP), width: ux(650), height: uy(216) }}>
            <img src={box} alt="" draggable="false" />
            <h3 className="dp-ar__why" style={{ left: ux(947 - 838), top: uy(787 - 738) }}>
              {t({ bn: 'স্পনসরের জন্য কেন গুরুত্বপূর্ণ', en: 'Why this matters for a sponsor' })}
            </h3>
            <p className="dp-ar__body" style={{ left: ux(879 - 838), top: uy(834 - 738), width: ux(585) }}>
              {t({
                bn: 'একটি পূজার সঙ্গে স্বীকৃত শিল্পীর নাম নিজেই একটি প্রচার — শিল্প-জগতে বিশ্বাসযোগ্যতা, গণমাধ্যমের নজর, এবং স্পনসরের ব্র্যান্ডিংয়ের পাশে দাঁড়াতে পারে এমন জোরালো সৃজনশীল দিশা। এমন অর্জিত প্রচার একটি সাধারণ প্যান্ডেল পায় না।',
                en: 'A recognised artist’s name on a Puja is its own piece of press — art-circuit credibility, media pickup, and a creative direction strong enough to stand next to a sponsor’s branding rather than get lost behind it. That’s earned media a generic pandal doesn’t get.',
              })}
            </p>
          </div>

          {/* Three.js overlay: petals, dust, flickering diya flames */}
          <div className="dp-ar__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
