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
  const [choice, setChoice] = useState(null) // null | 'audio' | 'silent'
  const [ended, setEnded] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const assetsReady = ready && videoReady
  const navigate = useNavigate()
  const transition = useTransitionLayer()
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

  // wait for the video to be fully bufferable before offering the audio choice
  useEffect(() => {
    const v = videoRef.current
    if (v.readyState >= 4) {
      setVideoReady(true)
      return
    }
    const onCanPlay = () => setVideoReady(true)
    v.addEventListener('canplaythrough', onCanPlay)
    return () => v.removeEventListener('canplaythrough', onCanPlay)
  }, [])

  // once the visitor picks an entry mode, play the whole video from the start accordingly
  useEffect(() => {
    if (!choice) return
    const v = videoRef.current
    v.muted = choice === 'silent'
    v.play().catch(() => setEnded(true)) // no autoplay at all: go straight to the title + button
  }, [choice])

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
    sceneRef.current?.enter(() => navigate('/home'))
  }

  return (
    <main className={`dp-welcome ${choice ? 'is-ready' : ''} ${ended && ready ? 'is-ended' : ''} ${leaving ? 'is-leaving' : ''}`}>
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
            // no playable video: skip the audio choice and go straight to the title + button
            setChoice('silent')
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
      <div className="dp-loader" aria-hidden={assetsReady ? undefined : true}>
        {!assetsReady && <span className="dp-loader__spinner" />}
        {assetsReady && !choice && (
          <div className="dp-gate" role="group" aria-label={t({ bn: 'প্রবেশের ধরন বেছে নিন', en: 'Choose how to enter' })}>
            <p className="dp-gate__title">{t({ bn: 'কীভাবে প্রবেশ করতে চান?', en: 'How would you like to enter?' })}</p>
            <div className="dp-gate__actions">
              <button type="button" className="dp-gate__btn dp-gate__btn--primary" onClick={() => setChoice('audio')}>
                {t({ bn: 'শব্দসহ প্রবেশ করুন', en: 'Enter with Audio' })}
              </button>
              <button type="button" className="dp-gate__btn" onClick={() => setChoice('silent')}>
                {t({ bn: 'শব্দ ছাড়া প্রবেশ করুন', en: 'Enter Without Audio' })}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
