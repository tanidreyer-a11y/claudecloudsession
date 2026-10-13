# Pack a rendered post into ONE zip the owner downloads on his phone: a folder per platform with the slides (JPG, in
# posting order) and the caption to paste. X takes 4 images per post, so its slides are split into post-1, post-2, …
# usage: python3 -I package_post.py <post_dir>      needs out/slide_NN.jpg, captions/{instagram,linkedin,x_thread}.txt
import glob, os, sys, zipfile

post = os.path.abspath(sys.argv[1]); slug = os.path.basename(post)
slides = sorted(glob.glob(os.path.join(post, "out", "slide_*.jpg")))
cap = lambda n: os.path.join(post, "captions", n)
root = f"Obsidian_{slug}"
zp = os.path.join(post, "out", f"{root}.zip")

readme = f"""{slug}

Instagram: open the Instagram folder, select 01–{len(slides):02d}, save to Photos, post them as one carousel in order. Paste caption.txt.
LinkedIn: same images from the LinkedIn folder (multi-image post). Paste caption.txt. To tag, type @Anthropic or
  @Claude in the post and pick the page from LinkedIn's list (typed handles don't link on LinkedIn).
X: post 1 = images in X/post-1, post 2 = a reply with X/post-2. Paste the matching text from thread.txt.
  Tags in the text were checked on the companies' own sites or profiles.
iPhone: tap the zip in Files to unzip it, open a folder, Select → choose the images → Share → Save Images.
Sources for every claim: sources.md
""" + (open(cap("notes.txt")).read() if os.path.exists(cap("notes.txt")) else "")

with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
    for i, f in enumerate(slides, 1):
        z.write(f, f"{root}/Instagram/{i:02d}.jpg")
        z.write(f, f"{root}/LinkedIn/{i:02d}.jpg")
        z.write(f, f"{root}/X/post-{(i - 1) // 4 + 1}/{i:02d}.jpg")
    z.write(cap("instagram.txt"), f"{root}/Instagram/caption.txt")
    z.write(cap("linkedin.txt"), f"{root}/LinkedIn/caption.txt")
    z.write(cap("x_thread.txt"), f"{root}/X/thread.txt")
    if os.path.exists(os.path.join(post, "sources.md")):
        z.write(os.path.join(post, "sources.md"), f"{root}/sources.md")
    z.writestr(f"{root}/READ-ME.txt", readme)
print(zp, f"{os.path.getsize(zp) / 1e6:.1f} MB")
