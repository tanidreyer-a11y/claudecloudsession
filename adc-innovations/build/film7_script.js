/* ADC Innovations — "Starlight" cut, timed to the Eleven v4 take (51.15 s) */
const W = {
  step: 0.12, world: 1.15, precision: 1.60, starlight: 2.85, quiet: 4.19, deliberate: 5.20, alive: 6.36,
  number: 7.84, invoice: 9.45, reminder: 10.87, gathered: 11.99, understood: 12.83, control: 14.22,
  watch: 15.62, four: 16.37, rise: 17.13, spark: 18.65, eachone: 19.59, think: 20.51, act: 21.39, care: 22.35,
  document: 23.70, reviewed: 24.30, decision: 25.48, prepared: 26.07, approve1: 27.39, loop: 28.45, gently: 29.32, endless: 30.32,
  prepare: 31.97, approve: 33.09, done: 34.26, twenty: 35.43, automated: 36.58, slipping: 38.15, reach: 38.78, behind: 40.27,
  choose: 41.53, need: 42.50, addmore: 43.45, grow: 44.26, adc: 45.52, innov: 46.33, precision2: 47.47, atwork: 48.36,
  book: 49.51, demo: 50.51, end: 51.15
};
const DUR = 52.8;
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
  [ // A: the spark, gathered work, four agents rise, push into one orb and through it
    [0, 0, 0, Z(1.9), 0], [6.5, 0, 0, Z(1.15), 0], [7.8, 0, 0, Z(1.0), 0], [11.9, 0, 0, Z(1.05), -3], [14.3, 0, 0, Z(1.4), 0],
    [15.6, 0, -60, Z(1.0), 0], [17.4, 0, -220, Z(.82), 0], [19.6, 0, -260, Z(.88), 0], [22.3, -60, -340, Z(1.15), 0],
    [23.0, -113, -420, Z(2.4), 0], [23.45, -113, -420, Z(10), 0]],
  [ // B: document, decision, approve, the loop, twenty tasks, the grid
    [23.45, 2950, -120, Z(3.2), 0], [24.4, 3000, 0, Z(1.05), 0], [26.1, 3150, -20, Z(1.05), 0], [27.3, 3400, -60, Z(1.5), 0],
    [28.6, 3600, 0, Z(1.0), -3], [30.9, 3600, 0, Z(.86), 4], [34.6, 3600, 0, Z(.86), 8], [35.6, 3600, 0, Z(.92), 6],
    [37.9, 3600 + LR * Math.cos(80 * deg) * .7, LR * Math.sin(80 * deg) * .7, Z(1.35), 2], [39.6, 3600, 0, Z(.9), 0],
    [41.0, 3600, 0, Z(.8), 0], [42.6, 3600, 0, Z(.62), 0], [44.4, 3600, 0, Z(.48), 0], [45.6, 3600, 0, Z(.36), 0]]
];
const camAt = t => { const seg = t < CAM[1][0][0] ? CAM[0] : CAM[1]; const [x, y, lz, r] = spline(seg, t); return [x, y, Math.exp(lz), r]; };

/* ---------- starfield (screen space): warps forward at the start, then drifts ---------- */
const bg = document.getElementById('bgpts'); const stars = [];
for (let i = 0; i < 220; i++) { const p = mk('<div class="pt"></div>', bg); const s = .8 + rnd(i) * 2.2; S(p, { width: s + 'px', height: s + 'px' }); stars.push({ el: p, x: (rnd(i + 1) - .5) * 2400, y: (rnd(i + 2) - .5) * 1500, z0: rnd(i + 3), a: .2 + rnd(i + 4) * .6 }); }

/* ---------- A: the spark and its constellation ---------- */
const cstars = [], clines = [];
const csvg = mk('<svg width="10" height="10" style="overflow:visible"></svg>');
for (let i = 0; i < 9; i++) {
  const a = i * 40 + rnd(i + 60) * 25, r = 230 + rnd(i + 70) * 260, x = Math.cos(a * deg) * r, y = Math.sin(a * deg) * r * .7;
  const st = mk('<div class="pt" style="width:5px;height:5px;transform:translate(-50%,-50%);box-shadow:0 0 10px 2px rgba(200,215,255,.7)"></div>'); at(st, x, y); cstars.push(st);
  const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line'); ln.setAttribute('x1', 0); ln.setAttribute('y1', 0); ln.dataset.x = x; ln.dataset.y = y;
  ln.setAttribute('stroke', 'rgba(200,215,255,.35)'); ln.setAttribute('stroke-width', 1); csvg.appendChild(ln); clines.push(ln);
}
const spark = mk('<div class="ball" style="width:30px;height:30px"></div>'); at(spark, 0, 0);
const halo = mk('<div style="width:520px;height:520px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(200,215,255,.35),rgba(122,162,255,.12) 35%,transparent 65%)"></div>'); at(halo, 0, 0);

/* ---------- A2: every number, every invoice, every reminder ---------- */
const items = [
  { t: 'number', a: 200, html: '<div class="chip" style="transform:translate(-50%,-50%);font-size:20px;color:var(--ink);letter-spacing:.04em;text-transform:none"><span class="ck" style="display:inline-block;width:0;overflow:hidden;color:var(--ok)">✓&nbsp;</span>R 48 200.00</div>' },
  { t: 'invoice', a: 320, html: '<div class="card" style="width:260px"><div class="k"><span class="ck" style="display:inline-block;width:0;overflow:hidden;color:var(--ok)">✓&nbsp;</span>Invoice #1042</div><div class="v" style="font-size:20px">Mabena Logistics</div><div class="s">Due 31 Aug</div></div>' },
  { t: 'reminder', a: 80, html: '<div class="card" style="width:260px"><div class="k"><span class="ck" style="display:inline-block;width:0;overflow:hidden;color:var(--ok)">✓&nbsp;</span>Reminder</div><div class="v" style="font-size:20px">Drafted for client</div><div class="s">Tone: polite, firm</div></div>' }
].map(c => { c.el = mk(c.html); return c; });
const ringP = mk('<svg width="400" height="400" viewBox="-200 -200 400 400" style="transform:translate(-50%,-50%);overflow:visible"><circle r="150" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.2"/><circle r="110" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1"/><path d="M-190 0H-120M120 0H190M0 -190V-120M0 120V190" stroke="rgba(255,255,255,.55)" stroke-width="1.2"/></svg>'); at(ringP, 0, 0);

/* ---------- A3: four agents rise from one spark ---------- */
const tsvg = mk('<svg width="10" height="10" style="overflow:visible"></svg>');
const tlines = ORB.map(([x, y]) => { const l = document.createElementNS('http://www.w3.org/2000/svg', 'path'); l.setAttribute('d', `M0 0 C0 ${y * .55} ${x} ${y * .45} ${x} ${y}`); l.setAttribute('fill', 'none'); l.setAttribute('stroke', 'rgba(200,215,255,.45)'); l.setAttribute('stroke-width', 1.4); l.setAttribute('pathLength', 1); l.setAttribute('stroke-dasharray', '1 1'); tsvg.appendChild(l); return l; });
const orbs = ORB.map(() => mk('<div class="orb"></div>'));
const roles = ['Collections', 'Bills', 'Leads', 'Onboarding'].map(r => mk(`<div class="chip">${r} agent</div>`));
const caps = ['Think', 'Act', 'Care'].map((w, i) => mk(`<div class="word" style="top:900px;font-size:30px;letter-spacing:.42em;text-transform:uppercase;opacity:0">${w}</div>`, screen));
const iris = mk('<div style="position:absolute;inset:0;opacity:0;background:radial-gradient(circle at 50% 50%,#fff 0%,#CFE0FF 20%,#7AA2FF 45%,#B48BFF 75%,#2A1E5A 100%)"></div>', screen);

/* ---------- B1: a document reviewed, a decision prepared ---------- */
const docWrap = mk('<div style="width:0;height:0;perspective:1800px"></div>'); at(docWrap, DC[0] - 60, DC[1]);
const docVals = [['Client', 'Mabena Logistics'], ['VAT number', '4120 •••• 55'], ['Amount due', 'R 48 200.00'], ['Due date', '31 Aug 2026'], ['Status', '30 days overdue'], ['Next step', 'Reminder']];
const doc = mk(`<div class="doc"><h4>Tax Invoice</h4><div class="m">INV-1042 · 30 SEP 2026</div>${docVals.map(([k, v]) => `<div class="row">${k}<b>${v}</b></div>`).join('')}</div>`, docWrap);
const docRows = [...doc.querySelectorAll('.row b')];
const beam = mk('<div style="width:10px;height:700px;transform:translate(-50%,-50%);background:linear-gradient(transparent,rgba(160,190,255,.95) 20%,#fff 50%,rgba(180,139,255,.95) 80%,transparent);box-shadow:0 0 40px 14px rgba(122,162,255,.45),0 0 140px 40px rgba(180,139,255,.2);border-radius:5px"></div>');
const dchips = docVals.map(([k, v]) => mk(`<div class="chip" style="transform:translate(-50%,-50%);font-size:15px;color:var(--ink);letter-spacing:.06em;text-transform:none"><span class="ck" style="display:inline-block;width:0;overflow:hidden;color:var(--ok);vertical-align:bottom">✓&nbsp;</span>${v}</div>`));
const decision = mk('<div class="card" style="width:330px;text-align:center"><div class="k">Decision prepared</div><div class="v" style="font-size:22px">Send reminder to Mabena?</div><div class="s" style="margin-bottom:14px">R 48 200.00 · 30 days overdue</div><div class="btn" style="position:relative;left:50%;top:0;transform:translateX(-50%);font-size:17px;padding:12px 30px;display:inline-block">Approve</div></div>'); at(decision, 3420, -40);
const tapR = mk('<div style="width:60px;height:60px;border-radius:50%;border:2px solid #fff;transform:translate(-50%,-50%)"></div>');

/* ---------- B2: the loop ---------- */
const loopG = mk('<div style="width:0;height:0"></div>'); at(loopG, ...LC);
const loopSVG = mk(`<svg width="900" height="900" viewBox="-450 -450 900 900" style="position:absolute;left:-450px;top:-450px;overflow:visible">
  <circle id="lp" r="${LR}" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90)"/>
  <circle id="lp2" r="${LR}" fill="none" stroke="url(#g)" stroke-width="3" pathLength="1" stroke-dasharray="0 1" transform="rotate(-90)"/>
  <defs><linearGradient id="g"><stop offset="0" stop-color="#7AA2FF"/><stop offset=".5" stop-color="#B48BFF"/><stop offset="1" stop-color="#6FE3D2"/></linearGradient></defs></svg>`, loopG);
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
const logo = mk('<div id="logo"><b>ADC</b> Innovations</div>', screen);
const desc = mk('<div id="desc">PRECISION, AT WORK</div>', screen);
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
  const au = E(t, W.starlight - .4, W.starlight + 1.6) * (1 - .3 * E(t, W.adc, W.adc + 1.5));
  S(document.getElementById('aurora'), { opacity: au * .9, transform: `rotate(${t * 3}deg) scale(${1 + .05 * Math.sin(t * .5)})` });

  /* A: spark + constellation */
  const sp = E(t, W.precision - .3, W.precision + .5, out);
  const pulse = 1 + .12 * Math.sin(t * 2.6) + .5 * win(t, W.alive - .1, W.alive + .15, W.alive + .2, W.alive + .9) + .7 * win(t, W.spark - .1, W.spark + .1, W.spark + .15, W.spark + .8);
  const aOut = 1 - E(t, 23.2, 23.45);
  S(spark, { opacity: sp * aOut, transform: `translate(-50%,-50%) scale(${sp * pulse})` });
  S(halo, { opacity: sp * (.5 + .5 * E(t, W.starlight, W.starlight + 1.5)) * aOut * (1 - .5 * E(t, W.watch, W.rise)), transform: `translate(-50%,-50%) scale(${.8 + .2 * Math.sin(t * 1.3)})` });
  const cOut = 1 - E(t, W.number - .5, W.number + .4);
  cstars.forEach((st, i) => S(st, { opacity: E(t, W.starlight - .2 + i * .12, W.starlight + .4 + i * .12) * cOut }));
  clines.forEach((ln, i) => {
    const s0 = i < 3 ? W.quiet : i < 6 ? W.deliberate : W.alive, p = E(t, s0 - .1 + (i % 3) * .15, s0 + .7 + (i % 3) * .15);
    ln.setAttribute('x2', +ln.dataset.x * p); ln.setAttribute('y2', +ln.dataset.y * p); ln.style.opacity = cOut * (1 + .6 * win(t, W.alive, W.alive + .2, W.alive + .3, W.alive + 1));
  });

  /* A2: items fly in from depth and orbit the spark */
  const orbit = t * 9;
  const iOut = 1 - E(t, W.watch - .3, W.watch + .4);
  items.forEach((c, i) => {
    const t0 = W[c.t] - .2, p = E(t, t0, t0 + 1.0, out), g = E(t, W.gathered - .1, W.gathered + .9);
    const rr = mix(mix(950, 330, p), 250, g), a = (c.a + orbit) * deg;
    S(c.el, { left: Math.cos(a) * rr + 'px', top: Math.sin(a) * rr * .62 + 'px', opacity: p * iOut, transform: `translate(-50%,-50%) scale(${mix(.4, 1, p)})`, filter: `blur(${(1 - p) * 8}px)` });
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
    const focus = i === 1 ? 1 : 1 - .7 * E(t, 22.6, 23.1);
    S(o, { left: x + 'px', top: y + 'px', opacity: E(t, W.rise - .2 + i * .12, W.rise + .2 + i * .12) * aOut * focus, transform: `translate(-50%,-50%) scale(${mix(.25, 1, p) * (1 + .12 * beat)})` });
    S(roles[i], { left: x1 + 'px', top: (y1 + 70) + 'px', opacity: E(t, W.eachone + i * .15, W.eachone + .5 + i * .15) * aOut * focus });
  });
  caps.forEach((c, i) => { const w = [W.think, W.act, W.care][i]; S(c, { opacity: win(t, w - .05, w + .3, (i < 2 ? [W.act, W.care][i] - .25 : 22.6), (i < 2 ? [W.act, W.care][i] - .05 : 22.95)), left: (960 + (i - 1) * 330) + 'px' }); });
  iris.style.opacity = win(t, 23.0, 23.42, 23.48, 23.95);

  /* B1: document reviewed -> decision prepared -> approved */
  const dA = win(t, 23.4, 23.6, W.prepared - .2, W.prepared + .3);
  const tiltIn = E(t, 23.45, 24.8);
  S(doc, { opacity: dA, transform: `translate(-50%,-50%) rotateY(${mix(-38, -16, tiltIn)}deg) rotateX(${mix(18, 8, tiltIn)}deg) rotateZ(${mix(-6, -2, tiltIn)}deg) scale(${1 - .25 * E(t, W.decision, W.prepared + .3)})`, filter: `blur(${10 * E(t, W.decision + .2, W.prepared + .3)}px)` });
  const bp = E(t, 23.9, W.reviewed + .9);
  S(beam, { left: mix(DC[0] - 310, DC[0] + 200, bp) + 'px', top: DC[1] + 'px', opacity: win(t, 23.8, 24.0, W.reviewed + .75, W.reviewed + 1.0) });
  dchips.forEach((c, i) => {
    const lift = E(t, 24.0 + i * .14, 24.7 + i * .14, out), conv = E(t, W.decision + i * .04, W.prepared + .1 + i * .04, inn);
    const x = mix(mix(DC[0], DC[0] + 390, lift), 3420, conv), y = mix(mix(DC[1] - 155 + i * 47, DC[1] - 150 + i * 58, lift), -40, conv);
    S(c, { left: x + 'px', top: y + 'px', opacity: lift * (1 - E(t, W.prepared - .1, W.prepared + .15)), transform: `translate(-50%,-50%) scale(${mix(.8, 1, lift) * (1 - .7 * conv)})` });
    c.querySelector('.ck').style.width = (E(t, W.reviewed + .3 + i * .12, W.reviewed + .5 + i * .12) * 22) + 'px';
    docRows[i].style.opacity = 1 - .75 * lift;
  });
  const dc = E(t, W.prepared - .15, W.prepared + .45, out);
  S(decision, { opacity: dc * (1 - E(t, W.loop - .4, W.loop + .2)), transform: `translate(-50%,-50%) scale(${mix(.85, 1, dc)})` });
  const btn = decision.querySelector('.btn');
  btn.style.transform = `translateX(-50%) scale(${1 - .08 * win(t, W.approve1 - .08, W.approve1, W.approve1 + .05, W.approve1 + .2)})`;
  btn.style.background = t > W.approve1 ? '#BFF5DC' : '';
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
  nodes.forEach((n, i) => { const on = E(t, W[nodeT[i]] - .1, W[nodeT[i]] + .3); S(n, { background: on > .5 ? '#fff' : 'var(--bg)', boxShadow: `0 0 ${26 * on}px ${7 * on}px rgba(122,162,255,.6)`, transform: `translate(-50%,-50%) scale(${1 + .6 * win(t, W[nodeT[i]] - .1, W[nodeT[i]] + .1, W[nodeT[i]] + .2, W[nodeT[i]] + .7)})` }); });
  const ra = (-90 + (t < W.prepare - .25 ? 0 : 360 * lap) + turn) * deg;
  const rv = t < W.twenty ? win(t, W.loop + .2, W.gently, W.twenty - .2, W.twenty) : 0;
  S(runner, { left: LC[0] + LR * Math.cos(ra) + 'px', top: LC[1] + LR * Math.sin(ra) + 'px', opacity: rv });
  // twenty tasks race the loop; one slips and is caught
  const cnt = Math.round(20 * E(t, W.twenty - .1, W.automated + .4, p => p));
  core.innerHTML = t < W.twenty - .2 ? 'ONE LOOP' : `${String(cnt).padStart(2, '0')} / 20<br><span style="font-size:14px;opacity:.6">TASKS AUTOMATED</span>`;
  core.style.opacity = lA * E(t, W.loop, W.loop + .6);
  pills.forEach((p, i) => {
    const s0 = W.twenty - .2 + i * .06, prog = E(t, s0, s0 + .5, out);
    const ang = (-90 + i * 18 + turn + 30 * E(t, W.twenty, W.behind + 1, p => p)) * deg;
    let rr = mix(LR + 160, LR, prog);
    if (i === 7) rr += 120 * win(t, W.slipping - .3, W.slipping + .2, W.reach - .1, W.reach + .4);
    const done = i < cnt;
    S(p, { left: LC[0] + rr * Math.cos(ang) + 'px', top: LC[1] + rr * Math.sin(ang) + 'px', opacity: prog * (1 - E(t, W.choose - .4, W.choose + .2)),
      background: done ? 'linear-gradient(135deg,#7AA2FF,#B48BFF)' : 'rgba(255,255,255,.25)', boxShadow: done ? '0 0 12px 3px rgba(122,162,255,.5)' : 'none',
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
    tl.querySelector('.tg').style.background = on > .5 ? 'linear-gradient(90deg,#7AA2FF,#B48BFF)' : 'rgba(255,255,255,.12)';
    tl.querySelector('.tg i').style.transform = `translateX(${on * 20}px)`;
  });
  extra.forEach((e, i) => { const s = W.grow - .2 + i * .035; S(e, { left: e.dataset.x + 'px', top: e.dataset.y + 'px', opacity: E(t, s, s + .4) * .55, transform: `translate(-50%,-50%) scale(${mix(.8, 1, E(t, s, s + .4))})` }); });

  /* end card */
  const eb = win(t, W.adc - .7, W.adc - .2, W.adc + .1, W.adc + .5);
  S(endBall, { left: '960px', top: '520px', opacity: eb, transform: `translate(-50%,-50%) scale(${1 + 6 * E(t, W.adc - .2, W.adc + .5)})` });
  const lg = E(t, W.adc, W.adc + 1.1);
  S(logo, { opacity: lg, filter: `blur(${(1 - lg) * 16}px)`, letterSpacing: mix(.12, -.01, lg) + 'em' });
  const ds = E(t, W.precision2 - .1, W.atwork + .6);
  S(desc, { opacity: ds, letterSpacing: mix(.5, .14, ds) + 'em' });
  const ct = E(t, W.book - .1, W.book + .6, out);
  S(cta, { opacity: ct, transform: `translate(-50%,-50%) translateY(${24 * (1 - ct)}px)` });
  document.getElementById('stage').style.filter = `brightness(${1 - E(t, DUR - .6, DUR)})`;
}
window.render = render; window.DUR = DUR;
document.fonts.ready.then(() => { render(+(new URLSearchParams(location.search).get('t') || 0)); window.READY = true; });
