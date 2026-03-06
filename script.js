// ============================================================
//  Digital Twins in Mining — Rock-On-Pap 2026
//  script.js
// ============================================================

// ── HELPERS ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const AMBER = '#F59E0B', AMBER_GLOW = '#FCD34D', ACCENT = '#FF6B35';
const MUTED = '#6b6560', SURFACE = '#1a1a1a', BORDER = '#252525', TEXT = '#E8E0D0';

function hx(hex, a = 1) {
  const r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// ── SLIDE ENGINE ─────────────────────────────────────────────
const slides = document.querySelectorAll('.slide');
const total = slides.length;
let cur = 0;
const navDots = $('nav-dots');

slides.forEach((_, i) => {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.onclick = () => goTo(i);
  navDots.appendChild(d);
});

function goTo(i) {
  cur = Math.max(0, Math.min(i, total - 1));
  slides[cur].scrollIntoView({ behavior: 'smooth' });
  updateUI();
}
function nextSlide() { goTo(cur + 1); }
function prevSlide() { goTo(cur - 1); }

function updateUI() {
  $('progress').style.width = (cur + 1) / total * 100 + '%';
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === cur));
  if (cur > 0) $('hint').style.opacity = '0';
}

document.addEventListener('keydown', e => {
  if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); nextSlide(); }
  if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); prevSlide(); }
});

// Inject flowUp keyframe for S6 particles
const kfStyle = document.createElement('style');
kfStyle.textContent = '@keyframes flowUp{0%{bottom:-8px;opacity:0;}15%{opacity:1;}85%{opacity:.8;}100%{bottom:105%;opacity:0;}}';
document.head.appendChild(kfStyle);

// ── INTERSECTION OBSERVER — init slides ──────────────────────
const inited = new Set();
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      cur = Array.from(slides).indexOf(e.target);
      updateUI();
      if (!inited.has(e.target.id)) {
        inited.add(e.target.id);
        if (e.target.id === 's1') initTitle();
        if (e.target.id === 's2') { initCounters(); drawBarChart(); }
        if (e.target.id === 's3') initTwin();
        if (e.target.id === 's5') animBars('.cbar-fill');
        if (e.target.id === 's6') { drawDoughnut(); spawnParticles(); }
        if (e.target.id === 's8') { animBars('.phase-prog'); drawROI(); }
        if (e.target.id === 's9') animBars('.rbar-fill');
        if (e.target.id === 's10') drawRadar();
        if (e.target.id === 's12') revealFuture();
      }
    }
  });
}, { threshold: 0.5 });

slides.forEach(s => obs.observe(s));
slides[0].classList.add('vis');
updateUI();

// ── S1: PARTICLE NETWORK (pure canvas) ───────────────────────
function initTitle() {
  const canvas = $('c-title');
  if (!canvas) return;
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const ctx = canvas.getContext('2d');
  const N = 60, nodes = [];
  for (let i = 0; i < N; i++) nodes.push({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
    r: 1.5 + Math.random() * 2, ph: Math.random() * Math.PI * 2
  });
  const DIST = 150;
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.ph += 0.02;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < DIST) {
        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(245,158,11,${(1 - d / DIST) * 0.15})`; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    nodes.forEach(n => {
      const op = 0.3 + Math.sin(n.ph) * 0.25 + 0.15;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,158,11,${op})`; ctx.fill();
    });
    requestAnimationFrame(frame);
  }
  frame();
}

// ── S2: BAR CHART (fatalities) ────────────────────────────────
function drawBarChart() {
  const canvas = $('c-fatal');
  if (!canvas) return;
  const W = canvas.offsetWidth || 400, H = 160;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const data = [131, 104, 106, 92, 63, 88, 88];
  const labels = ['2016', '2017', '2018', '2019', '2020', '2021', '2022'];
  const max = 140, pad = 30, bw = Math.floor((W - pad * 2) / data.length * 0.55), gap = (W - pad * 2) / data.length;
  const ch = H - 28;
  let prog = 0;
  (function anim() {
    prog = Math.min(prog + 0.04, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    ctx.clearRect(0, 0, W, H);
    for (let g = 0; g <= 4; g++) {
      const y = ch - ch * (g / 4) * ease + 4;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - 10, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = MUTED; ctx.font = '8px monospace'; ctx.textAlign = 'right';
      ctx.fillText(Math.round(max * g / 4), pad - 4, y + 3);
    }
    data.forEach((v, i) => {
      const x = pad + i * gap + (gap - bw) / 2;
      const barH = (v / max) * ch * ease;
      const y = ch - barH + 4;
      const grad = ctx.createLinearGradient(0, y, 0, ch + 4);
      grad.addColorStop(0, AMBER); grad.addColorStop(1, hx(ACCENT, .6));
      ctx.fillStyle = grad; ctx.fillRect(x, y, bw, barH);
      ctx.fillStyle = MUTED; ctx.font = '8px monospace'; ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + bw / 2, H - 4);
      if (prog === 1) { ctx.fillStyle = AMBER_GLOW; ctx.font = 'bold 9px monospace'; ctx.fillText(v, x + bw / 2, y - 3); }
    });
    if (prog < 1) requestAnimationFrame(anim);
  })();
}

// ── S2: ANIMATED COUNTERS ─────────────────────────────────────
function initCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const tgt = parseInt(el.dataset.target), sfx = el.dataset.suffix || '';
    let start = null; const dur = 1800;
    function step(ts) {
      if (!start) start = ts;
      const pr = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - pr, 3);
      const val = Math.round(ease * tgt);
      el.textContent = (tgt === 2400 ? '₹' + Math.round(val / 100) / 10 + 'k' : val) + sfx;
      if (pr < 1) requestAnimationFrame(step);
      else el.textContent = (tgt === 2400 ? '₹2,400' : tgt) + sfx;
    }
    requestAnimationFrame(step);
  });
}

// ── S3: TWIN CANVAS (split viewport 3D-ish mine) ─────────────
function initTwin() {
  const canvas = $('c-twin');
  if (!canvas) return;
  const wrap = canvas.parentElement;
  function resize() { canvas.width = wrap.offsetWidth || 900; canvas.height = 220; }
  resize();
  const ctx = canvas.getContext('2d');
  let t = 0;

  function drawTunnel(ctx, W, H, x0, w, solid) {
    const cx = x0 + w / 2, cy = H / 2;
    const rx = w * 0.35, ry = H * 0.38;
    for (let d = 0; d < 6; d++) {
      const scale = 0.6 + d * 0.08;
      const ox = (d - 2.5) * w * 0.04 * Math.sin(t * 0.3);
      ctx.beginPath(); ctx.ellipse(cx + ox, cy, rx * scale, ry * scale, 0, 0, Math.PI * 2);
      if (solid) {
        ctx.strokeStyle = `rgba(58,46,32,${0.6 - d * 0.08})`; ctx.lineWidth = d === 0 ? 8 : 4;
      } else {
        ctx.strokeStyle = `rgba(245,158,11,${0.5 - d * 0.06})`; ctx.lineWidth = 1.5;
      }
      ctx.stroke();
    }
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    if (solid) { ctx.strokeStyle = 'rgba(80,60,30,0.8)'; ctx.lineWidth = 6; }
    else { ctx.strokeStyle = hx(AMBER, .8); ctx.lineWidth = 2; }
    ctx.stroke();
  }

  function drawSensors(ctx, W, H, x0, w, solid) {
    const cx = x0 + w / 2, cy = H / 2;
    const rx = w * 0.35, ry = H * 0.38;
    for (let i = 0; i < 8; i++) {
      const ang = i * (Math.PI * 2 / 8) + t * 0.2;
      const sx = cx + Math.cos(ang) * rx, sy = cy + Math.sin(ang) * ry;
      const pulse = 0.5 + Math.sin(t * 2 + i * 0.8) * 0.4;
      ctx.beginPath(); ctx.arc(sx, sy, solid ? 4 : 3, 0, Math.PI * 2);
      ctx.fillStyle = solid ? `rgba(245,158,11,${pulse})` : `rgba(252,211,77,${pulse})`; ctx.fill();
      if (!solid) {
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 10);
        grad.addColorStop(0, hx(AMBER, .3)); grad.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(sx, sy, 10, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
      }
    }
  }

  function drawDataParticles(ctx, x0, w, H) {
    const cx = x0 + w / 2, cy = H / 2;
    for (let i = 0; i < 12; i++) {
      const ph = (t * 0.8 + i / 12) % 1;
      const rx = w * 0.35 * ph, ry = H * 0.38 * ph;
      const ang = i * (Math.PI * 1.618);
      const px = cx + Math.cos(ang) * rx, py = cy + Math.sin(ang) * ry;
      const op = 0.3 + Math.sin(t * 3 + i) * 0.4;
      ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(252,211,77,${op})`; ctx.fill();
    }
  }

  function drawFlowParticles(ctx, W, H) {
    for (let i = 0; i < 8; i++) {
      const ph = ((t * 0.4 + i / 8) % 1);
      const px = ph * W;
      const py = H / 2 + (Math.sin(ph * Math.PI * 2 + i) * H * 0.2);
      const op = ph < 0.1 ? ph * 10 : (ph > 0.9 ? (1 - ph) * 10 : 0.7);
      const atCenter = Math.abs(px - W / 2) < W * 0.05;
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,158,11,${op * (atCenter ? 0.3 : 1)})`; ctx.fill();
    }
  }

  function drawGrid(ctx, x0, w, H) {
    ctx.strokeStyle = 'rgba(245,158,11,0.06)'; ctx.lineWidth = 1;
    for (let gx = x0; gx <= x0 + w; gx += 20) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (let gy = 0; gy <= H; gy += 20) { ctx.beginPath(); ctx.moveTo(x0, gy); ctx.lineTo(x0 + w, gy); ctx.stroke(); }
  }

  function frame() {
    t += 0.015;
    const W = canvas.width, H = canvas.height, half = W / 2;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(15,12,8,0.95)'; ctx.fillRect(0, 0, half, H);
    ctx.fillStyle = 'rgba(8,10,12,0.95)'; ctx.fillRect(half, 0, half, H);
    drawGrid(ctx, half, half, H);
    drawTunnel(ctx, W, H, 0, half, true);
    drawSensors(ctx, W, H, 0, half, true);
    drawTunnel(ctx, W, H, half, half, false);
    drawSensors(ctx, W, H, half, half, false);
    drawDataParticles(ctx, half, half, H);
    drawFlowParticles(ctx, W, H);
    requestAnimationFrame(frame);
  }
  frame();
}

// ── S6: DOUGHNUT CHART ────────────────────────────────────────
function drawDoughnut() {
  const canvas = $('c-dflow');
  if (!canvas) return;
  const W = canvas.offsetWidth || 160, H = canvas.offsetHeight || 120;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const data = [
    { v: 30, c: AMBER, l: 'Safety' },
    { v: 25, c: ACCENT, l: 'Equipment' },
    { v: 20, c: hx(AMBER, .65) + '', l: 'Ventilation' },
    { v: 15, c: '#B45309', l: 'Production' },
    { v: 10, c: AMBER_GLOW, l: 'Ground' }
  ];
  const total = data.reduce((s, d) => s + d.v, 0);
  const cx = W / 2, cy = H / 2, ro = Math.min(W, H) * 0.42, ri = ro * 0.55;
  let prog = 0;
  (function anim() {
    prog = Math.min(prog + 0.04, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    ctx.clearRect(0, 0, W, H);
    let startAng = -Math.PI / 2;
    data.forEach(d => {
      const sweep = (d.v / total) * Math.PI * 2 * ease;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, ro, startAng, startAng + sweep);
      ctx.arc(cx, cy, ri, startAng + sweep, startAng, true);
      ctx.closePath(); ctx.fillStyle = d.c; ctx.fill();
      startAng += sweep;
    });
    if (prog < 1) requestAnimationFrame(anim);
  })();
}

// ── S6: FRAMEWORK PARTICLES ───────────────────────────────────
function spawnParticles() {
  const container = $('fw-ptrak');
  if (!container) return;
  setInterval(() => {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;width:5px;height:5px;border-radius:50%;background:${Math.random() > .5 ? AMBER : ACCENT};left:-2px;opacity:0;animation:flowUp ${1.2 + Math.random() * .8}s linear forwards;`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 2200);
  }, 180);
}

// ── S8: ROI LINE CHART ────────────────────────────────────────
function drawROI() {
  const canvas = $('c-roi');
  if (!canvas) return;
  const W = canvas.offsetWidth || 800, H = 80;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const months = [0, 6, 12, 18, 24, 30, 36];
  const cost = [0, -3, -6, -8, -10, -12, -15];
  const savings = [0, 1, 4, 8, 14, 20, 28];
  const net = months.map((_, i) => cost[i] + savings[i]);
  const minV = -15, maxV = 28, range = maxV - minV;
  const padL = 30, padR = 10, padT = 6, padB = 18;
  const cw = W - padL - padR, ch = H - padT - padB;

  function toY(v) { return padT + ch * (1 - (v - minV) / range); }
  function toX(i) { return padL + i * (cw / (months.length - 1)); }

  ctx.clearRect(0, 0, W, H);
  const zy = toY(0);
  ctx.beginPath(); ctx.moveTo(padL, zy); ctx.lineTo(W - padR, zy);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = MUTED; ctx.font = '8px monospace'; ctx.textAlign = 'right'; ctx.fillText('0', padL - 3, zy + 3);

  let prog = 0;
  (function anim() {
    prog = Math.min(prog + 0.03, 1);
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath(); ctx.moveTo(padL, zy); ctx.lineTo(W - padR, zy);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    const pts = Math.round(prog * (months.length - 1));
    ctx.beginPath();
    savings.slice(0, pts + 1).forEach((v, i) => { i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)); });
    ctx.strokeStyle = AMBER; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath();
    net.slice(0, pts + 1).forEach((v, i) => { i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)); });
    ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.stroke();
    months.slice(0, pts + 1).forEach((m, i) => {
      ctx.fillStyle = MUTED; ctx.font = '7px monospace'; ctx.textAlign = 'center';
      ctx.fillText(m + 'mo', toX(i), H - 2);
    });
    ctx.fillStyle = AMBER; ctx.fillRect(W - 95, 6, 12, 2); ctx.fillStyle = MUTED; ctx.font = '8px monospace'; ctx.textAlign = 'left'; ctx.fillText('Savings', W - 80, 11);
    ctx.fillStyle = ACCENT; ctx.fillRect(W - 95, 14, 12, 2); ctx.fillStyle = MUTED; ctx.fillText('Net ROI', W - 80, 19);
    if (prog < 1) requestAnimationFrame(anim);
  })();
}

// ── S10: RADAR CHART ─────────────────────────────────────────
function drawRadar() {
  const canvas = $('c-radar');
  if (!canvas) return;
  const W = canvas.offsetWidth || 230, H = 220;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const labels = ['Safety', 'Productivity', 'Maintenance', 'Energy', 'Compliance', 'Sustainability'];
  const without = [25, 40, 35, 30, 45, 30];
  const withDT = [85, 70, 75, 70, 80, 65];
  const N = labels.length, cx = W / 2, cy = H / 2 - 10, R = Math.min(W, H) * 0.36;

  function polarPt(i, val) {
    const ang = i * (Math.PI * 2 / N) - Math.PI / 2;
    return { x: cx + Math.cos(ang) * R * (val / 100), y: cy + Math.sin(ang) * R * (val / 100) };
  }

  let prog = 0;
  (function anim() {
    prog = Math.min(prog + 0.03, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    ctx.clearRect(0, 0, W, H);
    for (let g = 1; g <= 4; g++) {
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const ang = i * (Math.PI * 2 / N) - Math.PI / 2;
        const r = R * g / 4;
        i === 0 ? ctx.moveTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r) : ctx.lineTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
      }
      ctx.closePath(); ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1; ctx.stroke();
    }
    for (let i = 0; i < N; i++) {
      const ang = i * (Math.PI * 2 / N) - Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1; ctx.stroke();
      const lx = cx + Math.cos(ang) * (R + 14), ly = cy + Math.sin(ang) * (R + 14);
      ctx.fillStyle = MUTED; ctx.font = '8px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], lx, ly);
    }
    ctx.beginPath();
    without.forEach((v, i) => { const p = polarPt(i, v * ease); i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
    ctx.closePath(); ctx.fillStyle = 'rgba(107,101,96,0.15)'; ctx.fill();
    ctx.strokeStyle = 'rgba(107,101,96,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath();
    withDT.forEach((v, i) => { const p = polarPt(i, v * ease); i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
    ctx.closePath(); ctx.fillStyle = hx(AMBER, .15); ctx.fill();
    ctx.strokeStyle = AMBER; ctx.lineWidth = 2; ctx.stroke();
    if (prog < 1) requestAnimationFrame(anim);
  })();
}

// ── HELPER: animate bar fills ─────────────────────────────────
function animBars(sel) {
  document.querySelectorAll(sel).forEach((el, i) => setTimeout(() => {
    el.style.width = (el.dataset.width || '100') + '%';
  }, 100 + i * 80));
}

// ── HELPER: reveal future items ───────────────────────────────
function revealFuture() {
  document.querySelectorAll('.futitem').forEach((el, i) => setTimeout(() => el.classList.add('rev'), i * 180));
}

// ── IMAGE CONFIG PANEL ────────────────────────────────────────
const imgSlots = [
  { id: 'bg-s1', label: 'Slide 1 background — search: "digital twin 3D visualization mine"' },
  { id: 'bg-s2', label: 'Slide 2 background — search: "India coal mine underground workers"' },
  { id: 'img-c1', label: 'Case Study 1 (BHP Olympic Dam) — search: "BHP Olympic Dam mine"' },
  { id: 'img-c2', label: 'Case Study 2 (Codelco) — search: "El Teniente copper mine Chile underground"' },
  { id: 'img-c3', label: 'Case Study 3 (Boliden Garpenberg) — search: "Boliden Garpenberg mine Sweden"' },
  { id: 'img-c4', label: 'Case Study 4 (Coal India) — search: "Jharia coalfields India mine"' },
];
const vidSlots = [
  { id: 'vid-s3', label: 'Slide 3 video — paste YouTube video ID (the part after watch?v=)' },
  { id: 'vid-s12', label: 'Slide 12 video — paste YouTube video ID' },
];

const fields = $('img-fields');
if (fields) {
  fields.innerHTML = `
    <div style="color:var(--amber);font-size:10px;letter-spacing:3px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--border);">IMAGES — paste direct image URL (right-click image → Copy image address)</div>
    ${imgSlots.map(s => `
      <div style="margin-bottom:12px;">
        <div style="font-size:9px;color:var(--muted);margin-bottom:4px;">${s.label}</div>
        <input data-target="${s.id}" type="text" placeholder="https://..."
          style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:7px 10px;font-family:'Space Mono',monospace;font-size:11px;outline:none;">
      </div>`).join('')}
    <div style="color:var(--amber);font-size:10px;letter-spacing:3px;margin:16px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--border);">VIDEOS — paste YouTube video ID only (e.g. dQw4w9WgXcQ)</div>
    ${vidSlots.map(s => `
      <div style="margin-bottom:12px;">
        <div style="font-size:9px;color:var(--muted);margin-bottom:4px;">${s.label}</div>
        <input data-video="${s.id}" type="text" placeholder="video ID only..."
          style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);padding:7px 10px;font-family:'Space Mono',monospace;font-size:11px;outline:none;">
      </div>`).join('')}
  `;
}

function applyImages() {
  document.querySelectorAll('#img-fields input[data-target]').forEach(inp => {
    const url = inp.value.trim();
    if (!url) return;
    const el = document.getElementById(inp.dataset.target);
    if (!el) return;
    el.src = url;
    el.style.display = 'block';
    const slot = el.closest('.img-slot');
    if (slot) { const hint = slot.querySelector('.img-slot-hint'); if (hint) hint.style.display = 'none'; }
  });
  document.querySelectorAll('#img-fields input[data-video]').forEach(inp => {
    const vid = inp.value.trim().replace(/.*v=/, '');
    if (!vid) return;
    const el = document.getElementById(inp.dataset.video);
    if (!el) return;
    el.src = `https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`;
  });
  $('img-config').style.display = 'none';
}
