// Three.js overlay for the About section (transparent canvas over the whole section, pointer-events none).
// Everything is laid out in CSS pixels with an orthographic camera and animated on the GPU:
//  • rose / marigold petals tumbling down (instanced, per-petal rotation + sway in the vertex shader)
//  • bokeh temple lights twinkling across the top band
//  • drifting gold dust with star glints
//  • four brass diyas bottom-left / bottom-right with flickering flames, halos and rising embers
import * as THREE from 'three'

const rand = (a, b) => a + Math.random() * (b - a)

// ---------- petals ----------
const PETAL_VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2 uSize;
  attribute vec4 aSeed; // x frac, fall speed, phase, size
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vShade;
  varying float vAlpha;
  varying vec2 vUv;

  mat3 rx(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
  mat3 ry(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
  mat3 rz(float a){ float c=cos(a), s=sin(a); return mat3(c,s,0., -s,c,0., 0.,0.,1.); }

  void main(){
    float span = uSize.y + 160.0;
    float fall = mod(aSeed.z * span + uTime * aSeed.y, span);
    float r = fract(aSeed.z * 13.7);
    float y = uSize.y + 80.0 - fall;
    float x = aSeed.x * uSize.x + sin(uTime * 0.55 + aSeed.z * 20.0) * 50.0 + fall * 0.10;
    x = mod(x + 60.0, uSize.x + 120.0) - 60.0;

    mat3 R = rz(uTime * 0.5 + r * 6.28) * ry(uTime * (0.7 + r * 0.6) + aSeed.z * 6.28) * rx(uTime * (0.9 + r) + r * 9.0);
    vec3 p = R * (position * aSeed.w);
    vec3 n = R * vec3(0.0, 0.0, 1.0);
    vShade = 0.5 + 0.5 * abs(n.z);
    vColor = aColor;
    vUv = uv;
    vAlpha = smoothstep(0.0, 90.0, fall) * (1.0 - smoothstep(span - 90.0, span, fall));
    gl_Position = projectionMatrix * viewMatrix * vec4(p + vec3(x, y, 0.0), 1.0);
  }
`
const PETAL_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vShade;
  varying float vAlpha;
  varying vec2 vUv;
  void main(){
    vec3 col = mix(vColor * 0.75, mix(vColor, vec3(1.0, 0.72, 0.68), 0.35), vUv.y);
    float vein = 1.0 - 0.18 * smoothstep(0.02, 0.0, abs(vUv.x - 0.5));
    gl_FragColor = vec4(col * vShade * vein, 0.94 * vAlpha);
  }
`

function petalGeometry() {
  const g = new THREE.PlaneGeometry(1, 1, 4, 8)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) + 0.5
    const v = pos.getY(i) + 0.5
    const w = Math.sin(Math.PI * Math.pow(v, 0.7)) // teardrop outline
    pos.setXYZ(i, (u - 0.5) * w * 0.75, v - 0.5, (u - 0.5) * (u - 0.5) * 0.9 + v * 0.12)
  }
  g.computeVertexNormals()
  return g
}

// ---------- sparkles: bokeh / dust / embers ----------
const SPARK_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uPx;
  attribute vec2 aBase;
  attribute vec2 aVel;
  attribute vec4 aMisc; // size, phase, period, kind (0 bokeh, 1 dust, 2 ember)
  attribute vec3 aColor;
  varying float vA;
  varying vec3 vC;
  varying float vKind;
  void main(){
    float period = aMisc.z;
    float age = fract(uTime / period + aMisc.y);
    float life = age * period;
    vec2 p = aBase + aVel * life;
    p.x += sin(life * 1.4 + aMisc.y * 40.0) * (4.0 + abs(aVel.y) * 0.22);
    float tw = 0.65 + 0.35 * sin(uTime * (2.0 + aMisc.y * 4.0) + aMisc.y * 50.0);
    float a = aMisc.w > 1.5 ? (1.0 - age) * smoothstep(0.0, 0.08, age) : sin(3.14159 * age) * tw;
    float size = aMisc.x * (aMisc.w > 1.5 ? (1.0 - age * 0.6) : 1.0);
    vA = a;
    vC = aColor;
    vKind = aMisc.w;
    gl_PointSize = size * uPx;
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 0.0, 1.0);
  }
`
const SPARK_FRAG = /* glsl */ `
  varying float vA;
  varying vec3 vC;
  varying float vKind;
  void main(){
    vec2 q = gl_PointCoord - 0.5;
    float d = length(q) * 2.0;
    if (d > 1.0) discard;
    float soft = pow(1.0 - d, 2.0);
    float a;
    if (vKind < 0.5) {
      a = smoothstep(1.0, 0.82, d) * 0.28 + soft * 0.55; // bokeh disc with a bright core
    } else if (vKind < 1.5) {
      float star = exp(-abs(q.x) * 46.0) * exp(-abs(q.y) * 5.0) + exp(-abs(q.y) * 46.0) * exp(-abs(q.x) * 5.0);
      a = soft * 0.7 + star * 0.9;
    } else {
      a = soft;
    }
    gl_FragColor = vec4(vC, a * vA);
  }
`

// ---------- diya flames (overlaid on the flames baked into the artwork) ----------
const FLAME_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const FLAME_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  void main(){
    float y = vUv.y;
    float t = uTime * 7.0 + uSeed * 10.0;
    float x = (vUv.x - 0.5) * 2.0;
    x += (sin(t + y * 5.0) * 0.10 + sin(t * 1.7 + y * 9.0) * 0.05) * y;
    float width = pow(max(1.0 - y, 0.0), 0.8) * 0.62 * (1.0 + 0.12 * sin(t * 1.3));
    float d = abs(x) / max(width, 0.001);
    float a = smoothstep(1.0, 0.15, d) * smoothstep(0.0, 0.12, y);
    float core = smoothstep(0.65, 0.0, d) * (1.0 - y);
    vec3 col = mix(vec3(1.0, 0.32, 0.04), vec3(1.0, 0.93, 0.6), core);
    gl_FragColor = vec4(col, a);
  }
`
const GLOW_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  void main(){
    float d = length(vUv - 0.5) * 2.0;
    float f = 0.82 + 0.12 * sin(uTime * 7.0 + uSeed * 10.0) + 0.06 * sin(uTime * 13.0 + uSeed * 4.0);
    float a = pow(max(1.0 - d, 0.0), 2.3) * 0.62 * f;
    gl_FragColor = vec4(1.0, 0.62, 0.22, a);
  }
`

// flame centres in the 1586 x 932 artwork: x, y, scale
const ART_W = 1586
const ART_H = 932
const DIYAS = [
  [83, 742, 1.0],
  [180, 835, 1.15],
  [13, 702, 0.7],
  [1502, 763, 1.0],
  [1421, 822, 0.9],
]

function buildScene(container, opts = {}) {
  const { artW = ART_W, artH = ART_H, diyas: DIYA_LIST = DIYAS, band = 0.2 } = opts
  const mobile = window.matchMedia('(max-width: 760px)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(dpr)
  const canvas = renderer.domElement
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
  container.appendChild(canvas)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 2000)
  camera.position.z = 1000

  let W = 1
  let H = 1
  const uTime = { value: 0 }
  const uSize = { value: new THREE.Vector2(1, 1) }
  const disposables = []

  // --- petals ---
  const petalCount = mobile ? 16 : 38
  const petalPalette = [
    [0.78, 0.07, 0.13], [0.9, 0.16, 0.22], [0.55, 0.04, 0.1],
    [0.98, 0.55, 0.1], [0.95, 0.75, 0.15],
  ].map((c) => c)
  const petalGeo = new THREE.InstancedBufferGeometry()
  const base = petalGeometry()
  petalGeo.index = base.index
  petalGeo.setAttribute('position', base.attributes.position)
  petalGeo.setAttribute('uv', base.attributes.uv)
  const seeds = new Float32Array(petalCount * 4)
  const cols = new Float32Array(petalCount * 3)
  for (let i = 0; i < petalCount; i++) {
    seeds.set([Math.random(), rand(28, 62), Math.random(), rand(13, 26) * (mobile ? 0.8 : 1)], i * 4)
    const c = Math.random() < 0.8 ? petalPalette[Math.floor(rand(0, 3))] : petalPalette[3 + Math.floor(rand(0, 2))]
    cols.set(c, i * 3)
  }
  petalGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 4))
  petalGeo.setAttribute('aColor', new THREE.InstancedBufferAttribute(cols, 3))
  petalGeo.instanceCount = petalCount
  const petalMat = new THREE.ShaderMaterial({
    vertexShader: PETAL_VERT,
    fragmentShader: PETAL_FRAG,
    uniforms: { uTime, uSize },
    transparent: true,
    depthTest: false,
    side: THREE.DoubleSide,
  })
  const petals = new THREE.Mesh(petalGeo, petalMat)
  petals.frustumCulled = false
  petals.renderOrder = 3
  scene.add(petals)
  disposables.push(petalGeo, base, petalMat)

  // --- sparkles (one Points object with three kinds) ---
  const nBokeh = mobile ? 34 : 70
  const nDust = mobile ? 45 : 95
  const embersPerDiya = mobile ? 8 : 14
  const nEmber = DIYA_LIST.length * embersPerDiya
  const nSpark = nBokeh + nDust + nEmber
  const aBase = new Float32Array(nSpark * 2)
  const aVel = new Float32Array(nSpark * 2)
  const aMisc = new Float32Array(nSpark * 4)
  const aColor = new Float32Array(nSpark * 3)
  const rnd = Array.from({ length: nSpark }, () => [Math.random(), Math.random()])
  const gold = [1.0, 0.78, 0.4]
  const warm = [1.0, 0.6, 0.22]
  const pale = [1.0, 0.92, 0.72]
  for (let i = 0; i < nSpark; i++) {
    if (i < nBokeh) {
      aMisc.set([rand(12, 46), Math.random(), rand(4, 9), 0], i * 4)
      aColor.set(Math.random() < 0.7 ? gold : warm, i * 3)
    } else if (i < nBokeh + nDust) {
      aMisc.set([rand(6, 14), Math.random(), rand(10, 18), 1], i * 4)
      aVel.set([rand(-4, 8), rand(10, 26)], i * 2)
      aColor.set(Math.random() < 0.5 ? gold : pale, i * 3)
    } else {
      aMisc.set([rand(4, 9), Math.random(), rand(1.6, 3.2), 2], i * 4)
      aVel.set([rand(-14, 14), rand(50, 110)], i * 2)
      aColor.set(warm, i * 3)
    }
  }
  const sparkGeo = new THREE.BufferGeometry()
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nSpark * 3), 3))
  const aBaseAttr = new THREE.BufferAttribute(aBase, 2)
  sparkGeo.setAttribute('aBase', aBaseAttr)
  sparkGeo.setAttribute('aVel', new THREE.BufferAttribute(aVel, 2))
  sparkGeo.setAttribute('aMisc', new THREE.BufferAttribute(aMisc, 4))
  sparkGeo.setAttribute('aColor', new THREE.BufferAttribute(aColor, 3))
  const sparkMat = new THREE.ShaderMaterial({
    vertexShader: SPARK_VERT,
    fragmentShader: SPARK_FRAG,
    uniforms: { uTime, uPx: { value: dpr } },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  })
  const sparks = new THREE.Points(sparkGeo, sparkMat)
  sparks.frustumCulled = false
  sparks.renderOrder = 4
  scene.add(sparks)
  disposables.push(sparkGeo, sparkMat)

  // --- diya flames ---
  const planeGeo = new THREE.PlaneGeometry(1, 1)
  disposables.push(planeGeo)
  const diyas = DIYA_LIST.map(([x, y, sc], i) => {
    const seed = i * 1.7 + 0.3
    const mk = (frag) => {
      const m = new THREE.ShaderMaterial({
        vertexShader: FLAME_VERT,
        fragmentShader: frag,
        uniforms: { uTime, uSeed: { value: seed } },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      })
      disposables.push(m)
      return m
    }
    const glow = new THREE.Mesh(planeGeo, mk(GLOW_FRAG))
    glow.renderOrder = 5
    const flame = new THREE.Mesh(planeGeo, mk(FLAME_FRAG))
    flame.renderOrder = 6
    scene.add(glow, flame)
    return { fx: x / artW, fy: y / artH, s: sc, glow, flame }
  })

  function layout() {
    const u = W / artW // artwork px -> screen px

    // bokeh across the lit temple band, dust everywhere
    for (let i = 0; i < nBokeh; i++) {
      aBase[i * 2] = rnd[i][0] * W
      aBase[i * 2 + 1] = H - (0.01 + rnd[i][1] * band) * H
    }
    for (let i = nBokeh; i < nBokeh + nDust; i++) {
      aBase[i * 2] = rnd[i][0] * W
      aBase[i * 2 + 1] = H - rnd[i][1] * H - 40
    }
    diyas.forEach((d, k) => {
      const cx = d.fx * W
      const cy = H - d.fy * H
      const r = 26 * u * d.s
      d.flame.scale.set(r * 0.62, r * 1.5, 1)
      d.flame.position.set(cx, cy + r * 0.05, 1)
      d.glow.scale.setScalar(r * 4.6)
      d.glow.position.set(cx, cy, 0.5)
      for (let e = 0; e < embersPerDiya; e++) {
        const i = nBokeh + nDust + k * embersPerDiya + e
        aBase[i * 2] = cx + (rnd[i][0] - 0.5) * r * 0.4
        aBase[i * 2 + 1] = cy + r * 0.6
      }
    })
    aBaseAttr.needsUpdate = true
  }

  function resize() {
    W = Math.max(1, container.clientWidth)
    H = Math.max(1, container.clientHeight)
    renderer.setSize(W, H, false)
    camera.left = 0
    camera.right = W
    camera.top = H
    camera.bottom = 0
    camera.updateProjectionMatrix()
    uSize.value.set(W, H)
    layout()
    renderer.render(scene, camera)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  // --- loop: only while on screen and the tab is visible ---
  let raf = 0
  let running = false
  let visible = false
  let last = performance.now()
  let t = reduced ? 4 : rand(0, 20)

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.1)
    last = now
    t += dt
    uTime.value = t
    renderer.render(scene, camera)
    if (running) raf = requestAnimationFrame(frame)
  }
  function sync() {
    const should = visible && !document.hidden && !reduced
    if (should && !running) {
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    } else if (!should && running) {
      running = false
      cancelAnimationFrame(raf)
    }
  }
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    sync()
  })
  io.observe(container)
  document.addEventListener('visibilitychange', sync)

  return {
    dispose() {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', sync)
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      renderer.forceContextLoss() // hand the GPU context back right away: phones only allow a handful at once
      canvas.remove()
    },
  }
}

// Each section has its own overlay, but a WebGL context (and its textures) is only created while the section is within
// about a screen and a half of the viewport, and released again once it is far away. This keeps start-up light on phones.
export function createAboutScene(container, opts = {}) {
  let inst = null
  let disposed = false
  const io = new IntersectionObserver(
    ([e]) => {
      if (disposed) return
      if (e.isIntersecting && !inst) inst = buildScene(container, opts)
      else if (!e.isIntersecting && inst) {
        inst.dispose()
        inst = null
      }
    },
    { rootMargin: '150% 0px 150% 0px' },
  )
  io.observe(container)
  return {
    dispose() {
      disposed = true
      io.disconnect()
      inst?.dispose()
      inst = null
    },
  }
}
