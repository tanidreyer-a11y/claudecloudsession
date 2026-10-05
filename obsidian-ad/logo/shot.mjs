import { chromium } from '/home/user/claudecloudsession/adc-innovations/build/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1800, height: 1040 } });
await p.goto('file://' + process.cwd() + '/concepts.html'); await p.waitForTimeout(600);
await p.screenshot({ path: 'logo-concepts-v1.png', fullPage: true }); await b.close();
