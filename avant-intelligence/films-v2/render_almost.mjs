import { chromium } from 'playwright';
import { spawn } from 'child_process';
const FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';
const FPS = 60;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + process.cwd() + '/avant_almost.html');
await p.waitForFunction(() => window.READY);
const dur = await p.evaluate(() => window.DUR);
const ff = spawn(FF, ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', 'avant_mix.wav',
  '-vf', 'tmix=frames=2,fps=30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart',
  'out/avant-almost-raw.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
const n = Math.ceil(dur * FPS);
for (let f = 0; f < n; f++) {
  await p.evaluate(t => render(t), f / FPS);
  const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 300 === 0) console.log(`frame ${f}/${n}`);
}
ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done');
