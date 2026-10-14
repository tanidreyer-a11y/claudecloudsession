# Make a HyperFrames project render without CDN access: every <script src="https://cdn.jsdelivr.net/npm/PKG@VER/PATH">
# (and unpkg.com/PKG@VER/PATH) in the project's .html files is downloaded from the npm registry (npm pack) into
# <project>/vendor/PKG@VER/PATH and the src is rewritten to that local path. npm works here; jsdelivr/unpkg don't.
# usage: python3 -I hf_localize.py <project_dir>
import glob, os, re, subprocess, sys, tarfile, tempfile, shutil

proj = os.path.abspath(sys.argv[1])
PAT = re.compile(r'https://(?:cdn\.jsdelivr\.net/npm|unpkg\.com)/((?:@[^/@"\']+/)?[^/@"\']+)@([^/"\']+)/([^"\'\s>]+)')
cache = {}

def fetch(pkg, ver):
    key = f"{pkg}@{ver}"
    if key in cache: return cache[key]
    tmp = tempfile.mkdtemp()
    out = subprocess.run(["npm", "pack", key, "--silent"], cwd=tmp, capture_output=True, text=True, check=True).stdout.strip().splitlines()[-1]
    with tarfile.open(os.path.join(tmp, out)) as t: t.extractall(tmp, filter="data")
    cache[key] = os.path.join(tmp, "package"); return cache[key]

n = 0
for f in glob.glob(os.path.join(proj, "**", "*.html"), recursive=True):
    src = open(f).read(); rel_root = os.path.relpath(proj, os.path.dirname(f))
    def sub(m):
        global n
        pkg, ver, path = m.group(1), m.group(2), m.group(3)
        dst = os.path.join(proj, "vendor", f"{pkg}@{ver}", path)
        if not os.path.exists(dst):
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy(os.path.join(fetch(pkg, ver), path), dst)
        n += 1
        return os.path.join(rel_root, "vendor", f"{pkg}@{ver}", path).replace(os.sep, "/")
    new = PAT.sub(sub, src)
    if new != src: open(f, "w").write(new)
print(f"localized {n} CDN references in {proj}")
