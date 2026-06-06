/* =====================================================================
   Terminal.jsx — Interactive developer terminal with Tetris easter egg
   Open with Ctrl+K or the toolbar button.
   ===================================================================== */
import { useState, useEffect, useRef, useReducer, useCallback } from 'react'

/* ──────────────────────────────────────────────────────────────────
   CONFETTI
   ────────────────────────────────────────────────────────────────── */
function fireConfetti() {
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none'
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  const COLORS = ['#8fd957','#4ecdc4','#ffe66d','#ff6b6b','#c3a6ff','#fff']
  const pieces = Array.from({ length: 160 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 200,
    w: 8 + Math.random() * 8,
    h: 5 + Math.random() * 5,
    r: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 4,
    vy: 3 + Math.random() * 5,
    vr: (Math.random() - 0.5) * 0.2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 1,
  }))

  let raf
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let alive = 0
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.r += p.vr
      if (p.y > canvas.height) { p.alpha -= 0.05 }
      if (p.alpha <= 0) return
      alive++
      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.translate(p.x, p.y)
      ctx.rotate(p.r)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    })
    if (alive > 0) raf = requestAnimationFrame(draw)
    else { cancelAnimationFrame(raf); canvas.remove() }
  }
  raf = requestAnimationFrame(draw)
}

/* ──────────────────────────────────────────────────────────────────
   TETRIS ENGINE
   ────────────────────────────────────────────────────────────────── */
const COLS = 10, ROWS = 20
const TETROMINOS = {
  I: { shape: [[1,1,1,1]], color: '#4ecdc4' },
  O: { shape: [[1,1],[1,1]], color: '#ffe66d' },
  T: { shape: [[0,1,0],[1,1,1]], color: '#c3a6ff' },
  S: { shape: [[0,1,1],[1,1,0]], color: '#8fd957' },
  Z: { shape: [[1,1,0],[0,1,1]], color: '#ff6b6b' },
  J: { shape: [[1,0,0],[1,1,1]], color: '#74b9ff' },
  L: { shape: [[0,0,1],[1,1,1]], color: '#fd79a8' },
}
const PIECES = Object.keys(TETROMINOS)

function randomPiece() {
  const k = PIECES[Math.floor(Math.random() * PIECES.length)]
  return { ...TETROMINOS[k], type: k }
}

function rotate(shape) {
  return shape[0].map((_, i) => shape.map(r => r[i]).reverse())
}

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function fits(board, shape, x, y) {
  return shape.every((row, dy) =>
    row.every((cell, dx) => {
      if (!cell) return true
      const nx = x + dx, ny = y + dy
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false
      if (ny >= 0 && board[ny][nx]) return false
      return true
    })
  )
}

function place(board, shape, x, y, color) {
  const b = board.map(r => [...r])
  shape.forEach((row, dy) =>
    row.forEach((cell, dx) => {
      if (cell && y + dy >= 0) b[y + dy][x + dx] = color
    })
  )
  return b
}

function clearLines(board) {
  const kept = board.filter(row => row.some(c => !c))
  const cleared = ROWS - kept.length
  const top = Array.from({ length: cleared }, () => Array(COLS).fill(null))
  return { board: [...top, ...kept], cleared }
}

const SCORES = [0, 100, 300, 500, 800]
const SPEED  = (lvl) => Math.max(80, 700 - lvl * 60)

const initState = () => {
  const piece = randomPiece()
  const next  = randomPiece()
  return {
    board: emptyBoard(),
    piece,
    next,
    x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
    y: -1,
    score: 0,
    lines: 0,
    level: 0,
    over: false,
    paused: false,
  }
}

function ghostY(state) {
  let gy = state.y
  while (fits(state.board, state.piece.shape, state.x, gy + 1)) gy++
  return gy
}

function tetrisReducer(state, action) {
  if (state.over && action.type !== 'RESTART') return state
  if (state.paused && action.type === 'PAUSE') return { ...state, paused: false }
  if (state.paused && action.type !== 'PAUSE') return state

  switch (action.type) {
    case 'TICK':
    case 'SOFT': {
      const ny = state.y + 1
      if (fits(state.board, state.piece.shape, state.x, ny)) {
        return { ...state, y: ny }
      }
      // lock
      if (state.y < 0) return { ...state, over: true }
      const placed = place(state.board, state.piece.shape, state.x, state.y, state.piece.color)
      const { board, cleared } = clearLines(placed)
      const lines  = state.lines + cleared
      const level  = Math.floor(lines / 10)
      const score  = state.score + SCORES[cleared] * (level + 1)
      const piece  = state.next
      const next   = randomPiece()
      const x      = Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2)
      return { ...state, board, piece, next, x, y: -1, score, lines, level }
    }
    case 'DROP': {
      const gy = ghostY(state)
      if (gy < 0) return { ...state, over: true }
      const placed = place(state.board, state.piece.shape, state.x, gy, state.piece.color)
      const { board, cleared } = clearLines(placed)
      const lines = state.lines + cleared
      const level = Math.floor(lines / 10)
      const score = state.score + SCORES[cleared] * (level + 1) + (gy - state.y)
      const piece = state.next
      const next  = randomPiece()
      const x     = Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2)
      return { ...state, board, piece, next, x, y: -1, score, lines, level }
    }
    case 'LEFT': {
      const nx = state.x - 1
      return fits(state.board, state.piece.shape, nx, state.y) ? { ...state, x: nx } : state
    }
    case 'RIGHT': {
      const nx = state.x + 1
      return fits(state.board, state.piece.shape, nx, state.y) ? { ...state, x: nx } : state
    }
    case 'ROTATE': {
      const s = rotate(state.piece.shape)
      if (fits(state.board, s, state.x, state.y))
        return { ...state, piece: { ...state.piece, shape: s } }
      // wall kick
      for (const kick of [-1, 1, -2, 2]) {
        if (fits(state.board, s, state.x + kick, state.y))
          return { ...state, piece: { ...state.piece, shape: s }, x: state.x + kick }
      }
      return state
    }
    case 'PAUSE': return { ...state, paused: true }
    case 'RESTART': return initState()
    default: return state
  }
}

function TetrisGame({ onExit }) {
  const [state, dispatch] = useReducer(tetrisReducer, null, initState)
  const canvasRef = useRef(null)
  const CELL = 24

  // draw
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // grid bg
    ctx.fillStyle = '#0a0f0d'
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL)
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        ctx.strokeStyle = 'rgba(143,217,87,0.08)'
        ctx.strokeRect(c * CELL, r * CELL, CELL, CELL)
      }
    }

    // board
    state.board.forEach((row, r) =>
      row.forEach((color, c) => {
        if (!color) return
        ctx.fillStyle = color
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, 4)
      })
    )

    // ghost
    if (!state.over) {
      const gy = ghostY(state)
      state.piece.shape.forEach((row, dy) =>
        row.forEach((cell, dx) => {
          if (!cell) return
          const r = gy + dy, c = state.x + dx
          if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            ctx.strokeStyle = state.piece.color + '55'
            ctx.strokeRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
          }
        })
      )
    }

    // active piece
    if (!state.over) {
      state.piece.shape.forEach((row, dy) =>
        row.forEach((cell, dx) => {
          if (!cell) return
          const r = state.y + dy, c = state.x + dx
          if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            ctx.fillStyle = state.piece.color
            ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
            ctx.fillStyle = 'rgba(255,255,255,0.25)'
            ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, 4)
          }
        })
      )
    }

    // game over overlay
    if (state.over) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL)
      ctx.fillStyle = '#8fd957'
      ctx.font = 'bold 18px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', COLS * CELL / 2, ROWS * CELL / 2 - 10)
      ctx.font = '12px "JetBrains Mono", monospace'
      ctx.fillStyle = '#ccc'
      ctx.fillText('R to restart', COLS * CELL / 2, ROWS * CELL / 2 + 16)
    }
  })

  // tick
  useEffect(() => {
    if (state.over || state.paused) return
    const id = setInterval(() => dispatch({ type: 'TICK' }), SPEED(state.level))
    return () => clearInterval(id)
  }, [state.over, state.paused, state.level])

  // keys — must be passive:false so we can preventDefault before Locomotive Scroll sees them
  useEffect(() => {
    const GAME_KEYS = new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '])
    const onKey = (e) => {
      if (GAME_KEYS.has(e.key)) e.preventDefault()
      switch (e.key) {
        case 'ArrowLeft':  dispatch({ type: 'LEFT' });   break
        case 'ArrowRight': dispatch({ type: 'RIGHT' });  break
        case 'ArrowDown':  dispatch({ type: 'SOFT' });   break
        case 'ArrowUp':    dispatch({ type: 'ROTATE' }); break
        case ' ':          dispatch({ type: 'DROP' });   break
        case 'p':
        case 'P':          dispatch({ type: state.paused ? 'RESTART' : 'PAUSE' }); break
        case 'r':
        case 'R':          dispatch({ type: 'RESTART' }); break
        case 'Escape':     onExit(); break
      }
    }
    // capture: true + passive: false ensures we intercept before scroll handlers
    window.addEventListener('keydown', onKey, { capture: true, passive: false })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [state.paused, onExit])

  const nextW = state.next.shape[0].length * CELL
  const nextH = state.next.shape.length * CELL

  return (
    <div className="tetris-wrap">
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="tetris-canvas" />
      <div className="tetris-panel">
        <div className="tet-stat">
          <span className="tet-label">SCORE</span>
          <span className="tet-val">{state.score}</span>
        </div>
        <div className="tet-stat">
          <span className="tet-label">LEVEL</span>
          <span className="tet-val">{state.level + 1}</span>
        </div>
        <div className="tet-stat">
          <span className="tet-label">LINES</span>
          <span className="tet-val">{state.lines}</span>
        </div>
        <div className="tet-stat" style={{ marginTop: 16 }}>
          <span className="tet-label">NEXT</span>
          <canvas
            width={nextW} height={nextH}
            ref={el => {
              if (!el) return
              const ctx = el.getContext('2d')
              ctx.clearRect(0, 0, nextW, nextH)
              state.next.shape.forEach((row, dy) =>
                row.forEach((cell, dx) => {
                  if (!cell) return
                  ctx.fillStyle = state.next.color
                  ctx.fillRect(dx * CELL + 1, dy * CELL + 1, CELL - 2, CELL - 2)
                })
              )
            }}
            className="tet-next-canvas"
          />
        </div>
        <div className="tet-keys">
          <div>← → Move</div>
          <div>↑ Rotate</div>
          <div>↓ Soft drop</div>
          <div>Space Hard drop</div>
          <div>P Pause</div>
          <div>R Restart</div>
          <div>Esc Exit</div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────
   COMMAND DEFINITIONS
   ────────────────────────────────────────────────────────────────── */
const COMMANDS = {
  help: () => [
    { t: 'sys', v: 'Available commands:' },
    { t: 'cmd', v: '  whoami        — who is this dev?' },
    { t: 'cmd', v: '  docker ps     — running services' },
    { t: 'cmd', v: '  git log       — commit history' },
    { t: 'cmd', v: '  java --version — tech stack info' },
    { t: 'cmd', v: '  ping kamal    — response time' },
    { t: 'cmd', v: '  coffee        — essential utility' },
    { t: 'cmd', v: '  sudo hire --immediately' },
    { t: 'cmd', v: '  tetris        — you found it!' },
    { t: 'cmd', v: '  clear         — clear terminal' },
    { t: 'cmd', v: '  exit          — close terminal' },
  ],

  whoami: () => [
    { t: 'sys', v: 'Камаль Мурадов' },
    { t: 'out', v: 'Backend Engineer · Java & Spring Boot' },
    { t: 'out', v: 'Currently: Senior Java Developer @ Sberbank' },
    { t: 'out', v: '' },
    { t: 'out', v: 'Writes code that doesn\'t break in prod.' },
    { t: 'out', v: 'Fixes other people\'s code that does.' },
    { t: 'out', v: '' },
    { t: 'acc', v: 'Type "sudo hire --immediately" to take action.' },
  ],

  'docker ps': () => [
    { t: 'sys', v: 'CONTAINER ID   IMAGE                      STATUS          PORTS' },
    { t: 'out', v: 'a1b2c3d4e5f6   kamal/spring-boot:latest   Up 847 days     8080/tcp' },
    { t: 'out', v: 'b2c3d4e5f6a1   postgres:15                Up 847 days     5432/tcp' },
    { t: 'out', v: 'c3d4e5f6a1b2   redis:7-alpine             Up 847 days     6379/tcp' },
    { t: 'out', v: 'd4e5f6a1b2c3   kafka:3.5                  Up 847 days     9092/tcp' },
    { t: 'out', v: 'e5f6a1b2c3d4   prometheus:latest          Up 847 days     9090/tcp' },
    { t: 'out', v: '' },
    { t: 'acc', v: '5 containers running. 0 crashes. Ever.' },
  ],

  'git log': () => [
    { t: 'sys',  v: '──── git log --oneline (last 6) ────' },
    { t: 'sha',  v: 'f3a9b12  fix: resolve N+1 query haunting dreams' },
    { t: 'sha',  v: 'e7c2d45  feat: kafka consumer with zero data loss' },
    { t: 'sha',  v: 'b1f8a93  refactor: make sonarqube stop judging me' },
    { t: 'sha',  v: 'a9d3c17  perf: reduce p99 latency 340ms → 42ms 🚀' },
    { t: 'sha',  v: '9f2b6e4  test: 94% coverage because 100 is a lie' },
    { t: 'sha',  v: '8c5a1d0  docs: write README so future-me understands' },
  ],

  'java --version': () => [
    { t: 'out', v: 'openjdk 21.0.2 2024-01-16 LTS' },
    { t: 'out', v: 'OpenJDK Runtime Environment Corretto-21' },
    { t: 'out', v: '' },
    { t: 'sys', v: 'Also fluent in:' },
    { t: 'out', v: '  Spring Boot 3.x, Hibernate, Kafka, Docker' },
    { t: 'out', v: '  PostgreSQL, Redis, REST, gRPC, Microservices' },
    { t: 'out', v: '  Jenkins CI/CD, SonarQube, Prometheus/Grafana' },
  ],

  'ping kamal': () => {
    const ms = (Math.random() * 4 + 1).toFixed(3)
    return [
      { t: 'sys', v: 'PING kamal.muradov — (human@backend.dev)' },
      { t: 'out', v: `64 bytes: icmp_seq=1 ttl=64 time=${ms} ms` },
      { t: 'out', v: `64 bytes: icmp_seq=2 ttl=64 time=${(+ms + 0.1).toFixed(3)} ms` },
      { t: 'out', v: `64 bytes: icmp_seq=3 ttl=64 time=${(+ms - 0.1).toFixed(3)} ms` },
      { t: 'out', v: '' },
      { t: 'acc', v: '3 packets transmitted, 3 received, 0% packet loss' },
    ]
  },

  coffee: () => [
    { t: 'out', v: '     ( (' },
    { t: 'out', v: '      ) )' },
    { t: 'out', v: '   .______.' },
    { t: 'out', v: '   |      |]' },
    { t: 'out', v: '   \\      /' },
    { t: 'out', v: '    `----\'  ' },
    { t: 'out', v: '' },
    { t: 'acc', v: 'Deploying caffeine... done. Productivity +47%.' },
  ],

  'sudo hire --immediately': () => [
    { t: 'sys', v: '[sudo] password for recruiter: ••••••••' },
    { t: 'out', v: 'Authenticating...' },
    { t: 'out', v: 'Checking Kamal\'s availability... AVAILABLE ✓' },
    { t: 'out', v: 'Checking team fit... EXCELLENT ✓' },
    { t: 'out', v: 'Checking salary expectations... REASONABLE ✓' },
    { t: 'out', v: '' },
    { t: 'acc', v: '🎉 hire --immediately executed successfully!' },
    { t: 'out', v: '' },
    { t: 'sys', v: 'Reach out directly:' },
    { t: 'lnk', v: '  Telegram  →  t.me/muradoffk', href: 'https://t.me/muradoffk' },
    { t: 'lnk', v: '  LinkedIn  →  linkedin.com/in/muradoffk', href: 'https://www.linkedin.com/in/muradoffk' },
    { t: 'out', v: '' },
    { t: 'special', v: 'CONFETTI' },
  ],

  tetris: () => [
    { t: 'acc', v: 'Launching Tetris v1.0.0-RELEASE...' },
    { t: 'special', v: 'TETRIS' },
  ],

  clear: () => [{ t: 'special', v: 'CLEAR' }],

  exit: () => [{ t: 'special', v: 'EXIT' }],
}

function resolveCommand(raw) {
  const cmd = raw.trim().toLowerCase()
  if (COMMANDS[cmd]) return COMMANDS[cmd]()
  return [
    { t: 'err', v: `command not found: ${raw}` },
    { t: 'out', v: 'Type "help" to see available commands.' },
  ]
}

/* ──────────────────────────────────────────────────────────────────
   TERMINAL COMPONENT
   ────────────────────────────────────────────────────────────────── */
export function Terminal({ onClose }) {
  const [history, setHistory]     = useState([
    { t: 'sys', v: '┌─────────────────────────────────────────────┐' },
    { t: 'sys', v: '│  kamal@backend:~$  Welcome!                 │' },
    { t: 'sys', v: '└─────────────────────────────────────────────┘' },
    { t: 'out', v: '' },
    { t: 'out', v: 'A real developer lives here. Poke around.' },
    { t: 'acc', v: 'Type "help" for available commands.' },
    { t: 'out', v: '' },
  ])
  const [input, setInput]         = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [histIdx, setHistIdx]     = useState(-1)
  const [showTetris, setShowTetris] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, showTetris])

  useEffect(() => {
    inputRef.current?.focus()
  }, [showTetris])

  const handleClose = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose])

  function submit(e) {
    e.preventDefault()
    if (!input.trim()) return

    const raw = input.trim()
    setCmdHistory(h => [raw, ...h])
    setHistIdx(-1)
    setInput('')

    const newLines = [
      { t: 'prompt', v: raw },
      ...resolveCommand(raw),
    ]

    const specials = newLines.filter(l => l.t === 'special').map(l => l.v)
    const visibles = newLines.filter(l => l.t !== 'special')

    if (specials.includes('CLEAR')) { setHistory([]); return }
    if (specials.includes('EXIT'))  { onClose(); return }

    setHistory(h => [...h, ...visibles])

    if (specials.includes('CONFETTI')) setTimeout(fireConfetti, 300)
    if (specials.includes('TETRIS'))   setTimeout(() => setShowTetris(true), 200)
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(idx)
      setInput(cmdHistory[idx] ?? '')
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInput(idx === -1 ? '' : cmdHistory[idx])
    }
  }

  function lineClass(t) {
    return { sys: 'tl-sys', out: 'tl-out', acc: 'tl-acc', err: 'tl-err',
             sha: 'tl-sha', prompt: 'tl-prompt', cmd: 'tl-cmd', lnk: 'tl-lnk' }[t] || 'tl-out'
  }

  return (
    <div className="term-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="term-win">
        {/* title bar */}
        <div className="term-bar">
          <span className="tl r" onClick={onClose} title="close" style={{ cursor: 'pointer' }}></span>
          <span className="tl y"></span>
          <span className="tl g"></span>
          <span className="title">kamal@backend: ~ [interactive shell]</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.4 }}>~ or Esc to close</span>
        </div>

        {/* body */}
        <div className="term-body term-scroll">
          {history.map((line, i) => (
            <div key={i} className={`tl-line ${lineClass(line.t)}`}>
              {line.t === 'prompt' && <span className="tl-ps1">kamal@backend:~$ </span>}
              {line.t === 'lnk'
                ? <a href={line.href} target="_blank" rel="noopener" className="tl-lnk-a">{line.v}</a>
                : line.v}
            </div>
          ))}

          {showTetris && (
            <TetrisGame onExit={() => {
              setShowTetris(false)
              setHistory(h => [...h, { t: 'acc', v: 'Tetris exited. Back to work.' }, { t: 'out', v: '' }])
            }} />
          )}

          <div ref={bottomRef} />
        </div>

        {/* input */}
        {!showTetris && (
          <form className="term-input-row" onSubmit={submit}>
            <span className="tl-ps1">kamal@backend:~$&nbsp;</span>
            <input
              ref={inputRef}
              className="term-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
              placeholder="type a command..."
              autoFocus
            />
          </form>
        )}
      </div>
    </div>
  )
}
