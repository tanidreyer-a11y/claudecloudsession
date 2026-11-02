"""v3: Music bed + musical SFX for the OBSIDIAN ad (kit shared with the Avant films), cued from the same timeline JSON as the picture.
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
DUR = K['dur']
N = int(SR * (DUR + 0.5))
rng = np.random.default_rng(23)
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



def swell(note, dur, g=1.0):
    """tonal rise into a light: stacked partials of one note, getting brighter and louder (no noise)."""
    n = int(dur * SR); tt = np.arange(n) / SR; k = tt / dur; y = np.zeros(n)
    for h, a in [(1, 1), (2, .5), (3, .3), (4, .2), (6, .12)]:
        y += np.sin(2 * np.pi * NOTE(note) * h * tt * (1 + 0.004 * k)) * a * k ** (0.6 + h * 0.5)
    return y * k ** 1.8 * env(n, 0.05, None, 0.01) / 2.2 * g

def glide(n0, n1, dur, g=1.0):
    n = int(dur * SR); k = np.linspace(0, 1, n); f = NOTE(n0) * (NOTE(n1) / NOTE(n0)) ** (k * k * (3 - 2 * k))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    return y * np.sin(np.pi * k) ** 1.5 * g

def swish(g=1.0):  # finger swipe on glass: short, soft
    n = int(0.22 * SR); x = rng.standard_normal(n); y = lp(x, 3000) - lp(x, 700)
    return y * np.sin(np.linspace(0, np.pi, n)) ** 2 / (np.abs(y).max() + 1e-9) * g

D3, E3, F3, G3, A3, Bb3, C4, D4, E4, F4, Fs4, G4, A4, Bb4, C5, D5, E5, F5, Fs5, G5, A5, B5, C6, D6 = 50, 52, 53, 55, 57, 58, 60, 62, 64, 65, 66, 67, 69, 70, 72, 74, 76, 77, 78, 79, 81, 83, 84, 86
T = K
# ---- music: each site has its own chord colour, matched to its palette
chord_bed([
    (0.0, T['north'] - 0.4, [D3, A3, F4, C5 - 12], 700, 0.8),            # intro: dark, Dm7
    (T['north'] - 0.4, T['surgery'] - 0.6, [D3, A3, Fs4, 61, E5 - 12], 1900, 0.9),  # Northlight: night sky, Dmaj9 (cool, open)
    (T['surgery'] - 0.6, T['estate'] - 0.6, [F3, C4, E4, G4, A4], 2600, 0.8),   # Atelier Vale: cream, clinical, Fmaj9 (bright, clean)
    (T['estate'] - 0.6, T['cigars'] - 0.6, [Bb3 - 12, F3, A3, D4, E4], 1300, 0.95),  # Estates: warm dark, Bbmaj9#11 (low, wood)
    (T['cigars'] - 0.6, T['toEnd'], [G3 - 12, D4 - 12, Bb3, D4, F4, A4], 1500, 0.9),  # Cigars + phone: ember, Gm9
    (T['toEnd'], T['dur'], [D3, A3, Fs4, A4, E5], 2400, 1.0),            # end: Dmaj9 bloom
])
sub_bass(T['north'], T['estateExit'] + 1, D3 - 12, 0.12)
sub_bass(T['cigars'], T['toEnd'], G3 - 24, 0.12)
pulse(T['surgery'] + 0.3, T['estateExit'] - 0.2, bpm=84, g=0.22, hats=True)   # quiet heartbeat once the story is moving
pulse(T['cigars'] + 0.5, T['toEnd'] - 0.3, bpm=84, g=0.26, hats=True)
# ---- intro: the dot, the line, two text swaps
put(sfx, bell(A5, 2.0, 0.8), T['dot'] + 0.1, 0, 0.16)
put(sfx, pluck(D5, 0.5, 0.1), T['line1'], -0.2, 0.10)
put(sfx, pluck(F5, 0.5, 0.1), T['line2'], 0.2, 0.10)
put(sfx, glide(A4, D5, 0.6, 0.08), T['toNorth'] - 0.1, 0)              # dot glides to Northlight
# ---- each chapter: iris opens (bloom), dive into its light (tonal swell), light condenses into a dot (bell)
chapters = [('north', 'northExit', 'surgery', A5, D5, Fs5),
            ('surgery', 'surgeryExit', 'estate', C6, F5, A5),
            ('estate', 'estateExit', 'cigars', A5, Bb4, D5)]
for i, (a, x, nxt, light, root, third) in enumerate(chapters):
    put(sfx, bell(root, 3.0, 1.2), T[a] + 0.1, [-0.25, 0.25, 0][i], 0.17)        # iris bloom
    put(sfx, bell(root - 12, 3.0, 1.4, 0.2), T[a] + 0.12, 0, 0.12)
    put(sfx, bell(third, 2.2, 0.9), T[a] + 0.45, -0.1, 0.07)
    put(sfx, swell(light - 12, 1.05, 0.22), T[x] - 0.02, 0)                        # dive into the light
    put(sfx, boom(0.28), T[x] + 0.98, 0, 1.0)                                      # the light fills the screen
    put(sfx, bell(light, 2.4, 0.9, 0.9), T[x] + 1.0, 0, 0.16)                      # ...and condenses into a dot
put(sfx, air(1.0, True), T['northExit'], 0, 0.14)                                # AIR 1 (under the first dive)
put(sfx, air(1.0, True), T['estateExit'], 0, 0.14)                               # AIR 2 (last site dive)
put(sfx, bell(G4 + 12, 3.0, 1.2), T['cigars'] + 0.1, 0.2, 0.17)                 # cigars window
put(sfx, bell(D5, 2.4, 1.0), T['cigars'] + 0.45, -0.1, 0.07)
# ---- window becomes a phone
put(sfx, glide(D4, G4 + 12, 1.0, 0.10), T['toPhone'], 0)
put(sfx, bell(Bb4 + 12, 2.0, 0.7), T['phone'] - 0.02, 0, 0.13)
for j, a in enumerate([T['phone'] + 1.0, T['phone'] + 2.6, T['phone'] + 4.2]):
    put(sfx, tick(0.35), a - 0.14, 0.4)                                         # thumb touches glass
    put(sfx, swish(1.0), a, 0.3, 0.14)
    put(sfx, pluck([D5, F5, A5][j], 0.5, 0.12), a + 0.45, 0.2, 0.08)           # page settles on a chord note
# ---- collapse to the dot, OBSIDIAN assembles
put(sfx, air(1.0, True), T['toEnd'], 0, 0.16)                                   # AIR 3
put(sfx, boom(0.45), T['end'] + 0.05, 0, 1.0)
put(sfx, bell(D5, 4.0, 1.6), T['end'] + 0.1, -0.2, 0.18); put(sfx, bell(A5, 4.0, 1.6), T['end'] + 0.16, 0.2, 0.14); put(sfx, bell(Fs5, 4.0, 1.6), T['end'] + 0.26, 0, 0.08)
put(sfx, pluck(E5, 0.6, 0.15), T['tag'] + 0.1, 0, 0.08)
put(sfx, bell(A5, 1.6, 0.6), T['wa'] + 0.1, 0, 0.12)
DUR = T['dur']
fade = np.ones(N); fl = int(2.2 * SR); fade[int(DUR * SR) - fl:int(DUR * SR)] = np.linspace(1, 0, fl) ** 2; fade[int(DUR * SR):] = 0
mix = (mus * 0.55 + sfx) * fade[:, None]
mix = np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.6) * 0.8
mix = mix[:int(DUR * SR)]
with wave.open(os.path.join(H, 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('obsidian v3 mix', DUR, 's')
