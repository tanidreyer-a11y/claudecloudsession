"""OBSIDIAN × lovio replica, 52 s 16:9 (src/Film7.tsx). Kit copied from the 40 s build (numpy only, no third-party audio).
python3 audio/build_52.py -> audio/mix_52.wav (48 kHz stereo)
lovio's track runs ~110 bpm (onset autocorrelation 0.545 s); drums sit where lovio's do: the train, tennis, the layout,
the list, the Faster run. Every UI action (typing, clicks, pops, swipes) gets a sound on its exact frame."""
import os, wave
import numpy as np
from scipy.signal import lfilter

SR = 48000
HD = os.path.dirname(os.path.abspath(__file__))
DUR = 52.0
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


Bb2, Bb3, Bb4 = 46, 58, 70
BPM = 110
def keys(a, b, n, g=0.06):
    for i in range(n):
        t = a + (b - a) * i / max(1, n - 1)
        put(sfx, tick(g * (0.7 + 0.6 * h(i, 9)), 2400 + 900 * h(i, 3)), t, (h(i, 4) - 0.5) * 0.4)
def click(t, n_=A5, g=1.0):
    put(sfx, tick(0.22 * g, 2600), t, 0.3); put(sfx, pluck(n_, 0.4, 0.09), t + 0.01, 0.3, 0.06 * g)
def pop(t, n_, pan=0.0, g=1.0):
    put(sfx, glass(n_, 1), t, pan, 0.05 * g); put(sfx, tick(0.06 * g, 3000), t, pan)
def word(t, n_, g=1.0):
    put(sfx, bell(n_, 2.0, 0.8, 0.3), t, 0, 0.055 * g)

chord_bed([
    (0.0, 1.92, [D2, A2, D3, F3, E4], 800, 0.5),
    (1.92, 7.0, [D2, A2, D3, F3, A3, E4], 1700, 0.62),
    (7.0, 9.25, [Bb2, F3, A3, D4, C5], 2600, 0.8),
    (9.25, 12.2, [F2, C3, A3, C4, E4], 2600, 0.8),
    (12.2, 13.5, [C3, G3, D4, E4], 3000, 0.6),
    (13.5, 16.0, [D2, A2, F3, C4, E4], 2400, 0.85),
    (16.0, 19.5, [Bb2, F3, D4, A4], 2400, 0.8),
    (19.5, 21.0, [G2, D3, F3, Bb3, A4], 2200, 0.85),
    (21.0, 23.1, [F2, C3, A3, C4, E4], 2400, 0.8),
    (23.1, 25.2, [C3, G3, E4, G4, D5], 2600, 0.8),
    (25.2, 28.4, [D3, F3, A3, E4], 3200, 0.6),
    (28.4, 30.28, [Bb2, F3, A3, D4, C5], 2600, 0.8),
    (30.28, 37.45, [F2, C3, A3, E4], 1400, 0.7),
    (37.45, 38.9, [D2, A2, F3, C4, E4], 2600, 0.85),
    (38.9, 40.9, [Bb2, F3, D4, A4], 2600, 0.85),
    (40.9, 42.3, [F2, C3, A3, C4, E4], 2800, 0.85),
    (42.3, 43.7, [C3, G3, E4, G4, D5], 2800, 0.85),
    (43.7, 47.0, [G2, D3, Bb3, D4, A4], 2400, 0.8),
    (47.0, 52.0, [F2, C3, A3, C4, E4, G4], 2600, 1.0),
])
# drums where lovio's are
pulse(1.92, 7.0, bpm=BPM, g=0.12, hats=True)
pulse(7.0, 12.2, bpm=BPM, g=0.26, hats=True, claps=True)
bassline(7.0, 12.2, [Bb2 - 12, Bb2 - 12, Bb2 - 12, Bb2 - 12, F2, F2, F2, F2, F2, F2, C2 + 12, C2 + 12], bpm=BPM, g=0.1)
pulse(13.5, 16.0, bpm=BPM, g=0.3, hats=True, claps=True)
bassline(13.5, 16.0, [D2, D2, D2, F2, A2 - 12], bpm=BPM, g=0.11)
pulse(16.0, 19.5, bpm=BPM, g=0.22, hats=True)
pulse(19.5, 25.2, bpm=BPM, g=0.27, hats=True, claps=True)
bassline(19.5, 25.2, [G2 - 12, G2 - 12, G2 - 12, F2, F2, F2, F2, C2 + 12, C2 + 12, C2 + 12, C2 + 12, C2 + 12], bpm=BPM, g=0.1)
pulse(25.2, 28.4, bpm=BPM, g=0.12, hats=True)
pulse(37.45, 43.7, bpm=BPM, g=0.3, hats=True, claps=True)
bassline(37.45, 43.7, [D2, D2, D2, Bb2 - 12, Bb2 - 12, Bb2 - 12, Bb2 - 12, F2, F2, F2, C2 + 12, C2 + 12], bpm=BPM, g=0.11)

# 0–7 · Build typed, the bar, its brief, the send click, three blooms
keys(0.0, 0.3, 5, 0.07); put(sfx, glass(A5, 1), 0.42, 0, 0.06); keys(0.5, 0.95, 12, 0.06)
click(1.6, A5)
for i, (t_, n_) in enumerate([(1.8, D5), (1.95, F5), (2.1, A5), (2.25, C6)]): pop(t_, n_, -0.5 + i * 0.3, 0.8)
for t_, n_ in [(1.92, D5), (3.86, F5), (5.3, A5), (7.0, D6)]:
    put(sfx, swell(n_ - 24, 0.45, 0.08), t_ - 0.45, 0); put(sfx, bell(n_, 2.2, 1.0, 0.35), t_, 0, 0.07)
keys(3.85, 4.05, 6, 0.04); keys(4.07, 4.45, 9, 0.05); keys(5.35, 5.55, 6, 0.04); keys(5.57, 5.95, 10, 0.05)
for i in range(10): put(sfx, tick(0.035, 1800 + 200 * i), 2.7 + i * 0.12, 0.4)
pop(4.5, F5, 0.4); pop(6.1, A5, 0.3)
# 7–12.2 · the train, the site in the window, the lake, This isn't / a prototype
put(sfx, boom(0.3, 40), 6.98, 0, 1.0); keys(7.85, 8.5, 14, 0.05)
put(sfx, air(0.9, True), 8.4, 0, 0.08); put(sfx, swish(1.0), 9.2, 0, 0.06)
word(9.5, A5); word(9.75, C6); word(10.75, E5); word(10.85, A5)
# 12.2–13.55 · It's live; the push
put(sfx, glass(C6, 1), 12.24, 0, 0.08); put(sfx, bell(G5, 2.4, 1.0, 0.4), 12.26, 0, 0.07)
put(sfx, air(0.5, True), 13.05, 0, 0.12); put(sfx, swell(G4, 0.45, 0.1), 13.1, 0)
# 13.5–16 · tennis: flash, letters fly in, spread
put(sfx, boom(0.42, 38), 13.5, 0, 1.0); put(sfx, snap(0.5), 13.5, 0, 0.5)
for i in range(12): put(sfx, pluck([D5, F5, A5, C6, D6, A5, F5][i % 7], 0.35, 0.08), 13.7 + i * 0.06 + (0.15 if i > 6 else 0), (h(i, 5) - 0.5) * 1.2, 0.045)
pop(14.5, A5, -0.6); pop(14.7, D6, 0.6)
put(sfx, swish(1.0), 15.6, 0, 0.07); put(sfx, air(0.4, True), 15.65, 0, 0.06)
# 16–21 · Reshape: letters drop and land, Motion rises, the bar, the click, the layout flick, dark, the script
for i in range(7):
    a = 16.02 + i * 0.12 + (max(0, i - 4) * 0.08); put(sfx, tick(0.09, 1300 + 120 * i), a + 0.42, (i - 3) * 0.15); put(sfx, pluck([Bb4, D5, F5, A5, Bb4 + 12, D6, F5 + 12][i], 0.3, 0.07), a + 0.42, (i - 3) * 0.15, 0.04)
for i in range(6): put(sfx, glide([F4, A4, D5, F5, A5, D6][i] - 7, [F4, A4, D5, F5, A5, D6][i], 0.4, 0.015), 16.3 + i * 0.1, 0.4)
for i in range(16): put(sfx, tick(0.025, 3400), 16.0 + i * 0.1, -0.5)
put(sfx, glass(F5 + 12, 1), 17.15, 0, 0.06); keys(17.55, 17.95, 12, 0.05)
click(18.9, D6, 1.2)
for i in range(6): put(sfx, glass([F5, A5, C6, E6, A5, D6][i] + (12 if i % 2 else 0) - 12, 1), 19.12 + i * 0.07, (h(i, 7) - 0.5), 0.05)
put(sfx, boom(0.36, 38), 19.5, 0, 1.0)
for i in range(14): put(sfx, glass([D6, F5 + 12, A5 + 12][i % 3], 1), 19.55 + i * 0.06, (h(i, 8) - 0.5) * 1.6, 0.02)
put(sfx, swell(D4, 1.0, 0.07), 19.6, 0); keys(19.6, 19.85, 8, 0.04); keys(19.75, 20.5, 14, 0.035)
# 20.95–25.2 · the page shrinks into the rolling list
put(sfx, swish(1.0), 20.95, -0.3, 0.07); put(sfx, air(0.4, False), 21.0, 0, 0.06); keys(21.26, 21.56, 8, 0.05)
for t_, n_ in [(21.95, A5), (22.7, C6), (23.45, E6 - 12), (24.35, G5)]:
    put(sfx, swish(1.0), t_ - 0.04, 0.2, 0.05); put(sfx, pluck(n_, 0.5, 0.11), t_ + 0.18, -0.4, 0.07); keys(t_ + 0.02, t_ + 0.32, 8, 0.045)
put(sfx, air(0.5, True), 24.75, 0, 0.07)
# 25.2–28.4 · Premium sites used / to take months; cards pop
word(25.25, D5, 0.8); word(25.48, A5); word(26.72, F5, 0.8); word(26.92, C6)
for i, t_ in enumerate([25.45, 25.65, 25.85, 26.0, 26.15, 27.0, 27.2]): pop(t_, [D6, F5 + 12, A5, C6, E6, A5, D6][i], [0.7, 0.8, 0.9, 0.1, -0.1, -0.8, -0.8][i], 0.8)
for i in range(12): put(sfx, tick(0.02, 3600), 25.5 + i * 0.24, 0.7)
# 28.4–30.3 · the field card opens; push; whip into the laptop
put(sfx, air(0.5, True), 28.3, 0, 0.07); put(sfx, swish(1.0), 28.45, 0, 0.05)
put(sfx, swell(Bb3, 1.2, 0.07), 28.8, 0); put(sfx, air(0.35, True), 29.95, 0, 0.13)
# 30.28–37.45 · the emblem, OBSIDIAN, N◆w, it ◆ starts, with a brief, Build a mo, the card
put(sfx, boom(0.5, 34), 30.28, 0, 1.0)
for i, n_ in enumerate([F4, C5, A5, E6]): put(sfx, bell(n_, 3.0, 1.3), 30.3 + i * 0.05, -0.3 + i * 0.2, 0.09)
put(sfx, glide(C5, F5, 0.5, 0.03), 30.95, 0); put(sfx, glass(A5 + 12, 1), 31.12, 0.3, 0.06)
word(32.22, A5); word(33.17, C6); word(34.22, E5)
put(sfx, tick(0.12, 2600), 34.72, 0); keys(34.98, 35.3, 10, 0.05)
keys(35.35, 36.3, 10, 0.07)
put(sfx, air(0.35, True), 36.1, 0, 0.08); put(sfx, glass(F5 + 12, 1), 36.36, 0, 0.07); keys(36.4, 37.4, 14, 0.05)
for i in range(8): put(sfx, glass(E6 + 12 * (i % 2) - 12, 1), 36.4 + i * 0.07, -0.7, 0.015)
# 37.45–43.7 · Faster ideas / launches / products / everything
put(sfx, boom(0.34, 40), 37.45, 0, 1.0); keys(37.5, 37.95, 6, 0.04); click(38.25, D6)
put(sfx, swish(1.0), 38.88, 0, 0.07); put(sfx, air(0.5, True), 38.9, 0, 0.07); put(sfx, glide(D4, A4, 0.5, 0.04), 38.95, 0)
click(40.05, A5, 1.2); put(sfx, bell(D6, 2.4, 1.0, 0.5), 40.15, 0.2, 0.08); put(sfx, glass(A5 + 12, 1), 40.2, 0.4, 0.05)
put(sfx, swish(1.0), 40.88, 0, 0.07); pop(40.98, F5 + 12, 0)
for i in range(10): put(sfx, tick(0.02, 3500), 41.0 + i * 0.12, 0.3)
put(sfx, swish(1.0), 42.28, 0, 0.07)
for t_, n_ in [(37.5, A5), (38.95, C6), (40.95, F5), (42.35, E5)]: word(t_, n_, 0.7)
# 43.7–47 · Great brands / no longer start / with templates + the pile
word(43.78, D5); word(43.9, Bb4 + 12)
for i in range(8): put(sfx, swish(1.0), 44.95 + i * 0.11, -0.6 + i * 0.1, 0.03); pop(45.3 + i * 0.11, [G5, Bb4 + 12, D6, G5, A5, D6, F5 + 12, G5][i], -0.5, 0.6)
word(44.78, G5, 0.7); word(45.0, Bb4 + 12, 0.7); word(45.15, D6, 0.7)
put(sfx, glass(D6, 1), 45.95, 0.3, 0.06); word(46.0, A5)
# 47–52 · the 3D emblem, OBSIDIAN on the horizon
put(sfx, air(0.4, True), 46.6, 0, 0.08); put(sfx, boom(0.5, 34), 47.0, 0, 1.0)
put(sfx, swell(F3, 1.3, 0.1), 47.0, 0); put(sfx, glide(C5, F5, 1.3, 0.025), 47.0, 0)
put(sfx, air(0.8, False), 48.45, 0, 0.07)
put(sfx, boom(0.4, 36), 49.2, 0, 1.0)
for i, n_ in enumerate([F4, C5, A5, E6, G5 + 12]): put(sfx, bell(n_, 3.6, 1.6), 49.22 + i * 0.05, -0.3 + i * 0.15, 0.1)
put(sfx, glass(C6 + 12, 1), 49.95, 0.3, 0.05)

fade = np.ones(N); fl = int(1.4 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 2
mix = (mus * 0.8 + sfx * 0.9) * fade[:, None]
mix /= max(1.0, np.abs(mix).max() / 0.95)
out = (mix * 32767).astype(np.int16)
with wave.open(os.path.join(HD, 'mix_52.wav'), 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(out.tobytes())
print('mix_52.wav', out.shape)
