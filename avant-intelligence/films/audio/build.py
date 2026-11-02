"""Music bed + musical SFX for the two Avant films, cued from the same timeline JSON as the picture.
python3 audio/build.py wide|tall   ->  audio/<name>_mix.wav (48 kHz stereo)
Self-generated with numpy (no third-party audio). Ambient electronic, ~104 bpm, A minor in the problem, opening to
C major at the turn, Cmaj9 bloom at the merge. UI sounds are notes of the current chord. Max 3 air moves per film.
When the voiceover arrives: add vo.wav, duck music −9 dB / SFX −4.5 dB under it (sidechain envelope), re-run finish.sh."""
import json, os, sys, wave
import numpy as np
from scipy.signal import lfilter

SR = 48000
H = os.path.dirname(os.path.abspath(__file__))
name = sys.argv[1]
K = json.load(open(os.path.join(H, '..', 'src', f'timeline{"Wide" if name == "wide" else "Tall"}.json')))
DUR = K['end']
N = int(SR * (DUR + 0.5))
rng = np.random.default_rng(11)
mus = np.zeros((N, 2)); sfx = np.zeros((N, 2))
NOTE = lambda n: 440 * 2 ** ((n - 69) / 12)
A3, C4, E4, G4, A4, B4, C5, D5, E5, G5, A5, B5, C6, D6, E6 = 57, 60, 64, 67, 69, 71, 72, 74, 76, 79, 81, 83, 84, 86, 88
F3, F4, G3, E3, C3, A2, D4 = 53, 65, 55, 52, 48, 45, 62

def put(buf, sig, t, pan=0.0, g=1.0):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0: return
    if i < 0: sig = sig[-i:]; i = 0
    sig = sig[:N - i]
    buf[i:i + len(sig), 0] += sig * g * np.sqrt((1 - pan) / 2) * 1.414
    buf[i:i + len(sig), 1] += sig * g * np.sqrt((1 + pan) / 2) * 1.414

def lp(x, fc):
    """one-pole low-pass."""
    a = np.exp(-2 * np.pi * fc / SR)
    return lfilter([1 - a], [1, -a], x)

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

def tick(g=1.0):
    n = int(0.02 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * 3200 * tt) * np.exp(-tt * 300) + 0.3 * rng.standard_normal(n) * np.exp(-tt * 800)) * g

def air(dur, rise=True):
    n = int(dur * SR); x = rng.standard_normal(n); k = np.linspace(0, 1, n)
    lo = lp(x, 900); hi = x - lp(x, 2500)
    mixk = k if rise else 1 - k
    y = lo * (1 - mixk) + hi * mixk * 0.6
    shape = (k ** 2.2 if rise else (1 - k) ** 1.6) * np.minimum(1, (1 - k if rise else k) * 30 + 0.02)
    return y * shape / (np.abs(y).max() + 1e-9)

def boom(g=1.0):
    n = int(2.4 * SR); tt = np.arange(n) / SR; f = 36 + 55 * np.exp(-tt * 7)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 1.9) * env(n, 0.003) * g

def pad(notes, dur, att=1.5, rel=1.8, cutoff=1400, det=0.12):
    n = int(dur * SR); tt = np.arange(n) / SR; y = np.zeros(n)
    for j, nt in enumerate(notes):
        f = NOTE(nt)
        for d in (-det, det):
            ff = f * 2 ** (d / 12)
            # soft saw (few harmonics)
            for h in range(1, 6):
                y += np.sin(2 * np.pi * ff * h * tt + j + h) / h ** 1.6
    y = lp(y, cutoff)
    e = np.minimum(1, tt / att) * np.minimum(1, (dur - tt) / rel).clip(0)
    lfo = 1 + 0.08 * np.sin(2 * np.pi * 0.17 * tt)
    return y * e * lfo / (len(notes) * 4)

def kick(g=1.0):
    n = int(0.35 * SR); tt = np.arange(n) / SR; f = 48 + 90 * np.exp(-tt * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * g

def hat(g=1.0):
    n = int(0.06 * SR); x = rng.standard_normal(n); x = x - lp(x, 7000)
    return x * np.exp(-np.arange(n) / SR * 70) * g

def chord_bed(sections):
    """sections: list of (start, end, notes, cutoff, gain)"""
    for (a, b, notes, cut, g) in sections:
        put(mus, pad(notes, b - a + 1.6, cutoff=cut), a - 0.2, 0, g)

def pulse(a, b, bpm=104, g=0.5, hats=True):
    beat = 60 / bpm; t = a; i = 0
    while t < b:
        put(mus, kick(), t, 0, g * (1.0 if i % 4 == 0 else 0.65))
        if hats: put(mus, hat(), t + beat / 2, 0.3 * (1 if i % 2 else -1), g * 0.35)
        t += beat; i += 1

def sub_bass(a, b, note, g=0.25):
    n = int((b - a) * SR); tt = np.arange(n) / SR
    y = np.sin(2 * np.pi * NOTE(note) * tt) * np.minimum(1, tt / 0.6) * np.minimum(1, (b - a - tt) / 0.8).clip(0)
    put(mus, y, a, 0, g)

if name == 'wide':
    # ---- music
    chord_bed([
        (0.0, K['turn'], [A2 + 12, C4, E4], 900, 0.9),                 # Am, dark (problem)
        (K['turn'], K['handle'] + 2.5, [F3, A3, C4, E4], 1500, 0.9),    # Fmaj7 (turn)
        (K['handle'] + 2.5, K['dive'], [C3 + 12, E4, G4, B4], 1800, 0.9),  # Cmaj7
        (K['dive'], K['emerge'], [A3, C4, E4, G4], 1300, 0.7),          # Am7 inside the agent
        (K['emerge'], K['merge'], [F3, A3, C4, G4], 2000, 0.9),         # Fadd9 climb
        (K['merge'], DUR, [C3 + 12, E4, G4, B4, D5], 2600, 1.0),        # Cmaj9 bloom → logo
    ])
    sub_bass(K['turn'], K['dive'], F3 - 24 + 12, 0.18); sub_bass(K['emerge'], K['merge'], F3 - 12, 0.16)
    pulse(K['turn'] + 0.3, K['dive'] - 0.6, g=0.32)
    pulse(K['emerge'] + 1.0, K['merge'] - 0.3, g=0.36)
    # ---- sfx
    for i in range(14):  # dots landing (soft, sparse)
        put(sfx, tick(0.35), 0.4 + i * 0.17 + rng.uniform(0, 0.08), rng.uniform(-0.6, 0.6))
    put(sfx, bell(E5, 2.4, 0.9), K['spark'], 0, 0.30)                 # the spark
    for i in range(4):                                                 # tasks appear: muted low notes
        put(sfx, pluck([A3, C4, A3, E4][i], 0.7, 0.18), K['pain'] + i * 0.6, [-0.4, 0.4, -0.4, 0.4][i], 0.26)
    pans = [-0.55, 0.55, -0.55, 0.55]
    for i, n_ in enumerate([C5, E5, G5, B5]):                          # agents ignite (ascending)
        put(sfx, bell(n_, 2.0, 0.7), K['turn'] + 0.3 + i * 0.25, pans[i], 0.24)
    for i, n_ in enumerate([G5, A5, C6, D6]):                          # tasks handled (chimes)
        put(sfx, bell(n_, 1.2, 0.35, 0.8), K['handle'] + 0.5 + i * 0.45, pans[i] * 0.7, 0.16)
    put(sfx, air(1.3, True), K['dive'] - 1.25, 0.3, 0.35)              # AIR 1: dive into the agent
    put(sfx, boom(0.35), K['dive'], 0, 1.0)
    beam = air(1.9, True) * 0.5; put(sfx, beam[::-1] * np.hanning(len(beam)), K['dive'] + 0.5, 0, 0.22)  # beam shimmer
    for i in range(5):
        put(sfx, pluck([E5, G5, A5, C6, E6][i], 0.5, 0.1), K['dive'] + 0.6 + i * 0.36, 0.2, 0.15)          # fields light
        put(sfx, tick(0.5), K['dive'] + 2.5 + i * 0.12, -0.2 + i * 0.1)                                    # values lift
    put(sfx, bell(A4, 1.5, 0.6), K['ball'] - 0.2, 0, 0.2)
    put(sfx, air(1.1, False), K['emerge'] - 0.05, -0.2, 0.32)          # AIR 2: emerge (outward)
    for i, n_ in enumerate([C5, E5, G5, B5, C6, E6, G5, C6]):         # climb arpeggio
        put(sfx, pluck(n_, 0.6, 0.14), K['climb'] + i * 0.4, -0.5 + (i % 2), 0.12)
    put(sfx, air(1.6, True), K['merge'] - 1.55, 0, 0.3)                # AIR 3: into the merge
    put(sfx, boom(0.55), K['merge'], 0, 1.0)
    put(sfx, bell(C6, 3.0, 1.4), K['merge'], 0, 0.22); put(sfx, bell(G5, 3.0, 1.4), K['merge'] + 0.05, 0, 0.18)
    put(sfx, bell(E5, 3.5, 1.6), K['logo'], -0.2, 0.22); put(sfx, bell(B5, 3.5, 1.6), K['logo'] + 0.08, 0.2, 0.16)
    for i in range(6): put(sfx, bell([C6, E6, G5, B5, D6, E6][i], 0.8, 0.25, 1.0), K['logo'] + 2.6 + i * 0.25, -0.5 + i * 0.2, 0.07)  # sweep sparkle
else:
    chord_bed([
        (0.0, K['turn'], [A2 + 12, C4, E4], 900, 0.9),
        (K['turn'], K['proof'], [F3, A3, C4, E4], 1600, 0.9),
        (K['proof'], K['merge'], [C3 + 12, E4, G4, B4], 2000, 0.9),
        (K['merge'], DUR, [C3 + 12, E4, G4, B4, D5], 2600, 1.0),
    ])
    sub_bass(K['turn'], K['merge'], F3 - 12, 0.16)
    pulse(K['turn'] + 0.2, K['merge'] - 0.3, g=0.34)
    # hook: the graph draws (glide up), then falls (glide down)
    n = int(1.9 * SR); tt = np.arange(n) / SR; fr = NOTE(E5) * (1 + 0.15 * np.sin(tt * 1.2)) * np.where(tt > 1.3, 2 ** (-(tt - 1.3) * 1.6), 1)
    put(sfx, np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(n, 0.05, None, 0.3) * 0.5, K['graph'], -0.2, 0.16)
    put(sfx, pluck(A3 - 12 + 12, 1.0, 0.3), K['graph'] + 1.8, 0, 0.3)
    for i in range(4):  # customer messages: muted, unanswered
        put(sfx, pluck([A3, C4, A3, E4][i], 0.6, 0.15), K['pain'] + 0.5 + i * 1.2, -0.4, 0.26)
    put(sfx, air(1.0, True), K['turn'] - 0.95, 0.4, 0.3)               # AIR 1: the line arrives
    put(sfx, bell(E5, 2.0, 0.8), K['turn'], 0.5, 0.24)
    for i, n_ in enumerate([C5, E5, G5, B5]):                          # agent replies, timed to the line tip
        put(sfx, bell(n_, 1.4, 0.45, 0.8), K['turn'] + 0.55 + i * 0.52, 0.45, 0.2)
    n = int(2.4 * SR); tt = np.arange(n) / SR; fr = NOTE(C5) * 2 ** (tt / 2.4 * 0.58)   # graph heals: glide up
    put(sfx, np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(n, 0.1, None, 0.4) * 0.5, K['proof'] + 0.9, 0.2, 0.16)
    for i, n_ in enumerate([C5, E5, G5, B5, C6, E6]):
        put(sfx, pluck(n_, 0.6, 0.14), K['climb'] + i * 0.33, -0.5 + (i % 2), 0.12)
    put(sfx, air(1.5, True), K['merge'] - 1.45, 0, 0.3)                # AIR 2: into the merge
    put(sfx, boom(0.55), K['merge'], 0, 1.0)
    put(sfx, bell(C6, 3.0, 1.4), K['merge'], 0, 0.22); put(sfx, bell(G5, 3.0, 1.4), K['merge'] + 0.05, 0, 0.18)
    put(sfx, bell(E5, 3.5, 1.6), K['logo'], -0.2, 0.22); put(sfx, bell(B5, 3.5, 1.6), K['logo'] + 0.08, 0.2, 0.16)
    for i in range(6): put(sfx, bell([C6, E6, G5, B5, D6, E6][i], 0.8, 0.25, 1.0), K['logo'] + 2.3 + i * 0.25, -0.5 + i * 0.2, 0.07)

# end fade and mix
fade = np.ones(N); fl = int(1.6 * SR); fade[int(DUR * SR) - fl:int(DUR * SR)] = np.linspace(1, 0, fl) ** 2; fade[int(DUR * SR):] = 0
mix = (mus * 0.55 + sfx) * fade[:, None]
mix = np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.6) * 0.8
mix = mix[:int(DUR * SR)]
for nm, buf in [(f'{name}_mix.wav', mix)]:
    with wave.open(os.path.join(H, nm), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((buf * 32767).astype('<i2').tobytes())
print(name, 'mix', DUR, 's')
