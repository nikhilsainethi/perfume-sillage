# SILLAGE — WebGL Elevation (Level 2): Note Constellation + Living Atmosphere

**Status:** Superseded by `2026-06-19-atelier-design.md` (constellation absorbed as the Atelier's picking surface) · **Date:** 2026-06-19

## Goal

Take SILLAGE "to the next level" with WebGL/Three.js, at **Level 2** ambition: a global **living shader atmosphere** (Level 1 foundation) plus **one signature 3D centerpiece** — the fragrance wheel reborn as an **orbitable 3D note constellation** in the Discover act. Best-in-class UX/design, with zero regressions to the existing (working, polished) app.

## Non-negotiables

- **Isolation:** all new work confined to (a) a global atmosphere layer and (b) the Discover act. Store, selectors, matching, comparison, carousel, detail, data are **untouched**. The constellation only calls `toggleNote(id)` and reads `selectedNoteIds`.
- **Graceful fallback:** `canRender3D` = WebGL2 available **and** not `prefers-reduced-motion` **and** not low-power/mobile. If false → the existing 2D `FragranceWheel` (desktop/tablet) or `NoteSelector` list (mobile). The **List** view stays available everywhere as the keyboard/SR-accessible path.
- **Lazy-loaded:** all Three.js code is code-split (dynamic import) so fallback users never download it.
- **Make no mistakes:** `tsc` + build clean, zero console errors, verified by screenshots (3D, forced-2D fallback, reduced-motion, mobile), selection ↔ tray stay in sync.

## Stack

`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` (selective bloom only).

## Modules

- `shared/webgl/useWebGLCapability.ts` — returns `canRender3D` from WebGL2 + reduced-motion + device heuristics (memoized; SSR-safe).
- `shared/ui/AmbientWebGL.tsx` — fixed full-viewport fragment-shader atmosphere (champagne/amber domain-warped "sillage" clouds + grain + vignette; subtle cursor/scroll reactivity). Lazy. Falls back to existing CSS `AmbientBackground`. Capped DPR; pauses when hidden / reduced-motion.
- `features/discover/constellation/NoteConstellation.tsx` — R3F `<Canvas>`; lazy + mounted only when Discover near viewport.
  - `constellationLayout.ts` — positions wheel-notes in 3D by accord family (9 lobes around a champagne core; depth varies per note).
  - `NoteOrb.tsx` — frosted, family-colored sphere; hover swell+glow+label; selected ring; dispatches `toggleNote`.
  - controls: damped OrbitControls, gentle idle auto-rotate, page scroll preserved.
- `features/discover/NotesMatchingEngine.tsx` — selects 3D / 2D-wheel / List based on `canRender3D` + `viewMode` + `isMobile`. Lazy-imports the 3D entry.

## Interaction (constellation)

- **Orbit:** drag to rotate (damped); gentle auto-rotate when idle; the page still scrolls.
- **Hover:** orb scales + glows; drei `Html` label with note name & family; center readout echoes it.
- **Select:** click → orb glides forward & locks (brighter, ringed, selective bloom) and calls `toggleNote(id)`; appears in the existing glass tray; removing from tray deselects the orb (store-synced).
- **Family focus:** hovering a family brightens its lobe, dims the rest.

## Performance & accessibility

- Code-split chunk; canvas mounts only when Discover is near viewport (IntersectionObserver) and pauses offscreen / tab hidden; capped DPR (≤1.5); bloom only on hovered/selected orbs; reduced-motion strips auto-rotate + bloom.
- Accessibility: 3D is an enhancement; the **List** toggle is the keyboard/SR path; selection state is the same store, so tray + summary stay accessible. Canvas is not a focus trap.

## Verification

`tsc -b` + `vite build` clean; `node scripts/validate-catalog.mjs` still passes; screenshots of 3D scene, forced-2D fallback, reduced-motion, mobile; zero console errors; confirm 3D-orb ↔ tray selection sync.
