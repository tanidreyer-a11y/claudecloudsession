"""Synthesised SFX + music bed, cued to the VO word timings. Writes sfx.wav, music.wav, mix.wav (48 kHz stereo)."""
import numpy as np, wave
SR = 48000; DUR = 58.6 + 2.6; N = int(DUR * SR)
W = dict(every=0.03, invoices=3.67, bills=5.53, leads=7.26, people=8.97, everyday=11.29, slips1=12.50, step=13.61, world=14.23,
 itself=15.95, almost=17.23, meet=18.42, agents=19.38, digital=20.41, job=21.86, eachone=23.50, precise=24.57, read=25.99,
 document=26.92, check=28.10, detail=29.19, act=30.16, seconds=30.97, nothing1=31.82, slips2=32.10, fingers=33.40, leaves=34.30,
 without=35.32, oneloop=36.52, prepares=37.48, approve=39.05, done=40.42, action=41.86, choose=44.64, need=45.91, addmore=47.12,
 grow=48.33, adc=50.12, precision=52.05, book=54.67)
W = {k: v + (1.2 if v > 16.95 else 0) + (1.4 if v > 18.10 else 0) for k, v in W.items()}   # pauses around 'Almost.'
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
for k, pan in zip(['invoices', 'bills', 'leads', 'people'], [-.5, -.15, .15, .5]):
    put(whoosh(.35, 800, 3000, .5), W[k] - .25, pan); put(tone(880, .4, 14, .35), W[k], pan)
put(whoosh(1.1, 3000, 250, .9), W['slips1'] - .05)                        # slip and fall
put(riser(W['world'] - (W['step'] - .6), .8), W['step'] - .6)            # dive through the light
put(boom(.9), W['world']); put(shimmer(1.8, .5), W['world'])
for i in range(4): put(tone(1320 + 220 * i, .35, 16, .3), W['itself'] - .2 + i * .22, -.4 + .27 * i)
n = int(.9 * SR); tt = np.arange(n) / SR                                   # "Almost." tape-stop
put(np.sin(2 * np.pi * np.cumsum(220 * np.exp(-3.5 * tt)) / SR) * np.exp(-2.5 * tt) * .45, W['almost'] - .05)
put(shimmer(1.2, .35), W['meet'] - .1)
for i, pan in enumerate([-.6, -.2, .2, .6]): put(tone(660 * 2 ** (i * 4 / 12), .5, 9, .35), W['agents'] + i * .1, pan)
for i, pan in enumerate([-.6, -.2, .2, .6]): put(whoosh(.45, 2500, 500, .35), W['job'] + i * .12, pan)
put(tone(2349, .9, 6, .35), W['precise']); put(click(.6), W['precise'] + .02)
put(whoosh(.9, 300, 2500, .7), W['read'] - .7)                            # rise up to the document
n = int(1.5 * SR); put(onepole(rng.standard_normal(n), 5000) * np.sin(np.linspace(0, np.pi, n)) * .12, W['document'] - .5)
for i in range(6): put(tone(1568, .25, 20, .3), W['check'] + i * .22, -.3 + .12 * i)
put(click(.8), W['act']); put(whoosh(.8, 600, 4000, .8), W['act'] + .1, .6)
n = int(.7 * SR); tt = np.arange(n) / SR
put(np.sin(2 * np.pi * (180 + 40 * np.sin(2 * np.pi * 9 * tt)) * tt) * np.exp(-4 * tt) * .3, W['slips2'])   # wobble
put(click(.7), W['fingers']); put(tone(988, .5, 10, .25), W['fingers'])
put(click(.9), W['without'] + .4); put(tone(1047, .6, 7, .3), W['without'] + .45); put(tone(1568, .6, 7, .25), W['without'] + .55)
put(whoosh(1.2, 400, 1600, .45), W['oneloop'] - .3)
for k, f in zip(['prepares', 'approve', 'done'], [784, 988, 1175]): put(tone(f, 1.0, 5, .4), W[k])
for i in range(5): put(click(.35), W['action'] - .2 + i * .35)
for i in range(8): put(tone(1175, .3, 18, .22), W['choose'] + i * .12, -.6 + .17 * i)
for i in range(8): put(click(.3), W['need'] - .4 + i * .12)
for i in range(4): put(tone(1397, .3, 18, .22), W['addmore'] + 1.2 + i * .1)
put(whoosh(1.4, 300, 1200, .5), W['grow'] - .3)
put(riser(1.0, .5), W['adc'] - 1.0); put(boom(1.0), W['adc']); put(shimmer(2.5, .45), W['adc'])
put(tone(2093, 1.2, 4, .25), W['precision']); put(click(.5), W['book'])

# ---- music bed: slow pad (Dmaj9 -> Bm9 -> Gmaj9 -> Dmaj9) ----
tt = np.arange(N) / SR
chords = [(0, [146.8, 220, 277.2, 329.6]), (14.2, [123.5, 185, 246.9, 293.7]), (34.4, [98, 146.8, 246.9, 293.7]), (52.7, [146.8, 220, 277.2, 329.6, 440])]
pad = np.zeros(N)
for ci, (t0, fs) in enumerate(chords):
    t1 = chords[ci + 1][0] if ci + 1 < len(chords) else DUR
    i0, i1 = int(max(0, t0 - 1.5) * SR), int(min(DUR, t1 + 1.5) * SR); seg = tt[i0:i1]
    y = sum(np.sin(2 * np.pi * f * seg) + .5 * np.sin(2 * np.pi * f * 1.003 * seg) + .25 * np.sin(2 * np.pi * f * 2.001 * seg) for f in fs)
    e = np.clip((seg - (t0 - 1.5)) / 1.5, 0, 1) * np.clip(((t1 + 1.5) - seg) / 1.5, 0, 1)
    pad[i0:i1] += y * e
pad = onepole(pad / np.abs(pad).max(), 900)
pad *= 1 + .15 * np.sin(2 * np.pi * .1 * tt)
sub = np.sin(2 * np.pi * 36.7 * tt) * (np.clip(np.sin(2 * np.pi * tt / 1.0), 0, 1) ** 8) * .5 * (tt > W['world']) * (tt < W['adc'] + 3)   # soft 60 bpm heartbeat
mus = pad + sub
duck = np.ones(N)
def gain(a, b, c, d, lo):
    x = np.interp(tt, [a, b, c, d], [1, lo, lo, 1]); return x
duck *= np.where((tt > W['slips1']) & (tt < W['world'] + 1), np.interp(tt, [W['slips1'], W['slips1'] + .6, W['world'] - .05, W['world'] + 1], [1, .25, .25, 1.2]), 1)
duck *= np.where((tt > W['almost'] - .1) & (tt < W['meet'] + 1.2), np.interp(tt, [W['almost'] - .1, W['almost'] + .1, W['meet'] - .2, W['meet'] + 1.2], [1, 0, 0, 1]), 1)
mus *= duck * np.clip(tt / 2.5, 0, 1) * np.clip((DUR - tt) / 2.5, 0, 1)
music = np.stack([mus, np.roll(mus, 480)], 1)

def norm(x, db): return x / (np.abs(x).max() + 1e-9) * 10 ** (db / 20)
sfx = norm(sfx, -8); music = norm(music, -22)
def write(name, x):
    x = np.clip(x, -1, 1); w = wave.open(name, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
vw = wave.open('vo_almost.wav', 'rb'); vo = np.frombuffer(vw.readframes(vw.getnframes()), np.int16).reshape(-1, 2) / 32768
vo = np.pad(vo, ((0, max(0, N - len(vo))), (0, 0)))[:N]
write('sfx_a.wav', sfx); write('music_a.wav', music)
mix = vo * 1.0 + sfx * .8 + music * .9
write('mix_a.wav', mix / max(1, np.abs(mix).max() / .95)); print('ok')
