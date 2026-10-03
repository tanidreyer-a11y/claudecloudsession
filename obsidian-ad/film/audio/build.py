"""Music bed + musical SFX for the OBSIDIAN ad (kit shared with the Avant films), cued from the same timeline JSON as the picture.
python3 audio/build.py wide|tall   ->  audio/<name>_mix.wav (48 kHz stereo)
Self-generated with numpy (no third-party audio). Ambient electronic, ~104 bpm, A minor in the problem, opening to
C major at the turn, Cmaj9 bloom at the merge. UI sounds are notes of the current chord. Max 3 air moves per film.
When the voiceover arrives: add vo.wav, duck music −9 dB / SFX −4.5 dB under it (sidechain envelope), re-run finish.sh."""
import json, os, sys, wave
import numpy as np
from scipy.signal import lfilter

SR = 48000
H = os.path.dirname(os.path.abspath(__file__))
name = 'obsidian'
K = json.load(open(os.path.join(H, '..', 'src', 'timeline.json')))
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


D3, F3_, A3_, D4, F4_, A4_, C5_, D5_, E5_, F5_, A5_ = 50, 53, 57, 62, 65, 69, 72, 74, 76, 77, 81
Bb2, Bb3, G3_, C4_, E4_, G4_ = 46, 58, 55, 60, 64, 67
def swish(g=1.0):  # short UI swipe (not a whoosh): filtered noise, 0.18 s
    n = int(0.18 * SR); x = rng.standard_normal(n); y = lp(x, 3500) - lp(x, 600)
    return y * np.sin(np.linspace(0, np.pi, n)) ** 2 / (np.abs(y).max() + 1e-9) * g
def shards(g=1.0):
    n = int(1.4 * SR); out = np.zeros(n)
    for i in range(40):
        k = int(rng.uniform(0, 0.9) * SR); m = int(0.05 * SR)
        out[k:k + m] += (rng.standard_normal(m) - lp(rng.standard_normal(m), 4000)) * np.exp(-np.arange(m) / SR * 60) * rng.uniform(.2, 1)
    return out / (np.abs(out).max() + 1e-9) * g
# ---- music: dark D minor half-time, lifting to Bb/F at the heroes, D major-ish bloom at the end
chord_bed([
    (0.0, K['l5'], [D3 + 12, F3_ + 12, A3_ + 12], 800, 0.9),
    (K['l5'], K['l6'], [Bb2 + 12, D4, F4_], 900, 0.8),
    (K['l6'], K['l10'], [F3_ + 12, A3_ + 12, C5_ - 12, E4_], 1700, 0.9),
    (K['l10'], K['l13'], [Bb2 + 12, D4, F4_, A4_], 2100, 0.9),
    (K['l13'], DUR, [D3 + 12, F4_ + 1, A4_, E5_ - 12], 2600, 1.0),
])
sub_bass(K['l6'], K['l13'], D3 - 12, 0.16)
pulse(K['l6'] + 0.2, K['l13'] - 0.2, bpm=150, g=0.30)
# ---- sfx: the cursor's world
for c in [2.6, 16.2, 16.8, 17.4, 18.0, 18.7, 21.6, 25.3, 47.6]:
    put(sfx, tick(0.6), c, 0.2)
for i, n_ in enumerate([D5_, F5_, A5_, D5_ + 12]):          # toggles flip on (ascending)
    put(sfx, bell(n_, 0.9, 0.25, 0.9), 16.2 + i * 0.6 + 0.05, -0.3, 0.12)
for i in range(18):                                           # typing the url
    put(sfx, tick(0.25), 17.0 + i / 16, 0.3)
put(sfx, bell(A5_, 1.6, 0.6), 18.7, 0.3, 0.18)                # send
for c in [9.3, 9.75, 10.2, 10.6, 11.0]:                       # swipes
    put(sfx, swish(1.0), c - 0.02, -0.6, 0.22)
for c in [9.3 - 0.2 + i * 0.9 for i in range(3)]:            # countdown ticks
    put(sfx, pluck(A4_, 0.3, 0.06), c, 0, 0.12)
put(sfx, air(0.9, True), 13.3, 0, 0.26)                       # AIR 1: into the shatter
put(sfx, boom(0.5), 14.15, 0, 1.0); put(sfx, shards(0.35), 14.2, 0.2, 1.0)
for i, (t0, n_) in enumerate([(19.4, D5_), (23.0, F5_), (26.6, A5_)]):   # each hero lands
    put(sfx, bell(n_, 2.6, 1.0), t0 + 0.2, [-0.3, 0.3, 0][i], 0.2)
    put(sfx, bell(n_ - 12, 2.6, 1.2, 0.3), t0 + 0.25, 0, 0.12)
put(sfx, air(1.3, True), 31.4, 0, 0.28)                       # AIR 2: through the giant word
put(sfx, bell(D5_ + 12, 2.5, 1.1), 32.8, 0, 0.15)
for c0, c1 in [(27.1, 31.2), (34.6, 36.9), (38.4, 40.6)]:     # scroll-scrub whir
    n = int((c1 - c0) * SR); tt = np.arange(n) / SR
    y = (lp(rng.standard_normal(n), 900) * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * tt))) * np.sin(np.linspace(0, np.pi, n))
    put(sfx, y / (np.abs(y).max() + 1e-9), c0, 0.3, 0.06)
put(sfx, air(1.2, True), K['l13'] - 1.15, 0, 0.26)            # AIR 3: into the end card
put(sfx, boom(0.45), K['l13'] - 0.1, 0, 1.0)
put(sfx, bell(D5_, 3.5, 1.5), K['l13'], -0.2, 0.2); put(sfx, bell(A5_, 3.5, 1.5), K['l13'] + 0.06, 0.2, 0.16)
put(sfx, bell(F5_ + 1, 2.0, 0.8), 47.62, 0, 0.16)            # WhatsApp tap
# end fade and mix
fade = np.ones(N); fl = int(1.6 * SR); fade[int(DUR * SR) - fl:int(DUR * SR)] = np.linspace(1, 0, fl) ** 2; fade[int(DUR * SR):] = 0
mix = (mus * 0.55 + sfx) * fade[:, None]
mix = np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.6) * 0.8
mix = mix[:int(DUR * SR)]
for nm, buf in [('mix.wav', mix)]:
    with wave.open(os.path.join(H, nm), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((buf * 32767).astype('<i2').tobytes())
print(name, 'mix', DUR, 's')
