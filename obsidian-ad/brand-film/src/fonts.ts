// Local fonts (Google Fonts is blocked at render time): Bricolage Grotesque (display), Red Hat Mono (code), Inter (UI).
import { continueRender, delayRender, staticFile } from "remotion";
const handle = delayRender("fonts");
const L = [
  new FontFace("Bricolage", `url(${staticFile("fonts/bricolage-grotesque-latin-wght-normal.woff2")}) format("woff2")`, { weight: "200 800" }),
  new FontFace("RedHatMono", `url(${staticFile("fonts/red-hat-mono-latin-wght-normal.woff2")}) format("woff2")`, { weight: "300 700" }),
  ...[300, 400, 500, 600].map((w) => new FontFace("Inter", `url(${staticFile(`fonts/inter-latin-${w}-normal.woff2`)}) format("woff2")`, { weight: String(w) })),
];
Promise.all(L.map((f) => f.load())).then((fs) => { fs.forEach((f) => (document.fonts as unknown as { add: (x: FontFace) => void }).add(f)); continueRender(handle); })
  .catch((e) => { console.error(e); continueRender(handle); });
