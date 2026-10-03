"""Re-skin the two approved ADC films as Avant Intelligence: palette, agent shades, traced logo, spark→Λ ending.
python3 rebrand.py  ->  avant_starlight.html/.js, avant_almost.html"""
import re
LOGO = open('../brand/avant_wordmark.svg').read()
W, H = [float(v) for v in re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', LOGO).groups()]
paths = re.findall(r'class="(\w+)" d="([^"]+)"', LOGO)
LW = 860; S = LW / W; LX = 960 - LW / 2; LY = 470 - H * S / 2
APEX = (LX + 187.4 * S, LY + 0.12 * S)
whites = ''.join(f'<path class="lw" d="{d}" fill="#fff" style="opacity:0"/>' for c, d in paths if c == 'white')
blue = next(d for c, d in paths if c == 'blue')
SVG = (f'<svg id="avlogo" width="{LW}" height="{H*S:.1f}" viewBox="0 0 {W} {H}" style="position:absolute;left:{LX:.1f}px;top:{LY:.1f}px;overflow:visible">'
       f'<defs><clipPath id="lamclip"><rect id="lamrect" x="0" y="0" width="{W}" height="0"/></clipPath>'
       f'<filter id="lglow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'
       f'<path id="lam" d="{blue}" fill="#3BC1EC" clip-path="url(#lamclip)" filter="url(#lglow)"/>{whites}</svg>')

COLOURS = [  # old ADC placeholder palette -> Avant (neon blue hero, agent shades)
    ('#7AA2FF', '#3BC1EC'), ('#B48BFF', '#2F7BFF'), ('#6FE3D2', '#8C6BFF'),
    ('rgba(122,162,255', 'rgba(59,193,236'), ('rgba(180,139,255', 'rgba(47,123,255'), ('rgba(111,227,210', 'rgba(127,227,255'),
    ('rgba(160,190,255', 'rgba(127,227,255'), ('rgba(180,200,255', 'rgba(127,227,255'), ('rgba(200,215,255', 'rgba(170,236,255'),
    ('#CFE0FF', '#CFF3FF'), ('#DDE6FF', '#DDF6FF'), ('#3B2A7A', '#0B2A6B'), ('#2A1E5A', '#071A3F'),
    ('--ok:#8FF0C8', '--ok:#3EE0B5'), ('#BFF5DC', '#BFF5EC'), ('--bg:#06070A', '--bg:#030708'), ('--bg2:#0C0F16', '--bg2:#071016'),
    ('ADC Innovations — ', 'Avant Intelligence — '), ('placeholder until ADC palette arrives', 'Avant Intelligence'),
]
AGENTS = "['#7FE3FF','#2F7BFF','#8C6BFF','#3EE0B5']"
AGENT_JS = f"""
/* Avant: each agent owns a shade; together they resolve to the logo's neon blue */
const AG = {AGENTS};
orbs.forEach((o, i) => {{ o.style.background = `radial-gradient(circle at 35% 30%,#fff 0%,${{AG[i]}} 38%,${{AG[i]}}cc 70%,#04111c 100%)`; o.style.boxShadow = `0 0 40px 10px ${{AG[i]}}66,0 0 140px 40px ${{AG[i]}}22`; }});
roles.forEach((r, i) => {{ r.style.color = AG[i]; r.style.borderColor = AG[i] + '66'; }});
"""
CSS_END = """
#avsub{position:absolute;left:960px;top:575px;transform:translateX(-50%);font-size:30px;font-weight:300;letter-spacing:.6em;padding-left:.6em;white-space:nowrap;color:#CFE3EA;opacity:0}
"""
LOGO_JS = f"""
const avlogo = mk('{SVG}', screen);
const lam = avlogo.querySelector('#lamrect'), lws = [...avlogo.querySelectorAll('.lw')];
const avsub = mk('<div id="avsub">INTELLIGENCE</div>', screen);
"""
def ending(adc):  # adc = expression for the logo time
    return f"""
  /* end: the spark travels to the apex and draws the blue Λ; the letters follow */
  {{ const T0 = {adc};
    const fly = E(t, T0 - .9, T0 + .15, io), drawL = E(t, T0 + .05, T0 + .95, io);
    S(endBall, {{ left: mix(960, {APEX[0]:.1f}, fly) + 'px', top: mix(520, {APEX[1]:.1f}, fly) + 'px', opacity: win(t, T0 - 1.1, T0 - .7, T0 + .7, T0 + 1.2), transform: `translate(-50%,-50%) scale(${{1 + .6 * Math.sin(Math.PI * fly)}})` }});
    lam.setAttribute('height', {H} * drawL);
    lws.forEach((p, i) => {{ const k = E(t, T0 + .7 + i * .14, T0 + 1.5 + i * .14, out); p.style.opacity = k; p.setAttribute('transform', `translate(0 ${{(1 - k) * 8}})`); }});
    avlogo.style.opacity = 1; avlogo.style.filter = `drop-shadow(0 0 ${{30 * win(t, T0 + .8, T0 + 1.2, T0 + 1.6, T0 + 3)}}px rgba(59,193,236,.7))`;
    avsub.style.opacity = E(t, T0 + 1.5, T0 + 2.4, out); }}
"""
def common(s):
    for a, b in COLOURS: s = s.replace(a, b)
    s = s.replace('#desc{position:absolute;left:960px;top:610px', '#desc{position:absolute;left:960px;top:655px')
    s = s.replace('#cta{position:absolute;left:960px;top:760px}', '#cta{position:absolute;left:960px;top:800px}' + CSS_END)
    s = re.sub(r"const logo = mk\('<div id=\"logo\"><b>ADC</b> Innovations</div>', screen\);", LOGO_JS.strip(), s)
    s = re.sub(r"const desc = mk\('<div id=\"desc\">PRECISION, AT WORK</div>', screen\);", "const desc = mk('<div id=\"desc\">PRECISION, AT WORK</div>', screen); const logo = { style: {} };", s)
    return s

# ---- Starlight (film8): html + js
h = open('src_starlight.html').read(); h = common(h).replace('film8_script.js', 'avant_starlight.js'); open('avant_starlight.html', 'w').write(h)
j = common(open('src_starlight.js').read())
j = j.replace("const ringP2 = mk(ringSVG);", AGENT_JS + "const ringP2 = mk(ringSVG);")
j = j.replace("  const eb = win(t, W.adc - .7, W.adc - .2, W.adc + .1, W.adc + .5);\n  S(endBall, { left: '960px', top: '520px', opacity: eb, transform: `translate(-50%,-50%) scale(${1 + 6 * E(t, W.adc - .2, W.adc + .5)})` });\n  const lg = E(t, W.adc, W.adc + 1.1);\n  S(logo, { opacity: lg, filter: `blur(${(1 - lg) * 16}px)`, letterSpacing: mix(.12, -.01, lg) + 'em' });",
              ending('W.adc'))
assert 'lamrect' in j and 'avsub.style.opacity' in j, 'starlight patch failed'
open('avant_starlight.js', 'w').write(j)

# ---- Almost (film_almost): single html
a = common(open('src_almost.html').read())
a = a.replace("const drops = [0, 1, 2, 3].map(", AGENT_JS + "const drops = [0, 1, 2, 3].map(")
old = a[a.index("  const eb = win(t, W.adc - .7"):a.index("  const ds = ")]
a = a.replace(old, ending('W.adc'))
assert 'lamrect' in a and 'avsub.style.opacity' in a, 'almost patch failed'
open('avant_almost.html', 'w').write(a)
print('ok', APEX)
