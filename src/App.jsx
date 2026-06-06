/* =====================================================================
   App.jsx — root: toolbar + Locomotive Scroll + GSAP lifecycle
   ===================================================================== */
import { useState, useEffect, useRef } from 'react'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'

import { CV } from './data.js'
import { initTechSphere } from './tech-sphere.js'
import { initGSAP, killGSAP } from './gsap-animations.js'
import { Terminal } from './Terminal.jsx'
import {
  Icon, Hero, About, Experience, Stack, Projects, EduSkills, GitHub, Contact,
} from './Sections.jsx'

function detectTheme() {
  const saved = localStorage.getItem('cv-theme')
  if (saved) return saved
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function TermIcon(p) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...p}>
      <rect x="2" y="3" width="20" height="18" rx="3"/>
      <path d="M6 9l4 3-4 3M13 15h5"/>
    </svg>
  )
}

function Toolbar({ T, lang, setLang, theme, setTheme, mode, setMode, onDownload, onTerminal }) {
  return (
    <div className="toolbar">
      <div className="tb-brand">
        <span className="dot"></span>
        <span className="name-full">{T.name}</span>
      </div>
      <div className="tb-spacer"></div>

      <button className="tb-icon tb-term-btn" aria-label="open terminal" onClick={onTerminal} title="Interactive terminal (~)">
        <TermIcon />
      </button>

      <div className="seg" role="tablist" aria-label="mode">
        <button className={mode === 'anim'  ? 'on' : ''} onClick={() => setMode('anim')}>{T.ui.mode_anim}</button>
        <button className={mode === 'plain' ? 'on' : ''} onClick={() => setMode('plain')}>{T.ui.mode_plain}</button>
      </div>

      <div className="seg" role="tablist" aria-label="language">
        <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>RU</button>
        <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
      </div>

      <button className="tb-icon" aria-label="toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <Icon.sun /> : <Icon.moon />}
      </button>

      <button className="btn-pdf" onClick={onDownload}>
        <Icon.download /><span className="label">{T.ui.download}</span>
      </button>
    </div>
  )
}

export default function App() {
  const [lang,     setLang]     = useState(() => localStorage.getItem('cv-lang')  || 'ru')
  const [theme,    setTheme]    = useState(detectTheme)
  const [mode,     setMode]     = useState(() => localStorage.getItem('cv-mode')  || 'anim')
  const [terminal, setTerminal] = useState(false)

  const sphereCtl = useRef(null)
  const locoRef   = useRef(null)

  const T    = CV[lang]
  const meta = CV.meta

  /* ─── ~ (tilde) to open terminal ── */
  useEffect(() => {
    const onKey = (e) => {
      // tilde: key='~' or key='`' with shift, but simplest: check key directly
      if (e.key === '~' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = document.activeElement?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        setTerminal(t => !t)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* ─── persist + apply theme ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('cv-theme', theme)
    sphereCtl.current?.setTheme(theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('cv-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    document.body.classList.toggle('mode-anim',  mode === 'anim')
    document.body.classList.toggle('mode-plain', mode === 'plain')
    localStorage.setItem('cv-mode', mode)
  }, [mode])

  /* ─── Locomotive Scroll (init once) ── */
  useEffect(() => {
    const el = document.querySelector('[data-scroll-container]')
    if (!el) return

    const loco = new LocomotiveScroll({
      el,
      smooth: true,
      lerp: 0.075,
      multiplier: 0.9,
      smartphone: { smooth: true, lerp: 0.1 },
      tablet:     { smooth: true, lerp: 0.1 },
    })

    locoRef.current      = loco
    window.__locoScroll  = loco

    return () => {
      loco.destroy()
      locoRef.current     = null
      window.__locoScroll = null
    }
  }, [])

  /* ─── update Locomotive on content change ── */
  useEffect(() => {
    const id = setTimeout(() => locoRef.current?.update(), 400)
    return () => clearTimeout(id)
  }, [lang, mode])

  /* ─── tech sphere ── */
  useEffect(() => {
    let cancelled = false
    function mount() {
      if (cancelled) return
      const sphereEl = document.getElementById('tech-sphere')
      if (sphereEl && !sphereCtl.current) {
        sphereCtl.current = initTechSphere(sphereEl, { theme })
      }
    }
    if (mode === 'anim') {
      const id = requestAnimationFrame(() => requestAnimationFrame(mount))
      return () => { cancelled = true; cancelAnimationFrame(id) }
    } else {
      sphereCtl.current?.dispose()
      sphereCtl.current = null
    }
  }, [mode])

  useEffect(() => () => sphereCtl.current?.dispose(), [])

  /* ─── GSAP + Locomotive proxy ── */
  useEffect(() => {
    if (mode === 'plain') {
      killGSAP()
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'))
      return
    }

    const id = requestAnimationFrame(() => requestAnimationFrame(() => {
      initGSAP()
    }))
    return () => {
      cancelAnimationFrame(id)
      killGSAP()
    }
  }, [lang, mode])

  /* ─── download PDF ── */
  function onDownload() {
    if (mode !== 'plain') {
      setMode('plain')
      document.body.classList.add('mode-plain')
      document.body.classList.remove('mode-anim')
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'))
      setTimeout(() => window.print(), 400)
    } else {
      window.print()
    }
  }

  return (
    <>
      {/* Toolbar is OUTSIDE the scroll container so Locomotive transforms don't affect fixed positioning */}
      <Toolbar T={T} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme}
               mode={mode} setMode={setMode} onDownload={onDownload}
               onTerminal={() => setTerminal(t => !t)} />

      {terminal && <Terminal onClose={() => setTerminal(false)} />}

      {/* Locomotive Scroll container */}
      <main data-scroll-container>
        <div className="shell">
          <Hero T={T} meta={meta} />
          <About T={T} />
          <Experience T={T} />
          <Stack T={T} lang={lang} />
          <Projects T={T} />
          <EduSkills T={T} lang={lang} />
          <GitHub T={T} meta={meta} />
          <Contact T={T} meta={meta} />
          <div className="footer wrap">
            {T.name}<span className="sep">·</span>{T.role}<span className="sep">·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </main>
    </>
  )
}
