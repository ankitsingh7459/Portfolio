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
- ADR-012: Empty section gating at release. Reason: A section with no real content at release is removed from Home and the Navbar. No [FILL] may ship.
- ADR-013: Direct open and download actions for resume, no embedded iframe. Reason: Embedded iframes provide a degraded, poorly scrollable experience on mobile devices and inconsistently support pinch-to-zoom across iOS and Android browsers. Direct open in a new tab (with rel="noopener noreferrer") and download attributes provide reliable, accessible document access across all viewports.
- ADR-014: axe-core devDependency for automated accessibility testing. Reason: Automated accessibility auditing via axe-core through headless Chrome CDP on key views and interactive states guarantees zero serious or critical WCAG 2.1 AA violations before release, with zero production bundle impact as a devDependency only.
- ADR-015: Client-side dynamic metadata via usePageMeta. Reason: As a pure single-page application (SPA) without server-side rendering (SSR) or prerendering, search and social link-preview crawlers inspect the initial static index.html head tags for all routes, while in-browser clients dynamically update page titles, descriptions, canonical links, and noindex directives on client route transitions.

