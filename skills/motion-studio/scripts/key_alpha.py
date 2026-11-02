# Key green-screen or blue-sky footage to VP9+alpha WebM for <OffthreadVideo transparent>.
# usage: python3 -I key_alpha.py <in.mp4> <out.webm> <green|blue> <lo> <hi>   (green: key=g-max(r,b); blue: key=b-r)
import os, sys, subprocess, numpy as np
from scipy import ndimage
FF = os.environ.get('FFMPEG', 'ffmpeg')
src, dst, mode, lo, hi = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5])
W, H = 1920, 1080
dec = subprocess.Popen([FF, '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen([FF, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{W}x{H}', '-r', '24', '-i', '-', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '6M', '-auto-alt-ref', '0', dst], stdin=subprocess.PIPE)
n = 0
while True:
    buf = b''
    while len(buf) < W * H * 3:
        chunk = dec.stdout.read(W * H * 3 - len(buf))
        if not chunk: break
        buf += chunk
    if len(buf) < W * H * 3: break
    f = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    if mode == 'green':
        key = g - np.maximum(r, b)
    else:
        key = b - r
    a = np.clip((hi - key) / (hi - lo), 0, 1)
    core = a > 0.5
    holes = ndimage.binary_fill_holes(core) & ~core
    lab, nh = ndimage.label(holes)
    if nh:
        sizes = ndimage.sum(holes, lab, range(1, nh + 1))
        small = np.isin(lab, np.nonzero(sizes < 2500)[0] + 1)
        a = np.where(small, 1.0, a)
    a = ndimage.minimum_filter(a, size=5 if mode == 'blue' else 3)
    a = ndimage.gaussian_filter(a, 0.9)
    # despill on the edges
    if mode == 'green':
        g2 = np.minimum(g, (r + b) / 2 + 6); f[..., 1] = np.where(a < 0.999, g2, g)
    else:
        lum = 0.3 * r + 0.59 * g + 0.11 * b
        blu = np.clip((key - 10) / 30, 0, 1)[..., None]           # bluish pixels inside the subject → neutral grey
        grey = np.dstack([lum, lum, lum]) * 1.08
        f = f * (1 - blu) + grey * blu
    out = np.dstack([f, a * 255]).clip(0, 255).astype(np.uint8)
    enc.stdin.write(out.tobytes()); n += 1
enc.stdin.close(); enc.wait(); print('frames', n)
