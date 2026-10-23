// Capture UI automatically: a screenshot and a short screen recording (MP4) per page. No manual recording.
// usage: node capture_ui.cjs shots.json out_dir
// shots.json: [{"name": "1-design", "url": "https://...", "width": 1600, "height": 900, "dark": true, "wait": 1500,
//               "seconds": 5, "hide": ["#cookie-banner"],
//               "actions": [{"scroll": 900, "ms": 2500}, {"hover": "css selector"}, {"click": "css selector"}, {"wait": 800}]}]
// A page that cannot be reached writes <name>.FAILED.txt with the reason: never fake a capture.
const fs = require("fs"), path = require("path"), { execSync } = require("child_process");
let pw; try { pw = require("playwright"); } catch { pw = require(path.join(execSync("npm root -g").toString().trim(), "playwright")); }
const FF = process.env.FFMPEG || "ffmpeg";
const [spec, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
(async () => {
  // full Chromium (not the headless shell): it reads the system NSS store, where a proxy CA is installed in cloud sessions
  const exe = process.env.CHROME || ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find(p => fs.existsSync(p));
  const browser = await pw.chromium.launch(exe ? { executablePath: exe } : { channel: "chromium" });
  for (const s of JSON.parse(fs.readFileSync(spec, "utf8"))) {
    const W = s.width || 1600, H = s.height || 900, tmp = fs.mkdtempSync(path.join(out, ".rec-"));
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, colorScheme: s.dark === false ? "light" : "dark", recordVideo: { dir: tmp, size: { width: W, height: H } } });
    const t0 = Date.now(), page = await ctx.newPage();
    try {
      await page.goto(s.url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => page.goto(s.url, { waitUntil: "load", timeout: 45000 }));
      if (s.hide) await page.addStyleTag({ content: s.hide.join(",") + "{display:none!important}" });
      await page.waitForTimeout(s.wait || 1500);
      await page.screenshot({ path: path.join(out, s.name + ".png") });
      const start = (Date.now() - t0) / 1000; const end = Date.now() + (s.seconds || 5) * 1000;
      for (const a of s.actions || [{ scroll: 900, ms: 3000 }]) {
        if (a.scroll) { const steps = Math.max(1, Math.round((a.ms || 2000) / 40)); for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, a.scroll / steps); await page.waitForTimeout(40); } }
        if (a.hover) await page.hover(a.hover).catch(() => {});
        if (a.click) await page.click(a.click).catch(() => {});
        if (a.wait) await page.waitForTimeout(a.wait);
      }
      const left = end - Date.now(); if (left > 0) await page.waitForTimeout(left);
      await ctx.close(); const webm = fs.readdirSync(tmp).find(f => f.endsWith(".webm"));
      execSync(`${FF} -v error -y -ss ${start.toFixed(2)} -t ${s.seconds || 5} -i "${path.join(tmp, webm)}" -c:v libx264 -crf 18 -pix_fmt yuv420p -r 30 -an "${path.join(out, s.name + ".mp4")}"`);
      console.log("ok", s.name, s.url);
    } catch (e) { await ctx.close().catch(() => {}); fs.writeFileSync(path.join(out, s.name + ".FAILED.txt"), `${s.url}\n${String(e).slice(0, 400)}\n`); console.log("FAILED", s.name, s.url, String(e).split("\n")[0]); }
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  await browser.close();
})();
