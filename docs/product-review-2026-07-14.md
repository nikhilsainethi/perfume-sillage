# SILLAGE — fresh-eyes product review (2026-07-14)

Walked the live site (https://nikhilsainethi.github.io/perfume-sillage/) as a
first-time visitor: desktop 1280×800 and mobile 375×812, every page,
screenshots at each step, plus measured facts (bundle transfer, photo
coverage, contrast math). Findings ranked by impact. Nothing here is fixed
yet — this is the honest ledger.

## The vibe (what's true and good)

- The identity is real: editorial serif, warm ivory, restrained gold, and a
  copy voice ("A fan of bottles, dealt by relevance", "Something spilled")
  that no template has. It reads as a designed object, not a bootstrap app.
- The domain depth is genuine: derived accords, dupes engine, scent twins,
  flanker lines, finder scoring, note pages, honest "Performance — estimated"
  provenance. Zero console errors anywhere on the walk.
- The interaction fabric (pinned hero, morph pill nav, page transitions,
  live regions, focus trap) feels alive and cared for.

**The gap in one sentence:** it looks like a magazine but the shelves are
mostly empty bottles — beautiful chrome around thin physical evidence, a
showpiece browser where a workhorse is needed, and a mobile experience that
got the desktop's leftovers.

## Tier 1 — Credibility & substance

1. **Photo coverage is 3.9% (15 of 385).** The very first card a visitor
   sees — Aventus, the most famous scent in the catalog — is a brown SVG
   blob with an "A" on it. An atlas of physical objects rendered as
   placeholders reads as a demo, not a product. Single highest-impact gap.
2. **301 of 385 scents have no perfumer credit.** Detail panels for most of
   the catalog are missing the human story connoisseurs care about.
3. **"Scent of the Moment" is hardcoded** to Terre d'Hermès (FEATURED_ID).
   Every visit, forever. It's the first promise the homepage makes and it's
   false; a date-seeded rotation is trivial.

## Tier 2 — Structural UX

4. **No grid/list view of the catalog.** 385 scents are browsable only one
   card at a time ("01 / 385"). The fan is a showpiece; there is no
   workhorse. This is the biggest utility gap on desktop and mobile both.
5. **Mobile Atelier is broken-by-distance.** The composition panel lives
   below the entire 108-chip note wall: tap a note at the top, scroll ~5
   screens to see it land in the pyramid, scroll back for the next note.
   The flagship feature does not function as a loop on a phone.
6. **The mobile atlas journey is inverted.** Between the hero and the first
   bottle sits the full Discover act — ~100 note chips of scrolling. Phone
   visitors meet the entire toolbox before a single perfume.
7. **Back button / URL don't track the panel.** Opening a detail from the
   fan doesn't update the URL (deep-link sync only works when arriving via
   /s/…), and Back exits the site instead of closing the panel. Mobile
   users instinctively press Back; they'll leave the app.
8. **Orbit is the default but the List is the workhorse.** The 3D
   constellation greets you with unlabeled colored spheres and faint family
   captions; you must hover orbs one by one to learn anything. Beautiful,
   but as the DEFAULT it puts style ahead of the task in both Discover and
   Atelier.

## Tier 3 — Visual & polish

9. **Translucent navbar collisions everywhere.** Section eyebrows, the
   scent-profile card, and constellation labels ghost through beneath the
   nav on every page (visible on Discover rail, Browse eyebrow, AMBER/CITRUS
   labels). The nav needs an opaque edge or the content needs scroll margin.
10. **The hero photo clashes with the palette.** A cool-grey studio
    rectangle sits untreated on the warm ivory field. Real photos across the
    app are raw rectangles with mismatched backgrounds inside an otherwise
    controlled palette (no warm wash/duotone treatment, no consistent
    canvas).
11. **Small mono text fails WCAG AA.** Champagne #B0843C on ivory #FAF8F4 ≈
    3.2:1 — below the 4.5:1 requirement at the 10–11px sizes used for
    eyebrows, labels and stats. The muted grays hover near the line too.
    It's the app's most-used text style.
12. **Mobile nav clips without affordance.** "My Shelf" is cut off; nothing
    signals the row scrolls; the wordmark crowds the first pill.
13. **Empty-state oddities.** "· 0 exact" highlighted in champagne before
    anything is selected reads like an error; a tall blank band sits between
    the Discover filters and Act II on desktop (short right rail vs long
    left column).
14. **JS weight.** ~471 KB of JS transferred on the homepage; the
    constellation chunk alone is 909 KB raw (~250 KB over the wire) and the
    BottleVisual chunk is a suspicious 166 KB. Heavy for a content site on
    mid-range phones.
15. **No global search.** Search lives only inside the Discover act; from
    Houses, Finder, a note page or the Atelier there is no way to look up a
    scent by name without first returning to the atlas and scrolling to
    Act I.

## Measured facts

- Photos: 15/385 (3.9%), public/photos = 2.8 MB
- Perfumer credits: 84/385 (301 missing); year missing: 4
- Homepage transfer: 471 KB JS, 397 KB images, 878 KB total, 15 requests
- Chunks: NoteConstellation 909 KB, index 531 KB, BottleVisual 166 KB (raw)
- Contrast: #B0843C on #FAF8F4 = 3.2:1 (AA small-text requires 4.5:1)
- Console: 0 errors on every page visited (desktop + mobile)
