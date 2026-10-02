# Motion-graphics library

`src/motion/` ships six reusable motion techniques. They are already written,
already type-check, and add no dependencies. Import them in a scene:

```tsx
import { ScreenCarousel3D, EditorialHighlight } from "../motion";
```

**Do not rewrite these files and do not copy their bodies into a scene.** Import
the component and drive it with props.

## Choosing techniques

Pick per scene, from the storyboard. A technique earns its place only when it
matches what that scene has to say.

- Use **two to four** different techniques across a nine-scene film.
- Never use the same technique in consecutive scenes.
- A scene may use none: a well-choreographed hero shot with the existing
  `PhoneFrame`, `KineticWords`, `Cursor` and `ScoreRing` components is often
  better than a library technique.
- Match the reference video's energy. A calm, editorial reference means fewer
  techniques and longer holds; a fast, punchy reference means more.
- The product decides. A medical or financial product should not fling tiles
  around; a consumer or creator product can.

## Motion density requirement

Every scene must keep moving. Nothing may sit visually still for longer than
about 1.2 seconds (72 frames at 60 fps). Between beats, keep a slow camera
push, a float-idle, a parallax drift or a progress element alive. A held still
frame reads as a broken render.

## The techniques

### ScreenCarousel3D
A perspective row of product screens moves past the camera; the active card is
largest and sharpest, neighbours rotate away and blur.
**Use for:** showing several real screens in sequence without hard cuts.
**Avoid for:** a single hero screen, or when small UI text must stay readable.
**Key props:** `screens` (static paths), `from`, `durationInFrames`,
`cardWidth`, `ratio`, `centerX`, `centerY`, optional `spread`, `travel`.

### ConstellationMerge
Satellite tiles pop in around a centre, orbit inward and are absorbed into a
central mark.
**Use for:** several capabilities resolving into one product.
**Avoid for:** sequential workflows, or anything needing readable detail.
**Key props:** `items` (`{label, icon?}`), `from`, `durationInFrames`,
`centerX`, `centerY`, `orbitRadius`, `tileSize`, `accent`, `ink`, `surface`,
plus `children` for the centre mark.

### CardToHeaderPush
A floating card holds the frame, then leaves while the camera pushes into the
layer behind it.
**Use for:** moving from a claim into the real product screen.
**Avoid for:** scenes with no background worth pushing into.
**Key props:** `from`, `durationInFrames`, `background`, `card`, `cardX`,
`cardY`, optional `pushTo`, `exit`.

### FastScreenScroll
A framed screen scrolls past faster than it can be read, for several passes.
**Use for:** energy and depth over a long screen.
**Avoid for:** any moment where a detail must be legible.
**Key props:** `src`, `from`, `durationInFrames`, `x`, `y`, `viewportWidth`,
`viewportHeight`, `imageHeight`, optional `passes`.

### EditorialHighlight
A headline arrives and a colour bar sweeps behind one phrase, then short
callouts appear one at a time.
**Use for:** a claim plus two or three short proofs.
**Avoid for:** scenes already carrying a full-screen product visual.
**Key props:** `headline` (`{text, highlight?}[]`), `callouts`, `from`,
`durationInFrames`, `x`, `y`, `maxWidth`, `fontSize`, `ink`, `highlightColor`.

### FrameScatter
A source card shrinks toward a focal point and thumbnails fan out from it.
**Use for:** breadth — one product opening into many features or results.
**Avoid for:** a money shot that deserves the whole frame.
**Key props:** `source`, `tiles`, `from`, `durationInFrames`, `centerX`,
`centerY`, `sourceWidth`, `tileWidth`, `ratio`, `spreadX`.

## Rules that still apply

- `from` is relative to the film, so pass the scene's own start frame.
- Only real staged screenshots may be passed as image paths. Never invent a
  filename.
- Techniques are layout-neutral: supply coordinates that suit the orientation
  being rendered (`width > height` means landscape).
- Credibility rules are unchanged. Motion may not imply a product behaviour
  that the screens do not show.

## Attribution

Adapted from the saved animations in
[Creatorberry/flick](https://github.com/Creatorberry/flick) (MIT). flick's
originals are bound to specific content, assets and durations; these are
rewritten as parameterised components that fit this template.
