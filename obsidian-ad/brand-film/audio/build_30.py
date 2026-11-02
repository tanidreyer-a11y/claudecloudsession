"""OBSIDIAN 30 s "Colour worlds" (src/Film4.tsx). Kit copied from Klick Kulture / the 60 s build.
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
DUR = 30.0
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

# ------------------------------------------------------------- OBSIDIAN 30 s — D minor; a chord per colour world
Bb2, Bb3, Bb4, Bb5 = 46, 58, 70, 82
TW1, TW2, TW3, TW4 = 12.50, 14.30, 17.63, 19.73      # world changes (printed from Film4.tsx)
chord_bed([
    (0.0, 2.9, [D2, A2, D3, F3, E4], 700, 0.6),              # the drop on black: Dm9
    (2.9, 5.8, [Bb2, F3, A3, D4, C5], 2600, 0.85),           # the white world: Bbmaj9
    (5.8, 8.4, [G2, D3, F3, Bb3, C4], 1800, 0.75),           # the scroll: Gm11
    (8.4, 11.2, [F2, C3, E3, G3, A3], 2200, 0.8),            # containers, lines, the merge: Fmaj9
    (11.2, TW1, [Bb2, F3, A3, C4, E4], 2100, 0.75),          # travel: Bbmaj9#11
    (TW1, TW2, [D2, A2, E3, F3, C4], 2300, 0.8),             # black & white: Dm11
    (TW2, TW3, [G2, D3, F3, A3, Bb3], 1600, 0.8),            # black & green: Gm9 (darker)
    (TW3, TW4, [F2, C3, A3, C4, E4], 2600, 0.8),             # forest: Fmaj7 open
    (TW4, 24.0, [Bb2, F3, A3, D4, E4], 2400, 0.85),          # Obsidian: Bbmaj9
    (24.0, 30.0, [D2, A2, D3, F3, A3, E4], 2600, 1.0),       # lockup: Dm(add9)
])
pulse(5.9, 8.3, bpm=100, g=0.16, hats=True)
pulse(8.45, 23.9, bpm=100, g=0.24, hats=True, claps=True)
bassline(8.45, 23.9, [F2, F2, A2, A2, Bb2 - 12, Bb2 - 12, C2 + 12, C2 + 12], bpm=100, g=0.11)
# A the drop runs down the line; drips; it lands
put(sfx, glide(A5, D5, 1.8, 0.05), 0.05, 0); put(sfx, air(1.8, True), 0.2, 0, 0.06)
for i, t in enumerate([0.55, 0.95, 1.45]): put(sfx, pluck([A5, F5, D5][i], 0.5, 0.1), t, 0, 0.07)
put(sfx, boom(0.22, 46), 2.0, 0, 1.0); put(sfx, bell(D5, 2.2, 1.0, 0.3), 2.02, 0, 0.08); put(sfx, glass(A5, 1), 2.05, 0, 0.05)
# B the dive → white
put(sfx, air(0.8, True), 2.2, 0, 0.11); put(sfx, boom(0.4, 36), 2.95, 0, 1.0)
for i, n_ in enumerate([Bb4, D5, F5, A5, C6]): put(sfx, bell(n_, 3.0, 1.3), 2.97 + i * 0.06, -0.4 + i * 0.2, 0.08)
# C the glass plane slides off
put(sfx, swish(1.0), 3.8, 0.4, 0.07); put(sfx, glide(F5, C6, 0.6, 0.04), 3.8, 0.4)
# D pull back, E the scroll: rush + ticks that speed up and brake
put(sfx, air(1.2, False), 4.6, 0, 0.06)
put(sfx, air(2.0, True), 5.8, 0, 0.11); put(sfx, air(0.7, False), 7.8, 0, 0.08)
t = 6.0; i = 0
while t < 8.25:
    v = min(1, (t - 5.8) / 1.0) * (1 - max(0, (t - 7.6) / 0.8))
    put(sfx, tick(0.05 + 0.06 * v, 1600 + 600 * (i % 3)), t, (h(i, 1) - 0.5) * 1.2)
    t += 0.16 - 0.11 * v; i += 1
put(sfx, boom(0.25, 44), 8.35, 0, 1.0); put(sfx, bell(A5, 2.0, 0.9), 8.37, 0, 0.06)
# F lines draw, balls come out, roll, merge
for i in range(3): put(sfx, glide([C5, F5, A4][i], [F5, A5, C5][i], 0.7, 0.035), 8.45 + i * 0.05, [-0.5, 0, 0.5][i])
for i in range(3): put(sfx, pluck([F5, A5, C6][i], 0.6, 0.13), 8.95 + i * 0.07, [-0.5, 0, 0.5][i], 0.08)
put(sfx, swell(F3, 1.3, 0.09), 9.2, 0)
put(sfx, boom(0.42, 38), 10.52, 0, 1.0)
for i, n_ in enumerate([F4, A4, C5, E5, A5]): put(sfx, bell(n_, 3.0, 1.3), 10.54 + i * 0.05, -0.3 + i * 0.15, 0.09)
put(sfx, glass(C6, 1), 10.6, 0, 0.06)
# G travel; a swell + bell per world; the 360° loop
put(sfx, swell(Bb3, 1.0, 0.08), 11.2, 0)
for t_, n_ in [(TW1, D5), (TW2, Bb4), (TW3, A5), (TW4, D6)]:
    put(sfx, swell(n_ - 24, 0.6, 0.1), t_ - 0.55, 0); put(sfx, bell(n_, 2.4, 1.1, 0.35), t_, 0, 0.09); put(sfx, glass(n_ + 7, 1), t_ + 0.08, 0.3, 0.04)
put(sfx, air(1.6, True), 15.3, 0, 0.09)
for i in range(6): put(sfx, swish(1.0), 15.5 + i * 0.25, np.sin(i * 1.05), 0.045)
put(sfx, air(0.8, False), 16.9, 0, 0.07)
# H the ball enters the button; the line runs around it; zoom
put(sfx, glass(F5 + 12, 1), 20.2, 0.2, 0.07); put(sfx, glide(A5, E6, 0.9, 0.035), 20.6, 0.2)
put(sfx, air(1.4, True), 20.9, 0, 0.08)
# I press, swipe, release, whip
put(sfx, tick(0.18, 2400), 22.65, 0); put(sfx, pluck(D5, 0.4, 0.08), 22.66, 0, 0.06)
put(sfx, glide(D5, A5, 1.1, 0.05), 22.8, 0.1); put(sfx, swish(1.0), 22.9, 0.3, 0.06)
put(sfx, snap(0.5), 23.9, 0.3); put(sfx, bell(A5, 2.0, 0.9), 23.92, 0.3, 0.08)
put(sfx, air(0.9, True), 23.95, 0.4, 0.1)
# J emblem + lockup
put(sfx, swell(D4, 0.8, 0.1), 25.2, 0)
for i in range(2): put(sfx, pluck([F5, A5][i], 0.6, 0.12), 26.15 + i * 0.14, 0.2, 0.09)
put(sfx, boom(0.5, 34), 26.8, 0, 1.0)
for i, n_ in enumerate([D4, A4, F5, A5, E6]): put(sfx, bell(n_, 3.4, 1.5), 26.82 + i * 0.05, -0.3 + i * 0.15, 0.11)
put(sfx, pluck(A5, 0.6, 0.14), 27.7, 0, 0.06)

fade = np.ones(N); fl = int(1.4 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 2
mix = (mus * 0.8 + sfx * 0.9) * fade[:, None]
mix /= max(1.0, np.abs(mix).max() / 0.95)
out = (mix * 32767).astype(np.int16)
with wave.open(os.path.join(HD, 'mix_30.wav'), 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(out.tobytes())
print('mix_30.wav', out.shape)
