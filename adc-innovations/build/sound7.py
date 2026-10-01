"""Synthesised SFX + music bed, cued to the VO word timings. Writes sfx.wav, music.wav, mix.wav (48 kHz stereo)."""
import numpy as np, wave
SR = 48000; DUR = 52.8; N = int(DUR * SR)
W = dict(step=0.12, world=1.15, precision=1.60, starlight=2.85, quiet=4.19, deliberate=5.20, alive=6.36, number=7.84, invoice=9.45,
 reminder=10.87, gathered=11.99, understood=12.83, control=14.22, watch=15.62, rise=17.13, spark=18.65, eachone=19.59, think=20.51,
 act=21.39, care=22.35, document=23.70, reviewed=24.30, decision=25.48, prepared=26.07, approve1=27.39, loop=28.45, gently=29.32,
 endless=30.32, prepare=31.97, approve=33.09, done=34.26, twenty=35.43, automated=36.58, slipping=38.15, reach=38.78, behind=40.27,
 choose=41.53, need=42.50, addmore=43.45, grow=44.26, adc=45.52, precision2=47.47, book=49.51)
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
put(whoosh(3.0, 200, 1800, .6), 0.0)                                         # drift forward through the stars
put(shimmer(2.5, .4), W['precision'] - .05); put(tone(1760, 1.4, 3, .2), W['precision'])
for i, k in enumerate(['quiet', 'deliberate', 'alive']): put(tone(1319 * 2 ** (i * 2 / 12), 1.0, 4, .22), W[k], -.4 + .4 * i)
put(shimmer(1.5, .35), W['alive'])
for k, pan in zip(['number', 'invoice', 'reminder'], [-.5, .4, -.1]): put(whoosh(.9, 300, 2600, .55), W[k] - .5, pan); put(tone(988, .4, 10, .25), W[k] + .3, pan)
put(whoosh(1.0, 2500, 600, .4), W['gathered'] - .1)
for i in range(3): put(tone(1568, .25, 20, .3), W['understood'] + i * .22, -.3 + .3 * i)
put(tone(2349, .9, 6, .35), W['control'] + .1); put(click(.6), W['control'] + .12)
put(riser(1.2, .4), W['rise'] - 1.1)
for i, pan in enumerate([-.6, -.2, .2, .6]): put(tone(523 * 2 ** (i * 4 / 12), .9, 5, .3), W['rise'] + .5 + i * .12, pan)
put(shimmer(1.2, .4), W['spark'])
for k, f in zip(['think', 'act', 'care'], [659, 784, 988]): put(tone(f, .8, 6, .28), W[k])
put(riser(1.0, .7), 22.5); put(boom(.7), 23.45); put(whoosh(.6, 4000, 800, .5), 23.45)   # dive through the orb
n = int(1.4 * SR); put(onepole(rng.standard_normal(n), 5000) * np.sin(np.linspace(0, np.pi, n)) * .12, 23.9)
for i in range(6): put(tone(1568, .2, 22, .22), W['reviewed'] + .3 + i * .12)
put(whoosh(.8, 2500, 500, .5), W['decision']); put(tone(880, .5, 8, .25), W['prepared'])
put(click(.9), W['approve1']); put(tone(1047, .6, 7, .3), W['approve1'] + .05); put(tone(1568, .6, 7, .25), W['approve1'] + .15)
put(whoosh(1.6, 400, 1600, .45), W['loop'] - .4)
for k, f in zip(['prepare', 'approve', 'done'], [784, 988, 1175]): put(tone(f, 1.0, 5, .4), W[k])
for i in range(20): put(click(.22), W['twenty'] - .2 + i * .06, -.8 + .08 * i)
n = int(.7 * SR); tt = np.arange(n) / SR
put(np.sin(2 * np.pi * (180 + 40 * np.sin(2 * np.pi * 9 * tt)) * tt) * np.exp(-4 * tt) * .3, W['slipping'])
put(click(.7), W['reach']); put(tone(988, .5, 10, .25), W['reach'])
put(shimmer(1.2, .3), W['behind'])
for i in range(8): put(tone(1175, .3, 18, .22), W['choose'] + i * .1, -.6 + .17 * i)
for i in range(8): put(click(.3), W['need'] - .3 + i * .1)
put(whoosh(1.4, 300, 1200, .5), W['grow'] - .3)
put(riser(1.0, .5), W['adc'] - 1.0); put(boom(1.0), W['adc']); put(shimmer(2.5, .45), W['adc'])
put(tone(2093, 1.2, 4, .25), W['precision2']); put(click(.5), W['book'])

# ---- music bed: slow pad (Dmaj9 -> Bm9 -> Gmaj9 -> Dmaj9) ----
tt = np.arange(N) / SR
chords = [(0, [146.8, 220, 277.2, 329.6]), (15.6, [123.5, 185, 246.9, 293.7]), (28.4, [98, 146.8, 246.9, 293.7]), (45.5, [146.8, 220, 277.2, 329.6, 440])]
pad = np.zeros(N)
for ci, (t0, fs) in enumerate(chords):
    t1 = chords[ci + 1][0] if ci + 1 < len(chords) else DUR
    i0, i1 = int(max(0, t0 - 1.5) * SR), int(min(DUR, t1 + 1.5) * SR); seg = tt[i0:i1]
    y = sum(np.sin(2 * np.pi * f * seg) + .5 * np.sin(2 * np.pi * f * 1.003 * seg) + .25 * np.sin(2 * np.pi * f * 2.001 * seg) for f in fs)
    e = np.clip((seg - (t0 - 1.5)) / 1.5, 0, 1) * np.clip(((t1 + 1.5) - seg) / 1.5, 0, 1)
    pad[i0:i1] += y * e
pad = onepole(pad / np.abs(pad).max(), 900)
pad *= 1 + .15 * np.sin(2 * np.pi * .1 * tt)
sub = np.sin(2 * np.pi * 36.7 * tt) * (np.clip(np.sin(2 * np.pi * tt / 1.0), 0, 1) ** 8) * .5 * (tt > W['watch']) * (tt < W['adc'] + 3)
mus = pad + sub
duck = np.where((tt > 22.6) & (tt < 24.2), np.interp(tt, [22.6, 23.4, 23.5, 24.2], [1, .3, .3, 1]), 1)
mus *= duck * np.clip(tt / 2.5, 0, 1) * np.clip((DUR - tt) / 2.5, 0, 1)
music = np.stack([mus, np.roll(mus, 480)], 1)

def norm(x, db): return x / (np.abs(x).max() + 1e-9) * 10 ** (db / 20)
sfx = norm(sfx, -8); music = norm(music, -22)
def write(name, x):
    x = np.clip(x, -1, 1); w = wave.open(name, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
vw = wave.open('vo7.wav', 'rb'); vo = np.frombuffer(vw.readframes(vw.getnframes()), np.int16).reshape(-1, 2) / 32768
vo = np.pad(vo, ((0, max(0, N - len(vo))), (0, 0)))[:N]
write('sfx7.wav', sfx); write('music7.wav', music)
mix = vo * 1.0 + sfx * .8 + music * .9
write('mix7.wav', mix / max(1, np.abs(mix).max() / .95)); print('ok')
