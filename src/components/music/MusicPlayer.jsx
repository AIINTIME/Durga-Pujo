import { useEffect, useMemo, useRef, useState } from 'react'
import { MusicContext } from './context.js'
import MusicToggle from './MusicToggle.jsx'

const MUSIC_SRC = '/Video/Landing Background.mp3'

// Home page's ambient background loop. Mounted only while Home is on screen, so it
// starts fresh on arrival and stops the moment the visitor navigates elsewhere.
export default function MusicPlayer({ children }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    const sync = () => setPlaying(!audio.paused && !audio.muted) // "on" only when it is actually audible
    const events = ['play', 'playing', 'pause', 'ended', 'volumechange']
    events.forEach((t) => audio.addEventListener(t, sync))

    // arriving on Home almost always follows a click (the Welcome ENTER button), so try sound at once;
    // if the browser still blocks it, fall back to silent autoplay and unmute on the visitor's next interaction
    const interactionEvents = ['pointerdown', 'keydown', 'touchend']
    const stopListening = () => interactionEvents.forEach((e) => window.removeEventListener(e, unmute, true))
    function unmute(e) {
      if (e.target instanceof Element && e.target.closest('.dp-music')) return stopListening() // the toggle handles its own state
      audio.muted = false
      audio.play().then(stopListening, () => {})
    }
    audio.muted = false
    audio.play().then(stopListening, () => {
      audio.muted = true
      audio.play().catch(() => {})
      interactionEvents.forEach((e) => window.addEventListener(e, unmute, true))
    })

    sync()
    return () => {
      events.forEach((t) => audio.removeEventListener(t, sync))
      stopListening()
    }
  }, [])

  const api = useMemo(
    () => ({
      playing,
      toggle: () => {
        const audio = audioRef.current
        if (!audio) return
        if (playing) {
          audio.pause()
        } else {
          audio.muted = false
          audio.play().catch(() => {})
        }
      },
    }),
    [playing],
  )

  return (
    <MusicContext.Provider value={api}>
      {children}
      {/* a hidden <video> carries the sound: browsers let a muted video autoplay at once (a plain <audio> is blocked
          until the first click), and the first interaction then un-mutes it */}
      <video ref={audioRef} src={MUSIC_SRC} loop muted autoPlay playsInline preload="auto" className="dp-music-carrier" aria-hidden="true" />
      <MusicToggle />
    </MusicContext.Provider>
  )
}
