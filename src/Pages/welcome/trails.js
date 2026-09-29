// Gold sparkle trails that flow INWARD along the curves of the mockup, looping forever:
//  • top-left trail sweeps down-right toward the title
//  • top-right trail sweeps down-left toward the title
//  • bottom trails run along the floor from both sides toward the centre
// Each path is sampled into a small float texture; particles ride it on the GPU.
import * as THREE from 'three'

// Paths traced from the reference (screen px of a 2000 x 1112 frame, outer end → inner end).
// 119.6 px = 1 world unit at that frame size; (1000, 556) is the centre.
const REF = { cx: 1000, cy: 556, unit: 119.6 }
const PATHS_PX = [
  // top-left: main trail with its curl, ending just left of the title
  { w: 1.0, pts: [[30, 60], [150, 190], [320, 240], [415, 330], [435, 460], [520, 555], [690, 575]] },
  // top-left: upper sister trail
  { w: 0.7, pts: [[10, 120], [230, 150], [440, 250], [600, 400], [720, 520]] },
  // top-right: main trail sweeping down-left to the right of the title
  { w: 1.0, pts: [[1990, 70], [1860, 100], [1770, 230], [1650, 370], [1540, 470], [1420, 560], [1300, 640]] },
  // top-right: lower sister trail
  { w: 0.7, pts: [[1995, 300], [1820, 390], [1620, 460], [1450, 520], [1330, 590]] },
  // bottom-left: along the floor toward the centre
  { w: 0.85, pts: [[10, 800], [190, 860], [420, 925], [690, 955], [930, 968]] },
  // bottom-right: along the floor toward the centre
  { w: 0.85, pts: [[1990, 840], [1760, 880], [1510, 925], [1230, 955], [1070, 968]] },
]
const SAMPLES = 256

function buildPathTexture() {
  const data = new Float32Array(SAMPLES * PATHS_PX.length * 4)
  PATHS_PX.forEach((path, row) => {
    const curve = new THREE.CatmullRomCurve3(
      path.pts.map(([x, y]) => new THREE.Vector3((x - REF.cx) / REF.unit, (REF.cy - y) / REF.unit, 0)),
      false,
      'centripetal'
    )
    const pts = curve.getSpacedPoints(SAMPLES - 1)
    pts.forEach((p, i) => data.set([p.x, p.y, 0, 1], (row * SAMPLES + i) * 4))
  })
  const tex = new THREE.DataTexture(data, SAMPLES, PATHS_PX.length, THREE.RGBAFormat, THREE.FloatType)
  tex.minFilter = tex.magFilter = THREE.NearestFilter
  tex.needsUpdate = true
  return tex
}

export function makeGoldTrails(mobile) {
  const DUST_PER_PATH = mobile ? 110 : 220
  const COMETS_PER_PATH = mobile ? 4 : 7
  const TAIL = 9
  const rows = PATHS_PX.length
  const count = rows * (DUST_PER_PATH + COMETS_PER_PATH * TAIL)

  const aData = new Float32Array(count * 4) // phase, speed, path row, random
  const aExtra = new Float32Array(count * 3) // tail index (-1 = dust), spread, size
  let i = 0
  for (let r = 0; r < rows; r++) {
    for (let k = 0; k < DUST_PER_PATH; k++, i++) {
      aData.set([Math.random(), 0.05 + Math.random() * 0.07, r, Math.random()], i * 4)
      aExtra.set([-1, (0.35 + Math.random() * 0.65) * PATHS_PX[r].w, 1.2 + Math.random() * 3.2], i * 3)
    }
    for (let c = 0; c < COMETS_PER_PATH; c++) {
      const phase = Math.random()
      const speed = 0.09 + Math.random() * 0.06
      const rnd = Math.random()
      for (let t = 0; t < TAIL; t++, i++) {
        aData.set([phase, speed, r, rnd], i * 4)
        aExtra.set([t, 0.25 * PATHS_PX[r].w, t === 0 ? 9 : 6 * (1 - t / TAIL) + 1], i * 3)
      }
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
  geo.setAttribute('aData', new THREE.BufferAttribute(aData, 4))
  geo.setAttribute('aExtra', new THREE.BufferAttribute(aExtra, 3))

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uPaths: { value: buildPathTexture() },
      uRows: { value: rows },
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uPixel: { value: 1 },
      uBurst: { value: 0 },
    },
    vertexShader: /* glsl */ `
      #define SAMPLES ${SAMPLES}.0
      attribute vec4 aData; attribute vec3 aExtra;
      uniform sampler2D uPaths; uniform float uRows, uTime, uPixel, uBurst;
      varying float vAlpha; varying float vHue; varying float vHead;

      vec2 pathAt(float s, float row){
        float x = clamp(s, 0.0, 1.0) * (SAMPLES - 1.0);
        float i0 = floor(x);
        float v = (row + 0.5) / uRows;
        vec2 a = texture2D(uPaths, vec2((i0 + 0.5) / SAMPLES, v)).xy;
        vec2 b = texture2D(uPaths, vec2((min(i0 + 1.0, SAMPLES - 1.0) + 0.5) / SAMPLES, v)).xy;
        return mix(a, b, x - i0);
      }

      void main(){
        float tail = aExtra.x;
        bool comet = tail >= 0.0;
        float s = fract(aData.x + uTime * aData.y) - (comet ? tail * 0.0075 : 0.0);
        float row = aData.z, rnd = aData.w;

        vec2 p = pathAt(s, row);
        vec2 tg = normalize(pathAt(s + 0.01, row) - pathAt(s - 0.01, row) + 1e-5);
        vec2 nrm = vec2(-tg.y, tg.x);

        // dust spreads into a ribbon that narrows as it reaches the title, and swirls gently
        float spread = aExtra.y * (1.0 - 0.55 * s);
        float off = (rnd - 0.5) * spread + sin(s * 18.0 + uTime * 1.6 + rnd * 40.0) * 0.07 * aExtra.y;
        if (comet) off = sin(s * 9.0 + rnd * 20.0) * 0.08;
        vec3 pos = vec3(p + nrm * off, 0.15 + rnd * 0.3);

        pos.xy += normalize(pos.xy + 0.001) * uBurst * 3.0;

        float ends = smoothstep(0.0, 0.07, s) * (1.0 - smoothstep(0.86, 1.0, s));
        float tw = comet ? 1.0 : 0.55 + 0.45 * sin(uTime * 6.0 + rnd * 60.0);
        float tailFade = comet ? pow(1.0 - tail / 9.0, 1.4) : 1.0;
        vAlpha = ends * tw * tailFade * step(0.0, s);
        vHue = comet ? 0.85 : rnd;
        vHead = comet && tail == 0.0 ? 1.0 : 0.0;

        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aExtra.z * uPixel * (8.0 / -mv.z) * (0.75 + 0.25 * sin(uTime * 3.0 + rnd * 20.0));
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying float vAlpha; varying float vHue; varying float vHead;
      void main(){
        vec2 p = gl_PointCoord - 0.5; float d = length(p);
        float core = exp(-d*d*60.0), halo = exp(-d*d*12.0)*0.4;
        float star = exp(-abs(p.x)*38.0)*exp(-abs(p.y)*5.0) + exp(-abs(p.y)*38.0)*exp(-abs(p.x)*5.0);
        vec3 col = mix(vec3(1.0,0.68,0.26), vec3(1.0,0.93,0.72), vHue);
        float a = (core + halo + star * (0.3 + vHead * 0.7)) * vAlpha * uOpacity;
        gl_FragColor = vec4(col * a * (1.0 + vHead * 0.6), a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const pts = new THREE.Points(geo, mat)
  pts.frustumCulled = false
  pts.renderOrder = 6
  return pts
}
