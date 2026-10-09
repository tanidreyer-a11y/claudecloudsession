"""Klick Kulture 'Makes you click' — music bed + musical SFX + the voice, cued to the picture (src/KK.tsx).
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
DUR = 42.0
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

# ------------------------------------------------------------- music
chord_bed([
    (0.0, 3.4, [A2, E3, G3, B3, C4], 700, 0.55),              # grey feed: Am9, muted
    (3.3, 5.5, [A2, E3, G3, B3, C4], 1300, 0.6),             # the rush brightens it
    (8.0, 11.9, [D3, F3, A3, C4, E4], 1100, 0.5),            # the hand / feel: Dm9, tension
    (11.92, 15.4, [C3, G3, D4, E4, G4], 2600, 0.85),         # SNAP: Cadd9 opens
    (15.4, 18.6, [F2, C3, E3, G3, A3], 2400, 0.8),           # strategy meets story: Fmaj9
    (18.6, 21.7, [G2, D3, E3, B3, D4], 2400, 0.8),           # content sparks conversation: G6
    (21.7, 24.45, [C3, G3, B3, E4], 2400, 0.8),              # clicks -> connection: Cmaj7
    (24.45, 27.0, [E2, B2, E3, G3], 650, 0.45),              # the usual checklist: Em, dull
    (27.6, 29.9, [F2, C3, A3, E4], 2000, 0.75),              # we craft experiences: Fmaj7
    (29.9, 32.6, [D2, A2, D3, F3], 800, 0.5),                # chatter: Dm, dark
    (32.6, 34.4, [G2, D3, C4, D4], 1500, 0.6),               # your brand deserves: Gsus
    (34.39, 42.0, [C2, G2, C3, E3, G3, D4], 2800, 1.0),      # ROAR -> the K: C home
])
mus *= 0.9
# slowing: Fmaj7, cut dead at the stop (it 'stops' with the feed)
put(mus, pad([F2, C3, E3, A3], 2.25, att=1.0, rel=0.04, cutoff=900), 5.37, 0, 0.5)
pulse(12.32, 24.3, bpm=112, g=0.34, hats=True, claps=True)
bassline(12.32, 24.3, [C2, C2, G2, A2, F2, F2, G2, G2], g=0.16)
pulse(27.85, 29.85, bpm=112, g=0.2, hats=True)
pulse(34.39, 39.6, bpm=112, g=0.4, hats=True, claps=True)
bassline(34.39, 39.6, [C2 + 12, C2 + 12, G2, A2, F2, F2, G2, G2], g=0.18)

# ------------------------------------------------------------- SFX
# 1 feed: soft scroll ticks, the story bell, the rush
put(sfx, bell(E5, 2.0, 0.9, 0.3), 0.42, -0.1, 0.06); put(sfx, bell(C5, 2.0, 0.9, 0.3), 1.74, 0.1, 0.06)
for i in range(40):                                     # scroll detents accelerating with the rush
    t = 3.3 + 2.1 * (i / 40) ** 0.55
    put(sfx, tick(0.18, 2600 + 400 * (i % 3)), t, (i % 2 - 0.5) * 0.6)
put(sfx, air(1.6, True), 3.35, 0, 0.12)                  # AIR 1: the rush
put(sfx, air(0.9, False), 5.0, 0, 0.07)
# 2 the hand rises; the stop
put(sfx, swell(A3, 1.5, 0.12), 6.1, 0)
put(sfx, boom(0.28, 44), 7.6, 0, 1.0); put(sfx, tick(0.4, 1800), 7.6, 0)
put(sfx, bell(A4, 2.4, 1.1, 0.2), 7.62, 0, 0.07)
# feel something: the heart
put(sfx, pluck(A5, 0.6, 0.14), 9.22, 0.2, 0.08); put(sfx, bell(E6, 1.8, 0.8), 9.3, 0.2, 0.06)
# makes you... wind-up
put(sfx, swell(D4, 1.25, 0.16), 10.67, 0); put(sfx, glide(D4, A4, 1.2, 0.04), 10.7, 0)
# 3 THE SNAP
put(sfx, snap(1.0), 11.92, 0.05, 0.55)
put(sfx, boom(0.42), 11.93, 0, 1.0)
for i, n_ in enumerate([C5, E5, G5, D6, E6]):            # one note per colour ring
    put(sfx, bell(n_, 2.4, 1.0), 11.95 + i * 0.075, -0.5 + i * 0.25, 0.1)
for i in range(12):                                      # hearts burst
    put(sfx, glass([C6, D6, E6, G6, A6][i % 5], 1), 12.0 + i * 0.03 + rng.random() * 0.05, (rng.random() - 0.5) * 1.4, 0.03)
# 4 playground: pops and the headline
for i, t in enumerate([13.55, 13.65, 13.75, 13.8, 13.9, 13.95, 14.1, 14.2]):
    put(sfx, pluck([C5, E5, G5, A5, C6, D6, E6, G5][i], 0.5, 0.1), t + 0.08, -0.6 + i * 0.17, 0.06)
put(sfx, tick(0.4), 13.45); put(sfx, bell(G5, 1.6, 0.6), 14.15, 0, 0.06); put(sfx, bell(C6, 1.8, 0.7), 14.7, 0, 0.07)
put(sfx, swish(1.0), 14.55, 0.4, 0.06)                   # the card flip
# 5 the phone
put(sfx, air(0.8, True), 15.35, 0.3, 0.09)               # AIR 2: the phone spin
put(sfx, swish(1.0), 15.55, 0.5, 0.07); put(sfx, swish(1.0), 15.8, 0.2, 0.06)
put(sfx, boom(0.18, 50), 16.18, 0, 1.0); put(sfx, bell(F5, 1.6, 0.6), 16.2, 0, 0.07)
put(sfx, tick(0.3), 16.02); put(sfx, pluck(A5, 0.5, 0.1), 16.05, -0.3, 0.06)       # STRATEGY chip
put(sfx, swish(1.0), 18.4, -0.3, 0.07)                                              # carousel swipe
put(sfx, tick(0.3), 18.78); put(sfx, pluck(B5, 0.5, 0.1), 18.8, -0.3, 0.06)         # CONTENT chip
for i, t in enumerate([19.8, 20.05, 20.3, 20.55, 20.8]):                            # bubbles pop out
    put(sfx, pluck([G5, B5, D6, E6, G6][i], 0.5, 0.11), t + 0.05, [-0.5, 0.5, -0.5, 0.5, -0.2][i], 0.08)
# 6 clicks -> connection
for i, t in enumerate([22.3, 22.62, 22.92, 23.2]):
    put(sfx, tick(0.6, 2400), t, [-0.3, 0.5, -0.5, 0.4][i]); put(sfx, pluck([E5, G5, B5, E6][i], 0.5, 0.1), t + 0.01, 0, 0.08)
put(sfx, bell(E6, 1.4, 0.5), 22.32, -0.3, 0.06)          # the like
for i in range(6):
    put(sfx, glide([C5, E5, G5, B5, C6, E6][i], [E5, G5, B5, C6, E6, G6][i], 0.4, 0.035), 23.4 + i * 0.12, -0.5 + i * 0.2)
# 7 the checklist: dull, mechanical
put(sfx, swell(E4, 0.8, 0.06), 24.4, 0)
for t in np.arange(25.6, 26.95, 0.125):                  # metronome
    put(sfx, tick(0.14, 1500), t, 0)
for i, t in enumerate([25.72, 25.97, 26.22, 26.47, 26.72]):
    put(sfx, tick(0.5, 1900), t, -0.2); put(sfx, pluck(E4, 0.3, 0.05), t, -0.2, 0.05)
put(sfx, boom(0.35, 40), 26.95, 0, 1.0); put(sfx, clap(1.0), 26.95, 0, 0.25); put(sfx, clap(1.0), 27.07, 0, 0.2)
put(sfx, swish(1.0), 27.2, 0, 0.06)                      # it falls
# 7b craft: pieces stick
for i, t in enumerate([27.62, 27.72, 27.8, 27.86, 27.92, 28.0, 28.35, 28.55, 28.65]):
    put(sfx, pluck([F4, A4, C5, E5, F5, A5, C6, E6, F5][i], 0.6, 0.13), t + 0.35, -0.6 + i * 0.15, 0.08)
put(sfx, bell(A5, 2.0, 0.9), 28.35, 0, 0.08); put(sfx, bell(C6, 2.0, 0.9), 28.55, 0, 0.07)
# 8 chatter -> roar
put(sfx, murmur(29.7, 32.65, 1.0), 29.7, 0, 0.11)
for b in range(40):
    t = 29.7 + 2.3 * (b / 40) ** 0.75
    put(sfx, tick(0.12, 1600 + 600 * (b % 4)), t, (rng.random() - 0.5) * 1.6)
put(sfx, swell(G3, 1.7, 0.16), 32.65, 0); put(sfx, glide(G3, D4, 1.6, 0.04), 32.7, 0)
put(sfx, air(0.5, True), 33.9, 0, 0.1)                   # AIR 3: into the roar
put(sfx, boom(0.6, 34), 34.39, 0, 1.0); put(sfx, clap(1.0), 34.39, 0, 0.3)
for i, n_ in enumerate([C5, G5, E6, C6]):
    put(sfx, bell(n_, 3.0, 1.3), 34.41 + i * 0.05, -0.3 + i * 0.2, 0.13)
for i in range(14):
    put(sfx, glass([C6, D6, E6, G6, A6][i % 5], 1), 34.45 + i * 0.03, (rng.random() - 0.5) * 1.6, 0.03)
# 9 the K
put(sfx, swell(C4, 0.55, 0.12), 35.42, 0)
put(sfx, boom(0.3, 40), 35.98, 0, 1.0)
for i, t in enumerate([36.05, 36.13, 36.21]):            # bar, chevron, chevron
    put(sfx, pluck([C5, E5, G5][i], 0.5, 0.11), t + 0.25, 0.2 * i, 0.1)
put(sfx, bell(C6, 3.0, 1.4), 36.5, 0, 0.1); put(sfx, bell(G5, 3.0, 1.4), 36.53, 0.2, 0.08)
put(sfx, swish(1.0), 37.22, 0.3, 0.05)                   # wordmark
for i in range(5):
    put(sfx, pluck([C5, D5, E5, G5, C6][i], 0.5, 0.1), 37.9 + i * 0.24, -0.4 + i * 0.2, 0.07)
put(sfx, bell(E6, 2.4, 1.2), 39.5, 0, 0.05)
put(mus, pad([C3, G3, E4, G4, C5], 3.0, att=0.6, rel=2.4, cutoff=2200), 39.6, 0, 0.7)   # resolve after the beat stops

# ------------------------------------------------------------- voice + ducking
w = wave.open(os.path.join(HD, 'voice48.wav')); vo = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
VO_T = 0.4
voice = np.zeros(N); i = int(VO_T * SR); L = min(len(vo), N - i); voice[i:i + L] = vo[:L]
voice *= 0.9 / (np.abs(voice).max() + 1e-9)
ev = lp(lp(np.abs(voice), 6), 6); ev = np.clip(ev / (np.percentile(ev[ev > 1e-4], 90) + 1e-9), 0, 1)
duck_m = 10 ** (-9 * ev / 20); duck_s = 10 ** (-4.5 * ev / 20)
fade = np.ones(N); fl = int(2.2 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 2
mix = mus * duck_m[:, None] * 0.68 + sfx * duck_s[:, None] * 0.9 + voice[:, None] * 0.95
mix *= fade[:, None]
mix /= max(1.0, np.abs(mix).max() / 0.95)
out = (mix * 32767).astype(np.int16)
with wave.open(os.path.join(HD, 'mix.wav'), 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(out.tobytes())
print('mix.wav', out.shape, 'peak', np.abs(mix).max())
