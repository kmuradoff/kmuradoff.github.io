/* =====================================================================
   gsap-animations.js — GSAP + ScrollTrigger scroll magic
   Exposes window.initGSAP() and window.killGSAP() for app.jsx
   ===================================================================== */
(function () {
  'use strict';

  let ctx = null;
  let progressEl = null;
  let cursorGlow = null;
  let cursorListenerAdded = false;
  let magneticCleanup = [];

  /* ─── progress bar ─────────────────────────────────────────────── */
  function ensureProgressBar() {
    if (progressEl) return;
    progressEl = document.createElement('div');
    progressEl.id = 'cv-progress';
    Object.assign(progressEl.style, {
      position: 'fixed', top: '0', left: '0', height: '2px', zIndex: '200',
      background: 'linear-gradient(90deg, var(--accent), var(--accent-text))',
      width: '0%', pointerEvents: 'none',
      boxShadow: '0 0 10px var(--accent)',
      opacity: '0', transition: 'opacity 0.35s',
    });
    document.body.appendChild(progressEl);
  }

  /* ─── cursor glow ──────────────────────────────────────────────── */
  function ensureCursorGlow() {
    if (cursorGlow) return;
    cursorGlow = document.createElement('div');
    cursorGlow.id = 'cv-cursor-glow';
    Object.assign(cursorGlow.style, {
      position: 'fixed', pointerEvents: 'none', zIndex: '0',
      width: '480px', height: '480px', borderRadius: '50%',
      background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 9%, transparent) 0%, transparent 68%)',
      transform: 'translate(-50%,-50%)',
      left: '-300px', top: '-300px',
      opacity: '0', transition: 'opacity 0.4s',
    });
    document.body.appendChild(cursorGlow);

    if (!cursorListenerAdded) {
      cursorListenerAdded = true;
      document.addEventListener('mousemove', (e) => {
        if (cursorGlow && cursorGlow.style.opacity !== '0') {
          gsap.to(cursorGlow, {
            left: e.clientX, top: e.clientY,
            duration: 0.55, ease: 'power2.out', overwrite: true,
          });
        }
      });
    }
  }

  /* ─── magnetic hover ───────────────────────────────────────────── */
  function bindMagnetic() {
    document.querySelectorAll('.chip, .tb-icon, .btn-pdf').forEach(el => {
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
        gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: 'power2.out', overwrite: true });
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)', overwrite: true });
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      magneticCleanup.push(() => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
        gsap.set(el, { clearProps: 'x,y' });
      });
    });
  }

  /* ─── main init ────────────────────────────────────────────────── */
  window.initGSAP = function () {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (document.body.classList.contains('mode-plain')) return;

    gsap.registerPlugin(ScrollTrigger);

    /* kill previous */
    if (ctx) { ctx.revert(); ctx = null; }
    ScrollTrigger.getAll().forEach(t => t.kill());
    magneticCleanup.forEach(fn => fn());
    magneticCleanup = [];

    ensureProgressBar();
    ensureCursorGlow();
    requestAnimationFrame(() => {
      if (progressEl) progressEl.style.opacity = '1';
      if (cursorGlow) cursorGlow.style.opacity = '1';
    });

    ctx = gsap.context(() => {

      /* 1 ── scroll progress bar */
      gsap.to(progressEl, {
        width: '100%', ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top', end: 'bottom bottom',
          scrub: 0.15,
        },
      });

      /* 2 ── hero entrance — only if near top */
      const atTop = (window.scrollY || 0) < window.innerHeight * 0.4;
      const heroSels = ['.hero-status', '.hero-name', '.hero-role', '.hero-tag', '.scroll-cue'];

      if (atTop) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.hero-status',
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, delay: 0.1 }
        )
        .fromTo('.hero-name',
          { y: 64, opacity: 0, skewX: 3 },
          { y: 0, opacity: 1, skewX: 0, duration: 1.05 }, '-=0.42'
        )
        .fromTo('.hero-role',
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 }, '-=0.58'
        )
        .fromTo('.hero-tag',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65 }, '-=0.46'
        )
        .fromTo('.hero-cta .chip',
          { y: 18, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.065 }, '-=0.38'
        )
        .fromTo('.scroll-cue',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 }, '-=0.15'
        );
      } else {
        /* already scrolled — just reveal immediately */
        gsap.set(
          ['.hero-status', '.hero-name', '.hero-role', '.hero-tag', '.hero-cta .chip', '.scroll-cue'],
          { opacity: 1, y: 0, skewX: 0, scale: 1 }
        );
      }

      /* 3 ── generic .reveal (exclude hero + special elements) */
      gsap.utils.toArray('.reveal').forEach(el => {
        if (el.closest('.hero')) return;
        if (el.classList.contains('tl-item')) return;
        if (el.classList.contains('proj-card')) return;
        gsap.fromTo(el,
          { y: 38, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 89%', once: true },
          }
        );
      });

      /* 4 ── experience cards: alternate slide left / right */
      document.querySelectorAll('.tl-item').forEach((el, i) => {
        gsap.fromTo(el,
          { x: i % 2 === 0 ? -54 : 54, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });

      /* 5 ── project cards stagger batch */
      ScrollTrigger.batch('.proj-card', {
        onEnter: batch => gsap.fromTo(batch,
          { y: 52, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.72, stagger: 0.1, ease: 'power2.out' }
        ),
        start: 'top 88%', once: true,
      });

      /* 6 ── stack tags pop-in */
      ScrollTrigger.batch('.stack-cats .tag', {
        onEnter: batch => gsap.fromTo(batch,
          { scale: 0.72, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.38, stagger: 0.022, ease: 'back.out(1.7)' }
        ),
        start: 'top 91%', once: true,
      });

      /* 7 ── github heatmap cascade */
      const heatCells = gsap.utils.toArray('.heat-cell');
      if (heatCells.length) {
        gsap.fromTo(heatCells,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.32,
            stagger: { each: 0.0028, from: 'random' },
            ease: 'back.out(1.5)',
            scrollTrigger: { trigger: '.heatmap', start: 'top 86%', once: true },
          }
        );
      }

      /* 8 ── contact big text */
      const contactBig = document.querySelector('.contact-big');
      if (contactBig) {
        gsap.fromTo(contactBig,
          { scale: 0.86, opacity: 0, y: 28 },
          {
            scale: 1, opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: contactBig, start: 'top 82%', once: true },
          }
        );
      }

      /* 9 ── section num + title parallax nudge on scroll */
      gsap.utils.toArray('.section:not(.hero)').forEach(sec => {
        const head = sec.querySelector('.section-head');
        if (!head) return;
        gsap.fromTo(head,
          { backgroundPositionY: '0%' },
          {
            backgroundPositionY: '6%', ease: 'none',
            scrollTrigger: {
              trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 1,
            },
          }
        );
      });

      /* 10 ── xp card depth on scroll (subtle) */
      document.querySelectorAll('.xp-card').forEach(card => {
        gsap.fromTo(card,
          { rotateX: 2 },
          {
            rotateX: 0, ease: 'none',
            scrollTrigger: {
              trigger: card, start: 'top 80%', end: 'center center', scrub: 1,
            },
          }
        );
      });

    });

    /* 11 ── magnetic hover (outside context — event listeners) */
    bindMagnetic();

    ScrollTrigger.refresh();
  };

  /* ─── kill / hide everything ────────────────────────────────────── */
  window.killGSAP = function () {
    if (ctx) { ctx.revert(); ctx = null; }
    if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(t => t.kill());
    magneticCleanup.forEach(fn => fn());
    magneticCleanup = [];
    if (progressEl) progressEl.style.opacity = '0';
    if (cursorGlow) cursorGlow.style.opacity = '0';
  };

})();
