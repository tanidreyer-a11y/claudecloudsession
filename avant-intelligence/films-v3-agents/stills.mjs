// Render a contact sheet of stills with ONE bundle: node stills.mjs <CompId> <out.jpg> <sec,sec,...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import path from "node:path";
const [comp, out, list] = process.argv.slice(2);
const secs = list.split(",").map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.BROWSER || null;
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable });
const files = [];
for (const s of secs) {
  const f = `out/st_${comp}_${s}.jpg`;
  await renderStill({ serveUrl, composition, output: f, frame: Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps)), imageFormat: "jpeg", browserExecutable });
  files.push(f);
}
const FF = process.env.FFMPEG || "ffmpeg";
const cols = 4;
const w = 480;
const inputs = files.flatMap((f) => ["-i", f]);
const filter = files.map((_, i) => `[${i}:v]scale=${w}:-2[v${i}]`).join(";") + ";" + files.map((_, i) => `[v${i}]`).join("") + `xstack=inputs=${files.length}:layout=` + files.map((_, i) => `${(i % cols) ? Array.from({ length: i % cols }, () => "w0").join("+") : 0}_${Math.floor(i / cols) ? Array.from({ length: Math.floor(i / cols) }, () => "h0").join("+") : 0}`).join("|") + "[o]";
execFileSync(FF, ["-v", "error", "-y", ...inputs, "-filter_complex", filter, "-map", "[o]", out]);
console.log("sheet", out);
