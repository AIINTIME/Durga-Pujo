import { useEffect, useLayoutEffect, useRef } from 'react'
import { createScrollVideoScene } from './home/scrollVideo.js'
import About from './About.jsx'
import Glance from './Glance.jsx'
import Culture from './Culture.jsx'
import Schedule from './Schedule.jsx'
import Pushpanjali from './Pushpanjali.jsx'
import Craft from './Craft.jsx'
import Theme from './Theme.jsx'
import Concept from './Concept.jsx'
import ArtistYear from './ArtistYear.jsx'
import Recognition from './Recognition.jsx'
import Gallery from './Gallery.jsx'
import Contact from './Contact.jsx'
import { useLanguage } from '../i18n/context.js'
import './home/Home.css'

// H.264 MP4 first (plays on every iPhone, with a keyframe every half second so scrubbing stays quick), WebM as the fallback
const VIDEO_BASE = encodeURI(window.matchMedia('(max-width: 820px)').matches ? '/Video/Pandal Mobile' : '/Video/Pandal')

export default function Home() {
  const trackRef = useRef(null)
  const videoRef = useRef(null)
  const holdRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    // on desktop the last screen of the track is the curtain: About slides up over the finished video
    const reserve = window.matchMedia('(min-width: 821px)').matches ? 1 : 0
    const scene = createScrollVideoScene(trackRef.current, videoRef.current, {
      reserve,
      onProgress: (p) => trackRef.current?.classList.toggle('is-scrolled', p > 0.02),
    })
    // iPhone Safari does not fetch a video until it has been played once: prime it so scrolling can show frames
    const v = videoRef.current
    v.play().then(() => v.pause()).catch(() => {})
    return () => scene.dispose()
  }, [])

  // no navbar over the scroll video; it slides in when the About section starts
  useLayoutEffect(() => {
    const hold = holdRef.current
    const cls = document.body.classList
    const home = hold.parentElement
    const wide = window.matchMedia('(min-width: 821px)')
    const about = hold.lastElementChild
    const update = () => {
      const top = hold.getBoundingClientRect().top
      const vh = window.innerHeight
      // desktop: About opens with one pinned screen where it fades in over the finished video (0 -> 1 = --vid);
      // phones: it simply scrolls in below the video
      const v = wide.matches ? Math.min(1, Math.max(0, -top / vh)) : top > vh * 0.55 ? 0 : 1
      cls.toggle('dp-nav-off', v < 0.45)
      home.style.setProperty('--vid', v.toFixed(4))
      // its entrance plays once the fade is under way, so it is not spent while About is still invisible
      if (v > 0.3) about.classList.add('is-in')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      cls.remove('dp-nav-off')
    }
  }, [])

  // the pinned About needs its exact height to hold with its bottom edge on the viewport bottom
  useEffect(() => {
    const hold = holdRef.current
    const about = hold.lastElementChild
    const ro = new ResizeObserver(() => hold.style.setProperty('--about-h', `${about.offsetHeight}px`))
    ro.observe(about)
    return () => ro.disconnect()
  }, [])

  return (
    <>
      <main className="dp-home">
        <section className="dp-scrollvideo" ref={trackRef}>
          <div className="dp-scrollvideo__pin">
            <video
              ref={videoRef}
              className="dp-scrollvideo__video"
              muted
              playsInline
              preload="auto"
              aria-label={t({ bn: 'দুর্গা পূজা', en: 'Durga Puja' })}
            >
              <source src={`${VIDEO_BASE}.mp4`} type="video/mp4" />
              <source src={`${VIDEO_BASE}.webm`} type="video/webm" />
            </video>
            <span className="dp-scrollvideo__hint" aria-hidden="true">
              {t({ bn: 'স্ক্রল করুন', en: 'Scroll' })}
            </span>
          </div>
        </section>
        {/* the navbar scrolls here: the hold is not sticky, so its position is stable (the About inside it is) */}
        <div className="dp-about-hold" ref={holdRef}>
          <span id="about" className="dp-about-hold__anchor" aria-hidden="true" />
          <About embedded />
        </div>
        <Glance />
        <Culture />
        <Schedule />
        <Pushpanjali />
        {/* "The Artist Behind This Year's Look" page is switched off: Artist.jsx stays in the repo, re-add <Artist /> here
            (plus its import, and set Craft's coverVar back to '--cover0') to bring it back */}
        <Craft />
        <Theme />
        <Concept />
        <ArtistYear />
        <Recognition />
        {/* Organising Committee page is switched off: Committee.jsx stays in the repo, re-add <Committee /> here
            (and its route in App.jsx / link in Navbar.jsx) to bring it back */}
        <Gallery />
        <Contact />
      </main>
    </>
  )
}
