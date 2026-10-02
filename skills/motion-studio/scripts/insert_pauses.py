"""Insert held pauses into a VO: python3 insert_pauses.py vo.wav out.wav 16.95:1.2 18.10:1.4
Each point must sit inside an existing silence. Then shift word times after each point and time-warp the visuals:
  t_film = t - sum(P_i * smoothstep((t - a_i) / (b_i - a_i)))  with a_i ~ point-0.5, b_i = a_i + P_i + 1.0"""
import sys, wave, numpy as np
src, dst, pts = sys.argv[1], sys.argv[2], [tuple(map(float, p.split(':'))) for p in sys.argv[3:]]
w = wave.open(src, 'rb'); sr, ch = w.getframerate(), w.getnchannels()
x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, ch)
parts, last = [], 0
for t, p in sorted(pts):
    i = int(t * sr); parts += [x[last:i], np.zeros((int(p * sr), ch), np.int16)]; last = i
parts.append(x[last:])
o = wave.open(dst, 'wb'); o.setnchannels(ch); o.setsampwidth(2); o.setframerate(sr); o.writeframes(np.concatenate(parts).tobytes()); o.close()
print('ok', dst)
