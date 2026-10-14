# Voice-over timing: where each line and word of the script is spoken, so every visual beat starts on its word.
# usage: python3 -I vo_timing.py <voice.(wav|mp3|m4a)> <script.txt> <out.json> [--model path/to/ggml-*.bin]
#   script.txt: the exact words of the voice-over, one beat per line (blank lines ignored).
# Method 1 (word-accurate): whisper.cpp (`whisper-cli`) with a ggml model → word timestamps → aligned to the script.
# Method 2 (fallback, no model): FFmpeg silencedetect finds the pauses; script lines are snapped to them by length;
#   words are spread inside each line by syllable count. Good to ±0.15 s on clean studio VO; ALWAYS check by eye.
# Output: {"method", "duration", "lines": [{"text", "start", "end", "words": [{"w", "start", "end"}]}]}
import json, os, re, shutil, subprocess, sys, tempfile, difflib

audio, script, outp = sys.argv[1], sys.argv[2], sys.argv[3]
model = sys.argv[sys.argv.index("--model") + 1] if "--model" in sys.argv else os.environ.get(
    "WHISPER_MODEL", "/tmp/claude-0/hf/whisper.cpp/models/ggml-base.en.bin")
FF = shutil.which("ffmpeg") or "ffmpeg"
lines = [l.strip() for l in open(script, encoding="utf-8") if l.strip()]
tmp = tempfile.mkdtemp(); wav = os.path.join(tmp, "vo.wav")
subprocess.run([FF, "-v", "error", "-y", "-i", audio, "-ac", "1", "-ar", "16000", wav], check=True)
dur = float(subprocess.run([shutil.which("ffprobe") or "ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "csv=p=0", wav], capture_output=True, text=True).stdout)
norm = lambda w: re.sub(r"[^a-z0-9']", "", w.lower())
syl = lambda w: max(1, len(re.findall(r"[aeiouy]+", w.lower())))

def by_whisper():
    if not (shutil.which("whisper-cli") and os.path.exists(model)): return None
    base = os.path.join(tmp, "w")
    subprocess.run(["whisper-cli", "-m", model, "-f", wav, "-ml", "1", "-sow", "-oj", "-of", base],
                   check=True, capture_output=True)
    segs = json.load(open(base + ".json"))["transcription"]
    heard = [(s["text"].strip(), s["offsets"]["from"] / 1000, s["offsets"]["to"] / 1000) for s in segs if s["text"].strip()]
    script_words = [(i, w) for i, l in enumerate(lines) for w in l.split()]
    sm = difflib.SequenceMatcher(a=[norm(w) for _, w in script_words], b=[norm(h[0]) for h in heard], autojunk=False)
    times = [None] * len(script_words)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): times[a + k] = heard[b + k][1:]
    for k in range(len(times)):  # fill unmatched words between their matched neighbours
        if times[k] is None:
            prev = next((times[j][1] for j in range(k - 1, -1, -1) if times[j]), 0.0)
            nxt = next((times[j][0] for j in range(k + 1, len(times)) if times[j]), dur)
            times[k] = (prev, max(prev, nxt))
    out = []
    for i, l in enumerate(lines):
        ws = [(w, *times[k]) for k, (li, w) in enumerate(script_words) if li == i]
        out.append({"text": l, "start": ws[0][1], "end": ws[-1][2], "words": [{"w": w, "start": s, "end": e} for w, s, e in ws]})
    return out

def by_silence():
    r = subprocess.run([FF, "-hide_banner", "-i", wav, "-af", "silencedetect=noise=-35dB:d=0.22", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    ss = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r)]
    se = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r)]
    speech_start = se[0] if ss and ss[0] < 0.05 and se else 0.0
    speech_end = ss[-1] if ss and (len(se) < len(ss) or se[-1] >= dur - 0.05) else dur
    gaps = [((a + b) / 2, a, b) for a, b in zip(ss, se) if speech_start < a and b < speech_end]
    weights = [sum(syl(w) for w in l.split()) for l in lines]
    total = sum(weights); span = speech_end - speech_start
    guesses, acc = [], 0
    for wgt in weights[:-1]:
        acc += wgt; guesses.append(speech_start + span * acc / total)
    # Snap all line boundaries to pauses at once (DP): pauses stay in order, longer pauses are preferred, a boundary
    # with no pause near it keeps its syllable-count guess at a fixed cost.
    NOPE = 1.5
    cost = lambda b, g: (gaps[g][0] - guesses[b]) ** 2 - 0.8 * (gaps[g][2] - gaps[g][1])
    nb, ng = len(guesses), len(gaps)
    best = {(-1, -1): (0.0, [])}  # (boundary index, last gap used) -> (cost, choices)
    for b in range(nb):
        nxt = {}
        for (pb, pg), (c, ch) in best.items():
            opts = [(c + NOPE, ch + [None], pg)] + [(c + cost(b, g), ch + [g], g) for g in range(pg + 1, ng)]
            for c2, ch2, g2 in opts:
                if (b, g2) not in nxt or c2 < nxt[(b, g2)][0]: nxt[(b, g2)] = (c2, ch2)
        best = nxt
    choice = min(best.values(), key=lambda v: v[0])[1] if nb else []
    bounds = [speech_start] + [gaps[g][0] if g is not None else guesses[b] for b, g in enumerate(choice)] + [speech_end]
    out = []
    for i, l in enumerate(lines):
        s, e = bounds[i], bounds[i + 1]
        g_end = next((g[1] for g in gaps if abs(g[0] - e) < 1e-6), e)      # line ends where its pause starts
        g_start = next((g[2] for g in gaps if abs(g[0] - s) < 1e-6), s)    # and starts where the previous pause ends
        ws = l.split(); sy = [syl(w) for w in ws]; t = g_start; words = []
        for w, n in zip(ws, sy):
            d = (g_end - g_start) * n / sum(sy); words.append({"w": w, "start": round(t, 3), "end": round(t + d, 3)}); t += d
        out.append({"text": l, "start": round(g_start, 3), "end": round(g_end, 3), "words": words})
    return out

res = by_whisper(); method = "whisper" if res else "silence-fallback"
res = res or by_silence()
json.dump({"method": method, "duration": round(dur, 3), "lines": res}, open(outp, "w"), indent=1, ensure_ascii=False)
print(method, f"{dur:.2f}s", len(res), "lines ->", outp)
for l in res: print(f"  {l['start']:6.2f}–{l['end']:6.2f}  {l['text'][:70]}")
