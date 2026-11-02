"""(kit copied from Klick Kulture) 'Makes you click' — music bed + musical SFX + the voice, cued to the picture (src/KK.tsx).
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
DUR = 60.0
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

# ------------------------------------------------------------- OBSIDIAN 60 s — D minor; liquid, descending; lifts at the build and the agents
Bb2, Bb3, Bb4, Bb5 = 46, 58, 70, 82
chord_bed([
    (0.0, 6.5, [D2, A2, D3, F3, E4], 800, 0.65),            # the orb drops: Dm9
    (6.5, 10.4, [D2, A2, C3, F3], 600, 0.55),               # everyone else: grey, low
    (10.4, 12.4, [Bb2, F3, A3, D4, C5], 2600, 0.9),         # the dive / bright world
    (12.4, 18.5, [Bb2, F3, A3, D4], 1500, 0.7),             # code: Bbmaj7
    (18.5, 26.4, [G2, D3, F3, Bb3, C4], 2000, 0.8),         # build: Gm11
    (26.4, 37.0, [F2, C3, E3, G3, A3], 2300, 0.85),         # the carousel: Fmaj9
    (37.0, 44.6, [Bb2, F3, A3, C4, E4], 2100, 0.8),         # phone / logic: Bbmaj9#11
    (44.6, 53.0, [D2, A2, E3, F3, C4], 2200, 0.85),         # agents: Dm11
    (53.0, 60.0, [Bb2, F3, A3, D4, E4], 2600, 1.0),         # Obsidian
])
pulse(18.6, 26.3, bpm=100, g=0.18, hats=True)
pulse(26.5, 36.9, bpm=100, g=0.26, hats=True, claps=True)
bassline(26.5, 36.9, [F2, F2, A2, A2, C2 + 12, C2 + 12, G2, G2], bpm=100, g=0.12)
pulse(44.7, 52.9, bpm=100, g=0.28, hats=True, claps=True)
bassline(44.7, 52.9, [D2, D2, F2, F2, Bb2 - 12, Bb2 - 12, C2 + 12, C2 + 12], bpm=100, g=0.13)
# 1 drop, rings, line
put(sfx, glide(A5, D5, 1.5, 0.05), 0.1, 0); put(sfx, boom(0.22, 46), 1.6, 0, 1.0); put(sfx, bell(D5, 2.4, 1.1, 0.4), 1.62, 0, 0.09)
for i in range(4): put(sfx, glass([A5, D6, E6, F5 + 12][i], 1), 1.4 + i * 0.22, -0.5 + i * 0.33, 0.045)
put(sfx, bell(F5, 2.0, 0.9, 0.3), 2.4, 0, 0.06)
# 2 the fall through everyone else
put(sfx, air(3.8, True), 6.5, 0, 0.09)
for i in range(16): put(sfx, tick(0.1, 1300 + 200 * (i % 3)), 6.8 + i * 0.22, (h(i, 1) - 0.5) * 1.4)
put(sfx, bell(D5 - 12, 2.0, 0.9, 0.2), 7.4, 0, 0.06)
# 3 the dive
put(sfx, air(1.1, True), 10.2, 0, 0.12); put(sfx, boom(0.45, 36), 11.35, 0, 1.0)
for i, n_ in enumerate([Bb4, D5, F5, A5, C6]): put(sfx, bell(n_, 3.0, 1.3), 11.37 + i * 0.06, -0.4 + i * 0.2, 0.09)
# 4 code
for i in range(80):
    t = 13.0 + i * 0.058
    if t < 17.9: put(sfx, tick(0.06 + 0.04 * h(i, 2), 2600 + 900 * h(i, 3)), t, (h(i, 4) - 0.5) * 0.4)
# 5 build: page, pops, land
put(sfx, swell(G3, 0.9, 0.1), 18.4, 0); put(sfx, boom(0.25, 44), 19.3, 0, 1.0)
for i in range(4): put(sfx, pluck([D5, F5, Bb5 - 12, C6][i], 0.6, 0.13), 19.2 + i * 0.3, -0.4 + i * 0.27, 0.08)
for i in range(4): put(sfx, glass([D6, F5 + 12, A5, C6][i], 1), 19.4 + i * 0.3, 0.3, 0.04)
put(sfx, swell(Bb3, 1.0, 0.1), 22.8, 0); put(sfx, boom(0.3, 42), 24.4, 0, 1.0); put(sfx, bell(D6, 2.4, 1.1), 24.42, 0, 0.1)
# 6 stand up
put(sfx, air(1.6, True), 26.3, 0, 0.08); put(sfx, bell(A5, 2.4, 1.1), 28.2, 0, 0.08)
# 7 carousel: a note per panel
for i in range(5): put(sfx, swish(1.0), 29.2 + i * 1.6, 0.4 - i * 0.2, 0.05); put(sfx, pluck([F5, A5, C6, E6, F5 + 12][i], 0.6, 0.13), 29.5 + i * 1.6, 0.4 - i * 0.2, 0.08)
# 8 phone, 9 logic
put(sfx, swell(Bb3, 1.1, 0.1), 37.0, 0); put(sfx, swish(1.0), 38.3, -0.3, 0.06); put(sfx, swish(1.0), 39.2, 0.3, 0.06); put(sfx, swish(1.0), 40.2, 0, 0.06)
put(sfx, air(0.9, True), 40.6, 0, 0.07); put(sfx, swish(1.0), 41.5, 0, 0.07); put(sfx, bell(E5, 2.0, 0.9), 42.2, 0, 0.07)
for i in range(40):
    t = 42.0 + i * 0.055
    if t < 44.2: put(sfx, tick(0.06 + 0.04 * h(i, 5), 2600 + 900 * h(i, 6)), t, (h(i, 7) - 0.5) * 0.4)
# 10 agents
put(sfx, air(1.2, True), 43.9, 0, 0.09); put(sfx, boom(0.35, 38), 45.2, 0, 1.0)
for i, n_ in enumerate([D5, A5, F5 + 12]): put(sfx, bell(n_, 2.8, 1.2), 45.22 + i * 0.05, -0.2 + i * 0.2, 0.1)
for i in range(3): put(sfx, pluck([A5, D6, E6][i], 0.5, 0.11), 46.0 + i * 0.14, -0.5 + i * 0.5, 0.08)
for i, t in enumerate([47.2, 47.9, 48.6, 50.4]): put(sfx, glass([A5, D6, F5 + 12, E6][i], 1), t, [-0.5, 0.5, -0.5, 0.5][i], 0.07)
put(sfx, swell(A3, 2.0, 0.1), 49.2, 0); put(sfx, bell(D6, 2.4, 1.1), 50.6, 0, 0.08); put(sfx, bell(A5, 2.4, 1.1), 51.0, 0, 0.07)
# 11 fall, emblem, lockup
put(sfx, air(1.8, True), 53.0, 0, 0.1)
put(sfx, swell(D4, 0.8, 0.12), 54.0, 0)
for i in range(2): put(sfx, pluck([F5, A5][i], 0.6, 0.12), 54.9 + i * 0.14, 0.2, 0.09)
put(sfx, boom(0.5, 34), 55.9, 0, 1.0)
for i, n_ in enumerate([Bb4, F5, A5, D6]): put(sfx, bell(n_, 3.6, 1.6), 55.92 + i * 0.05, -0.3 + i * 0.2, 0.12)
put(sfx, pluck(A5, 0.6, 0.14), 56.6, 0, 0.06)

fade = np.ones(N); fl = int(2.0 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 2
mix = (mus * 0.8 + sfx * 0.9) * fade[:, None]
mix /= max(1.0, np.abs(mix).max() / 0.95)
out = (mix * 32767).astype(np.int16)
with wave.open(os.path.join(HD, 'mix_60.wav'), 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(out.tobytes())
print('mix_60.wav', out.shape)
