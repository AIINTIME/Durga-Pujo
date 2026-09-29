import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWelcomeScene } from './welcome/scene.js'
import { useTransitionLayer } from '../components/transition/context.js'
import { useMusic } from '../components/music/context.js'
import { useLanguage } from '../i18n/context.js'
import btnEn from '../assets/welcome/btn.webp'
import btnEnMask from '../assets/welcome/btnMask.webp'
import btnBn from '../assets/welcome/bn/btn.webp'
import btnBnMask from '../assets/welcome/bn/btnMask.webp'
import './welcome/Welcome.css'

const VIDEO_WEBM = '/Video/Welcome.webm'
const VIDEO_MP4 = '/Video/Welcome.mp4'

const BUTTONS = {
  en: { src: btnEn, mask: btnEnMask },
  bn: { src: btnBn, mask: btnBnMask },
}

export default function Welcome() {
  const stageRef = useRef(null)
  const btnRef = useRef(null)
  const videoRef = useRef(null)
  const sceneRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const navigate = useNavigate()
  const transition = useTransitionLayer()
  const music = useMusic()
  const { lang, t } = useLanguage()
  const langRef = useRef(lang)

  useEffect(() => {
    const scene = createWelcomeScene(stageRef.current, {
      buttonEl: btnRef.current,
      lang: langRef.current,
      onReady: () => setReady(true),
      overlay: true,
    })
    sceneRef.current = scene
    return () => scene.dispose()
  }, [])

  // play the whole video on arrival (with sound if the browser allows it, otherwise muted)
  useEffect(() => {
    const v = videoRef.current
    v.muted = false
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => setEnded(true)) // no autoplay at all: go straight to the title + button
    })
  }, [])

  // once the video has ended the title reveals and the ENTER button fades in
  useEffect(() => {
    if (ended && ready) sceneRef.current?.play()
  }, [ended, ready])

  // crossfade the 3D title when the EN / BN toggle changes
  useEffect(() => {
    langRef.current = lang
    sceneRef.current?.setLang(lang)
  }, [lang])

  const enter = () => {
    if (leaving) return
    setLeaving(true)
    transition.start() // particles that carry over into Home
    music.play() // start the background loop on this user gesture
    sceneRef.current?.enter(() => navigate('/home'))
  }

  return (
    <main className={`dp-welcome ${ready && playing ? 'is-ready' : ''} ${ended && ready ? 'is-ended' : ''} ${leaving ? 'is-leaving' : ''}`}>
      <h1 className="dp-sr-only">{t({ bn: 'নব রূপে নব দুর্গা — দুর্গাপূজা ২০২৬', en: 'Nobo Rupe Nobo Durga — Durga Pooja 2026' })}</h1>
      <video
        ref={videoRef}
        className="dp-welcome__video"
        playsInline
        preload="auto"
        onPlaying={() => setPlaying(true)}
        onEnded={() => setEnded(true)}
        aria-hidden="true"
      >
        <source src={VIDEO_WEBM} type="video/webm; codecs=vp9,opus" />
        <source
          src={VIDEO_MP4}
          type="video/mp4"
          onError={() => {
            setPlaying(true)
            setEnded(true)
          }}
        />
      </video>
      <div className="dp-stage" ref={stageRef} aria-hidden="true" />
      <button ref={btnRef} className="dp-enter" onClick={enter} aria-label={t({ bn: 'প্রবেশ করুন', en: 'Enter' })}>
        {Object.entries(BUTTONS).map(([key, b]) => (
          <span key={key} className={`dp-enter__art ${lang === key ? 'is-active' : ''}`}>
            <img src={b.src} alt="" draggable="false" />
            <span
              className="dp-enter__sheen"
              style={{ WebkitMaskImage: `url(${b.mask})`, maskImage: `url(${b.mask})` }}
            />
          </span>
        ))}
      </button>
      <div className="dp-loader" aria-hidden="true">
        <span />
      </div>
    </main>
  )
}
