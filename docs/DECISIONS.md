# Architecture Decisions

- ADR-001: Theme = Warm Terminal. Reason: fits a CS developer, avoids the neon/glass look that reads as AI-generated.
- ADR-002: Keep React + Vite + Tailwind + Framer Motion and the existing Express backend. Reason: rebuild the UI layer only; zero backend risk.
- ADR-003: Stay on JavaScript (JSX), no TypeScript migration now. Reason: migration is scope creep; ESLint + tests are the safety net. Revisit after launch.
- ADR-004: Remove three.js stack, particles, cursor, loading screen, galaxy, chatbot. Reason: heavy, generic, hurts performance and credibility.
- ADR-005: Single dark theme, no toggle. Reason: theme is the identity.
- ADR-006: Terminal command parser is a pure function in `lib/`. Reason: testable without the DOM.
- ADR-007: Site renders from local fallback data when API is unavailable. Reason: Render free tier cold starts must not blank the page.
- ADR-008: PrintAPM case study shows high-level architecture only. Reason: no public security detail, endpoints, secrets, or audit findings.
- ADR-009: Home.jsx VisitorStats removal was a deliberate owner change, committed before TASK-004. Reason: Owner deliberately disabled public visitor statistics UI component to align with the streamlined redesign.
- ADR-010: Vitest and Testing Library for unit testing. Reason: Fast, native Vite integration, compatible with React 19 and JSDOM, verifies accessibility (.sr-only copy, focus targets), reduced motion, and interaction behavior without overhead.
- ADR-011: PrintAPM always prepended and featured in projects list. Reason: Ensures Ankit's flagship project with real production deployment and IoT hardware integration is prominently presented regardless of backend database state or API connectivity.
