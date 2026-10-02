/* SmartTech NXT — "Crossroads". Every motion is keyed to a word in W (timing.js). */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const io = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const out = p => 1 - Math.pow(1 - p, 4);
const inn = p => p * p * p;
const lin = p => p;
const E = (t, a, b, f = io) => f(clamp((t - a) / (b - a)));
const mix = (a, b, p) => a + (b - a) * p;
const win = (t, a, b, c, d) => E(t, a, b) * (1 - E(t, c, d));
const S = (el, o) => { for (const k in o) el.style[k] = o[k]; };
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const deg = Math.PI / 180, Z = Math.log;
const world = document.getElementById('world'), screen = document.getElementById('screen');
const mk = (html, parent = world) => { const d = document.createElement('div'); d.innerHTML = html.trim(); const el = d.firstElementChild; parent.appendChild(el); return el; };
const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; };
const svgEl = (tag, attrs, parent) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };

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

/* ================= layout (world coordinates) ================= */
const WINX = [-900, -300, 300, 900], WINY = -230;            // four systems along the crossroads
const NOISE = [600, -640];                                    // messages + signal lost
const HUB = [3500, 0];                                        // the bridge / robots hub
const DOCP = [3500, 900], TGT = [[4300, 760], [4300, 1060]];  // read + move
const AUD = [4300, 1700];                                     // audit trail
const TARGET = [5400, 1900];                                  // precision

/* camera: [t, cx, cy, ln(zoom), rotDeg] — times are tied to the words */
const CAM = [
  [[0, 0, 650, Z(1.7), 0], [W.crossroads + .4, 0, 40, Z(1.25), 0], [W.systems - .3, 0, 0, Z(.85), 0], [W.systems + .4, -700, -140, Z(1.0), 0],
   [W.speak + 1.2, 700, -140, Z(1.0), 0], [W.data + .5, 300, WINY, Z(2.0), 0], [W.again - .4, 300, WINY, Z(2.1), 0], [W.again + .1, 900, WINY, Z(2.1), 0],
   [W.invoices - .4, 900, WINY - 40, Z(1.8), 0], [W.onboarding, 900, -620, Z(1.25), 0], [W.monthend + .6, 900, -900, Z(1.15), 0],
   [W.messages + .2, 650, -660, Z(.78), 0], [W.chasing + 1.0, NOISE[0], NOISE[1], Z(.62), -4], [W.signal + .2, NOISE[0], NOISE[1], Z(.8), 0],
   [W.noise + .6, NOISE[0], NOISE[1], Z(.95), 0], [W.stnxt + .2, NOISE[0] + 200, NOISE[1], Z(.95), 0],
   [W.bridge - .5, HUB[0] - 250, HUB[1], Z(1.0), 0], [W.bridge + .3, HUB[0], HUB[1], Z(1.3), 0], [W.robots + .2, HUB[0], HUB[1], Z(1.15), 0],
   [W.people + .4, HUB[0], HUB[1], Z(.74), 3], [W.connect + .2, HUB[0], HUB[1], Z(.62), 0], [W.systemsHave + .8, HUB[0], HUB[1], Z(.6), -3],
   [W.read + .2, DOCP[0], DOCP[1], Z(1.3), 0], [W.move - .2, DOCP[0], DOCP[1], Z(1.45), 0], [W.exactly, 3950, 900, Z(1.05), 0],
   [W.belongs + .3, 4300, 900, Z(1.2), 0], [W.step + .1, AUD[0] + 60, AUD[1] + 60, Z(1.1), 0], [W.traceable + .5, AUD[0] + 40, AUD[1] + 170, Z(1.15), 0],
   [W.guesswork + .1, TARGET[0], TARGET[1], Z(.9), 0], [W.precision, TARGET[0], TARGET[1], Z(1.05), 0], [W.target - .2, TARGET[0], TARGET[1], Z(1.6), 0],
   [W.target + .45, TARGET[0], TARGET[1], Z(3.2), 0], [W.target + 1.1, TARGET[0], TARGET[1], Z(14), 0]]
];
const camAt = t => { const [x, y, lz, r] = spline(CAM[0], t); return [x, y, Math.exp(lz), r]; };

/* ================= background: brand texture + precision grid + lime dust ================= */
const grid = svgEl('svg', { width: 9000, height: 5000, viewBox: '-2000 -1600 9000 5000' }); grid.style.cssText = 'position:absolute;left:-2000px;top:-1600px;overflow:visible';
for (let x = -2000; x <= 7000; x += 160) svgEl('line', { x1: x, y1: -1600, x2: x, y2: 3400, stroke: 'rgba(255,255,255,.045)', 'stroke-width': 1 }, grid);
for (let y = -1600; y <= 3400; y += 160) svgEl('line', { x1: -2000, y1: y, x2: 7000, y2: y, stroke: 'rgba(255,255,255,.045)', 'stroke-width': 1 }, grid);
for (let x = -2000; x <= 7000; x += 640) for (let y = -1600; y <= 3400; y += 640) svgEl('path', { d: `M${x - 8} ${y}H${x + 8}M${x} ${y - 8}V${y + 8}`, stroke: 'rgba(181,211,52,.35)', 'stroke-width': 1.2 }, grid);
world.appendChild(grid);
const dust = []; for (let i = 0; i < 70; i++) { const d = mk('<div style="position:absolute;border-radius:50%;background:#B5D334"></div>', screen); const s = 1 + rnd(i) * 2.5; S(d, { width: s + 'px', height: s + 'px' }); dust.push({ el: d, x: rnd(i + 1) * 1920, y: rnd(i + 2) * 1080, k: .3 + rnd(i + 3), a: .15 + rnd(i + 4) * .45 }); }

/* ================= 1. the crossroads ================= */
const road = svgEl('svg', { width: 10, height: 10 }); road.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
const stem = svgEl('path', { d: 'M0 1100 V0', stroke: '#B5D334', 'stroke-width': 3, fill: 'none', pathLength: 1, 'stroke-dasharray': '1 1' }, road);
const armL = svgEl('path', { d: 'M0 0 H-1250', stroke: '#B5D334', 'stroke-width': 3, fill: 'none', pathLength: 1, 'stroke-dasharray': '1 1' }, road);
const armR = svgEl('path', { d: 'M0 0 H1250', stroke: '#B5D334', 'stroke-width': 3, fill: 'none', pathLength: 1, 'stroke-dasharray': '1 1' }, road);
world.appendChild(road);
const junction = mk('<div class="c" style="width:120px;height:120px;border-radius:50%;border:1.5px solid rgba(181,211,52,.6)"></div>'); at(junction, 0, 0);
const tip = mk('<div class="c ldot"></div>');

/* ================= 2. systems that don't speak ================= */
const sysNames = ['ERP', 'CRM', 'PAYROLL', 'BANKING'];
const sysFields = [[['Supplier', 'Mabena Logistics'], ['Invoice', 'INV-2214']], [['Client ID', ''], ['Amount', '']], [['Employee', 'T. Nkosi'], ['Status', 'Pending']], [['Account', '•••• 4410'], ['Amount', '']]];
const wins = WINX.map((x, i) => {
  const w = mk(`<div class="win c"><div class="tb"><b></b><b></b><b></b><span>${sysNames[i]}</span></div><div class="bd">${sysFields[i].map(([l, v]) => `<div class="fld"><div class="l">${l}</div><div class="v">${v}</div></div>`).join('')}</div></div>`);
  at(w, x, WINY); return w;
});
const links = svgEl('svg', { width: 10, height: 10 }); links.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
const brk = WINX.map(x => ({ up: svgEl('path', { d: `M${x} ${WINY + 120} V${WINY + 175}`, stroke: 'rgba(255,255,255,.45)', 'stroke-width': 1.5, 'stroke-dasharray': '5 6', fill: 'none' }, links),
  dn: svgEl('path', { d: `M${x} -2 V-28`, stroke: 'rgba(255,255,255,.45)', 'stroke-width': 1.5, 'stroke-dasharray': '5 6', fill: 'none' }, links),
  x: svgEl('path', { d: `M${x - 7} ${WINY + 190}L${x + 7} ${WINY + 204}M${x + 7} ${WINY + 190}L${x - 7} ${WINY + 204}`, stroke: '#FF6B5E', 'stroke-width': 2 }, links) }));
world.appendChild(links);
const typeA = wins[2].querySelectorAll('.fld .v')[1], typeB = wins[3].querySelectorAll('.fld .v')[1];

/* ================= 3. invoices, onboarding, month-end ================= */
const docHTML = (title, meta, rows) => `<div class="doc c"><h4>${title}</h4><div class="m">${meta}</div>${rows.map(([a, b]) => `<div class="r">${a}<b>${b}</b></div>`).join('')}<div class="bar" style="width:70%"></div><div class="bar" style="width:45%"></div></div>`;
const docs = [
  [docHTML('Tax Invoice', 'INV-2214 · 28 SEP', [['Supplier', 'Mabena Logistics'], ['Amount', 'R 84 500.00'], ['Due', '28 Oct']]), 'invoices', -250, -700, -8],
  [docHTML('Onboarding Pack', 'NEW STARTER · T. NKOSI', [['ID copy', 'Missing'], ['Bank details', 'Pending'], ['Contract', 'Unsigned']]), 'onboarding', 0, -760, 3],
  [docHTML('Month-end Close', 'SEPTEMBER', [['Reconciled', '61%'], ['Open items', '143'], ['Deadline', 'Friday']]), 'monthend', 250, -820, 9]
].map(([h, w, dx, dy, r]) => ({ el: mk(h), w, x: 900 + dx, y: dy, r }));
const caps = ['Invoices.', 'Onboarding.', 'Month-end.'].map((c, i) => mk(`<div class="cap" style="opacity:0">${c}</div>`, screen));

/* ================= 4. messages chasing messages ================= */
const msgs = ['Did anyone capture INV-2214?', 'Which spreadsheet is the latest?', 'Still waiting on the ID copy', 'Can you resend the bank details?',
  'Payroll doesn’t match the HR file', 'Month-end is Friday…', 'RE: RE: RE: Invoice', 'Who approved this?', 'Typed it in twice. Still wrong.',
  'Is this in the CRM yet?', 'Need the onboarding pack today', 'Resending…', 'Can someone check this?', 'Following up again'];
const who = ['FINANCE', 'OPS', 'HR', 'TREASURY', 'PAYROLL', 'CFO', 'ACCOUNTS', 'AUDIT', 'FINANCE', 'SALES', 'HR', 'OPS', 'CFO', 'ACCOUNTS'];
const bubbles = msgs.map((m, i) => {
  const b = mk(`<div class="bub c"><i>${who[i]}</i>${m}</div>`);
  const a = i * 137.5 * deg, r = 260 + (i % 5) * 140;
  return { el: b, x: NOISE[0] + Math.cos(a) * r * 1.7, y: NOISE[1] + Math.sin(a) * r * .9, s: i };
});

/* ================= 5. the signal lost in the noise (world) ================= */
const wave = svgEl('svg', { width: 10, height: 10 }); wave.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
const wpath = svgEl('path', { fill: 'none', stroke: '#B5D334', 'stroke-width': 3, 'stroke-linecap': 'round' }, wave);
const wglow = svgEl('path', { fill: 'none', stroke: 'rgba(181,211,52,.25)', 'stroke-width': 12, 'stroke-linecap': 'round' }, wave);
world.appendChild(wave);
function waveD(cx, cy, w, amp, noise, t, seed = 0) {
  let d = ''; const n = 220;
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = cx - w / 2 + u * w, env = Math.sin(Math.PI * u);
    const clean = Math.sin(u * 14 * Math.PI + t * 3) * amp * env;
    const nz = (Math.sin(i * 12.9898 + Math.floor(t * 24) * 78.233 + seed) * 43758.5453 % 1) * noise * env;
    d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + (cy + clean + nz).toFixed(1);
  }
  return d;
}

/* ================= 6. SmartTech NXT builds the bridge (the double T from the logo) ================= */
const wmT = document.getElementById('wordmark').innerHTML;
const bridge = mk(`<div class="c" style="width:700px;height:800px">${wmT.replace(/viewBox="[^"]*"/, 'viewBox="515 -10 185 210"').replace(/width="[^"]*" height="[^"]*"/, 'width="700" height="800"')}</div>`);
bridge.querySelectorAll('path').forEach(p => { if (p.id !== 'L4' && p.id !== 'antenna') p.style.display = 'none'; });
const bT = bridge.querySelector('#L4'), bBar = bridge.querySelector('#antenna');
at(bridge, HUB[0], HUB[1]);

/* ================= 7. robots alongside people ================= */
const avatar = mk(`<div class="c" style="width:420px;height:420px">${document.getElementById('avatar').innerHTML.replace(/width="206" height="206"/, 'width="420" height="420"')}</div>`); at(avatar, HUB[0], HUB[1]);
const ring = avatar.querySelector('#ring'); ring.setAttribute('pathLength', 1); ring.setAttribute('stroke-dasharray', '1 1');
const personSVG = '<svg class="person" viewBox="0 0 44 58"><circle cx="22" cy="13" r="11" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M3 57 C3 36 11 28 22 28 C33 28 41 36 41 57" fill="none" stroke="#fff" stroke-width="1.6"/></svg>';
const pairs = [0, 1, 2, 3, 4, 5].map(i => { const a = (-90 + i * 60) * deg, r = 470; const p = mk(`<div class="c">${personSVG}</div>`); const d = mk('<div class="c ldot"></div>'); return { p, d, x: HUB[0] + Math.cos(a) * r, y: HUB[1] + Math.sin(a) * r * .85, a }; });

/* ================= 8. connect the systems you already have ================= */
const hubAng = [-150, -30, 150, 30];
const hubWins = sysNames.map((n, i) => { const w = mk(`<div class="win c" style="width:300px"><div class="tb"><b></b><b></b><b></b><span>${n}</span></div><div class="bd"><div class="fld"><div class="v" style="height:26px"></div></div><div class="fld" style="margin:0"><div class="v" style="height:26px;width:70%"></div></div></div></div>`); const a = hubAng[i] * deg; at(w, HUB[0] + Math.cos(a) * 980, HUB[1] + Math.sin(a) * 620); return w; });
const hubLines = svgEl('svg', { width: 10, height: 10 }); hubLines.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
const hl = hubAng.map(a => { const x = HUB[0] + Math.cos(a * deg) * 980, y = HUB[1] + Math.sin(a * deg) * 620; return svgEl('path', { d: `M${HUB[0]} ${HUB[1]} L${x} ${y}`, stroke: '#B5D334', 'stroke-width': 2.5, fill: 'none', pathLength: 1, 'stroke-dasharray': '1 1' }, hubLines); });
world.appendChild(hubLines);
const pulses = hubAng.map(() => mk('<div class="c" style="width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 0 16px 4px rgba(181,211,52,.8)"></div>'));
const oks = ['INV-2214 captured', 'Onboarding pack complete', 'Payroll reconciled', 'Payment scheduled'].map((m, i) => { const b = mk(`<div class="bub ok c" style="font-size:17px"><i>SMARTTECH NXT ROBOT</i>${m} ✓</div>`); const a = hubAng[i] * deg; at(b, HUB[0] + Math.cos(a) * 980, HUB[1] + Math.sin(a) * 620 + (Math.sin(a) < 0 ? -190 : 190)); return b; });

/* ================= 9. read every document, move every detail ================= */
const doc2 = mk(docHTML('Tax Invoice', 'INV-2214 · 28 SEP', [['Supplier', 'Mabena Logistics'], ['VAT no.', '4120 6633 55'], ['Amount', 'R 84 500.00'], ['PO', 'PO-7781']]));
at(doc2, DOCP[0], DOCP[1]);
const docVals = [...doc2.querySelectorAll('.r b')];
const beam = mk('<div class="c" style="width:470px;height:4px;border-radius:2px;background:#B5D334;box-shadow:0 0 30px 8px rgba(181,211,52,.55)"></div>');
const tWins = TGT.map((p, i) => { const w = mk(`<div class="win c" style="width:360px"><div class="tb"><b></b><b></b><b></b><span>${i ? 'BANKING' : 'ERP'}</span></div><div class="bd">${(i ? ['Payee', 'Amount'] : ['Supplier', 'Amount']).map(l => `<div class="fld"><div class="l">${l}</div><div class="v"></div></div>`).join('')}</div></div>`); at(w, p[0], p[1]); return w; });
const moves = [['Mabena Logistics', 0, 0], ['R 84 500.00', 0, 1], ['Mabena Logistics', 1, 0], ['R 84 500.00', 1, 1]];
const mchips = moves.map(([v]) => mk(`<div class="chip c">${v}</div>`));
const xmarks = moves.map(() => mk('<svg class="c" width="44" height="44" viewBox="-22 -22 44 44" style="overflow:visible"><path d="M-14 -14L14 14M14 -14L-14 14" stroke="#B5D334" stroke-width="2"/><path d="M-6 -14L22 14M22 -14L-6 14" stroke="#B5D334" stroke-width="2" opacity=".7"/></svg>'));
const tFields = TGT.map((p, i) => [...tWins[i].querySelectorAll('.fld .v')]);

/* ================= 10. every step recorded, every decision traceable ================= */
const audRows = [['08:02:11', 'Invoice INV-2214 received'], ['08:02:12', 'Supplier matched · ERP'], ['08:02:12', 'Amount verified · R 84 500.00'], ['08:02:13', 'Posted to ledger'], ['08:02:14', 'Decision: approved for payment']]
  .map(([a, b], i) => { const r = mk(`<div class="row"><span>${a}</span>${b}</div>`); at(r, AUD[0] - 330, AUD[1] - 70 + i * 90); return r; });
const audLine = svgEl('svg', { width: 10, height: 10 }); audLine.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
const spine = svgEl('path', { d: `M${AUD[0] - 370} ${AUD[1] - 50} V${AUD[1] + 312}`, stroke: '#B5D334', 'stroke-width': 2, fill: 'none', pathLength: 1, 'stroke-dasharray': '1 1' }, audLine);
const adots = audRows.map((r, i) => svgEl('circle', { cx: AUD[0] - 370, cy: AUD[1] - 48 + i * 90, r: 7, fill: '#B5D334' }, audLine));
const traces = [1, 2].map(k => svgEl('path', { d: `M${AUD[0] - 370} ${AUD[1] - 48 + 4 * 90} C${AUD[0] - 560} ${AUD[1] - 48 + 4 * 90} ${AUD[0] - 560} ${AUD[1] - 48 + k * 90} ${AUD[0] - 370} ${AUD[1] - 48 + k * 90}`, stroke: '#fff', 'stroke-width': 1.5, fill: 'none', pathLength: 1, 'stroke-dasharray': '1 1', opacity: .8 }, audLine));
world.appendChild(audLine);

/* ================= 11. no guesswork, just precision, right on target ================= */
const tgt = svgEl('svg', { width: 10, height: 10 }); tgt.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
const rings = [70, 140, 220, 320].map(r => svgEl('circle', { cx: TARGET[0], cy: TARGET[1], r, fill: 'none', stroke: 'rgba(255,255,255,.35)', 'stroke-width': 1.3, pathLength: 1, 'stroke-dasharray': '1 1' }, tgt));
const cross = svgEl('g', {}, tgt);
svgEl('path', { d: `M${TARGET[0] - 40} ${TARGET[1] - 40}L${TARGET[0] + 40} ${TARGET[1] + 40}M${TARGET[0] + 40} ${TARGET[1] - 40}L${TARGET[0] - 40} ${TARGET[1] + 40}`, stroke: '#B5D334', 'stroke-width': 2.5 }, cross);
svgEl('path', { d: `M${TARGET[0] - 18} ${TARGET[1] - 40}L${TARGET[0] + 62} ${TARGET[1] + 40}M${TARGET[0] + 62} ${TARGET[1] - 40}L${TARGET[0] - 18} ${TARGET[1] + 40}`, stroke: '#B5D334', 'stroke-width': 2.5, opacity: .7 }, cross);
svgEl('path', { d: `M${TARGET[0] - 420} ${TARGET[1]}H${TARGET[0] - 340}M${TARGET[0] + 340} ${TARGET[1]}H${TARGET[0] + 420}M${TARGET[0]} ${TARGET[1] - 420}V${TARGET[1] - 340}M${TARGET[0]} ${TARGET[1] + 340}V${TARGET[1] + 420}`, stroke: 'rgba(255,255,255,.6)', 'stroke-width': 1.5 }, tgt);
world.appendChild(tgt);
const misses = [0, 1, 2, 3, 4, 5].map(i => { const m = mk('<div class="c" style="width:18px;height:18px;border-radius:50%;background:rgba(255,255,255,.35)"></div>'); const a = (i * 97 + 20) * deg, r = 120 + rnd(i + 9) * 200; at(m, TARGET[0] + Math.cos(a) * r, TARGET[1] + Math.sin(a) * r); return m; });
const jack = mk('<div class="c" style="width:30px;height:30px;border-radius:50%;background:#fff;box-shadow:0 0 30px 8px rgba(181,211,52,.6)"></div>');
const pctag = mk('<div class="cap" style="opacity:0">No guesswork.</div>', screen), pctag2 = mk('<div class="cap" style="opacity:0"><b>Precision.</b></div>', screen);

/* ================= 12. clearer, sharper (screen) ================= */
const clear = mk('<div style="position:absolute;inset:0;opacity:0"></div>', screen);
const bigAv = mk(`<div style="position:absolute;left:1180px;top:-140px;width:1100px;height:1100px;opacity:.09">${document.getElementById('avatar').innerHTML.replace(/width="206" height="206"/, 'width="1100" height="1100"')}</div>`, clear);
bigAv.querySelectorAll('path').forEach(p => { if (p.id === 'ring') { p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#ffffff'); } else p.setAttribute('fill', '#ffffff'); });
const cw = svgEl('svg', { width: 1920, height: 1080 }, clear); cw.style.cssText = 'position:absolute;left:0;top:0';
const cwGlow = svgEl('path', { fill: 'none', stroke: 'rgba(181,211,52,.25)', 'stroke-width': 14, 'stroke-linecap': 'round' }, cw);
const cwPath = svgEl('path', { fill: 'none', stroke: '#B5D334', 'stroke-width': 3, 'stroke-linecap': 'round' }, cw);
const ccap = mk('<div class="cap" style="opacity:0"></div>', screen);

/* ================= 13. logo + tagline + CTA (left-aligned per brand bible) ================= */
const LOGO_W = 1100, LOGO_X = 410, LOGO_Y = 440;
const logo = mk(`<div style="position:absolute;left:${LOGO_X}px;top:${LOGO_Y}px;width:${LOGO_W}px">${wmT.replace(/width="[^"]*" height="[^"]*"/, `width="${LOGO_W}"`)}</div>`, screen);
const lp = { letters: [...logo.querySelectorAll('.letter')], ant: logo.querySelector('#antenna'), n: logo.querySelector('#N0'), x1: logo.querySelector('#N1'), x2: logo.querySelector('#N2'), dot: logo.querySelector('#dot'), t: logo.querySelector('#N3') };
const smartW = (1336 - 255) / 1409.3 * LOGO_W;   // width of "SMARTTECH" — the tagline matches it
const tag = mk(`<div style="position:absolute;left:${LOGO_X + 2}px;top:${LOGO_Y + 175}px;font-weight:500;font-size:30px;white-space:nowrap;color:#fff"><span>SIMPLER</span> <span>SMARTER</span> <span>AUTOMATION</span></div>`, screen);
const tagW = [...tag.children];
const url = mk(`<div style="position:absolute;left:${LOGO_X + 2}px;top:${LOGO_Y + 250}px;font-weight:300;font-size:28px;letter-spacing:.08em;color:#B5D334">www.smarttechnxt.com</div>`, screen);
function fitTag() { tag.style.letterSpacing = '0px'; const w0 = tag.getBoundingClientRect().width; const n = tag.textContent.length; tag.style.letterSpacing = ((smartW - w0) / n) + 'px'; }

/* ================= render ================= */
function render(t) {
  const [cx, cy, z, r] = camAt(t);
  S(world, { transform: `translate(960px,540px) scale(${z}) rotate(${r}deg) translate(${-cx}px,${-cy}px)` });
  const worldOn = 1 - E(t, W.target + 1.0, W.target + 1.15);
  world.style.opacity = worldOn; world.style.display = worldOn <= 0 ? 'none' : 'block';
  S(document.getElementById('tex'), { transform: `translate(${-cx * .03}px,${-cy * .03}px) scale(${1.05 + .04 * Math.sin(t * .2)})`, opacity: .45 + .2 * E(t, W.picture, W.sharper + .5) });
  dust.forEach(d => { let x = (d.x - cx * .06 * d.k + t * 8 * d.k) % 1920, y = (d.y - cy * .06 * d.k - t * 5 * d.k) % 1080; if (x < 0) x += 1920; if (y < 0) y += 1080; S(d.el, { transform: `translate(${x}px,${y}px)`, opacity: d.a * E(t, .5, 2.5) }); });
  grid.style.opacity = .9 * E(t, W.systems - .5, W.systems + .8);

  /* 1. crossroads: a line rises, meets the junction, splits */
  const rise = E(t, .2, W.crossroads + .3, io);
  stem.style.strokeDashoffset = 1 - rise;
  armL.style.strokeDashoffset = armR.style.strokeDashoffset = 1 - E(t, W.crossroads + .1, W.systems + .3, out);
  const roadA = 1 - .75 * E(t, W.messages - .4, W.messages + .4); road.style.opacity = roadA * (1 - E(t, W.stnxt, W.stnxt + .6));
  S(tip, { left: '0px', top: mix(1100, 0, rise) + 'px', opacity: E(t, 0, .6) * (1 - E(t, W.crossroads + .2, W.crossroads + .6)) });
  S(junction, { opacity: win(t, W.crossroads - .1, W.crossroads + .3, W.speak, W.speak + .5), transform: `translate(-50%,-50%) scale(${mix(2.2, 1, E(t, W.crossroads - .1, W.crossroads + .4, out))})` });

  /* 2. four systems, each alone; the links break */
  const winOut = 1 - E(t, W.invoices - .3, W.invoices + .3);
  wins.forEach((w, i) => { const s0 = W.systems - .2 + i * .22, a = E(t, s0, s0 + .6, out); S(w, { opacity: a * winOut * (1 - .4 * E(t, W.monthend, W.monthend + .5)), transform: `translate(-50%,-50%) translateY(${30 * (1 - a)}px) scale(${mix(.92, 1, a)})` }); });
  brk.forEach((b, i) => { const a = E(t, W.speak - .2 + i * .15, W.speak + .3 + i * .15); b.up.style.opacity = b.dn.style.opacity = a * winOut; b.x.style.opacity = E(t, W.speak + .2 + i * .15, W.speak + .45 + i * .15) * winOut; });
  /* data typed in... and typed in again (with an error) */
  const v1 = 'R 84 500.00', v2 = 'R 84 050.00';
  const p1 = clamp((t - (W.data + .2)) / 1.2), p2 = clamp((t - (W.again + .15)) / 1.0);
  typeA.innerHTML = 'R 84 500.00'.slice(0, Math.round(v1.length * p1)) + (p1 > 0 && p1 < 1 && Math.floor(t * 4) % 2 ? '<span class="caret"></span>' : '');
  typeB.innerHTML = v2.slice(0, Math.round(v2.length * p2)) + (p2 > 0 && p2 < 1 && Math.floor(t * 4) % 2 ? '<span class="caret"></span>' : '');
  typeB.classList.toggle('err', p2 >= 1);

  /* 3. the paperwork stacks up — the camera tilts up with it */
  docs.forEach((d, i) => { const a = E(t, W[d.w] - .25, W[d.w] + .45, out); const o = 1 - E(t, W.messages + .4, W.messages + 1.1); S(d.el, { left: d.x + 'px', top: (d.y - 200 * (1 - a)) + 'px', opacity: a * o, transform: `translate(-50%,-50%) rotate(${d.r * a}deg) scale(${mix(1.15, 1, a) * (1 - .25 * (1 - o))})` }); });
  caps.forEach((c, i) => { const w = W[['invoices', 'onboarding', 'monthend'][i]]; const nx = [W.onboarding, W.monthend, W.messages][i]; S(c, { opacity: win(t, w - .1, w + .2, nx - .2, nx), transform: `translateX(${16 * (1 - E(t, w - .1, w + .3))}px)` }); });

  /* 4. messages chasing messages: they multiply, faster and faster */
  bubbles.forEach((b, i) => {
    const s0 = W.messages - .1 + Math.pow(i / msgs.length, .7) * (W.signal - W.messages - .2), a = E(t, s0, s0 + .35, out);
    const o = 1 - E(t, W.signal - .2 + (i % 4) * .08, W.signal + .5 + (i % 4) * .08);
    const jit = Math.sin(t * 9 + i) * 3 * E(t, W.chasing, W.signal);
    S(b.el, { left: (b.x + jit) + 'px', top: (b.y + mix(30, 0, a)) + 'px', opacity: a * o, transform: `translate(-50%,-50%) scale(${mix(.6, 1, a)})` });
  });

  /* 5. and the signal gets lost in the noise */
  const wA = win(t, W.signal - .4, W.signal + .3, W.bridge - .4, W.bridge);
  const nz = 20 + 220 * E(t, W.lost - .2, W.noise + .3) - 230 * E(t, W.noise + .6, W.stnxt - .1);
  const amp = 70 * (1 - .9 * E(t, W.noise + .6, W.stnxt - .1));
  // on "SmartTech NXT" the dead line straightens, shrinks and flies right — it becomes the bridge
  const fly = E(t, W.stnxt + .1, W.bridge - .05, io);
  const ww = mix(2600, 169 * 800 / 210, fly), wcx = mix(NOISE[0], HUB[0], fly), wcy = mix(NOISE[1], HUB[1] - 400 + 14 * 800 / 210, fly);
  const dd = waveD(wcx, wcy, ww, amp * (1 - fly), Math.max(0, nz) * (1 - fly), t);
  wpath.setAttribute('d', dd); wglow.setAttribute('d', dd); wave.style.opacity = wA;
  wpath.setAttribute('stroke-width', mix(3, 6, fly));

  /* 6. the bridge: the double T from the logo, crowned by the antenna bar */
  const bA = E(t, W.bridge - .5, W.bridge + .1);
  S(bridge, { opacity: bA * (1 - E(t, W.robots + .4, W.robots + 1.0)), transform: `translate(-50%,-50%) scale(${mix(.94, 1, bA)})` });
  bT.style.opacity = E(t, W.bridge - .6, W.bridge - .1); bBar.style.opacity = E(t, W.bridge - .15, W.bridge);

  /* 7. robots alongside people */
  const avA = E(t, W.robots - .1, W.robots + .7);
  S(avatar, { opacity: avA * (1 - E(t, W.read - .5, W.read)), transform: `translate(-50%,-50%) scale(${mix(1.25, 1, avA)})` });
  ring.style.strokeDashoffset = 1 - E(t, W.robots, W.robots + 1.2);
  pairs.forEach((p, i) => {
    const s0 = W.alongside - .5 + i * .14, a = E(t, s0, s0 + .5, out), o = 1 - E(t, W.read - .5, W.read);
    const orbit = (t - W.alongside) * 6 * deg, ang = p.a + orbit, rr = mix(300, 470, a);
    const px = HUB[0] + Math.cos(ang) * rr, py = HUB[1] + Math.sin(ang) * rr * .85;
    S(p.p, { left: px + 'px', top: py + 'px', opacity: a * o * (1 - .6 * E(t, W.connect - .2, W.connect + .4)) });
    const da = ang + 0.16;
    S(p.d, { left: HUB[0] + Math.cos(da) * rr + 'px', top: HUB[1] + Math.sin(da) * rr * .85 + 'px', opacity: E(t, W.people - .3 + i * .08, W.people + .1 + i * .08) * o * (1 - .6 * E(t, W.connect - .2, W.connect + .4)) });
  });

  /* 8. they connect the systems you already have */
  const cA = 1 - E(t, W.read - .5, W.read);
  hl.forEach((l, i) => { l.style.strokeDashoffset = 1 - E(t, W.connect - .1 + i * .15, W.connect + .7 + i * .15); l.style.opacity = cA; });
  hubWins.forEach((w, i) => { const a = E(t, W.connect - .4 + i * .15, W.connect + .3 + i * .15, out); S(w, { opacity: a * cA, transform: `translate(-50%,-50%) scale(${mix(.85, 1, a)})` }); });
  pulses.forEach((p, i) => { const k = ((t - W.connect - .8 - i * .2) * .8) % 1; const a = hubAng[i] * deg; const on = t > W.connect + .8 ? 1 : 0; S(p, { left: HUB[0] + Math.cos(a) * 980 * clamp(k) + 'px', top: HUB[1] + Math.sin(a) * 620 * clamp(k) + 'px', opacity: on * cA }); });
  oks.forEach((b, i) => { const s0 = W.systemsHave - .2 + i * .2; S(b, { opacity: E(t, s0, s0 + .4, out) * cA, transform: `translate(-50%,-50%) scale(${mix(.7, 1, E(t, s0, s0 + .4, out))})` }); });

  /* 9. read every document */
  const d2 = win(t, W.read - .5, W.read + .1, W.belongs + .4, W.belongs + 1);
  S(doc2, { opacity: d2, transform: `translate(-50%,-50%) perspective(1600px) rotateY(${mix(-25, -8, E(t, W.read - .5, W.read + 1))}deg) rotateX(6deg)` });
  const bp = E(t, W.read + .1, W.move - .2);
  S(beam, { left: DOCP[0] + 'px', top: (DOCP[1] - 150 + 330 * bp) + 'px', opacity: win(t, W.read, W.read + .2, W.move - .3, W.move - .1) });
  docVals.forEach((v, i) => { const hit = E(t, W.read + .3 + i * .3, W.read + .5 + i * .3); v.style.color = hit > .5 ? '#5E7A0A' : ''; v.style.background = hit > .5 ? 'rgba(181,211,52,.25)' : ''; });
  // ...and move every detail exactly where it belongs
  tWins.forEach((w, i) => { const a = E(t, W.move - .4 + i * .2, W.move + .2 + i * .2, out); S(w, { opacity: a * (1 - E(t, W.belongs + .4, W.belongs + 1)), transform: `translate(-50%,-50%) scale(${mix(.9, 1, a)})` }); });
  moves.forEach(([v, wi, fi], k) => {
    const s0 = W.detail - .3 + k * .32, p = E(t, s0, s0 + .9, io);
    const fx = DOCP[0] + 40, fy = DOCP[1] + (v.startsWith('R') ? 40 : -40);
    const tx = TGT[wi][0], ty = TGT[wi][1] + (fi ? 52 : -18);
    const x = mix(fx, tx, p), y = mix(fy, ty, p) - Math.sin(Math.PI * p) * 120;
    S(mchips[k], { left: x + 'px', top: y + 'px', opacity: (p > 0 ? 1 : 0) * (1 - E(t, s0 + .85, s0 + 1.0)), transform: `translate(-50%,-50%) scale(${1 - .15 * p})` });
    const lock = E(t, s0 + .8, s0 + 1.1, out);
    S(xmarks[k], { left: tx + 'px', top: ty + 'px', opacity: win(t, s0 + .7, s0 + .85, s0 + 1.3, s0 + 1.6), transform: `translate(-50%,-50%) scale(${mix(2.2, 1, lock)}) rotate(${45 * (1 - lock)}deg)` });
    const f = tFields[wi][fi]; if (t > s0 + .9) { f.textContent = v; f.style.borderColor = 'rgba(181,211,52,.7)'; } else { f.textContent = ''; f.style.borderColor = ''; }
  });

  /* 10. every step recorded, every decision traceable */
  const aA = win(t, W.step - .4, W.step + .2, W.guesswork - .4, W.guesswork + .2);
  audLine.style.opacity = aA;
  spine.style.strokeDashoffset = 1 - E(t, W.step - .2, W.recorded + 1.2);
  audRows.forEach((r, i) => { const s0 = W.step + i * (W.decision - W.step) / 4.2; const a = E(t, s0, s0 + .4, out); S(r, { opacity: a * aA, transform: `translateX(${24 * (1 - a)}px)` }); adots[i].style.opacity = a; });
  audRows[4].style.color = t > W.decision ? '#fff' : '';
  traces.forEach((p, i) => p.style.strokeDashoffset = 1 - E(t, W.traceable - .3 + i * .2, W.traceable + .5 + i * .2));

  /* 11. no guesswork. just precision. right on target. */
  const gA = E(t, W.guesswork - .3, W.guesswork + .3);
  rings.forEach((c, i) => { c.style.strokeDashoffset = 1 - E(t, W.guesswork - .2 + i * .12, W.guesswork + .6 + i * .12); c.setAttribute('stroke', t > W.precision ? 'rgba(181,211,52,.55)' : 'rgba(255,255,255,.35)'); });
  tgt.style.opacity = gA;
  const lockC = E(t, W.precision - .1, W.precision + .5, out);
  cross.setAttribute('transform', `rotate(${90 * (1 - lockC)} ${TARGET[0]} ${TARGET[1]})`); cross.style.opacity = lockC;
  misses.forEach((m, i) => { const s0 = W.guesswork + i * .12; S(m, { opacity: win(t, s0, s0 + .15, W.precision - .4, W.precision) }); });
  const roll = E(t, W.precision + .4, W.target, out);
  S(jack, { left: mix(TARGET[0] - 900, TARGET[0], roll) + 'px', top: TARGET[1] + 'px', opacity: E(t, W.precision + .3, W.precision + .5), transform: `translate(-50%,-50%) scale(${1 + .4 * win(t, W.target - .05, W.target + .05, W.target + .1, W.target + .5)})` });
  S(pctag, { opacity: win(t, W.guesswork - .1, W.guesswork + .2, W.precision - .3, W.precision - .1) });
  S(pctag2, { opacity: win(t, W.precision - .1, W.precision + .2, W.target + .4, W.target + .7) });
  document.getElementById('flash').style.opacity = win(t, W.target + .6, W.target + 1.08, W.target + 1.12, W.target + 1.7);

  /* 12. the signal, clearer. the picture, sharper. */
  const cl = E(t, W.target + 1.1, W.target + 1.3);
  const clOut = 1 - E(t, W.logo - .5, W.logo + .2);
  S(clear, { opacity: cl * clOut, filter: `blur(${16 * (1 - E(t, W.picture + .2, W.sharper + .2))}px)` });
  const noise2 = 140 * (1 - E(t, W.signal2 + .3, W.clearer + .3));
  const d3 = waveD(960, 540, 1500, 90, noise2, t, 7);
  cwPath.setAttribute('d', d3); cwGlow.setAttribute('d', d3);
  ccap.innerHTML = t < W.picture - .1 ? 'The signal, <b>clearer.</b>' : 'The picture, <b>sharper.</b>';
  S(ccap, { opacity: cl * clOut * (E(t, W.clearer - .1, W.clearer + .3) * (1 - win(t, W.picture - .3, W.picture - .1, W.picture - .05, W.picture + .2))) });
  S(bigAv, { transform: `rotate(${t * 2}deg)` });

  /* 13. the logo assembles itself, then the tagline and the address */
  const L0 = W.logo - .3;
  lp.letters.forEach((l, i) => { const a = E(t, L0 + i * .06, L0 + .5 + i * .06, out); l.style.opacity = a; l.style.transform = `translateY(${20 * (1 - a)}px)`; });
  lp.ant.style.transformOrigin = '523px 4px'; lp.ant.style.transform = `scaleX(${E(t, L0 + .4, L0 + .9, out)})`;
  lp.n.style.opacity = E(t, L0 + .5, L0 + .8);
  [lp.x1, lp.x2].forEach((x, i) => { const a = E(t, L0 + .6 + i * .1, L0 + 1.0 + i * .1, out); x.style.opacity = a; x.style.transformBox = 'fill-box'; x.style.transformOrigin = 'center'; x.style.transform = `rotate(${90 * (1 - a)}deg)`; });
  lp.t.style.opacity = E(t, L0 + .75, L0 + 1.05);
  const dp = E(t, L0 + 1.0, L0 + 1.35, out); lp.dot.style.opacity = dp; lp.dot.style.transform = `translateY(${-60 * (1 - dp)}px)`;
  const endA = E(t, W.logo - .4, W.logo); logo.style.opacity = endA;
  tagW.forEach((s, i) => { const w = [W.simpler, W.smarter, W.automation][i]; s.style.opacity = E(t, w - .1, w + .3); });
  S(url, { opacity: E(t, W.visit - .1, W.visit + .5), transform: `translateX(${12 * (1 - E(t, W.visit - .1, W.visit + .6))}px)` });
  document.getElementById('stage').style.filter = `brightness(${1 - E(t, DUR - .7, DUR)})`;
}
window.render = render;
document.fonts.ready.then(() => { fitTag(); render(+(new URLSearchParams(location.search).get('t') || 0)); window.READY = true; });
