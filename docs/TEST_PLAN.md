# Test Plan

## Hero
- Boot lines type once, skip with key/click, content readable immediately after.
- Reduced motion: everything visible instantly, no typing.

## Navigation
- Every nav link scrolls to the right section, active underline updates, keyboard accessible, visible focus.

## Projects
- Renders from API; renders fallback when API fails or times out.
- PrintAPM is first and featured. External links open safely.
- Empty and error states render.

## Case study
- Opens from project row and by direct URL; back works; no real numbers invented.

## Terminal
- `help`, `about`, `projects`, `stack`, `resume`, `contact`, `clear`, `whoami`, unknown command message; Tab completes; Up arrow history; no HTML injection from input.
- Mobile: terminal replaced by simple buttons.

## Command palette
- Ctrl/Cmd+K opens, Esc closes, arrow keys + Enter select, focus trapped and restored.

## Contact
- Empty/invalid email/too-long message show inline errors; valid submit shows success; API failure shows error; rate-limit response handled.

## Resume
- Preview opens, download works.

## Responsive
- 375, 768, 1440 with no horizontal scroll.

## Accessibility
- Keyboard-only full run, screen-reader landmarks, contrast AA, reduced motion.

## Admin
- `/admin` login and CRUD still work (smoke test).

## Performance
- Lighthouse mobile Perf >= 90, A11y >= 95, SEO >= 95; no console errors.

## Pre-deploy Checks
- Content placeholder check: run `npm run check:release` (`node scripts/check-release.mjs`) in `frontend`; verifies no `[FILL` placeholders exist in `src/`, `public/`, or `index.html`, and verifies no empty `href="#"` links exist in `src/`.
- Verify `grep -r "\[FILL" frontend/src frontend/public frontend/index.html` returns nothing.
- A section with no real content at release is removed from Home and the Navbar. No [FILL] may ship.

## Automation
- Unit: Vitest for `lib/terminalCommands`. E2E: Playwright for the flows above.
