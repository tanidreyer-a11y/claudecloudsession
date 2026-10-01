"""Sound design for a word-timed film. Run in the build folder: python3 sound_design.py
Reads timing.js (W, DUR) and vo.wav (optional) -> sfx.wav, music.wav, mix.wav (48 kHz stereo).
The CUES section below is the SmartTech NXT 'Crossroads' example: keep the kit (whoosh/tone/click/riser/boom/shimmer),
rewrite the cue list for your film's words. Needs numpy (+ the kit is pure numpy, no downloads)."""
"""Synthesised SFX + music bed, cued to the VO word timings. Writes sfx.wav, music.wav, mix.wav (48 kHz stereo)."""
import numpy as np, wave
import re, json, os
tj=open('timing.js').read()
W=json.loads(re.sub(r'(\w+):', r'"\1":', tj[tj.index('{'):tj.index('}')+1]))
DUR=float(re.search(r'DUR = ([0-9.]+)', tj).group(1))
SR = 48000; N = int(DUR * SR)
rng = np.random.default_rng(7)
sfx = np.zeros((N, 2))
def put(sig, t, pan=0.0, g=1.0):
    i = int(t * SR); sig = sig[:max(0, N - i)]
    sfx[i:i + len(sig), 0] += sig * g * np.sqrt((1 - pan) / 2); sfx[i:i + len(sig), 1] += sig * g * np.sqrt((1 + pan) / 2)
def env(n, a=.005, r=None):
    e = np.ones(n); ka = max(1, int(a * SR)); e[:ka] = np.linspace(0, 1, ka)
    if r: kr = min(n, int(r * SR)); e[-kr:] *= np.linspace(1, 0, kr) ** 2
    return e
def onepole(x, fc):  # simple low-pass, fc may be an array
    fc = np.broadcast_to(fc, x.shape); y = np.zeros_like(x); a = np.exp(-2 * np.pi * fc / SR); s = 0.0
    for i in range(len(x)): s = (1 - a[i]) * x[i] + a[i] * s; y[i] = s
    return y
def whoosh(d, f0, f1, g=1.0):
    n = int(d * SR); x = rng.standard_normal(n); fc = np.geomspace(f0, f1, n)
    y = onepole(x, fc) - onepole(onepole(x, fc * .35), fc * .35)
    e = np.sin(np.linspace(0, np.pi, n)) ** 1.5; return y * e / (np.abs(y).max() + 1e-9) * g
def tone(f, d, dec=8, g=1.0, harm=(1, .3, .12)):
    n = int(d * SR); tt = np.arange(n) / SR
    y = sum(a * np.sin(2 * np.pi * f * (k + 1) * tt) for k, a in enumerate(harm)); return y * np.exp(-dec * tt) * env(n, .003) * g
def click(g=1.0):
    n = int(.03 * SR); tt = np.arange(n) / SR; return (np.sin(2 * np.pi * 2600 * tt) * np.exp(-180 * tt) + .4 * rng.standard_normal(n) * np.exp(-400 * tt)) * g
def boom(g=1.0):
    n = int(2.2 * SR); tt = np.arange(n) / SR; f = 38 + 60 * np.exp(-6 * tt)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-2.2 * tt) * env(n, .004) * g
def riser(d, g=1.0):
    n = int(d * SR); tt = np.arange(n) / SR; p = tt / d
    y = onepole(rng.standard_normal(n), 300 + 6000 * p ** 2) * .8 + .25 * np.sin(2 * np.pi * np.cumsum(200 + 900 * p ** 2) / SR)
    return y * p ** 2.2 * g
def shimmer(d, g=1.0):
    n = int(d * SR); tt = np.arange(n) / SR
    y = sum(np.sin(2 * np.pi * f * tt + k) for k, f in enumerate([1760, 2217, 2637, 3520])) / 4
    return y * np.exp(-3 * tt) * env(n, .01) * g

# ---- cues ----
put(riser(W['crossroads'] + .2, .45), 0.0); put(tone(1175, 1.4, 3, .3), W['crossroads'] + .1); put(whoosh(.9, 600, 3000, .45), W['crossroads'] + .1)
for i in range(4): put(whoosh(.5, 900, 3500, .35), W['systems'] - .3 + i * .22, -.6 + .4 * i); put(click(.3), W['systems'] + i * .22, -.6 + .4 * i)
for i in range(4): put(tone(311, .35, 9, .3, (1, .5, .3)), W['speak'] + .25 + i * .15, -.6 + .4 * i)          # broken links
for k in range(11): put(click(.28), W['data'] + .2 + k * .11, -.2)
for k in range(11): put(click(.28), W['again'] + .15 + k * .09, .3)
put(whoosh(.5, 400, 4000, .6), W['again'] - .3, .6); put(tone(196, .6, 6, .35, (1, .6, .4)), W['again'] + 1.15, .3)  # error
for k in ['invoices', 'onboarding', 'monthend']: put(whoosh(.6, 3000, 500, .5), W[k] - .3); put(tone(140, .4, 12, .4), W[k] + .1)
for i in range(14):
    tt0 = W['messages'] - .1 + (i / 14) ** .7 * (W['signal'] - W['messages'] - .2); put(tone(1568 if i % 2 else 1319, .25, 18, .22), tt0 + .05, -.8 + .12 * i)
n = int((W['stnxt'] - W['signal'] + .2) * SR); ns = rng.standard_normal(n) * np.clip((np.arange(n) / SR - (W['lost'] - W['signal'])) / 1.5, 0, 1) * .12
ns *= 1 - np.clip((np.arange(n) / SR - (W['noise'] + .6 - W['signal'])) / .5, 0, 1); put(onepole(ns, 6000), W['signal'] - .1)          # static
put(riser(W['bridge'] - W['stnxt'], .55), W['stnxt']); put(whoosh(1.0, 300, 3000, .6), W['stnxt'] + .1, .5); put(boom(.9), W['bridge']); put(shimmer(1.6, .4), W['bridge'])
put(tone(784, 1.2, 4, .3), W['robots']); put(shimmer(1.2, .3), W['robots'] + .2)
for i in range(6): put(tone(988 * 2 ** ((i % 3) * 2 / 12), .5, 8, .22), W['people'] - .2 + i * .08, -.6 + .24 * i)
for i in range(4): put(whoosh(.6, 500, 2500, .35), W['connect'] - .1 + i * .15, -.6 + .4 * i)
for i in range(4): put(tone(1175, .4, 10, .25), W['systemsHave'] - .2 + i * .2, -.6 + .4 * i)
put(whoosh(.8, 2500, 400, .5), W['read'] - .6); n = int(1.6 * SR); put(onepole(rng.standard_normal(n), 5000) * np.sin(np.linspace(0, np.pi, n)) * .12, W['read'])
for k in range(4): s0 = W['detail'] - .3 + k * .32; put(whoosh(.7, 800, 3500, .35), s0, .4); put(click(.5), s0 + .85, .5); put(tone(1568, .3, 14, .25), s0 + .87, .5)
put(whoosh(.8, 2000, 400, .45), W['step'] - .6)
for i in range(5): put(click(.35), W['step'] + i * (W['decision'] - W['step']) / 4.2)
put(tone(1319, .8, 6, .3), W['traceable'] + .1)
for i in range(6): put(tone(220, .3, 14, .2, (1, .5, .2)), W['guesswork'] + i * .12, -.6 + .24 * i)
put(click(.7), W['precision'] + .2); put(tone(2349, .9, 6, .3), W['precision'] + .2)
n = int((W['target'] - W['precision'] - .4) * SR); put(onepole(rng.standard_normal(n), 900) * np.linspace(1, 0, n) * .25, W['precision'] + .4)   # the roll
put(boom(.8), W['target']); put(tone(1760, 1.6, 3, .35), W['target'])
put(riser(1.0, .6), W['target'] + .1); put(shimmer(2.0, .5), W['target'] + 1.1)
n = int(1.6 * SR); put(onepole(rng.standard_normal(n), 3000) * np.linspace(1, 0, n) ** 2 * .15, W['signal2'])
put(tone(880, 1.5, 3, .3, (1, .2)), W['clearer']); put(whoosh(1.2, 400, 2400, .4), W['picture'] - .2); put(tone(1175, 1.5, 3, .25), W['sharper'])
put(riser(1.0, .5), W['logo'] - 1.0); put(boom(1.0), W['logo']); put(shimmer(2.5, .45), W['logo'] + .4)
for k in ['simpler', 'smarter', 'automation']: put(tone(1568, .5, 8, .22), W[k])
put(click(.5), W['visit'])

# ---- music bed: slow pad (Dmaj9 -> Bm9 -> Gmaj9 -> Dmaj9) ----
tt = np.arange(N) / SR
chords = [(0, [110, 164.8, 220, 261.6]), (W['stnxt'], [146.8, 220, 277.2, 329.6]), (W['read'], [123.5, 185, 246.9, 293.7]), (W['signal2'], [146.8, 220, 277.2, 329.6, 440])]
pad = np.zeros(N)
for ci, (t0, fs) in enumerate(chords):
    t1 = chords[ci + 1][0] if ci + 1 < len(chords) else DUR
    i0, i1 = int(max(0, t0 - 1.5) * SR), int(min(DUR, t1 + 1.5) * SR); seg = tt[i0:i1]
    y = sum(np.sin(2 * np.pi * f * seg) + .5 * np.sin(2 * np.pi * f * 1.003 * seg) + .25 * np.sin(2 * np.pi * f * 2.001 * seg) for f in fs)
    e = np.clip((seg - (t0 - 1.5)) / 1.5, 0, 1) * np.clip(((t1 + 1.5) - seg) / 1.5, 0, 1)
    pad[i0:i1] += y * e
pad = onepole(pad / np.abs(pad).max(), 900)
pad *= 1 + .15 * np.sin(2 * np.pi * .1 * tt)
sub = np.sin(2 * np.pi * 36.7 * tt) * (np.clip(np.sin(2 * np.pi * tt / .5), 0, 1) ** 8) * .5 * (tt > W['bridge']) * (tt < W['logo'] + 3)   # 120 bpm pulse after the bridge
mus = pad + sub
duck = np.where((tt > W['noise']) & (tt < W['bridge']), np.interp(tt, [W['noise'], W['noise'] + .8, W['bridge'] - .1, W['bridge']], [1, 0, 0, 1.2]), 1)
mus *= duck * np.clip(tt / 2.5, 0, 1) * np.clip((DUR - tt) / 2.5, 0, 1)
music = np.stack([mus, np.roll(mus, 480)], 1)

def norm(x, db): return x / (np.abs(x).max() + 1e-9) * 10 ** (db / 20)
sfx = norm(sfx, -8); music = norm(music, -22)
def write(name, x):
    x = np.clip(x, -1, 1); w = wave.open(name, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
vo = np.zeros((N, 2))
if os.path.exists('vo.wav'):
    vw = wave.open('vo.wav', 'rb'); vo = np.frombuffer(vw.readframes(vw.getnframes()), np.int16).reshape(-1, 2) / 32768
    vo = np.pad(vo, ((0, max(0, N - len(vo))), (0, 0)))[:N]
write('sfx.wav', sfx); write('music.wav', music)
mix = vo * 1.0 + sfx * .8 + music * .9
write('mix.wav', mix / max(1, np.abs(mix).max() / .95)); print('ok')
