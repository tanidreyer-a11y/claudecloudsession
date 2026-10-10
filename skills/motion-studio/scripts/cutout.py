# Cut a product/object out of a flat studio-style backdrop (gradient + backdrop-difference mask, closing, hole fill,
# largest component). usage: python3 -I cutout.py <in.jpg> <out.png> <x0,y0,x1,y1> <grad_thresh=20> <diff_thresh=40>
# Then feather/erode the alpha and fade any edge where the crop cuts the object (see lessons-learned 73).
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
src, out, box = sys.argv[1], sys.argv[2], [int(v) for v in sys.argv[3].split(",")]
im = Image.open(src).convert("RGB").crop(box)
g = np.asarray(im.convert("L")).astype(np.float32)
bg = nd.gaussian_filter(nd.median_filter(g, 61), 20)          # smooth backdrop estimate
gx, gy = nd.sobel(g, 1), nd.sobel(g, 0); mag = np.hypot(gx, gy)
mag = nd.gaussian_filter(mag, 2)
diff = np.abs(g - bg)
m = (mag > float(sys.argv[4])) | (diff > float(sys.argv[5]))
m = nd.binary_closing(m, iterations=6)
m = nd.binary_fill_holes(m)
m = nd.binary_opening(m, iterations=3)
lab, n = nd.label(m); sizes = nd.sum(m, lab, range(1, n + 1))
keep = np.isin(lab, 1 + np.where(sizes > 1500)[0])
a = nd.gaussian_filter(nd.binary_erosion(keep, iterations=2).astype(np.float32), 1.5)
rgba = im.copy(); rgba.putalpha(Image.fromarray((a * 255).astype(np.uint8))); rgba.save(out)
prev = Image.new("RGB", im.size, (20, 20, 24)); prev.paste(im, (0, 0), Image.fromarray((a * 255).astype(np.uint8)))
prev.resize((im.size[0] // 2, im.size[1] // 2)).save(out.replace(".png", "_prev.jpg"))
print(n, sorted(sizes)[-5:])
