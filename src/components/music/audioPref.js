// The visitor's "with audio" / "without audio" choice from the loading screen,
// remembered for the rest of this browser tab so Welcome's own video knows
// whether to try playing with sound.
const KEY = 'dp-audio-pref'

export function getAudioPref() {
  try {
    return sessionStorage.getItem(KEY) // 'on' | 'off' | null (no choice made yet)
  } catch {
    return null
  }
}

export function setAudioPref(pref) {
  try {
    sessionStorage.setItem(KEY, pref)
  } catch {
    /* storage unavailable (private mode) — the choice still applies for this visit */
  }
}
