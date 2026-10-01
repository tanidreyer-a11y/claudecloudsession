// Render check stills: FILM=film.html OUT=stills node stills.mjs 2 8.6 13.5 ...
import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';
const times = process.argv.slice(2).map(Number);
const OUT = process.env.OUT || 'stills'; mkdirSync(OUT, { recursive: true });
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync);
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + process.cwd() + '/' + (process.env.FILM || 'film.html'));
await p.waitForFunction(() => window.READY);
for (const t of times) { await p.evaluate(t => window.render(t), t); await p.screenshot({ path: `${OUT}/s_${t}.jpg`, type: 'jpeg', quality: 70 }); }
await b.close();
// Tile: ffmpeg $(for t in ...; do echo -i stills/s_$t.jpg; done) -filter_complex "xstack=inputs=N:grid=4x4,scale=1920:-1" sheet.jpg
