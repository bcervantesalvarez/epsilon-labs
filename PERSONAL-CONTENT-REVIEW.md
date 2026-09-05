# Personal content review — September 5, 2026

Three additions to draft PR #2, prepared from the explicitly approved personal shortlist. No new 2025 entry was supported. Source projects were read without modification. Employment material, institutional research, private planning, operational server files, game assets, and exercise solutions are not included.

| Review route | Source activity | Scope |
| --- | --- | --- |
| `/blog/rare-events-dregora` | Analysis dated August 29, 2026 | Conditional probability, reproducible model checks, and verification limits |
| `/blog/algorithms-study-boundaries` | Five local commits dated September 1, 2026 | Study setup and tutoring policy; no modules recorded complete |
| `/projects/dregora-codex` | Prototype declares August 3, 2026 update | Featured interface case study; no public demo or launch claim |

All three frontmatter dates are September 5, 2026: the new draft date, not a backdated publication date. All three remain `draft: true` with visible draft notices and no human signoff. The featured entry appears first in the local Projects listing.

## Review and production builds

Run `npm run build:review`, then `npm run preview`, to inspect drafts locally. `npm run dev` also includes drafts. Review pages carry `noindex,nofollow`; review builds omit the sitemap, and the RSS feed always excludes drafts. The local review search index includes them for inspection.

The ordinary `npm run build` excludes draft routes, draft OG pages, and draft listing entries. It must be used for production. No deployment command was run. Generated conceptual image files remain ordinary static assets; exclusion of draft pages is not access control.

Validation commands:

```bash
npm run check
npm test
python scripts/verify-dregora-model.py
npm run build
node scripts/check-personal-build.mjs
npm run build:review
node scripts/check-personal-build.mjs --drafts
```

## Validation completed

Astro check: zero errors and warnings, two existing hints. All 15 regression tests pass. Production and review builds pass, with route/OG/listing/RSS boundary checks for all three new entries. Built-content checks find working local links and assets, two rendered formulas with no KaTeX errors, and language-aware tokens from actual MDX fences. All three new pages were inspected at 390px in light and dark themes; copy controls on both articles worked. The prior 21-route audit still verifies all 220 code/output blocks and original image references/table cells. No source project was changed.

## Probability verification

The original Python simulation block ran unchanged under Python 3.14.3 with seed 7 and 5,000,000 conditional Infernal trials. Result: 173,328 successes; 3.46656%; approximate 95% Monte Carlo interval 3.4505%–3.4826%. The accept-all baseline is exactly 501/10,400 (4.8173077%).

An independently written exact recurrence in `scripts/verify-dregora-model.py` gives 6,993/202,400 (3.4550395%) for the same assumed conflict mechanism. Multiplying by the assumed 1/22 and 1/1,000 gates gives 1.5704725 × 10⁻⁶, reciprocal 636,751. The recurrence also matched exhaustive enumeration of an eight-item toy pool: 768 successes in 6,720 ordered five-draw sequences.

This verifies model arithmetic, not the installed game's mechanics. No new bytecode/configuration inspection or gameplay testing was performed. No bytecode, server settings, player records, or original source analysis was redistributed. The article's Python example is an elementary exact-combinatorics calculation; the separate verification script is newly written.

Source identification without private locators: analysis SHA-256 `1b3d2d3815c0b2ef20466a7cbfe4a50c2c40b37de05c2f32b074e75b4520e472`; prototype SHA-256 `977bbd42f4cb3131e3936250f113b577398317499c1f8de1bf7c43f58fe2cd17`.

## Source boundaries and assets

The algorithms article summarizes policy and tooling; it does not reproduce assignments, solutions, or future project details. Source AGENTS and AI-GUIDANCE rules were followed. The license names Brian, but the original scaffold's human/AI split remains unknown. Configured CI is not described as a verified passing hosted run.

The Codex's selector, search/filtering, links, tooltips, copy-text assembly, and remembered weapon are source-inspected capabilities. They are not presented as a completed accessibility or usability evaluation. Source acknowledgments are broad; authorship and item-level source/asset permissions remain unresolved. The original app and database are not mirrored or hosted.

The two article diagrams are original SVGs in `public/images/personal/`. The conceptual Codex cover is in `public/images/projects/dregora-codex-1280.webp` and `dregora-codex-640.webp`. It was created with the built-in image-generation tool, then resized and encoded for the site. No existing artwork was replaced. Full generation prompt: see [personal artwork prompt](personal-artwork-prompt.md).

## AI transparency

AI drafted the three entries, diagrams, conceptual cover, verification code, and review documentation from Brian's approved scope and the selected sources. Original analysis author metadata names Brian; original human/AI contribution splits are unknown. Text/code model/version and reasoning effort: unknown (metadata unavailable). Image model/version and reasoning effort: unknown (metadata unavailable). No human review or signoff recorded.
