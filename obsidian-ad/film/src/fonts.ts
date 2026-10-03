// The site's own fonts (OFL, variable): Bricolage Grotesque + Red Hat Mono, loaded from public/fonts.
import { continueRender, delayRender, staticFile } from "remotion";
const FILES = [
  { family: "Bricolage Grotesque", file: "fonts/bricolage-grotesque-latin-wght-normal.woff2", weight: "200 800" },
  { family: "Red Hat Mono", file: "fonts/red-hat-mono-latin-wght-normal.woff2", weight: "300 700" },
];
const handle = delayRender("fonts");
Promise.all(
  FILES.map((f) => new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2-variations")`, { weight: f.weight }).load().then((ff) => (document.fonts as unknown as { add: (x: FontFace) => void }).add(ff))),
)
  .then(() => continueRender(handle))
  .catch((e) => { console.error(e); continueRender(handle); });
