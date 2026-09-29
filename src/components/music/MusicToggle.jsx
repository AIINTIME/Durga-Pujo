import { useMusic } from './context.js'
import './MusicToggle.css'

export default function MusicToggle() {
  const { playing, toggle } = useMusic()
  return (
    <button
      type="button"
      className={`dp-music ${playing ? 'is-playing' : ''}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Mute background music' : 'Play background music'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
        {playing ? (
          <path
            className="dp-music__wave"
            d="M16.2 8.3a5.4 5.4 0 0 1 0 7.4M18.6 6a8.8 8.8 0 0 1 0 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M16.5 9l4.5 4.5M21 9l-4.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  )
}
