import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import bg from '../assets/artistYear/bg.webp'
import portrait from '../assets/artistYear/portrait.webp'
import award1 from '../assets/artistYear/award1.webp'
import award2 from '../assets/artistYear/award2.webp'
import award3 from '../assets/artistYear/award3.webp'
import award4 from '../assets/artistYear/award4.webp'
import award5 from '../assets/artistYear/award5.webp'
import award6 from '../assets/artistYear/award6.webp'
import award7 from '../assets/artistYear/award7.webp'
import award8 from '../assets/artistYear/award8.webp'
import award9 from '../assets/artistYear/award9.webp'
import './artistYear/ArtistYear.css'

// The award plaques are part of the artwork on desktop; on phones the artwork is hidden, so they are shown as a grid of these crops.
const AWARDS = [
  [award1, 'Asian Paints Sharad Samman — Reached Top 12'],
  [award2, 'Sangbad Pratidin Sarad Samman'],
  [award3, 'Anandabazaar Sarod Arghya'],
  [award4, 'Zee 24 Ghanta'],
  [award5, 'The Telegraph — CESC truespirit'],
  [award6, 'Incoda TV'],
  [award7, 'Serum'],
  [award8, 'Kolkata Sera 15 Sarad Samman'],
  [award9, 'Radio Mirchi'],
]

// Pinned, scroll-scrubbed section laid out on the 1733 x 907 artwork: the heading, the story and the awards note build in around the portrait.
export default function ArtistYear() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1733, artH: 907, diyas: [], band: 0.1 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover8', hold: true })

  const ph = (s, l) => ({ '--s': s, '--l': l })
  const ux = (v) => `calc(${v} * var(--ux))`
  const uy = (v) => `calc(${v} * var(--uy))`

  return (
    <section className="dp-ay" ref={trackRef}>
      {/* scroll target for the navbar's "Artist" link: the point where everything has built */}
      <span id="artist" aria-hidden="true" style={{ position: 'absolute', left: 0, top: '220vh', width: 1, height: 1 }} />
      <div className="dp-ay__pin">
        <img loading="lazy" decoding="async" className="dp-ay__backdrop" src={bg} alt="" draggable="false" aria-hidden="true" />
        <div className="dp-ay__frame" ref={frameRef}>
          <img loading="lazy" decoding="async" className="dp-ay__bg" src={bg} alt="" draggable="false" />

          <h2 className="dp-ay__head">
            <span className="dp-ay__kick dp-ph" style={{ ...ph(0.03, 0.1), left: ux(884), top: uy(111) }}>
              {t({ bn: 'এ বছরের রূপের নেপথ্য শিল্পী', en: 'The Artist Behind This Year’s Look' })}
            </span>
            <span className="dp-ay__name dp-ph" style={{ ...ph(0.08, 0.14), left: ux(886), top: uy(170) }}>
              {t({ bn: 'অভিজিৎ ঘটক', en: 'Avijit Ghatak' })}
            </span>
            <span className="dp-ay__tag dp-ph" style={{ ...ph(0.14, 0.1), left: ux(885), top: uy(223) }}>
              {t({ bn: 'শিল্পী · দূরদর্শী · গল্পকার', en: 'Artist · Visionary · Storyteller' })}
            </span>
          </h2>

          <img loading="lazy" decoding="async" className="dp-ay__pic is-portrait" src={portrait} alt={t({ bn: 'শিল্পী অভিজিৎ ঘটক', en: 'Artist Avijit Ghatak' })} draggable="false" />

          <div className="dp-ay__text" style={{ left: ux(636), top: uy(252), width: ux(514) }}>
            <p className="dp-ay__p dp-ph" style={ph(0.2, 0.2)}>
              {t({
                bn: 'অভিজিৎ ঘটক একজন শিক্ষাগতভাবে প্রশিক্ষিত শিল্পী, যিনি ২০১৪ সালে জামশেদপুরের টাটানগরে পিয়ারা সিং ধুরন্ধর মেমোরিয়াল ক্লাবের সহযোগিতায় দুর্গাপূজার পাবলিক আর্ট ইনস্টলেশন প্রকল্পের মাধ্যমে তাঁর যাত্রা শুরু করেন। তারপর এক দশক পেরিয়ে গেছে, এই সময়ে তিনি কলকাতার দুর্গাপূজার শিল্পী-সমাজে নিজের একটি পরিচয় গড়ে তুলেছেন। বছরের পর বছর, স্থান-নির্মাণ ও উপকরণ-অন্বেষণে অভিজিতের উদ্ভাবনী দৃষ্টিভঙ্গি সহকর্মী ও সাধারণ মানুষের কাছ থেকে সমালোচকদের প্রশংসা অর্জন করেছে।',
                en: 'Avijit Ghatak is an academically trained artist who embarked on his journey of Durga Puja public art installation project in 2014 in collaboration with Pyara Singh Dhurandar Memorial Club in Tatanagar, Jamshedpur. Since then, a decade has passed where he had established a name for himself within Kolkata’s Durga Puja art fraternity. Over the years, Avijit’s innovative approach to space-making and material exploration has earned him critical appraisal from his peers and the public.',
              })}
            </p>
            <p className="dp-ay__p dp-ph" style={ph(0.32, 0.2)}>
              {t({
                bn: 'আলিপুর ৭৮ পল্লী (২০২৪, ২০২১); সন্তোষপুর লেক পল্লী (২০২৪, ২০২০); কাঁকুড়গাছি যুবক সংঘ (২০২৩); সল্টলেক এই ই পার্ট ১; তেলেঙ্গাবাগান সর্বজনীন; নলিন সরকার স্ট্রিট; বেহালা দেবদারু ফটক; শ্যামাগি পল্লী শ্যামা সংঘ এবং আরও অনেকের সঙ্গে তাঁর সাম্প্রতিক সহযোগিতা তাঁর স্বতন্ত্র ব্যক্তিত্বকে প্রতিষ্ঠিত করেছে।',
                en: 'His recent collaborations with Alipore 78 Pally (2024, 2021); Santoshpur Lake Pally (2024, 2020); Kankurgachi Yubak Sangha (2023); Saltlake AE Part 1; Telengabagan Sarbajonin; Nalin Sarkar Street; Behala Debdaru Fatak; Shyamagi Pally Shyama Sangha and others have established his individualism.',
              })}
            </p>
            <p className="dp-ay__p dp-ph" style={ph(0.44, 0.22)}>
              {t({
                bn: 'একজন দৃশ্যশিল্প-অনুশীলনকারী হিসেবে অভিজিৎ স্বাধীন প্রকল্পের সঙ্গেও যুক্ত থেকেছেন, যা কমিউনিটি-ভিত্তিক শিল্পের বৃহত্তর আলোচনার মধ্যে নিজের অবস্থান খুঁজে নেয়। সম্প্রতি তিনি অধ্যাপক ছত্রপতি দত্তের সৃজনশীল সহযোগী হিসেবে বেঙ্গল বিয়েনেল ২০২৪-এর অংশ ছিলেন। তাঁর ইনস্টলেশন বেহালা আর্ট ফেস্ট (২০২০, ২০২১); বারুইপুর সিমলাবাদে টাইম অ্যান্ড স্পেস প্রকল্প (২০২০); এবং ঘোঘাট-এ ন্যারেটিভ মুভমেন্টের উদ্যোগেও প্রদর্শিত হয়েছে।',
                en: 'As a visual art practitioner, Avijit has also been engaged with independent projects that situates itself within the larger discourse of community-based art. He has recently been a part of Bengal Biennale 2024 as a creative associate to Prof. Chattrapati Dutta. His installations were also part of Behala Art Fest (2020, 2021); Time and Space project at Baruipur Simlabad (2020); and at Narrative Movement’s initiative at Goghat.',
              })}
            </p>
          </div>

          {/* heading on the red banner above the award plaques (the plaques themselves are in the artwork) */}
          <div className="dp-ay__awards dp-ph" style={{ ...ph(0.56, 0.16), left: ux(1432), top: uy(88) }}>
            <h3>{t({ bn: 'পুরস্কার ও স্বীকৃতি', en: 'Awards & Recognitions' })}</h3>
            <p>
              {t({ bn: 'দুর্গাপূজার শিল্পে তাঁর সৃজনশীল দৃষ্টিভঙ্গি ও অবদানের জন্য', en: 'Honoured for his creative ' })}
              <em>{t({ bn: '', en: 'vision and' })}</em>
              {t({ bn: '', en: ' contribution' })}{' '}
              <br />
              {t({ bn: 'বছরের পর বছর সম্মানিত', en: 'to Durga Puja art through the years' })}
            </p>
          </div>

          <ul className="dp-ay__plaques">
            {AWARDS.map(([src, name]) => (
              <li key={name}>
                <img src={src} alt={name} draggable="false" loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>

          {/* Three.js overlay: drifting petals and gold dust */}
          <div className="dp-ay__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
