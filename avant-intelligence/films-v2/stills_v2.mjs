// node stills.mjs <film.html> <out.jpg> <sec,sec,...>   — one browser, contact sheet 4 columns
import { chromium } from 'playwright';
import { execFileSync } from 'child_process';
const FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';
const [film, out, list] = process.argv.slice(2); const secs = list.split(',').map(Number);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + process.cwd() + '/' + film); await p.waitForFunction(() => window.READY);
const files = [];
for (const s of secs) { await p.evaluate(t => window.render(t), s); const f = `/tmp/claude-0/st_${s}.jpg`; await p.screenshot({ path: f, type: 'jpeg', quality: 85 }); files.push(f); }
await b.close();
const cols = 4, inputs = files.flatMap(f => ['-i', f]);
const lay = files.map((_, i) => `${(i % cols) ? Array.from({ length: i % cols }, () => 'w0').join('+') : 0}_${Math.floor(i / cols) ? Array.from({ length: Math.floor(i / cols) }, () => 'h0').join('+') : 0}`).join('|');
execFileSync(FF, ['-v', 'error', '-y', ...inputs, '-filter_complex', files.map((_, i) => `[${i}:v]scale=480:-2[v${i}]`).join(';') + ';' + files.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${files.length}:layout=${lay}[o]`, '-map', '[o]', out]);
console.log('sheet', out);
