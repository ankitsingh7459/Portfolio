# Tasks (mark `[x]` when done and committed)

## Phase 0: Baseline and hygiene
- [x] TASK-001 Create branch `redesign/warm-terminal`; `npm ci`; run lint and build; record bundle size and Lighthouse baseline in MEMORY.md (commit `bf8ba56`)
- [x] TASK-002 Repo hygiene: audit and delete junk files, untrack node_modules/dist, fix README conflict markers, secret scan (commit `1e6ff0e`)

## Phase 1: Docs
- [x] TASK-003 Create all docs, RULES.md, TASKS.md, .env.example; owner approves (commit `94c36a4`)

## Phase 2: Foundation
- [x] TASK-004 Remove listed components/hooks/context and unused deps; build still passes
- [x] TASK-005 Tokens (`styles/tokens.css`), fonts, global CSS per DESIGN.md
- [x] TASK-006 Shared primitives: useReducedMotion, Reveal, TypedText, SectionHeading; LazyMotion + m components, record new motion chunk size (baseline 146 kB)
- [x] TASK-007 Shell: Navbar (`~/ankit`, active underline), Footer, layout, keep Router + `/admin` working with new tokens

## Phase 3: Slice 1, Hero
- [x] TASK-008 Hero static (copy placeholders, `./projects` button)
- [x] TASK-009 Boot sequence (once, cursor, skip on key/click, reduced motion)
- [x] TASK-010 Hero mobile + a11y pass + tests

## Phase 4: Slice 2, Projects and PrintAPM case study
- [x] TASK-011 ProjectRow list from API with fallback, loading/error/empty states, hover motion
- [x] TASK-012 PrintAPM case study page/section: `cat problem.txt`, `solution.txt`, `stats.json`, `architecture.md` (high level), `decisions.md`, `lessons.txt`, live link; real stats and screenshots from owner only
- [x] TASK-013 Tests for projects + case study (fallback, links, direct URL)

## Phase 5: Slice 3, About / Stack / Log
- [x] TASK-014 About (`cat about.txt`)
- [x] TASK-015 Stack as grouped plain list (`stack.json` style)
- [x] TASK-016 Timeline and certifications as `git log`
- [x] TASK-017 GitHub activity restyled, lazy, graceful failure

## Phase 6: Slice 4, Contact / Resume
- [x] TASK-018 Contact form with validation, API integration, success/error/rate-limit states, direct links
- [x] TASK-019 Resume viewer/download (`cat resume.pdf`)
- [x] TASK-019b Motion cleanup: LazyMotion strict enabled, no-restricted-imports rule added, motion chunk reduced from 145.93 kB to 96.85 kB (gzip: 34.46 kB)

## Phase 7: Interactive
- [x] TASK-020 `lib/terminalCommands` pure parser + Vitest unit tests
- [x] TASK-021 Terminal UI in hero (desktop), Tab complete, history; mobile fallback buttons
- [x] TASK-022 Ctrl/Cmd+K command palette (focus trap, Esc, arrows)

## Phase 8: Polish
- [x] TASK-023 SEO: title/description, OG image, real domain in og:url, sitemap, robots, structured data
- [ ] TASK-024 Accessibility audit and fixes (keyboard, focus, landmarks, contrast)
- [ ] TASK-025 Performance: lazy loading, font preload, bundle check, Lighthouse targets; WebP for profile-photo.png (baseline 523 kB) only if owner approves keeping the photo
- [ ] TASK-026 Responsive pass 375/768/1440

## Phase 9: Release
- [ ] TASK-027 Security review against SECURITY.md (report issues first, then fix one by one)
- [ ] TASK-028 Code review against PRD, ARCHITECTURE, DESIGN, RULES, TEST_PLAN, SECURITY (report first, then fix)
- [ ] TASK-029 Playwright E2E suite for TEST_PLAN flows
- [ ] TASK-030 Preview deployment (Vercel preview of the branch); QA on live preview URL (refresh, direct URLs, slow network, API cold start, mobile); VITE_API_URL is set in Vercel for Preview AND Production; backend FRONTEND_URL/CORS allows the preview and production origins
- [ ] TASK-031 Merge to main, production deploy, production QA on live URL; VITE_API_URL is set in Vercel for Preview AND Production; backend FRONTEND_URL/CORS allows the preview and production origins; pre-deploy check: run `npm run check:release` (`node scripts/check-release.mjs`) and verify `grep -r "\[FILL" frontend/src frontend/public frontend/index.html` returns nothing. A section with no real content at release is removed from Home and the Navbar. No [FILL] may ship.
- [ ] TASK-032 Monitoring: uptime check on site and `/api/health`, error tracking/analytics decision recorded; update README and all docs
- [ ] TASK-033 (stretch, only after owner approval) one small easter egg

Phase gates: stop and wait for "approved" after Phase 0, Phase 1, and after every phase from Phase 2 onward.
