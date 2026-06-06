/* =====================================================================
   app.jsx — App shell: toolbar, language / theme / mode state,
   3D scene mounting + reveal-on-scroll.
   ===================================================================== */

function detectTheme() {
  const saved = localStorage.getItem("cv-theme");
  if (saved) return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function Toolbar({ T, lang, setLang, theme, setTheme, mode, setMode, onDownload }) {
  return (
    <div className="toolbar">
      <div className="tb-brand">
        <span className="dot"></span>
        <span className="name-full">{T.name}</span>
      </div>
      <div className="tb-spacer"></div>

      {/* mode */}
      <div className="seg" role="tablist" aria-label="mode">
        <button className={mode === "anim" ? "on" : ""} onClick={() => setMode("anim")}>{T.ui.mode_anim}</button>
        <button className={mode === "plain" ? "on" : ""} onClick={() => setMode("plain")}>{T.ui.mode_plain}</button>
      </div>

      {/* language */}
      <div className="seg" role="tablist" aria-label="language">
        <button className={lang === "ru" ? "on" : ""} onClick={() => setLang("ru")}>RU</button>
        <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
      </div>

      {/* theme */}
      <button className="tb-icon" aria-label="theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
      </button>

      {/* pdf */}
      <button className="btn-pdf" onClick={onDownload}>
        <Icon.download /><span className="label">{T.ui.download}</span>
      </button>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("cv-lang") || "ru");
  const [theme, setTheme] = useState(detectTheme);
  const [mode, setMode] = useState(() => localStorage.getItem("cv-mode") || "anim");

  const sphereCtl = useRef(null);

  const T = window.CV[lang];
  const meta = window.CV.meta;

  // persist + apply theme/lang/mode to <html>/<body>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cv-theme", theme);
    if (sphereCtl.current) sphereCtl.current.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cv-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    document.body.classList.toggle("mode-anim", mode === "anim");
    document.body.classList.toggle("mode-plain", mode === "plain");
    localStorage.setItem("cv-mode", mode);
  }, [mode]);

  // ---- mount / unmount tech-sphere depending on mode ----
  useEffect(() => {
    let cancelled = false;
    function mount() {
      if (cancelled) return;
      const sphereEl = document.getElementById("tech-sphere");
      if (sphereEl && !sphereCtl.current && window.initTechSphere) {
        sphereCtl.current = window.initTechSphere(sphereEl, { theme });
      }
    }
    function unmount() {
      if (sphereCtl.current) { sphereCtl.current.dispose(); sphereCtl.current = null; }
    }

    if (mode === "anim") {
      const id = requestAnimationFrame(() => requestAnimationFrame(mount));
      return () => { cancelled = true; cancelAnimationFrame(id); };
    } else {
      unmount();
    }
  }, [mode]);

  // dispose on full unmount
  useEffect(() => () => {
    if (sphereCtl.current) sphereCtl.current.dispose();
  }, []);

  // ---- reveal-on-scroll (GSAP ScrollTrigger, fallback to IntersectionObserver) ----
  useEffect(() => {
    if (mode === "plain") {
      if (window.killGSAP) window.killGSAP();
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
      return;
    }

    if (window.initGSAP) {
      // Two rAF frames: let React finish painting before GSAP measures layout
      const id = requestAnimationFrame(() => requestAnimationFrame(() => {
        window.initGSAP();
      }));
      return () => {
        cancelAnimationFrame(id);
        if (window.killGSAP) window.killGSAP();
      };
    }

    // Fallback: IntersectionObserver
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    const vh = window.innerHeight || 800;
    els.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < vh * 1.15) el.classList.add("in");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [lang, mode]);

  function onDownload() {
    const prev = mode;
    if (prev !== "plain") {
      setMode("plain");
      document.body.classList.add("mode-plain");
      document.body.classList.remove("mode-anim");
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
      setTimeout(() => window.print(), 350);
    } else {
      window.print();
    }
  }

  return (
    <React.Fragment>
      <Toolbar T={T} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme}
               mode={mode} setMode={setMode} onDownload={onDownload} />
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
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
