#!/usr/bin/env python3
# Website preview reel: recordings of sites, each in a rounded container on its own soft gradient background, hard cuts.
# Format (owner, 2026-10-20): 16:9 canvas, container centred with a small gap left/right, nothing else on screen (no text,
# logos, captions, audio). The background glow is sampled from each site's own colours (override per clip in the config).
#   python3 -I site_reel.py config.json out_dir
# config.json: {"clips": [{"name": "batto", "src": "rec.mov", "segments": [[0.0, 2.0], [3.5, 2.0]],
#                          "crop": [x, y, w, h] | null, "glow": ["#C99A3E", "#16264A"] | null, "pos": "br"|"bl"|"bc"}, ...],
#               "w": 1920, "h": 1080, "cw": 1760, "ch": 813, "radius": 44, "fps": 60, "dissolve": 0.25}
# ch 813 matches a phone-shaped recording (1792x828) without cropping. Outputs one mp4 per clip, reel.mp4 (hard cuts) and, when
# "dissolve" > 0, reel_smooth.mp4 (that many seconds of cross-fade at each join).
import json, os, subprocess, sys, colorsys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

FF = os.environ.get("FFMPEG", "ffmpeg")
cfg = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
W, H, CW, CH, R, FPS = cfg.get("w", 1920), cfg.get("h", 1080), cfg.get("cw", 1760), cfg.get("ch", 813), cfg.get("radius", 44), cfg.get("fps", 60)
CX, CY = (W - CW) // 2, (H - CH) // 2

def sample(src, t, crop):
    vf = (f"crop={crop[2]}:{crop[3]}:{crop[0]}:{crop[1]}," if crop else "") + "scale=192:-1"
    raw = subprocess.run([FF, "-v", "error", "-ss", f"{t:.2f}", "-i", src, "-frames:v", "1", "-vf", vf, "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    from io import BytesIO
    return Image.open(BytesIO(raw)).convert("RGB")

def palette(c):
    """accent = the most common saturated hue (weighted by saturation x value); fallback = the warmest bright pixels."""
    frames = []
    for s, d in c["segments"]:
        for k in range(4): frames.append(sample(c["src"], s + d * (k + 0.5) / 4, c.get("crop")))
    px = np.concatenate([np.array(f).reshape(-1, 3) for f in frames]).astype(float)
    hsv = np.array([colorsys.rgb_to_hsv(*(p / 255)) for p in px[::7]]); rgb = px[::7]
    sat = (hsv[:, 1] > 0.38) & (hsv[:, 2] > 0.30)
    cols = []
    if sat.sum() > 60:
        w = hsv[sat, 1] * hsv[sat, 2]; hist = np.bincount((hsv[sat, 0] * 24).astype(int) % 24, weights=w, minlength=24)
        first = hist.max()
        for _ in range(2):
            if hist.max() < 0.2 * first: break  # no real second hue
            b = int(hist.argmax()); m = ((hsv[:, 0] * 24).astype(int) % 24 == b) & sat
            if m.sum() >= 20: cols.append(rgb[m].mean(axis=0))
            hist[[(b + j) % 24 for j in (-2, -1, 0, 1, 2)]] = 0
    if not cols:  # low-saturation site: take the brightest 12 % (stone, sand, graphite)
        lum = rgb.mean(axis=1); cols.append(rgb[lum > np.percentile(lum, 88)].mean(axis=0))
    if len(cols) == 1: cols.append(cols[0] * np.array([0.55, 0.62, 0.9]))  # cooler, darker partner
    return ["#%02X%02X%02X" % tuple(int(v) for v in c0) for c0 in cols]

def hexrgb(h): return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)

def background(glow, pos, seed):
    """near-black base tinted by the glow, a big soft glow rising from one corner (like the reference), a pale top sheen, fine grain."""
    y, x = np.mgrid[0:H, 0:W].astype(float); x /= W; y /= H
    A, B = hexrgb(glow[0]), hexrgb(glow[1])
    # keep the glow vivid but not neon: lift toward mid brightness
    A = A * (0.85 / max(A.max() / 255, 0.35)); A = np.clip(A, 0, 255)
    cx, cy = {"br": (0.78, 1.08), "bl": (0.22, 1.08), "bc": (0.5, 1.10)}[pos]
    d = ((x - cx) / 0.62) ** 2 + ((y - cy) / 0.46) ** 2
    g1 = np.exp(-d * 1.15)[..., None]
    g2 = np.exp((-(((x - (1 - cx)) / 0.55) ** 2 + ((y + 0.15) / 0.30) ** 2)) * 1.2)[..., None]
    base = np.array([8, 8, 10], float) + (B * 0.06 + A * 0.025)
    img = base + A * g1 * 0.95 + B * g2 * 0.30 + np.array([200, 200, 205]) * g2 * 0.035
    img *= (1 - 0.25 * ((x - 0.5) ** 2 + (y - 0.5) ** 2))[..., None]
    rng = np.random.default_rng(seed); img += rng.normal(0, 2.4, (H, W, 1))
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    # soft container shadow baked into the background
    sh = Image.new("L", (W, H), 0); ImageDraw.Draw(sh).rounded_rectangle((CX, CY + 26, CX + CW, CY + CH + 26), R, fill=140)
    sh = sh.filter(ImageFilter.GaussianBlur(46))
    return Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), im, sh)

def mask():
    s = 4; m = Image.new("L", (CW * s, CH * s), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, CW * s - 1, CH * s - 1), R * s, fill=255)
    m = m.resize((CW, CH), Image.LANCZOS); m.save(os.path.join(out, "_mask.png")); return os.path.join(out, "_mask.png")

mpath = mask(); files = []; report = []
for i, c in enumerate(cfg["clips"]):
    glow = c.get("glow") or palette(c); pos = c.get("pos", ["br", "bl", "bc", "br", "bl"][i % 5])
    bg = os.path.join(out, f"_bg_{c['name']}.png"); background(glow, pos, 7 + i).save(bg)
    dur = sum(d for _, d in c["segments"]); crop = c.get("crop")
    inputs = ["-loop", "1", "-framerate", str(FPS), "-t", f"{dur:.3f}", "-i", bg]
    for s, d in c["segments"]: inputs += ["-ss", f"{s:.3f}", "-t", f"{d:.3f}", "-i", c["src"]]
    inputs += ["-loop", "1", "-framerate", str(FPS), "-t", f"{dur:.3f}", "-i", mpath]
    n = len(c["segments"]); parts = []
    for k in range(n):
        parts.append(f"[{k + 1}:v]fps={FPS}," + (f"crop={crop[2]}:{crop[3]}:{crop[0]}:{crop[1]}," if crop else "") +
                     f"scale={CW}:{CH}:force_original_aspect_ratio=increase:flags=lanczos,crop={CW}:{CH},setsar=1,setpts=PTS-STARTPTS[s{k}]")
    cat = "".join(f"[s{k}]" for k in range(n)) + f"concat=n={n}:v=1:a=0[v]" if n > 1 else "[s0]null[v]"
    fg = ";".join(parts + [cat, f"[{n + 1}:v]format=gray[m]", "[v]format=rgba[vr]", "[vr][m]alphamerge[vm]", f"[0:v][vm]overlay={CX}:{CY}:shortest=1,format=yuv420p[o]"])
    f = os.path.join(out, f"{i + 1:02d}_{c['name']}.mp4")
    subprocess.run([FF, "-v", "error", "-y", *inputs, "-filter_complex", fg, "-map", "[o]", "-an", "-r", str(FPS), "-c:v", "libx264", "-preset", "slow",
                    "-crf", str(cfg.get("crf", 18)), "-maxrate", cfg.get("maxrate", "12M"), "-bufsize", "24M", "-pix_fmt", "yuv420p", "-movflags", "+faststart", f], check=True)
    files.append(f); report.append({"clip": c["name"], "seconds": dur, "glow": glow, "pos": pos})
lst = os.path.join(out, "_list.txt"); open(lst, "w").write("".join(f"file '{os.path.abspath(f)}'\n" for f in files))
subprocess.run([FF, "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", "-movflags", "+faststart", os.path.join(out, "reel.mp4")], check=True)
# optional soft version: a short dissolve at every join (the container never moves, so only the site and its glow change)
dis = cfg.get("dissolve", 0)
if dis and len(files) > 1:
    durs = [sum(d for _, d in c["segments"]) for c in cfg["clips"]]; ins = []; chain = []; acc = durs[0]; last = "[0:v]"
    for k, f in enumerate(files): ins += ["-i", f]
    for k in range(1, len(files)):
        off = acc - dis; lab = f"[x{k}]"
        chain.append(f"{last}[{k}:v]xfade=transition=fade:duration={dis}:offset={off:.3f}{lab}"); last = lab; acc = off + durs[k]
    subprocess.run([FF, "-v", "error", "-y", *ins, "-filter_complex", ";".join(chain), "-map", last, "-an", "-r", str(FPS), "-c:v", "libx264", "-preset", "slow",
                    "-crf", str(cfg.get("crf", 18)), "-maxrate", cfg.get("maxrate", "12M"), "-bufsize", "24M", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                    os.path.join(out, "reel_smooth.mp4")], check=True)
json.dump(report, open(os.path.join(out, "report.json"), "w"), indent=1); print(json.dumps(report, indent=1))
