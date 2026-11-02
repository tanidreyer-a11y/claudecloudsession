# Finishing & delivery

Run `scripts/finish.sh master.mp4 out/name [web_MB]` (default web budget 13.8 MB). It does:

1. **Grade** in RGB with explicit BT.709 both ways:
   `scale=in_color_matrix=bt709:out_color_matrix=bt709,format=gbrp,curves=all='0/0 0.25/0.23 0.75/0.78 1/1',colorbalance=rh=.02:gh=.005:bs=-.01,format=yuv420p`
   (gentle S-curve, slightly warm highlights; adjust per brand — keep it subtle).
2. **Grain**: `noise=c0s=4:c0f=t+u` on the master, `c0s=2` on the web cut (luma, temporal).
3. **Loudness**: `alimiter`, then two-pass `loudnorm I=-16 TP=-1.5 LRA=11` (pass 1 measures, pass 2 applies).
4. **Master**: x264 High, CRF 18, preset slow, AAC 320k, bt709 tags. **No `-tune film` with grain** (228 MB vs 20 MB).
5. **Web**: two-pass to a size budget (bitrate = budget×8 / duration − audio), H.264 Main 4.0, AAC 128k, faststart.
6. **Verify**: ffprobe duration (= voice length), file sizes, `ebur128=peak=true` on the final files, then pull
   20 frames from the **encoded web file** into a sheet and inspect for text errors, overlaps, clipping, banding.

Upload limits seen: WhatsApp/Remote Control ~15 MB; this chat ~30 MB. Always state where the master is.
