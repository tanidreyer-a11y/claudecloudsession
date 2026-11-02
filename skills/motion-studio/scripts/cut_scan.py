# Frame-jump scan: mean |Δ| between consecutive frames (30 fps, 160×90 grey); prints every frame that jumps
# (> 14, or > 2.6× its local average). Run it on OUR film and on the reference: every jump we have that the
# reference does not (within 0.25 s) is a glitch until proven otherwise (lessons-learned 75).
# usage: python3 -I cut_scan.py <ffmpeg> <video> <crop|-> [compare_to_list.txt]
import sys, subprocess, numpy as np
ff, path, crop = sys.argv[1], sys.argv[2], sys.argv[3]
vf = (f"{crop}," if crop != "-" else "") + "fps=30,scale=160:90,format=gray"
raw = subprocess.run([ff, "-v", "error", "-i", path, "-vf", vf, "-f", "rawvideo", "-"], capture_output=True).stdout
f = np.frombuffer(raw, np.uint8).reshape(-1, 90, 160).astype(np.float32)
d = np.abs(np.diff(f, axis=0)).mean(axis=(1, 2))
base = np.convolve(d, np.ones(9) / 9, mode="same")
hits = [((i + 1) / 30, d[i], base[i]) for i in np.where((d > 14) | ((d > 7) & (d > 2.6 * base)))[0]]
ref = None
if len(sys.argv) > 4:
    ref = [float(l.split("s")[0]) for l in open(sys.argv[4]) if l.strip()]
for t, v, b in hits:
    if ref is None or not any(abs(t - r) <= 0.25 for r in ref):
        print(f"{t:6.2f}s  diff {v:5.1f}  (local {b:4.1f})")
