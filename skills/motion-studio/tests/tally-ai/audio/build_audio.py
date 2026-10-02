"""Sparse-minimal sound for the Tally AI test (recipe sound slot "sparse-minimal"): key clicks, one tone per swap,
silence as a sound. Self-generated (numpy) — no third-party audio. Reads src/timeline.json (same keys as the picture).
UI tones are notes of one chord per section (A minor → C major at the hero frame). ≤ 3 air moves in the whole film."""
import json, os, wave
import numpy as np
SR = 48000
H = os.path.dirname(os.path.abspath(__file__))
T = json.load(open(os.path.join(H, '..', 'src', 'timeline.json')))
N = int(SR * T['end']) + SR // 2
L, R = np.zeros(N), np.zeros(N)
rng = np.random.default_rng(7)
def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i >= N: return
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i:j] += sig[:j - i] * gain * l * 1.414; R[i:j] += sig[:j - i] * gain * r * 1.414
def env(n, a=0.004, d=0.2):
    t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
def tone(f, dur, d=0.25, harm=(1, .35, .12)):
    n = int(dur * SR); t = np.arange(n) / SR
    return sum(h * np.sin(2 * np.pi * f * (k + 1) * t) for k, h in enumerate(harm)) * env(n, .003, d)
def click(dur=.025, hp=3000):
    n = int(dur * SR); x = rng.standard_normal(n) * env(n, .0005, .006)
    return np.diff(np.concatenate([[0], x]))  # crude high-pass
def thump(f0=70, dur=.35):
    n = int(dur * SR); t = np.arange(n) / SR; f = f0 * (1 + 1.5 * np.exp(-t / .03))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .09)
def air(dur=.7, rise=True):
    n = int(dur * SR); x = rng.standard_normal(n); k = np.linspace(0, 1, n)
    shape = (k if rise else 1 - k) ** 2 * np.sin(np.pi * k) ** .5
    y = np.convolve(x, np.ones(24) / 24, 'same') * shape; return y
def pad(freqs, dur, a=.6, r=1.2):
    n = int(dur * SR); t = np.arange(n) / SR
    e = np.minimum(1, t / a) * np.minimum(1, (dur - t) / r).clip(0)
    return sum(np.sin(2 * np.pi * f * t + i) + .3 * np.sin(2 * np.pi * f * 2.003 * t) for i, f in enumerate(freqs)) * e / len(freqs)
A = {'A3': 220, 'C4': 261.63, 'E4': 329.63, 'G4': 392, 'A4': 440, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99, 'A5': 880}
# bed: very quiet A-minor pad until the hero, silence under the word roll for contrast? no — low pad keeps continuity
place(pad([A['A3'], A['C4'], A['E4']], T['cut2'] + .4), 0, .035)
place(pad([A['A3'] / 2, A['E4']], T['cut4'] - T['cut2'] + .5), T['cut2'] - .2, .03)
# S1 typing: one click per character at 13 cps, slight pitch/pan variation
for i in range(len("Reconcile March")):
    place(click(), T['type'] + i / 13 + rng.uniform(-.008, .008), .25, rng.uniform(-.25, .25))
place(tone(A['E5'], .6, .18), T['send'], .22, .1)                 # send: a note, not a whoosh
place(air(.45, True), T['cut1'] - .42, .10, -.2)                    # air move 1/3 into the first cut
place(thump(), T['cut1'], .55)
# S2 chips land (ascending), matches resolve as chord notes; the warning one is lower
for k, n in zip(['chip1', 'chip2', 'chip3'], ['A4', 'C5', 'E5']):
    place(tone(A[n], .4, .09, (1, .2)), T[k], .14, -.3)
for k, n, g in [('match1', 'E5', .2), ('match2', 'B4', .16), ('match3', 'A5', .2)]:
    place(tone(A[n], .9, .3), T[k], g, .3)
place(thump(60, .3), T['cut2'], .45)
# S3 word roll: one tone per swap, rising
for k, n in zip(['roll0', 'roll1', 'roll2'], ['A4', 'C5', 'E5']):
    place(tone(A[n], 1.2, .45, (1, .5, .2, .08)), T[k] + .02, .22)
    place(click(.04), T[k] - .05, .12)
place(air(.5, True), T['cut3'] - .48, .09, .2)                      # air move 2/3
place(thump(), T['cut3'], .5)
# S4 rows tick in, the gap gets a low two-note "hm", the request a soft resolve
for i in range(4):
    place(tone(A['A4'] * (1 + i * .125), .25, .06, (1,)), T['row'] + i * 5 / 30, .1, -.2 + i * .13)
place(tone(A['C4'], .5, .2) + 0, T['flag'], .2, .2); place(tone(A['B4'] / 2, .5, .2), T['flag'] + .12, .16, .2)
place(tone(A['G5'], .8, .3), T['request'], .16, .3); place(tone(A['C5'], .8, .3), T['request'] + .07, .12, .3)
# S5 hero: drop to near-silence for 0.25 s, then a C-major bloom (the only big moment)
place(air(.6, True), T['cut4'] - .55, .11)                          # air move 3/3
place(thump(55, .6), T['cut4'], .6)
place(pad([A['C4'], A['E4'], A['G4'], A['C5']], T['cut5'] - T['cut4'] + 1.2, .25, 1.0), T['hero'] + .2, .16)
# S6 logo: dot pop + resolving chord; CTA tick
place(thump(80, .25), T['cut5'], .4)
place(tone(A['C5'], 1.6, .7) + 0, T['logo'] + .2, .2); place(tone(A['G5'], 1.6, .7), T['logo'] + .26, .12, .2)
place(pad([A['C4'], A['G4'], A['E5']], T['end'] - T['logo'], .4, 1.4), T['logo'], .08)
place(click(.03), T['cta'] + .1, .2); place(tone(A['E5'], .5, .15), T['cta'] + .12, .12)
mix = np.stack([L, R], 1)
mix /= max(1e-9, np.abs(mix).max()) / .7
with wave.open(os.path.join(H, 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('mix.wav', round(N / SR, 2), 's')
