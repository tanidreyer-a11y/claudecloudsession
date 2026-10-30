# Obsidian brand bible: 9 pages (1920 x 1080 JPG) from HTML, rendered with headless Chrome. usage: python3 -I build.py <out_dir>
# Sources of truth: brands/obsidian.md (palette 2026-10-17, logo rules 2026-10-10), library/styles/obsidian-glow.md (2026-10-20),
# obsidian-ad/brand-film/src/fx/core.ts LOOKS.lumen. Logo files: <out_dir>/logo (white/black lockup PNG keyed from the official
# lockup, emblem SVG from the brand file's bar geometry).
import os, sys, subprocess
from PIL import Image
OUT = os.path.abspath(sys.argv[1]); PAGES = os.path.join(OUT, "pages"); os.makedirs(PAGES, exist_ok=True)
R = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
FONTS = f"{R}/.claude/skills/obsidian-content/assets/fonts"; PHOTO = f"{R}/.claude/skills/obsidian-content/assets/people/nathaniel.jpg"
OLD = f"{R}/skills/motion-studio/brands/obsidian-assets/obsidian_emblem.png"
CHROME = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
W, H = 1920, 1080; LOGO = f"{OUT}/logo"; N = 9
BARS = [[[171, 21], [171, 66], [22, 170], [22, 128]], [[171, 88], [171, 136], [46, 222], [46, 176]]]
def emblem(h, fill="#F4F5F7", style=""):
    pts = "".join('<polygon points="%s" fill="%s"/>' % (" ".join(f"{x},{y}" for x, y in b), fill) for b in BARS)
    return f'<svg viewBox="0 0 200 245" style="height:{h}px;width:{h*200/245:.1f}px;{style}">{pts}</svg>'
CSS = f"""
@font-face {{ font-family: A; src: url('file://{FONTS}/archivo-latin-wdth-normal.woff2'); font-weight: 100 900; font-stretch: 62% 125%; }}
@font-face {{ font-family: M; src: url('file://{FONTS}/jetbrains-mono-latin-400-normal.woff2'); }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
html, body {{ width: {W}px; height: {H}px; overflow: hidden; background: #0A0A0C; font-family: A, sans-serif; color: #C4C6CD; -webkit-font-smoothing: antialiased; }}
.glow {{ position: absolute; inset: 0; background: radial-gradient(70% 62% at var(--gx, 80%) 112%, #FFFFFF 0%, rgba(255,255,255,.9) 22%, rgba(220,224,228,.5) 44%, rgba(150,158,166,.16) 66%, rgba(0,0,0,0) 86%), radial-gradient(60% 34% at calc(100% - var(--gx, 80%)) -10%, rgba(255,255,255,.10), rgba(0,0,0,0) 70%); }}
.grain {{ position: absolute; inset: 0; opacity: .28; mix-blend-mode: overlay; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='.33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 0 1'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }}
.page {{ position: absolute; inset: 0; padding: 96px 120px; }}
.kick {{ font-size: 24px; color: #8E919B; letter-spacing: .01em; }}
.title {{ font-size: 76px; font-weight: 650; font-stretch: 112%; letter-spacing: -0.03em; line-height: 1.02; margin-top: 14px;
         background: linear-gradient(180deg, #FFFFFF, #A9ADB6); -webkit-background-clip: text; color: transparent; }}
.body {{ font-size: 28px; line-height: 1.45; color: #C4C6CD; }}
.small {{ font-size: 20px; line-height: 1.4; color: #8E919B; }}
.foot {{ position: absolute; left: 120px; right: 120px; bottom: 54px; display: flex; justify-content: space-between; align-items: center; font-size: 20px; color: #0B0C0E; }}
.foot .b {{ display: flex; align-items: center; gap: 12px; font-weight: 600; font-stretch: 112%; }}
.panel {{ border-radius: 28px; border: 1.5px solid rgba(255,255,255,.14); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }}
.cap {{ font-size: 20px; color: #8E919B; margin-top: 14px; }}
.sw {{ border-radius: 22px; height: 210px; position: relative; border: 1.5px solid rgba(255,255,255,.3); }}
.swl {{ margin-top: 14px; font-size: 22px; color: #F4F5F7; font-weight: 600; }} .swh {{ font-family: M; font-size: 18px; color: #A3A6AF; margin-top: 4px; }} .swr {{ font-size: 18px; color: #8E919B; margin-top: 4px; }}
.dont {{ position: absolute; top: 14px; left: 16px; font-size: 18px; color: #F4F5F7; background: rgba(10,10,12,.7); padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,.25); }}
"""
def foot(i, ink="#0B0C0E"):
    return f'<div class="foot" style="color:{ink}"><div class="b">{emblem(26, ink)}Obsidian brand bible</div><div>{i:02d} / {N:02d}</div></div>'
def page(i, inner, gx="80%", ink=None, glow=True):
    ink = ink or "#8E919B"   # mid grey reads on the dark half and on the glow half of the footer line
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body><div class='glow' style='--gx:{gx};{'' if glow else 'display:none'}'></div><div class='grain'></div><div class='page'>{inner}</div>{foot(i, ink)}</body></html>"
def rgb(hx): return ", ".join(str(int(hx[k:k + 2], 16)) for k in (1, 3, 5))
def sw(hx, name, role, extra=""):
    return f'<div><div class="sw" style="background:{hx};{extra}"></div><div class="swl">{name}</div><div class="swh">{hx} · RGB {rgb(hx)}</div><div class="swr">{role}</div></div>'
P = []
# 1 cover
P.append(page(1, f"""<div style="position:absolute;left:0;right:0;top:300px;text-align:center">
  <img src="file://{LOGO}/obsidian-lockup-white.png" style="width:980px">
  <div class="title" style="font-size:92px;margin-top:70px">Brand bible</div>
  <div class="body" style="margin-top:20px;color:#A3A6AF">Version 1.0 · 30 October 2026</div></div>
  <div style="position:absolute;left:0;right:0;bottom:150px;text-align:center;font-size:30px;color:#0B0C0E;font-weight:600">Digital precision that builds reputation.</div>""", gx="50%"))
# 2 who we are
P.append(page(2, f"""<div style="width:980px"><div class="kick">The brand</div><div class="title">Who we are</div>
  <div class="body" style="margin-top:40px">Obsidian is a creative studio for the web: front-end design and UI/UX, scroll-scrub animated websites and 3D interactive websites.</div>
  <div class="body" style="margin-top:26px">We build for established businesses whose website does not show the quality of the work they actually do. Two competitors, same service, same price: the market assumes the one with the premium presence brings more value. Perception is the product.</div>
  <div class="kick" style="margin-top:46px">Voice</div>
  <div class="body" style="margin-top:12px;color:#F4F5F7">Plain, confident, premium. Never pitch on price. Never present our work as template work.</div>
  <div class="body" style="margin-top:12px;color:#F4F5F7">"Websites don't just sit still. They tell a story and reflect quality and reputation."</div></div>
  <div style="position:absolute;right:150px;top:210px">{emblem(520)}</div>""", gx="78%"))
# 3 logo versions
P.append(page(3, f"""<div class="kick">Logo</div><div class="title">The lockup and the emblem</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:36px;margin-top:50px">
   <div><div class="panel" style="height:290px;background:#000"><img src="file://{LOGO}/obsidian-lockup-white.png" style="width:640px"></div><div class="cap">Primary: white on black or on the dark plate</div></div>
   <div><div class="panel" style="height:290px;background:#F4F5F7"><img src="file://{LOGO}/obsidian-lockup-black.png" style="width:640px"></div><div class="cap">On light grounds: black</div></div>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:36px">
     <div><div class="panel" style="height:210px;background:#000">{emblem(150)}</div><div class="cap">Emblem alone, white</div></div>
     <div><div class="panel" style="height:210px;background:#F4F5F7">{emblem(150, "#0B0C0E")}</div><div class="cap">Emblem alone, black</div></div></div>
   <div class="body" style="align-self:center;font-size:24px">The emblem is two parallel bars rising to the right. Use it alone for avatars, favicons, watermarks and the corner of every cover. The wordmark is a custom geometric logotype: never type it out in a font.</div>
  </div>""", gx="85%"))
# 4 construction, clear space, minimum size
P.append(page(4, f"""<div class="kick">Logo</div><div class="title">Construction and space</div>
  <div style="position:absolute;left:150px;top:330px;width:560px;height:560px;border:2px dashed rgba(255,255,255,.35);border-radius:6px;display:flex;align-items:center;justify-content:center">{emblem(340)}</div>
  <div class="small" style="position:absolute;left:150px;top:900px;width:560px;text-align:center">Clear space: half the emblem's width on every side</div>
  <div style="position:absolute;left:800px;top:340px;width:960px">
   <div class="body"><b style="color:#F4F5F7;font-weight:600">Two bars, one angle.</b> Both bars rise at 34.9° and have the same thickness. The lower bar is shorter and set in from the left, so the pair reads as a step forward.</div>
   <div class="body" style="margin-top:26px"><b style="color:#F4F5F7;font-weight:600">Clear space.</b> Keep at least half the emblem's width empty around the emblem or the lockup. Nothing enters that space: no text, no edges, no other marks.</div>
   <div class="body" style="margin-top:26px"><b style="color:#F4F5F7;font-weight:600">Minimum size.</b> Emblem 24 px tall on screen (6 mm in print). Lockup 160 px wide on screen (40 mm in print). Below that, use the emblem alone.</div>
   <div class="small" style="margin-top:26px">Geometry: 200 x 245 unit box; bar points (171,21)(171,66)(22,170)(22,128) and (171,88)(171,136)(46,222)(46,176). Vector file: logo/obsidian-emblem-white.svg.</div></div>""", gx="88%"))
# 5 misuse
tiles = [
 (f'<img src="file://{OLD}" style="height:150px">', "No purple, no gradients", "The violet version was retired on 10 Oct 2026."),
 (emblem(150, "#2F6BFF"), "No other colours", "White or black only. Blue is light, never the logo."),
 (emblem(150, style="transform:scaleX(1.6)"), "No stretching", "Scale the emblem evenly."),
 (emblem(150, style="transform:rotate(-30deg)"), "No rotating", "The 34.9° angle is the brand."),
 (emblem(150, style="filter:drop-shadow(0 0 18px #2F6BFF)"), "No glows, outlines or shadows", "The emblem stays flat."),
 (f'<div style="position:absolute;inset:0;background:repeating-linear-gradient(115deg,#3a3d44 0 18px,#9aa0ad 18px 36px)"></div>{emblem(150, style="position:relative")}', "No busy grounds", "Place it on black, white or the plate."),
]
cells = "".join(f'<div><div class="panel" style="height:230px;background:#000"><div class="dont">Don\'t</div>{t}</div><div class="swl" style="font-size:22px">{a}</div><div class="swr">{b}</div></div>' for t, a, b in tiles)
P.append(page(5, f'<div class="kick">Logo</div><div class="title">What not to do</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:34px 40px;margin-top:46px">{cells}</div>', glow=False))
# 6 colour
P.append(page(6, f"""<div class="kick">Colour</div><div class="title">Black and white first. Blue is light.</div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:28px;margin-top:44px">
   {sw("#000000", "Black", "The main world. Always dominant.")}
   {sw("#F4F5F7", "White", "Type, and the white world (black ink on it).")}
   {sw("#2F6BFF", "Electric blue", "Light pools, buttons, impacts.")}
   {sw("#0A1330", "Deep blue", "The blue world.")}
   {sw("#FFFFFF", "Lightbulb white", "The focus point: a white core with a warm #FFE7C2 halo.", "background:radial-gradient(circle at 50% 50%,#FFFFFF 0 16%,#FFE7C2 34%,rgba(255,231,194,.25) 58%,#000 78%)")}
  </div>
  <div class="small" style="margin-top:34px;color:#A3A6AF;font-size:22px">Black stays dominant. Blue is light, not paint. Any other hue only where the content needs it (a product, a photo), one per scene. No purple.</div>""", glow=False))
# 7 glow system colours
P.append(page(7, f"""<div class="kick">Colour</div><div class="title">The Obsidian Glow system</div>
  <div class="body" style="margin-top:22px;width:1250px">For carousels, covers and intros: off-black with one soft white glow rising from the bottom, fine grain, silver titles. Neutral white only.</div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:28px;margin-top:40px">
   {sw("#0A0A0C", "Plate", "Off-black background.")}
   {sw("#A9ADB6", "Silver", "End of the title gradient (from #FFFFFF).", "background:linear-gradient(180deg,#FFFFFF,#A9ADB6)")}
   {sw("#C4C6CD", "Body", "Body text on dark.")}
   {sw("#8E919B", "Muted", "Labels, captions, page numbers.")}
   {sw("#0B0C0E", "Ink", "The only text colour on the bright glow.")}
  </div>""", gx="70%"))
# 8 type
P.append(page(8, f"""<div class="kick">Typography</div><div class="title">Archivo, one family</div>
  <div style="display:grid;grid-template-columns:1.25fr 1fr;gap:70px;margin-top:46px">
   <div>
    <div style="font-size:120px;font-weight:800;font-stretch:125%;letter-spacing:-0.035em;line-height:.95;color:#F4F5F7">Digital<br>precision</div>
    <div class="small" style="margin-top:14px">Display: Archivo 800, width 125 %, tracking -0.035em</div>
    <div style="font-size:52px;font-weight:650;font-stretch:112%;letter-spacing:-0.03em;margin-top:40px;background:linear-gradient(180deg,#FFFFFF,#A9ADB6);-webkit-background-clip:text;color:transparent">Titles in sentence case</div>
    <div class="small" style="margin-top:10px">Titles: Archivo 650, width 112 %, silver gradient</div>
   </div>
   <div>
    <div class="body">Body copy is Archivo 400 at 28 to 42 px, with generous line height. One bold phrase per slide at most.</div>
    <div class="small" style="margin-top:10px">Body: Archivo 400, #C4C6CD on dark</div>
    <div style="font-family:M;font-size:26px;color:#F4F5F7;margin-top:40px;padding:22px 26px;border-radius:18px;background:rgba(255,255,255,.065);border:1.5px solid rgba(255,255,255,.17)">npm run build</div>
    <div class="small" style="margin-top:10px">Code only: JetBrains Mono</div>
    <div class="body" style="margin-top:34px;font-size:24px">Never Inter. No ALL-CAPS tracked labels. No emoji in type.</div>
   </div></div>""", glow=False))
# 9 light, surfaces, identity
P.append(page(9, f"""<div class="kick">Light, surfaces and identity</div><div class="title">How it comes together</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:34px;margin-top:44px">
   <div><div class="panel" style="height:250px;background:#0A0A0C"><div style="position:absolute;inset:0;background:radial-gradient(80% 70% at 30% 115%,#fff 0%,rgba(255,255,255,.85) 25%,rgba(220,224,228,.4) 50%,transparent 80%)"></div></div><div class="cap">The plate: carousels and covers</div></div>
   <div><div class="panel" style="height:250px;background:#000"><div style="width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,#FFFFFF 0 22%,#FFE7C2 40%,rgba(255,231,194,.22) 62%,transparent 72%)"></div></div><div class="cap">The lightbulb focus point: films</div></div>
   <div><div class="panel" style="height:250px;background:#000"><div style="position:absolute;inset:0;background:radial-gradient(60% 70% at 50% 60%,rgba(47,107,255,.85) 0%,rgba(47,107,255,.25) 45%,transparent 75%)"></div></div><div class="cap">Electric blue, used as light</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:34px;margin-top:40px">
   <div class="panel" style="height:200px;background:#101114;justify-content:flex-start;padding:0 36px;gap:26px">
     <img src="file://{PHOTO}" style="width:110px;height:110px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.2)">
     <div><div style="font-size:34px;font-weight:700;font-stretch:112%;color:#F4F5F7">Nathaniel Dreyer</div><div class="small" style="font-size:22px">Building premium digital experiences.</div><div style="font-size:22px;color:#C4C6CD;margin-top:4px">Instagram @_studioobsidian</div></div></div>
   <div class="body" style="align-self:center;font-size:24px">Screens and footage always sit in a rounded box with a hairline border; colour lives inside the box. Contact in calls to action: WhatsApp 079 244 9607. X and LinkedIn: to be added. Website domain: to be registered.</div>
  </div>""", gx="20%"))
assert len(P) == N
for i, html in enumerate(P, 1):
    hp, pp = os.path.join(PAGES, f"_p{i}.html"), os.path.join(PAGES, f"_p{i}.png"); open(hp, "w").write(html)
    subprocess.run([CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
                    f"--window-size={W},{H + 200}", "--virtual-time-budget=4000", f"--screenshot={pp}", f"file://{hp}"], check=True, capture_output=True)
    Image.open(pp).convert("RGB").crop((0, 0, W, H)).save(os.path.join(PAGES, f"{i:02d}.jpg"), quality=94, subsampling=0)
    os.remove(hp); os.remove(pp)
print("pages:", N)
