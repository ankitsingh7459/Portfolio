# Development Rules

## General
- Plain JavaScript/JSX (see ADR-003). Reuse existing components and helpers.
- Do not duplicate logic. Keep functions and components small.
- Do not modify unrelated files. Do not touch `backend/` unless a task says so.

## Before coding
- Read relevant docs (PRD, ARCHITECTURE, DESIGN, SECURITY, TEST_PLAN) and the existing implementation.
- Plan large changes first and wait for approval.

## UI
- Follow DESIGN.md exactly. Use tokens, never raw hex in components.
- Include loading, error, and empty states. Keep mobile responsive.
- Animations only via shared primitives and always respect reduced motion.

## Security
- Never expose secrets. Only public values use the `VITE_` prefix.
- Validate user input client and server side. Never render untrusted HTML (no `dangerouslySetInnerHTML`).
- External links: `rel="noopener noreferrer"`.

## Testing
- Add tests for important functionality. Run lint, build, and relevant tests after each task.
- Fix failing tests before continuing.

## Git
- Work on branch `redesign/warm-terminal`. One small commit per task, conventional messages.
- Never commit `.env`, `node_modules`, `dist`, logs, or tokens.

## Docs
- After each task update TASKS.md and docs/MEMORY.md. Record permanent decisions in DECISIONS.md.
