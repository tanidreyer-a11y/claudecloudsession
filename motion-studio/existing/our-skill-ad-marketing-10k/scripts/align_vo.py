"""Offline word timings for a voiceover: python3 align_vo.py take.mp3 [out.json]
Needs: pip install pocketsphinx  (+ ffmpeg on PATH or FFMPEG env var).
Recognition is phonetic — brand names come out wrong ("SmartTech NXT" -> "smart tag annexed"); map cues by order."""
import json, os, subprocess, sys, tempfile, wave
from pocketsphinx import Decoder
src = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else 'asr.json'
ff = os.environ.get('FFMPEG', 'ffmpeg')
tmp = tempfile.mktemp(suffix='.wav')
subprocess.run([ff, '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '16000', tmp], check=True)
d = Decoder(); w = wave.open(tmp, 'rb'); d.start_utt(); d.process_raw(w.readframes(w.getnframes()), full_utt=True); d.end_utt()
fr = d.config['frate']
words = [(s.word.split('(')[0], round(s.start_frame / fr, 2), round(s.end_frame / fr, 2)) for s in d.seg()
         if s.word not in ('<s>', '</s>', '<sil>', '[NOISE]', '[SPEECH]')]
json.dump(words, open(out, 'w'))
print(' '.join(f'{n}@{a:.2f}' for n, a, b in words))
sil = subprocess.run([ff, '-hide_banner', '-i', src, '-af', 'silencedetect=noise=-40dB:d=0.3', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('\nsilences:', ' '.join(l.split('] ')[-1] for l in sil.splitlines() if 'silence_' in l))
