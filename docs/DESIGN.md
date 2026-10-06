# Design System: Warm Terminal

## Feel
Calm, precise, slightly nostalgic. A developer's terminal, not a sci-fi dashboard. Restraint over effects.

## Language
English.

## Colors (tokens in `styles/tokens.css`, Tailwind @theme)
- bg: #16140F
- surface: #1E1B15
- border: #2E2A21
- border-strong: #706654 (3.28:1 contrast for input and control boundaries against #16140F per WCAG 2.1 AA 1.4.11)
- text: #F1E9D2
- muted: #B9B09A
- accent (amber): #E8A33D (only links, active states, one primary button, cursor)
- on-accent: #16140F
- danger: #D9644A, success: #8FB573 (forms only)
No gradients. No glow. No blur/glass. No second accent color.

## Typography
- IBM Plex Mono: headings, labels, nav, prompts, tags
- IBM Plex Sans: paragraphs
- Self-host or `font-display: swap` with a real fallback stack. Preload only the weights used (400, 500, 600).
- Scale: h1 clamp(2rem, 6vw, 3.5rem); h2 1.25rem mono prompt; body 1rem/1.7.

## Shape and layout
- Radius max 2px, 1px borders, no shadows.
- Max content width 72rem, 12px baseline spacing grid.
- Project and log entries are bordered rows, not rounded cards.

## Section headings
Prompt style, e.g. `$ ls projects`, `$ cat about.txt`, `$ git log --oneline`, `$ mail ankit`. Typed once on first view.

## Motion spec
- Hero boot lines type once (no loop); block cursor blinks (steps(2), 1s).
- Section headings type once when 40% visible.
- Reveal: y 12px -> 0, opacity 0 -> 1, 0.45s ease-out, stagger 0.06s, once.
- Project row hover: amber ">" fades in, row x +4px, 200ms.
- Nav link: amber underline slides in, 200ms.
- Boot sequence is skippable (any key or click) and never blocks content readability.
- `prefers-reduced-motion`: no typing, no movement, content appears instantly.

## UX requirements
- Mobile first. Test 375 / 768 / 1440.
- Loading, empty, and error states for every data-driven section.
- Visible focus ring (2px amber outline, 2px offset) on every interactive element.
- Contrast AA minimum for all text.
- Forms: labelled inputs, inline errors, success confirmation.

## Copy rules (important: must not read as AI-written)
- First person, short, specific, plain words. Real names, real project facts.
- Owner role/title: [FILL: title].
- Banned: passionate, crafting, leverage, seamless, cutting-edge, intersection of, innovative solutions, journey, "I am a [adjective] [role]" openers, emoji in body copy.
- Placeholders: `[FILL: ...]`. Never fabricate. Keep `[FILL: ...]` placeholders out of public-facing website.
