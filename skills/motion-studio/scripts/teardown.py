"""Tear down a reference video into measurable data for a Style Card.
python3 teardown.py <video> <out_dir> [--rotate cw|ccw|180]
--rotate fixes screen recordings where the phone was held the wrong way (text reads sideways on the sheet):
run once, look at sheet.jpg, and re-run with the flag. Rotation metadata (displaymatrix) is honoured automatically by ffmpeg.
Outputs in out_dir: data.json, sheet.jpg (16 evenly spaced frames), cuts.jpg (a frame after every cut, max 16)
Measures: duration, resolution, active picture area (cropdetect), cuts + avg shot length + cuts/sec,
palette (k-means 6 colours over sampled frames, letterbox excluded), audio integrated loudness (LUFS),
silence ratio, onset times (SFX/beat candidates) and a rough tempo.
Needs numpy, Pillow and ffmpeg (FFMPEG env var or on PATH). Read-only on the input."""
import json, os, re, subprocess, sys, tempfile
import numpy as np
from PIL import Image
FF = os.environ.get('FFMPEG', 'ffmpeg')
args = [a for a in sys.argv[1:] if not a.startswith('--')]
src, out = args[0], args[1]; os.makedirs(out, exist_ok=True)
rot = sys.argv[sys.argv.index('--rotate') + 1] if '--rotate' in sys.argv else None
rf = {'cw': 'transpose=1,', 'ccw': 'transpose=2,', '180': 'hflip,vflip,'}.get(rot, '')
if rot: args = [a for a in args if a != rot]
run = lambda a: subprocess.run([FF, '-hide_banner'] + a, capture_output=True, text=True).stderr
info = run(['-i', src])
dur = sum(float(x) * m for x, m in zip(re.search(r'Duration: (\d+):(\d+):([\d.]+)', info).groups(), (3600, 60, 1)))
res = re.search(r'Video:.*?(\d{2,5})x(\d{2,5})', info).groups()
crops = re.findall(r'crop=(\d+:\d+:\d+:\d+)', run(['-ss', str(dur * .3), '-i', src, '-t', '3', '-vf', 'cropdetect=limit=40:round=2', '-f', 'null', '-']))
crop = max(set(crops), key=crops.count) if crops else None
cf = (f'crop={crop},' if crop else '') + rf
cuts = [float(x) for x in re.findall(r'pts_time:([\d.]+)', run(['-i', src, '-vf', f"{cf}scale=320:-2,select='gt(scene,0.3)',showinfo", '-vsync', 'vfr', '-an', '-f', 'null', '-']))]
shots = len(cuts) + 1
# contact sheets
fps = 16 / dur
run(['-y', '-i', src, '-vf', f'{cf}fps={fps:.4f},scale=480:-2,tile=4x4', '-frames:v', '1', f'{out}/sheet.jpg'])
if cuts:
    sel = '+'.join(f'gte(t,{c + .15:.2f})*lt(t,{c + .2:.2f})' for c in cuts[:16])
    run(['-y', '-i', src, '-vf', f"{cf}select='{sel}',scale=480:-2,tile=4x4", '-vsync', 'vfr', '-frames:v', '1', f'{out}/cuts.jpg'])
# palette
tmp = tempfile.mkdtemp()
run(['-y', '-i', src, '-vf', f'{cf}fps={min(2, 24 / dur):.3f},scale=96:-2', f'{tmp}/f%03d.png'])
px = np.concatenate([np.asarray(Image.open(os.path.join(tmp, f)).convert('RGB')).reshape(-1, 3) for f in sorted(os.listdir(tmp))]).astype(float)
rng = np.random.default_rng(0); px = px[rng.choice(len(px), min(len(px), 40000), replace=False)]
cent = px[rng.choice(len(px), 6, replace=False)]
for _ in range(25):
    lab = ((px[:, None, :] - cent[None]) ** 2).sum(-1).argmin(1)
    cent = np.array([px[lab == k].mean(0) if (lab == k).any() else cent[k] for k in range(6)])
share = np.bincount(lab, minlength=6) / len(lab)
palette = sorted([('#%02X%02X%02X' % tuple(int(v) for v in c), round(float(s), 3)) for c, s in zip(cent, share)], key=lambda x: -x[1])
lum = float((px @ [.2126, .7152, .0722]).mean() / 255)
# audio
lufs = (re.findall(r'I:\s+(-?[\d.]+) LUFS', run(['-i', src, '-af', 'ebur128', '-f', 'null', '-'])) or [None])[-1]
sil = run(['-i', src, '-af', 'silencedetect=noise=-45dB:d=0.4', '-f', 'null', '-'])
silent = sum(float(x) for x in re.findall(r'silence_duration: ([\d.]+)', sil))
raw = subprocess.run([FF, '-v', 'error', '-i', src, '-ac', '1', '-ar', '8000', '-f', 's16le', '-'], capture_output=True).stdout
onsets, tempo = [], None
if raw:
    a = np.frombuffer(raw, np.int16).astype(float) / 32768
    hop = 80; env = np.sqrt(np.convolve(a ** 2, np.ones(400) / 400, 'same')[::hop])   # 10 ms envelope
    flux = np.maximum(np.diff(env), 0); thr = flux.mean() + 3 * flux.std()
    pk = [i for i in range(1, len(flux) - 1) if flux[i] > thr and flux[i] >= flux[i - 1] and flux[i] >= flux[i + 1]]
    last = -99
    for i in pk:
        if i - last > 12: onsets.append(round(i / 100, 2)); last = i
    if len(flux) > 400:
        f = flux - flux.mean(); ac = np.correlate(f, f, 'full')[len(f) - 1:]
        lags = np.arange(len(ac)); band = (lags >= 33) & (lags <= 100)   # 60–180 bpm
        if band.any(): tempo = round(6000 / lags[band][ac[band].argmax()], 1)
data = dict(file=os.path.basename(src), rotate=rot, duration=round(dur, 2), resolution=f'{res[0]}x{res[1]}', active_area=crop,
            cuts=[round(c, 2) for c in cuts], shots=shots, avg_shot_s=round(dur / shots, 2), cuts_per_s=round(len(cuts) / dur, 3),
            palette=palette, mean_luminance=round(lum, 3), lufs=float(lufs) if lufs else None,
            silence_ratio=round(silent / dur, 3), onsets=onsets[:60], onsets_per_s=round(len(onsets) / dur, 2), tempo_bpm_guess=tempo)
json.dump(data, open(f'{out}/data.json', 'w'), indent=1)
print(json.dumps({k: v for k, v in data.items() if k != 'onsets'}))
