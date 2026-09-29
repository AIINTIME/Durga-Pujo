import { useEffect } from 'react'

// Drives a pinned, scroll-scrubbed section. Sets `--p` (0 -> 1, damped) on the frame element so CSS can
// derive every element's phase from it. While the section scrolls up over the previous one, it also
// sets `coverVar` (0 -> 1) on the nearest `.dp-home` so the previous section can dim and settle back.
// `hold` sections keep one extra screen at the end (the next section slides over them) that is not
// part of their own timeline.
export function useScrollPhase(trackRef, frameRef, { coverVar, hold = false } = {}) {
  useEffect(() => {
    const track = trackRef.current
    const frame = frameRef.current
    const home = track.closest('.dp-home')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      frame.style.setProperty('--p', '1')
      return
    }
    let raf = 0
    let active = false
    let shown = 0
    let last = performance.now()

    const cover = () => {
      if (!coverVar) return
      const e = Math.min(1, Math.max(0, 1 - track.getBoundingClientRect().top / window.innerHeight))
      home?.style.setProperty(coverVar, e.toFixed(4))
    }
    const target = () => {
      const r = track.getBoundingClientRect()
      const vh = window.innerHeight
      const span = r.height - vh - (hold && home ? vh : 0)
      if (span <= 0) return 1
      return Math.min(1, Math.max(0, -r.top / span))
    }
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      cover()
      const goal = target()
      shown += (goal - shown) * (1 - Math.exp(-dt / 0.09))
      if (Math.abs(goal - shown) < 0.0004) shown = goal
      frame.style.setProperty('--p', shown.toFixed(4))
      if (active) raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !active) {
          active = true
          last = performance.now()
          raf = requestAnimationFrame(tick)
        } else if (!e.isIntersecting) {
          active = false
          cancelAnimationFrame(raf)
        }
      },
      { rootMargin: '10% 0px' }
    )
    io.observe(track)
    shown = target()
    frame.style.setProperty('--p', shown.toFixed(4))
    cover()
    return () => {
      active = false
      cancelAnimationFrame(raf)
      io.disconnect()
      if (coverVar) home?.style.removeProperty(coverVar)
    }
  }, [trackRef, frameRef, coverVar, hold])
}
