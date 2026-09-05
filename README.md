# Epsilon Labs

Personal site for **Brian Cervantes Alvarez** — statistical consulting,
predictive modeling, and decision-grade analytics. Lives at
[epsilon-labs.org](https://epsilon-labs.org).

Built with **Astro** + **TypeScript** + **MDX** + **Tailwind CSS**.

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to ./dist
npm run preview  # serve the build locally
npm run check    # type-check + content-collection schema check
```

Requires Node 20+.

## Repo layout

```
/
├── public/                 # Static assets served as-is (/images, /documents, CNAME, favicon.svg)
├── scripts/
│   └── qmd-to-mdx.ts       # Quarto → MDX port helper (npm run port)
├── src/
│   ├── pages/              # Each file = a route (about.astro -> /about)
│   │   ├── projects/       # Listing + dynamic [...slug].astro
│   │   ├── blog/
│   │   ├── talks/
│   │   ├── og/             # Build-time OG card PNGs (Satori + resvg)
│   │   └── forms/
│   ├── layouts/
│   │   └── BaseLayout.astro    # <html> shell + navbar + footer + theme bootstrap
│   ├── components/         # Reusable: Navbar, Footer, Section, Card, Button, StatusBanner
│   ├── content/            # *.mdx (+ *.body.html Quarto exports) per collection
│   │   ├── projects/       # Typed frontmatter, validated at build
│   │   ├── blog/
│   │   └── talks/
│   ├── content.config.ts   # Zod schemas for projects/blog/talks
│   ├── lib/
│   │   └── site.ts         # Site identity constants; URLs derive from astro.config.ts `site`
│   └── styles/
│       └── global.css      # Design tokens (@theme) + Tailwind v4 layers — single source of truth
├── astro.config.ts         # `site` here is the single source of truth for the domain
├── tsconfig.json
└── package.json
```

## Design tokens

All colors, fonts, and spacing live as CSS custom properties in the
`@theme` block of [`src/styles/global.css`](src/styles/global.css).
This is Tailwind v4: there is no `tailwind.config.ts` — utilities
(`bg-bg`, `text-ink`, `border-rule`, etc.) are generated straight from
`@theme`, and the dark theme just swaps the values under
`[data-theme="dark"]`.

To re-tune the palette: edit `@theme { ... }` (and the dark overrides)
in `global.css`. Tokens are complete color values — consume them with
`var(--color-x)`, or `color-mix(in srgb, var(--color-x) N%, transparent)`
when you need alpha. Never wrap a token in `rgb(...)`.

## Adding content

Drop a `.mdx` file into the matching `src/content/<collection>/`
directory. Frontmatter is validated by Zod
([content.config.ts](src/content.config.ts)) — a missing field or wrong
type fails the build with a helpful error.

Minimal project frontmatter:

```mdx
---
title: "Project title"
description: "One-line summary that shows under the title."
tag: "Statistical modeling"
date: 2026-04-01
status: active           # or "archived"
image: ../../../public/images/project-cover.jpg   # optional
---

# Body in MDX (Markdown + optional JSX)
```

## Deployment

- **Hosting:** Cloudflare Workers static assets — the `epsilon-labs`
  Worker builds with `npm run build` and deploys `dist/` via
  `npx wrangler deploy`. [`wrangler.jsonc`](wrangler.jsonc) keeps the
  deploy assets-only: do **not** add the Cloudflare SSR adapter — the
  OG image route needs Node + native resvg at build time and cannot run
  inside a Worker.
- **Custom domain:** `epsilon-labs.org`, attached to the Worker in the
  Cloudflare dashboard (the canonical origin lives in `astro.config.ts`)
- **Form backend:** Google Apps Script (the contact form on `/privacy` posts there). Cloudflare Turnstile is wired client-side; set the real sitekey on the `.cf-turnstile` div in `src/pages/privacy.astro` and add the matching secret check in the Apps Script to enable it end to end.

## Why Astro

- Ships **zero JS by default**. The site loads as static HTML + CSS.
- **TypeScript everywhere**, including content frontmatter (Zod schemas).
- **MDX** for posts: Markdown with optional component embeds.
- **Build in seconds**, not minutes (no R/Python at render time).
- **Tailwind** for utility-first styling — design tokens scale cleanly.

See [`AGENTS.md`](AGENTS.md) for the layout an agent (or future-you)
should follow when editing this repo.

---

Historical provenance: the original repository attributes its Astro rewrite to Claude Code. Exact model/version and reasoning effort are unknown (metadata unavailable).*Claude** —
Anthropic's Claude Code agent, running its latest-generation frontier
model with extended thinking mode enabled.*


## September 2026 visual redesign

Light and dark modes follow their selected palette throughout the site. The connected epsilon/L monogram uses copper/deep-navy in light mode and copper/pale-blue in dark mode. All geometry is vector; the hero uses closely spaced extruded layers with reduced-motion support. Official institution, LinkedIn and GitHub marks retain their shapes. Linfield's displayed bounds center the actual artwork. The three existing degrees use a distinct floating credential-card composition that shares Projects’ hover and depth language, alongside an illustrated statistical-practice panel; degree headings lead in distinct copper, navy and plum accents, with smaller university labels. Degree facts and department links are preserved.

Projects use alternating large showcases with multiple image planes and clear onward links. Two new conceptual project covers were generated with the built-in image-generation tool; responsive WebP files replace general illustrations, while brand marks and analytical figures remain intact. Image-generation model/version and reasoning effort: unknown (metadata unavailable). Services has a dimensional hero, six illustrated practice offerings and an engagement path. Resources uses topic shelves, enlarged marks, compact reading rows and distinct original concept artwork. All 15 blog posts share the main timeline; `/archive` redirects to `/blog`, and existing article URLs remain intact. Calendar dates use UTC formatting to avoid previous-day shifts.

Articles restore list markers and disclosures, scrollable code/tables, locally bundled KaTeX, and four saved Plotly charts. Data and mathematical meaning are preserved. The gym chart keeps all 15 traces and facet labels; wide plots scroll inside their frame. Thirty-five webR examples now expose their saved R code because the imported article omitted the original inline exercise runtime.

All six presentations have a dedicated viewer with previous/next buttons, expanded view, standalone link and responsive reading view. See [presentation notes](public/presentations/README.md). The Willamette master's-program affiliation replaces the incorrect OSU event label on the survival-analysis talk. Its source date remains unchanged.

Known source limitations: three Missing Data plot files are absent from the upstream repository and are explicitly marked unavailable. Quarto 101's live Python demo opens on its original origin because its worker requires that origin. The published webR deck contains stale self-contained YouTube embeds and may report media/runtime errors; slide navigation and readable content remain available. External Shiny services and media retain their own runtime and theme. An interactive GT payload omitted during the earlier import cannot be reconstructed from this repository.

Validation: `npm run check`, `npm run build`, and `node --test tests/theme.test.mjs`. Browser QA covered all 15 blog routes and all six reading views at 390px with no page overflow or KaTeX errors; all six slide viewers rendered and advanced on desktop/mobile. Explicit expand/collapse checks confirmed each canvas remained inside its frame with scale below 1, and collapsed layouts had no overflow. Primary page themes, navigation, school logos, 320px layout and reduced motion were also checked. This is functional and visual QA, not independent verification of analytical claims.

The site-grounded assistant is a future high-priority item in [BACKLOG.md](BACKLOG.md). No backend service was implemented or provisioned in this pass. No production deployment was performed.

AI contribution: Codex generated the redesign, vector identity, rendering fixes and validation code from Brian's direction and existing content. Model/version: unknown (metadata unavailable). Reasoning effort: unknown (metadata unavailable). No human signoff recorded.

The current monogram uses original level, centrally interwoven epsilon and serif capital L outlines, inspired by the restrained AS reference. The L passes behind the epsilon’s lower curve and in front through its middle, with transparent over-under cuts and no oversized sweep. Copper/deep navy and the lighter dark-mode reverse share geometry across the header, footer, hero, favicon and six reusable SVG variants. The hero renders depth within one SVG for smooth edges.


### Navigation and practice-card interactions

Back-to-top resolves the current button after Astro navigation, hides below a viewport-aware threshold, transfers focus to main content and honors reduced motion. A footer link remains available. On mobile a bottom strip separates the control from reading content; bottom-right remains free for any future assistant. Skip-to-content and skip-to-search precede the navigation. Article contents lists appear for articles with at least three second-level headings. Keyboard guidance documents native controls; no global shortcut overrides browser commands. Presentation readers use one main landmark.

All six Services practice areas and the four corresponding home-page cards reveal topic-specific, clearly labeled synthetic demos on click/tap or Enter/Space. Only the active face is exposed to reading and tab order; returning restores focus. Reduced motion changes faces without rotation. Summaries and Services links remain available. Tests cover navigation replacement, focus, reduced motion, demo calculations and face state. These targeted checks are not a formal accessibility certification.


### Editorial imagery and topic artwork

All 15 blog posts were inventoried: 10 decorative covers were regenerated and installed with responsive WebP sources and descriptive alternatives; five logo-based covers remain accurate. All 37 other in-article images are unchanged (33 analytical figures, three instructional chart examples and one research poster). See `public/images/blog/README.md` for coverage and `public/images/blog/Prompts.md` for prompts and image-generation provenance. No analytical data or results were fabricated or regenerated.

Practice cards use six distinct original vector illustrations, including a dashboard, reporting loop, training book and methodology-review magnifier. Resource illustrations distinguish books, sampling, calendars, linked data tables and world data. Nested image frames and forced white padding were removed. R-bloggers and R Weekly retain source assets with near-white paper knocked out at render time; their colored marks are retained. No new raster logo was generated.
