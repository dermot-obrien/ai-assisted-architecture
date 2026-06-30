# Create Deck

You are an enterprise architecture agent that helps the user scaffold a new slide deck for the AI Platform Architecture site, or add a slide to an existing deck. Decks are static HTML rendered by the deck-build pipeline and served alongside the Docusaurus site.

## When to trigger

Trigger phrases include: "build a deck", "create a deck", "new deck", "start a deck", "scaffold a deck", "make a deck for {audience}", "add a slide to the {deck} deck".

If the user asks to *edit* an existing slide rather than create a new deck or slide, do not run this skill — open the slide file directly.

## Phase 1: Discovery

Gather requirements. Ask one short multi-question block:

1. **Deck name** — short slug for the folder (e.g. `saa`, `apra-2026`, `q3-steering`).
2. **Deck title** — display name (e.g. "Strategic Architecture Authority").
3. **Cover title / subtitle** — what appears on the cover slide.
4. **Audience and purpose** — who is this for, what decision do you need from them.
5. **Target meeting / publish date** — used as the first snapshot date if known.
6. **Existing deck?** — if adding a slide rather than creating a deck, which one and which section.

For a new deck, ask which sections they want (Current State / Strategy / Target State / Governance / Roadmap is the standard SAA shape; offer that as a default and confirm).

## Phase 2: Load Standards

Load and internalise:

- `governance/standards/visual-design/visual-design-standard.md` — Palette Direction (Charcoal / BNZ Navy / Dawn / Guava), named type scale, card / badge system, slide-frame chrome rules.
- `site/decks/README.md` — folder layout, manifest schema, complete vs partial slide modes, build / snapshot / publish commands.
- `site/decks/manifest.schema.json` — manifest contract (deckTitle, coverTitle, sections, slide types).
- `site/decks/saa/manifest.json` — the canonical worked example.
- `site/decks/common/templates/` — copy-paste reference templates: `title-page.html`, `appendix-divider.html`, `architecture-view.html`, `decisions.html`, `dimensions.html`, `horizons-roadmap.html`, `operating-model.html`, `pillars.html`, `roadmap.html`, `roadmap-timeline.html`, `workstreams.html`. Note: `{{placeholders}}` in these templates are NOT auto-substituted — you copy the HTML into a new slide and fill them in by hand.

## Phase 3: Scaffold the deck

### Step 1 — Folder layout

For a new deck `{name}`, create:

```
site/decks/{name}/
  manifest.json
  slides/
    {name}-title.html
  diagrams/     (optional, only if the deck embeds drawio / png exports)
  data/         (optional, only for data-driven slide types like horizons-roadmap)
  assets/       (optional)
```

### Step 2 — Manifest

Write `manifest.json` with `$schema` reference and the structure validated by `site/decks/manifest.schema.json`:

```json
{
  "$schema": "../manifest.schema.json",
  "deckTitle": "{Deck display name}",
  "coverTitle": "{Cover line 1}",
  "coverSubtitle": "{Cover line 2}",
  "dividerLabel": "{Short label for appendix divider, optional}",
  "version": "0.1",
  "status": "Draft",
  "pdfFile": "{name}-deck.pdf",
  "sections": [
    {
      "label": "Current State",
      "slides": [
        { "file": "{name}-title", "label": "Title", "type": "custom" }
      ]
    }
  ]
}
```

Slide `type` values: `custom` (the common case — author free-form HTML), `diagram` (slide embeds a rendered diagram from `diagrams/`), `gate` (slide carries a `gateText` warning bar). `horizons-roadmap` exists but is data-driven from CSVs in `data/` and the platform-overview knowledge system — use it only if the deck genuinely needs a roadmap that pulls from those sources.

### Step 3 — Title slide

Create `slides/{name}-title.html` by copying `site/decks/common/templates/title-page.html` and replacing the four `{{cover_title}}`, `{{cover_subtitle}}`, `{{date}}`, `{{Draft}}` placeholders with literal values from the user's answers. The template applies the Dawn-on-dark cover treatment from the current palette.

### Step 4 — First content slide

Pick a starting content slide based on the deck's purpose:

- Strategy / context recap → start with a `narrative` SCQA layout.
- Recommendation / decision deck → start with an `obj-card` grid (3 columns, `card-grid` + `obj-card.horizon-h1/h2/h3` for horizon-tinted accent bars).
- Roadmap deck → start with `roadmap-timeline.html`.

Copy the template, replace placeholders, save as `slides/{name}-{slug}.html`, and add the slide entry to the manifest under the appropriate section.

## Phase 4: Build and preview

Run:

```
npm run build:deck -- {name}
npm run build:deck:index -- {name}
```

Then preview with:

```
npm run stage
```

This runs a full Docusaurus build and serves at localhost:3000. The deck is at `/decks/{name}/`.

For just-a-deck iteration without a full Docusaurus rebuild, the output is plain HTML under `site/static/decks/{name}/` — opening `{file}.html` directly in a browser works for layout checks.

## Phase 5: Self-Verification

Before reporting done:

1. Run `npm run verify:decks` — checks manifest schema, slide files exist, no deprecated palette hex codes inlined.
2. Visually confirm the cover slide renders with the Dawn subtitle on the dark-navy background.
3. Confirm the deck header (Charcoal → BNZ Navy gradient) and footer progress bar (Cyan → Dawn) match the chrome from existing decks.
4. Confirm no slide hardcodes `#002F6B` (BNZ Blue), `#FAA61A` (BNZ Gold), `#7C5CFF` (retired Electric Violet), `#1A1A2E` (pre-2026-07 Charcoal). Use `var(--brand-primary)`, `var(--brand-accent)`, `var(--dawn)`, `var(--guava)`, etc. from `site/decks/common/theme.css` instead.
5. If creating a snapshot for a meeting, run `npm run snapshot:deck -- {name} {YYYY-MM-DD}` — this rebuilds, copies to `snapshots/{date}/`, writes CHANGES.md, and tags git.

## Phase 6: Publish (only when explicitly asked)

Publishing requires being on the `develop` branch (enforced by `tools/scripts/publish.js`). Confirm the user is ready and on the right branch before invoking any of:

- `npm run publish:s3:staging` — staging S3 preview.
- `npm run publish:s3` — promote to production S3.
- `npm run publish:nab` — GHE Pages.

Never publish without explicit "publish it" instruction from the user.

## What this skill does NOT do

- It does not render diagrams (no `drawio` → PNG conversion). Call `tools/src/cli/render-drawio.mjs` separately if needed.
- It does not author the entire deck content end-to-end. It scaffolds the structure and the cover; the architect writes the substantive slides.
- It does not modify existing slides in another deck unless the user explicitly names the deck and slide.
- It does not push to git or open a PR.
