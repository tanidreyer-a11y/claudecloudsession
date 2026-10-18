# Original 120 bpm groove for DEMO-MUSIC (fictional app "Halyn"), made in code — no samples, no licensed music.
# Map: 0.5–2.4 heartbeat kick · 2.45 press (clap) · 2.6–15.4 groove (kick, clap on 2 & 4, hats, sub bass, pad, pluck)
# · 13.0–15.4 filter opens · 15.45 tape-stop into the record · 15.5–17.0 pad + crackle · 17.0 final hit, ring-out.
# usage: python3 -I music_beat.py out.wav
import sys, numpy as np, wave
SR = 48000; D = 20.0; N = int(SR * D); rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)
def t_(d): return np.arange(int(d * SR)) / SR
def put(sig, at, pan=0.0, g=1.0):
    i = int(at * SR); n = min(len(sig), N - i)
    if n <= 0: return
    L[i:i + n] += sig[:n] * g * (1 - pan) ** 0.5; R[i:i + n] += sig[:n] * g * (1 + pan) ** 0.5
def lp(x, fc):
    from scipy.signal import lfilter
    a = np.exp(-2 * np.pi * fc / SR); return lfilter([1 - a], [1, -a], x)
def kick(g=1.0):
    t = t_(0.45); f = 48 + 110 * np.exp(-t * 32); return np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * 1.6) * g
def clap():
    t = t_(0.25); x = rng.standard_normal(len(t)); env = np.exp(-t * 28) * (1 + 0.6 * ((t > 0.01) & (t < 0.02)) + 0.4 * ((t > 0.022) & (t < 0.03)))
    return (lp(x, 6000) - lp(x, 900)) * env * 0.9
def hat(open_=False):
    t = t_(0.18 if open_ else 0.05); x = rng.standard_normal(len(t)); return (x - lp(x, 7000)) * np.exp(-t * (18 if open_ else 90)) * 0.35
def note(f, d, kind="pad"):
    t = t_(d)
    if kind == "pad":
        y = sum(np.sin(2 * np.pi * f * m * t + rng.random()) / m for m in (1, 2, 3, 4)) * (1 - np.exp(-t * 3)) * np.exp(-np.maximum(0, t - d + 0.4) * 6)
    elif kind == "sub":
        y = np.sin(2 * np.pi * f * t) * (1 - np.exp(-t * 60)) * np.exp(-t * 1.2)
    else:  # pluck
        y = np.sign(np.sin(2 * np.pi * f * t)) * 0.4 * np.exp(-t * 9)
    return y
CH = [(220.0, [220, 261.63, 329.63]), (174.61, [174.61, 220, 261.63]), (261.63, [261.63, 329.63, 392]), (196.0, [196, 246.94, 293.66])]  # Am F C G
B = 0.5
for k in range(1, 5): put(kick(0.75), 0.5 * k)                     # heartbeat
put(clap(), 2.45, g=1.1); put(kick(1.0), 2.45)
for b in range(int((15.4 - 2.6) / B)):
    at = 2.6 + b * B
    put(kick(), at)
    if b % 2 == 1: put(clap(), at, pan=0.1)
    put(hat(), at + B / 2, pan=0.3); put(hat(b % 4 == 3), at + B / 4 * 3, pan=-0.3, g=0.7)
for bar in range(int((15.4 - 2.6) / 2.0) + 1):
    at = 2.6 + bar * 2.0; root, chord = CH[bar % 4]
    put(note(root / 4, 2.0, "sub"), at, g=0.55)
    pad = sum(note(f, 2.05, "pad") for f in chord); fc = 900 + 3800 * max(0.0, min(1.0, (at - 12.6) / 2.4))
    put(lp(pad, fc) * 0.16, at, pan=0.0)
    for s in range(8):
        if (s + bar) % 3 != 1: put(lp(note(chord[s % 3] * 2, 0.25, "pluck"), 2600) * 0.12, at + s * 0.25, pan=0.4 if s % 2 else -0.4)
# 15.45 tape stop: the last bar pitched down fast
t = t_(0.5); stop = np.sin(2 * np.pi * np.cumsum(220 * (1 - t / 0.5) ** 2) / SR) * (1 - t / 0.5) * 0.4; put(stop, 15.45)
# 15.5–17.0 pad + vinyl crackle
put(lp(sum(note(f, 4.6, "pad") for f in [220, 261.63, 329.63]), 1400) * 0.12, 15.5)
cr = np.zeros(int(4.5 * SR)); idx = rng.integers(0, len(cr), 900); cr[idx] = rng.standard_normal(900) * 0.5; put(lp(cr, 5000), 15.5, g=0.5)
# 17.0 final hit
put(kick(1.1), 17.0); put(clap(), 17.0); put(lp(sum(note(f, 3.0, "pad") for f in [220, 261.63, 329.63, 440]), 3000) * 0.22, 17.0)
y = np.stack([L, R], 1); y = np.tanh(y / (np.abs(y).max() + 1e-9) * 1.3) * 0.85
fade = np.ones(N); fade[-int(0.8 * SR):] = np.linspace(1, 0, int(0.8 * SR)); y *= fade[:, None]
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype(np.int16).tobytes())
print("wrote", sys.argv[1])
