// Brand fonts from public/fonts (local: Google Fonts is blocked at render time).
// Aileron = KK headings (brand: Aileron Extra Bold / Black). Poppins = KK body. Archivo (wide) stands in for Helios Extended.
import { continueRender, delayRender, staticFile } from "remotion";
const FILES: [string, string, string][] = [
  ["Aileron", "400", "aileron-latin-400-normal.woff2"], ["Aileron", "600", "aileron-latin-600-normal.woff2"],
  ["Aileron", "700", "aileron-latin-700-normal.woff2"], ["Aileron", "800", "aileron-latin-800-normal.woff2"],
  ["Poppins", "400", "poppins-latin-400-normal.woff2"], ["Poppins", "500", "poppins-latin-500-normal.woff2"], ["Poppins", "600", "poppins-latin-600-normal.woff2"],
];
const handle = delayRender("fonts");
const loads = FILES.map(([fam, w, f]) => new FontFace(fam, `url(${staticFile("fonts/" + f)}) format("woff2")`, { weight: w }).load());
loads.push(new FontFace("ArchivoW", `url(${staticFile("fonts/archivo-latin-wdth-normal.woff2")}) format("woff2")`, { weight: "100 900", stretch: "62% 125%" }).load());
Promise.all(loads).then((fs) => { fs.forEach((ff) => (document.fonts as unknown as { add: (x: FontFace) => void }).add(ff)); continueRender(handle); })
  .catch((e) => { console.error(e); continueRender(handle); });
