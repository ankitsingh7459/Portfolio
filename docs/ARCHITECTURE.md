# Architecture

## Frontend
React 19 + Vite + Tailwind CSS 4 + Framer Motion + React Router (JavaScript/JSX).

## Backend (unchanged)
Node + Express + MySQL on Render. Frontend talks to it only through `src/services/api.js` using `VITE_API_URL`.

## Flow
Visitor -> React UI -> `services/api.js` -> Express API -> MySQL
If the API fails or is cold, UI renders from local fallback data (never a blank section).

## Folder structure (frontend/src)
- `app/` Root, routes
- `pages/` Home, Admin, (CaseStudy if routed)
- `components/` shared UI (Navbar, Footer, SectionHeading, TypedText, Reveal, ProjectRow, Terminal, CommandPalette)
- `features/` per-section code (hero, projects, case-study, about, stack, log, contact)
- `data/` local fallback content (projects, stack, timeline) with `[FILL]` markers
- `services/` api client only
- `hooks/` useReducedMotion, useReveal, useKeyboardShortcut
- `lib/` pure helpers (terminal command parser)
- `styles/` tokens and global CSS

## Architectural rules
- UI components contain no fetch logic. Network calls live in `services/`.
- Terminal command parsing is a pure function in `lib/` (unit-testable).
- All content strings live in `data/`, not scattered through JSX.
- Every animation goes through shared primitives (`Reveal`, `TypedText`) that respect reduced motion.
- No new runtime dependencies without an ADR in DECISIONS.md.
- Lazy-load below-the-fold sections and the terminal.
