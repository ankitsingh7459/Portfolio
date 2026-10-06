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
- [ ] TASK-007 Shell: Navbar (`~/ankit`, active underline), Footer, layout, keep Router + `/admin` working with new tokens

## Phase 3: Slice 1, Hero
- [ ] TASK-008 Hero static (copy placeholders, `./projects` button)
- [ ] TASK-009 Boot sequence (once, cursor, skip on key/click, reduced motion)
- [ ] TASK-010 Hero mobile + a11y pass + tests

## Phase 4: Slice 2, Projects and PrintAPM case study
- [ ] TASK-011 ProjectRow list from API with fallback, loading/error/empty states, hover motion
- [ ] TASK-012 PrintAPM case study page/section: `cat problem.txt`, `solution.txt`, `stats.json`, `architecture.md` (high level), `decisions.md`, `lessons.txt`, live link; real stats and screenshots from owner only
- [ ] TASK-013 Tests for projects + case study (fallback, links, direct URL)

## Phase 5: Slice 3, About / Stack / Log
- [ ] TASK-014 About (`cat about.txt`)
- [ ] TASK-015 Stack as grouped plain list (`stack.json` style)
- [ ] TASK-016 Timeline and certifications as `git log`
- [ ] TASK-017 GitHub activity restyled, lazy, graceful failure

## Phase 6: Slice 4, Contact / Resume
- [ ] TASK-018 Contact form with validation, API integration, success/error/rate-limit states, direct links
- [ ] TASK-019 Resume viewer/download (`cat resume.pdf`)

## Phase 7: Interactive
- [ ] TASK-020 `lib/terminalCommands` pure parser + Vitest unit tests
- [ ] TASK-021 Terminal UI in hero (desktop), Tab complete, history; mobile fallback buttons
- [ ] TASK-022 Ctrl/Cmd+K command palette (focus trap, Esc, arrows)

## Phase 8: Polish
- [ ] TASK-023 SEO: title/description, OG image, real domain in og:url, sitemap, robots, structured data
- [ ] TASK-024 Accessibility audit and fixes (keyboard, focus, landmarks, contrast)
- [ ] TASK-025 Performance: lazy loading, font preload, bundle check, Lighthouse targets; WebP for profile-photo.png (baseline 523 kB) only if owner approves keeping the photo
- [ ] TASK-026 Responsive pass 375/768/1440

## Phase 9: Release
- [ ] TASK-027 Security review against SECURITY.md (report issues first, then fix one by one)
- [ ] TASK-028 Code review against PRD, ARCHITECTURE, DESIGN, RULES, TEST_PLAN, SECURITY (report first, then fix)
- [ ] TASK-029 Playwright E2E suite for TEST_PLAN flows
- [ ] TASK-030 Preview deployment (Vercel preview of the branch); QA on live preview URL (refresh, direct URLs, slow network, API cold start, mobile)
- [ ] TASK-031 Merge to main, production deploy, production QA on live URL; pre-deploy check: `grep -r "\[FILL" frontend/src frontend/public frontend/index.html` must return nothing
- [ ] TASK-032 Monitoring: uptime check on site and `/api/health`, error tracking/analytics decision recorded; update README and all docs
- [ ] TASK-033 (stretch, only after owner approval) one small easter egg

Phase gates: stop and wait for "approved" after Phase 0, Phase 1, and after every phase from Phase 2 onward.
