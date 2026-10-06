# Project Memory

## Current status
Phase 0 in progress (TASK-001 completed).

## Completed
- TASK-001: Baseline established (branch `redesign/warm-terminal`, `npm ci`, baseline lint, baseline production build).

## Current task
TASK-002: Repo hygiene (audit junk/log files, verify untracked dist/node_modules, resolve README conflict markers).

## Baseline (TASK-001)
- Environment: Node.js, Vite 8.0.13, Windows (PowerShell)
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
  - Not measured locally (Lighthouse CLI is not installed locally in the development environment; will be measured against preview/browser during QA).

## Known issues
- 22 root junk/log files tracked in git (curl-*.txt, render-*.txt, vercel-*.txt, etc.).
- README.md has unresolved merge conflict markers (`<<<<<<< HEAD`).
- `Home.jsx` has preserved working changes (commented out VisitorStats).

## Open owner inputs
- Hero intro, about text, PrintAPM metrics and assets, contact links, timeline milestones, and production domain.
- Confirmed: English language, CSE (AI & ML) undergraduate, Full-Stack Developer, and Co-Founder & Technical Lead at PrintAPM.

## Next step
TASK-002: Repo hygiene.
