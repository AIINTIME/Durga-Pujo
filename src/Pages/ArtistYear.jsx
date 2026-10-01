import { useEffect, useRef } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import bg from '../assets/artistYear/bg.webp'
import portrait from '../assets/artistYear/portrait.webp'
import inset from '../assets/artistYear/inset.webp'
import './artistYear/ArtistYear.css'

// Pinned, scroll-scrubbed section laid out on the widened 1862 x 1026 artwork: the heading and both paragraphs build in over the portrait.
export default function ArtistYear() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1862, artH: 1026, diyas: [], band: 0.1 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover6', hold: true })

  const ph = (s, l) => ({ '--s': s, '--l': l })
  const ux = (v) => `calc(${v} * var(--ux))`
  const uy = (v) => `calc(${v} * var(--uy))`

  return (
    <section className="dp-ay" ref={trackRef}>
      {/* scroll target for the navbar's "Artist" link: the point where everything has built */}
      <span id="artist" aria-hidden="true" style={{ position: 'absolute', left: 0, top: '220vh', width: 1, height: 1 }} />
      <div className="dp-ay__pin">
        <img className="dp-ay__backdrop" src={bg} alt="" draggable="false" aria-hidden="true" />
        <div className="dp-ay__frame" ref={frameRef}>
          <img className="dp-ay__bg" src={bg} alt="" draggable="false" />

          <h2 className="dp-ay__head">
            <span className="dp-ay__kick dp-ph" style={{ ...ph(0.03, 0.1), left: ux(1369), top: uy(108) }}>
              {t({ bn: 'এ বছরের রূপের নেপথ্য শিল্পী', en: 'The Artist Behind This Year’s Look' })}
            </span>
            <span className="dp-ay__name dp-ph" style={{ ...ph(0.08, 0.14), left: ux(1398), top: uy(178) }}>
              {t({ bn: 'অভিজিৎ ঘটক', en: 'Avijit Ghatak' })}
            </span>
          </h2>

          <img className="dp-ay__pic is-portrait" src={portrait} alt={t({ bn: 'শিল্পী অভিজিৎ ঘটক', en: 'Artist Avijit Ghatak' })} draggable="false" />

          <div className="dp-ay__text" style={{ left: ux(860), top: uy(264), width: ux(900) }}>
            {/* keeps the story clear of the picture box in the bottom right */}
            <span className="dp-ay__shim" aria-hidden="true" />
            <p className="dp-ay__p dp-ph" style={{ ...ph(0.2, 0.2),  }}>
              {t({
                bn: 'অভিজিৎ ঘটক একজন শিক্ষাগতভাবে প্রশিক্ষিত শিল্পী, যিনি ২০১৪ সালে জামশেদপুরের টাটানগরে পিয়ারা সিং ধুরন্ধর মেমোরিয়াল ক্লাবের সহযোগিতায় দুর্গাপূজার পাবলিক আর্ট ইনস্টলেশন প্রকল্পের মাধ্যমে তাঁর যাত্রা শুরু করেন। তারপর এক দশক পেরিয়ে গেছে, এই সময়ে তিনি কলকাতার দুর্গাপূজার শিল্পী-সমাজে নিজের একটি পরিচয় গড়ে তুলেছেন। বছরের পর বছর, স্থান-নির্মাণ ও উপকরণ-অন্বেষণে অভিজিতের উদ্ভাবনী দৃষ্টিভঙ্গি সহকর্মী ও সাধারণ মানুষের কাছ থেকে সমালোচকদের প্রশংসা অর্জন করেছে।',
                en: 'Avijit Ghatak is an academically trained artist who embarked on his journey of Durga Puja public art installation project in 2014 in collaboration with Pyara Singh Dhurandar Memorial Club in Tatanagar, Jamshedpur. Since then, a decade has passed where he had established a name for himself within Kolkata’s Durga Puja art fraternity. Over the years, Avijit’s innovative approach to space-making and material exploration has earned him critical appraisal from his peers and the public.',
              })}
            </p>
            <p className="dp-ay__p dp-ph" style={{ ...ph(0.42, 0.22),  }}>
              {t({
                bn: 'আলিপুর ৭৮ পল্লী (২০২৪, ২০২১); সন্তোষপুর লেক পল্লী (২০২৪, ২০২০); কাঁকুড়গাছি যুবক সংঘ (২০২৩); সল্টলেক এই ই পার্ট ১; তেলেঙ্গাবাগান সর্বজনীন; নলিন সরকার স্ট্রিট; বেহালা দেবদারু ফটক; শ্যামাগি পল্লী শ্যামা সংঘ এবং আরও অনেকের সঙ্গে তাঁর সাম্প্রতিক সহযোগিতা তাঁর স্বতন্ত্র ব্যক্তিত্বকে প্রতিষ্ঠিত করেছে। একজন দৃশ্যশিল্প-অনুশীলনকারী হিসেবে অভিজিৎ স্বাধীন প্রকল্পের সঙ্গেও যুক্ত থেকেছেন, যা কমিউনিটি-ভিত্তিক শিল্পের বৃহত্তর আলোচনার মধ্যে নিজের অবস্থান খুঁজে নেয়। সম্প্রতি তিনি অধ্যাপক ছত্রপতি দত্তের সৃজনশীল সহযোগী হিসেবে বেঙ্গল বিয়েনেল ২০২৪-এর অংশ ছিলেন।',
                en: 'His recent collaborations with Alipore 78 Pally (2024, 2021); Santoshpur Lake Pally (2024, 2020); Kankurgachi Yubak Sangha (2023); Saltlake AE Part 1; Telengabagan Sarbajonin; Nalin Sarkar Street; Behala Debdaru Fatak; Shyamagi Pally Shyama Sangha and others have established his individualism. As a visual art practitioner, Avijit has also been engaged with independent projects that situates itself within the larger discourse of community-based art. He has recently been a part of Bengal Biennale 2024 as a creative associate to Prof. Chattrapati Dutta.',
              })}
              <br />
              {t({
                bn: 'তাঁর ইনস্টলেশন বেহালা আর্ট ফেস্ট (২০২০, ২০২১); বারুইপুর সিমলাবাদে টাইম অ্যান্ড স্পেস প্রকল্প (২০২০); এবং ঘোঘাট-এ ন্যারেটিভ মুভমেন্টের উদ্যোগেও প্রদর্শিত হয়েছে।',
                en: 'His installations were also part of Behala Art Fest (2020, 2021); Time and Space project at Baruipur Simlabad (2020); and at Narrative Movement’s initiative at Goghat.',
              })}
            </p>
          </div>

          <img className="dp-ay__pic is-inset" src={inset} alt="" draggable="false" />

          {/* Three.js overlay: drifting petals and gold dust */}
          <div className="dp-ay__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
