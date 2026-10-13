# Timestamped contact sheets: every frame at <fps> from a video, tiled with the time printed on each tile.
# usage: python3 -I time_sheet.py <video> <out_prefix> <fps> [crop x0,y0,x1,y1 fractions|-] [tile_w=240] [cols=8] [rows=6] [t0] [t1]
import sys, subprocess, numpy as np
from PIL import Image, ImageDraw
src, outp, fps = sys.argv[1], sys.argv[2], float(sys.argv[3])
crop = sys.argv[4] if len(sys.argv) > 4 else '-'
tw = int(sys.argv[5]) if len(sys.argv) > 5 else 240
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 8; rows = int(sys.argv[7]) if len(sys.argv) > 7 else 6
t0 = float(sys.argv[8]) if len(sys.argv) > 8 else 0.0; t1 = float(sys.argv[9]) if len(sys.argv) > 9 else None
FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
vf = []
if crop != '-':
    x0, y0, x1, y1 = [float(v) for v in crop.split(',')]
    vf.append(f"crop=iw*{x1-x0}:ih*{y1-y0}:iw*{x0}:ih*{y0}")
vf += [f"fps={fps}", f"scale={tw}:-2"]
inp = ['-ss', str(t0)] + (['-t', str(t1 - t0)] if t1 else []) + ['-i', src]
import tempfile, os
tmp = tempfile.mktemp(suffix='.png')
subprocess.run([FF, '-v', 'error', '-y'] + inp + ['-vf', ','.join(vf), '-frames:v', '1', tmp], check=True)
th = Image.open(tmp).height; os.remove(tmp)
cmd = [FF, '-v', 'error'] + inp + ['-vf', ','.join(vf), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
raw = subprocess.run(cmd, capture_output=True).stdout
n = len(raw) // (tw * th * 3); frames = np.frombuffer(raw[:n * tw * th * 3], np.uint8).reshape(n, th, tw, 3)
per = cols * rows; k = 0
for s in range(0, n, per):
    S = Image.new('RGB', (cols * tw, rows * (th + 16)), (24, 24, 24)); d = ImageDraw.Draw(S)
    for j, f in enumerate(frames[s:s + per]):
        x, y = (j % cols) * tw, (j // cols) * (th + 16)
        S.paste(Image.fromarray(f), (x, y + 16)); d.text((x + 3, y + 2), f"{t0 + (s + j) / fps:.2f}s", fill=(255, 80, 80))
    k += 1; S.save(f"{outp}_{k:02d}.jpg", quality=85)
print(outp, n, 'frames,', k, 'sheets')
