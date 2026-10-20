#!/usr/bin/env python3
# Website preview reel: recordings of sites, each in a rounded container on its own soft gradient background, hard cuts.
# Format (owner, 2026-10-20): 16:9 canvas, container centred with a small gap left/right, nothing else on screen (no text,
# logos, captions, audio). The background glow is sampled from each site's own colours (override per clip in the config).
#   python3 -I site_reel.py config.json out_dir
# config.json: {"clips": [{"name": "batto", "src": "rec.mov", "segments": [[0.0, 2.0], [3.5, 2.0]],
#                          "crop": [x, y, w, h] | null, "glow": ["#C99A3E", "#16264A"] | null, "pos": "br"|"bl"|"bc"}, ...],
#               "w": 1920, "h": 1080, "cw": 1760, "ch": 813, "radius": 44, "fps": 60, "dissolve": 0.25}
# 9:16 version of the same container (same shape and gap proportion): "w": 1080, "h": 1920, "cw": 990, "ch": 458, "radius": 25.
# ch 813 matches a phone-shaped recording (1792x828) without cropping. Outputs one mp4 per clip, reel.mp4 (hard cuts) and, when
# "dissolve" > 0, reel_smooth.mp4 (that many seconds of cross-fade at each join).
# STAGGERED CUT (owner, 2026-10-20, measured from his reference reel): with "stagger": 3 the container cuts first and the background
# follows 3 frames later, each with one half-blended frame; this gives the slim, soft cut. Set "cw" = "w" for a container that touches
# both sides (reference: 16:9, radius about 1.5 % of the width, centred at 45 % of the height). Extra clip keys: "focus" 0..1 (which
# part of the recording a narrower container keeps, default 0.5). Extra config: "topic": {"text": "3D animated websites", "y": 470,
# "size": 62} draws one line of text above the container; outputs reel_stagger.mp4.
# INTRO (owner, 2026-10-20): "intro": {"text": "3D animated<br>websites", "dur": 2.0, "size": 132, "y": 700, "glow": "bc"} puts a card before the
# first site: the Obsidian Glow background (off-black, soft white glow from the bottom, grain; css from obsidian-content/render_carousel.py)
# and one header in light Archivo that blurs to sharp in 0.5 s. The site backgrounds are not touched; the intro joins the first site with
# the same staggered cut (container first, background 3 frames later).
import json, os, subprocess, sys, colorsys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

FF = os.environ.get("FFMPEG", "ffmpeg")
cfg = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
W, H, CW, CH, R, FPS = cfg.get("w", 1920), cfg.get("h", 1080), cfg.get("cw", 1760), cfg.get("ch", 813), cfg.get("radius", 44), cfg.get("fps", 60)
CX, CY = (W - CW) // 2, cfg.get("cy", (H - CH) // 2)

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
    """near-black base tinted by the glow, a big soft glow rising from the bottom (like the reference), a partner glow from the top
    (stronger in portrait, where there is a lot of empty frame), fine grain. Shadow sizes scale with the container width."""
    y, x = np.mgrid[0:H, 0:W].astype(float); x /= W; y /= H
    A, B = hexrgb(glow[0]), hexrgb(glow[1])
    # keep the glow vivid but not neon: lift toward mid brightness
    A = A * (0.85 / max(A.max() / 255, 0.35)); A = np.clip(A, 0, 255)
    if H > W:  # 9:16: the glow climbs from the bottom edge, the partner colour hangs from the top corner opposite it
        cx, cy = {"br": (0.80, 1.05), "bl": (0.20, 1.05), "bc": (0.5, 1.06)}[pos]; r1x, r1y, c2y, r2x, r2y, wB = 0.85, 0.34, -0.06, 0.90, 0.26, 0.50
    else:
        cx, cy = {"br": (0.78, 1.08), "bl": (0.22, 1.08), "bc": (0.5, 1.10)}[pos]; r1x, r1y, c2y, r2x, r2y, wB = 0.62, 0.46, -0.15, 0.55, 0.30, 0.30
    g1 = np.exp(-(((x - cx) / r1x) ** 2 + ((y - cy) / r1y) ** 2) * 1.15)[..., None]
    g2 = np.exp((-(((x - (1 - cx)) / r2x) ** 2 + ((y - c2y) / r2y) ** 2)) * 1.2)[..., None]
    base = np.array([8, 8, 10], float) + (B * 0.06 + A * 0.025)
    img = base + A * g1 * 0.95 + B * g2 * wB + np.array([200, 200, 205]) * g2 * 0.035
    img *= (1 - 0.25 * ((x - 0.5) ** 2 + (y - 0.5) ** 2))[..., None]
    rng = np.random.default_rng(seed); img += rng.normal(0, 2.4, (H, W, 1))
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    # soft container shadow baked into the background
    k = CW / 1760
    sh = Image.new("L", (W, H), 0); ImageDraw.Draw(sh).rounded_rectangle((CX, CY + 26 * k, CX + CW, CY + CH + 26 * k), R, fill=140)
    sh = sh.filter(ImageFilter.GaussianBlur(46 * k))
    return Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), im, sh)

def mask():
    s = 4; m = Image.new("L", (CW * s, CH * s), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, CW * s - 1, CH * s - 1), R * s, fill=255)
    m = m.resize((CW, CH), Image.LANCZOS); m.save(os.path.join(out, "_mask.png")); return os.path.join(out, "_mask.png")

mpath = mask(); files = []; report = []

def topic_layer(t):
    """one line of text on a transparent 1080x1920 layer, drawn by headless Chrome in Archivo (the house font)."""
    fonts = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", ".claude", "skills", "obsidian-content", "assets", "fonts")
    html = (f"<style>@font-face{{font-family:A;src:url('file://{fonts}/archivo-latin-wdth-normal.woff2');font-weight:100 900;font-stretch:62% 125%}}"
            f"html,body{{margin:0;width:{W}px;height:{H}px;background:transparent}}"
            f"div{{position:absolute;left:0;right:0;top:{t.get('y', 470)}px;transform:translateY(-50%);text-align:center;font:600 {t.get('size', 62)}px A;"
            f"font-stretch:112%;letter-spacing:-0.02em;color:#F4F5F7}}</style><div>{t['text']}</div>")
    hp, pp = os.path.join(out, "_topic.html"), os.path.join(out, "_topic.png"); open(hp, "w").write(html)
    chrome = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    subprocess.run([chrome, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--default-background-color=00000000",
                    f"--window-size={W},{H + 200}", "--virtual-time-budget=3000", f"--screenshot={pp}", f"file://{hp}"], check=True, capture_output=True)
    return np.array(Image.open(pp).convert("RGBA").crop((0, 0, W, H))).astype(np.float32)


def intro_assets(it):
    """returns (background uint8 HxWx3, header mask float HxW 0..1) for the intro card, both drawn by headless Chrome."""
    import importlib.util
    here = os.path.dirname(os.path.abspath(__file__))
    rc_path = os.path.join(here, "..", "..", "..", ".claude", "skills", "obsidian-content", "scripts", "render_carousel.py")
    sp = importlib.util.spec_from_file_location("rc", rc_path); rc = importlib.util.module_from_spec(sp); sp.loader.exec_module(rc)
    fonts = os.path.join(here, "..", "..", "..", ".claude", "skills", "obsidian-content", "assets", "fonts")
    gx = rc.GX[it.get("glow", "bc")]
    face = f"@font-face{{font-family:A;src:url('file://{fonts}/archivo-latin-wdth-normal.woff2');font-weight:100 900;font-stretch:62% 125%}}"
    base = f"html,body{{margin:0;width:{W}px;height:{H}px;overflow:hidden}}"
    chrome = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    def shot(name, html, transparent):
        hp, pp = os.path.join(out, f"_{name}.html"), os.path.join(out, f"_{name}.png"); open(hp, "w").write(html)
        subprocess.run([chrome, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files"] +
                       (["--default-background-color=00000000"] if transparent else []) +
                       [f"--window-size={W},{H + 200}", "--virtual-time-budget=3000", f"--screenshot={pp}", f"file://{hp}"], check=True, capture_output=True)
        return Image.open(pp).convert("RGBA").crop((0, 0, W, H))
    bg = shot("intro_bg", f"<style>{face}{base}{rc.GLOW_CSS}body{{background:#0A0A0C}}</style><div class='glowbg' style='--gx:{gx}'></div><div class='grain'></div>", False).convert("RGB")
    txt = (f"<style>{face}{base}html,body{{background:transparent}}div{{position:absolute;left:0;right:0;top:{it.get('y', 700)}px;transform:translateY(-50%);text-align:center;"
           f"font:{it.get('weight', 300)} {it.get('size', 132)}px/1.04 A;font-stretch:{it.get('width', 100)}%;letter-spacing:-0.035em;color:#FFFFFF}}</style><div>{it['text']}</div>")
    mask = np.array(shot("intro_txt", txt, True))[..., 3].astype(np.float32) / 255
    return np.array(bg), mask

if cfg.get("stagger") is not None:
    LAG = int(cfg["stagger"]); alpha = (np.array(Image.open(mpath).convert("L")).astype(np.float32) / 255)[..., None]
    bgs = []; rep = []
    for i, c in enumerate(cfg["clips"]):
        glow = c.get("glow") or palette(c); pos = c.get("pos", ["br", "bl", "bc", "br", "bl"][i % 5])
        im = background(glow, pos, 7 + i); im.save(os.path.join(out, f"_bg_{c['name']}.png")); bgs.append(np.array(im)); rep.append({"clip": c["name"], "glow": glow, "pos": pos})
    topic = topic_layer(cfg["topic"]) if cfg.get("topic") else None
    if topic is not None: ta = topic[..., 3:4] / 255; trgb = topic[..., :3]
    enc = subprocess.Popen([FF, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-an", "-c:v", "libx264",
                            "-preset", "slow", "-crf", str(cfg.get("crf", 18)), "-maxrate", cfg.get("maxrate", "12M"), "-bufsize", "24M", "-pix_fmt", "yuv420p",
                            "-movflags", "+faststart", os.path.join(out, "reel_stagger.mp4")], stdin=subprocess.PIPE)
    fsz = CW * CH * 3; prev_last = None; total = 0; intro_bg = None
    if cfg.get("intro"):
        it = cfg["intro"]; intro_bg, hmask = intro_assets(it); n_in = round(it.get("dur", 2.0) * FPS); ink = np.array([244, 245, 247], np.float32)
        for f in range(n_in):  # header: fade and blur-to-sharp over 0.5 s, then hold
            p = min(1.0, f / (0.5 * FPS)); e = 1 - (1 - p) ** 3
            m = np.array(Image.fromarray((hmask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(max(0.01, (1 - e) * 20)))).astype(np.float32)[..., None] / 255 * e if p < 1 else hmask[..., None]
            frame = np.clip(intro_bg.astype(np.float32) * (1 - m) + ink * m, 0, 255).astype(np.uint8)
            enc.stdin.write(frame.tobytes()); total += 1
        prev_last = intro_bg[CY:CY + CH, CX:CX + CW].astype(np.float32)  # the half-blended join frame mixes with the clean background, not the header
    for i, c in enumerate(cfg["clips"]):
        crop = c.get("crop"); focus = c.get("focus", 0.5); n_seg = len(c["segments"]); inputs = []; parts = []
        for s_, d_ in c["segments"]: inputs += ["-ss", f"{s_:.3f}", "-t", f"{d_:.3f}", "-i", c["src"]]
        for k in range(n_seg):
            parts.append(f"[{k}:v]fps={FPS}," + (f"crop={crop[2]}:{crop[3]}:{crop[0]}:{crop[1]}," if crop else "") +
                         f"scale={CW}:{CH}:force_original_aspect_ratio=increase:flags=lanczos,crop={CW}:{CH}:(iw-{CW})*{focus}:(ih-{CH})/2,setsar=1,setpts=PTS-STARTPTS[s{k}]")
        cat = "".join(f"[s{k}]" for k in range(n_seg)) + f"concat=n={n_seg}:v=1:a=0[v]" if n_seg > 1 else "[s0]null[v]"
        dec = subprocess.Popen([FF, "-v", "error", *inputs, "-filter_complex", ";".join(parts + [cat]), "-map", "[v]", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
        l = 0
        while True:
            raw = dec.stdout.read(fsz)
            if len(raw) < fsz: break
            cur = np.frombuffer(raw, np.uint8).reshape(CH, CW, 3).astype(np.float32)
            joined = i > 0 or intro_bg is not None; pbg = bgs[i - 1] if i > 0 else intro_bg
            cont = prev_last * 0.35 + cur * 0.65 if (joined and l == 0) else cur  # container: one half-blended frame, then the new site
            # background lags the container by LAG frames, with its own half-blended frame
            if joined and l < LAG: bg = pbg
            elif joined and l == LAG: bg = ((pbg.astype(np.float32) + bgs[i].astype(np.float32)) * 0.5).astype(np.uint8)
            else: bg = bgs[i]
            frame = bg.copy(); reg = frame[CY:CY + CH, CX:CX + CW].astype(np.float32)
            frame[CY:CY + CH, CX:CX + CW] = np.clip(reg + (cont - reg) * alpha, 0, 255).astype(np.uint8)
            if topic is not None: frame = np.clip(frame.astype(np.float32) * (1 - ta) + trgb * ta, 0, 255).astype(np.uint8)
            enc.stdin.write(frame.tobytes()); l += 1; total += 1; last = cur
        dec.wait(); prev_last = last; rep[i]["frames"] = l
    enc.stdin.close(); enc.wait()
    json.dump(rep, open(os.path.join(out, "report.json"), "w"), indent=1); print(json.dumps(rep, indent=1), "total frames", total)
    raise SystemExit(0)
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
