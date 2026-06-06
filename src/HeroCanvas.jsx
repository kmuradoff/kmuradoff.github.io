/* =====================================================================
   HeroCanvas.jsx — WebGL animated mesh-gradient background
   No particles, no geometry — just smooth organic color motion.
   Premium aesthetic (à la Stripe / Linear / Vercel).
   ===================================================================== */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERT = /* glsl */`
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

const FRAG = /* glsl */`
  precision mediump float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;

  /* ── Gradient-noise helpers ── */
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }
  float gnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
          dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
      mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
          dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x),
    u.y) * 0.5 + 0.5;
  }

  /* ── Soft radial blob ── */
  float blob(vec2 uv, vec2 center, float radius) {
    float d = length(uv - center);
    return smoothstep(radius, 0.0, d);
  }

  void main() {
    vec2 uv  = gl_FragCoord.xy / uResolution;
    vec2 uvA = uv - 0.5;                        /* aspect-correct */
    uvA.x   *= uResolution.x / uResolution.y;

    float t = uTime * 0.07;

    /* ── organic noise fields ── */
    float n1 = gnoise(uv * 1.8 + vec2( t * 0.55,  t * 0.38));
    float n2 = gnoise(uv * 2.3 - vec2( t * 0.32,  t * 0.60));
    float n3 = gnoise(uv * 1.4 + vec2(-t * 0.28,  t * 0.45));

    /* ── blob centres: slow drift ── */
    vec2 c1 = vec2(0.18 + n1 * 0.14,  0.90 + n2 * 0.08);   /* green — bottom-left   */
    vec2 c2 = vec2(0.82 + n2 * 0.10,  0.35 + n3 * 0.13);   /* teal  — right         */
    vec2 c3 = vec2(0.50 + n3 * 0.07,  0.12 + n1 * 0.07);   /* green — top-centre    */
    vec2 c4 = vec2(0.30 + n1 * 0.08,  0.45 + n2 * 0.10);   /* faint purple — mid    */

    /* ── mouse warmth (very gentle) ── */
    vec2 mouse = uMouse;
    float dm = length(uv - mouse);

    /* ── base background ── */
    vec3 col = vec3(0.029, 0.044, 0.040);

    /* ── spring-green blobs ── */
    col += vec3(0.12, 0.32, 0.08) * blob(uv, c1, 0.55) * 0.55;
    col += vec3(0.10, 0.26, 0.06) * blob(uv, c3, 0.48) * 0.40;

    /* ── teal blob ── */
    col += vec3(0.018, 0.14, 0.13) * blob(uv, c2, 0.52) * 0.45;

    /* ── very faint purple-grey ── */
    col += vec3(0.08, 0.05, 0.12) * blob(uv, c4, 0.40) * 0.18;

    /* ── mouse glow (subtle warm green) ── */
    col += vec3(0.06, 0.16, 0.04) * smoothstep(0.38, 0.0, dm) * 0.22;

    /* ── radial vignette ── */
    float vig = length(uv - 0.5) * 1.4;
    col *= 1.0 - vig * 0.45;

    /* ── very subtle noise grain (reduces banding) ── */
    float grain = (gnoise(uv * 180.0 + t * 4.0) - 0.5) * 0.012;
    col = clamp(col + grain, 0.0, 1.0);

    gl_FragColor = vec4(col, 0.95);
  }
`

export function HeroCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth  || window.innerWidth
    const H = mount.clientHeight || window.innerHeight

    /* ── scene / camera / renderer ── */
    const scene    = new THREE.Scene()
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    /* ── fullscreen quad ── */
    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:       { value: 0 },
        uResolution: { value: new THREE.Vector2(W, H) },
        uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader:   VERT,
      fragmentShader: FRAG,
      transparent:    true,
      depthWrite:     false,
    })
    scene.add(new THREE.Mesh(geo, mat))

    /* ── mouse ── */
    const target = { x: 0.5, y: 0.5 }
    const smooth = { x: 0.5, y: 0.5 }
    const onMove = (e) => {
      target.x = e.clientX / window.innerWidth
      target.y = 1 - e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMove)

    /* ── resize ── */
    const ro = new ResizeObserver(() => {
      const nW = mount.clientWidth, nH = mount.clientHeight
      if (!nW || !nH) return
      renderer.setSize(nW, nH)
      mat.uniforms.uResolution.value.set(nW, nH)
    })
    ro.observe(mount)

    /* ── animation ── */
    const clock = new THREE.Clock()
    let raf

    function tick() {
      raf = requestAnimationFrame(tick)

      smooth.x += (target.x - smooth.x) * 0.045
      smooth.y += (target.y - smooth.y) * 0.045

      mat.uniforms.uTime.value = clock.getElapsedTime()
      mat.uniforms.uMouse.value.set(smooth.x, smooth.y)

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
      geo.dispose()
      mat.dispose()
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={mountRef} className="hero-canvas-wrap" aria-hidden="true" />
  )
}
