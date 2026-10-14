"""OBSIDIAN — "Made by Claude" product film (src/Film10.tsx, OBS-KOVA, 33 s, 9:16). Same kit as build_scratch.py: numpy
bed + Kenney UI sounds (CC0). No voice-over yet: when the owner sends it, it goes on top and the bed ducks under it.
python3 audio/build_kova.py -> audio/mix_kova.wav"""
import os, wave
import numpy as np
from scipy.signal import lfilter

SR = 48000
HD = os.path.dirname(os.path.abspath(__file__))
DUR = 33.0
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
import subprocess
FFB = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
_S = {}
def smp(name):
    """a recorded UI sound from audio/sfx (Kenney Interface Sounds, CC0), mono at SR, peak 1."""
    if name not in _S:
        raw = subprocess.run([FFB, '-v', 'error', '-i', os.path.join(HD, 'sfx', name + '.ogg'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
        y = np.frombuffer(raw, np.float32).astype(np.float64); _S[name] = y / (np.abs(y).max() + 1e-9)
    return _S[name]
TYPE = ['tick_001', 'tick_002', 'tick_004', 'click_005']
def keys(a, b, n, g=0.06):
    for i in range(n):
        t = a + (b - a) * i / max(1, n - 1) + (h(i, 7) - 0.5) * 0.02
        put(sfx, smp(TYPE[int(h(i, 3) * 4) % 4]), t, (h(i, 4) - 0.5) * 0.4, g * 0.9 * (0.7 + 0.6 * h(i, 9)))
def click(t, n_=A5, g=1.0):
    put(sfx, smp('click_002'), t, 0.3, 0.32 * g); put(sfx, pluck(n_, 0.4, 0.09), t + 0.01, 0.3, 0.035 * g)
def pop(t, n_, pan=0.0, g=1.0):
    put(sfx, smp(['select_001', 'select_002', 'select_004', 'select_006'][int(h(n_, int(t * 7)) * 4) % 4]), t, pan, 0.16 * g); put(sfx, glass(n_, 1), t, pan, 0.025 * g)
def ui(t, name, g=0.2, pan=0.0):
    put(sfx, smp(name), t, pan, g)
def word(t, n_, g=1.0):
    put(sfx, bell(n_, 2.0, 0.8, 0.3), t, 0, 0.055 * g)



# ---- bed: A minor, quiet; a pulse only in the product beats and the "how it was made" run
chord_bed([
    (0.0, 2.2, [A2, E3, A3, C4], 700, 0.45),
    (2.2, 6.8, [F2, C3, A3, C4, E4], 1800, 0.6),
    (6.8, 9.8, [D2, A2, F3, A3, C4], 2000, 0.62),
    (9.8, 13.0, [G2, D3, B3, D4], 2200, 0.66),
    (13.0, 15.0, [A2, E3, A3], 600, 0.4),
    (15.0, 17.6, [F2, C3, A3, E4], 1200, 0.5),
    (17.6, 20.6, [C3, G3, E4, G4], 2200, 0.62),
    (20.6, 28.4, [A2, E3, G3, C4, E4], 2400, 0.72),
    (28.4, 30.4, [F2, C3, A3, C4, E4], 2600, 0.7),
    (30.4, 33.0, [C3, G3, E4, G4, D5], 2600, 0.75),
])
BPM = 112
pulse(3.8, 12.3, bpm=BPM, g=0.2, hats=True)
pulse(17.6, 20.6, bpm=BPM, g=0.14, hats=True)
pulse(20.6, 28.3, bpm=BPM, g=0.3, hats=True, claps=True)
bassline(20.6, 28.3, [A2 - 12, A2 - 12, C2 + 12, C2 + 12, F2, F2, G2, G2], bpm=BPM, g=0.1)

# hook: one tick per letter, a boom when the question lands
for i in range(16): put(sfx, smp(TYPE[i % 4]), 0.12 + i * 0.05, (i - 8) / 10, 0.07)
put(sfx, boom(0.3, 40), 0.12, 0, 1.0); put(sfx, glass(A5, 1), 1.6, 0.3, 0.05)
put(sfx, air(0.55, True), 1.7, 0, 0.1); ui(2.2, 'maximize_003', 0.14)
# Meet Kova: the shape grows and turns, the word wipes in
put(sfx, glide(A4, E5, 0.5, 0.03), 2.3, 0); pop(2.75, E5 + 12, 0, 0.8); put(sfx, bell(A5, 2.0, 0.9, 0.3), 3.0, 0, 0.06)
ui(3.6, 'minimize_003', 0.12)
# invoice: words, rows, count-up, the click, sent
for i in range(6): put(sfx, smp('tick_001'), 3.95 + i * 0.11, -0.2, 0.04)
for i in range(3): pop(4.35 + i * 0.15, [C6, E6 - 12, G5 + 12][i], 0.3, 0.55)
for i in range(10): put(sfx, smp('tick_004'), 4.6 + i * 0.06, 0.4, 0.025)
click(5.5, E6 - 12, 1.1); ui(5.65, 'confirmation_001', 0.2); put(sfx, bell(E5, 2.2, 1.0, 0.35), 5.7, 0, 0.06)
put(sfx, air(0.7, False), 6.05, 0, 0.09)
# reminders drop into the stack, paid chimes
for i in range(6): put(sfx, smp('tick_001'), 6.85 + i * 0.11, -0.2, 0.035)
for i, t_ in enumerate([7.1, 7.55, 8.0]): ui(t_, 'drop_002' if i % 2 else 'drop_001', 0.16, (i - 1) * 0.3)
ui(8.05, 'confirmation_002', 0.2); put(sfx, bell(A5, 2.4, 1.0, 0.4), 8.08, 0, 0.07); put(sfx, bell(E6 - 12, 2.4, 1.0, 0.4), 8.14, 0.2, 0.05)
ui(9.2, 'maximize_006', 0.12)
# chart: count-up ticks, bars pop, the dive into the bar
for i in range(16): put(sfx, smp('tick_004'), 10.2 + i * 0.07, 0.3, 0.03)
for i in range(7): pop(10.45 + i * 0.07, [A4, C5, E5, G5, A5, C6, E6 - 12][i], -0.6 + i * 0.2, 0.45)
put(sfx, air(0.8, True), 12.25, 0, 0.14); put(sfx, swell(A3, 0.75, 0.1), 12.25, 0)
put(sfx, boom(0.45, 36), 13.0, 0, 1.0)
# the turn
for i, t_ in enumerate([13.1, 13.34, 13.58, 13.82]): put(sfx, snap(0.3), t_, (i - 1.5) * 0.2, 0.3)
# rewind, freeze, the scan
put(sfx, glide(E6, A4, 0.55, 0.03), 15.0, 0); ui(15.05, 'scroll_003', 0.16); ui(15.55, 'switch_002', 0.2)
put(sfx, air(1.1, True), 15.95, 0, 0.07)
for i in range(18): put(sfx, smp('tick_004'), 15.95 + i * 0.06, -0.8 + i * 0.09, 0.03)
put(sfx, bell(A5, 2.6, 1.1, 0.4), 17.05, 0, 0.07)
# Claude writes the code
ui(17.6, 'minimize_006', 0.14)
keys(18.25, 20.4, 60, 0.045)
# kinetic type / shapes / 3D / camera / all code
for i in range(18): put(sfx, smp(TYPE[i % 4]), 20.65 + i * 0.035, (h(i, 2) - 0.5), 0.05)
pop(22.0, A5, 0, 0.8); pop(22.3, C6, 0, 0.8); pop(22.62, E6 - 12, 0, 0.8); put(sfx, glass(A5 + 12, 1), 22.95, 0, 0.05)
put(sfx, boom(0.4, 38), 23.6, 0, 1.0); put(sfx, swell(E4, 0.8, 0.08), 23.7, 0)
put(sfx, air(0.5, True), 24.6, 0, 0.12)
put(sfx, boom(0.35, 42), 24.95, 0, 1.0); put(sfx, glide(A4, A5, 1.6, 0.025), 25.1, 0)
ui(26.8, 'minimize_003', 0.14); keys(26.85, 28.0, 26, 0.03)
put(sfx, bell(E5, 2.0, 0.9, 0.3), 27.15, 0, 0.06)
# Kova end card, Made with Claude, OBSIDIAN
put(sfx, air(0.5, True), 27.9, 0, 0.08); ui(28.4, 'maximize_003', 0.12); put(sfx, bell(C6, 2.4, 1.0, 0.4), 28.55, 0, 0.06)
put(sfx, boom(0.4, 34), 30.45, 0, 1.0); ui(30.6, 'confirmation_001', 0.12)
for i, n_ in enumerate([C5, G5, E6 - 12, G5 + 12]): put(sfx, bell(n_, 3.2, 1.4), 31.1 + i * 0.05, -0.3 + i * 0.2, 0.08)

fade = np.ones(N); fl = int(1.2 * SR); fade[-fl:] = np.linspace(1, 0, fl) ** 2
mix = (mus * 0.75 + sfx * 0.95) * fade[:, None]
mix /= max(1.0, np.abs(mix).max() / 0.95)
out = (mix * 32767).astype(np.int16)
with wave.open(os.path.join(HD, 'mix_kova.wav'), 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(out.tobytes())
print('mix_kova.wav', out.shape)
