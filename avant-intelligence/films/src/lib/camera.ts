// Monotone cubic (Fritsch–Carlson) spline camera with log-space zoom — velocity carries through keys, no overshoot,
// no stop-start judder. Port of scripts/engine/film_template.js.
export type CamKey = [t: number, x: number, y: number, zoom: number, rot: number];

function monotone(ts: number[], ys: number[], t: number) {
  const n = ts.length;
  if (t <= ts[0]) return ys[0];
  if (t >= ts[n - 1]) return ys[n - 1];
  const d: number[] = [], m: number[] = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (ts[i + 1] - ts[i]));
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  let i = 0;
  while (t > ts[i + 1]) i++;
  const h = ts[i + 1] - ts[i], u = (t - ts[i]) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * ys[i] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * ys[i + 1] + (u3 - u2) * h * m[i + 1];
}

/** keys in seconds; returns world transform values at time tSec. Zoom interpolates in log space. */
export function cameraAt(keys: CamKey[], tSec: number) {
  const ts = keys.map((k) => k[0]);
  const x = monotone(ts, keys.map((k) => k[1]), tSec);
  const y = monotone(ts, keys.map((k) => k[2]), tSec);
  const z = Math.exp(monotone(ts, keys.map((k) => Math.log(k[3])), tSec));
  const r = monotone(ts, keys.map((k) => k[4]), tSec);
  return { x, y, z, r };
}

/** CSS transform for a full-frame "world" div: centre on (x,y) at zoom z, rotation r degrees. */
export const worldTransform = (w: number, h: number, c: { x: number; y: number; z: number; r: number }) =>
  `translate(${w / 2}px, ${h / 2}px) scale(${c.z}) rotate(${c.r}deg) translate(${-c.x}px, ${-c.y}px)`;
