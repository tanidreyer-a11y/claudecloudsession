// WebGL liquid: (1) a full-screen "world" of domain-warped clouds that can ink-wipe from one palette to another,
// (2) liquid balls as metaballs (they merge like real liquid) with swirling insides, glass rim and a purple core.
// Both are drawn synchronously in useLayoutEffect each frame, so Remotion captures them.
import React, { useLayoutEffect, useRef } from "react";

type U = { t: "1f" | "2f" | "3f" | "1i" | "1fv" | "2fv" | "3fv" | "4fv"; v: number | number[] };
type St = { gl: WebGLRenderingContext; locs: Record<string, WebGLUniformLocation | null> };

const VERT = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";

const NOISE = `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0); m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p){
  float f = 0.0, a = 0.5; mat2 R = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++){ f += a * (0.5 + 0.5 * snoise(p)); p = R * p * 2.03 + 11.7; a *= 0.5; }
  return f / 0.96875;
}
float fbm3(vec2 p){
  float f = 0.0, a = 0.5; mat2 R = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 3; i++){ f += a * (0.5 + 0.5 * snoise(p)); p = R * p * 1.97 + 5.3; a *= 0.45; }
  return f / 0.8;
}
`;

// ---------------------------------------------------------------- the world (clouds)
const WORLD = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_off; uniform float u_zoom;
uniform vec3 u_pa[5]; uniform vec3 u_pb[5]; uniform float u_mix; uniform vec3 u_wipe; uniform float u_flow; uniform float u_rot;
${NOISE}
vec3 paint(vec3 c0, vec3 c1, vec3 c2, vec3 c3, vec3 c4, float f, vec2 q, vec2 r){
  vec3 col = mix(c0, c1, smoothstep(0.32, 0.72, f));
  col = mix(col, c2, smoothstep(0.62, 0.95, length(q)) * 0.8);
  col = mix(col, c3, smoothstep(0.55, 0.85, r.y) * smoothstep(0.4, 0.7, f) * 0.7);
  col = mix(col, c4, smoothstep(0.62, 0.9, f * (0.7 + 0.5 * r.x)) * 0.75);
  return col;
}
void main(){
  vec2 frag = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 p0 = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y * u_zoom;
  float cr = cos(u_rot), sr = sin(u_rot);
  vec2 p = mat2(cr, -sr, sr, cr) * p0 + u_off;
  float t = u_time * u_flow;
  vec2 q = vec2(fbm3(p + vec2(0.0, 0.0) + t * vec2(0.06, 0.03)), fbm3(p + vec2(5.2, 1.3) - t * vec2(0.04, 0.05)));
  vec2 r = vec2(fbm3(p + 1.9 * q + vec2(1.7, 9.2) + t * 0.09), fbm3(p + 1.9 * q + vec2(8.3, 2.8) - t * 0.07));
  float f = fbm(p + 1.7 * r);
  vec3 a = paint(u_pa[0], u_pa[1], u_pa[2], u_pa[3], u_pa[4], f, q, r);
  vec3 b = paint(u_pb[0], u_pb[1], u_pb[2], u_pb[3], u_pb[4], f, q, r);
  float k = u_mix;
  if (u_wipe.z > 0.0) {
    float d = length(frag - u_wipe.xy) + (f - 0.5) * 420.0 + (r.x - 0.5) * 260.0;
    k = max(k, 1.0 - smoothstep(u_wipe.z - 120.0, u_wipe.z + 120.0, d));
  }
  vec3 col = mix(a, b, k);
  vec2 uv = frag / u_res - 0.5;
  col *= 1.0 - 0.28 * dot(uv * vec2(1.1, 0.9), uv * vec2(1.1, 0.9));
  gl_FragColor = vec4(col, 1.0);
}`;

// ---------------------------------------------------------------- liquid balls (metaballs)
const BALLS = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform float u_px;
uniform int u_n; uniform vec4 u_b[7]; uniform vec3 u_c0[7]; uniform vec3 u_c1[7]; uniform vec3 u_c2[7]; uniform vec2 u_x[7];
uniform float u_k; uniform float u_glow;
${NOISE}
float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float field(vec2 p){
  float d = 1e5;
  for (int i = 0; i < 7; i++){ if (i >= u_n) break; d = smin(d, length(p - u_b[i].xy) - u_b[i].z, u_k); }
  return d;
}
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y) * u_px;
  float d = field(p);
  // per-ball weights (nearest surface dominates)
  float ws = 0.0; float R = 0.0; vec3 C0 = vec3(0.0), C1 = vec3(0.0), C2 = vec3(0.0); float tr = 0.0, core = 0.0; vec2 ctr = vec2(0.0); float seed = 0.0;
  for (int i = 0; i < 7; i++){
    if (i >= u_n) break;
    float di = length(p - u_b[i].xy) - u_b[i].z;
    float w = exp(-clamp(di, -60.0, 600.0) / 26.0) + 1e-6;
    ws += w; R += w * u_b[i].z; C0 += w * u_c0[i]; C1 += w * u_c1[i]; C2 += w * u_c2[i];
    tr += w * u_b[i].w; core += w * u_x[i].x; ctr += w * u_b[i].xy; seed += w * u_x[i].y;
  }
  R /= ws; C0 /= ws; C1 /= ws; C2 /= ws; tr /= ws; core /= ws; ctr /= ws; seed /= ws;
  float glowR = R * 0.55 + 10.0;
  if (d > glowR * 4.0) { gl_FragColor = vec4(0.0); return; }
  float e = 1.5;
  vec2 g = vec2(field(p + vec2(e, 0.0)) - field(p - vec2(e, 0.0)), field(p + vec2(0.0, e)) - field(p - vec2(0.0, e)));
  g = g / max(length(g), 1e-5);
  float depth = clamp(-d, 0.0, R);
  float nz = sqrt(clamp(depth * (2.0 * R - depth), 0.0, R * R)) / R;
  vec2 nxy = g * sqrt(max(0.0, 1.0 - nz * nz));
  vec3 n = normalize(vec3(nxy, nz + 1e-4));
  // the liquid inside: domain-warped clouds seen through a sphere (refraction-ish)
  vec2 rel = (p - ctr) / R;
  vec2 uv = rel * 0.38 + nxy * 0.22 + seed * 7.3;
  float t = u_time;
  vec2 q = vec2(fbm3(uv + t * vec2(0.16, 0.06)), fbm3(uv + vec2(4.1, 2.7) - t * vec2(0.07, 0.15)));
  vec2 r = vec2(fbm3(uv + 2.3 * q + vec2(1.3, 8.1) + t * 0.21), fbm3(uv + 2.3 * q + vec2(7.7, 3.1) - t * 0.17));
  float f = fbm3(uv * 1.1 + 2.1 * r);
  vec3 col = mix(C0, C1, smoothstep(0.3, 0.72, f));
  col = mix(col, C2, smoothstep(0.55, 0.95, length(q)) * 0.8);
  col = mix(col, mix(C1, vec3(1.0), 0.65), smoothstep(0.6, 0.9, f * (0.6 + 0.6 * r.x)) * 0.75);
  // the purple core
  vec3 PUR = mix(vec3(0.62, 0.30, 0.95), vec3(0.98, 0.72, 0.92), smoothstep(0.3, 0.9, f));
  col = mix(col, PUR, smoothstep(0.35, 0.92, nz) * core * (0.55 + 0.45 * smoothstep(0.2, 0.8, r.y)));
  // light
  vec3 L = normalize(vec3(-0.45, -0.6, 0.66));
  float dif = clamp(dot(n, L), 0.0, 1.0);
  col *= 0.7 + 0.42 * dif;
  float fr = pow(1.0 - nz, 2.4);
  col += mix(C1, vec3(1.0), 0.55) * fr * 0.55;
  float sp = pow(max(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0), 70.0);
  float sp2 = pow(max(dot(n, normalize(vec3(0.55, 0.65, 0.55))), 0.0), 9.0);
  col += vec3(1.0) * sp * 0.95 + mix(C1, C2, 0.3) * sp2 * 0.22;
  float aIn = 1.0 - smoothstep(-1.2 * u_px, 1.2 * u_px, d);
  float body = mix(1.0, clamp(0.22 + 0.85 * fr + 0.6 * sp + 0.25 * f, 0.0, 1.0), tr);
  float a = aIn * body;
  float gl = exp(-max(d, 0.0) / glowR) * u_glow * (1.0 - aIn);
  vec3 gc = mix(C1, vec3(0.85, 0.6, 1.0), core * 0.5);
  gl_FragColor = vec4(col * a + gc * gl * 0.6, a + gl * 0.42);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
  return s;
}
function init(canvas: HTMLCanvasElement, frag: string, names: string[]): St {
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true, premultipliedAlpha: true, alpha: true, antialias: false })!;
  if (!gl) throw new Error("no webgl");
  const pr = gl.createProgram()!;
  gl.attachShader(pr, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(pr, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr) || "link");
  gl.useProgram(pr);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "a");
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const locs: Record<string, WebGLUniformLocation | null> = {};
  names.forEach((n) => (locs[n] = gl.getUniformLocation(pr, n)));
  return { gl, locs };
}

const Shader: React.FC<{ frag: string; w: number; h: number; u: Record<string, U>; style?: React.CSSProperties }> = ({ frag, w, h, u, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const st = useRef<St | null>(null);
  useLayoutEffect(() => {
    const c = ref.current!;
    if (!st.current) st.current = init(c, frag, Object.keys(u));
    const { gl, locs } = st.current;
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    for (const [k, { t, v }] of Object.entries(u)) {
      const l = locs[k];
      if (!l) continue;
      const a = v as number[];
      if (t === "1f") gl.uniform1f(l, v as number);
      else if (t === "1i") gl.uniform1i(l, v as number);
      else if (t === "2f") gl.uniform2f(l, a[0], a[1]);
      else if (t === "3f") gl.uniform3f(l, a[0], a[1], a[2]);
      else if (t === "1fv") gl.uniform1fv(l, new Float32Array(a));
      else if (t === "2fv") gl.uniform2fv(l, new Float32Array(a));
      else if (t === "3fv") gl.uniform3fv(l, new Float32Array(a));
      else if (t === "4fv") gl.uniform4fv(l, new Float32Array(a));
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });
  return <canvas ref={ref} width={w} height={h} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", ...style }} />;
};

// ---------------------------------------------------------------- palettes
export type Pal = [string, string, string, string, string];
const rgb = (hx: string) => { const n = parseInt(hx.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
const flat = (p: Pal) => p.flatMap(rgb);

export const World: React.FC<{ time: number; a: Pal; b: Pal; mix: number; wipe?: [number, number, number]; off?: [number, number]; zoom?: number; flow?: number; res?: number; rot?: number }> = ({ time, a, b, mix, wipe = [0, 0, 0], off = [0, 0], zoom = 1.2, flow = 1, res = 0.5, rot = 0 }) => {
  const w = Math.round(1080 * res), h = Math.round(1920 * res);
  return (
    <Shader frag={WORLD} w={w} h={h} u={{
      u_res: { t: "2f", v: [w, h] }, u_time: { t: "1f", v: time }, u_off: { t: "2f", v: off }, u_zoom: { t: "1f", v: zoom },
      "u_pa[0]": { t: "3fv", v: flat(a) }, "u_pb[0]": { t: "3fv", v: flat(b) }, u_mix: { t: "1f", v: mix },
      u_wipe: { t: "3f", v: [wipe[0] * res, wipe[1] * res, wipe[2] * res] }, u_flow: { t: "1f", v: flow }, u_rot: { t: "1f", v: rot },
    }} />
  );
};

export type Ball = { x: number; y: number; r: number; tr?: number; core?: number; c: [string, string, string]; seed?: number };
export const Balls: React.FC<{ time: number; balls: Ball[]; k?: number; glow?: number; res?: number; op?: number }> = ({ time, balls, k = 40, glow = 0.8, res = 1, op = 1 }) => {
  const w = Math.round(1080 * res), h = Math.round(1920 * res);
  const B = balls.filter((b) => b.r > 0.5).slice(0, 7);
  const at = <T,>(f: (b: Ball, i: number) => T[], fill: T[]) => Array.from({ length: 7 }, (_, i) => (B[i] ? f(B[i], i) : fill)).flat() as unknown as number[];
  return (
    <Shader frag={BALLS} w={w} h={h} style={{ opacity: op }} u={{
      u_res: { t: "2f", v: [w, h] }, u_time: { t: "1f", v: time }, u_px: { t: "1f", v: 1 / res }, u_n: { t: "1i", v: B.length },
      "u_b[0]": { t: "4fv", v: at((b) => [b.x, b.y, b.r, b.tr ?? 0], [0, 0, 0.01, 0]) },
      "u_c0[0]": { t: "3fv", v: at((b) => rgb(b.c[0]), [0, 0, 0]) },
      "u_c1[0]": { t: "3fv", v: at((b) => rgb(b.c[1]), [0, 0, 0]) },
      "u_c2[0]": { t: "3fv", v: at((b) => rgb(b.c[2]), [0, 0, 0]) },
      "u_x[0]": { t: "2fv", v: at((b, i) => [b.core ?? 0, b.seed ?? i * 0.37], [0, 0]) },
      u_k: { t: "1f", v: k }, u_glow: { t: "1f", v: glow },
    }} />
  );
};
