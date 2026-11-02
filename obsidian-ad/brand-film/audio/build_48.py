"""OBSIDIAN 48 s 16:9 "Websites, ads, agents" (src/Film5.tsx). Kit copied from Klick Kulture / the 60 s build.
(kit copied from Klick Kulture) 'Makes you click' — music bed + musical SFX + the voice, cued to the picture (src/KK.tsx).
python3 audio/build.py  ->  audio/mix.wav (48 kHz stereo)
Self-generated with numpy (no third-party audio). Grey A-minor feed -> silence at the stop -> Dm tension -> the
SNAP opens C major with a playful 112 bpm pulse -> a dry mechanical checklist -> chatter murmur -> ROAR in full C.
Every UI sound is a note of the current chord. Max 3 air moves (the rush, the phone spin, the roar).
Voice placed at +0.4 s; music ducks -9 dB and SFX -4.5 dB under it."""
import os, wave
import numpy as np
from scipy.signal import lfilter

SR = 48000
HD = os.path.dirname(os.path.abspath(__file__))
DUR = 48.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
mus = np.zeros((N, 2)); sfx = np.zeros((N, 2))
NOTE = lambda n: 440 * 2 ** ((n - 69) / 12)
# MIDI
C2, D2, E2, F2, G2, A2, B2 = 36, 38, 40, 41, 43, 45, 47
C3, D3, E3, F3, G3, A3, B3 = 48, 50, 52, 53, 55, 57, 59
C4, D4, E4, F4, G4, A4, B4 = 60, 62, 64, 65, 67, 69, 71
C5, D5, E5, F5, G5, A5, B5 = 72, 74, 76, 77, 79, 81, 83
C6, D6, E6, G6, A6 = 84, 86, 88, 91, 93

def put(buf, sig, t, pan=0.0, g=1.0):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0: return
    if i < 0: sig = sig[-i:]; i = 0
    sig = sig[:N - i]
    buf[i:i + len(sig), 0] += sig * g * np.sqrt((1 - pan) / 2) * 1.414
    buf[i:i + len(sig), 1] += sig * g * np.sqrt((1 + pan) / 2) * 1.414

def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); return lfilter([1 - a], [1, -a], x)

def env(n, a=0.005, d=None, r=0.02):
    e = np.ones(n); ka = max(1, int(a * SR)); e[:ka] = np.linspace(0, 1, ka)
    if d: e *= np.exp(-np.arange(n) / SR / d)
    kr = min(n, int(r * SR)); e[-kr:] *= np.linspace(1, 0, kr)
    return e

def bell(n_, dur=1.6, dec=0.5, bright=0.5):
    n = int(dur * SR); tt = np.arange(n) / SR; f = NOTE(n_)
    y = np.sin(2 * np.pi * f * tt) + bright * 0.4 * np.sin(2 * np.pi * f * 2.0 * tt) * np.exp(-tt * 6) + 0.18 * np.sin(2 * np.pi * f * 3.01 * tt) * np.exp(-tt * 9)
    return y * env(n, 0.002, dec)

def pluck(n_, dur=0.6, dec=0.12):
    n = int(dur * SR); tt = np.arange(n) / SR; f = NOTE(n_)
    y = np.sin(2 * np.pi * f * tt + 0.8 * np.sin(2 * np.pi * f * 2 * tt) * np.exp(-tt * 20))
    return y * env(n, 0.001, dec)

def glass(n_, g=1.0):
    n = int(0.35 * SR); tt = np.arange(n) / SR; f = NOTE(n_)
    y = (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 30)) * np.exp(-tt * 13)
    return y * env(n, 0.001) * g

def tick(g=1.0, f=3200):
    n = int(0.02 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * tt) * np.exp(-tt * 300) + 0.3 * rng.standard_normal(n) * np.exp(-tt * 800)) * g

def air(dur, rise=True):
    n = int(dur * SR); x = rng.standard_normal(n); k = np.linspace(0, 1, n)
    lo = lp(x, 900); hi = x - lp(x, 2500); mixk = k if rise else 1 - k
    y = lo * (1 - mixk) + hi * mixk * 0.6
    shape = (k ** 2.2 if rise else (1 - k) ** 1.6) * np.minimum(1, (1 - k if rise else k) * 30 + 0.02)
    return y * shape / (np.abs(y).max() + 1e-9)

def boom(g=1.0, f0=36):
    n = int(2.4 * SR); tt = np.arange(n) / SR; f = f0 + 55 * np.exp(-tt * 7)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.9) * env(n, 0.003) * g

def pad(notes, dur, att=1.2, rel=1.4, cutoff=1400, det=0.12):
    n = int(dur * SR); tt = np.arange(n) / SR; y = np.zeros(n)
    for j, nt in enumerate(notes):
        f = NOTE(nt)
        for d in (-det, det):
            ff = f * 2 ** (d / 12)
            for hh in range(1, 6): y += np.sin(2 * np.pi * ff * hh * tt + j + hh) / hh ** 1.6
    y = lp(y, cutoff)
    e = np.minimum(1, tt / att) * np.minimum(1, (dur - tt) / rel).clip(0)
    return y * e * (1 + 0.08 * np.sin(2 * np.pi * 0.17 * tt)) / (len(notes) * 4)

def kick(g=1.0):
    n = int(0.35 * SR); tt = np.arange(n) / SR; f = 48 + 90 * np.exp(-tt * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * g

def hat(g=1.0):
    n = int(0.06 * SR); x = rng.standard_normal(n); x = x - lp(x, 7000)
    return x * np.exp(-np.arange(n) / SR * 70) * g

def clap(g=1.0):
    n = int(0.18 * SR); x = rng.standard_normal(n); x = lp(x, 5000) - lp(x, 900); tt = np.arange(n) / SR
    e = np.exp(-tt * 30) * (1 + 0.6 * (np.abs(np.sin(tt * 2 * np.pi * 90)) * (tt < 0.03)))
    return x * e / (np.abs(x).max() + 1e-9) * g

def snap(g=1.0):
    """finger snap: a bright transient + a short body."""
    n = int(0.16 * SR); tt = np.arange(n) / SR; x = rng.standard_normal(n)
    crack = (lp(x, 7000) - lp(x, 1500)) * np.exp(-tt * 110)
    tone = np.sin(2 * np.pi * 2100 * tt) * np.exp(-tt * 140) * 0.5
    body = np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 45) * 0.35
    y = crack / (np.abs(crack).max() + 1e-9) + tone + body
    return y * g

def swell(note, dur, g=1.0):
    n = int(dur * SR); tt = np.arange(n) / SR; k = tt / dur; y = np.zeros(n)
    for hh, a in [(1, 1), (2, .5), (3, .3), (4, .2), (6, .12)]:
        y += np.sin(2 * np.pi * NOTE(note) * hh * tt * (1 + 0.004 * k)) * a * k ** (0.6 + hh * 0.5)
    return y * k ** 1.8 * env(n, 0.05, None, 0.01) / 2.2 * g

def glide(n0, n1, dur, g=1.0):
    n = int(dur * SR); k = np.linspace(0, 1, n); f = NOTE(n0) * (NOTE(n1) / NOTE(n0)) ** (k * k * (3 - 2 * k))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    return y * np.sin(np.pi * k) ** 1.5 * g

def swish(g=1.0):
    n = int(0.22 * SR); x = rng.standard_normal(n); y = lp(x, 3000) - lp(x, 700)
    return y * np.sin(np.linspace(0, np.pi, n)) ** 2 / (np.abs(y).max() + 1e-9) * g

def bassline(a, b, notes, bpm=112, g=0.18):
    beat = 60 / bpm; t = a; i = 0
    while t < b - 0.05:
        n_ = notes[i % len(notes)]
        nn = int(beat * 0.9 * SR); tt = np.arange(nn) / SR
        y = (np.sin(2 * np.pi * NOTE(n_) * tt) + 0.25 * np.sin(4 * np.pi * NOTE(n_) * tt)) * np.exp(-tt * 5) * env(nn, 0.004)
        put(mus, y, t, 0, g); t += beat; i += 1

def pulse(a, b, bpm=112, g=0.5, hats=True, claps=False):
    beat = 60 / bpm; t = a; i = 0
    while t < b - 0.02:
        put(mus, kick(), t, 0, g * (1.0 if i % 2 == 0 else 0.7))
        if hats: put(mus, hat(), t + beat / 2, 0.3 * (1 if i % 2 else -1), g * 0.38)
        if claps and i % 2 == 1: put(mus, clap(), t, 0.1, g * 0.22)
        t += beat; i += 1

def chord_bed(sections):
    for (a, b, notes, cut, g) in sections:
        put(mus, pad(notes, b - a + 1.2, cutoff=cut), a - 0.15, 0, g)

def murmur(a, b, g=1.0):
    """crowd chatter: syllable-rate band-passed noise voices, rising."""
    n = int((b - a) * SR); tt = np.arange(n) / SR; out = np.zeros(n)
    for v in range(9):
        x = rng.standard_normal(n); band = lp(x, 900 + 500 * (v % 3)) - lp(x, 250 + 60 * v)
        rate = 5.5 + rng.random() * 4
        syl = np.clip(np.sin(2 * np.pi * rate * tt + rng.random() * 6) + 0.3 * np.sin(2 * np.pi * rate * 0.37 * tt), 0, None) ** 1.5
        start = rng.random() * 0.6 * (b - a)
        out += band * syl * (tt > start) * 0.5
    out /= np.abs(out).max() + 1e-9
    shape = np.minimum(1, tt / (b - a)) ** 1.3
    return out * shape * g


def h(i, k=0):
    x = np.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - np.floor(x)


def h(i, k=0):
    x = np.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - np.floor(x)


def h(i, k=0):
    x = np.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - np.floor(x)

# ------------------------------------------------------------- OBSIDIAN 48 s — D minor; a chord per world
Bb2, Bb3, Bb4, Bb5 = 46, 58, 70, 82
chord_bed([
    (0.0, 2.0, [D2, A2, D3, F3, E4], 900, 0.55),            # typing on black: Dm9
    (2.0, 6.1, [D2, A2, C3, F3], 600, 0.5),                 # the fall through the grey: low, unresolved
    (6.1, 8.3, [Bb2, F3, A3, D4, C5], 2600, 0.85),          # the white world: Bbmaj9
    (8.3, 10.0, [F2, C3, E3, G3, A3], 2400, 0.8),           # clinic (cream): Fmaj9
    (10.0, 11.5, [D2, A2, F3, A3, C4], 1500, 0.8),          # cigars (ember): Dm7
    (11.5, 13.0, [Bb2, F3, A3, C4, E4], 2200, 0.8),         # observatory (night): Bbmaj9#11
    (13.0, 14.7, [G2, D3, F3, Bb3, C4], 1800, 0.8),         # estate (forest): Gm11
    (14.7, 18.1, [G2, D3, F3, Bb3, C4], 2000, 0.75),        # grid + scroll
    (18.1, 22.1, [F2, C3, E3, G3, A3], 2300, 0.8),          # lines + merge
    (22.1, 25.3, [Bb2, F3, A3, D4, E4], 2700, 0.9),         # "It's yours."
    (25.3, 32.6, [C3, G3, Bb3, D4, F4], 2600, 0.85),        # ads: C9sus-ish, bright
    (32.6, 41.0, [D2, A2, E3, F3, C4], 2100, 0.8),          # agents: Dm11
    (41.0, 48.0, [Bb2, F3, A3, D4, E4], 2600, 1.0),         # OBSIDIAN
])
pulse(8.35, 14.6, bpm=104, g=0.16, hats=True)
pulse(18.15, 22.0, bpm=104, g=0.2, hats=True)
pulse(25.35, 32.5, bpm=104, g=0.26, hats=True, claps=True)
bassline(25.35, 32.5, [C2 + 12, C2 + 12, Bb2 - 12, Bb2 - 12, F2, F2, G2, G2], bpm=104, g=0.11)
pulse(33.0, 40.9, bpm=104, g=0.22, hats=True, claps=True)
bassline(33.0, 40.9, [D2, D2, F2, F2, Bb2 - 12, Bb2 - 12, C2 + 12, C2 + 12], bpm=104, g=0.11)
def keys(a, b, n, g=0.06):
    for i in range(n):
        t = a + (b - a) * i / max(1, n - 1)
        put(sfx, tick(g * (0.7 + 0.6 * h(i, 9)), 2400 + 900 * h(i, 3)), t, (h(i, 4) - 0.5) * 0.4)
# S1 typing; the caret becomes the ball
keys(0.08, 0.55, 5, 0.08); keys(1.0, 1.7, 12, 0.06)
put(sfx, glass(A5, 1), 1.96, 0.3, 0.07); put(sfx, glide(A5, D5, 1.0, 0.04), 2.0, 0)
# S2 the fall through the grey
put(sfx, air(3.9, True), 2.0, 0, 0.07)
for i in range(14): put(sfx, tick(0.05 + 0.05 * h(i, 2), 900 + 400 * h(i, 3)), T_ := 2.82 + i * 0.045, (h(i, 4) - 0.5) * 1.2)
put(sfx, boom(0.14, 52), 2.85, 0, 1.0)
put(sfx, tick(0.2, 2600), 3.57, 0.4); put(sfx, swish(1.0), 3.68, -0.5, 0.07)
for i in range(5): put(sfx, pluck([D4, C4, A3, F3, D3][i], 0.4, 0.07), 5.03 + i * 0.17, (h(i, 6) - 0.5) * 0.6, 0.06)
put(sfx, boom(0.22, 44), 5.92, 0, 1.0); put(sfx, bell(D5, 2.2, 1.0, 0.3), 5.94, 0, 0.07)
# S3 the dive → white
put(sfx, air(0.8, True), 6.15, 0, 0.11); put(sfx, boom(0.4, 36), 6.95, 0, 1.0)
for i, n_ in enumerate([Bb4, D5, F5, A5, C6]): put(sfx, bell(n_, 3.0, 1.3), 6.97 + i * 0.06, -0.4 + i * 0.2, 0.08)
# S4 the brief, the click, the build, the orbit
put(sfx, glass(F5 + 12, 1), 7.27, 0.1, 0.06); keys(7.42, 7.98, 12, 0.05)
put(sfx, tick(0.22, 2400), 8.15, 0.3); put(sfx, pluck(A5, 0.5, 0.1), 8.17, 0.3, 0.07)
for i in range(7): put(sfx, glass([C5, E5, G5, A5, C6, E6, G6][i], 1), 8.3 + i * 0.09, -0.5 + i * 0.16, 0.035)
put(sfx, bell(A5, 2.2, 1.0), 9.35, 0, 0.07)
for t_, n_ in [(10.0, D5), (11.5, F5), (13.0, G5)]:
    keys(t_ - 0.06, t_ + 0.5, 10, 0.045)
    put(sfx, swell(n_ - 24, 0.6, 0.09), t_ - 0.55, 0); put(sfx, bell(n_, 2.4, 1.1, 0.35), t_, 0, 0.08); put(sfx, swish(1.0), t_ - 0.05, 0.6, 0.05)
put(sfx, glass(A5, 1), 14.2, 0.3, 0.05)
# S5 pull back, scroll, land
put(sfx, air(1.0, False), 14.7, 0, 0.06); put(sfx, air(2.2, True), 15.8, 0, 0.1); put(sfx, air(0.7, False), 17.6, 0, 0.07)
t_ = 15.9; i = 0
while t_ < 18.05:
    v = min(1, (t_ - 15.8) / 0.9) * (1 - max(0, (t_ - 17.3) / 0.8))
    put(sfx, tick(0.04 + 0.05 * v, 1600 + 600 * (i % 3)), t_, (h(i, 1) - 0.5) * 1.2); t_ += 0.16 - 0.11 * v; i += 1
put(sfx, boom(0.22, 44), 18.05, 0, 1.0)
# S6 lines, balls, merge
for i in range(3): put(sfx, glide([C5, F5, A4][i], [F5, A5, C5][i], 0.8, 0.03), 18.1 + i * 0.05, [-0.5, 0, 0.5][i])
for i in range(3): put(sfx, pluck([F5, A5, C6][i], 0.6, 0.13), 18.45 + i * 0.07, [-0.5, 0, 0.5][i], 0.08)
put(sfx, swell(F3, 2.4, 0.08), 18.9, 0)
put(sfx, boom(0.42, 38), 21.42, 0, 1.0)
for i, n_ in enumerate([F4, A4, C5, E5, A5]): put(sfx, bell(n_, 3.0, 1.3), 21.44 + i * 0.05, -0.3 + i * 0.15, 0.09)
# S7 template / yours / push
put(sfx, bell(D5, 2.0, 0.9), 22.3, 0, 0.06); put(sfx, glass(F5 + 12, 1), 23.0, 0.2, 0.07); put(sfx, pluck(A5, 0.5, 0.12), 23.05, 0.2, 0.07)
put(sfx, glide(D5, A5, 0.7, 0.04), 23.7, 0.2); put(sfx, air(1.0, True), 24.25, 0, 0.1)
put(sfx, boom(0.3, 40), 25.28, 0, 1.0)
for i, n_ in enumerate([C5, E5, G5, D6]): put(sfx, bell(n_, 2.6, 1.2), 25.3 + i * 0.06, -0.3 + i * 0.2, 0.07)
# S8 ads
for i in range(4): put(sfx, swish(1.0), 25.35 + i * 0.09, [-0.7, 0.7, 0, 0][i], 0.05)
for i in range(3): put(sfx, pluck([G5, C6, E6][i], 0.5, 0.12), 27.2 + i * 0.35, -0.3 + i * 0.3, 0.08)
put(sfx, air(0.7, True), 28.5, 0.5, 0.08); put(sfx, swish(1.0), 28.6, 0.3, 0.07)
put(sfx, pluck(C6, 0.5, 0.12), 29.12, 0, 0.08)
put(sfx, tick(0.22, 2600), 29.9, 0); put(sfx, glass(G5 + 12, 1), 29.93, 0, 0.08); put(sfx, boom(0.18, 50), 29.93, 0, 1.0)
put(sfx, air(0.9, True), 30.2, -0.3, 0.1)
put(sfx, boom(0.3, 40), 31.38, 0, 1.0)
for i, n_ in enumerate([C5, G5, C6, E6]): put(sfx, bell(n_, 2.6, 1.2), 31.4 + i * 0.05, -0.3 + i * 0.2, 0.08)
for i in range(18): put(sfx, tick(0.03 + 0.03 * h(i, 5), 3200 + 1500 * h(i, 6)), 31.45 + i * 0.04, (h(i, 7) - 0.5) * 1.6)
# S9 agents
put(sfx, boom(0.32, 36), 32.6, 0, 1.0); put(sfx, glass(D6, 1), 33.0, 0.5, 0.07)
for i in range(3): put(sfx, pluck([A5, D6, F5 + 12][i], 0.5, 0.11), 33.6 + i * 0.2, [-0.5, 0.5, 0][i], 0.08)
for i in range(3): put(sfx, tick(0.2, 2400), 35.25 + i * 0.35, 0.5); put(sfx, glass([D5, F5, A5][i], 1), 35.27 + i * 0.35, 0.5, 0.05)
for i in range(2): put(sfx, bell([A5, D6][i], 2.0, 0.9), 36.6 + i * 0.5, 0.5, 0.07)
for i in range(4): put(sfx, pluck([D5, F5, A5, D6][i], 0.4, 0.1), 38.4 + i * 0.75, 0, 0.06)
put(sfx, bell(A5, 2.2, 1.0), 39.15, 0, 0.06)
# S10 the pile, the three balls, the emblem
for i in range(8): put(sfx, tick(0.08, 900 + 300 * h(i, 2)), 41.6 + i * 0.12, (h(i, 3) - 0.5) * 1.2); put(sfx, boom(0.05, 60), 41.6 + i * 0.12, 0, 1.0)
put(sfx, air(0.8, True), 42.5, 0, 0.09)
for i in range(3): put(sfx, bell([D5, A5, F5 + 12][i], 2.4, 1.1), 42.75 + i * 0.12, [-0.5, 0.5, 0][i], 0.08)
put(sfx, swell(D4, 0.9, 0.1), 43.1, 0); put(sfx, boom(0.4, 36), 43.9, 0, 1.0)
for i in range(2): put(sfx, pluck([F5, A5][i], 0.6, 0.12), 45.15 + i * 0.14, 0.2, 0.09)
put(sfx, boom(0.5, 34), 45.8, 0, 1.0)
for i, n_ in enumerate([Bb4, F5, A5, D6]): put(sfx, bell(n_, 3.6, 1.6), 45.82 + i * 0.05, -0.3 + i * 0.2, 0.11)
put(sfx, pluck(A5, 0.6, 0.14), 46.7, 0, 0.06)

fade = np.ones(N); fl = int(1.4 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 2
mix = (mus * 0.8 + sfx * 0.9) * fade[:, None]
mix /= max(1.0, np.abs(mix).max() / 0.95)
out = (mix * 32767).astype(np.int16)
with wave.open(os.path.join(HD, 'mix_48.wav'), 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(out.tobytes())
print('mix_48.wav', out.shape)
