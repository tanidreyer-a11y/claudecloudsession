// Local fonts (Google Fonts is blocked at render time): Bricolage Grotesque (display), Red Hat Mono (code), Inter (UI).
import { continueRender, delayRender, staticFile } from "remotion";
const handle = delayRender("fonts");
const L = [
  new FontFace("Bricolage", `url(${staticFile("fonts/bricolage-grotesque-latin-wght-normal.woff2")}) format("woff2")`, { weight: "200 800" }),
  new FontFace("RedHatMono", `url(${staticFile("fonts/red-hat-mono-latin-wght-normal.woff2")}) format("woff2")`, { weight: "300 700" }),
  ...[400, 500].map((w) => new FontFace("JBMono", `url(${staticFile(`fonts/jetbrains-mono-latin-${w}-normal.woff2`)}) format("woff2")`, { weight: String(w) })),
  new FontFace("ArchivoW", `url(${staticFile("fonts/archivo-latin-wdth-normal.woff2")}) format("woff2")`, { weight: "100 900", stretch: "62% 125%" }),
  new FontFace("InstSerif", `url(${staticFile("fonts/instrument-serif-italic.ttf")}) format("truetype")`, { style: "italic", weight: "400" }),
  // Level 5 / Motion-as-Code kits (OFL, via fontsource): titles, captions/UI, data, emotional serif, plotter-era serif
  ...[700, 900].map((w) => new FontFace("Unbounded", `url(${staticFile(`fonts/unbounded-latin-${w}-normal.woff2`)}) format("woff2")`, { weight: String(w) })),
  ...[400, 500, 700].map((w) => new FontFace("SpaceGrotesk", `url(${staticFile(`fonts/space-grotesk-latin-${w}-normal.woff2`)}) format("woff2")`, { weight: String(w) })),
  ...[400, 500].map((w) => new FontFace("PlexMono", `url(${staticFile(`fonts/ibm-plex-mono-latin-${w}-normal.woff2`)}) format("woff2")`, { weight: String(w) })),
  ...[500, 600].flatMap((w) => (["normal", "italic"] as const).map((st) => new FontFace("Cormorant", `url(${staticFile(`fonts/cormorant-garamond-latin-${w}-${st}.woff2`)}) format("woff2")`, { weight: String(w), style: st }))),
  new FontFace("InstSerifR", `url(${staticFile("fonts/instrument-serif-latin-400-normal.woff2")}) format("woff2")`, { weight: "400" }),
  ...[300, 400, 500, 600].map((w) => new FontFace("Inter", `url(${staticFile(`fonts/inter-latin-${w}-normal.woff2`)}) format("woff2")`, { weight: String(w) })),
];
Promise.all(L.map((f) => f.load())).then((fs) => { fs.forEach((f) => (document.fonts as unknown as { add: (x: FontFace) => void }).add(f)); continueRender(handle); })
  .catch((e) => { console.error(e); continueRender(handle); });
