"""Re-time the ElevenLabs VO: keep every word, widen the gaps between lines.
Speech segments come from ffmpeg silencedetect (-40 dB, 0.18 s)."""
import json, subprocess, numpy as np, wave
FF = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
SRC = "/root/.claude/uploads/c4a5069d-a34a-58d2-a335-0631d389d9ef/ee5b7c74-davinci_every_new_beginning____arrives_with_paperwork___a_.mp3"
SR = 48000
raw = subprocess.run([FF, "-v", "quiet", "-i", SRC, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True).stdout
x = np.frombuffer(raw, dtype=np.int16)

segs = [(0.00,2.50),(3.01,3.86),(4.28,5.17),(5.80,6.43),(6.66,8.21),(8.65,9.13),(9.33,10.34),
 (10.89,11.81),(12.10,12.99),(13.18,13.82),(14.44,15.15),(15.36,16.74),(17.24,18.80),(19.00,20.27),
 (21.14,23.33),(23.80,25.93),(26.51,28.24),(28.48,29.90),(30.54,31.97),(32.40,33.95),(34.31,36.69),
 (37.47,39.04),(39.73,40.66),(40.85,41.48),(42.18,43.34),(43.60,45.98),(46.37,48.02),(48.63,49.45),
 (49.76,50.69),(51.18,52.08),(52.32,53.89),(54.53,56.01),(56.51,57.67),(57.87,len(x)/SR)]

# (id, text, segment indices, gap inside the line, gap after the line)
lines = [
 ("paperwork","Every new beginning... arrives with paperwork.",[0],0,1.2),
 ("client","A new client.",[1],0,0.9),
 ("employee","A new employee.",[2],0,1.1),
 ("forms","Forms... copies... signatures.",[3,4],0.45,1.1),
 ("checked","Checked... and checked again.",[5,6],0.5,1.1),
 ("typed","Details typed... from one screen... to the next.",[7,8,9],0.35,1.1),
 ("systems","Systems... that never speak to each other.",[10,11],0.4,1.2),
 ("lost","And somewhere between the files... the welcome gets lost.",[12,13],0.6,3.0),
 ("flowed","What if onboarding... simply flowed?",[14],0,2.0),
 ("brand","This is SmartTechNXT.",[15],0,2.2),
 ("robots","Intelligent software robots... working alongside your people.",[16,17],0.45,1.2),
 ("read","They read every document.",[18],0,1.0),
 ("validate","Validate every detail.",[19],0,1.0),
 ("setup","And set up each account... before day one.",[20],0,1.2),
 ("recorded","Every step... recorded.",[21],0,1.0),
 ("traceable","Every decision... traceable.",[22,23],0.4,1.2),
 ("beyond","And beyond onboarding... invoices... claims... month-end... the same quiet precision.",[24,25,26],0.5,1.2),
 ("stacks","No stacks. No bottlenecks.",[27,28],0.5,1.1),
 ("people","Just your people... free for the work that matters.",[29,30],0.5,2.5),
 ("logo","SmartTechNXT.",[31],0,1.2),
 ("tagline","Smart technology... in service of people.",[32,33],0.6,4.0),
]
PRE, POST = 0.04, 0.10          # keep breath onsets and tails
LEAD = 1.2                       # silence before the first word
out, t, timeline = [np.zeros(int(LEAD*SR), np.int16)], LEAD, []
for lid, text, idx, inner, after in lines:
    start = t; subs = []
    for k, i in enumerate(idx):
        a, b = segs[i]
        a = max(0, a - PRE); b = min(len(x)/SR, b + POST)
        chunk = x[int(a*SR):int(b*SR)].astype(np.float32)
        f = int(0.008*SR); ramp = np.linspace(0, 1, f)
        chunk[:f] *= ramp; chunk[-f:] *= ramp[::-1]          # declick
        subs.append(round(t + PRE, 3))
        out.append(chunk.astype(np.int16)); t += len(chunk)/SR
        if k < len(idx)-1:
            out.append(np.zeros(int(inner*SR), np.int16)); t += inner
    timeline.append({"id": lid, "text": text, "start": round(start+PRE, 3), "end": round(t-POST, 3), "subs": subs})
    out.append(np.zeros(int(after*SR), np.int16)); t += after
y = np.concatenate(out)
with wave.open("../vo-paced.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
json.dump({"duration": round(len(y)/SR, 3), "lines": timeline}, open("timeline.json", "w"), indent=1)
print("duration", round(len(y)/SR, 2))
for l in timeline: print(f'{l["start"]:6.2f}-{l["end"]:6.2f}  {l["text"]}')
