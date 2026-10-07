# Project Memory

## Current status
Phase 8 (Polish: TASK-023 to TASK-026) complete. Ready for Phase Gate 8 review.

## Completed
- TASK-001: Baseline established (branch `redesign/warm-terminal`, `npm ci` clean install, baseline lint, baseline production build, asset sizes recorded) — commit `bf8ba56`.
- TASK-002: Repo hygiene completed (removed 25 junk/log files, updated root & frontend `.gitignore` for `.vercel/`, `.env*`, `dist/`, `node_modules/`, resolved `README.md` merge markers, verified secrets with Gitleaks and history audit) — commit `1e6ff0e`.
- TASK-003: Created project documentation (docs/PRD.md, docs/ARCHITECTURE.md, docs/DESIGN.md, docs/DECISIONS.md, docs/TEST_PLAN.md, docs/SECURITY.md, RULES.md, TASKS.md, mirrored IDE rules, updated README.md, MEMORY.md) — commit `94c36a4`.
- TASK-004: Removed deprecated components, hooks, context, utils, and three.js dependencies. Verified zero references. JS uncompressed: 456.83 kB (vs baseline 477.3 kB), CSS: 25.39 kB (vs baseline 31.15 kB) — commit `630b3b1`.
- TASK-005: Created styles/tokens.css, wired Tailwind @theme with Warm Terminal tokens, configured IBM Plex Mono/Sans fonts via Google Fonts swap link, updated index.html metadata/theme-color, and styled global selection/focus/scrollbar — commit `661a47d`.
- TASK-006: Created shared primitives (hooks/useReducedMotion, hooks/useReveal, components/Reveal, components/TypedText, components/SectionHeading) with reduced-motion support. Wired LazyMotion with domAnimation — commit `8185f73`.
- TASK-007: Implemented Warm Terminal shell: redesigned Navbar (`~/ankit` logo, amber active/hover underline, scroll-spy, keyboard accessible, mobile menu), minimal monospace Footer, Layout wrapper, restyled ScrollProgress (2px amber line), and re-skinned `/admin` with Warm Terminal design tokens and `m` components without changing logic — commit `8ad9eb5`.
- TASK-008: Rebuilt features/hero/Hero.jsx static with Warm Terminal layout (~/ankit $ whoami, h1 in IBM Plex Mono, muted descriptor from data/hero.js, hero line, amber primary action ./projects, bordered mono secondary action cat resume.pdf). Removed neon-glow, old typing role-switcher, and glass classes — commit `3a08e6a`.
- TASK-009: Implemented one-time terminal boot sequence in Hero: sequential typing with step(2) blinking block cursor on active line only, skippable on keydown/click, instant rendering under prefers-reduced-motion, accessible full text in .sr-only container from initial render, and zero layout shift — commit `231739d`.
- TASK-010: Verified mobile responsiveness (375/768/1440 px, zero horizontal scroll, break-words wrapping), accessibility (AA/AAA contrast, >=44px tap targets, visible amber focus rings with offset), and installed vitest test suite (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) with 5 unit tests for Hero. Recorded ADR-010 in docs/DECISIONS.md and LazyMotion instruction in TASKS.md — commit `3d06ce7`.
- TASK-011: Rebuilt features/projects slice with SectionHeading ("$ ls projects"), bordered ProjectRow items, hover/focus amber marker with x+4px shift, staggered Reveal (0.06s), useProjects hook with 4s timeout and fallback, PrintAPM prepended and featured (ADR-011), and completely removed .glass and .neon-* classes from projects — commit `fbb8512`.
- TASK-012: Created PrintAPM case study route /projects/printapm (lazy-loaded), terminal layout ($ cat problem.txt, solution.txt, stats.json, architecture.md, decisions.md, lessons.txt, screenshots with dashed placeholder, live link to printapm.online), route title, heading focus, back navigation, and 404 fallback route — commit `9a417ec` (refactored `c850614`).
- TASK-013: Added test suites for projects slice (API mocking, PrintAPM priority, fallback on failure/timeout, zero '#' links, skeleton loading) and PrintAPM case study (all terminal sections rendered from data, live link attributes, route title, and unknown route 404 fallback). 14 unit tests passing — commit `42df058`.
- TASK-014: Rebuilt features/about slice with SectionHeading ("$ cat about.txt"), isolated lines in data/about.js ([FILL: about line 1..4]), readable line length max-w-[65ch], Reveal on scroll, and removed old About component with cards/glass/neon — commit `0ea717d`.
- TASK-015: Rebuilt features/stack slice with SectionHeading ("$ cat stack.json"), semantic dl/dt/dd/ul/li JSON markup with owner-approved technologies, no skill bars/percentages/icons, Reveal animation, and removed old Skills component — commit `412fc59`.
- TASK-016: Consolidated Timeline and Certifications into features/log/Log.jsx ($ git log --oneline), data in data/timeline.js and data/certifications.js with bare placeholders and null URLs, decorative aria-hidden fake hashes, empty state, and removed legacy Timeline/Certifications components with .glass/.neon-* — commit `2fc0c66`.
- TASK-017: Rebuilt features/github slice with SectionHeading ("$ gh activity --user ankitsingh7459"), useGitHubActivity hook with 4s timeout and graceful fallback on network failure or rate limits (403/429), terminal summary stats bar, bordered repo rows with hover shift, external profile link, removed legacy cyan/glass/neon styles, and added comprehensive unit test suite across Phase 5 slices — commit `ef6a85b` (fallback sanitized in `c77e146`).
- TASK-018: Rebuilt features/contact slice with SectionHeading ("$ mail ankit"), useContactForm hook mirroring backend constraints (name 2-100 chars, valid email, message 10-2000 chars), accessible labels, inline errors with aria-describedby, focus management to first invalid input, double-submit protection, terminal status responses (success, 429 rate limit, 500 error, network unavailable), single source of truth in data/contact.js for Contact and Footer, zero unconfirmed emails exposed in DOM, and completely deleted legacy .glass/.neon-text styles — commit `e7a3461`.
- TASK-019: Created features/resume slice with SectionHeading ("$ cat resume.pdf"), open and download actions for /resume.pdf, last updated metadata from data/resume.js, no embedded iframe (ADR-013), and conditional Navbar/Home visibility gating based on file availability (ADR-012) — commit `58df578`.
- TASK-019b: Motion cleanup completed. Verified 0 occurrences of motion. or full motion imports across frontend/src. Enabled LazyMotion strict in Root.jsx. Added ESLint no-restricted-imports rule forbidding import of motion from framer-motion. Verified motion chunk reduced from 145.93 kB (gzip: 48.87 kB) to 96.85 kB (gzip: 34.46 kB), saving 49.08 kB uncompressed (-33.6%).
- TASK-020: Created pure terminal command parser `lib/terminalCommands.js` and targets `lib/navTargets.js` with 23 unit tests — commit `331d96d`.
- TASK-021: Implemented Hero interactive Terminal panel (desktop input + history/tab completion, mobile button chips) with 10 unit tests — commit `edcd541`.
- TASK-022: Implemented accessible Command Palette with combobox, listbox, focus trap, restoration, and 9 unit tests — commit `2f5cd43`.
- TASK-023: SEO slice: dynamic robots.txt/sitemap.xml generator, `usePageMeta` hook, OpenGraph image generator script (19 kB PNG), `%SITE_URL%` Vite plugin, canonical links, and Person JSON-LD — commit `1ed099e`.
- TASK-024: Accessibility enhancements & audits: skip link pointing to #main, semantic landmarks (<main id="main">, <nav aria-label="Primary">, <footer aria-label="Site Footer">, role="region" for terminal), single h1 heading hierarchy, sr-only static headings with aria-hidden typing effects, WCAG 2.5.3 label-in-name compliance, strong border token `--color-border-strong: #706654` (3.28:1 contrast), universal prefers-reduced-motion CSS resets, and automated axe-core audit via CDP verifying 0 critical and 0 serious violations across default, terminal expanded, command palette open, and case study states — commit `6919668`.
- TASK-025: Performance pass: replaced axios with native fetch wrapper (saving -40.36 kB / -97% in api chunk, 41.62 kB -> 1.26 kB), refactored ScrollProgress to passive event listener with rAF and GPU transform (saving -10.32 kB / -10.7% in motion chunk, 96.85 kB -> 86.53 kB), trimmed unused italic font weights in index.html, dropped unused 523 kB profile-photo.png, and verified mobile Lighthouse results (Accessibility 100, Best Practices 96, Performance 77, TBT 120ms, CLS 0.016) — commit `4a375a2`.
- TASK-026: Responsive pass across viewports (320, 375, 414, 768, 1024, 1440, landscape 812x375, 200% zoom): verified zero horizontal overflow, >=44px mobile touch targets, and mobile menu keyboard accessibility.

## Current task
Phase Gate 8: Stop and wait for owner approval.

## Baseline (TASK-001)
- Environment: Node.js v22.19.0, Vite 8.0.13, Windows (PowerShell)
- Dependencies: `npm ci` installed 234 packages cleanly with zero modifications to package-lock.json.
- Lint status: `npm run lint` passed (0 errors, 0 warnings across all frontend files).
- Production build status: `npm run build` completed cleanly in 2.02s.
- CSS asset size:
  - `dist/assets/index-giSOUB5J.css`: 31.15 kB (gzip: 6.42 kB)
- JS asset size:
  - Total JS uncompressed: ~477.3 kB (gzip: ~158.4 kB) across 12 chunks
  - Major chunks:
    - `vendor-BtTihjQ6.js`: 230.89 kB (gzip: 74.62 kB)
    - `motion-BDWxvQg5.js`: 145.93 kB (gzip: 48.87 kB)
    - `Home-C7gXo3hA.js`: 42.23 kB (gzip: 11.71 kB)
    - `api-DDbND6_y.js`: 41.69 kB (gzip: 16.20 kB)
    - `Admin-VS4Met4A.js`: 6.35 kB (gzip: 2.05 kB)
    - `GitHubActivity-B_pireEq.js`: 3.51 kB (gzip: 1.34 kB)
    - `index-DUiHF5De.js`: 1.94 kB (gzip: 0.98 kB)
    - `ParticleBackground-DocJQaWQ.js`: 1.27 kB (gzip: 0.73 kB)
    - `AnimatedCursor-BJEn55i_.js`: 1.17 kB (gzip: 0.60 kB)
    - `App-DDAa7sam.js`: 1.12 kB (gzip: 0.57 kB)
    - `rolldown-runtime-BYbx6iT9.js`: 0.82 kB (gzip: 0.47 kB)
    - `useScrollAnimation-lHfxrc-m.js`: 0.37 kB (gzip: 0.27 kB)
- Image asset:
  - `dist/assets/profile-photo-D2fcBkY4.png`: 523.21 kB
- HTML:
  - `dist/index.html`: 1.71 kB (gzip: 0.72 kB)
- Lighthouse mobile (measured in TASK-025 via local Chrome CDP audit under simulated mobile network throttling 150ms RTT / 1.6 Mbps):
  - Accessibility: 100 / 100
  - Best Practices: 96 / 100
  - Performance: 77 / 100
  - Total Blocking Time (TBT): 120 ms
  - Cumulative Layout Shift (CLS): 0.016
  - First Contentful Paint (FCP): 3.0 s
  - Largest Contentful Paint (LCP): 4.6 s

## Secret Audit Details
- Gitleaks scan: Ran Gitleaks (`zricethezav/gitleaks:latest`) via Docker against the full repository Git history (all 6 commits scanned, ~371.18 KB). Result: 0 leaks found.
- Committed `.env` audit: Ran `git log --all --diff-filter=A --name-only | Select-String -Pattern "\.env"`. Verified that only `frontend/.env.example` and `backend/.env.example` were ever added to Git history; no `.env` files were ever committed.
- Log file inspection: Inspected `vercel-deploy.txt` and `vercel-deploy-utf8.txt` before removal. Confirmed they contained only Vercel CLI build output and deployment URLs; no tokens, API keys, or passwords were present.
- Code references: Past references to `password`, `secret`, `key`, and `token` across `backend/config/`, `backend/controllers/`, `backend/middleware/`, `backend/database/schema.sql`, and `README.md` were inspected and confirmed to be standard environment variable bindings (`process.env.DB_PASSWORD || ''`, `process.env.ADMIN_PASSWORD`, `process.env.JWT_SECRET`), schema column definitions, or example placeholders.
- Scope statement: No real credentials were found in the inspected content. Inspection covered all 6 historical Git commits via Gitleaks rules, git history file addition checks, and inspection of working tree configurations. This does not claim external credential validity or evaluate configurations outside the repository.

## Known issues
- Zero known issues. All legacy classes (.glass, .neon-text) and deprecated styles have been completely removed from index.css.

## Open owner inputs
- Owner role/title placeholder: `[FILL: title]` (CSE AI & ML undergraduate, Full-Stack Developer, and Co-Founder & Technical Lead at PrintAPM noted; placeholders kept internal).
- Hero intro in Ankit's words.
- 3-4 lines for `about.txt`.
- Copy language: English (confirmed).
- data/projects.js descriptions come from the old site; owner rewrites in own words.
- data/contact.js: email and LinkedIn URL (currently [FILL]).
- PrintAPM real database metrics (total prints, kiosks deployed, launch date, average upload-to-print time).
- PrintAPM screenshots (kiosk code screen, mobile upload flow, kiosk photo, blurred admin view).
- PrintAPM problem statement, solution description, and lessons learned in Ankit's words.
- Final domain, contact email, LinkedIn, GitHub links.
- Timeline entries and certifications.
- Which PrintAPM stack/architecture details are approved for public display.
- Decision on whether to keep profile-photo.png: dropped in TASK-025 per owner direction (`default: drop`).

## Verification Standards & Audits
- Headless `--dump-dom` captures rendered HTML elements and route resolution only.
- Specific client measurements (console errors, scrollWidth vs innerWidth for horizontal scroll) must be explicitly measured or marked as "not measured".
- Accessibility audit (TASK-024): axe-core run across Default Home, Expanded Terminal, Open Command Palette, and PrintAPM Case Study route with 0 critical, 0 serious, 0 moderate, and 0 minor violations.
- Responsive audit (TASK-026): Tested across 320px (Mobile Min), 375px (iPhone SE), 414px (Mobile Large), 812x375 (Landscape Mobile), 768px (Tablet Portrait), 1024px (Small Desktop), 1440px (Large Desktop), and 200% Zoom:
  - Zero horizontal overflow across all tested viewports (Home and /projects/printapm).
  - Mobile menu toggle open and Escape-to-close verified via CDP.
  - Interactive touch targets satisfy >=44px minimum touch target guidelines.

## Next step
- Phase Gate 8 review and approval.
- Next phase: Phase 9 (Release: TASK-027 to TASK-033).
