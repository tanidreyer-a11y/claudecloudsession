"""Prepare Klick Kulture brand images for the film (layers for the hand-from-floor, downscaled collages, logos)."""
import numpy as np
from PIL import Image, ImageFilter
import os
B = '../brand'; O = 'public/img'
def save(im, name, maxw=None):
    if maxw and im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(os.path.join(O, name)); print(name, im.size)

# ---------- hand rising from the yellow floor (bb_img3, 3863x2576) ----------
im = np.array(Image.open(f'{B}/bb_img3.png').convert('RGBA')).astype(float)
H, W = im.shape[:2]; R, G, Bc, A = [im[..., k] for k in range(4)]
FT = 2023; CX, CY, RX, RY = 1811, 2397, 395, 57
yy, xx = np.mgrid[0:H, 0:W]
mx = np.maximum(np.maximum(R, G), Bc); mn = np.minimum(np.minimum(R, G), Bc); sat = (mx - mn) / (mx + 1)
inEll = ((xx - CX) / RX) ** 2 + ((yy - CY) / RY) ** 2 <= 1
hand = (A > 100) & ((yy < FT) | ((sat < 0.25) & (mx < 215) & (xx > 1400) & (xx < 2650)))
hm = Image.fromarray((hand * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
hand_img = Image.fromarray(im.astype(np.uint8)); hand_img.putalpha(Image.fromarray(np.minimum(np.array(hm), A).astype(np.uint8)))
hand_img = hand_img.crop((1380, 600, 2700, 2480))  # hand bbox (+margin)
save(hand_img, 'hand.png', 792)   # 1320x1880 at scale 0.6
# floor without hand and shadow
yellow = np.array([254, 208, 0], float)
floor = im.copy()
lum = 0.3 * R + 0.59 * G + 0.11 * Bc; ylum = 0.3 * 254 + 0.59 * 208
floorzone = (yy >= FT)
hand_wide = np.array(Image.fromarray((hand * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(15))) > 0
shadow_a = np.clip((ylum - lum) / ylum * 1.15 - 0.04, 0, 1) * floorzone * (~hand_wide) * (~inEll) * (A > 200) * (xx < CX)
for k in range(3): floor[..., k] = np.where(floorzone & (A > 100) & ~inEll, yellow[k], floor[..., k])
floor[..., 3] = np.where(floorzone & ~inEll, 255, 0)
floor = floor[FT:, :]
save(Image.fromarray(floor.astype(np.uint8)), 'floor.png', 2318); print('floor', floor.shape)
sh = np.zeros((H - FT, W, 4)); sh[..., 3] = (shadow_a[FT:] * 255)
save(Image.fromarray(sh.astype(np.uint8)).filter(ImageFilter.GaussianBlur(2)), 'floor_shadow.png', 2318)
# front lip: floor pixels below the front arc of the hole (covers the hand as it sinks)
arc = CY + RY * np.sqrt(np.clip(1 - ((xx - CX) / RX) ** 2, 0, 1))
front = floorzone & ~inEll & ((yy > arc) & (np.abs(xx - CX) < RX) | (yy > CY) & (np.abs(xx - CX) >= RX))
fr = np.zeros((H, W, 4)); fr[..., :3] = yellow; fr[..., 3] = front * 255
save(Image.fromarray(fr[FT:].astype(np.uint8)), 'floor_front.png', 2318)
print('GEOM', dict(W=W, H=H, FT=FT, CX=CX, CY=CY, RX=RX, RY=RY, handCrop=(1380, 600, 2700, 2480)))

# ---------- collages & logos ----------
save(Image.open(f'{B}/bb_img4.png').convert('RGBA').crop((0, 300, 2546, 3400)), 'tvhead.png', 1100)
save(Image.open(f'{B}/bb_img5.png').convert('RGBA').crop((760, 470, 1460, 2214)), 'halftone_hand.png', 600)
save(Image.open(f'{B}/sg_p2_img2.png').convert('RGB'), 'team.jpg', 1100)
save(Image.open(f'{B}/sg_p3_img4.png').convert('RGB'), 'emoji.jpg', 1100)
for src, dst in [('sg_p2_img3', 'megaphone'), ('sg_p3_img5', 'hearteyes'), ('sg_p3_img6', 'climb'), ('sg_p4_img8', 'stairs')]:
    save(Image.open(f'{B}/{src}.png').convert('RGB'), dst + '.jpg')
save(Image.open(f'{B}/bb_img2.png').convert('RGBA'), 'logo_h_white.png', 1800)
save(Image.open(f'{B}/bb_img1.png').convert('RGBA'), 'logo_h_black.png', 1800)
st = Image.open(f'{B}/bb_img0.png').convert('RGBA'); a = np.array(st.getchannel('A'))
cols = np.where(a.max(0) > 30)[0]; rows = np.where(a.max(1) > 30)[0]
print('stacked bbox', cols.min(), cols.max(), rows.min(), rows.max())

# ---------- the snap: split the finger-heart tips into their own layer ----------
from PIL import ImageDraw
hand = Image.open(f'{O}/hand.png').convert('RGBA')
CUT = [(150, 0), (640, 0), (640, 232), (566, 292), (472, 279), (402, 262), (330, 246), (150, 236)]
OVER = 22   # the tip layer reaches this far below the cut, so rotation never opens a gap
ERASE = [(150, 0), (640, 0), (640, 170), (548, 236), (472, 270), (402, 256), (330, 242), (150, 232)]  # base keeps the knuckle
cut_mask = Image.new('L', hand.size, 0); ImageDraw.Draw(cut_mask).polygon(ERASE, fill=255)
tip_poly = [(x, y + (OVER if y > 0 else 0)) for x, y in CUT]
tip_mask = Image.new('L', hand.size, 0); ImageDraw.Draw(tip_mask).polygon(tip_poly, fill=255)
tip_mask = tip_mask.filter(ImageFilter.GaussianBlur(3))
base = hand.copy(); a = np.array(base.getchannel('A')).astype(float); a *= 1 - np.array(cut_mask) / 255; base.putalpha(Image.fromarray(a.astype(np.uint8)))
tip = hand.copy(); a = np.array(tip.getchannel('A')).astype(float); a *= np.array(tip_mask) / 255; tip.putalpha(Image.fromarray(a.astype(np.uint8)))
base.save(f'{O}/hand_base.png'); tip.save(f'{O}/hand_tip.png'); print('hand_base / hand_tip', hand.size, 'pivot (500, 282)')
