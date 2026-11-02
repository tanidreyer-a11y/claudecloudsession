# Per-frame camera-motion analysis of a reference video (OpenCV): for every consecutive frame pair it tracks features,
# fits a homography and reports pan (tx, ty), zoom (scale), roll and PERSPECTIVE change (the signature of a true 3D
# move: orbit, tilt, going under/over a plane), plus cuts. Groups frames into segments of one dominant move.
# usage: python3 -I camera_motion.py <video> <out.json> [crop x0,y0,x1,y1 as fractions] [width=360]
import sys, json, subprocess, numpy as np, cv2
path, out = sys.argv[1], sys.argv[2]
crop = [float(v) for v in sys.argv[3].split(',')] if len(sys.argv) > 3 and sys.argv[3] != '-' else [0, 0, 1, 1]
cap = cv2.VideoCapture(path)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
prev = None; rows = []; i = 0
while True:
    ok, fr = cap.read()
    if not ok: break
    h, w = fr.shape[:2]
    fr = fr[int(crop[1] * h):int(crop[3] * h), int(crop[0] * w):int(crop[2] * w)]
    W = int(sys.argv[4]) if len(sys.argv) > 4 else 360
    g = cv2.cvtColor(cv2.resize(fr, (W, int(W * fr.shape[0] / fr.shape[1]))), cv2.COLOR_BGR2GRAY)
    if prev is not None:
        diff = float(np.abs(g.astype(np.float32) - prev.astype(np.float32)).mean())
        p0 = cv2.goodFeaturesToTrack(prev, 300, 0.01, 6)
        rec = dict(t=round(i / fps, 3), diff=round(diff, 2), inl=0.0, tx=0.0, ty=0.0, zoom=0.0, roll=0.0, persp=0.0)
        if p0 is not None and len(p0) >= 12:
            p1, st, _ = cv2.calcOpticalFlowPyrLK(prev, g, p0, None, winSize=(21, 21), maxLevel=3)
            a, b = p0[st == 1], p1[st == 1]
            if len(a) >= 12:
                Hm, mask = cv2.findHomography(a, b, cv2.RANSAC, 2.0)
                if Hm is not None:
                    Hm = Hm / Hm[2, 2]
                    gw, gh = g.shape[1], g.shape[0]
                    A = Hm[:2, :2]
                    rec.update(inl=round(float(mask.mean()), 3),
                               tx=round(float(Hm[0, 2] + (A[0, 0] - 1) * gw / 2 + A[0, 1] * gh / 2) / gw, 5),
                               ty=round(float(Hm[1, 2] + A[1, 0] * gw / 2 + (A[1, 1] - 1) * gh / 2) / gh, 5),
                               zoom=round(float(np.log(np.sqrt(abs(np.linalg.det(A))))), 5),
                               roll=round(float(np.arctan2(A[1, 0], A[0, 0])), 5),
                               persp=round(float(np.hypot(Hm[2, 0], Hm[2, 1]) * gw), 5))
        rows.append(rec)
    prev = g; i += 1
# classify each frame
def cls(r):
    if r['diff'] > 28 and r['inl'] < 0.5: return 'CUT'
    if r['inl'] < 0.25: return 'MORPH'          # no single camera explains it: graphic morph / fast object motion
    c = {'ZOOM_IN' if r['zoom'] > 0 else 'ZOOM_OUT': abs(r['zoom']) / 0.004, 'PAN': np.hypot(r['tx'], r['ty']) / 0.004,
         'ROLL': abs(r['roll']) / 0.004, '3D': r['persp'] / 0.0025}
    k = max(c, key=c.get)
    return k if c[k] >= 1 else 'HOLD'
segs = []
for r in rows:
    k = cls(r); r['cls'] = k
    if segs and segs[-1]['cls'] == k and r['t'] - segs[-1]['t1'] < 0.12: segs[-1]['t1'] = r['t']; segs[-1]['n'] += 1; segs[-1]['acc'].append(r)
    else: segs.append(dict(cls=k, t0=r['t'], t1=r['t'], n=1, acc=[r]))
out_segs = []
for s in segs:
    acc = s.pop('acc'); dur = s['t1'] - s['t0'] + 1 / fps
    if s['cls'] != 'CUT' and dur < 0.2: continue
    s['dur'] = round(dur, 2)
    s['zoom_total'] = round(float(np.exp(sum(a['zoom'] for a in acc))), 3)
    s['pan_total'] = [round(sum(a['tx'] for a in acc), 3), round(sum(a['ty'] for a in acc), 3)]
    s['roll_total_deg'] = round(float(np.degrees(sum(a['roll'] for a in acc))), 1)
    s['persp_peak'] = round(max(a['persp'] for a in acc), 4)
    out_segs.append(s)
json.dump(dict(file=path, fps=fps, frames=len(rows) + 1, segments=out_segs, rows=rows), open(out, 'w'))
summary = {}
for s in out_segs: summary[s['cls']] = round(summary.get(s['cls'], 0) + s['dur'], 1)
print(f"{path.split('/')[-1]}: {len(rows)+1} frames @ {fps:.1f} fps — " + ', '.join(f"{k} {v}s" for k, v in sorted(summary.items(), key=lambda x: -x[1])))
