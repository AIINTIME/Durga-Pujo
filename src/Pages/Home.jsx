import { useEffect, useLayoutEffect, useRef } from 'react'
import { createScrollVideoScene } from './home/scrollVideo.js'
import About from './About.jsx'
import Glance from './Glance.jsx'
import Artist from './Artist.jsx'
import ArtistYear from './ArtistYear.jsx'
import Recognition from './Recognition.jsx'
import Gallery from './Gallery.jsx'
import Contact from './Contact.jsx'
import { useLanguage } from '../i18n/context.js'
import './home/Home.css'

const VIDEO_SRC = encodeURI('/Video/Ram.webm')
const VIDEO_SRC_MOBILE = encodeURI('/Video/Mobile Ram.webm')
const isMobile = () => window.matchMedia('(max-width: 820px)').matches

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
    return () => scene.dispose()
  }, [])

  // no navbar over the scroll video; it slides in when the About section starts
  useLayoutEffect(() => {
    const hold = holdRef.current
    const cls = document.body.classList
    const home = hold.parentElement
    const update = () => {
      const top = hold.getBoundingClientRect().top
      cls.toggle('dp-nav-off', top > window.innerHeight * 0.55)
      // 0 -> 1 while About slides up over the video: the video dims and settles back as it goes
      home.style.setProperty('--vid', Math.min(1, Math.max(0, 1 - top / window.innerHeight)).toFixed(4))
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
    const about = hold.firstElementChild
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
              src={isMobile() ? VIDEO_SRC_MOBILE : VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              aria-label={t({ bn: 'দুর্গা পূজা', en: 'Durga Puja' })}
            />
            <span className="dp-scrollvideo__hint" aria-hidden="true">
              {t({ bn: 'স্ক্রল করুন', en: 'Scroll' })}
            </span>
          </div>
        </section>
        {/* the navbar scrolls here: the hold is not sticky, so its position is stable (the About inside it is) */}
        <div id="about" className="dp-about-hold" ref={holdRef}>
          <About embedded />
        </div>
        <Glance />
        <Artist />
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
