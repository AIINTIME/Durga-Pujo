// Scroll-scrubbed video: the section is a tall track, the video pins to the
// viewport inside it, and its currentTime is driven by scroll progress through
// the track — so scrolling plays the "Durga Puja" clip instead of a timer.
//
// Two things make this feel smooth rather than jumpy:
// - the raw scroll progress is critically-damped toward a "shown" value each
//   frame, so fast wheel/trackpad ticks blend into motion instead of snapping
//   the video frame-by-frame;
// - a new seek is only issued once the previous one has actually landed
//   (`!videoEl.seeking`), so quick scrolling can't pile up a queue of seeks
//   the browser falls behind on — it always catches up to the latest position.
// `reserve`: extra viewport heights at the end of the track that are NOT part of the clip (the next section
// slides up over the pinned video during them).
export function createScrollVideoScene(track, videoEl, { onProgress, smoothing = 0.12, reserve = 0 } = {}) {
  let duration = 0
  let raf = 0
  let active = false
  let shown = 0
  let last = performance.now()

  function onMeta() {
    duration = videoEl.duration || 0
  }
  videoEl.addEventListener('loadedmetadata', onMeta)
  if (videoEl.readyState >= 1) onMeta()

  function progress() {
    const rect = track.getBoundingClientRect()
    const span = rect.height - window.innerHeight * (1 + reserve)
    if (span <= 0) return 0
    return Math.min(1, Math.max(0, -rect.top / span))
  }

  function update() {
    const now = performance.now()
    const dt = Math.min((now - last) / 1000, 0.1)
    last = now

    const target = progress()
    const k = 1 - Math.exp(-dt / smoothing)
    shown += (target - shown) * k
    if (Math.abs(target - shown) < 0.0005) shown = target

    if (duration > 0 && !videoEl.seeking) {
      const t = shown * duration
      if (Math.abs(videoEl.currentTime - t) > 1 / 48) {
        videoEl.currentTime = t
      }
    }
    onProgress?.(shown)
    if (active) raf = requestAnimationFrame(update)
  }

  function start() {
    if (active) return
    active = true
    last = performance.now()
    raf = requestAnimationFrame(update)
  }
  function stop() {
    active = false
    cancelAnimationFrame(raf)
  }

  const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0 })
  io.observe(track)

  return {
    dispose() {
      stop()
      io.disconnect()
      videoEl.removeEventListener('loadedmetadata', onMeta)
    },
  }
}
