# SILLAGE 2.0 — The Atelier

**Status:** Approved · **Date:** 2026-06-19 · Supersedes & absorbs `2026-06-19-webgl-constellation-design.md`

## Vision

Grow SILLAGE from a three-act atlas into a destination for perfume enthusiasts: study notes, **compose your own fragrance**, see where it lives among 127 real scents, keep a shelf of creations, and share them — all with the most beautiful UI we can build.

Approved forks: **digital composer** (no real-world chemistry; note data keeps `material?` headroom) · **local persistence + share links** (no backend; storage behind a repository interface) · **the 3D note constellation becomes the Atelier's picking surface** (Discover reuses it; 2D wheel remains the fallback).

## Product shape

| Route (hash) | Purpose |
|---|---|
| `/` | Existing three-act Atlas journey — untouched |
| `/atelier` | Full-screen composition studio (the new hero feature) |
| `/shelf` | My Creations gallery |
| `/c/:code` | Read-only shared creation + "Remix in Atelier" |

Slim editorial nav (wordmark · Atlas / Atelier / My Shelf). Hero gains a "Compose your own" CTA. `react-router` in hash mode for zero-config static hosting.

## Domain

- `UserCreation { id, name, pyramid, description?, createdAt, updatedAt }` — Perfume-shaped.
- `toPerfume(creation)` adapter → **every existing engine works unchanged**: `compare()`, `deriveAccords()`, `buildRadar()`, `BottleVisual`, season inference, matching.
- `domain/harmony.ts` — pure: note-pair affinity from catalog co-occurrence (PMI-style) → *sparks*; balance heuristics (top-heavy, empty base, too many competing families, tier caps) → *cautions*. Derived from data, no authoring.
- `domain/creationInsights.ts` — character line generator ("a warm amber-woody with a bright citrus opening — nocturnal, cold-weather").
- `domain/shareCodec.ts` — creation → minimal JSON → lz-string → base64url; validates note ids on decode; degrades gracefully.

## State & persistence

`store/atelierStore.ts` — Zustand + persist (versioned localStorage) holding creations + the in-progress draft; storage behind `CreationRepository` so a backend can slot in later. JSON export/import on the shelf.

## The Atelier experience

Split-stage: note space (constellation / 2D fallback) + living composition (pyramid tiers with intensity, live accord bars, radar, seasons, character line), harmony sparks & cautions, **Place in the Atlas** (nearest neighbors via existing matcher; full comparison of creation vs any catalog scent using existing Compare components fed a locally-built `ComparisonResult` — no store changes), then name → bottle (rendered flacon) → save/share.

## 3D (absorbed Level-2 spec)

Lazy R3F chunk; `canRender3D` = WebGL2 ∧ no reduced-motion ∧ not low-power/mobile; family-lobe constellation of glowing frosted orbs; hover swell + label; click syncs selection with the store; damped orbit + idle auto-rotate; DPR capped; pauses when hidden. Fallback: existing 2D wheel / list (always keyboard-accessible).

## Verification

Vitest for pure domain (harmony, codec round-trip, adapter); `node scripts/validate-catalog.mjs`; `tsc -b`; `vite build`; zero console errors; screenshots: atelier, shelf, share, constellation, forced 2D fallback, mobile. Commit per phase; push to origin.

## Out of scope (headroom only)

Backend/accounts/community gallery; real formulation data; Browse/Compare 3D.
