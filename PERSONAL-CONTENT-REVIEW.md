# Personal content review — September 5, 2026

Seven draft entries in PR #2: five personal/academic articles and two project case studies, prepared from the approved shortlist and public repositories. Source projects were read without modification. Employment material, institutional research, private planning, operational server files, game assets, and exercise solutions are not included.

| Review route | Source activity | Scope |
| --- | --- | --- |
| `/blog/rare-events-dregora` | Analysis dated August 29, 2026 | Conditional probability, reproducible model checks, and verification limits |
| `/blog/algorithms-study-boundaries` | Five local commits dated September 1, 2026 | Study setup and tutoring policy; no modules recorded complete |
| `/blog/discord-single-worker-queue` | Author date March 19, 2026 | Queue architecture and failure boundaries |
| `/blog/spark-sensor-analysis` | March 17, 2025 Pacific commit | Sensor alignment, Spark workflow, weak predictions |
| `/blog/cnn-sparse-concepts` | Source deck dated June 6, 2025 | Sparse concepts, losses, evaluation limits |
| `/projects/discord-chatbot` | Author date March 19, 2026 | Complementary project case study |
| `/projects/dregora-codex` | Prototype declares August 3, 2026 update | Featured interface case study; no public demo or launch claim |

Five articles and the Discord project use the evidenced source activity as their primary date, explicitly labeled **Work date**, with draft preparation separately recorded as September 5, 2026. These are not historical publication dates. Discord uses commit author date March 19; its committer timestamp is March 27 UTC (March 26 Pacific). Spark's March 18 UTC commit falls on March 17 Pacific; its folder label is not the work date. CNN uses the explicit June 6 deck date, with May 28 lineage noted. Dregora Codex retains its September 5 draft date and separately describes its declared August 3 prototype update. All seven remain `draft: true` with visible notices and no human signoff.

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

Astro check: zero errors and warnings, two existing hints. All 15 regression tests pass. Production and review builds pass, with route/OG/listing/RSS boundary checks for all seven draft entries. Built-content checks find working local links and assets, six rendered formulas with no KaTeX errors, and language-aware tokens from actual MDX fences. The six expanded/new pages were checked at 390px and 1366px in both themes for page overflow, loaded artwork, dates, and formula errors. Representative layouts and the comparison chart received visual inspection. The unchanged Dregora project retains its earlier review checks. The prior 21-route audit still verifies all 220 code/output blocks and original image references/table cells. No source project was changed.

## Probability verification

The original Python simulation block ran unchanged under Python 3.14.3 with seed 7 and 5,000,000 conditional Infernal trials. Result: 173,328 successes; 3.46656%; approximate 95% Monte Carlo interval 3.4505%–3.4826%. The accept-all baseline is exactly 501/10,400 (4.8173077%).

An independently written exact recurrence in `scripts/verify-dregora-model.py` gives 6,993/202,400 (3.4550395%) for the same assumed conflict mechanism. Multiplying by the assumed 1/22 and 1/1,000 gates gives 1.5704725 × 10⁻⁶, reciprocal 636,751. The recurrence also matched exhaustive enumeration of an eight-item toy pool: 768 successes in 6,720 ordered five-draw sequences.

This verifies model arithmetic, not the installed game's mechanics. No new bytecode/configuration inspection or gameplay testing was performed. No bytecode, server settings, player records, or original source analysis was redistributed. The article's Python example is an elementary exact-combinatorics calculation; the separate verification script is newly written.

Source identification without private locators: analysis SHA-256 `1b3d2d3815c0b2ef20466a7cbfe4a50c2c40b37de05c2f32b074e75b4520e472`; prototype SHA-256 `977bbd42f4cb3131e3936250f113b577398317499c1f8de1bf7c43f58fe2cd17`.

## Source boundaries and assets

The algorithms article summarizes policy and tooling; it does not reproduce assignments, solutions, or future project details. Source AGENTS and AI-GUIDANCE rules were followed. The license names Brian, but the original scaffold's human/AI split remains unknown. Configured CI is not described as a verified passing hosted run.

The Codex's selector, search/filtering, links, tooltips, copy-text assembly, and remembered weapon are source-inspected capabilities. They are not presented as a completed accessibility or usability evaluation. Source acknowledgments are broad; authorship and item-level source/asset permissions remain unresolved. The original app and database are not mirrored or hosted.

Article diagrams and the Discord queue SVG are original code-generated artwork. The new probability comparison chart is reproducible with `scripts/render-probability-comparison.py`. Amalgalich, Spark, and CNN have new conceptual covers with responsive WebP sizes. The conceptual Codex cover is in `public/images/projects/dregora-codex-1280.webp` and `dregora-codex-640.webp`. It was created with the built-in image-generation tool, then resized and encoded for the site. No existing artwork was replaced. Full generation prompt: see [personal artwork prompt](personal-artwork-prompt.md).

## AI transparency

AI drafted and expanded the seven entries, diagrams, conceptual covers, chart, verification code, and review documentation from Brian's approved scope and the selected sources. Original analysis author metadata names Brian; original human/AI contribution splits are unknown. Text/code model/version and reasoning effort: unknown (metadata unavailable). Image model/version and reasoning effort: unknown (metadata unavailable). No human review or signoff recorded.

## Expanded source checks

Discord: public commit `b698defc16d85a02de54bb69b15c2e2194546a65`; README, queue, persistence, models and command handler read. A single foreground worker does not preclude concurrent background summaries. Persistence plus an in-memory handoff is not atomic or replayable; startup cancels pending/processing rows. Original commit credits Claude Opus 4.6, source-reported; reasoning effort unknown. No bot was run.

Spark: public commit `295f095dda00ecfae416643c5e3cd45e5e3aea08`; report and analysis script read. Pooled windows, nearest-time alignment, random-row splitting, capped plots and reported AUC are distinguished. UCI dataset attribution retained; no raw records reproduced. No pipeline rerun or medical interpretation.

CNN: public commit `320a155bb93b92a10564280b92d63f1a5e713b52`; deck/code appendix inspected. Logit targets, source/code loss-normalization differences, and reuse of test data for validation are made explicit. Reported table values are historical; no model trained. Conceptual artwork does not assign semantic labels to learned dimensions or reproduce source figures.

Brian clarified the firsthand encounter account: three well-geared players, Infernal, and Webber/Fiery/Bulwark/Lifesteal together. Fiery set players on fire; no direct 50% multiplier is claimed. Bulwark's roughly 50% negation and apparent near-full healing remain recollections, not verified measurements. Russet is unconfirmed. The revised four-target model gives 1,739/164,450 = 1.057464% given Infernal (one in 94.6). An independent exhaustive toy check matches 2,088/20,160; a 200,000-trial seed-7 permutation simulation gives 2,124 successes (1.062%, approximate 95% interval 1.01708%–1.10692%). The original three-target result and optional Russet scenario remain clearly separate. Work date is the analysis date, not the encounter date; the supplied account is not signoff.

Current content expansion/revision generator: `gpt-6-astra`, verified against this task's execution metadata. Reasoning effort: extra high, user-reported (not independently verified; configured field is null). Historical source and image-generation settings remain separately attributed; no raw session metadata is shipped.

No fourth presentation topic has been assumed; it remains awaiting Brian's selection. Existing presentations, design, and Dregora case study are preserved. No production deployment.
