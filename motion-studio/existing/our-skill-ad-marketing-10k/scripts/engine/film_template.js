/* Starter: helpers + spline camera + 3 demo scenes (line rises → card → zoom-through dot → end card).
   Replace scenes with your own. Every time references a word in W (timing.js). */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const io = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2, out = p => 1 - Math.pow(1 - p, 4);
const E = (t, a, b, f = io) => f(clamp((t - a) / (b - a))), mix = (a, b, p) => a + (b - a) * p;
const win = (t, a, b, c, d) => E(t, a, b) * (1 - E(t, c, d));
const S = (el, o) => { for (const k in o) el.style[k] = o[k]; };
const world = document.getElementById('world'), screen = document.getElementById('screen');
const mk = (h, parent = world) => { const d = document.createElement('div'); d.innerHTML = h.trim(); const e = d.firstElementChild; parent.appendChild(e); return e; };
const at = (e, x, y) => { e.style.left = x + 'px'; e.style.top = y + 'px'; };
const Z = Math.log;
/* monotone cubic spline: smooth velocity through keys, no overshoot (fixes stop-start camera judder) */
function spline(keys, t) {
  const n = keys.length, dims = keys[0].length - 1;
  if (t <= keys[0][0]) return keys[0].slice(1); if (t >= keys[n - 1][0]) return keys[n - 1].slice(1);
  let i = 0; while (t > keys[i + 1][0]) i++; const res = [];
  for (let d = 1; d <= dims; d++) {
    const T = k => keys[k][0], Y = k => keys[k][d], sec = k => (Y(k + 1) - Y(k)) / (T(k + 1) - T(k));
    const tan = k => { if (k === 0 || k === n - 1) return 0; const a = sec(k - 1), b = sec(k); if (a * b <= 0) return 0; const m = (a + b) / 2, l = 3 * Math.min(Math.abs(a), Math.abs(b)); return Math.sign(m) * Math.min(Math.abs(m), l); };
    const h = T(i + 1) - T(i), u = (t - T(i)) / h, u2 = u * u, u3 = u2 * u;
    res.push((2 * u3 - 3 * u2 + 1) * Y(i) + (u3 - 2 * u2 + u) * h * tan(i) + (-2 * u3 + 3 * u2) * Y(i + 1) + (u3 - u2) * h * tan(i + 1));
  }
  return res;
}
/* camera segments [t, cx, cy, ln(zoom), rotDeg]; a new segment = a hidden cut inside a zoom-through */
const CAM = [
  [[0, 0, 500, Z(1.6), 0], [W.problem, 0, 0, Z(1.0), 0], [W.turn - .2, 600, 0, Z(1.2), 0], [W.turn + .4, 600, 0, Z(12), 0]],
  [[W.turn + .4, 3000, 0, Z(.6), 0], [W.brand - .3, 3000, 0, Z(1.0), 3]]
];
const camAt = t => { const seg = CAM.filter(s => t >= s[0][0]).pop() || CAM[0]; const [x, y, lz, r] = spline(seg, t); return [x, y, Math.exp(lz), r]; };

/* scene 1: a line rises; scene 2: a card; the dot we dive through */
const line = mk('<div style="width:3px;background:var(--accent);transform:translateX(-50%)"></div>');
const card = mk('<div class="card c"><div style="font-size:13px;letter-spacing:.16em;color:var(--ink2)">PROBLEM</div><div style="font-size:28px;font-weight:300;margin-top:10px">Data typed in. Again.</div></div>'); at(card, 0, -200);
const dot = mk('<div class="dot c"></div>'); at(dot, 600, 0);
const after = mk('<div class="card c" style="width:520px"><div style="font-size:32px;font-weight:300">It simply flows.</div></div>'); at(after, 3000, 0);
const logo = mk('<div style="position:absolute;left:410px;top:470px;font-size:96px;font-weight:300">Brand<b style="color:var(--accent);font-weight:400">.</b></div>', screen);

function render(t) {
  const [cx, cy, z, r] = camAt(t);
  S(world, { transform: `translate(960px,540px) scale(${z}) rotate(${r}deg) translate(${-cx}px,${-cy}px)`, opacity: 1 - E(t, W.brand - .3, W.brand + .3) });
  const h = 900 * E(t, .2, W.problem); S(line, { left: '0px', top: (900 - h) + 'px', height: h + 'px' });
  S(card, { opacity: E(t, W.problem, W.problem + .6, out), transform: `translate(-50%,-50%) translateY(${30 * (1 - E(t, W.problem, W.problem + .6))}px)` });
  S(dot, { opacity: E(t, W.problem + .5, W.problem + 1) });
  document.getElementById('iris').style.opacity = win(t, W.turn - .1, W.turn + .35, W.turn + .45, W.turn + .9);   // zoom-through cover
  S(after, { opacity: E(t, W.turn + .5, W.turn + 1.1, out) });
  S(logo, { opacity: E(t, W.brand, W.brand + .8), transform: `translateX(${20 * (1 - E(t, W.brand, W.brand + .8))}px)` });
  document.getElementById('stage').style.filter = `brightness(${1 - E(t, DUR - .6, DUR)})`;
}
window.render = render;
document.fonts.ready.then(() => { render(0); window.READY = true; });
