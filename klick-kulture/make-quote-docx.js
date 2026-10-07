const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType,
  BorderStyle, LevelFormat, PageOrientation, Footer, PageNumber, TabStopType,
} = require("docx");

const INK = "12151C", MUTED = "5D6574", ACCENT = "8607B3", LINE = "D9DCE3", SOFT = "F3F0F7";
const FONT = "Arial";

// **bold** parser
const runs = (text, opts = {}) => text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((t) =>
  t.startsWith("**") ? new TextRun({ text: t.slice(2, -2), bold: true, font: FONT, size: opts.size || 20, color: opts.color || INK })
    : new TextRun({ text: t, font: FONT, size: opts.size || 20, color: opts.color || INK, bold: opts.bold }));
const P = (text, o = {}) => new Paragraph({ children: runs(text, o), spacing: { after: o.after ?? 120, before: o.before ?? 0, line: 288 }, alignment: o.align });
const H = (text) => new Paragraph({ children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: ACCENT })], spacing: { before: 280, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: LINE, space: 4 } } });
const bullet = (text) => new Paragraph({ children: runs(text), numbering: { reference: "bul", level: 0 }, spacing: { after: 80, line: 288 } });
const num = (text, ref) => new Paragraph({ children: runs(text), numbering: { reference: ref, level: 0 }, spacing: { after: 80, line: 288 } });

const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: border, bottom: border, left: border, right: border };
function table(rows, widths, opts = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths,
    rows: rows.map((r, ri) => new TableRow({
      tableHeader: ri === 0,
      children: r.map((c, ci) => new TableCell({
        width: { size: widths[ci], type: WidthType.DXA }, borders,
        shading: ri === 0 ? { type: ShadingType.CLEAR, fill: INK, color: "auto" } : (opts.firstColShade && ci === 0 ? { type: ShadingType.CLEAR, fill: SOFT, color: "auto" } : undefined),
        margins: { top: 90, bottom: 90, left: 110, right: 110 },
        children: [new Paragraph({ children: ri === 0 ? [new TextRun({ text: c, bold: true, font: FONT, size: opts.size || 18, color: "FFFFFF" })] : runs(c, { size: opts.size || 18 }), spacing: { after: 0, line: 264 } })],
      })),
    })),
  });
}

const W = 9638; // A4 content width with 2 cm margins
const portrait = [];

// Title block
portrait.push(new Paragraph({ children: [new TextRun({ text: "OBSIDIAN", font: FONT, size: 22, bold: true, color: ACCENT, characterSpacing: 120 })], spacing: { after: 60 } }));
portrait.push(new Paragraph({ children: [new TextRun({ text: "Quote: Video Production", font: FONT, size: 40, bold: true, color: INK })], spacing: { after: 200 } }));
portrait.push(table([
  ["Prepared for", "From"],
  ["Klick Kulture · Maritca", "Obsidian · Nathaniel Dreyer\nWhatsApp 079 244 9607"],
].map((r, i) => i === 1 ? r : r), [W / 2, W / 2].map(Math.round)));
// fix the newline cell: rebuild second table properly
portrait.pop();
portrait.push(new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [4819, 4819],
  rows: [new TableRow({ children: [
    new TableCell({ width: { size: 4819, type: WidthType.DXA }, borders: { top: border, bottom: border, left: border, right: border }, shading: { type: ShadingType.CLEAR, fill: SOFT, color: "auto" }, margins: { top: 120, bottom: 120, left: 160, right: 160 },
      children: [P("**Prepared for**", { color: MUTED, size: 16, after: 40 }), P("Klick Kulture · Maritca", { after: 0 })] }),
    new TableCell({ width: { size: 4819, type: WidthType.DXA }, borders: { top: border, bottom: border, left: border, right: border }, shading: { type: ShadingType.CLEAR, fill: SOFT, color: "auto" }, margins: { top: 120, bottom: 120, left: 160, right: 160 },
      children: [P("**From**", { color: MUTED, size: 16, after: 40 }), P("Obsidian · Nathaniel Dreyer", { after: 0 }), P("WhatsApp 079 244 9607", { after: 0 })] }),
  ] })],
}));
portrait.push(P("**Quote no.:** KK-004   ·   **Date:** Wednesday, 7 October 2026   ·   **Valid until:** 21 October 2026", { before: 160, size: 18, color: MUTED }));
portrait.push(P("**Portfolio:** attached separately (Obsidian-Portfolio.html). The website links are preview deployments.", { size: 18, color: MUTED }));

portrait.push(H("Summary"));
portrait.push(table([
  ["Package", "Videos per month", "Price per video", "Monthly total"],
  ["**Essential**", "6–7", "R1,500", "R9,000 – R10,500"],
  ["**Growth**", "14–15", "R1,200 · swap up to 3 for Signature at +R800 each", "R16,800 – R18,000 (max R20,400 with 3 Signature)"],
  ["**Signature**", "6–7", "R2,500", "R15,000 – R17,500"],
  ["**Single project**", "1", "Essential R3,500 · Signature R5,000", "—"],
], [1900, 1500, 3238, 3000], { firstColShade: true }));
portrait.push(P("**Five key points**", { before: 200, after: 80 }));
[
  "Monthly packages run for a minimum of **5 months**, paid upfront each month.",
  "Briefs are due by the **25th** of the previous month.",
  "One **pilot video** is approved first each month, so the look is right before the rest.",
  "All changes are sent **together in one list**, within 5 working days.",
  "Videos are delivered by the **15th** (Growth: in two batches, by the 15th and by the last day of the month).",
].forEach((t) => portrait.push(num(t, "n1")));

portrait.push(H("The two styles"));
portrait.push(bullet("**Essential:** clean, branded motion design with script, voiceover and sound. Delivered in **3 formats**: landscape (16:9), vertical (9:16) and square (1:1)."));
portrait.push(bullet("**Signature:** a cinematic, story-led film with custom transitions, vivid colour and full sound design, made for companies that have built a strong reputation and want their videos to match it (see the Signature series in the portfolio). Delivered in **2 formats**: landscape (16:9) and vertical (9:16). Square (1:1) available at R350 per video."));

portrait.push(H("Package details"));
portrait.push(table([
  ["", "Essential", "Growth", "Signature"],
  ["**Videos per month**", "6–7", "14–15, of which up to 3 can be Signature", "6–7"],
  ["**Changes per video**", "2 rounds", "1 round", "1 round"],
  ["**Delivery**", "by the 15th", "two batches: by the 15th and by the last day of the month", "by the 15th"],
  ["**Minimum term**", "5 months", "5 months", "5 months"],
], [2200, 2246, 2946, 2246], { firstColShade: true }));
portrait.push(P("**How the Growth swap works:** the base price covers 14 or 15 Essential videos (R16,800 or R18,000). For each video you'd like as a Signature film, add R800, up to 3 per month. Example: 15 videos with 2 Signature = R18,000 + R1,600 = R19,600.", { before: 160 }));

portrait.push(H("Every video includes"));
["A video of up to 60 seconds, designed for the client's brand (no templates)", "Script written for the video",
  "Professional voiceover (where the video uses one), music and sound design", "Formats as per the style (Essential: 3 · Signature: 2)"].forEach((t) => portrait.push(bullet(t)));

portrait.push(H("Included in every monthly package"));
portrait.push(bullet("A **30-minute planning call** at the start of each month to plan the videos together"));
portrait.push(bullet("A **reserved production slot**: your videos are scheduled first each month"));

portrait.push(H("How each month works"));
[
  "**Brief by the 25th** of the previous month, using the brief form. Videos without a brief move to the next month.",
  "**Pilot (days 1–3):** one video is made first and approved. It sets the look, voice and tone for the month.",
  "**Production (days 4–10):** the remaining videos are produced in one batch.",
  "**Feedback (days 11–15):** all changes sent together in one list, within 5 working days. After that, the videos are treated as approved.",
  "**Delivery by the 15th:** all videos, named and in one shared folder, ready to schedule.",
].forEach((t) => portrait.push(num(t, "n2")));
portrait.push(P("**Growth package:** the month runs as two batches of 7–8 videos. Batch 1 follows the steps above; batch 2 is produced on days 16–25, with feedback by day 28 and delivery by the last day of the month.", { before: 120 }));

portrait.push(H("For product-based clients"));
portrait.push(P("Videos featuring a physical product (food, packaging, retail) need **high-resolution product photos** supplied by the client, ideally on a plain background. Scenes and motion are designed around these. Product photography can be arranged and quoted separately."));

portrait.push(H("Terms"));
[
  "**Payment:** monthly fees are payable upfront, before production starts. Single projects: 50% to start, 50% on delivery.",
  "**Volume:** each package covers its monthly volume (Essential and Signature up to 7, Growth up to 15 with a maximum of 3 Signature). Extra videos are quoted at the single-project rate, subject to availability.",
  "**Unused videos** don't roll over to the next month.",
  "**Changes:** rounds per video as per the package; single projects include 2 rounds. Extra rounds: R350 per video. A new direction after the pilot is approved counts as a new video.",
  "**Scripts:** one script per video, shared by all its formats. A separate script per format is quoted separately.",
  "**Rush delivery** (under 5 working days) is quoted separately.",
  "**Communication:** messages are answered within 1 working day, Monday to Friday.",
  "**Ending the agreement:** either side can end it after the 5-month minimum term with 30 days' written notice.",
  "**Not included:** paid ad spend, product photography, stock licences beyond what is supplied, website work (quoted separately).",
  "**Ownership:** the client owns the final videos once paid. Obsidian may show them in its portfolio unless agreed otherwise.",
].forEach((t) => portrait.push(bullet(t)));

portrait.push(H("Acceptance"));
portrait.push(P("**Prepared by:** Nathaniel Dreyer, Obsidian", { before: 120, after: 360 }));
portrait.push(new Paragraph({ children: [new TextRun({ text: "Accepted by: ", font: FONT, size: 20, bold: true, color: INK }), new TextRun({ text: "\t", font: FONT }), new TextRun({ text: "   Date: ", font: FONT, size: 20, bold: true, color: INK }), new TextRun({ text: "\t", font: FONT })],
  tabStops: [{ type: TabStopType.LEFT, position: 6000, leader: "underscore" }, { type: TabStopType.LEFT, position: 9600, leader: "underscore" }], spacing: { after: 120 } }));

// Landscape section: brief form
const LW = 16838 - 2 * 1134; // 14570
const briefCols = [600, 1900, 1500, 2200, 2400, 1700, 2070, 1200, 1000];
const landscape = [
  new Paragraph({ children: [new TextRun({ text: "OBSIDIAN", font: FONT, size: 22, bold: true, color: ACCENT, characterSpacing: 120 })], spacing: { after: 60 } }),
  new Paragraph({ children: [new TextRun({ text: "Monthly brief form", font: FONT, size: 32, bold: true, color: INK })], spacing: { after: 80 } }),
  P("One row per video. Due by the 25th of the previous month. Growth: up to 15 rows.", { color: MUTED, size: 18, after: 200 }),
  table([["#", "Client", "Essential or Signature", "Goal of the video", "Key message (one line)", "Call to action", "Assets (logo, colours, photos)", "Publish date", "Time-sensitive?"],
    ...Array.from({ length: 15 }, (_, i) => [String(i + 1), "", "", "", "", "", "", "", ""])], briefCols, { size: 16 }),
];

const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  new TextRun({ text: "Obsidian · Nathaniel Dreyer · Quote KK-004 · Page ", font: FONT, size: 16, color: MUTED }),
  new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: MUTED })] })] });

const doc = new Document({
  creator: "Nathaniel Dreyer", title: "Obsidian Quote KK-004 — Klick Kulture",
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  numbering: { config: [
    { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] },
    { reference: "n1", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 300 } } } }] },
    { reference: "n2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 300 } } } }] },
  ] },
  sections: [
    { properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, footers: { default: footer }, children: portrait },
    { properties: { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, footers: { default: footer }, children: landscape },
  ],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(process.argv[2], b); console.log("written", b.length); });
