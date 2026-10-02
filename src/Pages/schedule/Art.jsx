// Illustrated card art for the schedule days that have no photograph yet (160 x 152 viewBox, one motif per ritual).
// Gradients and glows are defined once in <ArtDefs /> and shared by every <Art /> through their ids.

const GOLD = 'url(#sc-gold)'
const bg = (id) => <rect width="160" height="152" fill={`url(#sc-${id})`} />
const vig = <rect width="160" height="152" fill="url(#sc-vig)" />
const along = (n, f) => Array.from({ length: n }, (_, i) => f(i / (n - 1), i))
const quad = (p0, p1, p2, t) => (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2

export function ArtDefs() {
  const stops = (list) => list.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sc-gold" x1="0" y1="0" x2="0" y2="1">{stops([[0, '#fff0b8'], [0.5, '#e2ac4f'], [1, '#a8741f']])}</linearGradient>
        <linearGradient id="sc-dawn" x1="0" y1="0" x2="0" y2="1">{stops([[0, '#ffd98a'], [0.55, '#e8803a'], [1, '#8a1a2a']])}</linearGradient>
        <linearGradient id="sc-dusk" x1="0" y1="0" x2="0" y2="1">{stops([[0, '#3b1a4a'], [0.55, '#a8392f'], [1, '#f0a04b']])}</linearGradient>
        <linearGradient id="sc-night" x1="0" y1="0" x2="0" y2="1">{stops([[0, '#0b0a2a'], [0.6, '#2a1240'], [1, '#6a1a3a']])}</linearGradient>
        <linearGradient id="sc-fire" x1="0" y1="0" x2="0" y2="1">{stops([[0, '#220407'], [0.55, '#7a1018'], [1, '#d8541a']])}</linearGradient>
        <linearGradient id="sc-warm" x1="0" y1="0" x2="0" y2="1">{stops([[0, '#5c0818'], [1, '#b02a3e']])}</linearGradient>
        <linearGradient id="sc-water" x1="0" y1="0" x2="0" y2="1">{stops([[0, '#2a7a9a'], [1, '#0f3f63']])}</linearGradient>
        <linearGradient id="sc-flame" x1="0" y1="1" x2="0" y2="0">{stops([[0, '#e8501a'], [0.55, '#ffb43c'], [1, '#fff7c2']])}</linearGradient>
        <radialGradient id="sc-glow">{stops([[0, 'rgba(255,217,138,0.95)'], [1, 'rgba(255,217,138,0)']])}</radialGradient>
        <radialGradient id="sc-vig" cx="0.5" cy="0.5" r="0.75">{stops([[0.55, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.38)']])}</radialGradient>
        <filter id="sc-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>
    </svg>
  )
}

const Flame = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0C-6 -5 -5 -14 0 -24C5 -14 6 -5 0 0Z" fill="url(#sc-flame)" />
    <path d="M0 -1C-2.2 -3 -2 -8 0 -12C2 -8 2.2 -3 0 -1Z" fill="#fff7c2" />
  </g>
)
const Glow = ({ x, y, r }) => <circle cx={x} cy={y} r={r} fill="url(#sc-glow)" />
const Lamp = ({ x, y, s = 1, flame = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {flame && <Flame x={0} y={-2} />}
    <path d="M-11 0Q0 11 11 0Z" fill={GOLD} />
    <ellipse cx="0" cy="0" rx="11" ry="2.4" fill="#a8741f" />
  </g>
)
const Star = ({ x, y, r = 1 }) => <circle cx={x} cy={y} r={r} fill="#fff4cf" opacity="0.9" />
const Smoke = ({ d, o = 0.5, w = 3 }) => <path d={d} fill="none" stroke="#fff" strokeOpacity={o} strokeWidth={w} strokeLinecap="round" filter="url(#sc-blur)" />

const MOTIFS = {
  // Kalparambha & Shasthi puja: the kalash pot with mango leaves and a coconut
  kalash: (
    <>
      {bg('fire')}<Glow x={80} y={92} r={70} />
      <ellipse cx="80" cy="132" rx="34" ry="6" fill="#000" opacity="0.35" />
      {[-52, -26, 0, 26, 52].map((a) => (
        <ellipse key={a} cx="80" cy="46" rx="6.5" ry="19" fill="#5a9a3a" stroke="#2f6b2a" strokeWidth="0.8" transform={`rotate(${a} 80 70)`} />
      ))}
      <ellipse cx="80" cy="46" rx="11" ry="13" fill="#9a6a2a" /><circle cx="76" cy="44" r="1.4" fill="#4a2a10" /><circle cx="83" cy="44" r="1.4" fill="#4a2a10" /><circle cx="80" cy="49" r="1.4" fill="#4a2a10" />
      <rect x="68" y="68" width="24" height="14" fill={GOLD} />
      <ellipse cx="80" cy="68" rx="16" ry="4" fill="#fff0b8" />
      <ellipse cx="80" cy="102" rx="31" ry="28" fill={GOLD} />
      <circle cx="80" cy="102" r="9" fill="#c8102e" /><path d="M80 94V110M72 102H88" stroke="#fff0b8" strokeWidth="2" />
      <path d="M52 92Q80 100 108 92" fill="none" stroke="#a8741f" strokeWidth="1.2" />
      {vig}
    </>
  ),
  // Evening bodhon, amantran & adhibas: the sacred bel tree at dusk
  beltree: (
    <>
      {bg('dusk')}<circle cx="128" cy="30" r="10" fill="#fff4cf" opacity="0.92" />
      {[[20, 24], [44, 14], [100, 20], [146, 52], [30, 52]].map(([x, y], i) => <Star key={i} x={x} y={y} />)}
      <path d="M0 126Q60 108 160 124V152H0Z" fill="#2a1a24" />
      <path d="M75 128L77 88Q80 80 83 88L85 128Z" fill="#3a2214" />
      <circle cx="80" cy="62" r="27" fill="#2f6b3a" /><circle cx="56" cy="78" r="19" fill="#2a5f35" /><circle cx="104" cy="78" r="19" fill="#2a5f35" />
      {[[80, 48], [64, 62], [96, 62], [52, 80], [108, 80], [78, 74], [66, 88], [94, 88]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} fill="#7cc062">
          <ellipse cx="0" cy="-5" rx="3" ry="5" /><ellipse cx="-5" cy="2" rx="3" ry="5" transform="rotate(-50 -5 2)" /><ellipse cx="5" cy="2" rx="3" ry="5" transform="rotate(50 5 2)" />
        </g>
      ))}
      <Glow x={80} y={130} r={26} /><Lamp x={80} y={134} s={0.9} />
      {vig}
    </>
  ),
  // Maha Shasthi evening aarti: the multi-flame aarti lamp with smoke
  aarti: (
    <>
      {bg('fire')}<Glow x={80} y={78} r={72} />
      <Smoke d="M64 44C54 34 74 28 62 16" o={0.45} /><Smoke d="M96 44C106 34 86 28 98 16" o={0.45} /><Smoke d="M80 40C72 30 90 24 80 10" o={0.35} />
      <rect x="77" y="92" width="6" height="32" fill={GOLD} /><ellipse cx="80" cy="128" rx="22" ry="6" fill={GOLD} />
      <rect x="40" y="86" width="80" height="6" rx="3" fill={GOLD} />
      {[46, 63, 80, 97, 114].map((x, i) => (
        <g key={x}><Flame x={x} y={i === 2 ? 76 : 78} s={i === 2 ? 1.15 : 0.9} /><path d={`M${x - 8} 84Q${x} 94 ${x + 8} 84Z`} fill={GOLD} /></g>
      ))}
      {vig}
    </>
  ),
  // Nabapatrika snan: the bundle of nine plants at the river's edge
  nabapatrika: (
    <>
      {bg('dawn')}<circle cx="124" cy="50" r="16" fill="#fff0b8" opacity="0.9" /><Glow x={124} y={50} r={40} />
      <rect y="86" width="160" height="66" fill="url(#sc-water)" />
      {along(5, (t, i) => <path key={i} d={`M0 ${96 + i * 13}Q40 ${90 + i * 13} 80 ${96 + i * 13}T160 ${96 + i * 13}`} fill="none" stroke="#bfe3f0" strokeOpacity="0.5" strokeWidth="1.2" />)}
      {[-30, -20, -10, 0, 10, 20, 30].map((a) => (
        <path key={a} d="M80 108C70 80 76 52 80 28C84 52 90 80 80 108Z" fill="#4f9a3a" stroke="#2f6b2a" strokeWidth="0.8" transform={`rotate(${a} 80 108)`} opacity="0.95" />
      ))}
      <rect x="72" y="92" width="16" height="7" rx="2" fill="#c8102e" /><rect x="72" y="92" width="16" height="2.4" fill="#ffd54a" />
      {vig}
    </>
  ),
  // Early-morning Vedic invocation: sunrise over the hills
  sunrise: (
    <>
      {bg('dawn')}<Glow x={80} y={96} r={80} />
      {along(13, (t, i) => {
        const a = Math.PI * (1 - t)
        return <line key={i} x1={80 + Math.cos(a) * 28} y1={100 - Math.sin(a) * 28} x2={80 + Math.cos(a) * 62} y2={100 - Math.sin(a) * 62} stroke="#fff0b8" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      })}
      <circle cx="80" cy="100" r="24" fill="#fff4c2" />
      <path d="M0 108Q30 84 62 106Q92 78 130 104Q148 92 160 100V152H0Z" fill="#6a1a2a" />
      <path d="M0 126Q40 112 80 126T160 124V152H0Z" fill="#3e0d1a" />
      <g transform="translate(80 132)" fill={GOLD}>
        {[-40, -20, 0, 20, 40].map((a) => <ellipse key={a} cx="0" cy="-8" rx="4.5" ry="10" transform={`rotate(${a})`} />)}
      </g>
      {vig}
    </>
  ),
  // Sacred Ardharatra puja: midnight lamp under the crescent moon
  midnight: (
    <>
      {bg('night')}
      {[[18, 20], [40, 38], [62, 14], [104, 30], [126, 14], [146, 40], [24, 70], [140, 78], [90, 56]].map(([x, y], i) => <Star key={i} x={x} y={y} r={i % 3 ? 1 : 1.6} />)}
      <path d="M118 22A20 20 0 1 0 134 54A16 16 0 1 1 118 22Z" fill="#fff4cf" />
      <Glow x={80} y={100} r={58} />
      <Flame x={80} y={92} s={1.9} />
      <path d="M58 100Q80 128 102 100Z" fill={GOLD} /><ellipse cx="80" cy="100" rx="22" ry="4" fill="#a8741f" />
      <g transform="translate(80 124)" fill={GOLD} opacity="0.9">
        {[-60, -30, 0, 30, 60].map((a) => <ellipse key={a} cx="0" cy="-2" rx="6" ry="14" transform={`rotate(${a} 0 14)`} />)}
      </g>
      {vig}
    </>
  ),
  // Maha Ashtami pushpanjali: a brass thali heaped with flowers
  thali: (
    <>
      {bg('warm')}<Glow x={80} y={90} r={70} />
      <ellipse cx="80" cy="118" rx="58" ry="17" fill={GOLD} /><ellipse cx="80" cy="114" rx="50" ry="12" fill="#c28a2a" />
      {along(15, (t, i) => {
        const x = 34 + t * 92
        const y = 104 - Math.sin(t * Math.PI) * 30 + ((i * 7) % 9)
        const c = ['#ff9a1f', '#ffb81f', '#d8213a', '#ff7a1f'][i % 4]
        return <g key={i}><circle cx={x} cy={y} r="9.5" fill={c} /><circle cx={x} cy={y} r="4.5" fill="#fff0b8" opacity="0.55" /></g>
      })}
      {[[22, 130], [138, 132], [100, 138], [52, 140]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="4" ry="2.4" fill="#e8506a" transform={`rotate(${i * 40} ${x} ${y})`} />)}
      {vig}
    </>
  ),
  // Kumari puja: the lotus mandala
  lotus: (
    <>
      {bg('warm')}<Glow x={80} y={76} r={72} />
      <circle cx="80" cy="76" r="56" fill="none" stroke="#f1c266" strokeWidth="1.2" strokeDasharray="2 4" />
      <circle cx="80" cy="76" r="46" fill="none" stroke="#f1c266" strokeOpacity="0.6" strokeWidth="1" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d="M80 76C70 58 74 34 80 22C86 34 90 58 80 76Z" fill="#ffd0dc" stroke="#e8506a" strokeWidth="0.8" transform={`rotate(${a} 80 76)`} opacity="0.9" />)}
      {[22, 67, 112, 157, 202, 247, 292, 337].map((a) => <path key={a} d="M80 76C73 62 75 46 80 38C85 46 87 62 80 76Z" fill="#fff0f4" stroke="#e8506a" strokeWidth="0.7" transform={`rotate(${a} 80 76)`} />)}
      <circle cx="80" cy="76" r="9" fill={GOLD} /><circle cx="80" cy="76" r="3.4" fill="#c8102e" />
      {vig}
    </>
  ),
  // Sandhi puja: 108 lamps in rows
  lamps: (
    <>
      {bg('night')}<Glow x={80} y={112} r={80} />
      <g transform="translate(80 40)" fill="#ffd0dc" stroke="#e8506a" strokeWidth="0.7">
        {[-50, -25, 0, 25, 50].map((a) => <path key={a} d="M0 24C-8 8 -5 -8 0 -16C5 -8 8 8 0 24Z" transform={`rotate(${a} 0 24)`} />)}
        <circle cx="0" cy="24" r="4" fill={GOLD} stroke="none" />
      </g>
      {[[7, 78, 0.62], [9, 94, 0.74], [11, 108, 0.88]].map(([n, y, s], r) =>
        along(n, (t, i) => <Lamp key={`${r}-${i}`} x={28 + t * 104} y={y + (r === 1 ? 6 : r === 2 ? 14 : 0)} s={s} />)
      )}
      {vig}
    </>
  ),
  // Nabami morning pushpanjali: a marigold garland against the dawn
  garland: (
    <>
      {bg('dawn')}<circle cx="80" cy="70" r="22" fill="#fff4c2" opacity="0.85" /><Glow x={80} y={70} r={70} />
      {[0, 1].map((k) =>
        along(13, (t, i) => {
          const y0 = 18 + k * 34
          const x = quad(8, 80, 152, t), y = quad(y0, y0 + 56, y0, t)
          return <g key={`${k}-${i}`}><circle cx={x} cy={y} r="6.5" fill={i % 2 ? '#ff9a1f' : '#ffb81f'} /><circle cx={x} cy={y} r="2.6" fill="#fff0b8" opacity="0.6" /></g>
        })
      )}
      <path d="M0 136Q40 120 80 134T160 130V152H0Z" fill="#3e0d1a" />
      {vig}
    </>
  ),
  // Maha yajna: the havan kund and sacred fire
  havan: (
    <>
      {bg('fire')}<Glow x={80} y={84} r={76} />
      <path d="M44 132L52 112H108L116 132Z" fill="#9a5a2a" /><path d="M52 112L58 100H102L108 112Z" fill="#b8742f" />
      <path d="M80 100C52 92 58 62 80 28C102 62 108 92 80 100Z" fill="#e8501a" />
      <path d="M80 98C62 90 66 68 80 44C94 68 98 90 80 98Z" fill="#ffb43c" />
      <path d="M80 96C70 90 72 76 80 62C88 76 90 90 80 96Z" fill="#fff7c2" />
      <rect x="22" y="118" width="38" height="3.4" rx="1.7" fill="#6a4a22" transform="rotate(-28 22 118)" /><ellipse cx="23" cy="119" rx="6" ry="3.4" fill={GOLD} transform="rotate(-28 23 119)" />
      {[[40, 50], [118, 56], [30, 80], [128, 86], [100, 22]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.5" fill="#ffd98a" />)}
      {vig}
    </>
  ),
  // Dhunuchi dance: the clay burner with rolling smoke
  dhunuchi: (
    <>
      {bg('night')}<Glow x={80} y={96} r={64} />
      <Smoke d="M70 76C46 62 100 56 76 38C62 26 94 22 84 8" o={0.55} w={6} /><Smoke d="M90 78C112 64 62 60 86 42" o={0.4} w={5} /><Smoke d="M80 76C94 66 70 60 80 50" o={0.35} w={4} />
      <path d="M52 78H108L100 96Q80 106 60 96Z" fill="#a8541f" /><ellipse cx="80" cy="78" rx="28" ry="6" fill="#d8541a" /><ellipse cx="80" cy="78" rx="22" ry="4" fill="#ffb43c" />
      <rect x="74" y="98" width="12" height="16" fill="#8a4418" /><ellipse cx="80" cy="118" rx="20" ry="5" fill="#a8541f" />
      <path d="M108 80Q130 78 128 98" fill="none" stroke="#a8541f" strokeWidth="5" strokeLinecap="round" />
      {[[56, 76], [64, 72], [96, 72], [104, 76], [80, 74]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill="#fff0b8" />)}
      <g stroke="#e2ac4f" strokeWidth="2.6" strokeLinecap="round"><line x1="20" y1="128" x2="48" y2="116" /><line x1="140" y1="128" x2="112" y2="116" /></g>
      {vig}
    </>
  ),
  // Darpan visarjan: the hand mirror over still water
  mirror: (
    <>
      {bg('dusk')}<Glow x={80} y={64} r={70} />
      <rect y="112" width="160" height="40" fill="url(#sc-water)" />
      {along(3, (t, i) => <ellipse key={i} cx="80" cy="128" rx={20 + i * 16} ry={4 + i * 2.4} fill="none" stroke="#bfe3f0" strokeOpacity={0.6 - i * 0.15} strokeWidth="1.2" />)}
      <rect x="76" y="96" width="8" height="26" rx="4" fill={GOLD} />
      <circle cx="80" cy="60" r="38" fill={GOLD} />
      <circle cx="80" cy="60" r="32" fill="url(#sc-dawn)" /><path d="M56 70Q80 52 104 70V84H56Z" fill="#6a1a2a" opacity="0.7" /><circle cx="94" cy="50" r="7" fill="#fff4c2" opacity="0.85" />
      <path d="M62 44Q70 36 82 36" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2.2" strokeLinecap="round" />
      {[0, 60, 120, 180, 240, 300].map((a) => <circle key={a} cx={80 + Math.cos((a * Math.PI) / 180) * 35} cy={60 + Math.sin((a * Math.PI) / 180) * 35} r="2.2" fill="#c8102e" />)}
      {vig}
    </>
  ),
  // Sindoor khela: shankha-pola bangles and clouds of vermilion
  sindoor: (
    <>
      {bg('warm')}<Glow x={80} y={76} r={70} />
      {[[40, 50, 24], [118, 44, 28], [100, 100, 26], [48, 104, 22], [80, 70, 22]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#e8201a" opacity="0.5" filter="url(#sc-blur)" />)}
      {[[56, 78, 0], [86, 86, 20]].map(([x, y, a], i) => (
        <g key={i} transform={`rotate(${a} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx="30" ry="22" fill="none" stroke="#fff8ec" strokeWidth="8" /><ellipse cx={x} cy={y} rx="30" ry="22" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" transform="translate(0 -2)" />
          <ellipse cx={x} cy={y} rx="34.5" ry="26" fill="none" stroke="#c8102e" strokeWidth="3.4" />
          <ellipse cx={x} cy={y} rx="25.5" ry="17.5" fill="none" stroke="#c8102e" strokeWidth="3.4" />
        </g>
      ))}
      <path d="M52 124Q80 100 108 124Q80 134 52 124Z" fill={GOLD} /><path d="M60 122Q80 106 100 122Q80 128 60 122Z" fill="#d8141a" />
      {[[20, 28], [140, 24], [24, 122], [138, 118], [70, 22], [100, 26]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill="#ff4a3a" opacity="0.85" />)}
      {vig}
    </>
  ),
  // Aparajita puja & immersion: the boat carrying the goddess's arch at sunset
  boat: (
    <>
      {bg('dusk')}<circle cx="80" cy="84" r="24" fill="#fff0b8" opacity="0.8" /><Glow x={80} y={84} r={80} />
      <rect y="100" width="160" height="52" fill="url(#sc-water)" />
      {along(4, (t, i) => <path key={i} d={`M0 ${108 + i * 11}Q40 ${103 + i * 11} 80 ${108 + i * 11}T160 ${108 + i * 11}`} fill="none" stroke="#f6d6a0" strokeOpacity="0.5" strokeWidth="1.2" />)}
      <path d="M30 98Q80 124 130 98L124 108Q80 126 36 108Z" fill="#7a1018" /><path d="M30 98H130" stroke={GOLD} strokeWidth="3" />
      <path d="M62 98V66Q80 46 98 66V98Z" fill={GOLD} /><path d="M68 98V68Q80 54 92 68V98Z" fill="#7a1018" />
      <circle cx="80" cy="76" r="6" fill="#f1c266" /><path d="M72 92Q80 80 88 92Z" fill="#f1c266" />
      <path d="M72 50L76 56L80 48L84 56L88 50L86 60H74Z" fill={GOLD} />
      <Lamp x={44} y={92} s={0.6} /><Lamp x={116} y={92} s={0.6} />
      {vig}
    </>
  ),
}

export default function Art({ kind }) {
  const motif = MOTIFS[kind]
  if (!motif) return null
  return (
    <svg className="dp-sc__art" viewBox="0 0 160 152" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {motif}
    </svg>
  )
}
