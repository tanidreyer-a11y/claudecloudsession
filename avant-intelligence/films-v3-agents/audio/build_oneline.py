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
DUR = 25.5
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


D3, E3, Fs3, G3, A3, B3, Cs4, D4, E4, Fs4, G4, A4, B4, Cs5, D5, E5, Fs5, G5, A5, B5, Cs6, D6, E6, Fs6, A6 = 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 76, 78, 79, 81, 83, 85, 86, 88, 90, 93
PENT = [D5, E5, Fs5, A5, B5, D6, E6, Fs6, A6]
def hsh(i, k=0):
    x = np.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - np.floor(x)
def glass(n_, g=1.0):   # tiny glassy tick-note for each landing pixel
    n = int(0.35 * SR); tt = np.arange(n) / SR; f = NOTE(n_)
    y = (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 30)) * np.exp(-tt * 13)
    return y * env(n, 0.001) * g

chord_bed([(0.0, 6.1, [B3 - 12, Fs3, D4, A4], 900, 0.75), (6.1, 12.6, [D3, A3, Fs4, A4, E5], 2600, 0.9),
           (12.6, 19.5, [G3, D4, Fs4, A4, B4], 1800, 0.85), (19.5, 25.5, [D3, A3, Fs4, A4, E5], 2400, 1.0)])
sub_bass(13.4, 19.5, D3 - 24, 0.1); pulse(13.6, 19.0, bpm=100, g=0.18, hats=True)
put(sfx, glide(D4, A4, 1.1, 0.05), 0.2, 0)
for j, (t, n_) in enumerate([(1.3, B4), (2.5, D5), (3.7, Fs5)]): put(sfx, bell(n_, 1.8, 0.7), t + 0.05, -0.2 + j * 0.2, 0.09)
put(sfx, bell(B4, 2.4, 1.0), 4.95, 0, 0.1); put(sfx, bell(Fs5, 2.4, 1.0), 5.0, 0.2, 0.07)
for i in range(0, 64, 2):
    t = 1.2 + (i / 64) * 4.8 + hsh(i, 1) * 0.3
    put(sfx, glass([B4, D5, E5, Fs5, A5][int(hsh(i, 9) * 5)], 1), t, (hsh(i, 2) - 0.5) * 1.4, 0.03)
put(sfx, air(0.9, True), 6.1, 0, 0.11)                              # AIR 1: flip to paper
put(sfx, bell(D6, 3.0, 1.3, 0.9), 7.0, 0, 0.12); put(sfx, bell(A5, 3.0, 1.3), 7.04, 0.2, 0.08)
for j in range(4): put(sfx, tick(0.3), 7.25 + j * 0.06, [-0.6, 0.6, -0.6, 0.6][j])
put(sfx, glide(D4, A4, 1.3, 0.05), 8.0, -0.2)
put(sfx, bell(Fs6, 1.4, 0.5), 9.05, 0.2, 0.08)
put(sfx, bell(D5, 3.0, 1.2), 10.62, -0.2, 0.12); put(sfx, bell(Fs5, 3.0, 1.2), 10.66, 0.2, 0.1); put(sfx, bell(A5, 3.0, 1.2), 10.72, 0, 0.07)
put(sfx, air(0.8, True), 12.6, 0, 0.11); put(sfx, boom(0.25), 13.4, 0, 1.0)  # AIR 2: back to dark
for j, n_ in enumerate([Fs5, A5, B5, D6]): put(sfx, pluck(n_, 0.5, 0.12), 13.6 + j * 0.12, -0.5 + j * 0.33, 0.07)
for i in range(4):
    for k in range(12): put(sfx, tick(0.1), 14.6 + i * 0.15 + 2.0 * (1 - (1 - k / 12) ** 2.2), -0.5 + i * 0.33)
put(sfx, swell(D5, 1.4, 0.12), 17.6, 0)
put(sfx, bell(A5, 2.0, 0.8), 19.0, 0.3, 0.1)
put(sfx, glide(A4, D5, 1.0, 0.05), 20.0, 0)
put(sfx, boom(0.45), 20.9, 0, 1.0)
put(sfx, bell(D5, 4.0, 1.7), 20.92, -0.2, 0.17); put(sfx, bell(A5, 4.0, 1.7), 20.98, 0.2, 0.13); put(sfx, bell(Fs5, 4.0, 1.7), 21.06, 0, 0.09)
put(sfx, pluck(A5, 0.5, 0.12), 22.62, 0, 0.06); put(sfx, tick(0.3), 23.22, 0)

fade = np.ones(N); fl = int(2.0 * SR); fade[int(DUR * SR) - fl:int(DUR * SR)] = np.linspace(1, 0, fl) ** 2; fade[int(DUR * SR):] = 0
mix = (mus * 0.55 + sfx) * fade[:, None]
mix = np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.6) * 0.8
mix = mix[:int(DUR * SR)]
with wave.open(os.path.join(H, 'mix_oneline.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('mix_oneline.wav', DUR, 's')
