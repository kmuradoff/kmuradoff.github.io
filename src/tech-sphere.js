/* =====================================================================
   3D TECH SPHERE — rotating tag cloud of technologies.
   Three.js ES module version.
   ===================================================================== */
import * as THREE from 'three'
import { CV } from './data.js'

export function initTechSphere(container, opts = {}) {
  const words = []
  CV.stack.forEach((c) => c.items.forEach((w) => words.push(w)))

  function cssVar(name, fb) {
    const v = getComputedStyle(document.body).getPropertyValue(name).trim()
    return v || fb
  }

  const W0 = container.clientWidth || 440
  const H0 = container.clientHeight || 440

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, W0 / H0, 0.1, 100)
  camera.position.set(0, 0, 12.5)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(W0, H0)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  const root = new THREE.Group()
  scene.add(root)

  function makeTag(text, accent) {
    const fs = 38, padX = 12, padY = 8
    const c = document.createElement('canvas')
    let ctx = c.getContext('2d')
    ctx.font = `600 ${fs}px "JetBrains Mono", monospace`
    const tw = Math.ceil(ctx.measureText(text).width)
    c.width = tw + padX * 2; c.height = fs + padY * 2
    ctx = c.getContext('2d')
    ctx.font = `600 ${fs}px "JetBrains Mono", monospace`
    ctx.textBaseline = 'middle'
    ctx.fillStyle = accent ? cssVar('--green-bright', '#8fd957') : cssVar('--text', '#e7efec')
    ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 6
    ctx.fillText(text, padX, c.height / 2 + 1)
    const tex = new THREE.CanvasTexture(c)
    tex.minFilter = THREE.LinearFilter
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
    const sp = new THREE.Sprite(mat)
    const scale = 0.0125
    sp.scale.set(c.width * scale, c.height * scale, 1)
    sp._w = text; sp._accentBase = !!accent
    return sp
  }

  const R = 5.2
  const N = words.length
  const tags = []
  words.forEach((w, i) => {
    // offset by 0.5 so no word lands exactly on the pole (fixes "Java 17 frozen at top")
    const y = 1 - ((i + 0.5) / N) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const phi = i * Math.PI * (3 - Math.sqrt(5))
    const sp = makeTag(w, i % 4 === 0)
    sp.position.set(Math.cos(phi) * r, y, Math.sin(phi) * r).multiplyScalar(R)
    root.add(sp)
    tags.push(sp)
  })

  // ---- drag to rotate ----
  let dragging = false, px = 0, py = 0
  let velX = 0.0016, velY = 0.0028
  function down(e) { dragging = true; px = e.clientX; py = e.clientY }
  function move(e) {
    if (!dragging) return
    const dx = e.clientX - px, dy = e.clientY - py
    px = e.clientX; py = e.clientY
    velY = dx * 0.00045
    velX = dy * 0.00045
  }
  function up() { dragging = false }
  const el = renderer.domElement
  el.addEventListener('pointerdown', down)
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)

  function resize() {
    const w = container.clientWidth, h = container.clientHeight
    if (!w || !h) return
    camera.aspect = w / h; camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)

  function setTheme() {
    tags.forEach((sp) => {
      const accent = sp._accentBase
      const fresh = makeTag(sp._w, accent)
      sp.material.map.dispose()
      sp.material.map = fresh.material.map
      sp.material.needsUpdate = true
    })
  }

  let raf = 0, running = true
  function frame() {
    if (!running) return
    if (!dragging) {
      velY += (0.0026 - velY) * 0.02
      velX += (0.0009 - velX) * 0.02
    }
    root.rotation.y += velY
    root.rotation.x += velX
    root.rotation.x = Math.max(-0.6, Math.min(0.6, root.rotation.x))

    tags.forEach((sp) => {
      const wp = sp.getWorldPosition(new THREE.Vector3())
      const z = wp.z
      const t = (z + R) / (2 * R)
      sp.material.opacity = 0.28 + t * 0.72
    })

    renderer.render(scene, camera)
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  return {
    setTheme,
    pause() { running = false; cancelAnimationFrame(raf) },
    resume() { if (!running) { running = true; raf = requestAnimationFrame(frame) } },
    dispose() {
      running = false; cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      renderer.dispose()
      if (el.parentNode) el.parentNode.removeChild(el)
    },
  }
}
