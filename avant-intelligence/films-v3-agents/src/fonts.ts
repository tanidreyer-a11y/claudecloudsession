// Inter (OFL) from public/fonts — local files, Google Fonts is blocked at render time.
import { continueRender, delayRender, staticFile } from "remotion";
const FILES = [400, 500, 600].map((w) => ({ w, file: `fonts/inter-latin-${w}-normal.woff2` }));
const handle = delayRender("fonts");
Promise.all(FILES.map((f) => new FontFace("Inter", `url(${staticFile(f.file)}) format("woff2")`, { weight: String(f.w) }).load().then((ff) => (document.fonts as unknown as { add: (x: FontFace) => void }).add(ff))))
  .then(() => continueRender(handle)).catch((e) => { console.error(e); continueRender(handle); });
