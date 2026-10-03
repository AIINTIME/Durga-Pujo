import { useLayoutEffect } from 'react'

// Drives a pinned, scroll-scrubbed section. Sets `--p` (0 -> 1, damped) on the frame element so CSS can
// derive every element's phase from it.
// `coverVar` (0 -> 1, on the nearest `.dp-home`) is the hand-over from the previous section: it fades this
// section's scene in while the previous section's elements lift away, so the page carries on instead of
// sliding. `lead` sections open with one pinned screen for that hand-over (desktop only, on phones the
// sections just flow), and it overlaps the previous section's `hold`: one extra screen at the end that is
// not part of the section's own timeline.
export function useScrollPhase(trackRef, frameRef, { coverVar, hold = false, lead = false } = {}) {
  useLayoutEffect(() => {
    const track = trackRef.current
    const frame = frameRef.current
    // the pin also gets --p, for pieces drawn on the pin itself (see Recognition's side strips)
    const pin = frame.parentElement?.className.includes('__pin') ? frame.parentElement : null
    const setP = (v) => {
      frame.style.setProperty('--p', v)
      pin?.style.setProperty('--p', v)
    }
    const home = track.closest('.dp-home')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setP('1')
      if (coverVar) home?.style.setProperty(coverVar, '1')
      return
    }
    const desktop = window.matchMedia('(min-width: 821px)')
    let raf = 0
    let active = false
    let shown = 0
    let last = performance.now()

    const leadH = () => (lead && desktop.matches ? window.innerHeight : 0)
    const cover = () => {
      if (!coverVar) return
      const top = track.getBoundingClientRect().top
      // lead sections: 0 -> 1 over the pinned lead screen; the rest slide in, so 0 -> 1 as they come up the screen
      const e = lead ? (desktop.matches ? -top / window.innerHeight : 1) : 1 - top / window.innerHeight
      const c = Math.min(1, Math.max(0, e))
      home?.style.setProperty(coverVar, c.toFixed(4))
      // while this scene is still fading in it lies invisibly over the previous one: clicks must reach that one
      if (lead) track.style.pointerEvents = c < 0.9 ? 'none' : ''
    }
    const target = () => {
      const r = track.getBoundingClientRect()
      const vh = window.innerHeight
      const span = r.height - vh - leadH() - (hold && home ? vh : 0)
      if (span <= 0) return 1
      return Math.min(1, Math.max(0, (-r.top - leadH()) / span))
    }
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      cover()
      const goal = target()
      shown += (goal - shown) * (1 - Math.exp(-dt / 0.09))
      if (Math.abs(goal - shown) < 0.0004) shown = goal
      setP(shown.toFixed(4))
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
    setP(shown.toFixed(4))
    cover()
    return () => {
      active = false
      cancelAnimationFrame(raf)
      io.disconnect()
      if (coverVar) home?.style.removeProperty(coverVar)
      track.style.pointerEvents = ''
    }
  }, [trackRef, frameRef, coverVar, hold, lead])
}
