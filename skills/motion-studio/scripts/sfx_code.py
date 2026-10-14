# Sound effects made in code + a cue-sheet mixer that keeps the voice on top (Level 5 / Motion-as-Code method).
# No samples needed (our Kenney CC0 set in obsidian-ad/brand-film/audio/sfx can be mixed in by name too).
#
#   python3 -I sfx_code.py demo out_dir/                      → one wav per effect, to audition
#   python3 -I sfx_code.py auto timing.json cues.json         → a first cue sheet from the voice-over timing (edit it!)
#   python3 -I sfx_code.py mix cues.json out.wav [--voice vo.wav] [--dur 33] [--lufs -14] [--duck 7]
#
# cues.json: [{"t": 2.72, "sfx": "whoosh", "db": -6, "pan": 0.0, "args": {"dur": 0.5}}, ...]
#   sfx = any function below (whoosh, blip, hit808, riser, drop, pop, glitch, typing, stamp, ping, buzz, lock, punch,
#         impact, tick) or "kenney:click_002" for a recorded Kenney sound.
# Voice rules (Level 5): voice ≈ 8 dB above the effects (the effects bus ducks up to --duck dB while the voice
# talks); master −14 LUFS for social feeds (−16 for the website), true peak ≤ −1 dBTP. Two-pass FFmpeg loudnorm.
import json, os, subprocess, sys, shutil, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(11)
FF = shutil.which("ffmpeg") or "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
KENNEY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "obsidian-ad", "brand-film", "audio", "sfx")

def _t(d): return np.arange(int(d * SR)) / SR
def _lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc = (1 - a) * v + a * acc; y[i] = acc
    return y
def _lpv(x, fc):  # vectorised one-pole low-pass via scipy if present
    try:
        from scipy.signal import lfilter
        a = np.exp(-2 * np.pi * fc / SR); return lfilter([1 - a], [1, -a], x)
    except Exception: return _lp(x, fc)
def _env(n, a=0.004, r=0.02):
    e = np.ones(n); ka = max(1, int(a * SR)); kr = max(1, min(n, int(r * SR)))
    e[:ka] = np.linspace(0, 1, ka); e[-kr:] *= np.linspace(1, 0, kr); return e
def _norm(y, peak=0.9): return y / (np.abs(y).max() + 1e-9) * peak
def _sweep(f0, f1, d, curve=2.0):
    k = np.linspace(0, 1, int(d * SR)) ** curve; f = f0 * (f1 / f0) ** k
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

# ---------------------------------------------------------------- the effects (all mono, peak ≈ 0.9)
def whoosh(dur=0.5, bright=1.0):
    """every scene cut: band-passed noise that sweeps up then away."""
    n = int(dur * SR); x = rng.standard_normal(n); k = np.linspace(0, 1, n)
    lo = _lpv(x, 600 + 3500 * bright * np.sin(np.pi * k).mean()); hi = x - _lpv(x, 1800)
    y = lo * (1 - k) + hi * k * 0.7
    return _norm(y * np.sin(np.pi * k) ** 1.6)
def blip(f=1800, dur=0.07):
    """keywords: a short pitched blip."""
    t = _t(dur); y = np.sin(2 * np.pi * f * t * (1 + 0.35 * np.exp(-t * 60))) * np.exp(-t * 45)
    return _norm(y * _env(len(t), 0.001, 0.01), 0.7)
def hit808(f0=50, dur=1.2, drive=1.6):
    """big words: an 808 — sine with a pitch drop, saturated."""
    t = _t(dur); f = f0 + f0 * 2.2 * np.exp(-t * 18)
    y = np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6) * drive)
    click = rng.standard_normal(len(t)) * np.exp(-t * 600) * 0.25
    return _norm((y + click) * _env(len(t), 0.001, 0.05))
def riser(dur=2.0):
    """before the biggest line: noise + a rising tone, crescendo, cut dead at the end."""
    t = _t(dur); k = t / dur; x = rng.standard_normal(len(t))
    noise = (x - _lpv(x, 400 + 6000 * k.mean())) * k ** 2.2
    tone = _sweep(110, 880, dur, 1.6) * k ** 2.6 * 0.5
    return _norm((noise * 0.6 + tone) * _env(len(t), 0.05, 0.005))
def drop(dur=2.4):
    """the drop: sub falling 80→30 Hz + a crash."""
    t = _t(dur); sub = _sweep(80, 30, dur, 0.7) * np.exp(-t * 1.2)
    x = rng.standard_normal(len(t)); crash = (x - _lpv(x, 3000)) * np.exp(-t * 2.2) * 0.5
    return _norm(np.tanh((sub * 1.4 + crash)) * _env(len(t), 0.002, 0.2))
def pop(f=900):
    """UI clicks and cards: a bubbly pop."""
    t = _t(0.12); y = np.sin(2 * np.pi * np.cumsum(f * (1 + 1.5 * np.exp(-t * 70))) / SR) * np.exp(-t * 38)
    return _norm(y * _env(len(t), 0.0008, 0.01), 0.8)
def glitch(dur=0.28):
    """transitions: stuttered, bit-crushed bursts."""
    n = int(dur * SR); y = np.zeros(n); i = 0
    while i < n:
        seg = int(SR * (0.012 + 0.03 * rng.random())); f = 200 + 2400 * rng.random()
        s = np.sign(np.sin(2 * np.pi * f * np.arange(seg) / SR)) * (rng.random() > 0.25)
        s = np.round(s * 4) / 4 + rng.standard_normal(seg) * 0.3
        y[i:i + seg] = s[: n - i]; i += seg + int(SR * 0.006 * rng.random())
    return _norm(y * _env(n, 0.001, 0.02), 0.7)
def typing(dur=1.0, rate=14):
    """terminal / comment box: key clicks at ~rate per second."""
    n = int(dur * SR); y = np.zeros(n); t = 0.0
    while t < dur:
        k = int(t * SR); m = int(0.018 * SR); tt = np.arange(m) / SR
        c = (np.sin(2 * np.pi * (2500 + 1500 * rng.random()) * tt) * np.exp(-tt * 350) + rng.standard_normal(m) * np.exp(-tt * 900) * 0.4)
        y[k:k + m] += c[: max(0, n - k)] * (0.6 + 0.4 * rng.random()); t += (1 / rate) * (0.6 + 0.8 * rng.random())
    return _norm(y, 0.7)
def stamp():
    """something lands: low thump + paper slap."""
    t = _t(0.35); thump = np.sin(2 * np.pi * np.cumsum(120 * (1 + np.exp(-t * 40))) / SR) * np.exp(-t * 14)
    x = rng.standard_normal(len(t)); slap = (_lpv(x, 4000) - _lpv(x, 800)) * np.exp(-t * 55)
    return _norm(thump + slap * 0.8)
def ping(f=1320, dur=1.2):
    """radar / lock moments: a clean ping with an echo."""
    t = _t(dur); y = np.sin(2 * np.pi * f * t) * np.exp(-t * 5)
    d = int(0.16 * SR); y[d:] += y[:-d] * 0.35
    return _norm(y * _env(len(t), 0.001, 0.05), 0.7)
def buzz(dur=0.4, f=110):
    """errors / 'manual': a square buzz with tremolo."""
    t = _t(dur); y = np.sign(np.sin(2 * np.pi * f * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 18 * t))
    return _norm(_lpv(y, 2200) * _env(len(t), 0.003, 0.04), 0.6)
def lock():
    """lock-on brackets: two rising blips."""
    a = blip(1400, 0.06); b = blip(2100, 0.07); g = np.zeros(int(0.05 * SR))
    return np.concatenate([a, g, b])
def punch():
    """manga hit: kick + crack."""
    t = _t(0.4); kick = np.sin(2 * np.pi * np.cumsum(55 + 160 * np.exp(-t * 30)) / SR) * np.exp(-t * 9)
    x = rng.standard_normal(len(t)); crack = (x - _lpv(x, 1500)) * np.exp(-t * 70)
    return _norm(np.tanh((kick + crack * 0.7) * 1.5))
def impact():
    """a heavy hit: 808 + crash tail."""
    a = hit808(42, 1.6, 2.0); t = _t(1.6); x = rng.standard_normal(len(t)); tail = (x - _lpv(x, 2500)) * np.exp(-t * 3) * 0.35
    return _norm(a + tail)
def tick(f=3200):
    t = _t(0.02); return _norm(np.sin(2 * np.pi * f * t) * np.exp(-t * 300) + rng.standard_normal(len(t)) * np.exp(-t * 800) * 0.3, 0.6)

FX = {k: v for k, v in dict(globals()).items() if callable(v) and not k.startswith("_") and k not in ("load", "mix", "auto", "main", "kenney", "write_wav")}

def kenney(name):
    raw = subprocess.run([FF, "-v", "error", "-i", os.path.join(KENNEY, name + ".ogg"), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    y = np.frombuffer(raw, np.float32).astype(np.float64); return _norm(y, 0.9)

def load(path):
    raw = subprocess.run([FF, "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64).reshape(-1, 2)

def write_wav(path, y):
    y = np.clip(y, -1, 1); out = (y * 32767).astype(np.int16)
    with wave.open(path, "wb") as f: f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(out.tobytes())

def mix(cues, out, voice=None, dur=None, lufs=-14.0, duck=7.0):
    v = load(voice) if voice else None
    D = dur or max([c["t"] + 3 for c in cues] + [len(v) / SR if v is not None else 0])
    N = int(D * SR); fx = np.zeros((N, 2))
    for c in cues:
        name = c["sfx"]; y = kenney(name.split(":", 1)[1]) if name.startswith("kenney:") else FX[name](**c.get("args", {}))
        g = 10 ** (c.get("db", -6) / 20); p = c.get("pan", 0.0); i = int(c["t"] * SR)
        if i >= N: continue
        y = y[: N - i]; fx[i:i + len(y), 0] += y * g * np.sqrt((1 - p) / 2) * 1.414; fx[i:i + len(y), 1] += y * g * np.sqrt((1 + p) / 2) * 1.414
    if v is not None:
        v = np.pad(v, ((0, max(0, N - len(v))), (0, 0)))[:N]
        e = np.sqrt(np.convolve(v.mean(1) ** 2, np.ones(int(0.03 * SR)) / int(0.03 * SR), "same"))
        act = np.clip(e / (np.percentile(e[e > 1e-5], 90) + 1e-9), 0, 1) if (e > 1e-5).any() else np.zeros(N)
        act = np.convolve(act, np.ones(int(0.12 * SR)) / int(0.12 * SR), "same")       # smooth attack/release
        fx *= (10 ** (-duck * act / 20))[:, None]
        # voice ≈ 8 dB above the effects bus (RMS while the voice talks)
        vr = np.sqrt((v[act > 0.5] ** 2).mean()) if (act > 0.5).any() else 0.1
        fr = np.sqrt((fx ** 2).mean()) + 1e-9
        fx *= min(1.0, vr / fr * 10 ** (-8 / 20) * 3.0)
        bus = v + fx
    else:
        bus = fx
    tmp = out + ".pre.wav"; write_wav(tmp, bus / max(1.0, np.abs(bus).max() / 0.98))
    m = subprocess.run([FF, "-hide_banner", "-i", tmp, "-af", f"loudnorm=I={lufs}:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(m[m.rfind("{"): m.rfind("}") + 1])
    ln = (f"loudnorm=I={lufs}:TP=-1:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
          f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,"
          "aresample=192000,alimiter=limit=0.85:attack=1:release=60:level=disabled,aresample=48000")  # 4x oversampled limiter = true-peak safe
    subprocess.run([FF, "-v", "error", "-y", "-i", tmp, "-af", ln, "-ar", str(SR), out], check=True); os.remove(tmp)
    print("mixed", len(cues), "cues ->", out, f"({lufs} LUFS target, −1 dBTP)")

def auto(timing_path, out_path):
    """first-pass cue sheet: whoosh on each line start (scene cut), blip on keywords, 808 on **big** words,
    riser → drop before a line that starts with '!' in the script. Then the agent edits it by hand."""
    T = json.load(open(timing_path)); cues = []
    for i, ln in enumerate(T["lines"]):
        if i: cues.append({"t": round(ln["start"] - 0.12, 3), "sfx": "whoosh", "db": -14})
        for w in ln["words"]:
            if w.get("big"): cues.append({"t": w["start"], "sfx": "hit808", "db": -8})
            elif w.get("key"): cues.append({"t": w["start"], "sfx": "blip", "db": -16, "pan": 0.2})
        if ln.get("drop"):
            cues.append({"t": round(ln["start"] - 2.0, 3), "sfx": "riser", "db": -12, "args": {"dur": 1.9}})
            cues.append({"t": ln["start"], "sfx": "drop", "db": -6})
    json.dump(cues, open(out_path, "w"), indent=1); print(len(cues), "cues ->", out_path)

if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "demo":
        d = sys.argv[2]; os.makedirs(d, exist_ok=True)
        for k, f in FX.items():
            y = f(); write_wav(os.path.join(d, k + ".wav"), np.stack([y, y], 1) * 0.8)
        print("wrote", len(FX), "effects to", d)
    elif cmd == "auto": auto(sys.argv[2], sys.argv[3])
    elif cmd == "mix":
        a = sys.argv; opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
        mix(json.load(open(a[2])), a[3], opt("--voice"), float(opt("--dur")) if opt("--dur") else None, float(opt("--lufs", -14)), float(opt("--duck", 7)))
