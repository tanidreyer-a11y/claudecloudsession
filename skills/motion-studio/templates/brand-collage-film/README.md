# Template: Brand Board Collage film (from Klick Kulture "Makes you click", owner-approved 2026-10-09)

The full, working source of the approved film. Copy this folder for a new client, then swap the brand, keep the
method. Style card: library/styles/brand-board-collage.md. Reference brand: brands/klick-kulture.md.

```
src/KK.tsx            the film: 9 scenes in one file, all timing in the T table (film seconds = voice time + 0.4)
src/fonts.ts          local brand fonts from public/fonts (Aileron, Poppins, Archivo wide)
scripts/prep_images.py extracts layers from the brand-board PDFs: hand/floor/front-lip/shadow layers, the snap
                      fingertip layer (hand_base + hand_tip with an overlap band), collages, logo, mark, wordmark
audio/build.py        music + SFX + voice with ducking, cued to the same times
render.sh             render 60 fps → tmix to 30 fps + mux → finish.sh (−16 LUFS, master + web)
stills.mjs            contact sheets: node stills.mjs KK916 out/sheet.jpg 1,2,3
```

## Adapting it to a new brand (in this order)
1. Extract the board: palette, fonts, logo (never redraw), and an inventory of its DEVICES (icons, frames, chips,
   textures, cutouts). The devices are the film's vocabulary — that is what made KK "unique to them".
2. Pick the board's GESTURE image (KK: the snapping hand) → it stops the feed and makes the "click".
3. Write an emotion-led script (voice = feeling, screen = information). Get the take, run silence detection
   (`ffmpeg -af silencedetect=noise=-40dB:d=0.18`), fill the T table.
4. Swap K (palette), fonts, images, chip styles, the headline lockup, the checklist rows, the collage pieces,
   the end card. Keep: feed → stop → gesture → colour rings → playground → phone → clicks → network → checklist →
   craft → chatter → roar → disc → logo, unless the brief needs a different spine.
5. Stills first (0.5 s apart around every transition), then a full render; judge transitions in MOTION.

Proven numbers: feed plane rotateX 24° / rotateZ −11°, push ×(4.8/1.55); hand rise 1.5 s with a 1.18 overshoot
bezier; snap press +4° → flick −12° in 65 ms → damped settle (8/s, 2.6 Hz); colour rings 75 ms apart, 0.62 s each;
phone spin 540° → 0 in 0.8 s; chips back-ease 0.3 s; checklist ticks 0.25 s apart, X at +0.25 s; disc grow 0.53 s,
shrink 0.52 s, K parts 80 ms apart, wordmark wipe 0.63 s.
Needs: node_modules (Remotion 4.0.529, React 19, @fontsource/aileron, @fontsource/poppins, @fontsource-variable/archivo).
