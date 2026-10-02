// Fonts load from LOCAL files in public/fonts (works offline, in sandboxes and on laptops) — OFL fonts only, or the
// client's licensed font. Get files with `npm i @fontsource/<font>` and copy the needed woff2 weights into
// public/fonts/ (see README). On a laptop with internet you may use @remotion/google-fonts instead.
import { continueRender, delayRender, staticFile } from "remotion";

export const FONT_FILES: { family: string; weight: string; file: string }[] = [
  { family: "Inter", weight: "400", file: "fonts/inter-latin-400-normal.woff2" },
  { family: "Inter", weight: "600", file: "fonts/inter-latin-600-normal.woff2" },
  { family: "Inter", weight: "700", file: "fonts/inter-latin-700-normal.woff2" },
  { family: "Inter", weight: "800", file: "fonts/inter-latin-800-normal.woff2" },
];

const handle = delayRender("fonts");
Promise.all(
  FONT_FILES.map((f) => {
    const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, { weight: f.weight });
    return face.load().then((loaded) => (document.fonts as unknown as { add: (f: FontFace) => void }).add(loaded));
  }),
)
  .then(() => continueRender(handle))
  .catch((e) => { console.error(e); continueRender(handle); });
