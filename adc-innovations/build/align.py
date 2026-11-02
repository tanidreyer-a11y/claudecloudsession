import json, wave, re
from pocketsphinx import Decoder
S = "/tmp/claude-0/-home-user-claudecloudsession/c4a5069d-a34a-58d2-a335-0631d389d9ef/scratchpad/vo16.wav"
text = ("every business runs on work that nobody sees invoices to chase bills to capture leads to answer people to onboard "
 "and every day something slips step into a world where the work does itself almost meet a d c agents digital co workers "
 "each built for one job each one precise they read every document check every detail act in seconds nothing slips "
 "through your fingers nothing leaves without you one loop the agent prepares you approve it's done every action on record "
 "choose the agents you need add more as you grow a d c innovations precision at work book your fifteen minute demo")
d = Decoder(bestpath=False)
w = wave.open(S, 'rb'); raw = w.readframes(w.getnframes())
d.set_align_text(text)
d.start_utt(); d.process_raw(raw, full_utt=True); d.end_utt()
words = [(e.name, e.start / 100, (e.start + e.duration) / 100) for e in d.get_alignment()]
words = [x for x in words if x[0] not in ('<sil>', '<s>', '</s>')]
json.dump(words, open('words.json', 'w'))
print(len(words)); print(' '.join(f'{n}@{a:.2f}' for n, a, b in words))
