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
import '../components/music/MusicToggle.css'
import './welcome/Welcome.css'

const VIDEO_WEBM = '/Video/Welcome.webm'
const VIDEO_WEBM_MOBILE = '/Video/Mobile Welcome.webm'
const isMobile = () => window.matchMedia('(max-width: 760px)').matches

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
  const [soundOn, setSoundOn] = useState(false)
  const [ended, setEnded] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const assetsReady = ready && videoReady
  const navigate = useNavigate()
  const transition = useTransitionLayer()
  const music = useMusic()
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
    // a browser that cannot play WebM at all skips ahead (play() then fails and the title shows) instead of loading forever
    const wait = v.canPlayType('video/webm; codecs="vp9,opus"') ? 5000 : 0
    const evs = ['canplaythrough', 'canplay', 'loadeddata']
    evs.forEach((e) => v.addEventListener(e, done))
    const timer = setTimeout(done, v.readyState >= 2 ? 0 : wait)
    return () => {
      evs.forEach((e) => v.removeEventListener(e, done))
      clearTimeout(timer)
    }
  }, [])

  // the sound icon follows what is actually audible
  useEffect(() => {
    const v = videoRef.current
    const sync = () => setSoundOn(!v.paused && !v.ended && !v.muted && v.volume > 0)
    const evs = ['play', 'playing', 'pause', 'ended', 'volumechange']
    evs.forEach((e) => v.addEventListener(e, sync))
    return () => evs.forEach((e) => v.removeEventListener(e, sync))
  }, [])

  // once everything is loaded the video plays from the start with sound; if the browser blocks sound before any
  // interaction it starts muted and gets its sound back on the visitor's first tap / click / key press
  useEffect(() => {
    if (!assetsReady) return
    const v = videoRef.current
    const events = ['pointerdown', 'keydown', 'touchend']
    const unmute = (e) => {
      if (e.target instanceof Element && e.target.closest('.dp-music')) return // the sound button handles its own click
      v.muted = false
      events.forEach((e) => window.removeEventListener(e, unmute, true))
    }
    v.muted = false
    v.play().then(
      () => setStarted(true),
      () => {
        v.muted = true
        v.play().then(
          () => {
            setStarted(true)
            events.forEach((e) => window.addEventListener(e, unmute, true))
          },
          () => {
            setStarted(true)
            setEnded(true) // no autoplay at all: go straight to the title + button
          },
        )
      },
    )
    return () => events.forEach((e) => window.removeEventListener(e, unmute, true))
  }, [assetsReady])

  // once the video has ended the title reveals and the ENTER button fades in, and the Landing Background music starts
  useEffect(() => {
    if (ended && ready) sceneRef.current?.play()
  }, [ended, ready])
  const { welcomeEnded } = music
  useEffect(() => {
    welcomeEnded(ended)
    return () => welcomeEnded(false)
  }, [ended, welcomeEnded])

  // crossfade the 3D title when the EN / BN toggle changes
  useEffect(() => {
    langRef.current = lang
    sceneRef.current?.setLang(lang)
  }, [lang])

  const toggleSound = () => {
    const v = videoRef.current
    v.muted = !v.muted
  }

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
        preload="auto"
        onEnded={() => setEnded(true)}
        aria-hidden="true"
      >
        <source
          src={isMobile() ? VIDEO_WEBM_MOBILE : VIDEO_WEBM}
          type="video/webm; codecs=vp9,opus"
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
      {started && !ended && (
        <button
          type="button"
          className={`dp-music ${soundOn ? 'is-playing' : ''}`}
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? t({ bn: 'শব্দ বন্ধ করুন', en: 'Turn sound off' }) : t({ bn: 'শব্দ চালু করুন', en: 'Turn sound on' })}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
            {soundOn ? (
              <path className="dp-music__wave" d="M16.2 8.3a5.4 5.4 0 0 1 0 7.4M18.6 6a8.8 8.8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M16.5 9l4.5 4.5M21 9l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      )}
      <div className="dp-loader" aria-hidden="true">
        <span className="dp-loader__spinner" />
      </div>
    </main>
  )
}
