# Voice-over timing: where each line and word of the script is spoken, so every visual beat starts on its word.
# usage: python3 -I vo_timing.py <voice.(wav|mp3|m4a)> <script.txt> <out.json> [--model path/to/ggml-*.bin]
#   script.txt: the exact words of the voice-over, one beat per line (blank lines ignored). Optional marks (Level 5
#   "every keyword gets a visual and a sound"): *word* = keyword (blip + bracketed caption), **word** = big word
#   (808 hit + flash card), a line starting with "!" = the drop (silence before it, riser → drop). Marks are removed
#   from "text" and stored as "key"/"big"/"drop" flags, which sfx_code.py auto and the Remotion HUD/captions read.
# Method 1 (word-accurate): faster-whisper (pip; set FW_MODEL to a local model folder) or whisper.cpp (`whisper-cli`
#   with a ggml model) → word timestamps → aligned to the script. Both models download from huggingface.co.
# Method 2 (fallback, no model): FFmpeg silencedetect finds the pauses; script lines are snapped to them by length;
#   words are spread inside each line by syllable count. Good to ±0.15 s on clean studio VO; ALWAYS check by eye.
# Output: {"method", "duration", "wpm", "env_fps", "env": [0..1 loudness per frame, for the HUD waveform],
#          "lines": [{"text", "start", "end", "drop"?, "words": [{"w", "start", "end", "key"?, "big"?}]}]}
import json, os, re, shutil, subprocess, sys, tempfile, difflib

audio, script, outp = sys.argv[1], sys.argv[2], sys.argv[3]
model = sys.argv[sys.argv.index("--model") + 1] if "--model" in sys.argv else os.environ.get(
    "WHISPER_MODEL", "/tmp/claude-0/hf/whisper.cpp/models/ggml-base.en.bin")
FF = shutil.which("ffmpeg") or "ffmpeg"
raw_lines = [l.strip() for l in open(script, encoding="utf-8") if l.strip()]
drops = [l.startswith("!") for l in raw_lines]
marks = []  # per line: list of (word, key, big)
for l in raw_lines:
    ws = []
    for w in l.lstrip("!").split():
        big = w.startswith("**") or w.rstrip(".,!?;:").endswith("**")
        key = not big and (w.startswith("*") or w.rstrip(".,!?;:").endswith("*"))
        ws.append((w.replace("*", ""), key, big))
    marks.append(ws)
lines = [" ".join(w for w, _, _ in m) for m in marks]
tmp = tempfile.mkdtemp(); wav = os.path.join(tmp, "vo.wav")
subprocess.run([FF, "-v", "error", "-y", "-i", audio, "-ac", "1", "-ar", "16000", wav], check=True)
dur = float(subprocess.run([shutil.which("ffprobe") or "ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "csv=p=0", wav], capture_output=True, text=True).stdout)
norm = lambda w: re.sub(r"[^a-z0-9']", "", w.lower())
syl = lambda w: max(1, len(re.findall(r"[aeiouy]+", w.lower())))

def heard_faster_whisper():
    fw = os.environ.get("FW_MODEL")
    if not fw: return None
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        return None
    segs, _ = WhisperModel(fw, device="cpu", compute_type="int8").transcribe(wav, word_timestamps=True, vad_filter=True)
    return [(w.word.strip(), w.start, w.end) for sg in segs for w in sg.words if w.word.strip()]

def heard_whisper_cpp():
    if not (shutil.which("whisper-cli") and os.path.exists(model)): return None
    base = os.path.join(tmp, "w")
    subprocess.run(["whisper-cli", "-m", model, "-f", wav, "-ml", "1", "-sow", "-oj", "-of", base],
                   check=True, capture_output=True)
    segs = json.load(open(base + ".json"))["transcription"]
    return [(s["text"].strip(), s["offsets"]["from"] / 1000, s["offsets"]["to"] / 1000) for s in segs if s["text"].strip()]

def by_whisper():
    heard = heard_faster_whisper() or heard_whisper_cpp()
    if not heard: return None
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

def envelope(fps=30):
    pcm = subprocess.run([FF, "-v", "error", "-i", wav, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
    import array
    a = array.array("h", pcm); hop = 16000 // fps; env = []
    for i in range(0, len(a), hop):
        seg = a[i:i + hop]; env.append((sum(x * x for x in seg) / max(1, len(seg))) ** 0.5)
    top = sorted(env)[int(len(env) * 0.98)] if env else 1
    return [round(min(1.0, e / (top or 1)), 3) for e in env]

res = by_whisper(); method = "whisper" if res else "silence-fallback"
res = res or by_silence()
for i, l in enumerate(res):
    if drops[i]: l["drop"] = True
    for w, (_, key, big) in zip(l["words"], marks[i]):
        if key: w["key"] = True
        if big: w["big"] = True
nwords = sum(len(l["words"]) for l in res)
speech = sum(l["end"] - l["start"] for l in res) or dur
json.dump({"method": method, "duration": round(dur, 3), "wpm": round(nwords / speech * 60), "env_fps": 30,
           "env": envelope(30), "lines": res}, open(outp, "w"), indent=1, ensure_ascii=False)
print(method, f"{dur:.2f}s", len(res), "lines,", round(nwords / speech * 60), "wpm ->", outp)
for l in res:
    tag = "!" if l.get("drop") else " "
    keys = [w["w"] + ("**" if w.get("big") else "*") for w in l["words"] if w.get("key") or w.get("big")]
    print(f" {tag}{l['start']:6.2f}–{l['end']:6.2f}  {l['text'][:60]}  {' '.join(keys)}")
