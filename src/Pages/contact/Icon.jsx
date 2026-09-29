// Small line icons for the Contact page (24 x 24 grid, drawn in currentColor).
const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

const PATHS = {
  pin: (
    <g {...STROKE}>
      <path d="M12 21.5s6.5-5.6 6.5-11.2a6.5 6.5 0 1 0-13 0C5.5 15.900 12 21.500 12 21.500z" />
      <circle cx="12" cy="10.300" r="2.400" />
    </g>
  ),
  phone: (
    <path
      fill="currentColor"
      d="M6.600 10.800a15 15 0 0 0 6.600 6.600l2.200-2.200a1 1 0 0 1 1-.25 11 11 0 0 0 3.600.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.500a1 1 0 0 1 1 1c0 1.250.2 2.450.6 3.600a1 1 0 0 1-.25 1z"
    />
  ),
  mail: (
    <g {...STROKE}>
      <rect x="3" y="5.500" width="18" height="13" rx="2" />
      <path d="m3.500 7 8.500 6.500L20.500 7" />
    </g>
  ),
  globe: (
    <g {...STROKE}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </g>
  ),
  map: (
    <g {...STROKE}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />
    </g>
  ),
  bus: (
    <g {...STROKE}>
      <rect x="4.500" y="3.500" width="15" height="14" rx="2.500" />
      <path d="M4.500 11h15M8 20.500v-3M16 20.500v-3" />
      <circle cx="8.500" cy="14.200" r=".6" fill="currentColor" />
      <circle cx="15.500" cy="14.200" r=".6" fill="currentColor" />
    </g>
  ),
  train: (
    <g {...STROKE}>
      <rect x="5" y="3" width="14" height="14" rx="3" />
      <path d="M5 10.500h14M8 21l2.500-4M16 21l-2.500-4" />
      <circle cx="9" cy="13.800" r=".6" fill="currentColor" />
      <circle cx="15" cy="13.800" r=".6" fill="currentColor" />
    </g>
  ),
  auto: (
    <g {...STROKE}>
      <path d="M3 16.500V11l3-5h9l3 5v5.500M3 11h15M9 6v5" />
      <circle cx="7" cy="17.500" r="2" />
      <circle cx="16" cy="17.500" r="2" />
    </g>
  ),
  road: (
    <g {...STROKE}>
      <path d="M9.500 3 5 21M14.500 3 19 21" />
      <path d="M12 5v3M12 11v3M12 17v3" />
    </g>
  ),
  expand: (
    <g {...STROKE}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5M4 4l5.500 5.500M20 4l-5.500 5.500M4 20l5.500-5.500M20 20l-5.500-5.500" />
    </g>
  ),
  gate: (
    <g {...STROKE}>
      <path d="M3 21V9l9-6 9 6v12M8 21v-7a4 4 0 0 1 8 0v7M3 21h18" />
    </g>
  ),
  store: (
    <g {...STROKE}>
      <path d="M4 10v11h16V10M3 10l2-6h14l2 6M3 10h18M9 21v-6h6v6" />
    </g>
  ),
  bike: (
    <g {...STROKE}>
      <circle cx="6" cy="16" r="3.500" />
      <circle cx="18" cy="16" r="3.500" />
      <path d="M6 16l4-7h5l3 7M10 9 8 6H6M13 12h-4" />
    </g>
  ),
  ambulance: (
    <g {...STROKE}>
      <path d="M2.500 17V8h11v9M13.500 11h4l3 3v3h-18" />
      <circle cx="7" cy="17.500" r="1.800" />
      <circle cx="17" cy="17.500" r="1.800" />
      <path d="M8 10v4M6 12h4" />
    </g>
  ),
  wheelchair: (
    <g {...STROKE}>
      <circle cx="10" cy="4.500" r="1.800" />
      <path d="M10 8v6h5l3 5M10 11h5" />
      <path d="M7.500 12.500a5.500 5.500 0 1 0 8 6.500" />
    </g>
  ),
  facebook: <path fill="currentColor" d="M13.500 21v-8h2.700l.5-3.200h-3.200V7.800c0-.9.4-1.600 1.700-1.600h1.600V3.400c-.3 0-1.300-.2-2.400-.2-2.500 0-4 1.500-4 4.100v2.500H7.600V13h2.800v8z" />,
  instagram: (
    <g {...STROKE}>
      <rect x="4" y="4" width="16" height="16" rx="4.500" />
      <circle cx="12" cy="12" r="3.600" />
      <circle cx="16.800" cy="7.200" r=".7" fill="currentColor" />
    </g>
  ),
  youtube: (
    <g>
      <rect x="2.500" y="5.500" width="19" height="13" rx="4" fill="currentColor" />
      <path d="m10 9.200 5 2.800-5 2.800z" fill="var(--yt, #f6e9dd)" />
    </g>
  ),
  external: (
    <g {...STROKE}>
      <path d="M13 4h7v7M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </g>
  ),
  arrow: (
    <g {...STROKE}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </g>
  ),
}

export default function Icon({ name, className = 'dp-ct__ic' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  )
}
