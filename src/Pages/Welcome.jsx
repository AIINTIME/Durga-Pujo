import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWelcomeScene } from './welcome/scene.js'
import { useTransitionLayer } from '../components/transition/context.js'
import { useLanguage } from '../i18n/context.js'
import btnEn from '../assets/welcome/btn.webp'
import btnEnMask from '../assets/welcome/btnMask.webp'
import btnBn from '../assets/welcome/bn/btn.webp'
import btnBnMask from '../assets/welcome/bn/btnMask.webp'
import './welcome/Welcome.css'

// silent intro: H.264 MP4 first (every iPhone), WebM as the fallback
const VIDEO_BASE = encodeURI(window.matchMedia('(max-width: 760px)').matches ? '/Video/Welcome Mobile' : '/Video/Welcome')

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
  const [videoReady, setVideoReady] = useState(false)
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const assetsReady = ready && videoReady
  const navigate = useNavigate()
  const transition = useTransitionLayer()
  const { lang, t } = useLanguage()
  const langRef = useRef(lang)

  useEffect(() => {
    // if the 3D layer is slow or cannot start (some phones), show the page anyway after a few seconds
    const watchdog = setTimeout(() => setReady(true), 8000)
    const scene = createWelcomeScene(stageRef.current, {
      buttonEl: btnRef.current,
      lang: langRef.current,
      onReady: () => setReady(true),
      overlay: true,
    })
    sceneRef.current = scene
    return () => {
      clearTimeout(watchdog)
      scene.dispose()
    }
  }, [])

  // The video counts as loaded once it can play. iPhone Safari does not pre-load video (it only fetches after play()),
  // so "can play through" may never fire there: settle for the first frame being ready, and never wait more than a few seconds.
  useEffect(() => {
    const v = videoRef.current
    const done = () => setVideoReady(true)
    // a browser that can play neither MP4 nor WebM skips ahead (play() then fails and the title shows) instead of loading forever
    const wait = v.canPlayType('video/mp4') || v.canPlayType('video/webm') ? 5000 : 0
    const evs = ['canplaythrough', 'canplay', 'loadeddata']
    evs.forEach((e) => v.addEventListener(e, done))
    const timer = setTimeout(done, v.readyState >= 2 ? 0 : wait)
    return () => {
      evs.forEach((e) => v.removeEventListener(e, done))
      clearTimeout(timer)
    }
  }, [])

  // once everything is loaded the (silent) intro video plays from the start; the Background Music is separate
  useEffect(() => {
    if (!assetsReady) return
    const v = videoRef.current
    v.muted = true
    v.play().then(
      () => setStarted(true),
      () => {
        setStarted(true)
        setEnded(true) // no autoplay at all: go straight to the title + button
      },
    )
  }, [assetsReady])

  // once the video has ended the title reveals and the ENTER button fades in,
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
    let gone = false
    const go = () => {
      if (gone) return
      gone = true
      navigate('/home')
    }
    sceneRef.current?.enter(go)
    setTimeout(go, 3500) // never get stuck here if the 3D scene could not run
  }

  return (
    <main className={`dp-welcome ${started ? 'is-ready' : ''} ${ended && ready ? 'is-ended' : ''} ${leaving ? 'is-leaving' : ''}`}>
      <h1 className="dp-sr-only">{t({ bn: 'নব রূপে নব দুর্গা — দুর্গাপূজা ২০২৬', en: 'Naba Rupe Naba Shakti — Durga Pooja 2026' })}</h1>
      <video
        ref={videoRef}
        className="dp-welcome__video"
        playsInline
        muted
        preload="auto"
        onEnded={() => setEnded(true)}
        aria-hidden="true"
      >
        <source src={`${VIDEO_BASE}.mp4`} type="video/mp4" />
        <source
          src={`${VIDEO_BASE}.webm`}
          type="video/webm"
          onError={() => {
            // no playable video: go straight to the title + button
            setStarted(true)
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
        <span className="dp-loader__spinner" />
      </div>
    </main>
  )
}
