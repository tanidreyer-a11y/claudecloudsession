import { chromium } from 'playwright';
const times = process.argv.slice(2).map(Number);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + process.cwd() + '/' + (process.env.FILM || 'film.html'));
await p.waitForFunction(() => window.READY);
for (const t of times) { await p.evaluate(t => render(t), t); await p.screenshot({ path: `/tmp/claude-0/-home-user-claudecloudsession/c4a5069d-a34a-58d2-a335-0631d389d9ef/scratchpad/s_${t}.jpg`, type: 'jpeg', quality: 70 }); }
await b.close();
