import { useEffect, useMemo, useRef, useState } from 'react'
import { MusicContext } from './context.js'
import MusicToggle from './MusicToggle.jsx'
import { useLanguage } from '../../i18n/context.js'

const MUSIC_SRC = '/Video/Music.mp3'

// Sits above the router (like TransitionLayer) so the same loop keeps
// playing across the Welcome -> Home navigation instead of restarting.
export default function MusicPlayer({ children }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [silent, setSilent] = useState(false) // running, but the browser is still holding the sound back
  const { t } = useLanguage()

  // the icon means "is there sound?": the music loop, or a page video (Welcome) playing with its sound on
  const [videoSound, setVideoSound] = useState(false)
  useEffect(() => {
    const audio = audioRef.current
    const sync = () => {
      setSilent(!audio.paused && audio.muted)
      setPlaying(!audio.paused && !audio.muted) // "on" only when it is actually audible
      setVideoSound([...document.querySelectorAll('video:not([data-music])')].some((v) => !v.paused && !v.ended && !v.muted && v.volume > 0))
    }
    const onVideo = (e) => {
      sync()
      // a video just started with sound, so the browser allows sound here: start the music too
      if (e.type === 'playing' && e.target instanceof HTMLVideoElement && !e.target.muted && audio.paused) audio.play().then(sync, () => {})
    }
    const media = ['play', 'playing', 'pause', 'ended', 'volumechange']
    media.forEach((t) => audio.addEventListener(t, sync))
    media.forEach((t) => document.addEventListener(t, onVideo, true))
    sync() // the icon always follows what is actually happening, even after a refresh
    return () => {
      media.forEach((t) => audio.removeEventListener(t, sync))
      media.forEach((t) => document.removeEventListener(t, onVideo, true))
    }
  }, [])

  // Music is on from the very first moment. Browsers only allow sound after the visitor has interacted, so the loop
  // starts at once with sound if that is allowed, otherwise it starts silently (silent autoplay is always allowed)
  // and is un-muted by the first tap / click / key press, so the music is already running and there is no wait.
  useEffect(() => {
    const audio = audioRef.current
    const events = ['pointerdown', 'pointerup', 'click', 'keydown', 'touchend']
    const off = () => events.forEach((e) => window.removeEventListener(e, kick, true))
    function kick(ev) {
      if (ev.target instanceof Element && ev.target.closest('.dp-music')) return off() // they chose with the button
      audio.muted = false
      audio.play().then(() => off(), () => {})
      // the Welcome video was started silently too: give it its sound back with the music
      document.querySelectorAll('video:not([data-music])').forEach((v) => { if (!v.paused && !v.ended) v.muted = false })
    }
    audio.muted = false
    audio.play().then(
      () => off(),
      () => {
        audio.muted = true
        audio.play().catch(() => {})
        events.forEach((e) => window.addEventListener(e, kick, true))
      },
    )
    return off
  }, [])

  const api = useMemo(
    () => ({
      playing: playing || videoSound,
      // call from a real user gesture (e.g. the Enter button) — browsers
      // block unprompted autoplay with sound, so a stray rejection is fine.
      play: () => {
        const a = audioRef.current
        if (!a) return
        a.muted = false
        a.play().catch(() => {})
      },
      toggle: () => {
        const audio = audioRef.current
        if (!audio) return
        if (playing || videoSound) {
          audio.pause()
          document.querySelectorAll('video:not([data-music])').forEach((v) => (v.muted = true)) // silence the Welcome video's own sound too
        } else {
          audio.muted = false
          audio.play().catch(() => {})
        }
      },
    }),
    [playing, videoSound],
  )

  return (
    <MusicContext.Provider value={api}>
      {children}
      {/* a hidden <video> carries the sound: browsers let a muted video autoplay at once (a plain <audio> is blocked
          until the first click), and the first interaction then un-mutes it */}
      <video ref={audioRef} src={MUSIC_SRC} data-music loop muted autoPlay playsInline preload="auto" className="dp-music-carrier" aria-hidden="true" />
      <MusicToggle />
      {/* the browser will not release sound before the first touch: a light, non-blocking nudge, gone once sound is on */}
      {silent && (
        <p className="dp-soundhint" role="status">
          {t({ bn: 'সাউন্ড চালু করতে যেকোনো জায়গায় ট্যাপ করুন', en: 'Tap anywhere for sound' })}
        </p>
      )}
    </MusicContext.Provider>
  )
}
