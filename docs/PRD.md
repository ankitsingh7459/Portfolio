# Product Requirements Document

## Product
Ankit Singh personal portfolio (Warm Terminal redesign).

## Owner
Ankit Singh, [FILL: title].

## Problem
The current portfolio looks like a generic AI-made template (neon gradients, particles, 3D widgets), hides the strongest proof of work, and is heavier than it needs to be.

## Target users
1. Recruiters and hiring managers scanning for 60 seconds.
2. Engineers and founders evaluating technical depth.
3. Campus peers and potential collaborators.

## Goal
In under 30 seconds a visitor understands who I am, sees that I ship real software used daily (PrintAPM), and can contact me or open my resume.

## Copy language
English.

## Core features (MVP)
1. Hero with a one-time terminal boot sequence and a personal one-line intro.
2. Projects list (API-driven with local fallback). PrintAPM featured at the top.
3. PrintAPM case study (problem, solution, real stats, high-level architecture, key decisions, lessons, live link).
4. About, Stack (grouped plain list), Timeline and certifications styled as `git log`.
5. GitHub activity (restyled, lazy, fails gracefully).
6. Contact form (existing API) plus direct links.
7. Resume viewer/download.
8. Interactive terminal in hero (desktop) and Ctrl+K command palette.
9. SEO, social preview, accessibility, mobile layout.

## Out of scope (first version)
- Backend changes, new APIs, new database tables.
- Light theme, theme switcher.
- 3D, particles, custom cursor, loading screen, AI chatbot.
- Blog/CMS, i18n, TypeScript migration (see DECISIONS ADR-003).
- Easter eggs (optional Phase 9 stretch only).

## Success criteria
A visitor can: read the hero without waiting for animation, open PrintAPM case study, open any project's links, download resume, send a contact message and see success/error, navigate by keyboard, and use the site on a 375px phone.
Quality targets: Lighthouse mobile Performance >= 90, Accessibility >= 95, SEO >= 95; no console errors; production build passes.
