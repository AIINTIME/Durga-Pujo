import { useEffect, useMemo, useRef, useState } from 'react'
import { MusicContext } from './context.js'
import MusicToggle from './MusicToggle.jsx'

const MUSIC_SRC = '/Video/Music.mp3'

// Sits above the router (like TransitionLayer) so the same loop keeps
// playing across the Welcome -> Home navigation instead of restarting.
export default function MusicPlayer({ children }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const api = useMemo(
    () => ({
      playing,
      // call from a real user gesture (e.g. the Enter button) — browsers
      // block unprompted autoplay with sound, so a stray rejection is fine.
      play: () => audioRef.current?.play().catch(() => {}),
      toggle: () => {
        const audio = audioRef.current
        if (!audio) return
        if (audio.paused) audio.play().catch(() => {})
        else audio.pause()
      },
    }),
    [playing],
  )

  return (
    <MusicContext.Provider value={api}>
      {children}
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />
      <MusicToggle />
    </MusicContext.Provider>
  )
}
