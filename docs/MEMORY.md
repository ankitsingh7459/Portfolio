# Project Memory

## Current status
Phase 2 foundation completed (TASK-004, TASK-005, TASK-006, TASK-007 complete). Ready for Phase Gate 2 approval.

## Completed
- TASK-001: Baseline established (branch `redesign/warm-terminal`, `npm ci` clean install, baseline lint, baseline production build, asset sizes recorded) — commit `bf8ba56`.
- TASK-002: Repo hygiene completed (removed 25 junk/log files, updated root & frontend `.gitignore` for `.vercel/`, `.env*`, `dist/`, `node_modules/`, resolved `README.md` merge markers, verified secrets with Gitleaks and history audit) — commit `1e6ff0e`.
- TASK-003: Created project documentation (docs/PRD.md, docs/ARCHITECTURE.md, docs/DESIGN.md, docs/DECISIONS.md, docs/TEST_PLAN.md, docs/SECURITY.md, RULES.md, TASKS.md, mirrored IDE rules, updated README.md, MEMORY.md) — commit `94c36a4`.
- TASK-004: Removed deprecated components, hooks, context, utils, and three.js dependencies. Verified zero references. JS uncompressed: 456.83 kB (vs baseline 477.3 kB), CSS: 25.39 kB (vs baseline 31.15 kB) — commit `630b3b1`.
- TASK-005: Created styles/tokens.css, wired Tailwind @theme with Warm Terminal tokens, configured IBM Plex Mono/Sans fonts via Google Fonts swap link, updated index.html metadata/theme-color, and styled global selection/focus/scrollbar — commit `661a47d`.
- TASK-006: Created shared primitives (hooks/useReducedMotion, hooks/useReveal, components/Reveal, components/TypedText, components/SectionHeading) with reduced-motion support. Wired LazyMotion with domAnimation — commit `8185f73`.
- TASK-007: Implemented Warm Terminal shell: redesigned Navbar (`~/ankit` logo, amber active/hover underline, scroll-spy, keyboard accessible, mobile menu), minimal monospace Footer, Layout wrapper, restyled ScrollProgress (2px amber line), and re-skinned `/admin` with Warm Terminal design tokens and `m` components without changing logic. Motion chunk reduced to 142.40 kB (vs 146.35 kB).

## Current task
Phase Gate 2: Owner review and approval of Phase 2 foundation before Phase 3 (Slice 1: Hero).

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
- Lighthouse mobile:
  - Not measured locally (Lighthouse CLI not installed locally; will be measured against preview/browser during QA).

## Secret Audit Details
- Gitleaks scan: Ran Gitleaks (`zricethezav/gitleaks:latest`) via Docker against the full repository Git history (all 6 commits scanned, ~371.18 KB). Result: 0 leaks found.
- Committed `.env` audit: Ran `git log --all --diff-filter=A --name-only | Select-String -Pattern "\.env"`. Verified that only `frontend/.env.example` and `backend/.env.example` were ever added to Git history; no `.env` files were ever committed.
- Log file inspection: Inspected `vercel-deploy.txt` and `vercel-deploy-utf8.txt` before removal. Confirmed they contained only Vercel CLI build output and deployment URLs; no tokens, API keys, or passwords were present.
- Code references: Past references to `password`, `secret`, `key`, and `token` across `backend/config/`, `backend/controllers/`, `backend/middleware/`, `backend/database/schema.sql`, and `README.md` were inspected and confirmed to be standard environment variable bindings (`process.env.DB_PASSWORD || ''`, `process.env.ADMIN_PASSWORD`, `process.env.JWT_SECRET`), schema column definitions, or example placeholders.
- Scope statement: No real credentials were found in the inspected content. Inspection covered all 6 historical Git commits via Gitleaks rules, git history file addition checks, and inspection of working tree configurations. This does not claim external credential validity or evaluate configurations outside the repository.

## Known issues
- Legacy classes (.glass, .neon-text, .neon-glow) are preserved temporarily in index.css until sections using them are rebuilt in their respective vertical slices (legacy, remove per slice).

## Open owner inputs
- Owner role/title placeholder: `[FILL: title]` (CSE AI & ML undergraduate, Full-Stack Developer, and Co-Founder & Technical Lead at PrintAPM noted; placeholders kept internal).
- Hero intro in Ankit's words.
- 3-4 lines for `about.txt`.
- Copy language: English (confirmed).
- PrintAPM real database metrics (total prints/orders, users, kiosks/campuses, launch date, average upload-to-print time).
- PrintAPM screenshots (kiosk code screen, mobile upload flow, kiosk photo, blurred admin view).
- PrintAPM problem statement and lessons learned in Ankit's words.
- Final domain, contact email, LinkedIn, GitHub links.
- Timeline entries and certifications.
- Which PrintAPM stack/architecture details are approved for public display.
- Decision on whether to keep profile-photo.png (TASK-025).

## Next step
TASK-008: Hero static (copy placeholders, ./projects button) upon Phase Gate 2 approval.
