/* =====================================================================
   3D HERO — microservices architecture graph
   Vanilla Three.js (global THREE, r128). Exposes window.initHeroGraph.
   Nodes = services/tech, edges = dependencies, packets = live data flow.
   ===================================================================== */
window.initHeroGraph = function (container, opts) {
  opts = opts || {};
  if (!window.THREE || !window.CV) return { dispose() {}, setTheme() {} };
  const THREE = window.THREE;
  const G = window.CV.graph;

  // ---- palette per group (resolved from CSS so themes stay in sync) ----
  function cssVar(name, fb) {
    const v = getComputedStyle(document.body).getPropertyValue(name).trim();
    return v || fb;
  }
  function groupColor(group) {
    switch (group) {
      case "core":  return cssVar("--green", "#6db33f");
      case "bus":   return "#f0883e";
      case "data":  return "#22d3ee";
      case "infra": return "#c792ea";
      default:      return "#9fb0ab"; // edge
    }
  }

  const W0 = container.clientWidth || 600;
  const H0 = container.clientHeight || 520;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, W0 / H0, 0.1, 100);
  camera.position.set(0, 0, 14);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W0, H0);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const root = new THREE.Group();
  scene.add(root);

  // ---- fibonacci-sphere layout ----
  const R = 5.4;
  const N = G.nodes.length;
  const idIndex = {};
  const nodeObjs = [];

  // round glow sprite texture (shared)
  function makeGlow() {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, "rgba(255,255,255,0.7)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  const glowTex = makeGlow();

  function makeLabel(text) {
    const pad = 6, fs = 34;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    ctx.font = `600 ${fs}px "JetBrains Mono", monospace`;
    const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
    const h = fs + pad * 2;
    c.width = w; c.height = h;
    ctx.font = `600 ${fs}px "JetBrains Mono", monospace`;
    ctx.textBaseline = "middle"; ctx.textAlign = "left";
    ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = 8;
    ctx.fillStyle = "#eef4f1";
    ctx.fillText(text, pad, h / 2 + 1);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sp = new THREE.Sprite(mat);
    sp.scale.set(w / h * 0.52, 0.52, 1);
    sp.renderOrder = 5;
    return sp;
  }

  G.nodes.forEach((nd, i) => {
    idIndex[nd.id] = i;
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * Math.PI * (3 - Math.sqrt(5));
    const pos = new THREE.Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r).multiplyScalar(R);

    const col = new THREE.Color(groupColor(nd.group));
    const rad = 0.20 + nd.size * 0.16;

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(rad, 24, 24),
      new THREE.MeshBasicMaterial({ color: col })
    );
    mesh.position.copy(pos);

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: col, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9,
    }));
    const gs = rad * 6.5;
    glow.scale.set(gs, gs, 1);
    glow.position.copy(pos);

    const label = makeLabel(nd.label);
    label.position.copy(pos.clone().add(new THREE.Vector3(0, rad + 0.42, 0)));

    root.add(glow); root.add(mesh); root.add(label);
    nodeObjs.push({ nd, mesh, glow, label, pos, col, rad, baseGlow: gs });
  });

  // ---- edges ----
  const edgeObjs = [];
  let edgeColorHex = 0x6db33f;
  G.links.forEach(([a, b]) => {
    const pa = nodeObjs[idIndex[a]].pos, pb = nodeObjs[idIndex[b]].pos;
    const geo = new THREE.BufferGeometry().setFromPoints([pa, pb]);
    const mat = new THREE.LineBasicMaterial({ color: edgeColorHex, transparent: true, opacity: 0.18 });
    const line = new THREE.Line(geo, mat);
    root.add(line);
    edgeObjs.push({ a: idIndex[a], b: idIndex[b], line, mat });
  });

  // ---- data packets (additive sprites travelling along edges) ----
  const packetTex = glowTex;
  const packets = [];
  edgeObjs.forEach((e, i) => {
    const mat = new THREE.SpriteMaterial({
      map: packetTex, color: new THREE.Color(cssVar("--cyan", "#22d3ee")),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.95,
    });
    const sp = new THREE.Sprite(mat);
    sp.scale.set(0.34, 0.34, 1);
    root.add(sp);
    packets.push({ sp, edge: e, t: Math.random(), speed: 0.12 + Math.random() * 0.16 });
  });

  // ---- interaction ----
  const ray = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-2, -2);
  const parallax = new THREE.Vector2(0, 0);
  const parallaxTarget = new THREE.Vector2(0, 0);
  let hovered = -1;

  function onMove(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouse.x = x * 2 - 1;
    mouse.y = -(y * 2 - 1);
    parallaxTarget.x = (x - 0.5) * 2;
    parallaxTarget.y = (y - 0.5) * 2;
  }
  function onLeave() { mouse.set(-2, -2); parallaxTarget.set(0, 0); }
  container.addEventListener("pointermove", onMove);
  container.addEventListener("pointerleave", onLeave);

  // ---- resize ----
  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // ---- theme ----
  function setTheme(theme) {
    const light = theme === "light";
    edgeColorHex = new THREE.Color(light ? 0x6c7a74 : 0x6db33f);
    edgeObjs.forEach((e) => { e.mat.color.copy(edgeColorHex); e.mat.opacity = light ? 0.22 : 0.18; });
    nodeObjs.forEach((n) => {
      n.col.set(groupColor(n.nd.group));
      n.mesh.material.color.copy(n.col);
      n.glow.material.color.copy(n.col);
      n.glow.material.opacity = light ? 0.55 : 0.9;
    });
  }

  // ---- loop ----
  let raf = 0, running = true, last = performance.now();
  const _v = new THREE.Vector3();
  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05); last = now;

    root.rotation.y += dt * 0.13;
    root.rotation.x = Math.sin(now * 0.00018) * 0.12;

    // parallax camera
    parallax.x += (parallaxTarget.x - parallax.x) * 0.05;
    parallax.y += (parallaxTarget.y - parallax.y) * 0.05;
    camera.position.x = parallax.x * 1.7;
    camera.position.y = -parallax.y * 1.2;
    camera.lookAt(0, 0, 0);

    // packets
    packets.forEach((p) => {
      p.t += dt * p.speed;
      if (p.t > 1) p.t -= 1;
      const a = nodeObjs[p.edge.a].mesh.position;
      const b = nodeObjs[p.edge.b].mesh.position;
      _v.lerpVectors(a, b, p.t);
      p.sp.position.copy(_v);
      const fade = Math.sin(p.t * Math.PI);
      p.sp.material.opacity = 0.25 + fade * 0.75;
    });

    // hover pick
    if (mouse.x > -1.5) {
      ray.setFromCamera(mouse, camera);
      const hits = ray.intersectObjects(nodeObjs.map((n) => n.mesh));
      const idx = hits.length ? nodeObjs.findIndex((n) => n.mesh === hits[0].object) : -1;
      if (idx !== hovered) {
        hovered = idx;
        container.style.cursor = idx >= 0 ? "pointer" : "default";
      }
    } else if (hovered !== -1) { hovered = -1; container.style.cursor = "default"; }

    // animate node hover state
    nodeObjs.forEach((n, i) => {
      const want = i === hovered ? 1.5 : 1.0;
      const cur = n.glow.scale.x / n.baseGlow;
      const next = cur + (want - cur) * 0.15;
      n.glow.scale.set(n.baseGlow * next, n.baseGlow * next, 1);
      n.label.material.opacity = i === hovered ? 1 : (hovered === -1 ? 0.92 : 0.4);
      const ms = i === hovered ? 1.25 : 1.0;
      n.mesh.scale.setScalar(ms);
    });

    // highlight edges touching hovered node
    edgeObjs.forEach((e) => {
      const on = hovered !== -1 && (e.a === hovered || e.b === hovered);
      const baseOp = 0.18;
      e.mat.opacity += ((on ? 0.85 : baseOp) - e.mat.opacity) * 0.2;
    });

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  if (opts.theme) setTheme(opts.theme);

  return {
    setTheme,
    pause() { running = false; cancelAnimationFrame(raf); },
    resume() { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } },
    dispose() {
      running = false; cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    },
  };
};
