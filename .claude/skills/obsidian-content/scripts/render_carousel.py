# Render an Obsidian carousel: slides.json -> one JPG per slide (1080x1350, saves straight to a phone gallery) and a
# contact sheet. The owner posts from his phone gallery: no PDFs unless he asks (--pdf).
# usage: python3 -I render_carousel.py <post_dir> [--pdf]   (post_dir holds slides.json; output goes to <post_dir>/out/)
# slides.json: {"claude": true?, "slides": [{"type": "cover"|"text"|"skill"|"end", "clawd"?: anchor, ...fields}]} — see
# SKILL.md "Slide types". "claude": true marks a Claude-topic post: Claude symbol on the cover, Clawd stickers allowed,
# non-affiliation line on the last slide.
import json, os, subprocess, sys, html
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "assets", "fonts")
MARKS = os.path.join(HERE, "..", "assets", "marks")
CHROME = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
W, H = 1080, 1350
BARS = [[[171, 21], [171, 66], [22, 170], [22, 128]], [[171, 88], [171, 136], [46, 222], [46, 176]]]

def emblem(h, fill="#F4F5F7", style=""):
    pts = "".join(f'<polygon points="{" ".join(f"{x},{y}" for x, y in b)}" fill="{fill}"/>' for b in BARS)
    return f'<svg viewBox="0 0 200 245" style="height:{h}px;width:{h*200/245:.1f}px;overflow:visible;{style}">{pts}</svg>'

def clawd(px, style=""):  # Clawd, 11 x 8 pixels, original shape and colour (assets/marks/SOURCE.md)
    svg = open(os.path.join(MARKS, "clawd.svg")).read()
    return svg.replace("<svg ", f'<svg style="width:{px*11}px;height:{px*8}px;display:inline-block;{style}" ', 1)

def claude_logo(sz, style=""):
    svg = open(os.path.join(MARKS, "claude-logo.svg")).read().replace("<path ", '<path fill="#D97757" ', 1)
    return svg.replace("<svg ", f'<svg style="width:{sz}px;height:{sz}px;display:inline-block;{style}" ', 1)

def sticker(s, where, title_size=96):
    """Clawd for anchor `where` if this slide asks for it there. Anchors: title, kicker, card, quote, cta, or {x,y,px}."""
    a = s.get("clawd")
    if a is None: return ""
    if isinstance(a, dict):
        return clawd(a.get("px", 9), f"position:absolute;left:{a['x']}px;top:{a['y']}px") if where == "abs" else ""
    if a != where: return ""
    if where == "title": return clawd(max(6, round(title_size * 0.082)), "margin-left:.16em;vertical-align:baseline")
    if where in ("kicker", "cta"): return clawd(4 if where == "kicker" else 5, "margin-left:14px;vertical-align:-2px")
    if where == "card": return clawd(8, "position:absolute;right:46px;top:-64px")
    if where == "quote": return clawd(7, "position:absolute;right:0;top:-56px")
    return ""

def esc(t):  # allow **bold** for emphasis inside body text
    t = html.escape(t)
    parts = t.split("**")
    return "".join(f"<b>{p}</b>" if i % 2 else p for i, p in enumerate(parts))

CSS = f"""
@font-face {{ font-family: Archivo; src: url('file://{FONTS}/archivo-latin-wdth-normal.woff2') format('woff2'); font-weight: 100 900; font-stretch: 62% 125%; }}
@font-face {{ font-family: JBMono; src: url('file://{FONTS}/jetbrains-mono-latin-400-normal.woff2') format('woff2'); font-weight: 400; }}
@font-face {{ font-family: JBMono; src: url('file://{FONTS}/jetbrains-mono-latin-500-normal.woff2') format('woff2'); font-weight: 500; }}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
html, body {{ width: {W}px; height: {H}px; background: #000; overflow: hidden; }}
body {{ font-family: Archivo, sans-serif; color: #EDEEF1; -webkit-font-smoothing: antialiased; position: relative; }}
.pad {{ position: absolute; left: 92px; right: 92px; top: 104px; }}
.wide {{ font-stretch: 125%; font-weight: 800; letter-spacing: -0.028em; color: #F4F5F7; }}
.kick {{ font-size: 28px; font-weight: 500; color: #8E919B; letter-spacing: 0; }}
.body {{ font-size: 42px; line-height: 1.28; font-weight: 400; color: #E4E5E9; }}
.body b {{ font-weight: 650; color: #FFFFFF; }}
.muted {{ color: #A3A6AF; }}
.foot {{ position: absolute; left: 92px; right: 92px; bottom: 76px; display: flex; align-items: center; justify-content: space-between; }}
.brand {{ display: flex; align-items: center; gap: 14px; font-size: 26px; font-weight: 600; font-stretch: 112%; color: #E6E7EA; }}
.page {{ font-size: 24px; color: #6F7280; font-variant-numeric: tabular-nums; }}
.card {{ background: rgba(255,255,255,.065); border: 1.5px solid rgba(255,255,255,.17); border-radius: 22px; padding: 28px 32px; }}
.cmd {{ font-family: JBMono, monospace; font-weight: 500; color: #F4F5F7; line-height: 1.55; white-space: pre; }}
.src {{ font-size: 22px; color: #6F7280; margin-top: 18px; }}
"""

def cmd_size(lines, inner=W - 184 - 67):
    n = max(len(l) for l in lines)
    return min(28.0, inner / (0.602 * n))

def slide_html(s, i, n, spec={}):
    t = s["type"]; foot = f'<div class="foot"><div class="brand">{emblem(34)}Obsidian</div><div class="page">{i} / {n}</div></div>'
    if t == "cover":
        art = emblem(760, style="position:absolute;right:-150px;bottom:170px")
        row = (f'''<div style="display:flex;align-items:center;gap:16px;margin-bottom:54px">{claude_logo(46)}
          <span class="kick" style="font-size:30px;color:#C9CBD2">{esc(s.get('logo_label', 'Claude'))}</span></div>''' if spec.get("claude") else "")
        body = f"""{art}<div class="pad" style="top:{104 if row else 150}px">{row}
          <div class="wide" style="font-size:{s.get('size', 124)}px;line-height:.96">{esc(s['title'])}{sticker(s, 'title', s.get('size', 124))}</div>
          <div class="body muted" style="margin-top:46px;max-width:720px">{esc(s['sub'])}</div></div>
          <div class="foot"><div class="brand">{emblem(34)}Obsidian</div><div class="page">{esc(s.get('cue', 'Swipe'))}</div></div>"""
        foot = ""
    elif t == "text":
        q = f"""<div style="position:relative;margin-top:58px;font-size:{s.get('qsize', 62)}px;line-height:1.08;font-weight:620;font-stretch:112%;letter-spacing:-0.02em;color:#fff">{sticker(s, 'quote')}“{esc(s['quote'])}”</div>
               <div class="src" style="font-size:24px;margin-top:26px">{esc(s['quote_src'])}</div>""" if s.get("quote") else ""
        body = f"""<div class="pad"><div class="kick">{esc(s['kicker'])}{sticker(s, 'kicker')}</div>
          <div class="wide" style="font-size:{s.get('size', 80)}px;line-height:1.0;margin-top:26px">{esc(s['title'])}{sticker(s, 'title', s.get('size', 80))}</div>
          <div class="body" style="margin-top:44px">{esc(s['body'])}</div>{q}
          {f'<div class="body" style="margin-top:58px">{esc(s["close"])}</div>' if s.get("close") else ""}</div>"""
    elif t == "skill":
        lines = s["install"]; fs = cmd_size(lines)
        cmd = "\n".join(html.escape(l) for l in lines)
        body = f"""<div class="pad"><div class="kick">{esc(s['kicker'])}{sticker(s, 'kicker')}</div>
          <div class="wide" style="font-size:{s.get('size', 96)}px;line-height:1.0;margin-top:26px">{esc(s['name'])}{sticker(s, 'title', s.get('size', 96))}</div>
          <div class="body muted" style="font-size:32px;margin-top:20px">{esc(s['maker'])}</div>
          <div class="body" style="margin-top:58px">{esc(s['what'])}</div>
          <div class="kick" style="margin-top:46px">Use it for</div>
          <div class="body" style="font-size:38px;margin-top:10px">{esc(s['use'])}</div></div>
          <div style="position:absolute;left:92px;right:92px;bottom:168px">
            <div class="kick" style="font-size:26px;margin-bottom:16px">{esc(s.get('install_label', 'Install in Claude Code'))}</div>
            <div class="card" style="position:relative">{sticker(s, 'card')}<div class="cmd" style="font-size:{fs:.1f}px">{cmd}</div></div>
            <div class="src">Source: {esc(s['source'])}</div></div>"""
    elif t == "end":
        body = f"""<div class="pad"><div class="kick">{esc(s['kicker'])}{sticker(s, 'kicker')}</div>
          <div class="wide" style="font-size:{s.get('size', 84)}px;line-height:1.0;margin-top:26px">{esc(s['title'])}{sticker(s, 'title', s.get('size', 84))}</div>
          <div class="body" style="margin-top:44px">{esc(s['body'])}</div>
          <div class="body muted" style="margin-top:34px">{esc(s.get('note', ''))}</div></div>
          <div style="position:absolute;left:92px;right:92px;bottom:190px">
            <div class="body" style="font-size:40px;font-weight:600;color:#fff">{esc(s['cta'])}{sticker(s, 'cta')}</div>
            <div style="display:flex;align-items:center;gap:26px;margin-top:40px">{emblem(96)}
              <div><div style="font-size:44px;font-weight:700;font-stretch:118%;color:#F4F5F7">Obsidian</div>
              <div class="body muted" style="font-size:28px;margin-top:6px">{esc(s.get('tagline', 'Digital precision that builds reputation.'))}</div></div></div></div>"""
        if spec.get("claude"):
            body += '''<div style="position:absolute;left:92px;right:92px;bottom:128px;font-size:19px;color:#5F6270">Claude, Claude Code and Clawd are trademarks of Anthropic. Obsidian is not affiliated with Anthropic.</div>'''
    else:
        raise SystemExit(f"unknown slide type {t}")
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body}{sticker(s, 'abs')}{foot}</body></html>"

def main():
    post = os.path.abspath(sys.argv[1]); spec = json.load(open(os.path.join(post, "slides.json")))
    out = os.path.join(post, "out"); os.makedirs(out, exist_ok=True)
    slides = spec["slides"]; pngs = []
    for k, s in enumerate(slides, 1):
        hp = os.path.join(out, f"slide_{k:02d}.html"); pp = os.path.join(out, f"slide_{k:02d}.png")
        open(hp, "w").write(slide_html(s, k, len(slides), spec))
        subprocess.run([CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
                        # headless chrome takes ~90 px of window chrome off the viewport: open taller, body is fixed at H, crop below
                        f"--window-size={W},{H + 200}", "--virtual-time-budget=4000", f"--screenshot={pp}", f"file://{hp}"],
                       check=True, capture_output=True)
        im = Image.open(pp).convert("RGB").crop((0, 0, W, H))
        jp = os.path.join(out, f"slide_{k:02d}.jpg")
        im.save(jp, quality=95, subsampling=0); pngs.append(jp); os.remove(hp); os.remove(pp)
    ims = [Image.open(p).convert("RGB") for p in pngs]
    if "--pdf" in sys.argv:
        ims[0].save(os.path.join(out, "carousel.pdf"), save_all=True, append_images=ims[1:], resolution=144)
    tw = 360; th = int(tw * H / W); cols = 4; rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tw + (cols + 1) * 12, rows * th + (rows + 1) * 12), (40, 40, 44))
    for k, im in enumerate(ims):
        sheet.paste(im.resize((tw, th), Image.LANCZOS), (12 + (k % cols) * (tw + 12), 12 + (k // cols) * (th + 12)))
    sheet.save(os.path.join(out, "contact_sheet.jpg"), quality=90)
    print("rendered", len(pngs), "slides ->", out)

if __name__ == "__main__":
    main()
