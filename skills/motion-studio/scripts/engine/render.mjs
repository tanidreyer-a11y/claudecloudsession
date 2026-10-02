// Render film.html (window.render(t), window.DUR) to MP4 with audio.
// node render.mjs --film film.html --audio mix.wav --out film.mp4 [--fps 60 --blur]
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const has = k => process.argv.includes('--' + k);
const FILM = arg('film', 'film.html'), AUDIO = arg('audio', 'mix.wav'), OUT = arg('out', 'film.mp4');
const FPS = +arg('fps', has('blur') ? 60 : 30);
const FF = process.env.FFMPEG || 'ffmpeg';
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync);
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + process.cwd() + '/' + FILM);
await p.waitForFunction(() => window.READY);
const dur = await p.evaluate(() => window.DUR);
const vf = has('blur') ? ['-vf', 'tmix=frames=2,fps=30'] : [];
const ff = spawn(FF, ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', ...(existsSync(AUDIO) ? ['-i', AUDIO] : []),
  ...vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
const n = Math.ceil(dur * FPS);
for (let f = 0; f < n; f++) {
  await p.evaluate(t => window.render(t), f / FPS);
  const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 300 === 0) console.log(`frame ${f}/${n}`);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done', OUT);
