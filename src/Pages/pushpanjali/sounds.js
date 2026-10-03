// Sounds for the virtual offerings. The bell and the conch are the recordings from haldiadurgotsav.org and the aarti is a Bengali dhak clip (in /public/sounds,
// credits in CREDITS.txt there); the lotus chime is synthesised. Each recording falls back to a synthesised voice
// if it has not loaded (offline, or the audio file is missing), so a tap always makes a sound.
let ac
const FILES = { bell: '/sounds/bell.mp3', conch: '/sounds/conch.mp3', aarti: '/sounds/aarti.mp3' }

function ctx() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ac ??= new AC()
  if (ac.state === 'suspended') ac.resume()
  return ac
}

function voice(c, { freq, type = 'sine', start = 0, dur = 1.5, gain = 0.12, attack = 0.006, to = null }) {
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (to) osc.frequency.linearRampToValueAtTime(to, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

const SOUNDS = {
  lotus(c) {
    voice(c, { freq: 880, dur: 1.6, gain: 0.07 })
    voice(c, { freq: 1320, dur: 1.2, gain: 0.04, start: 0.04 })
    voice(c, { freq: 1760, dur: 0.9, gain: 0.025, start: 0.09 })
  },
  bell(c) {
    // inharmonic partials give the struck-metal ring
    ;[[1, 0.16], [2.76, 0.1], [5.4, 0.06], [8.93, 0.035]].forEach(([m, g], i) => voice(c, { freq: 392 * m, dur: 3.2 - i * 0.5, gain: g, attack: 0.003 }))
  },
  conch(c) {
    const t0 = c.currentTime
    const g = c.createGain()
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(500, t0)
    lp.frequency.linearRampToValueAtTime(1300, t0 + 0.9)
    lp.Q.value = 3
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.45)
    g.gain.setValueAtTime(0.22, t0 + 1.7)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.9)
    lp.connect(g).connect(c.destination)
    const lfo = c.createOscillator()
    const lfoGain = c.createGain()
    lfo.frequency.value = 5.2
    lfoGain.gain.value = 3
    lfo.connect(lfoGain)
    ;[196, 197.6, 294].forEach((f, i) => {
      const o = c.createOscillator()
      o.type = i === 2 ? 'triangle' : 'sawtooth'
      o.frequency.setValueAtTime(f * 0.97, t0)
      o.frequency.linearRampToValueAtTime(f, t0 + 0.4)
      lfoGain.connect(o.frequency)
      o.connect(lp)
      o.start(t0)
      o.stop(t0 + 3)
    })
    lfo.start(t0)
    lfo.stop(t0 + 3)
  },
  aarti(c) {
    ;[1047, 1568, 1319, 2093, 1568].forEach((f, i) => voice(c, { freq: f, dur: 1.4, gain: 0.05, start: i * 0.13, attack: 0.003 }))
  },
}

const decoded = {}
const requested = {}

function load(kind) {
  const c = ctx()
  if (!c || !FILES[kind] || requested[kind]) return
  requested[kind] = true
  fetch(FILES[kind])
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.statusText))))
    .then((data) => new Promise((ok, fail) => c.decodeAudioData(data, ok, fail)))
    .then((buf) => { decoded[kind] = buf })
    .catch(() => { requested[kind] = false })
}

// fetch the recordings as soon as the page is shown, so the first tap already has them
export function preloadOfferings() {
  try {
    Object.keys(FILES).forEach(load)
  } catch {
    /* audio unavailable */
  }
}

export function playOffering(kind) {
  try {
    const c = ctx()
    if (!c) return
    if (decoded[kind]) {
      const src = c.createBufferSource()
      src.buffer = decoded[kind]
      src.connect(c.destination)
      src.start()
    } else {
      // recording not here yet (or missing): the synthesised voice covers this tap
      load(kind)
      SOUNDS[kind]?.(c)
    }
  } catch {
    /* audio unavailable: the offering still counts */
  }
}
