// OBS-3D — true 3D camera test (three.js via @remotion/three). One website container with real thickness: the camera
// starts frontal (our usual flat shot), sinks UNDER the container, comes up behind it and turns to see its BACK (the
// build: grid, code, emblem), goes OVER the top to complete the 360°, then dives into the screen.
// Rules (remotion skill): everything is driven by useCurrentFrame(); no useFrame(); textures load through Suspense.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { E, prog, lerp, MONO } from "./Film2";

export const FPS9 = 60, DUR9 = 11;
const BARS = [[[171, 21], [171, 66], [22, 170], [22, 128]], [[171, 88], [171, 136], [46, 222], [46, 176]]];
const SW = 6.4, SH = SW * 1238 / 1862, SD = 0.22; // container: Solt hero aspect, real depth

// ---------------------------------------------------------------- camera path (spherical, around the container)
// az: 0 = in front, 180 = behind. el: + above, − below. Each act is one eased move; holds sit between acts.
type Cam = { az: number; el: number; r: number; ty: number };
const cam = (s: number): Cam => {
  const a = prog(s, 1.3, 4.7, E.io);          // under: front → below → behind
  const b = prog(s, 4.7, 6.3, E.io);          // hold behind, slow drift
  const c = prog(s, 6.3, 9.0, E.io);          // over the top → front again (360° done)
  const d = prog(s, 9.0, 10.6, E.in);         // dive into the screen
  let az = 180 * a + 14 * b + (360 - 194) * c;
  let el = -74 * Math.sin(Math.PI * a) + 8 * b - 8 * b * c + 62 * Math.sin(Math.PI * c);
  let r = 9.2 - 2.2 * Math.sin(Math.PI * a) + 0.4 * b - 0.4 * c + 1.6 * Math.sin(Math.PI * c);
  r = lerp(r - prog(s, 0, 1.3, E.out) * 0.6, 0.55, d); // slow push in the opening hold, then the dive
  if (s < 1.3) el = 4 * (1 - prog(s, 0, 1.3, E.io));
  return { az, el, r, ty: 0 };
};

const CameraRig: React.FC<{ s: number }> = ({ s }) => {
  const { camera } = useThree();
  const c = cam(s);
  const az = THREE.MathUtils.degToRad(c.az), el = THREE.MathUtils.degToRad(c.el);
  camera.position.set(c.r * Math.cos(el) * Math.sin(az), c.r * Math.sin(el), c.r * Math.cos(el) * Math.cos(az));
  camera.up.set(0, 1, 0);
  camera.lookAt(0, c.ty, 0);
  (camera as THREE.PerspectiveCamera).near = 0.05;
  camera.updateProjectionMatrix();
  return null;
};

// ---------------------------------------------------------------- environment: a soft studio for metal reflections
const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    scene.background = new THREE.Color("#060608");
    scene.fog = new THREE.Fog("#060608", 11, 26);
  }, [gl, scene]);
  return null;
};

// ---------------------------------------------------------------- back face: the build (grid, code, emblem outline)
const useBackTexture = () => {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  const [h] = useState(() => delayRender("back texture"));
  useEffect(() => {
    document.fonts.load("500 40px JBMono").then(() => {
      const W = 2048, H = Math.round(W * SH / SW), cv = document.createElement("canvas");
      cv.width = W; cv.height = H;
      const g = cv.getContext("2d")!;
      const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, "#17181c"); bg.addColorStop(1, "#0c0d10");
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      // 12-col grid + baseline
      g.strokeStyle = "rgba(220,222,228,.10)"; g.lineWidth = 2;
      for (let i = 0; i <= 12; i++) { const x = 120 + i * (W - 240) / 12; g.beginPath(); g.moveTo(x, 90); g.lineTo(x, H - 90); g.stroke(); }
      for (let y = 90; y < H - 80; y += 48) { g.strokeStyle = "rgba(220,222,228,.045)"; g.beginPath(); g.moveTo(120, y); g.lineTo(W - 120, y); g.stroke(); }
      // wireframe blocks (the hero's layout, mirrored as seen from behind)
      g.strokeStyle = "rgba(230,232,238,.55)"; g.lineWidth = 3;
      const box = (x: number, y: number, w: number, hh: number) => { g.strokeRect(W - x - w, y, w, hh); };
      box(120, 150, 300, 46); box(W - 640, 150, 520, 46); box(280, 330, 1490, 300); box(620, 690, 810, 60); box(860, 800, 330, 84);
      g.setLineDash([10, 10]); box(170, 940, 1708, 200); g.setLineDash([]);
      // code column
      g.font = "500 30px JBMono"; g.fillStyle = "rgba(210,212,220,.62)";
      const code = ["<section class=\"hero\">", "  <nav> … </nav>", "  <h1>Solt</h1>", "  <p class=\"lede\">…</p>", "  <a class=\"cta\">Book</a>", "</section>", "", ".hero { grid: 12 / 1fr; }", ".cta  { radius: 999px; }"];
      code.forEach((l, i) => g.fillText(l, 150, 380 + i * 46));
      // label
      g.font = "500 26px JBMono"; g.fillStyle = "rgba(220,222,228,.75)";
      g.fillText("OBSIDIAN — BUILT FROM SCRATCH", W - 690, H - 110);
      g.fillText("01 / SOLT · REAR", 150, H - 110);
      const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
      setTex(t); continueRender(h);
    });
  }, [h]);
  return tex;
};

// ---------------------------------------------------------------- emblem, extruded (silver)
const Emblem3D: React.FC<{ size: number; depth: number }> = ({ size, depth }) => {
  const geo = useMemo(() => {
    const k = size / 245;
    const shapes = BARS.map((b) => new THREE.Shape(b.map(([x, y]) => new THREE.Vector2((x - 100) * k, (122 - y) * k))));
    const gm = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: depth * 0.25, bevelSize: depth * 0.18, bevelSegments: 3 });
    gm.translate(0, 0, -depth / 2);
    return gm;
  }, [size, depth]);
  return <mesh geometry={geo}><meshPhysicalMaterial color="#e9eaee" metalness={1} roughness={0.22} clearcoat={0.6} /></mesh>;
};

// ---------------------------------------------------------------- the container
const Container: React.FC<{ hero: string; back: THREE.Texture | null; glow: number }> = ({ hero, back, glow }) => {
  const tex = useLoader(THREE.TextureLoader, staticFile(hero));
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const frame = useMemo(() => new RoundedBoxGeometry(SW + 0.16, SH + 0.16, SD, 6, 0.07), []);
  return (
    <group>
      <mesh geometry={frame}><meshPhysicalMaterial color="#1b1c21" metalness={1} roughness={0.34} clearcoat={0.5} clearcoatRoughness={0.25} /></mesh>
      {/* front: the live site */}
      <mesh position={[0, 0, SD / 2 + 0.002]}>
        <planeGeometry args={[SW, SH]} />
        <meshBasicMaterial map={tex} toneMapped={false} color={new THREE.Color(1 + glow, 1 + glow, 1 + glow)} />
      </mesh>
      {/* back: the build */}
      {back && <mesh position={[0, 0, -SD / 2 - 0.002]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[SW, SH]} />
        <meshStandardMaterial map={back} metalness={0.35} roughness={0.55} />
      </mesh>}
      <group position={[SW * 0.26, -SH * 0.02, -SD / 2 - 0.03]} rotation={[0, Math.PI, 0]}><Emblem3D size={1.25} depth={0.06} /></group>
      {/* underside light strip: tells the eye there is a bottom edge with thickness */}
      <mesh position={[0, -SH / 2 - 0.081, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[SW * 0.9, 0.035]} />
        <meshBasicMaterial color="#d8dae0" toneMapped={false} />
      </mesh>
    </group>
  );
};

// other sites floating in the dark: parallax proves the camera really moves through space
const FIELD = [
  { f: "heroes2/h10_irona.jpg", p: [-9, 2.2, -7], r: [0, 0.5, 0] }, { f: "heroes2/h11_villa.jpg", p: [8.5, -1.6, -8], r: [0, -0.45, 0] },
  { f: "heroes2/h07_mindful.jpg", p: [-7.5, -3.2, 6.5], r: [0, 2.4, 0] }, { f: "heroes2/h09_fern.jpg", p: [7.8, 2.8, 7.5], r: [0, -2.5, 0] },
  { f: "heroes2/h05_amplify.jpg", p: [0.5, -6.8, -3], r: [-1.3, 0, 0] }, { f: "heroes2/h12_aigreen.jpg", p: [-1.5, 6.6, 3], r: [1.25, 0, 0] },
];
const Floater: React.FC<{ f: string; p: number[]; r: number[] }> = ({ f, p, r }) => {
  const tex = useLoader(THREE.TextureLoader, staticFile(f));
  tex.colorSpace = THREE.SRGBColorSpace;
  const w = 3.2, h = w * 0.75;
  return (
    <group position={p as [number, number, number]} rotation={r as [number, number, number]}>
      <mesh><boxGeometry args={[w + 0.08, h + 0.08, 0.1]} /><meshPhysicalMaterial color="#1b1c21" metalness={1} roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.052]}><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} toneMapped={false} color="#9a9a9a" /></mesh>
    </group>
  );
};

// ---------------------------------------------------------------- film
export const Film9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const s = frame / fps;
  const back = useBackTexture();
  const glow = prog(s, 9.6, 10.6, E.in) * 1.6;
  const tag = (t: string, a: number, b: number) => {
    const k = prog(s, a, a + 0.35) * (1 - prog(s, b, b + 0.3, E.in));
    return k > 0 ? <div style={{ position: "absolute", left: 96, top: 72, fontFamily: MONO, fontSize: 18, letterSpacing: "0.16em", color: "rgba(220,222,228,.8)", opacity: k, filter: `blur(${(1 - k) * 6}px)` }}>{t}</div> : null;
  };
  const white = prog(s, 10.35, 10.75, E.io);
  return (
    <AbsoluteFill style={{ background: "#060608" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 34, position: [0, 0, 9] }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <Env />
        <CameraRig s={s} />
        <ambientLight intensity={0.08} />
        <directionalLight position={[-6, 8, 7]} intensity={1.6} />
        <directionalLight position={[5, 3, -8]} intensity={1.1} />
        <directionalLight position={[0, -9, 2]} intensity={0.25} />
        <Container hero="heroes2/h03_solt.jpg" back={back} glow={glow} />
        {FIELD.map((x) => <Floater key={x.f} {...x} />)}
        <gridHelper args={[60, 60, "#2a2b30", "#16171b"]} position={[0, -7.5, 0]} />
      </ThreeCanvas>
      {tag("01 — FRONT · THE SITE", 0.2, 1.4)}
      {tag("02 — UNDERSIDE · 22 MM OF FRAME", 2.3, 3.7)}
      {tag("03 — REAR · THE BUILD", 4.9, 6.4)}
      {tag("04 — OVER THE TOP · 360°", 7.0, 8.6)}
      <AbsoluteFill style={{ background: "#fff", opacity: white }} />
    </AbsoluteFill>
  );
};
