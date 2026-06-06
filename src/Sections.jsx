/* =====================================================================
   Sections.jsx — all presentational section components
   ===================================================================== */
import { CV } from './data.js'
import { HeroCanvas } from './HeroCanvas.jsx'

/* ---------------- icons ---------------- */
export const Icon = {
  github:   (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 1.5A10.5 10.5 0 0 0 8.68 22c.52.1.71-.23.71-.5v-1.9c-2.9.64-3.52-1.24-3.52-1.24-.48-1.2-1.16-1.52-1.16-1.52-.95-.65.07-.64.07-.64 1.05.08 1.6 1.08 1.6 1.08.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.66-1.4-2.32-.26-4.76-1.16-4.76-5.15 0-1.14.4-2.07 1.07-2.8-.1-.27-.46-1.32.1-2.76 0 0 .88-.28 2.88 1.07a9.9 9.9 0 0 1 5.24 0c2-1.35 2.88-1.07 2.88-1.07.56 1.44.2 2.49.1 2.76.67.73 1.07 1.66 1.07 2.8 0 4-2.45 4.88-4.78 5.14.38.32.71.95.71 1.92v2.85c0 .28.19.61.72.5A10.5 10.5 0 0 0 12 1.5Z"/></svg>),
  linkedin: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.74C24 .78 23.2 0 22.22 0Z"/></svg>),
  telegram: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23.1 2.2 19.6 20.5c-.26 1.17-.95 1.46-1.93.9l-5.32-3.92-2.57 2.47c-.28.28-.52.52-1.07.52l.38-5.4 9.84-8.9c.43-.38-.1-.6-.66-.22L6.1 13.1.85 11.46c-1.14-.36-1.16-1.14.24-1.69L21.63.52c.95-.36 1.78.22 1.47 1.68Z"/></svg>),
  mail:     (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 6 9 6.5L21 6"/></svg>),
  hh:       (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><text x="2" y="18" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="bold">hh</text></svg>),
  download: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 20h16"/></svg>),
  sun:      (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...p}><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>),
  moon:     (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/></svg>),
}

/* ---------------- section wrapper ---------------- */
export function Section({ id, num, title, sub, children, label }) {
  return (
    <section className="section" id={id} data-scroll-section data-screen-label={label}>
      <div className="wrap">
        <div className="section-head reveal">
          {num && <span className="section-num">// {num}</span>}
          <h2 className="section-title">{title}</h2>
          {sub && <p className="section-sub">{sub}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

/* ---------------- HERO ---------------- */
export function Hero({ T, meta }) {
  return (
    <section className="section hero" id="top" data-scroll-section data-screen-label="Hero">
      <HeroCanvas />

      {/* Decorative background brackets */}
      <div className="hero-deco" aria-hidden="true">
        <span className="hero-deco-bracket hero-deco-bracket--open">{'{'}</span>
        <span className="hero-deco-bracket hero-deco-bracket--close">{'}'}</span>
      </div>

      <div className="wrap" style={{ display: 'contents' }}>
        <div className="hero-left" data-scroll data-scroll-speed="-1">

          <div className="hero-eyebrow">
            <div className="hero-status reveal">
              <span className="pulse"></span>
              {T.available}
            </div>
            <span className="hero-eyebrow-line" aria-hidden="true"></span>
          </div>

          <h1 className="hero-name reveal">{T.name}</h1>
          <div className="hero-role reveal">{T.role}<span className="caret"></span></div>
          <p className="hero-tag reveal">{T.tagline}</p>

          <div className="hero-cta reveal">
            <a className="chip primary" href={"mailto:" + meta.email}><Icon.mail /> {meta.email}</a>
            <div className="hero-cta-secondary">
              <a className="chip" href={meta.github} target="_blank" rel="noopener"><Icon.github /> GitHub</a>
              <a className="chip" href={meta.linkedin} target="_blank" rel="noopener"><Icon.linkedin /> LinkedIn</a>
              <a className="chip" href={meta.telegram} target="_blank" rel="noopener"><Icon.telegram /> Telegram</a>
              <a className="chip" href={meta.hh} target="_blank" rel="noopener"><Icon.hh /> hh.ru</a>
            </div>
          </div>

        </div>
      </div>
      <div className="scroll-cue"><span className="bar"></span>{T.ui.scroll}</div>
    </section>
  )
}

/* ---------------- ABOUT (terminal) ---------------- */
export function About({ T }) {
  return (
    <Section id="about" num="01" title={T.sections.about} label={T.sections.about}>
      <div className="reveal">
        <div className="term">
          <div className="term-bar">
            <span className="tl r"></span><span className="tl y"></span><span className="tl g"></span>
            <span className="title">~/kamal/about.java</span>
          </div>
          <div className="term-body">
            <span className="ln cmt">// {T.tagline}</span>
            <span className="ln"><span className="kw">public class</span> <span className="fn">Developer</span> {"{"}</span>
            <span className="ln">&nbsp;&nbsp;<span className="kw">String</span> role = <span className="str">"{T.role}"</span>;</span>
            <span className="ln">{"}"}</span>
            <p className="term-prose">{T.summary}</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ---------------- EXPERIENCE ---------------- */
export function Experience({ T }) {
  return (
    <Section id="experience" num="02" title={T.sections.experience} label={T.sections.experience}>
      <div className="timeline">
        {T.experience.map((x, i) => (
          <div className={"tl-item reveal" + (x.current ? " cur" : "")} key={i}>
            <div className="xp-card">
              <div className="xp-top">
                <div>
                  <h3 className="xp-role">{x.role}</h3>
                  <div className="xp-company">{x.company}</div>
                </div>
                <span className={"xp-period" + (x.current ? " cur" : "")}>{x.period}</span>
              </div>
              <p className="xp-summary">{x.summary}</p>
              <ul className="xp-bullets">
                {x.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
              <div className="taglist">
                {x.stack.map((t, j) => <span className="tag" key={j}>{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ---------------- STACK ---------------- */
export function Stack({ T, lang }) {
  return (
    <Section id="stack" num="03" title={T.sections.stack} label={T.sections.stack}>
      <div className="stack-grid">
        <div className="reveal">
          <div className="sphere-wrap" id="tech-sphere"></div>
          <div className="sphere-hint">{T.ui.stack_hint}</div>
        </div>
        <div className="stack-cats reveal">
          {CV.stack.map((c, i) => (
            <div className="cat-row" key={i}>
              <div className="cat-name">{c.cat[lang]}</div>
              <div className="cat-items">
                {c.items.map((t, j) => <span className="tag" key={j}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ---------------- PROJECTS ---------------- */
export function Projects({ T }) {
  return (
    <Section id="projects" num="04" title={T.sections.projects} label={T.sections.projects}>
      <div className="proj-grid">
        {T.projects.map((p, i) => (
          <div className="proj-card reveal" key={i}>
            <div className="proj-card-glow" aria-hidden="true" />
            <div className="proj-tag">{p.tag}</div>
            <h3 className="proj-name">{p.name}</h3>
            <p className="proj-summary">{p.summary}</p>
            <ul className="proj-bullets">
              {p.bullets.map((b, j) => <li key={j}>{b}</li>)}
            </ul>
            <div className="taglist">
              {p.stack.map((t, j) => <span className="tag" key={j}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ---------------- EDUCATION + SKILLS ---------------- */
export function EduSkills({ T, lang }) {
  const soft = CV.soft[lang]
  const e    = T.education
  return (
    <Section id="education" num="05" title={T.sections.education} label={T.sections.education}>
      <div className="split">
        <div className="reveal">
          <div className="edu-card">
            <h3 className="edu-degree">{e.degree}</h3>
            <div className="edu-school">{e.school}</div>
            <div className="edu-fac">{e.faculty}</div>
            <div className="edu-meta">{e.period}</div>
            <div className="edu-label">{T.ui.key_courses}</div>
            <div className="cat-items">
              {e.courses.map((c, i) => <span className="tag" key={i}>{c}</span>)}
            </div>
          </div>
        </div>
        <div className="reveal">
          <div className="edu-label" style={{ marginTop: 0 }}>// {T.sections.skills}</div>
          <div className="skills-grid">
            {soft.map((s, i) => (
              <div className="skill-card" key={i}>
                <div className="skill-t">{s.t}</div>
                <div className="skill-d">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ---------------- GITHUB ---------------- */
export function GitHub({ T, meta }) {
  const weeks = 52, days = 7
  const cells = []
  let seed = 7
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff }
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const r = rnd()
      let lvl = 0
      if (r > 0.55) lvl = 1
      if (r > 0.72) lvl = 2
      if (r > 0.86) lvl = 3
      if (r > 0.95) lvl = 4
      cells.push(lvl)
    }
  }
  const lvlColor = (l) => {
    if (l === 0) return 'var(--surface-2)'
    const a = [0, 0.32, 0.55, 0.78, 1][l]
    return `color-mix(in srgb, var(--accent) ${a * 100}%, var(--surface-2))`
  }
  return (
    <Section id="github" num="06" title={T.sections.github} label={T.sections.github}>
      <div className="gh-card reveal">
        <div className="gh-top">
          <a className="gh-handle" href={meta.github} target="_blank" rel="noopener">
            <Icon.github /> @{meta.githubHandle}
          </a>
          <a className="chip" href={meta.github} target="_blank" rel="noopener">
            <Icon.github /> {T.ui.view_github}
          </a>
        </div>
        <div className="heatmap">
          {cells.map((l, i) => (
            <div className="heat-cell" key={i} style={{ background: lvlColor(l) }} />
          ))}
        </div>
        <div className="gh-legend">
          less
          {[0, 1, 2, 3, 4].map((l) => <span className="sq" key={l} style={{ background: lvlColor(l) }} />)}
          more
        </div>
        <div className="gh-note">{T.github_note}</div>
      </div>
    </Section>
  )
}

/* ---------------- CONTACT ---------------- */
export function Contact({ T, meta }) {
  return (
    <Section id="contact" num="07" title={T.sections.contact} label={T.sections.contact}>
      <div className="contact">
        <h2 className="contact-big reveal">
          {T.ui.contact_lead}
          <span className="contact-mail">{T.ui.contact_accent}</span>
        </h2>
        <div className="contact-row reveal">
          <a className="chip primary" href={"mailto:" + meta.email}><Icon.mail /> {meta.email}</a>
          <a className="chip" href={meta.hh} target="_blank" rel="noopener"><Icon.hh /> hh.ru</a>
        </div>
        <div className="contact-row reveal">
          <a className="chip" href={meta.github} target="_blank" rel="noopener"><Icon.github /> GitHub</a>
          <a className="chip" href={meta.linkedin} target="_blank" rel="noopener"><Icon.linkedin /> LinkedIn</a>
          <a className="chip" href={meta.telegram} target="_blank" rel="noopener"><Icon.telegram /> Telegram</a>
        </div>
      </div>
    </Section>
  )
}
