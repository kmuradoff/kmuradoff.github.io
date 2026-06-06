/* =====================================================================
   gsap-animations.js — GSAP + ScrollTrigger + Locomotive + VanillaTilt
   ===================================================================== */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VanillaTilt from 'vanilla-tilt'

gsap.registerPlugin(ScrollTrigger)

const SCROLLER = '[data-scroll-container]'

let ctx          = null
let progressEl   = null
let cursorGlow   = null
let cursorAdded  = false
let magnetClean  = []
let tiltEls      = []

/* ─── progress bar ─────────────────────────────────────────────── */
function ensureProgress() {
  if (progressEl) return
  progressEl = document.createElement('div')
  progressEl.id = 'cv-progress'
  Object.assign(progressEl.style, {
    position: 'fixed', top: '0', left: '0', height: '2px', zIndex: '300',
    background: 'linear-gradient(90deg,var(--accent),var(--accent-text),var(--cyan))',
    width: '0%', pointerEvents: 'none',
    boxShadow: '0 0 12px var(--accent)',
    opacity: '0', transition: 'opacity 0.3s',
  })
  document.body.appendChild(progressEl)
}

/* ─── cursor glow ──────────────────────────────────────────────── */
function ensureCursor() {
  if (cursorGlow) return
  cursorGlow = document.createElement('div')
  cursorGlow.id = 'cv-cursor-glow'
  Object.assign(cursorGlow.style, {
    position: 'fixed', pointerEvents: 'none', zIndex: '0',
    width: '520px', height: '520px', borderRadius: '50%',
    background: 'radial-gradient(circle,color-mix(in srgb,var(--accent) 8%,transparent) 0%,transparent 65%)',
    transform: 'translate(-50%,-50%)',
    left: '-300px', top: '-300px',
    opacity: '0', transition: 'opacity 0.5s',
  })
  document.body.appendChild(cursorGlow)
  if (!cursorAdded) {
    cursorAdded = true
    document.addEventListener('mousemove', (e) => {
      if (cursorGlow?.style.opacity !== '0') {
        gsap.to(cursorGlow, { left: e.clientX, top: e.clientY, duration: 0.6, ease: 'power2.out', overwrite: true })
      }
    })
  }
}

/* ─── Locomotive proxy setup ───────────────────────────────────── */
function setupLocoProxy() {
  const loco = window.__locoScroll
  if (!loco) return

  loco.on('scroll', ScrollTrigger.update)

  ScrollTrigger.scrollerProxy(SCROLLER, {
    scrollTop(value) {
      if (arguments.length) {
        loco.scrollTo(value, { duration: 0, disableLerp: true })
      } else {
        return loco.scroll.instance.scroll.y
      }
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
    },
    pinType: 'transform',
  })

  ScrollTrigger.addEventListener('refresh', () => loco.update())
}

/* ─── Vanilla Tilt ─────────────────────────────────────────────── */
function initTilt() {
  const cards = Array.from(document.querySelectorAll(
    '.xp-card, .proj-card, .edu-card, .gh-card'
  ))
  if (!cards.length) return
  VanillaTilt.init(cards, {
    max: 7,
    speed: 700,
    glare: true,
    'max-glare': 0.1,
    scale: 1.025,
    perspective: 1400,
    gyroscope: false,
  })
  tiltEls = cards
}

function killTilt() {
  tiltEls.forEach(el => el.vanillaTilt?.destroy())
  tiltEls = []
}

/* ─── magnetic hover on chips ─────────────────────────────────── */
function bindMagnetic() {
  document.querySelectorAll('.chip, .tb-icon, .btn-pdf').forEach(el => {
    const onMove = (e) => {
      const r  = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.2
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.2
      gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: 'power2.out', overwrite: true })
    }
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,0.5)', overwrite: true })
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    magnetClean.push(() => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.set(el, { clearProps: 'x,y' })
    })
  })
}

/* ─── MAIN INIT ────────────────────────────────────────────────── */
export function initGSAP() {
  if (document.body.classList.contains('mode-plain')) return

  /* kill previous */
  if (ctx) { ctx.revert(); ctx = null }
  ScrollTrigger.getAll().forEach(t => t.kill())
  magnetClean.forEach(fn => fn()); magnetClean = []
  killTilt()

  setupLocoProxy()

  ensureProgress()
  ensureCursor()
  requestAnimationFrame(() => {
    if (progressEl) progressEl.style.opacity = '1'
    if (cursorGlow)  cursorGlow.style.opacity  = '1'
  })

  ctx = gsap.context(() => {

    /* ── 1. scroll progress bar ── */
    gsap.to(progressEl, {
      width: '100%', ease: 'none',
      scrollTrigger: {
        scroller: SCROLLER,
        trigger: document.body,
        start: 'top top', end: 'bottom bottom',
        scrub: 0.1,
      },
    })

    /* ── 2. hero entrance ── */
    const atTop = (window.scrollY || 0) < window.innerHeight * 0.4
    if (atTop) {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.hero-deco',      { opacity: 0, scale: 0.96 },             { opacity: 1, scale: 1, duration: 2.2, ease: 'power2.out' }, 0)
        .fromTo('.hero-status',    { y: 30, opacity: 0 },                   { y: 0, opacity: 1, duration: 0.7, delay: 0.15 }, 0)
        .fromTo('.hero-name',      { y: 72, opacity: 0, skewX: 4, filter: 'blur(8px)' },
                                   { y: 0,  opacity: 1, skewX: 0, filter: 'blur(0px)', duration: 1.1 }, '-=0.4')
        .fromTo('.hero-role',      { y: 30, opacity: 0 },                   { y: 0, opacity: 1, duration: 0.7 }, '-=0.6')
        .fromTo('.hero-tag',       { y: 20, opacity: 0 },                   { y: 0, opacity: 1, duration: 0.65 }, '-=0.5')
        .fromTo('.hero-cta .chip', { y: 20, opacity: 0, scale: 0.88 },      { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.07 }, '-=0.4')
        .fromTo('.scroll-cue',     { opacity: 0 },                          { opacity: 0.6, duration: 0.5 }, '-=0.2')
    } else {
      gsap.set(['.hero-deco','.hero-status','.hero-name','.hero-role','.hero-tag','.hero-cta .chip','.scroll-cue'],
               { opacity: 1, y: 0, skewX: 0, scale: 1, filter: 'blur(0px)' })
    }

    /* ── 3. section number slide-in ── */
    gsap.utils.toArray('.section-num').forEach(el => {
      gsap.fromTo(el, { x: -32, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.65, ease: 'power2.out',
        scrollTrigger: { scroller: SCROLLER, trigger: el, start: 'top 91%', once: true },
      })
    })

    /* ── 4. section title clip-path reveal ── */
    gsap.utils.toArray('.section-title').forEach(el => {
      gsap.fromTo(el,
        { clipPath: 'inset(0 100% 0 0)', y: 16, opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)', y: 0, opacity: 1,
          duration: 0.95, ease: 'power3.inOut',
          scrollTrigger: { scroller: SCROLLER, trigger: el, start: 'top 89%', once: true },
        }
      )
    })

    /* ── 5. generic reveals ── */
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.closest('.hero')) return
      if (el.classList.contains('tl-item'))   return
      if (el.classList.contains('proj-card')) return
      gsap.fromTo(el, { y: 44, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, ease: 'power2.out',
        scrollTrigger: { scroller: SCROLLER, trigger: el, start: 'top 89%', once: true },
      })
    })

    /* ── 6. experience cards: alternate slide ── */
    document.querySelectorAll('.tl-item').forEach((el, i) => {
      gsap.fromTo(el, { x: i % 2 === 0 ? -64 : 64, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { scroller: SCROLLER, trigger: el, start: 'top 88%', once: true },
      })
    })

    /* ── 7. project cards stagger ── */
    ScrollTrigger.batch('.proj-card', {
      scroller: SCROLLER,
      onEnter: batch => gsap.fromTo(batch,
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.75, stagger: 0.12, ease: 'power2.out' }
      ),
      start: 'top 88%', once: true,
    })

    /* ── 8. skill cards stagger ── */
    ScrollTrigger.batch('.skill-card', {
      scroller: SCROLLER,
      onEnter: batch => gsap.fromTo(batch,
        { x: 28, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out' }
      ),
      start: 'top 90%', once: true,
    })

    /* ── 9. stack tags pop-in ── */
    ScrollTrigger.batch('.stack-cats .tag', {
      scroller: SCROLLER,
      onEnter: batch => gsap.fromTo(batch,
        { scale: 0.68, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.018, ease: 'back.out(1.8)' }
      ),
      start: 'top 91%', once: true,
    })

    /* ── 10. github heatmap cascade ── */
    const heatCells = gsap.utils.toArray('.heat-cell')
    if (heatCells.length) {
      gsap.fromTo(heatCells, { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.3,
        stagger: { each: 0.0024, from: 'random' },
        ease: 'back.out(1.5)',
        scrollTrigger: { scroller: SCROLLER, trigger: '.heatmap', start: 'top 86%', once: true },
      })
    }

    /* ── 11. contact big text ── */
    const cb = document.querySelector('.contact-big')
    if (cb) {
      gsap.fromTo(cb, { scale: 0.84, opacity: 0, y: 36 }, {
        scale: 1, opacity: 1, y: 0, duration: 1.15, ease: 'power3.out',
        scrollTrigger: { scroller: SCROLLER, trigger: cb, start: 'top 83%', once: true },
      })
    }

    /* ── 12. section ambient parallax scrub ── */
    gsap.utils.toArray('.section:not(.hero)').forEach(sec => {
      const num = sec.querySelector('.section-num')
      if (!num) return
      gsap.fromTo(num, { y: -12 }, {
        y: 12, ease: 'none',
        scrollTrigger: {
          scroller: SCROLLER,
          trigger: sec,
          start: 'top bottom', end: 'bottom top',
          scrub: 1.5,
        },
      })
    })

    /* ── 13. hero canvas parallax ── */
    gsap.to('.hero-canvas-wrap', {
      yPercent: 28, ease: 'none',
      scrollTrigger: {
        scroller: SCROLLER,
        trigger: '.hero',
        start: 'top top', end: 'bottom top',
        scrub: true,
      },
    })

  })

  /* ── outside context: events & tilt ── */
  bindMagnetic()

  /* small delay so DOM is settled */
  setTimeout(initTilt, 120)

  ScrollTrigger.refresh()
}

/* ─── KILL ──────────────────────────────────────────────────────── */
export function killGSAP() {
  if (ctx) { ctx.revert(); ctx = null }
  ScrollTrigger.getAll().forEach(t => t.kill())
  magnetClean.forEach(fn => fn()); magnetClean = []
  killTilt()
  if (progressEl) progressEl.style.opacity = '0'
  if (cursorGlow)  cursorGlow.style.opacity  = '0'
}
