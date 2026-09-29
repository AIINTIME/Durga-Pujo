import { useEffect, useMemo, useRef, useState } from 'react'
import { MusicContext } from './context.js'
import MusicToggle from './MusicToggle.jsx'

const MUSIC_SRC = '/Video/Music.mp3'

// Sits above the router (like TransitionLayer) so the same loop keeps
// playing across the Welcome -> Home navigation instead of restarting.
export default function MusicPlayer({ children }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  // the icon means "is there sound?": the music loop, or a page video (Welcome) playing with its sound on
  const [videoSound, setVideoSound] = useState(false)
  useEffect(() => {
    const audio = audioRef.current
    const sync = () => {
      setPlaying(!audio.paused)
      setVideoSound([...document.querySelectorAll('video')].some((v) => !v.paused && !v.ended && !v.muted && v.volume > 0))
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

  // music is on by default: try straight away, and if the browser blocks sound until the visitor interacts,
  // start on their first tap / key / scroll (on the Welcome page too).
  useEffect(() => {
    const audio = audioRef.current
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart']
    const off = () => events.forEach((e) => window.removeEventListener(e, kick, true))
    function kick(ev) {
      if (ev.target instanceof Element && ev.target.closest('.dp-music')) return off() // they chose with the button
      audio.play().then(() => { setPlaying(!audio.paused); off() }, () => {})
    }
    audio.play().then(() => { setPlaying(!audio.paused); off() }, () => events.forEach((e) => window.addEventListener(e, kick, true)))
    return off
  }, [])

  const api = useMemo(
    () => ({
      playing: playing || videoSound,
      // call from a real user gesture (e.g. the Enter button) — browsers
      // block unprompted autoplay with sound, so a stray rejection is fine.
      play: () => audioRef.current?.play().catch(() => {}),
      toggle: () => {
        const audio = audioRef.current
        if (!audio) return
        if (playing || videoSound) {
          audio.pause()
          document.querySelectorAll('video').forEach((v) => (v.muted = true)) // silence the Welcome video's own sound too
        } else audio.play().catch(() => {})
      },
    }),
    [playing, videoSound],
  )

  return (
    <MusicContext.Provider value={api}>
      {children}
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />
      <MusicToggle />
    </MusicContext.Provider>
  )
}
