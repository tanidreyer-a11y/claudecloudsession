/* Avant Intelligence — Oliver cut: Starlight visuals timed to the Oliver take with the "Almost." pauses */
const W = {
  precision: 0.5, starlight: 0.8, quiet: 1.2, deliberate: 1.7, alive: 2.25,
  number: 3.67, invoice: 5.53, reminder: 7.26, people: 8.97, gathered: 11.29, slip: 12.50, step: 13.61, world: 14.23,
  understood: 15.95, control: 16.6, almost: 18.43,
  watch: 21.02, four: 21.02, rise: 21.98, spark: 22.3, eachone: 23.01, job: 24.46, precise1: 26.1, precise: 27.17,
  think: 999, act: 999, care: 999,
  read: 28.59, document: 29.52, reviewed: 29.52, check: 30.70, detail: 31.79, decision: 32.76, prepared: 33.57,
  nothing: 34.42, fingers: 36.0, approve1: 38.4, loop: 39.12, gently: 39.6, endless: 40.5,
  prepare: 40.71, approve: 41.98, done: 43.32, twenty: 44.46, automated: 45.75, slipping: 999, reach: 999, behind: 46.3,
  choose: 47.24, need: 48.51, addmore: 49.72, grow: 50.93, adc: 52.72, innov: 53.5, precision2: 54.65, atwork: 55.72,
  book: 57.27, demo: 58.83, end: 59.7
};
const DUR = 61.2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const io = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const out = p => 1 - Math.pow(1 - p, 4);
const inn = p => p * p * p;
const E = (t, a, b, f = io) => f(clamp((t - a) / (b - a)));
const mix = (a, b, p) => a + (b - a) * p;
const win = (t, a, b, c, d) => E(t, a, b) * (1 - E(t, c, d));
const S = (el, o) => { for (const k in o) el.style[k] = o[k]; };
const world = document.getElementById('world'), screen = document.getElementById('screen');
const mk = (html, parent = world) => { const d = document.createElement('div'); d.innerHTML = html.trim(); const el = d.firstChild; parent.appendChild(el); return el; };
const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; };
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const deg = Math.PI / 180;

function spline(keys, t) {
  const n = keys.length, dims = keys[0].length - 1;
  if (t <= keys[0][0]) return keys[0].slice(1);
  if (t >= keys[n - 1][0]) return keys[n - 1].slice(1);
  let i = 0; while (t > keys[i + 1][0]) i++;
  const res = [];
  for (let d = 1; d <= dims; d++) {
    const T = k => keys[k][0], Y = k => keys[k][d], sec = k => (Y(k + 1) - Y(k)) / (T(k + 1) - T(k));
    const tan = k => { if (k === 0 || k === n - 1) return 0; const a = sec(k - 1), b = sec(k); if (a * b <= 0) return 0; const m = (a + b) / 2, lim = 3 * Math.min(Math.abs(a), Math.abs(b)); return Math.sign(m) * Math.min(Math.abs(m), lim); };
    const h = T(i + 1) - T(i), u = (t - T(i)) / h, u2 = u * u, u3 = u2 * u;
    res.push((2 * u3 - 3 * u2 + 1) * Y(i) + (u3 - 2 * u2 + u) * h * tan(i) + (-2 * u3 + 3 * u2) * Y(i + 1) + (u3 - u2) * h * tan(i + 1));
  }
  return res;
}
const Z = Math.log;
const ORB = [[-340, -420], [-113, -420], [113, -420], [340, -420]];
const DC = [3000, 0], LC = [3600, 0], LR = 330;
const CAM = [
  [ // A: the spark, the unseen work, something slips, dive through the spark
    [0, 0, 0, Z(1.9), 0], [3.2, 0, 0, Z(1.15), 0], [6.0, 0, 0, Z(1.05), 0], [9.5, 0, 0, Z(1.0), -3], [11.6, 0, 0, Z(1.05), 0],
    [12.9, 120, 140, Z(1.25), 2], [13.6, 0, 0, Z(1.6), 0], [14.2, 0, 0, Z(9), 0]],
  [ // B: the world where work does itself, Almost, agents rise, push into one orb and through it
    [14.2, 0, 0, Z(.6), 0], [15.9, 0, 0, Z(1.0), 0], [17.4, 0, 0, Z(1.15), 0], [18.4, 0, 0, Z(1.2), 0], [20.6, 0, 0, Z(1.22), 0],
    [21.3, 0, -60, Z(1.0), 0], [23.0, 0, -220, Z(.82), 0], [24.7, 0, -260, Z(.88), 0], [26.3, -60, -340, Z(1.3), 0],
    [27.3, -113, -420, Z(2.4), 0], [28.1, -113, -420, Z(2.7), 0], [28.6, -113, -420, Z(10), 0]],
  [ // C: document, decision, approve, the loop, every action on record, the grid
    [28.6, 2950, -120, Z(3.2), 0], [29.6, 3000, 0, Z(1.05), 0], [32.4, 3150, -20, Z(1.05), 0], [34.0, 3420, -40, Z(1.3), 0],
    [36.0, 3420, -40, Z(1.65), 0], [38.0, 3420, -20, Z(1.45), 0], [39.3, 3600, 0, Z(1.0), -3], [43.4, 3600, 0, Z(.86), 6],
    [46.4, 3600, 0, Z(.9), 4], [47.4, 3600, 0, Z(.8), 0], [48.7, 3600, 0, Z(.62), 0], [51.0, 3600, 0, Z(.48), 0], [52.7, 3600, 0, Z(.36), 0]]
];
const camAt = t => { const seg = t < CAM[1][0][0] ? CAM[0] : t < CAM[2][0][0] ? CAM[1] : CAM[2]; const [x, y, lz, r] = spline(seg, t); return [x, y, Math.exp(lz), r]; };

/* ---------- starfield (screen space): warps forward at the start, then drifts ---------- */
const bg = document.getElementById('bgpts'); const stars = [];
for (let i = 0; i < 220; i++) { const p = mk('<div class="pt"></div>', bg); const s = .8 + rnd(i) * 2.2; S(p, { width: s + 'px', height: s + 'px' }); stars.push({ el: p, x: (rnd(i + 1) - .5) * 2400, y: (rnd(i + 2) - .5) * 1500, z0: rnd(i + 3), a: .2 + rnd(i + 4) * .6 }); }

/* ---------- A: the spark and its constellation ---------- */
const cstars = [], clines = [];
const csvg = mk('<svg width="10" height="10" style="overflow:visible"></svg>');
for (let i = 0; i < 9; i++) {
  const a = i * 40 + rnd(i + 60) * 25, r = 230 + rnd(i + 70) * 260, x = Math.cos(a * deg) * r, y = Math.sin(a * deg) * r * .7;
  const st = mk('<div class="pt" style="width:5px;height:5px;transform:translate(-50%,-50%);box-shadow:0 0 10px 2px rgba(170,236,255,.7)"></div>'); at(st, x, y); cstars.push(st);
  const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line'); ln.setAttribute('x1', 0); ln.setAttribute('y1', 0); ln.dataset.x = x; ln.dataset.y = y;
  ln.setAttribute('stroke', 'rgba(170,236,255,.35)'); ln.setAttribute('stroke-width', 1); csvg.appendChild(ln); clines.push(ln);
}
const spark = mk('<div class="ball" style="width:30px;height:30px"></div>'); at(spark, 0, 0);
const halo = mk('<div style="width:520px;height:520px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(170,236,255,.35),rgba(59,193,236,.12) 35%,transparent 65%)"></div>'); at(halo, 0, 0);

/* ---------- A2: every number, every invoice, every reminder ---------- */
const items = [
  { t: 'number', a: 200, html: '<div class="card" style="width:270px"><div class="tag">CHASE</div><div class="k"><span class="ck" style="display:inline-block;width:0;overflow:hidden;color:var(--ok)">✓&nbsp;</span>Invoice #1042</div><div class="v" style="font-size:20px">R 48 200.00</div><div class="s">Overdue · 30 days</div></div>' },
  { t: 'invoice', a: 290, html: '<div class="card" style="width:270px"><div class="tag">CAPTURE</div><div class="k"><span class="ck" style="display:inline-block;width:0;overflow:hidden;color:var(--ok)">✓&nbsp;</span>Supplier bill</div><div class="v" style="font-size:20px">46 line items</div><div class="s">Awaiting capture</div></div>' },
  { t: 'reminder', a: 20, html: '<div class="card" style="width:270px"><div class="tag">ANSWER</div><div class="k"><span class="ck" style="display:inline-block;width:0;overflow:hidden;color:var(--ok)">✓&nbsp;</span>New lead · 21:43</div><div class="v" style="font-size:20px">“Can you quote?”</div><div class="s">No reply yet</div></div>' },
  { t: 'people', a: 110, html: '<div class="card" style="width:270px"><div class="tag">ONBOARD</div><div class="k"><span class="ck" style="display:inline-block;width:0;overflow:hidden;color:var(--ok)">✓&nbsp;</span>New starter</div><div class="v" style="font-size:20px">T. Nkosi</div><div class="s">Access pending</div></div>' }
].map(c => { c.el = mk(c.html); return c; });
const ringSVG = '<svg width="400" height="400" viewBox="-200 -200 400 400" style="transform:translate(-50%,-50%);overflow:visible"><circle r="150" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.2"/><circle r="110" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1"/><path d="M-190 0H-120M120 0H190M0 -190V-120M0 120V190" stroke="rgba(255,255,255,.55)" stroke-width="1.2"/></svg>';
const ringP = mk('<svg width="400" height="400" viewBox="-200 -200 400 400" style="transform:translate(-50%,-50%);overflow:visible"><circle r="150" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.2"/><circle r="110" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1"/><path d="M-190 0H-120M120 0H190M0 -190V-120M0 120V190" stroke="rgba(255,255,255,.55)" stroke-width="1.2"/></svg>'); at(ringP, 0, 0);

/* ---------- A3: four agents rise from one spark ---------- */
const tsvg = mk('<svg width="10" height="10" style="overflow:visible"></svg>');
const tlines = ORB.map(([x, y]) => { const l = document.createElementNS('http://www.w3.org/2000/svg', 'path'); l.setAttribute('d', `M0 0 C0 ${y * .55} ${x} ${y * .45} ${x} ${y}`); l.setAttribute('fill', 'none'); l.setAttribute('stroke', 'rgba(170,236,255,.45)'); l.setAttribute('stroke-width', 1.4); l.setAttribute('pathLength', 1); l.setAttribute('stroke-dasharray', '1 1'); tsvg.appendChild(l); return l; });
const orbs = ORB.map(() => mk('<div class="orb"></div>'));
const roles = ['Collections', 'Bills', 'Leads', 'Onboarding'].map(r => mk(`<div class="chip">${r} agent</div>`));

/* Avant: each agent owns a shade; together they resolve to the logo's neon blue */
const AG = ['#7FE3FF','#2F7BFF','#8C6BFF','#3EE0B5'];
orbs.forEach((o, i) => { o.style.background = `radial-gradient(circle at 35% 30%,#fff 0%,${AG[i]} 38%,${AG[i]}cc 70%,#04111c 100%)`; o.style.boxShadow = `0 0 40px 10px ${AG[i]}66,0 0 140px 40px ${AG[i]}22`; });
roles.forEach((r, i) => { r.style.color = AG[i]; r.style.borderColor = AG[i] + '66'; });
const ringP2 = mk(ringSVG); at(ringP2, ORB[1][0], ORB[1][1]);
const almostW = mk('<div class="word" style="top:880px;font-size:40px;opacity:0;letter-spacing:.3em;text-transform:uppercase;font-weight:200">Almost.</div>', screen);
const caps = ['Think', 'Act', 'Care'].map((w, i) => mk(`<div class="word" style="top:900px;font-size:30px;letter-spacing:.42em;text-transform:uppercase;opacity:0">${w}</div>`, screen));
const iris = mk('<div style="position:absolute;inset:0;opacity:0;background:radial-gradient(circle at 50% 50%,#fff 0%,#CFF3FF 20%,#3BC1EC 45%,#2F7BFF 75%,#071A3F 100%)"></div>', screen);

/* ---------- B1: a document reviewed, a decision prepared ---------- */
const docWrap = mk('<div style="width:0;height:0;perspective:1800px"></div>'); at(docWrap, DC[0] - 60, DC[1]);
const docVals = [['Client', 'Mabena Logistics'], ['VAT number', '4120 •••• 55'], ['Amount due', 'R 48 200.00'], ['Due date', '31 Aug 2026'], ['Status', '30 days overdue'], ['Next step', 'Reminder']];
const doc = mk(`<div class="doc"><h4>Tax Invoice</h4><div class="m">INV-1042 · 30 SEP 2026</div>${docVals.map(([k, v]) => `<div class="row">${k}<b>${v}</b></div>`).join('')}</div>`, docWrap);
const docRows = [...doc.querySelectorAll('.row b')];
const beam = mk('<div style="width:10px;height:700px;transform:translate(-50%,-50%);background:linear-gradient(transparent,rgba(127,227,255,.95) 20%,#fff 50%,rgba(47,123,255,.95) 80%,transparent);box-shadow:0 0 40px 14px rgba(59,193,236,.45),0 0 140px 40px rgba(47,123,255,.2);border-radius:5px"></div>');
const dchips = docVals.map(([k, v]) => mk(`<div class="chip" style="transform:translate(-50%,-50%);font-size:15px;color:var(--ink);letter-spacing:.06em;text-transform:none"><span class="ck" style="display:inline-block;width:0;overflow:hidden;color:var(--ok);vertical-align:bottom">✓&nbsp;</span>${v}</div>`));
const decision = mk('<div class="card" style="width:330px;text-align:center"><div class="k">Decision prepared</div><div class="v" style="font-size:22px">Send reminder to Mabena?</div><div class="s" style="margin-bottom:14px">R 48 200.00 · 30 days overdue</div><div class="btn" style="position:relative;left:50%;top:0;transform:translateX(-50%);font-size:17px;padding:12px 30px;display:inline-block">Approve</div></div>'); at(decision, 3420, -40);
const tapR = mk('<div style="width:60px;height:60px;border-radius:50%;border:2px solid #fff;transform:translate(-50%,-50%)"></div>');

/* ---------- B2: the loop ---------- */
const loopG = mk('<div style="width:0;height:0"></div>'); at(loopG, ...LC);
const loopSVG = mk(`<svg width="900" height="900" viewBox="-450 -450 900 900" style="position:absolute;left:-450px;top:-450px;overflow:visible">
  <circle id="lp" r="${LR}" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90)"/>
  <circle id="lp2" r="${LR}" fill="none" stroke="url(#g)" stroke-width="3" pathLength="1" stroke-dasharray="0 1" transform="rotate(-90)"/>
  <defs><linearGradient id="g"><stop offset="0" stop-color="#3BC1EC"/><stop offset=".5" stop-color="#2F7BFF"/><stop offset="1" stop-color="#8C6BFF"/></linearGradient></defs></svg>`, loopG);
const lp = loopSVG.querySelector('#lp'), lp2 = loopSVG.querySelector('#lp2');
const nodeAng = [-90, 30, 150], nodeTxt = ['Prepare', 'Approve', 'Done'], nodeT = ['prepare', 'approve', 'done'];
const nodes = nodeAng.map(a => { const n = mk('<div class="node" style="position:absolute"></div>', loopG); at(n, LR * Math.cos(a * deg), LR * Math.sin(a * deg)); return n; });
const nlabels = nodeAng.map(a => { const n = mk(`<div class="nlabel" style="position:absolute;font-size:20px"></div>`, loopG); const r = LR + 70; at(n, r * Math.cos(a * deg), r * Math.sin(a * deg)); return n; });
nlabels.forEach((n, i) => n.textContent = nodeTxt[i]);
const core = mk('<div class="nlabel" style="font-size:20px;color:var(--ink2);text-align:center;line-height:1.5"></div>'); at(core, ...LC);
const runner = mk('<div class="ball"></div>');
const pills = []; for (let i = 0; i < 20; i++) pills.push(mk('<div style="width:14px;height:14px;border-radius:4px;transform:translate(-50%,-50%);background:rgba(255,255,255,.25);border:1px solid rgba(255,255,255,.4)"></div>'));

/* ---------- B3: choose the agents you need ---------- */
const tileNames = ['Collections', 'Bills capture', 'Lead reply', 'Onboarding', 'Payroll prep', 'Quotes', 'Reconciliation', 'Reporting', 'Supplier queries', 'Document intake', 'Scheduling', 'Compliance checks'];
const tiles = tileNames.map((n, i) => { const t = mk(`<div class="tile"><div class="n">${n}</div><div class="tg"><i></i></div></div>`); const c = i % 4, r = Math.floor(i / 4); t.dataset.x = LC[0] + (c - 1.5) * 270; t.dataset.y = LC[1] + (r - 1) * 170; return t; });
const extra = [];
for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) { if (c >= 2 && c <= 5 && r >= 1 && r <= 3) continue; const t = mk('<div class="tile" style="opacity:0"><div class="n" style="opacity:.5">Agent</div><div class="tg"><i></i></div></div>'); t.dataset.x = LC[0] + (c - 3.5) * 270; t.dataset.y = LC[1] + (r - 2) * 170; extra.push(t); }

/* ---------- end card ---------- */
const avlogo = mk('<svg id="avlogo" width="860" height="152.4" viewBox="0 0 385.25 68.25" style="position:absolute;left:530.0px;top:393.8px;overflow:visible"><defs><clipPath id="lamclip"><rect id="lamrect" x="0" y="0" width="385.25" height="0"/></clipPath><filter id="lglow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path id="lam" d="M150.50,55.19 L151.00,55.19 L163.25,55.19 L187.25,13.55 L211.00,55.19 L224.00,55.19 L193.25,0.12 L181.50,0.12 Z" fill="#3BC1EC" clip-path="url(#lamclip)" filter="url(#lglow)"/><path class="lw" d="M0.00,67.88 L12.75,67.88 L36.75,26.00 L60.50,67.88 L73.25,67.88 L42.25,13.55 L30.75,13.55 Z" fill="#fff" style="opacity:0"/><path class="lw" d="M74.75,13.55 L105.25,67.88 L117.00,67.88 L147.25,13.55 L147.00,13.55 L135.00,13.55 L111.00,55.19 L87.00,13.55 Z" fill="#fff" style="opacity:0"/><path class="lw" d="M241.00,13.55 L241.25,67.88 L252.25,67.88 L252.50,30.50 L296.75,67.88 L306.00,67.88 L305.50,13.55 L294.75,13.55 L294.50,51.00 L250.25,13.55 Z" fill="#fff" style="opacity:0"/><path class="lw" d="M385.00,13.55 L322.00,13.55 L322.25,22.88 L347.50,22.88 L348.00,67.88 L360.00,67.88 L360.25,22.88 L385.25,22.88 Z" fill="#fff" style="opacity:0"/></svg>', screen);
const lam = avlogo.querySelector('#lamrect'), lws = [...avlogo.querySelectorAll('.lw')];
const avsub = mk('<div id="avsub">INTELLIGENCE</div>', screen);
const desc = mk('<div id="desc">PRECISION, AT WORK</div>', screen); const logo = { style: {} };
const cta = mk('<div id="cta" class="btn">Book your 15-minute demo</div>', screen);
const endBall = mk('<div class="ball" style="position:absolute"></div>', screen);

function render(t) {
  const [cx, cy, z, r] = camAt(t);
  S(world, { transform: `translate(960px,540px) scale(${z}) rotate(${r}deg) translate(${-cx}px,${-cy}px)` });
  world.style.opacity = 1 - E(t, W.adc - .6, W.adc + .3);

  /* starfield: a slow warp forward that settles into drift */
  const warp = 1 - E(t, 0, 7.5, out);
  stars.forEach((s, i) => {
    let zz = (s.z0 - t * (.02 + .16 * warp)) % 1; if (zz <= 0) zz += 1; const k = .25 + zz * 1.2;
    const x = 960 + (s.x - cx * .05) / k, y = 540 + (s.y - cy * .05) / k;
    const near = 1 - zz;
    S(s.el, { transform: `translate(${x}px,${y}px) scale(${.6 + near * 1.6})`, opacity: s.a * E(t, 0, 1.5) * (.35 + .65 * near) * (1 - .5 * E(t, W.adc, W.adc + 1)) });
  });
  const au = (.25 * E(t, W.starlight, W.starlight + 1.6) + .75 * E(t, W.world - .3, W.world + 1.2)) * (1 - .3 * E(t, W.adc, W.adc + 1.5));
  S(document.getElementById('aurora'), { opacity: au * .9, transform: `rotate(${t * 3}deg) scale(${1 + .05 * Math.sin(t * .5)})` });

  /* A: spark + constellation */
  const sp = E(t, W.precision - .3, W.precision + .5, out);
  const pulse = 1 + .12 * Math.sin(t * 2.6) + .5 * win(t, W.alive - .1, W.alive + .15, W.alive + .2, W.alive + .9) + .7 * win(t, W.spark - .1, W.spark + .1, W.spark + .15, W.spark + .8);
  const aOut = 1 - E(t, 28.35, 28.6);
  const frz = win(t, W.almost - .1, W.almost + .1, 20.6, 21.0);
  world.style.filter = `saturate(${1 - .8 * frz}) brightness(${1 - .25 * frz})`;
  S(almostW, { opacity: win(t, W.almost, W.almost + .3, 20.55, 20.95) });
  S(spark, { opacity: sp * aOut, transform: `translate(-50%,-50%) scale(${sp * pulse})` });
  S(halo, { opacity: sp * (.5 + .5 * E(t, W.starlight, W.starlight + 1.5)) * aOut * (1 - .5 * E(t, W.watch, W.rise)), transform: `translate(-50%,-50%) scale(${.8 + .2 * Math.sin(t * 1.3)})` });
  const cOut = 1 - E(t, W.number - .5, W.number + .4);
  cstars.forEach((st, i) => S(st, { opacity: E(t, W.starlight - .2 + i * .12, W.starlight + .4 + i * .12) * cOut }));
  clines.forEach((ln, i) => {
    const s0 = i < 3 ? W.quiet : i < 6 ? W.deliberate : W.alive, p = E(t, s0 - .1 + (i % 3) * .15, s0 + .7 + (i % 3) * .15);
    ln.setAttribute('x2', +ln.dataset.x * p); ln.setAttribute('y2', +ln.dataset.y * p); ln.style.opacity = cOut * (1 + .6 * win(t, W.alive, W.alive + .2, W.alive + .3, W.alive + 1));
  });

  /* A2: items fly in from depth and orbit the spark */
  const tf = t < 18.3 ? t : t < 20.9 ? 18.3 + (t - 18.3) * .05 : 18.43 + (t - 20.9);   // orbit holds still through "Almost."
  const orbit = tf * 9;
  const iOut = 1 - E(t, W.watch - .3, W.watch + .4);
  items.forEach((c, i) => {
    const t0 = W[c.t] - .2, p = E(t, t0, t0 + 1.0, out), g = E(t, W.gathered - .1, W.gathered + .9);
    const sl = i === 2 ? win(t, W.slip - .25, W.slip + 1.0, W.world - .1, W.world + .7) : 0;   // something slips
    const rr = mix(mix(950, 330, p), 250, g) + 520 * sl, a = (c.a + orbit + 25 * sl) * deg;
    S(c.el, { left: Math.cos(a) * rr + 'px', top: (Math.sin(a) * rr * .62 + 260 * sl) + 'px', opacity: p * iOut * (1 - .85 * sl), transform: `translate(-50%,-50%) scale(${mix(.4, 1, p)})`, filter: `blur(${(1 - p) * 8}px)` });
    const ck = E(t, W.understood + i * .22, W.understood + .25 + i * .22);
    c.el.querySelectorAll('.ck').forEach(e => e.style.width = (ck * 22) + 'px');
  });
  const rp = win(t, W.control - .3, W.control + .2, W.watch - .3, W.watch + .3);
  S(ringP, { opacity: rp, transform: `translate(-50%,-50%) scale(${mix(2.2, .5, E(t, W.control - .3, W.control + .25, out))}) rotate(${45 * (1 - E(t, W.control - .3, W.control + .25))}deg)` });

  /* A3: four agents rise along curved lines */
  tlines.forEach((l, i) => { l.style.strokeDashoffset = 1 - E(t, W.rise - .2 + i * .12, W.rise + .9 + i * .12); l.style.opacity = aOut; });
  orbs.forEach((o, i) => {
    const p = E(t, W.rise - .1 + i * .12, W.rise + 1.0 + i * .12, out);
    const [x1, y1] = ORB[i];
    const x = mix(0, x1, p), y = mix(0, y1, p) + 6 * Math.sin(t * 1.8 + i);
    const beat = [W.think, W.act, W.care].reduce((m, w) => m + win(t, w - .1, w + .15, w + .25, w + .8), 0);
    const focus = i === 1 ? 1 : 1 - .7 * E(t, W.precise1, W.precise1 + .6);
    S(o, { left: x + 'px', top: y + 'px', opacity: E(t, W.rise - .2 + i * .12, W.rise + .2 + i * .12) * aOut * focus, transform: `translate(-50%,-50%) scale(${mix(.25, 1, p) * (1 + .12 * beat)})` });
    S(roles[i], { left: x1 + 'px', top: (y1 + 70) + 'px', opacity: E(t, W.eachone + i * .15, W.eachone + .5 + i * .15) * aOut * focus });
  });
  caps.forEach((c, i) => { const w = [W.think, W.act, W.care][i]; S(c, { opacity: 0 * win(t, w - .05, w + .3, (i < 2 ? [W.act, W.care][i] - .25 : 22.6), (i < 2 ? [W.act, W.care][i] - .05 : 22.95)), left: (960 + (i - 1) * 330) + 'px' }); });
  iris.style.opacity = win(t, 13.8, 14.17, 14.27, 14.8) + win(t, 28.15, 28.55, 28.65, 29.1);
  const rp2 = win(t, W.precise1 + .4, W.precise + .2, W.read - .3, W.read + .1);
  S(ringP2, { opacity: rp2 * aOut, transform: `translate(-50%,-50%) scale(${mix(1.8, .55, E(t, W.precise1 + .4, W.precise + .15, out))}) rotate(${45 * (1 - E(t, W.precise1 + .4, W.precise + .15))}deg)` });

  /* B1: document reviewed -> decision prepared -> approved */
  const dA = win(t, 28.55, 28.75, W.prepared - .2, W.prepared + .3);
  const tiltIn = E(t, 28.6, 29.95);
  S(doc, { opacity: dA, transform: `translate(-50%,-50%) rotateY(${mix(-38, -16, tiltIn)}deg) rotateX(${mix(18, 8, tiltIn)}deg) rotateZ(${mix(-6, -2, tiltIn)}deg) scale(${1 - .25 * E(t, W.decision, W.prepared + .3)})`, filter: `blur(${10 * E(t, W.decision + .2, W.prepared + .3)}px)` });
  const bp = E(t, 29.05, W.check - .1);
  S(beam, { left: mix(DC[0] - 310, DC[0] + 200, bp) + 'px', top: DC[1] + 'px', opacity: win(t, 28.95, 29.15, W.check - .25, W.check) });
  dchips.forEach((c, i) => {
    const lift = E(t, 29.15 + i * .2, 29.85 + i * .2, out), conv = E(t, W.decision + i * .04, W.prepared + .1 + i * .04, inn);
    const x = mix(mix(DC[0], DC[0] + 390, lift), 3420, conv), y = mix(mix(DC[1] - 155 + i * 47, DC[1] - 150 + i * 58, lift), -40, conv);
    S(c, { left: x + 'px', top: y + 'px', opacity: lift * (1 - E(t, W.prepared - .1, W.prepared + .15)), transform: `translate(-50%,-50%) scale(${mix(.8, 1, lift) * (1 - .7 * conv)})` });
    c.querySelector('.ck').style.width = (E(t, W.check + i * .18, W.check + .2 + i * .18) * 22) + 'px';
    docRows[i].style.opacity = 1 - .75 * lift;
  });
  const dc = E(t, W.prepared - .15, W.prepared + .45, out);
  const wob = win(t, W.nothing - .1, W.nothing + .2, W.fingers - .6, W.fingers) * Math.sin((t - W.nothing) * 14) * 3;   // nothing slips: it wobbles, then holds
  S(decision, { opacity: dc * (1 - E(t, W.loop - .4, W.loop + .2)), transform: `translate(-50%,-50%) scale(${mix(.85, 1, dc)}) rotate(${wob}deg) translateY(${wob * 4}px)` });
  const btn = decision.querySelector('.btn');
  btn.style.transform = `translateX(-50%) scale(${1 - .08 * win(t, W.approve1 - .08, W.approve1, W.approve1 + .05, W.approve1 + .2)})`;
  btn.style.background = t > W.approve1 ? '#BFF5EC' : '';
  const tap = E(t, W.approve1, W.approve1 + .6);
  S(tapR, { left: '3420px', top: '62px', opacity: tap > 0 && tap < 1 ? 1 - tap : 0, transform: `translate(-50%,-50%) scale(${.4 + tap * 1.8})` });

  /* B2: the loop closes, turns, Prepare / Approve / Done */
  const lA = win(t, W.loop - .5, W.loop, W.choose - .4, W.choose + .3);
  const turn = 40 * E(t, W.loop, W.choose, p => p);
  S(loopG, { opacity: lA, transform: `rotate(${turn}deg)` });
  nlabels.forEach((n, i) => S(n, { transform: `translate(-50%,-50%) rotate(${-turn}deg)`, opacity: .25 + .75 * E(t, W[nodeT[i]] - .1, W[nodeT[i]] + .4) }));
  lp.style.strokeDashoffset = 1 - E(t, W.loop - .3, W.gently + .4);
  const lap = E(t, W.prepare - .25, W.done + .2, p => p);
  lp2.style.strokeDasharray = `${lap} 1`;
  nodes.forEach((n, i) => { const on = E(t, W[nodeT[i]] - .1, W[nodeT[i]] + .3); S(n, { background: on > .5 ? '#fff' : 'var(--bg)', boxShadow: `0 0 ${26 * on}px ${7 * on}px rgba(59,193,236,.6)`, transform: `translate(-50%,-50%) scale(${1 + .6 * win(t, W[nodeT[i]] - .1, W[nodeT[i]] + .1, W[nodeT[i]] + .2, W[nodeT[i]] + .7)})` }); });
  const ra = (-90 + (t < W.prepare - .25 ? 0 : 360 * lap) + turn) * deg;
  const rv = t < W.twenty ? win(t, W.loop + .2, W.gently, W.twenty - .2, W.twenty) : 0;
  S(runner, { left: LC[0] + LR * Math.cos(ra) + 'px', top: LC[1] + LR * Math.sin(ra) + 'px', opacity: rv });
  // twenty tasks race the loop; one slips and is caught
  const cnt = Math.round(20 * E(t, W.twenty - .1, W.automated + .4, p => p));
  core.innerHTML = t < W.twenty - .2 ? 'ONE LOOP' : `${String(cnt).padStart(2, '0')} / 20<br><span style="font-size:14px;opacity:.6">ACTIONS ON RECORD</span>`;
  core.style.opacity = lA * E(t, W.loop, W.loop + .6);
  pills.forEach((p, i) => {
    const s0 = W.twenty - .2 + i * .06, prog = E(t, s0, s0 + .5, out);
    const ang = (-90 + i * 18 + turn + 30 * E(t, W.twenty, W.behind + 1, p => p)) * deg;
    let rr = mix(LR + 160, LR, prog);
    if (i === 7) rr += 120 * win(t, W.slipping - .3, W.slipping + .2, W.reach - .1, W.reach + .4);
    const done = i < cnt;
    S(p, { left: LC[0] + rr * Math.cos(ang) + 'px', top: LC[1] + rr * Math.sin(ang) + 'px', opacity: prog * (1 - E(t, W.choose - .4, W.choose + .2)),
      background: done ? 'linear-gradient(135deg,#3BC1EC,#2F7BFF)' : 'rgba(255,255,255,.25)', boxShadow: done ? '0 0 12px 3px rgba(59,193,236,.5)' : 'none',
      transform: `translate(-50%,-50%) scale(${1 + .4 * win(t, W.behind - .1, W.behind + .1, W.behind + .2, W.behind + .7)})` });
  });
  // the catcher: the ball reaches out to the slipping task and brings it home
  const ca = (-90 + 7 * 18 + turn + 30 * E(t, W.twenty, W.behind + 1, p => p)) * deg;
  const reachP = win(t, W.slipping, W.reach, W.reach + .1, W.reach + .5);
  const catcher = t > W.twenty ? { x: LC[0] + (LR + 120 * reachP) * Math.cos(ca), y: LC[1] + (LR + 120 * reachP) * Math.sin(ca), o: win(t, W.slipping - .3, W.slipping, W.reach + .4, W.reach + .8) } : null;
  if (catcher) S(runner, { left: catcher.x + 'px', top: catcher.y + 'px', opacity: catcher.o });

  /* B3: choose the agents you need, add more as you grow */
  tiles.forEach((tl, i) => {
    const s = W.choose + (i < 8 ? i * .1 : 1.9 + (i - 8) * .1), a = E(t, s - .2, s + .4, out);
    const on = E(t, W.need - .3 + i * .1, W.need + i * .1);
    S(tl, { left: tl.dataset.x + 'px', top: tl.dataset.y + 'px', opacity: a, transform: `translate(-50%,-50%) scale(${mix(.85, 1, a)})` });
    tl.querySelector('.tg').style.background = on > .5 ? 'linear-gradient(90deg,#3BC1EC,#2F7BFF)' : 'rgba(255,255,255,.12)';
    tl.querySelector('.tg i').style.transform = `translateX(${on * 20}px)`;
  });
  extra.forEach((e, i) => { const s = W.grow - .2 + i * .035; S(e, { left: e.dataset.x + 'px', top: e.dataset.y + 'px', opacity: E(t, s, s + .4) * .55, transform: `translate(-50%,-50%) scale(${mix(.8, 1, E(t, s, s + .4))})` }); });

  /* end card */

  /* end: the spark travels to the apex and draws the blue Λ; the letters follow */
  { const T0 = W.adc;
    const fly = E(t, T0 - .9, T0 + .15, io), drawL = E(t, T0 + .05, T0 + .95, io);
    S(endBall, { left: mix(960, 948.3, fly) + 'px', top: mix(520, 394.1, fly) + 'px', opacity: win(t, T0 - 1.1, T0 - .7, T0 + .7, T0 + 1.2), transform: `translate(-50%,-50%) scale(${1 + .6 * Math.sin(Math.PI * fly)})` });
    lam.setAttribute('height', 68.25 * drawL);
    lws.forEach((p, i) => { const k = E(t, T0 + .7 + i * .14, T0 + 1.5 + i * .14, out); p.style.opacity = k; p.setAttribute('transform', `translate(0 ${(1 - k) * 8})`); });
    avlogo.style.opacity = 1; avlogo.style.filter = `drop-shadow(0 0 ${30 * win(t, T0 + .8, T0 + 1.2, T0 + 1.6, T0 + 3)}px rgba(59,193,236,.7))`;
    avsub.style.opacity = E(t, T0 + 1.5, T0 + 2.4, out); }

  const ds = E(t, W.precision2 - .1, W.atwork + .6);
  S(desc, { opacity: ds, letterSpacing: mix(.5, .14, ds) + 'em' });
  const ct = E(t, W.book - .1, W.book + .6, out);
  S(cta, { opacity: ct, transform: `translate(-50%,-50%) translateY(${24 * (1 - ct)}px)` });
  document.getElementById('stage').style.filter = `brightness(${1 - E(t, DUR - .6, DUR)})`;
}
window.render = render; window.DUR = DUR;
document.fonts.ready.then(() => { render(+(new URLSearchParams(location.search).get('t') || 0)); window.READY = true; });
