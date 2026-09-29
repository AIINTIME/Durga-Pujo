import { useEffect, useRef } from 'react'
import { createScrollVideoScene } from './home/scrollVideo.js'
import About from './About.jsx'
import Recognition from './Recognition.jsx'
import Committee from './Committee.jsx'
import Gallery from './Gallery.jsx'
import Contact from './Contact.jsx'
import { useLanguage } from '../i18n/context.js'
import './home/Home.css'

const VIDEO_SRC = encodeURI('/Video/Durga Puja.mp4')

export default function Home() {
  const trackRef = useRef(null)
  const videoRef = useRef(null)
  const holdRef = useRef(null)
  const { t } = useLanguage()

  useEffect(() => {
    const scene = createScrollVideoScene(trackRef.current, videoRef.current, {
      onProgress: (p) => trackRef.current?.classList.toggle('is-scrolled', p > 0.02),
    })
    return () => scene.dispose()
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
    <main className="dp-home">
      <section className="dp-scrollvideo" ref={trackRef}>
        <div className="dp-scrollvideo__pin">
          <video
            ref={videoRef}
            className="dp-scrollvideo__video"
            src={VIDEO_SRC}
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
      <div className="dp-about-hold" ref={holdRef}>
        <About embedded />
      </div>
      <Recognition />
      <Committee />
      <Gallery />
      <Contact />
    </main>
  )
}
