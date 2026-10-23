# Render an Obsidian carousel: slides.json -> one JPG per slide (1080x1350, saves straight to a phone gallery) and a
# contact sheet. The owner posts from his phone gallery: no PDFs unless he asks (--pdf).
# usage: python3 -I render_carousel.py <post_dir> [--pdf]   (post_dir holds slides.json; output goes to <post_dir>/out/)
# slides.json: {"claude": true?, "slides": [{"type": "cover"|"text"|"skill"|"end", "clawd"?: anchor, ...fields}]} — see
# SKILL.md "Slide types". "claude": true marks a Claude-topic post: Claude symbol on the cover, Clawd stickers allowed,
# non-affiliation line on the last slide.
# GLOW family + Claude emblem (owner, 2026-10-22: "screenshots or screen recordings of UI with the Claude emblem on top"): with
# "claude": true the cover carries the Claude symbol above the title, each `site` slide carries it on top of the UI box (optional
# "claude_label", "claude_mark": false to skip one), and the `links` slide carries the non-affiliation line.
# GLOW family (owner, 2026-10-20): "style": "glow" + slide types glow_cover | site | links = Obsidian's own identity (off-black with a
# soft white glow rising from the bottom, the Obsidian emblem, the owner's face and handles). A `site` slide may carry "video": an mp4 of
# the UI; the renderer then also writes slide_NN.mp4 (the video playing inside the container) next to the JPG poster.
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


GLOW_CSS = """
.glowbg { position: absolute; inset: 0; background:
  radial-gradient(112% 50% at var(--gx, 22%) 104%, #FFFFFF 0%, rgba(255,255,255,.97) 30%, rgba(228,232,235,.74) 50%, rgba(160,168,176,.30) 70%, rgba(0,0,0,0) 90%),
  radial-gradient(70% 28% at calc(100% - var(--gx, 22%)) -8%, rgba(255,255,255,.13), rgba(0,0,0,0) 72%), #0A0A0C; }
.grain { position: absolute; inset: 0; opacity: .30; mix-blend-mode: overlay; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='.33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 0 1'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
.silver { background: linear-gradient(180deg, #FFFFFF 0%, #A9ADB6 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ink { color: #0B0C0E; }
"""
CSS += GLOW_CSS
VID_BLUR, VID_DIM, VID_SAT = 14, 0.45, 0.75  # background video under the glow: blur px, brightness, saturation
GX = {"bl": "22%", "br": "78%", "bc": "50%"}
X_PATH = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"

def icon(kind, px, color="#0B0C0E"):
    d = {"ig": f'<rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="{color}" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="{color}" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.2" fill="{color}"/>',
         "x": f'<path d="{X_PATH}" fill="{color}"/>',
         "link": f'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round"/>',
         "save": f'<path d="M6 3h12v18l-6-4.6L6 21z" fill="{color}"/>'}[kind]
    return f'<svg viewBox="0 0 24 24" style="width:{px}px;height:{px}px;flex:none">{d}</svg>'

def identity(spec, size=84, ink="#0B0C0E"):
    """avatar + name + tagline + the owner's handles. A handle that is not on file is left out (and a warning printed): handles are never guessed."""
    idn = spec.get("identity", {}); photo = os.path.join(HERE, "..", idn.get("photo", "assets/people/nathaniel.jpg"))
    rows = ""
    for kind, key in (("ig", "instagram"), ("x", "x")):
        if idn.get(key):
            rows += f'<div style="display:flex;align-items:center;gap:10px;font-size:{round(size*.31)}px;font-weight:500">{icon(kind, round(size*.3), ink)}{html.escape(idn[key])}</div>'
        else: print(f"WARNING: identity.{key} not set, row left out")
    tag = f'<div style="font-size:{round(size*.3)}px;font-weight:500;opacity:.72;margin-top:4px">{html.escape(idn["tagline"])}</div>' if idn.get("tagline") else ""
    return f"""<div style="display:flex;align-items:center;gap:{round(size*.28)}px;color:{ink}">
      <img src="file://{photo}" style="width:{size}px;height:{size}px;border-radius:50%;object-fit:cover;border:2px solid rgba(11,12,14,.18)">
      <div><div style="font-size:{round(size*.37)}px;font-weight:700;font-stretch:112%;letter-spacing:-0.01em">{html.escape(idn.get('name', 'Nathaniel Dreyer'))}</div>{tag}
      <div style="margin-top:8px;display:flex;flex-direction:column;gap:4px">{rows}</div></div></div>"""

def site_geom(s):
    """container rect (x, y, w, h) of a `site` slide; the video overlay uses the same numbers."""
    w = 984; h = round(w / s.get("aspect", 16 / 9)); return 48, s.get("top", 170), w, h

FG_MODE = False  # True: render only the layers that sit ON TOP of a video (transparent canvas, no grain); the mp4 step composites them

def glow_wrap(inner, s, i, under=""):
    gx = GX[s.get("glow", ["bl", "br", "bc"][(i - 1) % 3])]
    clear = "background-color:transparent;" if (under or FG_MODE) else ""
    grain = "" if FG_MODE else '<div class="grain"></div>'
    return f'{under}<div class="glowbg" style="--gx:{gx};{clear}"></div>{grain}{inner}'

def glow_slide(s, i, n, spec):
    t = s["type"]; topic = spec.get("topic", "")
    label = f'<div style="position:absolute;left:0;right:0;top:78px;text-align:center;font-size:30px;font-weight:500;color:rgba(244,245,247,.86)">{esc(s.get("topic", topic))}</div>' if (s.get("topic", topic) and t != "glow_cover") else ""
    if t == "glow_cover":
        under = ""
        if s.get("video") and not FG_MODE:  # still frame of the owner's video, dimmed and blurred so only colour and movement remain
            under = f'<div style="position:absolute;inset:0;overflow:hidden"><img src="file://{s["_still"]}" style="width:100%;height:100%;object-fit:cover;filter:blur({VID_BLUR}px) brightness({VID_DIM}) saturate({VID_SAT});transform:scale(1.04)"></div>'
        return glow_wrap(f"""<div style="position:absolute;left:64px;top:64px;display:flex;align-items:center;gap:14px;font-size:30px;font-weight:600;font-stretch:112%;color:#F4F5F7">{emblem(40)}Obsidian</div>
          <div style="position:absolute;left:64px;right:64px;top:{s.get('top', 380)}px;text-align:center">
            {f'<div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:44px">{claude_logo(54)}<span style="font-size:30px;color:#C9CBD2">{esc(s.get("logo_label", "Claude"))}</span></div>' if spec.get("claude") else ""}
            <div class="silver" style="font-size:{s.get('size', 112)}px;font-weight:650;font-stretch:112%;line-height:1.0;letter-spacing:-0.03em">{esc(s['title'])}</div>
            <div style="font-size:40px;line-height:1.3;color:#B9BCC4;margin-top:38px">{esc(s['sub'])}</div></div>
          <div style="position:absolute;left:64px;right:64px;bottom:76px;display:flex;justify-content:center">{identity(spec, 92)}</div>""", s, i, under)
    if t == "site":
        x, y, w, h = site_geom(s)
        img = f'<img src="file://{os.path.abspath(os.path.join(spec["_dir"], s["image"]))}" style="width:100%;height:100%;object-fit:cover;object-position:{s.get("focus", 50)}% 50%;display:block">' if s.get("image") and not s.get("video_only") else ""
        by = y + h + 54
        pill = (f'<div style="display:inline-flex;align-items:center;gap:14px;margin-top:34px;padding:16px 28px 16px 22px;border-radius:999px;background:rgba(255,255,255,.10);'
                f'border:1.5px solid rgba(255,255,255,.2);font-size:29px;color:#F4F5F7">{icon("link", 28, "#F4F5F7")}{esc(s["url"])}</div>') if s.get("url") else ""
        chip = ""
        if spec.get("claude") and s.get("claude_mark", True):
            lab = s.get("claude_label", "")
            chip = (f'<div style="position:absolute;left:{x}px;top:{y - 58}px;display:flex;align-items:center;gap:10px;font-size:24px;color:#E6E7EA">'
                    f'{claude_logo(34)}{esc(lab)}</div>')
        return glow_wrap(f"""{label}{chip}
          <div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:28px;overflow:hidden;background:#101114;border:1.5px solid rgba(255,255,255,.16);box-shadow:0 30px 70px rgba(0,0,0,.55)">{img}</div>
          <div style="position:absolute;left:{x}px;right:48px;top:{by}px">
            <div style="display:flex;align-items:baseline;gap:22px"><span style="font-size:34px;color:#8E919B;font-variant-numeric:tabular-nums">{esc(s.get('rank', ''))}</span>
              <span class="wide" style="font-size:{s.get('size', 78)}px;line-height:1.0">{esc(s['name'])}</span></div>
            <div style="font-size:36px;line-height:1.3;color:#C4C6CD;margin-top:20px;max-width:900px">{esc(s['line'])}</div>
            {pill}</div>
          <div class="ink" style="position:absolute;left:48px;right:48px;bottom:64px;display:flex;align-items:center">
            <div style="display:flex;align-items:center;gap:14px;font-size:28px;font-weight:600"><img src="file://{os.path.join(HERE, '..', spec.get('identity', {}).get('photo', 'assets/people/nathaniel.jpg'))}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;border:2px solid rgba(11,12,14,.18)">{html.escape(spec.get('identity', {}).get('instagram') or spec.get('identity', {}).get('name', ''))}</div></div>""", s, i)
    if t == "links":
        return glow_wrap(f"""{label}
          <div style="position:absolute;left:64px;right:64px;top:{s.get('top', 330)}px;text-align:center">
            <div class="silver" style="font-size:{s.get('size', 84)}px;font-weight:650;font-stretch:112%;line-height:1.04;letter-spacing:-0.025em">{esc(s['title'])}</div>
            <div style="font-size:42px;line-height:1.3;color:#C4C6CD;margin-top:40px">{esc(s['body'])}</div>
            <div style="display:flex;align-items:center;justify-content:center;gap:22px;margin-top:70px">{emblem(84)}<div style="text-align:left"><div style="font-size:42px;font-weight:700;font-stretch:118%;color:#F4F5F7">Obsidian</div>
              <div style="font-size:26px;color:#A3A6AF;margin-top:6px">{esc(s.get('tagline', 'Digital precision that builds reputation.'))}</div></div></div></div>
          <div style="position:absolute;left:64px;right:64px;bottom:76px;display:flex;justify-content:center">{identity(spec, 92)}</div>
          {'<div class="ink" style="position:absolute;left:64px;right:64px;bottom:26px;text-align:center;font-size:18px;opacity:.7">Claude and Claude Code are trademarks of Anthropic. Obsidian is not affiliated with Anthropic.</div>' if spec.get("claude") else ""}""", s, i)
    raise SystemExit(f"unknown glow slide type {t}")

def cmd_size(lines, inner=W - 184 - 67):
    n = max(len(l) for l in lines)
    return min(28.0, inner / (0.602 * n))

def slide_html(s, i, n, spec={}):
    if s["type"] in ("glow_cover", "site", "links"):
        return f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{glow_slide(s, i, n, spec)}</body></html>"
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
        if s.get("source"):
            body += f'<div class="src" style="position:absolute;left:92px;right:92px;bottom:168px">Source: {esc(s["source"])}</div>'
    elif t == "bars":  # measured comparison: [label, value, unit, highlight?]; bars scale to the largest value
        mx = max(b[1] for b in s["bars"])
        rows = "".join(f"""<div style="margin-top:30px"><div style="display:flex;justify-content:space-between;align-items:baseline;font-size:34px;color:{'#fff' if len(b) > 3 and b[3] else '#E4E5E9'};font-weight:{600 if len(b) > 3 and b[3] else 400}">
              <span>{esc(b[0])}</span><span style="font-variant-numeric:tabular-nums">{b[1]:.1f} {esc(b[2])}</span></div>
              <div style="margin-top:12px;height:18px;border-radius:9px;background:rgba(255,255,255,.08)"><div style="width:{100 * b[1] / mx:.1f}%;height:100%;border-radius:9px;background:{'#2F6BFF' if len(b) > 3 and b[3] else 'rgba(244,245,247,.82)'}"></div></div></div>"""
                       for b in s["bars"])
        body = f"""<div class="pad"><div class="kick">{esc(s['kicker'])}</div>
          <div class="wide" style="font-size:{s.get('size', 80)}px;line-height:1.0;margin-top:26px">{esc(s['title'])}</div>
          <div style="margin-top:28px">{rows}</div>
          <div class="body muted" style="font-size:28px;line-height:1.35;margin-top:44px">{esc(s.get('note', ''))}</div></div>
          <div class="src" style="position:absolute;left:92px;right:92px;bottom:168px">Source: {esc(s['source'])}</div>"""
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

def site_video(s, jpg, mp4, post):
    """the recording plays inside the container of the rendered slide (rounded corners, same crop as the poster); silent H.264."""
    x, y, w, h = site_geom(s); m = os.path.join(os.path.dirname(mp4), "_vmask.png")
    k = 4; mk = Image.new("L", (w * k, h * k), 0)
    from PIL import ImageDraw; ImageDraw.Draw(mk).rounded_rectangle((0, 0, w * k - 1, h * k - 1), 28 * k, fill=255); mk.resize((w, h), Image.LANCZOS).save(m)
    v = s["video"]; src = v["src"] if isinstance(v, dict) else v; ss = v.get("start", 0) if isinstance(v, dict) else 0; d = v.get("dur", 4) if isinstance(v, dict) else 4
    cr = v.get("crop") if isinstance(v, dict) else None
    fg = (f"[1:v]fps=30," + (f"crop={cr[2]}:{cr[3]}:{cr[0]}:{cr[1]}," if cr else "") + f"scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h}:(iw-{w})*{s.get('focus', 50) / 100}:(ih-{h})/2,setsar=1,format=rgba[v];"
          f"[2:v]format=gray[m];[v][m]alphamerge[vm];[0:v][vm]overlay={x}:{y}:shortest=1,format=yuv420p[o]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", "30", "-t", str(d), "-i", jpg, "-ss", str(ss), "-t", str(d), "-i", os.path.join(post, src) if not os.path.isabs(src) else src,
                    "-loop", "1", "-framerate", "30", "-t", str(d), "-i", m, "-filter_complex", fg, "-map", "[o]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4], check=True)
    os.remove(m)

def shoot(html_text, png, transparent=False):
    hp = png.replace(".png", ".html"); open(hp, "w").write(html_text)
    subprocess.run([CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files"] + (["--default-background-color=00000000"] if transparent else []) +
                   # headless chrome takes ~90 px of window chrome off the viewport: open taller, body is fixed at H, crop below
                   [f"--window-size={W},{H + 200}", "--virtual-time-budget=4000", f"--screenshot={png}", f"file://{hp}"], check=True, capture_output=True)
    os.remove(hp); return Image.open(png).convert("RGBA").crop((0, 0, W, H))

def vid_crop(v):
    cr = v.get("crop") if isinstance(v, dict) else None
    return (f"crop={cr[2]}:{cr[3]}:{cr[0]}:{cr[1]}," if cr else "") + f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H}"

def cover_video(s, fg_png, mp4):
    """the owner's video fills the cover: same crop, then blurred, dimmed and desaturated like the poster, glow + header + identity on top, light film grain."""
    v = s["video"]; d = v.get("dur", 5)
    fg = (f"[0:v]fps=30,{vid_crop(v)},gblur=sigma={VID_BLUR},eq=saturation={VID_SAT},lutrgb=r=val*{VID_DIM}:g=val*{VID_DIM}:b=val*{VID_DIM},format=rgba[b];"
          f"[b][1:v]overlay=0:0:shortest=1,noise=alls=3:allf=t,format=yuv420p[o]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(v.get("start", 0)), "-t", str(d), "-i", v["src"], "-loop", "1", "-framerate", "30", "-t", str(d), "-i", fg_png,
                    "-filter_complex", fg, "-map", "[o]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-maxrate", "5M", "-bufsize", "10M", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4], check=True)

def main():
    post = os.path.abspath(sys.argv[1]); spec = json.load(open(os.path.join(post, "slides.json")))
    out = os.path.join(post, "out"); os.makedirs(out, exist_ok=True)
    spec["_dir"] = post; slides = spec["slides"]; pngs = []
    global FG_MODE
    for k, s in enumerate(slides, 1):
        pp = os.path.join(out, f"slide_{k:02d}.png"); jp = os.path.join(out, f"slide_{k:02d}.jpg")
        if s.get("type") == "glow_cover" and s.get("video"):  # still frame of the video (same crop) for the poster
            v = s["video"]; s["_still"] = os.path.join(out, "_cover_still.jpg")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(v.get("still", 1.0)), "-i", v["src"], "-frames:v", "1", "-vf", vid_crop(v), "-q:v", "2", s["_still"]], check=True)
        FG_MODE = False
        shoot(slide_html(s, k, len(slides), spec), pp).convert("RGB").save(jp, quality=95, subsampling=0); pngs.append(jp); os.remove(pp)
        if s.get("type") == "site" and s.get("video"): site_video(s, jp, os.path.join(out, f"slide_{k:02d}.mp4"), post)
        if s.get("type") == "glow_cover" and s.get("video"):
            FG_MODE = True
            fgp = os.path.join(out, "_cover_fg.png")
            shoot(slide_html(s, k, len(slides), spec).replace("</style>", "html,body{background:transparent!important}</style>", 1), fgp, True)
            cover_video(s, fgp, os.path.join(out, f"slide_{k:02d}.mp4")); os.remove(fgp); FG_MODE = False
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
